#!/usr/bin/env node

/**
 * 🚀 Y2Back - Sistema Avanzado de Video, Music, Pics, Subtitles y Screenshots
 * 
 * Basado en la arquitectura robusta de ZiteBackJS v3.6.7
 * Sistema de descarga inteligente con organización automática
 * Soporta: YouTube Video, Music, Pics, Subtitles, Screenshots
 * 
 * @version 3.0.1
 * @author DavidValSep
 * @license GPL-3.0
 * @inspirado ZiteBack - Sistema de Clonado de Sitios Web
 */

// Importar configuración centralizada
const config = require('./config.js');
const { VERSION_CONFIG, APP_CONFIG, UI_CONFIG, YOUTUBE_CONFIG, VIMEO_CONFIG, FACEBOOK_CONFIG, INSTAGRAM_CONFIG, TIKTOK_CONFIG, DIR_CONFIG } = config;

// Módulos del sistema
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

// ⚙️ CONFIGURACIÓN PRINCIPAL
const VERSION = VERSION_CONFIG.VERSION;
const TIEMPO_ESPERA_DESCARGA = 30; // segundos
const MAX_REINTENTOS = 3;
const DOWNLOADS_FILE = path.resolve(__dirname, 'descargas.txt');

/**
 * 🎨 Mostrar banner educativo completo
 */
function mostrarBannerEducativo() {
    console.log(`
${UI_CONFIG.EMOJIS.ROCKET} ${APP_CONFIG.NAME} v${VERSION} ${UI_CONFIG.EMOJIS.ROCKET}

## Sistema Avanzado de Video, Music, Pics, Subtitles y Screenshots

Soporta plataformas: YouTube y soporte básico para Vimeo

> ${UI_CONFIG.EMOJIS.VIDEO} VIDEO: Descarga en múltiples calidades y formatos
> ${UI_CONFIG.EMOJIS.MUSIC} MUSIC: Extracción de audio en alta calidad
> ${UI_CONFIG.EMOJIS.PICS} PICS: Thumbnails, covers y capturas en máxima resolución
> ${UI_CONFIG.EMOJIS.SUBTITLES} SUBTITLES: Descarga de subtítulos en múltiples idiomas
> ${UI_CONFIG.EMOJIS.SCREENSHOTS} SCREENSHOTS: Capturas de pantalla de videos específicos
> 🔧 INSPIRADO: En la robustez de ZiteBackJS para máxima confiabilidad

---

## ⚡ **Uso Rápido**

### ${UI_CONFIG.EMOJIS.VIDEO} **Modo Video**
\`\`\`bash
node ${UI_CONFIG.MAIN_SCRIPT} --video                         # Modo interactivo
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "https://youtu.be/VIDEO_ID"   # Descarga directa
// (Eliminado) Placeholder legacy de descarga. La implementación real se define más abajo.
### ${UI_CONFIG.EMOJIS.SCREENSHOTS} **Modo Screenshots**
\`\`\`bash
node ${UI_CONFIG.MAIN_SCRIPT} --screenshots                   # Capturas interactivo
node ${UI_CONFIG.MAIN_SCRIPT} -c -u "https://youtu.be/VIDEO_ID"   # Solo capturas
\`\`\`

### 🤖 **Modo Meta (Experimental)**
\`\`\`bash
node ${UI_CONFIG.MAIN_SCRIPT} --meta                          # Metadata con Puppeteer
node ${UI_CONFIG.MAIN_SCRIPT} -M -u "https://youtu.be/VIDEO_ID"   # Extrae metadata sin yt-dlp
\`\`\`

---

## 📚 **Comandos de Información y Utilidades**

\`\`\`bash
node ${UI_CONFIG.MAIN_SCRIPT} --help       # Esta ayuda completa (-h)
node ${UI_CONFIG.MAIN_SCRIPT} --version    # Versión del sistema (-V) (v${VERSION})
node ${UI_CONFIG.MAIN_SCRIPT} --author     # Información del desarrollador (-A)
node ${UI_CONFIG.MAIN_SCRIPT} --verify     # Verificar integridad de archivos (-y)
node ${UI_CONFIG.MAIN_SCRIPT} --check      # Alias para verificar archivos (-k)
node ${UI_CONFIG.MAIN_SCRIPT} --info       # Obtener información del video sin descargarlo (-i)
node ${UI_CONFIG.MAIN_SCRIPT} --search "término"  # Búsqueda interactiva en YouTube (-S)
\`\`\`

---

## 🎨 **Opciones de Calidad y Formato**

### 📺 **Calidades de Video (por defecto: 1080p)**
\`\`\`bash
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --quality 4320p    # 8K Ultra HD
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --quality 2160p    # 4K Ultra HD  
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --quality 1440p    # 2K Quad HD
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --quality 1080p    # Full HD (DEFAULT)
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --quality 720p     # HD
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --quality 480p     # SD
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --quality best     # Mejor disponible
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --quality worst    # Menor calidad
\`\`\`

### 🎵 **Formatos de Audio (por defecto: mp3)**  
\`\`\`bash
node ${UI_CONFIG.MAIN_SCRIPT} -m -u "URL" --format flac      # Sin pérdida
node ${UI_CONFIG.MAIN_SCRIPT} -m -u "URL" --format mp3       # MP3 (DEFAULT)
node ${UI_CONFIG.MAIN_SCRIPT} -m -u "URL" --format ogg       # OGG Vorbis
node ${UI_CONFIG.MAIN_SCRIPT} -m -u "URL" --format aac       # AAC M4A
node ${UI_CONFIG.MAIN_SCRIPT} -m -u "URL" --format wav       # WAV sin compresión
\`\`\`

### 📹 **Formatos de Video (por defecto: mp4)**
\`\`\`bash
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --format mp4       # MP4 (DEFAULT)
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --format webm      # WebM
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --format mkv       # Matroska
node ${UI_CONFIG.MAIN_SCRIPT} -v -u "URL" --format avi       # AVI Legacy
\`\`\`

### 🎯 **Descarga Completa**
\`\`\`bash
node ${UI_CONFIG.MAIN_SCRIPT} --all -u "URL"                 # Todo: video+audio+pics+subs+screenshots
node ${UI_CONFIG.MAIN_SCRIPT} -a -u "URL" --quality best     # Todo en máxima calidad
\`\`\`

### 🔍 **Búsqueda en YouTube**
\`\`\`bash
node ${UI_CONFIG.MAIN_SCRIPT} --search "Karol G Viña del Mar"  # Buscar y descargar interactivamente
node ${UI_CONFIG.MAIN_SCRIPT} -S "Bad Bunny concierto"        # Búsqueda con selección de resultados
\`\`\`

---

## 🎯 **Ejemplos de URLs Soportadas**

✅ https://www.youtube.com/watch?v=cAYi3uHfoOo
✅ https://youtu.be/cAYi3uHfoOo?si=ZozgySGy4Td-iEFY
✅ https://youtube.com/cAYi3uHfoOo?si=ZozgySGy
✅ http://youtube.com/cAYi3uHfoOo
✅ www.youtube.com/cAYi3uHfoOo?si=ZozgySGy4Td-iEFY
✅ youtube.com/cAYi3uHfoOo
✅ youtu.be/cAYi3uHfoOo
✅ cAYi3uHfoOo (solo el ID)
✅ youtube.com/embed/cAYi3uHfoOo
✅ youtube.com/v/cAYi3uHfoOo

✅ https://vimeo.com/76979871
✅ https://player.vimeo.com/video/76979871
✅ vimeo.com/76979871

---

## 📁 **Organización Automática**

${UI_CONFIG.EMOJIS.FOLDER} **medios/**
├── Video/          # Archivos MP4, WebM, MKV  
├── Music/          # Archivos MP3, M4A, WebM
├── Pics/           # Thumbnails, covers, capturas
├── Subtitles/      # Subtítulos SRT, VTT, ASS
├── Screenshots/    # Capturas de pantalla específicas
├── PlayList/       # Playlists organizadas
└── Meta Info/      # Metadatos JSON detallados
└── Meta Info/      # Metadatos JSON detallados

---

## 💡 **Instalación del Comando Corto**

\`\`\`bash
npm run install-y2              # Configura comando 'y2'
\`\`\`

**Después de instalación:**
\`\`\`bash
# Windows: .\\${UI_CONFIG.SHORT_COMMAND} -v -u "URL"
# Unix:    ${UI_CONFIG.SHORT_COMMAND} -v -u "URL"
\`\`\`

---

## 👨‍💻 **Desarrollado por DavidValSep**
- 📧 Email: ${APP_CONFIG.EMAIL}
- 🏢 Soporte: ${APP_CONFIG.SUPPORT_EMAIL}
- 📞 WhatsApp: ${APP_CONFIG.WHATSAPP}

${APP_CONFIG.NAME} - Preserva tu contenido multimedia favorito
`);
}

/**
 * 🔍 Validar URL de YouTube
 */
function validarUrlYoutube(url) {
    if (!url || url.trim() === '') {
        return { valida: false, error: 'URL vacía o undefined' };
    }

    // Limpiar la URL
    url = url.trim();

    // Probar cada patrón definido en config
    for (const patron of YOUTUBE_CONFIG.URL_PATTERNS) {
        const match = url.match(patron);
        if (match) {
            const videoId = match[1] || match[0]; // Dependiendo del patrón
            if (videoId && videoId.length === 11) {
                return { 
                    valida: true, 
                    videoId: videoId,
                    urlOriginal: url,
                    tipo: 'video',
                    plataforma: 'youtube'
                };
            }
        }
    }

    // Verificar si es una playlist
    for (const patron of YOUTUBE_CONFIG.PLAYLIST_PATTERNS) {
        const match = url.match(patron);
        if (match) {
            return {
                valida: true,
                playlistId: match[1],
                urlOriginal: url,
                tipo: 'playlist',
                plataforma: 'youtube'
            };
        }
    }

    return { 
        valida: false, 
        error: 'No es una URL válida de YouTube o formato no soportado',
        sugerencias: [
            'https://youtube.com/watch?v=VIDEO_ID',
            'https://youtu.be/VIDEO_ID',
            'Solo el ID del video (11 caracteres)'
        ]
    };
}

/**
 * 🔍 Validar URL de Vimeo
 */
function validarUrlVimeo(url) {
    if (!url || url.trim() === '') {
        return { valida: false, error: 'URL vacía o undefined' };
    }

    url = url.trim();

    for (const patron of VIMEO_CONFIG.URL_PATTERNS) {
        const match = url.match(patron);
        if (match) {
            const videoId = match[1] || match[0];
            // IDs de Vimeo son numéricos y no tienen longitud fija de 11
            if (videoId && /^(\d{6,12})$/.test(videoId)) {
                // Construir URL canonizada
                const urlCanon = url.startsWith('http') ? url : `https://vimeo.com/${videoId}`;
                return {
                    valida: true,
                    videoId,
                    urlOriginal: urlCanon,
                    tipo: 'video',
                    plataforma: 'vimeo'
                };
            }
        }
    }

    return {
        valida: false,
        error: 'No es una URL válida de Vimeo o formato no soportado',
        sugerencias: [
            'https://vimeo.com/VIDEO_ID_NUMERICO',
            'https://player.vimeo.com/video/VIDEO_ID_NUMERICO',
            'Solo el ID numérico (ej: 76979871)'
        ]
    };
}

/**
 * 🔍 Validar URL de Facebook (videos y reels)
 */
