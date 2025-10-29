# 📖 Guía de Uso - ZiteBackJS v5.0.3

## 🚀 Inicio Rápido

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/DavidValSep/ZiteBackJS.git
cd ZiteBackJS
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Compilar CSS (solo primera vez):**
```bash
npx tailwindcss -i ./src/gui.css -o ./dist/gui.css
```

4. **Iniciar la aplicación:**
```bash
npm start
```

## 🎯 Uso Básico

### 1. Clonar un Sitio Web Simple

1. Abre ZiteBackJS
2. Ingresa la URL completa: `https://example.com`
3. Mantén las opciones predeterminadas (todas marcadas)
4. Haz clic en **"Clonar Sitio Web"**
5. Observa los logs en tiempo real
6. El ZIP se generará automáticamente en la carpeta `downloads/`

### 2. Configurar Opciones de Clonado

#### Modo Headless
- **✅ Activado**: El navegador se ejecuta sin interfaz gráfica (más rápido, menos recursos)
- **❌ Desactivado**: Podrás ver el navegador mientras clona (útil para depuración)

#### Descargar Recursos
- **✅ Activado**: Descarga CSS, JavaScript e imágenes del sitio
- **❌ Desactivado**: Solo descarga el HTML principal

#### Captura de Pantalla
- **✅ Activado**: Genera un screenshot.png de página completa
- **❌ Desactivado**: No genera captura de pantalla

### 3. Gestionar Archivos

#### Abrir Carpeta de Descargas
Después de crear el ZIP, aparecerá el botón 📁 para abrir la carpeta donde se guardó.

#### Eliminar Carpeta Temporal
El proceso de clonado crea una carpeta temporal en `output/`. Usa el botón **"Eliminar Carpeta Temporal"** para limpiarla.

### 4. Cambiar Tema

Usa el toggle en la esquina superior derecha:
- 🌞 (izquierda) = Tema Claro
- 🌙 (derecha) = Tema Oscuro

Tu preferencia se guarda automáticamente.

## 📊 Entendiendo los Logs

Los logs usan colores para indicar el tipo de mensaje:

- **🔵 Azul (INFO)**: Información general del proceso
- **🟢 Verde (SUCCESS)**: Operación completada exitosamente
- **🟡 Amarillo (WARNING)**: Advertencias (no críticas)
- **🔴 Rojo (ERROR)**: Errores que deben ser atendidos

### Ejemplo de secuencia normal:

```
[10:30:15] ZiteBackJS v5.0.3 iniciado correctamente
[10:30:20] URL válida: https://example.com
[10:30:21] Iniciando proceso de clonado...
[10:30:22] Inicializando navegador Puppeteer...
[10:30:25] Navegador inicializado correctamente
[10:30:26] Navegando a la URL...
[10:30:30] Página cargada exitosamente
[10:30:31] Extrayendo HTML...
[10:30:32] HTML guardado: /path/to/output/index.html
[10:30:33] Capturando screenshot...
[10:30:35] Screenshot guardado: /path/to/output/screenshot.png
[10:30:36] Clonado completado exitosamente
[10:30:37] Creando archivo ZIP...
[10:30:40] ZIP creado exitosamente: clone-2025-10-29.zip (2.5 MB)
```

## 🎯 Casos de Uso Comunes

### Caso 1: Backup Rápido de un Sitio Web

**Objetivo**: Guardar una copia de un sitio web para backup.

**Pasos**:
1. URL: Ingresa la URL del sitio
2. Opciones: Todas activadas
3. Clonar → ZIP generado automáticamente
4. Guardar el ZIP en tu ubicación de backups

### Caso 2: Análisis de Estructura de Sitio

**Objetivo**: Estudiar la estructura HTML de un sitio.

**Pasos**:
1. URL: Ingresa la URL
2. Opciones: Solo "Modo Headless" activado
3. Clonar → Revisa el HTML en la carpeta output
4. No necesitas el ZIP, puedes eliminarlo

### Caso 3: Capturar Pantalla de Sitio Completo

**Objetivo**: Obtener screenshot de página completa.

**Pasos**:
1. URL: Ingresa la URL
2. Opciones: Activar "Modo Headless" y "Captura de Pantalla"
3. Desactivar "Descargar Recursos" (más rápido)
4. Clonar → El screenshot estará en el ZIP

### Caso 4: Migración de Sitio Web

**Objetivo**: Preparar archivos para migrar un sitio.

**Pasos**:
1. URL: Ingresa la URL completa
2. Opciones: Todas activadas
3. Desactivar "Modo Headless" para ver el proceso
4. Clonar → Verifica el ZIP generado
5. Usa los archivos para la migración

## ⚙️ Configuración Avanzada

### Modificar Opciones de Puppeteer

Edita `src/core.js` en la función `initBrowser()`:

```javascript
this.browser = await puppeteer.launch({
  headless: options.headless !== false ? 'new' : false,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security', // Solo para desarrollo
    '--disable-features=IsolateOrigins,site-per-process'
  ]
});
```

