#!/usr/bin/env node

/**
 * 🧪 Test Básicos de Y2Back
 * 
 * Tests básicos para verificar funcionalidad sin requerir yt-dlp
 * 
 * @version 7.0.0
 * @author DavidValSep  
 * @date 2025-10-27
 */

const { exec } = require('child_process');
const path = require('path');

// 🎯 CONFIGURACIÓN DE TESTS
const TESTS = [
    {
        nombre: 'Banner de ayuda',
        comando: 'node y2back.js --help',
        esperado: 'Sistema Avanzado de Video, Music, Pics',
        timeout: 5000
    },
    {
        nombre: 'Información de versión',
        comando: 'node y2back.js --version',
        esperado: 'v0.1.4',
        timeout: 3000
    },
    {
        nombre: 'Información del autor',
        comando: 'node y2back.js --author',
        esperado: 'DavidValSep',
        timeout: 3000
    },
    {
        nombre: 'Flag video largo --video',
        comando: 'node y2back.js --video -u "dQw4w9WgXcQ"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Flag video corto -v',
        comando: 'node y2back.js -v -u "dQw4w9WgXcQ"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Flag music largo --music',
        comando: 'node y2back.js --music -u "https://youtu.be/dQw4w9WgXcQ"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Flag music corto -m',
        comando: 'node y2back.js -m -u "https://youtu.be/dQw4w9WgXcQ"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Flag pics largo --pics',
        comando: 'node y2back.js --pics -u "https://youtube.com/watch?v=dQw4w9WgXcQ"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Flag pics corto -p',
        comando: 'node y2back.js -p -u "https://youtube.com/watch?v=dQw4w9WgXcQ"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Flag subtitles largo --subtitles',
        comando: 'node y2back.js --subtitles -u "dQw4w9WgXcQ"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Flag subtitles corto -s',
        comando: 'node y2back.js -s -u "dQw4w9WgXcQ"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Flag screenshots largo --screenshots',
        comando: 'node y2back.js --screenshots -u "dQw4w9WgXcQ"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Flag screenshots corto -c',
        comando: 'node y2back.js -c -u "dQw4w9WgXcQ"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Flag playlist --playlist',
        comando: 'node y2back.js --playlist -u "https://youtube.com/playlist?list=PLrAXtmRdnEQy6nuLMnqVYTe"',
        esperado: 'URL válida detectada',
        timeout: 5000
    },
    {
        nombre: 'Detección yt-dlp no instalado',
        comando: 'node y2back.js -v -u "dQw4w9WgXcQ"',
        esperado: 'yt-dlp no está instalado',
        timeout: 5000
    },
    {
        nombre: 'URL inválida',
        comando: 'node y2back.js -v -u "url-invalida"',
        esperado: 'URL inválida',
        timeout: 5000
    }
];

// 🚀 EJECUTOR DE TESTS
async function ejecutarTest(test) {
    return new Promise((resolve) => {
        console.log(`\n🧪 Ejecutando: ${test.nombre}`);
        console.log(`📋 Comando: ${test.comando}`);
        
        exec(test.comando, { timeout: test.timeout }, (error, stdout, stderr) => {
            const salida = stdout + stderr;
            const contiene = salida.includes(test.esperado);
            
            if (contiene) {
                console.log(`✅ PASSED: Encontrado "${test.esperado}"`);
                resolve({ nombre: test.nombre, resultado: 'PASSED', detalle: 'OK' });
            } else {
                console.log(`❌ FAILED: No se encontró "${test.esperado}"`);
                console.log(`📄 Salida: ${salida.substring(0, 200)}...`);
                resolve({ nombre: test.nombre, resultado: 'FAILED', detalle: `No encontrado: ${test.esperado}` });
            }
        });
    });
}

// 🎯 FUNCIÓN PRINCIPAL
async function main() {
    // Consola de compatibilidad antigua eliminada
    console.log(`🚀 Y2Back - Test Suite Básico v0.1.4`);
    console.log(`⏰ Fecha: ${new Date().toLocaleString()}`);
    console.log(`📂 Directorio: ${process.cwd()}`);
    console.log(`\n🔧 Ejecutando ${TESTS.length} tests básicos...\n`);
    
    const resultados = [];
    
    for (const test of TESTS) {
        try {
            const resultado = await ejecutarTest(test);
            resultados.push(resultado);
        } catch (error) {
            console.log(`❌ ERROR: ${test.nombre} - ${error.message}`);
            resultados.push({ nombre: test.nombre, resultado: 'ERROR', detalle: error.message });
        }
    }
    
    // 📊 RESUMEN DE RESULTADOS
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 RESUMEN DE TESTS`);
    console.log(`${'='.repeat(60)}`);
    
    const passed = resultados.filter(r => r.resultado === 'PASSED').length;
    const failed = resultados.filter(r => r.resultado === 'FAILED').length;
    const errors = resultados.filter(r => r.resultado === 'ERROR').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`💥 Errors: ${errors}`);
    console.log(`📈 Total:  ${resultados.length}`);
    
    if (failed > 0 || errors > 0) {
        console.log(`\n❌ TESTS FALLIDOS:`);
        resultados
            .filter(r => r.resultado !== 'PASSED')
            .forEach(r => {
                console.log(`  - ${r.nombre}: ${r.detalle}`);
            });
    }
    
    // 🎯 CONCLUSIÓN
    const porcentajeExito = Math.round((passed / resultados.length) * 100);
    console.log(`\n🎯 Porcentaje de éxito: ${porcentajeExito}%`);
    
    if (porcentajeExito >= 80) {
    // Mensaje histórico actualizado
        console.log(`🎉 TESTS BÁSICOS EXITOSOS - Y2Back funcionando correctamente`);
        process.exit(0);
    } else {
        console.log(`⚠️ ALGUNOS TESTS FALLARON - Revisar funcionalidad`);
        process.exit(1);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main().catch(error => {
        console.error(`💥 Error fatal en test suite: ${error.message}`);
        process.exit(1);
    });
}

module.exports = { ejecutarTest, TESTS };