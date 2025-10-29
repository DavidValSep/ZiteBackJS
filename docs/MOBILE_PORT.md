# Mobile Port Guide for ZiteBackJS

This guide explains how to port the ZiteBackJS desktop application to mobile platforms.

## Architecture Benefits

ZiteBackJS was designed with mobile portability in mind:

✅ **Core module is completely portable** - No desktop dependencies
✅ **Event-driven architecture** - Works with any UI framework
✅ **Async/await pattern** - Native mobile support
✅ **Modular structure** - Easy to replace UI layer

## Core Module Compatibility

The `ZiteBackCore.js` module can run on:
- React Native
- Ionic/Capacitor
- Flutter (via JavaScript bridge)
- Native mobile apps (via JavaScript engine)

### No Changes Needed

The core module uses only:
- Node.js built-in modules (`fs`, `path`, `events`)
- Puppeteer (works in mobile environments)
- Standard JavaScript features

## Mobile Framework Options

### Option 1: React Native (Recommended)

**Pros**:
- JavaScript/TypeScript - same as desktop
- Large community and ecosystem
- Native performance
- Cross-platform (iOS + Android)

**Setup**:
```bash
npx react-native init ZiteBackMobile
cd ZiteBackMobile

# Install dependencies
npm install puppeteer-core
npm install events

# Copy core module
cp -r ../ZiteBackJS/src/core ./src/
```

**Integration Example**:
```javascript
// src/services/ZiteBackService.js
import ZiteBackCore from '../core/ZiteBackCore';

class ZiteBackService {
  constructor() {
    this.core = new ZiteBackCore();
    this.setupListeners();
  }

  setupListeners() {
    this.core.on('log', (log) => {
      // Forward to React state/context
      this.onLog?.(log);
    });
  }

  async clone(url, outputDir) {
    return await this.core.clone(url, outputDir);
  }
}

export default new ZiteBackService();
```

**UI Component**:
```javascript
// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Text } from 'react-native';
import ZiteBackService from '../services/ZiteBackService';

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    ZiteBackService.onLog = (log) => {
      setLogs(prev => [...prev, log]);
    };
  }, []);

  const handleClone = async () => {
    await ZiteBackService.clone(url, '/path/to/output');
  };

  return (
    <View>
      <TextInput 
        value={url} 
        onChangeText={setUrl}
        placeholder="Enter URL"
      />
      <Button title="Clone" onPress={handleClone} />
      <ScrollView>
        {logs.map((log, i) => (
          <Text key={i}>{log.message}</Text>
        ))}
      </ScrollView>
    </View>
  );
}
```

### Option 2: Ionic/Capacitor

**Pros**:
- Web technologies (HTML, CSS, JavaScript)
- Can reuse existing UI components
- Cross-platform
- Easy to adapt from Electron

**Setup**:
```bash
npm install -g @ionic/cli
ionic start ZiteBackMobile blank --type=react
cd ZiteBackMobile

# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init

# Copy core module
cp -r ../ZiteBackJS/src/core ./src/
```

**Integration**:
```typescript
// src/services/ziteback.service.ts
import ZiteBackCore from '../core/ZiteBackCore';

class ZiteBackService {
  private core: any;

  constructor() {
    this.core = new ZiteBackCore();
  }

  async clone(url: string, outputDir: string) {
    return await this.core.clone(url, outputDir);
  }

  on(event: string, callback: Function) {
    this.core.on(event, callback);
  }
}

export default new ZiteBackService();
```

**UI Component**:
```tsx
// src/pages/Home.tsx
import React, { useState } from 'react';
import { IonContent, IonButton, IonInput } from '@ionic/react';
import ZiteBackService from '../services/ziteback.service';

const Home: React.FC = () => {
  const [url, setUrl] = useState('');

  const handleClone = async () => {
    await ZiteBackService.clone(url, '/storage/backups');
  };

  return (
    <IonContent>
      <IonInput 
        value={url}
        onIonChange={e => setUrl(e.detail.value || '')}
        placeholder="Enter URL"
      />
      <IonButton onClick={handleClone}>Clone</IonButton>
    </IonContent>
  );
};
```

### Option 3: Flutter with JavaScript Bridge

**Pros**:
- Native performance
- Beautiful UI
- Cross-platform

**Cons**:
- Requires JavaScript bridge
- More complex integration

**Setup**:
```bash
flutter create ziteback_mobile
cd ziteback_mobile

# Add JavaScript engine
flutter pub add flutter_js
```

**Bridge Setup**:
```dart
// lib/services/ziteback_service.dart
import 'package:flutter_js/flutter_js.dart';

class ZiteBackService {
  late JavascriptRuntime jsRuntime;

  ZiteBackService() {
    jsRuntime = getJavascriptRuntime();
    // Load core module
    jsRuntime.evaluate(loadCoreModule());
  }

  Future<void> clone(String url, String outputDir) async {
    await jsRuntime.evaluate('''
      core.clone('$url', '$outputDir');
    ''');
  }
}
```

## File System Considerations

### Desktop (Electron)
```javascript
const path = require('path');
const outputDir = path.join(app.getPath('userData'), 'backups');
```

### Mobile (React Native)
```javascript
import RNFS from 'react-native-fs';
const outputDir = RNFS.DocumentDirectoryPath + '/backups';
```

### Mobile (Ionic)
```typescript
import { Filesystem, Directory } from '@capacitor/filesystem';
const outputDir = Directory.Documents + '/backups';
```

## Storage Locations

### iOS
- Documents: `~/Documents` (backed up by iCloud)
- Cache: `~/Library/Caches` (not backed up)

### Android
- Internal: `/data/data/[package]/files`
- External: `/sdcard/Android/data/[package]`

