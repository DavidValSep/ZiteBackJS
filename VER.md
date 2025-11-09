# 📋 **VER.md - Control de Versiones Y2Back**

---

## 🎯 **Versión Actual del Proyecto**
**v3.2.2** - 9 de noviembre de 2025

---

## 📁 **Archivos que Contienen Información de Versión**

### 🔧 **Archivos de Configuración**
```
📄 package.json
   Línea ~3: "version": "3.2.2"
   
📄 config.js
   Línea ~15: VERSION: "3.2.2"

📄 current-version.txt
   Contenido: 3.2.2
```

### 📚 **Archivos de Documentación**
```
📄 README.md
   Línea ~1: # 🚀 Así es Y2Back v3.2.2
   Línea ~7: [![Version](https://img.shields.io/badge/version-3.2.2-blue.svg)]
   Línea ~último: **Así es Y2Back v3.2.2** - Desarrollado...

📄 CHANGELOG.md
   Línea ~15: ## [3.2.2] - 2025-11-09
   [Referencias previas mantenidas para historial]

📄 VER.md
   Línea ~4: **v3.2.2** - 9 de noviembre de 2025
```

### 💻 **Archivos de Código**
```
📄 yoo2back.js
   Línea ~header: versión del core CLI

📄 y2back.js
   Línea ~header: proxy principal

📄 gui.js
   Línea ~header: launcher de GUI
```

### ⚙️ **Archivos de Configuración de Desarrollo**
```
📄 .vscode/settings.json (futuro)
   Puede contener referencias a versión para snippets

📄 .vscode/launch.json (futuro)
   Configuraciones de debug con versión
```

---

## 🔄 **Proceso de Actualización de Versión**

### 📋 **Checklist para Cambio de Versión**

#### **Paso 1: Actualizar Config Central**
- [ ] Modificar `config.js` con nueva versión
- [ ] Verificar que todos los archivos importen la versión desde config

#### **Paso 2: Documentación Principal**
- [ ] README.md - Título principal y referencias
- [ ] CHANGELOG.md - Agregar nueva entrada
- [ ] TECHNICAL-SPECS.md - Información general y footer
- [ ] DevGuia.md - Actualizaciones de roadmap

#### **Paso 3: Código**
- [ ] y2back.js - Header de comentarios y constante VERSION
- [ ] install-y2.js - Mensajes de instalación
- [ ] package.json - Versión npm

#### **Paso 4: Verificación**
- [ ] Ejecutar comando `y2 --version` y verificar salida
- [ ] Revisar que todas las referencias sean consistentes
- [ ] Actualizar este archivo VER.md con nuevas líneas

---

## 🎯 **Sistema de Versionado Automático (Futuro v0.2.0)**

### 🔧 **Script de Actualización Automática**
```bash
# update-version.js (futuro)
# Lee versión de config.js
# Actualiza automáticamente todos los archivos listados aquí
# Genera commit de Git con el cambio de versión
```

### 📊 **Herramientas de Verificación**
```bash
# check-versions.js (futuro)  
# Escanea todos los archivos listados
# Verifica que todas las versiones sean consistentes
# Reporta discrepancias
```

---

## 📈 **Historial de Versiones**

### **v3.2.2** - 9 de noviembre de 2025
- Scripts de deploy manager multiplataforma
- deploy-manager.sh (Linux)
- deploy-manager.cmd (Windows)
- deploy-manager-macos.sh (macOS)
- Cuestionarios interactivos para pruebas y deployment
- Validación de opciones y mensajes contextuales

### **v3.2.0** - 8 de noviembre de 2025
- GUI v2.0.0 con vista previa instantánea
- Búsqueda avanzada con --search-json y --limit
- Descarga masiva con --file y --downfile
- Flag --info para metadatos sin descarga
- Accesos directos y2/y2.cmd multiplataforma
- Documentación completa de 17 flags y recursos extraíbles

### **v3.1.0** - 8 de noviembre de 2025
- Deployment en producción (cPanel, VPS, dedicado)
- Bundles de deployment con binarios incluidos
- CORS configurable para APIs remotas
- GUI con soporte de API remota
- Sistema de instalación global

### **v3.0.1** - 3 de noviembre de 2025
- Transición total a y2back.js como núcleo único
- Refactor de argumentos y validaciones
- Sincronización de versiones en todos los archivos

### **v3.0.0** - 2 de noviembre de 2025
- Web App como PWA
- Service Worker con cache selectivo
- Reintentos automáticos de SSE

### **v2.0.0** - 31 de octubre de 2025
- Unificación de versiones
- GUI Electron mejorada
- Sistema de timeouts robusto

---

## 🔍 **Comandos Útiles para Verificación**

### 🔎 **Buscar Referencias de Versión**
```bash
# Buscar todas las líneas que contengan versión
grep -r "7\.0\.0" ./ --exclude-dir=node_modules
grep -r "v7\.0\.0" ./ --exclude-dir=node_modules
grep -r "version" ./ --exclude-dir=node_modules

# En Windows (PowerShell)
Select-String -Path "*.md", "*.js", "*.json" -Pattern "0\.1\.0"
```

### 📝 **Actualización Manual Rápida**
```bash
# Reemplazar versión en múltiples archivos (Linux/macOS)
find . -name "*.md" -o -name "*.js" | xargs sed -i 's/0\.1\.0/0\.2\.0/g'

# En Windows (PowerShell)
(Get-Content README.md) -replace '0\.1\.0', '0\.2\.0' | Set-Content README.md
```

---

*Última actualización: 9 de noviembre de 2025*  
*Versión de este archivo: v3.2.2*