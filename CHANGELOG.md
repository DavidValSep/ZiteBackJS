# 📋 CHANGELOG - Y2Back

<p align="center">
  <img src="./logo.png" alt="Y2Back logo" width="200" />
</p>

Todos los cambios notables de este proyecto se documentan aquí. El formato está basado en Keep a Changelog y seguimos Versionado Semántico (SemVer).

Regla de orden: la versión más reciente aparece arriba. La historia empieza en 1.0.0 al final del documento y va subiendo versión por versión.

---

## 2025-11-09
# [3.4.2] - UI/UX Revolucionario & Integración cPanel
### Interfaz web profesional con 5 mejoras críticas + deployment en producción

#### 🎨 Mejoras de Interfaz Web (5 cambios UI/UX)

**1. ⚡ Persistencia con LocalStorage & Indicador ZIP**
- **LocalStorage**: Selecciones persisten entre recargas con clave `y2back-selected`
- **Indicador ZIP**: Icono 📦 + texto "(ZIP)" en botones cuando hay múltiples selecciones
- **UX mejorada**: Usuario no pierde selecciones al refrescar página
- **Implementación**: `useEffect` hook sincroniza estado con localStorage

**2. 🎨 Footer Responsive con Colores Temáticos**
- **Modo oscuro**: Color base `#cfcfcf` → hover `#ffffff`
- **Modo claro**: Color base `#c33` → hover `#cc3`
- **Aplicación**: Footer principal + landing page sincronizados
- **Accesibilidad**: Contraste mejorado en ambos temas

**3. 📐 Layout Optimizado - "Podrías tener suerte"**
- **Posición**: Movido al lado derecho del campo de búsqueda (inline)
- **Responsivo**: Ancho adaptativo 220-280px según viewport
- **Espacio**: Eliminado card duplicado en panel izquierdo
- **Resultado**: Interfaz más limpia y flujo visual mejorado

**4. 🖼️ Modal "Ver Ficha" con Imagen 40vw**
- **Tamaño imagen**: 40vw (mínimo 280px) con aspect ratio 16:9
- **Integración Wikipedia**: API ES para información de artistas
- **Diseño**: Imagen destacada + datos biográficos
- **Performance**: Carga lazy de imágenes

**5. 📥 Modal Descarga con Thumbnail & Controles**
- **Header mejorado**: Thumbnail 120x68px + título del video
- **Selectores**: Formato y calidad visibles en modal
- **Botones acción**: "Seleccionar todo" y "Limpiar" con spacing óptimo (marginTop: 12px)
- **UX consistente**: Estado visual claro en todas las interacciones

#### 📸 Landing Page Actualizado
- **Screenshot**: Captura de pantalla de producción añadida (139KB PNG)
- **Servicio**: Generado vía `image.thum.io/get/maxAge/12/width/1200`
- **URL**: Screenshot de `http://apiy2.susitio.cl` en vivo
- **Fallback**: `onerror` handler para carga robusta
- **Footer**: Colores sincronizados con aplicación principal

#### 🌐 Configuración de Entornos
- **web/.env.production**: `VITE_API_BASE=http://apiy2.susitio.cl`
- **.env.example**: Template con variables PORT, NODE_ENV, CORS_ORIGINS, binarios
- **.gitignore**: Actualizado con `.env*`, `.env.production`, `.env.*.local`
- **Separación**: Entornos dev/prod correctamente aislados

#### 🚀 Deployment en Producción
**Servidor Linux (Fedora) - Desarrollo:**
- Puerto configurado: 7770 (secuencia 7770-7779)
- Scripts multiplataforma: `deploy.sh`, `deploy-macos.sh`, `deploy.cmd`
- Binarios Linux: `yt-dlp`, `ffmpeg`, `ffprobe` con permisos ejecutables

**Servidor cPanel - Producción:**
- `app.js`: Entry point para Passenger/Node.js App
- Variables entorno: `PORT=3000`, `NODE_ENV=production`
- CORS configurado: Múltiples orígenes separados por comas
- API desplegada: `http://apiy2.susitio.cl` funcional y testeada

#### ✅ Pruebas Exitosas Documentadas
- **✓ Local (Fedora)**: http-server en puerto 7770 → 100% funcional
- **✓ Producción (cPanel)**: http://apiy2.susitio.cl → API respondiendo correctamente
- **✓ Frontend**: Build Vite exitoso (87 módulos, 268KB JS gzipped 85KB)
- **✓ Screenshot**: Generación automática vía thum.io → 139KB descargado
- **✓ CORS**: Conexión SPA → API remota sin errores
- **✓ Persistence**: LocalStorage funcionando en todos los navegadores

#### 📊 Archivos Modificados
- `web/src/App.jsx`: 5 mejoras UI/UX implementadas
- `web/src/styles.css`: Footer colors para dark/light themes
- `web/public/landing.html`: Footer + screenshot añadido
- `web/public/screenshot-app.png`: 139KB captura producción
- `web/.env.production`: Configuración API producción
- `.env.example`: Template variables entorno
- `.gitignore`: Exclusión archivos .env

#### 🔧 Build Details
- **Vite**: v5.4.21 con React 18.3.1
- **Output**: `index.html` (1.01 kB), CSS (21.41 kB), JS (267.99 kB)
- **Gzip**: CSS 4.69 kB, JS 85.00 kB
- **Módulos**: 87 transformados exitosamente
- **Assets**: Screenshot + landing copiados a dist/

---

## 2025-11-09
# [3.3.2] - Integración Servidores Linux con cPanel (Testing Exitoso)
### Deployment completo en hosting compartido cPanel validado en producción

