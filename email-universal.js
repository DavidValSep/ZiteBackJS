#!/usr/bin/env node#!/usr/bin/env node



/**/**

 * 📧 Sistema Universal de Notificaciones Email - ZiteBackJS v3.9.1 * 📧 Sistema Universal de Notificaciones Email - ZiteBackJS v3.9.1

 * Soporte para SendGrid, PHP Mailer y mail() básico * Soporte para SendGrid, PHP Mailer y mail() básico

 * Codificación: UTF-8 por defecto * Codificación: UTF-8 por defecto

 */ */



require('dotenv').config();require('dotenv').config();



const fs = require('fs');const fs = require('fs');

const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'sendgrid';const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'sendgrid';

const EMAIL_CHARSET = process.env.EMAIL_CHARSET || 'utf-8';const EMAIL_CHARSET = process.env.EMAIL_CHARSET || 'utf-8';



console.log(`📧 Iniciando sistema de email con charset: ${EMAIL_CHARSET}`);// Configuración para SendGrid

let sgMail;

// Configuración para SendGridif (EMAIL_SERVICE === 'sendgrid') {

let sgMail;    try {

if (EMAIL_SERVICE === 'sendgrid') {        sgMail = require('@sendgrid/mail');

    try {        if (process.env.SENDGRID_API_KEY) {

        sgMail = require('@sendgrid/mail');            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        if (process.env.SENDGRID_API_KEY) {        }

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);    } catch (error) {

        }        console.log('⚠️ SendGrid no disponible, instala con: npm install @sendgrid/mail');

    } catch (error) {    }

        console.log('⚠️ SendGrid no disponible, instala con: npm install @sendgrid/mail');}

    }

}// Configuración para PHP Mailer (usando nodemailer)

let nodemailer;

// Configuración para PHP Mailer (usando nodemailer)if (EMAIL_SERVICE === 'phpmailer') {