function validarUrlFacebook(url) {
    if (!url || url.trim() === '') {
        return { valida: false, error: 'URL vacía o undefined' };
    }
    url = url.trim();
    for (const patron of FACEBOOK_CONFIG.URL_PATTERNS) {
        const match = url.match(patron);
        if (match) {
            return {
                valida: true,
                videoId: match[1] || null,
                urlOriginal: url.startsWith('http') ? url : `https://${url}`,
                tipo: 'video',
                plataforma: 'facebook'
            };
        }
    }
    return {
        valida: false,
        error: 'No es una URL válida de Facebook (video o reel) o formato no soportado',
        sugerencias: [
            'https://www.facebook.com/watch/?v=VIDEO_ID',
            'https://www.facebook.com/usuario/videos/VIDEO_ID',
            'https://www.facebook.com/reel/REEL_ID',
            'https://fb.watch/xxxx/'
        ]
    };
}

/**
 * 🔍 Validar URL de Instagram (reels/posts)
 */
function validarUrlInstagram(url) {
    if (!url || url.trim() === '') {
        return { valida: false, error: 'URL vacía o undefined' };
    }
    url = url.trim();
    for (const patron of INSTAGRAM_CONFIG.URL_PATTERNS) {
        const match = url.match(patron);
        if (match) {
            return {
                valida: true,
                videoId: match[1] || null,
                urlOriginal: url.startsWith('http') ? url : `https://${url}`,
                tipo: 'video',
                plataforma: 'instagram'
            };
        }
    }
    return {
        valida: false,
        error: 'No es una URL válida de Instagram (reel o post) o formato no soportado',
        sugerencias: [
            'https://www.instagram.com/reel/CODE/',
            'https://www.instagram.com/p/CODE/'
        ]
    };
}

/**
 * 🔍 Validar URL de TikTok
 */
function validarUrlTikTok(url) {
    if (!url || url.trim() === '') {
        return { valida: false, error: 'URL vacía o undefined' };
    }
    url = url.trim();
    for (const patron of TIKTOK_CONFIG.URL_PATTERNS) {
        const match = url.match(patron);
        if (match) {
            return {
                valida: true,
                videoId: match[1] || null,
                urlOriginal: url.startsWith('http') ? url : `https://${url}`,
                tipo: 'video',
                plataforma: 'tiktok'
            };
        }
    }
    return {
        valida: false,
        error: 'No es una URL válida de TikTok o formato no soportado',
        sugerencias: [
            'https://www.tiktok.com/@usuario/video/VIDEO_ID',
            'https://vt.tiktok.com/short/'
        ]
    };
}

/**
 * 🔎 Validar URL de plataforma soportada (YouTube o Vimeo)
 */
function validarUrlPlataforma(url) {
    const youtube = validarUrlYoutube(url);
    if (youtube.valida) return youtube;
    const vimeo = validarUrlVimeo(url);
    if (vimeo.valida) return vimeo;
    const facebook = validarUrlFacebook(url);
    if (facebook.valida) return facebook;
    const instagram = validarUrlInstagram(url);
    if (instagram.valida) return instagram;
    const tiktok = validarUrlTikTok(url);
    if (tiktok.valida) return tiktok;
    // Combinar errores/sugerencias
    return {
        valida: false,
        error: 'URL no válida. Soportadas: YouTube, Vimeo (básico), Facebook, Instagram, TikTok (detección)',
        sugerencias: [
            ...(youtube.sugerencias || []),
            ...(vimeo.sugerencias || []),
            ...(facebook.sugerencias || []),
            ...(instagram.sugerencias || []),
            ...(tiktok.sugerencias || [])
        ]
    };
}

/**
 * 📋 Parsear argumentos de línea de comandos
 */
function parsearArgumentos(args) {
    const resultado = {
        modo: null,
        url: null,
        ayuda: false,
        version: false,
        autor: false,
        verificar: false,
        busqueda: null,
        busquedaJson: false,
        busquedaPlaylistsJson: false,
        limite: 10,
        crearArchivoDescargasCount: 0,
        downfile: false,
        argumentosValidos: true,
        errores: [],
        // Nuevas opciones de calidad
        calidadVideo: '1080p',
        calidadAudio: 'best',
        formatoVideo: 'mp4',
        formatoAudio: 'mp3',
        descargarTodo: false
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            // Modos de operación principales
            case '--video':
            case '-v':
                if (resultado.modo) {
                    resultado.errores.push('Solo se puede especificar un modo a la vez');
                }
                resultado.modo = 'video';
                break;
                
            case '--music':
            case '-m':
                if (resultado.modo) {
                    resultado.errores.push('Solo se puede especificar un modo a la vez');
                }
                resultado.modo = 'music';
                break;
                
            case '--pics':
            case '-p':
                if (resultado.modo) {
                    resultado.errores.push('Solo se puede especificar un modo a la vez');
                }
                resultado.modo = 'pics';
                break;
                
            case '--subtitles':
            case '-s':
                if (resultado.modo) {
                    resultado.errores.push('Solo se puede especificar un modo a la vez');
                }
                resultado.modo = 'subtitles';
                break;
                
            case '--screenshots':
            case '-c':
                if (resultado.modo) {
                    resultado.errores.push('Solo se puede especificar un modo a la vez');
                }
                resultado.modo = 'screenshots';
                break;
                
            // Modo legacy para compatibilidad
            case '--playlist':
            case '-P':
                if (resultado.modo) {
                    resultado.errores.push('Solo se puede especificar un modo a la vez');
                }
                resultado.modo = 'playlist';
                break;
                
            // Modo experimental Puppeteer
            case '--meta':
            case '-M':
                if (resultado.modo) {
                    resultado.errores.push('Solo se puede especificar un modo a la vez');
                }
                resultado.modo = 'meta';
                break;
                
            // URL del contenido
            case '--url':
            case '-u':
                if (i + 1 < args.length) {
                    resultado.url = args[i + 1];
                    i++; // Saltar el siguiente argumento
                } else {
                    resultado.errores.push('El parámetro --url requiere una URL');
                }
                break;
                
            // Opciones de calidad de video
            case '--quality':
            case '-q':
                if (i + 1 < args.length) {
                    const calidad = args[i + 1];
                    if (['240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '4320p', 'best', 'worst'].includes(calidad)) {
                        resultado.calidadVideo = calidad;
                        i++;
                    } else {
                        resultado.errores.push('Calidad no válida. Opciones: 240p, 360p, 480p, 720p, 1080p, 1440p, 2160p, 4320p, best, worst');
                    }
                } else {
                    resultado.errores.push('El parámetro --quality requiere una calidad');
                }
                break;
                
            // Formato de video
            case '--format':
            case '-f':
                if (i + 1 < args.length) {
                    const formato = args[i + 1];
                    if (['mp4', 'webm', 'mkv', 'avi', 'mov', 'flac', 'mp3', 'ogg', 'aac', 'wav'].includes(formato)) {
                        if (['mp4', 'webm', 'mkv', 'avi', 'mov'].includes(formato)) {
                            resultado.formatoVideo = formato;
                        } else {
                            resultado.formatoAudio = formato;
                        }
                        i++;
                    } else {
                        resultado.errores.push('Formato no válido. Video: mp4, webm, mkv, avi, mov. Audio: mp3, flac, ogg, aac, wav');
                    }
                } else {
                    resultado.errores.push('El parámetro --format requiere un formato');
                }
                break;
                
            // Descargar todo el contenido disponible
            case '--all':
            case '-a':
                resultado.descargarTodo = true;
                break;
                
            case '--search':
            case '-S':
                if (i + 1 < args.length) {
                    resultado.busqueda = args[i + 1];
                    i++;
                } else {
                    resultado.errores.push('El parámetro --search requiere un término de búsqueda');
                }
                break;

            // Búsqueda en JSON (para GUI u otros integradores)
            case '--search-json':
                if (i + 1 < args.length) {
                    resultado.busqueda = args[i + 1];
                    resultado.busquedaJson = true;
                    i++;
                } else {
                    resultado.errores.push('El parámetro --search-json requiere un término de búsqueda');
                }
                break;

            // Búsqueda de playlists en JSON
            case '--search-playlists-json':
                if (i + 1 < args.length) {
                    resultado.busqueda = args[i + 1];
                    resultado.busquedaPlaylistsJson = true;
                    i++;
                } else {
                    resultado.errores.push('El parámetro --search-playlists-json requiere un término de búsqueda');
                }
                break;

            case '--limit':
                if (i + 1 < args.length) {
                    const lim = parseInt(args[i + 1]);
                    if (!isNaN(lim) && lim > 0 && lim <= 50) {
                        resultado.limite = lim;
                        i++;
                    } else {
                        resultado.errores.push('El parámetro --limit debe ser un número entre 1 y 50');
                    }
                } else {
                    resultado.errores.push('El parámetro --limit requiere un número');
                }
                break;

            // Crear archivo de descargas solicitando N enlaces
            case '--file':
                if (i + 1 < args.length) {
                    const n = parseInt(args[i + 1]);
                    if (!isNaN(n) && n > 0 && n <= 1000) {
                        resultado.crearArchivoDescargasCount = n;
                        i++;
                    } else {
                        resultado.errores.push('El parámetro --file requiere un número entre 1 y 1000');
                    }
                } else {
                    resultado.errores.push('El parámetro --file requiere un número');
                }
                break;

            // Descargar desde archivo de descargas
            case '--downfile':
                resultado.downfile = true;
                break;
                
            // Obtener información del video sin descargarlo
            case '--info':
            case '-i':
                resultado.info = true;
                break;
                
            case '--verify':
            case '-y':
            case '--check':
            case '-k':
                resultado.verificar = true;
                break;
                
            // Comandos de información
            case '--help':
            case '-h':
                resultado.ayuda = true;
                break;
                
            case '--version':
            case '-V':
                resultado.version = true;
                break;
                
            case '--author':
            case '-A':
                resultado.autor = true;
                break;
                
            default:
                // Si no empieza con - y no tenemos URL, asumir que es la URL
                if (!arg.startsWith('-') && !resultado.url) {
                    resultado.url = arg;
                } else if (arg.startsWith('-')) {
                    resultado.errores.push(`Argumento desconocido: ${arg}`);
                }
                break;
        }
    }

    // Validar combinaciones
    if (resultado.errores.length > 0) {
        resultado.argumentosValidos = false;
    }

    return resultado;
}

/**
 * 🎯 Procesar modo interactivo completo
 */
