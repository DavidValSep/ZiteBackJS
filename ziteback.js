
/*
 * ██████████████████████████████████████████████████████████████████████████████
 * █                            ZiteBackJS v5.0.4                              █
 * █                   Sistema de Clonado de Sitios Web Modernos               █
 * ██████████████████████████████████████████████████████████████████████████████
 * 
 * ⚙️ CONFIGURACIÓN GLOBAL:
 *    🕐 TIEMPO_ESPERA_DEFAULT: Tiempo por defecto para --wait (en segundos)
 *       Modifica este valor para cambiar el comportamiento por defecto del sistema
 */

// 🔧 Carga de configuración de entorno (.env)
require('dotenv').config();

const TIEMPO_ESPERA_DEFAULT = 3; // Segundos de espera por defecto para contenido dinámico

/*
 * 📋 INFORMACIÓN DEL PROYECTO:
 *    🎯 Nombre: ZiteBackJS
 *    📊 Versión: 5.0.2
 *    📅 Fecha: 28 de octubre de 2025
 *    👨‍💻 Autor: DavidValSep
 *    📧 Email: davidvalsep@gmail.com
 *    🏢 Distribuidor: SuSitio (https://susitio.cl)
 *    📧 Soporte: info@susitio.cl
 *    📞 WhatsApp: +56 9 3962 0636
 *    
 * 🚀 DESCRIPCIÓN:
 *    🌟 SISTEMA REVOLUCIONARIO DE PROCESAMIENTO UNIVERSAL DE URLs SIN PROTOCOLO 🌟
 *    
 *    Sistema de vanguardia con tecnología avanzada para el procesamiento integral
 *    y universal de URLs sin protocolo, incluyendo soporte completo para:
 *    
 *    🔗 FORMATOS DE URL UNIVERSALES:
 *       • www.dominio.com (detección automática de WWW)
 *       • dominio.com (dominios directos sin WWW)
 *       • subdominio.dominio.com (subdominios complejos)
 *       • localhost (desarrollo local)
 *       • 127.0.0.1 (direcciones IP locales)
 *       • 192.168.x.x (redes privadas)
 *       • dominio.com:8080 (puertos personalizados)
 *       • cualquier-formato-complejo.co.uk (TLDs internacionales)
 *    
 *    🚀 TECNOLOGÍAS DE PROCESAMIENTO AVANZADO:
 *       • Normalización automática inteligente de protocolos HTTP/HTTPS
 *       • Detección automática de arquitecturas WordPress complejas
 *       • Sistema de reconocimiento de recursos multimedia de última generación
 *       • Algoritmos de priorización y optimización de descargas masivas
 *       • Tecnología de mapeo inteligente para corrección automática de rutas
 *       • Procesamiento profesional de rutas amigables y SEO-friendly
 *    
 *    Este breakthrough tecnológico representa un avance significativo en el campo
 *    del web scraping y clonación de sitios, eliminando las limitaciones tradicionales
 *    de procesamiento de URLs y proporcionando una experiencia de usuario sin precedentes.
 *    
 * ⚙️ CARACTERÍSTICAS PRINCIPALES:
 *    ✅ Renderizado completo de JavaScript con Puppeteer
 *    ✅ Modo interactivo para facilidad de uso  
 *    ✅ Soporte para SPA (React, Vue, Angular)
 *    ✅ Descarga automática de recursos (CSS, JS, imágenes)
 *    ✅ Crawling inteligente de sitios completos
 *    ✅ Corrección automática de rutas y protocolos
 *    ✅ CLI completo con banderas largas y cortas
 *    
 * 📝 LICENCIA: GPL-3.0
 * 🔗 REPOSITORIO: https://github.com/zitebackjs/zitebackjs
 * 
 * ██████████████████████████████████████████████████████████████████████████████
 */

// ZiteBackJS v3.1 - Sistema de respaldo y clonado de sitios web modernos
// Sistema avanzado de respaldo, clonado y gestión de sitios web renderizados por JavaScript

let errCount = 0; // Contador global de errores
let totalFilesDownloaded = 0; // Contador global de archivos descargados
let totalPaginas = 0; // Contador de páginas HTML descargadas
let totalRecursosExternos = 0; // Contador de recursos externos descargados
let paginasDescargadas = []; // Array para rastrear páginas descargadas con sus recursos
let url; // URL ingresada por el usuario
let SSL; // Indicador de HTTPS
const sitesDir = 'sites';
const debugMode = false; // Modo debug: true = auto URL, logs activos | false = pregunta URL, logs mínimos
const urlAutomatica = 'https://prium.github.io/Boots4/'; // En modo debug, usar URL automática para pruebas
const VERSION = "5.0.4"; // Versión actual de ZiteBackJS - Sistema Revolucionario + Preloaders + Fuentes + Background Images + YouTube Videos + Multi-idioma + Srcset + Captura Agresiva

// === DECLARACIONES GLOBALES REQUERIDAS ===
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const axios = require('axios');
const readline = require('readline');
const mensajes = require('./ziteback-mensajes.js');
const { obtenerMensaje, IDIOMAS_DISPONIBLES } = require('./ziteback-mensajes-multiidioma.js');

// 📧 Sistema de notificaciones por email
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

// 🔧 SISTEMA DE NOTIFICACIONES POR EMAIL
class NotificadorEmail {
    constructor() {
        this.configurado = false;
        this.tipoServicio = process.env.EMAIL_SERVICE || 'none';
        this.charset = process.env.EMAIL_CHARSET || 'utf-8';
        this.inicializar();
    }

    inicializar() {
        try {
            if (this.tipoServicio === 'sendgrid' && process.env.SENDGRID_API_KEY) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                this.configurado = true;
                console.log('📧 Sistema de notificaciones SendGrid activado');
            } else if (this.tipoServicio === 'phpmailer' && process.env.SMTP_HOST) {
                this.transporter = nodemailer.createTransporter({
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT || 587),
                    secure: process.env.SMTP_PORT === '465',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });
                this.configurado = true;
                console.log('📧 Sistema de notificaciones SMTP activado');
            } else if (this.tipoServicio === 'basic' && process.env.EMAIL_FROM) {
                this.configurado = true;
                console.log('📧 Sistema de notificaciones básico activado');
            }
        } catch (error) {
            console.log('⚠️ Sistema de notificaciones no disponible:', error.message);
        }
    }

    async enviarNotificacion(tipo, datos) {
        if (!this.configurado) return;

        try {
            const asunto = this.generarAsunto(tipo, datos);
            const contenidoHtml = this.generarContenidoHtml(tipo, datos);
            const contenidoTexto = this.generarContenidoTexto(tipo, datos);

            if (this.tipoServicio === 'sendgrid') {
                await this.enviarConSendGrid(asunto, contenidoHtml, contenidoTexto);
            } else if (this.tipoServicio === 'phpmailer') {
                await this.enviarConNodemailer(asunto, contenidoHtml, contenidoTexto);
            }
        } catch (error) {
            console.log('⚠️ No se pudo enviar notificación:', error.message);
        }
    }

    generarAsunto(tipo, datos) {
        const fecha = new Date().toLocaleDateString('es-ES');
        switch (tipo) {
            case 'exito':
                return `✅ ZiteBackJS: Descarga completada - ${datos.sitio} (${fecha})`;
            case 'error':
                return `❌ ZiteBackJS: Error en procesamiento - ${datos.sitio} (${fecha})`;
            case 'cdn-detectado':
                return `🔍 ZiteBackJS: Nuevo CDN problemático detectado (${fecha})`;
            default:
                return `📊 ZiteBackJS: Notificación del sistema (${fecha})`;
        }
    }

    generarContenidoHtml(tipo, datos) {
        const fecha = new Date().toLocaleString('es-ES');
        
        if (tipo === 'exito') {
            return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center;">
                    <h1>✅ Descarga Completada</h1>
                    <p style="margin: 0; opacity: 0.9;">ZiteBackJS v5.0.2 - Procesamiento exitoso</p>
                </div>
                
                <div style="padding: 30px; background: #f8f9fa;">
                    <h2 style="color: #333; margin-top: 0;">📊 Resumen de Descarga</h2>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                        <p><strong>🌐 Sitio:</strong> ${datos.sitio}</p>
                        <p><strong>📁 Carpeta:</strong> ${datos.carpeta}</p>
                        <p><strong>📄 Páginas:</strong> ${datos.paginas || 1}</p>
                        <p><strong>📎 Recursos:</strong> ${datos.recursos || 0}</p>
                        <p><strong>⏱️ Duración:</strong> ${datos.duracion || 'N/A'}</p>
                        <p><strong>🕐 Completado:</strong> ${fecha}</p>
                    </div>
                    
                    <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #0066cc;"><strong>💡 Consejo:</strong> Tu sitio está listo en ./sites/${datos.carpeta}</p>
                    </div>
                </div>
                
                <div style="background: #343a40; color: white; padding: 20px; text-align: center;">
                    <p style="margin: 5px 0;"><strong>ZiteBackJS v5.0.2</strong></p>
                    <p style="margin: 5px 0; opacity: 0.8;">Sistema de clonado web inteligente</p>
                </div>
            </div>
            `;
        } else if (tipo === 'error') {
            return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 20px; text-align: center;">
                    <h1>❌ Error en Procesamiento</h1>
                    <p style="margin: 0; opacity: 0.9;">ZiteBackJS v5.0.2 - Reporte de error</p>
                </div>
                
                <div style="padding: 30px; background: #f8f9fa;">
                    <h2 style="color: #333; margin-top: 0;">⚠️ Detalles del Error</h2>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                        <p><strong>🌐 Sitio:</strong> ${datos.sitio}</p>
                        <p><strong>❌ Error:</strong> ${datos.error}</p>
                        <p><strong>🕐 Ocurrió:</strong> ${fecha}</p>
                        ${datos.detalles ? `<p><strong>📋 Detalles:</strong> ${datos.detalles}</p>` : ''}
                    </div>
                    
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;"><strong>🔧 Sugerencia:</strong> Verifica la URL y tu conexión a internet</p>
                    </div>
                </div>
                
                <div style="background: #343a40; color: white; padding: 20px; text-align: center;">
                    <p style="margin: 5px 0;"><strong>ZiteBackJS v5.0.2</strong></p>
                    <p style="margin: 5px 0; opacity: 0.8;">📧 info@susitio.cl para soporte</p>
                </div>
            </div>
            `;
        }
        
        return `<p>Notificación de ZiteBackJS v5.0.2 - ${fecha}</p>`;
    }

    generarContenidoTexto(tipo, datos) {
        const fecha = new Date().toLocaleString('es-ES');
        
        if (tipo === 'exito') {
            return `
✅ ZiteBackJS v5.0.2 - Descarga Completada

📊 Resumen:
🌐 Sitio: ${datos.sitio}
📁 Carpeta: ${datos.carpeta}
📄 Páginas: ${datos.paginas || 1}
📎 Recursos: ${datos.recursos || 0}
⏱️ Duración: ${datos.duracion || 'N/A'}
🕐 Completado: ${fecha}

💡 Tu sitio está listo en ./sites/${datos.carpeta}

ZiteBackJS v5.0.2 - Sistema de clonado web inteligente
            `;
        } else if (tipo === 'error') {
            return `
❌ ZiteBackJS v5.0.2 - Error en Procesamiento

⚠️ Detalles:
🌐 Sitio: ${datos.sitio}
❌ Error: ${datos.error}
🕐 Ocurrió: ${fecha}
${datos.detalles ? `📋 Detalles: ${datos.detalles}` : ''}

🔧 Verifica la URL y tu conexión a internet

ZiteBackJS v5.0.2
📧 info@susitio.cl para soporte
            `;
        }
        
        return `ZiteBackJS v5.0.2 - Notificación del sistema - ${fecha}`;
    }

    async enviarConSendGrid(asunto, contenidoHtml, contenidoTexto) {
        const mensaje = {
            to: process.env.SENDGRID_TO,
            from: process.env.SENDGRID_FROM,
            subject: asunto,
            html: contenidoHtml,
            text: contenidoTexto
        };
        
        await sgMail.send(mensaje);
    }

    async enviarConNodemailer(asunto, contenidoHtml, contenidoTexto) {
        const mensaje = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: asunto,
            html: contenidoHtml,
            text: contenidoTexto
        };
        
        await this.transporter.sendMail(mensaje);
    }
}

// 📧 Instancia global del notificador
const notificador = new NotificadorEmail();

// ⏰ CONFIGURACIÓN DE TIEMPOS DE ESPERA
const TIEMPO_ESPERA_DINAMICO = 8; // Segundos de espera para contenido dinámico (multiplica * 1000 para milisegundos)

// 🌍 CONFIGURACIÓN DE IDIOMA
const IDIOMA_SISTEMA = 'es'; // Opciones: 'es', 'en', 'fr', 'de', 'map' (español, inglés, francés, alemán, mapudungun)

// === MANEJO DE ARGUMENTOS DE LÍNEA DE COMANDOS ===
const args = process.argv.slice(2);

// === VERIFICACIÓN DE AYUDA TEMPRANA ===
if (args.includes('--help') || args.includes('-h')) {
	const VERSION = "5.0.4"; // Versión consistente con VERSION principal
	
	// Usar 'zb' como comando por defecto en la ayuda
	const commandName = 'zb';
	
	console.log(`
📚 ZiteBackJS v${VERSION} - Ayuda Rápida

Para ver la guía completa y ejemplos, ejecuta: ${commandName}
(sin argumentos para mostrar la documentación completa)

🎯 Comandos Rápidos:
   
   ${commandName} --p                                  # Preguntará la URL y descargará Solo la Página con sus recursos
   ${commandName} --s                                  # Preguntará la URL y descargará el Sitio Completo navegable y con sus recursos
   ${commandName} -p -u="https://ejemplo.com"          # Solo la Página con sus recursos
   ${commandName} -s -u="https://ejemplo.com"          # Sitio Completo navegable y con sus recursos
   ${commandName} -v                                   # Ver versión
   ${commandName} -a                                   # Información del proyecto
   
🎯 Comandos Completos:
   ${commandName} --page                               # Preguntará la URL y descargará Solo la Página con sus recursos
   ${commandName} --site                               # Preguntará la URL y descargará el Sitio Completo navegable y con sus recursos
   ${commandName} --page --url="https://ejemplo.com"   # Solo la Página con sus recursos
   ${commandName} --site --url="https://ejemplo.com"   # Sitio Completo navegable y con sus recursos
   ${commandName} --version                            # Ver versión
   ${commandName} --author                             # Información del proyecto

💡 Alternativa: También puedes usar 'node ziteback.js' en lugar de 'zb'
`);
	process.exit(0);
}

// === EXTRACCIÓN DE PARÁMETROS ===
let urlEspecificada = null;
let MODO_OPERACION = null; // Requerirá especificación explícita
let tiempoEsperaDinamico = TIEMPO_ESPERA_DEFAULT; // Valor por defecto desde configuración

// Buscar URL especificada con --url o -u
const urlArgIndex = args.findIndex(arg => arg.startsWith('--url=') || arg.startsWith('-u='));
const urlSpaceIndex = args.findIndex(arg => arg === '--url' || arg === '-u');

if (urlArgIndex !== -1) {
	urlEspecificada = args[urlArgIndex].split('=')[1];
	if (!urlEspecificada || urlEspecificada.trim() === '') {
		console.error('❌ Error: --url/-u requiere un valor. Ejemplo: --url="https://ejemplo.com" o -u="https://ejemplo.com"');
		process.exit(1);
	}
} else if (urlSpaceIndex !== -1 && args[urlSpaceIndex + 1]) {
	urlEspecificada = args[urlSpaceIndex + 1];
	if (!urlEspecificada || urlEspecificada.trim() === '' || urlEspecificada.startsWith('-')) {
		console.error('❌ Error: --url/-u requiere un valor. Ejemplo: --url "https://ejemplo.com" o -u "https://ejemplo.com"');
		process.exit(1);
	}
}

// Buscar tiempo de espera especificado con --wait o -w
const waitArgIndex = args.findIndex(arg => arg.startsWith('--wait=') || arg.startsWith('-w='));
const waitSpaceIndex = args.findIndex(arg => arg === '--wait' || arg === '-w');

if (waitArgIndex !== -1) {
	const waitValue = args[waitArgIndex].split('=')[1];
	if (!waitValue || isNaN(waitValue) || parseInt(waitValue) < 0) {
		console.error('❌ Error: --wait/-w requiere un número válido de segundos. Ejemplo: --wait=5 o -w=10');
		process.exit(1);
	}
	tiempoEsperaDinamico = parseInt(waitValue);
} else if (waitSpaceIndex !== -1 && args[waitSpaceIndex + 1]) {
	const waitValue = args[waitSpaceIndex + 1];
	if (!waitValue || isNaN(waitValue) || parseInt(waitValue) < 0 || waitValue.startsWith('-')) {
		console.error('❌ Error: --wait/-w requiere un número válido de segundos. Ejemplo: --wait 5 o -w 10');
		process.exit(1);
	}
	tiempoEsperaDinamico = parseInt(waitValue);
}

// Detectar modo de operación
if (args.includes('--page') || args.includes('-p')) {
	MODO_OPERACION = 'page';
} else if (args.includes('--site') || args.includes('-s')) {
	MODO_OPERACION = 'site';
}

// === COMPORTAMIENTO PREDETERMINADO ===
// Si no hay argumentos o solo hay argumentos de configuración sin acción ni modo, mostrar help
const argumentosAccion = args.filter(arg => 
	!arg.startsWith('--url=') && !arg.startsWith('-u=') &&
	!arg.startsWith('--wait=') && !arg.startsWith('-w=') &&
	!arg.includes('--site') && !arg.includes('-s') &&
	!arg.includes('--page') && !arg.includes('-p') &&
	!arg.includes('--wait') && !arg.includes('-w') &&
	!arg.includes('--url') && !arg.includes('-u')
);

// Solo mostrar help si no hay argumentos o si no hay modo ni URL especificada
if (args.length === 0 || (argumentosAccion.length === 0 && !urlEspecificada && !MODO_OPERACION)) {
	console.log(`
🚀 ════════════════════════════════════════════════════════════════
🌐    ZiteBackJS v${VERSION} - Sistema Revolucionario de URLs sin Protocolo    🌐
📚 Guía de Uso - Aprende a usar ZiteBackJS correctamente
🚀 ════════════════════════════════════════════════════════════════

📋 DESCRIPCIÓN:
   Sistema avanzado de respaldo y clonado de sitios web modernos
   con soporte completo para JavaScript y tecnologías actuales.

🎯 USO BÁSICO:
   node ziteback.js [modo] [opciones]

📌 MODOS DE OPERACIÓN:
   --site / -s      Descarga el sitio completo con crawling profundo
                    ├─ Busca y descarga todas las páginas internas
                    ├─ Perfecto para sitios de documentación y blogs
                    └─ Mayor tiempo de procesamiento pero contenido completo

   --page / -p      Descarga únicamente la página especificada con sus recursos
                    ├─ Sin crawling profundo - solo la página principal
                    ├─ Ideal para landing pages y páginas individuales
                    └─ Rápido y eficiente para contenido específico

🛠️  OPCIONES DISPONIBLES:
   --url="URL" / -u="URL"  Especifica la URL a descargar directamente
                          └─ Ejemplo: --url="https://ejemplo.com" o -u="https://ejemplo.com"
   
   --wait=X / -w=X        Tiempo de espera para contenido dinámico (segundos)
                          ├─ Por defecto: 3 segundos (configurable en TIEMPO_ESPERA_DEFAULT)
                          ├─ IMPORTANTE: El valor especificado REEMPLAZA el default (no se suma)
                          ├─ Sitios estáticos: --wait=0 (sin espera)
                          ├─ SPAs modernas: --wait=8-15 (recomendado)
                          ├─ Backend lento: --wait=20+ (renderizado lento)
                          └─ Ejemplo: --wait=5 o -w=10
   
   -v, --version          Muestra la versión y termina
   -h, --help             Muestra esta ayuda detallada
   -a, --author           Información del autor y proyecto

📚 EJEMPLOS PRÁCTICOS:

   🔹 Clonar sitio completo (interactivo):
      node ziteback.js --site  ó  node ziteback.js -s
      
   🔹 Clonar sitio completo (automático):
      node ziteback.js --site --url="https://ejemplo.com"  ó  node ziteback.js -s -u="https://ejemplo.com"
      
   🔹 Descargar página única (interactivo):
      node ziteback.js --page  ó  node ziteback.js -p
      
   🔹 Descargar página única (automático):
      node ziteback.js --page --url="https://ejemplo.com/pagina.html"  ó  node ziteback.js -p -u="https://ejemplo.com/pagina.html"
      
   🔹 Con tiempo de espera personalizado:
      node ziteback.js -p -u="https://ejemplo.com" --wait=5  ó  node ziteback.js -s -u="https://spa.com" -w=15
      
   🔹 Comportamiento predeterminado (sitio completo):
      node ziteback.js --url="https://ejemplo.com"  ó  node ziteback.js -u="https://ejemplo.com"

💡 CONSEJOS:
   • Usa --page/-p para páginas individuales (más rápido)
   • Usa --site/-s para sitios completos (más contenido)
   • Combina con --url/-u para automatización
   • Usa --wait=0 para sitios estáticos (HTML completo)
   • Usa --wait=15+ para SPAs complejas o backend lento
   • Valor por defecto: 3 segundos (modificable en variable TIEMPO_ESPERA_DEFAULT)
   • IMPORTANTE: --wait=X reemplaza completamente el valor default (no se suma)
   • El modo --site es el predeterminado si no especificas

🆘 SOPORTE:
   Para más información usa: node ziteback.js --author
`);
	process.exit(0);
}

