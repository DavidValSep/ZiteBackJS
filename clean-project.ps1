# =====================================================
# Y2Back - Script de Limpieza de Proyecto v7.0.0
# Mantiene solo archivos de Emilia en medios/
# Elimina archivos innecesarios del proyecto
# =====================================================

param(
    [switch]$DryRun,  # Solo mostrar que se eliminaria
    [switch]$Force    # Fuerza eliminacion sin confirmacion
)

Write-Host "Y2Back - Script de Limpieza de Proyecto v7.0.0" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "MODO DRY-RUN: Solo mostrando que se eliminaria" -ForegroundColor Yellow
}

# =====================================================
# 1. LIMPIAR CARPETA MEDIOS - MANTENER SOLO EMILIA
# =====================================================

Write-Host "`nLimpiando carpeta medios (manteniendo solo Emilia)..." -ForegroundColor Green

$mediaPath = ".\medios"
$emiliaFiles = @()
$otherFiles = @()
$tempArtifacts = @()

if (Test-Path $mediaPath) {
    # Buscar archivos de Emilia
    Get-ChildItem $mediaPath -Recurse -File | ForEach-Object {
        if ($_.Name -like "*emilia*" -or $_.Name -like "*Emilia*") {
            $emiliaFiles += $_.FullName
            Write-Host "  MANTENER: $($_.Name)" -ForegroundColor Green
        } else {
            $otherFiles += $_.FullName
            if ($DryRun) {
                Write-Host "  ELIMINAR: $($_.Name)" -ForegroundColor Red
            }
        }
    }

    # Detectar artefactos temporales (se eliminan siempre)
    $tempPatterns = @('*.part','*.part-*','*.ytdl','*.aria2','*.crdownload','*.tmp','*.temp','*.partial','*.info.json')
    foreach ($pattern in $tempPatterns) {
        Get-ChildItem $mediaPath -Recurse -File -Filter $pattern -ErrorAction SilentlyContinue | ForEach-Object {
            $tempArtifacts += $_.FullName
        }
    }
    
    Write-Host "`nResumen medios:"
    Write-Host "  Archivos de Emilia encontrados: $($emiliaFiles.Count)" -ForegroundColor Green
    Write-Host "  Otros archivos para eliminar: $($otherFiles.Count)" -ForegroundColor Red
    Write-Host "  Artefactos temporales detectados: $($tempArtifacts.Count)" -ForegroundColor Yellow
    
    if (-not $DryRun) {
        # Eliminar artefactos temporales sin confirmación
        $deletedTemps = 0
        foreach ($file in ($tempArtifacts | Select-Object -Unique)) {
            try {
                if (Test-Path $file) {
                    Remove-Item $file -Force -ErrorAction SilentlyContinue
                    $deletedTemps++
                    Write-Host "  Temp eliminado: $(Split-Path $file -Leaf)" -ForegroundColor DarkYellow
                }
            } catch {
                Write-Host "  Error eliminando temp: $(Split-Path $file -Leaf) - $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
        if ($deletedTemps -gt 0) {
            Write-Host "  Eliminados $deletedTemps artefactos temporales" -ForegroundColor DarkYellow
        }

        if (-not $Force) {
            $confirm = Read-Host "`nEliminar $($otherFiles.Count) archivos que NO son de Emilia? (y/N)"
            if ($confirm -ne 'y' -and $confirm -ne 'Y') {
                Write-Host "  Operacion cancelada por el usuario" -ForegroundColor Yellow
                return
            }
        }
        
        $deleted = 0
        foreach ($file in $otherFiles) {
            try {
                Remove-Item $file -Force
                $deleted++
                Write-Host "  Eliminado: $(Split-Path $file -Leaf)" -ForegroundColor Red
            } catch {
                Write-Host "  Error eliminando: $(Split-Path $file -Leaf) - $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
        
        Write-Host "`nEliminados $deleted archivos de medios" -ForegroundColor Green
        
        # Limpiar carpetas vacias
        Get-ChildItem $mediaPath -Recurse -Directory | Sort-Object FullName -Descending | ForEach-Object {
            if ((Get-ChildItem $_.FullName -Force).Count -eq 0) {
                Remove-Item $_.FullName -Force
                Write-Host "  Carpeta vacia eliminada: $($_.Name)" -ForegroundColor Yellow
            }
        }
    }
}

# =====================================================
# 2. ELIMINAR ARCHIVOS INNECESARIOS DEL PROYECTO
# =====================================================

Write-Host "`nEliminando archivos innecesarios del proyecto..." -ForegroundColor Green

$unnecessaryFiles = @(
    "RECURSOS-EXTRAIBLES.md",
    "TECHNICAL-SPECS.md", 
    "test_complete.txt",
    "test_input.txt",
    "test-basic.js",
    "VER.md",
    "y2.bat",
    "CHANGELOG_ZB.md"
)

foreach ($file in $unnecessaryFiles) {
    if (Test-Path $file) {
        if ($DryRun) {
            Write-Host "  ELIMINAR: $file" -ForegroundColor Red
        } else {
            try {
                Remove-Item $file -Force
                Write-Host "  Eliminado: $file" -ForegroundColor Red
            } catch {
                Write-Host "  Error eliminando: $file - $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "  No existe: $file" -ForegroundColor Gray
    }
}

Write-Host "`nLIMPIEZA COMPLETADA" -ForegroundColor Green