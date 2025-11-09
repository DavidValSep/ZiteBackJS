#!/usr/bin/env bash
# Prepara ./bin/ con los binarios portables (yt-dlp, ffmpeg, ffprobe) y opcionalmente descarga Node
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BIN_DIR="$ROOT/bin"
mkdir -p "$BIN_DIR"

echo "Preparando carpeta portable en: $BIN_DIR"

# Copiar binarios si existen en el repo root
for name in yt-dlp ffmpeg ffprobe; do
  SRC="$ROOT/$name"
  DST="$BIN_DIR/$name"
  if [[ -e "$SRC" ]]; then
    echo "Incluyendo $name desde proyecto -> $DST"
    rm -rf "$DST"
    if [[ -d "$SRC" ]]; then
      cp -a "$SRC" "$DST"
    else
      cp -p "$SRC" "$DST"
    fi
    chmod -R +x "$DST" || true
  else
    echo "No se encontró $name en el proyecto; si quieres incluirlo, coloca el binario (o carpeta) en: $SRC"
  fi
done

# Opcional: descargar Node.js precompilado si se pasa --node-version o --node-url
NODE_URL=""
NODE_VERSION=""
PLATFORM="$(uname | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64) ARCH_TAG="x64" ;;
  aarch64|arm64) ARCH_TAG="arm64" ;;
  *) ARCH_TAG="x64" ;;
esac

while [[ $# -gt 0 ]]; do
  case "$1" in
    --node-url) NODE_URL="$2"; shift 2 ;;
    --node-version) NODE_VERSION="$2"; shift 2 ;;
    --platform) PLATFORM="$2"; shift 2 ;;
    --arch) ARCH_TAG="$2"; shift 2 ;;
    -h|--help) echo "Uso: $(basename "$0") [--node-version X.Y.Z] [--node-url URL]"; exit 0 ;;
    *) echo "Opción desconocida: $1"; exit 1 ;;
  esac
done

if [[ -n "$NODE_VERSION" && -z "$NODE_URL" ]]; then
  NODE_URL="https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-$PLATFORM-$ARCH_TAG.tar.xz"
fi

if [[ -n "$NODE_URL" ]]; then
  echo "Intentando descargar Node desde: $NODE_URL"
  TMPDIR="/tmp/y2back_node_$$"
  mkdir -p "$TMPDIR"
  if command -v curl >/dev/null 2>&1; then
    curl -fSL "$NODE_URL" -o "$TMPDIR/node.tar.xz"
  elif command -v wget >/dev/null 2>&1; then
    wget -O "$TMPDIR/node.tar.xz" "$NODE_URL"
  else
    echo "No hay curl ni wget disponibles; coloca manualmente el binario de node en $ROOT/node"; exit 1
  fi
  echo "Extrayendo node..."
  mkdir -p "$ROOT/node"
  tar -xJf "$TMPDIR/node.tar.xz" -C "$TMPDIR"
  # El tarball contiene node-vX.Y.Z-linux-x64/
  EXTRACTED_DIR=$(find "$TMPDIR" -maxdepth 1 -type d -name 'node-v*' | head -n1)
  if [[ -z "$EXTRACTED_DIR" ]]; then echo "No encontré carpeta extraída"; exit 1; fi
  # Mover binarios a $ROOT/node
  rm -rf "$ROOT/node"
  mv "$EXTRACTED_DIR" "$ROOT/node"
  echo "Node instalado en: $ROOT/node (usa $ROOT/node/bin/node)"
  chmod -R +x "$ROOT/node/bin" || true
  rm -rf "$TMPDIR"
fi

echo "Creando/ajustando shims en $BIN_DIR"
chmod +x "$ROOT/bin/y2" 2>/dev/null || true
chmod +x "$ROOT/bin/y2back" 2>/dev/null || true
chmod +x "$ROOT/bin/gui" 2>/dev/null || true

echo "Hecho. Para instalar globalmente ejecuta:"
echo "  ./tools/install-portable.sh --user --src '$ROOT' --dest '"$HOME"/.local/share/y2back'"
echo "O simplemente crea enlaces con: ./tools/link-global.sh --user --force"
#!/usr/bin/env bash
set -euo pipefail