// === VALIDACIÓN Y MODO INTERACTIVO ===
// Si hay URL especificada pero no hay modo definido, mostrar error
if (urlEspecificada && !MODO_OPERACION) {
	console.error(`
❌ Error: Debe especificar el tipo de descarga

🎯 Opciones disponibles:
   --page / -p    Solo la página con sus recursos
   --site / -s    Sitio completo navegable con sus recursos

📚 Para más información: node ziteback.js --help
`);
	process.exit(1);
}

// === MODO INTERACTIVO ===
// Si hay modo pero no hay URL, solicitar URL interactivamente
if (MODO_OPERACION && !urlEspecificada) {
	const readline = require('readline');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const modoTexto = MODO_OPERACION === 'page' ? 'Página Única' : 'Sitio Completo';
	const deepCrawlTexto = MODO_OPERACION === 'site' ? 'habilitado' : 'deshabilitado';
	const modoDescripcion = MODO_OPERACION === 'page'
		? 'Solo descargará la página específica con sus recursos'
		: 'Realizará crawling profundo descargando todas las páginas internas';

	console.log(`
🚀 ════════════════════════════════════════════════════════════════
🌐     ZiteBackJS v3.1 - Modo Interactivo Activado    🌐
📋 Modo seleccionado: ${modoTexto} | Deep crawling ${deepCrawlTexto}
💡       ${modoDescripcion}
🚀 ════════════════════════════════════════════════════════════════

`);	rl.question('🔗 Por favor, ingresa la URL del sitio web a procesar: ', (url) => {
		rl.close();
		
		if (!url || url.trim() === '') {
			console.error('❌ Error: Debe proporcionar una URL válida');
			process.exit(1);
		}
		
		urlEspecificada = url.trim();
		
		// Procesar URL sin protocolo si es necesario
		if (!urlEspecificada.startsWith('http://') && !urlEspecificada.startsWith('https://')) {
			// Lógica simple para agregar protocolo
			if (urlEspecificada.startsWith('localhost') || /^\d+\.\d+\.\d+\.\d+/.test(urlEspecificada)) {
				urlEspecificada = 'http://' + urlEspecificada;
			} else {
				urlEspecificada = 'https://' + urlEspecificada;
			}
		}
		
		// Validar URL básica
		try {
			new URL(urlEspecificada);
			console.log(`✅ URL válida recibida: ${urlEspecificada}`);
			console.log(`🎯 Iniciando procesamiento en modo ${modoTexto}...`);
			
			// Continuar con el procesamiento normal
			iniciarProcesamiento();
		} catch (error) {
			console.error(`❌ Error: La URL ingresada no es válida: ${urlEspecificada}`);
			process.exit(1);
		}
	});
	
	// Salir aquí para esperar la entrada del usuario
	return;
}

// === VALIDACIONES DE INFORMACIÓN ===
if (args.includes('--version') || args.includes('-v')) {
	console.log(`🚀 ZiteBackJS v${VERSION} - Sistema Revolucionario + Preloaders + Recursos Completos`);
	console.log(`✨ NUEVA FUNCIONALIDAD: Procesamiento Universal de URLs sin Protocolo`);
	console.log(`🔧 NUEVA FUNCIONALIDAD: Corrección Automática de Preloaders Rotos`);
	console.log(`🔤 NUEVA FUNCIONALIDAD: Detección y Corrección Automática de Fuentes`);
	console.log(`📦 NUEVA FUNCIONALIDAD: Descarga Completa de Recursos CSS (Fuentes, Imágenes, etc.)`);
	console.log(`💡 PRELOADER MEJORADO: Click en cualquier zona opaca para cerrar`);
	console.log(`🎨 FONT AWESOME: Se mantienen archivos Pro originales (no CDN)`);
	console.log(`🔗 Soporta: www.dominio.com, dominio.com, localhost, IPs, puertos personalizados`);
	process.exit(0);
}

if (args.includes('--author') || args.includes('-a')) {
	console.log(`
🎯 ZiteBackJS v${VERSION} - Información del Proyecto
✨ NUEVA FUNCIONALIDAD: Sistema Revolucionario de URLs sin Protocolo ✨

   👨‍💻 Autor: DavidValSep
   📧 Correo Electrónico del Autor: davidvalsep@gmail.com
   🏢 Distribución:
      -🏢 Distribuidor: SuSitio
      -🌐 Sitio Web: https://susitio.cl
      -📧 Distribución: Sistema de Código Abierto
      -🌐 Web del Sistema: https://github.com/zitebackjs
   📧 Soporte:
      -🛠️ Repositorio: Disponible a través del repositorio GitHub
      -📧 Correo Electrónico: info@susitio.cl
      -📞 WhatsApp: +56 9 3962 0636
   📝 Licencia: MIT License
   🛠️ Repositorio: Disponible para contribuciones y mejoras

   🚀 Sistema revolucionario de procesamiento universal de URLs sin protocolo
      -🌐 Navegador automatizado con Puppeteer quien espera
	      su renderizado completo sobre todo para sitios web modernos
		  que no utilizan solo HTML estático.
      -📱 Soporte completo para JavaScript y tecnologías modernas
      -🎯 Crawling inteligente de páginas internas
      -💾 Descarga completa de recursos (CSS, JS, imágenes)
      -🔧 Corrección automática de rutas y protocolos
      -✨ NUEVO: Procesamiento universal de URLs sin protocolo (www.dominio.com, dominio.com, localhost, IPs)

   📋 Descripción del Sistema:
      ZiteBackJS es un sistema avanzado para clonar y respaldar
      sitios web modernos que usan JavaScript dinámico, AJAX y
      contenido generado en el cliente. Utiliza Puppeteer para
      renderizar páginas como un navegador real y garantizar
      que todo el contenido dinámico sea capturado correctamente.

   🎯 Casos de Uso:
      • Respaldo de sitios web dinámicos
      • Archivado de contenido web para análisis offline
      • Migración de sitios web legacy
      • Documentación y preservación digital
      • Testing de contenido renderizado

   📊 Características Técnicas:
      • Motor: Node.js + Puppeteer
      • Compatibilidad: Sitios SPA, React, Vue, Angular
      • Recursos: CSS, JavaScript, Imágenes, Fuentes
      • Navegación: Enlaces internos automáticos
      • Configuración: Modo página única o sitio completo
`);
	process.exit(0);
}

// === FUNCIÓN PRINCIPAL DE PROCESAMIENTO ===
async function iniciarProcesamiento() {
// === CONFIGURACIÓN DEEP CRAWLING ===
// El crawling profundo depende del modo de operación
const DEEP_CRAWL = (MODO_OPERACION === 'site'); // true para --site, false para --page
const MAX_PAGINAS_INTERNAS = 20; // Máximo número de páginas internas a procesar
console.log('🚀 [DEBUG] Configuración básica completada...');

// Array global para almacenar información de fuentes encontradas
const fuentesDetectadas = [];

// Lista global de dominios de redes sociales y servicios que NO debemos descargar
const dominiosExcluidos = [
	// Redes Sociales
	'facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.me', 'www.fb.me',
	'twitter.com', 'www.twitter.com', 'x.com', 'www.x.com', 't.co',
	'instagram.com', 'www.instagram.com', 'instagr.am',
	'linkedin.com', 'www.linkedin.com', 'lnkd.in',
	'youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com',
	'tiktok.com', 'www.tiktok.com', 'vm.tiktok.com',
	'pinterest.com', 'www.pinterest.com', 'pin.it',
	'snapchat.com', 'www.snapchat.com',
	'whatsapp.com', 'www.whatsapp.com', 'wa.me',
	'telegram.org', 'www.telegram.org', 't.me',
	'discord.com', 'www.discord.com', 'discord.gg',
	'reddit.com', 'www.reddit.com', 'redd.it',
	'twitch.tv', 'www.twitch.tv',
	
	// Google Services
	'googletagmanager.com', 'www.googletagmanager.com',
	'googleanalytics.com', 'www.googleanalytics.com',
	'doubleclick.net', 'www.doubleclick.net',
	'maps.googleapis.com', 'googlemaps.com', 'maps.google.com',
	'ajax.googleapis.com', 'www.ajax.googleapis.com',
	'fonts.googleapis.com', 'fonts.gstatic.com',
	'google.com', 'www.google.com', 'goo.gl',
	'google.com/fonts', 'googleapi', 'webfont.js',
	'analytics.google.com', 'tagmanager.google.com',
	
	// CDNs y Servicios de Hosting
	'cdn.tailwindcss.com', 'tailwindcss.com',
	'cdn.jsdelivr.net', 'jsdelivr.net',
	'cdnjs.cloudflare.com', 'cloudflare.com',
	'unpkg.com', 'www.unpkg.com',
	'maxcdn.bootstrapcdn.com', 'bootstrapcdn.com',
	'stackpath.bootstrapcdn.com', 'stackpath.com',
	'code.jquery.com', 'jquery.com',
	'ajax.aspnetcdn.com', 'aspnetcdn.com',
	'use.fontawesome.com', 'fontawesome.com',
	'kit.fontawesome.com', 'pro.fontawesome.com',
	'polyfill.io', 'cdn.polyfill.io',
	'rawgit.com', 'cdn.rawgit.com',
	'gitcdn.xyz', 'combinatronics.com',
	'statically.io', 'cdn.statically.io',
	'fastly.com', 'fastly.jsdelivr.net',
	
	// Microsoft CDNs
	'ajax.microsoft.com', 'ajax.aspnetcdn.com',
	'microsoft.com', 'msecnd.net',
	
	// Amazon/AWS
	'amazonaws.com', 'd3js.org',
	'cloudfront.net',
	
	// Analytics y Tracking
	'google-analytics.com', 'googleadservices.com',
	'googlesyndication.com', 'googleoptimize.com',
	'hotjar.com', 'static.hotjar.com',
	'mixpanel.com', 'api.mixpanel.com',
	'segment.com', 'cdn.segment.com',
	'amplitude.com', 'api.amplitude.com',
	'intercom.io', 'widget.intercom.io',
	'zendesk.com', 'assets.zendesk.com',
	'freshworks.com', 'freshchat.com',
	'pusher.com', 'js.pusher.com',
	'crisp.chat', 'client.crisp.chat',
	
	// Mapas y Geolocalización
	'mapbox.com', 'api.mapbox.com',
	'openstreetmap.org', 'tile.openstreetmap.org',
	'leafletjs.com', 'unpkg.com/leaflet',
	
	// Pagos y E-commerce
	'stripe.com', 'js.stripe.com',
	'paypal.com', 'www.paypalobjects.com',
	'square.com', 'js.squareup.com',
	'shopify.com', 'cdn.shopify.com',
	
	// Otros servicios comunes
	'recaptcha.net', 'www.recaptcha.net',
	'gstatic.com', 'ssl.gstatic.com',
	'typekit.net', 'use.typekit.net',
	'adobe.com', 'typekit.com',
	'vimeo.com', 'player.vimeo.com',
	'dailymotion.com', 'www.dailymotion.com'
];
console.log('🚀 [DEBUG] Lista de dominios excluidos completada...');
console.log('🔍 [DEBUG] Continuando con declaración de funciones...');

// === FUNCIONES AUXILIARES PARA FUENTES ===

// Función para formatear CSS minificado para mejor procesamiento
function formatearCssMinificado(contenidoCss) {
	// Agregar saltos de línea después de ; para separar reglas
	let formateado = contenidoCss.replace(/;/g, ';\n');
	// Agregar saltos de línea después de } para separar bloques
	formateado = formateado.replace(/}/g, '}\n');
	// Agregar saltos de línea antes de @font-face
	formateado = formateado.replace(/@font-face/g, '\n@font-face');
	// Agregar saltos de línea antes de @media
	formateado = formateado.replace(/@media/g, '\n@media');
	return formateado;
}

// Función para calcular la URL base desde una URL de CSS
function calcularUrlBaseDesdeCss(urlCss, rutaRelativa) {
	try {
		const urlObj = new URL(urlCss);
		let urlBase = urlObj.origin;
		
		// Obtener el directorio del archivo CSS (sin el nombre del archivo)
		const pathSegments = urlObj.pathname.split('/').slice(0, -1);
		
		// Procesar la ruta relativa
		const segmentosRuta = rutaRelativa.split('/').filter(seg => seg !== '' && seg !== '.');
		let directorioActual = [...pathSegments];
		
		for (const segmento of segmentosRuta) {
			if (segmento === '..') {
				// Subir un nivel - remover el último directorio
				if (directorioActual.length > 0) {
					directorioActual.pop();
				}
			} else {
				// Agregar al directorio actual
				directorioActual.push(segmento);
			}
		}
		
		// Construir la URL final
		const rutaCompleta = directorioActual.join('/');
		return urlBase + (rutaCompleta.startsWith('/') ? rutaCompleta : '/' + rutaCompleta);
	} catch (e) {
		console.warn(`⚠️ Error calculando URL base: ${e.message}`);
		return null;
	}
}

// Función para calcular la ruta local donde guardar la fuente
function calcularRutaLocalFuente(urlCss, rutaRelativa, siteName) {
	try {
		const urlObj = new URL(urlCss);
		
		// Obtener el directorio del archivo CSS relativo al dominio
		const cssPathSegments = urlObj.pathname.split('/').slice(0, -1);
		
		// Procesar la ruta relativa de la fuente
		const segmentosRuta = rutaRelativa.split('/').filter(seg => seg !== '' && seg !== '.');
		let directorioActual = [...cssPathSegments];
		
		for (const segmento of segmentosRuta) {
			if (segmento === '..') {
				// Subir un nivel - remover el último directorio
				if (directorioActual.length > 0) {
					directorioActual.pop();
				}
			} else {
				// Agregar al directorio actual (excepto si es el nombre del archivo)
				if (segmento.includes('.')) {
					// Es el nombre del archivo, no lo agregamos al directorio
					break;
				} else {
					directorioActual.push(segmento);
				}
			}
		}
		
		// Obtener el nombre del archivo
		const nombreArchivo = rutaRelativa.split('/').pop().split('?')[0].split('#')[0];
		
		// Construir la ruta local manteniendo la estructura relativa
		const rutaDirectorio = directorioActual.slice(1).join('/'); // Remover la primera barra
		const rutaLocal = path.join('sites', siteName, rutaDirectorio, nombreArchivo);
		
		return rutaLocal.replace(/\\/g, '/'); // Normalizar barras para consistencia
	} catch (e) {
		console.warn(`⚠️ Error calculando ruta local: ${e.message}`);
		// Fallback: usar ruta simple
		const nombreArchivo = rutaRelativa.split('/').pop().split('?')[0].split('#')[0];
		return path.join('sites', siteName, 'fonts', nombreArchivo).replace(/\\/g, '/');
	}
}

// Función para detectar si una URL es de fuente
function esFuenteUrl(url) {
	const extensionesFuentes = ['.woff2', '.woff', '.ttf', '.otf', '.eot', '.svg'];
	const urlLimpia = url.split('?')[0].toLowerCase();
	
	// Excluir Google Fonts y otros CDNs externos
	const cdnsExternos = [
		'fonts.googleapis.com',
		'fonts.gstatic.com',
		'font.google.com',
		'googlefonts.com',
		'use.fontawesome.com',
		'kit.fontawesome.com',
		'pro.fontawesome.com',
		'cdn.jsdelivr.net',
		'cdnjs.cloudflare.com',
		'unpkg.com'
	];
	
	// Si es de un CDN externo, no descargar
	if (cdnsExternos.some(cdn => url.includes(cdn))) {
		return false;
	}
	
	return extensionesFuentes.some(ext => urlLimpia.endsWith(ext));
}

// Función para descargar todas las fuentes detectadas
async function descargarFuentesDetectadas() {
	if (fuentesDetectadas.length === 0) {
		return;
	}

	console.log(`🔤 Descargando ${fuentesDetectadas.length} fuentes detectadas...`);
	
	let fuentesDescargadas = 0;
	let fuentesError = 0;

	for (const fuente of fuentesDetectadas) {
		try {
			// Calcular la URL completa de la fuente
			let urlCompleta = calcularUrlBaseDesdeCss(fuente.urlCss, fuente.rutaRelativa);
			
			if (!urlCompleta) {
				console.warn(`⚠️ No se pudo calcular URL para fuente: ${fuente.rutaRelativa}`);
				fuentesError++;
				continue;
			}

			// Lista de URLs alternativas para intentar
			const urlsAIntentar = [urlCompleta];
			
			// Si es Font Awesome y usa /fonts/, también intentar /webfonts/
			if (fuente.rutaRelativa.includes('fa-') && urlCompleta.includes('/fonts/')) {
				const urlWebfonts = urlCompleta.replace('/fonts/', '/webfonts/');
				urlsAIntentar.push(urlWebfonts);
			}
			
			// Si es Font Awesome y usa /webfonts/, también intentar /fonts/
			if (fuente.rutaRelativa.includes('fa-') && urlCompleta.includes('/webfonts/')) {
				const urlFonts = urlCompleta.replace('/webfonts/', '/fonts/');
				urlsAIntentar.push(urlFonts);
			}

			// Calcular la ruta local donde guardar la fuente usando la nueva función
			let rutaLocal = calcularRutaLocalFuente(fuente.urlCss, fuente.rutaRelativa, fuente.siteName);
			
			// Limpiar caracteres especiales de Windows del nombre del archivo
			const nombreArchivo = path.basename(rutaLocal);
			const nombreLimpio = nombreArchivo.replace(/[?#]/g, '').split('?')[0].split('#')[0];
			rutaLocal = path.join(path.dirname(rutaLocal), nombreLimpio);
			
			const directorioLocal = path.dirname(rutaLocal);
			
			// Crear directorio si no existe
			fs.mkdirSync(directorioLocal, { recursive: true });
			
			// Verificar si ya existe
			if (fs.existsSync(rutaLocal)) {
				continue;
			}

			// Intentar descargar de cada URL alternativa
			let descargaExitosa = false;
			let ultimoError = null;
			
			for (const urlIntento of urlsAIntentar) {
				try {
					console.log(`🔍 [FONT] Intentando descargar: ${urlIntento}`);
					
					const response = await axios.get(urlIntento, {
						responseType: 'arraybuffer',
						timeout: 30000,
						headers: {
							'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
						}
					});

					// Guardar archivo
					fs.writeFileSync(rutaLocal, response.data);
					fuentesDescargadas++;
					descargaExitosa = true;
					console.log(`✅ [FONT] Descargada exitosamente: ${path.basename(rutaLocal)}`);
					break; // Salir del bucle si la descarga fue exitosa
					
				} catch (error) {
					ultimoError = error;
					console.log(`❌ [FONT] Error con ${urlIntento}: ${error.message}`);
					continue; // Intentar con la siguiente URL
				}
			}
			
			// Si ninguna URL funcionó, contar como error
			if (!descargaExitosa) {
				fuentesError++;
				console.warn(`⚠️ No se pudo descargar fuente: ${fuente.rutaRelativa} - ${ultimoError?.message || 'Todas las URLs fallaron'}`);
			}
			
			if (debugMode) {
				console.log(`📝 Fuente descargada: ${path.basename(rutaLocal)}`);
			}

		} catch (error) {
			fuentesError++;
			if (debugMode) {
				console.warn(`⚠️ Error descargando fuente ${fuente.rutaRelativa}: ${error.message}`);
			}
		}
	}

	if (fuentesDescargadas > 0) {
		console.log(`✅ ${fuentesDescargadas} fuentes descargadas correctamente.`);
	}
	if (fuentesError > 0) {
		console.log(`⚠️ ${fuentesError} fuentes no pudieron descargarse.`);
	}
	
	// Limpiar array para próxima ejecución
	fuentesDetectadas.length = 0;
}

console.log('🔍 [DEBUG] Continuando con declaración de funciones...');

function logErrorToFile(errorText, isFileError = false, statusCode = null) {
	if (!debugMode && !isFileError) return; // Solo log errores de archivo si debugMode es false
	
	const logFile = 'ziteback.log';
	const now = new Date().toISOString().replace('T', ' ').replace(/\..+/, '');
	const separator = '\n====================\n';
	
	let logEntry;
	if (isFileError && statusCode) {
		// Formato simplificado para errores HTTP
		const prefix = `[ARCHIVO NO DESCARGADO][CODE ${statusCode}] `;
		// Extraer solo la URL del error, sin stack trace
		const urlMatch = errorText.match(/https?:\/\/[^\s)]+/);
		const url = urlMatch ? urlMatch[0] : 'URL no encontrada';
		logEntry = `[${now}] ${prefix}\nDescarga recurso (${url}):${separator}`;
	} else if (isFileError) {
		// Formato para otros errores de archivo
		const prefix = '[ARCHIVO NO DESCARGADO] ';
		logEntry = `[${now}] ${prefix}\n${errorText}${separator}`;
	} else {
		// Formato simplificado para errores 404 de páginas internas
		if (errorText.includes('404') && errorText.includes('página interna')) {
			const urlMatch = errorText.match(/https?:\/\/[^\s)]+/);
			const url = urlMatch ? urlMatch[0] : 'URL no encontrada';
			logEntry = `[${now}] \nError en página interna (${url}):\nError 404 - Página no encontrada${separator}`;
		} else {
			// Otros errores del sistema mantienen formato original
			logEntry = `[${now}] \n${errorText}${separator}`;
		}
	}
	
	let prev = '';
	try {
		prev = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';
	} catch {}
	fs.writeFileSync(logFile, logEntry + prev, 'utf8');
}