#### 🌐 cPanel/Passenger Integration (PROBADO Y FUNCIONAL)
- **Setup Node.js**: Configuración vía interfaz cPanel completada
- **Application startup**: `app.js` como entry point para Passenger
- **Variables de entorno**: PORT, NODE_ENV, CORS_ORIGINS configurados
- **Binarios Linux**: yt-dlp, ffmpeg, ffprobe con permisos ejecutables
- **CORS funcional**: Múltiples orígenes separados por comas probados
- **API en vivo**: http://apiy2.susitio.cl respondiendo correctamente

#### 📦 Bundles de Deployment (VALIDADOS)
- **y2back-api.tar.gz** (129MB): Backend completo con binarios
- **web-dist.tar.gz** (1.4MB): Frontend SPA compilado
- **Instalación**: Extracción → npm install --production → Start
- **Sin node_modules**: Ahorro de espacio en transferencia
- **Ejemplos config**: Apache, Nginx, Systemd incluidos

#### 🔧 Variables de Entorno (IMPLEMENTADAS)
- `PORT`: 3000 (default), override automático por Passenger
- `NODE_ENV`: production (validado)
- `CORS_ORIGINS`: http://apiy2.susitio.cl,https://apiy2.susitio.cl
- `YTDLP_PATH` / `Y2B_YTDLP`: Auto-detección funcionando
- `FFMPEG_PATH` / `Y2B_FFMPEG`: Binarios locales detectados

#### ✅ Pruebas de Producción Exitosas
- **✓ Subida cPanel**: Bundle extraído sin errores
- **✓ npm install**: Dependencias instaladas correctamente
- **✓ Start Application**: Servidor iniciado vía Passenger
- **✓ Health check**: Endpoint `/api/health` respondiendo
- **✓ CORS**: SPA remoto conecta sin problemas
- **✓ yt-dlp**: Detección y ejecución correcta
- **✓ Logs**: Sin errores en stderr del servidor

#### 📚 Documentación Creada
- **DEPLOY_CPANEL.md**: Guía paso a paso validada
- **README_DEPLOY_QUICK.md**: Quick start incluido en bundle
- **Apache/Nginx**: Ejemplos de configuración actualizados
- **.env.example**: Template de variables de entorno

---

## 2025-11-09
# [3.2.2] - Integración Servidores Linux (Testing & Configuración)
### Soporte completo para deployment en servidores Linux dedicados/VPS
# [3.2.1] - Binarios Multiplataforma & Script de Deploy
### Soporte completo de binarios para Linux, Windows y macOS

#### 📦 Binarios Incluidos para Todos los Sistemas Operativos
**Tres conjuntos completos de binarios empaquetados:**

**Linux (archivos sin sufijo):**
- `yt-dlp` (12MB) - PyInstaller bundle para Linux x64
- `ffmpeg` (77MB) - FFmpeg compilado para Linux x64
- `ffprobe` (76MB) - FFprobe compilado para Linux x64

**macOS (sufijo `_macos`):**
- `yt-dlp_macos` (35MB) - PyInstaller bundle para macOS (Intel/Apple Silicon)
- `ffmpeg_macos` (77MB) - FFmpeg universal binary macOS
- `ffprobe_macos` (77MB) - FFprobe universal binary macOS

**Windows (sufijo `.exe`):**
- `yt-dlp.exe` - Ejecutable PyInstaller para Windows x64
- `ffmpeg.exe` - FFmpeg compilado para Windows x64
- `ffprobe.exe` - FFprobe compilado para Windows x64

#### 🚀 Script Interactivo de Deploy y Pruebas
**Nuevo archivo: `deploy-manager.js`**

Sistema interactivo para gestionar pruebas y deployment:

```bash
node deploy-manager.js
```

**Funcionalidades:**
- **Modo Pruebas**: Seleccionar entre navegador, Electron o ambos
- **Modo Deploy**: Detectar y configurar según SO del servidor (Linux/Windows/macOS)
- **Selección de binarios**: Automática según plataforma de destino
- **Validación previa**: Verificar existencia de binarios antes de deploy

**Flujo interactivo:**
1. ¿Pruebas o Deploy?
   - **Pruebas** → ¿Navegador, Electron o ambos?
   - **Deploy** → ¿Linux, Windows o macOS?
2. Configuración automática de rutas de binarios
3. Validación de archivos necesarios
4. Ejecución o preparación según modo

#### 🔧 Detección Automática de Binarios
- **Prioridad PATH**: Preferencia por binarios del sistema
- **Fallback local**: Uso de binarios empaquetados según plataforma
- **Validación existencia**: Verificación antes de ejecución
- **Permisos ejecutables**: Auto-detección y advertencias

#### 📊 Estructura de Binarios Actualizada
```
Y2BackJS/
├── yt-dlp              # Linux (12MB)
├── yt-dlp_macos        # macOS (35MB)
├── yt-dlp.exe          # Windows
├── ffmpeg              # Linux (77MB)
├── ffmpeg_macos        # macOS (77MB)
├── ffmpeg.exe          # Windows
├── ffprobe             # Linux (76MB)
├── ffprobe_macos       # macOS (77MB)
├── ffprobe.exe         # Windows
└── deploy-manager.js   # Script interactivo ✨ NUEVO
```

#### ✅ Compatibilidad Garantizada
- **Linux**: Ubuntu 18.04+, Fedora 30+, Debian 10+, CentOS 8+
- **macOS**: 10.14+ (Mojave), soporte Intel y Apple Silicon
- **Windows**: Windows 10+, Windows Server 2016+

