import { app, BrowserWindow, screen } from "electron";

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
  });

  win.loadURL("http://localhost:5173/home");
};

app.whenReady().then(() => {
  createWindow();
});
