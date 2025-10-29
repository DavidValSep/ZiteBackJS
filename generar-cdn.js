#!/usr/bin/env node

/**
 * 🚀 Generador de CDN Personalizado para ZiteBackJS v3.8.0
 * Script para descargar automáticamente solo los archivos ESENCIALES
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generador CDN Personalizado - ZiteBackJS v3.8.0\n');

// SOLO archivos que realmente necesitas subir
const ARCHIVOS_ESENCIALES = [
    {
        nombre: 'Owl Carousel JS',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js',
        destino: 'cdn-backup/owl-carousel/owl.carousel.min.js',
        critico: true,
        razon: 'Siempre falla en CDNs oficiales'
    },
    {
        nombre: 'Owl Carousel CSS',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css',
        destino: 'cdn-backup/owl-carousel/owl.carousel.min.css',
        critico: true,
        razon: 'Siempre falla en CDNs oficiales'
    },
    {
        nombre: 'jQuery YTPlayer JS',
        url: 'https://raw.githubusercontent.com/pupunzi/jquery.mb.YTPlayer/master/src/jquery.mb.YTPlayer.src.js',
        destino: 'cdn-backup/ytplayer/jquery.mb.YTPlayer.min.js',
        critico: false,
        razon: 'Respaldo si GitHub falla'
    }
];

// Archivos que puedes conseguir de otras fuentes (no necesitas descargar)
const ARCHIVOS_ESPECIALES = [
    {
        nombre: 'Font Awesome Pro CSS',
        destino: 'cdn-backup/font-awesome-pro/css/all.min.css',
        critico: true,
        razon: 'Solo si tienes licencia Pro - Debes subir tu propio archivo',
        instruccion: 'Sube tu archivo all.min.css de Font Awesome Pro aquí'
    }
];

/**
 * Crear directorio si no existe
 */
function crearDirectorio(rutaArchivo) {
    const directorio = path.dirname(rutaArchivo);
    if (!fs.existsSync(directorio)) {
        fs.mkdirSync(directorio, { recursive: true });
        console.log(`📁 Creado directorio: ${directorio}`);
    }
}

/**
 * Descargar archivo
 */
function descargarArchivo(url, destino) {
    return new Promise((resolve, reject) => {
        console.log(`📥 Descargando: ${path.basename(destino)}...`);
        
        const archivo = fs.createWriteStream(destino);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(archivo);
                
                archivo.on('finish', () => {
                    archivo.close();
                    const stats = fs.statSync(destino);
                    console.log(`✅ ${path.basename(destino)} - ${(stats.size / 1024).toFixed(1)} KB`);
                    resolve(true);
                });
            } else {
                console.log(`❌ Error ${response.statusCode}: ${path.basename(destino)}`);
                reject(new Error(`HTTP ${response.statusCode}`));
            }
        }).on('error', (error) => {
            console.log(`❌ Error de red: ${error.message}`);
            reject(error);
        });
    });
}

/**
 * Generar estructura del CDN
 */
