const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const core = require('./src/core');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'ZiteBackJS v5.0.3'
  });

  mainWindow.loadFile('gui.html');

  // Abrir DevTools en modo desarrollo
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers para comunicación con el renderer
ipcMain.handle('clone-website', async (event, options) => {
  try {
    const result = await core.cloneWebsite(options);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-zip', async (event, sourcePath, outputPath) => {
  try {
    const result = await core.createZip(sourcePath, outputPath);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-temp-folder', async (event, folderPath) => {
  try {
    await core.deleteTempFolder(folderPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
