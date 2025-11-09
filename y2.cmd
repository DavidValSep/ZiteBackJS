@echo off
REM Y2Back v2.0.0 - Comando corto para Windows
REM Soporte para CLI y GUI
REM Uso: y2 --all [ID_VIDEO] | y2 --gui

setlocal enabledelayedexpansion

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar si se solicita ayuda sin argumentos
if "%1"=="" goto :show_help

REM Verificar si se solicita el GUI
if "%1"=="--gui" goto :start_gui
if "%1"=="-g" goto :start_gui

REM Ejecutar comando CLI normal
echo 🎯 Ejecutando Y2Back CLI...
node "%~dp0y2back.js" %*
goto :end

:start_gui
echo 🎨 Iniciando GUI de Y2Back...
REM Verificar que npm esté disponible
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error: npm no está instalado o no está en PATH
    echo 📦 npm viene incluido con Node.js
    exit /b 1
)

REM Verificar que las dependencias estén instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm install
    if !errorlevel! neq 0 (
        echo ❌ Error al instalar dependencias
        exit /b 1
    )
)

REM Ejecutar el GUI
echo 🚀 Ejecutando: npm run electron:dev
call npm run electron:dev
goto :end

:show_help
echo 🚀 Y2Back - Descargador de YouTube
echo.
echo 📖 Uso CLI:
echo   y2 --all [ID_VIDEO]           # Descargar todo (video, audio, pics, subs, meta)
echo   y2 --video [ID_VIDEO]         # Solo video
echo   y2 --music [ID_VIDEO]         # Solo audio
echo   y2 --pics [ID_VIDEO]          # Solo caratulas
echo   y2 --subtitles [ID_VIDEO]     # Solo subtítulos
echo   y2 --meta [ID_VIDEO]          # Solo metadatos
echo   y2 --info [ID_VIDEO]          # Información JSON sin descarga
echo   y2 --search "término"         # Búsqueda interactiva
echo.
echo 🎨 Interfaz Gráfica:
echo   y2 --gui                      # Abrir GUI con Electron
echo.
echo 📋 Ejemplos:
echo   y2 --all dQw4w9WgXcQ          # Rick Astley - Never Gonna Give You Up
echo   y2 --video YQHsXMglC9A --quality 720p  # Adele - Hello en 720p
echo   y2 --music kffacxfA7G4        # Baby Shark solo audio
echo   y2 --gui                      # Abrir interfaz gráfica
echo.
echo 📋 Opciones adicionales:
echo   --quality [720p^|1080p^|best^|worst]   # Calidad de video
echo   --format [mp4^|webm^|mkv]             # Formato de video
echo.
echo 📁 Directorio de trabajo: %~dp0

:end
