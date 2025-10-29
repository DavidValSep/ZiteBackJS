#!/usr/bin/env node

/**
 * 🌐 Generador CDN Híbrido v3.9.0 - Sistema Actualizado
 * Crea estructura completa para CDN personal robusto
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🌐 Generador CDN Híbrido v3.9.0 - Sistema Actualizado\n');

// Lista actualizada de bibliotecas esenciales para CDN personal
const BIBLIOTECAS_ESENCIALES = [
    // CRÍTICAS (siempre fallan)
    {
        nombre: 'Owl Carousel JS',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js',
        destino: 'cdn-hibrido/owl-carousel/owl.carousel.min.js',
        prioridad: '🚨 CRÍTICO',
        razon: 'Falla constantemente en CDNs oficiales'
    },
    {
        nombre: 'Owl Carousel CSS',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css',
        destino: 'cdn-hibrido/owl-carousel/owl.carousel.min.css',
        prioridad: '🚨 CRÍTICO',
        razon: 'Falla constantemente en CDNs oficiales'
    },
    
    // POPULARES (respaldo para cuando fallen)
    {
        nombre: 'Bootstrap CSS',
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
        destino: 'cdn-hibrido/bootstrap/bootstrap.min.css',
        prioridad: '📦 POPULAR',
        razon: 'Respaldo para versiones específicas'
    },
    {
        nombre: 'Bootstrap JS',
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
        destino: 'cdn-hibrido/bootstrap/bootstrap.min.js',
        prioridad: '📦 POPULAR',
        razon: 'Respaldo para versiones específicas'
    },
    {
        nombre: 'jQuery',
        url: 'https://code.jquery.com/jquery-3.7.1.min.js',
        destino: 'cdn-hibrido/jquery/jquery.min.js',
        prioridad: '📦 POPULAR',
        razon: 'Base de muchas bibliotecas'
    },
    {
        nombre: 'Font Awesome',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
        destino: 'cdn-hibrido/font-awesome/all.min.css',
        prioridad: '🎨 ICONOS',
        razon: 'Versión gratuita actualizada'
    },
    {
        nombre: 'Animate CSS',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
        destino: 'cdn-hibrido/animate/animate.min.css',
        prioridad: '✨ ANIMACIÓN',
        razon: 'Efectos populares'
    },
    {
        nombre: 'AOS CSS',
        url: 'https://unpkg.com/aos@2.3.1/dist/aos.css',
        destino: 'cdn-hibrido/aos/aos.css',
        prioridad: '🎭 SCROLL',
        razon: 'Animaciones en scroll'
    },
    {
        nombre: 'AOS JS',
        url: 'https://unpkg.com/aos@2.3.1/dist/aos.js',
        destino: 'cdn-hibrido/aos/aos.js',
        prioridad: '🎭 SCROLL',
        razon: 'Animaciones en scroll'
    },
    {
        nombre: 'Swiper CSS',
        url: 'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css',
        destino: 'cdn-hibrido/swiper/swiper-bundle.min.css',
        prioridad: '📱 MÓVIL',
        razon: 'Sliders modernos'
    },
    {
        nombre: 'Swiper JS',
        url: 'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js',
        destino: 'cdn-hibrido/swiper/swiper-bundle.min.js',
        prioridad: '📱 MÓVIL',
        razon: 'Sliders modernos'
    },
    {
        nombre: 'Lightbox2 CSS',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css',
        destino: 'cdn-hibrido/lightbox2/lightbox.min.css',
        prioridad: '🖼️ GALERÍA',
        razon: 'Galerías de imágenes'
    },
    {
        nombre: 'Lightbox2 JS',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js',
        destino: 'cdn-hibrido/lightbox2/lightbox.min.js',
        prioridad: '🖼️ GALERÍA',
        razon: 'Galerías de imágenes'
    },
    {
        nombre: 'Isotope',
        url: 'https://unpkg.com/isotope-layout@3.0.6/dist/isotope.pkgd.min.js',
        destino: 'cdn-hibrido/isotope/isotope.pkgd.min.js',
        prioridad: '🧩 LAYOUT',
        razon: 'Grids filtrados'
    },
    {
        nombre: 'WOW.js',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js',
        destino: 'cdn-hibrido/wow/wow.min.js',
        prioridad: '💫 REVEAL',
        razon: 'Animaciones reveal'
    },
    {
        nombre: 'Slick CSS',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css',
        destino: 'cdn-hibrido/slick/slick.css',
        prioridad: '🎠 CAROUSEL',
        razon: 'Carousels alternativos'
    },
    {
        nombre: 'Slick JS',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js',
        destino: 'cdn-hibrido/slick/slick.min.js',
        prioridad: '🎠 CAROUSEL',
        razon: 'Carousels alternativos'
    }
];

// Archivos especiales que requieren configuración manual
const ARCHIVOS_ESPECIALES = [
    {
        nombre: 'Font Awesome Pro',
        destino: 'cdn-hibrido/font-awesome-pro/css/all.min.css',
        prioridad: '💎 PRO',
        instruccion: 'Subir tu archivo de Font Awesome Pro aquí',
        contenido: `/* Font Awesome Pro CSS - Archivo Manual
 * 
 * INSTRUCCIONES:
 * 1. Descarga tu archivo all.min.css de Font Awesome Pro
 * 2. Reemplaza este archivo con tu versión Pro
 * 3. Mantén la estructura de carpetas
 * 
 * URL Final: https://cdn.susitio.cl/libs/font-awesome-pro/css/all.min.css
 */

