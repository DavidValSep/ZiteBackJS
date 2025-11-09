param(
    [Parameter(ValueFromRemainingArguments)]
    [string[]]$Arguments
)

# Ruta del script y directorio base
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$Y2Dir = $ScriptDir
Set-Location $Y2Dir | Out-Null

# Verificar Node.js
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js no está instalado o no está en PATH" -ForegroundColor Red
    Write-Host "📦 Instala Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# GUI: y2 --gui | y2 -g
if ($Arguments.Count -gt 0 -and ($Arguments[0] -eq "--gui" -or $Arguments[0] -eq "-g")) {
    Write-Host "🎨 Iniciando GUI de Y2Back..." -ForegroundColor Green
    if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Error: npm no está instalado o no está en PATH" -ForegroundColor Red
        Write-Host "📦 npm viene incluido con Node.js" -ForegroundColor Yellow
        exit 1
    }
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) { exit 1 }
    }
    Write-Host "🚀 Ejecutando: npm run electron:dev" -ForegroundColor Blue
    npm run electron:dev
    exit $LASTEXITCODE
}

# CLI: delegar a y2back.js con los argumentos
Write-Host "🎯 Ejecutando Y2Back CLI..." -ForegroundColor Blue
if ($Arguments.Count -gt 0) {
    node y2back.js @Arguments
} else {
    node y2back.js
}

# Verificar si se solicita el GUI
if ($Arguments[0] -eq "--gui" -or $Arguments[0] -eq "-g") {
    Write-Host "🎨 Iniciando GUI de Y2Back..." -ForegroundColor Green
    
    # Verificar que npm esté disponible
    if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Error: npm no está instalado o no está en PATH" -ForegroundColor Red
        Write-Host "📦 npm viene incluido con Node.js" -ForegroundColor Yellow
        exit 1
    }
    
    # Verificar que las dependencias estén instaladas
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
            exit 1
        }
    }
    
    # Ejecutar el GUI
    Write-Host "🚀 Ejecutando: npm run electron:dev" -ForegroundColor Blue
    npm run electron:dev
    exit $LASTEXITCODE
}

# Ejecutar Y2Back CLI con todos los argumentos pasados
Write-Host "🎯 Ejecutando Y2Back CLI desde: $Y2Dir" -ForegroundColor Blue

# Construir el comando con todos los argumentos
$ArgumentString = $Arguments -join " "

# Ejecutar el comando
if ($ArgumentString) {
    node y2back.js $ArgumentString
} else {
    node y2back.js
}