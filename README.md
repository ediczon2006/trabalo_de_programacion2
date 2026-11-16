# Portafolio y Plataforma de Solicitudes de Software (Java + C++ + SQLite)

Aplicacion web en espanol para mostrar proyectos reales de software, recibir requerimientos de clientes junto con imagenes de referencia, almacenarlos en base de datos y redirigir el pedido completo al WhatsApp **+51 914 662 798**.

## Arquitectura del proyecto

- **Servidor y API REST en Java (`src/main/java/com/ediczon/software/`)**:
  - `Main.java`: Servidor HTTP multihilo con hilos virtuales y rutas `/api/proyectos`, `/api/solicitudes`, `/api/imagenes/{codigo}/{archivo}`, `/ver/{codigo}` y `/api/health`.
  - `MultipartParser.java`: Procesamiento de formularios `multipart/form-data` con texto y multiples imagenes.
  - `Database.java`: Persistencia en **SQLite** (`sqlite-jdbc`) con tablas `proyectos_portafolio`, `solicitudes` e `imagenes_referencia`.
  - `CppImageBridge.java`: Invocacion al modulo nativo en C++.
- **Procesador de imagenes en C++17 (`native/image_analyzer.cpp`)**:
  - Valida firmas binarias reales (PNG, JPEG, WebP, GIF), extrae dimensiones (`ancho x alto`) y calcula checksum FNV-1a antes de guardar en SQLite.
- **Interfaz web (`web/` y copia estatica en `docs/`)**:
  - Galeria de los 4 proyectos reales verificados (`Pelitos Veterinaria`, `Ferreteria Sullcairi PRO POS`, `Estacion de Servicios Sullcairi`, `Leytrix ISP`).
  - Formulario de requerimiento ("que quieres que haga tu software"), subida multiple de imagenes (arrastrar, seleccionar o `Ctrl + V`), descarga de ficha PNG, envio con guardado en base de datos y redireccion a `https://wa.me/51914662798`.
- **Archivo entregable incluido**:
  - `entregables/portafolio_capturas.zip`: Paquete ZIP con todas las capturas limpias y piezas `1080x1080` de los 5 proyectos.

## Compilar y ejecutar localmente (Windows)

```powershell
.\build_and_run.ps1
```

Luego abre `http://localhost:8080` en tu navegador.

## Despliegue en la nube

- **Backend completo (Java + C++ + SQLite + almacenamiento de imagenes):** incluye `Dockerfile` listo para desplegar en Railway u otro proveedor de contenedores.
- **Vista estatica en GitHub Pages:** la carpeta `docs/` permite activar GitHub Pages directamente desde el repositorio (con redireccion a WhatsApp, compartir imagenes en movil y descarga de ficha PNG).
