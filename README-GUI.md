# 🎨 Así es Y2Back GUI — Guía Completa
<p align="center">
  <img src="https://cdn.susitio.cl/assets/images/logoY2B.png" alt="Y2Back logo" width="200" />
</p>

Esta guía reúne y unifica toda la documentación dispersa de la GUI de Y2Back para ofrecer una referencia única, coherente y actualizada. Cubre instalación, requisitos, formas de lanzamiento, uso, notas por plataforma y solución de problemas.

---

## ✅ Alcance y objetivos

- Interfaz gráfica moderna basada en Electron con vista previa instantánea estilo “sitios profesionales”.
- Búsqueda integrada y descargas reales conectadas al core `y2back.js`/API local.
- Scripts multiplataforma para lanzar servicios con un solo comando.
- Modo portátil: funciona sin instalar ffmpeg/yt-dlp globalmente.

---

## 🧩 Requisitos

- Node.js ≥ 18 y npm ≥ 9
- Electron (devDependency del proyecto)
- yt-dlp y ffmpeg:
  - Recomendados para todas las funciones (merge/remux/conversión).
  - Opcionales: si faltan, el sistema funciona con formatos progresivos (video+audio en un solo archivo) sin merges.

Opción portátil (sin root/instalación del sistema): coloca los binarios en la raíz del proyecto (o en `./bin`) y dales permisos de ejecución en Linux/macOS.

```
Y2Back/
├── ffmpeg (o ./bin/ffmpeg)
├── yt-dlp (o ./bin/yt-dlp)
└── ...
```

Los scripts de arranque agregan automáticamente el root del proyecto y `./bin` al PATH.

---

## 📦 Instalación rápida

1) Clonar e instalar dependencias

```bash
npm install
```

2) (Opcional) Compilar el frontend web

```bash
npm run web:build
```

3) (Opcional) Verificaciones

```bash
node --version
npm --version
```

---

## 🗂️ Estructura de archivos del GUI

```
Y2Back/
├─ gui.js                  # Launcher Node de la GUI
├─ gui.ps1                 # Launcher PowerShell (Windows)
├─ gui.cmd                 # Launcher CMD (Windows)
├─ start-server.ps1        # Arranca solo la API (Windows)
├─ start-server.sh         # Arranca solo la API (Linux/macOS)
├─ start-stack.ps1         # API + Web dev en paralelo (Windows)
├─ start-stack.sh          # API + Web dev en paralelo (Linux/macOS)
├─ ELIMINAR/electron/      # Capa de escritorio (Electron)
│  ├─ main.js
│  ├─ preload.js
│  ├─ renderer.html
│  ├─ renderer.js
│  ├─ renderer_new.html
│  ├─ renderer_new.js
│  ├─ renderer_new_backup.html
│  ├─ renderer_new_fixed.html
│  └─ test-gui.js
├─ web/                    # Frontend web (Vite/React)
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ README.md
│  ├─ public/
│  ├─ dist/                # Build de producción (cuando existe)
│  └─ src/
│     ├─ api.js
│     ├─ App.jsx
│     ├─ config.js
│     ├─ main.jsx
│     ├─ styles.css
│     └─ theme.js
└─ api/                    # API local que sirve la GUI/core
  └─ server.js
```

Notas:
- Binarios portátiles opcionales en la raíz: `ffmpeg`, `ffprobe`, `yt-dlp` (y sus variantes `.exe` en Windows). Los scripts ya priorizan el root y `./bin` en el PATH.
- Directorio de salida por defecto: `./medios/` (Music, Video, Pics, Subtitles, etc.).

---

## 🚀 Lanzar la GUI

Métodos equivalentes:

- NPM script
  - `npm run gui`
- Launcher Node
  - `node gui.js --start` o `node gui.js -s`
- Electron directo
  - `npx electron .`
## 📦 Empaquetado (binarios portables)

Usamos electron-builder para generar ejecutables portables por plataforma.

1) Instalar dependencias (si no lo has hecho):

```powershell
npm install
```

2) Construir según plataforma (Windows/Linux/macOS):

```powershell
# Windows (Portable)
npm run build:win

# Linux (AppImage)
npm run build:linux

# macOS (DMG)
npm run build:mac

# Todo (según host)
npm run build:all
```

3) API remota (opcional):

