#!/usr/bin/env bash
# Start only the API server (api/server.js) on Linux/macOS.
# Log: ./logs/api.log (rota si --force)

set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# Prefer local binaries if present
export PATH="$ROOT/bin:$ROOT:$PATH"

mkdir -p logs
API_LOG="logs/api.log"

# Flags
FORCE=false
for arg in "$@"; do
  case "$arg" in
    -f|--force)
      FORCE=true
      ;;
  esac
done

# Si --force: matar instancias previas y rotar logs
if $FORCE; then
  # Kill by pid file
  if [[ -f logs/api.pid ]]; then
    oldpid=$(cat logs/api.pid || true)
    if [[ -n "$oldpid" ]] && kill -0 "$oldpid" 2>/dev/null; then kill "$oldpid" 2>/dev/null || true; fi
    rm -f logs/api.pid
  fi
  # Kill by pattern
  pids=$(pgrep -f "api/server.js" || true)
  if [[ -n "$pids" ]]; then kill $pids 2>/dev/null || true; fi
  # Rotate log
  ts=$(date +%Y%m%d_%H%M%S)
  if [[ -f "$API_LOG" ]]; then mv -f "$API_LOG" "logs/api.$ts.log" || :; fi
fi

# Start API
( node api/server.js >"$API_LOG" 2>&1 & echo $! > logs/api.pid )
API_PID=$(cat logs/api.pid)
echo "→ API PID: $API_PID | Log: $API_LOG"

echo "Mostrando log (Ctrl+C para detener):"
# Entorno breve
if command -v yt-dlp >/dev/null 2>&1; then
  echo "yt-dlp: OK"
else
  echo "yt-dlp: NO detectado"
fi
if command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg: OK (merge/remux habilitado)"
else
  echo "ffmpeg: NO detectado (modo progresivo: sin merges/conversión)"
fi
cleanup() {
  echo "\nStopping API..."
  if kill -0 "$API_PID" 2>/dev/null; then kill "$API_PID" 2>/dev/null || true; fi
  echo "Done."
}
trap cleanup INT TERM EXIT

tail -n +1 -f "$API_LOG"