#### 🎯 Casos de Uso del Deploy Manager
**Desarrollo local:**
```bash
node deploy-manager.js
> Pruebas
> Ambos (navegador + Electron)
```

**Preparar para servidor Linux:**
```bash
node deploy-manager.js
> Deploy
> Linux
# Valida yt-dlp, ffmpeg, ffprobe (sin sufijo)
```

**Preparar para servidor Windows:**
```bash
node deploy-manager.js
> Deploy
> Windows
# Valida yt-dlp.exe, ffmpeg.exe, ffprobe.exe
```

#### 📝 Mejoras de Documentación
- README actualizado con tabla de binarios por plataforma
- Guía de selección según servidor de destino
- Troubleshooting específico por sistema operativo

---

## 2025-11-09
# [3.2.2] - Deploy Manager Multiplataforma
### Scripts interactivos de gestión de pruebas y deployment

#### 🚀 Deploy Manager
- **Script multiplataforma**: Versiones para Windows (.cmd), Linux (.sh) y macOS (.sh)
- **Modo interactivo**: Cuestionario guiado para seleccionar acción
- **Modos disponibles**:
  - **Pruebas**: Navegador web, Electron GUI o ambos
  - **Deploy**: Selección de S.O. servidor (Linux/Windows/macOS)

#### 📋 Archivos creados
- `deploy.cmd` - Script para Windows (CMD/PowerShell)
- `deploy.sh` - Script para Linux (Bash)
- `deploy-macos.sh` - Script para macOS (Bash con compatibilidad)
- `deploy-cpanel.sh` - Script especializado para cPanel

#### 🎯 Flujo de uso
```bash
# Windows
deploy.cmd

# Linux
./deploy.sh

# macOS
./deploy-macos.sh

# cPanel (hosting compartido)
./deploy-cpanel.sh
```

#### ⚡ Características
- Detección automática de comandos disponibles
- Validación de entradas del usuario
- Mensajes de ayuda contextuales
- Preparación para futuras expansiones (build, bundle, upload)

#### 🔬 Deploy cPanel - Investigación y Desarrollo
- **Investigación**: Alternativas para hostings compartidos con cPanel que permiten administración de Node.js
- **Script especializado**: `deploy-cpanel.sh` con cuestionario para:
  - Generar bundle de deployment
  - Verificar requisitos del sistema
  - Mostrar instrucciones paso a paso para instalación en cPanel
- **Características cPanel**:
  - Soporte para Passenger (Application startup: app.js)
  - Configuración de variables de entorno
  - Gestión de binarios Linux (yt-dlp, ffmpeg, ffprobe)
  - Instrucciones detalladas de Setup Node.js App
- **Objetivo**: Facilitar deployment en hosting compartido económico sin necesidad de VPS

---

## 2025-11-08
# [3.2.0] - GUI v2.0.0 & Advanced Features
### GUI revolucionaria con vista previa instantánea y búsqueda avanzada

#### 🎨 GUI v2.0.0 - Vista Previa Instantánea
- **Vista previa instantánea**: Enlace directo a YouTube (WebView removida por exceso de publicidad)
- **Carga en segundo plano**: Metadatos se cargan en milisegundos sin bloquear UI
- **Interfaz moderna**: Diseño web responsivo con animaciones fluidas profesionales
- **Barras de progreso realistas**: Animaciones shimmer como páginas premium
- **UX profesional**: Hover effects, estados de carga y feedback visual inmediato
- **Layout responsivo**: División 30/70 optimizada para mejor experiencia
- **Flujo instantáneo**: Pegar URL → Video se muestra → Información en background → Descarga con un clic

#### 🔍 Búsqueda Avanzada con JSON
- **Flag `--search-json`**: Resultados estructurados para integraciones GUI/API
- **Flag `--limit`**: Controlar cantidad de resultados (1-50, default 10)
- **Datos completos**: id, title, duration, thumbnail, url, uploader por cada resultado
- **Integración GUI**: Tarjetas con miniaturas, acciones individuales y descarga masiva
- **Búsqueda interactiva mejorada**: Hasta 12 resultados con detalles completos

#### 📥 Descarga Masiva por Archivo
- **Flag `--file N`**: Crear/limpiar `descargas.txt` y solicitar N URLs válidas
- **Flag `--downfile`**: Descargar todas las URLs del archivo con opciones globales
- **Combinación flexible**: Compatible con `--all`, `--video`, `--music` y cualquier opción
- **Validación robusta**: Verificación de URLs antes de agregar al archivo
- **Batch processing**: Procesar lotes grandes con configuración unificada

#### ℹ️ Metadatos Rápidos sin Descarga
- **Flag `--info`**: Extraer metadatos JSON completos sin descargar contenido
- **Pre-validación**: Verificar disponibilidad antes de descargas pesadas
- **Integración GUI**: Pre-carga de información para preview instantáneo
- **Datos completos**: título, canal, duración, vistas, fecha, descripción, tags, formatos
- **Performance**: Respuesta en milisegundos vs minutos de descarga

#### ⚡ Accesos Directos Multiplataforma
- **Script `y2`**: Acceso directo Unix/Linux/macOS (`chmod +x y2`)
- **Script `y2.cmd`**: Acceso directo Windows CMD/PowerShell
- **Instalación global**: `sudo cp y2 /usr/local/bin/y2` para uso desde cualquier directorio
- **Compatibilidad total**: Misma funcionalidad que `node y2back.js`
- **Ejemplos rápidos**: `y2 --all dQw4w9WgXcQ`, `.\y2 --search "artista"`

