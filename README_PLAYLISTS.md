# 📋 Funcionalidad de Playlists - Y2Back

<p align="center">
	<img src="https://cdn.susitio.cl/assets/images/logoY2B.png" alt="Y2Back logo" width="200" />
</p>

## ✅ Mejoras Implementadas

### 🔧 **CLI - Línea de Comandos**
- ✅ Soporte mejorado para `--playlist` con configuración de calidad
- ✅ Nueva función `--search-playlists-json "término"` para buscar playlists
- ✅ Comando corregido para usar `comandoBase` en lugar de `yt-dlp` hardcoded
- ✅ Selector de calidad configurable para playlists

### 🎨 **GUI - Interfaz Gráfica**  
- ✅ Botón "Buscar Playlists" agregado al GUI
- ✅ Opción "Playlist Completa" en modos de descarga
- ✅ Funciones `renderPlaylistResults()` para mostrar playlists con estilo especial
- ✅ Tarjetas de playlist con borde púrpura para distinción visual
- ✅ Botón "Descargar Playlist" para descarga directa completa

### 🔍 **Búsqueda de Playlists**
- ✅ API `window.api.searchPlaylists()` en preload.js
- ✅ Handler `search-playlists` en main.js de Electron
- ✅ Función `buscarPlaylistsJson()` en y2back.js
- ✅ Filtros para identificar content de playlists en resultados

## 🚀 Cómo Usar

### **Desde CLI:**
```bash
# Buscar playlists
node y2back.js --search-playlists-json "pop music" --limit 5

# Descargar playlist completa
node y2back.js --playlist --url "URL_PLAYLIST" --quality 1080p
```

### **Desde GUI:**
1. **Buscar Playlists**: Escribir término → Clic "Buscar Playlists"
2. **Ver Resultados**: Playlists aparecen con borde púrpura
3. **Descargar**: Clic "Descargar Playlist" para obtener todos los videos
4. **Agregar a Lista**: Para descarga masiva posterior

## 📋 Características de Playlists

### **Información Mostrada:**
- 📋 Título de la playlist
- 👤 Creador/Canal  
- 📊 Número de videos (cuando disponible)
- 📝 Descripción (truncada)
- 🖼️ Thumbnail

### **Acciones Disponibles:**
- 🎯 **Descarga Directa**: Obtener toda la playlist inmediatamente
- 📝 **Agregar a Lista**: Para procesamiento por lotes
- ⚙️ **Configuración**: Calidad y formato configurables

## 🎯 Detalles Técnicos

### **Archivos Modificados:**
- `y2back.js` - Nueva función `buscarPlaylistsJson()` + mejoras playlist
- `electron/main.js` - Handler IPC `search-playlists`  
- `electron/preload.js` - API `searchPlaylists()`
- `electron/renderer.js` - Funciones UI para playlists
- `electron/renderer.html` - Botón y opciones de playlist

### **Calidad de Descarga:**
- 🎥 Video: Configurable (720p, 1080p, 1440p, 2160p, best)
- 📁 Organización: `medios/PlayList/[nombre]/[index] - [título].[ext]`
- 🛠️ Comando: Usa `python -m yt_dlp` automáticamente

## 🔧 Errores Solucionados

### **Problema Original:**
- ❌ Comando hardcoded `yt-dlp` en lugar de detectar `python -m yt_dlp`
- ❌ Sin soporte GUI para playlists
- ❌ No había búsqueda específica de playlists

### **Solución Aplicada:**
- ✅ Comando dinámico usando `obtenerComandoYtDlp()`
- ✅ GUI completo para playlists con interfaz dedicada  
- ✅ Búsqueda inteligente filtrando content de playlists
- ✅ Variables con nombres únicos para evitar conflictos

## 🎉 Estado Final

**El sistema ahora soporta completamente:**
- 🔍 Búsqueda de playlists desde GUI y CLI
- 📋 Descarga de playlists completas con organización automática
- ⚙️ Configuración de calidad para playlists
- 🎨 Interfaz visual distintiva para playlists
- 📁 Guardado organizado en subcarpetas por playlist

¡La funcionalidad de playlists está completamente operativa! 🎊