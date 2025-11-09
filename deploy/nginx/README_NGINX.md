# 🚀 Deploy Y2Back en Nginx

Guía para deployar Y2Back API en servidor con Nginx.

## 📋 Requisitos Previos

- Servidor Linux (Ubuntu/Debian/CentOS)
- Nginx instalado
- Node.js 18.x o superior
- PM2 o systemd para gestionar la aplicación

## 📦 Archivos a Subir

```bash
/var/www/y2back/
├── app.js
├── package.json
├── config.js
├── api/
├── yt-dlp
├── ffmpeg
├── ffprobe
├── medios/ (vacío)
└── logs/ (vacío)
```

## ⚙️ Instalación

### 1. Subir Archivos

```bash
# Crear directorio
sudo mkdir -p /var/www/y2back
sudo chown $USER:$USER /var/www/y2back

# Subir archivos vía SCP/SFTP/Git
cd /var/www/y2back
```

### 2. Instalar Dependencias

```bash
cd /var/www/y2back
npm install --production
```

### 3. Dar Permisos a Binarios

```bash
chmod +x yt-dlp ffmpeg ffprobe
```

### 4. Configurar Nginx

```bash
# Copiar configuración
sudo cp deploy/nginx/y2back-nginx.conf.example /etc/nginx/sites-available/y2back

# Editar y personalizar
sudo nano /etc/nginx/sites-available/y2back
# Cambiar: tu-dominio.com por tu dominio real

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/y2back /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### 5. Iniciar Aplicación con PM2

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar aplicación
cd /var/www/y2back
PORT=7770 NODE_ENV=production pm2 start app.js --name y2back-api

# Guardar configuración
pm2 save

# Autostart en reinicio
pm2 startup
# (ejecutar el comando que PM2 te muestre)
```

### 6. Verificar

```bash
# Ver logs
pm2 logs y2back-api

# Ver estado
pm2 status

# Verificar API
curl http://localhost:7770/api/health
```

## 🔒 SSL con Let's Encrypt (Recomendado)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Renovación automática ya está configurada
```

## 🔄 Actualización

```bash
# Detener aplicación
pm2 stop y2back-api

# Actualizar archivos
git pull  # o subir nuevos archivos

# Instalar dependencias si hay cambios
npm install --production

# Reiniciar
pm2 restart y2back-api
```

## 📊 Monitoreo

```bash
# Ver logs en tiempo real
pm2 logs y2back-api --lines 100

# Ver métricas
pm2 monit

# Ver información detallada
pm2 show y2back-api
```

## 🛠️ Troubleshooting

### Puerto en uso
```bash
# Ver qué usa el puerto 7770
sudo lsof -i :7770
sudo netstat -tulpn | grep 7770
```

### Permisos de binarios
```bash
# Verificar
ls -la yt-dlp ffmpeg ffprobe

# Corregir si es necesario
chmod +x yt-dlp ffmpeg ffprobe
```

### Logs de Nginx
```bash
sudo tail -f /var/log/nginx/y2back-error.log
sudo tail -f /var/log/nginx/y2back-access.log
```

## 🔥 Variables de Entorno

Crear archivo `.env` o usar PM2 ecosystem:

```bash
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'y2back-api',
    script: 'app.js',
    env: {
      NODE_ENV: 'production',
      PORT: 7770,
      CORS_ORIGINS: 'https://tu-dominio.com'
    }
  }]
}

# Usar con:
pm2 start ecosystem.config.js
```

## 📝 Notas

- El puerto 7770 es configurable (ajustar en nginx y pm2)
- Asegúrate de que el firewall permita el puerto 80/443
- Los archivos de medios pueden crecer, monitorea el espacio en disco