let nodemailer;    try {

if (EMAIL_SERVICE === 'phpmailer') {        nodemailer = require('nodemailer');

    try {    } catch (error) {

        nodemailer = require('nodemailer');        console.log('⚠️ Nodemailer no disponible, instala con: npm install nodemailer');

    } catch (error) {    }

        console.log('⚠️ Nodemailer no disponible, instala con: npm install nodemailer');}

    }

}/**

 * Enviar email usando SendGrid

/** */

 * Enviar email usando SendGridasync function enviarConSendGrid(destinatario, asunto, contenidoHTML) {

 */    if (!sgMail || !process.env.SENDGRID_API_KEY) {

async function enviarConSendGrid(destinatario, asunto, contenidoHTML) {        throw new Error('SendGrid no configurado correctamente');

    if (!sgMail || !process.env.SENDGRID_API_KEY) {    }

        throw new Error('SendGrid no configurado correctamente');

    }    const msg = {

        to: destinatario,

    const msg = {        from: {

        to: destinatario,            email: process.env.SENDGRID_FROM || 'noreply@ziteback.com',

        from: {            name: 'ZiteBackJS'

            email: process.env.SENDGRID_FROM || 'noreply@ziteback.com',        },

            name: 'ZiteBackJS'        subject: asunto,

        },        html: contenidoHTML

        subject: asunto,    };

        html: contenidoHTML

    };    await sgMail.send(msg);

    return true;

    await sgMail.send(msg);}

    return true;

}/**

 * Enviar email usando PHP Mailer (nodemailer)

/** */

 * Enviar email usando PHP Mailer (nodemailer)async function enviarConPHPMailer(destinatario, asunto, contenidoHTML) {

 */    if (!nodemailer) {

async function enviarConPHPMailer(destinatario, asunto, contenidoHTML) {        throw new Error('Nodemailer no disponible');

    if (!nodemailer) {    }

        throw new Error('Nodemailer no disponible');

    }    const transporter = nodemailer.createTransport({

        host: process.env.SMTP_HOST || 'smtp.gmail.com',

    const transporter = nodemailer.createTransport({        port: parseInt(process.env.SMTP_PORT) || 587,

        host: process.env.SMTP_HOST || 'smtp.gmail.com',        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports

        port: parseInt(process.env.SMTP_PORT) || 587,        auth: {

        secure: process.env.SMTP_PORT === '465',            user: process.env.SMTP_USER,

        auth: {            pass: process.env.SMTP_PASS

            user: process.env.SMTP_USER,        },

            pass: process.env.SMTP_PASS        // Configuración explícita de charset

        }        tls: {

    });            rejectUnauthorized: false

        }

    const mailOptions = {    });

        from: `"ZiteBackJS" <${process.env.EMAIL_FROM}>`,

        to: destinatario,    const mailOptions = {

        subject: asunto,        from: `"ZiteBackJS" <${process.env.EMAIL_FROM}>`,

        html: contenidoHTML,        to: destinatario,

        encoding: EMAIL_CHARSET        subject: asunto,

    };        html: contenidoHTML,

        encoding: EMAIL_CHARSET,

    await transporter.sendMail(mailOptions);        textEncoding: EMAIL_CHARSET

    return true;    };

}

    await transporter.sendMail(mailOptions);

/**    return true;

 * Función principal para enviar notificaciones}

 */

async function enviarNotificacion(tipo, datos) {/**

    try { * Enviar email usando función mail() básica (solo texto)

        const destinatario = process.env.EMAIL_TO || process.env.SENDGRID_TO || 'admin@localhost'; */

        let asunto, contenidoHTML;async function enviarConMailBasico(destinatario, asunto, contenidoHTML) {

    // Convertir HTML a texto plano básico

        switch (tipo) {    const contenidoTexto = contenidoHTML

            case 'descarga_completada':        .replace(/<h[1-6][^>]*>/gi, '\\n\\n')

                asunto = `✅ ZiteBackJS - Descarga completada: ${datos.siteName}`;        .replace(/<\/h[1-6]>/gi, '\\n')

                contenidoHTML = generarHTMLDescarga(datos);        .replace(/<p[^>]*>/gi, '\\n')

                break;        .replace(/<\/p>/gi, '\\n')

        .replace(/<br[^>]*>/gi, '\\n')

            case 'error_descarga':        .replace(/<[^>]*>/g, '')

                asunto = `❌ ZiteBackJS - Error en descarga: ${datos.siteName}`;        .replace(/\\n\\s*\\n/g, '\\n\\n')

                contenidoHTML = generarHTMLError(datos);        .trim();

                break;

    console.log('📧 EMAIL BÁSICO (Simulado):');

            default:    console.log('============================');

                throw new Error(`Tipo de notificación desconocido: ${tipo}`);    console.log(`Para: ${destinatario}`);

        }    console.log(`De: ${process.env.EMAIL_FROM}`);

    console.log(`Asunto: ${asunto}`);

        // Seleccionar método de envío según configuración    console.log('----------------------------');

        let resultado;    console.log(contenidoTexto);

        switch (EMAIL_SERVICE) {    console.log('============================');

            case 'sendgrid':    

                resultado = await enviarConSendGrid(destinatario, asunto, contenidoHTML);    // En un entorno real con PHP, aquí usarías la función mail()

                console.log('📧 Email enviado via SendGrid');    // mail($destinatario, $asunto, $contenidoTexto, $headers);

                break;    

    return true;

            case 'phpmailer':}

                resultado = await enviarConPHPMailer(destinatario, asunto, contenidoHTML);

                console.log('📧 Email enviado via PHP Mailer');/**

                break; * Función principal para enviar notificaciones

 */

            default:async function enviarNotificacion(tipo, datos) {

                throw new Error(`Servicio de email no configurado: ${EMAIL_SERVICE}`);    try {

        }        const destinatario = process.env.EMAIL_TO || process.env.SENDGRID_TO || 'admin@localhost';

        let asunto, contenidoHTML;

        return resultado;

        switch (tipo) {

    } catch (error) {            case 'descarga_completada':

        console.error('❌ Error enviando notificación:', error.message);                asunto = `✅ ZiteBackJS - Descarga completada: ${datos.siteName}`;

        return false;                contenidoHTML = generarHTMLDescarga(datos);

    }                break;

}

            case 'error_descarga':

/**                asunto = `❌ ZiteBackJS - Error en descarga: ${datos.siteName}`;

 * Generar HTML para notificación de descarga completada                contenidoHTML = generarHTMLError(datos);

 */                break;

function generarHTMLDescarga(datos) {

    return `<!DOCTYPE html>            case 'cdns_detectados':

<html lang="es">                asunto = `🔍 ZiteBackJS - CDNs detectados: ${datos.totalCDNs} encontrados`;

<head>                contenidoHTML = generarHTMLCDNs(datos);

    <meta charset="${EMAIL_CHARSET}">                break;

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Descarga Completada - ZiteBackJS</title>            default:

</head>                throw new Error(`Tipo de notificación desconocido: ${tipo}`);

<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">        }

    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">

        <h1 style="margin: 0; font-size: 24px;">🎉 Descarga Completada</h1>        // Seleccionar método de envío según configuración

    </div>        let resultado;

            switch (EMAIL_SERVICE) {

    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">            case 'sendgrid':

        <h2 style="color: #28a745; margin-top: 0;">📊 Resumen de la descarga</h2>                resultado = await enviarConSendGrid(destinatario, asunto, contenidoHTML);

        <p><strong>🌐 Sitio:</strong> ${datos.siteName}</p>                console.log('📧 Email enviado via SendGrid');

        <p><strong>📁 Recursos:</strong> ${datos.totalRecursos || 'No especificado'}</p>                break;

        <p><strong>📄 Páginas:</strong> ${datos.totalPaginas || 'No especificado'}</p>

        <p><strong>⏱️ Duración:</strong> ${datos.duracionMinutos || 'No especificado'} min</p>            case 'phpmailer':

        <p><strong>🕒 Completado:</strong> ${new Date().toLocaleString()}</p>                resultado = await enviarConPHPMailer(destinatario, asunto, contenidoHTML);

    </div>                console.log('📧 Email enviado via PHP Mailer');

                    break;

    <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">

    <p style="color: #6c757d; font-size: 12px; text-align: center;">            case 'basic':

        Enviado por ZiteBackJS v3.9.1 (Charset: ${EMAIL_CHARSET})                resultado = await enviarConMailBasico(destinatario, asunto, contenidoHTML);

    </p>                console.log('📧 Email básico enviado');

</body>                break;

</html>`;

}            default:

                throw new Error(`Servicio de email no configurado: ${EMAIL_SERVICE}`);

/**        }

 * Generar HTML para notificación de error

 */        return resultado;

function generarHTMLError(datos) {

    return `<!DOCTYPE html>    } catch (error) {

<html lang="es">        console.error('❌ Error enviando notificación:', error.message);

<head>        

    <meta charset="${EMAIL_CHARSET}">        // Guardar email fallido en archivo

    <title>Error en Descarga - ZiteBackJS</title>        const emailBackup = {

</head>            fecha: new Date().toISOString(),

<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">            servicio: EMAIL_SERVICE,

    <div style="background: #dc3545; color: white; padding: 20px; border-radius: 10px; text-align: center;">            tipo: tipo,

        <h1 style="margin: 0; font-size: 24px;">⚠️ Error en Descarga</h1>            destinatario: process.env.EMAIL_TO || 'unknown',

    </div>            datos: datos,

                error: error.message

    <div style="background: #f8d7da; color: #721c24; padding: 20px; border-radius: 10px; margin: 20px 0;">        };

        <h2 style="margin-top: 0;">❌ Detalles del error</h2>        

        <p><strong>🌐 Sitio:</strong> ${datos.siteName}</p>        const fs = require('fs');

        <p><strong>🐛 Error:</strong> ${datos.error}</p>        const backupFile = 'archive/email-fallback.json';

        <p><strong>🕒 Momento:</strong> ${new Date().toLocaleString()}</p>        

    </div>        try {

                let backups = [];

    <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">            if (fs.existsSync(backupFile)) {

    <p style="color: #6c757d; font-size: 12px; text-align: center;">                backups = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

        Enviado por ZiteBackJS v3.9.1 (Charset: ${EMAIL_CHARSET})            }

    </p>            backups.push(emailBackup);

</body>            fs.writeFileSync(backupFile, JSON.stringify(backups, null, 2));

</html>`;            console.log('📄 Email guardado en archivo de respaldo');

}        } catch (backupError) {

            console.error('❌ Error guardando respaldo:', backupError.message);

module.exports = {        }

    enviarNotificacion,        

    EMAIL_SERVICE,        return false;

    EMAIL_CHARSET    }

};}



