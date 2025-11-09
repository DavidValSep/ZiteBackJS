#!/usr/bin/env node

/**
 * 🚀 Y2Back - Instalador del Comando Corto 'y2b'
 * 
 * Basado en el sistema de instalación de ZiteBackJS
 * Configura el comando corto 'y2b' para facilidad de uso
 * 
 * Uso: npm run install-y2b
 * 
 * @version 2.0.0
 * @author DavidValSep
 * @inspirado ZiteBackJS v3.6.7
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('\n🚀 Y2Back - Instalador del Comando Corto "y2b"\n');

// Detectar sistema operativo
const isWindows = os.platform() === 'win32';
const directorioActual = process.cwd();
const nombreScript = 'y2back.js';

// Rutas de los archivos a crear
const archivoScript = path.join(directorioActual, nombreScript);
const archivoComandoWindows = path.join(directorioActual, 'y2b.cmd');
const archivoComandoUnix = path.join(directorioActual, 'y2b');

/**
 * Verifica si el archivo principal existe
 */
function verificarArchivoYoutube() {
    if (!fs.existsSync(archivoScript)) {
        console.error('❌ Error: No se encontró el archivo y2back.js');
    console.log('   Asegúrate de estar en el directorio correcto de Y2Back');
        process.exit(1);
    }
    console.log('✅ Archivo y2back.js encontrado');
}

/**
 * Crea el archivo batch para Windows
 */
function crearComandoWindows() {
    const contenidoBatch = `@echo off
REM Y2Back - Comando corto para Windows
REM Generado automáticamente por install-y2b.js

node "%~dp0y2back.js" %*
`;

    try {
        fs.writeFileSync(archivoComandoWindows, contenidoBatch, 'utf8');
        console.log('✅ Archivo y2b.cmd creado para Windows');
        
        // Mostrar instrucciones de uso
        console.log('\n📋 Uso en Windows (PowerShell/CMD):');
        console.log('   .\\y2b --help                    # Ayuda del comando');
    console.log('   .\\y2b --version                 # Versión de Y2Back');
        console.log('   .\\y2b -v -u "URL_YOUTUBE"       # Descargar video');
        console.log('   .\\y2b -a -u "URL_YOUTUBE"       # Descargar solo audio');
        console.log('   .\\y2b -p -u "URL_PLAYLIST"      # Descargar playlist');
        
    } catch (error) {
        console.error('❌ Error al crear y2b.cmd:', error.message);
    }
}

/**
 * Crea el script bash para Unix/Linux/macOS
 */
function crearComandoUnix() {
    const contenidoBash = `#!/bin/bash
# Y2Back - Comando corto para Unix/Linux/macOS
# Generado automáticamente por install-y2b.js

DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
node "$DIR/y2back.js" "$@"
`;

    try {
        fs.writeFileSync(archivoComandoUnix, contenidoBash, 'utf8');
        
        // Hacer ejecutable en sistemas Unix
        if (!isWindows) {
            const { execSync } = require('child_process');
            execSync(`chmod +x "${archivoComandoUnix}"`);
            console.log('✅ Script y2b creado y marcado como ejecutable');
        } else {
            console.log('✅ Script y2b creado (para sistemas Unix/Linux)');
        }
        
        // Mostrar instrucciones de uso
        console.log('\n📋 Uso en Unix/Linux/macOS:');
        console.log('   ./yb --help                     # Ayuda del comando');
    console.log('   ./yb --version                  # Versión de Y2Back');
        console.log('   ./yb -mkv -u "URL_YOUTUBE"      # Descargar video Matroska');
        console.log('   ./yb -mp4 -u "URL_YOUTUBE"      # Descargar video MP4');
        console.log('   ./yb -mp3 -u "URL_YOUTUBE"      # Descargar solo audio mp3');
        console.log('   ./yb -m4a -u "URL_YOUTUBE"      # Descargar solo audio m4a');
        console.log('   ./yb -p -mkv -u "URL_PLAYLIST"  # Descargar playlist Matroska');
        console.log('   ./yb -p -mp4 -u "URL_PLAYLIST"  # Descargar playlist MP4');
        console.log('   ./yb -p -mp3 -u "URL_PLAYLIST"  # Descargar playlist MP3');
        console.log('   ./yb -p -m4a -u "URL_PLAYLIST"  # Descargar playlist M4A');
        console.log('   ./yb -s -u "SCREENSHOT_URL"     # Descargar screenshot');
        console.log('   ./yb -all -u "URL_YOUTUBE"      # Descargar todos los formatos');
        
    } catch (error) {
        console.error('❌ Error al crear script y2b:', error.message);
    }
}

