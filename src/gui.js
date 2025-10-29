/**
 * gui.js - Lógica de la interfaz gráfica de ZiteBackJS v5.0.3
 * Maneja interacciones del usuario, flags, descarga de ZIP y logs dinámicos
 */

const { ipcRenderer } = require('electron');
const core = require('./src/core');
const path = require('path');
const fs = require('fs').promises;

// Estado global de la aplicación
const appState = {
  isProcessing: false,
  currentOutputDir: null,
  logs: [],
  flags: {
    headless: true,
    downloadResources: true,
    screenshot: true,
    waitUntil: 'networkidle2',
    timeout: 60000,
    waitTime: 0
  },
  darkMode: false
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  loadThemePreference();
  addLog('ZiteBackJS v5.0.3 iniciado correctamente', 'success');
});

/**
 * Inicializar la aplicación
 */
function initializeApp() {
  // Configurar callback de logs del core
  core.setLogCallback((logData) => {
    addLog(logData.message, logData.type);
  });

  // Cargar preferencias guardadas
  loadSavedFlags();

  // Mostrar fecha y hora actual
  updateDateTime();
  setInterval(updateDateTime, 1000);
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
  // Botón de descarga
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', handleDownload);
  }

  // Toggle de tema
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', toggleTheme);
  }

  // Checkboxes de flags
  const flagCheckboxes = document.querySelectorAll('.flag-checkbox');
  flagCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handleFlags);
  });

  // Input de URL - enter para iniciar descarga
  const urlInput = document.getElementById('urlInput');
  if (urlInput) {
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleDownload();
      }
    });
  }

  // Botón de limpiar logs
  const clearLogsBtn = document.getElementById('clearLogsBtn');
  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', clearLogs);
  }

  // Botón de eliminar carpeta temporal
  const deleteTempBtn = document.getElementById('deleteTempBtn');
  if (deleteTempBtn) {
    deleteTempBtn.addEventListener('click', deleteTempFolder);
  }
}

/**
 * Manejar cambios en los flags
 */
function handleFlags(event) {
  const checkbox = event.target;
  const flagName = checkbox.dataset.flag;
  const flagValue = checkbox.checked;

  appState.flags[flagName] = flagValue;
  
  addLog(`Flag "${flagName}" ${flagValue ? 'activado' : 'desactivado'}`, 'info');
  
  // Guardar preferencias
  saveFlagsPreferences();
}

/**
 * Manejar la entrada de URL
 */
function handleURL() {
  const urlInput = document.getElementById('urlInput');
  const url = urlInput.value.trim();

  if (!url) {
    addLog('Por favor, ingrese una URL válida', 'error');
    return null;
  }

  // Validar formato de URL
  try {
    new URL(url);
    addLog(`URL válida: ${url}`, 'success');
    return url;
  } catch (error) {
    addLog('URL inválida. Debe incluir protocolo (http:// o https://)', 'error');
    return null;
  }
}

/**
 * Función principal de descarga
 */
async function handleDownload() {
  if (appState.isProcessing) {
    addLog('Ya hay un proceso en ejecución', 'warning');
    return;
  }

  const url = handleURL();
  if (!url) return;

  // Actualizar UI
  setProcessingState(true);
  addLog('Iniciando proceso de clonado...', 'info');

  try {
    // Crear directorio de salida con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const outputDir = path.join(__dirname, 'output', `clone-${timestamp}`);
    appState.currentOutputDir = outputDir;

    // Opciones para el clonado
    const options = {
      url: url,
      outputDir: outputDir,
      flags: appState.flags
    };

    // Ejecutar clonado
    addLog('Clonando sitio web...', 'info');
    const result = await core.cloneWebsite(options);

    if (result.success) {
      addLog(`Clonado completado: ${result.files.length} archivos`, 'success');
      
      // Crear ZIP automáticamente
      await downloadZIP(outputDir);
    } else {
      throw new Error('Error en el clonado');
    }

  } catch (error) {
    addLog(`Error: ${error.message}`, 'error');
  } finally {
    setProcessingState(false);
  }
}

/**
 * Crear y descargar archivo ZIP
 */
async function downloadZIP(sourcePath) {
  addLog('Creando archivo ZIP...', 'info');

  try {
    const zipName = `${path.basename(sourcePath)}.zip`;
    const zipPath = path.join(__dirname, 'downloads', zipName);

    // Crear directorio de descargas si no existe
    await fs.mkdir(path.dirname(zipPath), { recursive: true });

    // Crear ZIP
    const result = await core.createZip(sourcePath, zipPath);

    if (result) {
      const sizeMB = (result.size / (1024 * 1024)).toFixed(2);
      addLog(`ZIP creado exitosamente: ${zipName} (${sizeMB} MB)`, 'success');
      addLog(`Ubicación: ${zipPath}`, 'info');
      
      // Mostrar botón para abrir la carpeta
      showOpenFolderButton(path.dirname(zipPath));
    }

  } catch (error) {
    addLog(`Error al crear ZIP: ${error.message}`, 'error');
  }
}

/**
 * Eliminar carpeta temporal
 */
async function deleteTempFolder() {
  if (!appState.currentOutputDir) {
    addLog('No hay carpeta temporal para eliminar', 'warning');
    return;
  }

  addLog(`Eliminando carpeta temporal: ${appState.currentOutputDir}`, 'info');

  try {
    await core.deleteTempFolder(appState.currentOutputDir);
    addLog('Carpeta temporal eliminada correctamente', 'success');
    appState.currentOutputDir = null;
    
    // Deshabilitar botón de eliminar
    const deleteTempBtn = document.getElementById('deleteTempBtn');
    if (deleteTempBtn) {
      deleteTempBtn.disabled = true;
    }
  } catch (error) {
    addLog(`Error al eliminar carpeta temporal: ${error.message}`, 'error');
  }
}