#### 📊 Recursos Extraíbles - Documentación Completa
**VIDEO (-v, --video)**
- Formatos: MP4 (H.264), WebM (VP9), MKV, AVI, MOV
- Calidades: 8K (4320p), 4K (2160p), 2K (1440p), Full HD (1080p), HD (720p), SD (480p/360p/240p)
- Características: HDR, 60fps, subtítulos incrustados, múltiples pistas audio

**MUSIC (-m, --music)**
- Formatos: MP3 (128k-320k), FLAC (lossless), OGG, AAC (M4A), OPUS, WAV
- Calidades: 320kbps (máxima MP3), 256kbps, 192kbps, 128kbps, FLAC sin pérdida

**PICS (-p, --pics)**
- Formatos: JPG/JPEG, PNG, WEBP, AVIF
- Resoluciones: Original, 4K (3840×2160), 2K (2560×1440), Full HD (1920×1080), HD (1280×720)

**SUBTITLES (-s, --subtitles)**
- Formatos: SRT (más compatible), VTT (web), ASS/SSA (efectos), TTML
- Idiomas: Inglés, Español, Francés, Alemán, Italiano, Japonés y más según disponibilidad

**SCREENSHOTS (-c, --screenshots)**
- Formatos: PNG (sin pérdida), JPG (comprimido), WEBP (eficiente)
- Tipos: Automáticas cada X segundos, momentos clave, thumbnails múltiples

**METADATA (--meta)**
- JSON completo: título, canal, duración, vistas, fecha, descripción, tags
- Formatos disponibles y calidades máximas
- Subtítulos e idiomas disponibles
- URL original y estadísticas

#### 🎯 Tabla Completa de Flags (17 únicos)
**Modos de Descarga (8 flags):**
- `--video` / `-v`: Solo video
- `--music` / `-m`: Solo audio/música
- `--pics` / `-p`: Solo imágenes/thumbnails
- `--subtitles` / `-s`: Solo subtítulos
- `--screenshots` / `-c`: Capturas de pantalla
- `--meta` / `-M`: Solo metadatos
- `--all` / `-a`: Todo el contenido
- `--playlist` / `-P`: Modo playlist (legacy)

**Configuración (3 flags):**
- `--url` / `-u`: Especificar URL o ID
- `--quality` / `-q`: Calidad (240p-4320p, best, worst)
- `--format` / `-f`: Formato de salida

**Búsqueda (4 flags):**
- `--search` / `-S`: Búsqueda interactiva
- `--search-json`: Resultados JSON estructurados
- `--limit`: Límite de resultados (1-50)
- `--file N`: Crear archivo con N URLs
- `--downfile`: Descargar desde archivo

**Información (5 flags):**
- `--help` / `-h`: Ayuda completa
- `--version` / `-V`: Versión del sistema
- `--author` / `-A`: Info del desarrollador
- `--verify` / `-y`: Verificar integridad
- `--check` / `-k`: Verificar (alias)
- `--info`: Metadatos JSON sin descarga

#### 📁 Estructura de Archivos Mejorada
```
medios/
├── Video/           # Videos MP4/WebM/MKV
├── Music/           # Audio MP3/FLAC/OGG
├── Pics/            # Thumbnails e imágenes
├── Subtitles/       # Subtítulos SRT/VTT/ASS
├── Screenshots/     # Capturas de pantalla
└── Meta Info/       # Metadatos JSON completos
```

#### 🌐 URLs Soportadas
- Formatos válidos: `youtube.com/watch?v=ID`, `youtu.be/ID`, `youtube.com/embed/ID`
- Solo ID: `dQw4w9WgXcQ` (detectado automáticamente)
- Playlists: `youtube.com/playlist?list=...`
- Mobile: `m.youtube.com/watch?v=ID`
- Timestamps: Soporte para parámetro `&t=30s`

#### 💡 Casos de Uso Expandidos
- **Educación**: Preservación de conferencias con transcripciones
- **Música**: Backup personal con carátulas y metadatos
- **Video**: Archivo familiar con contexto completo
- **Profesional**: Marketing, producción, presentaciones corporativas

#### 🔧 Instalación Simplificada
- **Requisitos**: Node.js ≥18.0.0, npm ≥9.0.0
- **Instalación rápida**: `git clone → npm install → listo`
- **yt-dlp incluido**: Instalación automática de dependencias
- **Verificación**: Scripts de check automáticos

#### 🛑 Troubleshooting Windows
**Detener descargas activas en Windows:**
```powershell
taskkill /IM yt-dlp.exe /T /F
taskkill /IM ffmpeg.exe /T /F
```

#### 🧭 Historia del Proyecto
- **Origen**: Derivación de ZiteBackJS (v3.x→v5.x)
- **Filosofía**: "Disponibilidad primero" heredada de ZiteBackJS
- **Enfoque**: Automatización fiable, UX clara, resultados reproducibles
- **Plataformas**: Windows, macOS, Linux con experiencia unificada

#### 📝 Ejemplos de Uso Expandidos
```bash
# Búsqueda con resultados JSON
node y2back.js --search "Karol G" --search-json --limit 6

# Crear archivo con 5 URLs
node y2back.js --file 5

# Descargar todo desde archivo en alta calidad
node y2back.js --downfile --all --quality best

# Metadatos rápidos sin descarga
node y2back.js --info -u "dQw4w9WgXcQ"

# Acceso directo (Unix/Linux)
y2 --all dQw4w9WgXcQ
y2 --search "Bad Bunny"

# Acceso directo (Windows)
.\y2 --all dQw4w9WgXcQ
.\y2 --search "Karol G"
```

