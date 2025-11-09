# Activador de hooks de Git para este repo (no ejecuta nada automáticamente)
# Uso:
#   1) Abrir PowerShell en la raíz del repo
#   2) Ejecutar:  .\scripts\activate-git-hooks.ps1 -Enable
#   3) (Opcional) Revertir: .\scripts\activate-git-hooks.ps1 -Disable
#   4) (Opcional) Inicializar repo si falta .git: .\scripts\activate-git-hooks.ps1 -Init

param(
  [switch]$Enable,
  [switch]$Disable,
  [switch]$Init
)

function Write-Step($msg) { Write-Host "[>] $msg" -ForegroundColor Cyan }
function Write-Ok($msg) { Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[!] $msg" -ForegroundColor Yellow }
function Write-Err($msg) { Write-Host "[X] $msg" -ForegroundColor Red }

$repoRoot = Get-Location
$gitDir = Join-Path $repoRoot ".git"
$hooksPath = ".githooks"

if ($Init) {
  if (Test-Path $gitDir) {
    Write-Warn ".git ya existe. Omitiendo init."
  } else {
    Write-Step "Inicializando repo Git (git init)"
    git init | Out-Host
    Write-Ok "Repo inicializado."
  }
}

if ($Enable) {
  if (-not (Test-Path $gitDir)) {
    Write-Err "No es un repositorio Git (.git no existe). Ejecuta con -Init o crea el repo antes."
    exit 1
  }
  Write-Step "Activando hooks locales: core.hooksPath = $hooksPath"
  git config core.hooksPath $hooksPath | Out-Host
  $val = git config core.hooksPath
  Write-Ok "core.hooksPath actual: $val"
  Write-Host "- commit-msg exige token [ok] o [human] en el mensaje" -ForegroundColor Gray
  Write-Host "- pre-push bloquea push directo a main/master (usa ALLOW_MAIN_PUSH=1 para excepción)" -ForegroundColor Gray
}

if ($Disable) {
  if (-not (Test-Path $gitDir)) {
    Write-Err "No es un repositorio Git (.git no existe)."
    exit 1
  }
  Write-Step "Desactivando hooks locales (unset core.hooksPath)"
  git config --unset core.hooksPath 2>$null | Out-Host
  Write-Ok "Hooks desactivados (vuelves a .git/hooks por defecto)."
}

if (-not $Enable -and -not $Disable -and -not $Init) {
  Write-Host "Uso:" -ForegroundColor White
  Write-Host "  .\\scripts\\activate-git-hooks.ps1 -Enable    # Activa hooks (.githooks)" -ForegroundColor White
  Write-Host "  .\\scripts\\activate-git-hooks.ps1 -Disable   # Desactiva hooks" -ForegroundColor White
  Write-Host "  .\\scripts\\activate-git-hooks.ps1 -Init      # Crea .git si falta (git init)" -ForegroundColor White
}