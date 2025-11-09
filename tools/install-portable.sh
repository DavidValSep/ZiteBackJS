#!/usr/bin/env bash
# Instala una copia portátil del proyecto en un destino y crea enlaces globales
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODE="user" # user | system
DEST=""
FORCE=false
SRC_OVERRIDE=""

usage() {
  cat <<EOF
Uso: $(basename "$0") [--user|--system] [--dest DIR] [--src DIR] [--force]

  --user    Instala en ~/.local/share/y2back (por defecto)
  --system  Instala en /opt/y2back (requiere sudo)
  --dest DIR Instala en DIR en lugar del destino por defecto
  --src DIR  Usar DIR como fuente en lugar del repo actual
  --force   Sobrescribir destino si existe

Este script copia los archivos necesarios (sin node_modules) y crea enlaces en ~/.local/bin
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --user) MODE=user; shift ;;
    --system) MODE=system; shift ;;
    --dest) DEST="$2"; shift 2 ;;
    --src) SRC_OVERRIDE="$2"; shift 2 ;;
    --force|-f) FORCE=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Opción desconocida: $1"; usage; exit 1 ;;
  esac
done

if [[ -n "$SRC_OVERRIDE" ]]; then SRC="$SRC_OVERRIDE"; else SRC="$ROOT"; fi

if [[ -z "$DEST" ]]; then
  if [[ "$MODE" == "user" ]]; then
    DEST="$HOME/.local/share/y2back"
  else
    DEST="/opt/y2back"
  fi
fi

if [[ "$MODE" == "system" && $(id -u) -ne 0 ]]; then
  echo "Modo system requiere sudo/root. Re-run with sudo."; exit 1
fi

echo "Instalando desde: $SRC"
echo "Destino: $DEST"

if [[ -e "$DEST" ]]; then
  if $FORCE; then rm -rf "$DEST"; else echo "Destino ya existe: $DEST (usa --force para sobrescribir)"; exit 1; fi
fi

mkdir -p "$(dirname "$DEST")"

# Usar rsync si disponible para copiar excluyendo node_modules, logs y medios
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete --exclude 'node_modules' --exclude 'logs' --exclude 'medios' --exclude '.git' "$SRC/" "$DEST/"
else
  # Fallback a cp
  mkdir -p "$DEST"
  (cd "$SRC" && tar --exclude='./node_modules' --exclude='./logs' --exclude='./medios' --exclude='./.git' -cf - .) | (cd "$DEST" && tar -xf -)
fi

# Asegurar permisos ejecutables en bin y node si existen
if [[ -d "$DEST/bin" ]]; then chmod -R +x "$DEST/bin" || true; fi
if [[ -d "$DEST/node/bin" ]]; then chmod -R +x "$DEST/node/bin" || true; fi

# Crear enlaces en ~/.local/bin o /usr/local/bin
if [[ "$MODE" == "system" ]]; then
  LINK_DIR="/usr/local/bin"
else
  LINK_DIR="$HOME/.local/bin"
fi
mkdir -p "$LINK_DIR"

for name in y2 y2back gui; do
  # Priorizar shim en destino/bin
  if [[ -x "$DEST/bin/$name" ]]; then
    SRC_LINK="$DEST/bin/$name"
  elif [[ -x "$DEST/$name.js" ]]; then
    SRC_LINK="$DEST/$name.js"
  else
    echo "Advertencia: no pude encontrar $name en $DEST"; continue
  fi

  DST_LINK="$LINK_DIR/$name"
  if [[ -e "$DST_LINK" || -L "$DST_LINK" ]]; then
    if $FORCE; then rm -f "$DST_LINK"; else echo "Ya existe $DST_LINK (usa --force)"; continue; fi
  fi
  ln -s "$SRC_LINK" "$DST_LINK"
  echo "✔ Enlace creado: $DST_LINK -> $SRC_LINK"
done

echo
echo "Instalación completada. Asegúrate de tener $LINK_DIR en tu PATH." 
echo "Si instalaste en modo system y deseas ejecutar servicios, considera crear un unit systemd apuntando a $DEST/api/server.js"
