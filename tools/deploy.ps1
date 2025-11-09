#!/usr/bin/env pwsh
# Script de Deploy Inteligente para Y2Back - PowerShell
# Soporta modo pruebas (Electron) y producción (bundle específico por plataforma)

$ErrorActionPreference = "Stop"

$ROOT = Split-Path -Parent $PSScriptRoot
Set-Location $ROOT

# Función para encontrar puerto disponible
function Find-AvailablePort {
    # Intentar puertos del 7770 al 7779
    for ($i = 0; $i -le 9; $i++) {
        $port = 7770 + $i
        $inUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if (-not $inUse) {
            return $port
        }
    }
    
    # Si todos están ocupados, generar uno aleatorio entre 10000-65000
    do {
        $randomPort = Get-Random -Minimum 10000 -Maximum 65000
        $inUse = Get-NetTCPConnection -LocalPort $randomPort -ErrorAction SilentlyContinue
    } while ($inUse)
    
    return $randomPort
}

Write-Host "======================================"
Write-Host "  Y2Back - Sistema de Deploy"
Write-Host "======================================"
Write-Host ""
Write-Host "¿Qué tipo de despliegue deseas realizar?"
Write-Host "1) Pruebas locales (Electron App)"
Write-Host "2) Producción (Servidor)"
Write-Host ""
$DEPLOY_TYPE = Read-Host "Selecciona una opción [1-2]"

