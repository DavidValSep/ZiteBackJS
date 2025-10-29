# 🎯 Control de Versiones ZiteBackJS

## 📍 Ubicaciones de VERSION en el código

### 📄 **ziteback.js**
- **Línea 4:** Encabezado ASCII `ZiteBackJS v3.9.1`
- **Línea 17:** Comentario `📊 Versión: 3.9.1` 
- **Línea 93:** Variable `const VERSION = "3.9.1"`
- **Línea 111:** Variable mensajes `const VERSION = "3.9.1"`
- **Línea 1632:** Progreso descarga `v3.9.1`

### 📄 **ziteback-mensajes.js**
- **Línea 7:** Comentario `📊 Versión: 3.9.1`

### 📄 **package.json**
- **Campo version:** `"version": "3.9.1"`

## 🔄 Proceso para actualizar versión

1. **Buscar y reemplazar** todas las ocurrencias de la versión anterior
2. **Verificar archivos:** ziteback.js, ziteback-mensajes.js, package.json
3. **Actualizar CHANGELOG:** Crear nuevo archivo CHANGELOG_vX.X.X.md
4. **Verificar consistencia:** Ejecutar verificación de versiones

## 📝 Formato de versión: X.Y.Z
- **X:** Cambios mayores (breaking changes)
- **Y:** Nuevas funcionalidades 
- **Z:** Correcciones de bugs

## ⚠️ IMPORTANTE
- **SIEMPRE** mantener consistencia entre todos los archivos
- **NUNCA** usar 4 dígitos (X.Y.Z.W)
- **VERIFICAR** que no queden versiones antiguas mezcladas