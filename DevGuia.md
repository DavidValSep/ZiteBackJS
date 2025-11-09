# 🛠️ **Guía de Desarrollo - Y2Back**

---

## 📋 **Información del Proyecto**

### 🎯 **Objetivos del Proyecto**
- **Primario**: Sistema robusto de respaldo de videos de YouTube
- **Secundario**: Expansión a Vimeo y otras plataformas
- **Filosofía**: Simplicidad, robustez y experiencia de usuario excelente
- **Inspiración**: Arquitectura probada de ZiteBack v3.6.7

### 🏗️ **Arquitectura del Sistema**

#### 📁 **Estructura de Directorios**
```
Y2Back/
├── .vscode/              # Configuración del entorno de desarrollo
├── node_modules/         # Dependencias instaladas
├── medios/              # Directorio principal de descargas
│   ├── Audio/           # Archivos de audio (.mp3, .m4a, .webm)
│   ├── Video/           # Archivos de video (.mp4, .webm, .mkv)
│   ├── PlayList/        # Playlists descargadas organizadas
│   ├── Subtitles/       # Subtítulos (.srt, .vtt, .ass)
│   ├── Meta Info/       # Metadatos JSON de videos
│   └── Caratula/        # Thumbnails y carátulas
├── install-y2b.js       # Instalador del comando corto 'y2b'
├── y2back.js           # Archivo principal de la aplicación
├── package.json         # Configuración de dependencias y scripts
├── README.md           # Documentación principal del usuario
└── TECHNICAL-SPECS.md   # Especificaciones técnicas detalladas
```

#### 🔧 **Módulos Principales**

1. **Motor de Descarga**
   - Interfaz con yt-dlp
   - Manejo de formatos y calidades
   - Descarga paralela (futuro)

2. **Procesador de URLs**
   - Validación de URLs de YouTube
   - Extracción de IDs de video
   - Soporte para diferentes formatos de URL

3. **Gestor de Archivos**
   - Organización automática por tipo
   - Nombres de archivo inteligentes
   - Verificación de duplicados

4. **Interfaz de Usuario**
   - Modo interactivo vs automático
   - Sistema de banderas y comandos
   - Feedback visual con loaders

---

## 🎯 **Patrones de Desarrollo**

### 📝 **Convenciones de Código**

#### **Nombres de Variables**
```javascript
// ✅ Correcto - Descriptivo y en español
const urlVideoYoutube = "https://youtube.com/watch?v=abc123";
const directorioDestino = "./medios/Video/";
const metadatosVideo = { titulo: "", duracion: "" };

// ❌ Incorrecto - Muy genérico
const url = "...";
const dir = "...";
const data = {};
```

#### **Funciones**
```javascript
// ✅ Correcto - Verbos descriptivos
async function descargarVideoYoutube(url, calidad) { }
async function extraerMetadatosVideo(videoId) { }
async function validarUrlYoutube(url) { }

// ❌ Incorrecto - Muy genérico
async function download(url) { }
async function process(id) { }
```

#### **Constantes de Configuración**
```javascript
// ✅ Al inicio del archivo
const DIRECTORIO_BASE = "./medios/";
const CALIDAD_POR_DEFECTO = "720p";
const TIEMPO_ESPERA_DESCARGA = 30; // segundos
const MAX_REINTENTOS = 3;
```

### 🔄 **Flujo de Trabajo**

#### **1. Validación de Entrada**
```javascript
// Siempre validar antes de procesar
function validarUrlYoutube(url) {
    const patronesYoutube = [
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtu\.be\/([^?]+)/,
        /youtube\.com\/embed\/([^?]+)/
    ];
    // Lógica de validación...
}
```

#### **2. Extracción de Información**
```javascript
// Obtener metadatos antes de descargar
async function obtenerInfoVideo(videoId) {
    // Usar yt-dlp --dump-json
    // Retornar objeto con toda la información
}
```

#### **3. Descarga Organizada**
```javascript
// Determinar directorio según tipo de contenido
function determinarDirectorioDestino(tipoContenido, formatoArchivo) {
    const directorios = {
        'video': './medios/Video/',
        'audio': './medios/Audio/',
        'thumbnail': './medios/Caratula/',
        'subtitles': './medios/Subtitles/',
        'metadata': './medios/Meta Info/'
    };
    return directorios[tipoContenido];
}
```

---

## 🧪 **Testing y Calidad**

### 🎯 **URLs de Prueba**
```javascript
// URLs para testing durante desarrollo
const URL_PRUEBA_CORTA = "https://youtu.be/dQw4w9WgXcQ";     // Video corto
const URL_PRUEBA_LARGA = "https://youtube.com/watch?v=...";  // Video largo
const URL_PRUEBA_PLAYLIST = "https://youtube.com/playlist?list=...";
const URL_PRUEBA_CANAL = "https://youtube.com/@channelname";
```