# make-portable.sh
# Crea un paquete portátil en ./dist/portable que contiene:
# - copia mínima de los ficheros necesarios (y2back.js, gui.js, package.json, api/, web/dist si existe)
# - runtime de Node descargado (opcional, configurable)
# - copia de binarios locales: yt-dlp, ffmpeg, ffprobe (si existen en la raíz del proyecto)
# - wrapper run.sh que pone PATH para usar el Node y binarios locales

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_BASE="$ROOT/dist/portable"
NODE_VERSION="20.24.0"
INCLUDE_FFMPEG=false
INCLUDE_YTDLP=false
FORCE=false

usage(){
  cat <<EOF
Uso: $0 [--node-version X.Y.Z] [--include-ffmpeg] [--include-yt-dlp] [--output DIR] [--force]

Ejemplo:
  $0 --node-version 20.24.0 --include-ffmpeg --include-yt-dlp --output ./dist/portable --force

El script intentará descargar Node para tu plataforma (Linux x64/arm64).
Si no se encuentra ffmpeg/yt-dlp en la raíz del proyecto, se omitirá la copia (puedes proveerlos en la carpeta raíz antes de ejecutar).
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --node-version) NODE_VERSION="$2"; shift 2;;
    --include-ffmpeg) INCLUDE_FFMPEG=true; shift;;
    --include-yt-dlp) INCLUDE_YTDLP=true; shift;;
    --output) OUT_BASE="$2"; shift 2;;
    -f|--force) FORCE=true; shift;;
    -h|--help) usage; exit 0;;
    *) echo "Parámetro desconocido: $1"; usage; exit 1;;
  esac
done

if [[ -d "$OUT_BASE" && "$FORCE" != true ]]; then
  echo "Error: output existe: $OUT_BASE (usar --force para sobrescribir)" >&2
  exit 1
fi

rm -rf "$OUT_BASE"
mkdir -p "$OUT_BASE"

echo "→ Creando paquete portátil en: $OUT_BASE"

# 1) Copiar archivos mínimos
mkdir -p "$OUT_BASE/app"
echo "- Copiando archivos del proyecto..."
cp -a "$ROOT/y2back.js" "$OUT_BASE/app/" 2>/dev/null || true
cp -a "$ROOT/gui.js" "$OUT_BASE/app/" 2>/dev/null || true
cp -a "$ROOT/package.json" "$OUT_BASE/app/" 2>/dev/null || true
cp -a "$ROOT/config.js" "$OUT_BASE/app/" 2>/dev/null || true

# Copiar carpeta api/ (si existe)
if [[ -d "$ROOT/api" ]]; then
  cp -a "$ROOT/api" "$OUT_BASE/app/"
fi

# Copiar web/dist si existe (build estático)
if [[ -d "$ROOT/web/dist" ]]; then
  mkdir -p "$OUT_BASE/app/web"
  cp -a "$ROOT/web/dist" "$OUT_BASE/app/web/"
fi

# 2) Descargar y extraer Node runtime
RUNTIME_DIR="$OUT_BASE/runtime"
mkdir -p "$RUNTIME_DIR"

OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"
NODE_DIST_ARCH=""
if [[ "$OS" == "linux" ]]; then
  case "$ARCH" in
    x86_64|amd64) NODE_DIST_ARCH="linux-x64";;
    aarch64|arm64) NODE_DIST_ARCH="linux-arm64";;
    *) echo "Arquitectura no soportada para descarga automática de Node: $ARCH"; NODE_DIST_ARCH="";;
  esac
else
  echo "Advertencia: descarga automática de Node sólo soportada en Linux desde este script. Si está en otra plataforma, coloca un runtime en $RUNTIME_DIR" >&2
fi

