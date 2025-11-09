#!/bin/bash
# ========================================
#  Y2Back Deploy Manager v3.2.2 - cPanel
# ========================================
#  Script interactivo para deployment en cPanel
#  Autor: DavidValSep
#  Fecha: 2025-11-09
# ========================================

# Colores
RESET='\033[0m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'

clear

echo -e "${CYAN}"
echo "========================================"
echo "  🚀 Y2Back Deploy - cPanel"
echo "========================================"
echo "  Deployment automático en hosting cPanel"
echo "========================================"
echo -e "${RESET}"

menu_principal() {
    echo -e "${GREEN}[1]${RESET} Generar bundle de deployment"
    echo -e "${GREEN}[2]${RESET} Verificar requisitos"
    echo -e "${GREEN}[3]${RESET} Instrucciones de instalación"
    echo -e "${GREEN}[4]${RESET} Salir"
    echo
    read -p "Selecciona una opción (1-4): " opcion
    
    case $opcion in
        1) generar_bundle ;;
        2) verificar_requisitos ;;
        3) mostrar_instrucciones ;;
        4) salir ;;
        *) 
            echo -e "${RED}❌ Opción inválida. Por favor selecciona 1-4.${RESET}"
            echo
            menu_principal
            ;;
    esac
}

generar_bundle() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  📦 Generar Bundle cPanel"
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo -e "${BLUE}📋 Archivos a incluir en el bundle:${RESET}"
    echo "   ✅ api/ (Backend Express)"
    echo "   ✅ package.json"
    echo "   ✅ app.js (Passenger entry point)"
    echo "   ✅ yt-dlp (Linux binary)"
    echo "   ✅ ffmpeg (Linux binary)"
    echo "   ✅ ffprobe (Linux binary)"
    echo "   ✅ README_DEPLOY_QUICK.md"
    echo
    echo -e "${YELLOW}⏳ Generando bundle...${RESET}"
    echo
    
    # Verificar que exista el script de build
    if [ -f "tools/build-deploy-bundle.sh" ]; then
        bash tools/build-deploy-bundle.sh
        echo
        echo -e "${GREEN}✅ Bundle generado en dist/bundles/${RESET}"
        echo -e "${BLUE}📦 Archivo: y2back-api.tar.gz${RESET}"
    else
        echo -e "${YELLOW}ℹ️  Script de build no encontrado.${RESET}"
        echo -e "${YELLOW}ℹ️  Funcionalidad en desarrollo...${RESET}"
    fi
    echo
    read -p "Presiona Enter para volver al menú..."
    clear
    menu_principal
}

verificar_requisitos() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  ✅ Verificar Requisitos"
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo -e "${BLUE}🔍 Verificando binarios...${RESET}"
    echo
    
    # Verificar Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}✅ Node.js:${RESET} $NODE_VERSION"
    else
        echo -e "${RED}❌ Node.js: No instalado${RESET}"
    fi
    
    # Verificar npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        echo -e "${GREEN}✅ npm:${RESET} $NPM_VERSION"
    else
        echo -e "${RED}❌ npm: No instalado${RESET}"
    fi
    
    # Verificar yt-dlp
    if [ -f "yt-dlp" ]; then
        echo -e "${GREEN}✅ yt-dlp:${RESET} Presente (local)"
    elif command -v yt-dlp &> /dev/null; then
        YTDLP_VERSION=$(yt-dlp --version 2>/dev/null || echo "desconocida")
        echo -e "${GREEN}✅ yt-dlp:${RESET} $YTDLP_VERSION (sistema)"
    else
        echo -e "${YELLOW}⚠️  yt-dlp: No encontrado${RESET}"
    fi
    
    # Verificar ffmpeg
    if [ -f "ffmpeg" ]; then
        echo -e "${GREEN}✅ ffmpeg:${RESET} Presente (local)"
    elif command -v ffmpeg &> /dev/null; then
        echo -e "${GREEN}✅ ffmpeg:${RESET} Instalado (sistema)"
    else
        echo -e "${YELLOW}⚠️  ffmpeg: No encontrado (opcional)${RESET}"
    fi
    
    # Verificar ffprobe
    if [ -f "ffprobe" ]; then
        echo -e "${GREEN}✅ ffprobe:${RESET} Presente (local)"
    elif command -v ffprobe &> /dev/null; then
        echo -e "${GREEN}✅ ffprobe:${RESET} Instalado (sistema)"
    else
        echo -e "${YELLOW}⚠️  ffprobe: No encontrado (opcional)${RESET}"
    fi
    
    echo
    echo -e "${BLUE}📁 Verificando estructura de archivos...${RESET}"
    echo
    
    [ -d "api" ] && echo -e "${GREEN}✅ api/${RESET}" || echo -e "${RED}❌ api/${RESET}"
    [ -f "package.json" ] && echo -e "${GREEN}✅ package.json${RESET}" || echo -e "${RED}❌ package.json${RESET}"
    [ -f "app.js" ] && echo -e "${GREEN}✅ app.js${RESET}" || echo -e "${YELLOW}⚠️  app.js (crear si no existe)${RESET}"
    
    echo
    read -p "Presiona Enter para volver al menú..."
    clear
    menu_principal
}

mostrar_instrucciones() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  📚 Instrucciones de Instalación cPanel"
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo -e "${BLUE}📋 Pasos para deployment en cPanel:${RESET}"
    echo
    echo "1️⃣  ${GREEN}Genera el bundle${RESET}"
    echo "   bash deploy-cpanel.sh → Opción 1"
    echo
    echo "2️⃣  ${GREEN}Sube el archivo al servidor${RESET}"
    echo "   - Accede a cPanel → File Manager"
    echo "   - Sube y2back-api.tar.gz a /home/usuario/y2back"
    echo
    echo "3️⃣  ${GREEN}Extrae el bundle${RESET}"
    echo "   tar -xzf y2back-api.tar.gz"
    echo
    echo "4️⃣  ${GREEN}Configura Node.js en cPanel${RESET}"
    echo "   - Setup Node.js App"
    echo "   - Application root: /home/usuario/y2back"
    echo "   - Application startup file: app.js"
    echo "   - Node.js version: 18.x o superior"
    echo
    echo "5️⃣  ${GREEN}Variables de entorno${RESET}"
    echo "   NODE_ENV=production"
    echo "   PORT=3000"
    echo "   CORS_ORIGINS=https://tu-dominio.com"
    echo
    echo "6️⃣  ${GREEN}Instala dependencias${RESET}"
    echo "   Run NPM Install"
    echo
    echo "7️⃣  ${GREEN}Inicia la aplicación${RESET}"
    echo "   Start Application"
    echo
    echo -e "${YELLOW}💡 Para más detalles: DEPLOY_CPANEL.md${RESET}"
    echo
    read -p "Presiona Enter para volver al menú..."
    clear
    menu_principal
}

salir() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  👋 Saliendo..."
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo "Gracias por usar Y2Back Deploy Manager"
    echo
    sleep 2
    exit 0
}

# Inicio del script
menu_principal
