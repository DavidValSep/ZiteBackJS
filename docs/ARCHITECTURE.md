# ZiteBackJS Desktop Application - Technical Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────┐         ┌─────────────────────┐    │
│  │   Main Process     │◄───────►│  Renderer Process   │    │
│  │   (main.js)        │   IPC   │  (index.html +      │    │
│  │                    │         │   app.js)           │    │
│  └────────┬───────────┘         └─────────────────────┘    │
│           │                                                  │
│           │ Uses                                            │
│           ▼                                                  │
│  ┌────────────────────┐                                     │
│  │   Core Module      │                                     │
│  │  (ZiteBackCore)    │                                     │
│  │                    │                                     │
│  │  - clone()         │                                     │
│  │  - backup()        │                                     │
│  │  - analyze()       │                                     │
│  │  - clean()         │                                     │
│  └────────┬───────────┘                                     │
│           │                                                  │
│           │ Uses                                            │
│           ▼                                                  │
│  ┌────────────────────┐                                     │
│  │    Puppeteer       │                                     │
│  │  (Web Automation)  │                                     │
│  └────────────────────┘                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Main Process (src/electron/main.js)
- Creates and manages the application window
- Handles IPC communication between processes
- Integrates with ZiteBackCore
- Manages system theme detection
- **Key Features**:
  - Window lifecycle management
  - Event forwarding from core to renderer
  - Secure IPC handlers

### 2. Preload Script (src/electron/preload.js)
- Provides secure bridge between main and renderer processes
- Exposes limited API via contextBridge
- Ensures security through context isolation
- **Exposed API**:
  - clone, backup, analyze, clean, stop operations
  - Theme management
  - Event listeners for logs and results

### 3. Renderer Process (src/renderer/)
- User interface layer
- Real-time log display
- Operation controls
- Theme switching
- **Components**:
  - `index.html`: Main UI structure
  - `app.js`: UI logic and event handling
  - `styles/`: TailwindCSS styling

### 4. Core Module (src/core/ZiteBackCore.js)
- **Completely portable** - no Electron dependencies
- Can be used in Node.js, CLI, mobile apps
- Event-driven architecture
- **Operations**:
  - `clone()`: Clone website with resources
  - `backup()`: Create timestamped backup with metadata
  - `analyze()`: Analyze website structure
  - `clean()`: Remove old backups
  - `stop()`: Cancel current operation

## Data Flow

### Clone Operation Example

```
User clicks "Clone" button
         │
         ▼
app.js: handleClone()
         │
         ▼
electronAPI.clone() (via preload.js)
         │
         ▼
IPC: 'clone' event to main process
         │
         ▼
main.js: IPC handler
         │
         ▼
core.clone(url, outputDir)
         │
         ├─► core.log() → emit 'log' event
         │                     │
         │                     ▼
         │               main.js forwards to renderer
         │                     │
         │                     ▼
         │               app.js: addLog()
         │                     │
         │                     ▼
         │               UI updates logs
         │
         └─► Operation completes → emit 'complete' event
                                         │
                                         ▼
                                   main.js forwards to renderer
                                         │
                                         ▼
                                   app.js: show notification
```

## Theme System

The application supports automatic dark/light mode switching:

```
System Theme Changes
         │
         ▼
nativeTheme.updated event
         │
         ▼
main.js: detect theme change
         │
         ▼
Send 'theme-changed' to renderer
         │
         ▼
app.js: applyTheme()
         │
         ▼
Toggle 'dark' class on document
         │
         ▼
TailwindCSS applies theme styles
```

## Styling System

Using TailwindCSS with custom components:
- `btn`: Base button style
- `btn-primary`: Primary action buttons
- `btn-secondary`: Secondary action buttons
- `btn-danger`: Destructive actions
- `card`: Container for content sections
- `input`: Styled form inputs
- `log-entry`: Log message styling
- `log-{level}`: Level-specific colors

## Security Features

1. **Context Isolation**: Renderer process is isolated
2. **No Node Integration**: Renderer doesn't have direct Node.js access
3. **Secure IPC**: All communication through preload bridge
4. **Limited API**: Only necessary methods exposed to renderer

## Mobile Port Strategy

The architecture supports easy mobile porting:

### What to Keep
- `src/core/ZiteBackCore.js` - No changes needed
- Core logic and algorithms
- Event-based architecture

### What to Replace
- Electron → React Native / Ionic / Flutter
- IPC → Platform bridges
- `src/renderer/` → Mobile UI components
- `main.js` → Mobile app entry point

### Migration Path
1. Keep core module as-is
2. Create mobile UI in chosen framework
3. Connect UI to core via platform bridge
4. Test operations on mobile device
5. Add mobile-specific features (camera, geolocation)

## File Structure

```
ZiteBackJS/
├── src/
│   ├── core/                    # Portable core logic
│   │   └── ZiteBackCore.js      # Main operations (PORTABLE)
│   ├── electron/                # Desktop-specific
│   │   ├── main.js              # Main process
│   │   └── preload.js           # IPC bridge
│   └── renderer/                # UI layer
│       ├── index.html           # Main UI
│       ├── app.js               # UI logic
│       └── styles/
│           ├── input.css        # TailwindCSS source
│           └── output.css       # Generated CSS (ignored)
├── test/
│   └── validate-core.js         # Core validation tests
├── package.json
├── tailwind.config.js
├── .gitignore
└── README.md
```

## Performance Considerations

- **Puppeteer**: Runs in separate process, doesn't block UI
- **Async Operations**: All operations are promise-based
- **Event Streaming**: Real-time logs via EventEmitter
- **Resource Management**: Browser instances properly cleaned up

## Error Handling

All operations include comprehensive error handling:
1. Try-catch blocks in all async operations
2. Error events emitted to UI
3. User-friendly error messages
4. Graceful degradation
5. Cleanup on errors

## Future Enhancements

Potential additions:
- Progress bars for operations
- Scheduled backups
- Multi-language support in UI
- Export/import configurations
- Batch operations
- Cloud storage integration
- Mobile companion app
