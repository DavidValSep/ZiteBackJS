# ZiteBackJS v5.0.3 - Desktop Edition

🚀 Sistema revolucionario de clonado web inteligente con Puppeteer. Ideal para sitios con código dinámico SPA/React/Vue/Angular, imágenes retina, multilenguaje (6 idiomas, incluido Mapudungun y Русский), procesamiento universal de URLs, corrección automática de recursos y descarga completa. ¡Ideal para backups, migraciones y algunas cosillas más☠️!

## ✨ Features

- **Electron Desktop Application** with modern UI
- **Core Operations**:
  - 🔄 **Clone**: Clone entire websites with resources
  - 💾 **Backup**: Create timestamped backups with metadata
  - 📊 **Analyze**: Analyze website structure and content
  - 🧹 **Clean**: Remove old backups automatically
- **Real-time Activity Logs**: Monitor all operations in real-time
- **Dark/Light Mode**: Automatic system theme detection and switching
- **TailwindCSS Styling**: Modern, responsive UI
- **Modular Architecture**: Core logic separated for easy mobile port

## 🏗️ Architecture

The project is structured for maintainability and future mobile port:

```
ZiteBackJS/
├── src/
│   ├── core/               # Core business logic (portable)
│   │   └── ZiteBackCore.js # Main operations module
│   ├── electron/           # Desktop-specific code
│   │   ├── main.js         # Electron main process
│   │   └── preload.js      # Secure IPC bridge
│   └── renderer/           # UI layer
│       ├── index.html      # Main UI
│       ├── app.js          # UI logic
│       └── styles/         # TailwindCSS styles
├── package.json
└── tailwind.config.js
```

### Core Module (`ZiteBackCore.js`)

The core module is completely independent of Electron and can be used in:
- Node.js CLI applications
- Mobile applications (React Native, Ionic)
- Web workers
- Server-side operations

It provides:
- Event-based logging via EventEmitter
- Promise-based async operations
- No UI dependencies

## 📦 Installation

```bash
# Install dependencies
npm install

# Build CSS
npm run build:css
```

## 🚀 Usage

### Running the Desktop App

```bash
npm start
```

### Development Mode

```bash
# Watch CSS changes
npm run watch:css

# Run app in dev mode
npm run dev
```

## 🎨 Dark/Light Mode

The application automatically detects and follows your system theme preference:
- **macOS**: Uses System Preferences
- **Windows**: Uses Windows Settings
- **Linux**: Uses Desktop Environment settings

The theme switches automatically when you change your system theme.

## 🔧 Core API

The `ZiteBackCore` class can be used independently:

```javascript
const ZiteBackCore = require('./src/core/ZiteBackCore');

const core = new ZiteBackCore();

// Listen to logs
core.on('log', (logEntry) => {
  console.log(`[${logEntry.level}] ${logEntry.message}`);
});

// Clone a website
await core.clone('https://example.com', './output');

// Backup with metadata
await core.backup('https://example.com', './backups');

// Analyze a website
const analysis = await core.analyze('https://example.com');

// Clean old backups (older than 30 days)
await core.clean('./backups', 30);
```

## 📱 Future Mobile Port

The architecture is designed for easy mobile porting:

1. **Core Module**: Already portable, no modifications needed
2. **UI Layer**: Replace renderer with:
   - React Native components
   - Ionic/Capacitor
   - Flutter web view
3. **State Management**: Add Redux/MobX if needed
4. **Platform Bridge**: Replace Electron IPC with platform-specific bridges

## 🛠️ Technologies

- **Electron**: Desktop application framework
- **Puppeteer**: Web scraping and automation
- **TailwindCSS**: Utility-first CSS framework
- **Node.js**: JavaScript runtime

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ by DavidValSep
