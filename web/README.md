# Así es Y2Back :: Web (React)
<p align="center">
  <img src="https://cdn.susitio.cl/assets/images/logoY2B.png" alt="Y2Back logo" width="200" />
</p>
**Rápido, simple y sin rodeos - Tus contenidos, donde quieras y como quieras.**

UI web en React para Y2Back v2.x. Corre en el navegador, sirve como base para despliegue online y facilita una futura migración a móviles (React Native / Expo).

## Requisitos

- Node.js >= 18
- npm >= 9

## Arranque rápido (Windows PowerShell)

```powershell
# Instalar dependencias del frontend
npm install --prefix web

# Servidor de desarrollo (Vite)
npm run web:dev

# Build de producción
yarn build # si usas yarn, opcional
npm run web:build

# Vista previa del build
npm run web:preview
```

- Dev server por defecto: http://localhost:5173

## Configuración

- Variable de entorno: `VITE_API_BASE` para la URL del backend.
  - Por defecto: `http://localhost:3000`
- CORS: habilita CORS en el backend para aceptar el origen del frontend.
  

Puedes definir `VITE_API_BASE` de forma temporal al ejecutar (PowerShell):

```powershell
$env:VITE_API_BASE = "https://mi-api.tld"; npm run web:dev
```

## Contrato de API esperado

La UI hace `POST {API_BASE}/api/download` con cuerpo JSON:

```json
{
  "url": "https://youtu.be/dQw4w9WgXcQ",
  "kind": "video" | "audio" | "todo",
  "quality": "auto" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p",
  "format": "mp4" | "mkv" | "webm" | "mp3" | "m4a" | "opus" | "ogg"
}
```

- Respuesta esperada: `200 OK` con `{ message: string }` o detalles de la tarea.
- En caso de error: `4xx/5xx` con `{ error: string }`.

Ejemplo (Express) mínimo de backend:

```js
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
  const { url, kind, quality } = req.body || {};
  if (!url) return res.status(400).json({ error: 'url requerida' });
  // TODO: Invocar y2back.js/yt-dlp según tu flujo
  return res.json({ message: `Recibido: ${kind || 'video'} @ ${quality || 'auto'}` });
});

app.listen(3000, () => console.log('API en http://localhost:3000'));
```

## Estructura del frontend

```
web/
  ├─ index.html
  ├─ vite.config.js
  ├─ package.json
  └─ src/
  ├─ App.jsx           # UI: URL, calidad, tipo, formato, preview y acciones
      ├─ config.js         # API_BASE desde VITE_API_BASE
      ├─ main.jsx          # bootstrap React 18
      └─ styles.css        # estilos
```

## Despliegue

1) Genera el build:

```powershell
npm run web:build
```

2) Publica el contenido de `web/dist/` en tu hosting estático (Vercel, Netlify, S3+CloudFront, Nginx, etc.).

3) Configura `VITE_API_BASE` según tu entorno (o usa variables/rewrites de tu plataforma) y asegúrate de que el backend permite CORS desde el dominio del frontend.

## Notas

- El embed usa un iframe de YouTube con `enablejsapi=1` y host `youtube.com`.
- Mientras no exista backend, los botones mostrarán un mensaje informativo.
- Esta base facilita compartir lógica y vistas si más adelante migras a React Native/Expo.
