/**
 * Electron Preload Script
 * Exposes secure API to renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Core operations
  clone: (url, outputDir, options) => 
    ipcRenderer.invoke('clone', { url, outputDir, options }),
  
  backup: (url, outputDir) => 
    ipcRenderer.invoke('backup', { url, outputDir }),
  
  analyze: (url) => 
    ipcRenderer.invoke('analyze', { url }),
  
  clean: (directory, daysOld) => 
    ipcRenderer.invoke('clean', { directory, daysOld }),
  
  stop: () => 
    ipcRenderer.invoke('stop'),

  // Theme
  getTheme: () => 
    ipcRenderer.invoke('get-theme'),

  // Event listeners
  onLog: (callback) => {
    ipcRenderer.on('log', (event, logEntry) => callback(logEntry));
  },

  onThemeChanged: (callback) => {
    ipcRenderer.on('theme-changed', (event, theme) => callback(theme));
  },

  onOperationComplete: (callback) => {
    ipcRenderer.on('operation-complete', (event, data) => callback(data));
  },

  onAnalysisResult: (callback) => {
    ipcRenderer.on('analysis-result', (event, data) => callback(data));
  },

  onOperationError: (callback) => {
    ipcRenderer.on('operation-error', (event, data) => callback(data));
  }
});
