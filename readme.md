# Impulso IA - Proyecto Estructurado

Este proyecto ha sido reorganizado con una estructura de archivos separados para mejorar la mantenibilidad y organización del código.

## Estructura del Proyecto

```
proyecto-IA/
├── index.html              # Archivo HTML principal
├── css/
│   └── styles.css          # Estilos CSS del proyecto
├── js/
│   ├── config.js           # Configuraciones y constantes
│   ├── data.js             # Datos principales de las herramientas de IA
│   ├── data-complete.js    # Datos complementarios de herramientas
│   └── app.js              # Funcionalidad principal de la aplicación
├── img/                    # Carpeta de imágenes (existente)
│   ├── logos de herramientas...
│   └── otros recursos visuales...
└── README.md              # Este archivo
```

## Archivos Principales

### `index.html`
- Estructura HTML limpia sin estilos ni JavaScript embebido
- Referencias organizadas a archivos CSS y JS externos
- Mantiene toda la funcionalidad del proyecto original

### `css/styles.css`
- Todos los estilos CSS del proyecto
- Incluye estilos responsivos, animaciones y temas dark/light
- Estilos para componentes específicos como gráficos, modales y sliders

### `js/config.js`
- Configuraciones de APIs (Gemini, EmailJS)
- Configuración de Tailwind CSS
- Constantes del proyecto

### `js/data.js`
- Datos principales de las herramientas de IA
- Tips y información descriptiva
- Estructura de datos para comparativas

### `js/data-complete.js`
- Datos adicionales de herramientas (Fliki, Canva, Pictory, etc.)
- Complementa la información del archivo data.js

### `js/app.js`
- Funcionalidad principal de la aplicación
- Gestión de eventos y DOM
- Lógica de recomendaciones y UI

## Características

- ✅ **Estructura Modular**: Código separado por responsabilidades
- ✅ **Mantenimiento Fácil**: Archivos organizados y bien documentados
- ✅ **Funcionalidad Completa**: Todas las características originales preservadas
- ✅ **Responsive Design**: Optimizado para dispositivos móviles
- ✅ **Tema Dark/Light**: Soporte para ambos temas
- ✅ **Interactividad**: Gráficos, modales, formularios y animaciones

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con animaciones
- **JavaScript (ES6+)**: Funcionalidad interactiva
- **Tailwind CSS**: Framework de utilidades CSS
- **Chart.js**: Visualización de datos en gráficos radar
- **EmailJS**: Envío de correos desde el frontend
- **jsPDF + html2canvas**: Generación de PDFs

## APIs Integradas

- **Gemini AI**: Generación de estrategias personalizadas
- **EmailJS**: Envío de reportes por correo
- **Chart.js**: Visualización de datos

## Cómo Usar

1. Abre `index.html` en un navegador web
2. Asegúrate de que todos los archivos estén en las carpetas correctas
3. La aplicación cargará automáticamente todos los recursos

## Desarrollo

Para continuar desarrollando el proyecto:

1. **CSS**: Modifica `css/styles.css` para cambios de estilo
2. **JavaScript**: Edita archivos en `js/` según la funcionalidad
3. **Datos**: Actualiza `js/data.js` o `js/data-complete.js` para nuevas herramientas
4. **Configuración**: Modifica `js/config.js` para APIs o ajustes

## Ventajas de la Nueva Estructura

1. **Separación de Responsabilidades**: Cada archivo tiene un propósito específico
2. **Fácil Mantenimiento**: Cambios localizados en archivos específicos
3. **Reutilización**: Componentes pueden ser reutilizados fácilmente
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades
5. **Debugging**: Más fácil encontrar y corregir errores
6. **Colaboración**: Múltiples desarrolladores pueden trabajar sin conflictos

## Notas

- Mantén la estructura de carpetas para que las referencias funcionen correctamente
- Los archivos CSS y JS están optimizados para carga rápida
- Todas las funcionalidades originales se mantienen intactas 