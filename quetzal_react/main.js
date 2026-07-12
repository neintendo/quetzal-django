import { app, BrowserWindow, screen } from "electron";

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 24, y: 16.5 },
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
  });

  win.loadURL("http://localhost:5173/home");
};

app.whenReady().then(() => {
  createWindow();
});
