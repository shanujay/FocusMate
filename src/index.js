const { app, BrowserWindow, ipcMain } = require('electron'); // Added ipcMain
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({

    // Window Frame Size 
    width: 300,
    height: 300,

    // Stay Always on Top
    alwaysOnTop: true,

    // Removing the Frame
    frame: false,

    // Preventing Resize the Window
    resizable: false,
    fullscreenable: false,

    // App Icon
    icon: path.join(__dirname, "assets/Icon/icon.ico"),

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
    },
  });

  // load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Handle window control events
  ipcMain.on("window-minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.on("window-close", () => {
    mainWindow.close();
  });

  // Prevent the window from maximizing when double-clicked
  mainWindow.on("maximize", () => {
    mainWindow.unmaximize();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
