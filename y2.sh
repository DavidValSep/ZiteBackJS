#!/bin/bash

# 🚀 Y2 - Comando Corto para Unix/Linux/macOS
# Ejecuta y2back.js con los argumentos proporcionados

# Obtener el directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Cambiar al directorio del script
cd "$SCRIPT_DIR"

# Si no hay argumentos, mostrar ayuda
if [ $# -eq 0 ]; then
    node y2back.js --help
else
    # Ejecutar y2back.js con todos los argumentos
    node y2back.js "$@"
fi