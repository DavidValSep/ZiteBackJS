#!/usr/bin/env node

/**
 * 🔍 Analizador de Errores CDN v3.9.1.0
 * Construye CDN personalizado basado en errores reales de sitios
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🔍 Analizador de Errores CDN v3.9.1.0 - Basado en Errores Reales\n');

/**
 * Analizar archivo de log de errores
 */
function analizarLogErrores() {
    const archivoLog = 'cdn-errores-log.txt';
    
    if (!fs.existsSync(archivoLog)) {
        console.log('❌ No se encontró archivo de log de errores.');
        console.log('💡 Ejecuta ZiteBackJS en algunos sitios primero para generar el log.\n');
        return {
            errores: [],
            estadisticas: { total: 0, archivos: {}, tipos: {}, dominios: {} }
        };
    }
    
    const contenidoLog = fs.readFileSync(archivoLog, 'utf8');
    const lineas = contenidoLog.split('\n').filter(linea => linea.trim());
    
    const errores = [];
    const estadisticas = {
        total: 0,
        archivos: {},
        tipos: {},
        dominios: {}
    };
    
    for (const linea of lineas) {
        try {
            // Parsear línea: [timestamp] FALLO: archivo | URL: url | Error: error
            const match = linea.match(/\[(.*?)\] FALLO: (.*?) \| URL: (.*?) \| Error: (.*)/);
            
            if (match) {
                const [, timestamp, archivo, url, error] = match;
                
                // Determinar tipo de archivo
                const tipoArchivo = archivo.toLowerCase().includes('.css') ? 'css' : 
                                  archivo.toLowerCase().includes('.js') ? 'js' : 
                                  archivo.toLowerCase().includes('.woff') ? 'font' :
                                  archivo.toLowerCase().includes('.ttf') ? 'font' : 'otro';
                
                // Extraer dominio
                const dominio = new URL(url).hostname;
                
                // Determinar biblioteca
                let biblioteca = 'desconocida';
                const nombreLower = archivo.toLowerCase();
                if (nombreLower.includes('owl') || nombreLower.includes('carousel')) biblioteca = 'owl-carousel';
                else if (nombreLower.includes('font-awesome') || nombreLower.includes('fontawesome')) biblioteca = 'font-awesome';
                else if (nombreLower.includes('bootstrap')) biblioteca = 'bootstrap';
                else if (nombreLower.includes('jquery')) biblioteca = 'jquery';
                else if (nombreLower.includes('animate')) biblioteca = 'animate';
                else if (nombreLower.includes('lightbox')) biblioteca = 'lightbox2';
                else if (nombreLower.includes('swiper')) biblioteca = 'swiper';
                else if (nombreLower.includes('aos')) biblioteca = 'aos';
                else if (nombreLower.includes('isotope')) biblioteca = 'isotope';
                else if (nombreLower.includes('slick')) biblioteca = 'slick';
                
                const errorInfo = {
                    timestamp: new Date(timestamp),
                    archivo,
                    url,
                    error,
                    tipo: tipoArchivo,
                    dominio,
                    biblioteca
                };
                
                errores.push(errorInfo);
                
                // Estadísticas
                estadisticas.total++;
                estadisticas.archivos[archivo] = (estadisticas.archivos[archivo] || 0) + 1;
                estadisticas.tipos[tipoArchivo] = (estadisticas.tipos[tipoArchivo] || 0) + 1;
                estadisticas.dominios[dominio] = (estadisticas.dominios[dominio] || 0) + 1;
            }
        } catch (e) {
            // Ignorar líneas malformadas
        }
    }
    
    return { errores, estadisticas };
}

/**
 * Generar estructura de CDN basada en errores
 */
function generarEstructuraCDN(errores) {
    const estructura = {};
    
    for (const error of errores) {
        const { archivo, biblioteca, tipo } = error;
        
        if (!estructura[biblioteca]) {
            estructura[biblioteca] = {
                css: new Set(),
                js: new Set(),
                font: new Set(),
                otro: new Set()
            };
        }
        
        estructura[biblioteca][tipo].add(archivo);
    }
    
    // Convertir Sets a Arrays
    for (const lib in estructura) {
        for (const tipo in estructura[lib]) {
            estructura[lib][tipo] = Array.from(estructura[lib][tipo]);
        }
    }
    
    return estructura;
}

