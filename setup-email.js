#!/usr/bin/env node

/**
 * 🔧 Configurador Avanzado de Email - ZiteBackJS v3.9.1
 * Configuración completa de notificaciones por email con múltiples opciones
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🔧 Configurador de Email - ZiteBackJS v3.9.1');
console.log('==============================================\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function pregunta(texto) {
    return new Promise((resolve) => {
        rl.question(texto, resolve);
    });
}

function mostrarInfo() {
    console.log('📧 ¿Qué es SendGrid y por qué es tan efectivo?\n');
    console.log('📊 SendGrid es un servicio profesional de envío de emails que garantiza:');
    console.log('   ✅ 99% de emails llegan a la BANDEJA DE ENTRADA (no spam)');
    console.log('   🚀 Envío instantáneo y confiable');
    console.log('   📈 Estadísticas detalladas de entrega');
    console.log('   🔒 Autenticación SPF/DKIM para evitar spam');
    console.log('   💰 100 emails/día GRATIS para siempre');
    console.log('   🌍 Infraestructura global\n');
    
    console.log('🆚 Comparación con otras opciones:');
    console.log('   📧 Gmail/Outlook personal: Limitado, puede ir a spam');
    console.log('   🐘 PHP mail(): Frecuentemente bloqueado como spam');
    console.log('   ⭐ SendGrid: Profesional, diseñado para aplicaciones\n');
}

async function configurarSendGrid() {
    console.log('🔑 Proceso para obtener tu API Key de SendGrid:\n');
    
    const necesitaAyuda = await pregunta('¿Necesitas ayuda para obtener tu API de SendGrid? (s/n): ');
    
    if (necesitaAyuda.toLowerCase().startsWith('s')) {
        console.log('\n📋 Guía paso a paso para crear cuenta y obtener API Key:\n');
        
        console.log('1️⃣ CREAR CUENTA GRATUITA:');
        console.log('   • Ve a: https://sendgrid.com');
        console.log('   • Click "Start for Free"');
        console.log('   • Llena el formulario (usa email real)');
        console.log('   • Verifica tu email');
        console.log('   • Completa la verificación de cuenta\n');
        
        console.log('2️⃣ VERIFICAR DOMINIO/EMAIL:');
        console.log('   • En el dashboard: Settings > Sender Authentication');
        console.log('   • Si tienes dominio: "Authenticate Your Domain"');
        console.log('   • Si no: "Single Sender Verification" con tu email\n');
        
        console.log('3️⃣ CREAR API KEY:');
        console.log('   • Ve a: Settings > API Keys');
        console.log('   • Click "Create API Key"');
        console.log('   • Nombre: "ZiteBackJS-Notifications"');
        console.log('   • Tipo: "Restricted Access"');
        console.log('   • Mail Send: "Full Access" ✅');
        console.log('   • Guardar y COPIAR la key (solo se muestra una vez!)\n');
        
        await pregunta('Presiona ENTER cuando hayas completado todos los pasos...');
    }
    
    console.log('\n🔑 Ahora vamos a configurar tu API Key:\n');
    
    const apiKey = await pregunta('🔐 Pega tu API Key de SendGrid (empieza con SG.): ');
    
    if (!apiKey || !apiKey.startsWith('SG.')) {
        console.log('❌ Error: La API Key debe empezar con "SG."');
        return false;
    }
    
    const emailFrom = await pregunta('📤 Email FROM (desde donde se envían, ej: noreply@susitio.cl): ');
    const emailTo = await pregunta('📥 Email TO (donde recibir notificaciones, ej: tu@gmail.com): ');
    const domain = await pregunta('🌐 Tu dominio (ej: susitio.cl): ');
    
    return { apiKey, emailFrom, emailTo, domain, tipo: 'sendgrid' };
}

async function configurarPHPMailer() {
    console.log('🐘 Configuración de PHP Mailer:\n');
    
    const necesitaAyuda = await pregunta('¿Necesitas ayuda para configurar PHP Mailer? (s/n): ');
    
    if (necesitaAyuda.toLowerCase().startsWith('s')) {
        console.log('\n📋 Guía paso a paso para PHP Mailer:\n');
        
        console.log('1️⃣ CONFIGURAR GMAIL/SMTP:');
        console.log('   • Ve a: https://myaccount.google.com/security');
        console.log('   • Habilita "Verificación en 2 pasos" (OBLIGATORIO)');
        console.log('   • Ve a "Contraseñas de aplicaciones"');
        console.log('   • Selecciona app: "Correo" y dispositivo: "Otro"');
        console.log('   • Escribe: "ZiteBackJS" como nombre');
        console.log('   • Gmail generará una contraseña de 16 caracteres');
        console.log('   • ¡IMPORTANTE! Usa esa contraseña, NO tu contraseña normal\\n');
        
        console.log('2️⃣ INFORMACIÓN NECESARIA:');
        console.log('   • Host SMTP: smtp.gmail.com');
        console.log('   • Puerto: 587 (TLS recomendado) o 465 (SSL)');
        console.log('   • Usuario: tu email completo');
        console.log('   • Contraseña: la contraseña de aplicación generada\n');
    }
    
    const smtpHost = await pregunta('🌐 Host SMTP (presiona ENTER para smtp.gmail.com): ') || 'smtp.gmail.com';
    
    console.log('\n🔌 Selecciona el puerto SMTP:');
    console.log('   1. Puerto 587 (TLS) - Recomendado para Gmail');
    console.log('   2. Puerto 465 (SSL) - Alternativo');
    const puertoOpcion = await pregunta('Elige opción (1 o 2): ');
    const smtpPort = puertoOpcion === '2' ? '465' : '587';
    
    const smtpUser = await pregunta('👤 Tu email completo (ej: tu@gmail.com): ');
    const smtpPass = await pregunta('🔑 Contraseña de aplicación (16 caracteres de Google): ');
    const emailTo = await pregunta('📥 Email destino para notificaciones: ');
    
    return { 
        smtpHost, 
        smtpPort, 
        smtpUser, 
        smtpPass, 
        emailFrom: smtpUser, 
        emailTo, 
        tipo: 'phpmailer' 
    };
}

async function configurarBasico() {
    console.log('📧 Configuración básica con función mail() nativa:\n');
    console.log('⚠️ IMPORTANTE: Esta opción puede tener problemas de entregabilidad');
    console.log('   Los emails pueden ir a spam o no llegar\n');
    
    const emailFrom = await pregunta('📤 Email FROM (ej: noreply@tudominio.com): ');
    const emailTo = await pregunta('📥 Email TO (donde recibir notificaciones): ');
    
    return { emailFrom, emailTo, tipo: 'basic' };
}

function generarConfiguracion(config) {
    let envContent = `# Configuración de Email para ZiteBackJS
# ESTE ARCHIVO ESTÁ EN .GITIGNORE - Datos reales configurados
# Configurado automáticamente el ${new Date().toLocaleString()}
# Charset: ${config.charset || 'utf-8'}

EMAIL_CHARSET=${config.charset || 'utf-8'}
`;

    switch (config.tipo) {
        case 'sendgrid':
            envContent += `# SendGrid Configuration
SENDGRID_API_KEY=${config.apiKey}
SENDGRID_FROM=${config.emailFrom}
SENDGRID_TO=${config.emailTo}
SENDGRID_DOMAIN=${config.domain}
EMAIL_SERVICE=sendgrid\n`;
            break;
            
        case 'phpmailer':
            envContent += `# PHP Mailer Configuration
SMTP_HOST=${config.smtpHost}
SMTP_PORT=${config.smtpPort}
SMTP_USER=${config.smtpUser}
SMTP_PASS=${config.smtpPass}
EMAIL_FROM=${config.emailFrom}
EMAIL_TO=${config.emailTo}
EMAIL_SERVICE=phpmailer\n`;
            break;
            
        case 'basic':
            envContent += `# Basic Mail Configuration
EMAIL_FROM=${config.emailFrom}
EMAIL_TO=${config.emailTo}
EMAIL_SERVICE=basic\n`;
            break;
    }
    
    envContent += `\nNODE_ENV=production`;
    
    return envContent;
}

async function configurarEmail() {
    try {
        mostrarInfo();
        
        // Preguntar sobre charset
        console.log('🔤 Configuración de codificación de caracteres:\n');
        const usarUTF8 = await pregunta('¿Deseas utilizar UTF-8 como charset? (s/n) [Recomendado: s]: ');
        let charset = 'utf-8';
        
        if (!usarUTF8.toLowerCase().startsWith('s')) {
            charset = await pregunta('🔤 Ingresa el charset que deseas usar (ej: iso-8859-1, windows-1252): ') || 'utf-8';
        }
        
        console.log(`✅ Charset seleccionado: ${charset}\n`);
        
        const usarSendGrid = await pregunta('¿Deseas usar SendGrid para el envío de correos? (s/n): ');
        
        let config;
        
        if (usarSendGrid.toLowerCase().startsWith('s')) {
            config = await configurarSendGrid();
            if (!config) return;
            config.charset = charset;
        } else {
            const usarPHPMailer = await pregunta('¿Usarás PHP Mailer? (s/n): ');
            
            if (usarPHPMailer.toLowerCase().startsWith('s')) {
                config = await configurarPHPMailer();
                config.charset = charset;
            } else {
                const usarBasico = await pregunta('¿Configurar email básico con función mail()? (s/n): ');
                
                if (usarBasico.toLowerCase().startsWith('s')) {
                    config = await configurarBasico();
                    config.charset = charset;
                } else {
                    console.log('⏭️ Saltando configuración de email. ZiteBackJS funcionará sin notificaciones.');
                    return;
                }
            }
        }
        
        // Generar archivo .env
        const envContent = generarConfiguracion(config);
        fs.writeFileSync('.env', envContent);
        
        console.log('\n✅ ¡Configuración de email completada!');
        console.log('📄 Archivo .env creado con tu configuración');
        console.log('🔒 Este archivo está en .gitignore (no se sube a GitHub)');
        
        if (config.tipo === 'sendgrid') {
            console.log('\n🧪 Prueba tu configuración ejecutando:');
            console.log('   node test-sendgrid-real.js');
        }
        
        console.log('\n🎉 ¡ZiteBackJS ya puede enviar notificaciones por email!');
        console.log('📧 Recibirás emails cuando:');
        console.log('   • Se complete una descarga');
        console.log('   • Ocurra un error');
        console.log('   • Se detecten nuevos CDNs');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

configurarEmail();