# Script para organizar archivos del repositorio ZiteBackJS
# Mueve archivos no esenciales a la carpeta archive/

Write-Host "🧹 Organizando archivos del repositorio ZiteBackJS..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json") -or !(Test-Path "ziteback.js")) {
    Write-Host "❌ Error: No se encontraron los archivos principales. Ejecutar desde la raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Crear carpeta archive si no existe
if (!(Test-Path "archive")) {
    New-Item -ItemType Directory -Name "archive" -Force
    Write-Host "📁 Carpeta archive/ creada" -ForegroundColor Yellow
}

# Lista de archivos a mover
$archivosParaMover = @(
    "test-sendgrid.js",
    "test-email-alternatives.js", 
    "cdn-analysis.json",
    "cdn-errores-log.txt",
    "email-backup.json",
    "email-test-data.json",
    "email-test-preview.html",
    "CHANGELOG_v3.9.1.0.md",
    "CORRECCIONES_v3.9.1.md",
    "DESCRIPCION_MEJORADA_v3.9.1.md",
    "OPTIMIZACION_LOADERS.md",
    "VERSION_CONTROL.md",
    "LIMPIEZA_PLAN.md",
    "Untitled-1.php",
    "ziteback.js.backup",
    "ziteback.log"
)

# Mover archivos existentes
$movidosCount = 0
foreach ($archivo in $archivosParaMover) {
    if (Test-Path $archivo) {
        try {
            Move-Item $archivo "archive/" -Force
            Write-Host "✅ Movido: $archivo → archive/" -ForegroundColor Green
            $movidosCount++
        }
        catch {
            Write-Host "⚠️  Error moviendo $archivo : $_" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "ℹ️  No encontrado: $archivo (probablemente ya está organizado)" -ForegroundColor Cyan
    }
}

# Buscar y mover archivos con patrones específicos
Write-Host "`n🔍 Buscando archivos con patrones específicos..." -ForegroundColor Cyan

# Mover archivos de reporte con fechas
$reportes = Get-ChildItem -Name "reporte-recursos-faltantes-*.json" -ErrorAction SilentlyContinue
foreach ($reporte in $reportes) {
    Move-Item $reporte "archive/" -Force
    Write-Host "✅ Movido: $reporte → archive/" -ForegroundColor Green
    $movidosCount++
}

$detecciones = Get-ChildItem -Name "deteccion-mejorada-*.json" -ErrorAction SilentlyContinue  
foreach ($deteccion in $detecciones) {
    Move-Item $deteccion "archive/" -Force
    Write-Host "✅ Movido: $deteccion → archive/" -ForegroundColor Green
    $movidosCount++
}

# Mostrar resumen
Write-Host "`n📊 Resumen de organización:" -ForegroundColor Cyan
Write-Host "  - Archivos movidos a archive/: $movidosCount" -ForegroundColor White
Write-Host "  - La carpeta raíz ahora contiene solo archivos esenciales" -ForegroundColor White

# Mostrar archivos que permanecen en la raíz
Write-Host "`n✅ Archivos esenciales en la raíz:" -ForegroundColor Green
$esenciales = @("ziteback.js", "package.json", "README.md", "LICENSE", "logo.svg", ".gitignore", ".env.example")
foreach ($esencial in $esenciales) {
    if (Test-Path $esencial) {
        Write-Host "  ✓ $esencial" -ForegroundColor White
    }
    else {
        Write-Host "  ⚠️  $esencial (no encontrado)" -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 Organización completada. Repositorio listo para GitHub!" -ForegroundColor Green
Write-Host "💡 Siguiente paso:" -ForegroundColor Cyan
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m 'Organizar archivos en archive/'" -ForegroundColor White
Write-Host "   git push -u origin master" -ForegroundColor White