# 🚀 Sistema de Gestión de Versiones - Y2Back

<p align="center">
    <img src="https://cdn.susitio.cl/assets/images/logoY2B.png" alt="Y2Back logo" width="200" />
</p>

## 📋 **Descripción**
Sistema automático para incrementar versiones y mantener actualizados todos los archivos del proyecto con el nuevo número de versión.

## 🎯 **Funcionalidades**
- ✅ Incremento automático de versiones con lógica inteligente
- ✅ Actualización automática en todos los archivos relevantes
- ✅ Generación automática de entradas en CHANGELOG.md
- ✅ Validación de entrada de usuario
- ✅ Respaldo de versión actual en archivo independiente

## 🔢 **Lógica de Versionado**

### **Reglas de Incremento:**
- **Valores 1-9:** Incremento en la posición patch (x.x.+n)
- **Valor 10:** Incremento mayor (x+1.0.0)
- **Overflow automático:** Si patch > 9 → minor+1, patch=0
- **Overflow doble:** Si minor > 9 → major+1, minor=0, patch=0

### **Ejemplos Prácticos:**
```
Versión actual: v0.2.9
Incremento 1  → v0.3.0  (patch overflow)
Incremento 5  → v0.3.5  (incremento normal)
Incremento 10 → v1.0.0  (incremento mayor)

Versión actual: v0.9.8
Incremento 2  → v1.0.0  (doble overflow)
```

## 🚀 **Uso del Sistema**

### **Comando Principal:**
```bash
npm run update-version
```

### **Uso Manual:**
```bash
node version-manager.js
```

### **Proceso Interactivo:**
1. El sistema muestra la versión actual
2. Solicita valor de incremento (1-10)
3. Solicita descripción del cambio
4. Actualiza todos los archivos automáticamente
5. Genera entrada en CHANGELOG.md
6. Confirma éxito de la operación

## 📁 **Archivos Actualizados Automáticamente**

| Archivo | Ubicación de Versión | Descripción |
|---------|---------------------|-------------|
| `package.json` | `"version": "x.x.x"` | Versión NPM del paquete |
| `y2back.js` | `@version x.x.x` | Variable de versión principal |
| `config.js` | `VERSION: "x.x.x"` | Configuración central de versión |
| `README.md` | Múltiples referencias | Documentación y ejemplos |
| `y2.cmd` | Comentarios | Script Windows con versión |
| `current-version.txt` | Contenido completo | Respaldo de versión actual |

## 🔧 **Configuración**

### **Archivos de Configuración:**
- `current-version.txt` - Almacena la versión actual de forma segura
- `CHANGELOG.md` - Se genera/actualiza automáticamente
- `version-manager.js` - Script principal del sistema

### **Personalización:**
```javascript
// Agregar nuevos archivos a actualizar
const VERSION_FILES = [
    'package.json',
    'y2back.js',
    'config.js',
    'nuevo-archivo.js'  // ← Agregar aquí
];
```

## 📝 **Formato de CHANGELOG Generado**
```markdown
### ✨ **v0.2.5 (29 Oct 2025) - "Descripción del cambio"**
- Descripción del cambio
```

## ⚠️ **Notas Importantes**
- **Respaldo automático:** La versión se guarda en `current-version.txt`
- **Validación:** Solo acepta valores 1-10 y descripción no vacía
- **Seguridad:** Si falla la actualización, la versión anterior se mantiene
- **Flexibilidad:** Fácil de extender para nuevos archivos o formatos

## 🎯 **Ejemplos de Uso Común**

### **Cambio Menor (+0.0.1):**
```bash
$ npm run update-version
Incremento: 1
Descripción: "Corrección de bug menor en validación de URLs de YouTube"
```

### **Cambio Funcional (+0.1.0):**
```bash
$ npm run update-version  
Incremento: 10
Descripción: "Implementación de nuevo sistema de búsqueda integrada"
```

### **Cambio Mayor (+1.0.0):**
```bash
$ npm run update-version
Incremento: 10 (cuando ya estás en x.9.x)
Descripción: "Refactorización completa del sistema de descarga"
```

## 🔄 **Flujo de Trabajo Recomendado**
1. **Desarrollar** nueva funcionalidad
2. **Testear** cambios
3. **Ejecutar** `npm run update-version`
4. **Commit** todos los archivos actualizados
5. **Push** al repositorio

---

**Desarrollado por:** DavidValSep (SuSitio.cl)  
**Fecha:** 29 de Octubre, 2025  
**Licencia:** GPL-3.0-or-later