/* Placeholder - Reemplazar con archivo Pro real */`
    },
    {
        nombre: 'YTPlayer JS',
        destino: 'cdn-hibrido/ytplayer/jquery.mb.YTPlayer.min.js',
        prioridad: '📺 VIDEO',
        instruccion: 'Se descarga desde GitHub oficial automáticamente',
        url: 'https://raw.githubusercontent.com/pupunzi/jquery.mb.YTPlayer/master/src/jquery.mb.YTPlayer.src.js'
    },
    {
        nombre: 'YTPlayer CSS',
        destino: 'cdn-hibrido/ytplayer/jquery.mb.YTPlayer.min.css',
        prioridad: '📺 VIDEO', 
        instruccion: 'Se descarga desde GitHub oficial automáticamente',
        url: 'https://raw.githubusercontent.com/pupunzi/jquery.mb.YTPlayer/master/src/css/jquery.mb.YTPlayer.min.css'
    }
];

/**
 * Crear directorios necesarios
 */
function crearEstructura() {
    const directorios = [
        'cdn-hibrido/fallback/css',
        'cdn-hibrido/fallback/js',
        'cdn-hibrido/owl-carousel',
        'cdn-hibrido/font-awesome',
        'cdn-hibrido/font-awesome-pro/css',
        'cdn-hibrido/bootstrap',
        'cdn-hibrido/jquery',
        'cdn-hibrido/animate',
        'cdn-hibrido/aos',
        'cdn-hibrido/swiper',
        'cdn-hibrido/lightbox2',
        'cdn-hibrido/isotope',
        'cdn-hibrido/wow',
        'cdn-hibrido/slick',
        'cdn-hibrido/ytplayer'
    ];
    
    directorios.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 ${dir}`);
        }
    });
}

/**
 * Descargar archivo con manejo de errores mejorado
 */
function descargarArchivo(url, destino, nombre) {
    return new Promise((resolve, reject) => {
        console.log(`📥 ${nombre}...`);
        
        const archivo = fs.createWriteStream(destino);
        const modulo = url.startsWith('https:') ? https : require('http');
        
        const request = modulo.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(archivo);
                
                archivo.on('finish', () => {
                    archivo.close();
                    const stats = fs.statSync(destino);
                    const tamaño = (stats.size / 1024).toFixed(1);
                    console.log(`   ✅ ${tamaño} KB`);
                    resolve(true);
                });
            } else if (response.statusCode === 301 || response.statusCode === 302) {
                // Manejar redirecciones
                const nuevaUrl = response.headers.location;
                console.log(`   🔄 Redirigiendo...`);
                descargarArchivo(nuevaUrl, destino, nombre).then(resolve).catch(reject);
            } else {
                console.log(`   ❌ HTTP ${response.statusCode}`);
                reject(new Error(`HTTP ${response.statusCode}`));
            }
        });
        
        request.on('error', (error) => {
            console.log(`   ❌ ${error.message}`);
            reject(error);
        });
        
        request.setTimeout(15000, () => {
            request.destroy();
            console.log(`   ❌ Timeout`);
            reject(new Error('Timeout'));
        });
    });
}

/**
 * Generar CDN híbrido completo
 */
