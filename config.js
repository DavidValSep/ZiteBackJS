/**
 * 🔧 Y2Back - Configuración Central
 * 
 * Este archivo centraliza toda la configuración del proyecto
 * incluyendo versiones, rutas, y constantes importantes.
 * 
 * @version 2.0.0
 * @author DavidValSep
 * @date 2025-10-27
 */

// 🎯 INFORMACIÓN DE VERSIÓN
const VERSION_CONFIG = {
    // Versión principal del proyecto
    VERSION: "3.2.2",
    VERSION_MAJOR: 3,
    VERSION_MINOR: 2,
    VERSION_PATCH: 2,
    
    // Información del release
    RELEASE_DATE: "2025-11-09",
    RELEASE_NAME: "Y2Back 3.2.2 - Deploy Manager Multiplataforma",
    
    // Compatibilidad
    NODE_MIN_VERSION: "18.0.0",
    NPM_MIN_VERSION: "9.0.0"
};

// 📁 CONFIGURACIÓN DE DIRECTORIOS
const DIR_CONFIG = {
    // Directorio base de medios
    BASE_DIR: "/www/medios/",
    
    // Subdirectorios de contenido principal
    VIDEO_DIR: "Video/",        // 🎬 Videos MP4/WebM/MKV
    MUSIC_DIR: "Music/",        // 🎵 Audio MP3/M4A/WebM
    PICS_DIR: "Pics/",          // 🖼️ Imágenes/Thumbnails/Covers
    SUBTITLES_DIR: "Subtitles/", // 📄 Subtítulos SRT/VTT/ASS
    SCREENSHOTS_DIR: "Screenshots/", // 📸 Capturas de pantalla
    
    // Subdirectorios de organización
    PLAYLIST_DIR: "PlayList/",
    METADATA_DIR: "Meta Info/",
    
    // Directorios de sistema
    LOGS_DIR: "./logs/",
    TEMP_DIR: "./temp/",
    CONFIG_DIR: "./.config/"
};

// ⚙️ CONFIGURACIÓN DE LA APLICACIÓN
const APP_CONFIG = {
    // Información básica
    NAME: "Y2Back",
    DESCRIPTION: "Sistema Avanzado de Video, Music, Pics, Subtitles y Screenshots de YouTube",
    AUTHOR: "DavidValSep",
    LICENSE: "GPL-3.0",
    
    // URLs del proyecto
    REPOSITORY: "https://github.com/davidvalsep/y2back",
    HOMEPAGE: "https://susitio.cl/y2back",
    ISSUES: "https://github.com/davidvalsep/y2back/issues",
    
    // Contacto
    EMAIL: "davidvalsep@gmail.com",
    SUPPORT_EMAIL: "info@susitio.cl",
    WHATSAPP: "+56 9 3962 0636"
};

// 🎬 CONFIGURACIÓN DE DESCARGA MULTIMEDIA
const DOWNLOAD_CONFIG = {
    // Calidades por defecto
    DEFAULT_VIDEO_QUALITY: "best[height<=1080]",
    DEFAULT_AUDIO_FORMAT: "mp3",
    DEFAULT_AUDIO_BITRATE: "192k",
    DEFAULT_IMAGE_FORMAT: "jpg",
    
    // Opciones de descarga
    DOWNLOAD_THUMBNAILS: true,
    DOWNLOAD_METADATA: true,
    DOWNLOAD_SUBTITLES: true,
    DOWNLOAD_PICS: true,
    DOWNLOAD_SCREENSHOTS: false,
    
    // Límites
    MAX_RETRIES: 3,
    TIMEOUT_SECONDS: 300,
    MAX_FILESIZE: "2G",
    MAX_PLAYLIST_SIZE: 100,
    
    // Formatos soportados
    SUPPORTED_VIDEO_FORMATS: ["mp4", "webm", "mkv"],
    SUPPORTED_MUSIC_FORMATS: ["mp3", "m4a", "webm"],
    SUPPORTED_PICS_FORMATS: ["jpg", "jpeg", "png", "webp"],
    SUPPORTED_SUBTITLE_FORMATS: ["srt", "vtt", "ass"],
    SUPPORTED_SCREENSHOT_FORMATS: ["jpg", "png"]
};