## Required Modifications

### 1. File System Module

Replace Node.js `fs` with mobile equivalent:

**React Native**:
```javascript
import RNFS from 'react-native-fs';

// Replace fs.writeFile
await RNFS.writeFile(path, content, 'utf8');

// Replace fs.mkdir
await RNFS.mkdir(path);
```

### 2. Path Module

Replace Node.js `path`:

**React Native**:
```javascript
// Instead of path.join
const joined = `${dir}/${file}`;

// Or use path-browserify
import path from 'path-browserify';
```

### 3. Puppeteer

Mobile requires `puppeteer-core` with custom Chrome:

```javascript
// Desktop
const puppeteer = require('puppeteer');

// Mobile
const puppeteer = require('puppeteer-core');
const browser = await puppeteer.launch({
  executablePath: '/path/to/chrome', // Platform-specific
});
```

## UI Adaptations

### Layout Changes

**Desktop**: Large screen, mouse interaction
```html
<div class="grid grid-cols-4 gap-3">
  <button>Clone</button>
  <button>Backup</button>
  <button>Analyze</button>
  <button>Clean</button>
</div>
```

**Mobile**: Small screen, touch interaction
```jsx
<View style={{ flexDirection: 'column' }}>
  <TouchableOpacity><Text>Clone</Text></TouchableOpacity>
  <TouchableOpacity><Text>Backup</Text></TouchableOpacity>
  <TouchableOpacity><Text>Analyze</Text></TouchableOpacity>
  <TouchableOpacity><Text>Clean</Text></TouchableOpacity>
</View>
```

### Theme System

**Desktop**: System theme via nativeTheme
```javascript
const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
```

**Mobile (React Native)**:
```javascript
import { useColorScheme } from 'react-native';
const theme = useColorScheme(); // 'light' or 'dark'
```

## Sample Mobile Project Structure

```
ZiteBackMobile/
├── src/
│   ├── core/                    # Copied from desktop
│   │   └── ZiteBackCore.js      # No changes needed!
│   ├── services/                # Mobile-specific bridges
│   │   └── ZiteBackService.js
│   ├── screens/                 # Mobile UI
│   │   ├── HomeScreen.js
│   │   ├── SettingsScreen.js
│   │   └── LogsScreen.js
│   ├── components/              # Reusable components
│   │   ├── URLInput.js
│   │   ├── ActionButtons.js
│   │   └── LogView.js
│   └── utils/                   # Mobile utilities
│       ├── storage.js
│       └── permissions.js
├── android/
├── ios/
└── package.json
```

## Migration Checklist

- [ ] Copy `src/core/ZiteBackCore.js` to mobile project
- [ ] Replace `fs` with mobile filesystem API
- [ ] Replace `path` with mobile path handling
- [ ] Update Puppeteer to mobile-compatible version
- [ ] Create mobile UI screens
- [ ] Implement service layer/bridge
- [ ] Handle mobile permissions (storage, network)
- [ ] Test core operations on device
- [ ] Add mobile-specific features
- [ ] Optimize for mobile performance

## Testing Strategy

1. **Unit Tests**: Test core module (same tests as desktop)
2. **Integration Tests**: Test service layer
3. **UI Tests**: Test mobile screens
4. **Device Tests**: Test on real devices
5. **Performance Tests**: Test with large websites

## Performance Optimization

### Mobile-Specific Optimizations

1. **Lazy Loading**: Load Puppeteer only when needed
2. **Background Tasks**: Use native background services
3. **Cache Management**: Limit cache size
4. **Network Optimization**: Check connection before operations
5. **Battery Management**: Warn user about battery usage

## Example: Complete React Native Screen

```javascript
// src/screens/CloneScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme
} from 'react-native';
import ZiteBackService from '../services/ZiteBackService';

export default function CloneScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [url, setUrl] = useState('https://example.com');
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    ZiteBackService.onLog = (log) => {
      setLogs(prev => [...prev, log]);
    };
  }, []);

  const handleClone = async () => {
    setIsRunning(true);
    try {
      await ZiteBackService.clone(url, '/storage/output');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        ZiteBackJS Mobile
      </Text>
      
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        value={url}
        onChangeText={setUrl}
        placeholder="Enter URL"
        placeholderTextColor={isDark ? '#888' : '#666'}
      />
      
      <TouchableOpacity
        style={[styles.button, isRunning && styles.buttonDisabled]}
        onPress={handleClone}
        disabled={isRunning}
      >
        <Text style={styles.buttonText}>
          {isRunning ? 'Cloning...' : 'Clone Website'}
        </Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.logs}>
        {logs.map((log, i) => (
          <Text 
            key={i} 
            style={[styles.log, styles[`log${log.level}`]]}
          >
            {log.message}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  titleDark: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: '#000',
  },
  inputDark: {
    borderColor: '#444',
    backgroundColor: '#2a2a2a',
    color: '#fff',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logs: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  log: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  loginfo: { color: '#666' },
  logsuccess: { color: '#22c55e' },
  logwarning: { color: '#f59e0b' },
  logerror: { color: '#ef4444' },
});
```

## Resources

- React Native: https://reactnative.dev/
- Ionic Framework: https://ionicframework.com/
- Capacitor: https://capacitorjs.com/
- Flutter: https://flutter.dev/
- React Native FS: https://github.com/itinance/react-native-fs
- Puppeteer: https://pptr.dev/

## Conclusion

The ZiteBackJS architecture makes mobile porting straightforward:
1. Core module works as-is
2. Replace filesystem and path utilities
3. Build native UI
4. Connect via service layer
5. Test and optimize

The hardest part is UI design - the core logic is already portable!
