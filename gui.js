#!/usr/bin/env node

/**
 * 🎨 GUI Launcher - Y2Back
 * 
 * Lanzador simplificado para la interfaz gráfica de Y2Back
 * Uso: gui --start [--remote] [--url <https://apiy2.susitio.cl/>] | gui -s
 * 
 * @version 2.0.0
 * @author DavidValSep
 * @license GPL-3.0
 */

const { spawn } = require('child_process');
const path = require('path');

// Función para mostrar ayuda
function mostrarAyuda() {
    console.log(`
🎨 Y2Back GUI Launcher v2.0.0

📋 USO:
  gui --start     Iniciar la interfaz gráfica
  gui -s          Iniciar la interfaz gráfica (forma corta)
    gui --help      Mostrar esta ayuda
  gui -h          Mostrar esta ayuda

🌐 Opciones de origen de la UI:
    gui --start --remote                 Forzar UI remota (sin API local)
    gui --start --remote --url https://apiy2.susitio.cl/

🚀 EJEMPLOS:
    gui --start     # Lanza el GUI de Y2Back
  gui -s          # Forma corta para lanzar el GUI

📁 El GUI permite:
  🔍 Buscar videos y playlists en YouTube
  📥 Descargar contenido directamente desde la interfaz
  ⚙️ Configurar calidad y formatos
  📋 Gestionar listas de descarga por lotes

🔗 Más información: https://github.com/davidvalsep/y2back
`);
}

// Función para lanzar el GUI
function lanzarGUI(options = {}) {
    console.log('🎨 Iniciando Y2Back GUI...');
    console.log('📂 Directorio de trabajo:', __dirname);
    
    // Usar require() para ejecutar el script de npm directamente
    try {
        // Cambiar al directorio del proyecto
        process.chdir(__dirname);
        
        // Intentar primero script npm (usa ruta correcta ELIMINAR/electron/main.js), luego fallback a npx
        const { exec } = require('child_process');
        const run = (cmd) => new Promise((resolve) => {
            // Preparar entorno (posible forzar remoto)
            const env = { ...process.env };
            if (options.remote) {
                env.Y2B_FORCE_REMOTE = '1';
                if (options.url) env.Y2B_GUI_URL = options.url;
            }
            const child = exec(cmd, { cwd: __dirname, env }, (error, stdout, stderr) => {
                resolve({ error, stdout, stderr });
            });
            child.stdout && child.stdout.pipe(process.stdout);
            child.stderr && child.stderr.pipe(process.stderr);
        });

        (async () => {
            let res = await run('npm run electron:dev');
            if (res.error) {
                console.log('↩️ Fallback a npx electron …');
                // usar main explícito por si package.json no se recargó
                res = await run('npx electron ELIMINAR/electron/main.js');
            }
            if (res.error) {
                console.error('❌ Error al lanzar el GUI:', res.error.message);
                console.log('💡 Asegúrate de instalar dependencias del proyecto:');
                console.log('   npm install');
                console.log('💡 Luego ejecuta:');
                console.log('   npm run electron:dev');
                console.log('   # o');
                console.log('   npx electron ELIMINAR/electron/main.js');
                return;
            }
            if (res.stderr) { console.log('⚠️ Advertencias:', res.stderr); }
            console.log('✅ GUI lanzado correctamente');
        })();
        
    } catch (error) {
        console.error('❌ Error al lanzar el GUI:', error.message);
        console.log('💡 Intenta manualmente:');
        console.log('   cd "' + __dirname + '"');
        console.log('   npx electron .');
    }
}

// Procesar argumentos de línea de comandos
function procesarArgumentos() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        mostrarAyuda();
        return;
    }

    const comando = args[0];
    // Flags adicionales
    const remote = args.includes('--remote');
    const urlIdx = args.indexOf('--url');
    const remoteUrl = urlIdx >= 0 ? (args[urlIdx + 1] || '').trim() : '';

    switch (comando) {
        case '--start':
        case '-s':
            lanzarGUI({ remote, url: remoteUrl });
            break;
        
        case '--help':
        case '-h':
            mostrarAyuda();
            break;
        
        default:
            console.log(`❌ Comando desconocido: ${comando}`);
            console.log('💡 Usa "gui --help" para ver los comandos disponibles');
            process.exit(1);
    }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
    procesarArgumentos();
}

module.exports = {
    lanzarGUI,
    mostrarAyuda
};