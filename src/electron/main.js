/**
 * Electron Main Process
 * Handles window creation, IPC communication, and core integration
 */

const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('path');
const ZiteBackCore = require('../core/ZiteBackCore');

let mainWindow;
let core;

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1a1a1a' : '#ffffff',
    show: false
  });

  // Load the renderer
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Initialize the core module
 */
function initCore() {
  core = new ZiteBackCore();

  // Forward core logs to renderer
  core.on('log', (logEntry) => {
    if (mainWindow) {
      mainWindow.webContents.send('log', logEntry);
    }
  });

  // Forward completion events
  core.on('complete', (data) => {
    if (mainWindow) {
      mainWindow.webContents.send('operation-complete', data);
    }
  });

  // Forward analysis results
  core.on('analysis', (data) => {
    if (mainWindow) {
      mainWindow.webContents.send('analysis-result', data);
    }
  });

  // Forward errors
  core.on('error', (error) => {
    if (mainWindow) {
      mainWindow.webContents.send('operation-error', { message: error.message });
    }
  });
}

/**
 * Set up IPC handlers
 */
function setupIPC() {
  // Clone operation
  ipcMain.handle('clone', async (event, { url, outputDir, options }) => {
    try {
      await core.clone(url, outputDir, options);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Backup operation
  ipcMain.handle('backup', async (event, { url, outputDir }) => {
    try {
      const result = await core.backup(url, outputDir);
      return { success: true, backupDir: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Analyze operation
  ipcMain.handle('analyze', async (event, { url }) => {
    try {
      const result = await core.analyze(url);
      return { success: true, analysis: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Clean operation
  ipcMain.handle('clean', async (event, { directory, daysOld }) => {
    try {
      const result = await core.clean(directory, daysOld);
      return { success: true, cleaned: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Stop operation
  ipcMain.handle('stop', async () => {
    try {
      await core.stop();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Get system theme
  ipcMain.handle('get-theme', () => {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  });

  // Theme changed
  nativeTheme.on('updated', () => {
    if (mainWindow) {
      mainWindow.webContents.send('theme-changed', 
        nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
      );
    }
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  initCore();
  setupIPC();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', async () => {
  if (core) {
    await core.closeBrowser();
  }
});
