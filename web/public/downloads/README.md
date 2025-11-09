# Y2Back Downloads

Este directorio contiene las aplicaciones compiladas de Y2Back para diferentes plataformas.

## Archivos esperados:

- `Y2Back-3.1.0-linux-x64.AppImage` (~150-200MB)
- `Y2Back-3.1.0-mac-x64.dmg` (~150-200MB)
- `Y2Back-3.1.0-win-x64.exe` (~150-200MB)

## Para generar estos archivos:

Ejecuta desde la raíz del proyecto:

```bash
./build-electron-all.sh
```

O manualmente:

```bash
npm run build:linux
npm run build:mac
npm run build:win
```

Los archivos se generarán en `dist/` y luego se copiarán aquí automáticamente.

## Nota:

- Los archivos son portables y no requieren instalación
- Incluyen yt-dlp, ffmpeg y ffprobe integrados
- Tamaño aproximado: 150-200MB por plataforma (incluye Node.js embebido + binarios)

---

**No subir estos archivos a Git** — son demasiado grandes. Usa releases de GitHub o un servidor de descargas.
