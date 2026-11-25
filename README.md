# EVM Software Studio — Plataforma Web 3D & Sistema de Solicitudes (Programación 2)

Aplicación web moderna de ingeniería de software empresarial desarrollada en **HTML5 semántico, CSS3 con efectos 3D multicapa, JavaScript ES6+ y Three.js**, integrada con un backend propio en **Java 21 + C++17 + SQLite** y 100% compatible en modo estático con **GitHub Pages**.

- **Sitio publicado en GitHub Pages:** https://ediczon2006.github.io/trabalo_de_programacion2/
- **Contacto directo WhatsApp:** `+51 914 662 798`

## Estructura Principal del Proyecto

- **`index.html` / `style.css` / `script.js` (raíz, sincronizados con `web/` y `docs/`)**:
  - Estación holográfica 3D interactiva en la portada (`perspective`, `rotateX/Y`, capas `translateZ`) y fondo ligero en **Three.js** adaptable a móvil y escritorio.
  - Animaciones de entrada al hacer scroll (`IntersectionObserver`), ScrollSpy automático, menú móvil animado, buscador de comandos (`Ctrl + K`) y modo alternativo **Consola Técnica**.
  - Catálogo filtrable de 12 módulos de ingeniería y galería verificada de 4 sistemas en producción (`Pelitos Veterinaria`, `Ferretería Sullcairi PRO POS`, `Estación de Servicios Sullcairi` y `Leytrix ISP`).
  - Formulario de requerimientos en 3 pasos con carga múltiple de imágenes de referencia (`drag & drop`, selector o `Ctrl + V`), vista previa en vivo estilo WhatsApp, generación de ficha visual PNG y envío directo a `https://wa.me/51914662798`.
- **`assets/`**:
  - `assets/brand/`: Logotipo oficial (`evm-logo.png`) y portada Open Graph corporativa `1200x630` (`og-cover.png`).
  - `assets/portafolio/`: Capturas reales optimizadas para carga rápida en redes móviles.
- **Servidor Backend en Java 21 (`src/main/java/com/ediczon/software/`)**:
  - `Main.java`: Servidor HTTP concurrente con hilos virtuales (`/api/health`, `/api/proyectos`, `/api/solicitudes`, `/api/imagenes/{codigo}/{archivo}`, `/ver/{codigo}`).
  - `Database.java`: Persistencia relacional en **SQLite** (`sqlite-jdbc`).
  - `CppImageBridge.java`: Puente nativo hacia el validador binario en C++17.
- **Validador Binario de Imágenes en C++17 (`native/image_analyzer.cpp`)**:
  - Verifica firmas mágicas reales (PNG, JPEG, WebP, GIF), extrae dimensiones (`ancho x alto`) y calcula hash `FNV-1a` antes de registrar en base de datos.

## Ejecución Local Completa (Java 21 + C++17 + SQLite en Windows)

```powershell
.\build_and_run.ps1
```

Luego abre `http://localhost:8080` en tu navegador.

## Despliegue

- **GitHub Pages (Frontend Estático + WhatsApp + Ficha PNG):** publicado desde la rama `main` en `/ (root)` con `.nojekyll`.
- **Contenedor Docker (Backend Completo):** incluye `Dockerfile` multi-etapa listo para Railway, Render o cualquier plataforma OCI.
