// ========================================
//  Y2Back API - Passenger Entry Point
// ========================================
//  Este archivo es el punto de entrada para
//  Phusion Passenger en hosting compartido (cPanel)
// ========================================

const { createApp } = require('./api/server.js');

// Passenger usa process.env.PORT automáticamente
// El puerto lo asigna el servidor, NO lo configuramos aquí
const port = process.env.PORT || 3000;

const app = createApp();

app.listen(port, '0.0.0.0', () => {
  console.log(`Y2Back API escuchando en puerto ${port}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Hora de inicio: ${new Date().toISOString()}`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});
