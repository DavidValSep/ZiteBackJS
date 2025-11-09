#!/usr/bin/env node

/**
 * 🚀 Y2Back - Instalador del Comando Corto 'y2'
 * 
 * Basado en el sistema de instalación de ZiteBackJS
 * Configura el comando corto 'y2' para facilidad de uso
 * 
 * Uso: npm run install-y2
 * 
 * @version 2.0.0
 * @author DavidValSep
 * @inspirado ZiteBack v3.6.7
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Importar configuración centralizada
const config = require('./config.js');
const { VERSION_CONFIG, APP_CONFIG, UI_CONFIG } = config;

console.log(`\n${UI_CONFIG.EMOJIS.ROCKET} ${APP_CONFIG.NAME} v${VERSION_CONFIG.VERSION} - Instalador del Comando Corto "${UI_CONFIG.SHORT_COMMAND}"\n`);

// Detectar sistema operativo
const isWindows = os.platform() === 'win32';
const directorioActual = process.cwd();
const nombreScript = 'y2back.js';

// Rutas de los archivos a crear
const archivoScript = path.join(directorioActual, nombreScript);
const archivoComandoWindows = path.join(directorioActual, `${UI_CONFIG.SHORT_COMMAND}.cmd`);
const archivoComandoUnix = path.join(directorioActual, UI_CONFIG.SHORT_COMMAND);

/**
 * Verifica si el archivo principal existe
 */
function verificarArchivoYoutube() {
    if (!fs.existsSync(archivoScript)) {
        console.error(`${UI_CONFIG.EMOJIS.ERROR} Error: No se encontró el archivo ${nombreScript}`);
        console.log(`   Asegúrate de estar en el directorio correcto de ${APP_CONFIG.NAME}`);
        process.exit(1);
    }
    console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Archivo ${nombreScript} encontrado`);
}

/**
 * Crea el archivo batch para Windows
 */
function crearComandoWindows() {
    const contenidoBatch = `@echo off
REM ${APP_CONFIG.NAME} v${VERSION_CONFIG.VERSION} - Comando corto para Windows
REM Generado automáticamente por install-y2.js

node "%~dp0${nombreScript}" %*
`;

    try {
        fs.writeFileSync(archivoComandoWindows, contenidoBatch, 'utf8');
        console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Archivo ${UI_CONFIG.SHORT_COMMAND}.cmd creado para Windows`);
        
        // Mostrar instrucciones completas de uso
        console.log('\n📋 Uso completo en Windows (PowerShell/CMD):');
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --help                    # Ayuda completa`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --version                 # Versión actual`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --verify                  # Verificar archivos descargados`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --search "término"        # Buscar en YouTube`);
        console.log(`\n   .\\${UI_CONFIG.SHORT_COMMAND} --video -u "URL"         # Descargar video (MP4)`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --music -u "URL"          # Descargar audio (MP3)`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --pics -u "URL"           # Descargar thumbnails`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --subtitles -u "URL"      # Descargar subtítulos`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --screenshots -u "URL"    # Capturar pantallas`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --meta -u "URL"           # Extraer metadata`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --all -u "URL"            # Descargar todo`);
        console.log(`\n   .\\${UI_CONFIG.SHORT_COMMAND} --video -u "URL" --quality 1080p --format mp4`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND} --music -u "URL" --format mp3`);
        console.log(`\n   # Modo interactivo (sin parámetros):`);
        console.log(`   .\\${UI_CONFIG.SHORT_COMMAND}                           # Pregunta por URL y opciones`);
        
    } catch (error) {
        console.error(`${UI_CONFIG.EMOJIS.ERROR} Error al crear ${UI_CONFIG.SHORT_COMMAND}.cmd:`, error.message);
    }
}

/**
 * Crea el script bash para Unix/Linux/macOS
 */
