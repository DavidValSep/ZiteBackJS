#!/usr/bin/env node

/**
 * 🤖 Detector Automático de CDNs Faltantes v3.9.1
 * Analiza sitios descargados, detecta CDNs rotos y notifica por email
 * 
 * Autor: DavidValSep
 * Email: davidvalsep@gmail.com
 * Licencia: GPL-3.0
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sgMail = require('@sendgrid/mail');

// Cargar variables de entorno
require('dotenv').config();

console.log('🤖 Detector Automático de CDNs Faltantes v3.9.1\n');

// Configuración SendGrid desde archivo de tu configuración
const SENDGRID_CONFIG = {
    apiKey: process.env.SENDGRID_API_KEY || 'your_sendgrid_api_key_here',
    fromEmail: process.env.SENDGRID_FROM || 'noreply@tudominio.com',
    toEmail: process.env.SENDGRID_TO || 'tu-email@gmail.com',
    domain: process.env.SENDGRID_DOMAIN || 'tudominio.com',
    enabled: true
};

// Configurar SendGrid
if (SENDGRID_CONFIG.enabled && SENDGRID_CONFIG.apiKey && SENDGRID_CONFIG.apiKey.startsWith('SG.')) {
    sgMail.setApiKey(SENDGRID_CONFIG.apiKey);
    console.log('✅ SendGrid configurado correctamente');
} else {
    console.log('⚠️ SendGrid no configurado - configura variables de entorno');
}

// CDNs conocidos que ya están en nuestros scripts
const CDNS_CONOCIDOS = [
    'cdnjs.cloudflare.com',
    'cdn.jsdelivr.net',
    'unpkg.com',
    'code.jquery.com',
    'maxcdn.bootstrapcdn.com',
    'stackpath.bootstrapcdn.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'raw.githubusercontent.com'
];

// Archivos conocidos que ya manejamos
const ARCHIVOS_CONOCIDOS = [
    'owl.carousel.min.js',
    'owl.carousel.min.css',
    'bootstrap.min.css',
    'bootstrap.min.js',
    'jquery.min.js',
    'animate.min.css',
    'font-awesome',
    'all.min.css'
];

/**
 * Buscar archivos HTML en directorio sites
 */
function buscarArchivosHTML(directorio = './sites') {
    const archivosHTML = [];
    
    if (!fs.existsSync(directorio)) {
        console.log('❌ Directorio sites/ no encontrado');
        return archivosHTML;
    }
    
    function escanearDirectorio(dir) {
        const elementos = fs.readdirSync(dir);
        
        for (const elemento of elementos) {
            const rutaCompleta = path.join(dir, elemento);
            const stats = fs.statSync(rutaCompleta);
            
            if (stats.isDirectory()) {
                escanearDirectorio(rutaCompleta);
            } else if (elemento.endsWith('.html') || elemento.endsWith('.htm')) {
                archivosHTML.push(rutaCompleta);
            }
        }
    }
    
    escanearDirectorio(directorio);
    return archivosHTML;
}

/**
 * Extraer URLs de CDN de un archivo HTML
 */