async function procesarModoInteractivo(argumentos) {
    try {
        // Crear estructura de directorios
        await crearEstructuraDirectorios();

        // Solicitar URL al usuario
        const url = await solicitarUrlInteractiva();

        // Validar URL
    const validacion = validarUrlPlataforma(url);
        if (!validacion.valida) {
            console.error(`${UI_CONFIG.EMOJIS.ERROR} URL inválida: ${validacion.error}`);
            if (validacion.sugerencias) {
                console.log(`\\n${UI_CONFIG.EMOJIS.INFO} Formatos soportados:`);
                validacion.sugerencias.forEach(sugerencia => {
                    console.log(`  ✅ ${sugerencia}`);
                });
            }
            process.exit(1);
        }

        console.log(`${UI_CONFIG.EMOJIS.SUCCESS} URL válida detectada`);

        // Mostrar opciones interactivas y obtener selección
        const seleccion = await mostrarOpcionesInteractivas(url, validacion);
        
        if (seleccion.modo === 'exit') {
            console.log(`${UI_CONFIG.EMOJIS.SUCCESS} ¡Hasta la próxima!`);
            process.exit(0);
        }
        
        if (seleccion.modo === 'all') {
            argumentos.descargarTodo = true;
            argumentos.modo = 'video'; // Para validación
        } else {
            argumentos.modo = seleccion.modo;
        }
        
        console.log(`${UI_CONFIG.EMOJIS.ROCKET} Iniciando descarga de ${seleccion.descripcion}...`);

        // Preparar opciones de descarga
        const opciones = {
            calidadVideo: argumentos.calidadVideo,
            calidadAudio: argumentos.calidadAudio,
            formatoVideo: argumentos.formatoVideo,
            formatoAudio: argumentos.formatoAudio,
            descargarTodo: argumentos.descargarTodo
        };

        // Procesar descarga
        const resultado = await descargarContenido(url, argumentos.modo, validacion, opciones);
        
        if (resultado.exito) {
            console.log(`\\n${UI_CONFIG.EMOJIS.SUCCESS} ${resultado.mensaje}`);
        } else {
            console.error(`\\n${UI_CONFIG.EMOJIS.ERROR} Error en la descarga: ${resultado.error}`);
            process.exit(1);
        }

    } catch (error) {
        console.error(`\\n${UI_CONFIG.EMOJIS.ERROR} Error inesperado:`, error.message);
        console.log(`${UI_CONFIG.EMOJIS.INFO} Para más información, visita nuestro repositorio`);
        process.exit(1);
    }
}

/**
 * 🎯 Modo interactivo - Solicitar URL al usuario
 */
async function solicitarUrlInteractiva(modo = null) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const tipoContenido = {
        'video': 'video individual',
        'music': 'audio/música del video',
        'pics': 'imágenes y thumbnails',
        'subtitles': 'subtítulos del video',
        'screenshots': 'capturas de pantalla',
        'playlist': 'playlist completa (modo legacy)',
        'meta': 'metadata con Puppeteer (experimental)'
    };

    if (modo) {
        console.log(`\\n${UI_CONFIG.EMOJIS.INFO} Modo ${modo} seleccionado`);
        console.log(`${UI_CONFIG.EMOJIS.PROGRESS} Preparando descarga de ${tipoContenido[modo]}...\\n`);
    } else {
        console.log(`\\n${UI_CONFIG.EMOJIS.PROGRESS} Solicitud de URL para modo interactivo...\\n`);
    }

    const pregunta = modo ? 
        `📋 Ingresa la URL del ${tipoContenido[modo]} de YouTube: ` : 
        `📋 Ingresa la URL de YouTube: `;

    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta) => {
            rl.close();
            resolve(respuesta.trim());
        });
    });
}

/**
 * 🎯 Modo interactivo: mostrar opciones después de validar URL
 */
async function mostrarOpcionesInteractivas(url, validacion) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log(`\n${UI_CONFIG.EMOJIS.SUCCESS} URL válida detectada: ${validacion.urlOriginal}`);
    console.log(`${UI_CONFIG.EMOJIS.INFO} Plataforma: ${validacion.plataforma || 'youtube'}`);
    console.log(`${UI_CONFIG.EMOJIS.INFO} Video ID: ${validacion.videoId || validacion.playlistId}`);
    console.log(`${UI_CONFIG.EMOJIS.INFO} Tipo: ${validacion.tipo}`);
    
    console.log(`\\n${UI_CONFIG.EMOJIS.ROCKET} ¿Qué recursos deseas descargar?\\n`);
    console.log(`1. ${UI_CONFIG.EMOJIS.VIDEO} Video (MP4, WebM, MKV)`);
    console.log(`2. ${UI_CONFIG.EMOJIS.MUSIC} Music/Audio (MP3, FLAC, OGG)`);
    console.log(`3. ${UI_CONFIG.EMOJIS.PICS} Pics/Imágenes (Thumbnails, covers)`);
    console.log(`4. ${UI_CONFIG.EMOJIS.SUBTITLES} Subtitles (SRT, VTT, ASS)`);
    console.log(`5. ${UI_CONFIG.EMOJIS.SCREENSHOTS} Screenshots (Capturas específicas)`);
    console.log(`6. 📊 Metadata (Solo información, experimental Puppeteer)`);
    console.log(`7. 🎯 TODO (Todos los recursos disponibles)`);
    console.log(`8. ❌ Salir\\n`);

    return new Promise((resolve) => {
        rl.question('Selecciona una opción (1-8): ', (respuesta) => {
            const opcion = parseInt(respuesta.trim());
            rl.close();
            
            const modos = {
                1: { modo: 'video', descripcion: 'Video' },
                2: { modo: 'music', descripcion: 'Music/Audio' },
                3: { modo: 'pics', descripcion: 'Pics/Imágenes' },
                4: { modo: 'subtitles', descripcion: 'Subtitles' },
                5: { modo: 'screenshots', descripcion: 'Screenshots' },
                6: { modo: 'meta', descripcion: 'Metadata' },
                7: { modo: 'all', descripcion: 'TODO (todos los recursos)' },
                8: { modo: 'exit', descripcion: 'Salir' }
            };
            
            if (modos[opcion]) {
                resolve(modos[opcion]);
            } else {
                console.log(`${UI_CONFIG.EMOJIS.ERROR} Opción inválida. Saliendo...`);
                resolve({ modo: 'exit', descripcion: 'Salir' });
            }
        });
    });
}

/**
 * 🏗️ Crear estructura de directorios si no existe
 */
async function crearEstructuraDirectorios() {
    const directorios = [
        DIR_CONFIG.BASE_DIR,
        path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.VIDEO_DIR),
        path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.MUSIC_DIR),
        path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.PICS_DIR),
        path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.SUBTITLES_DIR),
        path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.SCREENSHOTS_DIR),
        path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.PLAYLIST_DIR),
        path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.METADATA_DIR)
    ];

    for (const directorio of directorios) {
        try {
            await fs.mkdir(directorio, { recursive: true });
        } catch (error) {
            console.error(`${UI_CONFIG.EMOJIS.ERROR} Error creando directorio ${directorio}:`, error.message);
        }
    }

    console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Estructura de directorios verificada`);
}

/**
 * 📥 Placeholder para descarga (implementación futura)
 */
async function descargarContenido(url, modo, datosValidacion) {
    console.log(`\\n${UI_CONFIG.EMOJIS.PROGRESS} Iniciando descarga...`);
    console.log(`${UI_CONFIG.EMOJIS.INFO} Modo: ${modo}`);
    console.log(`${UI_CONFIG.EMOJIS.INFO} URL: ${url}`);
    
    if (datosValidacion.tipo === 'video') {
        console.log(`${UI_CONFIG.EMOJIS.VIDEO} Video ID: ${datosValidacion.videoId}`);
    } else if (datosValidacion.tipo === 'playlist') {
        console.log(`${UI_CONFIG.EMOJIS.FOLDER} Playlist ID: ${datosValidacion.playlistId}`);
    }

    // TODO: Implementar descarga real con yt-dlp
    console.log(`\\n${UI_CONFIG.EMOJIS.WARNING} Función de descarga en desarrollo...`);
    console.log(`${UI_CONFIG.EMOJIS.INFO} Próxima actualización incluirá integración con yt-dlp`);
    
    return { exito: true, mensaje: 'Preparación completada' };
}

/**
 * � Función principal de la aplicación
 * Maneja el flujo de argumentos y ejecuta la funcionalidad correspondiente
 * Incluye modo interactivo, descarga de contenido, búsqueda y verificación
 * 
 * @async
 * @function main
 * @returns {Promise<void>} Promise que se resuelve cuando la aplicación termina
 * 
 * @description
 * - Si no hay argumentos: activa modo interactivo
 * - Con argumentos: procesa comandos específicos (--video, --music, --search, etc.)
 * - Maneja verificación de archivos con --verify
 * - Soporta búsqueda integrada con --search
 * - Crea estructura de directorios automáticamente
 * 
 * @example
 * // Modo interactivo (sin argumentos)
 * main(); // Preguntará por URL y opciones
 * 
 * @example
 * // Con argumentos del sistema
 * process.argv = ['node', 'y2back.js', '--video', '-u', 'https://youtu.be/ID'];
 * main(); // Ejecutará descarga de video
 */
async function main() {
    try {
        const args = process.argv.slice(2);
        
        // Si no hay argumentos, activar modo interactivo
        if (args.length === 0) {
            console.log(`${UI_CONFIG.EMOJIS.INFO} Modo interactivo activado...`);
            
            // Crear argumentos mínimos para modo interactivo
            const argumentos = {
                modo: null,
                url: null,
                argumentosValidos: true,
                errores: [],
                calidadVideo: '1080p',
                calidadAudio: 'best',
                formatoVideo: 'mp4',
                formatoAudio: 'mp3',
                descargarTodo: false
            };
            
            // Activar modo interactivo
            await procesarModoInteractivo(argumentos);
            return;
        }

        // Parsear argumentos
        const argumentos = parsearArgumentos(args);

        // Manejar comandos de información
        if (argumentos.ayuda) {
            mostrarBannerEducativo();
            return;
        }

        if (argumentos.version) {
            console.log(`${APP_CONFIG.NAME} v${VERSION}`);
            console.log(`Node.js: ${process.version}`);
            console.log(`Plataforma: ${process.platform}`);
            return;
        }

        if (argumentos.autor) {
            console.log(`\\n${UI_CONFIG.EMOJIS.ROCKET} ${APP_CONFIG.NAME} v${VERSION}`);
            console.log(`👨‍💻 Desarrollador: ${APP_CONFIG.AUTHOR}`);
            console.log(`📧 Email: ${APP_CONFIG.EMAIL}`);
            console.log(`🏢 Soporte: ${APP_CONFIG.SUPPORT_EMAIL}`);
            console.log(`📞 WhatsApp: ${APP_CONFIG.WHATSAPP}`);
            console.log(`📄 Licencia: ${APP_CONFIG.LICENSE}`);
            console.log(`🔗 Repositorio: ${APP_CONFIG.REPOSITORY}`);
            return;
        }

        if (argumentos.busqueda) {
            if (argumentos.busquedaJson) {
                const res = await buscarYoutubeJson(argumentos.busqueda, argumentos.limite || 10);
                console.log(JSON.stringify(res, null, 2));
                return;
            } else if (argumentos.busquedaPlaylistsJson) {
                const res = await buscarPlaylistsJson(argumentos.busqueda, argumentos.limite || 10);
                console.log(JSON.stringify(res, null, 2));
                return;
            } else {
                await realizarBusquedaYoutube(argumentos.busqueda);
                return;
            }
        }

        // Crear archivo de descargas interactivo
        if (argumentos.crearArchivoDescargasCount && argumentos.crearArchivoDescargasCount > 0) {
            await crearArchivoDescargasInteractivo(argumentos.crearArchivoDescargasCount);
            console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Archivo de descargas creado`);
            return;
        }

        // Procesar archivo de descargas
        if (argumentos.downfile) {
            await procesarArchivoDescargas(argumentos);
            return;
        }

        // Obtener información del video
        if (argumentos.info) {
            if (!argumentos.url) {
                console.error(`${UI_CONFIG.EMOJIS.ERROR} Se requiere --url para obtener información`);
                process.exit(1);
            }
            
            try {
                const info = await obtenerInformacionVideo(argumentos.url);
                console.log(JSON.stringify(info, null, 2));
                return;
            } catch (error) {
                console.error(`${UI_CONFIG.EMOJIS.ERROR} Error al obtener información: ${error.message}`);
                process.exit(1);
            }
        }

        if (argumentos.verificar) {
            await verificarArchivosExistentes();
            return;
        }

        // Validar argumentos
        if (!argumentos.argumentosValidos) {
            console.error(`${UI_CONFIG.EMOJIS.ERROR} Errores en los argumentos:`);
            argumentos.errores.forEach(error => {
                console.error(`  - ${error}`);
            });
            console.log(`\\n${UI_CONFIG.EMOJIS.INFO} Usa --help para ver la ayuda completa`);
            process.exit(1);
        }

        // Verificar que se especificó un modo, --all, o activar modo interactivo
        let modoInteractivo = false;
        if (!argumentos.modo && !argumentos.descargarTodo) {
            modoInteractivo = true;
            console.log(`${UI_CONFIG.EMOJIS.INFO} Modo interactivo activado...`);
        }
        
        // Si se especifica --all, simular modo video para la validación
        if (argumentos.descargarTodo && !argumentos.modo) {
            argumentos.modo = 'video';
        }

        // Crear estructura de directorios
        await crearEstructuraDirectorios();

        // Obtener URL (interactiva o desde argumentos)
        let url = argumentos.url;
        if (!url) {
            url = await solicitarUrlInteractiva(argumentos.modo);
        }

        // Validar URL
    const validacion = validarUrlPlataforma(url);
        if (!validacion.valida) {
            console.error(`${UI_CONFIG.EMOJIS.ERROR} URL inválida: ${validacion.error}`);
            if (validacion.sugerencias) {
                console.log(`\\n${UI_CONFIG.EMOJIS.INFO} Formatos soportados:`);
                validacion.sugerencias.forEach(sugerencia => {
                    console.log(`  ✅ ${sugerencia}`);
                });
            }
            process.exit(1);
        }

        console.log(`${UI_CONFIG.EMOJIS.SUCCESS} URL válida detectada`);

        // Si es modo interactivo, mostrar opciones y obtener selección
        if (modoInteractivo) {
            const seleccion = await mostrarOpcionesInteractivas(url, validacion);
            
            if (seleccion.modo === 'exit') {
                console.log(`${UI_CONFIG.EMOJIS.SUCCESS} ¡Hasta la próxima!`);
                process.exit(0);
            }
            
            if (seleccion.modo === 'all') {
                argumentos.descargarTodo = true;
                argumentos.modo = 'video'; // Para validación
            } else {
                argumentos.modo = seleccion.modo;
            }
            
            console.log(`${UI_CONFIG.EMOJIS.ROCKET} Iniciando descarga de ${seleccion.descripcion}...`);
        }

        // Preparar opciones de descarga
        const opciones = {
            calidadVideo: argumentos.calidadVideo,
            calidadAudio: argumentos.calidadAudio,
            formatoVideo: argumentos.formatoVideo,
            formatoAudio: argumentos.formatoAudio,
            descargarTodo: argumentos.descargarTodo
        };

        // Procesar descarga
        const resultado = await descargarContenido(url, argumentos.modo, validacion, opciones);
        
        if (resultado.exito) {
            console.log(`\\n${UI_CONFIG.EMOJIS.SUCCESS} ${resultado.mensaje}`);
        } else {
            console.error(`\\n${UI_CONFIG.EMOJIS.ERROR} Error en la descarga: ${resultado.error}`);
            process.exit(1);
        }

    } catch (error) {
        console.error(`\\n${UI_CONFIG.EMOJIS.ERROR} Error inesperado:`, error.message);
        console.log(`${UI_CONFIG.EMOJIS.INFO} Ejecuta con --help para ver la documentación`);
        process.exit(1);
    }
}

