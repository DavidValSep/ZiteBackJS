/*
 * ██████████████████████████████████████████████████████████████████████████████
 * █                       ZiteBackJS v3.0 - Mensajes                         █
 * █                   Módulo de Mensajes del Sistema                          █
 * ██████████████████████████████████████████████████████████████████████████████
 * 
 * 📋 INFORMACIÓN DEL MÓDULO:
 *    🎯 Nombre: ziteback-mensajes.js
 *    📊 Versión: 3.0.0
 *    📅 Fecha: 26 de octubre de 2025
 *    👨‍💻 Autor: DavidValSep
 *    📧 Email: davidvalsep@gmail.com
 *    🏢 Distribuidor: SuSitio (https://susitio.cl)
 *    
 * 🚀 PROPÓSITO:
 *    Centralización de todos los mensajes de consola y log del sistema ZiteBackJS.
 *    Facilita la personalización e internacionalización de la interfaz.
 *    
 * 📝 LICENCIA: GPL-3.0
 * 🔗 REPOSITORIO: https://github.com/zitebackjs/zitebackjs
 * 
 * ██████████████████████████████████████████████████████████████████████████████
 */

// Mensajes de consola y log para ZiteBackJS v3.1
// Puedes editar estos textos para personalizar la salida del script

module.exports = {
  version: "ZiteBackJS v3.0",
  inicioNavegador: "🚀 Iniciando navegador (Puppeteer)...",
  navegadorOk: "🟢 Navegador iniciado correctamente.",
  abriendoPagina: "🌐 Abriendo página principal...",
  paginaCargada: url => `📄 Página cargada correctamente: ${url}`,
  esperandoRecursos: "⏳ Esperando recursos dinámicos...",
  guardandoHtmlTemp: "💾 Guardando HTML temporal...",
  procesandoRutas: finalFile => `🔗 Procesando y reemplazando rutas de recursos para: ${finalFile}`,
  rutasProcesadas: "🔄 Rutas procesadas y reemplazadas.",
  descargandoInternos: "📦 Descargando recursos internos detectados en el HTML...",
  recursoInternoOk: path => `📝 Recurso interno descargado: ${path}`,
  descargandoExternos: "🌐 Descargando recursos externos detectados...",
  recursoExternoOk: path => `📝 Recurso externo descargado: ${path}`,
  archivoProcesado: path => `📝 Archivo procesado y guardado: ${path}...`,
  guardandoFinal: "💽 Guardando HTML final procesado...",
  eliminandoTemp: "🧹 Eliminando archivo temporal...",
  resumenOmitidos: "\n📋 Resumen de recursos omitidos (no estáticos):",
  procesoOk: finalFile => `✅ Sitio procesado y guardado en: ${finalFile}`,
  carpetaRespaldo: path => `📁 Carpeta de respaldo: ${path}`,
  puertoDetectado: port => `🌐 Puerto detectado en la URL: ${port}`,
  procesoErrores: errCount => `⚠️  Proceso finalizado con ${errCount} error(es). Revisa el archivo ziteback.log para más detalles.`,
  procesoFatal: "🛑 Se produjo un error fatal durante el proceso y se detuvo la ejecución. Consulta ziteback.log para más información.",
  errorAcceso: url => `❌ No es posible acceder a ${url}, revise la URL y su conexión o inténtelo más tarde.`,
  errorDescarga: url => `❌ Error descargando recurso: ${url}`,
  reintentando: (url, intento) => `⚠️  Reintentando descarga de ${url} (intento ${intento}/3)...`,
  omitido: url => `⏭️  Omitido (no es recurso estático): ${url}`
};