/**
 * Agregar log al panel de logs
 */
function addLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('es-ES');
  const logEntry = {
    message,
    type,
    timestamp
  };

  appState.logs.push(logEntry);

  // Mantener solo los últimos 100 logs
  if (appState.logs.length > 100) {
    appState.logs.shift();
  }

  // Actualizar UI
  updateLogsDisplay();
}

/**
 * Actualizar display de logs
 */
function updateLogsDisplay() {
  const logsContainer = document.getElementById('logsContainer');
  if (!logsContainer) return;

  // Crear elemento de log
  const lastLog = appState.logs[appState.logs.length - 1];
  const logElement = document.createElement('div');
  logElement.className = `log-item log-${lastLog.type} animate-slideIn`;
  logElement.innerHTML = `
    <span class="opacity-60">[${lastLog.timestamp}]</span> 
    <span>${lastLog.message}</span>
  `;

  logsContainer.appendChild(logElement);

  // Auto-scroll al final
  logsContainer.scrollTop = logsContainer.scrollHeight;

  // Limitar elementos en el DOM
  while (logsContainer.children.length > 100) {
    logsContainer.removeChild(logsContainer.firstChild);
  }
}

/**
 * Limpiar logs
 */
function clearLogs() {
  appState.logs = [];
  const logsContainer = document.getElementById('logsContainer');
  if (logsContainer) {
    logsContainer.innerHTML = '';
  }
  addLog('Logs limpiados', 'info');
}

/**
 * Cambiar tema (claro/oscuro)
 */
function toggleTheme() {
  appState.darkMode = !appState.darkMode;
  
  if (appState.darkMode) {
    document.documentElement.classList.add('dark');
    addLog('Tema oscuro activado', 'info');
  } else {
    document.documentElement.classList.remove('dark');
    addLog('Tema claro activado', 'info');
  }

  // Guardar preferencia
  localStorage.setItem('darkMode', appState.darkMode);
}

/**
 * Cargar preferencia de tema
 */
function loadThemePreference() {
  const savedDarkMode = localStorage.getItem('darkMode');
  
  if (savedDarkMode === 'true') {
    appState.darkMode = true;
    document.documentElement.classList.add('dark');
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.checked = true;
    }
  }
}

/**
 * Guardar preferencias de flags
 */
function saveFlagsPreferences() {
  localStorage.setItem('flags', JSON.stringify(appState.flags));
}

/**
 * Cargar preferencias guardadas de flags
 */
function loadSavedFlags() {
  const savedFlags = localStorage.getItem('flags');
  
  if (savedFlags) {
    try {
      appState.flags = JSON.parse(savedFlags);
      
      // Actualizar checkboxes en la UI
      Object.keys(appState.flags).forEach(flagName => {
        const checkbox = document.querySelector(`[data-flag="${flagName}"]`);
        if (checkbox) {
          checkbox.checked = appState.flags[flagName];
        }
      });
      
      addLog('Preferencias de flags cargadas', 'info');
    } catch (error) {
      addLog('Error al cargar preferencias', 'error');
    }
  }
}

/**
 * Actualizar estado de procesamiento
 */
function setProcessingState(isProcessing) {
  appState.isProcessing = isProcessing;
  
  const downloadBtn = document.getElementById('downloadBtn');
  const urlInput = document.getElementById('urlInput');
  const progressBar = document.getElementById('progressBar');
  
  if (downloadBtn) {
    downloadBtn.disabled = isProcessing;
    downloadBtn.textContent = isProcessing ? 'Procesando...' : 'Clonar Sitio Web';
    
    if (isProcessing) {
      downloadBtn.classList.add('pulse-active');
    } else {
      downloadBtn.classList.remove('pulse-active');
    }
  }
  
  if (urlInput) {
    urlInput.disabled = isProcessing;
  }
  
  if (progressBar) {
    progressBar.style.display = isProcessing ? 'block' : 'none';
  }

  // Habilitar botón de eliminar carpeta temporal si hay una carpeta
  const deleteTempBtn = document.getElementById('deleteTempBtn');
  if (deleteTempBtn && !isProcessing) {
    deleteTempBtn.disabled = !appState.currentOutputDir;
  }
}

/**
 * Mostrar botón para abrir carpeta
 */
function showOpenFolderButton(folderPath) {
  const { shell } = require('electron');
  
  const openBtn = document.getElementById('openFolderBtn');
  if (openBtn) {
    openBtn.style.display = 'block';
    openBtn.onclick = () => {
      shell.openPath(folderPath);
      addLog(`Abriendo carpeta: ${folderPath}`, 'info');
    };
  }
}

/**
 * Actualizar fecha y hora
 */
function updateDateTime() {
  const dateTimeElement = document.getElementById('dateTime');
  if (dateTimeElement) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('es-ES');
    dateTimeElement.textContent = `${dateStr} - ${timeStr}`;
  }
}

// Exportar funciones para uso global
window.handleFlags = handleFlags;
window.handleURL = handleURL;
window.handleDownload = handleDownload;
window.downloadZIP = downloadZIP;
window.deleteTempFolder = deleteTempFolder;
window.toggleTheme = toggleTheme;
