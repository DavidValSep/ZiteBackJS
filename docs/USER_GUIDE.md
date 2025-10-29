# ZiteBackJS Desktop - User Guide

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DavidValSep/ZiteBackJS.git
   cd ZiteBackJS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build CSS**
   ```bash
   npm run build:css
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## Interface Overview

The application interface consists of three main sections:

### 1. Header
- **Application Title**: ZiteBackJS v5.0.3 Desktop Edition
- **Theme Indicator**: Shows current theme (Light/Dark Mode)

### 2. Operations Panel
- **URL Input**: Enter the website URL you want to clone/backup/analyze
- **Output Directory**: Specify where to save the results
- **Action Buttons**:
  - **Clone**: Download and save complete website
  - **Backup**: Create timestamped backup with metadata
  - **Analyze**: Get website statistics and information
  - **Clean**: Remove old backups from directory
- **Stop Button**: Cancel ongoing operation

### 3. Activity Log
- Real-time display of all operations
- Color-coded messages:
  - **Gray**: Informational messages
  - **Green**: Success messages
  - **Yellow**: Warning messages
  - **Red**: Error messages
- **Clear Logs** button to reset the log display

## Operations Guide

### Clone Operation

**Purpose**: Creates a complete copy of a website including HTML, CSS, JavaScript, and images.

**Steps**:
1. Enter the website URL (e.g., `https://example.com`)
2. Enter output directory (e.g., `./clones/example`)
3. Click **Clone** button
4. Monitor progress in Activity Log
5. Check output directory for results

**Output Structure**:
```
output_directory/
├── index.html           # Main HTML file
├── images/              # Downloaded images
├── css/                 # Stylesheets
└── js/                  # JavaScript files
```

### Backup Operation

**Purpose**: Creates a timestamped backup with metadata for archival purposes.

**Steps**:
1. Enter the website URL
2. Enter base backup directory
3. Click **Backup** button
4. Backup will be saved in `backup_[timestamp]` subdirectory

**Output Structure**:
```
backup_directory/
└── backup_1698547200000/
    ├── index.html
    ├── metadata.json    # Backup information
    ├── images/
    ├── css/
    └── js/
```

**Metadata File**:
```json
{
  "url": "https://example.com",
  "timestamp": "2025-10-29T02:30:00.000Z",
  "version": "5.0.3"
}
```

### Analyze Operation

**Purpose**: Analyzes website structure and provides statistics without downloading.

**Steps**:
1. Enter the website URL
2. Click **Analyze** button
3. View results in Activity Log

**Analysis Includes**:
- Page title
- Meta description
- Number of images
- Number of links
- Number of scripts
- Number of stylesheets
- Body content size

**Example Output**:
```
=== Analysis Results ===
Title: Example Domain
Description: Example website
Images: 15
Links: 42
Scripts: 8
Stylesheets: 3
Body Size: 45231 bytes
=======================
```

### Clean Operation

**Purpose**: Removes old backups to free up disk space.

**Steps**:
1. Enter the directory containing backups
2. Click **Clean** button
3. Backups older than 30 days will be removed

**What Gets Cleaned**:
- Only directories starting with `backup_`
- Only if modification time is older than 30 days
- Other files/folders are left untouched

### Stop Operation

**Purpose**: Cancels currently running operation.

**Steps**:
1. Click **Stop Operation** button (red button at bottom)
2. Current operation will be interrupted
3. Browser will be closed
4. Partial results may remain in output directory

## Tips and Best practices

### URL Input
- Always include protocol (`https://` or `http://`)
- Valid examples:
  - `https://example.com`
  - `http://www.example.com/page.html`
  - `https://example.com:8080`

### Output Directory
- Use absolute paths: `/home/user/backups`
- Or relative paths: `./output` or `../backups`
- Directory will be created if it doesn't exist
- Make sure you have write permissions

### Performance
- Cloning large websites may take several minutes
- Monitor Activity Log for progress
- Don't close application while operation is running
- Use Stop button to cancel if needed

### Storage
- Each clone/backup requires disk space
- Use Clean operation regularly
- Check output directory size periodically

## Keyboard Shortcuts

Currently, the application uses mouse/click interactions. Future versions may include:
- `Ctrl/Cmd + S`: Start clone
- `Ctrl/Cmd + B`: Start backup
- `Ctrl/Cmd + A`: Start analyze
- `Ctrl/Cmd + L`: Clear logs
- `Escape`: Stop operation

## Troubleshooting

### "Clone operation failed"
- Check URL is valid and accessible
- Verify internet connection
- Check output directory permissions
- Some websites may block automated access

### "Browser initialization failed"
- Puppeteer/Chrome may not be installed
- Run: `PUPPETEER_SKIP_DOWNLOAD=false npm install`
- Check system requirements

### "Output directory error"
- Verify path is writable
- Check disk space available
- Use absolute path if relative path fails

### Application won't start
- Rebuild CSS: `npm run build:css`
- Check Node.js version (v16+ recommended)
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Advanced Usage

### Custom Core Usage

You can use the core module programmatically:

```javascript
const ZiteBackCore = require('./src/core/ZiteBackCore');

const core = new ZiteBackCore();

// Listen to events
core.on('log', (log) => console.log(log.message));

// Clone with custom options
await core.clone('https://example.com', './output', {
  // Future options
});

// Get analysis
const stats = await core.analyze('https://example.com');
console.log(stats);

// Clean up
await core.closeBrowser();
```

### Development Mode

Run in development mode with:
```bash
npm run dev
```

This enables:
- Developer tools in Electron
- More verbose logging
- Hot reload (future feature)

### CSS Development

Watch CSS changes:
```bash
npm run watch:css
```

This automatically rebuilds CSS when you edit `src/renderer/styles/input.css`.

## System Requirements

- **OS**: Windows, macOS, or Linux
- **Node.js**: v16.0.0 or higher
- **RAM**: 2GB minimum (4GB recommended)
- **Disk**: 500MB for application + space for clones/backups
- **Internet**: Required for cloning websites

## Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/DavidValSep/ZiteBackJS/issues
- Documentation: See `/docs` folder

## License

MIT License - see LICENSE file for details
