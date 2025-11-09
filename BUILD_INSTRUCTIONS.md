# Instrucciones de Compilación - Y2Back v3.1.0

## Requisitos Previos

### Software Necesario
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Git (opcional, para clonar el repo)

### Instalación de Requisitos

#### Linux (Fedora/RHEL/CentOS)
```bash
sudo dnf install nodejs npm
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm
```

#### macOS
```bash
brew install node
```

#### Windows
Descarga el instalador desde [nodejs.org](https://nodejs.org/)

---

## Compilación Rápida (Todo en Uno)

### Script Automático
Ejecuta el script `build-electron-all.sh` que compilará todo automáticamente:

```bash
./build-electron-all.sh
```

Este script:
1. Verifica dependencias (Node.js/npm)
2. Instala paquetes necesarios
3. Compila el frontend web (React/Vite)
4. Genera builds de Electron para:
   - 🐧 Linux (AppImage)
   - 🍎 macOS (DMG)
   - 🪟 Windows (Portable EXE)
5. Copia los builds a `web/public/downloads/`

### Resultado
Los archivos compilados estarán en:
- `dist/` — builds originales
- `web/public/downloads/` — listos para servir desde web

Nombres de archivo esperados:
- `Y2Back-3.1.0-linux-x64.AppImage`
- `Y2Back-3.1.0-mac-x64.dmg`
- `Y2Back-3.1.0-win-x64.exe`

---

## Compilación Manual (Paso a Paso)

### 1. Instalar Dependencias del Proyecto
```bash
npm install
```

### 2. Compilar Frontend Web
```bash
cd web
npm install
npm run build
cd ..
```

El frontend compilado estará en `web/dist/`

### 3. Compilar Apps Electron

#### Linux AppImage
```bash
npm run build:linux
```

#### macOS DMG
```bash
npm run build:mac
```

#### Windows Portable
```bash
npm run build:win
```

#### Todas las plataformas
```bash
npm run build:all
```

### 4. Copiar Builds al Directorio de Descargas Web
```bash
mkdir -p web/public/downloads
cp dist/*.AppImage web/public/downloads/ 2>/dev/null || true
cp dist/*.dmg web/public/downloads/ 2>/dev/null || true
cp dist/*.exe web/public/downloads/ 2>/dev/null || true
```

---

## Verificar Compilación

### Probar el Landing con Enlaces de Descarga
```bash
cd web
npm run preview
```

Luego abre: `http://localhost:4173/landing.html`

### Verificar Tamaño de Archivos
```bash
ls -lh dist/
ls -lh web/public/downloads/
```

---

## Bundles de Despliegue (API + Web)

### Generar Bundles para Servidor
```bash
./tools/build-deploy-bundle.sh
```

Esto crea:
- `dist/bundles/web-dist.tar.gz` (~1.4MB)
- `dist/bundles/y2back-api.tar.gz` (~129MB, incluye binarios)

---

## Solución de Problemas

### Error: "npm: command not found"
- Instala Node.js y npm según tu sistema operativo (ver arriba)

### Error: "electron-builder not found"
```bash
npm install
```

### Error de permisos al compilar
```bash
chmod +x build-electron-all.sh
chmod +x tools/build-deploy-bundle.sh
```

### macOS: Error de firma de código
Si compilas en Linux para macOS, el DMG no estará firmado. Para firmarlo:
- Compila en macOS nativo
- Configura certificados de desarrollador de Apple

### Windows: Build en Linux/Mac
electron-builder puede crear archivos .exe en Linux/macOS mediante wine.
Si falla, compila en Windows nativo.

---

## Configuración Avanzada

### Modificar Configuración de electron-builder
Edita `package.json`, sección `build`:

```json
"build": {
  "appId": "cl.susitio.y2back",
  "productName": "Y2Back",
  "asar": true,
  "win": {
    "target": ["portable"]
  },
  "linux": {
    "target": ["AppImage"]
  },
  "mac": {
    "target": ["dmg"],
    "category": "public.app-category.utilities"
  }
}
```

### Cambiar Versión
Edita `package.json`:
```json
"version": "3.1.0"
```

---

## Despliegue

### 1. Subir Builds a Servidor Web
```bash
# Copiar builds al servidor
scp dist/*.{AppImage,dmg,exe} user@server:/var/www/y2back/downloads/
```

### 2. Actualizar Landing
El archivo `web/public/landing.html` ya tiene los enlaces configurados:
- `/downloads/Y2Back-3.1.0-linux-x64.AppImage`
- `/downloads/Y2Back-3.1.0-mac-x64.dmg`
- `/downloads/Y2Back-3.1.0-win-x64.exe`

### 3. Deploy Web + API
Ver `DEPLOY_CPANEL.md` o `DEPLOY_LINUX.md` según tu entorno.

---

## Recursos

- **Documentación electron-builder**: https://www.electron.build/
- **Node.js**: https://nodejs.org/
- **Vite**: https://vitejs.dev/

---

**Desarrollado por DavidValSep** • [SuSitio.cl](https://susitio.cl)