#### ✅ Valores por Defecto
- **Calidad de video**: 1080p (Full HD)
- **Formato de video**: mp4
- **Formato de audio**: mp3
- **Límite de búsqueda**: 10 resultados
- **Timeout búsqueda**: 60 segundos
- **Timeout info**: 30 segundos

---

## 2025-11-08
# [3.1.0] - Deployment Production & cPanel Support
### Soporte completo para hosting compartido y deployment en producción

#### 🚀 Deployment Features
- **Bundle de deployment completo**: Script `tools/build-deploy-bundle.sh` genera bundles listos para producción
  - `web-dist.tar.gz`: Frontend SPA compilado (React + Vite)
  - `y2back-api.tar.gz`: Backend API con binarios incluidos (yt-dlp, ffmpeg, ffprobe)
- **Soporte cPanel/Passenger**: Archivo `app.js` para compatibilidad con Passenger en hosting compartido
- **Binarios empaquetados**: yt-dlp, ffmpeg y ffprobe incluidos en bundle con permisos ejecutables (Linux/Windows)
- **Instalación portable**: Bundles autocontenidos listos para extraer y ejecutar

#### 🌐 CORS & Remote API
- **CORS configurable**: Variables de entorno `CORS_ORIGINS` o `Y2B_CORS_ORIGINS` para permitir SPAs en dominios externos
- **Múltiples orígenes**: Soporte para lista separada por comas (ej: `https://app1.com,https://app2.com`)
- **Wildcard seguro**: Opción `*` para desarrollo o APIs públicas
- **Preflight OPTIONS**: Manejo correcto de preflight CORS para todos los endpoints

#### 💻 Electron GUI Remote Support
- **Conexión API remota**: Flag `--remote` para conectar GUI a API en servidor externo
- **URL personalizada**: Flag `--url` y variable `Y2B_GUI_URL` para especificar servidor
- **Forzar remoto**: Variable `Y2B_FORCE_REMOTE` para siempre usar API externa
- **HTTPS support**: Detección y conexión segura a APIs con certificados SSL
- **Health check mejorado**: Verificación de disponibilidad de API antes de iniciar GUI

#### 🛠️ Sistema de Instalación Global
- **Scripts de enlace global**: `tools/link-global.sh` con flag `--parent` para instalación en directorio padre
- **Shims multiplataforma**: Wrappers `bin/y2`, `bin/y2back`, `bin/gui` compatibles Linux/macOS/Windows
- **Detección de runtime**: Preferencia por Node.js bundled, fallback a sistema
- **Bundle portable**: `tools/make-portable.sh` para crear instalaciones autocontenidas

#### 📝 API Improvements
- **Endpoint `/api/info`**: Retorna puerto, versión y NODE_ENV configurados
- **Logging mejorado**: Console.log muestra puerto y entorno al iniciar servidor
- **Puerto en `/api/health`**: Health check incluye puerto y configuración de entorno
- **Detección robusta de yt-dlp**: Soporte para instalaciones vía pip, binario local o PATH
- **FFmpeg opcional**: Funcionalidad completa sin FFmpeg (selección inteligente de formatos)

#### 🐛 Bug Fixes
- **Puppeteer eliminado**: Removido de dependencias de producción para evitar OOM en hosting compartido
- **Spawn sin shell**: Comandos yt-dlp ejecutados sin shell para evitar problemas con rutas con espacios
- **Detección de archivos**: Heurística mejorada para capturar archivos generados por yt-dlp
- **Error handling**: Manejo robusto de errores en búsquedas y descargas

#### 📦 Deployment Bundles Structure
```
y2back-api.tar.gz (129MB):
├── app.js                    # Passenger/cPanel entry point
├── api/
│   └── server.js            # Express API server
├── package.json             # Dependencies (sin Puppeteer)
├── yt-dlp                   # Binary Linux/Windows (executable)
├── ffmpeg                   # Binary Linux/Windows (executable)
├── ffprobe                  # Binary Linux/Windows (executable)
├── deploy/
│   ├── api-site/           # Apache/Nginx ejemplos
│   └── systemd/            # Systemd service template
└── README_DEPLOY_QUICK.md  # Quick start guide

web-dist.tar.gz (1.4MB):
└── [SPA compilado]         # index.html + assets
```

#### 🔧 Environment Variables Support
- `PORT`: Puerto del servidor (default: 3000, Passenger override automático)
- `NODE_ENV`: Entorno de ejecución (development/production)
- `CORS_ORIGINS` / `Y2B_CORS_ORIGINS`: Orígenes CORS permitidos
- `Y2B_FORCE_REMOTE`: Forzar GUI a usar API remota
- `Y2B_GUI_URL` / `Y2B_REMOTE_URL`: URL de API remota para GUI
- `YTDLP_PATH` / `Y2B_YTDLP`: Ruta personalizada a yt-dlp
- `FFMPEG_PATH` / `Y2B_FFMPEG`: Ruta personalizada a ffmpeg

#### 📚 Documentation
- **DEPLOY_CPANEL.md**: Guía paso a paso para hosting compartido con cPanel
- **README_DEPLOY_QUICK.md**: Quick start incluido en bundle
- Ejemplos de configuración Apache y Nginx actualizados
- Template systemd service para servidores dedicados/VPS

#### ✅ Compatibility
- **Hosting compartido**: cPanel con "Setup Node.js" (Passenger)
- **VPS/Dedicado**: Systemd, PM2, o ejecución directa
- **Local**: Development server con `npm run api`
- **Electron**: GUI standalone con API local o remota
- **Multiplataforma**: Linux, Windows, macOS (x64, arm64)