// Nueva función: Verificar si el contenido descargado es válido (no es página 404)
function esContenidoValido(html, url) {
	if (!html || html.length < 500) { // Contenido muy corto probablemente es error
		return false;
	}
	
	// Detectar indicadores comunes de páginas 404
	const indicadores404 = [
		'404', 'not found', 'página no encontrada', 'page not found',
		'error 404', 'file not found', 'does not exist',
		'página no existe', 'this page doesn\'t exist',
		'github.io/404', 'the site configured at this address does not',
		'repository not found', 'repositorio no encontrado'
	];
	
	const htmlLower = html.toLowerCase();
	const tiene404 = indicadores404.some(indicador => htmlLower.includes(indicador));
	
	if (tiene404) {
		console.warn(`⚠️  Página 404 detectada: ${url}`);
		return false;
	}
	
	// Verificar que tenga contenido HTML válido básico
	const tieneEstructuraHTML = htmlLower.includes('<html') && 
								htmlLower.includes('<body') && 
								htmlLower.includes('</body>') && 
								htmlLower.includes('</html>');
	
	if (!tieneEstructuraHTML) {
		console.warn(`⚠️  Contenido HTML inválido: ${url}`);
		return false;
	}
	
	return true;
}

// Nueva función: Extraer enlaces internos de una página HTML
function extraerEnlacesInternos(html, urlBase, dominioBase) {
	const enlaces = new Set();
	const urlObj = new URL(urlBase);
	const dominioCompleto = urlObj.hostname;
	
	if (debugMode) {
		console.log(`🔧 [DEBUG] Extrayendo enlaces de: ${urlBase}`);
		console.log(`🔧 [DEBUG] Dominio base: ${dominioCompleto}`);
		console.log(`🔧 [DEBUG] Ruta base: ${urlObj.pathname}`);
	}
	
	// === MEJORA v3.0: Patrones mejorados para encontrar enlaces ===
	// Incluir más tipos de enlaces y generados dinámicamente
	const patronesEnlaces = [
		/<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>/gi,  // Enlaces tradicionales
		/window\.location\s*=\s*["']([^"']+)["']/gi,    // JavaScript window.location
		/location\.href\s*=\s*["']([^"']+)["']/gi,      // JavaScript location.href
		/data-href\s*=\s*["']([^"']+)["']/gi,           // Enlaces en atributos data-href
		/data-url\s*=\s*["']([^"']+)["']/gi,            // Enlaces en atributos data-url
		/data-target\s*=\s*["']([^"']+)["']/gi,         // Enlaces en data-target (si son URLs)
		/"url"\s*:\s*["']([^"']+)["']/gi,               // URLs en JSON/configuración
		/"href"\s*:\s*["']([^"']+)["']/gi               // URLs en JSON
	];
	
	patronesEnlaces.forEach(patron => {
		let match;
		while ((match = patron.exec(html)) !== null) {
			let enlace = match[1];
			const enlaceOriginal = enlace; // Guardar el original para debug
			
			// Limpiar el enlace
			enlace = enlace.split('#')[0]; // Remover anchors
			enlace = enlace.split('?')[0]; // Remover query parameters
			
			if (!enlace || enlace === '/' || enlace === '') continue;
			
			try {
				// Convertir enlaces relativos a absolutos usando la URL base completa
				const enlaceCompleto = new URL(enlace, urlBase);
				
				if (debugMode) {
					console.log(`🔧 [DEBUG] Enlace: "${enlaceOriginal}" → "${enlaceCompleto.href}"`);
				}
				
				// Solo procesar enlaces del mismo dominio
				if (enlaceCompleto.hostname === dominioCompleto) {
					// Filtrar solo páginas HTML y directorios
					const pathname = enlaceCompleto.pathname;
					
					// === MEJORA v3.0: Filtros más específicos ===
					// Excluir archivos de recursos (más completo)
					const extensionesExcluidas = [
						'.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', 
						'.woff', '.woff2', '.ttf', '.eot', '.pdf', '.zip', '.rar', '.xml', 
						'.txt', '.json', '.map', '.webp', '.avif', '.mp4', '.mp3', '.wav',
						'.csv', '.xlsx', '.doc', '.docx', '.ppt', '.pptx'
					];
					const esRecurso = extensionesExcluidas.some(ext => pathname.toLowerCase().endsWith(ext));
					
					// URLs problemáticas (más específico para evitar falsos positivos)
					const urlsProblematicas = [
						'/admin/', '/login/', '/wp-admin/', '/wp-login/', '/dashboard/', '/panel/',
						'/404', '/error/', '/search?', '/buscar?', '/contact-form', '/contacto-form',
						'/cart/', '/carrito/', '/checkout/', '/register/', '/registro/',
						'/logout/', '/salir/', '/account/', '/cuenta/', '/profile/', '/perfil/',
						'/api/', '/ajax/', '/webhook/', '/auth/', '/oauth/', '/callback/',
						'mailto:', 'tel:', 'javascript:', 'data:', 'blob:', 'ftp:', 'file:'
					];
					
					// Mejorado: verificar patrones problemáticos más específicos
					const tieneUrlProblematica = urlsProblematicas.some(problema => 
						enlaceCompleto.href.toLowerCase().includes(problema)
					);
					
					// === MEJORA v3.0: Criterios de validación expandidos ===
					const esValidoParaDescarga = (
						pathname.endsWith('.html') || 
						pathname.endsWith('.htm') ||
						pathname.endsWith('/') || 
						pathname.endsWith('.php') ||
						pathname.endsWith('.asp') ||
						pathname.endsWith('.aspx') ||
						(!pathname.includes('.') && pathname !== '/' && pathname.length > 1)
					);
					
					if (!esRecurso && !tieneUrlProblematica && esValidoParaDescarga) {
						// Verificar que no sean enlaces a secciones o páginas especiales
						const urlLimpia = enlaceCompleto.href;
						if (!urlLimpia.includes('mailto:') && 
							!urlLimpia.includes('tel:') && 
							!urlLimpia.includes('javascript:') &&
							!urlLimpia.includes('#') &&
							!urlLimpia.includes('github.io/404') &&
							!urlLimpia.includes('/404') &&
							pathname.length > 1 && // Evitar rutas muy cortas
							!pathname.includes('..')) { // Evitar rutas con navegación hacia atrás
							
							enlaces.add(urlLimpia);
							if (debugMode) {
								console.log(`🔧 [DEBUG] ✅ Enlace interno ACEPTADO: ${urlLimpia}`);
							}
						} else if (debugMode) {
							console.log(`🔧 [DEBUG] ❌ Enlace rechazado por validación especial: ${urlLimpia}`);
						}
					} else if (debugMode) {
						console.log(`🔧 [DEBUG] ❌ Enlace excluido: ${enlaceOriginal} (${esRecurso ? 'recurso' : 'problemático'})`);
					}
				} else if (debugMode) {
					console.log(`🔧 [DEBUG] ❌ Enlace externo ignorado: ${enlaceCompleto.href}`);
				}
			} catch (e) {
				// Ignorar URLs malformadas
				if (debugMode) {
					console.log(`🔧 [DEBUG] ❌ URL malformada ignorada: ${enlace} - Error: ${e.message}`);
				}
			}
		}
	});
	
	if (debugMode) {
		console.log(`🔧 [DEBUG] Total enlaces internos encontrados: ${enlaces.size}`);
		const enlacesArray = Array.from(enlaces).slice(0, MAX_PAGINAS_INTERNAS);
		enlacesArray.forEach((enlace, index) => {
			console.log(`🔧 [DEBUG] ${index + 1}. ${enlace}`);
		});
	}
	
	return Array.from(enlaces).slice(0, MAX_PAGINAS_INTERNAS);
}

	try {
		if (!fs.existsSync('ziteback.log')) {
			fs.writeFileSync(
				'ziteback.log',
				`[INICIO] Script ejecutado: ${new Date().toISOString()}\n====================\n`,
				'utf8'
			);
		}
	} catch (e) {
		console.error('No se pudo crear ziteback.log:', e);
	}

	function esUrlValida(value) {
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	}

// Función para mostrar animación de carga con porcentaje y guiones (VERDE)
function mostrarCargando(mensaje, duracionMs) {
	return new Promise((resolve) => {
		const tiempoInicio = Date.now();
		let porcentaje = 0;
		let ultimaLinea = '';
		
		console.log(`${mensaje} [VERDE]`);
		
		const interval = setInterval(() => {
			// Calcular porcentaje real basado en tiempo transcurrido
			const tiempoTranscurrido = Date.now() - tiempoInicio;
			porcentaje = Math.min(Math.floor((tiempoTranscurrido / duracionMs) * 100), 100);
			
			// Crear barra de progreso (20 caracteres para mejor rendimiento)
			const longitudBarra = 20;
			const guiones = Math.floor((porcentaje / 100) * longitudBarra);
			const espacios = longitudBarra - guiones;
			
			// VERDE para el segundo loader (espera adicional)
			const barraCompleta = '🟢'.repeat(guiones);
			const barraVacia = '⚪'.repeat(espacios);
			
			// Calcular tiempo restante
			const tiempoRestante = Math.max(0, Math.ceil((duracionMs - tiempoTranscurrido) / 1000));
			const porcentajeTexto = `${porcentaje.toString().padStart(3)}%`;
			const tiempoTexto = `${tiempoRestante}s restantes`;
			
			// Crear línea fija
			const linea = `   [${barraCompleta}${barraVacia}] ${porcentajeTexto} - ${tiempoTexto}`;
			
			// Método compatible con Windows: usar escape sequences
			if (ultimaLinea) {
				// Subir una línea y limpiar
				process.stdout.write('\x1b[1A\x1b[2K');
			}
			process.stdout.write(linea + '\n');
			ultimaLinea = linea;
			
			if (porcentaje >= 100) {
				clearInterval(interval);
				// Limpiar línea y mostrar mensaje de completado
				process.stdout.write('\x1b[1A\x1b[2K');
				console.log(`   ✅ ${mensaje} - Completado`);
				resolve();
			}
		}, 150); // Frecuencia optimizada para Windows
	});
}