/**
 * Actualiza el package.json con el comando bin
 */
function actualizarPackageJson() {
    const rutaPackageJson = path.join(directorioActual, 'package.json');
    
    try {
        let packageJson = {};
        
        // Leer package.json existente o crear uno básico
        if (fs.existsSync(rutaPackageJson)) {
            const contenido = fs.readFileSync(rutaPackageJson, 'utf8');
            packageJson = JSON.parse(contenido);
            console.log('✅ package.json encontrado y leído');
        } else {
            console.log('📋 Creando package.json básico...');
        }
        
        // Agregar configuración bin
        packageJson.bin = packageJson.bin || {};
        packageJson.bin.y2b = './y2back.js';
        packageJson.bin.y2back = './y2back.js';
        
        // Agregar script de instalación
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts['install-y2b'] = 'node install-y2b.js';
        
        // Información básica si no existe
    if (!packageJson.name) packageJson.name = 'y2back';
        if (!packageJson.version) packageJson.version = '7.0.0';
        if (!packageJson.description) {
            packageJson.description = 'Sistema avanzado de respaldo de videos de YouTube y otras plataformas';
        }
        
        // Escribir package.json actualizado
        fs.writeFileSync(rutaPackageJson, JSON.stringify(packageJson, null, 2), 'utf8');
        console.log('✅ package.json actualizado con configuración bin');
        
    } catch (error) {
        console.error('❌ Error al actualizar package.json:', error.message);
    }
}

/**
 * Verifica la instalación
 */
function verificarInstalacion() {
    console.log('\n🔍 Verificando instalación...');
    
    const archivosEsperados = [];
    
    if (isWindows) {
        archivosEsperados.push({ archivo: archivoComandoWindows, tipo: 'Comando Windows' });
    }
    
    archivosEsperados.push({ archivo: archivoComandoUnix, tipo: 'Script Unix/Linux' });
    
    let todoOk = true;
    
    archivosEsperados.forEach(({ archivo, tipo }) => {
        if (fs.existsSync(archivo)) {
            console.log(`✅ ${tipo}: ${path.basename(archivo)} creado correctamente`);
        } else {
            console.log(`❌ ${tipo}: ${path.basename(archivo)} NO ENCONTRADO`);
            todoOk = false;
        }
    });
    
    if (todoOk) {
        console.log('\n🎉 ¡Instalación completada exitosamente!');
        console.log('\n📖 Próximos pasos:');
        
        if (isWindows) {
            console.log('   1. En PowerShell/CMD: .\\y2b --version');
            console.log('   2. Para ayuda: .\\y2b --help');
            console.log('   3. Ejemplo: .\\y2b -v -u "https://youtu.be/dQw4w9WgXcQ"');
        } else {
            console.log('   1. En terminal: ./y2b --version');
            console.log('   2. Para ayuda: ./y2b --help'); 
            console.log('   3. Ejemplo: ./y2b -v -u "https://youtu.be/dQw4w9WgXcQ"');
        }
        
        console.log('\n🔧 Comando tradicional sigue disponible:');
        console.log('   node y2back.js --help');
        
    } else {
        console.log('\n❌ Hubo problemas durante la instalación');
        console.log('   Revisa los errores anteriores y vuelve a intentar');
    }
}

/**
 * Proceso principal de instalación
 */
function main() {
    try {
        console.log('🏗️ Iniciando proceso de instalación...\n');
        
        // Verificaciones previas
        verificarArchivoYoutube();
        
        // Crear comandos según el sistema
        console.log('📦 Creando archivos de comando...');
        crearComandoWindows();
        crearComandoUnix();
        
        // Actualizar configuración
        console.log('\n⚙️ Actualizando configuración...');
        actualizarPackageJson();
        
        // Verificar todo
        verificarInstalacion();
        
    } catch (error) {
        console.error('\n💥 Error inesperado durante la instalación:');
        console.error(error.message);
        console.log('\n🔧 Sugerencias:');
        console.log('   - Verifica que tienes permisos de escritura');
        console.log('   - Asegúrate de estar en el directorio correcto');
        console.log('   - Ejecuta: npm run install-y2b');
        process.exit(1);
    }
}

// Ejecutar instalación
main();