/**
 * Crear estructura de directorios
 */
function crearEstructuraDirectorios(estructura) {
    const directorioBase = 'cdn-personalizado-real';
    
    if (!fs.existsSync(directorioBase)) {
        fs.mkdirSync(directorioBase, { recursive: true });
    }
    
    console.log('📁 Creando estructura basada en errores reales...\n');
    
    for (const biblioteca in estructura) {
        const info = estructura[biblioteca];
        
        // Crear directorios específicos para cada biblioteca
        const dirBiblioteca = path.join(directorioBase, biblioteca);
        
        if (info.css.length > 0) {
            const dirCSS = path.join(dirBiblioteca, 'css');
            fs.mkdirSync(dirCSS, { recursive: true });
            console.log(`📁 ${biblioteca}/css/ (${info.css.length} archivos CSS faltantes)`);
        }
        
        if (info.js.length > 0) {
            const dirJS = path.join(dirBiblioteca, 'js');
            fs.mkdirSync(dirJS, { recursive: true });
            console.log(`📁 ${biblioteca}/js/ (${info.js.length} archivos JS faltantes)`);
        }
        
        if (info.font.length > 0) {
            const dirFonts = path.join(dirBiblioteca, 'webfonts');
            fs.mkdirSync(dirFonts, { recursive: true });
            console.log(`📁 ${biblioteca}/webfonts/ (${info.font.length} fuentes faltantes)`);
        }
        
        // Font Awesome necesita estructura especial
        if (biblioteca === 'font-awesome') {
            const dirWebfonts = path.join(dirBiblioteca, 'webfonts');
            fs.mkdirSync(dirWebfonts, { recursive: true });
            console.log(`📁 ${biblioteca}/webfonts/ (estructura Font Awesome)`);
        }
    }
    
    return directorioBase;
}

/**
 * Generar reporte de análisis
 */
function generarReporte(errores, estadisticas, estructura) {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const reporte = `# 🔍 Reporte de Análisis CDN - v3.9.1.0
Generado: ${timestamp}

## 📊 Estadísticas Generales

- **Total de errores**: ${estadisticas.total}
- **Archivos únicos con problemas**: ${Object.keys(estadisticas.archivos).length}
- **Tipos de archivo**: ${Object.keys(estadisticas.tipos).length}
- **Dominios problemáticos**: ${Object.keys(estadisticas.dominios).length}

## 🚨 Archivos Más Problemáticos

${Object.entries(estadisticas.archivos)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([archivo, count]) => `- **${archivo}**: ${count} fallos`)
    .join('\n')}

## 🌐 Dominios Más Problemáticos

${Object.entries(estadisticas.dominios)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([dominio, count]) => `- **${dominio}**: ${count} fallos`)
    .join('\n')}

## 📁 Estructura CDN Recomendada

Basado en los errores reales detectados:

\`\`\`
cdn.susitio.cl/libs/
${Object.keys(estructura).map(lib => {
    const info = estructura[lib];
    let dirStructure = `├── ${lib}/\n`;
    if (info.css.length > 0) dirStructure += `│   ├── css/ (${info.css.length} archivos)\n`;
    if (info.js.length > 0) dirStructure += `│   ├── js/ (${info.js.length} archivos)\n`;
    if (info.font.length > 0 || lib === 'font-awesome') dirStructure += `│   └── webfonts/ (fuentes)\n`;
    return dirStructure;
}).join('')}\`\`\`

## 🎯 Archivos Específicos Requeridos

${Object.entries(estructura).map(([lib, info]) => {
    let section = `### ${lib}\n\n`;
    if (info.css.length > 0) {
        section += `**CSS:**\n${info.css.map(f => `- ${f}`).join('\n')}\n\n`;
    }
    if (info.js.length > 0) {
        section += `**JavaScript:**\n${info.js.map(f => `- ${f}`).join('\n')}\n\n`;
    }
    if (info.font.length > 0) {
        section += `**Fuentes:**\n${info.font.map(f => `- ${f}`).join('\n')}\n\n`;
    }
    return section;
}).join('')}

## 🚀 Próximos Pasos

