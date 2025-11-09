param(
  [Parameter(Mandatory=$true)][string]$Source,
  [Parameter(Mandatory=$true)][string]$Dest,
  [Parameter(Mandatory=$true)][int]$Size
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -LiteralPath $Source)) { Write-Error "Source not found: $Source"; exit 1 }
$destDir = Split-Path -Parent -Path $Dest
if (-not (Test-Path -LiteralPath $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

$img = [System.Drawing.Image]::FromFile($Source)
try {
  $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
  $bmp.SetResolution(96,96)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # Fit image into square without cropping (letterbox if not square)
    $scale = [Math]::Min($Size / $img.Width, $Size / $img.Height)
    $nw = [int]([Math]::Round($img.Width * $scale))
    $nh = [int]([Math]::Round($img.Height * $scale))
    $nx = [int](($Size - $nw) / 2)
    $ny = [int](($Size - $nh) / 2)

    $g.Clear([System.Drawing.Color]::Transparent)
    $destRect = New-Object System.Drawing.Rectangle($nx, $ny, $nw, $nh)
    $g.DrawImage($img, $destRect)
  } finally {
    $g.Dispose()
  }

  $bmp.Save($Dest, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
} finally {
  $img.Dispose()
}
