/**
 * ZiteBackJS Core Module
 * Core logic for web cloning, backup, analysis, and cleanup operations
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

class ZiteBackCore extends EventEmitter {
  constructor() {
    super();
    this.browser = null;
    this.isRunning = false;
  }

  /**
   * Log message and emit to listeners
   */
  log(message, level = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message
    };
    this.emit('log', logEntry);
    console.log(`[${level.toUpperCase()}] ${message}`);
  }

  /**
   * Initialize browser instance
   */
  async initBrowser() {
    if (!this.browser) {
      this.log('Initializing browser...');
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.log('Browser initialized successfully');
    }
    return this.browser;
  }

  /**
   * Close browser instance
   */
  async closeBrowser() {
    if (this.browser) {
      this.log('Closing browser...');
      await this.browser.close();
      this.browser = null;
      this.log('Browser closed');
    }
  }

  /**
   * Clone a website
   * @param {string} url - URL to clone
   * @param {string} outputDir - Output directory path
   * @param {Object} options - Cloning options
   */
  async clone(url, outputDir, options = {}) {
    this.isRunning = true;
    try {
      this.log(`Starting clone operation for: ${url}`);
      await this.initBrowser();
      
      const page = await this.browser.newPage();
      
      // Set viewport for responsive design
      await page.setViewport({ width: 1920, height: 1080 });
      
      this.log(`Navigating to ${url}...`);
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });
      
      this.log('Page loaded successfully');
      
      // Extract page content
      const content = await page.content();
      
      // Create output directory
      await fs.mkdir(outputDir, { recursive: true });
      
      // Save HTML content
      const htmlPath = path.join(outputDir, 'index.html');
      await fs.writeFile(htmlPath, content);
      this.log(`HTML saved to ${htmlPath}`);
      
      // Extract and save resources (images, CSS, JS)
      await this.extractResources(page, outputDir);
      
      await page.close();
      
      this.log('Clone operation completed successfully', 'success');
      this.emit('complete', { url, outputDir });
      
    } catch (error) {
      this.log(`Clone operation failed: ${error.message}`, 'error');
      this.emit('error', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Extract and save page resources
   */
  async extractResources(page, outputDir) {
    try {
      this.log('Extracting page resources...');
      
      // Get all resource URLs
      const resources = await page.evaluate(() => {
        const images = Array.from(document.images).map(img => img.src);
        const stylesheets = Array.from(document.styleSheets)
          .map(sheet => sheet.href)
          .filter(href => href);
        const scripts = Array.from(document.scripts)
          .map(script => script.src)
          .filter(src => src);
        
        return { images, stylesheets, scripts };
      });
      
      this.log(`Found ${resources.images.length} images, ${resources.stylesheets.length} stylesheets, ${resources.scripts.length} scripts`);
      
      // Create subdirectories
      const dirs = ['images', 'css', 'js'];
      for (const dir of dirs) {
        await fs.mkdir(path.join(outputDir, dir), { recursive: true });
      }
      
      this.log('Resources extraction completed');
      
    } catch (error) {
      this.log(`Resource extraction warning: ${error.message}`, 'warning');
    }
  }

  /**
   * Backup operation - clone with metadata
   */
  async backup(url, outputDir) {
    this.log(`Starting backup operation for: ${url}`);
    
    const backupDir = path.join(outputDir, `backup_${Date.now()}`);
    await this.clone(url, backupDir);
    
    // Save metadata
    const metadata = {
      url,
      timestamp: new Date().toISOString(),
      version: '5.0.3'
    };
    
    await fs.writeFile(
      path.join(backupDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    this.log('Backup completed with metadata', 'success');
    return backupDir;
  }

  /**
   * Analyze a website
   */
  async analyze(url) {
    this.isRunning = true;
    try {
      this.log(`Starting analysis for: ${url}`);
      await this.initBrowser();
      
      const page = await this.browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      const analysis = await page.evaluate(() => {
        return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content || 'N/A',
          images: document.images.length,
          links: document.links.length,
          scripts: document.scripts.length,
          stylesheets: document.styleSheets.length,
          bodySize: document.body ? document.body.innerHTML.length : 0
        };
      });
      
      await page.close();
      
      this.log('Analysis completed', 'success');
      this.log(`Title: ${analysis.title}`);
      this.log(`Images: ${analysis.images}, Links: ${analysis.links}`);
      
      this.emit('analysis', analysis);
      return analysis;
      
    } catch (error) {
      this.log(`Analysis failed: ${error.message}`, 'error');
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Clean old backups
   */
  async clean(directory, daysOld = 30) {
    this.log(`Cleaning backups older than ${daysOld} days in ${directory}`);
    
    try {
      const files = await fs.readdir(directory);
      const now = Date.now();
      const maxAge = daysOld * 24 * 60 * 60 * 1000;
      
      let cleaned = 0;
      for (const file of files) {
        if (file.startsWith('backup_')) {
          const filePath = path.join(directory, file);
          const stats = await fs.stat(filePath);
          
          if (now - stats.mtimeMs > maxAge) {
            await fs.rm(filePath, { recursive: true, force: true });
            cleaned++;
            this.log(`Removed old backup: ${file}`);
          }
        }
      }
      
      this.log(`Cleanup completed. Removed ${cleaned} old backups`, 'success');
      return cleaned;
      
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Stop current operation
   */
  async stop() {
    this.log('Stopping current operation...');
    this.isRunning = false;
    await this.closeBrowser();
  }
}

module.exports = ZiteBackCore;