Define `Y2B_GUI_URL` antes de lanzar el binario si quieres que la app use una API remota (la app verifica `/api/health`). Por ejemplo:

```powershell
$env:Y2B_GUI_URL = 'https://api.tudominio.com/'
# Luego ejecuta el binario generado
```

Notas:
- En producción se ocultan DevTools y el menú de depuración; en desarrollo (NODE_ENV != production) permanecen visibles.
- Si usas la plantilla local (renderer fallback) y requieres conectar a dominios remotos adicionales, asegúrate de añadirlos a `connect-src` en el CSP correspondiente.

- Acceso corto del CLI (si está configurado)
  - `y2 --gui`

Launcher (`gui.js`) características:
- Detección automática de plataforma y fallbacks.
- Mensajes claros y ayuda integrada.
- Multiplataforma (Windows, Linux, macOS).

---

## ⚙️ Levantar servicios con un solo comando

Incluimos scripts para arrancar API y, si quieres, el servidor web de desarrollo en paralelo.

- Windows PowerShell
  - API + Web (dev): `./start-stack.ps1`
  - Solo API: `./start-server.ps1`
- Linux/macOS
  - Dar permisos una vez: `chmod +x ./start-*.sh`
  - API + Web (dev): `./start-stack.sh`
  - Solo API: `./start-server.sh`

Al iniciar, muestran un resumen del entorno:
- yt-dlp: OK / NO detectado
- ffmpeg: OK (merge habilitado) / NO detectado (modo progresivo)

Logs en `./logs/`. Ctrl+C detiene y limpia procesos.

---

## 🖥️ Uso de la GUI

### Vista previa instantánea
- Pega una URL de YouTube y el reproductor se muestra de inmediato.
- Los metadatos se cargan en segundo plano.

Notas técnicas de embed (resumen Electron-optimized):
- Dominio `youtube-nocookie.com` y parámetros mínimos (modestbranding, rel=0, etc.).
- `origin=file://` o sin origin según la variante más estable.
- Sandbox acotado: `allow-scripts allow-same-origin` (+presentación cuando corresponde).
- Referrer policy compatible: `no-referrer` o `no-referrer-when-downgrade` según build.

### Búsqueda integrada
- Ingresar término (ej.: "Emilia", "javascript tutorial").
- Resultados en tarjetas con título, canal, duración y miniatura.
- Auto-preview del primer resultado (opcional según versión).

### Descargas reales (conectadas al core)
- Botones por tipo: Video, Music, Pics, Subtitles, Screenshots, Meta, y Descargar Todo.
- Durante la descarga:
  - El botón activo queda en estado “procesando…”.
  - Los demás se deshabilitan pero permanecen visibles.
  - Al finalizar, se restauran automáticamente.
- Feedback en terminal integrado (progreso, destino, 100%, etc.).

### Sin ffmpeg (modo progresivo)
- Si ffmpeg no está disponible, la GUI ofrece principalmente formatos progresivos (video+audio en un solo archivo).
- No se realizan merges/remux ni conversiones.
- Verás menos combinaciones de calidad/formatos.

---

## 🔒 Seguridad y CSS

- CSP definido para reducir warnings, restringiendo orígenes a lo necesario.
- Eliminación de dependencias CDN problemáticas (Tailwind CDN) en builds finales; CSS propio optimizado.

---

## 🧪 Comandos útiles para pruebas

- Reiniciar GUI de prueba (ejemplo histórico):

```powershell
# Windows PowerShell
Taskkill /f /im electron.exe 2>nul ; npx electron ELIMINAR/electron/test-gui.js
```

- Buscar vía CLI (referencia):

```powershell
node y2back.js --search "Karol G" --search-json --limit 1 | Out-Host
```

---

## 🆘 Solución de Problemas Completa

### 📋 **Problemas Resueltos Históricamente**

#### 🚀 **Problema 1: Búsqueda Infinita con "Emilia"**

**Síntoma**: La búsqueda por términos como "Emilia" se quedaba con la ruedita girando por 60+ segundos sin resultados.

**Solución Implementada**:
- ✅ **Timeout de 60 segundos** en búsquedas de videos y playlists
- ✅ **Manejo robusto de errores** con códigos de salida
- ✅ **Captura de stderr** para diagnóstico
- ✅ **Terminación automática** de procesos colgados

