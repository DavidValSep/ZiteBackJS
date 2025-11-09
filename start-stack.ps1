<#
Start both API (api/server.js) and Web Dev (web) in one PowerShell session.
- Logs: .\logs\api.log and .\logs\web.log (rotan si están bloqueados)
- Ctrl+C will stop both processes.
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

# Ensure logs dir
$logsDir = Join-Path $root 'logs'
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }

# Environment summary
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

function Start-App {
    param(
        [string]$Name,
        [string]$Exe,
        [string]$CmdArgs,
        [string]$LogPath
    )

    Write-Host "→ Iniciando $Name..." -ForegroundColor Cyan
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $Exe
    $psi.Arguments = $CmdArgs
    $psi.WorkingDirectory = $root
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true

    $proc = New-Object System.Diagnostics.Process
    $proc.StartInfo = $psi

    # Abrir log con FileShare ReadWrite; si falla, rotar a timestamp, si falla, ir a TEMP
    $logFs = $null
    $lp = $LogPath
    try {
        $logFs = New-Object System.IO.FileStream($lp, [System.IO.FileMode]::Append, [System.IO.FileAccess]::Write, [System.IO.FileShare]::ReadWrite)
    } catch {
        $ts = Get-Date -Format 'yyyyMMdd_HHmmss'
        $lp = [System.IO.Path]::Combine([System.IO.Path]::GetDirectoryName($LogPath), ("{0}.{1}.log" -f ([System.IO.Path]::GetFileNameWithoutExtension($LogPath)), $ts))
        Write-Host ("Log para {0} bloqueado, usando: {1}" -f $Name, $lp) -ForegroundColor Yellow
        try {
            $logFs = New-Object System.IO.FileStream($lp, [System.IO.FileMode]::Append, [System.IO.FileAccess]::Write, [System.IO.FileShare]::ReadWrite)
        } catch {
            $tmp = Join-Path $env:TEMP ("y2back_{0}_{1}.log" -f $Name.ToLower(), $ts)
            $lp = $tmp
            Write-Host ("No se pudo abrir logs/; usando temporal: {0}" -f $lp) -ForegroundColor Yellow
            $logFs = New-Object System.IO.FileStream($lp, [System.IO.FileMode]::Append, [System.IO.FileAccess]::Write, [System.IO.FileShare]::ReadWrite)
        }
    }
    $logWriter = New-Object System.IO.StreamWriter($logFs)
    $logWriter.AutoFlush = $true

    $proc.add_OutputDataReceived({ param($s,$e) if ($e.Data) { $logWriter.WriteLine($e.Data) } })
    $proc.add_ErrorDataReceived({ param($s,$e) if ($e.Data) { $logWriter.WriteLine($e.Data) } })

    [void]$proc.Start()
    $proc.BeginOutputReadLine()
    $proc.BeginErrorReadLine()

    return @{ Name = $Name; Process = $proc; Log = $lp; Writer = $logWriter; FS = $logFs }
}

$apiLog = Join-Path $logsDir 'api.log'
$webLog = Join-Path $logsDir 'web.log'

# Si viene -Force, intentar cerrar procesos previos de API y WEB (vite)
if ($Force.IsPresent) {
    try {
        $procs = Get-CimInstance Win32_Process | Where-Object {
            ($_.CommandLine -match '(?i)node(\.exe)?') -and ($_.CommandLine -match 'api[\\/]+server\.js')
        }
        foreach ($p in $procs) { try { Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop } catch {} }
        $procsWeb = Get-CimInstance Win32_Process | Where-Object {
            ($_.CommandLine -match '(?i)(npm|node)(\.exe)?') -and ($_.CommandLine -match '(--prefix\s+web\s+run\s+dev|vite)')
        }
        foreach ($p in $procsWeb) { try { Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop } catch {} }
        Start-Sleep -Milliseconds 350
    } catch {}
}

$api = Start-App -Name 'API' -Exe 'node' -CmdArgs 'api/server.js' -LogPath $apiLog
$web = Start-App -Name 'WEB' -Exe 'npm' -CmdArgs '--prefix web run dev' -LogPath $webLog

Write-Host "\nAPI PID: $($api.Process.Id) | Log: $($api.Log)"
Write-Host "WEB PID: $($web.Process.Id) | Log: $($web.Log)\n"
Write-Host "Presiona Ctrl+C para detener ambos. Mostrando logs en vivo...\n" -ForegroundColor Yellow

# Live tail both logs
$job = Start-Job -ScriptBlock {
    Get-Content -Path $using:apiLog, $using:webLog -Wait -Tail 10 |
        ForEach-Object { $_ }
}

# Cleanup on Ctrl+C
$onCancel = {
    Write-Host "\nDeteniendo procesos..." -ForegroundColor Yellow
    try { if (!$api.Process.HasExited) { $api.Process.Kill() } } catch {}
    try { if (!$web.Process.HasExited) { $web.Process.Kill() } } catch {}
    try { Stop-Job $job -Force | Out-Null } catch {}
    try { $api.Writer.Flush(); $api.Writer.Dispose() } catch {}
    try { $api.FS.Dispose() } catch {}
    try { $web.Writer.Flush(); $web.Writer.Dispose() } catch {}
    try { $web.FS.Dispose() } catch {}
    Write-Host "Listo." -ForegroundColor Green
    exit 0
}

$null = Register-EngineEvent PowerShell.Exiting -Action $onCancel
try {
    Wait-Job $job | Out-Null
} finally {
    & $onCancel
}
