#!/usr/bin/env node

/**
 * 🚀 Y2Back - Sistema de Gestión de Versiones Automático
 * 
 * Este script permite incrementar automáticamente la versión del proyecto
 * y actualizar todos los archivos correspondientes con el nuevo número.
 * 
 * Uso: node version-manager.js
 * 
 * Autor: DavidValSep (SuSitio.cl)
 * Fecha: 29 de Octubre, 2025
 * Proyecto: Y2Back - YouTube Video Downloader
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 📋 Configuración de archivos a actualizar
const VERSION_FILES = [
    'package.json',                    // "version": "x.x.x"
    'y2back.js',                       // Cabeceras/banners
    'yoo2back.js',                     // Cabecera @version
    'config.js',                       // VERSION_CONFIG.VERSION y RELEASE_DATE
    'README.md',                       // Badges/encabezados
    // 'CHANGELOG.md',                 // Se gestiona aparte con updateChangelog()
    'README_DEV.md',                   // Referencias internas
    'SOLUCION_PROBLEMAS_GUI.md',       // Notas de versión GUI
    'SOLUCION_FINAL_GUI.md',           // Notas de versión GUI
    'current-version.txt',             // Fuente de verdad
    'y2.cmd',                          // Banner Windows
    'y2',                              // Script Unix
    'y2.js',                           // Wrapper CLI
    'gui.js',                          // Lanzador GUI (@version, banner)
    'install-y2.js',                   // Instalador (@version)
    'install-y2b.js',                  // Instalador alternativo
    'electron/main.js',                // Títulos ventana
    'electron/renderer_new.js',        // Mensajes GUI
    'electron/test-gui.js'             // Títulos pruebas
];

const VERSION_FILE_PATH = './current-version.txt';
const CHANGELOG_FILE = './CHANGELOG.md';
const CHANGELOG_BAK_FILE = './CHANGELOG_BAK.md';

// 📚 Base canónica del CHANGELOG (2.0.0 → 1.0.0)
const CANONICAL_ENTRIES = [
    { v: '2.0.0', date: '2025-10-23', title: 'Nueva usabilidad: Vimeo', bullets: [
        'Soporte de Vimeo como segunda plataforma (hito de usabilidad).',
        'Documentación actualizada (README) con ejemplos Vimeo y tabla de flags.'
    ]},
    { v: '1.3.3', date: '2025-10-21', title: 'Testing completo (Item 12)', bullets: [
        'Casos edge y manejo de errores en flujos con Vimeo.'
    ]},
    { v: '1.3.2', date: '2025-10-18', title: 'Mensajes de salida (Item 11)', bullets: [
        'Mejoras de feedback e indicación de plataforma detectada.'
    ]},
    { v: '1.3.1', date: '2025-10-17', title: 'Banner de ayuda (Item 10)', bullets: [
        'Ejemplos de Vimeo añadidos y ayuda más clara para ambas plataformas.'
    ]},
    { v: '1.3.0', date: '2025-10-16', title: 'Lógica de directorios (Item 9)', bullets: [
        'Creación automática de carpetas por tipo (Video/Music/Pics/Subtitles/Screenshots).',
        'Base preparada para distinguir por plataforma en el futuro.'
    ]},
    { v: '1.2.2', date: '2025-10-12', title: 'Decisión de directorios (Item 8)', bullets: [
        'Mantener organización unificada por tipo y anotar plataforma detectada.'
    ]},
    { v: '1.2.1', date: '2025-10-11', title: 'Testing básico (Item 7)', bullets: [
        'Pruebas de descarga en Vimeo y verificación de calidades disponibles.'
    ]},
    { v: '1.2.0', date: '2025-10-10', title: 'Comandos yt-dlp para Vimeo (Item 6)', bullets: [
        'Parámetros específicos para Vimeo y ajustes respecto a YouTube.'
    ]},
    { v: '1.1.1', date: '2025-10-08', title: 'Validaciones y mensajes (Item 5)', bullets: [
        'Validaciones principales y mensajes de error/ayuda con ejemplos Vimeo.'
    ]},
    { v: '1.1.0', date: '2025-10-07', title: 'Implementar extraerVimeoId() (Item 4)', bullets: [
        'Regex para formatos de Vimeo (player, directos, channels, groups, ondemand, numéricos) y manejo de casos edge.'
    ]},
    { v: '1.0.3', date: '2025-10-03', title: 'Compatibilidad de IDs (Item 3)', bullets: [
        'Actualizar extracción de IDs para soportar Vimeo manteniendo YouTube.'
    ]},
    { v: '1.0.2', date: '2025-10-02', title: 'Validación inicial (Item 2)', bullets: [
        'Función esUrlVimeo() con pruebas básicas.'
    ]},
    { v: '1.0.1', date: '2025-10-01', title: 'Investigación URLs de Vimeo (Item 1)', bullets: [
        'Analizados formatos: vimeo.com/123456, player.vimeo.com/video/123456; documentados patrones de ID.'
    ]},
    { v: '1.0.0', date: '2025-10-01', title: 'Inicio del Proyecto', bullets: [
        'Proyecto inicial: descargador de YouTube (video, audio, imágenes, subtítulos, metadata).',
        'Arquitectura base inspirada en ZiteBack.'
    ]}
];

function formatCanonicalChangelog(entries) {
    const header = [
        '# 📋 CHANGELOG - Y2Back',
        '',
        'Todos los cambios notables de este proyecto se documentan aquí. El formato está basado en Keep a Changelog y seguimos Versionado Semántico (SemVer).',
        '',
        'Regla de orden: la versión más reciente aparece arriba. La historia empieza en 1.0.0 al final del documento y va subiendo versión por versión.',
        '',
        '---',
        ''
    ].join('\n');

    const body = entries.map(e => {
        const lines = [
            `## [${e.v}] - ${e.date}`,
            `### ${e.title}`
        ];
        if (e.bullets && e.bullets.length) {
            lines.push(...e.bullets.map(b => `- ${b}`));
        }
        return lines.join('\n');
    }).join('\n\n');

    const footer = [
        '',
        '---',
        '',
        'Notas de versionado:',
        '- +0.0.1 cambios pequeños.',
        '- +0.1.0 módulo/función de complejidad media.',
        '- +1.0.0 nueva usabilidad importante (Vimeo).',
        '',
        `*Última actualización: ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}*`,
        ''
    ].join('\n');

    return header + body + '\n' + footer;
}

class VersionManager {
    constructor() {
        this.currentVersion = this.loadCurrentVersion();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // 📖 Cargar versión actual desde archivo
    loadCurrentVersion() {
        try {
            if (fs.existsSync(VERSION_FILE_PATH)) {
                return fs.readFileSync(VERSION_FILE_PATH, 'utf8').trim();
            } else {
                // Si no existe, extraer del package.json
                const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
                const version = packageJson.version;
                this.saveCurrentVersion(version);
                return version;
            }
        } catch (error) {
            console.error('❌ Error cargando versión:', error.message);
            return '0.2.4'; // Fallback a versión actual de Y2Back
        }
    }

    // 💾 Guardar versión actual en archivo
    saveCurrentVersion(version) {
        fs.writeFileSync(VERSION_FILE_PATH, version, 'utf8');
    }

    // 🔢 Incrementar versión según lógica especificada
    incrementVersion(currentVersion, incrementValue) {
        const [major, minor, patch] = currentVersion.split('.').map(Number);
        
        if (incrementValue === 10) {
            // Incremento mayor: pasar al siguiente major y resetear todo
            return `${major + 1}.0.0`;
        } else if (incrementValue >= 1 && incrementValue <= 9) {
            if (patch + incrementValue > 9) {
                // Si el patch se pasa de 9, incrementar minor y resetear patch
                if (minor + 1 > 9) {
                    // Si minor también se pasa, incrementar major
                    return `${major + 1}.0.0`;
                } else {
                    return `${major}.${minor + 1}.0`;
                }
            } else {
                // Incremento normal en patch
                return `${major}.${minor}.${patch + incrementValue}`;
            }
        } else {
            throw new Error('El valor de incremento debe estar entre 1 y 10');
        }
    }

    // 📝 Actualizar archivo específico con nueva versión
    updateVersionInFile(filePath, oldVersion, newVersion) {
        try {
            if (!fs.existsSync(filePath)) {
                console.log(`⚠️ Archivo no encontrado: ${filePath}`);
                return false;
            }

            let content = fs.readFileSync(filePath, 'utf8');
            let updated = false;

            // Estrategias de reemplazo por tipo de archivo
            if (filePath.endsWith('package.json') || filePath.endsWith('web-package.json')) {
                content = content.replace(
                    `"version": "${oldVersion}"`,
                    `"version": "${newVersion}"`
                );
                updated = true;
            } 
            else if (filePath.endsWith('y2back.js')) {
                // Reemplazar @version en header JSDoc
                content = content.replace(
                    new RegExp(`@version\\s+${oldVersion.replace(/\./g, '\\.')}`, 'g'),
                    `@version ${newVersion}`
                );
                // Reemplazar en header comentado
                content = content.replace(
                    new RegExp(`Y2Back.*v${oldVersion.replace(/\\./g, '\\.')}`, 'g'),
                    `Y2Back v${newVersion}`
                );
                updated = true;
            }
            else if (filePath.endsWith('config.js')) {
                // Reemplazar VERSION_CONFIG.VERSION
                content = content.replace(
                    new RegExp(`VERSION: "${oldVersion.replace(/\./g, '\\.')}"`, 'g'),
                    `VERSION: "${newVersion}"`
                );
                // Reemplazar fecha de release
                const today = new Date().toISOString().split('T')[0];
                content = content.replace(
                    /RELEASE_DATE: "\d{4}-\d{2}-\d{2}"/g,
                    `RELEASE_DATE: "${today}"`
                );
                updated = true;
            }
            else if (filePath.endsWith('index.html')) {
                // Reemplazar en comentario header y contenido
                content = content.replace(
                    new RegExp(`ZiteBackJS v${oldVersion.replace(/\./g, '\\.')}`, 'g'),
                    `ZiteBackJS v${newVersion}`
                );
                // Reemplazar versiones con formato v5.x.x
                content = content.replace(
                    new RegExp(`v${oldVersion.replace(/\./g, '\\.')}`, 'g'),
                    `v${newVersion}`
                );
                // Reemplazar versiones sin v
                content = content.replace(
                    new RegExp(`${oldVersion.replace(/\./g, '\\.')}`, 'g'),
                    newVersion
                );
                updated = true;
            }
            else if (filePath.endsWith('.js')) {
                // Para archivos JS generales (main.js, renderer.js, web-server.js)
                content = content.replace(
                    new RegExp(`ZiteBackJS.*v${oldVersion.replace(/\./g, '\\.')}`, 'g'),
                    `ZiteBackJS v${newVersion}`
                );
                content = content.replace(
                    new RegExp(`version.*${oldVersion.replace(/\./g, '\\.')}`, 'g'),
                    `version: '${newVersion}'`
                );
                content = content.replace(
                    new RegExp(`@version\\s+${oldVersion.replace(/\./g, '\\.')}`, 'g'),
                    `@version ${newVersion}`
                );
                // Reemplazo genérico de banners tipo "... vX.Y.Z"
                content = content.replace(
                    new RegExp(`v${oldVersion.replace(/\./g, '\\.')}`, 'g'),
                    `v${newVersion}`
                );
                updated = true;
            }
            else if (filePath.endsWith('README.md')) {
                // Reemplazo seguro para README principal: título y badge
                // 1) Título: # ... vX.Y.Z → vNEW
                content = content.replace(
                    new RegExp(`#(.*)v${oldVersion.replace(/\./g, '\\.')}`, 'g'),
                    (m) => m.replace(new RegExp(`v${oldVersion.replace(/\./g, '\\.')}`,'g'), `v${newVersion}`)
                );
                // 2) Badge: version-X.Y.Z-... → version-NEW-...
                content = content.replace(
                    new RegExp(`badge/version-${oldVersion.replace(/\./g, '\\.')}-`, 'g'),
                    `badge/version-${newVersion}-`
                );
                updated = true;
            }
            else if (filePath.endsWith('current-version.txt')) {
                // Reemplazar contenido completo
                content = newVersion;
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Actualizado: ${filePath}`);
                return true;
            } else {
                console.log(`⚪ Sin cambios: ${filePath}`);
                return false;
            }
        } catch (error) {
            console.error(`❌ Error actualizando ${filePath}:`, error.message);
            return false;
        }
    }

    // 📋 Actualizar changelog con nueva entrada
    updateChangelog(newVersion, description) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const entry = {
                v: newVersion,
                date: today,
                title: description,
                bullets: [ description ]
            };

            // Si no existe, crear desde canonical y anteponer la nueva
            if (!fs.existsSync(CHANGELOG_FILE)) {
                const content = formatCanonicalChangelog([entry, ...CANONICAL_ENTRIES]);
                fs.writeFileSync(CHANGELOG_FILE, content, 'utf8');
                console.log(`✅ Changelog creado con v${newVersion}`);
                return true;
            }

            // Si existe, insertar entrada nueva arriba del primer bloque de versión
            const content = fs.readFileSync(CHANGELOG_FILE, 'utf8');
            const lines = content.split('\n');
            const firstVersionIdx = lines.findIndex(l => /^## \[\d+\.\d+\.\d+\]/.test(l));
            const headerPart = firstVersionIdx > -1 ? lines.slice(0, firstVersionIdx) : lines.slice(0, 8);
            const restPart = firstVersionIdx > -1 ? lines.slice(firstVersionIdx).join('\n') : '';

            const newBlock = [
                `## [${entry.v}] - ${entry.date}`,
                `### ${entry.title}`,
                `- ${entry.bullets[0]}`,
                ''
            ].join('\n');

            const newContent = headerPart.join('\n') + '\n' + newBlock + restPart;
            fs.writeFileSync(CHANGELOG_FILE, newContent, 'utf8');
            console.log(`✅ Changelog actualizado con v${newVersion}`);
            return true;
        } catch (error) {
            console.error('❌ Error actualizando changelog:', error.message);
            return false;
        }
    }

    // 🧹 Normalizar/Resetear CHANGELOG a formato canónico respetando versión actual
    normalizeChangelog() {
        try {
            const current = this.currentVersion || '1.0.0';

            // Utilidades SemVer simples
            const parse = (v) => v.split('.').map(n => parseInt(n, 10));
            const cmp = (a, b) => {
                const [am, an, ap] = parse(a);
                const [bm, bn, bp] = parse(b);
                if (am !== bm) return am - bm;
                if (an !== bn) return an - bn;
                return ap - bp;
            };

            // Filtrar entradas canónicas que no superen la versión actual
            let filtered = CANONICAL_ENTRIES.filter(e => cmp(e.v, current) <= 0);

            // Si no existe la entrada de la versión actual, crear una de unificación
            const hasCurrent = filtered.some(e => e.v === current);
            if (!hasCurrent) {
                const today = new Date().toISOString().split('T')[0];
                filtered = [
                    { v: current, date: today, title: 'Unificación de versiones del proyecto', bullets: [
                        'Alineación de versiones en package.json, config.js, scripts y binarios.'
                    ]},
                    ...filtered
                ];
            }

            const canonical = formatCanonicalChangelog(filtered);
            if (fs.existsSync(CHANGELOG_FILE)) {
                // Backup
                fs.copyFileSync(CHANGELOG_FILE, CHANGELOG_BAK_FILE);
            }
            fs.writeFileSync(CHANGELOG_FILE, canonical, 'utf8');
            console.log('✅ CHANGELOG normalizado (backup en CHANGELOG_BAK.md)');
            return true;
        } catch (error) {
            console.error('❌ Error normalizando CHANGELOG:', error.message);
            return false;
        }
    }

    // 🎯 Función principal de incremento
    async incrementVersionInteractive() {
        try {
            console.log('\n🚀 ════════════════════════════════════════════════════════');
            console.log('📋    SISTEMA DE GESTIÓN DE VERSIONES - Y2Back');
            console.log('🚀 ════════════════════════════════════════════════════════');
            console.log(`📌 Versión actual: v${this.currentVersion}`);
            console.log('');

            // Solicitar incremento
            const incrementStr = await this.question('🔢 Ingrese valor de incremento (1-10): ');
            const incrementValue = parseInt(incrementStr);

            if (isNaN(incrementValue) || incrementValue < 1 || incrementValue > 10) {
                throw new Error('El valor debe ser un número entre 1 y 10');
            }

            // Calcular nueva versión
            const newVersion = this.incrementVersion(this.currentVersion, incrementValue);
            console.log(`📈 Nueva versión será: v${newVersion}`);

            // Solicitar descripción
            const description = await this.question('📝 Descripción del cambio: ');
            
            if (!description.trim()) {
                throw new Error('La descripción no puede estar vacía');
            }

            console.log('\n🔄 Iniciando actualización de archivos...\n');

            // Actualizar todos los archivos
            let filesUpdated = 0;
            for (const file of VERSION_FILES) {
                if (this.updateVersionInFile(file, this.currentVersion, newVersion)) {
                    filesUpdated++;
                }
            }

            // Actualizar changelog
            this.updateChangelog(newVersion, description);

            // Guardar nueva versión
            this.saveCurrentVersion(newVersion);

            console.log('\n🎉 ════════════════════════════════════════════════════════');
            console.log(`✅ Versión actualizada exitosamente: v${this.currentVersion} → v${newVersion}`);
            console.log(`📁 Archivos actualizados: ${filesUpdated}/${VERSION_FILES.length}`);
            console.log(`📋 Changelog actualizado con: "${description}"`);
            console.log('🎉 ════════════════════════════════════════════════════════\n');

        } catch (error) {
            console.error('\n❌ Error durante el proceso:', error.message);
        } finally {
            this.rl.close();
        }
    }

    // 💬 Función auxiliar para preguntas
    question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }
}

// 🚀 Ejecutar el sistema
const versionManager = new VersionManager();

// Flags: --normalize-changelog | -N
if (process.argv.includes('--normalize-changelog') || process.argv.includes('-N')) {
    versionManager.normalizeChangelog();
    process.exit(0);
}

versionManager.incrementVersionInteractive();