### Cambiar Timeout de Navegación

En `src/core.js`, función `cloneWebsite()`:

```javascript
await this.page.goto(url, {
  waitUntil: flags.waitUntil || 'networkidle2',
  timeout: flags.timeout || 60000  // Cambiar a 120000 para 2 minutos
});
```

### Personalizar Estilos de la GUI

1. Edita `src/gui.css` para estilos personalizados
2. Recompila con: `npm run build:css`
3. Reinicia la aplicación

### Agregar Nuevos Flags

1. **En `src/gui.js`**, agrega el flag al estado:
```javascript
flags: {
  headless: true,
  downloadResources: true,
  screenshot: true,
  miNuevoFlag: false  // Nuevo flag
}
```

2. **En `gui.html`**, agrega el checkbox:
```html
<div class="flag-item">
  <input 
    type="checkbox" 
    id="flagMiNuevo" 
    class="flag-checkbox checkbox-custom" 
    data-flag="miNuevoFlag"
  >
  <label for="flagMiNuevo" class="cursor-pointer flex-1">
    <div class="font-medium">Mi Nuevo Flag</div>
    <div class="text-xs text-gray-500">Descripción</div>
  </label>
</div>
```

3. **En `src/core.js`**, usa el flag:
```javascript
if (flags.miNuevoFlag) {
  // Lógica para el nuevo flag
}
```

## 🔍 Troubleshooting

### Problema: "URL inválida"
**Solución**: Asegúrate de incluir el protocolo (http:// o https://)
```
❌ example.com
✅ https://example.com
```

### Problema: Navegador no se cierra
**Solución**: Reinicia la aplicación. El navegador se cerrará automáticamente.

### Problema: No se descargan recursos
**Solución**: 
1. Verifica que "Descargar Recursos" esté activado
2. Algunos sitios bloquean la descarga de recursos externos
3. Revisa los logs para ver errores específicos

### Problema: ZIP no se genera
**Solución**:
1. Verifica que el clonado se completó exitosamente
2. Comprueba permisos de escritura en carpeta `downloads/`
3. Revisa logs de errores

### Problema: Pantalla negra al iniciar
**Solución**:
1. Verifica que `dist/gui.css` existe
2. Ejecuta: `npx tailwindcss -i ./src/gui.css -o ./dist/gui.css`
3. Reinicia la aplicación

### Problema: Error de Puppeteer
**Solución**:
```bash
# Reinstalar Puppeteer
npm uninstall puppeteer
PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer
```

## 💡 Tips y Trucos

### ⌨️ Atajos de Teclado
- **Enter** en el campo URL: Inicia el clonado
- **ESC**: Cierra la aplicación (solo en modo ventana)

### 🚀 Rendimiento
- Usa "Modo Headless" para mejor rendimiento
- Desactiva "Descargar Recursos" si solo necesitas HTML
- Limpia carpetas temporales regularmente

### 🎨 Personalización
- Los colores de logs se pueden cambiar en `src/gui.css`
- El tema se guarda en localStorage del navegador Electron
- Los flags se guardan automáticamente

### 📦 Organización
- Los ZIPs se nombran con timestamp: `clone-2025-10-29T10-30-15.zip`
- Organiza tus descargas por proyecto en carpetas
- Elimina carpetas temporales después de obtener el ZIP

### 🔄 Automatización
Para automatizar clonados, puedes usar el core directamente:

```javascript
const core = require('./src/core');

async function cloneMultipleSites() {
  const sites = [
    'https://site1.com',
    'https://site2.com',
    'https://site3.com'
  ];

  for (const url of sites) {
    await core.cloneWebsite({
      url,
      outputDir: `./output/${url.replace(/[^a-z0-9]/gi, '_')}`,
      flags: { headless: true, screenshot: true }
    });
  }
}
```

## 📚 Recursos Adicionales

- **README.md**: Documentación principal
- **VISUAL_DOCUMENTATION.md**: Descripción visual de la interfaz
- **test.js**: Tests básicos de verificación
- **package.json**: Scripts y dependencias

## 🆘 Soporte

Si encuentras problemas no listados aquí:

1. Revisa los logs detalladamente
2. Verifica la consola de DevTools (Ctrl+Shift+I en Windows/Linux, Cmd+Option+I en Mac)
3. Reporta el issue en GitHub con los logs completos
4. Incluye versión de Node.js: `node --version`

## 🎓 Aprendizaje

Para entender mejor el código:

1. **main.js**: Punto de entrada de Electron, maneja IPC
2. **src/core.js**: Lógica de clonado con Puppeteer
3. **src/gui.js**: Lógica de interfaz, maneja eventos
4. **gui.html**: Estructura HTML de la interfaz
5. **src/gui.css**: Estilos con Tailwind CSS

---

**¡Disfruta usando ZiteBackJS v5.0.3!** 🚀
