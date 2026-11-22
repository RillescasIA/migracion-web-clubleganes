# Web Club Leganés Club

Proyecto web oficial para **Club Leganés Club** (`clubleganesclub.es`), entidad deportiva fundada en 1994 en Leganés (Madrid).

## Estructura del proyecto

```text
web clubleganesclub/
├── index.html          # Página principal (Hero, Actividades, Pabellones, El Club, Contacto)
├── css/
│   └── styles.css      # Sistema de diseño moderno y responsive
├── js/
│   ├── data.js         # Datos editables (actividades, horarios de referencia, pabellones y contacto)
│   └── main.js         # Renderizado dinámico, filtros de actividades, menú móvil y formulario
├── assets/
│   └── favicon.svg     # Logotipo e icono vectorial base
├── server.mjs          # Servidor local ligero con Node.js (sin dependencias externas)
├── .gitignore          # Exclusiones estándar de Git
└── README.md           # Documentación del proyecto
```

## Cómo visualizar la web en local

1. **Acceso directo (sin servidor):** abre directamente `index.html` con doble clic en cualquier navegador.
2. **Con servidor local (Node.js):**
   ```powershell
   node server.mjs
   ```
   Y abre `http://localhost:3000`.

## Personalización rápida

- **Actualizar actividades, horarios o pabellones:** edita el archivo `js/data.js`.
- **Ajustar colores y estilos:** modifica las variables CSS en `:root` dentro de `css/styles.css`.
- **Imágenes reales del club:** añade fotografías optimizadas (`.webp` / `.jpg`) en la carpeta `assets/` para incorporarlas al hero o a las galerías.
