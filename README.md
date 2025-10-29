# ZiteBackJS v5.0.3

🚀 Sistema revolucionario de clonado web inteligente con Puppeteer e interfaz gráfica Electron + Tailwind CSS. Ideal para sitios con código dinámico SPA/React/Vue/Angular, imágenes retina, multilenguaje (6 idiomas, incluido Mapudungun y Русский), procesamiento universal de URLs, corrección automática de recursos y descarga completa. ¡Ideal para backups, migraciones y algunas cosillas más☠️!

## ✨ Características Principales

- **🎨 Interfaz Gráfica Moderna**: GUI construida con Electron y Tailwind CSS
- **🌓 Tema Claro/Oscuro**: Soporte completo para tema claro y oscuro
- **📊 Logs Dinámicos**: Sistema de logs en tiempo real con diferentes niveles
- **🔧 Flags Configurables**: Opciones personalizables para el clonado
- **📦 Generación de ZIP**: Compresión automática de sitios clonados
- **🧹 Gestión de Archivos Temporales**: Eliminación de carpetas temporales
- **📱 Diseño Responsivo**: Preparado para migración móvil
- **⚡ Arquitectura Modular**: Core separado de la GUI

## 🏗️ Arquitectura

El proyecto está organizado de forma modular:

```
ZiteBackJS/
├── main.js              # Punto de entrada de Electron
├── gui.html             # Interfaz gráfica (HTML)
├── package.json         # Dependencias y scripts
├── tailwind.config.js   # Configuración de Tailwind CSS
├── src/
│   ├── core.js          # Lógica core de clonado web (Node.js)
│   ├── gui.js           # Lógica de la interfaz gráfica
│   └── gui.css          # Estilos CSS con Tailwind
├── dist/
│   └── gui.css          # CSS compilado por Tailwind
├── downloads/           # Archivos ZIP generados
└── output/              # Sitios clonados (temporal)
```

## 🚀 Instalación

### Requisitos Previos

- Node.js (v16 o superior)
- npm (v7 o superior)

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/DavidValSep/ZiteBackJS.git
cd ZiteBackJS
```

2. Instalar dependencias:
```bash
npm install
```

3. Compilar estilos CSS:
```bash
npm run build:css
```

## 🎮 Uso

### Iniciar la Aplicación

```bash
npm start
```

### Funcionalidades

1. **Ingresar URL**: Introduce la URL del sitio web que deseas clonar
2. **Configurar Flags**: 
   - Modo Headless: Navegador sin interfaz gráfica
   - Descargar Recursos: CSS, JS, imágenes
   - Captura de Pantalla: Screenshot de página completa
3. **Clonar Sitio**: Click en "Clonar Sitio Web"
4. **Descargar ZIP**: Se genera automáticamente tras el clonado
5. **Eliminar Temporal**: Limpia carpetas temporales después del proceso

### Atajos de Teclado

- `Enter` en el campo URL: Inicia el clonado
- Toggle tema: Cambio rápido entre claro/oscuro

## 📋 Scripts Disponibles

```bash
# Iniciar aplicación
npm start

# Compilar CSS en modo watch
npm run build:css

# Desarrollo (CSS watch + Electron)
npm run dev

# Tests
npm test
```

## 🔧 Configuración

### Flags de Clonado

Los flags se pueden configurar desde la interfaz gráfica:

- **headless**: Ejecutar navegador sin interfaz (default: true)
- **downloadResources**: Descargar recursos externos (default: true)
- **screenshot**: Capturar screenshot (default: true)
- **waitUntil**: Condición de espera ('networkidle2', 'load', 'domcontentloaded')
- **timeout**: Tiempo máximo de espera en ms (default: 60000)
- **waitTime**: Tiempo adicional de espera después de cargar

### Tema

El tema (claro/oscuro) se guarda automáticamente en localStorage y se mantiene entre sesiones.

## 🎨 Personalización

### Tailwind CSS

Edita `tailwind.config.js` para personalizar colores, fuentes y más:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',
          dark: '#2563eb',
        },
      },
    },
  },
}
```

### Estilos Personalizados

Agrega estilos en `src/gui.css` dentro de las directivas `@layer`:

```css
@layer components {
  .mi-clase-personalizada {
    @apply bg-blue-500 text-white p-4;
  }
}
```

## 🔌 API del Core

El módulo core (`src/core.js`) expone las siguientes funciones:

```javascript
// Clonar sitio web
await core.cloneWebsite({
  url: 'https://example.com',
  outputDir: './output/mi-sitio',
  flags: { headless: true, screenshot: true }
});

// Crear ZIP
await core.createZip(sourcePath, zipPath);

// Eliminar carpeta temporal
await core.deleteTempFolder(folderPath);

// Configurar callback de logs
core.setLogCallback((logData) => {
  console.log(logData.message);
});
```

## 📱 Preparación para Móvil

La interfaz está diseñada con un enfoque mobile-first usando Tailwind CSS:

- Grid responsivo que se adapta a diferentes tamaños
- Breakpoints configurados (sm, md, lg, xl)
- Componentes modulares listos para React Native/Ionic

## 🔒 Seguridad

- No se almacenan credenciales en el código
- Los archivos temporales se eliminan después del uso
- Validación de URLs antes del procesamiento
- Manejo seguro de errores en todos los procesos

## 🐛 Solución de Problemas

### Puppeteer no descarga el navegador

Si hay problemas con la descarga de Chromium:

```bash
PUPPETEER_SKIP_DOWNLOAD=true npm install
```

### CSS no se compila

Verifica que Tailwind esté instalado:

```bash
npm install -D tailwindcss
npx tailwindcss -i ./src/gui.css -o ./dist/gui.css
```

## 📄 Licencia

MIT

## 👨‍💻 Autor

**DavidValSep**

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

### v5.0.3 (2025-10-29)
- ✨ Nueva interfaz gráfica con Electron + Tailwind CSS
- 🎨 Soporte para tema claro/oscuro
- 📊 Sistema de logs dinámicos en tiempo real
- 🔧 Configuración de flags desde la GUI
- 📦 Generación automática de ZIP
- 🧹 Gestión de carpetas temporales
- 📱 Diseño responsivo preparado para móvil
- ⚡ Arquitectura modular (core separado de GUI)

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
