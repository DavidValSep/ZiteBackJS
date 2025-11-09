#!/usr/bin/env node

/**
 * 🚀 Y2 - Comando Corto para Y2Back
 * 
 * Script de acceso rápido que ejecuta y2back.js con los argumentos proporcionados.
 * Simplifica el uso del sistema: `y2 -v -u "URL"` en lugar de `node y2back.js -v -u "URL"`
 */

const { spawn } = require('child_process');
const path = require('path');

// Ruta al script principal
const SCRIPT_PATH = path.join(__dirname, 'y2back.js');

// Obtener argumentos de línea de comandos (saltando 'node' y este script)
const args = process.argv.slice(2);

// Si no se proporcionan argumentos, mostrar ayuda
if (args.length === 0) {
    args.push('--help');
}

// Ejecutar y2back.js con los argumentos proporcionados
const child = spawn('node', [SCRIPT_PATH, ...args], {
    stdio: 'inherit',
    shell: true
});

// Manejar la salida del proceso
child.on('close', (code) => {
    process.exit(code);
});

child.on('error', (error) => {
    console.error(`🚫 Error ejecutando Y2: ${error.message}`);
    process.exit(1);
});