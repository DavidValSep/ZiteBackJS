#!/usr/bin/env bash
set -euo pipefail

# Empaqueta bundles de despliegue:
# - frontend: web/dist → dist/bundles/web-dist.tar.gz
# - backend:  package.json, api/, config.js (si existe) → dist/bundles/y2back-api.tar.gz
# - incluye ejemplos: deploy/api-site/* y deploy/systemd/y2back-api.service.example

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/dist/bundles"
mkdir -p "$OUT_DIR"

echo "→ Preparando bundles en: $OUT_DIR"

# 1) Frontend
if [[ -d "$ROOT/web/dist" ]]; then
  echo "→ Empaquetando frontend (web/dist) ..."
  (cd "$ROOT/web/dist" && tar -czf "$OUT_DIR/web-dist.tar.gz" .)
  echo "   OK: $OUT_DIR/web-dist.tar.gz"
else
  echo "⚠ No se encontró web/dist. Ejecuta el build en 'web' si necesitas empaquetar la SPA."
fi

# 2) Backend API
TMP_API="$(mktemp -d)"
trap 'rm -rf "$TMP_API"' EXIT

echo "→ Preparando backend (API) ..."
mkdir -p "$TMP_API/api" "$TMP_API/deploy/api-site" "$TMP_API/deploy/systemd"

# Archivos mínimos
cp -a "$ROOT/package.json" "$TMP_API/" 2>/dev/null || true
[[ -f "$ROOT/config.js" ]] && cp -a "$ROOT/config.js" "$TMP_API/" || true
cp -a "$ROOT/api/server.js" "$TMP_API/api/"

# app.js para cPanel/Passenger
cat > "$TMP_API/app.js" <<'APPJS'
const { createApp } = require('./api/server.js');
const app = createApp();

// Passenger usa process.env.PORT automáticamente
const port = process.env.PORT || 3000;

if (typeof PhusionPassenger !== 'undefined') {
    // Modo Passenger
    PhusionPassenger.configure({ autoInstall: false });
}

app.listen(port, '0.0.0.0', () => {
    console.log(`Y2Back API en puerto ${port}`);
});
APPJS

# Binarios multiplataforma (yt-dlp, ffmpeg, ffprobe)
# Linux/macOS (sin extensión)
[[ -f "$ROOT/yt-dlp" ]] && cp -a "$ROOT/yt-dlp" "$TMP_API/" && chmod +x "$TMP_API/yt-dlp" || true
[[ -f "$ROOT/ffmpeg" ]] && cp -a "$ROOT/ffmpeg" "$TMP_API/" && chmod +x "$TMP_API/ffmpeg" || true
[[ -f "$ROOT/ffprobe" ]] && cp -a "$ROOT/ffprobe" "$TMP_API/" && chmod +x "$TMP_API/ffprobe" || true
# Windows (.exe)
[[ -f "$ROOT/yt-dlp.exe" ]] && cp -a "$ROOT/yt-dlp.exe" "$TMP_API/" || true
[[ -f "$ROOT/ffmpeg.exe" ]] && cp -a "$ROOT/ffmpeg.exe" "$TMP_API/" || true
[[ -f "$ROOT/ffprobe.exe" ]] && cp -a "$ROOT/ffprobe.exe" "$TMP_API/" || true
# macOS (_macos)
[[ -f "$ROOT/yt-dlp_macos" ]] && cp -a "$ROOT/yt-dlp_macos" "$TMP_API/" && chmod +x "$TMP_API/yt-dlp_macos" || true
[[ -f "$ROOT/ffmpeg_macos" ]] && cp -a "$ROOT/ffmpeg_macos" "$TMP_API/" && chmod +x "$TMP_API/ffmpeg_macos" || true
[[ -f "$ROOT/ffprobe_macos" ]] && cp -a "$ROOT/ffprobe_macos" "$TMP_API/" && chmod +x "$TMP_API/ffprobe_macos" || true

# Ejemplos de deploy (conf)
cp -a "$ROOT/deploy/api-site/apache-apiy2.conf.example" "$TMP_API/deploy/api-site/" 2>/dev/null || true
cp -a "$ROOT/deploy/api-site/nginx-apiy2.conf.example" "$TMP_API/deploy/api-site/" 2>/dev/null || true
cp -a "$ROOT/deploy/api-site/README_DEPLOY_API_SITE.md" "$TMP_API/deploy/api-site/" 2>/dev/null || true
cp -a "$ROOT/deploy/systemd/y2back-api.service.example" "$TMP_API/deploy/systemd/" 2>/dev/null || true

# README rápido
cat > "$TMP_API/README_DEPLOY_QUICK.md" <<'EOF'
# Y2Back - Despliegue rápido de API + SPA

## Backend (API)

- Requisitos: Node >= 18
- Archivos: este paquete incluye `package.json` y `api/server.js`.
- Instalar en /opt/y2back (sugerido):

```bash
sudo mkdir -p /opt/y2back
sudo rsync -a ./ /opt/y2back/
cd /opt/y2back
# Instalar dependencias sólo de producción
npm install --omit=dev
```

- Systemd (opcional):

```bash
sudo cp deploy/systemd/y2back-api.service.example /etc/systemd/system/y2back-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now y2back-api
sudo systemctl status y2back-api --no-pager
```

- Variables útiles:
  - CORS_ORIGINS="https://tu-spa.com,https://otro.com" (habilita llamadas desde la SPA en hosting compartido)
  - PORT (por defecto 3000)

## Frontend (SPA)

- Si tienes `web-dist.tar.gz`, descomprímelo en el docroot. Ejemplo Apache:

```bash
sudo mkdir -p /var/www/apiy2.susitio.cl/html
sudo tar -xzf web-dist.tar.gz -C /var/www/apiy2.susitio.cl/html
```

- Configuración de proxy (ejemplos incluidos):
  - Apache: `deploy/api-site/apache-apiy2.conf.example`
  - Nginx:  `deploy/api-site/nginx-apiy2.conf.example`

## Verificación

- API local: `curl -fsS http://127.0.0.1:3000/api/health | jq .`
- Vía dominio: `curl -fsS https://apiy2.susitio.cl/api/health | jq .`

EOF

# Empaquetar backend
(cd "$TMP_API" && tar -czf "$OUT_DIR/y2back-api.tar.gz" .)

# Listado
ls -lh "$OUT_DIR"

echo "\n→ Listo. Sube al servidor uno o ambos:\n  - $OUT_DIR/y2back-api.tar.gz   (backend API + ejemplos)\n  - $OUT_DIR/web-dist.tar.gz     (frontend SPA)\n"