// 🎨 CONFIGURACIÓN DE INTERFAZ
const UI_CONFIG = {
    // Comandos
    SHORT_COMMAND: "y2",
    MAIN_SCRIPT: "y2back.js",
    INSTALLER_SCRIPT: "install-y2.js",
    
    // Emojis para mensajes
    EMOJIS: {
        SUCCESS: "✅",
        ERROR: "❌", 
        WARNING: "⚠️",
        INFO: "ℹ️",
        PROGRESS: "⏳",
        VIDEO: "🎬",
        MUSIC: "🎵",
        PICS: "🖼️",
        SUBTITLES: "📄",
        SCREENSHOTS: "�",
        DOWNLOAD: "📥",
        FOLDER: "📁",
        ROCKET: "🚀",
        GEAR: "⚙️"
    },
    
    // Colores de terminal (ANSI)
    COLORS: {
        RESET: "\x1b[0m",
        BRIGHT: "\x1b[1m",
        DIM: "\x1b[2m",
        RED: "\x1b[31m",
        GREEN: "\x1b[32m",
        YELLOW: "\x1b[33m",
        BLUE: "\x1b[34m",
        MAGENTA: "\x1b[35m",
        CYAN: "\x1b[36m",
        WHITE: "\x1b[37m"
    }
};

// 🔗 CONFIGURACIÓN DE URLs DE YOUTUBE
const YOUTUBE_CONFIG = {
    // Patrones de URL soportados - EXPANDIDOS
    URL_PATTERNS: [
        // URLs completas con https/http
        /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:[&?].*)?/,
        /https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        /https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        /https?:\/\/(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        /https?:\/\/(?:www\.)?m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:[&?].*)?/,
        
        // URLs sin protocolo pero con www
        /(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:[&?].*)?/,
        /(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        /(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        /(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        
        // URLs solo con dominio
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:[&?].*)?/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        /youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        
        // URLs simplificadas sin /watch
        /youtube\.com\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?&].*)?/,
        
        // Solo ID del video
        /^([a-zA-Z0-9_-]{11})$/
    ],
    
    // Patrones de playlist
    PLAYLIST_PATTERNS: [
        /youtube\.com\/playlist\?list=([^&]+)/,
        /youtube\.com\/watch\?.*list=([^&]+)/
    ],
    
    // Patrones de canal
    CHANNEL_PATTERNS: [
        /youtube\.com\/@([^/?]+)/,
        /youtube\.com\/channel\/([^/?]+)/,
        /youtube\.com\/c\/([^/?]+)/,
        /youtube\.com\/user\/([^/?]+)/
    ]
};

// � CONFIGURACIÓN DE URLs DE VIMEO
const VIMEO_CONFIG = {
    // Patrones de URL soportados para videos individuales de Vimeo
    URL_PATTERNS: [
        // player.vimeo.com
        /https?:\/\/(?:www\.)?player\.vimeo\.com\/video\/(\d+)(?:[?&].*)?/,
        /player\.vimeo\.com\/video\/(\d+)(?:[?&].*)?/,

        // vimeo.com directo al ID
        /https?:\/\/(?:www\.)?vimeo\.com\/(\d+)(?:[?&].*)?/,
        /(?:www\.)?vimeo\.com\/(\d+)(?:[?&].*)?/,
        /vimeo\.com\/(\d+)(?:[?&].*)?/,

        // canales, grupos, on demand (ID al final)
        /https?:\/\/(?:www\.)?vimeo\.com\/channels\/[^/]+\/(\d+)(?:[?&].*)?/,
        /vimeo\.com\/channels\/[^/]+\/(\d+)(?:[?&].*)?/,
        /https?:\/\/(?:www\.)?vimeo\.com\/groups\/[^/]+\/videos\/(\d+)(?:[?&].*)?/,
        /vimeo\.com\/groups\/[^/]+\/videos\/(\d+)(?:[?&].*)?/,
        /https?:\/\/(?:www\.)?vimeo\.com\/ondemand\/[^/]+\/(\d+)(?:[?&].*)?/,
        /vimeo\.com\/ondemand\/[^/]+\/(\d+)(?:[?&].*)?/,

        // Solo ID numérico (6-12 dígitos típicamente)
        /^(\d{6,12})$/
    ]
};

// 🌐 CONFIGURACIÓN DE URLs DE FACEBOOK
const FACEBOOK_CONFIG = {
    URL_PATTERNS: [
        // Videos regulares
        /https?:\/\/(?:www\.)?facebook\.com\/watch\/?\?v=(\d+)(?:[?&].*)?/,
        /https?:\/\/(?:www\.)?facebook\.com\/(?:[^\/]+)\/videos\/(\d+)(?:[?&].*)?/,
        /(?:www\.)?facebook\.com\/watch\/?\?v=(\d+)(?:[?&].*)?/,
        /(?:www\.)?facebook\.com\/(?:[^\/]+)\/videos\/(\d+)(?:[?&].*)?/,
        /fb\.watch\/[A-Za-z0-9_-]+\/?/,
        // Reels
        /https?:\/\/(?:www\.)?facebook\.com\/reel\/([A-Za-z0-9_-]+)(?:[?&].*)?/,
        /(?:www\.)?facebook\.com\/reel\/([A-Za-z0-9_-]+)(?:[?&].*)?/
    ]
};

