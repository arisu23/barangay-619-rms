const { app, BrowserWindow } = require("electron");

const devServerUrl =
  process.env.ELECTRON_RENDERER_URL || "http://localhost:5173";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  win.loadURL(devServerUrl);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