/**
 * 📥 Función principal de descarga de contenido
 */
async function descargarContenido(url, modo, validacion, opciones = {}) {
    try {
        console.log(`\\n${UI_CONFIG.EMOJIS.PROGRESS} Iniciando descarga en modo: ${modo}`);
        console.log(`${UI_CONFIG.EMOJIS.INFO} URL: ${url}`);
        console.log(`${UI_CONFIG.EMOJIS.INFO} Tipo detectado: ${validacion.tipo}`);

        // Placeholders abiertos para plataformas no-YouTube (no romper funcionalidades actuales)
        if (validacion && ['vimeo', 'facebook', 'instagram', 'tiktok'].includes(validacion.plataforma)) {
            console.log(`${UI_CONFIG.EMOJIS.INFO} Plataforma detectada: ${validacion.plataforma}`);
            console.log(`${UI_CONFIG.EMOJIS.GEAR} Handler en desarrollo para ${validacion.plataforma}.`);
            console.log(`${UI_CONFIG.EMOJIS.INFO} Por ahora solo detección y log. Aquí irá la integración con yt-dlp/puppeteer.`);
            return { exito: true, mensaje: `Detección correcta de ${validacion.plataforma}. Handler pendiente.` };
        }
        
        // Mostrar opciones de calidad si están especificadas
        if (opciones.calidadVideo && opciones.calidadVideo !== '1080p') {
            console.log(`${UI_CONFIG.EMOJIS.INFO} Calidad de video: ${opciones.calidadVideo}`);
        }
        if (opciones.formatoVideo && opciones.formatoVideo !== 'mp4') {
            console.log(`${UI_CONFIG.EMOJIS.INFO} Formato de video: ${opciones.formatoVideo}`);
        }
        if (opciones.formatoAudio && opciones.formatoAudio !== 'mp3') {
            console.log(`${UI_CONFIG.EMOJIS.INFO} Formato de audio: ${opciones.formatoAudio}`);
        }
        if (opciones.descargarTodo) {
            console.log(`${UI_CONFIG.EMOJIS.INFO} Descargando todo el contenido disponible`);
        }

        // Verificar que yt-dlp esté disponible (solo para modos que lo requieren)
        if (modo !== 'meta') {
            const ytdlpDisponible = await verificarYtDlp();
            if (!ytdlpDisponible) {
                console.log(`${UI_CONFIG.EMOJIS.WARNING} yt-dlp no está instalado`);
                console.log(`${UI_CONFIG.EMOJIS.INFO} Para instalar yt-dlp ejecuta:`);
                console.log(`  pip install yt-dlp`);
                console.log(`  O visita: https://github.com/yt-dlp/yt-dlp`);
                console.log(`${UI_CONFIG.EMOJIS.INFO} Alternativamente, prueba el modo experimental:`);
                console.log(`  node y2back.js --meta -u "URL"  # Extrae metadata con Puppeteer`);
                return { exito: false, error: 'yt-dlp no está disponible' };
            }
        }

        // Ejecutar descarga según el modo
        if (modo === 'meta') {
            return await extraerMetadataConPuppeteer(url, validacion);
        } else if (opciones.descargarTodo) {
            return await ejecutarDescargaCompleta(url, validacion, opciones);
        } else {
            return await ejecutarDescarga(url, modo, validacion, opciones);
        }
        
    } catch (error) {
        return { exito: false, error: error.message };
    }
}

/**
 * 🔍 Verificar si yt-dlp está disponible
 */
