@echo off
REM Script de Deploy Inteligente para Y2Back - Windows
REM Soporta modo pruebas (Electron) y producción (bundle específico por plataforma)

setlocal enabledelayedexpansion

cd /d "%~dp0.."
set ROOT=%CD%

REM Función para encontrar puerto disponible (7770-7779)
set PORT=7770
:FIND_PORT
netstat -ano | findstr ":%PORT%" >nul
if %ERRORLEVEL% EQU 0 (
    set /a PORT=%PORT%+1
    if %PORT% LEQ 7779 goto FIND_PORT
    REM Si todos ocupados, generar aleatorio
    set /a PORT=10000 + %RANDOM% %% 55000
)

echo ======================================
echo   Y2Back - Sistema de Deploy
echo ======================================
echo.
echo ¿Qué tipo de despliegue deseas realizar?
echo 1) Pruebas locales (Electron App)
echo 2) Producción (Servidor)
echo.
set /p DEPLOY_TYPE="Selecciona una opción [1-2]: "

if "%DEPLOY_TYPE%"=="1" goto PRUEBAS
if "%DEPLOY_TYPE%"=="2" goto PRODUCCION
echo ❌ Opción inválida
exit /b 1

:PRUEBAS
echo.
echo === MODO PRUEBAS ===
echo.
echo ¿Qué deseas probar?
echo 1) Solo Web (servidor HTTP ligero)
echo 2) Solo Electron (aplicación de escritorio)
echo 3) Ambos (Web + Electron simultáneamente)
echo.
set /p TEST_TYPE="Selecciona una opción [1-3]: "

echo.
echo Compilando interfaz web...
cd web
call npm run build
cd ..

if "%TEST_TYPE%"=="1" goto TEST_WEB
if "%TEST_TYPE%"=="2" goto TEST_ELECTRON
if "%TEST_TYPE%"=="3" goto TEST_BOTH
echo ❌ Opción inválida
exit /b 1

:TEST_WEB
echo.
echo === Iniciando servidor Web de pruebas ===
echo.
echo Servidor iniciándose en http://localhost:%PORT%
echo Presiona Ctrl+C para detener el servidor
echo.
npx http-server web\dist -p %PORT% -o
goto END

:TEST_ELECTRON
echo.
echo === Compilando aplicación Electron para Windows ===
call npm run build:win
echo.
echo ✓ Aplicación compilada:
dir dist\Y2Back*.exe 2>nul || echo ⚠ No se encontró el instalador
echo.
echo Iniciando aplicación...
for %%f in (dist\Y2Back*.exe) do start "" "%%f"
goto END

:TEST_BOTH
echo.
echo === Iniciando servidor Web en segundo plano ===
start /B npx http-server web\dist -p %PORT% >nul 2>nul
timeout /t 2 /nobreak >nul
start http://localhost:%PORT%
echo ✓ Servidor Web iniciado en http://localhost:%PORT%
echo ✓ Navegador abierto
echo.
echo === Compilando aplicación Electron para Windows ===
call npm run build:win
echo.
echo ✓ Aplicación compilada:
dir dist\Y2Back*.exe 2>nul || echo ⚠ No se encontró el instalador
echo.
echo Iniciando aplicación Electron...
for %%f in (dist\Y2Back*.exe) do start "" "%%f"
echo.
echo ⚠ El servidor Web sigue corriendo en segundo plano
echo Para detenerlo: taskkill /F /IM node.exe /FI "WINDOWTITLE eq http-server*"
goto END

:PRODUCCION
echo.
echo === MODO PRODUCCIÓN ===
echo.
echo ¿En qué sistema operativo está el servidor de producción?
echo 1) Linux
echo 2) Windows Server
echo 3) macOS Server
echo.
set /p SERVER_OS="Selecciona el sistema del servidor [1-3]: "

if "%SERVER_OS%"=="1" (
    set PLATFORM=linux
    set BINARIES=yt-dlp ffmpeg ffprobe
)
if "%SERVER_OS%"=="2" (
    set PLATFORM=windows
    set BINARIES=yt-dlp.exe ffmpeg.exe ffprobe.exe
)
if "%SERVER_OS%"=="3" (
    set PLATFORM=macos
    set BINARIES=yt-dlp_macos ffmpeg_macos ffprobe_macos
)

if not defined PLATFORM (
    echo ❌ Opción inválida
    exit /b 1
)

echo.
echo Compilando interfaz web...
cd web
call npm run build
cd ..

set BUNDLE_DIR=%ROOT%\dist\bundles
if not exist "%BUNDLE_DIR%" mkdir "%BUNDLE_DIR%"

REM Bundle Web
echo.
echo === Creando bundle Web Frontend ===
set WEB_BUNDLE=%BUNDLE_DIR%\web-dist.tar.gz
tar -czf "%WEB_BUNDLE%" -C web\dist .
echo ✓ Bundle web creado

REM Bundle API específico por plataforma
echo.
echo === Creando bundle API para %PLATFORM% ===
set API_BUNDLE=%BUNDLE_DIR%\y2back-api-%PLATFORM%.tar.gz

set TEMP_DIR=%TEMP%\y2back-deploy-%RANDOM%
mkdir "%TEMP_DIR%"

REM Copiar archivos base
xcopy /E /I /Q api "%TEMP_DIR%\api\"
if exist medios xcopy /E /I /Q medios "%TEMP_DIR%\medios\" else mkdir "%TEMP_DIR%\medios"
if exist logs xcopy /E /I /Q logs "%TEMP_DIR%\logs\" else mkdir "%TEMP_DIR%\logs"
copy package.json "%TEMP_DIR%\"
copy config.js "%TEMP_DIR%\"

REM Copiar binarios de la plataforma seleccionada
echo Copiando binarios para %PLATFORM%...
for %%B in (%BINARIES%) do (
    if exist "%ROOT%\%%B" (
        copy "%ROOT%\%%B" "%TEMP_DIR%\"
        echo   ✓ %%B
    ) else (
        echo   ⚠ %%B no encontrado
    )
)

REM Crear tarball
tar -czf "%API_BUNDLE%" -C "%TEMP_DIR%" .
rmdir /S /Q "%TEMP_DIR%"

echo.
echo ======================================
echo ✓ Deploy completado exitosamente
echo ======================================
echo.
echo Bundles creados:
dir "%WEB_BUNDLE%" | find "web-dist"
dir "%API_BUNDLE%" | find "y2back-api"
echo.
echo Instrucciones de instalación en servidor %PLATFORM%:
echo 1. Subir ambos archivos al servidor
echo 2. Extraer web-dist.tar.gz en el directorio público
echo 3. Extraer y2back-api-%PLATFORM%.tar.gz en directorio de aplicación
echo 4. Ejecutar: npm install --production
echo 5. Iniciar: node api/server.js
echo.

:END
echo ======================================
echo Proceso finalizado
echo ======================================
endlocal