### 🔍 **Casos de Prueba Esenciales**

1. **Validación de URLs**
   - URLs válidas de YouTube (diferentes formatos)
   - URLs inválidas (deben fallar elegantemente)
   - IDs de video directos

2. **Manejo de Errores**
   - Videos privados o eliminados
   - Problemas de conectividad
   - Formatos no disponibles

3. **Organización de Archivos**
   - Nombres de archivo con caracteres especiales
   - Videos con títulos muy largos
   - Duplicados (no reescribir)

---

## 🚀 **Proceso de Desarrollo**

### 📋 **Metodología**

#### **Fase 1: MVP (Minimum Viable Product)**
- [x] Estructura de directorios
- [ ] Archivo principal `y2back.js`
- [ ] Descarga de video individual
- [ ] Interfaz básica de comandos
- [ ] README.md completo

#### **Fase 2: Funcionalidades Core**
- [ ] Múltiples formatos y calidades
- [ ] Descarga de audio únicamente
- [ ] Extracción de metadatos
- [ ] Descarga de thumbnails
- [ ] Sistema de logging

#### **Fase 3: Experiencia de Usuario**
- [ ] Comando corto `y2b`
- [ ] Modo interactivo
- [ ] Progreso visual
- [ ] Manejo elegante de errores
- [ ] Documentación completa

#### **Fase 4: Funcionalidades Avanzadas**
- [ ] Soporte para playlists
- [ ] Descarga por canal
- [ ] Subtítulos automáticos
- [ ] Filtros de fecha

### 🔄 **Versionado**

#### **Esquema de Versiones**
- **Major (X.0.0)**: Cambios arquitectónicos importantes
- **Minor (0.X.0)**: Nuevas funcionalidades significativas
- **Patch (0.0.X)**: Correcciones de bugs y mejoras menores

#### **Ejemplos**
- `7.0.0`: Unificación de versiones y base sólida
- `7.1.0`: Agregado soporte para playlists  
- `7.1.1`: Corrección de bug en nombres de archivo
- `8.0.0`: Agregado soporte para Vimeo (nueva plataforma)

---

## 📚 **Recursos y Referencias**

### 🔗 **Dependencias Principales**

#### **yt-dlp**
```bash
# Instalación
pip install yt-dlp

# Comandos básicos que usaremos
yt-dlp --dump-json VIDEO_URL          # Obtener metadatos
yt-dlp -f "best[height<=720]" VIDEO_URL  # Descargar calidad específica
yt-dlp --write-thumbnail VIDEO_URL     # Descargar thumbnail
```

#### **Node.js Modules**
```json
{
  "child_process": "Ejecutar comandos yt-dlp",
  "fs/promises": "Manejo de archivos asíncrono", 
  "path": "Manipulación de rutas",
  "readline": "Interfaz interactiva",
  "url": "Validación y parsing de URLs"
}
```

### 📖 **Inspiración de ZiteBack**

#### **Patrones Adoptados**
- ✅ **Banner educativo** cuando se ejecuta sin argumentos
- ✅ **Modo interactivo** vs automático
- ✅ **Banderas cortas** (-v, -a, -p) y largas (--video, --audio, --playlist)
- ✅ **Logging con emojis** para mejor UX
- ✅ **Validación estricta** de parámetros
- ✅ **Manejo robusto de errores**

#### **Adaptaciones para Y2Back**
- 🎥 **Foco en multimedia**: Video, audio, metadatos, thumbnails
- 📱 **Plataformas específicas**: YouTube, Vimeo (futuro)
- 🎯 **Preservación de contenido**: Énfasis en backup y archivo
- 🔧 **Dependencia externa**: Integración elegante con yt-dlp

---

## 🎯 **Objetivos de Calidad**

### ✅ **Criterios de Éxito**

1. **Usabilidad**
   - Comando intuitivo como ZiteBackJS
   - Documentación clara y completa
   - Mensajes de error útiles

2. **Robustez**
   - Manejo elegante de fallos de red
   - Validación completa de entrada
   - Recovery automático cuando sea posible

3. **Organización**
   - Estructura de archivos clara
   - Nombres de archivo consistentes
   - Metadatos preservados

4. **Mantenibilidad**
   - Código modular y comentado
   - Configuración centralizada
   - Testing automatizado (futuro)

---

*Última actualización: 27 de octubre de 2025*
*Documento vivo - Se actualiza con cada fase de desarrollo*