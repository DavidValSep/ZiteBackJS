/**
 * Renderer Process - UI Logic
 */

// DOM Elements
const urlInput = document.getElementById('url-input');
const outputInput = document.getElementById('output-input');
const btnClone = document.getElementById('btn-clone');
const btnBackup = document.getElementById('btn-backup');
const btnAnalyze = document.getElementById('btn-analyze');
const btnClean = document.getElementById('btn-clean');
const btnStop = document.getElementById('btn-stop');
const btnClearLogs = document.getElementById('btn-clear-logs');
const logsContent = document.getElementById('logs-content');
const themeIndicator = document.getElementById('theme-indicator');

// State
let isOperating = false;

/**
 * Initialize the application
 */
async function init() {
  // Set initial theme
  const theme = await window.electronAPI.getTheme();
  applyTheme(theme);
  
  // Set up event listeners
  setupEventListeners();
  
  // Log app started
  addLog('Application started', 'info');
  addLog('Ready for operations', 'success');
}

/**
 * Apply theme to document
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    themeIndicator.textContent = 'Dark Mode';
  } else {
    document.documentElement.classList.remove('dark');
    themeIndicator.textContent = 'Light Mode';
  }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Button clicks
  btnClone.addEventListener('click', handleClone);
  btnBackup.addEventListener('click', handleBackup);
  btnAnalyze.addEventListener('click', handleAnalyze);
  btnClean.addEventListener('click', handleClean);
  btnStop.addEventListener('click', handleStop);
  btnClearLogs.addEventListener('click', clearLogs);
  
  // IPC listeners
  window.electronAPI.onLog((logEntry) => {
    addLog(logEntry.message, logEntry.level);
  });
  
  window.electronAPI.onThemeChanged((theme) => {
    applyTheme(theme);
  });
  
  window.electronAPI.onOperationComplete((data) => {
    setOperating(false);
    showNotification('Operation completed successfully!', 'success');
  });
  
  window.electronAPI.onAnalysisResult((data) => {
    showAnalysisResults(data);
  });
  
  window.electronAPI.onOperationError((data) => {
    setOperating(false);
    showNotification('Operation failed: ' + data.message, 'error');
  });
}

/**
 * Handle clone operation
 */
async function handleClone() {
  const url = urlInput.value.trim();
  const outputDir = outputInput.value.trim();
  
  if (!url || !outputDir) {
    showNotification('Please enter URL and output directory', 'error');
    return;
  }
  
  setOperating(true);
  addLog(`Starting clone: ${url}`, 'info');
  
  const result = await window.electronAPI.clone(url, outputDir, {});
  
  if (!result.success) {
    addLog(`Clone failed: ${result.error}`, 'error');
    setOperating(false);
  }
}

/**
 * Handle backup operation
 */
async function handleBackup() {
  const url = urlInput.value.trim();
  const outputDir = outputInput.value.trim();
  
  if (!url || !outputDir) {
    showNotification('Please enter URL and output directory', 'error');
    return;
  }
  
  setOperating(true);
  addLog(`Starting backup: ${url}`, 'info');
  
  const result = await window.electronAPI.backup(url, outputDir);
  
  if (!result.success) {
    addLog(`Backup failed: ${result.error}`, 'error');
    setOperating(false);
  } else {
    addLog(`Backup saved to: ${result.backupDir}`, 'success');
  }
}

/**
 * Handle analyze operation
 */
async function handleAnalyze() {
  const url = urlInput.value.trim();
  
  if (!url) {
    showNotification('Please enter URL', 'error');
    return;
  }
  
  setOperating(true);
  addLog(`Starting analysis: ${url}`, 'info');
  
  const result = await window.electronAPI.analyze(url);
  
  if (!result.success) {
    addLog(`Analysis failed: ${result.error}`, 'error');
    setOperating(false);
  }
}

/**
 * Handle clean operation
 */
async function handleClean() {
  const outputDir = outputInput.value.trim();
  
  if (!outputDir) {
    showNotification('Please enter output directory', 'error');
    return;
  }
  
  const daysOld = 30; // Default to 30 days
  
  setOperating(true);
  addLog(`Starting cleanup: ${outputDir}`, 'info');
  
  const result = await window.electronAPI.clean(outputDir, daysOld);
  
  if (!result.success) {
    addLog(`Clean failed: ${result.error}`, 'error');
  } else {
    addLog(`Cleaned ${result.cleaned} old backups`, 'success');
  }
  
  setOperating(false);
}

/**
 * Handle stop operation
 */
async function handleStop() {
  addLog('Stopping operation...', 'warning');
  
  const result = await window.electronAPI.stop();
  
  if (result.success) {
    addLog('Operation stopped', 'warning');
    setOperating(false);
  }
}

/**
 * Show analysis results
 */
function showAnalysisResults(data) {
  addLog('=== Analysis Results ===', 'success');
  addLog(`Title: ${data.title}`, 'info');
  addLog(`Description: ${data.description}`, 'info');
  addLog(`Images: ${data.images}`, 'info');
  addLog(`Links: ${data.links}`, 'info');
  addLog(`Scripts: ${data.scripts}`, 'info');
  addLog(`Stylesheets: ${data.stylesheets}`, 'info');
  addLog(`Body Size: ${data.bodySize} bytes`, 'info');
  addLog('=======================', 'success');
}

/**
 * Add log entry to UI
 */
function addLog(message, level = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry log-${level}`;
  logEntry.textContent = `[${timestamp}] ${message}`;
  
  logsContent.appendChild(logEntry);
  
  // Auto-scroll to bottom
  logsContent.parentElement.scrollTop = logsContent.parentElement.scrollHeight;
}

/**
 * Clear all logs
 */
function clearLogs() {
  logsContent.innerHTML = '';
  addLog('Logs cleared', 'info');
}

/**
 * Set operating state
 */
function setOperating(operating) {
  isOperating = operating;
  
  // Disable/enable controls
  btnClone.disabled = operating;
  btnBackup.disabled = operating;
  btnAnalyze.disabled = operating;
  btnClean.disabled = operating;
  btnStop.disabled = !operating;
  urlInput.disabled = operating;
  outputInput.disabled = operating;
  
  // Update button styles
  if (operating) {
    btnClone.classList.add('opacity-50', 'cursor-not-allowed');
    btnBackup.classList.add('opacity-50', 'cursor-not-allowed');
    btnAnalyze.classList.add('opacity-50', 'cursor-not-allowed');
    btnClean.classList.add('opacity-50', 'cursor-not-allowed');
    btnStop.classList.remove('opacity-50', 'cursor-not-allowed');
  } else {
    btnClone.classList.remove('opacity-50', 'cursor-not-allowed');
    btnBackup.classList.remove('opacity-50', 'cursor-not-allowed');
    btnAnalyze.classList.remove('opacity-50', 'cursor-not-allowed');
    btnClean.classList.remove('opacity-50', 'cursor-not-allowed');
    btnStop.classList.add('opacity-50', 'cursor-not-allowed');
  }
}

/**
 * Show notification (simple log-based notification)
 */
function showNotification(message, level) {
  addLog(message, level);
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