function extraerCDNsDeHTML(rutaArchivo) {
    try {
        const contenido = fs.readFileSync(rutaArchivo, 'utf8');
        const cdnsEncontrados = [];
        
        // Patrones para detectar CDNs
        const patronesCDN = [
            /(?:href|src)=["']https?:\/\/(cdnjs\.cloudflare\.com[^"']*)/gi,
            /(?:href|src)=["']https?:\/\/(cdn\.jsdelivr\.net[^"']*)/gi,
            /(?:href|src)=["']https?:\/\/(unpkg\.com[^"']*)/gi,
            /(?:href|src)=["']https?:\/\/(code\.jquery\.com[^"']*)/gi,
            /(?:href|src)=["']https?:\/\/(maxcdn\.bootstrapcdn\.com[^"']*)/gi,
            /(?:href|src)=["']https?:\/\/(stackpath\.bootstrapcdn\.com[^"']*)/gi,
            /(?:href|src)=["']https?:\/\/(fonts\.googleapis\.com[^"']*)/gi,
            /(?:href|src)=["']https?:\/\/(raw\.githubusercontent\.com[^"']*)/gi,
            /(?:href|src)=["']https?:\/\/([^"']*\.(?:cloudflare|jsdelivr|unpkg|github)\.(?:com|net|io)[^"']*)/gi
        ];
        
        for (const patron of patronesCDN) {
            let match;
            while ((match = patron.exec(contenido)) !== null) {
                const urlCompleta = 'https://' + match[1];
                cdnsEncontrados.push({
                    url: urlCompleta,
                    archivo: path.basename(rutaArchivo),
                    rutaArchivo: rutaArchivo
                });
            }
        }
        
        return cdnsEncontrados;
    } catch (error) {
        console.log(`❌ Error leyendo ${rutaArchivo}: ${error.message}`);
        return [];
    }
}

/**
 * Verificar si un CDN está accesible
 */
async function verificarCDN(url, timeout = 10000) {
    try {
        const response = await axios.head(url, { 
            timeout: timeout,
            validateStatus: function (status) {
                return status >= 200 && status < 400; // Aceptar redirects
            }
        });
        return { accesible: true, status: response.status };
    } catch (error) {
        return { 
            accesible: false, 
            error: error.code || error.message,
            status: error.response?.status || 'No response'
        };
    }
}

/**
 * Determinar si un CDN es nuevo (no está en nuestras listas)
 */
function esNuevoCDN(url) {
    const archivo = path.basename(url);
    const dominio = new URL(url).hostname;
    
    // Verificar si el dominio es conocido
    const dominioConocido = CDNS_CONOCIDOS.some(cdn => url.includes(cdn));
    
    // Verificar si el archivo es conocido
    const archivoConocido = ARCHIVOS_CONOCIDOS.some(arch => archivo.includes(arch.replace('.min', '')));
    
    return !dominioConocido || !archivoConocido;
}

/**
 * Enviar notificación por email usando SendGrid
 */
async function enviarNotificacion(cdnsFaltantes, cdnsNuevos) {
    if (!SENDGRID_CONFIG.enabled) {
        console.log('📧 Notificación por email deshabilitada');
        return;
    }
    
    if (!SENDGRID_CONFIG.apiKey || !SENDGRID_CONFIG.apiKey.startsWith('SG.')) {
        console.log('⚠️ Configura SENDGRID_API_KEY para recibir emails');
        return;
    }
    
    const fecha = new Date().toLocaleString('es-ES');
    const totalFaltantes = cdnsFaltantes.length;
    const totalNuevos = cdnsNuevos.length;
    
    if (totalFaltantes === 0 && totalNuevos === 0) {
        console.log('✅ No hay CDNs problemáticos para notificar');
        return;
    }
    
    // Preparar contenido del email...
    let htmlContent = `
    <h2>🤖 Reporte Automático de CDNs - ${fecha}</h2>
    
    <h3>📊 Resumen:</h3>
    <ul>
        <li><strong>CDNs Faltantes:</strong> ${totalFaltantes}</li>
        <li><strong>CDNs Nuevos Detectados:</strong> ${totalNuevos}</li>
    </ul>
    `;
    
    if (cdnsFaltantes.length > 0) {
        htmlContent += `
        <h3>❌ CDNs No Accesibles:</h3>
        <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr style="background-color: #f2f2f2;">
                <th>URL</th>
                <th>Error</th>
                <th>Archivo HTML</th>
            </tr>
        `;
        
        cdnsFaltantes.forEach(cdn => {
            htmlContent += `
            <tr>
                <td><a href="${cdn.url}">${cdn.url}</a></td>
                <td>${cdn.error}</td>
                <td>${cdn.archivo}</td>
            </tr>
            `;
        });
        
        htmlContent += '</table>';
    }
    
    if (cdnsNuevos.length > 0) {
        htmlContent += `
        <h3>🆕 CDNs Nuevos Detectados:</h3>
        <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr style="background-color: #e6f3ff;">
                <th>URL</th>
                <th>Estado</th>
                <th>Archivo HTML</th>
            </tr>
        `;
        
        cdnsNuevos.forEach(cdn => {
            const estado = cdn.accesible ? '✅ Accesible' : '❌ No accesible';
            htmlContent += `
            <tr>
                <td><a href="${cdn.url}">${cdn.url}</a></td>
                <td>${estado}</td>
                <td>${cdn.archivo}</td>
            </tr>
            `;
        });
        
        htmlContent += '</table>';
    }
    
    htmlContent += `
    <hr>
    <p><small>Reporte generado automáticamente por ZiteBackJS v3.9.1</small></p>
    `;
    
    const msg = {
        to: SENDGRID_CONFIG.toEmail,
        from: SENDGRID_CONFIG.fromEmail,
        subject: `🤖 CDNs Detectados: ${totalFaltantes} faltantes, ${totalNuevos} nuevos`,
        html: htmlContent
    };
    
    try {
        await sgMail.send(msg);
        console.log(`📧 Email enviado a ${SENDGRID_CONFIG.toEmail}`);
    } catch (error) {
        console.log(`❌ Error enviando email: ${error.message}`);
        
        // Guardar email en archivo si falla el envío
        const emailBackup = {
            fecha: fecha,
            destinatario: SENDGRID_CONFIG.toEmail,
            asunto: msg.subject,
            contenido: htmlContent,
            error: error.message
        };
        
        fs.writeFileSync('email-backup.json', JSON.stringify(emailBackup, null, 2));
        console.log('📄 Contenido del email guardado en: email-backup.json');
        console.log('💡 Revisa este archivo para ver el reporte que se habría enviado');
    }
}

/**
 * Función principal
 */
async function analizarCDNs() {
    console.log('🔍 Escaneando archivos HTML...');
    
    const archivosHTML = buscarArchivosHTML();
    console.log(`📁 Encontrados ${archivosHTML.length} archivos HTML`);
    
    if (archivosHTML.length === 0) {
        console.log('⚠️ No hay archivos HTML para analizar');
        return;
    }
    
    // Extraer todos los CDNs
    console.log('\n🌐 Extrayendo URLs de CDN...');
    const todosCDNs = [];
    
    for (const archivo of archivosHTML) {
        const cdns = extraerCDNsDeHTML(archivo);
        todosCDNs.push(...cdns);
    }
    
    // Eliminar duplicados
    const cdnsUnicos = todosCDNs.filter((cdn, index, self) => 
        index === self.findIndex(c => c.url === cdn.url)
    );
    
    console.log(`🔗 Encontrados ${cdnsUnicos.length} CDNs únicos`);
    
    if (cdnsUnicos.length === 0) {
        console.log('✅ No se encontraron CDNs para verificar');
        return;
    }
    
    // Verificar accesibilidad
    console.log('\n🔍 Verificando accesibilidad de CDNs...');
    const cdnsFaltantes = [];
    const cdnsNuevos = [];
    
    for (let i = 0; i < cdnsUnicos.length; i++) {
        const cdn = cdnsUnicos[i];
        console.log(`[${i+1}/${cdnsUnicos.length}] Verificando: ${cdn.url.substring(0, 60)}...`);
        
        const resultado = await verificarCDN(cdn.url);
        
        if (!resultado.accesible) {
            cdnsFaltantes.push({
                ...cdn,
                error: resultado.error,
                status: resultado.status
            });
            console.log(`   ❌ No accesible: ${resultado.error}`);
        } else {
            console.log(`   ✅ Accesible (${resultado.status})`);
        }
        
        // Verificar si es nuevo
        if (esNuevoCDN(cdn.url)) {
            cdnsNuevos.push({
                ...cdn,
                accesible: resultado.accesible,
                status: resultado.status
            });
        }
    }
    
    // Mostrar resultados
    console.log('\n📊 RESULTADOS:\n');
    console.log(`✅ CDNs accesibles: ${cdnsUnicos.length - cdnsFaltantes.length}`);
    console.log(`❌ CDNs no accesibles: ${cdnsFaltantes.length}`);
    console.log(`🆕 CDNs nuevos detectados: ${cdnsNuevos.length}`);
    
    // Mostrar CDNs problemáticos
    if (cdnsFaltantes.length > 0) {
        console.log('\n❌ CDNs NO ACCESIBLES:');
        cdnsFaltantes.forEach(cdn => {
            console.log(`   ${cdn.url} - ${cdn.error}`);
        });
    }
    
    // Mostrar CDNs nuevos
    if (cdnsNuevos.length > 0) {
        console.log('\n🆕 CDNs NUEVOS DETECTADOS:');
        cdnsNuevos.forEach(cdn => {
            const estado = cdn.accesible ? '✅' : '❌';
            console.log(`   ${estado} ${cdn.url}`);
        });
    }
    
    // Enviar notificación por email
    await enviarNotificacion(cdnsFaltantes, cdnsNuevos);
    
    // Generar archivo de log
    const logData = {
        fecha: new Date().toISOString(),
        archivosAnalizados: archivosHTML.length,
        cdnsEncontrados: cdnsUnicos.length,
        cdnsFaltantes: cdnsFaltantes,
        cdnsNuevos: cdnsNuevos
    };
    
    fs.writeFileSync('cdn-analysis.json', JSON.stringify(logData, null, 2));
    console.log('\n📄 Log guardado en: cdn-analysis.json');
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    if (cdnsFaltantes.length > 0) {
        console.log('1. 📥 Ejecutar generar-cdn-hibrido.js para descargar respaldos');
        console.log('2. 🚀 Subir archivos faltantes a tu CDN');
    }
    if (cdnsNuevos.length > 0) {
        console.log('3. 📝 Revisar CDNs nuevos y agregarlos a las listas conocidas');
        console.log('4. 🔄 Actualizar scripts generadores si es necesario');
    }
    
    console.log('\n✅ Análisis completado');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    analizarCDNs().catch(error => {
        console.error('❌ Error en análisis:', error.message);
        process.exit(1);
    });
}

module.exports = { analizarCDNs, extraerCDNsDeHTML, verificarCDN };