**Archivos Modificados**: `y2back.js` - Funciones `buscarVideosJson()` y `buscarPlaylistsJson()`

---

#### 🎯 **Problema 2: Código de Error 4294967295 en Descargas**

**Síntoma**: Las descargas fallaban con código `4294967295` (que es -1 en unsigned).

**Solución Implementada**:
- ✅ **Detección automática de URLs** vs términos de búsqueda
- ✅ **Obtención previa de información** del video con `--info`
- ✅ **Mejor manejo de errores** en el proceso de descarga
- ✅ **Feedback visual mejorado** para el usuario

**Archivos Modificados**: `renderer.js`, `main.js`, `preload.js`, `y2back.js`

---

#### 🖼️ **Problema 3: Imagen 404 en Panel de Información**

**Síntoma**: El thumbnail del video mostraba una "X" como si fuera un 404.

**Solución Implementada**:
- ✅ **Placeholder visual** cuando no hay thumbnail disponible
- ✅ **Manejo de errores** en carga de imágenes (`onerror`)
- ✅ **Fallback automático** a icono cuando falla la carga
- ✅ **Mejor UX** con emoji 🎬 y texto "Sin preview"

**Archivos Modificados**: `renderer.html`, `renderer.js`

---

#### 🎨 **Problema 4: Layout del Panel de Información**

**Solución Implementada**:
- ✅ **Layout optimizado**: Terminal 70% / Info 30%
- ✅ **Sin fondo negro**: Panel integrado con el tema azul
- ✅ **Mejores colores**: Texto más legible sobre fondo azul
- ✅ **Fondos semitransparentes**: Para mejor integración visual

**Archivos Modificados**: `renderer.html`

---

### 🚀 **Funcionalidades Agregadas**

#### 🔍 **Detección Inteligente de URLs**

El GUI ahora detecta automáticamente:
- **URL de video**: Se configura automáticamente para descarga
- **URL de playlist**: Se configura modo playlist automáticamente  
- **Término de búsqueda**: Busca videos en YouTube

#### 📊 **Obtención de Información Previa**

Comando `--info` para obtener información del video sin descargarlo:

```bash
node y2back.js --info --url "https://youtu.be/VIDEO_ID"
```

#### ⏱️ **Timeouts y Manejo de Errores**

- **Búsquedas**: Timeout de 60 segundos
- **Información**: Timeout de 30 segundos  
- **Errores detallados**: Mensajes específicos para cada tipo de fallo

#### 🎯 **Indicadores de Progreso Mejorados**

- ✅ **Estados visuales**: 🚀 Iniciando, 📥 Descargando, 📊 Progreso, ✅ Completado
- ✅ **Auto-detección**: Detecta automáticamente cuando inicia una descarga
- ✅ **Información en tiempo real**: Muestra datos del video durante la descarga
- ✅ **Auto-ocultación**: El panel se oculta automáticamente después de completar

---

### 🔧 **Soluciones Rápidas**

#### Cortar descargas colgadas:

**Windows (PowerShell)**:
```powershell
taskkill /IM yt-dlp.exe /T /F
taskkill /IM ffmpeg.exe /T /F
```

**Linux/macOS**:
```bash
pkill -f yt-dlp || true
pkill -f ffmpeg || true
```

#### Si no se ve el embed:
- Probar con otra variante de parámetros mínimos
- Verificar que la URL sea pública y correcta

#### Si la búsqueda tarda:
- El sistema aplica timeouts (60s en búsquedas)
- Revisar logs en `./logs/`

---

## 🧭 Historial de mejoras relevantes (resumen)

- v2.x: GUI moderna, vista previa instantánea, búsqueda integrada, descargas reales y tema visual consistente.
- v3.x: Correcciones avanzadas para Electron + YouTube (iframe estable), CSP ajustado, eliminación de dependencias CDN problemáticas, logging y estados visuales robustos.

---

## ✅ Resultado

- GUI moderna, estable y multiplataforma.
- Lanzamiento con un comando (API/Web) y modo portátil sin instalaciones globales.
- Experiencia de descarga y búsqueda real, con feedback claro y seguro.

Si necesitas empaquetado (Windows portable, AppImage, .dmg) o integración con systemd en servidores Linux, revisa `DEPLOY_LINUX.md` y consultamos opciones.
