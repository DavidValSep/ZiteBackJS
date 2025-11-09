#!/usr/bin/env bash
# Start both API (api/server.js) and Web Dev (web) in one shell.
# Logs: ./logs/api.log and ./logs/web.log (rotan si --force)

set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# Prefer local binaries if present
export PATH="$ROOT/bin:$ROOT:$PATH"

mkdir -p logs
API_LOG="logs/api.log"
WEB_LOG="logs/web.log"

# Flags
FORCE=false
for arg in "$@"; do
  case "$arg" in
    -f|--force)
      FORCE=true
      ;;
  esac
done

if $FORCE; then
  # Kill API by pid/pattern
  if [[ -f logs/api.pid ]]; then
    oldpid=$(cat logs/api.pid || true)
    if [[ -n "$oldpid" ]] && kill -0 "$oldpid" 2>/dev/null; then kill "$oldpid" 2>/dev/null || true; fi
    rm -f logs/api.pid
  fi
  pids=$(pgrep -f "api/server.js" || true)
  if [[ -n "$pids" ]]; then kill $pids 2>/dev/null || true; fi
  # Kill WEB (vite/npm dev)
  if [[ -f logs/web.pid ]]; then
    wpid=$(cat logs/web.pid || true)
    if [[ -n "$wpid" ]] && kill -0 "$wpid" 2>/dev/null; then kill "$wpid" 2>/dev/null || true; fi
    rm -f logs/web.pid
  fi
  wps=$(pgrep -f "(--prefix web run dev|vite)" || true)
  if [[ -n "$wps" ]]; then kill $wps 2>/dev/null || true; fi
  # Rotate logs
  ts=$(date +%Y%m%d_%H%M%S)
  [[ -f "$API_LOG" ]] && mv -f "$API_LOG" "logs/api.$ts.log" || :
  [[ -f "$WEB_LOG" ]] && mv -f "$WEB_LOG" "logs/web.$ts.log" || :
fi

# Start API
( node api/server.js >"$API_LOG" 2>&1 & echo $! > logs/api.pid )
API_PID=$(cat logs/api.pid)
echo "→ API PID: $API_PID | Log: $API_LOG"

# Start WEB dev
( npm --prefix web run dev >"$WEB_LOG" 2>&1 & echo $! > logs/web.pid )
WEB_PID=$(cat logs/web.pid)
echo "→ WEB PID: $WEB_PID | Log: $WEB_LOG"

cleanup() {
  echo "\nStopping processes..."
  if kill -0 "$API_PID" 2>/dev/null; then kill "$API_PID" 2>/dev/null || true; fi
  if kill -0 "$WEB_PID" 2>/dev/null; then kill "$WEB_PID" 2>/dev/null || true; fi
  echo "Done."
}
trap cleanup INT TERM EXIT

echo "\nMostrando logs (Ctrl+C para detener):"
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

# Tail both logs
tail -n +1 -f "$API_LOG" "$WEB_LOG"
