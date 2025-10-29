const sgMail = require('@sendgrid/mail');

// Configurar SendGrid con variable de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'your-api-key-here');

/**
 * Enviar notificación cuando una descarga se completa
 * @param {string} siteName - Nombre del sitio descargado
 * @param {number} totalRecursos - Total de recursos descargados
 * @param {string} emailDestino - Email donde enviar la notificación
 * @param {Object} stats - Estadísticas adicionales de la descarga
 */
async function enviarNotificacionDescarga(siteName, totalRecursos, emailDestino, stats = {}) {
    const {
        totalPaginas = 0,
        totalRecursosExternos = 0,
        duracionMinutos = 0,
        modo = 'unknown'
    } = stats;

    const msg = {
        to: emailDestino,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL || 'noreply@ziteback.com',
            name: process.env.SENDGRID_FROM_NAME || 'ZiteBackJS'
        },
        subject: `✅ ZiteBackJS - Descarga completada: ${siteName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; color: #333; }
                    .header { background: linear-gradient(135deg, #0077b3, #cc3333); color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                    .stats { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
                    .footer { background: #e9ecef; padding: 10px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🌐 ZiteBackJS</h1>
                    <h2>Descarga completada exitosamente</h2>
                </div>
                
                <div class="content">
                    <h3>📊 Resumen de la descarga</h3>
                    
                    <div class="stats">
                        <p><strong>🌍 Sitio:</strong> ${siteName}</p>
                        <p><strong>📄 Páginas:</strong> ${totalPaginas}</p>
                        <p><strong>📦 Recursos totales:</strong> ${totalRecursos}</p>
                        <p><strong>🔗 Recursos externos:</strong> ${totalRecursosExternos}</p>
                        <p><strong>🎯 Modo:</strong> ${modo === 'site' ? 'Sitio Completo' : 'Página Única'}</p>
                        <p><strong>⏱️ Duración:</strong> ${duracionMinutos} minutos</p>
                        <p><strong>🕒 Finalizado:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    
                    <p>✨ El sitio ha sido descargado y procesado correctamente con todas sus dependencias.</p>
                </div>
                
                <div class="footer">
                    <p>ZiteBackJS v3.7.8 - Sistema Revolucionario de URLs sin Protocolo</p>
                    <p>🚀 Procesamiento Universal | 🔧 Preloaders Automáticos | 🔤 Fuentes Optimizadas</p>
                </div>
            </body>
            </html>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('📧 Notificación enviada correctamente a:', emailDestino);
        return true;
    } catch (error) {
        console.error('❌ Error enviando notificación:', error);
        return false;
    }
}

/**
 * Enviar notificación cuando ocurre un error
 * @param {string} siteName - Nombre del sitio que falló
 * @param {string} error - Descripción del error
 * @param {string} emailDestino - Email donde enviar la notificación
 */
async function enviarNotificacionError(siteName, error, emailDestino) {
    const msg = {
        to: emailDestino,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL || 'noreply@ziteback.com',
            name: process.env.SENDGRID_FROM_NAME || 'ZiteBackJS'
        },
        subject: `❌ ZiteBackJS - Error en descarga: ${siteName}`,
        html: `
            <h2>⚠️ Error en la descarga</h2>
            <p><strong>Sitio:</strong> ${siteName}</p>
            <p><strong>Error:</strong> ${error}</p>
            <p><strong>Hora:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <p><em>Revisa los logs para más detalles.</em></p>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('📧 Notificación de error enviada');
        return true;
    } catch (err) {
        console.error('❌ Error enviando notificación de error:', err);
        return false;
    }
}

module.exports = {
    enviarNotificacionDescarga,
    enviarNotificacionError
};