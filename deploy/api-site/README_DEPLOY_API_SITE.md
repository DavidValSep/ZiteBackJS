# Despliegue de Web App en apiy2.susitio.cl (con backend en /api)

Este paquete te deja lista la Web App (SPA) para subirla al servidor y un ejemplo de configuración de Nginx/Apache para publicar la API en la misma raíz bajo `/api`.

## Contenidos

- `web/dist/` → Archivos estáticos de la Web App listos para producción.
- `nginx-apiy2.conf.example` → VirtualHost de ejemplo para Nginx.
- `apache-apiy2.conf.example` → VirtualHost de ejemplo para Apache.

## Pasos rápidos (Nginx)

1. Copia el contenido de `web/dist/` al docroot del sitio, por ejemplo `/var/www/apiy2.susitio.cl/html`.
2. Configura Nginx con `nginx-apiy2.conf.example` (ajusta rutas/host/puerto backend) y habilita el sitio.
3. Reinicia Nginx.

## Pasos rápidos (Apache)

1. Copia el contenido de `web/dist/` al docroot.
2. Habilita `mod_proxy` y `mod_proxy_http`.
3. Carga el vhost basado en `apache-apiy2.conf.example` y reinicia Apache.

## Notas

- La SPA consume la API en la misma raíz (`/api`). Asegúrate de que el proxy apunte hacia tu backend (por ejemplo `http://127.0.0.1:3000`).
- Si prefieres servir la API en otro dominio/puerto, puedes reconstruir la SPA con `VITE_API_BASE` apuntando a ese host y habilitar CORS en el backend.
