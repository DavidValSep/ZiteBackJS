# Empaquetado portátil (portable)

Este directorio contiene una utilidad para generar una versión "portable" del proyecto.

Herramienta principal: `tools/make-portable.sh`

Qué hace:
- Copia los archivos necesarios (`y2back.js`, `gui.js`, `api/`, `web/dist` si existe) en `dist/portable/app`.
- Descarga y extrae un runtime de Node para Linux (x64/arm64) en `dist/portable/runtime/node`.
- Copia binarios locales (si existen) como `yt-dlp`, `ffmpeg`, `ffprobe` a `dist/portable/runtime/bin`.
- Crea `dist/portable/run.sh` que configura PATH para usar el Node incluido y ejecuta `y2back.js`.

Uso rápido:

```bash
# Desde la raíz del proyecto
tools/make-portable.sh --node-version 20.24.0 --include-ffmpeg --include-yt-dlp --output ./dist/portable --force

# En el equipo cliente, ejecutar:
cd dist/portable
./run.sh --help
```

Notas:
- El script descarga Node automáticamente sólo en Linux (x64/arm64). En otras plataformas copiaremos el runtime si lo proporcionas manualmente.
- Si no tienes `curl` o `wget` en la máquina donde ejecutes el empaquetado, la descarga de Node fallará.
- Para incluir ffmpeg/yt-dlp asegúrate de poner los binarios en la raíz del proyecto antes de ejecutar `make-portable.sh`, o deja que el cliente provea esos binarios dentro de `runtime/bin`.
