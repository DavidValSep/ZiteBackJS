# 🚀 Despliegue en Linux (API + Web)

Esta guía te permite llevar Y2Back a un servidor Linux y levantar la API y el frontend con un par de comandos.

## ✅ Requisitos

- Sistema: Ubuntu 20.04+/Debian 11+/Rocky/Alma/Fedora (o similar)
- Node.js >= 18 y npm >= 9
- ffmpeg (recomendado para remux y audio) — opcional: sin ffmpeg el sistema funciona con formatos progresivos (video+audio sin merge)
- yt-dlp (vía pip o paquete del sistema)

```bash
# Node.js (LTS actual con NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Herramientas multimedia
sudo apt-get update
sudo apt-get install -y ffmpeg python3-pip
python3 -m pip install --upgrade yt-dlp

# (Opcional) Verificaciones
node --version
npm --version
ffmpeg -version
python3 -m yt_dlp --version
```

## 📦 Obtener el código

```bash
# Opción A: Clonar repo
sudo mkdir -p /opt/y2back && sudo chown "$USER":"$USER" /opt/y2back
cd /opt/y2back
git clone https://github.com/davidvalsep/y2back.git .

# Opción B: Copiar un zip / carpeta
# scp o SFTP al servidor y descomprimir en /opt/y2back
```

## 🧩 Instalar dependencias

```bash
cd /opt/y2back
npm install
# Frontend (si usarás la web)
npm run web:build
```

### Opción portátil (sin root): binarios locales

Si no puedes instalar paquetes del sistema, puedes colocar binarios en el proyecto y los scripts los usarán automáticamente:

```
/opt/y2back/
├── bin/
│   ├── ffmpeg        # dar permisos: chmod +x bin/ffmpeg
│   └── yt-dlp        # dar permisos: chmod +x bin/yt-dlp
└── ...
```

Los scripts `start-server.sh` y `start-stack.sh` agregan `./bin` y el root del proyecto al PATH, por lo que `yt-dlp` y `ffmpeg` se detectarán sin instalación del sistema.

## ▶️ Ejecutar

- Solo API (producción ligera):

```bash
./start-server.sh
```

- Pila de desarrollo (API + Web Dev server en caliente):

```bash
./start-stack.sh
```

Logs en `./logs/` (api.log, web.log). Ctrl+C detiene y limpia procesos.

## 🛡️ Servicio systemd (opcional)

Archivo: `/etc/systemd/system/y2back-api.service`

```ini
[Unit]
Description=Y2Back API Service
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/y2back
ExecStart=/usr/bin/node api/server.js
Restart=always
RestartSec=5
User=www-data
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Activar y arrancar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now y2back-api
journalctl -u y2back-api -f
```

Para servir el frontend compilado (`web:build`), usa tu Nginx/Apache preferido sirviendo `web/dist` como sitio estático o integra el `dist` en tu server si ya expone archivos estáticos.

## 🆘 Emergencias

Si algún proceso queda colgado, puedes matar ffmpeg/yt-dlp:

```bash
pkill -f yt-dlp || true
pkill -f ffmpeg || true
```

—

Hecho. Con esto puedes correr Y2Back en Linux, ya sea con los scripts incluidos o como servicio con systemd.
