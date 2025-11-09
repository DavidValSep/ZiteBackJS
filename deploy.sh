#!/bin/bash
# ========================================
#  Y2Back Deploy Manager v3.2.2 - Linux
# ========================================
#  Script interactivo para pruebas y deployment
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
echo "  🚀 Y2Back Deploy Manager v3.2.2"
echo "========================================"
echo "  Gestión de Pruebas y Deployment"
echo "========================================"
echo -e "${RESET}"

menu_principal() {
    echo -e "${GREEN}[1]${RESET} Pruebas (Testing)"
    echo -e "${GREEN}[2]${RESET} Deploy en Servidor"
    echo -e "${GREEN}[3]${RESET} Salir"
    echo
    read -p "Selecciona una opción (1-3): " opcion
    
    case $opcion in
        1) menu_pruebas ;;
        2) menu_deploy ;;
        3) salir ;;
        *) 
            echo -e "${RED}❌ Opción inválida. Por favor selecciona 1, 2 o 3.${RESET}"
            echo
            menu_principal
            ;;
    esac
}

menu_pruebas() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  🧪 Modo Pruebas"
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo -e "${GREEN}[1]${RESET} Navegador Web (React + Vite)"
    echo -e "${GREEN}[2]${RESET} Electron GUI"
    echo -e "${GREEN}[3]${RESET} Ambos (Web + Electron)"
    echo -e "${GREEN}[4]${RESET} Volver al menú principal"
    echo
    read -p "Selecciona el tipo de prueba (1-4): " prueba
    
    case $prueba in
        1) prueba_web ;;
        2) prueba_electron ;;
        3) prueba_ambos ;;
        4) clear; menu_principal ;;
        *)
            echo -e "${RED}❌ Opción inválida.${RESET}"
            echo
            menu_pruebas
            ;;
    esac
}

prueba_web() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  🌐 Iniciando Servidor Web"
    echo "========================================"
    echo -e "${RESET}"
    echo
    
    # Función para encontrar puerto disponible
    find_port() {
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
    
    PORT=$(find_port)
    echo -e "${BLUE}ℹ️  El servidor se abrirá en http://localhost:$PORT${RESET}"
    echo -e "${BLUE}ℹ️  Presiona Ctrl+C para detener el servidor${RESET}"
    echo
    read -p "Presiona Enter para continuar..."
    echo
    echo -e "${GREEN}🚀 Iniciando...${RESET}"
    
    # Compilar web si no existe dist
    if [ ! -d "web/dist" ]; then
        echo -e "${YELLOW}⏳ Compilando interfaz web...${RESET}"
        cd web
        npm run build
        cd ..
    fi
    
    # Verificar si http-server está disponible (primera ejecución puede descargar)
    if ! command -v http-server &> /dev/null; then
        echo -e "${YELLOW}⏳ Descargando http-server (solo la primera vez)...${RESET}"
    fi
    
    echo -e "${BLUE}📡 Iniciando servidor en http://localhost:$PORT${RESET}"
    echo -e "${BLUE}🌐 Abriendo navegador...${RESET}"
    npx http-server web/dist -p $PORT -o
}

prueba_electron() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  💻 Iniciando Electron GUI"
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo -e "${BLUE}ℹ️  La ventana de Electron se abrirá automáticamente${RESET}"
    echo -e "${BLUE}ℹ️  Cierra la ventana para salir${RESET}"
    echo
    read -p "Presiona Enter para continuar..."
    echo
    echo -e "${GREEN}🚀 Iniciando...${RESET}"
    npm run electron:dev
}

prueba_ambos() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  🌐💻 Iniciando Web + Electron"
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo -e "${BLUE}ℹ️  Se abrirán 2 ventanas:${RESET}"
    echo "   - Navegador: servidor HTTP en puerto dinámico (7770-7779, o aleatorio)"
    echo "   - Electron GUI"
    echo
    echo -e "${YELLOW}⚠️  Abre 2 terminales para ejecutar:${RESET}"
    echo "   Terminal 1: ./tools/deploy.sh (opción 1 > opción 1)"
    echo "   Terminal 2: npm run electron:dev"
    echo
    read -p "Presiona Enter para volver al menú..."
    clear
    menu_principal
}

menu_deploy() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  🚀 Modo Deploy"
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo "Selecciona el Sistema Operativo del servidor:"
    echo
    echo -e "${GREEN}[1]${RESET} Linux (Ubuntu/Debian/CentOS/Fedora)"
    echo -e "${GREEN}[2]${RESET} Windows Server"
    echo -e "${GREEN}[3]${RESET} macOS"
    echo -e "${GREEN}[4]${RESET} Volver al menú principal"
    echo
    read -p "Selecciona el S.O. (1-4): " so
    
    case $so in
        1) deploy_linux ;;
        2) deploy_windows ;;
        3) deploy_macos ;;
        4) clear; menu_principal ;;
        *)
            echo -e "${RED}❌ Opción inválida.${RESET}"
            echo
            menu_deploy
            ;;
    esac
}

deploy_linux() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  🐧 Deploy para Linux"
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo -e "${BLUE}📦 Binarios requeridos:${RESET}"
    echo "   - yt-dlp (Linux x64)"
    echo "   - ffmpeg (Linux x64)"
    echo "   - ffprobe (Linux x64)"
    echo
    echo -e "${BLUE}📋 Próximos pasos:${RESET}"
    echo "   1. Generar bundle de deployment"
    echo "   2. Copiar archivos al servidor"
    echo "   3. Instalar dependencias (npm install --production)"
    echo "   4. Configurar systemd service"
    echo "   5. Iniciar aplicación"
    echo
    echo -e "${YELLOW}ℹ️  Funcionalidad en desarrollo...${RESET}"
    echo
    read -p "Presiona Enter para volver al menú..."
    clear
    menu_principal
}

deploy_windows() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  🪟 Deploy para Windows Server"
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo -e "${BLUE}📦 Binarios requeridos:${RESET}"
    echo "   - yt-dlp.exe (Windows x64)"
    echo "   - ffmpeg.exe (Windows x64)"
    echo "   - ffprobe.exe (Windows x64)"
    echo
    echo -e "${BLUE}📋 Próximos pasos:${RESET}"
    echo "   1. Generar bundle de deployment"
    echo "   2. Copiar archivos al servidor"
    echo "   3. Instalar dependencias (npm install --production)"
    echo "   4. Configurar como servicio de Windows"
    echo "   5. Iniciar aplicación"
    echo
    echo -e "${YELLOW}ℹ️  Funcionalidad en desarrollo...${RESET}"
    echo
    read -p "Presiona Enter para volver al menú..."
    clear
    menu_principal
}

deploy_macos() {
    clear
    echo -e "${CYAN}"
    echo "========================================"
    echo "  🍎 Deploy para macOS"
    echo "========================================"
    echo -e "${RESET}"
    echo
    echo -e "${BLUE}📦 Binarios requeridos:${RESET}"
    echo "   - yt-dlp_macos (macOS x64/arm64)"
    echo "   - ffmpeg_macos (macOS x64/arm64)"
    echo "   - ffprobe_macos (macOS x64/arm64)"
    echo
    echo -e "${BLUE}📋 Próximos pasos:${RESET}"
    echo "   1. Generar bundle de deployment"
    echo "   2. Copiar archivos al servidor"
    echo "   3. Instalar dependencias (npm install --production)"
    echo "   4. Configurar launchd service"
    echo "   5. Iniciar aplicación"
    echo
    echo -e "${YELLOW}ℹ️  Funcionalidad en desarrollo...${RESET}"
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
