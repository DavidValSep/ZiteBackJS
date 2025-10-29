# Configuración de Email con SendGrid

## Variables de entorno necesarias

```bash
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=ZiteBackJS Notifier
```

## Ejemplo de configuración

```javascript
const sgMail = require('@sendgrid/mail');

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Enviar notificación de descarga completada
async function enviarNotificacionDescarga(siteName, totalRecursos, emailDestino) {
    const msg = {
        to: emailDestino,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: process.env.SENDGRID_FROM_NAME
        },
        subject: `✅ ZiteBackJS - Descarga completada: ${siteName}`,
        html: `
            <h2>🎉 Descarga completada exitosamente</h2>
            <p><strong>Sitio:</strong> ${siteName}</p>
            <p><strong>Recursos descargados:</strong> ${totalRecursos}</p>
            <p><strong>Hora de finalización:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <p><em>ZiteBackJS v3.7.8 - Sistema Revolucionario de URLs sin Protocolo</em></p>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('📧 Notificación enviada correctamente');
    } catch (error) {
        console.error('❌ Error enviando notificación:', error);
    }
}

module.exports = { enviarNotificacionDescarga };
```

## Instalación

```bash
npm install @sendgrid/mail
```