if [[ -n "$NODE_DIST_ARCH" ]]; then
  NODE_TARBALL="node-v${NODE_VERSION}-${NODE_DIST_ARCH}.tar.xz"
  NODE_URL="https://nodejs.org/dist/v${NODE_VERSION}/${NODE_TARBALL}"
  echo "- Descargando Node ${NODE_VERSION} para ${NODE_DIST_ARCH}..."
  tmpd=$(mktemp -d)
  trap 'rm -rf "$tmpd"' EXIT
  cd "$tmpd"
  if command -v curl >/dev/null 2>&1; then
    curl -fSL "$NODE_URL" -o "$NODE_TARBALL" || { echo "No se pudo descargar $NODE_URL"; cd - >/dev/null; exit 1; }
  elif command -v wget >/dev/null 2>&1; then
    wget -q "$NODE_URL" -O "$NODE_TARBALL" || { echo "No se pudo descargar $NODE_URL"; cd - >/dev/null; exit 1; }
  else
    echo "Ni curl ni wget están disponibles: no se puede descargar Node automáticamente." >&2
    cd - >/dev/null
  fi
  if [[ -f "$NODE_TARBALL" ]]; then
    echo "- Extrayendo Node..."
    mkdir -p "$RUNTIME_DIR/node"
    tar -xJf "$NODE_TARBALL" --strip-components=1 -C "$RUNTIME_DIR/node"
    echo "  -> Node extraído en: $RUNTIME_DIR/node"
  fi
  cd - >/dev/null
fi

# 3) Copiar binarios locales (ffmpeg, ffprobe, yt-dlp) si se solicitan
BIN_DIR="$RUNTIME_DIR/bin"
mkdir -p "$BIN_DIR"

copy_if_exists(){
  local src="$1"; local name="$2"
  if [[ -f "$ROOT/$src" ]]; then
    echo "- Copiando $src -> runtime/bin/$name"
    cp "$ROOT/$src" "$BIN_DIR/$name"
    chmod +x "$BIN_DIR/$name" || true
  else
    echo "- No se encontró $src en la raíz del proyecto. Omitiendo."
  fi
}

if $INCLUDE_YTDLP; then
  # buscar variantes: yt-dlp, yt-dlp.exe, bin/yt-dlp
  if [[ -f "$ROOT/yt-dlp" || -f "$ROOT/yt-dlp.exe" ]]; then
    if [[ -f "$ROOT/yt-dlp" ]]; then copy_if_exists "yt-dlp" "yt-dlp"; fi
    if [[ -f "$ROOT/yt-dlp.exe" ]]; then copy_if_exists "yt-dlp.exe" "yt-dlp.exe"; fi
  elif [[ -f "$ROOT/bin/yt-dlp" ]]; then copy_if_exists "bin/yt-dlp" "yt-dlp"; else
    echo "- yt-dlp no disponible localmente. Puedes colocar un binario en project root o bin/ antes de ejecutar con --include-yt-dlp.";
  fi
fi

if $INCLUDE_FFMPEG; then
  # ffmpeg, ffprobe
  if [[ -f "$ROOT/ffmpeg" || -f "$ROOT/ffmpeg.exe" ]]; then
    if [[ -f "$ROOT/ffmpeg" ]]; then copy_if_exists "ffmpeg" "ffmpeg"; fi
    if [[ -f "$ROOT/ffmpeg.exe" ]]; then copy_if_exists "ffmpeg.exe" "ffmpeg.exe"; fi
  elif [[ -d "$ROOT/ffmpeg" ]]; then
    echo "- Copiando carpeta ffmpeg/ completa a runtime/ffmpeg/"
    cp -a "$ROOT/ffmpeg" "$RUNTIME_DIR/"
  else
    echo "- ffmpeg no disponible localmente. Puedes colocar binarios en project root o carpeta ffmpeg/ antes de ejecutar con --include-ffmpeg.";
  fi
  # ffprobe
  if [[ -f "$ROOT/ffprobe" ]]; then copy_if_exists "ffprobe" "ffprobe"; fi
fi

# 4) Crear wrapper run.sh
cat > "$OUT_BASE/run.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Prefer local runtime/node/bin
if [[ -d "$ROOT_DIR/runtime/node/bin" ]]; then
  export PATH="$ROOT_DIR/runtime/node/bin:$ROOT_DIR/runtime/bin:$PATH"
fi
# Ejecutar node con el script principal (pasar args)
cd "$ROOT_DIR/app"
exec node y2back.js "$@"
EOF
chmod +x "$OUT_BASE/run.sh"

echo "→ Paquete portátil creado en: $OUT_BASE"
echo "Sugerencias:
  - Copia run.sh al equipo cliente y descomprime la carpeta completa.
  - Ejecuta: ./run.sh --help
  - Puedes añadir binarios faltantes (yt-dlp, ffmpeg) dentro de $OUT_BASE/runtime/bin o $OUT_BASE/runtime/ffmpeg
"

exit 0