async function generarCDN() {
    console.log('🎯 Generando SOLO archivos esenciales para tu CDN...\n');
    
    // Crear directorio base
    if (!fs.existsSync('cdn-backup')) {
        fs.mkdirSync('cdn-backup');
        console.log('📁 Creado directorio: cdn-backup\n');
    }
    
    let exitosos = 0;
    let fallidos = 0;
    
    // Descargar archivos esenciales
    console.log('📦 DESCARGANDO ARCHIVOS CRÍTICOS:\n');
    
    for (const archivo of ARCHIVOS_ESENCIALES) {
        try {
            crearDirectorio(archivo.destino);
            await descargarArchivo(archivo.url, archivo.destino);
            exitosos++;
            
            if (archivo.critico) {
                console.log(`   🚨 CRÍTICO: ${archivo.razon}`);
            }
            console.log('');
        } catch (error) {
            console.log(`   ❌ FALLÓ: ${error.message}\n`);
            fallidos++;
        }
    }
    
    // Mostrar archivos especiales
    console.log('🔹 ARCHIVOS ESPECIALES (configuración manual):\n');
    
    for (const archivo of ARCHIVOS_ESPECIALES) {
        crearDirectorio(archivo.destino);
        
        // Crear archivo placeholder
        const contenidoPlaceholder = `/* 
 * ${archivo.nombre}
 * ${archivo.instruccion}
 * 
 * IMPORTANTE: ${archivo.razon}
 */
 
// Este es un archivo placeholder
// Reemplázalo con tu archivo real
`;
        
        fs.writeFileSync(archivo.destino, contenidoPlaceholder);
        console.log(`📝 ${path.basename(archivo.destino)} - Placeholder creado`);
        console.log(`   💡 ${archivo.instruccion}`);
        console.log('');
    }
    
    // Generar archivo README para el CDN
    const readmeCDN = `# 📁 CDN Personalizado - Archivos Esenciales

## 🎯 Estructura Generada

\`\`\`
cdn-backup/
├── owl-carousel/           🚨 CRÍTICO - Subir obligatoriamente
│   ├── owl.carousel.min.js
│   └── owl.carousel.min.css
├── ytplayer/               📦 RESPALDO - Subir si GitHub falla
│   └── jquery.mb.YTPlayer.min.js
└── font-awesome-pro/       💎 PRO - Solo si tienes licencia
    └── css/
        └── all.min.css     (placeholder - reemplazar con tu archivo)
\`\`\`

## 🚀 Instrucciones de Subida

### 1. Subir a tu servidor
\`\`\`bash
# Subir toda la carpeta cdn-backup a:
https://cdn.susitio.cl/libs/

# Resultado final:
https://cdn.susitio.cl/libs/owl-carousel/owl.carousel.min.js
https://cdn.susitio.cl/libs/owl-carousel/owl.carousel.min.css
https://cdn.susitio.cl/libs/ytplayer/jquery.mb.YTPlayer.min.js
https://cdn.susitio.cl/libs/font-awesome-pro/css/all.min.css
\`\`\`

### 2. Configurar Font Awesome Pro (si aplica)
- Reemplaza el placeholder en \`font-awesome-pro/css/all.min.css\`
- Con tu archivo real de Font Awesome Pro
- Solo si tienes licencia Pro

### 3. Verificar funcionamiento
\`\`\`bash
# Probar URLs:
curl -I https://cdn.susitio.cl/libs/owl-carousel/owl.carousel.min.js
curl -I https://cdn.susitio.cl/libs/owl-carousel/owl.carousel.min.css
\`\`\`

## ✅ Archivos que NO necesitas subir

Estos funcionan bien desde CDNs oficiales:
- ❌ animate.css → cdnjs.cloudflare.com funciona perfecto
- ❌ lightbox2 → cdnjs.cloudflare.com funciona perfecto  
- ❌ isotope → unpkg.com funciona perfecto
- ❌ bootstrap → jsdelivr.net funciona perfecto

## 🎯 Resultado

Con solo estos archivos tendrás:
- ✅ Owl Carousel siempre funcional
- ✅ Font Awesome Pro preservado (si aplica)
- ✅ YTPlayer como respaldo
- 🚀 Velocidad máxima (CDNs oficiales para el resto)
- 💰 Costos mínimos en tu CDN
`;
    
    fs.writeFileSync('cdn-backup/README.md', readmeCDN);
    
    // Resumen final
    console.log('📊 RESUMEN:\n');
    console.log(`✅ Archivos descargados: ${exitosos}`);
    console.log(`❌ Archivos fallidos: ${fallidos}`);
    console.log(`📝 Archivos especiales: ${ARCHIVOS_ESPECIALES.length}`);
    console.log('');
    
    console.log('🎯 PRÓXIMOS PASOS:\n');
    console.log('1. 📁 Revisar carpeta "cdn-backup"');
    console.log('2. 💎 Configurar Font Awesome Pro (si aplica)');
    console.log('3. 🚀 Subir contenido a https://cdn.susitio.cl/libs/');
    console.log('4. ✅ Verificar URLs funcionando');
    console.log('');
    
    if (exitosos >= ARCHIVOS_ESENCIALES.filter(a => a.critico).length) {
        console.log('🎉 ¡CDN listo para configurar! Solo archivos esenciales generados.');
    } else {
        console.log('⚠️ Algunos archivos críticos fallaron. Revisa conexión a internet.');
    }
    
    console.log('\n📄 Ver "cdn-backup/README.md" para instrucciones completas');
}

// Ejecutar
console.log('ℹ️ Este script descarga SOLO los archivos que realmente necesitas');
console.log('ℹ️ CDNs oficiales se usarán para el resto (más rápido y eficiente)\n');

generarCDN().catch(console.error);