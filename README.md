# 🚀 Así es Y2Back v3.4.2

<p align="center">
  <img src="https://cdn.susitio.cl/assets/images/logoY2B.png" alt="Y2Back logo" width="200" />
</p>

[![Version](https://img.shields.io/badge/version-3.4.2-blue.svg)](https://github.com/davidvalsep/Y2Back)
[![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-≥18.0.0-green.svg)](https://nodejs.org/)
[![yt-dlp](https://img.shields.io/badge/yt--dlp-latest-orange.svg)](https://github.com/yt-dlp/yt-dlp)

**Y2Back** es una herramienta completa para descargar y procesar contenido de YouTube con soporte extenso de URLs, modo interactivo, conversión automática de formatos y verificación de integridad. Ahora con **UI/UX revolucionario**, **persistencia de datos** y **deployment completo en producción** (cPanel + Linux VPS validado y funcional).

---

## 🌟 **Nuevo en v3.4.2 - UI/UX Profesional & Producción Validada**

### 🎨 **5 Mejoras Críticas de Interfaz Web**

#### 1️⃣ **⚡ Persistencia LocalStorage + Indicador ZIP**
- **Selecciones guardadas**: Las selecciones persisten entre recargas del navegador
- **Indicador visual**: Icono 📦 + texto "(ZIP)" cuando hay múltiples archivos seleccionados
- **Almacenamiento**: Clave `y2back-selected` en localStorage del navegador
- **Beneficio**: No pierdes tus selecciones al refrescar la página

#### 2️⃣ **🎨 Footer Temático Responsive**
- **Modo oscuro**: Color `#cfcfcf` → hover `#ffffff` (contraste optimizado)
- **Modo claro**: Color `#c33` → hover `#cc3` (acento cálido)
- **Sincronización**: Footer principal + landing page con estilos idénticos
- **Accesibilidad**: Cumple estándares WCAG de contraste

#### 3️⃣ **📐 Layout Optimizado - Búsqueda Mejorada**
- **"Podrías tener suerte"**: Movido al lado del campo de búsqueda (inline)
- **Responsivo**: Ancho adaptativo 220-280px según tamaño de pantalla
- **Limpieza**: Eliminado card duplicado del panel izquierdo
- **Resultado**: Flujo visual más intuitivo y profesional

#### 4️⃣ **🖼️ Modal "Ver Ficha" con Imagen Destacada**
- **Tamaño**: Imagen 40vw (mínimo 280px) con aspect ratio 16:9
- **Wikipedia**: Integración con API de Wikipedia ES para biografías
- **Diseño**: Imagen prominente + datos del artista
- **Performance**: Carga lazy de imágenes para mejor velocidad

#### 5️⃣ **📥 Modal Descarga con Thumbnail & Controles**
- **Header visual**: Thumbnail 120x68px + título del video
- **Selectores**: Formato y calidad accesibles en el modal
- **Botones**: "Seleccionar todo" y "Limpiar" con spacing óptimo
- **UX**: Estados visuales claros en todas las interacciones

### 📸 **Landing Page Actualizado**
- ✅ Screenshot de producción añadido (139KB PNG de alta calidad)
- ✅ Generado automáticamente vía `image.thum.io` desde API en vivo
- ✅ URL capturada: `http://apiy2.susitio.cl`
- ✅ Footer sincronizado con estilos de la app principal

### 🌐 **Deployment en Producción VALIDADO**
- ✅ **cPanel/Passenger**: Testeado y funcionando en `http://apiy2.susitio.cl`
- ✅ **Linux VPS**: Scripts de deployment para systemd y PM2
- ✅ **CORS**: Configuración multi-origen validada en producción
- ✅ **Binarios**: yt-dlp, ffmpeg, ffprobe ejecutándose correctamente
- ✅ **Variables entorno**: PORT, NODE_ENV, CORS_ORIGINS configurados
- ✅ **Frontend Build**: Vite 5.4.21 + React 18.3.1 (268KB JS, 85KB gzipped)

---

## ✨ Características Principales

- 🎥 **Descarga de videos** - MP4, WebM, MKV con calidad seleccionable  
- 🎵 **Extracción de audio** - MP3, FLAC, OGG de alta calidad
- 🖼️ **Thumbnails e imágenes** - Portadas y miniaturas
- 📝 **Subtítulos automáticos** - SRT, VTT, ASS
- 📸 **Capturas de pantalla** - Screenshots específicos
- 📊 **Metadata completa** - Información detallada sin dependencias pesadas
- 🔄 **Conversión automática** - MKV → MP4 para mejor compatibilidad
- 🔍 **Búsqueda integrada** - Buscar directamente en YouTube (scraping HTML)
- ✅ **Verificación de integridad** - Validación automática de archivos
- 🎯 **Modo interactivo** - Interfaz amigable sin parámetros
- 📱 **URLs flexibles** - Soporte para todos los formatos de YouTube
- 🚀 **Production Ready** - Bundles de deployment para cPanel, VPS y contenedores
- 🌐 **API REST + SPA** - Backend Express + Frontend React con búsqueda en vivo
- 💻 **GUI Electron** - Interfaz de escritorio con soporte para API remota

---

## 🌐 **Deployment en Producción (v3.3.2 - v3.4.2)**

### 📦 **Bundles de Deployment**

Genera bundles listos para producción con un solo comando:

```bash
bash tools/build-deploy-bundle.sh
```

**Genera:**
- `dist/bundles/y2back-api.tar.gz` (129MB) - Backend API con binarios incluidos
- `dist/bundles/web-dist.tar.gz` (1.4MB) - Frontend SPA compilado

**Incluye:**
- ✅ `yt-dlp`, `ffmpeg`, `ffprobe` con permisos ejecutables
- ✅ `app.js` para compatibilidad cPanel/Passenger
- ✅ Sin `node_modules` (instalación vía npm en servidor)
- ✅ Ejemplos de configuración Apache/Nginx/Systemd

### 🌐 **Deployment en cPanel (Hosting Compartido) - VALIDADO ✅**

1. Sube `y2back-api.tar.gz` a tu hosting
2. Extrae en la carpeta deseada
3. En cPanel → **Setup Node.js**:
   - **Application root:** ruta a carpeta extraída
   - **Application startup file:** `app.js`
   - **Environment variables:** `NODE_ENV=production`, `PORT=3000`
4. **Run NPM Install** → **Start Application**

**✅ Pruebas exitosas en producción:**
- API funcional en `http://apiy2.susitio.cl`
- CORS configurado y validado
- Binarios ejecutándose correctamente

📚 **Guía completa:** [DEPLOY_CPANEL.md](DEPLOY_CPANEL.md)

### 🔧 **Deployment en VPS/Dedicado - VALIDADO ✅**

```bash
# Extraer bundle
sudo tar -xzf y2back-api.tar.gz -C /opt/y2back

# Instalar dependencias
cd /opt/y2back
npm install --production

# Systemd (opcional)
sudo cp deploy/systemd/y2back-api.service.example /etc/systemd/system/y2back-api.service
sudo systemctl enable --now y2back-api
```

### 🌍 **CORS & API Remota**

Conecta tu SPA desde cualquier dominio:

            console.log(colors.yellow + '\nPresiona Ctrl+C para detener ambos' + colors.reset);

            break;```bash

        # Variables de entorno

        case '0':CORS_ORIGINS=https://tu-app.com,https://otro.com

            return;NODE_ENV=production

        PORT=3000

        default:```

            console.log(colors.red + '❌ Opción inválida' + colors.reset);

            await modoPruebas();**GUI Electron con API remota:**

    }```bash

}node gui.js --remote --url https://apiy2.susitio.cl/

```

// Modo Deploy

async function modoDeploy() {---

    console.log(colors.bright + '\n🚀 MODO DEPLOY' + colors.reset);

    console.log('\n¿Sistema operativo del servidor?');## 🎨 **Nueva GUI v2.0.0 - Vista Previa Instantánea**

    console.log('1. Linux (Ubuntu, Fedora, Debian, CentOS)');## 🖥️ GUI (Interfaz Gráfica)

    console.log('2. Windows (Windows Server, Windows 10+)');

    console.log('3. macOS (Intel, Apple Silicon)');Se incluye una interfaz gráfica completamente rediseñada, con vista previa instantánea como cualquier sistema profesonal, elanorada en Electron para facilitar el uso. Para lanzar la GUI en desarrollo:

    console.log('0. Volver');

```powershell

    const opcion = await question('\nSelecciona una opción (0-3): ');npm run gui

```

    let plataforma;

    switch (opcion.trim()) {Nota: en Windows puede ser necesario cerrar procesos que bloqueen archivos durante `npm install` (antivirus, instancias previas de Electron). Si tienes problemas con la instalación de Electron, intenta reiniciar la máquina o eliminar temporalmente `node_modules/electron` antes de reinstalar.

        case '1':

            plataforma = 'Linux';### 🌟 **Características Revolucionarias**

            break;- **🎬 Vista previa instantánea**: Enlace a YouTube para, eliminmada la WebView ya que mostraba demasiada publicidad, estamos evaluando opciones, de lo comntrario os enfocamos netamete a agregar funcionalidades

        case '2':- **⚡ Carga en segundo plano**: Los metadatos se cargan em ms emn segundo plano

            plataforma = 'Windows';- **🎯 Interfaz moderna**: Diseño web responsivo con animaciones fluidas

            break;- **📊 Barras de progreso realistas**: Animaciones con efectos shimmer como páginas premium

        case '3':- **🖱️ UX profesional**: Botones con hover effects y estados de carga

            plataforma = 'macOS';- **📱 Layout responsivo**: División 30/70 optimizada para mejor experiencia

            break;

        case '0':### 🚀 **Acceso Rápido a la GUI**

            return;

        default:```bash

            console.log(colors.red + '❌ Opción inválida' + colors.reset);# Comando directo para abrir GUI moderna

            await modoDeploy();y2 --gui

            return;

    }# O ejecutar directamente

npm run electron:dev

    const valido = validarBinarios(plataforma);```



    if (valido) {### ⚡ **Flujo de Trabajo Instantáneo**

        console.log(colors.green + colors.bright + '\n✅ Servidor listo para deploy en ' + plataforma + colors.reset);1. **Pega URL de YouTube** → Video se muestra inmediatamente

        console.log(colors.cyan + '\n📦 Próximos pasos:' + colors.reset);2. **Información se carga** → Metadatos aparecen en segundo plano  

        console.log('   1. Empaquetar proyecto: npm pack o crear bundle');3. **Descarga con un clic** → Barra de progreso realista tipo Windows

        console.log('   2. Subir al servidor ' + plataforma);4. **Resultado inmediato** → Feedback visual profesional

        console.log('   3. Ejecutar: npm install --production');

        console.log('   4. Iniciar: node api/server.js o PM2');### 💡 **Comparación con sitios profesionales**

    } else {- ✅ **Vista previa inmediata** (como savefrom.net, y2mate)

        console.log(colors.yellow + '\n⚠️  Faltan binarios. Descárgalos antes de hacer deploy.' + colors.reset);- ✅ **Carga de información en background** (como 9xbuddy)

    }- ✅ **Barras de progreso animadas** (como 4k-video-downloader)

}- ✅ **Interfaz responsive moderna** (como clipconverter)



// Menú principal---

async function menuPrincipal() {

    mostrarBanner();## ⚡️ GUI de búsqueda (opcional) — basado en el mismo core

    

    console.log(colors.bright + '¿Qué deseas hacer?' + colors.reset);Además del CLI, ahora hay un GUI opcional con Electron que usa exactamente el mismo core (`y2back.js`).

    console.log('1. Pruebas (desarrollo local)');

    console.log('2. Deploy (preparar para servidor)');### 🎯 **Características Principales**

    console.log('0. Salir');- **Búsqueda integrada**: ingresa un término y se listan hasta 12 resultados con miniatura, título, canal y duración.

- **Tarjetas con acciones**: en cada resultado puedes descargar Video, Music, Pics, Subtitles, Screenshots o Meta.

    const opcion = await question('\nSelecciona una opción (0-2): ');- **Descargar todo**: botón "Descargar todo" que procesa todos los resultados secuencialmente, mostrando el progreso en una consola integrada.

- **Sin romper el CLI**: todo se ejecuta invocando `y2back.js` bajo el capó.

    switch (opcion.trim()) {

        case '1':### ⚡ **Mejoras v2.0.0**

            await modoPruebas();- **⏱️ Timeouts inteligentes**: Búsquedas máximo 60 segundos, información 30 segundos

            break;- **🖼️ Sistema robusto de thumbnails**: Carga automática con fallbacks y placeholders

        - **📐 Layout optimizado 70/30**: División terminal/panel de información para mejor UX

        case '2':- **🔍 Detección automática de URLs**: Pre-carga metadatos antes de descargar

            await modoDeploy();- **✅ Interpretación inteligente de errores**: Manejo correcto de códigos de estado

            setTimeout(() => {- **📊 Comando `--info` integrado**: Extracción rápida de metadatos JSON

                rl.close();

                process.exit(0);### 🚀 **Cómo ejecutarlo**

            }, 100);

            break;```powershell

        npm install

        case '0':npm run electron:dev

            console.log(colors.green + '\n👋 ¡Hasta luego!' + colors.reset);```

            rl.close();

            process.exit(0);

            break;### 🔧 **Notas técnicas**

        - El GUI llama al core con `--search` y `--search-json` para obtener resultados estructurados via yt-dlp.

        default:- Calidad y formato globales (selectores en la UI) se aplican a las descargas desde tarjetas y al lote.

            console.log(colors.red + '\n❌ Opción inválida. Intenta de nuevo.\n' + colors.reset);- **Nuevo**: Integración del comando `--info` para pre-visualización de metadatos sin descarga.

            await menuPrincipal();

    }---

}

## 🌐 Frontend Web (React)

// Manejo de Ctrl+C

process.on('SIGINT', () => {Para guía completa del frontend en React (arranque, configuración, API y despliegue) consulta:

    console.log(colors.yellow + '\n\n👋 Deteniendo Deploy Manager...' + colors.reset);

    rl.close();- web/README.md

    process.exit(0);

});---



// Ejecutar## �📋 Recursos Extraíbles - Documentación Técnica Completa

menuPrincipal();

### 🎬 VIDEO (-v, --video)
**Carpeta:** `medios/Video/`  
**Comando:** `y2 -v <URL>` o `.\y2 -v <URL>`

#### Formatos Disponibles
- **MP4** (H.264) - *Recomendado para compatibilidad*
- **WEBM** (VP9) - *Mejor compresión*
- **MKV** (Matroska) - *Contenedor avanzado*
- **AVI** - *Compatibilidad legacy*
- **MOV** - *Formato Apple*

#### Calidades Disponibles
- **8K** (4320p) - *Ultra alta definición*
- **4K** (2160p) - *Ultra HD*
- **2K** (1440p) - *Quad HD*
- **Full HD** (1080p) - *Alta definición*
- **HD** (720p) - *Definición estándar*
- **SD** (480p, 360p, 240p) - *Definición estándar*

#### Características Especiales
- ✅ HDR (High Dynamic Range)
- ✅ 60fps disponible en calidades altas
- ✅ Subtítulos incrustados opcionales
- ✅ Múltiples pistas de audio

### 🎵 MUSIC (-m, --music)
**Carpeta:** `medios/Music/`  
**Comando:** `y2 -m <URL>` o `.\y2 -m <URL>`

#### Formatos Disponibles
- **MP3** (128k, 192k, 256k, 320k) - *Más compatible*
- **FLAC** - *Sin pérdida de calidad*
- **OGG** (Vorbis) - *Código abierto*
- **AAC** (M4A) - *Alta eficiencia*
- **OPUS** - *Mejor compresión moderna*
- **WAV** - *Sin compresión*

#### Calidades de Audio
- **320 kbps** - *Calidad máxima MP3*
- **256 kbps** - *Alta calidad*
- **192 kbps** - *Calidad estándar*
- **128 kbps** - *Calidad básica*
- **FLAC** - *Lossless (sin pérdida)*

### 🖼️ PICS (-p, --pics)
**Carpeta:** `medios/Pics/`  
**Comando:** `y2 -p <URL>` o `.\y2 -p <URL>`

#### Formatos Disponibles
- **JPG/JPEG** - *Fotografías optimizadas*
- **PNG** - *Imágenes con transparencia*
- **WEBP** - *Formato moderno Google*
- **AVIF** - *Próxima generación*

#### Resoluciones Disponibles
- **Original** - *Máxima resolución disponible*
- **4K** (3840×2160) - *Ultra alta resolución*
- **2K** (2560×1440) - *Alta resolución*
- **Full HD** (1920×1080) - *Resolución estándar*
- **HD** (1280×720) - *Resolución media*

### 📝 SUBTITLES (-s, --subtitles)
**Carpeta:** `medios/Subtitles/`  
**Comando:** `y2 -s <URL>` o `.\y2 -s <URL>`

#### Formatos Disponibles
- **SRT** - *SubRip Text (más compatible)*
- **VTT** - *WebVTT (estándar web)*
- **ASS/SSA** - *Advanced SubStation (efectos)*
- **TTML** - *Timed Text Markup*

#### Idiomas Disponibles
- 🇺🇸 **Inglés** - *Subtítulos originales*
- 🇪🇸 **Español** - *Traducciones*
- 🇫🇷 **Francés** - *Subtítulos franceses*
- 🇩🇪 **Alemán** - *Deutsche Untertitel*
- 🇮🇹 **Italiano** - *Sottotitoli italiani*
- 🇯🇵 **Japonés** - *日本語字幕*
- 🌍 **Y más...** - *Según disponibilidad*

### 📸 SCREENSHOTS (-c, --screenshots)
**Carpeta:** `medios/Screenshots/`  
**Comando:** `y2 -c <URL>` o `.\y2 -c <URL>`

#### Formatos Disponibles
- **PNG** - *Sin pérdida, transparencia*
- **JPG** - *Comprimido, menor tamaño*
- **WEBP** - *Moderno, eficiente*

#### Tipos de Capturas
- 🎬 **Automáticas** - *Cada X segundos*
- 📍 **Momentos clave** - *Escenas importantes*
- 🖼️ **Thumbnails** - *Miniaturas múltiples*

### 📊 METADATA (--meta)
**Carpeta:** `medios/Meta Info/`  
**Comando:** `y2 --meta <URL>` o `.\y2 --meta <URL>`

#### Información Extraída
```json
{
  "titulo": "Título completo del video",
  "canal": "Nombre del canal/autor",
  "duracion": "Duración en formato HH:MM:SS",
  "vistas": "Número de visualizaciones",
  "fecha_subida": "Fecha de publicación",
  "descripcion": "Descripción completa",
  "tags": ["tag1", "tag2", "tag3"],
  "calidad_maxima": "Máxima calidad disponible",
  "formatos_disponibles": ["mp4", "webm", "mkv"],
  "subtitulos_disponibles": ["es", "en", "fr"],
  "url_original": "URL del video"
}
```

### 🛠️ Configuraciones Avanzadas

#### Calidad Automática
```bash
# Mejor calidad disponible
y2 -v <URL> --best

# Calidad específica
y2 -v <URL> --quality 720p

# Todo el contenido
y2 -v -m -p -s -c <URL>
```

#### Filtros de Formato
```bash
# Solo MP4
y2 -v <URL> --format mp4

# Solo audio FLAC
y2 -m <URL> --format flac

# PNG para screenshots
y2 -c <URL> --format png
```

### 📁 Estructura de Carpetas
```
medios/
├── 📹 Video/
│   └── [Título]_[Calidad].[Formato]
├── 🎵 Music/
│   └── [Artista]_[Título].[Formato]
├── 🖼️ Pics/
│   └── [Título]_thumbnail.[Formato]
├── 📝 Subtitles/
│   └── [Título]_[Idioma].srt
├── 📸 Screenshots/
│   └── [Título]_screenshot_[N].[Formato]
└── 📊 Meta Info/
    └── [Título]_metadata.json
```

### 🔥 Ejemplos de Uso Técnico

```bash
# Extracción completa en máxima calidad
y2 -v -m -p -s -c --best "https://youtube.com/watch?v=VIDEO_ID"

# Solo audio FLAC sin pérdida
y2 -m --format flac --quality best "https://youtube.com/watch?v=MUSIC_ID"

# Screenshots cada 10 segundos en PNG
y2 -c --interval 10s --format png "https://youtube.com/watch?v=VIDEO_ID"

# Subtítulos en múltiples idiomas
y2 -s --all-languages "https://youtube.com/watch?v=VIDEO_ID"
```

---

## ⚡ Acceso Directo - Comando Corto `y2`

### 🎯 **Comandos Rápidos**
```bash
# ✅ YA DISPONIBLE - Comandos cortos funcionando
# Unix/Linux/macOS
y2 --all dQw4w9WgXcQ                    # Descargar todo
y2 --video YQHsXMglC9A --quality 720p   # Solo video
y2 --music kffacxfA7G4                  # Solo audio
y2 --search "Karol G Viña del Mar"      # Búsqueda interactiva
y2 --gui                                # Abrir GUI con Electron

# Windows (CMD - ✅ RECOMENDADO)
.\y2 --all dQw4w9WgXcQ                  # Descargar todo
.\y2 --video YQHsXMglC9A --quality 720p # Solo video  
.\y2 --music kffacxfA7G4                # Solo audio
.\y2 --search "Emmilia Viña del Mar"    # Búsqueda interactiva
.\y2 --gui                              # Abrir GUI con Electron
```

### 🔧 **Instalación de Accesos Directos**

#### 🐧 **Unix/Linux/macOS**
```bash
# Opción 1: Instalación Global (Recomendada)
sudo cp y2 /usr/local/bin/y2
sudo chmod +x /usr/local/bin/y2

# Usar desde cualquier directorio
y2 --all dQw4w9WgXcQ

# Opción 2: Uso Local
chmod +x y2
./y2 --all dQw4w9WgXcQ
```

#### 🪟 **Windows**
```cmd
# ✅ RECOMENDADO: CMD Script
.\y2 --all dQw4w9WgXcQ
.\y2 --search "Emmilia Viña del Mar"

# Opción 2: Agregar al PATH (Avanzada)
# Agregar directorio Y2Back al PATH del sistema
# Después: y2 --all dQw4w9WgXcQ
```

### 🔍 **Troubleshooting Accesos Directos**

#### ❌ **"Node.js no encontrado"**
- **Solución**: Instalar Node.js desde https://nodejs.org/
- **Verificar**: `node --version`

#### ❌ **"y2back.js no encontrado"**
- **Solución**: Ejecutar desde el directorio correcto de Y2Back
- **Verificar**: Que existe el archivo `y2back.js` en el directorio

#### ❌ **"Permission denied" (Unix/Linux/macOS)**
- **Solución**: `chmod +x y2`

✅ **El script `y2.cmd` funciona perfectamente en Windows CMD y PowerShell**

---

 

---

## 🚀 Tabla Completa de Flags - Y2Back v2.0.0

### 📥 **Modos de Descarga Principales**
| Flag Largo | Atajo | Función | Ejemplo de Uso |
|------------|-------|---------|----------------|
| `--video` | `-v` | Descargar solo video en MP4/WebM/MKV | `y2 -v -u "dQw4w9WgXcQ"` |
| `--music` | `-m` | Extraer solo audio/música en MP3/FLAC/OGG | `y2 -m -u "dQw4w9WgXcQ"` |
| `--pics` | `-p` | Descargar solo imágenes/thumbnails | `y2 -p -u "dQw4w9WgXcQ"` |
| `--subtitles` | `-s` | Descargar solo subtítulos SRT/VTT/ASS | `y2 -s -u "dQw4w9WgXcQ"` |
| `--screenshots` | `-c` | Generar capturas de pantalla específicas | `y2 -c -u "dQw4w9WgXcQ"` |
| `--meta` | `-M` | Extraer solo metadatos con Puppeteer | `y2 -M -u "dQw4w9WgXcQ"` |
| `--all` | `-a` | Descargar TODO el contenido disponible | `y2 -a -u "dQw4w9WgXcQ"` |
| `--playlist` | `-P` | Modo playlist (legacy, futuro) | `y2 -P -u "PLAYLIST_URL"` |

### 🔧 **Opciones de Configuración**
| Flag Largo | Atajo | Función | Valores Permitidos | Ejemplo |
|------------|-------|---------|-------------------|---------|
| `--url` | `-u` | Especificar URL del video | URL de YouTube o ID del video | `y2 -v -u "https://youtu.be/dQw4w9WgXcQ"` |
| `--quality` | `-q` | Calidad de video | `240p`, `360p`, `480p`, `720p`, `1080p`, `1440p`, `2160p`, `4320p`, `best`, `worst` | `y2 -v -u "URL" -q 1080p` |
| `--format` | `-f` | Formato de salida | **Video:** `mp4`, `webm`, `mkv`, `avi`, `mov`<br>**Audio:** `mp3`, `flac`, `ogg`, `aac`, `wav` | `y2 -v -u "URL" -f mp4` |

### 🔍 **Búsqueda y Exploración**
| Flag Largo | Atajo | Función | Descripción | Ejemplo |
|------------|-------|---------|-------------|---------|
| `--search` | `-S` | Buscar videos en YouTube | Búsqueda interactiva con selección de resultados | `y2 -S "Karol G Viña del Mar"` |
| `--search-json` | — | Resultados en JSON (para integraciones/GUI) | Devuelve lista estructurada con id, title, duration, thumbnail, url, uploader | `node y2back.js --search "Karol G" --search-json --limit 5` |
| `--limit` | — | Límite de resultados de búsqueda | Número entre 1 y 50 (por defecto 10) | `--limit 10` |
| `--file` | — | Crear/limpiar archivo `descargas.txt` y registrar N URLs | Solicita N enlaces válidos e inserta 1 por línea | `node y2back.js --file 12` |
| `--downfile` | — | Descargar todas las URLs de `descargas.txt` | Combina con `--all` o con `--video/--music/...` y opciones globales | `node y2back.js --downfile --all` |

Ejemplo rápido (PowerShell):

```powershell
node y2back.js --search "Karol G" --search-json --limit 1 | Out-Host
```

### ℹ️ **Información y Utilidades**
| Flag Largo | Atajo | Función | Descripción | Ejemplo |
|------------|-------|---------|-------------|---------|
| `--info` | — | Extraer metadatos JSON | Información completa del video sin descarga | `y2 --info -u "dQw4w9WgXcQ"` |
| `--help` | `-h` | Mostrar ayuda completa | Banner educativo con ejemplos y documentación | `y2 -h` |
| `--version` | `-V` | Mostrar versión del sistema | Información de versión Y2Back, Node.js y plataforma | `y2 -V` |
| `--author` | `-A` | Información del desarrollador | Datos de contacto, licencia y repositorio | `y2 -A` |
| `--verify` | `-y` | Verificar integridad de archivos | Escanea archivos descargados y valida integridad | `y2 -y` |
| `--check` | `-k` | Verificar integridad (alias) | Mismo que --verify, alias alternativo | `y2 -k` |

### 🎯 **Combinaciones de Flags Útiles**
| Combinación | Descripción | Ejemplo |
|-------------|-------------|---------|
| `-v -q best -f mp4` | Video en máxima calidad MP4 | `y2 -v -u "URL" -q best -f mp4` |
| `-m -q best -f flac` | Audio sin pérdida FLAC | `y2 -m -u "URL" -q best -f flac` |
| `-a -q 1080p` | Todo el contenido en HD | `y2 -a -u "URL" -q 1080p` |
| `-S "término"` | Búsqueda y descarga interactiva | `y2 -S "Bad Bunny concierto"` |

### 💡 **Notas Importantes**
- **Calidad por defecto**: `1080p` (Full HD) si no se especifica `--quality`
- **Formatos por defecto**: `mp4` para video, `mp3` para audio si no se especifica `--format`
- **Atajo `-c`**: Corresponde a `--screenshots` (capturas), no confundir con "canal"
- **Atajo `-M`**: Mayúscula para `--meta` (metadatos con Puppeteer)
- **Nuevos atajos**: `-y` para `--verify` y `-k` para `--check` (ambos verifican integridad)
- **Búsqueda interactiva**: `--search` es naturalmente interactivo, muestra resultados y permite seleccionar
- **Calidades 4K+**: Requieren más RAM y espacio en disco
- **Modo `--all`**: Descarga video+audio+pics+subtitles+screenshots+metadata automáticamente
- **Sin ffmpeg**: Si `ffmpeg` no está disponible, Y2Back funciona igualmente ofreciendo formatos "progresivos" (video+audio en un solo archivo) que no requieren merge; algunas combinaciones de calidad/formato no aparecerán y no se realizará conversión ni remux.

## � **Resumen de Flags Creados**

En total, **Y2Back v2.0.0** tiene **17 flags únicos** organizados en 4 categorías:

1. **📥 Modos de Descarga (8 flags)**: `--video`, `--music`, `--pics`, `--subtitles`, `--screenshots`, `--meta`, `--all`, `--playlist`

2. **🔧 Configuración (3 flags)**: `--url`, `--quality`, `--format`

3. **🔍 Búsqueda (1 flag)**: `--search`

4. **ℹ️ Información (5 flags)**: `--help`, `--version`, `--author`, `--verify`, `--check`

**Valores por defecto:**
- **Calidad de video**: `1080p` (Full HD)
- **Formato de video**: `mp4`
- **Formato de audio**: `mp3`

Todos los flags tienen sus respectivos atajos cortos y están completamente implementados en el código con validación de argumentos y manejo de errores robusto.

---
```bash
# Ejemplos básicos
y2 -v -u "VIDEO_URL"              # Video directo
y2 -m -u "VIDEO_URL"              # Solo audio
y2 -a -u "VIDEO_URL"              # Todo el contenido
y2 -S "término búsqueda"          # Búsqueda interactiva

# Con opciones de calidad
y2 -v -u "URL" -q 1080p -f mp4    # Video HD en MP4
y2 -m -u "URL" -q best -f flac    # Audio mejor calidad en FLAC

# Información del sistema
y2 -h                             # Ayuda
y2 -V                             # Versión
y2 -A                             # Autor
```

---

## 📋 Guía de Uso

### 🚀 **Inicio Rápido**

#### **💡 Método Directo (Sin argumentos)**
```bash
# Mostrar ayuda completa
node y2back.js                    # Banner educativo con ejemplos
y2                                  # Con acceso directo

# Modo interactivo automático
node y2back.js --video            # Te pregunta la URL
node y2back.js --search           # Te pregunta qué buscar
```

#### **🔍 Búsqueda Interactiva (NUEVO)**
```bash
# Buscar contenido en YouTube
node y2back.js --search "Karol G Viña del Mar"  # o -S
node y2back.js -S "Bad Bunny concierto"
y2 -S "Emmilia Viña del Mar"                      # Con acceso directo

# Proceso de búsqueda:
# 1. Muestra resultados con título, canal y duración
# 2. Seleccionas el video que quieres
# 3. Eliges tipo de descarga (video/audio/metadata)
# 4. Descarga automática con verificación
```

### ⚡ **Modo Automático - Para Scripts**

#### **🎥 Descarga Directa por Tipo**
```bash
# Videos
node y2back.js --video --url "https://youtu.be/dQw4w9WgXcQ"  # o -v -u
node y2back.js -v -u "https://youtu.be/dQw4w9WgXcQ"
y2 -v -u "https://youtu.be/dQw4w9WgXcQ"                       # Con acceso directo

# Audio/Música
node y2back.js --music --url "https://youtu.be/dQw4w9WgXcQ"  # o -m -u  
node y2back.js -m -u "https://youtu.be/dQw4w9WgXcQ"
y2 -m -u "https://youtu.be/dQw4w9WgXcQ"                       # Con acceso directo

# Solo metadatos
node y2back.js --meta --url "https://youtu.be/dQw4w9WgXcQ"   # o -M -u
node y2back.js -M -u "https://youtu.be/dQw4w9WgXcQ"
y2 -M -u "https://youtu.be/dQw4w9WgXcQ"                       # Con acceso directo

# Todo el contenido
node y2back.js --all --url "https://youtu.be/dQw4w9WgXcQ"    # o -a -u
node y2back.js -a -u "https://youtu.be/dQw4w9WgXcQ"
y2 -a -u "https://youtu.be/dQw4w9WgXcQ"                       # Con acceso directo
```

#### **🖼️ Contenido Específico**
```bash
# Solo imágenes/thumbnails
node y2back.js --pics --url "https://youtu.be/dQw4w9WgXcQ"  # o -p -u
node y2back.js -p -u "https://youtu.be/dQw4w9WgXcQ"
y2 -p -u "https://youtu.be/dQw4w9WgXcQ"                      # Con acceso directo

# Solo subtítulos
node y2back.js --subtitles --url "https://youtu.be/dQw4w9WgXcQ"  # o -s -u
node y2back.js -s -u "https://youtu.be/dQw4w9WgXcQ"
y2 -s -u "https://youtu.be/dQw4w9WgXcQ"                           # Con acceso directo

# Screenshots del video
node y2back.js --screenshots --url "https://youtu.be/dQw4w9WgXcQ"  # o -c -u
node y2back.js -c -u "https://youtu.be/dQw4w9WgXcQ"
y2 -c -u "https://youtu.be/dQw4w9WgXcQ"                             # Con acceso directo
```

### 🎯 **Ejemplos por Tipo de Contenido**

```bash
# BÚSQUEDA INTERACTIVA (RECOMENDADO)
node y2back.js -S "Karol G Viña del Mar"       # --search
node y2back.js --search "Bad Bunny concierto"
y2 -S "Emmilia Viña del Mar"                     # Con acceso directo

# VIDEOS INDIVIDUALES
node y2back.js -v -u "https://youtu.be/dQw4w9WgXcQ"        # --video --url
node y2back.js -v -u "https://youtube.com/watch?v=dQw4w9WgXcQ"
y2 -v -u "dQw4w9WgXcQ"                                       # Solo ID con acceso directo

# MÚSICA Y AUDIO
node y2back.js -m -u "https://youtube.com/watch?v=dQw4w9WgXcQ"  # --music --url
node y2back.js --music --url "https://youtu.be/dQw4w9WgXcQ"
y2 -m -u "dQw4w9WgXcQ"                                           # Solo ID con acceso directo

# CON OPCIONES DE CALIDAD
node y2back.js -v -u "URL" --quality 4k --format webm     # o -q -f
node y2back.js -m -u "URL" --quality best --format flac
y2 -v -u "dQw4w9WgXcQ" -q 1080p -f mp4                     # Con acceso directo
```

### 📚 **Ayuda e Información**
```bash
# Información del sistema
node y2back.js --help             # o -h    Ayuda rápida
node y2back.js --version          # o -V    Versión del sistema
node y2back.js --author           # o -A    Información del autor
node y2back.js --verify           # Verificar integridad de archivos
node y2back.js --info --url "URL" # Metadatos JSON sin descarga

# Con accesos directos
y2 -h                               # Ayuda
y2 -V                               # Versión
y2 -A                               # Autor
y2 --info -u "dQw4w9WgXcQ"          # Información JSON del video
```

### 🎬 **IDs de Video para Pruebas**
- `dQw4w9WgXcQ` - Rick Astley - Never Gonna Give You Up
- `YQHsXMglC9A` - Adele - Hello
- `kffacxfA7G4` - Baby Shark Dance
- `JGwWNGJdvx8` - Ed Sheeran - Shape of You
- `fJ9rUzIMcZQ` - Queen - Bohemian Rhapsody

---

## 🔧 **Estructura de Archivos**

### 📁 **Organización Automática**

```
Y2Back/
├── y2back.js               # 🚀 Script principal
├── y2                        # 🐧 Script acceso directo Unix/Linux/macOS
├── y2.cmd                    # 🪟 Script acceso directo Windows CMD ✅ RECOMENDADO
├── README_ACCESO_DIRECTO.md  # 📚 Documentación de accesos directos
├── descarga_masiva.js        # 📦 Script de descarga masiva
├── medios/                   # 📁 Directorio principal de descargas
│   ├── Respaldos/            # 📋 Metadatos y respaldos completos
│   │   ├── Video_Title_backup.json
│   │   ├── Playlist_Name_backup.json
│   │   ├── Channel_Info_backup.json
│   │   └── Download_History.json
│   ├── Audio/                # 🔊 Archivos de audio
│   │   ├── Artist - Song.mp3
│   │   ├── Artist - Song.m4a
│   │   └── Artist - Song.webm
│   ├── Video/                # 📹 Archivos de video
│   │   ├── Video_Title.mp4
│   │   ├── Video_Title.webm
│   │   └── Video_Title.mkv
│   ├── Imagenes/             # 🖼️ Imágenes y thumbnails
│   │   ├── Thumbnails/
│   │   │   ├── Video_Title_maxres.jpg
│   │   │   ├── Video_Title_high.jpg
│   │   │   └── Video_Title_medium.jpg
│   │   ├── Caratulas/
│   │   │   ├── Playlist_Cover.png
│   │   │   └── Channel_Avatar.webp
│   │   └── Capturas/         # (futuro)
│   │       ├── Video_Title_frame_30s.jpg
│   │       └── Video_Title_frame_60s.jpg
│   ├── PlayList/             # 📋 Playlists organizadas
│   │   ├── Playlist_Name/
│   │   │   ├── 01 - First_Video.mp4
│   │   │   ├── 02 - Second_Video.mp4
│   │   │   └── playlist_info.json
│   ├── Subtitles/            # 📄 Subtítulos
│   │   ├── Video_Title.srt
│   │   ├── Video_Title.vtt
│   │   └── Video_Title.ass
│   └── Meta Info/            # 📊 Metadatos adicionales
│       ├── Video_Title_info.json
│       ├── Video_Title_stats.json
│       └── Video_Title_comments.json
```

### 🎯 **Tipos de Archivo Soportados**

#### 📹 **Video**
- **MP4**: 1080p, 720p, 480p, 360p (codec H.264)
- **WebM**: 1440p, 1080p, 720p (codec VP9)
- **MKV**: Contenedor universal para alta calidad

#### 🔊 **Audio**
- **MP3**: 128kbps, 192kbps, 320kbps (codec MP3)
- **M4A**: 128kbps, 256kbps (codec AAC)
- **WebM**: 160kbps, 128kbps (codec Opus)

#### 📄 **Respaldos y Metadatos**
- **JSON**: Metadatos completos de videos, playlists, canales
- **TXT**: Transcripciones y descripciones de contenido
- **CSV**: Datos tabulares para análisis y reportes
- **XML**: Formatos estructurados para intercambio de datos

#### 📄 **Subtítulos**
- **SRT**: Formato estándar de subtítulos
- **VTT**: Subtítulos web (WebVTT)
- **ASS**: Subtítulos avanzados con formato

#### 🖼️ **Imágenes**
- **JPG**: Thumbnails estándar y capturas
- **WebP**: Formato moderno optimizado
- **PNG**: Alta calidad para carátulas y avatares

---

## 🛠️ **Instalación y Configuración**

### ⚙️ **Requisitos del Sistema**

#### 🖥️ **Software Base**
- **Node.js**: >= 18.0.0 (Recomendado: LTS actual 20.x)
- **npm**: >= 9.0.0 (incluido con Node.js 18+)
- **yt-dlp**: Motor de descarga (se instala automáticamente)
- **Sistema Operativo**: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)

#### 💾 **Requisitos de Hardware**
- **Memoria RAM**: 
  - Mínimo: 2GB RAM
  - Recomendado: 4GB+ para videos de alta calidad
- **Espacio en Disco**: 
  - Base: 100MB (Y2Back + dependencias)
  - Videos: Variable según contenido descargado
- **Procesador**: Dual-core 1.5GHz+ (videos 4K se benefician de más cores)

#### 🌍 **Conectividad**
- **Internet**: Requerido para descargar videos de YouTube
- **Proxy**: Compatible (configurar via variables de entorno)
- **Firewall**: Debe permitir conexiones HTTP/HTTPS salientes

### 📥 **Instalación**

#### 🚀 **Instalación Rápida con Comando `y2b`**
```bash
# 1. Clona el repositorio
git clone https://github.com/davidvalsep/y2back.git
cd y2back

# 2. Instala dependencias (incluye yt-dlp automáticamente)
npm install

# 3. Configura el comando corto 'y2b'
npm run install-y2b

# 4. ¡Listo! Ahora puedes usar:
y2b --version
y2b -v -u "https://youtu.be/dQw4w9WgXcQ"
```

#### 🔧 **Instalación con yt-dlp Manual (Opcional)**
```bash
# Si prefieres instalar yt-dlp por separado
pip install yt-dlp

# O usando package manager del sistema
# Ubuntu/Debian:
apt install yt-dlp

# macOS:
brew install yt-dlp

# Windows (con Chocolatey):
choco install yt-dlp
```

### 🧪 **Verificación de Instalación**
```bash
# Script automático de verificación completa
npm run check                       # o node check-requirements.js

# Verificaciones manuales
node --version                      # Debe mostrar >= 18.0.0
npm --version                       # Debe mostrar >= 9.0.0
node y2back.js --version           # Debe mostrar v2.0.0

# Prueba básica con video de ejemplo
node y2back.js -v --url="https://youtu.be/dQw4w9WgXcQ"
```

---

## 🌐 **URLs Soportadas**

### 📋 **Formatos de YouTube**

#### ✅ **URLs Válidas**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/embed/dQw4w9WgXcQ
https://m.youtube.com/watch?v=dQw4w9WgXcQ
https://youtube.com/watch?v=dQw4w9WgXcQ&t=30s
dQw4w9WgXcQ                                    # Solo ID del video
```

#### 📋 **Playlists**
```
https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLMnqVYTe
https://youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmRdnEQy6nuLMnqVYTe
```

#### 👥 **Canales (futuro)**
```
https://www.youtube.com/@channelname
https://youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw
https://youtube.com/c/channelname
https://youtube.com/user/username
```

### 🚫 **URLs No Soportadas**
- Videos privados o eliminados
- Lives en tiempo real (streams activos)
- Videos con restricción geográfica
- Contenido que requiere suscripción de pago

---

### � **Casos de Uso Expandidos**

### 🎓 **Educación y Investigación**
- **Preservación de conferencias**: Respaldo completo con metadatos y transcripciones
- **Material de estudio**: Descarga offline con imágenes de apoyo y subtítulos
- **Archivo de documentales**: Preservación multimedia con información de contexto
- **Investigación multimedia**: Análisis de contenido con datos estructurados
- **Bibliotecas digitales**: Organización de contenido educativo por categorías

### 🎵 **Música y Audio**
- **Backup de música**: Respaldo personal con carátulas y metadatos
- **Podcasts y audiolibros**: Descarga para escucha offline con thumbnails
- **Mixes y DJ sets**: Preservación con información de tracklist
- **Entrevistas**: Archivo con transcripciones automáticas
- **Conciertos**: Backup de presentaciones en vivo con imágenes

### 📺 **Contenido de Video**
- **Backup personal**: Respaldo de videos favoritos con información completa
- **Contenido educativo**: Tutoriales con capturas de pantalla para referencia
- **Entretenimiento**: Series y programas con metadatos organizados
- **Archivo familiar**: Preservación de momentos con datos de contexto
- **Colecciones temáticas**: Organización por categorías con imágenes indexadas

### 💼 **Uso Profesional**
- **Marketing**: Análisis de contenido competitivo con datos estructurados
- **Producción**: Referencias para creadores con biblioteca de imágenes
- **Presentaciones**: Material multimedia con metadatos para presentaciones
- **Archivo corporativo**: Respaldo empresarial con indexación avanzada
- **Análisis de datos**: Extracción de métricas y estadísticas de contenido

---

## 🔍 **Solución de Problemas**

### 🛑 Nota importante (Windows): detener descargas activas

Si por cualquier motivo una descarga continúa ejecutándose (por ejemplo, cerraste el GUI/Electron o el backend no alcanzó a cancelar) puedes terminar los procesos de forma segura desde PowerShell:

```powershell
# Matar cualquier descarga activa de yt-dlp y ffmpeg (incluye procesos hijos)
taskkill /IM yt-dlp.exe /T /F
taskkill /IM ffmpeg.exe /T /F
```

Notas:
- Si ves "Access is denied", ejecuta PowerShell como Administrador.
- Úsalo solo cuando sepas que hay descargas activas pendientes; estos comandos cierran en seco cualquier proceso relacionado.
- Tras forzar la detención, vuelve a abrir el GUI o reinicia el backend antes de reintentar.

### 🌐 **Problemas con yt-dlp**

#### ❌ **Error: "yt-dlp: command not found"**
```bash
# Solución 1: Instalar yt-dlp con pip
pip install yt-dlp

# Solución 2: Usar package manager del sistema
# Ubuntu/Debian:
sudo apt install yt-dlp

# macOS:
brew install yt-dlp

# Windows (Chocolatey):
choco install yt-dlp
```

#### ❌ **Error: "Video unavailable"**
```bash
# Verificar que el video existe y es público
# Actualizar yt-dlp a la versión más reciente
pip install --upgrade yt-dlp

# Usar proxy si hay restricciones geográficas
yt-dlp --proxy socks5://127.0.2.1:1080 VIDEO_URL
```

### 💾 **Problemas de Espacio en Disco**
- **Videos 4K**: Pueden ocupar 1-5GB por video
- **Playlists largas**: Verificar espacio antes de descargar
- **Organización**: Usar la estructura de carpetas para gestionar espacio

### 🌍 **Problemas de Conectividad**
- **Proxy corporativo**: Configurar variables de entorno HTTP_PROXY/HTTPS_PROXY
- **Firewall**: Asegurar que puertos 80/443 estén abiertos
- **DNS**: Verificar resolución de youtube.com

---

## 📝 **Roadmap y Futuras Funcionalidades**

### 🔜 **v2.1.0 — Próxima menor**
- **Playlists completas**: Descarga secuencial con reintentos y reanudación; metadatos por ítem y limpieza automática de parciales (`.part`).
- **Verificación robusta**: Hash y validación post-descarga con reporte unificado.
- **Toggle `youtube-nocookie`**: Opción en GUI y flag en CLI (`--nocookie`) con persistencia.
- **Mejoras de GUI**: Pausar/reanudar cola, límites de concurrencia, progreso detallado.
- **FFmpeg avanzado**: Normalización de audio (opcional, `loudnorm`) y remux estable MP4/WebM.

### 🎯 **v2.2.0 — Planificado**
- **Canales**: Descarga por canal/@handle con respaldo incremental (solo nuevo contenido).
- **Empaquetado Electron**: Windows portable (.exe), Linux AppImage, macOS .dmg (sin notarizado inicialmente).
- **Descarga resumible**: Reintentos por rangos, throttling y soporte de proxy por comando.
- **Exportes**: Reportes en JSON/CSV de historial, errores y metadatos.

### 🚀 **Visión futura**
- **Plataformas adicionales (evaluación)**: Vimeo, Dailymotion según demanda.
- **API local/REST**: Integraciones y pipeline headless.
- **Modo Watch**: Monitoreo de playlists/canales y descarga automática de nuevos elementos.

---

## 👨‍💻 **Autor y Contacto**

**DavidValSep** - Desarrollador Full Stack especializado en sistemas de automatización y preservación de contenido digital.

### 📞 **Contacto Profesional**
- **📧 Email**: davidvalsep@gmail.com
- **🏢 Distribuidor**: SuSitio (https://susitio.cl)
- **📧 Soporte**: info@susitio.cl  
- **📞 WhatsApp**: +56 9 3962 0636
- **🐙 GitHub**: @DavidValSep

### 💼 **Servicios Comerciales**
- **🔧 Personalización**: Adaptación para necesidades específicas
- **🏢 Soporte Enterprise**: Instalación y configuración en servidores
- **📚 Consultoría**: Optimización para casos de uso complejos
- **🎓 Training**: Capacitación para equipos de desarrollo

---

## 📄 **Licencia GPL-3.0**

**Y2Back v2.0.0** está licenciado bajo **GNU General Public License v3.0**

### ✅ **Uso Comercial Permitido**
- **Servicios**: Puedes cobrar por instalación, soporte, personalización
- **Consultoría**: Ofrecer servicios profesionales basados en Y2Back
- **Distribución**: Vender como parte de soluciones más grandes
- **Modificación**: Crear versiones personalizadas para clientes

### ⚖️ **Requisitos de la Licencia**
- **Código Abierto**: Modificaciones deben mantenerse open source
- **Misma Licencia**: Trabajos derivados deben usar GPL-3.0
- **Atribución**: Mantener créditos y licencia original

---

📋 Consulta el archivo `LICENSE` para el texto completo de la licencia GPL-3.0.

---

**Y2Back v2.0.0** - La solución definitiva para descargar contenido de YouTube con **Accesos Directos Multiplataforma**.

🚀 **¡Pruébalo ahora con accesos directos!**

```bash
# Unix/Linux/macOS
y2 --all dQw4w9WgXcQ
y2 --search "Karol G Viña del Mar"

# Windows CMD ✅ RECOMENDADO
.\y2 --all dQw4w9WgXcQ
.\y2 --search "Emmilia Viña del Mar"
```

📋 **¡Comandos más cortos, misma funcionalidad!**  
🖼️ **¡Extrae todo el contenido con un solo comando!**  
🔍 **¡Búsqueda integrada directamente en YouTube!**

---

## 🌐 URLs Soportadas

### 📋 **Formatos de YouTube Válidos**
```bash
# URLs completas
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/embed/dQw4w9WgXcQ
https://m.youtube.com/watch?v=dQw4w9WgXcQ
https://youtube.com/watch?v=dQw4w9WgXcQ&t=30s

# Solo ID del video
dQw4w9WgXcQ

# Playlists (futuro)
https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLMnqVYTe
https://youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmRdnEQy6nuLMnqVYTe
```

### 🚫 **URLs No Soportadas**
- Videos privados o eliminados
- Lives en tiempo real (streams activos)
- Videos con restricción geográfica
- Contenido que requiere suscripción de pago

---

## 🛠️ Instalación y Configuración

### ⚙️ **Requisitos del Sistema**

#### 🖥️ **Software Base**
- **Node.js**: >= 18.0.0 (Recomendado: LTS actual 20.x)
- **npm**: >= 9.0.0 (incluido con Node.js 18+)
- **yt-dlp**: Motor de descarga (se instala automáticamente)
- **Sistema Operativo**: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)

#### 💾 **Requisitos de Hardware**
- **Memoria RAM**: 
  - Mínimo: 2GB RAM
  - Recomendado: 4GB+ para videos de alta calidad
- **Espacio en Disco**: 
  - Base: 100MB (Y2Back + dependencias)
  - Videos: Variable según contenido descargado
- **Procesador**: Dual-core 1.5GHz+ (videos 4K se benefician de más cores)

### 📥 **Instalación Rápida**
```bash
# 1. Clona el repositorio
git clone https://github.com/davidvalsep/y2back.git
cd y2back

# 2. Instala dependencias (incluye yt-dlp automáticamente)
npm install

# 3. ¡Listo! Ahora puedes usar:
node y2back.js --version
node y2back.js -v -u "https://youtu.be/dQw4w9WgXcQ"

# 4. Opcional: Configurar accesos directos (ver sección anterior)
```

### 🧪 **Verificación de Instalación**
```bash
# Verificaciones automáticas
node --version                      # Debe mostrar >= 18.0.0
npm --version                       # Debe mostrar >= 9.0.0
node y2back.js --version         # Debe mostrar v2.0.0

# Prueba básica con video de ejemplo
node y2back.js -v -u "https://youtu.be/dQw4w9WgXcQ"
```

---

## 🧭 Historia breve

Y2Back nace como una derivación enfocada en YouTube a partir de aprendizajes y patrones consolidados en ZiteBackJS (v3.x→v5.x), un sistema de clonado web con Puppeteer orientado a sitios modernos (SPA/React/Vue/Angular) y resiliencia total de recursos.

- De ZiteBackJS heredamos la filosofía de “disponibilidad primero”: detección y respaldo inteligente de recursos, capas de fallback, y experiencia guiada para el usuario.
- Con Y2Back trasladamos ese enfoque al ecosistema YouTube: descargas de video/audio, subtítulos, imágenes y metadatos con una GUI moderna (preview embebido con watchdog y fallbacks) y un CLI sólido con accesos directos multiplataforma.
- Objetivo compartido: automatización fiable, UX clara y resultados reproducibles en Windows, macOS y Linux.

Proyecto original que inspiró este trabajo:
- ZiteBackJS (by DavidValSep): https://github.com/DavidValSep/ZiteBackJS

---

## �📞 **Contacto y Soporte**

### 💬 **Canales de Soporte**
- **📧 Email**: davidvalsep@gmail.com
- **🏢 Distribuidor**: SuSitio (https://susitio.cl)
- **📧 Soporte**: info@susitio.cl  
- **📞 WhatsApp**: +56 9 3962 0636
- **🐙 GitHub**: @DavidValSep
- **💡 Issues**: Reporta bugs y sugerencias en GitHub Issues

### 🤝 **Contribuciones**
¡Las contribuciones son bienvenidas! Por favor:
1. Fork el repositorio
2. Crea una branch para tu feature
3. Añade tests si es necesario
4. Actualiza la documentación
5. Envía un Pull Request

---

**Así es [Y2Back](https://susitio.cl/y2back) v3.2.2** - Desarrollado por **DavidValSep** de **[SuSitio](https://susitio.cl/)**

*Rápido, simple y sin rodeos — Tus contenidos, donde quieras y como quieras.*

---

---