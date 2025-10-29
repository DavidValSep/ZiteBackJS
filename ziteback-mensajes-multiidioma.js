/**
 * ZiteBackJS - Sistema de Mensajes Multiidioma v1.0.1
 * Soporte para 6 idiomas: Español, English, Français, Deutsch, Русский y Mapudungun
 * Creado: 28 de octubre de 2025
 * v1.0.1: Agregado Русский a pedido de mi hija Monzerrat
 */

const MENSAJES_MULTIIDIOMA = {
    es: {
        // Mensajes principales
        iniciando_navegador: "🚀 Iniciando navegador (Puppeteer)...",
        navegador_iniciado: "🟢 Navegador iniciado correctamente.",
        abriendo_pagina: "🌐 Abriendo página principal...",
        iniciando_carga: "🌐 Iniciando carga de página...",
        pagina_cargada: "📄 Página cargada correctamente:",
        esperando_contenido: "⏳ Esperando contenido dinámico (acordeones, FAQs, lazy loading)...",
        contenido_no_detectado: "📝 No se detectó contenido dinámico específico (normal en sitios estáticos)",
        procesamiento_completado: "✅ Procesamiento de contenido dinámico completado",
        espera_adicional: "⏰ Espera adicional de 3 segundos para carga completa de contenido dinámico...",
        finalizando_carga: "⏳ Finalizando carga de contenido dinámico [VERDE]",
        guardando_html: "💾 Guardando HTML temporal...",
        procesando_rutas: "🔗 Procesando y reemplazando rutas de recursos para:",
        rutas_procesadas: "🔄 Rutas procesadas y reemplazadas.",
        html_guardado: "💾 HTML final guardado en:",
        descargando_recursos: "📥 Descargando {count} recursos locales...",
        recurso_descargado: "📝 Recurso local descargado:",
        reintentando_descarga: "⚠️  Reintentando descarga de {url} (intento {attempt}/3)...",
        error_404: "❌ 404 No encontrado:",
        
        // Estados y progreso
        completado: "✅ Completado",
        procesando: "🔄 Procesando...",
        error: "❌ Error:",
        advertencia: "⚠️ Advertencia:",
        
        // Configuración
        url_procesada: "✅ URL procesada:",
        inicio_clonacion: "🟡 [DEBUG] INICIO de clonarPagina para URL:",
        finalizacion_completa: "⏳ Finalizando carga de contenido dinámico - Completado",
        
        // Configuración del sistema
        configurador_titulo: "🚀 Configurador Completo ZiteBackJS v5.0.2",
        seleccionar_idioma: "🌍 Selecciona tu idioma / Select your language / Choisissez votre langue / Wählen Sie Ihre Sprache / Выберите язык / Kimün dungu:",
        idioma_seleccionado: "✅ Idioma seleccionado:",
        configuracion_sistema: "🔧 === CONFIGURACIÓN DEL SISTEMA ===",
        configuracion_directorios: "📁 === CONFIGURACIÓN DE DIRECTORIOS ===",
        configuracion_email: "📧 === CONFIGURACIÓN DE EMAIL ===",
        configuracion_recursos: "📎 === CONFIGURACIÓN DE RECURSOS ===",
        configuracion_rendimiento: "⚡ === CONFIGURACIÓN DE RENDIMIENTO ===",
        configuracion_seguridad: "🔒 === CONFIGURACIÓN DE SEGURIDAD ===",
        menu_principal: "📋 === MENÚ DE CONFIGURACIÓN ===",
        que_configurar: "¿Qué deseas configurar?",
        sistema_opcion: "🔧 Sistema (idioma, tiempos, charset)",
        directorios_opcion: "📁 Directorios de trabajo",
        email_opcion: "📧 Email y notificaciones",
        recursos_opcion: "📎 Recursos a descargar",
        rendimiento_opcion: "⚡ Rendimiento y optimización",
        seguridad_opcion: "🔒 Seguridad y validaciones",
        completa_opcion: "🚀 Configuración completa (todas las opciones)",
        ver_config_opcion: "📋 Ver configuración actual",
        salir_opcion: "❌ Salir",
        elegir_opcion: "Elige una opción (1-9):",
        configurar_mas: "¿Deseas configurar algo más? (s/n):",
        hasta_luego: "👋 ¡Hasta luego!",
        opcion_invalida: "❌ Opción no válida",
        tiempo_espera_default: "⏱️ Tiempo de espera por defecto en segundos [3]:",
        charset_default: "🔤 Charset por defecto [utf-8]:",
        configuracion_completada: "✅ Configuración completada"
    },
    
    en: {
        // Main messages
        iniciando_navegador: "🚀 Starting browser (Puppeteer)...",
        navegador_iniciado: "🟢 Browser started successfully.",
        abriendo_pagina: "🌐 Opening main page...",
        iniciando_carga: "🌐 Starting page load...",
        pagina_cargada: "📄 Page loaded successfully:",
        esperando_contenido: "⏳ Waiting for dynamic content (accordions, FAQs, lazy loading)...",
        contenido_no_detectado: "📝 No specific dynamic content detected (normal for static sites)",
        procesamiento_completado: "✅ Dynamic content processing completed",
        espera_adicional: "⏰ Additional 3-second wait for complete dynamic content loading...",
        finalizando_carga: "⏳ Finalizing dynamic content loading [GREEN]",
        guardando_html: "💾 Saving temporary HTML...",
        procesando_rutas: "🔗 Processing and replacing resource paths for:",
        rutas_procesadas: "🔄 Paths processed and replaced.",
        html_guardado: "💾 Final HTML saved to:",
        descargando_recursos: "📥 Downloading {count} local resources...",
        recurso_descargado: "📝 Local resource downloaded:",
        reintentando_descarga: "⚠️  Retrying download of {url} (attempt {attempt}/3)...",
        error_404: "❌ 404 Not found:",
        
        // Status and progress
        completado: "✅ Completed",
        procesando: "🔄 Processing...",
        error: "❌ Error:",
        advertencia: "⚠️ Warning:",
        
        // Configuration
        url_procesada: "✅ URL processed:",
        inicio_clonacion: "🟡 [DEBUG] START of clonePage for URL:",
        finalizacion_completa: "⏳ Finalizing dynamic content loading - Completed",
        
        // System configuration
        configurador_titulo: "🚀 ZiteBackJS v5.0.2 Complete Configurator",
        seleccionar_idioma: "🌍 Select your language / Selecciona tu idioma / Choisissez votre langue / Wählen Sie Ihre Sprache / Выберите язык / Kimün dungu:",
        idioma_seleccionado: "✅ Language selected:",
        configuracion_sistema: "🔧 === SYSTEM CONFIGURATION ===",
        configuracion_directorios: "📁 === DIRECTORIES CONFIGURATION ===",
        configuracion_email: "📧 === EMAIL CONFIGURATION ===",
        configuracion_recursos: "📎 === RESOURCES CONFIGURATION ===",
        configuracion_rendimiento: "⚡ === PERFORMANCE CONFIGURATION ===",
        configuracion_seguridad: "🔒 === SECURITY CONFIGURATION ===",
        menu_principal: "📋 === CONFIGURATION MENU ===",
        que_configurar: "What would you like to configure?",
        sistema_opcion: "🔧 System (language, timeouts, charset)",
        directorios_opcion: "📁 Working directories",
        email_opcion: "📧 Email and notifications",
        recursos_opcion: "📎 Resources to download",
        rendimiento_opcion: "⚡ Performance and optimization",
        seguridad_opcion: "🔒 Security and validations",
        completa_opcion: "🚀 Complete configuration (all options)",
        ver_config_opcion: "📋 View current configuration",
        salir_opcion: "❌ Exit",
        elegir_opcion: "Choose an option (1-9):",
        configurar_mas: "Would you like to configure something else? (y/n):",
        hasta_luego: "👋 Goodbye!",
        opcion_invalida: "❌ Invalid option",
        tiempo_espera_default: "⏱️ Default wait time in seconds [3]:",
        charset_default: "🔤 Default charset [utf-8]:",
        configuracion_completada: "✅ Configuration completed"
    },
    
    fr: {
        // Messages principaux
        iniciando_navegador: "🚀 Démarrage du navigateur (Puppeteer)...",
        navegador_iniciado: "🟢 Navigateur démarré avec succès.",
        abriendo_pagina: "🌐 Ouverture de la page principale...",
        iniciando_carga: "🌐 Début du chargement de la page...",
        pagina_cargada: "📄 Page chargée avec succès:",
        esperando_contenido: "⏳ Attente du contenu dynamique (accordéons, FAQ, lazy loading)...",
        contenido_no_detectado: "📝 Aucun contenu dynamique spécifique détecté (normal pour les sites statiques)",
        procesamiento_completado: "✅ Traitement du contenu dynamique terminé",
        espera_adicional: "⏰ Attente supplémentaire de 3 secondes pour le chargement complet du contenu dynamique...",
        finalizando_carga: "⏳ Finalisation du chargement du contenu dynamique [VERT]",
        guardando_html: "💾 Sauvegarde du HTML temporaire...",
        procesando_rutas: "🔗 Traitement et remplacement des chemins de ressources pour:",
        rutas_procesadas: "🔄 Chemins traités et remplacés.",
        html_guardado: "💾 HTML final sauvegardé dans:",
        descargando_recursos: "📥 Téléchargement de {count} ressources locales...",
        recurso_descargado: "📝 Ressource locale téléchargée:",
        reintentando_descarga: "⚠️  Nouvelle tentative de téléchargement de {url} (tentative {attempt}/3)...",
        error_404: "❌ 404 Non trouvé:",
        
        // États et progrès
        completado: "✅ Terminé",
        procesando: "🔄 Traitement...",
        error: "❌ Erreur:",
        advertencia: "⚠️ Avertissement:",
        
        // Configuration
        url_procesada: "✅ URL traitée:",
        inicio_clonacion: "🟡 [DEBUG] DÉBUT de clonePage pour URL:",
        finalizacion_completa: "⏳ Finalisation du chargement du contenu dynamique - Terminé",
        
        // Configuration du système
        configurador_titulo: "🚀 Configurateur Complet ZiteBackJS v5.0.2",
        seleccionar_idioma: "🌍 Choisissez votre langue / Select your language / Selecciona tu idioma / Wählen Sie Ihre Sprache / Выберите язык / Kimün dungu:",
        idioma_seleccionado: "✅ Langue sélectionnée:",
        configuracion_sistema: "🔧 === CONFIGURATION DU SYSTÈME ===",
        configuracion_directorios: "📁 === CONFIGURATION DES RÉPERTOIRES ===",
        configuracion_email: "📧 === CONFIGURATION EMAIL ===",
        configuracion_recursos: "📎 === CONFIGURATION DES RESSOURCES ===",
        configuracion_rendimiento: "⚡ === CONFIGURATION DE PERFORMANCE ===",
        configuracion_seguridad: "🔒 === CONFIGURATION DE SÉCURITÉ ===",
        menu_principal: "📋 === MENU DE CONFIGURATION ===",
        que_configurar: "Que souhaitez-vous configurer?",
        sistema_opcion: "🔧 Système (langue, délais, charset)",
        directorios_opcion: "📁 Répertoires de travail",
        email_opcion: "📧 Email et notifications",
        recursos_opcion: "📎 Ressources à télécharger",
        rendimiento_opcion: "⚡ Performance et optimisation",
        seguridad_opcion: "🔒 Sécurité et validations",
        completa_opcion: "🚀 Configuration complète (toutes les options)",
        ver_config_opcion: "📋 Voir la configuration actuelle",
        salir_opcion: "❌ Sortir",
        elegir_opcion: "Choisissez une option (1-9):",
        configurar_mas: "Souhaitez-vous configurer autre chose? (o/n):",
        hasta_luego: "👋 Au revoir!",
        opcion_invalida: "❌ Option invalide",
        tiempo_espera_default: "⏱️ Temps d'attente par défaut en secondes [3]:",
        charset_default: "🔤 Charset par défaut [utf-8]:",
        configuracion_completada: "✅ Configuration terminée"
    },
    
    de: {
        // Hauptnachrichten
        iniciando_navegador: "🚀 Browser wird gestartet (Puppeteer)...",
        navegador_iniciado: "🟢 Browser erfolgreich gestartet.",
        abriendo_pagina: "🌐 Hauptseite wird geöffnet...",
        iniciando_carga: "🌐 Seitenladevorgang wird gestartet...",
        pagina_cargada: "📄 Seite erfolgreich geladen:",
        esperando_contenido: "⏳ Warten auf dynamische Inhalte (Akkordeons, FAQs, Lazy Loading)...",
        contenido_no_detectado: "📝 Keine spezifischen dynamischen Inhalte erkannt (normal für statische Seiten)",
        procesamiento_completado: "✅ Verarbeitung dynamischer Inhalte abgeschlossen",
        espera_adicional: "⏰ Zusätzliche 3-Sekunden-Wartezeit für vollständiges Laden dynamischer Inhalte...",
        finalizando_carga: "⏳ Abschluss des Ladens dynamischer Inhalte [GRÜN]",
        guardando_html: "💾 Temporäres HTML wird gespeichert...",
        procesando_rutas: "🔗 Ressourcenpfade werden verarbeitet und ersetzt für:",
        rutas_procesadas: "🔄 Pfade verarbeitet und ersetzt.",
        html_guardado: "💾 Finales HTML gespeichert in:",
        descargando_recursos: "📥 {count} lokale Ressourcen werden heruntergeladen...",
        recurso_descargado: "📝 Lokale Ressource heruntergeladen:",
        reintentando_descarga: "⚠️  Download-Wiederholung von {url} (Versuch {attempt}/3)...",
        error_404: "❌ 404 Nicht gefunden:",
        
        // Status und Fortschritt
        completado: "✅ Abgeschlossen",
        procesando: "🔄 Verarbeitung...",
        error: "❌ Fehler:",
        advertencia: "⚠️ Warnung:",
        
        // Konfiguration
        url_procesada: "✅ URL verarbeitet:",
        inicio_clonacion: "🟡 [DEBUG] START von clonePage für URL:",
        finalizacion_completa: "⏳ Abschluss des Ladens dynamischer Inhalte - Abgeschlossen",
        
        // Systemkonfiguration
        configurador_titulo: "🚀 ZiteBackJS v5.0.2 Vollständiger Konfigurator",
        seleccionar_idioma: "🌍 Wählen Sie Ihre Sprache / Select your language / Selecciona tu idioma / Choisissez votre langue / Выберите язык / Kimün dungu:",
        idioma_seleccionado: "✅ Sprache ausgewählt:",
        configuracion_sistema: "🔧 === SYSTEMKONFIGURATION ===",
        configuracion_directorios: "📁 === VERZEICHNISKONFIGURATION ===",
        configuracion_email: "📧 === EMAIL-KONFIGURATION ===",
        configuracion_recursos: "📎 === RESSOURCENKONFIGURATION ===",
        configuracion_rendimiento: "⚡ === LEISTUNGSKONFIGURATION ===",
        configuracion_seguridad: "🔒 === SICHERHEITSKONFIGURATION ===",
        menu_principal: "📋 === KONFIGURATIONSMENÜ ===",
        que_configurar: "Was möchten Sie konfigurieren?",
        sistema_opcion: "🔧 System (Sprache, Zeitüberschreitungen, Charset)",
        directorios_opcion: "📁 Arbeitsverzeichnisse",
        email_opcion: "📧 Email und Benachrichtigungen",
        recursos_opcion: "📎 Herunterzuladende Ressourcen",
        rendimiento_opcion: "⚡ Leistung und Optimierung",
        seguridad_opcion: "🔒 Sicherheit und Validierungen",
        completa_opcion: "🚀 Vollständige Konfiguration (alle Optionen)",
        ver_config_opcion: "📋 Aktuelle Konfiguration anzeigen",
        salir_opcion: "❌ Beenden",
        elegir_opcion: "Wählen Sie eine Option (1-9):",
        configurar_mas: "Möchten Sie etwas anderes konfigurieren? (j/n):",
        hasta_luego: "👋 Auf Wiedersehen!",
        opcion_invalida: "❌ Ungültige Option",
        tiempo_espera_default: "⏱️ Standard-Wartezeit in Sekunden [3]:",
        charset_default: "🔤 Standard-Charset [utf-8]:",
        configuracion_completada: "✅ Konfiguration abgeschlossen"
    },
    
    ru: {
        // Основные сообщения
        iniciando_navegador: "🚀 Запуск браузера (Puppeteer)...",
        navegador_iniciado: "🟢 Браузер успешно запущен.",
        abriendo_pagina: "🌐 Открытие главной страницы...",
        iniciando_carga: "🌐 Начало загрузки страницы...",
        pagina_cargada: "📄 Страница успешно загружена:",
        esperando_contenido: "⏳ Ожидание динамического контента (аккордеоны, FAQ, отложенная загрузка)...",
        contenido_no_detectado: "📝 Специфический динамический контент не обнаружен (нормально для статических сайтов)",
        procesamiento_completado: "✅ Обработка динамического контента завершена",
        espera_adicional: "⏰ Дополнительное ожидание 3 секунды для полной загрузки динамического контента...",
        finalizando_carga: "⏳ Завершение загрузки динамического контента [ЗЕЛЁНЫЙ]",
        guardando_html: "💾 Сохранение временного HTML...",
        procesando_rutas: "🔗 Обработка и замена путей ресурсов для:",
        rutas_procesadas: "🔄 Пути обработаны и заменены.",
        html_guardado: "💾 Финальный HTML сохранён в:",
        descargando_recursos: "📥 Загрузка {count} локальных ресурсов...",
        recurso_descargado: "📝 Локальный ресурс загружен:",
        reintentando_descarga: "⚠️  Повторная попытка загрузки {url} (попытка {attempt}/3)...",
        error_404: "❌ 404 Не найдено:",
        
        // Статус и прогресс
        completado: "✅ Завершено",
        procesando: "🔄 Обработка...",
        error: "❌ Ошибка:",
        advertencia: "⚠️ Предупреждение:",
        
        // Конфигурация
        url_procesada: "✅ URL обработан:",
        inicio_clonacion: "🟡 [DEBUG] НАЧАЛО clonePage для URL:",
        finalizacion_completa: "⏳ Завершение загрузки динамического контента - Завершено",
        
        // Конфигурация системы
        configurador_titulo: "🚀 Полный Конфигуратор ZiteBackJS v5.0.2",
        seleccionar_idioma: "🌍 Выберите язык / Select your language / Selecciona tu idioma / Choisissez votre langue / Wählen Sie Ihre Sprache / Kimün dungu:",
        idioma_seleccionado: "✅ Язык выбран:",
        configuracion_sistema: "🔧 === КОНФИГУРАЦИЯ СИСТЕМЫ ===",
        configuracion_directorios: "📁 === КОНФИГУРАЦИЯ КАТАЛОГОВ ===",
        configuracion_email: "📧 === КОНФИГУРАЦИЯ EMAIL ===",
        configuracion_recursos: "📎 === КОНФИГУРАЦИЯ РЕСУРСОВ ===",
        configuracion_rendimiento: "⚡ === КОНФИГУРАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ ===",
        configuracion_seguridad: "🔒 === КОНФИГУРАЦИЯ БЕЗОПАСНОСТИ ===",
        menu_principal: "📋 === МЕНЮ КОНФИГУРАЦИИ ===",
        que_configurar: "Что вы хотите настроить?",
        sistema_opcion: "🔧 Система (язык, таймауты, кодировка)",
        directorios_opcion: "📁 Рабочие каталоги",
        email_opcion: "📧 Email и уведомления",
        recursos_opcion: "📎 Ресурсы для загрузки",
        rendimiento_opcion: "⚡ Производительность и оптимизация",
        seguridad_opcion: "🔒 Безопасность и проверки",
        completa_opcion: "🚀 Полная конфигурация (все опции)",
        ver_config_opcion: "📋 Просмотр текущей конфигурации",
        salir_opcion: "❌ Выход",
        elegir_opcion: "Выберите опцию (1-9):",
        configurar_mas: "Хотите настроить что-то ещё? (д/н):",
        hasta_luego: "👋 До свидания!",
        opcion_invalida: "❌ Неверная опция",
        tiempo_espera_default: "⏱️ Время ожидания по умолчанию в секундах [3]:",
        charset_default: "🔤 Кодировка по умолчанию [utf-8]:",
        configuracion_completada: "✅ Конфигурация завершена"
    },
    
    map: {
        // Mensajes en Mapudungun (lengua mapuche)
        iniciando_navegador: "🚀 Peukantun nawel (Puppeteer)...",
        navegador_iniciado: "🟢 Nawel peukan newen mew.",
        abriendo_pagina: "🌐 Rupantun fütra papyl...",
        iniciando_carga: "🌐 Peukantun papyl rupan...",
        pagina_cargada: "📄 Papyl newen mew rupay:",
        esperando_contenido: "⏳ Ngütramkan wiño kimün (ñi petu, ramtu, chumgechi)...",
        contenido_no_detectado: "📝 Nie kimnielay wiño kimün (normal ta rume ka papyl)",
        procesamiento_completado: "✅ Wiño kimün rupan petu",
        espera_adicional: "⏰ Küla antü ngütram wiño kimün rupan...",
        finalizando_carga: "⏳ Puwantun wiño kimün rupan [KARÜ]",
        guardando_html: "💾 Koneltun HTML wixunko...",
        procesando_rutas: "🔗 Rupantun ka newün rüpü:",
        rutas_procesadas: "🔄 Rüpü rupay ka newünpay.",
        html_guardado: "💾 Wüne HTML koneltuwe:",
        descargando_recursos: "📥 Üyün {count} lof newün...",
        recurso_descargado: "📝 Lof newün üyüy:",
        reintentando_descarga: "⚠️  Epe üyün {url} (epe {attempt}/3)...",
        error_404: "❌ 404 Nienielay:",
        
        // Newen ka mülen
        completado: "✅ Petu",
        procesando: "🔄 Rupantun...",
        error: "❌ Wedrun:",
        advertencia: "⚠️ Epewan:",
        
        // Kimeltun
        url_procesada: "✅ URL rupay:",
        inicio_clonacion: "🟡 [DEBUG] PEUKANTUN clonePage URL:",
        finalizacion_completa: "⏳ Puwantun wiño kimün rupan - Petu",
        
        // Kimeltun newen
        configurador_titulo: "🚀 ZiteBackJS v5.0.2 Kom Kimeltun",
        seleccionar_idioma: "🌍 Kimün dungu / Select your language / Selecciona tu idioma / Choisissez votre langue / Wählen Sie Ihre Sprache / Выберите язык:",
        idioma_seleccionado: "✅ Dungu petu:",
        configuracion_sistema: "🔧 === NEWEN KIMELTUN ===",
        configuracion_directorios: "📁 === FOLIL KIMELTUN ===",
        configuracion_email: "📧 === EMAIL KIMELTUN ===",
        configuracion_recursos: "📎 === NEWÜN KIMELTUN ===",
        configuracion_rendimiento: "⚡ === NEWEN KIMELTUN ===",
        configuracion_seguridad: "🔒 === KISU KIMELTUN ===",
        menu_principal: "📋 === KIMELTUN MENÚ ===",
        que_configurar: "¿Chem kimeltun nieymi?",
        sistema_opcion: "🔧 Newen (dungu, antü, kimün)",
        directorios_opcion: "📁 Küdaw folil",
        email_opcion: "📧 Email ka werken",
        recursos_opcion: "📎 Newün üyün",
        rendimiento_opcion: "⚡ Newen ka llükan",
        seguridad_opcion: "🔒 Kisu ka rupan",
        completa_opcion: "🚀 Kom kimeltun (fillke newün)",
        ver_config_opcion: "📋 Penon fachantü kimeltun",
        salir_opcion: "❌ Amun",
        elegir_opcion: "Petu kiñe (1-9):",
        configurar_mas: "¿Kimeltun ka nieymi? (s/n):",
        hasta_luego: "👋 ¡Peukallal!",
        opcion_invalida: "❌ Wedrun petu",
        tiempo_espera_default: "⏱️ Ngüne antü küla [3]:",
        charset_default: "🔤 Ngüne kimün [utf-8]:",
        configuracion_completada: "✅ Kimeltun petu"
    }
};