async function solicitarUrl(urlAutomatica) {
	// Si hay una URL especificada por parámetro, validarla y usarla
	if (urlEspecificada) {
		console.log(`🔗 Usando URL especificada: ${urlEspecificada}`);
		
		/*
		 * ════════════════════════════════════════════════════════════════════════════
		 * 🚀 SISTEMA REVOLUCIONARIO DE PROCESAMIENTO UNIVERSAL DE URLs SIN PROTOCOLO 🚀
		 * ════════════════════════════════════════════════════════════════════════════
		 * 
		 * Esta función representa un breakthrough tecnológico en el procesamiento
		 * automático e inteligente de URLs sin protocolo, permitiendo el manejo
		 * universal de TODOS los formatos de URL posibles:
		 * 
		 * 🔗 FORMATOS SOPORTADOS (sin necesidad de especificar http:// o https://):
		 *    • www.dominio.com          → Automáticamente detecta y usa HTTPS
		 *    • dominio.com              → Automáticamente detecta y usa HTTPS  
		 *    • subdominio.dominio.com   → Automáticamente detecta y usa HTTPS
		 *    • localhost                → Automáticamente detecta y usa HTTP
		 *    • localhost:3000           → Soporta puertos personalizados
		 *    • 127.0.0.1                → Automáticamente detecta y usa HTTP
		 *    • 192.168.1.100            → Redes privadas con HTTP
		 *    • 10.0.0.5:8080            → IPs con puertos personalizados
		 *    • nombrePC                 → Nombres de equipos en red local
		 *    • nombrePC/ruta            → Equipos con rutas específicas
		 * 
		 * 🧠 INTELIGENCIA ARTIFICIAL DE DETECCIÓN:
		 *    - Algoritmo avanzado de pattern matching para identificación automática
		 *    - Detección inteligente entre dominios públicos vs redes locales
		 *    - Asignación automática de protocolo HTTPS para dominios públicos
		 *    - Asignación automática de protocolo HTTP para redes locales
		 *    - Preservación de puertos y rutas en todos los casos
		 * 
		 * Esta funcionalidad elimina completamente la fricción del usuario al
		 * trabajar con URLs, proporcionando una experiencia completamente fluida
		 * y sin errores de protocolo.
		 * ════════════════════════════════════════════════════════════════════════════
		 */
		
		// Normalizar URL - agregar protocolo si falta
		let urlNormalizada = urlEspecificada.trim();
		
		// 🚀 ALGORITMO REVOLUCIONARIO DE DETECCIÓN AUTOMÁTICA DE PROTOCOLOS 🚀
		// Si no tiene protocolo, aplicar algoritmo inteligente de detección universal
		if (!urlNormalizada.startsWith('http://') && !urlNormalizada.startsWith('https://')) {
			// 🔍 DETECCIÓN AVANZADA: Localhost y equipos de red local
			if (urlNormalizada.startsWith('localhost') || 
				urlNormalizada.match(/^[a-zA-Z0-9-]+$/) || // nombres de equipos simples como "incognito"
				urlNormalizada.match(/^[a-zA-Z0-9-]+\//)) {  // nombres de equipos con ruta
				urlNormalizada = 'http://' + urlNormalizada;
			}
			// 🔍 DETECCIÓN AVANZADA: Direcciones IP (IPv4) - usar http para redes locales
			else if (urlNormalizada.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
				urlNormalizada = 'http://' + urlNormalizada;
			}
			// 🔍 DETECCIÓN AVANZADA: Dominios web públicos (incluye www., subdominios, TLDs internacionales)
			else if (urlNormalizada.match(/^(www\.|[a-zA-Z0-9-]+\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) ||
					 urlNormalizada.includes('.') && !urlNormalizada.includes(' ')) {
				urlNormalizada = 'https://' + urlNormalizada;
			}
			// Si no coincide con ningún patrón, asumir que es un dominio y agregar https://
			else if (urlNormalizada.includes('.')) {
				urlNormalizada = 'https://' + urlNormalizada;
			}
			// Si no tiene punto, asumir que es localhost o nombre de equipo
			else {
				urlNormalizada = 'http://' + urlNormalizada;
			}
		}
		
		// Validar la URL normalizada
		try {
			new URL(urlNormalizada);
			console.log(`🔧 URL normalizada: ${urlNormalizada}`);
			return urlNormalizada;
		} catch (error) {
			console.error(`❌ Error: La URL especificada no es válida: ${urlEspecificada}`);
			console.error(`💡 Formatos soportados:`);
			console.error(`   • Dominios: ejemplo.com, www.ejemplo.com, subdominio.ejemplo.com`);
			console.error(`   • Con rutas: ejemplo.com/carpeta/pagina.html`);
			console.error(`   • Localhost: localhost, localhost:3000, localhost/proyecto`);
			console.error(`   • IPs: 192.168.1.15, 192.168.1.15:8080/app`);
			console.error(`   • Nombres de equipos: servidor, incognito, equipo-local`);
			console.error(`   • URLs completas: https://ejemplo.com, http://localhost:3000`);
			process.exit(1);
		}
	}

	if (debugMode) {
		console.log(`🔧 [DEBUG MODE] Usando URL automática: ${urlAutomatica}`);
		return urlAutomatica;
	}

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	let intentos = 0;

	return new Promise((resolve) => {
		function preguntar() {
			if (intentos >= 5) {
				console.log('❌ Se alcanzó el número máximo de intentos. Saliendo...');
				rl.close();
				process.exit(1);
			}

			rl.question('🌐 Por favor, ingresa la URL del sitio: ', (respuesta) => {
				if (esUrlValida(respuesta)) {
					rl.close();
					resolve(respuesta.trim());
				} else {
					intentos++;
					console.log('❌ URL no válida. Inténtalo de nuevo.');
					preguntar();
				}
			});
		}

		preguntar();
	});
}

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizarRutaLocal(resource, dominioRegex) {
	let resultado = resource;

	if (dominioRegex && dominioRegex.test(resultado)) {
		resultado = resultado.replace(dominioRegex, '');
	}

	resultado = resultado.replace(/^(?:\.\/|\.\.\/)+/, '');
	if (resultado.startsWith('/')) resultado = resultado.slice(1);
	
	// Normalizar ruta para evitar carpetas duplicadas
	// Si la ruta contiene subdirectorios antes de wp-content/ o wp-includes/, removerlos
	// Esto maneja casos como "biztech/wp-content/..." -> "wp-content/..."
	if (resultado.includes('wp-content/')) {
		const wpContentIndex = resultado.indexOf('wp-content/');
		if (wpContentIndex > 0) {
			resultado = resultado.substring(wpContentIndex);
		}
	} else if (resultado.includes('wp-includes/')) {
		const wpIncludesIndex = resultado.indexOf('wp-includes/');
		if (wpIncludesIndex > 0) {
			resultado = resultado.substring(wpIncludesIndex);
		}
	}
	// Solo aplicar normalización agresiva si NO estamos en una estructura de WordPress
	else if (!resultado.includes('wp-content/') && !resultado.includes('wp-includes/')) {
		// Si la ruta contiene subdirectorios antes de assets/, extraer solo assets/ hacia adelante
		// Esto maneja casos como "Boots4/assets/css/theme.css" -> "assets/css/theme.css"
		if (resultado.includes('assets/')) {
			const assetsIndex = resultado.indexOf('assets/');
			resultado = resultado.substring(assetsIndex);
		}
		// Si la ruta contiene subdirectorios antes de js/, css/, img/, fonts/, extraer desde ahí
		else if (resultado.match(/\/(js|css|img|images|fonts|font)\//)) {
			const match = resultado.match(/.*\/(js|css|img|images|fonts|font)\//);
			if (match) {
				const startIndex = resultado.indexOf(match[1]);
				resultado = resultado.substring(startIndex);
			}
		}
	}
	
	return resultado;
}

function esRecursoDescargable(url) {
	// Dominios que SÍ queremos descargar (recursos útiles)
	// Nota: NO descargar APIs de Google (fonts.googleapis.com, ajax.googleapis.com). 
	// Estas deben mantenerse como enlaces externos para que el navegador las cargue.
	const dominiosPermitidos = [
		// 'fonts.googleapis.com' <- intencionalmente excluido
		// 'ajax.googleapis.com' <- intencionalmente excluido  
		'fonts.gstatic.com',
		'cdnjs.cloudflare.com', 'cdn.jsdelivr.net',
		'unpkg.com', 'maxcdn.bootstrapcdn.com',
		'stackpath.bootstrapcdn.com'
	];
	
	// Extensiones de recursos que SÍ queremos descargar
	const extensionesDescargables = [
		'.css', '.js', 
		// Imágenes comunes
		'.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.tiff', '.tif',
		'.ico', '.avif', '.jfif',
		// Fuentes (Font Awesome, Google Fonts, etc.)
		'.woff', '.woff2', '.ttf', '.eot', '.otf', '.font',
		// Multimedia
		'.mp4', '.webm', '.ogg', '.mp3', '.wav', '.flac',
		// Documentos que pueden ser recursos
		'.pdf', '.doc', '.docx'
	];
	
	try {
		const urlObj = new URL(url);
		const hostname = urlObj.hostname.toLowerCase();

		// Debug para imágenes
		if (debugMode && (url.includes('.jpg') || url.includes('.png') || url.includes('.gif') || 
			url.includes('.svg') || url.includes('.ico'))) {
			console.log(`🔍 [DEBUG] esRecursoDescargable evaluando: ${url}`);
			console.log(`🔍 [DEBUG] Hostname: ${hostname}`);
		}

		// Forzar que las APIs de Google NO sean descargables — mantenerlas como enlaces
		if (hostname === 'fonts.googleapis.com' || hostname.endsWith('.fonts.googleapis.com') ||
		    hostname === 'ajax.googleapis.com' || hostname.endsWith('.ajax.googleapis.com')) {
			if (debugMode && (url.includes('.jpg') || url.includes('.png') || url.includes('.gif'))) {
				console.log(`🔍 [DEBUG] Rechazado por ser API de Google`);
			}
			return false;
		}
		const pathname = urlObj.pathname.toLowerCase();
		
		// PRIORIDAD ALTA: Si es una imagen común, siempre descargar (independientemente del dominio)
		const extensionesImagen = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp'];
		for (const ext of extensionesImagen) {
			if (pathname.endsWith(ext)) {
				if (debugMode && (url.includes('.jpg') || url.includes('.png') || url.includes('.gif') || 
					url.includes('.svg') || url.includes('.ico'))) {
					console.log(`✅ [DEBUG] Aceptado por ser imagen: ${ext}`);
				}
				return true;
			}
		}
		
		// Verificar si es un dominio explícitamente permitido
		for (const dominio of dominiosPermitidos) {
			if (hostname === dominio || hostname.endsWith('.' + dominio)) {
				return true;
			}
		}
		
		// Verificar si es un dominio excluido
		for (const dominio of dominiosExcluidos) {
			if (hostname === dominio || hostname.endsWith('.' + dominio)) {
				return false;
			}
		}
		
		// Si la URL tiene una extensión de recurso descargable, descargarla
		for (const ext of extensionesDescargables) {
			if (pathname.endsWith(ext)) {
				return true;
			}
		}
		
		// Si es una página HTML o no tiene extensión clara, no descargar
		if (pathname.endsWith('.html') || pathname.endsWith('.htm') || pathname === '/' || !pathname.includes('.')) {
			return false;
		}
		
		// Por defecto, si no sabemos qué es, no lo descargamos
		return false;
		
	} catch {
		return false;
	}
}

function convertirRutaExterna(urlString, forHttps, urlsExternas, extMap) {
	let normalizada = urlString;

	if (forHttps && normalizada.startsWith('http://')) {
		normalizada = 'https://' + normalizada.slice(7);
	}

	// Solo agregar a urlsExternas si es un recurso que debemos descargar
	if (esRecursoDescargable(normalizada)) {
		urlsExternas.add(normalizada);
		
		let recursoPath = '/index.html';
		try {
			const parsed = new URL(normalizada);
			recursoPath = decodeURIComponent(parsed.pathname || '/index.html');
			// NO incluir search params en la ruta local para evitar problemas
		} catch {
			recursoPath = normalizada.replace(/^https?:\/\/(?:[^/]+)?/, '').split('?')[0].split('#')[0];
		}

		if (!recursoPath.startsWith('/')) recursoPath = '/' + recursoPath;

		const extPath = path.posix.join('zideback', recursoPath);
		extMap[normalizada] = extPath;
		return extPath;
	} else {
		// Si no es un recurso descargable, mantener la URL original
		return normalizada;
	}
}

function procesarRutas(html, forHttps, urlBase, urlsExternas, extMap) {
	let dominioRaiz;
	try {
		dominioRaiz = new URL(urlBase).hostname.replace(/^www\./i, '');
	} catch {
		dominioRaiz = urlBase.replace(/^https?:\/\//, '').replace(/^www\./i, '').split('/')[0];
	}

	const dominioRegex = new RegExp(
		`^https?:\\/\\/(?:[\\w-]+\\.)*${escapeRegex(dominioRaiz)}(?:[:/]|$)`,
		'i'
	);

	let procesado = html.replace(/(src|href)=\s*["']([^"']+)["']/gi, (match, attr, raw) => {
		let original = raw.trim();
		if (!original || /^(javascript:|mailto:|tel:|#)/i.test(original)) {
			return `${attr}="${original}` + '"';
		}

		// Convertir URLs con protocolo relativo (//) a HTTPS para evitar problemas con file://
		if (original.startsWith('//')) {
			original = 'https:' + original;
		}

		// Verificar si es un dominio excluido que debe mantenerse externo
		let esExterno = false;
		for (const dominio of dominiosExcluidos) {
			if (original.includes(dominio)) {
				esExterno = true;
				break;
			}
		}
		
		if (esExterno) {
			// Mantener como enlace externo HTTPS
			if (debugMode) {
				console.log(`   🌐 Manteniendo externo: ${original}`);
			}
			return `${attr}="${original}"`;
		}

		if (/^https?:\/\//i.test(original)) {
			if (dominioRegex.test(original)) {
				// Es del mismo dominio - convertir a ruta local
				const limpia = normalizarRutaLocal(original, dominioRegex);
				return `${attr}="${limpia}` + '"';
			} else {
				// Es externo - verificar si debemos descargarlo o dejarlo como enlace
				if (esRecursoDescargable(original)) {
					const recursoExterno = convertirRutaExterna(original, forHttps, urlsExternas, extMap);
					return `${attr}="${recursoExterno}` + '"';
				} else {
					// Dejarlo como enlace externo (redes sociales, etc.)
					return `${attr}="${original}` + '"';
				}
			}
		}

		// Rutas relativas - mantener como están
		const relativa = normalizarRutaLocal(original, null);
		return `${attr}="${relativa}` + '"';
	});

	procesado = procesado.replace(
		/(data-bg|data-img|data-background|data-src)=\s*["']([^"']+)["']/gi,
		(match, attr, raw) => {
			let original = raw.trim();
			if (!original) return `${attr}="${original}` + '"';

			// Convertir URLs con protocolo relativo (//) a HTTPS
			if (original.startsWith('//')) {
				original = 'https:' + original;
			}

			if (/^https?:\/\//i.test(original)) {
				if (dominioRegex.test(original)) {
					const limpia = normalizarRutaLocal(original, dominioRegex);
					return `${attr}="${limpia}` + '"';
				} else {
					if (esRecursoDescargable(original)) {
						const recursoExterno = convertirRutaExterna(original, forHttps, urlsExternas, extMap);
						return `${attr}="${recursoExterno}` + '"';
					} else {
						return `${attr}="${original}` + '"';
					}
				}
			}

			const relativa = normalizarRutaLocal(original, null);
			return `${attr}="${relativa}` + '"';
		}
	);

	procesado = procesado.replace(/style=["'][^"']*["']/gi, (match) => {
		return match.replace(/url\((['"]?)([^'"\)]+)\1\)/gi, (m, quote, recurso) => {
			let original = recurso.trim();
			if (!original) return m;

			// Convertir URLs con protocolo relativo (//) a HTTPS
			if (original.startsWith('//')) {
				original = 'https:' + original;
			}

			if (/^https?:\/\//i.test(original)) {
				if (dominioRegex.test(original)) {
					const limpia = normalizarRutaLocal(original, dominioRegex);
					return `url(${quote}${limpia}${quote})`;
				} else {
					if (esRecursoDescargable(original)) {
						const recursoExterno = convertirRutaExterna(original, forHttps, urlsExternas, extMap);
						return `url(${quote}${recursoExterno}${quote})`;
					} else {
						return `url(${quote}${original}${quote})`;
					}
				}
			}

			const relativa = normalizarRutaLocal(original, null);
			return `url(${quote}${relativa}${quote})`;
		});
	});

	return procesado;
}

function limpiarUrlParametros(url) {
	try {
		const urlObj = new URL(url);
		// Remover query parameters y fragments
		urlObj.search = '';
		urlObj.hash = '';
		return urlObj.href;
	} catch {
		// Si no es una URL válida, intentar limpiar manualmente
		return url.split('?')[0].split('#')[0];
	}
}

// Función para normalizar URLs eliminando barras duplicadas
function normalizarUrl(url) {
	if (!url || typeof url !== 'string') return url;
	
	try {
		// Separar protocolo del resto
		let protocolo = '';
		let resto = url;
		
		if (url.startsWith('http://')) {
			protocolo = 'http://';
			resto = url.substring(7);
		} else if (url.startsWith('https://')) {
			protocolo = 'https://';
			resto = url.substring(8);
		}
		
		// Limpiar barras duplicadas en el resto de la URL
		resto = resto.replace(/\/+/g, '/');
		
		return protocolo + resto;
	} catch {
		// Si hay error, retornar la URL original
		return url;
	}
}

// Función para crear archivos de reemplazo cuando fallan las descargas
function crearArchivoReemplazo(rutaDestino, tipoArchivo, nombreArchivo) {
	try {
		fs.mkdirSync(path.dirname(rutaDestino), { recursive: true });
		
		if (tipoArchivo === 'css') {
			let contenidoCSS = '';
			
			// Generar CSS básico según el tipo de archivo
			if (nombreArchivo.includes('bootstrap')) {
				contenidoCSS = `/* Bootstrap CSS básico - Generado automáticamente por ZiteBack */
.container { max-width: 1140px; margin: 0 auto; padding: 0 15px; }
.row { display: flex; flex-wrap: wrap; margin: 0 -15px; }
.col { flex: 1; padding: 0 15px; }
.btn { display: inline-block; padding: 6px 12px; font-size: 14px; text-align: center; 
       cursor: pointer; border: 1px solid transparent; border-radius: 4px; }
.btn-primary { color: #fff; background-color: #007bff; border-color: #007bff; }
`;
			} else if (nombreArchivo.includes('animate')) {
				contenidoCSS = `/* CSS Animate básico - Generado automáticamente por ZiteBack */
.animated { animation-duration: 1s; animation-fill-mode: both; }
.fadeIn { animation-name: fadeIn; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.fadeOut { animation-name: fadeOut; }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
`;
			} else {
				contenidoCSS = `/* CSS básico - Generado automáticamente por ZiteBack */
/* Archivo no encontrado en el servidor original */
/* Este es un placeholder para evitar errores 404 */
`;
			}
			
			fs.writeFileSync(rutaDestino, contenidoCSS, 'utf8');
			console.log(`   🔧 Archivo CSS de reemplazo creado: ${path.basename(rutaDestino)}`);
			totalFilesDownloaded++; // Incrementar contador global
			return true;
			
		} else if (tipoArchivo === 'js') {
			let contenidoJS = `/* JS básico - Generado automáticamente por ZiteBack */
/* Archivo no encontrado en el servidor original */
console.log('ZiteBack: Archivo ${nombreArchivo} no encontrado, usando placeholder');
`;
			
			fs.writeFileSync(rutaDestino, contenidoJS, 'utf8');
			console.log(`   🔧 Archivo JS de reemplazo creado: ${path.basename(rutaDestino)}`);
			totalFilesDownloaded++; // Incrementar contador global
			return true;
		}
		
		return false;
	} catch (err) {
		console.warn(`⚠️  No se pudo crear archivo de reemplazo: ${err.message}`);
		return false;
	}
}

// Función mejorada para detectar y manejar errores comunes de descarga
function manejarErrorDescarga(url, destino, error) {
	const nombreArchivo = path.basename(url).toLowerCase();
	const extension = path.extname(nombreArchivo).toLowerCase();
	
	// Detectar tipos de error común
	const es404 = error.response && error.response.status === 404;
	const esTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
	const esConexion = error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND';
	
	if (es404 || esTimeout || esConexion) {
		// Intentar crear archivo de reemplazo para archivos críticos
		if (extension === '.css' || extension === '.js') {
			const tipoArchivo = extension.slice(1); // remover el punto
			return crearArchivoReemplazo(destino, tipoArchivo, nombreArchivo);
		}
	}
	
	return false;
}

async function procesarRecursosCss(archivoCSS, urlBaseCss, siteName, urlsExternas, extMap) {
	
	if (!archivoCSS) {
		console.warn(`⚠️  procesarRecursosCss: archivoCSS es ${archivoCSS}, saliendo...`);
		return;
	}
	
	try {
		if (!fs.existsSync(archivoCSS)) return;
		
		let contenidoCss = fs.readFileSync(archivoCSS, 'utf8');
		const recursosEncontrados = new Set();
		
		// Formatear CSS minificado para mejor procesamiento
		contenidoCss = formatearCssMinificado(contenidoCss);
		
		// Buscar URLs en el CSS usando diferentes patrones (incluyendo @font-face)
		const patronesUrl = [
			// Patrones URL estándar
			/url\((['"]?)([^'"\)]+)\1\)/gi,
			/@import\s+(['"])([^'"]+)\1/gi,
			/@import\s+url\((['"]?)([^'"\)]+)\1\)/gi,
			// Patrones específicos para @font-face (Font Awesome, etc.)
			/src:\s*url\((['"]?)([^'"\)]+)\1\)[^;]*format\([^)]+\)/gi,
			/src:\s*[^;]*url\((['"]?)([^'"\)]+)\1\)/gi
		];
		
		for (const patron of patronesUrl) {
			let match;
			while ((match = patron.exec(contenidoCss)) !== null) {
				const recursoUrl = match[2].trim();
				if (!recursoUrl) continue;
				
				// Verificar si es una fuente
				if (esFuenteUrl(recursoUrl)) {
					// Almacenar información de la fuente para descarga posterior
					const infoFuente = {
						urlCss: urlBaseCss,
						archivoCss: archivoCSS,
						rutaRelativa: recursoUrl,
						siteName: siteName
					};
					
					// Evitar duplicados
					const yaExiste = fuentesDetectadas.some(f => 
						f.urlCss === infoFuente.urlCss && f.rutaRelativa === infoFuente.rutaRelativa
					);
					
					if (!yaExiste) {
						fuentesDetectadas.push(infoFuente);
						if (debugMode) {
							console.log(`� Fuente detectada: ${recursoUrl} en ${path.basename(archivoCSS)}`);
						}
					}
					
					continue; // Las fuentes se procesan al final
				}
				
				// Construir URL completa del recurso
				let urlCompleta;
				if (recursoUrl.startsWith('http://') || recursoUrl.startsWith('https://')) {
					urlCompleta = recursoUrl;
				} else if (recursoUrl.startsWith('//')) {
					urlCompleta = 'https:' + recursoUrl;
				} else if (recursoUrl.startsWith('/')) {
					// Ruta absoluta desde el dominio del CSS
					try {
						const baseUrl = new URL(urlBaseCss);
						urlCompleta = baseUrl.origin + recursoUrl;
						// Normalizar la URL para eliminar barras duplicadas
						urlCompleta = normalizarUrl(urlCompleta);
					} catch {
						continue;
					}
				} else {
					// Ruta relativa al CSS
					try {
						urlCompleta = new URL(recursoUrl, urlBaseCss).href;
						// Normalizar la URL para eliminar barras duplicadas
						urlCompleta = normalizarUrl(urlCompleta);
					} catch {
						continue;
					}
				}
				
				// Debug para URLs construidas
				if (debugMode && (urlCompleta.includes('.woff') || urlCompleta.includes('.ttf'))) {
					console.log(`🔍 [DEBUG] URL completa construida: ${urlCompleta}`);
				}
				
				// Verificar si es un recurso descargable
				if (esRecursoDescargable(urlCompleta)) {
					recursosEncontrados.add(urlCompleta);
				}
			}
		}
		
		if (recursosEncontrados.size > 0) {
			console.log(`🎨 Encontrados ${recursosEncontrados.size} recursos en CSS: ${path.basename(archivoCSS)}`);
			
			// Descargar cada recurso encontrado
			for (const recursoUrl of recursosEncontrados) {
				// Limpiar la URL de parámetros antes de descargar
				const urlLimpia = limpiarUrlParametros(recursoUrl);
				
				// Agregar a la lista de externos si no está ya
				if (!urlsExternas.has(recursoUrl)) {
					urlsExternas.add(recursoUrl);
					
					// Crear mapeo para la ruta local usando la URL original (con parámetros para el mapeo)
					let recursoPath;
					try {
						const parsed = new URL(recursoUrl);
						recursoPath = decodeURIComponent(parsed.pathname);
						// NO incluir search params en la ruta local
					} catch {
						recursoPath = recursoUrl.replace(/^https?:\/\/[^/]+/, '').split('?')[0].split('#')[0];
					}
					
					if (!recursoPath.startsWith('/')) recursoPath = '/' + recursoPath;
					
					// Aplicar la misma lógica de normalización para evitar carpetas duplicadas
					let extPath;
					try {
						const urlObj = new URL(recursoUrl);
						const urlBase_obj = new URL(urlBaseCss);
						
						if (urlObj.hostname === urlBase_obj.hostname) {
							// Mismo dominio - normalizar ruta para evitar carpetas duplicadas
							let normalizedPath = recursoPath.startsWith('/') ? recursoPath.substring(1) : recursoPath;
							
							// Si la ruta contiene subdirectorios antes de assets/, extraer solo assets/ hacia adelante
							// Esto maneja casos como "Boots4/assets/img/image.jpg" -> "assets/img/image.jpg"
							if (normalizedPath.includes('assets/')) {
								const assetsIndex = normalizedPath.indexOf('assets/');
								normalizedPath = normalizedPath.substring(assetsIndex);
							}
							// Si la ruta contiene subdirectorios antes de js/, css/, img/, fonts/, extraer desde ahí
							else if (normalizedPath.match(/\/(js|css|img|images|fonts|font)\//)) {
								const match = normalizedPath.match(/.*\/(js|css|img|images|fonts|font)\//);
								if (match) {
									const startIndex = normalizedPath.indexOf(match[1]);
									normalizedPath = normalizedPath.substring(startIndex);
								}
							}
							
							extPath = normalizedPath;
						} else {
							// Dominio externo - guardar en zideback
							extPath = path.posix.join('zideback', recursoPath);
						}
					} catch {
						// En caso de error, usar zideback como fallback
						extPath = path.posix.join('zideback', recursoPath);
					}
					
					extMap[recursoUrl] = extPath;
					
					// Descargar el recurso usando la URL limpia
					const destino = path.join(sitesDir, siteName, ...extPath.split('/'));
					fs.mkdirSync(path.dirname(destino), { recursive: true });
					
					let intentos = 0;
					let descargado = false;
					while (intentos < 3 && !descargado) {
						try {
							const response = await axios.get(urlLimpia, { responseType: 'arraybuffer' });
							fs.writeFileSync(destino, response.data);
							console.log(`📦 Recurso CSS descargado: ${destino}`);
							totalFilesDownloaded++; // Incrementar contador global
							descargado = true;
						} catch (err) {
							intentos++;
							if (intentos >= 3) {
								// Intentar crear archivo de reemplazo antes de marcar como error
								const reemplazado = manejarErrorDescarga(urlLimpia, destino, err);
								if (reemplazado) {
									descargado = true;
									console.log(`   ✅ Reemplazo CSS creado: ${path.basename(destino)}`);
								} else {
									errCount++;
									const tipoError = err.response?.status === 404 ? '404 No encontrado' : 'Error de descarga';
									console.error(`❌ ${tipoError}: ${path.basename(destino)}`);
									const statusCode = err.response?.status || 'UNKNOWN';
									logErrorToFile(`Descarga recurso CSS (${urlLimpia}):\n${err.stack || err}`, true, statusCode);
								}
							} else {
								console.warn(`⚠️  Reintentando descarga CSS ${urlLimpia} (intento ${intentos + 1}/3)...`);
								await new Promise((resolve) => setTimeout(resolve, 1000));
							}
						}
					}
				}
			}
			
			// Actualizar rutas en el CSS
			let cssActualizado = contenidoCss;
			for (const recursoUrl of recursosEncontrados) {
				if (extMap[recursoUrl]) {
					const rutaLocal = extMap[recursoUrl];
					
					// Calcular ruta relativa desde el CSS hasta el recurso
					const dirCSS = path.posix.dirname(archivoCSS.replace(/\\/g, '/').replace(/^.*sites\/[^\/]+\//, ''));
					const rutaRelativa = path.posix.relative(dirCSS, rutaLocal);
					
					// Crear regex para encontrar todas las referencias a este recurso (con y sin parámetros)
					const urlLimpia = limpiarUrlParametros(recursoUrl);
					const urlEscapada = escapeRegex(recursoUrl);
					const urlLimpiaEscapada = escapeRegex(urlLimpia);
					
					// Buscar y reemplazar todas las variantes de la URL
					const patronesReemplazo = [
						new RegExp(urlEscapada, 'g'),
						new RegExp(urlLimpiaEscapada, 'g'),
						// También buscar rutas relativas que puedan existir
						new RegExp(escapeRegex(recursoUrl.replace(/^https?:\/\/[^\/]+/, '')), 'g'),
						new RegExp(escapeRegex(urlLimpia.replace(/^https?:\/\/[^\/]+/, '')), 'g')
					];
					
					for (const patron of patronesReemplazo) {
						cssActualizado = cssActualizado.replace(patron, rutaRelativa);
					}
				}
			}
			
			// Guardar CSS actualizado
			if (cssActualizado !== contenidoCss) {
				fs.writeFileSync(archivoCSS, cssActualizado, 'utf8');
				console.log(`🔄 CSS actualizado con rutas locales: ${path.basename(archivoCSS)}`);
			}
		}
		
	} catch (err) {
		errCount++;
		console.error(`❌ Error procesando CSS ${archivoCSS}: ${err.message}`);
		logErrorToFile(`Error procesando CSS (${archivoCSS}):\n${err.stack || err}`);
	}
}

console.log(`🔍 [DEBUG] *** FUNCIÓN procesarRecursosCss DECLARADA CORRECTAMENTE ***`);

async function actualizarCssLocales(siteName, urlBase) {
	// Buscar todos los archivos CSS en la carpeta del sitio
	const siteDir = path.join(sitesDir, siteName);
	const archivosCSS = [];
	
	function buscarCSS(dir) {
		const items = fs.readdirSync(dir, { withFileTypes: true });
		for (const item of items) {
			const rutaCompleta = path.join(dir, item.name);
			if (item.isDirectory()) {
				buscarCSS(rutaCompleta);
			} else if (item.name.endsWith('.css')) {
				archivosCSS.push(rutaCompleta);
			}
		}
	}
	
	buscarCSS(siteDir);
	
	if (archivosCSS.length === 0) return;
	
	console.log(`🔄 Actualizando rutas en ${archivosCSS.length} archivos CSS locales...`);
	
	for (const archivoCSS of archivosCSS) {
		try {
			let contenidoCss = fs.readFileSync(archivoCSS, 'utf8');
			let cssModificado = false;
			
			// Buscar y reemplazar referencias con parámetros de versión
			const patronParametros = /url\(['"]?([^'"\)]*\?[^'"\)]*?)['"]?\)/gi;
			
			contenidoCss = contenidoCss.replace(patronParametros, (match, urlConParametros) => {
				const urlLimpia = urlConParametros.split('?')[0].split('#')[0];
				
				// Si la URL es relativa, verificar si existe sin parámetros
				if (!urlConParametros.startsWith('http')) {
					const dirCSS = path.dirname(archivoCSS);
					let rutaAbsoluta;
					
					if (urlLimpia.startsWith('/')) {
						rutaAbsoluta = path.join(siteDir, urlLimpia);
					} else {
						rutaAbsoluta = path.resolve(dirCSS, urlLimpia);
					}
					
					// Verificar si existe el archivo limpio
					if (fs.existsSync(rutaAbsoluta)) {
						cssModificado = true;
						console.log(`   ✅ Limpiando: ${urlConParametros} → ${urlLimpia}`);
						return `url('${urlLimpia}')`;
					}
					
					// También verificar en zideback si es una ruta relativa que contiene fonts
					if (urlLimpia.includes('fonts/')) {
						// Extraer el nombre del archivo
						const nombreArchivo = path.basename(urlLimpia);
						// Buscar recursivamente en zideback por este archivo
						const buscarEnZideback = (dir) => {
							try {
								const items = fs.readdirSync(dir, { withFileTypes: true });
								for (const item of items) {
									const rutaCompleta = path.join(dir, item.name);
									if (item.isDirectory()) {
										const resultado = buscarEnZideback(rutaCompleta);
										if (resultado) return resultado;
									} else if (item.name === nombreArchivo) {
										return rutaCompleta;
									}
								}
							} catch (err) {
								// Ignorar errores de acceso
							}
							return null;
						};
						
						const zidebackDir = path.join(siteDir, 'zideback');
						if (fs.existsSync(zidebackDir)) {
							const archivoEncontrado = buscarEnZideback(zidebackDir);
							if (archivoEncontrado) {
								// Calcular ruta relativa correcta desde el archivo CSS hacia zideback
								const rutaRelativaArchivo = path.relative(siteDir, archivoEncontrado).replace(/\\/g, '/');
								const rutaRelativaCSS = path.relative(siteDir, dirCSS).replace(/\\/g, '/');
								
								// Contar niveles de directorio en la ruta del CSS para calcular "../"
								const niveles = rutaRelativaCSS.split('/').length;
								const prefijo = '../'.repeat(niveles);
								const rutaFinal = prefijo + rutaRelativaArchivo;
								
								cssModificado = true;
								console.log(`   ✅ Redirigiendo a zideback: ${urlConParametros} → ${rutaFinal}`);
								return `url('${rutaFinal}')`;
							}
						}
					}
				}
				
				return match; // Si no se puede limpiar, mantener original
			});
			
			if (cssModificado) {
				fs.writeFileSync(archivoCSS, contenidoCss, 'utf8');
				console.log(`✅ CSS actualizado: ${path.relative(siteDir, archivoCSS)}`);
			}
			
		} catch (err) {
			console.warn(`⚠️  Error actualizando CSS ${archivoCSS}: ${err.message}`);
		}
	}
}

// Nueva función: Corregir automáticamente paths de imágenes y recursos en CSS
async function corregirPathsImagenesCSS(siteName, urlBase) {
	const siteDir = path.join(sitesDir, siteName);
	const zidebackDir = path.join(siteDir, 'zideback');
	const archivosCSS = [];
	
	// Buscar todos los archivos CSS
	function buscarCSS(dir) {
		try {
			const items = fs.readdirSync(dir, { withFileTypes: true });
			for (const item of items) {
				const rutaCompleta = path.join(dir, item.name);
				if (item.isDirectory() && item.name !== 'zideback') {
					buscarCSS(rutaCompleta);
				} else if (item.name.endsWith('.css')) {
					archivosCSS.push(rutaCompleta);
				}
			}
		} catch (err) {
			// Ignorar errores de acceso
		}
	}
	
	buscarCSS(siteDir);
	
	if (archivosCSS.length === 0) return;
	
	console.log(`🖼️  Corrigiendo paths de imágenes en ${archivosCSS.length} archivos CSS...`);
	
	for (const archivoCSS of archivosCSS) {
		try {
			let contenidoCss = fs.readFileSync(archivoCSS, 'utf8');
			let cssModificado = false;
			
			// Buscar todas las referencias a imágenes en url()
			const patronImagenes = /url\(['"]?([^'"\)]+)['"]?\)/gi;
			
			contenidoCss = contenidoCss.replace(patronImagenes, (match, urlOriginal) => {
				// Limpiar la URL
				const urlLimpia = urlOriginal.split('?')[0].split('#')[0];
				
				// Solo procesar URLs que parecen imágenes
				const extensionesImagen = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico'];
				const esImagen = extensionesImagen.some(ext => urlLimpia.toLowerCase().endsWith(ext));
				
				if (esImagen && !urlLimpia.startsWith('http') && !urlLimpia.startsWith('data:')) {
					// Calcular ruta relativa desde el CSS hacia zideback
					const dirCSS = path.dirname(archivoCSS);
					const rutaRelativaCSS = path.relative(siteDir, dirCSS);
					const niveles = rutaRelativaCSS === '' ? 0 : rutaRelativaCSS.split(path.sep).length;
					const prefijo = '../'.repeat(niveles);
					
					// Diferentes patrones de búsqueda para la imagen
					const patronesBusqueda = [];
					
					// Patrón 1: URL exacta en zideback
					if (urlLimpia.startsWith('/')) {
						patronesBusqueda.push(path.join('zideback', urlLimpia.substring(1)));
					} else {
						patronesBusqueda.push(path.join('zideback', urlLimpia));
					}
					
					// Patrón 2: Solo el nombre del archivo buscado recursivamente
					const nombreArchivo = path.basename(urlLimpia);
					
					// Buscar la imagen en zideback
					function buscarImagenRecursivo(dir, nombreBuscado) {
						try {
							const items = fs.readdirSync(dir, { withFileTypes: true });
							for (const item of items) {
								const rutaCompleta = path.join(dir, item.name);
								if (item.isDirectory()) {
									const resultado = buscarImagenRecursivo(rutaCompleta, nombreBuscado);
									if (resultado) return resultado;
								} else if (item.name === nombreBuscado) {
									return rutaCompleta;
								}
							}
						} catch (err) {
							// Ignorar errores de acceso
						}
						return null;
					}
					
					// Buscar por patrones específicos primero
					for (const patron of patronesBusqueda) {
						const rutaCompleta = path.join(siteDir, patron);
						if (fs.existsSync(rutaCompleta)) {
							const rutaFinal = prefijo + patron.replace(/\\/g, '/');
							cssModificado = true;
							console.log(`   🖼️  Corrigiendo path: ${urlOriginal} → ${rutaFinal}`);
							return `url('${rutaFinal}')`;
						}
					}
					
					// Si no se encontró, buscar recursivamente por nombre
					if (fs.existsSync(zidebackDir)) {
						const archivoEncontrado = buscarImagenRecursivo(zidebackDir, nombreArchivo);
						if (archivoEncontrado) {
							const rutaRelativaEncontrada = path.relative(siteDir, archivoEncontrado).replace(/\\/g, '/');
							const rutaFinal = prefijo + rutaRelativaEncontrada;
							cssModificado = true;
							console.log(`   🖼️  Imagen encontrada recursivamente: ${urlOriginal} → ${rutaFinal}`);
							return `url('${rutaFinal}')`;
						}
					}
					
					// Si aún no se encontró, intentar con variaciones comunes
					const variacionesComunes = [
						`images/${nombreArchivo}`,
						`img/${nombreArchivo}`,
						`assets/images/${nombreArchivo}`,
						`assets/img/${nombreArchivo}`,
						`wp-content/uploads/${nombreArchivo}`
					];
					
					for (const variacion of variacionesComunes) {
						const rutaCompleta = path.join(zidebackDir, variacion);
						if (fs.existsSync(rutaCompleta)) {
							const rutaFinal = prefijo + `zideback/${variacion}`.replace(/\\/g, '/');
							cssModificado = true;
							console.log(`   🖼️  Imagen encontrada por variación: ${urlOriginal} → ${rutaFinal}`);
							return `url('${rutaFinal}')`;
						}
					}
					
					if (debugMode) {
						console.log(`   ⚠️  Imagen no encontrada en zideback: ${urlOriginal}`);
					}
				}
				
				return match; // Mantener original si no se puede corregir
			});
			
			if (cssModificado) {
				fs.writeFileSync(archivoCSS, contenidoCss, 'utf8');
				console.log(`✅ Paths de imágenes corregidos en: ${path.relative(siteDir, archivoCSS)}`);
			}
			
		} catch (err) {
			console.warn(`⚠️  Error corrigiendo paths en CSS ${archivoCSS}: ${err.message}`);
		}
	}
}

async function descargarRecursosLocales(html, urlBase, siteName, urlsExternas, extMap) {
	const urlsLocales = new Set();
	const dominioBase = new URL(urlBase).origin;
	const recursosEspeciales = {}; // Para videos de YouTube y otros recursos especiales
	
	// Función helper para agregar recursos de forma inteligente
	const agregarRecurso = (recurso, tipo = 'general') => {
		if (!recurso || recurso.startsWith('data:') || recurso.startsWith('javascript:') || 
			recurso.startsWith('mailto:') || recurso.startsWith('tel:') || recurso.startsWith('#')) {
			return;
		}

		// Filtrar endpoints de API y rutas dinámicas de WordPress
		const rutasExcluidas = [
			'/wp-json/', '/wp-admin/', '/wp-login.php', '/xmlrpc.php',
			'/feed/', '/trackback/', '?rest_route=', '/api/', '/ajax/',
			'/wp-cron.php', '/wp-comments-post.php'
		];
		
		// Filtrar URLs que apuntan a directorios (terminan en /) sin nombre de archivo
		if (recurso.endsWith('/') && !recurso.endsWith('index.html')) {
			if (debugMode) {
				console.log(`🚫 [DEBUG] Recurso excluido (directorio sin archivo): ${recurso}`);
			}
			return;
		}
		
		// Filtrar URLs que son la misma página base
		const urlBaseParaComparacion = new URL(urlBase).pathname;
		if (recurso === urlBaseParaComparacion || recurso === urlBaseParaComparacion + '/') {
			if (debugMode) {
				console.log(`🚫 [DEBUG] Recurso excluido (página base duplicada): ${recurso}`);
			}
			return;
		}
		
		for (const rutaExcluida of rutasExcluidas) {
			if (recurso.includes(rutaExcluida)) {
				if (debugMode) {
					console.log(`🚫 [DEBUG] Recurso excluido (API/dinámico): ${recurso}`);
				}
				return;
			}
		}

		// Construir URL completa
		let urlCompleta;
		if (recurso.startsWith('http')) {
			// Ya es URL completa
			urlCompleta = recurso;
		} else if (recurso.startsWith('//')) {
			// Protocolo relativo
			urlCompleta = 'https:' + recurso;
		} else if (recurso.startsWith('/')) {
			// Ruta absoluta
			urlCompleta = dominioBase + recurso;
		} else {
			// Ruta relativa
			urlCompleta = urlBase.endsWith('/') ? urlBase + recurso : urlBase + '/' + recurso;
		}

		// Debug para imágenes
		if (debugMode && (recurso.includes('.png') || recurso.includes('.jpg') || recurso.includes('.gif') || 
			recurso.includes('.svg') || recurso.includes('.ico'))) {
			console.log(`� [DEBUG] Procesando imagen ${tipo}: ${recurso} -> ${urlCompleta}`);
		}

		// Verificar si es del mismo dominio o es un recurso descargable
		try {
			const urlObj = new URL(urlCompleta);
			const esDelMismoDominio = urlObj.hostname === new URL(urlBase).hostname;
			
			if (esDelMismoDominio || esRecursoDescargable(urlCompleta)) {
				// Asegurar que la ruta local sea relativa y no contenga protocolos
				let rutaLocal = recurso;
				
				// Si el recurso original era una URL completa, extraer solo la parte de la ruta
				if (recurso.startsWith('http://') || recurso.startsWith('https://')) {
					try {
						const recursoUrl = new URL(recurso);
						rutaLocal = recursoUrl.pathname.startsWith('/') ? recursoUrl.pathname.slice(1) : recursoUrl.pathname;
					} catch (e) {
						// Si hay error parseando la URL, usar el recurso original sin protocolo
						rutaLocal = recurso.replace(/^https?:\/\/[^\/]+\//, '');
					}
				}
				
				// Limpiar cualquier resto de protocolo o dominio que pueda quedar
				rutaLocal = rutaLocal.replace(/^https?:\/\/[^\/]+\//, '');
				
				// Asegurar que no empiece con slash para evitar rutas absolutas
				if (rutaLocal.startsWith('/')) {
					rutaLocal = rutaLocal.slice(1);
				}
				
				// Normalizar ruta para evitar subdirectorios duplicados
				// SOLO remover subdirectorio base si la ruta NO es absoluta de WordPress
				// Las rutas wp-content/ y wp-includes/ son SIEMPRE absolutas desde el dominio
				try {
					const urlBaseObj = new URL(urlBase);
					const subdirectorioBase = urlBaseObj.pathname.split('/').filter(p => p.length > 0)[0];
					
					// SOLO aplicar normalización si NO es una ruta absoluta de WordPress
					if (subdirectorioBase && 
						rutaLocal.startsWith(subdirectorioBase + '/') &&
						!rutaLocal.startsWith('wp-content/') && 
						!rutaLocal.startsWith('wp-includes/')) {
						rutaLocal = rutaLocal.substring(subdirectorioBase.length + 1);
						if (debugMode && (recurso.includes('.png') || recurso.includes('.jpg') || recurso.includes('.gif') || 
							recurso.includes('.svg') || recurso.includes('.ico'))) {
							console.log(`🔧 [DEBUG] Ruta normalizada (removido ${subdirectorioBase}): ${rutaLocal}`);
						}
					}
				} catch (e) {
					// Si hay error, continuar con la ruta original
				}
				
				urlsLocales.add({ url: urlCompleta, path: rutaLocal });
				if (debugMode && (recurso.includes('.png') || recurso.includes('.jpg') || recurso.includes('.gif') || 
					recurso.includes('.svg') || recurso.includes('.ico'))) {
					console.log(`✅ [DEBUG] Imagen agregada para descarga: ${rutaLocal}`);
				}
			} else {
				if (debugMode && (recurso.includes('.png') || recurso.includes('.jpg') || recurso.includes('.gif') || 
					recurso.includes('.svg') || recurso.includes('.ico'))) {
					console.log(`❌ [DEBUG] Imagen rechazada (dominio diferente): ${urlCompleta}`);
				}
			}
		} catch (e) {
			if (debugMode) {
				console.log(`⚠️ [DEBUG] Error procesando URL: ${urlCompleta} - ${e.message}`);
			}
		}
	};

	// Buscar recursos en atributos src y href
	const recursosPattern = /(src|href)=\s*["']([^"']+)["']/gi;
	let match;
	while ((match = recursosPattern.exec(html)) !== null) {
		agregarRecurso(match[2].trim(), match[1]);
	}
	// Buscar en atributos de datos específicos para imágenes
	const dataPattern = /(data-bg|data-img|data-background|data-src|data-original|data-lazy)=\s*["']([^"']+)["']/gi;
	while ((match = dataPattern.exec(html)) !== null) {
		agregarRecurso(match[2].trim(), 'data-' + match[1]);
	}
	
	// 🆕 NUEVO: Buscar imágenes en atributo srcset (para pantallas retina/responsive)
	const srcsetPattern = /srcset=\s*["']([^"']+)["']/gi;
	while ((match = srcsetPattern.exec(html)) !== null) {
		// El srcset puede tener múltiples URLs separadas por comas
		// Ejemplo: "image1.jpg 1x, image2.jpg 2x" o "image1.jpg 320w, image2.jpg 640w"
		const srcsetValue = match[1].trim();
		const srcsetEntries = srcsetValue.split(',');
		
		for (const entry of srcsetEntries) {
			// Extraer solo la URL (antes del descriptor de densidad o ancho)
			const entryTrimmed = entry.trim();
			const spaceIndex = entryTrimmed.indexOf(' ');
			const imageUrl = spaceIndex > 0 ? entryTrimmed.substring(0, spaceIndex) : entryTrimmed;
			
			if (imageUrl && imageUrl.length > 0) {
				agregarRecurso(imageUrl.trim(), 'srcset');
				if (debugMode) {
					console.log(`🖼️ [DEBUG] Imagen srcset detectada: ${imageUrl.trim()}`);
				}
			}
		}
	}
	
	// Buscar background-image en atributos style del HTML
	const styleBackgroundPattern = /style=\s*["'][^"']*background-image\s*:\s*url\s*\(\s*(['"]?)([^'"()]+?)\1\s*\)[^"']*["']/gi;
	while ((match = styleBackgroundPattern.exec(html)) !== null) {
		if (match[2]) {
			agregarRecurso(match[2].trim(), 'style-background');
		}
	}
	
	// Buscar background-image en atributos data-style del HTML (nuevo)
	const dataStyleBackgroundPattern = /data-style=\s*["'][^"']*background-image\s*:\s*url\s*\(\s*(['"]?)([^'"()]+?)\1\s*\)[^"']*["']/gi;
	while ((match = dataStyleBackgroundPattern.exec(html)) !== null) {
		if (match[2]) {
			agregarRecurso(match[2].trim(), 'data-style-background');
		}
	}
	
	// Buscar videos de YouTube en backgrounds con data-property (maneja &quot; y comillas normales)
	const youtubePatterns = [
		/data-property=\s*["'][^"']*videoURL[^"']*:[^"']*(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)[^"']*["']/gi,
		/data-property=\s*["{][^"}]*videoURL[^"}]*:[^"}]*(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)[^"}]*["'}]/gi
	];
	
	for (const pattern of youtubePatterns) {
		while ((match = pattern.exec(html)) !== null) {
			if (match[1]) {
				console.log(`🎬 Video de YouTube detectado en background: ${match[1]}`);
				// No descargamos el video, solo registramos para procesamiento posterior
				recursosEspeciales.youtube = recursosEspeciales.youtube || [];
				recursosEspeciales.youtube.push({
					videoId: match[1],
					type: 'background-video'
				});
			}
		}
	}
	
	// 🆕 NUEVO: Patrón agresivo para capturar archivos que se escapan (nombres raros, versiones hash, etc.)
	const patronesAgresivos = [
		// Archivos JavaScript con nombres hash o raros
		/["']([\w\d]{20,}\.js)["']/gi,
		/["']([^"']+\.js\?[^"']*ver=[^"']*)["']/gi,
		// Fuentes con parámetros o hash
		/["']([^"']+\.(?:woff2|woff|ttf|otf|eot)\?[^"']*)["']/gi,
		// URLs en atributos data-* que no hemos capturado
		/data-[\w-]+=\s*["']([^"']+\.(?:js|css|png|jpg|jpeg|gif|svg|webp|woff2|woff|ttf))["']/gi,
		// URLs en scripts inline
		/(?:src|href)\s*:\s*["']([^"']+\.(?:js|css|png|jpg|jpeg|gif|svg|webp|woff2|woff|ttf))["']/gi
	];
	
	for (const patronAgresivo of patronesAgresivos) {
		while ((match = patronAgresivo.exec(html)) !== null) {
			if (match[1] && match[1].length > 0) {
				agregarRecurso(match[1].trim(), 'patron-agresivo');
				if (debugMode) {
					console.log(`🎯 [DEBUG] Archivo capturado por patrón agresivo: ${match[1].trim()}`);
				}
			}
		}
	}
	
	// Buscar en CSS inline (background-image, etc.)
	const stylePattern = /url\s*\(\s*['"]?([^'")\s]+)['"]?\s*\)/gi;
	while ((match = stylePattern.exec(html)) !== null) {
		if (!match[1]) {
			continue;
		}
		const recurso = match[1].trim();
		if (recurso && !recurso.startsWith('http') && !recurso.startsWith('//')) {
			let urlCompleta;
			if (recurso.startsWith('/')) {
				urlCompleta = dominioBase + recurso;
			} else {
				urlCompleta = urlBase.endsWith('/') ? urlBase + recurso : urlBase + '/' + recurso;
			}
			
			// Normalizar la URL para eliminar barras duplicadas
			urlCompleta = normalizarUrl(urlCompleta);
			
			if (esRecursoDescargable(urlCompleta)) {
				urlsLocales.add({ url: urlCompleta, path: recurso });
			}
		}
	}
	
	if (urlsLocales.size === 0) {
		console.log('📝 No se encontraron recursos locales para descargar.');
		return;
	}

	console.log(obtenerMensaje('descargando_recursos', IDIOMA_SISTEMA, { count: urlsLocales.size }));
	
	const archivosCSS = [];
	
	for (const item of urlsLocales) {
		const destino = path.join(sitesDir, siteName, item.path);
		fs.mkdirSync(path.dirname(destino), { recursive: true });
		
		// Limpiar la URL de parámetros antes de descargar
		const urlLimpia = normalizarUrl(limpiarUrlParametros(item.url));
		
		let intentos = 0;
		let descargado = false;
		while (intentos < 3 && !descargado) {
			try {
				const response = await axios.get(urlLimpia, { responseType: 'arraybuffer' });
				fs.writeFileSync(destino, response.data);
				console.log(obtenerMensaje('recurso_descargado', IDIOMA_SISTEMA) + ' ' + destino);
				totalFilesDownloaded++; // Incrementar contador global
				descargado = true;
				
				// Si es un archivo CSS, agregarlo a la lista para procesarlo después
				if (item.url.toLowerCase().includes('.css')) {
					archivosCSS.push({ archivo: destino, urlOriginal: item.url });
				}
				
			} catch (err) {
				intentos++;
				if (intentos >= 3) {
					// Intentar crear archivo de reemplazo antes de marcar como error
					const reemplazado = manejarErrorDescarga(urlLimpia, destino, err);
					if (reemplazado) {
						descargado = true;
						console.log(`   ✅ Reemplazo creado para recurso faltante: ${path.basename(destino)}`);
						
						// Si es un archivo CSS, agregarlo a la lista para procesarlo después
						if (item.url.toLowerCase().endsWith('.css')) {
							archivosCSS.push({ archivo: destino, urlOriginal: item.url });
						}
					} else {
						errCount++;
						const tipoError = err.response?.status === 404 ? '404 No encontrado' : 'Error de descarga';
						console.error(`❌ ${tipoError}: ${path.basename(destino)}`);
						const statusCode = err.response?.status || 'UNKNOWN';
						logErrorToFile(`Descarga recurso local (${urlLimpia}):\n${err.stack || err}`, true, statusCode);
					}
				} else {
					console.warn(`⚠️  Reintentando descarga de ${urlLimpia} (intento ${intentos + 1}/3)...`);
					await new Promise((resolve) => setTimeout(resolve, 1000));
				}
			}
		}
	}
	
	// Procesar archivos CSS descargados para encontrar recursos adicionales
	if (archivosCSS.length > 0) {
		console.log(`🎨 Procesando ${archivosCSS.length} archivos CSS locales para recursos adicionales...`);
		// Para recursos locales, crear conjuntos temporales para nuevos recursos
		const urlsExternasTemp = new Set();
		const extMapTemp = {};
		
		for (const cssInfo of archivosCSS) {
			await procesarRecursosCss(cssInfo.archivo, cssInfo.urlOriginal, siteName, urlsExternasTemp, extMapTemp);
		}
	}
	
	// Procesar archivos JavaScript para corregir URLs de protocolo relativo
	console.log(`🔧 Procesando archivos JavaScript para corregir protocolo relativo...`);
	await procesarJavaScriptFiles(siteName, recursosEspeciales, html);
	
	// Buscar recursos adicionales en archivos de texto (JS, JSON, XML, CSV, TXT)
	console.log(`🔍 Buscando recursos adicionales en archivos de texto...`);
	await buscarRecursosEnArchivos(siteName, urlBase, urlsExternas, extMap);
}

// Función para procesar archivos JavaScript y corregir URLs de protocolo relativo
async function procesarJavaScriptFiles(siteName, recursosEspeciales, html) {
	const siteDir = path.join(sitesDir, siteName);
	const jsFiles = [];
	
	// Buscar todos los archivos .js de forma recursiva
	function buscarJSRecursivo(dirPath) {
		try {
			const items = fs.readdirSync(dirPath, { withFileTypes: true });
			for (const item of items) {
				const fullPath = path.join(dirPath, item.name);
				if (item.isDirectory()) {
					buscarJSRecursivo(fullPath);
				} else if (item.name.toLowerCase().endsWith('.js')) {
					jsFiles.push(fullPath);
				}
			}
		} catch (err) {
			// Ignorar errores de acceso
		}
	}
	
	buscarJSRecursivo(siteDir);
	
	if (jsFiles.length === 0) {
		return;
	}
	
	console.log(`📄 Procesando ${jsFiles.length} archivos JavaScript...`);
	
	for (const jsFile of jsFiles) {
		try {
			const contenido = fs.readFileSync(jsFile, 'utf8');
			let contenidoModificado = contenido;
			
			// Agregar configuración jQuery al inicio para prevenir cache-busting
			// Solo agregar la configuración si el archivo contiene jQuery o $ 
			if (contenido.includes('jQuery') || contenido.includes('$') || contenido.includes('getScript')) {
				const configCode = `
// Configuración para prevenir cache-busting automático en jQuery
if (typeof jQuery !== "undefined" || typeof $ !== "undefined") {
	(function($) {
		if ($ && $.ajaxSetup) {
			$.ajaxSetup({ cache: true });
		}
		// Interceptar getScript para recursos locales
		if ($ && $.getScript) {
			const originalGetScript = $.getScript;
			$.getScript = function(url, callback) {
				// Si es un recurso local, limpiar cualquier timestamp
				if (url && !url.match(/^https?:/)) {
					url = url.replace(/[?&]_=\\d+/g, "");
					url = url.replace(/[?&][a-zA-Z_]*=\\d{10,}/g, "");
				}
				return originalGetScript.call(this, url, callback);
			};
		}
	})(window.jQuery || window.$);
}

`;
				contenidoModificado = configCode + contenido;
				if (debugMode) {
					console.log(`   🔧 Configuración jQuery agregada a: ${path.basename(jsFile)}`);
				}
			}
			
			// Convertir URLs de protocolo relativo que no sean permitidas a HTTPS
			// Buscar todas las URLs que empiecen con //
			const protocolRelativePattern = /(['"`])\/\/([^'"`\s\)]+)/g;
			
			contenidoModificado = contenidoModificado.replace(protocolRelativePattern, (match, quote, url) => {
				// Si es una URL que debe permanecer externa (como Google APIs), convertir a HTTPS
				if (url.includes('googleapis.com') || url.includes('google.com') || 
					url.includes('fontawesome.com') || url.includes('jsdelivr.net') ||
					url.includes('cdnjs.cloudflare.com') || url.includes('unpkg.com') ||
					url.includes('ajax.googleapis.com') || url.includes('webfont.js') ||
					url.includes('cdn.tailwindcss.com') || url.includes('bootstrapcdn.com') ||
					url.includes('jquery.com') || url.includes('polyfill.io') ||
					url.includes('stripe.com') || url.includes('paypal.com') ||
					url.includes('recaptcha.net') || url.includes('gstatic.com') ||
					url.includes('typekit.net') || url.includes('adobe.com') ||
					url.includes('google-analytics.com') || url.includes('googletagmanager.com') ||
					url.includes('hotjar.com') || url.includes('mixpanel.com') ||
					url.includes('segment.com') || url.includes('amplitude.com')) {
					if (debugMode) {
						console.log(`   🔧 Protocolo relativo convertido: //${url} → https://${url}`);
					}
					return quote + 'https://' + url;
				}
				return match; // Mantener otros casos sin cambios
			});
			
			// También buscar patrón específico sin comillas (para casos como jfload)
			const protocolRelativeNoQuotesPattern = /(\(\s*)\/\/([^'"`\s\),]+)/g;
			contenidoModificado = contenidoModificado.replace(protocolRelativeNoQuotesPattern, (match, start, url) => {
				if (url.includes('googleapis.com') || url.includes('ajax.googleapis.com') || 
					url.includes('webfont.js') || url.includes('google.com') ||
					url.includes('cdn.tailwindcss.com') || url.includes('cdn.jsdelivr.net') ||
					url.includes('cdnjs.cloudflare.com') || url.includes('unpkg.com') ||
					url.includes('bootstrapcdn.com') || url.includes('fontawesome.com') ||
					url.includes('jquery.com') || url.includes('polyfill.io')) {
					if (debugMode) {
						console.log(`   🔧 Protocolo relativo sin comillas convertido: //${url} → https://${url}`);
					}
					return start + "'https://" + url + "'";
				}
				return match;
			});
			
			// Limpiar URLs que empiecen con file:// y convertirlas según corresponda
			const fileProtocolPattern = /(['"`])file:\/\/([^'"`\s\)]+)/gi;
			contenidoModificado = contenidoModificado.replace(fileProtocolPattern, (match, quote, url) => {
				// Si es una URL de Google APIs, convertir a HTTPS
				if (url.includes('googleapis.com') || url.includes('ajax.googleapis.com') || 
					url.includes('fonts.googleapis.com') || url.includes('webfont.js')) {
					return quote + 'https://' + url.replace(/^[^\/]*\/\//, '');
				}
				// Para otros casos, intentar convertir a ruta relativa local
				const pathPart = url.replace(/^.*\/sites\/[^\/]+\//, '');
				return quote + pathPart;
			});
			
			// También buscar y corregir URLs dinámicas comunes con parámetros de tiempo
			// Patrón para detectar: "archivo.js?" + algo (como timestamp)
			const timestampPattern = /(['"`])([^'"`\s\)]+\.js\?[^'"`\s\)]*)/gi;
			contenidoModificado = contenidoModificado.replace(timestampPattern, (match, quote, url) => {
				// Remover parámetros timestamp para referencias locales
				if (!url.includes('://')) {
					const urlLimpia = url.split('?')[0];
					if (debugMode) {
						console.log(`   🔧 Timestamp removido: ${url} → ${urlLimpia}`);
					}
					return quote + urlLimpia;
				}
				return match;
			});
			
			// Limpiar parámetros de timestamp específicos como ?_=número
			const timestampSpecificPattern = /(\?_=\d+)/g;
			contenidoModificado = contenidoModificado.replace(timestampSpecificPattern, '');
			
			// Limpiar cualquier parámetro de consulta con números largos (timestamps)
			const queryTimestampPattern = /(\?[a-zA-Z_]*=\d{10,})/g;
			contenidoModificado = contenidoModificado.replace(queryTimestampPattern, '');
			
			// Limpiar construcciones dinámicas específicas que generen timestamps
			// Buscar patrones como: algo + "?" + variable_timestamp o algo + "&" + variable_timestamp
			const dynamicTimestampPattern = /(\+\s*["'`][?&][^"'`]*["'`])/g;
			contenidoModificado = contenidoModificado.replace(dynamicTimestampPattern, '');
			
			// Eliminar referencias a cache: false en configuraciones Ajax/getScript
			contenidoModificado = contenidoModificado.replace(/cache\s*:\s*false/g, 'cache: true');
			contenidoModificado = contenidoModificado.replace(/cache\s*:\s*!1/g, 'cache: true');
			
			// Eliminar código que agrega timestamps automáticamente
			const autoTimestampPattern = /[+&]\s*["'`][?&]_=["'`]\s*\+[^;,)}\]]+/g;
			contenidoModificado = contenidoModificado.replace(autoTimestampPattern, '');
			
			// Interceptar específicamente getMultiScripts y similar
			const getMultiScriptsPattern = /(getMultiScripts\s*:\s*function\s*\([^)]*\)\s*{[^}]*getScript[^}]*)/gi;
			contenidoModificado = contenidoModificado.replace(getMultiScriptsPattern, (match) => {
				return match.replace(/\?\s*["'`][^"'`]*["'`]\s*\+[^;,)}\]]+/g, '');
			});
			
			// También buscar y eliminar construcciones de timestamp en todas las funciones getScript
			const getScriptTimestampPattern = /(\w+\.getScript\s*\(\s*[^,)]+)\s*\+\s*["'`][?&][^"'`]*["'`][^,)]*(\s*[,)])/g;
			contenidoModificado = contenidoModificado.replace(getScriptTimestampPattern, '$1$2');
			
			// También buscar patrones de carga dinámica con timestamps
			const loadDynamicPattern = /(\w+\s*\+\s*['"`][^'"`]*\?[^'"`]*['"`])/gi;
			contenidoModificado = contenidoModificado.replace(loadDynamicPattern, (match) => {
				// Si contiene timestamp, limpiar
				if (match.includes('?_=')) {
					const cleaned = match.replace(/\?[^'"`]*/g, '');
					if (debugMode) {
						console.log(`   🔧 Carga dinámica limpiada: ${match} → ${cleaned}`);
					}
					return cleaned;
				}
				return match;
			});
			
			// Buscar y limpiar construcciones dinámicas de URLs con timestamps
			const dynamicUrlPattern = /(['"`][^'"`]*\.js['"`]\s*\+\s*['"`]\?[^'"`]*['"`])/gi;
			contenidoModificado = contenidoModificado.replace(dynamicUrlPattern, (match) => {
				// Extraer solo la parte del archivo sin timestamp
				const cleaned = match.split('+')[0].replace(/['"`]/g, '') + '"';
				if (debugMode) {
					console.log(`   🔧 URL dinámica limpiada: ${match} → ${cleaned}`);
				}
				return '"' + cleaned.replace(/"/g, '');
			});
			
			// Buscar cualquier construcción que genere timestamps dinámicos
			const timestampGenerationPattern = /\?\w*=\s*\+?\s*(?:new\s+Date\(\)\.getTime\(\)|Date\.now\(\)|\d+)/gi;
			contenidoModificado = contenidoModificado.replace(timestampGenerationPattern, '');
			
			// Limpiar referencias específicas a URLs con ?_= 
			const specificTimestampPattern = /(['"`][^'"`]*\.js\?_=)[^'"`]*(['"`])/gi;
			contenidoModificado = contenidoModificado.replace(specificTimestampPattern, (match, start, end) => {
				const cleaned = start.replace(/\?\w*=.*$/, '') + end;
				if (debugMode) {
					console.log(`   🔧 Timestamp específico removido: ${match} → ${cleaned}`);
				}
				return cleaned;
			});
			
			// Buscar y limpiar cualquier concatenación que genere URLs con timestamp
			const concatTimestampPattern = /(['"`][^'"`]*\.js['"`]\s*\+\s*['"`]\?[^'"`]*['"`])/gi;
			contenidoModificado = contenidoModificado.replace(concatTimestampPattern, (match) => {
				const basePart = match.split('+')[0].trim();
				if (debugMode) {
					console.log(`   🔧 Concatenación timestamp removida: ${match} → ${basePart}`);
				}
				return basePart;
			});
			
			// Eliminar cualquier generación de timestamp con Date.now() o getTime()
			const dateTimestampPattern = /\+\s*['"`]\?[^'"`]*['"`]\s*\+\s*(?:Date\.now\(\)|new\s+Date\(\)\.getTime\(\))/gi;
			contenidoModificado = contenidoModificado.replace(dateTimestampPattern, '');
			
			// Limpiar cualquier ?_= seguido de números
			const numericTimestampPattern = /\?_=\d+/gi;
			contenidoModificado = contenidoModificado.replace(numericTimestampPattern, '');
			
			// Corregir cargas dinámicas de scripts que pueden causar problemas CORS
			// Buscar patrones como $.getScript() con URLs que contienen timestamps
			const getScriptPattern = /(\$\.getScript\s*\(\s*['"`])([^'"`]+\?[^'"`]*?)(['"`])/gi;
			contenidoModificado = contenidoModificado.replace(getScriptPattern, (match, start, url, end) => {
				// Limpiar timestamp de la URL
				const urlLimpia = url.split('?')[0];
				if (debugMode) {
					console.log(`   🔧 $.getScript URL limpiada: ${url} → ${urlLimpia}`);
				}
				return start + urlLimpia + end;
			});
			
			// Buscar y corregir XMLHttpRequest URLs que pueden tener timestamps
			const xhrPattern = /(\.open\s*\(\s*['"`][^'"`]*['"`]\s*,\s*['"`])([^'"`]+\?[^'"`]*?)(['"`])/gi;
			contenidoModificado = contenidoModificado.replace(xhrPattern, (match, start, url, end) => {
				// Limpiar timestamp de la URL
				const urlLimpia = url.split('?')[0];
				if (debugMode) {
					console.log(`   🔧 XHR URL limpiada: ${url} → ${urlLimpia}`);
				}
				return start + urlLimpia + end;
			});
			
			// Buscar patrones específicos de jfload u otras funciones similares
			const jfloadPattern = /(jfload\s*\(\s*)(['"`]?)\/\/([^'"`\s\),]+)(['"`]?)/gi;
			contenidoModificado = contenidoModificado.replace(jfloadPattern, (match, funcStart, startQuote, url, endQuote) => {
				if (url.includes('googleapis.com') || url.includes('ajax.googleapis.com') || 
					url.includes('webfont.js') || url.includes('google.com')) {
					if (debugMode) {
						console.log(`   🔧 jfload URL corregida: //${url} → https://${url}`);
					}
					return funcStart + "'https://" + url + "'";
				}
				return match;
			});
			
			// Buscar también patrón genérico de funciones con URLs de protocolo relativo
			const functionUrlPattern = /(\w+\s*\(\s*)(['"`]?)\/\/([^'"`\s\),]+)(['"`]?)(\s*,)/gi;
			contenidoModificado = contenidoModificado.replace(functionUrlPattern, (match, funcStart, startQuote, url, endQuote, trailing) => {
				if (url.includes('googleapis.com') || url.includes('ajax.googleapis.com') || 
					url.includes('webfont.js') || url.includes('google.com') ||
					url.includes('cdn.tailwindcss.com') || url.includes('cdn.jsdelivr.net') ||
					url.includes('cdnjs.cloudflare.com') || url.includes('unpkg.com') ||
					url.includes('bootstrapcdn.com') || url.includes('fontawesome.com') ||
					url.includes('jquery.com') || url.includes('polyfill.io') ||
					url.includes('stripe.com') || url.includes('recaptcha.net')) {
					if (debugMode) {
						console.log(`   🔧 Función URL corregida: //${url} → https://${url}`);
					}
					return funcStart + "'https://" + url + "'" + trailing;
				}
				return match;
			});
			
			// Solo escribir si hay cambios
			if (contenidoModificado !== contenido) {
				fs.writeFileSync(jsFile, contenidoModificado, 'utf8');
				const relativePath = path.relative(siteDir, jsFile);
				console.log(`   ✅ JavaScript corregido: ${relativePath}`);
			}
			
		} catch (err) {
			console.warn(`⚠️  Error procesando ${jsFile}: ${err.message}`);
		}
	}
	
	// Procesar videos de YouTube detectados en backgrounds
	if (recursosEspeciales.youtube && recursosEspeciales.youtube.length > 0) {
		console.log(`🎬 Procesando ${recursosEspeciales.youtube.length} video(s) de YouTube en backgrounds...`);
		await procesarVideosYouTube(recursosEspeciales.youtube, siteName, html);
	}
}

// Función para buscar recursos adicionales en archivos de texto (JS, JSON, XML, CSV, TXT)
async function buscarRecursosEnArchivos(siteName, urlBase, urlsExternas, extMap) {
	const siteDir = path.join(sitesDir, siteName);
	const archivosTexto = [];
	const recursosEncontrados = new Set();
	
	// Buscar todos los archivos de texto de forma recursiva
	function buscarArchivosTextoRecursivo(dirPath) {
		try {
			const items = fs.readdirSync(dirPath, { withFileTypes: true });
			for (const item of items) {
				const fullPath = path.join(dirPath, item.name);
				if (item.isDirectory()) {
					buscarArchivosTextoRecursivo(fullPath);
				} else {
					const extension = item.name.toLowerCase().split('.').pop();
					if (['js', 'json', 'xml', 'csv', 'txt', 'md', 'config', 'manifest'].includes(extension)) {
						archivosTexto.push(fullPath);
					}
				}
			}
		} catch (err) {
			// Ignorar errores de acceso
		}
	}
	
	buscarArchivosTextoRecursivo(siteDir);
	
	if (archivosTexto.length === 0) {
		return;
	}
	
	console.log(`📄 Analizando ${archivosTexto.length} archivos de texto en busca de recursos...`);
	
	// Patrones para detectar recursos en archivos de texto
	const patronesRecursos = [
		// URLs completas
		/https?:\/\/[^\s'"<>{}[\]\\|^`\u0000-\u001f\u007f-\u009f]+\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|otf|pdf|mp4|mp3|webm|ogg)/gi,
		// Rutas relativas de recursos
		/[./]*[^'"<>\s]*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|otf|pdf|mp4|mp3|webm|ogg)(?:[?#][^\s'"<>]*)?/gi,
		// Patrones específicos para fuentes en CSS/JS strings
		/['"`]([^'"`]*\.(woff2?|ttf|eot|otf|svg))(?:[?#][^'"`]*)?['"`]/gi,
		// Patrones para imágenes en JSON/config
		/['"`]([^'"`]*\.(png|jpg|jpeg|gif|svg|ico|webp))(?:[?#][^'"`]*)?['"`]/gi,
		// URLs en configuraciones JSON
		/"((?:https?:)?\/\/[^"]*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|otf))"/gi
	];
	
	for (const archivo of archivosTexto) {
		try {
			const contenido = fs.readFileSync(archivo, 'utf8');
			const extension = path.extname(archivo).toLowerCase();
			const archivoRelativo = path.relative(siteDir, archivo);
			
			// Buscar recursos usando los patrones
			for (const patron of patronesRecursos) {
				let match;
				while ((match = patron.exec(contenido)) !== null) {
					let recursoUrl = match[1] || match[0];
					
					// Limpiar la URL
					recursoUrl = recursoUrl.replace(/^['"`]|['"`]$/g, '').trim();
					
					// Saltar si es muy corta o inválida
					if (recursoUrl.length < 3 || recursoUrl.includes(' ')) continue;
					
					// Construir URL completa si es necesario
					let urlCompleta;
					if (recursoUrl.startsWith('http://') || recursoUrl.startsWith('https://')) {
						urlCompleta = recursoUrl;
					} else if (recursoUrl.startsWith('//')) {
						urlCompleta = 'https:' + recursoUrl;
					} else {
						// Intentar construir URL relativa al sitio
						const urlBase = urlsExternas.values().next().value || 'https://example.com';
						try {
							const baseUrl = new URL(urlBase);
							if (recursoUrl.startsWith('/')) {
								urlCompleta = baseUrl.origin + recursoUrl;
							} else {
								// Para rutas relativas, intentar desde el directorio del archivo
								const directorioArchivo = path.dirname(archivoRelativo).replace(/\\/g, '/');
								if (directorioArchivo === '.') {
									urlCompleta = baseUrl.origin + '/' + recursoUrl;
								} else {
									urlCompleta = baseUrl.origin + '/' + directorioArchivo + '/' + recursoUrl;
								}
							}
						} catch {
							continue; // Saltar si no se puede construir URL
						}
					}
					
					// Verificar si es un recurso descargable y no está ya en la lista
					if (esRecursoDescargable(urlCompleta) && !urlsExternas.has(urlCompleta)) {
						recursosEncontrados.add(urlCompleta);
						console.log(`📎 Recurso encontrado en ${archivoRelativo}: ${path.basename(urlCompleta)}`);
					}
				}
			}
			
		} catch (err) {
			// Ignorar errores de lectura de archivos binarios o corruptos
		}
	}
	
	// Descargar los recursos encontrados
	if (recursosEncontrados.size > 0) {
		console.log(`📥 Descargando ${recursosEncontrados.size} recursos adicionales encontrados...`);
		
		for (const recursoUrl of recursosEncontrados) {
			if (!urlsExternas.has(recursoUrl)) {
				urlsExternas.add(recursoUrl);
				
				// Crear mapeo para la ruta local
				let recursoPath;
				try {
					const parsed = new URL(recursoUrl);
					recursoPath = decodeURIComponent(parsed.pathname);
				} catch {
					recursoPath = recursoUrl.replace(/^https?:\/\/[^/]+/, '').split('?')[0].split('#')[0];
				}
				
				if (!recursoPath.startsWith('/')) recursoPath = '/' + recursoPath;
				
				// Normalizar ruta
				let extPath;
				try {
					const urlObj = new URL(recursoUrl);
					let normalizedPath = recursoPath.startsWith('/') ? recursoPath.substring(1) : recursoPath;
					
					// Extraer carpetas relevantes
					if (normalizedPath.includes('assets/')) {
						const assetsIndex = normalizedPath.indexOf('assets/');
						normalizedPath = normalizedPath.substring(assetsIndex);
					} else if (normalizedPath.match(/\/(js|css|img|images|fonts|font)\//)) {
						const match = normalizedPath.match(/.*\/(js|css|img|images|fonts|font)\//);
						if (match) {
							const startIndex = normalizedPath.indexOf(match[1]);
							normalizedPath = normalizedPath.substring(startIndex);
						}
					}
					
					extPath = normalizedPath;
				} catch {
					extPath = path.posix.join('zideback', recursoPath);
				}
				
				extMap[recursoUrl] = extPath;
				
				// Descargar el recurso
				const destino = path.join(sitesDir, siteName, ...extPath.split('/'));
				fs.mkdirSync(path.dirname(destino), { recursive: true });
				
				let intentos = 0;
				let descargado = false;
				while (intentos < 3 && !descargado) {
					try {
						const urlLimpia = limpiarUrlParametros(recursoUrl);
						const response = await axios.get(urlLimpia, { responseType: 'arraybuffer' });
						fs.writeFileSync(destino, response.data);
						console.log(`📦 Recurso adicional descargado: ${path.basename(destino)}`);
						totalFilesDownloaded++;
						descargado = true;
					} catch (err) {
						intentos++;
						if (intentos >= 3) {
							const reemplazado = manejarErrorDescarga(recursoUrl, destino, err);
							if (reemplazado) {
								descargado = true;
								console.log(`   ✅ Reemplazo creado: ${path.basename(destino)}`);
							} else {
								errCount++;
								console.error(`❌ Error descargando: ${path.basename(destino)}`);
							}
						} else {
							console.warn(`⚠️  Reintentando descarga ${recursoUrl} (intento ${intentos + 1}/3)...`);
							await new Promise((resolve) => setTimeout(resolve, 1000));
						}
					}
				}
			}
		}
	}
}

// Función para buscar recursos referenciados en el código JavaScript/HTML
async function buscarRecursosEnCodigo(html, urlBase, siteName, urlsExternas, extMap) {
	const recursosEncontrados = new Set();
	const dominioBase = new URL(urlBase).origin;
	
	// Buscar en scripts inline por referencias a archivos
	const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
	let scriptMatch;
	
	while ((scriptMatch = scriptPattern.exec(html)) !== null) {
		const scriptContent = scriptMatch[1];
		
		// Buscar referencias a archivos CSS/JS en strings
		const filePatterns = [
			/["']([^"']+\.css)["']/gi,
			/["']([^"']+\.js)["']/gi,
			/["']([^"']+\.(woff2?|ttf|eot|svg))["']/gi
		];
		
		for (const pattern of filePatterns) {
			let fileMatch;
			while ((fileMatch = pattern.exec(scriptContent)) !== null) {
				const archivo = fileMatch[1];
				
				// Solo procesar rutas relativas
				if (!archivo.startsWith('http') && !archivo.startsWith('//') && 
					!archivo.includes('googleapis.com')) {
					
					let urlCompleta;
					if (archivo.startsWith('/')) {
						urlCompleta = dominioBase + archivo;
					} else {
						urlCompleta = urlBase.endsWith('/') ? urlBase + archivo : urlBase + '/' + archivo;
					}
					
					if (esRecursoDescargable(urlCompleta)) {
						recursosEncontrados.add({ url: urlCompleta, path: archivo });
					}
				}
			}
		}
	}
	
	// Buscar en comentarios o variables específicas (para owl-carousel, etc.)
	const comentarioPattern = /(?:\/\*[\s\S]*?\*\/|\/\/.*$)/gm;
	const htmlSinComentarios = html.replace(comentarioPattern, '');
	
	// Buscar referencias específicas a owl-carousel
	if (htmlSinComentarios.includes('owl-carousel') || htmlSinComentarios.includes('owl.carousel')) {
		const owlPath = 'assets/lib/owl-carousel/owl.carousel.css';
		const owlUrl = urlBase.endsWith('/') ? urlBase + owlPath : urlBase + '/' + owlPath;
		if (esRecursoDescargable(owlUrl)) {
			recursosEncontrados.add({ url: owlUrl, path: owlPath });
		}
	}
	
	if (recursosEncontrados.size > 0) {
		console.log(`   📋 Encontrados ${recursosEncontrados.size} recursos en código`);
		
		for (const item of recursosEncontrados) {
			urlsExternas.add(item.url);
			extMap[item.url] = item.path;
		}
	}
}

async function descargarRecursosExternos(urlsExternas, extMap, siteName) {
	if (urlsExternas.size === 0) return;

	console.log('🌐 Descargando recursos externos detectados...');
	const archivosCSS = [];
	
	for (const extUrl of urlsExternas) {
		const mapped = extMap[extUrl];
		if (!mapped) continue;

		const destino = path.join(sitesDir, siteName, ...mapped.split('/'));
		fs.mkdirSync(path.dirname(destino), { recursive: true });

		// Limpiar la URL de parámetros antes de descargar
		const urlLimpia = limpiarUrlParametros(extUrl);

		let intentos = 0;
		let descargado = false;
		while (intentos < 3 && !descargado) {
			try {
				const response = await axios.get(urlLimpia, { responseType: 'arraybuffer' });
				fs.writeFileSync(destino, response.data);
				console.log(`📝 Recurso externo descargado: ${destino}`);
				totalFilesDownloaded++; // Incrementar contador global
				totalRecursosExternos++; // Incrementar contador de recursos externos
				descargado = true;
				
				// Si es un archivo CSS, agregarlo a la lista para procesarlo después
				if (extUrl.toLowerCase().endsWith('.css')) {
					archivosCSS.push({ archivo: destino, urlOriginal: extUrl });
				}
				
			} catch (err) {
				intentos++;
				if (intentos >= 3) {
					// Intentar crear archivo de reemplazo antes de marcar como error
					const reemplazado = manejarErrorDescarga(urlLimpia, destino, err);
					if (reemplazado) {
						descargado = true;
						console.log(`   ✅ Reemplazo externo creado: ${path.basename(destino)}`);
						
						// Si es un archivo CSS, agregarlo a la lista para procesarlo después
						if (extUrl.toLowerCase().endsWith('.css')) {
							archivosCSS.push({ archivo: destino, urlOriginal: extUrl });
						}
					} else {
						errCount++;
						const tipoError = err.response?.status === 404 ? '404 No encontrado' : 'Error de descarga';
						console.error(`❌ ${tipoError}: ${path.basename(destino)}`);
						const statusCode = err.response?.status || 'UNKNOWN';
						logErrorToFile(`Descarga recurso externo (${urlLimpia}):\n${err.stack || err}`, true, statusCode);
					}
				} else {
					console.warn(`⚠️  Reintentando descarga de ${urlLimpia} (intento ${intentos + 1}/3)...`);
					await new Promise((resolve) => setTimeout(resolve, 1000));
				}
			}
		}
	}
	
	// Procesar archivos CSS descargados para encontrar recursos adicionales
	if (archivosCSS.length > 0) {
		console.log(`🎨 Procesando ${archivosCSS.length} archivos CSS para recursos adicionales...`);
		for (const cssInfo of archivosCSS) {
			await procesarRecursosCss(cssInfo.archivo, cssInfo.urlOriginal, siteName, urlsExternas, extMap);
		}
	}
}

// Función para procesar videos de YouTube en backgrounds
async function procesarVideosYouTube(videosYoutube, siteName, html) {
	const siteDir = path.join(sitesDir, siteName);
	
	for (const video of videosYoutube) {
		try {
			console.log(`🎬 Procesando video de YouTube: ${video.videoId}`);
			
			// Crear el HTML del iframe de YouTube para background (sin controles)
			const iframeHTML = `
<!-- Video de YouTube embebido como background (ID: ${video.videoId}) -->
<iframe 
	width="100%" 
	height="100%" 
	src="https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&playlist=${video.videoId}" 
	frameborder="0" 
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
	style="pointer-events: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
</iframe>`;
			
			// Crear archivo separado para el video
			const videoFileName = `youtube-video-${video.videoId}.html`;
			const videoFilePath = path.join(siteDir, videoFileName);
			
			const videoPageHTML = `<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Background Video - ${video.videoId}</title>
	<style>
		body { 
			margin: 0; 
			padding: 0; 
			background: #000; 
			overflow: hidden;
		}
		.video-background { 
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: -1;
			pointer-events: none;
		}
		.video-background iframe {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 100vw;
			height: 56.25vw; /* 16:9 aspect ratio */
			min-height: 100vh;
			min-width: 177.77vh; /* 16:9 aspect ratio */
			transform: translate(-50%, -50%);
			pointer-events: none;
		}
		/* Overlay para contenido si es necesario */
		.content-overlay {
			position: relative;
			z-index: 1;
			background: rgba(0,0,0,0.3);
			height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
		}
	</style>
</head>
<body>
	<div class="video-background">
		${iframeHTML}
	</div>
	<div class="content-overlay">
		<h1>Video Background</h1>
		<p>ID: ${video.videoId}</p>
	</div>
	<script>
		// Video background específico - autoplay y loop automático
		document.addEventListener('DOMContentLoaded', function() {
			// Asegurar que el video se reproduce como background
			const iframe = document.querySelector('iframe');
			
			// Recargar el iframe después de un momento para asegurar autoplay
			setTimeout(function() {
				const currentSrc = iframe.src;
				iframe.src = currentSrc; // Trigger reload for autoplay
			}, 1000);
		});
		
		// Prevenir cualquier interacción con el video background
		document.addEventListener('click', function(e) {
			e.preventDefault();
			return false;
		});
	</script>
</body>
</html>`;
			
			fs.writeFileSync(videoFilePath, videoPageHTML, 'utf8');
			console.log(`✅ Video de YouTube guardado: ${videoFileName}`);
			
		} catch (err) {
			console.error(`❌ Error procesando video ${video.videoId}:`, err.message);
		}
	}
}

async function clonarPagina(paginaUrl, siteName, tempFile, finalFile, visitados = new Set(), urlBaseParaRecursos = null, paginasInternasGlobal = null, tiempoEspera = 8) {
	console.log('🟡 [DEBUG] INICIO de clonarPagina para URL:', paginaUrl);
	if (!debugMode) {
		visitados.add('susitio.cl');
	} else if (visitados.has(paginaUrl)) {
		console.log('⚠️  URL ya procesada, se omite:', paginaUrl);
		return null;
	}
	visitados.add(paginaUrl);

	console.log('🔍 [DEBUG] A punto de mostrar mensaje inicio navegador...');
	console.log(obtenerMensaje('iniciando_navegador', IDIOMA_SISTEMA));
	console.log('🔍 [DEBUG] A punto de inicializar Puppeteer...');
	const browser = await puppeteer.launch({ 
		headless: true,
		timeout: 60000, // Timeout de 60 segundos para el lanzamiento
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
	});
	console.log(obtenerMensaje('navegador_iniciado', IDIOMA_SISTEMA));

	const page = await browser.newPage();
	// Configurar timeouts de la página
	page.setDefaultNavigationTimeout(180000); // 3 minutos para navegación
	page.setDefaultTimeout(180000); // 3 minutos para operaciones generales
	console.log(obtenerMensaje('abriendo_pagina', IDIOMA_SISTEMA));

	// Capturar recursos adicionales que se cargan dinámicamente
	const recursosAdicionales = new Set();
	
	page.on('request', (request) => {
		const requestUrl = request.url();
		// Solo capturar recursos JavaScript y CSS que se cargan dinámicamente
		if ((requestUrl.includes('.js') || requestUrl.includes('.css')) && 
			!requestUrl.includes('google') && !requestUrl.includes('analytics') &&
			!requestUrl.includes('facebook') && !requestUrl.includes('twitter')) {
			recursosAdicionales.add(requestUrl);
		}
	});

	// Navegar a la página principal con loader integrado
	console.log('🌐 Iniciando carga de página...');
	
	try {
		// Iniciar la navegación y el loader al mismo tiempo
		const navegacionPromise = page.goto(paginaUrl, { waitUntil: 'networkidle2', timeout: 180000 }); // 3 minutos
		
		// Crear un loader AZUL que se actualiza de forma compatible con Windows
		let navegacionCompleta = false;
		let loaderInterval;
		let ultimaLinea = '';
		
		const loaderPromise = new Promise((resolve) => {
			const tiempoInicio = Date.now();
			
			loaderInterval = setInterval(() => {
				if (navegacionCompleta) {
					clearInterval(loaderInterval);
					// Mostrar barra completa antes de terminar
					const barraCompleta = '🔵'.repeat(20);
					const lineaFinal = `   [${barraCompleta}] 100% - ✅ Completado`;
					
					// Limpiar última línea y mostrar final
					if (ultimaLinea) {
						process.stdout.write('\x1b[1A\x1b[2K');
					}
					console.log(lineaFinal);
					resolve();
					return;
				}
				
				const tiempoTranscurrido = Date.now() - tiempoInicio;
				const porcentaje = Math.min(Math.floor(tiempoTranscurrido / 80), 95);
				
				const longitudBarra = 20; // Reducir para mejor rendimiento
				const guiones = Math.floor((porcentaje / 100) * longitudBarra);
				const espacios = longitudBarra - guiones;
				
				// AZUL para el primer loader usando emojis
				const barraCompleta = '🔵'.repeat(guiones);
				const barraVacia = '⚪'.repeat(espacios);
				const porcentajeTexto = `${porcentaje.toString().padStart(3)}%`;
				const tiempoTexto = `${Math.floor(tiempoTranscurrido / 1000)}s`;
				
				const linea = `   [${barraCompleta}${barraVacia}] ${porcentajeTexto} - ${tiempoTexto}`;
				
				// Método compatible con Windows: usar \r\n para mejor control
				if (ultimaLinea) {
					// Subir una línea y limpiar
					process.stdout.write('\x1b[1A\x1b[2K');
				}
				process.stdout.write(linea + '\n');
				ultimaLinea = linea;
			}, 300); // Menos frecuente para mejor rendimiento en Windows
		});
		
		// Esperar a que termine la navegación
		await navegacionPromise;
		navegacionCompleta = true;
		
		// Asegurar que el loader se detenga inmediatamente
		if (loaderInterval) {
			clearInterval(loaderInterval);
		}
		
		console.log(obtenerMensaje('pagina_cargada', IDIOMA_SISTEMA) + ' ' + paginaUrl);
		
		// === MEJORA v3.0: Espera adicional para contenido dinámico ===
		console.log(obtenerMensaje('esperando_contenido', IDIOMA_SISTEMA));
		
		// Scroll completo para activar lazy loading
		await page.evaluate(() => {
			return new Promise((resolve) => {
				let totalHeight = 0;
				const distance = 100;
				const timer = setInterval(() => {
					const scrollHeight = document.body.scrollHeight;
					window.scrollBy(0, distance);
					totalHeight += distance;
					
					if(totalHeight >= scrollHeight){
						clearInterval(timer);
						// Volver arriba después del scroll
						window.scrollTo(0, 0);
						resolve();
					}
				}, 100);
			});
		});
		
		// Espera adicional para elementos dinámicos específicos
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		// Intentar esperar elementos comunes dinámicos (sin fallar si no existen)
		try {
			await page.waitForSelector('.accordion, .faq, .collapsible, .dynamic-content, [data-toggle], .tabs-content', {timeout: 3000});
			console.log('✅ Contenido dinámico detectado y cargado');
		} catch (e) {
			console.log('📝 No se detectó contenido dinámico específico (normal en sitios estáticos)');
		}
		
		// Ejecutar scripts adicionales para expandir acordeones y contenido oculto
		await page.evaluate(() => {
			// Expandir todos los elementos colapsables comunes
			const triggers = document.querySelectorAll('[data-toggle="collapse"], .accordion-trigger, .faq-trigger, .collapsible-header');
			triggers.forEach(trigger => {
				try {
					trigger.click();
				} catch (e) {
					// Ignorar errores de click
				}
			});
			
			// Mostrar contenido oculto común
			const hiddenElements = document.querySelectorAll('.hidden, .d-none, [style*="display: none"], [style*="display:none"]');
			hiddenElements.forEach(el => {
				try {
					el.style.display = 'block';
					el.style.visibility = 'visible';
					el.classList.remove('hidden', 'd-none');
				} catch (e) {
					// Ignorar errores de manipulación
				}
			});
		});
		
		// Espera final para que se rendericen los cambios
		await new Promise(resolve => setTimeout(resolve, 1000));
		console.log('✅ Procesamiento de contenido dinámico completado');
		
		// === ESPERA ADICIONAL CONFIGURABLE PARA CONTENIDO DINÁMICO ===
		const tiempoEsperaDinamicoMs = tiempoEspera * 1000; // Convertir segundos a milisegundos
		console.log(`⏰ Espera adicional de ${tiempoEspera} segundos para carga completa de contenido dinámico...`);
		
		// Asegurar duración mínima del loader verde para que sea visible (mínimo 500ms)
		const duracionLoaderMs = Math.max(tiempoEsperaDinamicoMs, 500);
		await mostrarCargando('⏳ Finalizando carga de contenido dinámico', duracionLoaderMs);
		
	} catch (err) {
		errCount++;
		console.error(`❌ No es posible acceder a ${paginaUrl}. Verifica la URL o tu conexión.`);
		logErrorToFile(`Puppeteer error en page.goto(${paginaUrl}):\n${err.stack || err}`);
		await browser.close();
		throw err;
	}

	console.log(obtenerMensaje('guardando_html', IDIOMA_SISTEMA));
	const html = await page.content();
	fs.mkdirSync(sitesDir, { recursive: true });
	fs.writeFileSync(tempFile, html, 'utf8');

	const urlsExternas = new Set();
	const extMap = {};
	// Usar urlBaseParaRecursos si está disponible, sino usar paginaUrl
	const urlBase = urlBaseParaRecursos || (paginaUrl.endsWith('/') ? paginaUrl.slice(0, -1) : paginaUrl);

	console.log(obtenerMensaje('procesando_rutas', IDIOMA_SISTEMA) + ' ' + finalFile);
	const nuevoHtml = procesarRutas(html, SSL, urlBase, urlsExternas, extMap);
	console.log(obtenerMensaje('rutas_procesadas', IDIOMA_SISTEMA));

	// 🚀 SOLUCIÓN GLOBAL: Verificar y corregir elementos del preloader sin estilos
	// TODO: Implementar verificarYCorregirPreloader y verificarYCorregirFuentes
	let htmlConPreloaderCorregido = nuevoHtml; // Temporalmente sin corrección
	let htmlConFuentesCorregidas = htmlConPreloaderCorregido; // Temporalmente sin corrección

	fs.mkdirSync(path.dirname(finalFile), { recursive: true });
	fs.writeFileSync(finalFile, htmlConFuentesCorregidas, 'utf8');
	console.log(`💾 HTML final guardado en: ${finalFile}`);
	totalFilesDownloaded++; // Incrementar contador global
	totalPaginas++; // Incrementar contador de páginas
	
	// La página se registrará después con los recursos reales

	// Descargar recursos locales del sitio
	await descargarRecursosLocales(html, urlBase, siteName, urlsExternas, extMap);

	// Buscar recursos adicionales en el HTML que pueden estar referenciados dinámicamente
	console.log(`🔍 Buscando recursos referenciados en el código...`);
	await buscarRecursosEnCodigo(html, urlBase, siteName, urlsExternas, extMap);

	// Procesar recursos adicionales capturados dinámicamente
	if (recursosAdicionales.size > 0) {
		console.log(`🔄 Procesando ${recursosAdicionales.size} recursos dinámicos adicionales...`);
		for (const recursoUrl of recursosAdicionales) {
			try {
				// Verificar si es un recurso del mismo dominio o uno descargable
				const urlObj = new URL(recursoUrl);
				const urlBase_obj = new URL(urlBase);
				
				if (urlObj.hostname === urlBase_obj.hostname || esRecursoDescargable(recursoUrl)) {
					urlsExternas.add(recursoUrl);
					
					// Crear mapeo para la ruta local
					let recursoPath = decodeURIComponent(urlObj.pathname);
					if (!recursoPath.startsWith('/')) recursoPath = '/' + recursoPath;
					
					let extPath;
					if (urlObj.hostname === urlBase_obj.hostname) {
						// Mismo dominio - normalizar ruta para evitar carpetas duplicadas
						let normalizedPath = recursoPath.startsWith('/') ? recursoPath.substring(1) : recursoPath;
						
						// Si la ruta contiene subdirectorios antes de assets/, extraer solo assets/ hacia adelante
						// Esto maneja casos como "Boots4/assets/css/theme.css" -> "assets/css/theme.css"
						if (normalizedPath.includes('assets/')) {
							const assetsIndex = normalizedPath.indexOf('assets/');
							normalizedPath = normalizedPath.substring(assetsIndex);
						}
						// Si la ruta contiene subdirectorios antes de js/, css/, img/, fonts/, extraer desde ahí
						else if (normalizedPath.match(/\/(js|css|img|images|fonts|font)\//)) {
							const match = normalizedPath.match(/.*\/(js|css|img|images|fonts|font)\//);
							if (match) {
								const startIndex = normalizedPath.indexOf(match[1]);
								normalizedPath = normalizedPath.substring(startIndex);
							}
						}
						
						extPath = normalizedPath;
					} else {
						// Dominio externo - guardar en zideback
						extPath = path.posix.join('zideback', recursoPath);
					}
					
					extMap[recursoUrl] = extPath;
					console.log(`   📦 Recurso dinámico detectado: ${path.basename(recursoPath)}`);
				}
			} catch (err) {
				// Ignorar URLs malformadas
				if (debugMode) {
					console.warn(`⚠️  URL dinámica ignorada: ${recursoUrl}`);
				}
			}
		}
	}

	// Descargar recursos externos (si los hay)
	await descargarRecursosExternos(urlsExternas, extMap, siteName);

	// Actualizar todos los CSS locales para corregir rutas con parámetros
	await actualizarCssLocales(siteName, urlBase);
	
	// Corregir automáticamente paths de imágenes de fondo en CSS
	await corregirPathsImagenesCSS(siteName, urlBase);

	try {
		if (fs.existsSync(tempFile)) {
			fs.unlinkSync(tempFile);
		}
	} catch (err) {
		errCount++;
		console.warn(`⚠️  No se pudo eliminar el temporal ${tempFile}: ${err.message}`);
		logErrorToFile(`Error eliminando temporal (${tempFile}):\n${err.stack || err}`);
	}

	await browser.close();
	
	// Nuevo: Procesar enlaces internos si DEEP_CRAWL está habilitado
	let paginasInternas = paginasInternasGlobal || [];
	if (DEEP_CRAWL) {
		console.log('🔍 Buscando páginas internas...');
		// Usar la URL original para resolución correcta de enlaces relativos
		// Solo agregar '/' si la URL termina en un directorio (sin extensión)
		let urlBaseParaEnlaces = paginaUrl;
		if (!paginaUrl.includes('.') && !paginaUrl.endsWith('/')) {
			urlBaseParaEnlaces = paginaUrl + '/';
		}
		const enlacesInternos = extraerEnlacesInternos(html, urlBaseParaEnlaces, urlBaseParaEnlaces);
		
		if (enlacesInternos.length > 0) {
			console.log(`📋 Encontradas ${enlacesInternos.length} páginas internas para procesar`);
			// Limitar el número de páginas para evitar bucles infinitos
			const enlacesLimitados = enlacesInternos.slice(0, MAX_PAGINAS_INTERNAS);
			if (enlacesInternos.length > MAX_PAGINAS_INTERNAS) {
				console.log(`⚠️  Limitando a ${MAX_PAGINAS_INTERNAS} páginas (de ${enlacesInternos.length} encontradas)`);
			}
			
			for (let i = 0; i < enlacesLimitados.length; i++) {
				const enlaceInterno = enlacesLimitados[i];
				
				if (!visitados.has(enlaceInterno)) {
					console.log(`🔗 Procesando página interna ${i + 1}/${enlacesInternos.length}: ${enlaceInterno}`);
					
					try {
						// Primero, validar que la página existe y no es 404
						console.log(`   📥 Descargando para validación...`);
						
						const responseValidacion = await axios.get(enlaceInterno, {
							timeout: 30000,
							headers: {
								'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
							},
							validateStatus: function (status) {
								return status >= 200 && status < 400; // Solo aceptar códigos de éxito
							}
						});
						
						// Validar el contenido descargado
						if (!esContenidoValido(responseValidacion.data, enlaceInterno)) {
							console.warn(`   ❌ Página inválida o 404 detectada, omitiendo: ${enlaceInterno}`);
							visitados.add(enlaceInterno); // Marcar como visitado para evitar reintento
							continue;
						}
						
						console.log(`   ✅ Contenido válido detectado`);
						
						// Crear nombre de archivo para la página interna
						const urlInternaObj = new URL(enlaceInterno);
						let nombreArchivo = urlInternaObj.pathname;
						
						// Extraer solo el nombre del archivo HTML (última parte de la ruta)
						if (nombreArchivo.endsWith('/')) {
							nombreArchivo += 'index.html';
						} else if (!nombreArchivo.endsWith('.html')) {
							nombreArchivo += '.html';
						}
						
						// Obtener solo el nombre del archivo final
						nombreArchivo = path.basename(nombreArchivo);
						if (!nombreArchivo || nombreArchivo === '.html') nombreArchivo = 'index.html';
						
						const archivoTempInterno = path.join(sitesDir, `temp_${nombreArchivo}`);
						const archivoFinalInterno = path.join(sitesDir, siteName, nombreArchivo);
						
						console.log(`   📄 Guardando como: ${nombreArchivo}`);
						totalFilesDownloaded++; // Incrementar contador global
						totalPaginas++; // Incrementar contador de páginas
						
						// Procesar la página interna recursivamente
						// IMPORTANTE: Para páginas internas, usar la URL base del sitio (sin el archivo HTML)
						const urlBaseParseada = new URL(paginaUrl);
						let urlBaseRecursos;
						
						// Si la URL termina en .html, usar solo el directorio base
						if (urlBaseParseada.pathname.endsWith('.html')) {
							// Para https://prium.github.io/Boots4/nav-eight-item-four-column.html
							// usar https://prium.github.io/Boots4/
							const pathParts = urlBaseParseada.pathname.split('/');
							pathParts.pop(); // Remover el archivo .html
							const basePath = pathParts.join('/') + '/';
							urlBaseRecursos = urlBaseParseada.origin + basePath;
						} else {
							// Si no es un archivo HTML, mantener la ruta completa
							urlBaseRecursos = urlBaseParseada.origin + urlBaseParseada.pathname;
							if (!urlBaseRecursos.endsWith('/')) {
								urlBaseRecursos += '/';
							}
						}
						const resultadoInterno = await clonarPagina(enlaceInterno, siteName, archivoTempInterno, archivoFinalInterno, visitados, urlBaseRecursos, paginasInternas, tiempoEspera);
						
						if (resultadoInterno) {
							paginasInternas.push({
								url: enlaceInterno,
								archivo: archivoFinalInterno,
								archivoLocal: nombreArchivo,
								recursos: resultadoInterno.externalResources
							});
							
							// Registrar en el array global
							paginasDescargadas.push({
								nombre: nombreArchivo,
								recursos: resultadoInterno.externalResources
							});
							
							console.log(`   ✅ Página interna procesada correctamente`);
						} else {
							console.warn(`   ⚠️  Error al procesar página interna (sin resultado)`);
						}
						
					} catch (err) {
						errCount++;
						if (err.response && err.response.status === 404) {
							console.warn(`   ❌ Página 404 confirmada: ${enlaceInterno}`);
						} else {
							console.warn(`   ⚠️  Error procesando página interna ${enlaceInterno}: ${err.message}`);
						}
						logErrorToFile(`Error en página interna (${enlaceInterno}):\n${err.stack || err}`);
						visitados.add(enlaceInterno); // Marcar como visitado para evitar reintento
					}
				} else {
					console.log(`   ⏭️  Página ya visitada: ${enlaceInterno}`);
				}
			}
			
			// NO actualizar enlaces internos aquí - lo haremos en el flujo principal
			
			if (paginasInternas.length > 0) {
				console.log(`🎉 Procesamiento completado: ${paginasInternas.length} páginas internas descargadas correctamente`);
			} else {
				console.log(`📭 No se pudieron descargar páginas internas válidas`);
			}
		} else {
			console.log(`📭 No se encontraron páginas internas válidas para procesar`);
		}
	}
	
	console.log('🟢 [DEBUG] FIN de clonarPagina para URL:', paginaUrl);

	return {
		finalFilePath: finalFile,
		siteDir: path.join(sitesDir, siteName),
		externalResources: urlsExternas.size,
		paginasInternas: paginasInternas
	};
}

(async () => {
// CÓDIGO DE PROCESAMIENTO PRINCIPAL
	try {
		// Procesar URL especificada o error
		if (!urlEspecificada) {
			console.error('❌ Error: No se especificó URL');
			process.exit(1);
		}
		
		// Procesar URL sin protocolo si es necesario
		url = urlEspecificada;
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			// Lógica simple para agregar protocolo
			if (url.startsWith('localhost') || /^\d+\.\d+\.\d+\.\d+/.test(url)) {
				url = 'http://' + url;
			} else {
				url = 'https://' + url;
			}
		}
		
		console.log(`✅ URL procesada: ${url}`);

		SSL = url.startsWith('https://');

		let urlSinProtocolo = url.replace(/^https?:\/\//, '');
		const portMatch = urlSinProtocolo.match(/:(\d+)(?:\/|$)/);
		if (portMatch) {
			urlSinProtocolo = urlSinProtocolo.replace(`:${portMatch[1]}`, '');
		}

		// Crear nombre de carpeta basado en el dominio
		let urlParts = urlSinProtocolo.split('/');
		let baseName = urlParts[0].replace(/\./g, '_'); // dominio principal
		
		// Si hay una ruta específica significativa (como /Boots4/), agregar al nombre del dominio
		if (urlParts.length > 1 && urlParts[1] && urlParts[1] !== '' && urlParts[1] !== 'index.html') {
			baseName = `${urlParts[0].replace(/\./g, '_')}_${urlParts[1]}`; // ej: biztech_com_boots4
		}
		
		let siteName = baseName;
		let counter = 1;
		while (fs.existsSync(path.join(sitesDir, siteName))) {
			siteName = `${baseName}_${String(counter).padStart(3, '0')}`;
			counter++;
		}

		const urlPath = urlSinProtocolo.split('/').slice(1).join('/');
		let tempUrl;
		
		if (!urlPath || urlPath.endsWith('/')) {
			// URL termina en / o no tiene ruta - es index
			const pathParts = urlPath.split('/').filter(p => p.length > 0);
			if (pathParts.length > 0) {
				// URLs como /home-page-03/ -> home-page-03
				tempUrl = pathParts[pathParts.length - 1];
			} else {
				// URL raíz -> index
				tempUrl = 'index';
			}
		} else {
			// URL tiene ruta específica
			const lastPart = urlPath.split('/').pop();
			
			if (lastPart.includes('.')) {
				// Ya tiene extensión, usar el nombre sin extensión
				tempUrl = lastPart.split('.')[0];
			} else {
				// URLs amigables sin extensión - usar el nombre completo
				tempUrl = lastPart;
			}
		}
		
		const tempFile = path.join(sitesDir, `${tempUrl}.html`);
		const finalFile = path.join(sitesDir, siteName, `${tempUrl}.html`);

		const resultado = await clonarPagina(url, siteName, tempFile, finalFile, new Set(), null, null, tiempoEsperaDinamico);

		if (resultado) {
			// Descargar fuentes detectadas al final del proceso
			await descargarFuentesDetectadas();
			
			console.log('✅ Proceso completado exitosamente.');
			console.log(`📁 Carpeta del sitio: ${resultado.siteDir}`);
			console.log(`📄 Archivo principal: ${resultado.finalFilePath}`);
			
			// Registrar página principal al final (debe ir primero en la lista)
			paginasDescargadas.unshift({
				nombre: path.basename(resultado.finalFilePath),
				recursos: resultado.externalResources
			});
			
			// Mostrar detalle de páginas descargadas
			if (paginasDescargadas.length > 0) {
				console.log(`\n� PÁGINAS HTML DESCARGADAS:`);
				paginasDescargadas.forEach((pagina, index) => {
					console.log(`   ${index + 1}. ${pagina.nombre} (${pagina.recursos} recursos)`);
				});
			}
			
			// Banner final con estadísticas
			console.log(`\n🚀 ════════════════════════════════════════════════════════════════`);
			console.log(`�    ZiteBackJS v${VERSION} - Sistema Revolucionario de URLs sin Protocolo    🌐`);
			console.log(`   📊 DESCARGAS: ${totalPaginas} Páginas - ${totalRecursosExternos} Externas - ${totalFilesDownloaded} Totales`);
			console.log(`   🎯 Modo: ${MODO_OPERACION === 'site' ? 'Sitio Completo' : 'Página Única'} | ${DEEP_CRAWL ? 'Crawling habilitado' : 'Crawling deshabilitado'}`);
			console.log(`   ✨ NUEVA FUNCIONALIDAD: Procesamiento Universal de URLs sin Protocolo ✨`);
			console.log(`   🔧 NUEVA FUNCIONALIDAD: Corrección Automática de Preloaders Rotos ✨`);
			console.log(`   🔤 NUEVA FUNCIONALIDAD: Detección y Corrección Automática de Fuentes ✨`);
			console.log(`🚀 ════════════════════════════════════════════════════════════════`);
			
			// 📧 Enviar notificación de éxito
			try {
				const tiempoTotal = Date.now() - tiempoInicio;
				const duracionFormateada = `${Math.round(tiempoTotal / 1000)}s`;
				
				await notificador.enviarNotificacion('exito', {
					sitio: url,
					carpeta: siteName,
					paginas: totalPaginas,
					recursos: totalRecursosExternos,
					duracion: duracionFormateada
				});
				
				console.log('📧 Notificación de éxito enviada');
			} catch (emailError) {
				console.log('⚠️ No se pudo enviar notificación por email');
			}
		}

	} catch (err) {
		console.error(`❌ Error durante la clonación: ${err.message}`);
		console.error(`📄 Detalles del error: ${err.stack || err}`);
		
		// 📧 Enviar notificación de error
		try {
			await notificador.enviarNotificacion('error', {
				sitio: url,
				error: err.message,
				detalles: err.stack ? err.stack.split('\n').slice(0, 3).join('\n') : 'No disponible'
			});
			
			console.log('📧 Notificación de error enviada');
		} catch (emailError) {
			console.log('⚠️ No se pudo enviar notificación de error por email');
		}
		
		// Mostrar mensajes finales incluso en caso de error
		console.log('\n🚀 ════════════════════════════════════════════════════════════════');
		console.log(`🎬    ZiteBackJS v${VERSION} - Proceso terminado con errores    ❌`);
		console.log('🚀 ════════════════════════════════════════════════════════════════');
		
		process.exit(1);
	}
})();
}

// === INICIALIZACIÓN ===
// Si no estamos en modo interactivo, iniciar procesamiento directamente
if (MODO_OPERACION && urlEspecificada) {
	console.log('🚀 [DEBUG] Llamando a iniciarProcesamiento()...');
	iniciarProcesamiento();
}