function crearComandoUnix() {
    const contenidoBash = `#!/bin/bash
# ${APP_CONFIG.NAME} v${VERSION_CONFIG.VERSION} - Comando corto para Unix/Linux/macOS
# Generado automáticamente por install-y2.js

DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
node "$DIR/${nombreScript}" "$@"
`;

    try {
        fs.writeFileSync(archivoComandoUnix, contenidoBash, 'utf8');
        
        // Hacer ejecutable en sistemas Unix
        if (!isWindows) {
            const { execSync } = require('child_process');
            execSync(`chmod +x "${archivoComandoUnix}"`);
            console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Script ${UI_CONFIG.SHORT_COMMAND} creado y marcado como ejecutable`);
        } else {
            console.log(`${UI_CONFIG.EMOJIS.SUCCESS} Script ${UI_CONFIG.SHORT_COMMAND} creado (para sistemas Unix/Linux)`);
        }
        
        // Mostrar instrucciones completas de uso
        console.log('\n📋 Uso completo en Unix/Linux/macOS:');
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --help                    # Ayuda completa`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --version                 # Versión actual`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --verify                  # Verificar archivos descargados`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --search "término"        # Buscar en YouTube`);
        console.log(`\n   ${UI_CONFIG.SHORT_COMMAND} --video -u "URL"         # Descargar video (MP4)`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --music -u "URL"          # Descargar audio (MP3)`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --pics -u "URL"           # Descargar thumbnails`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --subtitles -u "URL"      # Descargar subtítulos`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --screenshots -u "URL"    # Capturar pantallas`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --meta -u "URL"           # Extraer metadata`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --all -u "URL"            # Descargar todo`);
        console.log(`\n   ${UI_CONFIG.SHORT_COMMAND} --video -u "URL" --quality 1080p --format mp4`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND} --music -u "URL" --format mp3`);
        console.log(`\n   # Modo interactivo (sin parámetros):`);
        console.log(`   ${UI_CONFIG.SHORT_COMMAND}                           # Pregunta por URL y opciones`);
        
    } catch (error) {
        console.error(`${UI_CONFIG.EMOJIS.ERROR} Error al crear script ${UI_CONFIG.SHORT_COMMAND}:`, error.message);
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
            console.log(`${UI_CONFIG.EMOJIS.SUCCESS} package.json encontrado y leído`);
        } else {
            console.log('📋 Creando package.json básico...');
        }
        
        // Agregar configuración bin
        packageJson.bin = packageJson.bin || {};
    packageJson.bin[UI_CONFIG.SHORT_COMMAND] = `./${nombreScript}`;
    packageJson.bin.y2back = `./${nombreScript}`;
        
        // Agregar script de instalación
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts['install-y2'] = 'node install-y2.js';
        
        // Información básica desde config
    packageJson.name = packageJson.name || 'y2back';
        packageJson.version = VERSION_CONFIG.VERSION;
        packageJson.description = packageJson.description || APP_CONFIG.DESCRIPTION;
        packageJson.author = packageJson.author || APP_CONFIG.AUTHOR;
        packageJson.license = packageJson.license || APP_CONFIG.LICENSE;
        
        // URLs del proyecto
        packageJson.homepage = APP_CONFIG.HOMEPAGE;
        packageJson.repository = {
            type: 'git',
            url: APP_CONFIG.REPOSITORY
        };
        packageJson.bugs = {
            url: APP_CONFIG.ISSUES
        };
        
        // Escribir package.json actualizado
        fs.writeFileSync(rutaPackageJson, JSON.stringify(packageJson, null, 2), 'utf8');
        console.log(`${UI_CONFIG.EMOJIS.SUCCESS} package.json actualizado con configuración bin`);
        
    } catch (error) {
        console.error(`${UI_CONFIG.EMOJIS.ERROR} Error al actualizar package.json:`, error.message);
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
            console.log(`${UI_CONFIG.EMOJIS.SUCCESS} ${tipo}: ${path.basename(archivo)} creado correctamente`);
        } else {
            console.log(`${UI_CONFIG.EMOJIS.ERROR} ${tipo}: ${path.basename(archivo)} NO ENCONTRADO`);
            todoOk = false;
        }
    });
    
    if (todoOk) {
        console.log(`\n${UI_CONFIG.EMOJIS.ROCKET} ¡Instalación completada exitosamente!`);
        console.log('\n📖 Próximos pasos:');
        
        if (isWindows) {
            console.log(`   1. En PowerShell/CMD: .\\${UI_CONFIG.SHORT_COMMAND} --version`);
            console.log(`   2. Para ayuda: .\\${UI_CONFIG.SHORT_COMMAND} --help`);
            console.log(`   3. Ejemplo: .\\${UI_CONFIG.SHORT_COMMAND} -v -u "https://youtu.be/dQw4w9WgXcQ"`);
        } else {
            console.log(`   1. En terminal: ${UI_CONFIG.SHORT_COMMAND} --version`);
            console.log(`   2. Para ayuda: ${UI_CONFIG.SHORT_COMMAND} --help`); 
            console.log(`   3. Ejemplo: ${UI_CONFIG.SHORT_COMMAND} -v -u "https://youtu.be/dQw4w9WgXcQ"`);
        }
        
        console.log('\n🔧 Comando tradicional sigue disponible:');
        console.log(`   node ${nombreScript} --help`);
        
    } else {
        console.log(`\n${UI_CONFIG.EMOJIS.ERROR} Hubo problemas durante la instalación`);
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
        console.error(`\n💥 Error inesperado durante la instalación:`);
        console.error(error.message);
        console.log('\n🔧 Sugerencias:');
        console.log('   - Verifica que tienes permisos de escritura');
        console.log('   - Asegúrate de estar en el directorio correcto');
        console.log('   - Ejecuta: npm run install-y2');
        process.exit(1);
    }
}

// Ejecutar instalación
main();