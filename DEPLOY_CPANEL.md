# 🚀 Guía de Deployment en cPanel (Hosting Compartido)

Esta guía te lleva paso a paso para desplegar **Y2Back API + SPA** en hosting compartido con cPanel y "Setup Node.js" (Passenger).

---

## 📋 Requisitos Previos

- ✅ Hosting con **cPanel**
- ✅ Feature **"Setup Node.js App"** habilitado (Passenger)
- ✅ Node.js **≥ 18.x** disponible en cPanel
- ✅ Acceso a **File Manager** o **FTP/SFTP**
- ✅ (Opcional) Acceso **SSH** para diagnóstico

---

## 📦 Paso 1: Generar Bundles de Deployment

En tu máquina local:

```bash
cd /ruta/a/Y2BackJS
bash tools/build-deploy-bundle.sh
```

**Resultado:**
```
dist/bundles/
├── y2back-api.tar.gz    (129MB) - Backend API + binarios
└── web-dist.tar.gz      (1.4MB)  - Frontend SPA
```

---

## 📁 Paso 2: Crear Estructura en el Servidor

### Opción A: Usando File Manager de cPanel

1. Accede a **File Manager**
2. Navega a `public_html/`
3. Crea estructura:
   ```
   public_html/
   ├── sites/
   │   └── apis/
   │       └── apiy2.tudominio.com/
   │           └── y2api/          ← carpeta para la API
   ```

### Opción B: Usando FTP

Conecta vía FTP y crea:
```
/home/usuario/public_html/sites/apis/apiy2.tudominio.com/y2api/
```

---

## 📤 Paso 3: Subir Bundle de API

1. Sube `y2back-api.tar.gz` a:
   ```
   /home/usuario/public_html/sites/apis/apiy2.tudominio.com/
   ```

2. **Extrae el archivo:**

   **Opción A - File Manager:**
   - Click derecho en `y2back-api.tar.gz`
   - **Extract**
   - Selecciona carpeta destino: `y2api/`

   **Opción B - SSH (si disponible):**
   ```bash
   cd /home/usuario/public_html/sites/apis/apiy2.tudominio.com/
   tar -xzf y2back-api.tar.gz -C y2api/
   ```

3. **Verifica la estructura extraída:**
   ```
   y2api/
   ├── app.js              ← Entry point para Passenger
   ├── api/
   │   └── server.js      ← Express API
   ├── package.json
   ├── yt-dlp             ← Binario (debe ser ejecutable)
   ├── ffmpeg             ← Binario (debe ser ejecutable)
   ├── ffprobe            ← Binario (debe ser ejecutable)
   ├── deploy/
   │   ├── api-site/
   │   └── systemd/
   └── README_DEPLOY_QUICK.md
   ```

---

## 🔧 Paso 4: Configurar Permisos de Binarios

**IMPORTANTE:** Los binarios deben tener permisos de ejecución.

### Via File Manager:

1. Selecciona `yt-dlp`, `ffmpeg`, `ffprobe`
2. Click derecho → **Change Permissions**
3. Marca todas las casillas de **Execute (X)**
4. Permisos finales: **755** (rwxr-xr-x)
5. **Apply**

### Via SSH:

```bash
cd /home/usuario/public_html/sites/apis/apiy2.tudominio.com/y2api/
chmod +x yt-dlp ffmpeg ffprobe
```

---

## ⚙️ Paso 5: Configurar Node.js App en cPanel

1. Accede a **cPanel** → **Setup Node.js App**

2. Click en **"Create Application"**

3. **Configuración:**

   | Campo | Valor |
   |-------|-------|
   | **Node.js version** | 18.x o superior |
   | **Application mode** | `production` |
   | **Application root** | `/home/usuario/public_html/sites/apis/apiy2.tudominio.com/y2api` |
   | **Application URL** | `apiy2.tudominio.com` (o dejar vacío) |
   | **Application startup file** | `app.js` |
   | **Passenger log file** | `/home/usuario/public_html/sites/apis/apiy2.tudominio.com/y2api.log` |

4. **Environment Variables** (Add variable):

   | Name | Value |
   |------|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` (Passenger puede ignorarlo) |
   | `CORS_ORIGINS` | `https://apiy2.tudominio.com,https://tudominio.com` |

5. Click **"Create"** o **"Save"**

---

## 📥 Paso 6: Instalar Dependencias

1. En la misma página de **Setup Node.js**
2. Localiza tu aplicación creada
3. Click en **"Run NPM Install"**
4. **Espera hasta que diga:** `"NPM Install completed successfully"`

⚠️ **Importante:** No interrumpas este proceso. Puede tardar 1-3 minutos.

---

## ▶️ Paso 7: Iniciar la Aplicación

1. En **Setup Node.js**, localiza tu app
2. Click en **"Start Application"** o ▶️
3. Verifica que el status cambie a **"Running"**

---

## ✅ Paso 8: Verificar que Funciona

### Prueba 1: Health Check Interno

Crea archivo `test-api.php` en `/home/usuario/public_html/sites/apis/apiy2.tudominio.com/`:

```php
<?php
$port = getenv('PORT') ?: '3000';
echo "Puerto: $port<br><br>";

$ch = curl_init("http://127.0.0.1:$port/api/health");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

header('Content-Type: application/json');
echo $response;
?>
```

Accede a: `https://apiy2.tudominio.com/test-api.php`

**Respuesta esperada:**
```json
{
  "ok": true,
  "name": "Y2Back API",
  "port": 3000,
  "node_env": "production",
  "yt_dlp": {"available": true, "version": "..."},
  "ffmpeg": {"available": true, "version": "..."}
}
```