// 📸 CONFIGURACIÓN DE URLs DE INSTAGRAM
const INSTAGRAM_CONFIG = {
    URL_PATTERNS: [
        // Reels y posts
        /https?:\/\/(?:www\.)?instagram\.com\/reel\/([A-Za-z0-9_-]+)\/?(?:[?&].*)?/,
        /https?:\/\/(?:www\.)?instagram\.com\/p\/([A-Za-z0-9_-]+)\/?(?:[?&].*)?/,
        /https?:\/\/(?:www\.)?instagram\.com\/tv\/([A-Za-z0-9_-]+)\/?(?:[?&].*)?/,
        /(?:www\.)?instagram\.com\/reel\/([A-Za-z0-9_-]+)\/?(?:[?&].*)?/,
        /(?:www\.)?instagram\.com\/p\/([A-Za-z0-9_-]+)\/?(?:[?&].*)?/
    ]
};

// 🎵 CONFIGURACIÓN DE URLs DE TIKTOK
const TIKTOK_CONFIG = {
    URL_PATTERNS: [
        /https?:\/\/(?:www\.)?tiktok\.com\/@[^\/]+\/video\/(\d+)(?:[?&].*)?/,
        /(?:www\.)?tiktok\.com\/@[^\/]+\/video\/(\d+)(?:[?&].*)?/,
        // Enlaces cortos
        /https?:\/\/(?:www\.)?vt\.tiktok\.com\/[A-Za-z0-9]+\/?/
    ]
};

// �📊 CONFIGURACIÓN DE LOGGING
const LOG_CONFIG = {
    // Niveles de log
    LEVELS: {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3,
        TRACE: 4
    },
    
    // Configuración por defecto
    DEFAULT_LEVEL: 2, // INFO
    LOG_TO_FILE: true,
    LOG_TO_CONSOLE: true,
    MAX_LOG_SIZE: "10MB",
    MAX_LOG_FILES: 5
};

// 🧪 CONFIGURACIÓN DE TESTING
const TEST_CONFIG = {
    // URLs de prueba
    TEST_URLS: {
        SHORT_VIDEO: "https://youtu.be/dQw4w9WgXcQ",
        LONG_VIDEO: "https://youtu.be/9bZkp7q19f0",
        WITH_SUBTITLES: "https://youtu.be/jNQXAC9IVRw",
        FOUR_K: "https://youtu.be/LXb3EKWsInQ",
        SPECIAL_CHARS: "https://youtu.be/kJQP7kiw5Fk",
        TEST_PLAYLIST: "https://youtube.com/playlist?list=PLrAXtmRdnEQy6nuLMnqVYTe"
    }
};

// 🚀 EXPORTACIÓN DE CONFIGURACIONES
module.exports = {
    VERSION_CONFIG,
    DIR_CONFIG,
    APP_CONFIG,
    DOWNLOAD_CONFIG,
    UI_CONFIG,
    YOUTUBE_CONFIG,
    VIMEO_CONFIG,
    FACEBOOK_CONFIG,
    INSTAGRAM_CONFIG,
    TIKTOK_CONFIG,
    LOG_CONFIG,
    TEST_CONFIG,
    
    // Funciones de utilidad
    getVersion: () => VERSION_CONFIG.VERSION,
    getFullVersion: () => `${APP_CONFIG.NAME} v${VERSION_CONFIG.VERSION}`,
    getBanner: () => `${UI_CONFIG.EMOJIS.ROCKET} ${APP_CONFIG.NAME} v${VERSION_CONFIG.VERSION}`,
    
    // Validación de versiones
    isCompatibleNodeVersion: (currentVersion) => {
        const [major, minor] = currentVersion.split('.').map(Number);
        const [reqMajor, reqMinor] = VERSION_CONFIG.NODE_MIN_VERSION.split('.').map(Number);
        return major > reqMajor || (major === reqMajor && minor >= reqMinor);
    }
};

// 📝 INFORMACIÓN DE ESTE ARCHIVO
/**
 * IMPORTANTE: Este archivo es la fuente única de verdad para versiones
 * 
 * Archivos que deben importar versión desde aquí:
 * - y2back.js (archivo principal)
 * - install-y2.js (instalador)
 * - package.json (mediante script de build)
 * 
 * Para actualizar versión del proyecto:
 * 1. Modificar VERSION_CONFIG.VERSION en este archivo
 * 2. Ejecutar script de actualización (futuro)
 * 3. Verificar todos los archivos listados en VER.md
 */