---

## 2025-11-03
# [3.0.1]
### Transición total a y2back.js como núcleo único
- Migración del proxy a un único binario: toda la lógica y CLI se consolidan en `y2back.js`.
- Refactor de argumentos y validaciones para mantenimiento simplificado y compatibilidad hacia atrás.
- Limpieza de dependencias y scripts obsoletos; actualización de ayuda y ejemplos.
- Pruebas de regresión multiplataforma (Windows, Linux, macOS) y revisión de seguridad básica.

#### Sincronización y herramientas (3.0.1)
- Alineación de versión a v3.0.1 en package.json, config.js, current-version.txt y README (título y badge).
- Ajustes a version-manager.js para evitar modificaciones peligrosas de CHANGELOG y actualizar README de forma segura.

#### Comandos CLI principales
- `y2back.js --video` / `-v`: Descarga de video en múltiples formatos y calidades.
- `y2back.js --music` / `-m`: Extracción de audio (MP3, FLAC, OGG, AAC, WAV).
- `y2back.js --pics` / `-p`: Thumbnails e imágenes.
- `y2back.js --subtitles` / `-s`: Subtítulos SRT/VTT/ASS.
- `y2back.js --screenshots` / `-c`: Capturas de pantalla.
- `y2back.js --meta` / `-M`: Metadatos JSON rápidos.
- `y2back.js --all` / `-a`: Todo el contenido disponible.
- `y2back.js --search` / `-S`: Búsqueda interactiva en YouTube.
- `y2back.js --help` / `-h`: Ayuda completa.
- `y2back.js --version` / `-V`: Versión del sistema.

#### Sistema Web
- Frontend React (Vite) con búsqueda, vista previa guiada y descargas conectadas a la API.
- API Express con endpoints para búsqueda, info y descargas, incluyendo SSE para logs.
- Layout responsivo 30/70 y compatibilidad Windows/Linux/macOS.

#### Aplicación multiplataforma (GUI)
- Lanzador `gui.js` y GUI Electron integrados con el core.
- Sincronización de configuraciones entre CLI/Web/GUI.
- Pruebas de compatibilidad y rendimiento básico.

#### Roadmap próximo (móvil)
- Próxima versión mayor (4.0.0): primer cliente móvil para iOS y/o Android (y derivados como Huawei HarmonyOS).
- Evaluación de frameworks: React Native / Flutter / Ionic.
- Integración con API REST actual y soporte de colas/descargas desde móvil.


## [3.0.0] - 2025-11-02
### Web App como PWA y mejoras de performance
- PWA: Service Worker con cache selectivo (app shell + assets estáticos críticos).
- Reintentos automáticos de SSE y backoff exponencial en pérdidas de conexión.
- Lazy-loading de módulos y reducción de bundle inicial (code splitting en rutas de resultados).
- Auditoría A11y y mejoras de navegación por teclado en resultados y acciones.

#### Tareas intermedias (2.9.1 c/u)
- Precarga de fuentes/íconos y compresión de imágenes del UI.
- Ajuste de headers de cache para assets de larga duración.
- Métricas básicas de LCP/CLS en modo dev.

## [2.9.0] - 2025-11-02
### Búsqueda: relevancia, deduplicación y normalización
- Heurística de relevancia mejorada combinando título/canal/duración.
- Deduplicación agresiva de IDs entre fuentes (HTML ytInitialData + yt-dlp JSON).
- Normalización fuerte de URL/ID (trimming, unicode, parámetros comunes) y regex afinadas.

#### Tareas intermedias
- Métricas de precisión/recall con dataset ampliado.
- Logging de diagnósticos para ajustes futuros.

## [2.8.0] - 2025-11-02
### API: seguridad ligera y exportes
- Tokens opcionales por entorno para proteger endpoints sensibles.
- Rate limiting básico por IP y límites por tarea.
- Exportes: historial y errores en JSON/CSV.
- Empaquetado ZIP estable de resultados por lote.

#### Tareas intermedias
- Endpoints de salud extendidos con info de yt-dlp/ffmpeg.
- Limpieza periódica de temporales.

## [2.7.0] - 2025-11-02
### Empaquetado Electron
- Artefactos: Windows .exe portable, Linux AppImage, macOS .dmg (sin notarizado).
- Preparación para auto-updater (stubs) y firma de código (pendiente).
- Modo portable verificado en Windows sin instalar dependencias del sistema.

#### Tareas intermedias
- Scripts de build por plataforma y documentación de instalación.
- Verificación de rutas relativas y permisos de escritura.

## [2.6.0] - 2025-11-02
### FFmpeg avanzado y pipeline multimedia
- Normalización de audio (`loudnorm`) opcional; remux MP4/WebM estable.
- Parsing de progreso de ffmpeg y reporte en tiempo real.
- Fallback a streams progresivos cuando ffmpeg no está disponible.

#### Tareas intermedias
- Detección robusta de ffmpeg/ffprobe en PATH o binarios locales.
- Flags de aceleración opcionales según plataforma.

## [2.5.0] - 2025-11-02
### Canales (handles) e incremental
- Descarga por canal/@handle con respaldo incremental (solo nuevo contenido).
- Filtros por fecha/duración y clasificación configurable.
- Resumen de resultados y reporte de nuevos ítems.

#### Tareas intermedias
- Fallback de scraping cuando la API falla.
- Preparación de scheduler simple para futuras ejecuciones recurrentes.

## [2.4.0] - 2025-11-01
### Playlists robustas
- Reanudación, reintentos por ítem y limpieza de parciales `.part`.
- Metadatos por ítem y registro de fallidos con reintento posterior.
- Throttling de concurrencia y control de cuotas.