### Prueba 2: Logs

Revisa el log:
```
/home/usuario/public_html/sites/apis/apiy2.tudominio.com/y2api.log
```

Debe contener:
```
Y2Back API escuchando en http://127.0.0.1:3000
PUERTO CONFIGURADO: 3000
NODE_ENV: production
```

---

## 🌐 Paso 9: Configurar Proxy Apache (.htaccess)

Para acceder públicamente a la API vía `https://apiy2.tudominio.com/api/*`:

Crea o edita `.htaccess` en:
```
/home/usuario/public_html/sites/apis/apiy2.tudominio.com/.htaccess
```

**Contenido:**
```apache
RewriteEngine On

# Proxy para rutas /api/*
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ http://127.0.0.1:3000/api/$1 [P,L]

# CORS Headers (opcional si ya está en Express)
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
</IfModule>
```

**Verifica:**
```
https://apiy2.tudominio.com/api/health
```

Debe devolver el JSON de health check.

---

## 🎨 Paso 10: Subir Frontend (Opcional)

1. Sube `web-dist.tar.gz` a:
   ```
   /home/usuario/public_html/sites/apis/apiy2.tudominio.com/
   ```

2. Extrae en la raíz:
   ```bash
   tar -xzf web-dist.tar.gz
   ```

3. La estructura queda:
   ```
   apiy2.tudominio.com/
   ├── index.html          ← SPA principal
   ├── assets/
   │   ├── index-xxx.js
   │   └── index-xxx.css
   ├── y2api/              ← API backend
   └── .htaccess
   ```

4. Accede a: `https://apiy2.tudominio.com/`

La SPA cargará y se conectará automáticamente a `/api/*`.

---

## 🐛 Troubleshooting

### ❌ Aplicación no inicia

**Síntomas:**
- "Start Application" se queda pensando
- No hay logs en `y2api.log`

**Soluciones:**
1. Verifica que `app.js` existe en la raíz
2. **Application startup file** debe ser `app.js` (no `api/server.js`)
3. Elimina archivos de ejemplo de cPanel (`server.js` en raíz si existe)
4. Toca el archivo `tmp/restart.txt` para forzar reinicio

### ❌ Error "Can't acquire lock"

**Solución:**
1. **Stop Application**
2. Espera 10 segundos
3. **Start Application**
4. Si persiste: **Delete** app y créala de nuevo

### ❌ yt-dlp no disponible

**Síntomas:**
```json
"yt_dlp": {"available": false}
```

**Soluciones:**
1. Verifica permisos de `yt-dlp`: debe ser **755**
2. En File Manager: selecciona `yt-dlp` → Change Permissions → Execute (X) marcado
3. Reinicia la app

### ❌ CORS errors desde SPA

**Síntomas:**
```
Access to fetch at 'https://apiy2.tudominio.com/api/search' from origin 'https://tudominio.com' has been blocked by CORS policy
```

**Solución:**

Actualiza variable de entorno `CORS_ORIGINS`:
```
CORS_ORIGINS=https://tudominio.com,https://apiy2.tudominio.com,https://www.tudominio.com
```

Reinicia la app.

### ❌ Puerto incorrecto

**Síntomas:**
- test-api.php muestra puerto diferente a 3000
- Conexión fallida

**Solución:**

Passenger asigna puerto automáticamente. Usa el puerto detectado en:
```php
$port = getenv('PORT') ?: '3000';
```

Y actualiza `.htaccess` con ese puerto.

---

## 🔄 Actualizar la Aplicación

1. **Stop Application** en cPanel
2. Sube nuevo `y2back-api.tar.gz`
3. Extrae sobre la carpeta existente (sobrescribe)
4. Verifica permisos de binarios (755)
5. **Run NPM Install** (si cambió `package.json`)
6. **Start Application**

---

## 📊 Endpoints Disponibles

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/health` | GET | Health check + config |
| `/api/info` | GET | Versión, puerto, entorno |
| `/api/search?q=query` | GET | Búsqueda en YouTube |
| `/api/info?url=VIDEO_URL` | GET | Info de video |
| `/api/download` | POST | Iniciar descarga |
| `/api/jobs/:id/stream` | GET | SSE logs de descarga |
| `/api/jobs/:id/files/:index` | GET | Descargar archivo |

---

## 🎯 Checklist de Deployment

- [ ] Bundles generados (`y2back-api.tar.gz`, `web-dist.tar.gz`)
- [ ] Bundle subido y extraído en servidor
- [ ] Permisos 755 en `yt-dlp`, `ffmpeg`, `ffprobe`
- [ ] App Node.js creada en cPanel
- [ ] `app.js` configurado como startup file
- [ ] Variables de entorno definidas (NODE_ENV, CORS_ORIGINS)
- [ ] NPM Install completado exitosamente
- [ ] Aplicación iniciada (status: Running)
- [ ] Logs muestran puerto y versión
- [ ] test-api.php retorna JSON válido
- [ ] .htaccess configurado con proxy
- [ ] API pública accesible: `/api/health`
- [ ] Frontend SPA cargando (si aplica)
- [ ] CORS funcionando desde dominios permitidos

---

## 🆘 Soporte

- 📧 Email: davidvalsep@gmail.com
- 🐛 Issues: https://github.com/davidvalsep/y2back/issues
- 📚 Docs: [README.md](README.md) | [CHANGELOG.md](CHANGELOG.md)

---

**¡Deployment exitoso!** 🎉 Tu API Y2Back está corriendo en producción.