// Test si se ejecuta directamente/**

if (require.main === module) { * Generar HTML para notificación de descarga completada

    console.log(`📧 Sistema de Email configurado: ${EMAIL_SERVICE.toUpperCase()}`); */

    console.log(`🔤 Charset: ${EMAIL_CHARSET}`);function generarHTMLDescarga(datos) {

    console.log('🧪 Para probar: node -e "require(\'./email-universal.js\').enviarNotificacion(\'descarga_completada\', {siteName: \'Test\'})"');    return `

}        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="${EMAIL_CHARSET}">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Descarga Completada - ZiteBackJS</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">`;
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">🎉 Descarga Completada</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #28a745; margin-top: 0;">📊 Resumen de la descarga</h2>
                <p><strong>🌐 Sitio:</strong> ${datos.siteName}</p>
                <p><strong>📁 Recursos descargados:</strong> ${datos.totalRecursos || 'No especificado'}</p>
                <p><strong>📄 Páginas procesadas:</strong> ${datos.totalPaginas || 'No especificado'}</p>
                <p><strong>⏱️ Duración:</strong> ${datos.duracionMinutos || 'No especificado'} minutos</p>
                <p><strong>🕒 Completado:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">
                    💡 <strong>Tip:</strong> Revisa la carpeta <code>sites/</code> para encontrar tu sitio descargado.
                </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="color: #6c757d; font-size: 12px; text-align: center;">
                Enviado por ZiteBackJS v3.9.1<br>
                ${new Date().toLocaleString()}
            </p>
        </body>
        </html>
    `;
}

/**
 * Generar HTML para notificación de error
 */
function generarHTMLError(datos) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Error en Descarga - ZiteBackJS</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">⚠️ Error en Descarga</h1>
            </div>
            
            <div style="background: #f8d7da; color: #721c24; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #f5c6cb;">
                <h2 style="margin-top: 0;">❌ Detalles del error</h2>
                <p><strong>🌐 Sitio:</strong> ${datos.siteName}</p>
                <p><strong>🐛 Error:</strong> ${datos.error}</p>
                <p><strong>🕒 Momento del error:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #ffeaa7;">
                <p style="margin: 0;">
                    💡 <strong>Sugerencias:</strong><br>
                    • Verifica que la URL sea correcta<br>
                    • Comprueba tu conexión a internet<br>
                    • El sitio podría estar temporalmente inaccesible
                </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="color: #6c757d; font-size: 12px; text-align: center;">
                Enviado por ZiteBackJS v3.9.1<br>
                ${new Date().toLocaleString()}
            </p>
        </body>
        </html>
    `;
}

/**
 * Generar HTML para notificación de CDNs detectados
 */
function generarHTMLCDNs(datos) {
    const cdnsList = datos.cdns ? datos.cdns.map(cdn => `<li><code>${cdn}</code></li>`).join('') : '';
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>CDNs Detectados - ZiteBackJS</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #007bff 0%, #6610f2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">🔍 CDNs Detectados</h1>
            </div>
            
            <div style="background: #d1ecf1; color: #0c5460; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #bee5eb;">
                <h2 style="margin-top: 0;">📊 Resumen del análisis</h2>
                <p><strong>🌐 Sitio analizado:</strong> ${datos.siteName}</p>
                <p><strong>🔗 Total CDNs encontrados:</strong> ${datos.totalCDNs}</p>
                <p><strong>🕒 Análisis realizado:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            ${datos.cdns && datos.cdns.length > 0 ? `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #495057; margin-top: 0;">📦 CDNs detectados:</h3>
                <ul style="padding-left: 20px;">
                    ${cdnsList}
                </ul>
            </div>
            ` : ''}
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="color: #6c757d; font-size: 12px; text-align: center;">
                Enviado por ZiteBackJS v3.9.1<br>
                ${new Date().toLocaleString()}
            </p>
        </body>
        </html>
    `;
}

module.exports = {
    enviarNotificacion,
    EMAIL_SERVICE
};

// Test si se ejecuta directamente
if (require.main === module) {
    console.log(`📧 Sistema de Email configurado: ${EMAIL_SERVICE.toUpperCase()}`);
    console.log('🧪 Para probar, ejecuta:');
    console.log('   node -e "require(\'./email-universal.js\').enviarNotificacion(\'descarga_completada\', {siteName: \'Test\', totalRecursos: 100})"');
}