async function generarCDNHibrido() {
    console.log('🎯 Generando CDN Híbrido v3.9.0 con bibliotecas actualizadas...\n');
    
    // Crear estructura
    console.log('📁 Creando estructura de directorios...\n');
    crearEstructura();
    
    let exitosos = 0;
    let fallidos = 0;
    
    // Descargar bibliotecas automáticas
    console.log('\n📦 DESCARGANDO BIBLIOTECAS ESENCIALES:\n');
    
    for (const lib of BIBLIOTECAS_ESENCIALES) {
        try {
            const dir = path.dirname(lib.destino);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            await descargarArchivo(lib.url, lib.destino, lib.nombre);
            console.log(`   ${lib.prioridad} - ${lib.razon}\n`);
            exitosos++;
        } catch (error) {
            console.log(`   ❌ FALLÓ: ${error.message}\n`);
            fallidos++;
        }
    }
    
    // Crear archivos especiales
    console.log('🔹 CONFIGURANDO ARCHIVOS ESPECIALES:\n');
    
    for (const especial of ARCHIVOS_ESPECIALES) {
        const dir = path.dirname(especial.destino);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        if (especial.url) {
            // Descargar desde URL
            try {
                await descargarArchivo(especial.url, especial.destino, especial.nombre);
                console.log(`   ${especial.prioridad} - ${especial.instruccion}\n`);
            } catch (error) {
                console.log(`   ❌ ${especial.nombre}: ${error.message}\n`);
            }
        } else {
            // Crear placeholder
            fs.writeFileSync(especial.destino, especial.contenido || '/* Placeholder */');
            console.log(`📝 ${especial.nombre}`);
            console.log(`   ${especial.prioridad} - ${especial.instruccion}\n`);
        }
    }
    
    // Crear estructura fallback
    console.log('🆘 Creando estructura fallback...\n');
    
    const fallbackReadme = `# 🆘 Fallback Directory

Esta carpeta es para archivos especiales que no están en las bibliotecas estándar.

## Estructura:
- css/: Archivos CSS personalizados
- js/: Archivos JavaScript personalizados

## URL de acceso:
https://cdn.susitio.cl/libs/fallback/css/archivo-personalizado.css
https://cdn.susitio.cl/libs/fallback/js/archivo-personalizado.js

## Uso:
Cuando ZiteBackJS v3.9.0 no encuentra un archivo en bibliotecas conocidas,
intentará buscarlo aquí usando la estructura:
/fallback/[tipo]/[nombre-archivo]
`;
    
    fs.writeFileSync('cdn-hibrido/fallback/README.md', fallbackReadme);
    
    // Generar documentación final
    const docFinal = `# 🌐 CDN Híbrido v3.9.0 - Configuración Completa

## 📊 Resumen de Generación

- ✅ **Bibliotecas descargadas**: ${exitosos}
- ❌ **Fallos**: ${fallidos}
- 📁 **Estructura creada**: Completa
- 🆘 **Fallback configurado**: Sí

## 🚀 Subir a Servidor

### 1. Subir toda la carpeta \`cdn-hibrido\` a:
\`\`\`
https://cdn.susitio.cl/libs/
\`\`\`

### 2. Resultado final:
\`\`\`
https://cdn.susitio.cl/libs/owl-carousel/owl.carousel.min.js    ← CRÍTICO
https://cdn.susitio.cl/libs/bootstrap/bootstrap.min.css        ← POPULAR  
https://cdn.susitio.cl/libs/font-awesome/all.min.css           ← ICONOS
https://cdn.susitio.cl/libs/jquery/jquery.min.js               ← BASE
...y todas las demás bibliotecas
\`\`\`

### 3. Verificar funcionamiento:
\`\`\`bash
curl -I https://cdn.susitio.cl/libs/owl-carousel/owl.carousel.min.js
curl -I https://cdn.susitio.cl/libs/bootstrap/bootstrap.min.css
\`\`\`

## 🔧 Configuración Manual Pendiente

${ARCHIVOS_ESPECIALES.filter(a => a.contenido).map(a => 
`### ${a.nombre}
- **Archivo**: \`${a.destino}\`
- **Acción**: ${a.instruccion}`).join('\n\n')}

## 📈 Cobertura de Bibliotecas

**CRÍTICAS**: Owl Carousel (siempre falla)
**POPULARES**: Bootstrap, jQuery, Font Awesome
**ANIMACIONES**: Animate.css, AOS, WOW
**SLIDERS**: Swiper, Slick
**GALERÍAS**: Lightbox2
**LAYOUTS**: Isotope, Masonry

## 🎯 Próximos Pasos

1. ✅ Subir contenido a servidor
2. 💎 Configurar Font Awesome Pro (si aplica)
3. 🧪 Probar con ZiteBackJS v3.9.0
4. 📊 Monitorear logs de fallos
5. 🔄 Actualizar bibliotecas según necesidad

---

**CDN Híbrido v3.9.0** listo para máxima confiabilidad 🌐✨
`;
    
    fs.writeFileSync('cdn-hibrido/CONFIGURACION.md', docFinal);
    
    // Resumen final
    console.log('📊 RESUMEN FINAL:\n');
    console.log(`✅ Bibliotecas descargadas: ${exitosos}`);
    console.log(`❌ Fallos: ${fallidos}`);
    console.log(`📁 Estructura: Completa`);
    console.log(`🆘 Fallback: Configurado`);
    
    console.log('\n🎯 PRÓXIMOS PASOS:\n');
    console.log('1. 📁 Revisar carpeta "cdn-hibrido"');
    console.log('2. 💎 Configurar Font Awesome Pro (si aplica)');
    console.log('3. 🚀 Subir todo a https://cdn.susitio.cl/libs/');
    console.log('4. 🧪 Probar con ZiteBackJS v3.9.0');
    console.log('5. 📊 Monitorear logs para futuras actualizaciones');
    
    console.log('\n📄 Ver "cdn-hibrido/CONFIGURACION.md" para detalles completos');
    
    if (exitosos >= BIBLIOTECAS_ESENCIALES.length * 0.8) {
        console.log('\n🎉 ¡CDN Híbrido v3.9.0 generado exitosamente!');
        console.log('🌐 Sistema robusto listo para máxima confiabilidad');
    } else {
        console.log('\n⚠️ Algunos archivos fallaron. Verifica conexión y reintenta.');
    }
}

// Ejecutar
console.log('ℹ️ CDN Híbrido v3.9.0: Sistema actualizado con 15+ bibliotecas populares');
console.log('ℹ️ Detección avanzada de errores y respaldos robustos\n');

generarCDNHibrido().catch(console.error);