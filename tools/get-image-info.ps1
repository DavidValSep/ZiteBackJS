param(
  [Parameter(Mandatory=$true)]
  [string]$Path
)

Add-Type -AssemblyName System.Drawing
if (-not (Test-Path -LiteralPath $Path)) {
  Write-Error "File not found: $Path"
  exit 1
}

$img = [System.Drawing.Image]::FromFile($Path)
try {
  $len = (Get-Item -LiteralPath $Path).Length
  $info = [ordered]@{
    width       = $img.Width
    height      = $img.Height
    pixelFormat = $img.PixelFormat.ToString()
    sizeKB      = [math]::Round(($len/1KB), 2)
  }
  $info | ConvertTo-Json -Compress
} finally {
  $img.Dispose()
}