#### Tareas intermedias
- Validación cruzada de IDs y ordenamiento estable.
- Mejora de mensajes de error en lote.

## [2.3.0] - 2025-11-01
### Usabilidad CLI y códigos de error
- Estandarización de códigos de salida y mensajes (CLI/GUI/API).
- Reintentos con backoff y cancelación más rápida.
- `--info` extendido con esquema JSON estable y campos adicionales.

#### Tareas intermedias
- Ajustes de SSE en backend para eventos consistentes.
- Documentación ampliada de flags y ejemplos.


## 2025-11-01
# [2.2.0]
	- Header actualizado: título “Y2Back”, logo y slogan “Rápido, simple y sin rodeos — Tus contenidos, donde quieras y como quieras”.
	- Vista previa: placeholder centrado con logo y superposición estilo YouTube sobre degradado azul más claro.
- Revisión de accesibilidad (tab-orden, contraste) y QA visual.

#### Tareas intermedias (desde 2.1.2)
- Mantenimiento de dependencias y limpieza de warnings.
 - Pruebas exploratorias con entradas irregulares y URLs malformadas.
 - ADR-001: registro de decisiones iniciales para soporte Vimeo.
- Fallback a yt-dlp y deduplicación de IDs entre fuentes.
 - Fix de escapes y grupos opcionales conflictivos.
 - Nota de compatibilidad y límites conocidos.
#### Tareas intermedias (desde 2.0.2)
 - Pruebas de rendimiento en invocaciones de yt-dlp.
 - Validación de headers/cookies en escenarios edge.
 - Informe de resultados y próximos pasos.
- Normalización y saneamiento de entradas ambiguas.
- Layout 30/70: izquierda (Vista previa, En curso, Listos); derecha (Resultados + Acciones).
 - Auditoría de permisos en Windows/Linux/macOS.
 - Fix para condiciones de carrera y colisiones simultáneas.
 - Logs específicos alrededor de creación de directorios.
- Sistema de theming y tokens de color reutilizables.
 - A/B testing de formatos y densidad del banner.
 - Revisión de accesibilidad (lectores de pantalla/aria).
 - Corrección de truncamientos en terminales pequeñas.
 - Enlaces a ejemplos prácticos en README.

## [2.1.1] - 2025-10-31
### Mejoras de UX y estados (GUI)
- Indicadores de progreso mejorados: estados visuales (🚀 Iniciando, 📥 Descargando, 📊 Progreso, ✅ Completado).
- Auto-detección del inicio de descarga y actualización de panel en tiempo real.
- Auto-ocultación del panel de información al completar tareas.

#### Tareas intermedias (+0.0.1 c/u)
- Spinner de búsqueda con control centralizado (`toggleSearchSpinner`).
- Componente `showDownloadInfo()` robustecido con datos en caliente.
- Mensajes de error localizados y normalizados para GUI.

#### Archivos
- renderer.js, renderer.html

## [2.1.0] - 2025-10-31
### Layout del panel de información y tema
- Terminal al 70% e información al 30% (sin fondo negro, integrado con tema azul).
- Mejora de contraste y legibilidad; fondos semitransparentes.

#### Archivos
- renderer.html (grid y clases CSS), estilos asociados

## [2.0.3] - 2025-10-31
### Placeholder de thumbnails y manejo de 404
- Placeholder visual y fallback a icono/emoji cuando falla la carga de thumbnails.
- Manejo de `onerror` para imágenes con 404 o recursos restringidos.

#### Archivos
- renderer.html (placeholder), renderer.js (carga segura de imágenes)

## [2.0.2] - 2025-10-31
### Código de error -1 (4294967295) en descargas
- Detección automática de URL vs término de búsqueda.
- Prefetch de información con `--info` antes de iniciar descarga para validar extractores.
- Manejo de errores de proceso y surface de stderr para diagnóstico rápido.

#### Archivos
- main.js (handler `get-video-info`), preload.js (API expuesta), renderer.js (detección y feedback), y2back.js (`obtenerInformacionVideo`)

## [2.0.1] - 2025-10-31
### Búsqueda infinita con términos genéricos ("Emilia")
- Timeouts: 60s para búsquedas y 30s para `--info`.
- Terminación automática de procesos colgados y limpieza.
- Captura de stderr y códigos de salida para diagnóstico.

#### Archivos
- y2back.js (`buscarVideosJson`, `buscarPlaylistsJson`)

## [2.0.0] - 2025-10-31
 - Revisión de niveles de log en módulos críticos.
 - Tests de estrés prolongados y monitoreo de recursos.
 - Validación bajo red lenta e intermitente.
 - Señal de go/no-go para siguientes integraciones.
### Unificación de versiones del proyecto
 - Comparación de drift de versiones entre módulos.
- Sincronización de nombres de producto y banners en docs.
 - Alineación de estilos y paleta UI.
 - Pruebas con y sin WebView (feature flag).
 - Fixes de CSP que bloqueaban recursos embebidos.
 - Documento de upgrade 1.x → 2.0.
### Testing completo (Item 12)
 - Ensayo responsivo en distintos breakpoints.
 - QA visual y medición de performance de animaciones.
 - Fix de superposiciones/overflow en layouts extremos.
- Mocks de respuestas inconsistentes de yt-dlp.
 - Test de heurística con corpus mixto (URLs/IDs/texto).
 - Revisión de errores de usuario frecuentes.
 - Fix a detección de URLs sin protocolo.
 - Validación de telemetría local (opt-in) desactivada por defecto.