/**
 * Obtiene un mensaje en el idioma especificado
 * @param {string} clave - Clave del mensaje
 * @param {string} idioma - Código del idioma (es, en, fr, de, map)
 * @param {Object} params - Parámetros para reemplazar en el mensaje
 * @returns {string} Mensaje traducido
 */
function obtenerMensaje(clave, idioma = 'es', params = {}) {
    const idiomaValido = MENSAJES_MULTIIDIOMA[idioma] ? idioma : 'es';
    let mensaje = MENSAJES_MULTIIDIOMA[idiomaValido][clave] || MENSAJES_MULTIIDIOMA.es[clave] || clave;
    
    // Reemplazar parámetros en el mensaje
    Object.keys(params).forEach(param => {
        mensaje = mensaje.replace(new RegExp(`{${param}}`, 'g'), params[param]);
    });
    
    return mensaje;
}

/**
 * Idiomas disponibles en el sistema
 */
const IDIOMAS_DISPONIBLES = {
    es: 'Español',
    en: 'English', 
    fr: 'Français',
    de: 'Deutsch',
    ru: 'Русский',
    map: 'Mapudungun'
};

module.exports = {
    MENSAJES_MULTIIDIOMA,
    obtenerMensaje,
    IDIOMAS_DISPONIBLES
};
