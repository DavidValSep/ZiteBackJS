# Documentación Visual de la GUI v5.0.3

## 🎨 Descripción de la Interfaz

La interfaz gráfica de ZiteBackJS v5.0.3 está construida con Electron y Tailwind CSS, proporcionando una experiencia moderna y profesional.

## 📐 Layout Principal

### Header (Superior)
```
+----------------------------------------------------------------+
| 🚀 ZiteBackJS [v5.0.3]              [Fecha/Hora] 🌞 [○] 🌙   |
+----------------------------------------------------------------+
```

El header incluye:
- Logo y título con gradiente azul-púrpura
- Badge de versión con gradiente
- Fecha y hora en tiempo real
- Toggle para cambiar entre tema claro/oscuro

### Sección Principal (Layout de 3 columnas en desktop, 1 en móvil)

#### Columna Izquierda (2/3 del ancho)

**1. Card de URL Input**
```
+----------------------------------------------------------+
| 🌐 URL del Sitio Web                                     |
|                                                           |
| [https://ejemplo.com________________________]            |
|                                                           |
| [📥 Clonar Sitio Web]  [📁]                              |
|                                                           |
| [████████████████████████████] (Progress bar oculto)     |
+----------------------------------------------------------+
```

**2. Card de Opciones de Clonado**
```
+----------------------------------------------------------+
| ⚙️ Opciones de Clonado                                    |
|                                                           |
| Grid de 3 columnas:                                      |
| [✓] Modo Headless          [✓] Descargar Recursos        |
|     Navegador sin interfaz     CSS, JS, imágenes         |
|                                                           |
| [✓] Captura de Pantalla                                  |
|     Full page screenshot                                  |
+----------------------------------------------------------+
```

**3. Card de Gestión de Archivos**
```
+----------------------------------------------------------+
| 🗑️ Gestión de Archivos                                    |
|                                                           |
| [🗑️ Eliminar Carpeta Temporal]                           |
+----------------------------------------------------------+
```

#### Columna Derecha (1/3 del ancho)

**Card de Logs Dinámicos**
```
+--------------------------------+
| 📝 Logs Dinámicos         [✕]  |
|                                |
| +----------------------------+ |
| | [HH:MM:SS] Log message     | |
| | [HH:MM:SS] Success msg ✓   | |
| | [HH:MM:SS] Error msg ✗     | |
| | [HH:MM:SS] Info message    | |
| | ...                        | |
| | (scroll automático)        | |
| +----------------------------+ |
+--------------------------------+
```

### Footer
```
+----------------------------------------------------------------+
| ZiteBackJS v5.0.3 - Sistema revolucionario de clonado web      |
| 🚀 Ideal para sitios SPA/React/Vue/Angular | 🌍 Multilenguaje  |
| Desarrollado con ♥ usando Electron + Tailwind CSS              |
+----------------------------------------------------------------+
```

## 🎨 Temas

### Tema Claro
- **Background principal**: Gris claro (#F9FAFB)
- **Cards**: Blanco (#FFFFFF)
- **Texto principal**: Gris oscuro (#111827)
- **Botón primario**: Azul (#3B82F6)
- **Bordes**: Gris claro (#E5E7EB)

### Tema Oscuro
- **Background principal**: Gris muy oscuro (#111827)
- **Cards**: Gris oscuro (#1F2937)
- **Texto principal**: Blanco (#F9FAFB)
- **Botón primario**: Azul (#3B82F6)
- **Bordes**: Gris medio oscuro (#374151)

## 🎯 Elementos Interactivos

### Botones
1. **Clonar Sitio Web** (Primario)
   - Color: Azul con hover más oscuro
   - Icono: Flecha de descarga
   - Estado: Normal / Procesando (con animación pulse)

2. **Abrir Carpeta** (Secundario)
   - Color: Gris con hover más oscuro
   - Icono: Carpeta
   - Se muestra después de crear el ZIP

3. **Eliminar Carpeta Temporal** (Secundario)
   - Color: Gris con hover más oscuro
   - Icono: Papelera
   - Estado: Deshabilitado hasta que hay carpeta

4. **Limpiar Logs** (Pequeño)
   - Icono: X
   - Color: Gris con hover oscuro

### Inputs
1. **URL Input**
   - Placeholder: "https://ejemplo.com"
   - Borde azul al hacer focus
   - Deshabilitado durante el proceso

2. **Checkboxes** (Flags)
   - Estilo personalizado azul
   - Animación suave al seleccionar
   - Labels informativos con subtítulo

### Toggle Tema
```
Claro:  🌞 [○--------] 🌙
Oscuro: 🌞 [--------○] 🌙
```

## 📊 Logs Dinámicos

Los logs usan colores según el tipo:

- **INFO**: Azul claro/oscuro
- **SUCCESS**: Verde claro/oscuro
- **WARNING**: Amarillo claro/oscuro
- **ERROR**: Rojo claro/oscuro

Características:
- Auto-scroll al final
- Animación de entrada (slideIn)
- Fuente monoespaciada
- Timestamps en cada entrada
- Scrollbar personalizado

## 🎭 Animaciones

1. **Slide In**: Para nuevos logs (0.3s ease-out)
2. **Pulse**: Para botón durante procesamiento
3. **Hover**: Transiciones suaves en todos los elementos (0.2s)
4. **Theme Toggle**: Transición del slider (0.3s)

## 📱 Responsive Design

### Desktop (> 1024px)
- Layout de 3 columnas
- Cards con máximo ancho
- Todas las características visibles

### Tablet (768px - 1024px)
- Layout de 2 columnas
- Fecha/hora visible
- Grid de flags 2x2

### Mobile (< 768px)
- Layout de 1 columna
- Fecha/hora oculta
- Grid de flags 1x1
- Padding reducido en cards

## 🎨 Componentes Personalizados

### Cards
- Fondo blanco/gris oscuro
- Sombra suave
- Bordes redondeados (12px)
- Padding 24px

### Progress Bar
- Alto: 10px
- Color: Azul con animación fluida
- Fondo: Gris claro/oscuro
- Bordes redondeados

### Scrollbar (Logs)
- Ancho: 8px
- Color del thumb: Gris medio
- Hover: Gris claro
- Track: Gris oscuro

## 🚀 Flujo de Usuario

1. Usuario abre la aplicación
2. Ve el logo, versión y puede elegir tema
3. Ingresa URL del sitio a clonar
4. Configura flags según necesidades
5. Click en "Clonar Sitio Web"
6. Ve logs en tiempo real del proceso
7. Se genera automáticamente el ZIP
8. Puede abrir la carpeta de descargas
9. Opcionalmente elimina carpeta temporal
10. Puede clonar otro sitio

## 💡 Características de Usabilidad

- ✅ Feedback visual inmediato en todas las acciones
- ✅ Estados deshabilitados claros durante procesos
- ✅ Mensajes de error informativos
- ✅ Persistencia de preferencias (tema y flags)
- ✅ Atajos de teclado (Enter para clonar)
- ✅ Tooltips informativos
- ✅ Colores accesibles (contraste WCAG AA)
- ✅ Iconos SVG escalables

## 🔧 Personalización Futura

La arquitectura modular permite fácilmente:
- Agregar más flags de configuración
- Añadir nuevos tipos de logs
- Integrar más idiomas
- Exportar configuraciones
- Agregar perfiles de clonado
- Programar clonados automáticos
- Historial de clonados

---

**Nota**: Esta documentación describe la interfaz implementada en la versión 5.0.3 de ZiteBackJS.
