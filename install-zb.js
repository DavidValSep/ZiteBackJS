#!/usr/bin/env node

/**
 * Script de instalación del comando 'zb' para ZiteBackJS
 * Configura el atajo global automáticamente
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

console.log('🚀 ZiteBackJS - Instalación del Comando Corto "zb"\n');

const isWindows = os.platform() === 'win32';
const currentDir = process.cwd();

// Verificar que estamos en el directorio correcto
if (!fs.existsSync(path.join(currentDir, 'ziteback.js'))) {
    console.log('❌ Error: Ejecutar este script desde el directorio de ZiteBackJS');
    console.log('   Debe contener el archivo ziteback.js');
    process.exit(1);
}

console.log('📋 Opciones de instalación:\n');
console.log('1. 🌐 Instalación Global (Recomendada)');
console.log('   - Comando disponible desde cualquier directorio');
console.log('   - Requiere: npm install -g .');
console.log('   - Uso: zb -u https://example.com\n');

console.log('2. 📂 Instalación Local');
console.log('   - Solo disponible en este directorio');
console.log('   - Copia scripts a PATH del sistema');
console.log('   - Uso: zb -u https://example.com (desde cualquier lugar)\n');

// Función para instalación global
async function installGlobal() {
    try {
        console.log('🔄 Instalando ZiteBackJS globalmente...');
        execSync('npm install -g .', { stdio: 'inherit' });
        
        console.log('\n✅ ¡Instalación global completada!');
        console.log('🎉 Ahora puedes usar:');
        console.log('   zb --help');
        console.log('   zb -u https://example.com -w=5');
        console.log('   zb -p -u https://example.com');
        
        return true;
    } catch (error) {
        console.log('❌ Error en instalación global:', error.message);
        console.log('💡 Tal vez necesites permisos de administrador:');
        if (isWindows) {
            console.log('   - Ejecutar PowerShell como Administrador');
        } else {
            console.log('   - Usar: sudo npm install -g .');
        }
        return false;
    }
}

// Función para instalación local
async function installLocal() {
    try {
        console.log('🔄 Configurando instalación local...');
        
        // Obtener directorio de npm global
        let npmPrefix;
        try {
            npmPrefix = execSync('npm config get prefix', { encoding: 'utf8' }).trim();
        } catch (error) {
            throw new Error('No se pudo obtener el directorio de npm');
        }
        
        const binDir = isWindows 
            ? npmPrefix 
            : path.join(npmPrefix, 'bin');
            
        // Crear directorio si no existe
        if (!fs.existsSync(binDir)) {
            fs.mkdirSync(binDir, { recursive: true });
        }
        
        // Copiar scripts apropiados
        if (isWindows) {
            // Crear tanto zb.cmd como zb.bat para máxima compatibilidad
            const targetCmd = path.join(binDir, 'zb.cmd');
            const targetBat = path.join(binDir, 'zb.bat');
            
            fs.copyFileSync(path.join(currentDir, 'zb.cmd'), targetCmd);
            fs.copyFileSync(path.join(currentDir, 'zb.cmd'), targetBat); // Copia como .bat también
            
            console.log(`✅ Copiado: ${targetCmd}`);
            console.log(`✅ Copiado: ${targetBat}`);
            
            // Verificar que el directorio esté en PATH
            const pathEnv = process.env.PATH || '';
            if (!pathEnv.includes(binDir)) {
                console.log(`⚠️  El directorio ${binDir} no está en PATH`);
                console.log('💡 Para usar solo "zb", agrega este directorio a tu PATH:');
                console.log(`   setx PATH "%PATH%;${binDir}"`);
                console.log('   (reinicia PowerShell después)');
            }
        } else {
            const targetScript = path.join(binDir, 'zb');
            fs.copyFileSync(path.join(currentDir, 'zb'), targetScript);
            fs.chmodSync(targetScript, '755');
            console.log(`✅ Copiado: ${targetScript}`);
        }
        
        console.log('\n✅ ¡Instalación local completada!');
        console.log('🎉 Ahora puedes usar:');
        if (isWindows) {
            console.log('   zb --help                                # Si está en PATH');
            console.log('   .\\zb --help                             # Desde directorio actual');
            console.log('   .\\zb -p -u "https://example.com"        # Ejemplo completo');
        } else {
            console.log('   zb --help');
            console.log('   zb -p -u "https://example.com"');
        }
        
        return true;
    } catch (error) {
        console.log('❌ Error en instalación local:', error.message);
        return false;
    }
}

// Script principal
async function main() {
    // Intentar instalación global primero
    console.log('🔄 Intentando instalación global...\n');
    
    const globalSuccess = await installGlobal();
    
    if (!globalSuccess) {
        console.log('\n🔄 Intentando instalación local como alternativa...\n');
        const localSuccess = await installLocal();
        
        if (!localSuccess) {
            console.log('\n❌ No se pudo completar ninguna instalación');
            console.log('📋 Instalación manual:');
            console.log('   1. npm install -g . (como administrador)');
            console.log('   2. O usar: node ziteback.js directamente');
            process.exit(1);
        }
    }
    
    console.log('\n🧪 Prueba la instalación:');
    console.log('   zb --version');
    console.log('   zb --help');
    console.log('\n📚 Documentación completa: README.md');
}

// Ejecutar instalación
main().catch(error => {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
});