1. **Descargar archivos**: Obtener las versiones más recientes de las bibliotecas problemáticas
2. **Crear estructura**: Usar la estructura de carpetas recomendada arriba
3. **Subir a CDN**: Montar en https://cdn.susitio.cl/libs/ con la estructura exacta
4. **Verificar**: Probar ZiteBackJS v3.9.1.0 en los mismos sitios

## 📋 URLs Finales Requeridas

${Object.entries(estructura).map(([lib, info]) => {
    let urls = `### ${lib}\n\n`;
    if (info.css.length > 0) {
        urls += info.css.map(f => `- https://cdn.susitio.cl/libs/${lib}/css/${f}`).join('\n') + '\n\n';
    }
    if (info.js.length > 0) {
        urls += info.js.map(f => `- https://cdn.susitio.cl/libs/${lib}/js/${f}`).join('\n') + '\n\n';
    }
    if (lib === 'font-awesome') {
        urls += `- https://cdn.susitio.cl/libs/${lib}/webfonts/fa-regular-400.woff2\n`;
        urls += `- https://cdn.susitio.cl/libs/${lib}/webfonts/fa-solid-900.woff2\n`;
        urls += `- https://cdn.susitio.cl/libs/${lib}/webfonts/fa-brands-400.woff2\n\n`;
    }
    return urls;
}).join('')}

---

**Análisis basado en errores reales de sitios web procesados con ZiteBackJS v3.9.1.0**
`;

    fs.writeFileSync('REPORTE-CDN-REAL.md', reporte);
    return reporte;
}

/**
 * Función principal
 */
async function analizarYGenerar() {
    console.log('🎯 Analizando errores reales de CDNs para construir CDN personalizado...\n');
    
    // Analizar log
    console.log('📖 Leyendo log de errores...');
    const { errores, estadisticas } = analizarLogErrores();
    
    if (estadisticas.total === 0) {
        console.log('\n💡 SUGERENCIA: Ejecuta ZiteBackJS en varios sitios primero:');
        console.log('   .\\zb -p -u "https://sitio1.com"');
        console.log('   .\\zb -p -u "https://sitio2.com"');
        console.log('   .\\zb -p -u "https://sitio3.com"');
        console.log('\n   Esto generará el archivo cdn-errores-log.txt con errores reales.');
        return;
    }
    
    console.log(`✅ ${estadisticas.total} errores analizados\n`);
    
    // Generar estructura
    console.log('🏗️ Generando estructura de CDN...');
    const estructura = generarEstructuraCDN(errores);
    
    // Crear directorios
    const directorioBase = crearEstructuraDirectorios(estructura);
    
    // Generar reporte
    console.log('\n📄 Generando reporte detallado...');
    const reporte = generarReporte(errores, estadisticas, estructura);
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DEL ANÁLISIS:\n');
    console.log(`✅ Total errores analizados: ${estadisticas.total}`);
    console.log(`📁 Bibliotecas identificadas: ${Object.keys(estructura).length}`);
    console.log(`🌐 Dominios problemáticos: ${Object.keys(estadisticas.dominios).length}`);
    
    console.log('\n🎯 BIBLIOTECAS MÁS PROBLEMÁTICAS:\n');
    Object.entries(estructura)
        .sort(([,a], [,b]) => (b.css.length + b.js.length + b.font.length) - (a.css.length + a.js.length + a.font.length))
        .slice(0, 5)
        .forEach(([lib, info]) => {
            const total = info.css.length + info.js.length + info.font.length;
            console.log(`🚨 ${lib}: ${total} archivos faltantes`);
        });
    
    console.log('\n🚀 PRÓXIMOS PASOS:\n');
    console.log(`1. 📁 Revisar estructura en "${directorioBase}"`);
    console.log('2. 📄 Leer "REPORTE-CDN-REAL.md" para detalles completos');
    console.log('3. 📥 Descargar archivos de bibliotecas oficiales');
    console.log('4. 🌐 Subir a https://cdn.susitio.cl/libs/ con estructura exacta');
    console.log('5. 🧪 Probar ZiteBackJS en los mismos sitios');
    
    console.log('\n💡 CONSEJO: Este CDN será 100% efectivo porque está basado en errores REALES');
}

// Ejecutar
analizarYGenerar().catch(console.error);