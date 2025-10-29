const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const { createWriteStream } = require('fs');

/**
 * Módulo core de ZiteBackJS - Sistema de clonado web inteligente
 * Separado de la GUI para mantener modularidad
 */

class ZiteBackCore {
  constructor() {
    this.browser = null;
    this.page = null;
    this.logCallback = null;
  }

  setLogCallback(callback) {
    this.logCallback = callback;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    if (this.logCallback) {
      this.logCallback({ message, type, timestamp });
    }
  }

  async initBrowser(options = {}) {
    this.log('Inicializando navegador Puppeteer...');
    this.browser = await puppeteer.launch({
      headless: options.headless !== false ? 'new' : false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    this.log('Navegador inicializado correctamente');
  }

  async cloneWebsite(options) {
    const {
      url,
      outputDir = './output',
      flags = {}
    } = options;

    if (!url) {
      throw new Error('URL es requerida');
    }

    this.log(`Iniciando clonado de: ${url}`);

    try {
      // Inicializar navegador si no está activo
      if (!this.browser) {
        await this.initBrowser(flags);
      }

      // Crear directorio de salida
      await fs.mkdir(outputDir, { recursive: true });
      this.log(`Directorio de salida creado: ${outputDir}`);

      // Navegar a la URL
      this.log('Navegando a la URL...');
      await this.page.goto(url, {
        waitUntil: flags.waitUntil || 'networkidle2',
        timeout: flags.timeout || 60000
      });
      this.log('Página cargada exitosamente');

      // Esperar tiempo adicional si se especifica
      if (flags.waitTime) {
        this.log(`Esperando ${flags.waitTime}ms adicionales...`);
        await this.page.waitForTimeout(flags.waitTime);
      }

      // Obtener HTML
      this.log('Extrayendo HTML...');
      const html = await this.page.content();
      const htmlPath = path.join(outputDir, 'index.html');
      await fs.writeFile(htmlPath, html, 'utf-8');
      this.log(`HTML guardado: ${htmlPath}`);

      // Descargar recursos si está habilitado
      if (flags.downloadResources) {
        await this.downloadResources(outputDir);
      }

      // Capturar screenshot si está habilitado
      if (flags.screenshot) {
        this.log('Capturando screenshot...');
        const screenshotPath = path.join(outputDir, 'screenshot.png');
        await this.page.screenshot({
          path: screenshotPath,
          fullPage: true
        });
        this.log(`Screenshot guardado: ${screenshotPath}`);
      }

      this.log('Clonado completado exitosamente');

      return {
        success: true,
        outputDir,
        files: await fs.readdir(outputDir)
      };

    } catch (error) {
      this.log(`Error durante el clonado: ${error.message}`, 'error');
      throw error;
    }
  }

  async downloadResources(outputDir) {
    this.log('Descargando recursos (CSS, JS, imágenes)...');
    
    const resourcesDir = path.join(outputDir, 'resources');
    await fs.mkdir(resourcesDir, { recursive: true });

    // Obtener todos los recursos de la página
    const resources = await this.page.evaluate(() => {
      const urls = [];
      
      // CSS
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        urls.push({ type: 'css', url: link.href });
      });
      
      // JS
      document.querySelectorAll('script[src]').forEach(script => {
        urls.push({ type: 'js', url: script.src });
      });
      
      // Imágenes
      document.querySelectorAll('img[src]').forEach(img => {
        urls.push({ type: 'img', url: img.src });
      });

      return urls;
    });

    this.log(`Encontrados ${resources.length} recursos para descargar`);

    // Descargar cada recurso (simplificado)
    let downloaded = 0;
    for (const resource of resources.slice(0, 50)) { // Limitar a 50 recursos
      try {
        const response = await this.page.goto(resource.url, { waitUntil: 'networkidle2' });
        if (response && response.ok()) {
          downloaded++;
        }
      } catch (err) {
        // Ignorar errores de recursos individuales
      }
    }

    this.log(`${downloaded} recursos descargados`);
  }

  async createZip(sourcePath, outputPath) {
    this.log(`Creando archivo ZIP: ${outputPath}`);

    return new Promise((resolve, reject) => {
      const output = createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        this.log(`ZIP creado: ${archive.pointer()} bytes`);
        resolve({ path: outputPath, size: archive.pointer() });
      });

      archive.on('error', (err) => {
        this.log(`Error al crear ZIP: ${err.message}`, 'error');
        reject(err);
      });

      archive.pipe(output);
      archive.directory(sourcePath, false);
      archive.finalize();
    });
  }

  async deleteTempFolder(folderPath) {
    this.log(`Eliminando carpeta temporal: ${folderPath}`);
    try {
      await fs.rm(folderPath, { recursive: true, force: true });
      this.log('Carpeta temporal eliminada');
    } catch (error) {
      this.log(`Error al eliminar carpeta: ${error.message}`, 'error');
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      this.log('Cerrando navegador...');
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.log('Navegador cerrado');
    }
  }
}

// Singleton para usar en toda la aplicación
const coreInstance = new ZiteBackCore();

module.exports = {
  cloneWebsite: (options) => coreInstance.cloneWebsite(options),
  createZip: (sourcePath, outputPath) => coreInstance.createZip(sourcePath, outputPath),
  deleteTempFolder: (folderPath) => coreInstance.deleteTempFolder(folderPath),
  setLogCallback: (callback) => coreInstance.setLogCallback(callback),
  close: () => coreInstance.close()
};
