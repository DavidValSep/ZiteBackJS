@echo off
REM ========================================
REM  Y2Back Deploy Manager v3.2.2 - Windows
REM ========================================
REM  Script interactivo para pruebas y deployment
REM  Autor: DavidValSep
REM  Fecha: 2025-11-09
REM ========================================

chcp 65001 >nul
color 0B
cls

echo.
echo ========================================
echo  🚀 Y2Back Deploy Manager v3.2.2
echo ========================================
echo  Gestión de Pruebas y Deployment
echo ========================================
echo.

:MENU_PRINCIPAL
echo [1] Pruebas (Testing)
echo [2] Deploy en Servidor
echo [3] Salir
echo.
set /p OPCION="Selecciona una opción (1-3): "

if "%OPCION%"=="1" goto MENU_PRUEBAS
if "%OPCION%"=="2" goto MENU_DEPLOY
if "%OPCION%"=="3" goto SALIR
echo.
echo ❌ Opción inválida. Por favor selecciona 1, 2 o 3.
echo.
goto MENU_PRINCIPAL

:MENU_PRUEBAS
cls
echo.
echo ========================================
echo  🧪 Modo Pruebas
echo ========================================
echo.
echo [1] Navegador Web (React + Vite)
echo [2] Electron GUI
echo [3] Ambos (Web + Electron)
echo [4] Volver al menú principal
echo.
set /p PRUEBA="Selecciona el tipo de prueba (1-4): "

if "%PRUEBA%"=="1" goto PRUEBA_WEB
if "%PRUEBA%"=="2" goto PRUEBA_ELECTRON
if "%PRUEBA%"=="3" goto PRUEBA_AMBOS
if "%PRUEBA%"=="4" goto MENU_PRINCIPAL
echo.
echo ❌ Opción inválida.
echo.
goto MENU_PRUEBAS

:PRUEBA_WEB
cls
echo.
echo ========================================
echo  🌐 Iniciando Servidor Web
echo ========================================
echo.

REM Función para encontrar puerto disponible
set PORT=7770
netstat -an | find ":7770 " >nul
if %ERRORLEVEL% EQU 0 (
    REM 7770 ocupado, probar 7771-7779
    for %%p in (7771 7772 7773 7774 7775 7776 7777 7778 7779) do (
        netstat -an | find ":%%p " >nul
        if !ERRORLEVEL! NEQ 0 (
            set PORT=%%p
            goto FOUND_PORT
        )
    )
    REM Todos ocupados, usar aleatorio
    set /a PORT=10000 + %RANDOM% %% 55000
)
:FOUND_PORT

echo ℹ️  El servidor se abrirá en http://localhost:%PORT%
echo ℹ️  Presiona Ctrl+C para detener el servidor
echo.
pause
echo.
echo 🚀 Iniciando...

REM Compilar web si no existe dist
if not exist "web\dist" (
    echo ⏳ Compilando interfaz web...
    cd web
    call npm run build
    cd ..
)

echo 📡 Iniciando servidor en http://localhost:%PORT%
echo 🌐 Abriendo navegador...
npx http-server web/dist -p %PORT% -o
goto FIN

:PRUEBA_ELECTRON
cls
echo.
echo ========================================
echo  💻 Iniciando Electron GUI
echo ========================================
echo.
echo ℹ️  La ventana de Electron se abrirá automáticamente
echo ℹ️  Cierra la ventana para salir
echo.
pause
echo.
echo 🚀 Iniciando...
npm run electron:dev
goto FIN

:PRUEBA_AMBOS
cls
echo.
echo ========================================
echo  🌐💻 Iniciando Web + Electron
echo ========================================
echo.
echo ℹ️  Se abrirán 2 ventanas:
echo    - Navegador: servidor HTTP en puerto dinámico (7770-7779, o aleatorio)
echo    - Electron GUI
echo.
echo ⚠️  Abre 2 terminales para ejecutar:
echo    Terminal 1: deploy.cmd (opción 1 ^> opción 1)
echo    Terminal 2: npm run electron:dev
echo.
pause
goto MENU_PRINCIPAL

:MENU_DEPLOY
cls
echo.
echo ========================================
echo  🚀 Modo Deploy
echo ========================================
echo.
echo Selecciona el Sistema Operativo del servidor:
echo.
echo [1] Linux (Ubuntu/Debian/CentOS/Fedora)
echo [2] Windows Server
echo [3] macOS
echo [4] Volver al menú principal
echo.
set /p SO="Selecciona el S.O. (1-4): "

if "%SO%"=="1" goto DEPLOY_LINUX
if "%SO%"=="2" goto DEPLOY_WINDOWS
if "%SO%"=="3" goto DEPLOY_MACOS
if "%SO%"=="4" goto MENU_PRINCIPAL
echo.
echo ❌ Opción inválida.
echo.
goto MENU_DEPLOY

:DEPLOY_LINUX
cls
echo.
echo ========================================
echo  🐧 Deploy para Linux
echo ========================================
echo.
echo 📦 Binarios requeridos:
echo    - yt-dlp (Linux x64)
echo    - ffmpeg (Linux x64)
echo    - ffprobe (Linux x64)
echo.
echo 📋 Próximos pasos:
echo    1. Generar bundle de deployment
echo    2. Copiar archivos al servidor
echo    3. Instalar dependencias (npm install --production)
echo    4. Configurar systemd service
echo    5. Iniciar aplicación
echo.
echo ℹ️  Funcionalidad en desarrollo...
echo.
pause
goto MENU_PRINCIPAL

:DEPLOY_WINDOWS
cls
echo.
echo ========================================
echo  🪟 Deploy para Windows Server
echo ========================================
echo.
echo 📦 Binarios requeridos:
echo    - yt-dlp.exe (Windows x64)
echo    - ffmpeg.exe (Windows x64)
echo    - ffprobe.exe (Windows x64)
echo.
echo 📋 Próximos pasos:
echo    1. Generar bundle de deployment
echo    2. Copiar archivos al servidor
echo    3. Instalar dependencias (npm install --production)
echo    4. Configurar como servicio de Windows
echo    5. Iniciar aplicación
echo.
echo ℹ️  Funcionalidad en desarrollo...
echo.
pause
goto MENU_PRINCIPAL

:DEPLOY_MACOS
cls
echo.
echo ========================================
echo  🍎 Deploy para macOS
echo ========================================
echo.
echo 📦 Binarios requeridos:
echo    - yt-dlp_macos (macOS x64/arm64)
echo    - ffmpeg_macos (macOS x64/arm64)
echo    - ffprobe_macos (macOS x64/arm64)
echo.
echo 📋 Próximos pasos:
echo    1. Generar bundle de deployment
echo    2. Copiar archivos al servidor
echo    3. Instalar dependencias (npm install --production)
echo    4. Configurar launchd service
echo    5. Iniciar aplicación
echo.
echo ℹ️  Funcionalidad en desarrollo...
echo.
pause
goto MENU_PRINCIPAL

:SALIR
cls
echo.
echo ========================================
echo  👋 Saliendo...
echo ========================================
echo.
echo Gracias por usar Y2Back Deploy Manager
echo.
timeout /t 2 >nul
exit /b 0

:FIN
echo.
pause
goto MENU_PRINCIPAL
