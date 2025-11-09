

#!/bin/bash

# Script de Deploy Inteligente para Y2Back
# Soporta modo pruebas (Electron) y producción (bundle específico por plataforma)

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Función para encontrar puerto disponible
find_available_port() {
  # Intentar puertos del 7770 al 7779
  for i in {0..9}; do
    local port=$((7770 + i))
    if ! lsof -i:$port >/dev/null 2>&1 && ! netstat -tuln 2>/dev/null | grep -q ":$port "; then
      echo $port
      return 0
    fi
  done
  
  # Si todos están ocupados, generar uno aleatorio entre 10000-65000
  while true; do
    local random_port=$((10000 + RANDOM % 55000))
    if ! lsof -i:$random_port >/dev/null 2>&1 && ! netstat -tuln 2>/dev/null | grep -q ":$random_port "; then
      echo $random_port
      return 0
    fi
  done
}

echo "======================================"
echo "  Y2Back - Sistema de Deploy"
echo "======================================"
echo ""
echo "¿Qué tipo de despliegue deseas realizar?"
echo "1) Pruebas locales (Electron App)"
echo "2) Producción (Servidor)"
echo ""
read -p "Selecciona una opción [1-2]: " DEPLOY_TYPE

case $DEPLOY_TYPE in
  1)
    echo ""
    echo "=== MODO PRUEBAS ==="
    echo ""
    echo "¿Qué deseas probar?"
    echo "1) Solo Web (servidor HTTP ligero)"
    echo "2) Solo Electron (aplicación de escritorio)"
    echo "3) Ambos (Web + Electron simultáneamente)"
    echo ""
    read -p "Selecciona una opción [1-3]: " TEST_TYPE
    
    # Detectar sistema operativo actual
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
      DETECTED_OS="Linux"
      BUILD_CMD="build:linux"
      APP_FILE="dist/Y2Back-*.AppImage"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
      DETECTED_OS="macOS"
      BUILD_CMD="build:mac"
      APP_FILE="dist/Y2Back*.dmg"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
      DETECTED_OS="Windows"
      BUILD_CMD="build:win"
      APP_FILE="dist/Y2Back*.exe"
    else
      echo "⚠ Sistema operativo no detectado: $OSTYPE"
      DETECTED_OS="Desconocido"
      BUILD_CMD="build:linux"
      APP_FILE="dist/Y2Back-*.AppImage"
    fi
    
    echo ""
    echo "Compilando interfaz web..."
    
    # Compilar en /tmp (ext4) si estamos en NTFS
    if df -T "$ROOT" | grep -q "fuseblk\|ntfs"; then
      echo "⚠ Detectado sistema NTFS - compilando en /tmp..."
      TMP_BUILD="/tmp/y2back-build-$$"
      mkdir -p "$TMP_BUILD/web"
      
      # Copiar solo archivos necesarios (sin node_modules)
      rsync -a --exclude 'node_modules' --exclude 'dist' "$ROOT/web/" "$TMP_BUILD/web/"
      
      cd "$TMP_BUILD/web"
      echo "Instalando dependencias en /tmp..."
      npm install --silent
      echo "Compilando..."
      npm run build
      
      # Copiar resultado compilado de vuelta
      mkdir -p "$ROOT/web/dist"
      rsync -a dist/ "$ROOT/web/dist/"
      
      # Limpiar
      cd "$ROOT"
      rm -rf "$TMP_BUILD"
      echo "✓ Compilación completada"
    else
      # Sistema de archivos normal
      cd web
      npm run build
      cd ..
    fi
    
    case $TEST_TYPE in
      1)
        # Solo Web
        echo ""
        echo "=== Iniciando servidor Web de pruebas ==="
        echo ""
        
        PORT=$(find_available_port)
        echo "Servidor iniciándose en http://localhost:$PORT"
        echo "Presiona Ctrl+C para detener el servidor"
        echo ""
        npx http-server web/dist -p $PORT -o
        ;;
        
      2)
        # Solo Electron
        echo ""
        echo "=== Compilando aplicación Electron para $DETECTED_OS ==="
        
        # Compilar Electron en /tmp si estamos en NTFS
        if df -T "$ROOT" | grep -q "fuseblk\|ntfs"; then
          echo "⚠ Compilando Electron en /tmp..."
          TMP_ELECTRON="/tmp/y2back-electron-$$"
          
          # Copiar proyecto completo excepto node_modules y dist
          rsync -a --exclude 'node_modules' --exclude 'dist' --exclude 'web/node_modules' --exclude 'web/dist' "$ROOT/" "$TMP_ELECTRON/"
          
          # Copiar el dist de web ya compilado si existe
          if [ -d "$ROOT/web/dist" ]; then
            mkdir -p "$TMP_ELECTRON/web/dist"
            rsync -a "$ROOT/web/dist/" "$TMP_ELECTRON/web/dist/"
          fi
          
          cd "$TMP_ELECTRON"
          echo "Instalando dependencias de Electron en /tmp..."
          npm install --silent
          echo "Compilando Electron..."
          npm run $BUILD_CMD
          
          # Copiar resultado de vuelta
          mkdir -p "$ROOT/dist"
          rsync -a dist/ "$ROOT/dist/"
          
          cd "$ROOT"
          rm -rf "$TMP_ELECTRON"
          echo "✓ Compilación de Electron completada"
        else
          npm run $BUILD_CMD
        fi
        
        echo ""
        echo "✓ Aplicación compilada:"
        ls -lh $APP_FILE 2>/dev/null || echo "⚠ No se encontró la aplicación compilada"
        echo ""
        echo "Archivo(s) en dist/:"
        ls -lh dist/ 2>/dev/null | grep -E "(AppImage|\.exe|\.dmg)" || echo "Ninguno"
        echo ""
        echo "Iniciando aplicación..."
        if [[ -f $APP_FILE ]]; then
          $APP_FILE &
          echo "✓ Aplicación iniciada"
        fi
        ;;
        
      3)
        # Ambos
        echo ""
        echo "=== Iniciando servidor Web en segundo plano ==="
        
        PORT=$(find_available_port)
        
        # Iniciar servidor en segundo plano con npx
        npx http-server web/dist -p $PORT > /dev/null 2>&1 &
        HTTP_SERVER_PID=$!
        
        sleep 2
        
        # Abrir navegador
        if command -v xdg-open &> /dev/null; then
          xdg-open "http://localhost:$PORT" &
        elif command -v open &> /dev/null; then
          open "http://localhost:$PORT" &
        fi
        
        echo "✓ Servidor Web iniciado en http://localhost:$PORT (PID: $HTTP_SERVER_PID)"
        echo "✓ Navegador abierto"
        echo ""
        echo "=== Compilando aplicación Electron para $DETECTED_OS ==="
        
        # Compilar Electron en /tmp si estamos en NTFS
        if df -T "$ROOT" | grep -q "fuseblk\|ntfs"; then
          echo "⚠ Compilando Electron en /tmp..."
          TMP_ELECTRON="/tmp/y2back-electron-$$"
          
          # Copiar proyecto completo excepto node_modules y dist
          rsync -a --exclude 'node_modules' --exclude 'dist' --exclude 'web/node_modules' --exclude 'web/dist' "$ROOT/" "$TMP_ELECTRON/"
          
          # Copiar el dist de web ya compilado
          mkdir -p "$TMP_ELECTRON/web/dist"
          rsync -a "$ROOT/web/dist/" "$TMP_ELECTRON/web/dist/"
          
          cd "$TMP_ELECTRON"
          echo "Instalando dependencias de Electron en /tmp..."
          npm install --silent
          echo "Compilando Electron..."
          npm run $BUILD_CMD
          
          # Copiar resultado de vuelta
          mkdir -p "$ROOT/dist"
          rsync -a dist/ "$ROOT/dist/"
          
          cd "$ROOT"
          rm -rf "$TMP_ELECTRON"
          echo "✓ Compilación de Electron completada"
        else
          npm run $BUILD_CMD
        fi
        
        echo ""
        echo "✓ Aplicación compilada:"
        ls -lh $APP_FILE 2>/dev/null || echo "⚠ No se encontró la aplicación compilada"
        echo ""
        echo "Iniciando aplicación Electron..."
        if [[ -f $APP_FILE ]]; then
          $APP_FILE &
          ELECTRON_PID=$!
          echo "✓ Aplicación Electron iniciada (PID: $ELECTRON_PID)"
        fi
        echo ""
        echo "⚠ El servidor Web sigue corriendo en segundo plano (PID: $HTTP_SERVER_PID)"
        echo "Para detenerlo ejecuta: kill $HTTP_SERVER_PID"
        ;;
        
      *)
        echo "❌ Opción inválida"
        exit 1
        ;;
    esac
    ;;
    
  2)
    echo ""
    echo "=== MODO PRODUCCIÓN ==="
    echo ""
    echo "¿En qué sistema operativo está el servidor de producción?"
    echo "1) Linux"
    echo "2) Windows Server"
    echo "3) macOS Server"
    echo ""
    read -p "Selecciona el sistema del servidor [1-3]: " SERVER_OS
    
    case $SERVER_OS in
      1)
        PLATFORM="linux"
        BINARIES="yt-dlp ffmpeg ffprobe"
        ;;
      2)
        PLATFORM="windows"
        BINARIES="yt-dlp.exe ffmpeg.exe ffprobe.exe"
        ;;
      3)
        PLATFORM="macos"
        BINARIES="yt-dlp_macos ffmpeg_macos ffprobe_macos"
        ;;
      *)
        echo "❌ Opción inválida"
        exit 1
        ;;
    esac
    
    echo ""
    echo "Compilando interfaz web..."
    
    # Compilar en /tmp (ext4) si estamos en NTFS
    if df -T "$ROOT" | grep -q "fuseblk\|ntfs"; then
      echo "⚠ Detectado sistema NTFS - compilando en /tmp..."
      TMP_BUILD="/tmp/y2back-build-$$"
      mkdir -p "$TMP_BUILD/web"
      
      # Copiar solo archivos necesarios (sin node_modules)
      rsync -a --exclude 'node_modules' --exclude 'dist' "$ROOT/web/" "$TMP_BUILD/web/"
      
      cd "$TMP_BUILD/web"
      echo "Instalando dependencias en /tmp..."
      npm install --silent
      echo "Compilando..."
      npm run build
      
      # Copiar resultado compilado de vuelta
      mkdir -p "$ROOT/web/dist"
      rsync -a dist/ "$ROOT/web/dist/"
      
      # Limpiar
      cd "$ROOT"
      rm -rf "$TMP_BUILD"
      echo "✓ Compilación completada"
    else
      # Sistema de archivos normal
      cd web
      npm run build
      cd ..
    fi
    
    BUNDLE_DIR="$ROOT/dist/bundles"
    mkdir -p "$BUNDLE_DIR"
    
    # Bundle Web
    echo ""
    echo "=== Creando bundle Web Frontend ==="
    WEB_BUNDLE="$BUNDLE_DIR/web-dist.tar.gz"
    tar -czf "$WEB_BUNDLE" -C web/dist .
    echo "✓ Bundle web creado: $(du -h "$WEB_BUNDLE" | cut -f1)"
    
    # Bundle API específico por plataforma
    echo ""
    echo "=== Creando bundle API para $PLATFORM ==="
    API_BUNDLE="$BUNDLE_DIR/y2back-api-${PLATFORM}.tar.gz"
    
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT
    
    # Copiar archivos base
    cp -r api "$TEMP_DIR/"
    cp -r medios "$TEMP_DIR/" 2>/dev/null || mkdir -p "$TEMP_DIR/medios"
    cp -r logs "$TEMP_DIR/" 2>/dev/null || mkdir -p "$TEMP_DIR/logs"
    cp package.json "$TEMP_DIR/"
    cp config.js "$TEMP_DIR/"
    
    # Copiar solo los binarios de la plataforma seleccionada
    echo "Copiando binarios para $PLATFORM..."
    for binary in $BINARIES; do
      if [ -f "$ROOT/$binary" ]; then
        cp "$ROOT/$binary" "$TEMP_DIR/"
        echo "  ✓ $binary"
      else
        echo "  ⚠ $binary no encontrado"
      fi
    done
    
    # Crear tarball
    tar -czf "$API_BUNDLE" -C "$TEMP_DIR" .
    
    echo ""
    echo "======================================"
    echo "✓ Deploy completado exitosamente"
    echo "======================================"
    echo ""
    echo "Bundles creados:"
    echo "  Web:  $(du -h "$WEB_BUNDLE" | cut -f1) - $WEB_BUNDLE"
    echo "  API:  $(du -h "$API_BUNDLE" | cut -f1) - $API_BUNDLE"
    echo ""
    echo "Instrucciones de instalación en servidor $PLATFORM:"
    echo "1. Subir ambos archivos al servidor"
    echo "2. Extraer web-dist.tar.gz en el directorio público"
    echo "3. Extraer y2back-api-${PLATFORM}.tar.gz en directorio de aplicación"
    echo "4. Ejecutar: npm install --production"
    echo "5. Iniciar: node api/server.js"
    echo ""
    ;;
    
  *)
    echo "❌ Opción inválida"
    exit 1
    ;;
esac

echo "======================================"
echo "Proceso finalizado"
echo "======================================"
