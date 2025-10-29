@echo off
@REM ZiteBackJS - Comando Corto 'zb' para Windows
@REM Permite usar: zb -u https://example.com -w=5

@REM Buscar ziteback.js en el directorio actual
if exist "%~dp0ziteback.js" (
    node "%~dp0ziteback.js" %*
    goto :end
)

@REM Buscar ziteback.js globalmente instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no encontrado. Instalar desde https://nodejs.org/
    exit /b 1
)

@REM Intentar ejecutar desde instalación global
node "%~dp0ziteback.js" %*
if %errorlevel% neq 0 (
    echo ❌ Error: ziteback.js no encontrado
    echo 💡 Tip: Ejecutar desde el directorio de ZiteBackJS o instalar globalmente
    echo    npm install -g .
    exit /b 1
)

:end