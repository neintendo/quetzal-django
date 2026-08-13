// * I used https://ivanyu2021.hashnode.dev/electron-django-part-2-package-it-to-production
// and Claude AI to help me package the backend & frontend to production *

import { app, BrowserWindow, screen } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import treeKill from "tree-kill";
import fs from "fs";
import crypto from "crypto";
import { kill } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let djangoProcess = null;

const isDevelopmentEnv = () => {
  return !app.isPackaged;
};

const getUserDataDir = () => {
  // e.g. ~/Library/Application Support/quetzal_react
  const dir = app.getPath("userData");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const getOrCreateSecretKey = (dbDir) => {
  const keyPath = path.join(dbDir, ".secret_key");
  if (fs.existsSync(keyPath)) {
    return fs.readFileSync(keyPath, "utf-8").trim();
  }
  const key = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(keyPath, key, { mode: 0o600 });
  return key;
};

// Resolves the executable + base args + env needed to run Django commands,
// without actually spawning anything. Shared by migrations and runserver.
const resolveDjangoCommand = () => {
  const dbDir = getUserDataDir();
  const secretKey = getOrCreateSecretKey(dbDir);
  const env = { ...process.env, QUETZAL_DB_DIR: dbDir, SECRET_KEY: secretKey };

  if (isDevelopmentEnv()) {
    const pythonPath = path.join(__dirname, "..", "quetzal.venv", "bin", "python3");
    const managePyPath = path.join(__dirname, "..", "manage.py");
    return { exe: pythonPath, baseArgs: [managePyPath], env };
  }

  // Production: run the PyInstaller-built binary copied in by afterExtract.cjs.
  // afterExtract copies dist/quetzal_django into <extractPath>/Electron.app/Contents/Resources/python.
  const exeDir = path.join(
    path.dirname(app.getPath("exe")),
    "..",
    "Resources",
    "python",
  );
  const exePath = path.join(exeDir, "quetzal_django");

  return { exe: exePath, baseArgs: [], env };
};

const runMigrations = (exe, baseArgs, env) => {
  return new Promise((resolve, reject) => {
    const migrateArgs = isDevelopmentEnv()
      ? [...baseArgs, "migrate", "--noinput"]
      : [...baseArgs, "migrate", "--settings=quetzal.settings.prod", "--noinput"];

    const proc = spawn(exe, migrateArgs, { env });
    proc.stdout.on("data", (d) => console.log(`migrate stdout: ${d}`));
    proc.stderr.on("data", (d) => console.log(`migrate stderr: ${d}`));
    proc.on("error", (err) => reject(err));
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`migrate exited with code ${code}`));
    });
  });
};

const spawnDjango = (exe, baseArgs, env) => {
  const runserverArgs = isDevelopmentEnv()
    ? [...baseArgs, "runserver", "--noreload"]
    : [...baseArgs, "runserver", "--settings=quetzal.settings.prod", "--noreload"];

  return spawn(exe, runserverArgs, { env });
};

const startDjangoServer = async () => {
  const { exe, baseArgs, env } = resolveDjangoCommand();

  try {
    console.log("Running migrations...");
    await runMigrations(exe, baseArgs, env);
    console.log("Migrations complete.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    // Continue anyway — runserver will surface its own error if the DB is truly broken,
    // and we don't want a migration hiccup to prevent the app from launching at all.
  }

  djangoProcess = spawnDjango(exe, baseArgs, env);

  djangoProcess.stdout.on("data", (data) => {
    console.log(`stdout:\n${data}`);
  });
  djangoProcess.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });
  djangoProcess.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });
  djangoProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return djangoProcess;
};

const upsertKeyValue = (obj, keyToChange, value) => {
  const keyToChangeLower = keyToChange.toLowerCase();
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === keyToChangeLower) {
      obj[key] = value;
      return;
    }
  }
  obj[keyToChange] = value;
};

const createWindow = async () => {
  await startDjangoServer();

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 24, y: 16.5 },
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
  });

  win.setMinimumSize(width / 2, height / 1.5);

  win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    const { requestHeaders } = details;
    upsertKeyValue(requestHeaders, "Access-Control-Allow-Origin", ["*"]);
    callback({ requestHeaders });
  });

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details;
    upsertKeyValue(responseHeaders, "Access-Control-Allow-Origin", ["*"]);
    upsertKeyValue(responseHeaders, "Access-Control-Allow-Headers", ["*"]);
    callback({ responseHeaders });
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "dist", "index.html"), {
      hash: "/home",
    });
  } else {
    win.loadURL("http://localhost:5173/home");
  }

  if (isDevelopmentEnv()) {
    win.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
  kill(djangoProcess.pid);
});

app.on("before-quit", async function () {
  kill(djangoProcess.pid);
});