### Mensajes de salida (Item 11)
 - Análisis de impacto en UX con listas largas y parciales.
 - Pruebas con interrupciones del usuario (pausa/cancelar).
 - Fix de sincronización de progreso por ítem.
- Detección de plataforma (OS) y modo portable en status.
 - Tests de cancelación en Windows y Linux.
 - Revisión de limpieza de temporales tras abortos.
 - Fix de procesos huérfanos en escenarios edge.
 - Guía de recuperación ante cancelaciones forzadas.
### Banner de ayuda (Item 10)
 - Benchmarks scraping vs yt-dlp (tiempos/consumo).
 - Tests end-to-end de endpoints con datos reales.
 - Fix de deduplicación y ordenamiento de resultados.
 - Esquema de errores y códigos HTTP documentados.
- Inclusión de ejemplos válidos/invalidos y mejores prácticas.
 - Monitoreo post-release (logs/métricas de uso).
 - Etiquetado de issues por severidad/área.
 - Fix menor en mensajes del endpoint /health.
### Lógica de directorios (Item 9)
 - Revisión de contraste AA/AAA y estados de foco.
 - Ensayo de navegación por teclado y roles ARIA.
 - Fix de focus visible y elementos interactivos.
- Implementación de mkdirp y verificación de permisos.
- Etiquetado de plataforma en metadatos de salida.
- Manejo de colisiones de nombre con sufijos incrementales.
- Pruebas con rutas largas y caracteres especiales.
## [1.2.2] - 2025-10-12
### Decisión de directorios (Item 8)
- Mantener organización unificada por tipo y anotar plataforma detectada.

#### Tareas intermedias (desde 1.2.1)
- Benchmark de esquemas de carpetas y expectativas de usuario.
- Helper de paths con saneamiento y prevención de colisiones.
- Migración de archivos antiguos a la nueva estructura.
- Nota de compatibilidad y guía de adopción.
## [1.2.1] - 2025-10-11
### Testing básico (Item 7)
- Pruebas de descarga en Vimeo y verificación de calidades disponibles.

#### Tareas intermedias (desde 1.2.0)
- Fixtures con videos públicos y, si es posible, privados de prueba.
- Simulación de errores de red y timeouts controlados.
- Asserts de calidades y de streams progresivos/adaptativos.
- Reporte breve de cobertura y hallazgos.
## [1.2.0] - 2025-10-10
### Comandos yt-dlp para Vimeo (Item 6)
- Parámetros específicos para Vimeo y ajustes respecto a YouTube.

#### Tareas intermedias (desde 1.1.1)
- Matriz de parámetros yt-dlp comparando YouTube vs Vimeo.
- Pruebas de extracción de metadatos y formatos (-J / --dump-json).
- Gestión de cookies/headers cuando aplica y detección de auth.
- Script de smoke-test multiplataforma (Windows/Linux).
## [1.1.1] - 2025-10-08
### Validaciones y mensajes (Item 5)
- Validaciones principales y mensajes de error/ayuda con ejemplos Vimeo.

#### Tareas intermedias (desde 1.1.0)
- Catálogo de errores y códigos asociados.
- Mensajes localizados base (es/en) y ejemplos en --help.
- Estandarización del formato de salida para pipelines.
- Revisión de UX en consola y consistencia de niveles de log.
## [1.1.0] - 2025-10-07
### Implementar extraerVimeoId() (Item 4)
- Regex para formatos de Vimeo (player, directos, channels, groups, ondemand, numéricos) y manejo de casos edge.

#### Tareas intermedias (desde 1.0.3)
- Diseño de regex compuesta y pruebas contra dataset ampliado.
- Normalización de shortlinks y parámetros de query relevantes.
- Fallback seguro (retorno null) con motivo cuando no hay match.
- Métricas básicas de éxito/fracaso en pruebas locales.
## [1.0.3] - 2025-10-03
### Compatibilidad de IDs (Item 3)
- Actualizar extracción de IDs para soportar Vimeo manteniendo YouTube.

#### Tareas intermedias (desde 1.0.2)
- Unificación de la función de extracción de ID con módulos por plataforma.
- Soporte a player.vimeo.com y patrones numéricos puros.
- Tests de regresión para YouTube y nuevos casos Vimeo.
- Incorporación de logging de depuración mediante banderas.

#### Tareas intermedias (desde 1.0.1)
- Utilidades de parsing y normalización de URL (protocolos, dominio y ruta).
- Integración de validaciones en la CLI con mensajes de error temporales.
- Activación de CI mínima para ejecutar pruebas en cada push.
- Registro de decisiones de diseño para futuras extensiones.

## [1.0.1] - 2025-10-01
### Investigación URLs de Vimeo (Item 1)
- Analizados formatos: vimeo.com/123456, player.vimeo.com/video/123456; documentados patrones de ID.

#### Tareas intermedias (desde 1.0.0)
- Definición de alcance para Vimeo y criterios de aceptación.
- Creación de dataset de URLs reales y casos límite (player, canales, grupos, on-demand).
- Montaje de esqueleto de pruebas unitarias para validación de URLs.
- Documentación inicial de riesgos y compatibilidades.

## [1.0.0] - 2025-10-01
### Inicio del Proyecto
- Proyecto inicial: descargador de YouTube (video, audio, imágenes, subtítulos, metadata).
- Arquitectura base inspirada en ZiteBack.

---

Notas de versionado:
- +0.0.1 cambios pequeños.
- +0.1.0 módulo/función de complejidad media.
- +1.0.0 nueva usabilidad importante (Vimeo).

*Última actualización: 1 de noviembre de 2025*
