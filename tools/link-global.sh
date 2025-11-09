#!/usr/bin/env bash
# Link global de comandos del proyecto (sin npm)
# Crea symlinks a y2, y2back y gui en ~/.local/bin (por defecto) o /usr/local/bin (--system)
# También soporta --prefix DIR (instala en DIR/bin)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_MODE="user"   # user | system | prefix
PREFIX_DIR=""

usage() {
  cat <<EOF
Uso: $(basename "$0") [--user] [--system] [--prefix DIR] [--parent] [--force]

  --user        Instala en ~/.local/bin (por defecto, no requiere sudo)
  --system      Instala en /usr/local/bin (requiere sudo)
  --prefix DIR  Instala en DIR/bin (crea carpeta si no existe)
  --parent      Además, crea enlaces en la carpeta superior al proyecto
  --force       Sobrescribe enlaces existentes

Crea enlaces simbólicos a:
  - y2       -> ${ROOT}/y2.js
  - y2back   -> ${ROOT}/y2back.js
  - gui      -> ${ROOT}/gui.js

Notas:
  - Requiere Node.js disponible en PATH (para ejecutar los .js con shebang)
  - Asegúrate de tener ~/.local/bin en tu PATH (ver mensaje al final)
EOF
}

FORCE=false
CREATE_PARENT=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --user) TARGET_MODE="user"; shift ;;
    --system) TARGET_MODE="system"; shift ;;
    --prefix) TARGET_MODE="prefix"; PREFIX_DIR="${2:-}"; shift 2 ;;
    --parent) CREATE_PARENT=true; shift ;;
    --force|-f) FORCE=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Opción desconocida: $1"; usage; exit 1 ;;
  esac
done

# Resolver bin destino
BIN_DIR=""
if [[ "$TARGET_MODE" == "system" ]]; then
  BIN_DIR="/usr/local/bin"
elif [[ "$TARGET_MODE" == "prefix" ]]; then
  if [[ -z "$PREFIX_DIR" ]]; then echo "--prefix requiere un directorio"; exit 1; fi
  BIN_DIR="${PREFIX_DIR%/}/bin"
else
  BIN_DIR="${HOME}/.local/bin"
fi

mkdir -p "$BIN_DIR"

# Archivos fuente
# Prefer shims in ./bin/ if existen (estos wrappers prefieren node local si está disponible)
if [[ -x "${ROOT}/bin/y2" ]]; then
  SRC_Y2="${ROOT}/bin/y2"
else
  SRC_Y2="${ROOT}/y2.js"
fi

if [[ -x "${ROOT}/bin/y2back" ]]; then
  SRC_Y2BACK="${ROOT}/bin/y2back"
else
  SRC_Y2BACK="${ROOT}/y2back.js"
fi

if [[ -x "${ROOT}/bin/gui" ]]; then
  SRC_GUI="${ROOT}/bin/gui"
else
  SRC_GUI="${ROOT}/gui.js"
fi

# Validaciones mínimas
for f in "$SRC_Y2" "$SRC_Y2BACK" "$SRC_GUI"; do
  if [[ ! -f "$f" ]]; then
    echo "Falta archivo requerido: $f" >&2
    exit 1
  fi
  # Asegurar ejecutable (tienen shebang #!/usr/bin/env node)
  chmod +x "$f" || true
done

# Crear symlinks
link_one() {
  local src="$1"; local name="$2"; local dst="$BIN_DIR/$name"
  if [[ -e "$dst" || -L "$dst" ]]; then
    if $FORCE; then rm -f "$dst"; else echo "Ya existe $dst (usa --force para sobrescribir)"; return 0; fi
  fi
  ln -s "$src" "$dst"
  echo "✔ Enlace creado: $dst -> $src"
}

link_one "$SRC_Y2" "y2"
link_one "$SRC_Y2BACK" "y2back"
link_one "$SRC_GUI" "gui"

# Mensajes finales
echo
echo "Destino: $BIN_DIR"
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
  echo "⚠ $BIN_DIR no está en tu PATH. Agrega esta línea a tu shell (~/.bashrc o equivalente):"
  echo "    export PATH=\"$BIN_DIR:\$PATH\""
fi

# Tip opcional: enlaces en carpeta superior inmediata
PARENT_DIR="$(dirname "$ROOT")"
echo
if $CREATE_PARENT; then
  echo "Creando enlaces en carpeta superior: $PARENT_DIR"
  link_parent() {
    local src="$1"; local name="$2"; local dst="$PARENT_DIR/$name"
    if [[ -e "$dst" || -L "$dst" ]]; then
      if $FORCE; then rm -f "$dst"; else echo "Ya existe $dst (usa --force para sobrescribir)"; return 0; fi
    fi
    ln -s "$src" "$dst"
    echo "✔ Enlace creado: $dst -> $src"
  }
  link_parent "$SRC_Y2" "y2"
  link_parent "$SRC_Y2BACK" "y2back"
  link_parent "$SRC_GUI" "gui"
else
  echo "Opcional (enlazar en carpeta superior):"
  echo "    ln -s '$SRC_Y2'    '$PARENT_DIR/y2'"
  echo "    ln -s '$SRC_Y2BACK' '$PARENT_DIR/y2back'"
  echo "    ln -s '$SRC_GUI'    '$PARENT_DIR/gui'"
fi

exit 0
