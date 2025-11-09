<#
Start only the API server (api/server.js) on Windows PowerShell.
- Log: .\logs\api.log (rota si está bloqueado)
- Ctrl+C to stop.
#>

param(
    [switch]$Force
)
# Compatibilidad con GNU-style: --force
if ($args -contains '--force') { $Force = $true }

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

# Prefer local binaries if present (./bin and project root)
$binRoot = Join-Path $root '.'
$binDir = Join-Path $root 'bin'
$env:PATH = "$binDir;$binRoot;$env:PATH"

$logsDir = Join-Path $root 'logs'
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }
$apiLog = Join-Path $logsDir 'api.log'

function Test-Cmd { param([string]$Name) try { return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue) } catch { return $false } }
$hasYt = Test-Cmd -Name 'yt-dlp'
$hasFf = Test-Cmd -Name 'ffmpeg'
Write-Host "\n=== Resumen de entorno ===" -ForegroundColor Cyan
$ytMsg = if ($hasYt) { 'OK' } else { 'NO detectado' }
$ytColor = if ($hasYt) { 'Green' } else { 'Yellow' }
Write-Host ("yt-dlp: {0}" -f $ytMsg) -ForegroundColor $ytColor
$ffMsg = if ($hasFf) { 'OK (merge/remux habilitado)' } else { 'NO detectado (modo progresivo: sin merges/conversión)' }
$ffColor = if ($hasFf) { 'Green' } else { 'Yellow' }
Write-Host ("ffmpeg: {0}" -f $ffMsg) -ForegroundColor $ffColor
if (-not $hasFf) { Write-Host "Sugerencia: coloca 'ffmpeg.exe' (Windows) o 'ffmpeg' (Linux) en la RAÍZ del proyecto o en ./bin para habilitar merges." -ForegroundColor DarkYellow }
Write-Host "==========================\n"

Write-Host "→ Iniciando API..." -ForegroundColor Cyan
# Si viene -Force, intenta cerrar instancias antiguas del API que podrían tener el log o el puerto tomados
if ($Force.IsPresent) {
    try {
        $pattern = 'api[\\/]+server\.js'
        $procs = Get-CimInstance Win32_Process | Where-Object {
            ($_.CommandLine -match '(?i)node(\.exe)?') -and ($_.CommandLine -match $pattern)
        }
        if ($procs) {
            Write-Host ("Forzando cierre de {0} proceso(s) previos del API..." -f $procs.Count) -ForegroundColor Yellow
            foreach ($p in $procs) {
                try { Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop; Write-Host ("  - Killed PID {0}" -f $p.ProcessId) -ForegroundColor DarkYellow } catch {}
            }
            Start-Sleep -Milliseconds 350
        }
    } catch {}
}
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "node"
$psi.Arguments = "api/server.js"
$psi.WorkingDirectory = $root
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true

$proc = New-Object System.Diagnostics.Process
$proc.StartInfo = $psi

# Abrir el log con FileShare ReadWrite; si está bloqueado, rotar a un nuevo archivo con timestamp
$logFs = $null
try {
    $logFs = New-Object System.IO.FileStream($apiLog, [System.IO.FileMode]::Append, [System.IO.FileAccess]::Write, [System.IO.FileShare]::ReadWrite)
} catch {
    $ts = Get-Date -Format 'yyyyMMdd_HHmmss'
    $apiLog = Join-Path $logsDir ("api.{0}.log" -f $ts)
    Write-Host ("Log principal bloqueado, usando: {0}" -f $apiLog) -ForegroundColor Yellow
    try {
        $logFs = New-Object System.IO.FileStream($apiLog, [System.IO.FileMode]::Append, [System.IO.FileAccess]::Write, [System.IO.FileShare]::ReadWrite)
    } catch {
        $tmp = Join-Path $env:TEMP ("y2back_api_{0}.log" -f $ts)
        $apiLog = $tmp
        Write-Host ("No se pudo abrir logs/; usando temporal: {0}" -f $apiLog) -ForegroundColor Yellow
        $logFs = New-Object System.IO.FileStream($apiLog, [System.IO.FileMode]::Append, [System.IO.FileAccess]::Write, [System.IO.FileShare]::ReadWrite)
    }
}

$logWriter = New-Object System.IO.StreamWriter($logFs)
$logWriter.AutoFlush = $true
$proc.add_OutputDataReceived({ param($s,$e) if ($e.Data) { $logWriter.WriteLine($e.Data) } })
$proc.add_ErrorDataReceived({ param($s,$e) if ($e.Data) { $logWriter.WriteLine($e.Data) } })

[void]$proc.Start()
$proc.BeginOutputReadLine()
$proc.BeginErrorReadLine()

Write-Host "API PID: $($proc.Id) | Log: $apiLog" -ForegroundColor Green
Write-Host "Presiona Ctrl+C para detener. Mostrando log...\n" -ForegroundColor Yellow

try {
    Get-Content -Path $apiLog -Wait -Tail 50 | ForEach-Object { $_ }
} finally {
    try { if (!$proc.HasExited) { $proc.Kill() } } catch {}
    try { $logWriter.Flush(); $logWriter.Dispose() } catch {}
    try { $logFs.Dispose() } catch {}
}
