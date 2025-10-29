#!/usr/bin/env node

/**
 * Script de verificación de requisitos del sistema para ZiteBackJS
 * Verifica Node.js, npm, navegadores y dependencias necesarias
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔍 ZiteBackJS - Verificación de Requisitos del Sistema\n');

let allGood = true;

// Verificar Node.js
console.log('📦 Verificando Node.js...');
const nodeVersion = process.version;
const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
if (nodeMajor >= 18) {
    console.log(`✅ Node.js ${nodeVersion} (Requisito: >= 18.0.0)`);
} else {
    console.log(`❌ Node.js ${nodeVersion} - Se requiere >= 18.0.0`);
    console.log('   📥 Descargar desde: https://nodejs.org/');
    allGood = false;
}

// Verificar npm
console.log('\n📦 Verificando npm...');
try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const npmMajor = parseInt(npmVersion.split('.')[0]);
    if (npmMajor >= 9) {
        console.log(`✅ npm ${npmVersion} (Requisito: >= 9.0.0)`);
    } else {
        console.log(`⚠️  npm ${npmVersion} - Recomendado >= 9.0.0`);
        console.log('   🔄 Actualizar: npm install -g npm@latest');
    }
} catch (error) {
    console.log('❌ npm no encontrado o no funciona');
    allGood = false;
}

// Verificar Puppeteer
console.log('\n🌐 Verificando Puppeteer...');
try {
    const puppeteer = require('puppeteer');
    console.log(`✅ Puppeteer instalado correctamente`);
    
    // Verificar ruta del navegador
    try {
        const browserPath = puppeteer.executablePath();
        if (fs.existsSync(browserPath)) {
            console.log(`✅ Chromium encontrado: ${browserPath}`);
        } else {
            console.log(`❌ Chromium no encontrado en: ${browserPath}`);
            console.log('   🔄 Reinstalar: npm uninstall puppeteer && npm install puppeteer');
            allGood = false;
        }
    } catch (error) {
        console.log('⚠️  No se pudo verificar la ruta del navegador');
    }
} catch (error) {
    console.log('❌ Puppeteer no instalado');
    console.log('   📥 Instalar: npm install puppeteer');
    allGood = false;
}

// Verificar Axios
console.log('\n🌐 Verificando Axios...');
try {
    require('axios');
    console.log('✅ Axios instalado correctamente');
} catch (error) {
    console.log('❌ Axios no instalado');
    console.log('   📥 Instalar: npm install axios');
    allGood = false;
}

// Verificar memoria disponible
console.log('\n💾 Verificando recursos del sistema...');
const totalMem = Math.round(require('os').totalmem() / 1024 / 1024 / 1024);
if (totalMem >= 4) {
    console.log(`✅ RAM disponible: ${totalMem}GB (Requisito: >= 4GB)`);
} else {
    console.log(`⚠️  RAM disponible: ${totalMem}GB - Recomendado >= 4GB para sitios grandes`);
}

// Verificar conectividad
console.log('\n🌍 Verificando conectividad...');
try {
    execSync('ping -c 1 google.com', { stdio: 'ignore', timeout: 5000 });
    console.log('✅ Conexión a Internet disponible');
} catch (error) {
    try {
        execSync('ping -n 1 google.com', { stdio: 'ignore', timeout: 5000 });
        console.log('✅ Conexión a Internet disponible');
    } catch (error2) {
        console.log('⚠️  Sin conexión a Internet - Requerida para descargar sitios');
    }
}

// Prueba rápida de ZiteBackJS
console.log('\n🚀 Verificando ZiteBackJS...');
if (fs.existsSync('./ziteback.js')) {
    console.log('✅ ziteback.js encontrado');
    try {
        execSync('node ziteback.js --version', { stdio: 'ignore' });
        console.log('✅ ZiteBackJS ejecutable correctamente');
    } catch (error) {
        console.log('❌ Error ejecutando ZiteBackJS');
        allGood = false;
    }
} else {
    console.log('❌ ziteback.js no encontrado en el directorio actual');
    allGood = false;
}

// Resultado final
console.log('\n' + '='.repeat(60));
if (allGood) {
    console.log('🎉 ¡Todos los requisitos están satisfechos!');
    console.log('✅ ZiteBackJS está listo para usar');
    
    console.log('\n📊 Información del entorno:');
    console.log(`   🖥️  Sistema: ${require('os').platform()} ${require('os').arch()}`);
    console.log(`   📦 Node.js: ${process.version}`);
    try {
        const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        console.log(`   📦 npm: ${npmVersion}`);
    } catch (error) {}
    console.log(`   💾 RAM: ${totalMem}GB`);
    
    console.log('\n🏗️ Entorno de desarrollo original:');
    console.log('   🖥️  Windows 11/10 + XAMPP');
    console.log('   🐘 PHP 8.2.4 + Apache + MySQL');
    console.log('   📦 Node.js 24.9.0 + npm 11.6.0');
    console.log('   🌐 Puppeteer 24.26.0 + Chromium 141.x');
    
    console.log('\n🚀 Comando de prueba:');
    console.log('   node ziteback.js --help');
} else {
    console.log('⚠️  Algunos requisitos no están satisfechos');
    console.log('📋 Revisa los mensajes anteriores y corrige los problemas');
    console.log('\n📚 Documentación completa:');
    console.log('   https://github.com/zitebackjs/zitebackjs#requisitos');
    process.exit(1);
}
console.log('='.repeat(60));