switch ($DEPLOY_TYPE) {
    "1" {
        Write-Host ""
        Write-Host "=== MODO PRUEBAS ===" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "¿Qué deseas probar?"
        Write-Host "1) Solo Web (servidor HTTP ligero)"
        Write-Host "2) Solo Electron (aplicación de escritorio)"
        Write-Host "3) Ambos (Web + Electron simultáneamente)"
        Write-Host ""
        $TEST_TYPE = Read-Host "Selecciona una opción [1-3]"
        
        # Detectar sistema operativo actual
        $DETECTED_OS = ""
        $BUILD_CMD = ""
        $APP_PATTERN = ""
        
        if ($IsLinux) {
            $DETECTED_OS = "Linux"
            $BUILD_CMD = "build:linux"
            $APP_PATTERN = "dist/Y2Back-*.AppImage"
        }
        elseif ($IsMacOS) {
            $DETECTED_OS = "macOS"
            $BUILD_CMD = "build:mac"
            $APP_PATTERN = "dist/Y2Back*.dmg"
        }
        elseif ($IsWindows -or $env:OS -eq "Windows_NT") {
            $DETECTED_OS = "Windows"
            $BUILD_CMD = "build:win"
            $APP_PATTERN = "dist/Y2Back*.exe"
        }
        else {
            $DETECTED_OS = "Desconocido (asumiendo Windows)"
            $BUILD_CMD = "build:win"
            $APP_PATTERN = "dist/Y2Back*.exe"
        }
        
        Write-Host ""
        Write-Host "Compilando interfaz web..." -ForegroundColor Yellow
        Set-Location web
        npm run build
        Set-Location ..
        
        switch ($TEST_TYPE) {
            "1" {
                # Solo Web
                Write-Host ""
                Write-Host "=== Iniciando servidor Web de pruebas ===" -ForegroundColor Cyan
                Write-Host ""
                
                $port = Find-AvailablePort
                Write-Host "Servidor iniciándose en http://localhost:$port" -ForegroundColor Green
                Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
                Write-Host ""
                npx http-server web/dist -p $port -o
            }
            "2" {
                # Solo Electron
                Write-Host ""
                Write-Host "=== Compilando aplicación Electron para $DETECTED_OS ===" -ForegroundColor Cyan
                npm run $BUILD_CMD
                Write-Host ""
                Write-Host "✓ Aplicación compilada:" -ForegroundColor Green
                $appFiles = Get-ChildItem $APP_PATTERN -ErrorAction SilentlyContinue
                $appFiles | ForEach-Object { Write-Host "  $($_.Name) - $([math]::Round($_.Length/1MB, 2)) MB" }
                Write-Host ""
                Write-Host "Iniciando aplicación..." -ForegroundColor Yellow
                if ($appFiles) {
                    Start-Process $appFiles[0].FullName
                    Write-Host "✓ Aplicación iniciada" -ForegroundColor Green
                }
            }
            "3" {
                # Ambos
                Write-Host ""
                Write-Host "=== Iniciando servidor Web en segundo plano ===" -ForegroundColor Cyan
                
                $port = Find-AvailablePort
                
                # Iniciar servidor en segundo plano con npx
                $job = Start-Job -ScriptBlock { param($p) npx http-server web/dist -p $p } -ArgumentList $port
                Start-Sleep -Seconds 2
                
                # Abrir navegador
                Start-Process "http://localhost:$port"
                
                Write-Host "✓ Servidor Web iniciado en http://localhost:$port (Job ID: $($job.Id))" -ForegroundColor Green
                Write-Host "✓ Navegador abierto" -ForegroundColor Green
                Write-Host ""
                Write-Host "=== Compilando aplicación Electron para $DETECTED_OS ===" -ForegroundColor Cyan
                npm run $BUILD_CMD
                
                Write-Host ""
                Write-Host "✓ Aplicación compilada:" -ForegroundColor Green
                $appFiles = Get-ChildItem $APP_PATTERN -ErrorAction SilentlyContinue
                $appFiles | ForEach-Object { Write-Host "  $($_.Name) - $([math]::Round($_.Length/1MB, 2)) MB" }
                
                Write-Host ""
                Write-Host "Iniciando aplicación Electron..." -ForegroundColor Yellow
                if ($appFiles) {
                    Start-Process $appFiles[0].FullName
                    Write-Host "✓ Aplicación Electron iniciada" -ForegroundColor Green
                }
                
                Write-Host ""
                Write-Host "⚠ El servidor Web sigue corriendo en segundo plano (Job ID: $($job.Id))" -ForegroundColor Yellow
                Write-Host "Para detenerlo ejecuta: Stop-Job -Id $($job.Id); Remove-Job -Id $($job.Id)" -ForegroundColor Yellow
            }
            default {
                Write-Host "❌ Opción inválida" -ForegroundColor Red
                exit 1
            }
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "=== MODO PRODUCCIÓN ===" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "¿En qué sistema operativo está el servidor de producción?"
        Write-Host "1) Linux"
        Write-Host "2) Windows Server"
        Write-Host "3) macOS Server"
        Write-Host ""
        $SERVER_OS = Read-Host "Selecciona el sistema del servidor [1-3]"
        
        $PLATFORM = ""
        $BINARIES = @()
        
        switch ($SERVER_OS) {
            "1" {
                $PLATFORM = "linux"
                $BINARIES = @("yt-dlp", "ffmpeg", "ffprobe")
            }
            "2" {
                $PLATFORM = "windows"
                $BINARIES = @("yt-dlp.exe", "ffmpeg.exe", "ffprobe.exe")
            }
            "3" {
                $PLATFORM = "macos"
                $BINARIES = @("yt-dlp_macos", "ffmpeg_macos", "ffprobe_macos")
            }
            default {
                Write-Host "❌ Opción inválida" -ForegroundColor Red
                exit 1
            }
        }
        
        Write-Host ""
        Write-Host "Compilando interfaz web..." -ForegroundColor Yellow
        Set-Location web
        npm run build
        Set-Location ..
        
        $BUNDLE_DIR = Join-Path $ROOT "dist/bundles"
        if (-not (Test-Path $BUNDLE_DIR)) {
            New-Item -ItemType Directory -Path $BUNDLE_DIR | Out-Null
        }
        
        # Bundle Web
        Write-Host ""
        Write-Host "=== Creando bundle Web Frontend ===" -ForegroundColor Cyan
        $WEB_BUNDLE = Join-Path $BUNDLE_DIR "web-dist.tar.gz"
        tar -czf $WEB_BUNDLE -C web/dist .
        $webSize = [math]::Round((Get-Item $WEB_BUNDLE).Length/1MB, 2)
        Write-Host "✓ Bundle web creado: $webSize MB" -ForegroundColor Green
        
        # Bundle API específico por plataforma
        Write-Host ""
        Write-Host "=== Creando bundle API para $PLATFORM ===" -ForegroundColor Cyan
        $API_BUNDLE = Join-Path $BUNDLE_DIR "y2back-api-$PLATFORM.tar.gz"
        
        $TEMP_DIR = Join-Path $env:TEMP "y2back-deploy-$(Get-Random)"
        New-Item -ItemType Directory -Path $TEMP_DIR | Out-Null
        
        try {
            # Copiar archivos base
            Copy-Item -Recurse -Path api -Destination $TEMP_DIR
            if (Test-Path medios) {
                Copy-Item -Recurse -Path medios -Destination $TEMP_DIR
            } else {
                New-Item -ItemType Directory -Path (Join-Path $TEMP_DIR "medios") | Out-Null
            }
            if (Test-Path logs) {
                Copy-Item -Recurse -Path logs -Destination $TEMP_DIR
            } else {
                New-Item -ItemType Directory -Path (Join-Path $TEMP_DIR "logs") | Out-Null
            }
            Copy-Item package.json -Destination $TEMP_DIR
            Copy-Item config.js -Destination $TEMP_DIR
            
            # Copiar solo los binarios de la plataforma seleccionada
            Write-Host "Copiando binarios para $PLATFORM..." -ForegroundColor Yellow
            foreach ($binary in $BINARIES) {
                $binaryPath = Join-Path $ROOT $binary
                if (Test-Path $binaryPath) {
                    Copy-Item $binaryPath -Destination $TEMP_DIR
                    Write-Host "  ✓ $binary" -ForegroundColor Green
                } else {
                    Write-Host "  ⚠ $binary no encontrado" -ForegroundColor Yellow
                }
            }
            
            # Crear tarball
            tar -czf $API_BUNDLE -C $TEMP_DIR .
            
        } finally {
            Remove-Item -Recurse -Force $TEMP_DIR
        }
        
        $apiSize = [math]::Round((Get-Item $API_BUNDLE).Length/1MB, 2)
        
        Write-Host ""
        Write-Host "======================================" -ForegroundColor Green
        Write-Host "✓ Deploy completado exitosamente" -ForegroundColor Green
        Write-Host "======================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Bundles creados:"
        Write-Host "  Web:  $webSize MB - $WEB_BUNDLE"
        Write-Host "  API:  $apiSize MB - $API_BUNDLE"
        Write-Host ""
        Write-Host "Instrucciones de instalación en servidor $PLATFORM:" -ForegroundColor Cyan
        Write-Host "1. Subir ambos archivos al servidor"
        Write-Host "2. Extraer web-dist.tar.gz en el directorio público"
        Write-Host "3. Extraer y2back-api-$PLATFORM.tar.gz en directorio de aplicación"
        Write-Host "4. Ejecutar: npm install --production"
        Write-Host "5. Iniciar: node api/server.js"
        Write-Host ""
    }
    
    default {
        Write-Host "❌ Opción inválida" -ForegroundColor Red
        exit 1
    }
}

Write-Host "======================================"
Write-Host "Proceso finalizado"
Write-Host "======================================"