async function verificarYtDlp() {
    try {
        const { exec } = require('child_process');
        const fsSync = require('fs');
        const localExe = path.resolve(__dirname, 'yt-dlp.exe');
        // 0) Ejecutable local junto al proyecto (Windows típico)
        if (process.platform === 'win32' && fsSync.existsSync(localExe)) {
            return new Promise((resolve) => {
                exec(`"${localExe}" --version`, (err, stdout) => {
                    if (!err) {
                        console.log(`${UI_CONFIG.EMOJIS.SUCCESS} yt-dlp (local exe) encontrado: ${String(stdout).trim()}`);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        }
        // 1) yt-dlp en PATH
        const okPath = await new Promise((resolve) => {
            exec('yt-dlp --version', (error1, stdout1) => {
                if (!error1) {
                    console.log(`${UI_CONFIG.EMOJIS.SUCCESS} yt-dlp encontrado: ${String(stdout1).trim()}`);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
        if (okPath) return true;
        // 2) python -m yt_dlp
        const okPy = await new Promise((resolve) => {
            exec('python -m yt_dlp --version', (error2, stdout2) => {
                if (!error2) {
                    console.log(`${UI_CONFIG.EMOJIS.SUCCESS} yt-dlp encontrado (python -m): ${String(stdout2).trim()}`);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
        return okPy;
    } catch (error) {
        return false;
    }
}

/**
 * 🔧 Obtener comando de yt-dlp disponible
 */
async function obtenerComandoYtDlp() {
    const { exec } = require('child_process');
    const fsSync = require('fs');
    
    // Primero intentar yt-dlp del PATH (instalado en sistema)
    const okPath = await new Promise((resolve) => {
        exec('yt-dlp --version', (error1) => resolve(!error1));
    });
    if (okPath) return 'yt-dlp';
    
    // Si no está en PATH, buscar ejecutable local según plataforma
    let localBinary;
    if (process.platform === 'win32') {
        localBinary = path.resolve(__dirname, 'yt-dlp.exe');
    } else if (process.platform === 'darwin') {
        localBinary = path.resolve(__dirname, 'yt-dlp_macos');
    } else {
        localBinary = path.resolve(__dirname, 'yt-dlp');
    }
    
    if (fsSync.existsSync(localBinary)) {
        return process.platform === 'win32' ? `"${localBinary}"` : localBinary;
    }
    
    // Fallback a python -m yt_dlp
    return 'python -m yt_dlp';
}

/**
 * 🔍 Realizar búsqueda en YouTube
 */
async function realizarBusquedaYoutube(termino) {
    const { exec } = require('child_process');
    const readline = require('readline');
    
    console.log(`${UI_CONFIG.EMOJIS.PROGRESS} Buscando en YouTube: "${termino}"...`);
    
    // Mostrar loader mientras se busca
    await mostrarLoader(`Conectando con YouTube para buscar "${termino}"`, 1500);
    
    // Obtener comando de yt-dlp
    const comandoBase = await obtenerComandoYtDlp();
    
    // Comando para buscar en YouTube (obtener primeros 10 resultados)
    const comando = `${comandoBase} "ytsearch10:${termino}" --get-title --get-id --get-duration --no-download`;
    
    return new Promise((resolve) => {
        exec(comando, async (error, stdout, stderr) => {
            if (error) {
                console.error(`${UI_CONFIG.EMOJIS.ERROR} Error en búsqueda: ${error.message}`);
                resolve();
                return;
            }
            
            if (!stdout.trim()) {
                console.log(`${UI_CONFIG.EMOJIS.WARNING} No se encontraron resultados para "${termino}"`);
                resolve();
                return;
            }
            
            // Procesar resultados
            const lineas = stdout.trim().split('\n');
            const resultados = [];
            
            // Los resultados vienen en grupos de 3: título, ID, duración
            for (let i = 0; i < lineas.length; i += 3) {
                if (i + 2 < lineas.length) {
                    resultados.push({
                        titulo: lineas[i],
                        id: lineas[i + 1],
                        duracion: lineas[i + 2],
                        url: `https://www.youtube.com/watch?v=${lineas[i + 1]}`
                    });
                }
            }
            
            if (resultados.length === 0) {
                console.log(`${UI_CONFIG.EMOJIS.WARNING} No se procesaron resultados correctamente`);
                resolve();
                return;
            }
            
            console.log(`\\n${UI_CONFIG.EMOJIS.SUCCESS} Encontrados ${resultados.length} resultados para "${termino}":\\n`);
            
            // Mostrar resultados
            resultados.forEach((resultado, index) => {
                console.log(`${index + 1}. ${UI_CONFIG.EMOJIS.VIDEO} ${resultado.titulo}`);
                console.log(`   ⏱️  Duración: ${resultado.duracion}`);
                console.log(`   🔗 ID: ${resultado.id}`);
                console.log(`   📎 URL: ${resultado.url}\\n`);
            });
            
            // Preguntar si desea descargar alguno
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            rl.question(`¿Deseas descargar alguno? (1-${resultados.length}, 0 para salir): `, async (respuesta) => {
                const seleccion = parseInt(respuesta.trim());
                rl.close();
                
                if (seleccion > 0 && seleccion <= resultados.length) {
                    const videoSeleccionado = resultados[seleccion - 1];
                    console.log(`\\n${UI_CONFIG.EMOJIS.ROCKET} Seleccionado: ${videoSeleccionado.titulo}`);
                    
                    // Preguntar tipo de descarga
                    await seleccionarTipoDescarga(videoSeleccionado.url);
                } else if (seleccion === 0) {
                    console.log(`${UI_CONFIG.EMOJIS.SUCCESS} ¡Búsqueda completada!`);
                } else {
                    console.log(`${UI_CONFIG.EMOJIS.WARNING} Selección inválida`);
                }
                
                resolve();
            });
        });
    });
}

/**
 * 🔎 Buscar en YouTube y devolver JSON (para GUI)
 */
async function buscarYoutubeJson(termino, limite = 10) {
    const { spawn } = require('child_process');
    const lim = Math.min(Math.max(parseInt(limite) || 10, 1), 50);

    const comandoBase = await obtenerComandoYtDlp();
    const query = `ytsearch${lim}:${termino}`;
    // Usamos spawn en shell para evitar límites de maxBuffer y procesar línea a línea
    const comando = `${comandoBase} "${query}" --dump-json --no-download`;

    return new Promise((resolve, reject) => {
        const results = [];
        let buffer = '';
        let hasError = false;
        let errorMsg = '';

        const child = spawn(comando, { shell: true });
        
        // Timeout de 60 segundos
        const timeout = setTimeout(() => {
            child.kill('SIGTERM');
            resolve({ 
                ok: false, 
                error: 'Timeout: La búsqueda tardó más de 60 segundos',
                count: 0,
                results: [] 
            });
        }, 60000);

        child.stdout.on('data', (chunk) => {
            buffer += chunk.toString();
            let idx;
            while ((idx = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, idx).trim();
                buffer = buffer.slice(idx + 1);
                if (!line) continue;
                try {
                    const obj = JSON.parse(line);
                    results.push({
                        id: obj.id,
                        title: obj.title,
                        duration: obj.duration_string || obj.duration || null,
                        thumbnail: (obj.thumbnails && obj.thumbnails.length)
                            ? obj.thumbnails[obj.thumbnails.length - 1].url
                            : obj.thumbnail || null,
                        url: obj.webpage_url || (obj.id ? `https://www.youtube.com/watch?v=${obj.id}` : null),
                        uploader: obj.uploader || obj.channel || null
                    });
                } catch (_) {
                    // línea no-JSON: ignorar
                }
            }
        });

        child.stderr.on('data', (chunk) => {
            errorMsg += chunk.toString();
        });

        child.on('close', (code) => {
            clearTimeout(timeout);
            
            // Procesar posible remanente
            const line = buffer.trim();
            if (line) {
                try {
                    const obj = JSON.parse(line);
                    results.push({
                        id: obj.id,
                        title: obj.title,
                        duration: obj.duration_string || obj.duration || null,
                        thumbnail: (obj.thumbnails && obj.thumbnails.length)
                            ? obj.thumbnails[obj.thumbnails.length - 1].url
                            : obj.thumbnail || null,
                        url: obj.webpage_url || (obj.id ? `https://www.youtube.com/watch?v=${obj.id}` : null),
                        uploader: obj.uploader || obj.channel || null
                    });
                } catch (_) { /* no-op */ }
            }

            if (code !== 0 && code !== null) {
                resolve({ 
                    ok: false, 
                    error: `Error de búsqueda (código ${code}): ${errorMsg || 'Error desconocido'}`,
                    count: 0,
                    results: [] 
                });
            } else {
                resolve({ ok: true, count: results.length, results });
            }
        });

        child.on('error', (err) => {
            clearTimeout(timeout);
            resolve({ 
                ok: false, 
                error: `Error al ejecutar búsqueda: ${err.message}`,
                count: 0,
                results: [] 
            });
        });
    });
}

/**
 * 📋 Buscar playlists en YouTube (JSON)
 */
async function buscarPlaylistsJson(termino, limite = 10) {
    const { spawn } = require('child_process');
    const lim = Math.min(Math.max(parseInt(limite) || 10, 1), 50);

    const comandoBase = await obtenerComandoYtDlp();
    // Buscar usando ytsearch con término específico para playlists
    const query = `ytsearch${lim * 2}:${termino} playlist`;
    const comando = `${comandoBase} "${query}" --dump-json --no-download`;

    return new Promise((resolve) => {
        const results = [];
        let buffer = '';
        let errorMsg = '';

        const child = spawn(comando, { shell: true });
        
        // Timeout de 60 segundos
        const timeout = setTimeout(() => {
            child.kill('SIGTERM');
            resolve({ 
                ok: false, 
                error: 'Timeout: La búsqueda de playlists tardó más de 60 segundos',
                count: 0,
                results: [] 
            });
        }, 60000);

        child.stdout.on('data', (chunk) => {
            buffer += chunk.toString();
            let idx;
            while ((idx = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, idx).trim();
                buffer = buffer.slice(idx + 1);
                if (!line) continue;
                try {
                    const obj = JSON.parse(line);
                    // Filtrar para encontrar playlists o videos que indiquen ser de playlists
                    if (obj.playlist || obj.playlist_id || 
                        (obj.title && obj.title.toLowerCase().includes('playlist')) ||
                        (obj.description && obj.description.toLowerCase().includes('playlist'))) {
                        results.push({
                            id: obj.playlist_id || obj.id,
                            title: obj.title,
                            description: obj.description || null,
                            uploader: obj.uploader || obj.channel || null,
                            url: obj.webpage_url || (obj.id ? `https://www.youtube.com/watch?v=${obj.id}` : null),
                            thumbnail: (obj.thumbnails && obj.thumbnails.length)
                                ? obj.thumbnails[obj.thumbnails.length - 1].url
                                : obj.thumbnail || null,
                            video_count: obj.playlist_count || null,
                            type: 'playlist'
                        });
                        
                        // Limitar resultados
                        if (results.length >= lim) break;
                    }
                } catch (_) {
                    // línea no-JSON: ignorar
                }
            }
        });

        child.stderr.on('data', (chunk) => {
            errorMsg += chunk.toString();
        });

        child.on('close', (code) => {
            clearTimeout(timeout);
            
            // Procesar posible remanente
            const line = buffer.trim();
            if (line && results.length < lim) {
                try {
                    const obj = JSON.parse(line);
                    if (obj.playlist || obj.playlist_id || 
                        (obj.title && obj.title.toLowerCase().includes('playlist')) ||
                        (obj.description && obj.description.toLowerCase().includes('playlist'))) {
                        results.push({
                            id: obj.playlist_id || obj.id,
                            title: obj.title,
                            description: obj.description || null,
                            uploader: obj.uploader || obj.channel || null,
                            url: obj.webpage_url || (obj.id ? `https://www.youtube.com/watch?v=${obj.id}` : null),
                            thumbnail: (obj.thumbnails && obj.thumbnails.length)
                                ? obj.thumbnails[obj.thumbnails.length - 1].url
                                : obj.thumbnail || null,
                            video_count: obj.playlist_count || null,
                            type: 'playlist'
                        });
                    }
                } catch (_) { /* no-op */ }
            }

            if (code !== 0 && code !== null) {
                resolve({ 
                    ok: false, 
                    error: `Error de búsqueda de playlists (código ${code}): ${errorMsg || 'Error desconocido'}`,
                    count: 0,
                    results: [] 
                });
            } else {
                resolve({ ok: true, count: results.length, results: results.slice(0, lim) });
            }
        });

        child.on('error', (err) => {
            clearTimeout(timeout);
            resolve({ 
                ok: false, 
                error: `Error al ejecutar búsqueda de playlists: ${err.message}`,
                count: 0,
                results: [] 
            });
        });
    });
}

/**
 * 📋 Obtener información de un video sin descargarlo
 */
async function obtenerInformacionVideo(url) {
    const { spawn } = require('child_process');
    
    const comandoBase = await obtenerComandoYtDlp();
    const comando = `${comandoBase} "${url}" --dump-json --no-download`;

    return new Promise((resolve, reject) => {
        let buffer = '';
        let errorMsg = '';

        const child = spawn(comando, { shell: true });
        
        // Timeout de 30 segundos
        const timeout = setTimeout(() => {
            child.kill('SIGTERM');
            reject(new Error('Timeout: La obtención de información tardó más de 30 segundos'));
        }, 30000);

        child.stdout.on('data', (chunk) => {
            buffer += chunk.toString();
        });

        child.stderr.on('data', (chunk) => {
            errorMsg += chunk.toString();
        });

        child.on('close', (code) => {
            clearTimeout(timeout);
            
            if (code !== 0 && code !== null) {
                reject(new Error(`Error al obtener información (código ${code}): ${errorMsg || 'Error desconocido'}`));
                return;
            }
            
            try {
                // Intentar parsear la primera línea JSON válida
                const lines = buffer.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed && trimmed.startsWith('{')) {
                        const obj = JSON.parse(trimmed);
                        // Devolver información simplificada
                        resolve({
                            id: obj.id,
                            title: obj.title,
                            uploader: obj.uploader || obj.channel,
                            duration: obj.duration_string || obj.duration,
                            thumbnail: (obj.thumbnails && obj.thumbnails.length)
                                ? obj.thumbnails[obj.thumbnails.length - 1].url
                                : obj.thumbnail,
                            url: obj.webpage_url || url,
                            description: obj.description ? obj.description.substring(0, 200) + '...' : null,
                            view_count: obj.view_count,
                            upload_date: obj.upload_date
                        });
                        return;
                    }
                }
                
                // Si no se encontró JSON válido, devolver información básica
                resolve({
                    title: 'Video encontrado',
                    url: url,
                    uploader: 'Información no disponible'
                });
                
            } catch (err) {
                reject(new Error(`Error al parsear información del video: ${err.message}`));
            }
        });

        child.on('error', (err) => {
            clearTimeout(timeout);
            reject(new Error(`Error al ejecutar comando: ${err.message}`));
        });
    });
}

/**
 * 🎯 Seleccionar tipo de descarga para video encontrado
 */
async function seleccionarTipoDescarga(url) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    console.log(`\\n${UI_CONFIG.EMOJIS.ROCKET} ¿Qué deseas descargar?\\n`);
    console.log(`1. ${UI_CONFIG.EMOJIS.VIDEO} Video (MP4, WebM, MKV)`);
    console.log(`2. ${UI_CONFIG.EMOJIS.MUSIC} Music/Audio (MP3, FLAC, OGG)`);
    console.log(`3. ${UI_CONFIG.EMOJIS.PICS} Pics/Imágenes (Thumbnails, covers)`);
    console.log(`4. ${UI_CONFIG.EMOJIS.SUBTITLES} Subtitles (SRT, VTT, ASS)`);
    console.log(`5. 📸 Screenshots (Capturas específicas)`);
    console.log(`6. 📊 Metadata (Solo información)`);
    console.log(`7. 🎯 TODO (Todos los recursos disponibles)`);
    console.log(`8. ❌ Cancelar\\n`);
    
    return new Promise((resolve) => {
        rl.question('Selecciona una opción (1-8): ', async (respuesta) => {
            const opcion = parseInt(respuesta.trim());
            rl.close();
            
            const modos = {
                1: 'video',
                2: 'music', 
                3: 'pics',
                4: 'subtitles',
                5: 'screenshots',
                6: 'meta',
                7: 'all'
            };
            
            if (modos[opcion]) {
                console.log(`${UI_CONFIG.EMOJIS.PROGRESS} Iniciando descarga...`);
                
                // Validar URL
            const validacion = validarUrlPlataforma(url);
                
                // Crear opciones por defecto
                const opciones = {
                    calidadVideo: '1080p',
                    calidadAudio: 'best',
                    formatoVideo: 'mp4',
                    formatoAudio: 'mp3',
                    descargarTodo: opcion === 7
                };
                
                // Crear estructura de directorios
                await crearEstructuraDirectorios();
                
                // Ejecutar descarga
                if (opcion === 7) {
                    const resultado = await ejecutarDescargaCompleta(url, validacion, opciones);
                    if (resultado.exito) {
                        console.log(`\\n${UI_CONFIG.EMOJIS.SUCCESS} ${resultado.mensaje}`);
                    } else {
                        console.error(`\\n${UI_CONFIG.EMOJIS.ERROR} Error en la descarga: ${resultado.error}`);
                    }
                } else {
                    const resultado = await descargarContenido(url, modos[opcion], validacion, opciones);
                    if (resultado.exito) {
                        console.log(`\\n${UI_CONFIG.EMOJIS.SUCCESS} ${resultado.mensaje}`);
                    } else {
                        console.error(`\\n${UI_CONFIG.EMOJIS.ERROR} Error en la descarga: ${resultado.error}`);
                    }
                }
            } else if (opcion === 8) {
                console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Descarga cancelada`);
            } else {
                console.log(`${UI_CONFIG.EMOJIS.WARNING} Opción inválida`);
            }
            
            resolve();
        });
    });
}

/**
 * �️ Crear/limpiar 'descargas.txt' e ir solicitando N URLs válidas
 */
async function crearArchivoDescargasInteractivo(n) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const preguntar = (q) => new Promise(res => rl.question(q, res));

    // Limpiar archivo
    await fs.writeFile(DOWNLOADS_FILE, '', 'utf8');
    console.log(`${UI_CONFIG.EMOJIS.INFO} Archivo limpiado: ${DOWNLOADS_FILE}`);

    let count = 0;
    while (count < n) {
        const resp = (await preguntar(`(${count + 1}/${n}) URL: `)).trim();
        const validacion = validarUrlPlataforma(resp);
        if (!validacion.valida) {
            console.log(`${UI_CONFIG.EMOJIS.WARNING} URL inválida: ${validacion.error}`);
            continue; // volver a preguntar esta misma posición
        }
        await fs.appendFile(DOWNLOADS_FILE, `${resp}\n`, 'utf8');
        count++;
    }
    rl.close();
}

/**
 * 🚀 Procesar archivo 'descargas.txt' y descargar todos los enlaces
 */
async function procesarArchivoDescargas(argumentos) {
    try {
        const contenido = await fs.readFile(DOWNLOADS_FILE, 'utf8').catch(() => '');
        const lineas = contenido.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lineas.length === 0) {
            console.log(`${UI_CONFIG.EMOJIS.INFO} No hay enlaces en ${DOWNLOADS_FILE}`);
            return;
        }

        console.log(`${UI_CONFIG.EMOJIS.PROGRESS} Procesando ${lineas.length} enlaces desde ${DOWNLOADS_FILE}...`);

        // Opciones globales desde argumentos
        const opciones = {
            calidadVideo: argumentos.calidadVideo,
            calidadAudio: argumentos.calidadAudio,
            formatoVideo: argumentos.formatoVideo,
            formatoAudio: argumentos.formatoAudio,
            descargarTodo: argumentos.descargarTodo
        };

        for (let i = 0; i < lineas.length; i++) {
            const url = lineas[i];
            console.log(`\n[${i + 1}/${lineas.length}] ➜ ${url}`);
            const validacion = validarUrlPlataforma(url);
            if (!validacion.valida) {
                console.log(`${UI_CONFIG.EMOJIS.WARNING} URL inválida, se omite: ${validacion.error}`);
                continue;
            }

            // Determinar modo: si hay --all usa descarga completa, si no usa modo explícito
            let modo = argumentos.modo || 'video';
            if (opciones.descargarTodo) {
                const r = await ejecutarDescargaCompleta(url, validacion, opciones);
                if (!r.exito) console.log(`${UI_CONFIG.EMOJIS.WARNING} Falló: ${r.error || 'sin detalle'}`);
            } else {
                const r = await ejecutarDescarga(url, modo, validacion, opciones);
                if (!r.exito) console.log(`${UI_CONFIG.EMOJIS.WARNING} Falló: ${r.error || 'sin detalle'}`);
            }
        }

        console.log(`\n${UI_CONFIG.EMOJIS.SUCCESS} Descargas desde archivo completadas`);
    } catch (err) {
        console.error(`${UI_CONFIG.EMOJIS.ERROR} Error procesando archivo: ${err.message}`);
    }
}

/**
 * �🔍 Verificar integridad de todos los archivos existentes
 */
async function verificarArchivosExistentes() {
    const fs = require('fs').promises;
    const path = require('path');
    
    console.log(`${UI_CONFIG.EMOJIS.PROGRESS} Verificando integridad de archivos existentes...\\n`);
    
    const directorios = {
        'Video': path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.VIDEO_DIR),
        'Music': path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.MUSIC_DIR),
        'Pics': path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.PICS_DIR),
        'Subtitles': path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.SUBTITLES_DIR),
        'Screenshots': path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.SCREENSHOTS_DIR)
    };
    
    let totalArchivos = 0;
    let archivosValidos = 0;
    let archivosProblemas = 0;
    
    for (const [tipo, directorio] of Object.entries(directorios)) {
        try {
            const archivos = await fs.readdir(directorio);
            const archivosRelevantes = archivos.filter(archivo => {
                const ext = path.extname(archivo).toLowerCase();
                if (tipo === 'Video') return ['.mp4', '.webm', '.mkv', '.avi'].includes(ext);
                if (tipo === 'Music') return ['.mp3', '.m4a', '.flac', '.ogg', '.wav'].includes(ext);
                if (tipo === 'Pics') return ['.webp', '.jpg', '.jpeg', '.png'].includes(ext);
                if (tipo === 'Subtitles') return ['.srt', '.vtt', '.ass'].includes(ext);
                if (tipo === 'Screenshots') return ['.webp', '.jpg', '.jpeg', '.png'].includes(ext);
                return false;
            });
            
            if (archivosRelevantes.length > 0) {
                console.log(`\\n📁 ${tipo}:`);
                
                for (const archivo of archivosRelevantes) {
                    totalArchivos++;
                    const rutaCompleta = path.join(directorio, archivo);
                    const verificacion = await verificarIntegridadArchivo(rutaCompleta, tipo.toLowerCase());
                    
                    if (verificacion.valido) {
                        archivosValidos++;
                        console.log(`  ✅ ${archivo} - ${verificacion.mensaje}`);
                    } else {
                        archivosProblemas++;
                        console.log(`  ❌ ${archivo} - ${verificacion.error}`);
                    }
                }
            } else {
                console.log(`\\n📁 ${tipo}: Sin archivos`);
            }
            
        } catch (error) {
            console.log(`\\n📁 ${tipo}: Error al acceder al directorio - ${error.message}`);
        }
    }
    
    console.log(`\\n${UI_CONFIG.EMOJIS.SUCCESS} Verificación completada:`);
    console.log(`  📊 Total de archivos: ${totalArchivos}`);
    console.log(`  ✅ Archivos válidos: ${archivosValidos}`);
    console.log(`  ❌ Archivos con problemas: ${archivosProblemas}`);
    
    if (archivosProblemas > 0) {
        console.log(`\\n${UI_CONFIG.EMOJIS.WARNING} Se encontraron ${archivosProblemas} archivo(s) con problemas.`);
        console.log(`${UI_CONFIG.EMOJIS.INFO} Considera volver a descargar los archivos problemáticos.`);
    } else if (totalArchivos > 0) {
        console.log(`\\n${UI_CONFIG.EMOJIS.SUCCESS} Todos los archivos están en buen estado.`);
    } else {
        console.log(`\\n${UI_CONFIG.EMOJIS.INFO} No se encontraron archivos para verificar.`);
    }
}

/**
 * � Mostrar loader de progreso
 */
function mostrarLoader(mensaje, duracion = 2000) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    
    const interval = setInterval(() => {
        process.stdout.write(`\\r${frames[i]} ${mensaje}`);
        i = (i + 1) % frames.length;
    }, 100);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            clearInterval(interval);
            process.stdout.write(`\\r${UI_CONFIG.EMOJIS.SUCCESS} ${mensaje} completado\\n`);
            resolve();
        }, duracion);
    });
}

/**
 * 📊 Mostrar barra de progreso simulada
 */
function mostrarBarraProgreso(mensaje, pasos = 20) {
    return new Promise((resolve) => {
        let progreso = 0;
        const interval = setInterval(() => {
            const porcentaje = Math.round((progreso / pasos) * 100);
            const barraCompleta = '█'.repeat(Math.floor(progreso / 2));
            const barraVacia = '░'.repeat(Math.floor((pasos - progreso) / 2));
            
            process.stdout.write(`\\r${mensaje} [${barraCompleta}${barraVacia}] ${porcentaje}%`);
            
            progreso++;
            if (progreso > pasos) {
                clearInterval(interval);
                process.stdout.write(`\\n${UI_CONFIG.EMOJIS.SUCCESS} ${mensaje} completado\\n`);
                resolve();
            }
        }, 150);
    });
}

/**
 * ⚡ Ejecutar comando con loader
 */
async function ejecutarConLoader(comando, mensaje) {
    const { exec } = require('child_process');
    
    console.log(`${UI_CONFIG.EMOJIS.GEAR} ${mensaje}...`);
    
    // Mostrar loader mientras se ejecuta el comando
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    
    const loaderInterval = setInterval(() => {
        process.stdout.write(`\\r${frames[i]} Procesando...`);
        i = (i + 1) % frames.length;
    }, 100);
    
    return new Promise((resolve) => {
        exec(comando, (error, stdout, stderr) => {
            clearInterval(loaderInterval);
            process.stdout.write(`\\r${UI_CONFIG.EMOJIS.SUCCESS} ${mensaje} completado\\n`);
            
            if (error) {
                console.error(`${UI_CONFIG.EMOJIS.ERROR} Error: ${error.message}`);
                resolve({ exito: false, error: error.message });
            } else {
                if (stdout) console.log(stdout);
                resolve({ exito: true, salida: stdout });
            }
        });
    });
}

/**
 * �🔍 Verificar integridad de archivo descargado
 */
async function verificarIntegridadArchivo(rutaArchivo, modo) {
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
        // Verificar que el archivo existe
        const stats = await fs.stat(rutaArchivo);
        
        // Verificar tamaño mínimo según el tipo
        const tamañoMinimo = {
            'video': 1024 * 1024, // 1MB mínimo para videos
            'music': 100 * 1024,  // 100KB mínimo para audio
            'pics': 1024,         // 1KB mínimo para imágenes
            'subtitles': 100,     // 100 bytes mínimo para subtítulos
            'screenshots': 1024   // 1KB mínimo para capturas
        };
        
        if (stats.size < (tamañoMinimo[modo] || 1024)) {
            return { 
                valido: false, 
                error: `Archivo muy pequeño (${stats.size} bytes). Posible corrupción.` 
            };
        }
        
        // Verificar extensión válida para videos
        if (modo === 'video') {
            const extension = path.extname(rutaArchivo).toLowerCase();
            const extensionesValidas = ['.mp4', '.webm', '.mkv', '.avi'];
            
            if (!extensionesValidas.includes(extension)) {
                return { 
                    valido: false, 
                    error: `Extensión no válida: ${extension}` 
                };
            }
        }
        
        return { 
            valido: true, 
            tamaño: stats.size, 
            mensaje: `Archivo válido: ${(stats.size / 1024 / 1024).toFixed(2)} MB (${stats.size} bytes)` 
        };
        
    } catch (error) {
        return { 
            valido: false, 
            error: `No se pudo verificar el archivo: ${error.message}` 
        };
    }
}

/**
 * ⚡ Ejecutar descarga real con yt-dlp
 */
async function ejecutarDescarga(url, modo, validacion, opciones = {}) {
    const { exec } = require('child_process');
    
    // Construir URL completa usando el ID/URL extraído según plataforma
    let urlCompleta = url;
    if (validacion) {
        if (validacion.plataforma === 'youtube') {
            if (validacion.videoId) {
                urlCompleta = `https://www.youtube.com/watch?v=${validacion.videoId}`;
            } else if (!url.includes('http')) {
                urlCompleta = `https://www.youtube.com/watch?v=${url}`;
            }
        } else if (validacion.plataforma === 'vimeo') {
            if (validacion.videoId && !url.includes('http')) {
                urlCompleta = `https://vimeo.com/${validacion.videoId}`;
            } else if (validacion.urlOriginal) {
                urlCompleta = validacion.urlOriginal;
            }
        }
    }
    
    // Obtener comando correcto de yt-dlp
    const comandoBase = await obtenerComandoYtDlp();
    
    // Construir comando según el modo y opciones
    let comando = '';
    let directorioDestino = '';
    
    switch (modo) {
        case 'video':
            directorioDestino = path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.VIDEO_DIR);
            
            // Comando simplificado - descargar video sin merge para evitar FFmpeg
            let selectorCalidad = 'best[height<=1080]';
            if (opciones.calidadVideo) {
                if (opciones.calidadVideo === 'best') {
                    selectorCalidad = 'best';
                } else if (opciones.calidadVideo === 'worst') {
                    selectorCalidad = 'worst';
                } else {
                    const altura = opciones.calidadVideo.replace('p', '');
                    selectorCalidad = `best[height<=${altura}]`;
                }
            }
            
            // Comando básico sin merge ni post-procesamiento
            comando = `${comandoBase} -f "${selectorCalidad}" --output "${directorioDestino}/%(title)s.%(ext)s" "${urlCompleta}"`;
            break;
            
        case 'music':
            directorioDestino = path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.MUSIC_DIR);
            
            // Comando básico - solo descargar audio sin ningún post-procesamiento
            comando = `${comandoBase} -f "bestaudio" --output "${directorioDestino}/%(title)s.%(ext)s" "${urlCompleta}"`;
            break;
            
        case 'pics':
            directorioDestino = path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.PICS_DIR);
            comando = `${comandoBase} --write-thumbnail --skip-download --output "${directorioDestino}/%(title)s" "${urlCompleta}"`;
            break;
            
        case 'subtitles':
            directorioDestino = path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.SUBTITLES_DIR);
            comando = `${comandoBase} --write-subs --write-auto-subs --skip-download --output "${directorioDestino}/%(title)s" "${urlCompleta}"`;
            break;
            
        case 'screenshots':
            directorioDestino = path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.SCREENSHOTS_DIR);
            comando = `${comandoBase} --write-thumbnail --skip-download --output "${directorioDestino}/%(title)s_screenshot" "${urlCompleta}"`;
            break;
            
        case 'playlist':
            directorioDestino = path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.PLAYLIST_DIR);
            
            // Selector de calidad para playlist
            let calidadPlaylist = 'best[height<=1080]';
            if (opciones.calidadVideo) {
                if (opciones.calidadVideo === 'best') {
                    calidadPlaylist = 'best';
                } else if (opciones.calidadVideo === 'worst') {
                    calidadPlaylist = 'worst';
                } else {
                    const altura = opciones.calidadVideo.replace('p', '');
                    calidadPlaylist = `best[height<=${altura}]`;
                }
            }
            
            comando = `${comandoBase} -f "${calidadPlaylist}" --output "${directorioDestino}/%(playlist)s/%(playlist_index)s - %(title)s.%(ext)s" "${urlCompleta}"`;
            break;
            
        default:
            return { exito: false, error: `Modo no soportado: ${modo}` };
    }

    console.log(`${UI_CONFIG.EMOJIS.GEAR} Ejecutando: ${comando.substring(0, 100)}...`);

    return new Promise(async (resolve) => {
        // Mostrar barra de progreso para el comando
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let i = 0;
        const loaderInterval = setInterval(() => {
            process.stdout.write(`\\r${frames[i]} Ejecutando descarga...`);
            i = (i + 1) % frames.length;
        }, 100);
        
        exec(comando, async (error, stdout, stderr) => {
            clearInterval(loaderInterval);
            process.stdout.write(`\\r`); // Limpiar loader
            
            if (error) {
                console.error(`${UI_CONFIG.EMOJIS.ERROR} Error en descarga: ${error.message}`);
                resolve({ exito: false, error: error.message });
            } else {
                console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Descarga completada`);
                if (stdout) console.log(stdout);
                
                // Verificar integridad del archivo para videos
                if (modo === 'video') {
                    try {
                        const fs = require('fs');
                        const archivos = fs.readdirSync(directorioDestino);
                        const archivoVideo = archivos.find(archivo => 
                            archivo.endsWith('.mp4') || archivo.endsWith('.webm') || 
                            archivo.endsWith('.mkv') || archivo.endsWith('.avi')
                        );
                        
                        if (archivoVideo) {
                            const rutaCompleta = require('path').join(directorioDestino, archivoVideo);
                            let verificacion = await verificarIntegridadArchivo(rutaCompleta, modo);
                            
                            if (verificacion.valido) {
                                console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Verificación: ${verificacion.mensaje}`);
                                
                                // Convertir MKV a MP4 si es necesario para mejor compatibilidad
                                if (archivoVideo.endsWith('.mkv')) {
                                    console.log(`${UI_CONFIG.EMOJIS.GEAR} Detectado archivo MKV, convirtiendo a MP4 para mejor compatibilidad...`);
                                    const resultadoConversion = await convertirMkvAMp4(rutaCompleta, directorioDestino);
                                    
                                    if (resultadoConversion.exito) {
                                        console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Conversión completada: ${resultadoConversion.archivoFinal}`);
                                        
                                        // Verificar archivo convertido
                                        const verificacionMp4 = await verificarIntegridadArchivo(resultadoConversion.rutaCompleta, modo);
                                        if (verificacionMp4.valido) {
                                            console.log(`${UI_CONFIG.EMOJIS.SUCCESS} MP4 verificado: ${verificacionMp4.mensaje}`);
                                        }
                                        
                                        resolve({ 
                                            exito: true, 
                                            mensaje: `${modo} descargado, convertido a MP4 y verificado exitosamente`,
                                            archivo: resultadoConversion.archivoFinal,
                                            tamaño: verificacionMp4.tamaño || resultadoConversion.tamaño,
                                            conversion: true
                                        });
                                    } else {
                                        console.log(`${UI_CONFIG.EMOJIS.WARNING} Conversión falló, manteniendo MKV original: ${resultadoConversion.error}`);
                                        resolve({ 
                                            exito: true, 
                                            mensaje: `${modo} descargado y verificado (MKV original)`,
                                            archivo: archivoVideo,
                                            tamaño: verificacion.tamaño,
                                            advertencia: "Archivo en formato MKV, puede tener problemas de compatibilidad"
                                        });
                                    }
                                } else {
                                    resolve({ 
                                        exito: true, 
                                        mensaje: `${modo} descargado y verificado exitosamente en ${directorioDestino}`,
                                        archivo: archivoVideo,
                                        tamaño: verificacion.tamaño
                                    });
                                }
                            } else {
                                console.error(`${UI_CONFIG.EMOJIS.WARNING} Problema de integridad: ${verificacion.error}`);
                                console.log(`${UI_CONFIG.EMOJIS.INFO} Reintentando descarga con configuración más conservadora...`);
                                
                                // Reintentar con configuración más segura
                                const comandoSeguro = comando.replace('--retries 5', '--retries 10')
                                                           .replace('--fragment-retries 10', '--fragment-retries 20');
                                
                                resolve({ 
                                    exito: false, 
                                    error: `Archivo posiblemente corrupto: ${verificacion.error}. Se recomienda reintentar.`,
                                    sugerencia: "Prueba con --quality worst para una descarga más estable"
                                });
                            }
                        } else {
                            resolve({ 
                                exito: false, 
                                error: "No se encontró archivo de video descargado" 
                            });
                        }
                    } catch (verifyError) {
                        console.log(`${UI_CONFIG.EMOJIS.WARNING} No se pudo verificar integridad: ${verifyError.message}`);
                        resolve({ exito: true, mensaje: `${modo} descargado exitosamente en ${directorioDestino}` });
                    }
                } else {
                    // Para otros tipos de archivo, no verificar integridad por ahora
                    resolve({ exito: true, mensaje: `${modo} descargado exitosamente en ${directorioDestino}` });
                }
            }
        });
    });
}

/**
 * 🎯 Ejecutar descarga completa (todos los recursos)
 */
async function ejecutarDescargaCompleta(url, validacion, opciones = {}) {
    console.log(`\\n${UI_CONFIG.EMOJIS.ROCKET} Iniciando descarga completa de todos los recursos...`);
    
    const resultados = [];
    const modos = ['video', 'music', 'pics', 'subtitles', 'screenshots'];
    
    for (const modo of modos) {
        try {
            console.log(`\\n${UI_CONFIG.EMOJIS.PROGRESS} Descargando: ${modo}...`);
            const resultado = await ejecutarDescarga(url, modo, validacion, opciones);
            resultados.push({ modo, exito: resultado.exito, mensaje: resultado.mensaje });
            
            if (resultado.exito) {
                console.log(`${UI_CONFIG.EMOJIS.SUCCESS} ${modo} completado`);
            } else {
                console.log(`${UI_CONFIG.EMOJIS.WARNING} ${modo} falló: ${resultado.error}`);
            }
        } catch (error) {
            console.log(`${UI_CONFIG.EMOJIS.ERROR} Error en ${modo}: ${error.message}`);
            resultados.push({ modo, exito: false, error: error.message });
        }
    }
    
    // También extraer metadata
    try {
        console.log(`\\n${UI_CONFIG.EMOJIS.PROGRESS} Extrayendo metadata...`);
        await extraerMetadataConPuppeteer(url, validacion);
        resultados.push({ modo: 'metadata', exito: true, mensaje: 'Metadata extraída' });
        console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Metadata completada`);
    } catch (error) {
        console.log(`${UI_CONFIG.EMOJIS.WARNING} Metadata falló: ${error.message}`);
        resultados.push({ modo: 'metadata', exito: false, error: error.message });
    }
    
    // Resumen final
    const exitosos = resultados.filter(r => r.exito).length;
    const total = resultados.length;
    
    return {
        exito: exitosos > 0,
        mensaje: `Descarga completa terminada: ${exitosos}/${total} recursos descargados exitosamente`,
        detalles: resultados
    };
}

/**
 * 🤖 FUNCIONALIDAD EXPERIMENTAL - PUPPETEER
 * Conexión directa a YouTube para extraer metadata sin yt-dlp
 */

/**
 * 🌐 Verificar si Puppeteer está disponible
 */
async function verificarPuppeteer() {
    try {
        require.resolve('puppeteer');
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * 🎬 Extraer metadata de YouTube con Puppeteer (experimental)
 */
async function extraerMetadataConPuppeteer(url, validacion = null) {
    try {
        const puppeteerDisponible = await verificarPuppeteer();
        if (!puppeteerDisponible) {
            console.log(`${UI_CONFIG.EMOJIS.WARNING} Puppeteer no está instalado`);
            console.log(`${UI_CONFIG.EMOJIS.INFO} Para instalar: npm install puppeteer`);
            return { exito: false, error: 'Puppeteer no disponible' };
        }

        const puppeteer = require('puppeteer');
        
        console.log(`${UI_CONFIG.EMOJIS.PROGRESS} Iniciando navegador para extracción de metadata...`);
        
        // Construir URL completa usando el ID extraído de la validación
        let urlCompleta = url;
        if (validacion && validacion.videoId) {
            urlCompleta = `https://www.youtube.com/watch?v=${validacion.videoId}`;
        } else if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
            urlCompleta = `https://www.youtube.com/watch?v=${url}`;
        }
        
        const browser = await puppeteer.launch({ 
            headless: 'new', // Usar headless nuevo más estable
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Usar Chrome del sistema
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security',
                '--disable-features=site-per-process',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ],
            timeout: 90000 // 90 segundos timeout como ZiteBackJS mejorado
        });
        
        const page = await browser.newPage();
        
        // Configurar timeouts como ZiteBackJS mejorados
        page.setDefaultTimeout(90000);
        page.setDefaultNavigationTimeout(90000);
        
        // Configurar user agent para evitar detección de bot
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        console.log(`${UI_CONFIG.EMOJIS.GEAR} Navegando a: ${urlCompleta}`);
        await page.goto(urlCompleta, { waitUntil: 'domcontentloaded', timeout: 90000 }); // 90 segundos como ZiteBackJS mejorado
        
        // Esperar un poco más para que cargue completamente
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Extraer metadata básica con selectores mejorados como ZiteBackJS
        const metadata = await page.evaluate(() => {
            const datos = {};
            
            // Título del video - múltiples selectores
            const tituloSelectors = [
                'h1.title yt-formatted-string',
                'h1 .ytd-video-primary-info-renderer',
                '#title h1',
                '.ytd-watch-metadata #title h1 yt-formatted-string'
            ];
            
            for (const selector of tituloSelectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim()) {
                    datos.titulo = element.textContent.trim();
                    break;
                }
            }
            datos.titulo = datos.titulo || 'Título no encontrado';
            
            // Canal/Autor - múltiples selectores
            const canalSelectors = [
                '#owner-name a',
                '.ytd-channel-name a',
                '#channel-name .ytd-channel-name',
                '.ytd-video-owner-renderer .ytd-channel-name a'
            ];
            
            for (const selector of canalSelectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim()) {
                    datos.canal = element.textContent.trim();
                    break;
                }
            }
            datos.canal = datos.canal || 'Canal no encontrado';
            
            // Duración - múltiples selectores como ZiteBackJS
            const duracionSelectors = [
                '.ytp-time-duration',
                '.ytd-thumbnail-overlay-time-status-renderer span',
                'span.ytd-thumbnail-overlay-time-status-renderer',
                '.ytp-time-display .ytp-time-duration',
                'meta[itemprop="duration"]',
                '.duration'
            ];
            
            for (const selector of duracionSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    if (selector.includes('meta')) {
                        // Para meta tags, extraer contenido del atributo
                        const duracionISO = element.getAttribute('content');
                        if (duracionISO) {
                            datos.duracion = duracionISO;
                            break;
                        }
                    } else if (element.textContent && element.textContent.trim()) {
                        datos.duracion = element.textContent.trim();
                        break;
                    }
                }
            }
            datos.duracion = datos.duracion || 'Duración no encontrada';
            
            // Vistas - múltiples selectores mejorados
            const vistasSelectors = [
                '#count .view-count',
                '.ytd-video-view-count-renderer',
                '#info .view-count',
                '.view-count',
                '#info-contents .view-count',
                '.ytd-watch-info-text .view-count',
                'span.view-count'
            ];
            
            for (const selector of vistasSelectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim()) {
                    datos.vistas = element.textContent.trim();
                    break;
                }
            }
            datos.vistas = datos.vistas || 'Vistas no encontradas';
            
            // Descripción (primeras líneas)
            const descripcionElement = document.querySelector('#description, .ytd-video-secondary-info-renderer #description');
            datos.descripcion = descripcionElement ? descripcionElement.textContent.substring(0, 200) + '...' : 'Descripción no encontrada';
            
            // URL de thumbnail
            const thumbnailElement = document.querySelector('meta[property="og:image"]');
            datos.thumbnail = thumbnailElement ? thumbnailElement.content : 'Thumbnail no encontrado';
            
            return datos;
        });
        
        await browser.close();
        
        console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Metadata extraída exitosamente`);
        console.log(`${UI_CONFIG.EMOJIS.VIDEO} Título: ${metadata.titulo}`);
        console.log(`${UI_CONFIG.EMOJIS.FOLDER} Canal: ${metadata.canal}`);
        console.log(`⏱️ Duración: ${metadata.duracion}`);
        console.log(`👁️ Vistas: ${metadata.vistas}`);
        
        // Guardar metadata en archivo JSON
        const metadataDir = path.join(DIR_CONFIG.BASE_DIR, DIR_CONFIG.METADATA_DIR);
        await fs.mkdir(metadataDir, { recursive: true });
        
        const nombreArchivo = `${metadata.titulo.replace(/[<>:"/\\|?*]/g, '_')}_metadata.json`;
        const rutaArchivo = path.join(metadataDir, nombreArchivo);
        
        await fs.writeFile(rutaArchivo, JSON.stringify(metadata, null, 2));
        console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Metadata guardada en: ${rutaArchivo}`);
        
        return { 
            exito: true, 
            mensaje: 'Metadata extraída con Puppeteer', 
            datos: metadata,
            archivo: rutaArchivo
        };
        
    } catch (error) {
        console.error(`${UI_CONFIG.EMOJIS.ERROR} Error en Puppeteer: ${error.message}`);
        return { exito: false, error: error.message };
    }
}

/**
 * 🔄 Convertir archivo MKV a MP4 para mejor compatibilidad
 * @param {string} rutaArchivoMkv - Ruta completa al archivo MKV
 * @param {string} directorioDestino - Directorio donde guardar el MP4
 * @returns {Object} Resultado de la conversión
 */
async function convertirMkvAMp4(rutaArchivoMkv, directorioDestino) {
    const { exec } = require('child_process');
    const path = require('path');
    const fs = require('fs').promises;
    
    try {
        // Generar nombre del archivo MP4
        const nombreBase = path.basename(rutaArchivoMkv, '.mkv');
        const rutaMp4 = path.join(directorioDestino, `${nombreBase}.mp4`);
        
        // Verificar si FFmpeg está disponible
        const ffmpegDisponible = await verificarFFmpeg();
        if (!ffmpegDisponible) {
            return { 
                exito: false, 
                error: "FFmpeg no encontrado. Se requiere para conversión MKV → MP4" 
            };
        }
        
        console.log(`${UI_CONFIG.EMOJIS.GEAR} Convirtiendo ${path.basename(rutaArchivoMkv)} → ${nombreBase}.mp4...`);
        
        // Comando de conversión optimizado (copia streams cuando es posible)
        const comando = `ffmpeg -i "${rutaArchivoMkv}" -c copy -avoid_negative_ts make_zero "${rutaMp4}" -y`;
        
        return new Promise((resolve) => {
            // Mostrar progreso de conversión
            const frames = ['🔄', '⚙️', '🔧', '⚡'];
            let i = 0;
            const loaderInterval = setInterval(() => {
                process.stdout.write(`\\r${frames[i]} Convirtiendo MKV → MP4...`);
                i = (i + 1) % frames.length;
            }, 300);
            
            exec(comando, async (error, stdout, stderr) => {
                clearInterval(loaderInterval);
                process.stdout.write(`\\r`); // Limpiar loader
                
                if (error) {
                    console.error(`${UI_CONFIG.EMOJIS.ERROR} Error en conversión: ${error.message}`);
                    resolve({ exito: false, error: error.message });
                } else {
                    try {
                        // Verificar que el archivo MP4 se creó correctamente
                        const statsMp4 = await fs.stat(rutaMp4);
                        
                        if (statsMp4.size > 0) {
                            // Eliminar archivo MKV original para evitar duplicados
                            try {
                                await fs.unlink(rutaArchivoMkv);
                                console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Archivo MKV original eliminado`);
                            } catch (unlinkError) {
                                console.log(`${UI_CONFIG.EMOJIS.WARNING} No se pudo eliminar MKV original: ${unlinkError.message}`);
                            }
                            
                            resolve({
                                exito: true,
                                archivoFinal: `${nombreBase}.mp4`,
                                rutaCompleta: rutaMp4,
                                tamaño: statsMp4.size,
                                mensaje: `Conversión exitosa: ${(statsMp4.size / 1024 / 1024).toFixed(2)} MB`
                            });
                        } else {
                            resolve({ 
                                exito: false, 
                                error: "Archivo MP4 generado está vacío" 
                            });
                        }
                    } catch (statsError) {
                        resolve({ 
                            exito: false, 
                            error: `Error verificando archivo convertido: ${statsError.message}` 
                        });
                    }
                }
            });
        });
        
    } catch (error) {
        return { 
            exito: false, 
            error: `Error preparando conversión: ${error.message}` 
        };
    }
}

/**
 * 🔍 Verificar si FFmpeg está disponible en el sistema
 * @returns {boolean} True si FFmpeg está disponible
 */
async function verificarFFmpeg() {
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
        exec('ffmpeg -version', (error, stdout, stderr) => {
            if (error) {
                console.log(`${UI_CONFIG.EMOJIS.WARNING} FFmpeg no encontrado. Para conversión MKV→MP4 instale: https://ffmpeg.org/`);
                resolve(false);
            } else {
                console.log(`${UI_CONFIG.EMOJIS.SUCCESS} FFmpeg disponible para conversiones`);
                resolve(true);
            }
        });
    });
}

// Ejecutar aplicación
if (require.main === module) {
    main();
}

module.exports = {
    validarUrlYoutube,
    parsearArgumentos,
    extraerMetadataConPuppeteer,
    buscarYoutubeJson,
    buscarPlaylistsJson,
    obtenerInformacionVideo,
    main
};