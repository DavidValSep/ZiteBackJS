#!/bin/bash
# Build Electron apps para Linux, macOS y Windows
# Requiere: Node.js >= 18, npm >= 9, electron-builder instalado

set -e

echo "🔨 Y2Back Electron Builder v3.1.0"
echo "=================================="
echo ""

# Verificar dependencias
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado"
    exit 1
fi

echo "✓ Node.js $(node --version)"
echo "✓ npm $(npm --version)"
echo ""

# Navegar al directorio del proyecto
cd "$(dirname "$0")"
PROJECT_ROOT="$(pwd)"

echo "📂 Directorio del proyecto: $PROJECT_ROOT"
echo ""

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del proyecto..."
    npm install
    echo ""
fi

# Build del frontend web primero
echo "🌐 Compilando frontend web..."
if [ -d "web" ]; then
    cd web
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias web..."
        npm install
    fi
    echo "⚙️  Ejecutando build de producción..."
    npm run build
    cd "$PROJECT_ROOT"
    echo "✓ Frontend web compilado en web/dist/"
else
    echo "⚠️  Directorio web/ no encontrado, saltando build web"
fi
echo ""

# Crear directorio de salida
mkdir -p dist/electron

echo "🚀 Compilando aplicaciones Electron..."
echo ""

# Linux AppImage
echo "🐧 Compilando para Linux (AppImage)..."
npm run build:linux
echo "✓ Linux AppImage creado"
echo ""

# macOS DMG
echo "🍎 Compilando para macOS (DMG)..."
npm run build:mac
echo "✓ macOS DMG creado"
echo ""

# Windows Portable
echo "🪟 Compilando para Windows (Portable)..."
npm run build:win
echo "✓ Windows Portable creado"
echo ""

# Listar archivos generados
echo "📦 Archivos generados:"
echo "====================="
ls -lh dist/*.{AppImage,dmg,exe} 2>/dev/null || ls -lh dist/ || echo "Ver contenido en dist/"
echo ""

# Crear directorio downloads si no existe
mkdir -p web/public/downloads

# Copiar builds al directorio de descargas web
echo "📋 Copiando builds a web/public/downloads/..."
cp dist/*.AppImage web/public/downloads/ 2>/dev/null || true
cp dist/*.dmg web/public/downloads/ 2>/dev/null || true
cp dist/*.exe web/public/downloads/ 2>/dev/null || true
echo ""

echo "✅ Build completado exitosamente!"
echo ""
echo "📍 Los archivos están en:"
echo "   - dist/ (builds originales)"
echo "   - web/public/downloads/ (para servir desde web)"
echo ""
echo "🌐 Para probar el landing con los links de descarga:"
echo "   cd web && npm run preview"
echo "   Luego visita http://localhost:4173/landing.html"
echo ""
