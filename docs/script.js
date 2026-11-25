/**
 * ==========================================================================
 * EVM SOFTWARE STUDIO — FRONTEND INTERACTIVO, ANIMACIONES & 3D (script.js)
 * Código ES6+ modular, accesible y libre de errores en consola.
 * Compatible 100% con GitHub Pages (modo estático) y con el backend local
 * Java 21 + C++17 + SQLite cuando se ejecuta en servidor propio.
 * ==========================================================================
 */

const CONFIG = {
  whatsappCountryCode: "51",
  whatsappNumber: "914662798",
  maxImages: 8,
  maxFileSizeBytes: 12 * 1024 * 1024,
  apiBaseUrl: "",
};

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Normaliza cualquier ruta de imagen o recurso para que sea siempre relativa
 * al documento actual y funcione tanto en subdirectorios de GitHub Pages
 * (/trabalo_de_programacion2/) como en servidor local.
 */
function resolveAssetUrl(relPath) {
  if (!relPath) return "";
  if (/^(https?:|data:|blob:)/i.test(relPath)) return relPath;
  return String(relPath).replace(/^[./\\]+/, "");
}

/**
 * Detecta si la página corre en un alojamiento estático puro (GitHub Pages o archivo local)
 * para evitar peticiones innecesarias /api/* que generarían errores 404 en consola.
 */
function isPureStaticEnvironment() {
  if (CONFIG.apiBaseUrl) return false;
  if (window.location.protocol === "file:") return true;
  const host = window.location.hostname.toLowerCase();
  return (
    host.endsWith(".github.io") ||
    host.endsWith(".pages.dev") ||
    host.endsWith(".netlify.app")
  );
}

function apiUrl(path) {
  const cleanPath = String(path || "").replace(/^\/+/, "");
  return CONFIG.apiBaseUrl ? `${CONFIG.apiBaseUrl.replace(/\/+$/, "")}/${cleanPath}` : `./${cleanPath}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* === 1. DATOS VERIFICADOS DE CASOS REALES Y MÓDULOS DE INGENIERÍA === */
const FALLBACK_PROJECTS = [
  {
    slug: "01_Pelitos_Web",
    nombre: "Pelitos Veterinaria",
    tipo: "Sitio web comercial y catálogo en línea",
    descripcion:
      "Sitio web informativo y comercial de clínica veterinaria, estética canina y petshop en Huánuco, con reserva rápida de citas, directorio de servicios y catálogo de productos.",
    urlPublica: "https://ediczon2006.github.io/Pelitos_Veterinarias/",
    imagenPrincipal: "assets/portafolio/01_Pelitos_Web/capturas_limpias/01_inicio_escritorio.png",
    galeria: [
      "assets/portafolio/01_Pelitos_Web/capturas_limpias/01_inicio_escritorio.png",
      "assets/portafolio/01_Pelitos_Web/capturas_limpias/02_catalogo_petshop.png",
      "assets/portafolio/01_Pelitos_Web/capturas_limpias/03_servicios_veterinarios.png",
      "assets/portafolio/01_Pelitos_Web/capturas_limpias/04_vista_movil.png",
    ],
    aspectos: [
      "Selector rápido de reserva de cita en portada",
      "Catálogo PetShop con buscador, conteo y filtros",
      "Directorio de servicios médicos con detalle desplegable",
    ],
  },
  {
    slug: "03_Ferreteria_Sullcairi",
    nombre: "Ferretería Sullcairi PRO POS",
    tipo: "Sistema web de inventario y reportes comerciales",
    descripcion:
      "Sistema de control de stock y caja en modo local con indicadores de inventario, importación y exportación en Excel, alertas de reposición y resumen comercial de ventas.",
    urlPublica: "https://ediczon2006.github.io/ferreteria_sullcairi/",
    imagenPrincipal: "assets/portafolio/03_Ferreteria_Sullcairi/capturas_limpias/01_inventario_y_stock.png",
    galeria: [
      "assets/portafolio/03_Ferreteria_Sullcairi/capturas_limpias/01_inventario_y_stock.png",
      "assets/portafolio/03_Ferreteria_Sullcairi/capturas_limpias/02_resumen_de_ventas.png",
    ],
    aspectos: [
      "Control de inventario con filtros por categoría y stock",
      "Plantilla, importación y exportación de catálogo a Excel",
      "Resumen comercial con ingresos, ganancia neta e historial",
    ],
  },
  {
    slug: "04_Sullcairi",
    nombre: "Estación de Servicios Sullcairi",
    tipo: "Portal de acceso de sistema operativo",
    descripcion:
      "Portal de autenticación para estación de servicios con selector visual por perfil/turno y teclado numérico táctil para ingreso seguro mediante código PIN.",
    urlPublica: "https://ediczon2006.github.io/sullcairi/login.html",
    imagenPrincipal: "assets/portafolio/04_Sullcairi/capturas_limpias/01_login_escritorio.png",
    galeria: [
      "assets/portafolio/04_Sullcairi/capturas_limpias/01_login_escritorio.png",
      "assets/portafolio/04_Sullcairi/capturas_limpias/02_login_movil.png",
    ],
    aspectos: [
      "Selector de perfiles de administrador y turnos de atención",
      "Teclado numérico en pantalla para código PIN",
      "Interfaz centrada adaptable en escritorio y móvil",
    ],
  },
  {
    slug: "05_Leyder",
    nombre: "Leytrix ISP",
    tipo: "Panel administrativo para proveedor de internet",
    descripcion:
      "Panel de control para gestión de clientes de internet por zonas geográficas, registro de pagos y vouchers bancarios, cortes y reconexiones, y galería fotográfica.",
    urlPublica: "https://ediczon2006.github.io/leyder/",
    imagenPrincipal: "assets/portafolio/05_Leyder/capturas_limpias/01_panel_de_control.png",
    galeria: [
      "assets/portafolio/05_Leyder/capturas_limpias/01_panel_de_control.png",
      "assets/portafolio/05_Leyder/capturas_limpias/02_cortes_y_reconexion.png",
      "assets/portafolio/05_Leyder/capturas_limpias/03_pagos_y_vouchers.png",
      "assets/portafolio/05_Leyder/capturas_limpias/04_vista_movil.png",
    ],
    aspectos: [
      "Panel de control con métricas de red y tabla por zonas",
      "Gestión de cortes, reconexiones y morosidad",
      "Registro de pagos y comprobantes Yape / BCP",
    ],
  },
];

const MODULE_SPECS = {
  "core-erp": {
    title: "Core Bancario & ERP Cloud",
    cat: "ERP & Finanzas",
    summary: "Núcleo transaccional multi-sucursal con libro mayor inmutable, conciliación automática y auditoría completa.",
    deploy: "12–16 semanas",
    cx: "5 / 5 (Alta)",
    demand: "98% índice",
    tier: "Enterprise",
    presetType: "Sistema Web a Medida",
    stack: "TypeScript • Go • PostgreSQL • AWS • Docker",
    deliverables: [
      "Motor contable y tesorería multi-moneda con trazabilidad total",
      "API Gateway autenticado con control de acceso basado en roles (RBAC)",
      "Reportes financieros en tiempo real y exportación contable",
      "Transferencia 100% de código fuente y manuales de arquitectura",
    ],
  },
  billing: {
    title: "Facturación Electrónica & Tesorería",
    cat: "ERP & Finanzas",
    summary: "Emisión automatizada de comprobantes electrónicos, notas de crédito, liquidaciones y control de cuentas por cobrar.",
    deploy: "4–6 semanas",
    cx: "3 / 5 (Media)",
    demand: "92% índice",
    tier: "Modular",
    presetType: "Sistema de Ventas / Inventario",
    stack: "Java 21 • Spring • Redis • REST • XML/UBL",
    deliverables: [
      "Integración directa con OSE / SUNAT y validación de firmas digitales",
      "Bandeja de comprobantes PDF/XML y envío automático por WhatsApp/correo",
      "Dashboard de flujo de caja y alertas de vencimiento",
    ],
  },
  pos: {
    title: "POS & Inventario Omnicanal",
    cat: "ERP & Finanzas",
    summary: "Punto de venta veloz con control de stock multi-almacén, kardex valorizado, alertas de reposición y cierre de caja.",
    deploy: "3–4 semanas",
    cx: "2 / 5 (Ágil)",
    demand: "95% índice",
    tier: "Modular",
    presetType: "Sistema de Ventas / Inventario",
    stack: "JavaScript • Node.js • SQLite • PWA • Excel I/O",
    deliverables: [
      "Terminal de caja optimizado para lector de código de barras y pantallas táctiles",
      "Importación y exportación masiva de catálogo en Excel",
      "Resumen diario de ingresos, margen neto y productos de alta rotación",
    ],
  },
  multicloud: {
    title: "Arquitectura Multi-Cloud",
    cat: "Cloud & DevOps",
    summary: "Diseño y aprovisionamiento de infraestructura elástica de alta disponibilidad con recuperación ante desastres.",
    deploy: "8–10 semanas",
    cx: "5 / 5 (Alta)",
    demand: "88% índice",
    tier: "Enterprise",
    presetType: "Sistema Web a Medida",
    stack: "Terraform • Kubernetes • AWS • GCP • OpenTelemetry",
    deliverables: [
      "Módulos Terraform versionados para entornos dev, staging y producción",
      "Clústeres con auto-escalado horizontal y balanceo multi-zona",
      "Tableros de observabilidad (métricas, logs y trazas distribuidas)",
    ],
  },
  cicd: {
    title: "Pipelines CI/CD & GitOps",
    cat: "Cloud & DevOps",
    summary: "Automatización de compilación, pruebas, escaneo de seguridad y despliegue continuo sin interrupción de servicio.",
    deploy: "2–3 semanas",
    cx: "3 / 5 (Media)",
    demand: "84% índice",
    tier: "Modular",
    presetType: "Rediseño o Mejoras",
    stack: "GitHub Actions • Docker • ArgoCD • Trivy",
    deliverables: [
      "Pipelines de build y test automatizados en cada Pull Request",
      "Imágenes de contenedor firmadas y optimizadas (multi-stage)",
      "Rollback instantáneo y despliegues canary/blue-green",
    ],
  },
  agents: {
    title: "Agentes Autónomos IA",
    cat: "IA & Agentes",
    summary: "Agentes empresariales conectados a tus bases de datos y APIs internas con RAG, memoria y guardrails de seguridad.",
    deploy: "6–8 semanas",
    cx: "5 / 5 (Alta)",
    demand: "97% índice",
    tier: "Enterprise",
    presetType: "Sistema Web a Medida",
    stack: "Python • LangGraph • Gemini API • pgvector",
    deliverables: [
      "Indexación semántica de documentos y manuales corporativos (RAG)",
      "Ejecución de herramientas (consultas SQL seguras, generación de reportes)",
      "Panel de auditoría de conversaciones y métricas de precisión",
    ],
  },
  "wa-bot": {
    title: "Asistentes WhatsApp con IA",
    cat: "IA & Agentes",
    summary: "Canal comercial automatizado que responde consultas, muestra catálogo, cotiza y deriva a asesores humanos.",
    deploy: "2–3 semanas",
    cx: "3 / 5 (Media)",
    demand: "93% índice",
    tier: "Modular",
    presetType: "Catálogo o Tienda Online",
    stack: "Node.js • WhatsApp Cloud API • RAG • Webhooks",
    deliverables: [
      "Flujos conversacionales híbridos (IA + reglas de negocio)",
      "Sincronización con catálogo de productos, stock y reservas",
      "Bandeja de traspaso a agente humano con historial completo",
    ],
  },
  vision: {
    title: "Visión Computacional & OCR",
    cat: "IA & Agentes",
    summary: "Extracción estructurada de datos desde vouchers, facturas, DNI y validación binaria de imágenes de alta velocidad.",
    deploy: "7–9 semanas",
    cx: "4 / 5 (Avanzada)",
    demand: "72% índice",
    tier: "Enterprise",
    presetType: "Sistema Web a Medida",
    stack: "C++17 • Python • OpenCV • ONNX Runtime",
    deliverables: [
      "Motor nativo de validación y preprocesamiento de imágenes",
      "Reconocimiento automático de campos clave en comprobantes y documentos",
      "API REST de baja latencia lista para integrar con ERP o móvil",
    ],
  },
  web: {
    title: "Plataformas Web & Portales",
    cat: "Apps & Web",
    summary: "Sitios corporativos de alto impacto, catálogos interactivos y portales de autogestión con rendimiento óptimo.",
    deploy: "3–4 semanas",
    cx: "2 / 5 (Ágil)",
    demand: "96% índice",
    tier: "Modular",
    presetType: "Sitio Web / Portafolio",
    stack: "HTML5 • CSS3 • TypeScript • Next.js • Edge CDN",
    deliverables: [
      "Diseño UI/UX a medida adaptable a móvil, tablet y escritorio",
      "Optimización SEO técnico, Core Web Vitals y accesibilidad WCAG 2.1 AA",
      "Integración directa con WhatsApp, formularios y analítica",
    ],
  },
  mobile: {
    title: "Apps Móviles Nativas",
    cat: "Apps & Web",
    summary: "Aplicaciones iOS y Android para fuerza de ventas, reparto, operaciones en campo y atención al cliente.",
    deploy: "8–10 semanas",
    cx: "4 / 5 (Avanzada)",
    demand: "90% índice",
    tier: "Enterprise",
    presetType: "Sistema Web a Medida",
    stack: "Flutter • Kotlin • Swift • Firebase • SQLite",
    deliverables: [
      "App compilada para Android e iOS con sincronización offline-first",
      "Notificaciones push, geolocalización y captura de fotos/firmas",
      "Publicación acompañada en Google Play y App Store",
    ],
  },
  iam: {
    title: "Identidad & Zero Trust (IAM)",
    cat: "Ciberseguridad",
    summary: "Autenticación centralizada, doble factor (MFA), control por turnos/PIN y protección de rutas críticas.",
    deploy: "4–5 semanas",
    cx: "4 / 5 (Avanzada)",
    demand: "78% índice",
    tier: "Enterprise",
    presetType: "Panel Administrativo",
    stack: "Keycloak • OAuth 2.1 • OIDC • HashiCorp Vault",
    deliverables: [
      "Inicio de sesión único (SSO) y políticas de acceso por rol/horario",
      "Bitácora inmutable de accesos y acciones sensibles",
      "Rotación automática de credenciales y cifrado TLS 1.3 / AES-256",
    ],
  },
  devsecops: {
    title: "Auditoría DevSecOps & Pentesting",
    cat: "Ciberseguridad",
    summary: "Evaluación exhaustiva de vulnerabilidades en aplicaciones web, APIs e infraestructura con remediación guiada.",
    deploy: "2–3 semanas",
    cx: "4 / 5 (Avanzada)",
    demand: "81% índice",
    tier: "Modular",
    presetType: "Rediseño o Mejoras",
    stack: "OWASP ASVS • SAST • DAST • SBOM",
    deliverables: [
      "Informe ejecutivo y técnico con clasificación CVSS de hallazgos",
      "Pruebas de intrusión sobre autenticación, lógica de negocio y APIs",
      "Acompañamiento al equipo para cierre y re-verificación de parches",
    ],
  },
};

const PROJECT_CATEGORY = {
  "01_Pelitos_Web": "web",
  "03_Ferreteria_Sullcairi": "ventas",
  "04_Sullcairi": "gestion",
  "05_Leyder": "gestion",
};

const ARCH_LAYERS = {
  clientes: {
    eyebrow: "CAPA 01 · CLIENTES",
    title: "Web Semántica, Apps Móviles Nativas y Canales WhatsApp",
    desc: "Interfaces rápidas optimizadas para Core Web Vitals, accesibilidad WCAG 2.1 AA, modo offline-first y pedidos directos por WhatsApp.",
    meta: "LCP < 1.2 s · WCAG 2.1 AA · Responsive",
  },
  edge: {
    eyebrow: "CAPA 02 · EDGE & WAF",
    title: "CDN Global, TLS 1.3 y Protección Anti-Abuso en el Borde",
    desc: "Terminación cifrada TLS 1.3, cabeceras de seguridad estrictas, rate limiting adaptativo y entrega perimetral de activos estáticos.",
    meta: "TLS 1.3 · HTTP/3 · DDoS Mitigation",
  },
  gateway: {
    eyebrow: "CAPA 03 · API GATEWAY",
    title: "Java 21 con Hilos Virtuales y Contratos REST Versionados",
    desc: "Enrutamiento concurrente sin bloqueo, validación estricta multipart/form-data, control de cuota por IP y trazabilidad OpenTelemetry.",
    meta: "SLA 99.99% · p95 38 ms · Zero Downtime",
  },
  servicios: {
    eyebrow: "CAPA 04 · SERVICIOS & IA",
    title: "Módulos Nativos C++17, Agentes IA y Lógica de Negocio",
    desc: "Validación binaria real de imágenes en C++17 (FNV-1a + firmas mágicas), pipelines RAG con Gemini y microservicios desacoplados.",
    meta: "C++17 Nativo · LangGraph · Contenedores",
  },
  datos: {
    eyebrow: "CAPA 05 · PERSISTENCIA",
    title: "PostgreSQL, SQLite Transaccional y Almacenamiento de Objetos",
    desc: "Esquemas normalizados con claves foráneas, respaldos automáticos cifrados y almacenamiento seguro de adjuntos y comprobantes.",
    meta: "ACID · Cifrado AES-256 · Backups Diarios",
  },
};

/* === 2. ESTADO CENTRAL Y REFERENCIAS AL DOM === */
const state = {
  projects: FALLBACK_PROJECTS,
  activeFilter: "all",
  activeSolFilter: "all",
  activeSolSort: "demand",
  activeScreenProjIndex: 0,
  backendOnline: false,
  images: [],
  activeModalProject: null,
  activeSpecId: null,
  cmdkItems: [],
  cmdkIndex: 0,
  lastFocusedEl: null,
  revealObserver: null,
  bg3dSyncTheme: null,
};

const el = {
  scrollProgress: document.getElementById("scroll-progress"),
  preloader: document.getElementById("preloader"),
  preloaderRail: document.getElementById("preloader-rail"),
  preloaderFill: document.getElementById("preloader-fill"),
  preloaderNode: document.getElementById("preloader-node"),
  preloaderPct: document.getElementById("preloader-pct"),
  nav: document.getElementById("nav"),
  navLinks: document.getElementById("nav-links"),
  navToggle: document.getElementById("nav-toggle"),
  navToggleIcon: document.getElementById("nav-toggle-icon"),
  themeToggle: document.getElementById("theme-toggle"),
  cmdkTrigger: document.getElementById("cmdk-trigger"),
  cmdkDialog: document.getElementById("cmdk"),
  cmdkInput: document.getElementById("cmdk-input"),
  cmdkList: document.getElementById("cmdk-list"),
  heroStage: document.getElementById("hero-stage"),
  dash: document.getElementById("dash"),
  screenShot: document.getElementById("screen-shot"),
  heroShowcaseImg: document.getElementById("hero-showcase-img"),
  heroShowcaseLabel: document.getElementById("hero-showcase-label"),
  heroScreenOpen: document.getElementById("hero-screen-open"),
  heroScreenVisit: document.getElementById("hero-screen-visit"),
  toast: document.getElementById("evm-toast"),
  bg3d: document.getElementById("evm-bg-3d"),
  backToTop: document.getElementById("back-to-top"),
  btnWhitepaper: document.getElementById("btn-whitepaper"),
  solFilters: document.getElementById("sol-filters"),
  solSort: document.getElementById("sol-sort"),
  solGrid: document.getElementById("sol-grid"),
  solCount: document.getElementById("sol-count"),
  portfolioGrid: document.getElementById("portfolio-grid"),
  serverStatusPill: document.getElementById("server-status-pill"),
  form: document.getElementById("brief-form"),
  clientName: document.getElementById("client-name"),
  businessSector: document.getElementById("business-sector"),
  clientContact: document.getElementById("client-contact"),
  timeline: document.getElementById("project-timeline"),
  description: document.getElementById("project-description"),
  dropzone: document.getElementById("dropzone"),
  imageInput: document.getElementById("image-input"),
  btnPickImages: document.getElementById("btn-pick-images"),
  imageListWrap: document.getElementById("image-list-wrap"),
  imageCountLabel: document.getElementById("image-count-label"),
  imageGrid: document.getElementById("image-grid"),
  btnClearImages: document.getElementById("btn-clear-images"),
  preview: document.getElementById("message-preview"),
  feedback: document.getElementById("form-feedback"),
  savedBox: document.getElementById("saved-result-box"),
  savedCode: document.getElementById("saved-code"),
  savedDetailText: document.getElementById("saved-detail-text"),
  savedWaLink: document.getElementById("saved-wa-link"),
  savedViewLink: document.getElementById("saved-view-link"),
  btnSubmit: document.getElementById("btn-submit-request"),
  btnShareNative: document.getElementById("btn-share-native"),
  btnDownloadSheet: document.getElementById("btn-download-sheet"),
  btnCopyText: document.getElementById("btn-copy-text"),
  modal: document.getElementById("project-modal"),
  modalType: document.getElementById("modal-type"),
  modalTitle: document.getElementById("modal-title"),
  modalMainImg: document.getElementById("modal-main-img"),
  modalThumbs: document.getElementById("modal-thumbs"),
  modalDesc: document.getElementById("modal-desc"),
  modalBtnSimilar: document.getElementById("modal-btn-similar"),
  modalBtnVisit: document.getElementById("modal-btn-visit"),
  specModal: document.getElementById("spec-modal"),
  specCat: document.getElementById("spec-cat"),
  specTitle: document.getElementById("spec-title"),
  specSummary: document.getElementById("spec-summary"),
  specDeploy: document.getElementById("spec-deploy"),
  specCx: document.getElementById("spec-cx"),
  specDemand: document.getElementById("spec-demand"),
  specTier: document.getElementById("spec-tier"),
  specDeliverables: document.getElementById("spec-deliverables"),
  specStack: document.getElementById("spec-stack"),
  specRequest: document.getElementById("spec-request"),
};

/* === 3. PRELOADER, CONTADORES Y TOASTS === */
function animateCounters() {
  document.querySelectorAll("[data-count-to]").forEach((node) => {
    const target = Number(node.getAttribute("data-count-to") || "0");
    if (!target || REDUCED_MOTION) {
      node.textContent = String(target);
      return;
    }
    const start = performance.now();
    const duration = 900;
    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function initPreloader() {
  const root = document.documentElement;
  if (!el.preloader || REDUCED_MOTION) {
    root.classList.remove("is-loading");
    root.classList.add("is-ready");
    if (el.preloader) el.preloader.classList.add("is-complete");
    animateCounters();
    return;
  }

  const duration = 850;
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const pct = Math.round(eased * 100);
    const railWidth = el.preloaderRail ? el.preloaderRail.clientWidth : 280;

    if (el.preloaderPct) el.preloaderPct.textContent = `${String(pct).padStart(3, "0")}%`;
    if (el.preloaderFill) el.preloaderFill.style.transform = `scaleX(${eased})`;
    if (el.preloaderNode) {
      el.preloaderNode.style.transform = `translate3d(${eased * railWidth}px, -50%, 0) translateX(-50%)`;
    }

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      el.preloader.classList.add("is-bursting");
      setTimeout(() => {
        el.preloader.classList.add("is-complete");
        root.classList.remove("is-loading");
        root.classList.add("is-ready");
        animateCounters();
      }, 180);
    }
  }

  requestAnimationFrame(tick);
}

let toastTimer = 0;
function showToast(message) {
  if (!el.toast) return;
  el.toast.textContent = message;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.toast.hidden = true;
  }, 2600);
}

/* === 4. NAVEGACIÓN SUAVE, MENÚ MÓVIL ANIMADO, SCROLLSPY Y REVEAL === */
function setMobileMenuState(open, restoreFocus = false) {
  if (!el.navLinks || !el.navToggle) return;
  el.navLinks.classList.toggle("is-open", open);
  el.navToggle.setAttribute("aria-expanded", String(open));
  el.navToggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
  if (el.navToggleIcon) {
    el.navToggleIcon.setAttribute("href", open ? "#i-close" : "#i-menu");
  }
  if (!open && restoreFocus) {
    el.navToggle.focus();
  }
}

function setActiveNavLink(sectionId) {
  document.querySelectorAll(".site-nav__link[data-nav-section]").forEach((link) => {
    const active = link.getAttribute("data-nav-section") === sectionId;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function scrollToSection(sectionId, updateUrl = true) {
  const cleanId = String(sectionId || "inicio").replace(/^#/, "");
  const target = document.getElementById(cleanId);
  if (!target) return;

  setMobileMenuState(false, false);
  setActiveNavLink(cleanId);

  target.scrollIntoView({
    behavior: REDUCED_MOTION ? "auto" : "smooth",
    block: "start",
  });

  if (updateUrl && window.location.hash !== `#${cleanId}`) {
    try {
      history.replaceState(null, "", `#${cleanId}`);
    } catch {
      window.location.hash = cleanId;
    }
  }
}

function observeRevealNodes(root = document) {
  const nodes = root.querySelectorAll("[data-reveal]:not(.is-visible)");
  if (!nodes.length) return;
  if (state.revealObserver) {
    nodes.forEach((node) => state.revealObserver.observe(node));
  } else {
    nodes.forEach((node) => node.classList.add("is-visible"));
  }
}

function initNavigationAndScroll() {
  const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || "");
  document.querySelectorAll("[data-kbd-mod]").forEach((kbd) => {
    kbd.textContent = isMac ? "⌘" : "Ctrl";
  });

  // Tema Studio / Consola
  const syncThemeBtn = () => {
    const isConsole = document.documentElement.getAttribute("data-theme") === "console";
    if (el.themeToggle) el.themeToggle.setAttribute("aria-pressed", String(isConsole));
    if (typeof state.bg3dSyncTheme === "function") state.bg3dSyncTheme(isConsole);
  };
  syncThemeBtn();

  if (el.themeToggle) {
    el.themeToggle.addEventListener("click", () => {
      const root = document.documentElement;
      const next = root.getAttribute("data-theme") === "console" ? "studio" : "console";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("evm-theme", next);
      } catch {}
      syncThemeBtn();
      showToast(next === "console" ? "Modo Consola activado" : "Modo Studio activado");
    });
  }

  // Menú móvil accesible y animado
  if (el.navToggle && el.navLinks) {
    el.navToggle.addEventListener("click", () => {
      const nextOpen = !el.navLinks.classList.contains("is-open");
      setMobileMenuState(nextOpen, false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && el.navLinks.classList.contains("is-open")) {
        setMobileMenuState(false, true);
      }
    });

    document.addEventListener("click", (e) => {
      if (el.nav && !el.nav.contains(e.target) && el.navLinks.classList.contains("is-open")) {
        setMobileMenuState(false, false);
      }
    });
  }

  // Navegación suave por secciones
  document.addEventListener("click", (e) => {
    const navTrigger = e.target instanceof Element ? e.target.closest("[data-nav-section]") : null;
    if (!navTrigger) return;
    e.preventDefault();
    scrollToSection(navTrigger.getAttribute("data-nav-section"), true);
  });

  // Botón volver arriba
  if (el.backToTop) {
    el.backToTop.addEventListener("click", () => scrollToSection("inicio", true));
  }

  // Progreso de scroll + estado sticky del header
  const updateScrollChrome = () => {
    const y = window.scrollY || window.pageYOffset;
    if (el.nav) el.nav.classList.toggle("is-scrolled", y > 18);
    if (el.backToTop) el.backToTop.hidden = y < 520;
    if (el.scrollProgress) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(1, Math.max(0, y / maxScroll));
      el.scrollProgress.style.setProperty("--scroll-pct", pct.toFixed(4));
    }
  };
  window.addEventListener("scroll", updateScrollChrome, { passive: true });
  window.addEventListener("resize", updateScrollChrome, { passive: true });
  updateScrollChrome();

  // ScrollSpy automático para resaltar la sección visible en el menú
  if ("IntersectionObserver" in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section");
            if (id) setActiveNavLink(id);
          }
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 }
    );
    document.querySelectorAll("[data-section]").forEach((sec) => spyObserver.observe(sec));

    // Animaciones de entrada al hacer scroll
    state.revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
  }
  observeRevealNodes(document);

  const yearNode = document.getElementById("year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  // Si la URL inicial trae un hash válido (#casos, #contacto, etc.), desplazar suavemente
  if (window.location.hash && window.location.hash.length > 1) {
    setTimeout(() => scrollToSection(window.location.hash, false), 120);
  }
}

/* === 5. ESTACIÓN 3D HERO, BOTONES MAGNÉTICOS, ARQUITECTURA Y TELEMETRÍA === */
function initHeroAndArchitecture() {
  if (el.heroStage && !REDUCED_MOTION) {
    const tiltNode = el.heroStage.querySelector("[data-tilt]");
    const satellites = Array.from(el.heroStage.querySelectorAll(".sat"));
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;

    const stepParallax = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      if (tiltNode) {
        tiltNode.style.setProperty("--rx", `${(5 - curY * 7).toFixed(2)}deg`);
        tiltNode.style.setProperty("--ry", `${(-7 + curX * 9).toFixed(2)}deg`);
      }
      satellites.forEach((sat) => {
        const depth = parseFloat(sat.getAttribute("data-depth") || "1");
        sat.style.setProperty("--px", `${(curX * 18).toFixed(1)}px`);
        sat.style.setProperty("--py", `${(curY * 14).toFixed(1)}px`);
        sat.style.setProperty("--depth", String(depth));
      });
      if (Math.abs(targetX - curX) > 0.002 || Math.abs(targetY - curY) > 0.002) {
        rafId = requestAnimationFrame(stepParallax);
      } else {
        rafId = 0;
      }
    };

    el.heroStage.addEventListener("pointermove", (e) => {
      const r = el.heroStage.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!rafId) rafId = requestAnimationFrame(stepParallax);
    });

    el.heroStage.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(stepParallax);
    });
  }

  // Botones magnéticos sutiles
  if (!REDUCED_MOTION && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.16;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.2;
        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // Pestañas de la estación de trabajo en el Hero
  const screenTabs = Array.from(document.querySelectorAll("[data-screen]"));
  const activateScreenTab = (tab) => {
    const target = tab.getAttribute("data-screen");
    screenTabs.forEach((b) => {
      const active = b === tab;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", String(active));
      b.tabIndex = active ? 0 : -1;
    });

    if (target === "dashboard") {
      if (el.dash) el.dash.hidden = false;
      if (el.screenShot) el.screenShot.hidden = true;
    } else {
      const idx = state.projects.findIndex((p) => p.slug === target);
      const safeIdx = idx >= 0 ? idx : 0;
      const proj = state.projects[safeIdx];
      state.activeScreenProjIndex = safeIdx;
      if (proj && el.heroShowcaseImg && el.heroShowcaseLabel) {
        el.heroShowcaseImg.src = resolveAssetUrl(proj.imagenPrincipal);
        el.heroShowcaseImg.alt = `Vista previa real de ${proj.nombre}`;
        el.heroShowcaseLabel.textContent = `${proj.nombre} · ${proj.tipo}`;
        if (el.heroScreenVisit) el.heroScreenVisit.href = proj.urlPublica;
        if (el.dash) el.dash.hidden = true;
        if (el.screenShot) el.screenShot.hidden = false;
      }
    }
  };

  screenTabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => activateScreenTab(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const nextIdx = (idx + (e.key === "ArrowRight" ? 1 : -1) + screenTabs.length) % screenTabs.length;
      screenTabs[nextIdx].focus();
      activateScreenTab(screenTabs[nextIdx]);
    });
  });

  if (el.heroScreenOpen) {
    el.heroScreenOpen.addEventListener("click", () => openProjectModal(state.activeScreenProjIndex));
  }

  // Inspector interactivo de capas en Arquitectura (clic + teclado ← / →)
  const archButtons = Array.from(document.querySelectorAll("[data-arch-layer]"));
  const archEyebrow = document.getElementById("arch-layer-eyebrow");
  const archTitle = document.getElementById("arch-layer-title");
  const archDesc = document.getElementById("arch-layer-desc");
  const archMeta = document.getElementById("arch-layer-meta");

  const selectArchButton = (btn) => {
    const key = btn.getAttribute("data-arch-layer");
    const info = ARCH_LAYERS[key];
    if (!info) return;
    archButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    if (archEyebrow) archEyebrow.textContent = info.eyebrow;
    if (archTitle) archTitle.textContent = info.title;
    if (archDesc) archDesc.textContent = info.desc;
    if (archMeta) archMeta.textContent = info.meta;
  };

  archButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => selectArchButton(btn));
    btn.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const nextIdx = (idx + (e.key === "ArrowRight" ? 1 : -1) + archButtons.length) % archButtons.length;
      archButtons[nextIdx].focus();
      selectArchButton(archButtons[nextIdx]);
    });
  });

  // Telemetría viva del dashboard
  if (!REDUCED_MOTION) {
    const rpsEl = document.getElementById("kpi-rps");
    const latEl = document.getElementById("kpi-lat");
    const bars = Array.from(document.querySelectorAll("#dash-bars span"));
    setInterval(() => {
      if (document.hidden || (el.dash && el.dash.hidden)) return;
      if (rpsEl) rpsEl.textContent = `${(11.8 + Math.random() * 1.4).toFixed(1)}k`;
      if (latEl) latEl.textContent = `${Math.round(34 + Math.random() * 7)} ms`;
      bars.forEach((b) => b.style.setProperty("--v", (0.3 + Math.random() * 0.65).toFixed(2)));
    }, 2200);
  }

  // Descarga de Whitepaper técnico
  if (el.btnWhitepaper) {
    el.btnWhitepaper.addEventListener("click", () => {
      const docContent = [
        "====================================================================",
        "EVM SOFTWARE STUDIO — WHITEPAPER DE ARQUITECTURA & ESTÁNDARES (2026)",
        "====================================================================",
        "",
        "1. RESUMEN EJECUTIVO",
        "EVM Software Studio diseña, construye y opera plataformas de software",
        "empresarial bajo cuatro pilares: Soporte Crítico 24/7 (SLA 99.99%),",
        "Seguridad Grado Bancario, Código Limpio con transferencia total de IP",
        "e Infraestructura CI/CD automatizada.",
        "",
        "2. ARQUITECTURA DE REFERENCIA",
        "- Clientes: Web semántica (WCAG 2.1 AA), Apps móviles y WhatsApp.",
        "- Edge & Seguridad: TLS 1.3, validación de entradas y firmas binarias.",
        "- Servicios Backend: Java 21 (Hilos Virtuales), Go, Node.js y C++17.",
        "- Persistencia: PostgreSQL, SQLite embebido y almacenamiento de objetos.",
        "",
        "3. CONTACTO DIRECTO",
        "WhatsApp Ingeniería: https://wa.me/51914662798",
        "GitHub: https://github.com/ediczon2006",
      ].join("\n");
      const blob = new Blob([docContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "EVM_Software_Studio_Whitepaper_2026.txt";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast("Whitepaper técnico descargado");
    });
  }
}

/* === 6. CATÁLOGO DE SOLUCIONES Y MODAL DE ESPECIFICACIONES === */
function applySolutionsCatalog() {
  if (!el.solGrid) return;
  const items = Array.from(el.solGrid.querySelectorAll(".sol-grid__item"));
  const filter = state.activeSolFilter;
  const sortBy = state.activeSolSort;

  items.sort((a, b) => {
    if (sortBy === "deploy") return Number(a.dataset.deploy) - Number(b.dataset.deploy);
    if (sortBy === "complexity") return Number(b.dataset.complexity) - Number(a.dataset.complexity);
    return Number(b.dataset.demand) - Number(a.dataset.demand);
  });

  items.forEach((item) => item.classList.add("is-filtering-out"));

  setTimeout(() => {
    let visibleCount = 0;
    items.forEach((item) => {
      el.solGrid.appendChild(item);
      const match = filter === "all" || item.dataset.cat === filter;
      item.hidden = !match;
      if (match) visibleCount++;
      requestAnimationFrame(() => item.classList.remove("is-filtering-out"));
    });
    if (el.solCount) {
      el.solCount.textContent =
        visibleCount === 1 ? "1 módulo disponible" : `${visibleCount} módulos disponibles`;
    }
  }, REDUCED_MOTION ? 0 : 130);
}

function openSpecModal(id) {
  const spec = MODULE_SPECS[id];
  if (!spec || !el.specModal) return;
  state.activeSpecId = id;
  el.specCat.textContent = spec.cat;
  el.specTitle.textContent = spec.title;
  el.specSummary.textContent = spec.summary;
  el.specDeploy.textContent = spec.deploy;
  el.specCx.textContent = spec.cx;
  el.specDemand.textContent = spec.demand;
  el.specTier.textContent = spec.tier;
  el.specStack.textContent = spec.stack;
  el.specDeliverables.innerHTML = spec.deliverables
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  openDialog(el.specModal);
}

function initSolutionsCatalog() {
  if (el.solFilters) {
    el.solFilters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-sol-filter]");
      if (!btn) return;
      state.activeSolFilter = btn.getAttribute("data-sol-filter") || "all";
      el.solFilters.querySelectorAll("[data-sol-filter]").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      applySolutionsCatalog();
    });
  }

  if (el.solSort) {
    el.solSort.addEventListener("change", () => {
      state.activeSolSort = el.solSort.value;
      applySolutionsCatalog();
    });
  }

  if (el.solGrid) {
    el.solGrid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-spec]");
      if (btn) openSpecModal(btn.getAttribute("data-spec"));
    });
  }

  if (el.specRequest) {
    el.specRequest.addEventListener("click", () => {
      const spec = MODULE_SPECS[state.activeSpecId];
      if (spec && el.form) {
        const box = el.form.querySelector(`input[name="projectType"][value="${spec.presetType}"]`);
        if (box) box.checked = true;
        if (el.description && !el.description.value.trim()) {
          el.description.value = `Solicito el módulo "${spec.title}" (${spec.cat}) adaptado a mi empresa con...`;
        }
        updatePreview();
      }
      closeDialog(el.specModal);
      scrollToSection("contacto", true);
      showToast(`Módulo "${spec ? spec.title : ""}" cargado en el brief`);
    });
  }
}

/* === 7. BUSCADOR DE COMANDOS (Ctrl + K / Cmd + K) === */
function initCommandPalette() {
  if (!el.cmdkDialog || !el.cmdkInput || !el.cmdkList) return;

  const baseCommands = [
    { label: "Ir a sección: Inicio", meta: "Sección", action: () => scrollToSection("inicio") },
    { label: "Ir a sección: Catálogo de Soluciones", meta: "Sección", action: () => scrollToSection("soluciones") },
    { label: "Ir a sección: Stack Técnico", meta: "Sección", action: () => scrollToSection("stack") },
    { label: "Ir a sección: Arquitectura de Referencia", meta: "Sección", action: () => scrollToSection("arquitectura") },
    { label: "Ir a sección: Casos en Producción", meta: "Sección", action: () => scrollToSection("casos") },
    { label: "Ir a sección: Contacto / Iniciar Proyecto", meta: "Sección", action: () => scrollToSection("contacto") },
    {
      label: "Alternar Tema (Studio / Modo Consola)",
      meta: "Tema",
      action: () => el.themeToggle && el.themeToggle.click(),
    },
    {
      label: "Descargar Whitepaper Técnico EVM",
      meta: "Descarga",
      action: () => el.btnWhitepaper && el.btnWhitepaper.click(),
    },
  ];

  Object.entries(MODULE_SPECS).forEach(([id, spec]) => {
    baseCommands.push({
      label: `Módulo: ${spec.title}`,
      meta: spec.cat,
      action: () => openSpecModal(id),
    });
  });

  function renderCmdk(query = "") {
    const q = query.trim().toLowerCase();
    state.cmdkItems = baseCommands.filter(
      (item) => !q || item.label.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q)
    );
    state.cmdkIndex = 0;

    el.cmdkList.innerHTML = state.cmdkItems
      .map(
        (item, idx) => `
        <li id="cmdk-opt-${idx}" class="cmdk__item" role="option" aria-selected="${idx === 0}" data-cmdk-idx="${idx}">
          <span>${escapeHtml(item.label)}</span>
          <small>${escapeHtml(item.meta)}</small>
        </li>`
      )
      .join("");
    el.cmdkInput.setAttribute("aria-activedescendant", state.cmdkItems.length ? "cmdk-opt-0" : "");
  }

  function openCmdk() {
    renderCmdk("");
    el.cmdkInput.value = "";
    openDialog(el.cmdkDialog);
    el.cmdkInput.focus();
  }

  if (el.cmdkTrigger) el.cmdkTrigger.addEventListener("click", openCmdk);

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (el.cmdkDialog.open) closeDialog(el.cmdkDialog);
      else openCmdk();
    }
  });

  el.cmdkInput.addEventListener("input", () => renderCmdk(el.cmdkInput.value));

  el.cmdkInput.addEventListener("keydown", (e) => {
    if (!state.cmdkItems.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      state.cmdkIndex = (state.cmdkIndex + dir + state.cmdkItems.length) % state.cmdkItems.length;
      el.cmdkList.querySelectorAll(".cmdk__item").forEach((li, i) => {
        li.setAttribute("aria-selected", String(i === state.cmdkIndex));
      });
      el.cmdkInput.setAttribute("aria-activedescendant", `cmdk-opt-${state.cmdkIndex}`);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = state.cmdkItems[state.cmdkIndex];
      closeDialog(el.cmdkDialog);
      if (chosen) chosen.action();
    }
  });

  el.cmdkList.addEventListener("click", (e) => {
    const li = e.target.closest("[data-cmdk-idx]");
    if (!li) return;
    const chosen = state.cmdkItems[Number(li.getAttribute("data-cmdk-idx"))];
    closeDialog(el.cmdkDialog);
    if (chosen) chosen.action();
  });
}

function openDialog(dlg) {
  if (!dlg) return;
  state.lastFocusedEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (typeof dlg.showModal === "function") {
    if (!dlg.open) dlg.showModal();
  } else {
    dlg.setAttribute("open", "");
  }
}

function closeDialog(dlg) {
  if (!dlg) return;
  if (typeof dlg.close === "function") {
    if (dlg.open) dlg.close();
  } else {
    dlg.removeAttribute("open");
  }
  if (state.lastFocusedEl && typeof state.lastFocusedEl.focus === "function") {
    state.lastFocusedEl.focus({ preventScroll: true });
    state.lastFocusedEl = null;
  }
}

/* === 8. PORTAFOLIO DE CASOS REALES Y VISOR MODAL === */
function renderPortfolio(projects) {
  if (!el.portfolioGrid) return;
  const filtered =
    state.activeFilter === "all"
      ? projects
      : projects.filter((p) => (PROJECT_CATEGORY[p.slug] || "web") === state.activeFilter);

  if (!filtered.length) {
    el.portfolioGrid.innerHTML = "<p>No hay proyectos disponibles en esta categoría.</p>";
    return;
  }

  el.portfolioGrid.innerHTML = filtered
    .map((p, idx) => {
      const realIndex = state.projects.indexOf(p);
      const bullets = (p.aspectos || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      const count = (p.galeria || []).length;
      return `
        <article class="project-card tilt-3d" data-reveal="up" style="--d:${idx % 2}">
          <div class="project-card__chrome" aria-hidden="true">
            <div class="project-card__dots"><span></span><span></span><span></span></div>
            <span>${escapeHtml(p.nombre)}</span>
          </div>
          <div class="project-card__thumb" data-open-project="${realIndex}" role="button" tabindex="0" aria-label="Ampliar capturas de ${escapeHtml(p.nombre)}">
            <img src="${escapeHtml(resolveAssetUrl(p.imagenPrincipal))}" alt="Captura real del proyecto ${escapeHtml(p.nombre)}" width="1600" height="1000" loading="lazy" decoding="async" />
            <span class="project-card__badge">${count} capturas reales</span>
          </div>
          <div class="project-card__body">
            <span class="project-card__type">${escapeHtml(p.tipo)}</span>
            <h3 class="project-card__title">${escapeHtml(p.nombre)}</h3>
            <p class="project-card__desc">${escapeHtml(p.descripcion)}</p>
            <ul class="project-card__list">${bullets}</ul>
            <div class="project-card__actions">
              <button type="button" class="btn btn--primary btn--sm" data-open-project="${realIndex}">Ver capturas</button>
              <a class="btn btn--secondary btn--sm" href="${escapeHtml(p.urlPublica)}" target="_blank" rel="noopener noreferrer">Visitar sitio ↗</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  observeRevealNodes(el.portfolioGrid);
}

function openProjectModal(index) {
  const proj = state.projects[index];
  if (!proj || !el.modal) return;
  state.activeModalProject = proj;

  el.modalType.textContent = proj.tipo;
  el.modalTitle.textContent = proj.nombre;
  el.modalDesc.textContent = proj.descripcion;
  el.modalBtnVisit.href = proj.urlPublica;

  const imgs = (proj.galeria && proj.galeria.length ? proj.galeria : [proj.imagenPrincipal]).map(resolveAssetUrl);
  setModalImage(imgs[0], `Captura principal de ${proj.nombre}`);

  el.modalThumbs.innerHTML = imgs
    .map(
      (src, i) => `
      <button type="button" class="modal__thumb-btn ${i === 0 ? "is-active" : ""}" data-thumb-src="${escapeHtml(src)}" data-thumb-num="${i + 1}">
        <img src="${escapeHtml(src)}" alt="Miniatura ${i + 1} de ${escapeHtml(proj.nombre)}" width="160" height="100" loading="lazy" decoding="async" />
      </button>
    `
    )
    .join("");

  openDialog(el.modal);
}

function setModalImage(src, altText) {
  el.modalMainImg.src = src;
  el.modalMainImg.alt = altText || "Captura ampliada del proyecto";
}

/* === 9. FORMULARIO BRIEF, IMÁGENES, FICHA PNG Y WHATSAPP === */
function getCheckedValues(name) {
  if (!el.form) return [];
  return Array.from(el.form.querySelectorAll(`input[name="${name}"]:checked`)).map((i) => i.value);
}

function buildPreviewMessage() {
  const name = el.clientName.value.trim() || "[Tu nombre o empresa]";
  const sector = el.businessSector.value.trim();
  const contact = el.clientContact.value.trim();
  const timeline = el.timeline.value;
  const types = getCheckedValues("projectType");
  const features = getCheckedValues("features");
  const desc = el.description.value.trim() || "[Describe aquí qué necesitas que haga tu software]";

  const lines = [
    "Hola equipo de EVM Software Studio, quiero iniciar un proyecto de software.",
    "",
    `*Cliente / Empresa:* ${name}`,
  ];
  if (sector) lines.push(`*Rubro:* ${sector}`);
  if (contact) lines.push(`*Contacto:* ${contact}`);
  lines.push(`*Tipo de solución:* ${types.length ? types.join(", ") : "Por definir"}`);
  if (features.length) lines.push(`*Funciones:* ${features.join(", ")}`);
  lines.push(`*Plazo:* ${timeline}`);
  lines.push("", "*Qué necesito que haga:*", desc);

  if (state.images.length) {
    lines.push("", `*Imágenes de referencia adjuntas (${state.images.length}):*`);
    state.images.forEach((img, idx) => {
      const notePart = img.note.trim() ? ` - ${img.note.trim()}` : "";
      lines.push(`${idx + 1}) ${img.file.name}${notePart}`);
    });
  }
  return lines.join("\n");
}

function updatePreview() {
  if (!el.preview) return;
  el.preview.textContent = buildPreviewMessage();
  updateNativeShareVisibility();
}

function updateNativeShareVisibility() {
  if (!el.btnShareNative) return;
  if (!navigator.share || !navigator.canShare || state.images.length === 0) {
    el.btnShareNative.hidden = true;
    return;
  }
  try {
    const files = state.images.map((item) => item.file);
    el.btnShareNative.hidden = !navigator.canShare({ files });
  } catch {
    el.btnShareNative.hidden = true;
  }
}

function showFeedback(text, kind) {
  if (!el.feedback) return;
  el.feedback.textContent = text;
  el.feedback.className = `feedback feedback--${kind}`;
  el.feedback.hidden = false;
}

function clearFeedback() {
  if (el.feedback) el.feedback.hidden = true;
}

function renderImages() {
  if (!state.images.length) {
    el.imageListWrap.hidden = true;
    el.imageGrid.innerHTML = "";
    updatePreview();
    return;
  }

  el.imageListWrap.hidden = false;
  el.imageCountLabel.textContent =
    state.images.length === 1 ? "1 imagen adjunta" : `${state.images.length} imágenes adjuntas`;

  el.imageGrid.innerHTML = state.images
    .map(
      (item, idx) => `
      <li class="img-item" data-img-id="${item.id}">
        <div class="img-item__media">
          <img src="${item.previewUrl}" alt="Imagen de referencia: ${escapeHtml(item.file.name)}" decoding="async" />
          <button type="button" class="img-item__remove" data-remove-img="${item.id}" aria-label="Quitar ${escapeHtml(item.file.name)}">✕</button>
        </div>
        <div class="img-item__body">
          <span class="img-item__name" title="${escapeHtml(item.file.name)}">${escapeHtml(item.file.name)}</span>
          <span class="img-item__size">${Math.max(1, Math.round(item.file.size / 1024))} KB</span>
          <input
            type="text"
            class="img-item__note"
            data-note-idx="${idx}"
            value="${escapeHtml(item.note)}"
            aria-label="Nota para ${escapeHtml(item.file.name)}"
            placeholder="Nota (ej. Mi logo, vista)"
          />
        </div>
      </li>
    `
    )
    .join("");

  updatePreview();
}

function addFiles(fileList) {
  clearFeedback();
  const incoming = Array.from(fileList || []);
  for (const file of incoming) {
    if (state.images.length >= CONFIG.maxImages) {
      showFeedback(`Puedes adjuntar hasta ${CONFIG.maxImages} imágenes por pedido.`, "error");
      break;
    }
    if (!file.type.startsWith("image/")) {
      showFeedback(`El archivo "${file.name}" no es una imagen válida.`, "error");
      continue;
    }
    if (file.size > CONFIG.maxFileSizeBytes) {
      showFeedback(`La imagen "${file.name}" supera el máximo de 12 MB.`, "error");
      continue;
    }
    state.images.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      note: "",
    });
  }
  renderImages();
}

function removeImage(id) {
  const idx = state.images.findIndex((i) => i.id === id);
  if (idx >= 0) {
    URL.revokeObjectURL(state.images[idx].previewUrl);
    state.images.splice(idx, 1);
    renderImages();
  }
}

function clearAllImages() {
  state.images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
  state.images = [];
  renderImages();
}

function validateForm() {
  if (!el.clientName.value.trim()) {
    el.clientName.setAttribute("aria-invalid", "true");
    showFeedback("Por favor ingresa tu nombre o el nombre de tu empresa.", "error");
    el.clientName.focus();
    return false;
  }
  el.clientName.removeAttribute("aria-invalid");

  if (!el.description.value.trim()) {
    el.description.setAttribute("aria-invalid", "true");
    showFeedback("Cuéntanos brevemente qué quieres que haga tu página o sistema.", "error");
    el.description.focus();
    return false;
  }
  el.description.removeAttribute("aria-invalid");
  return true;
}

function buildStaticWhatsappUrl(message) {
  const digits = `${CONFIG.whatsappCountryCode}${CONFIG.whatsappNumber}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

async function submitRequest() {
  clearFeedback();
  if (!validateForm()) return;

  el.btnSubmit.disabled = true;
  const labelNode = el.btnSubmit.querySelector(".btn__label") || el.btnSubmit;
  const originalLabel = labelNode.textContent;
  labelNode.textContent = "Preparando solicitud...";

  try {
    if (state.backendOnline) {
      const fd = new FormData();
      fd.append("clientName", el.clientName.value.trim());
      fd.append("businessSector", el.businessSector.value.trim());
      fd.append("clientContact", el.clientContact.value.trim());
      fd.append("timeline", el.timeline.value);
      fd.append("description", el.description.value.trim());

      getCheckedValues("projectType").forEach((v) => fd.append("projectType", v));
      getCheckedValues("features").forEach((v) => fd.append("features", v));
      state.images.forEach((item) => {
        fd.append("images", item.file, item.file.name);
        fd.append("imageNotes", item.note.trim());
      });

      const res = await fetch(apiUrl("api/solicitudes"), { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo guardar la solicitud.");
      }

      el.savedCode.textContent = data.codigo;
      el.savedDetailText.textContent =
        data.imagenes && data.imagenes.length
          ? `Se registraron ${data.imagenes.length} imagen(es) en base de datos. Ya puedes abrir WhatsApp con el enlace directo.`
          : "Tu solicitud fue guardada correctamente en base de datos.";
      el.savedWaLink.href = data.whatsappUrl;
      el.savedViewLink.href = data.viewUrl;
      el.savedViewLink.hidden = false;
      el.savedBox.hidden = false;

      showFeedback("Solicitud guardada correctamente. Abriendo WhatsApp...", "ok");
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    } else {
      const msg = buildPreviewMessage();
      const waUrl = buildStaticWhatsappUrl(msg);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(msg).catch(() => {});
      }
      el.savedCode.textContent = "ENVÍO-DIRECTO";
      el.savedDetailText.textContent = state.images.length
        ? "Se abrió WhatsApp con tu mensaje listo. Adjunta tus imágenes en el chat o descarga la Ficha PNG abajo."
        : "Se abrió WhatsApp con tu mensaje estructurado listo.";
      el.savedWaLink.href = waUrl;
      el.savedViewLink.hidden = true;
      el.savedBox.hidden = false;

      showFeedback("Redirigiendo a WhatsApp...", "ok");
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  } catch (err) {
    showFeedback(err.message || "Ocurrió un error al enviar la solicitud.", "error");
  } finally {
    el.btnSubmit.disabled = false;
    labelNode.textContent = originalLabel;
  }
}

async function shareNative() {
  clearFeedback();
  if (!validateForm()) return;
  const text = buildPreviewMessage();
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text).catch(() => {});
    }
    const files = state.images.map((i) => i.file);
    await navigator.share({
      title: "Solicitud de proyecto · EVM Software Studio",
      text,
      files,
    });
    showFeedback("Imágenes y mensaje compartidos correctamente.", "ok");
  } catch (err) {
    if (err && err.name !== "AbortError") {
      showFeedback("No se pudo abrir el menú de compartir nativo en este navegador.", "error");
    }
  }
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapTextLines(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars) {
      cur = next;
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 10);
}

async function downloadVisualSheet() {
  clearFeedback();
  if (!validateForm()) return;

  try {
    const width = 1080;
    const pad = 56;
    const loadedImgs = await Promise.all(state.images.map((item) => loadImageElement(item.previewUrl)));

    const cols = 2;
    const thumbW = (width - pad * 2 - 20) / cols;
    const thumbH = 220;
    const imgRows = loadedImgs.length ? Math.ceil(loadedImgs.length / cols) : 0;
    const descLines = wrapTextLines(el.description.value.trim(), 78);
    const height = Math.max(760, 420 + descLines.length * 28 + imgRows * (thumbH + 56));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#06080e";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#00d2ff";
    ctx.font = "bold 20px Segoe UI, sans-serif";
    ctx.fillText("EVM SOFTWARE STUDIO · BRIEF DE PROYECTO", pad, 64);

    ctx.fillStyle = "#f2f6fb";
    ctx.font = "bold 36px Segoe UI, sans-serif";
    ctx.fillText(el.clientName.value.trim().slice(0, 40), pad, 114);

    const types = getCheckedValues("projectType");
    ctx.fillStyle = "#b3bfd4";
    ctx.font = "22px Segoe UI, sans-serif";
    ctx.fillText(`Solución: ${(types.length ? types.join(", ") : "Por definir").slice(0, 68)}`, pad, 156);

    const features = getCheckedValues("features");
    let y = 194;
    if (features.length) {
      ctx.fillStyle = "#8f9cb3";
      ctx.font = "19px Segoe UI, sans-serif";
      ctx.fillText(`Funciones: ${features.join(" · ").slice(0, 80)}`, pad, y);
      y += 38;
    }

    ctx.fillStyle = "#0e1522";
    ctx.fillRect(pad, y, width - pad * 2, descLines.length * 28 + 44);
    ctx.fillStyle = "#f2f6fb";
    ctx.font = "20px Segoe UI, sans-serif";
    descLines.forEach((line, idx) => {
      ctx.fillText(line, pad + 20, y + 36 + idx * 28);
    });
    y += descLines.length * 28 + 72;

    loadedImgs.forEach((im, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = pad + col * (thumbW + 20);
      const ty = y + row * (thumbH + 50);

      ctx.fillStyle = "#0e1522";
      ctx.fillRect(x, ty, thumbW, thumbH);
      const scale = Math.min(thumbW / im.width, thumbH / im.height);
      const dw = im.width * scale;
      const dh = im.height * scale;
      ctx.drawImage(im, x + (thumbW - dw) / 2, ty + (thumbH - dh) / 2, dw, dh);

      ctx.fillStyle = "#b3bfd4";
      ctx.font = "16px Segoe UI, sans-serif";
      const label = state.images[idx].note.trim() || state.images[idx].file.name;
      ctx.fillText(`${idx + 1}. ${label.slice(0, 38)}`, x, ty + thumbH + 24);
    });

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "ficha_solicitud_evm.png";
    a.click();
    showFeedback("Ficha PNG descargada. Puedes adjuntarla directo en WhatsApp.", "ok");
  } catch {
    showFeedback("No se pudo generar la ficha PNG con una de las imágenes adjuntas.", "error");
  }
}

/* === 10. CONEXIÓN INTELIGENTE SIN ERRORES 404 EN GITHUB PAGES === */
async function initBackendConnection() {
  const pillText = el.serverStatusPill && el.serverStatusPill.querySelector(".status-pill__text");

  // En GitHub Pages o protocolo file: operamos directamente en modo estático sin generar 404 en consola
  if (isPureStaticEnvironment()) {
    state.backendOnline = false;
    if (pillText) pillText.textContent = "Listo para enviar a WhatsApp";
    renderPortfolio(state.projects);
    return;
  }

  try {
    const [healthRes, projRes] = await Promise.all([
      fetch(apiUrl("api/health")),
      fetch(apiUrl("api/proyectos")),
    ]);
    if (healthRes.ok) {
      const h = await healthRes.json();
      state.backendOnline = Boolean(h.ok);
      if (pillText) {
        pillText.textContent = h.cppAnalyzerReady
          ? "Sistema activo · Java + C++ + SQLite"
          : "Servidor activo · Java + SQLite";
      }
    } else {
      state.backendOnline = false;
    }

    if (projRes.ok) {
      const pData = await projRes.json();
      if (Array.isArray(pData.proyectos) && pData.proyectos.length) {
        state.projects = pData.proyectos;
      }
    }
  } catch {
    state.backendOnline = false;
    if (pillText) pillText.textContent = "Listo para enviar a WhatsApp";
  }

  renderPortfolio(state.projects);
}

/* === 11. EVENTOS DE INTERFAZ Y FORMULARIO === */
function bindEvents() {
  if (el.form) {
    el.form.addEventListener("input", (e) => {
      if (e.target && e.target.hasAttribute("aria-invalid") && e.target.value.trim()) {
        e.target.removeAttribute("aria-invalid");
      }
      updatePreview();
    });
    el.form.addEventListener("change", updatePreview);
  }

  if (el.btnPickImages && el.imageInput) {
    el.btnPickImages.addEventListener("click", (e) => {
      e.stopPropagation();
      el.imageInput.click();
    });
  }

  if (el.dropzone && el.imageInput) {
    el.dropzone.addEventListener("click", (e) => {
      if (!e.target.closest("button")) el.imageInput.click();
    });
    el.dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      el.dropzone.classList.add("is-dragover");
    });
    el.dropzone.addEventListener("dragleave", () => el.dropzone.classList.remove("is-dragover"));
    el.dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      el.dropzone.classList.remove("is-dragover");
      addFiles(e.dataTransfer.files);
    });
    el.imageInput.addEventListener("change", () => {
      addFiles(el.imageInput.files);
      el.imageInput.value = "";
    });
  }

  document.addEventListener("paste", (e) => {
    if (!e.clipboardData || !e.clipboardData.files || !e.clipboardData.files.length) return;
    addFiles(e.clipboardData.files);
  });

  if (el.imageGrid) {
    el.imageGrid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-img]");
      if (btn) removeImage(btn.getAttribute("data-remove-img"));
    });
    el.imageGrid.addEventListener("input", (e) => {
      const inp = e.target.closest("[data-note-idx]");
      if (!inp) return;
      const idx = Number(inp.getAttribute("data-note-idx"));
      if (state.images[idx]) {
        state.images[idx].note = inp.value;
        updatePreview();
      }
    });
  }

  if (el.btnClearImages) el.btnClearImages.addEventListener("click", clearAllImages);
  if (el.btnSubmit) el.btnSubmit.addEventListener("click", submitRequest);
  if (el.btnShareNative) el.btnShareNative.addEventListener("click", shareNative);
  if (el.btnDownloadSheet) el.btnDownloadSheet.addEventListener("click", downloadVisualSheet);

  if (el.btnCopyText) {
    el.btnCopyText.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(buildPreviewMessage());
        const prev = el.btnCopyText.textContent;
        el.btnCopyText.textContent = "Copiado";
        showToast("Mensaje copiado al portapapeles");
        setTimeout(() => {
          el.btnCopyText.textContent = prev;
        }, 1600);
      } catch {
        showFeedback("No se pudo copiar al portapapeles en este navegador.", "error");
      }
    });
  }

  if (el.portfolioGrid) {
    el.portfolioGrid.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-open-project]");
      if (trigger) openProjectModal(Number(trigger.getAttribute("data-open-project")));
    });
    el.portfolioGrid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const trigger = e.target.closest("[data-open-project]");
      if (trigger) {
        e.preventDefault();
        openProjectModal(Number(trigger.getAttribute("data-open-project")));
      }
    });
  }

  // Cierre accesible de todos los modales (<dialog>)
  document.querySelectorAll(".dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-close-dialog]")) {
        closeDialog(dlg);
      }
    });
    dlg.addEventListener("close", () => {
      if (state.lastFocusedEl && typeof state.lastFocusedEl.focus === "function") {
        state.lastFocusedEl.focus({ preventScroll: true });
        state.lastFocusedEl = null;
      }
    });
  });

  if (el.modal) {
    el.modal.addEventListener("click", (e) => {
      const thumb = e.target.closest("[data-thumb-src]");
      if (thumb) {
        el.modalThumbs.querySelectorAll(".modal__thumb-btn").forEach((b) => b.classList.remove("is-active"));
        thumb.classList.add("is-active");
        const num = thumb.getAttribute("data-thumb-num") || "1";
        setModalImage(thumb.getAttribute("data-thumb-src"), `Captura ${num} de ${el.modalTitle.textContent}`);
      }
    });
  }

  if (el.modalBtnSimilar) {
    el.modalBtnSimilar.addEventListener("click", () => {
      if (state.activeModalProject && el.description && !el.description.value.trim()) {
        el.description.value = `Quiero un sistema o página similar a "${state.activeModalProject.nombre}", adaptado a mi negocio con...`;
        updatePreview();
      }
      closeDialog(el.modal);
      scrollToSection("contacto", true);
      showToast("Referencia cargada en tu brief");
    });
  }

  // Filtros de casos en producción
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeFilter = btn.getAttribute("data-filter") || "all";
      document.querySelectorAll("[data-filter]").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      renderPortfolio(state.projects);
    });
  });
}

/* === 12. INCLINACIÓN 3D MULTICAPA SIN LAG EN TARJETAS (.tilt-3d) === */
function initCard3DTilt() {
  if (REDUCED_MOTION || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let activeCard = null;
  let rafPending = false;
  let nextRx = 0;
  let nextRy = 0;
  let nextMx = 50;
  let nextMy = 50;

  const resetCard = (card) => {
    if (!card) return;
    card.classList.remove("is-tilting");
    card.style.removeProperty("--rx");
    card.style.removeProperty("--ry");
  };

  const flushTilt = () => {
    rafPending = false;
    if (!activeCard) return;
    activeCard.style.setProperty("--rx", `${nextRx.toFixed(2)}deg`);
    activeCard.style.setProperty("--ry", `${nextRy.toFixed(2)}deg`);
    activeCard.style.setProperty("--mx", `${nextMx.toFixed(1)}%`);
    activeCard.style.setProperty("--my", `${nextMy.toFixed(1)}%`);
  };

  document.addEventListener(
    "pointermove",
    (e) => {
      const card = e.target instanceof Element ? e.target.closest(".tilt-3d") : null;
      if (activeCard && activeCard !== card) {
        resetCard(activeCard);
      }
      activeCard = card;
      if (!card) return;
      card.classList.add("is-tilting");

      const r = card.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      nextRx = (0.5 - py) * 10;
      nextRy = (px - 0.5) * 12;
      nextMx = px * 100;
      nextMy = py * 100;

      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(flushTilt);
      }
    },
    { passive: true }
  );

  document.addEventListener("pointerout", (e) => {
    if (!activeCard) return;
    if (!e.relatedTarget || !activeCard.contains(e.relatedTarget)) {
      resetCard(activeCard);
      activeCard = null;
    }
  });
}

/* === 13. FONDO 3D INTERACTIVO LIGERO EN THREE.JS (DIFERIDO Y APTO PARA MÓVIL) === */
async function initThreeBackground() {
  const canvas = el.bg3d;
  if (!canvas || REDUCED_MOTION || window.location.protocol === "file:") return;
  if (navigator.connection && navigator.connection.saveData) return;

  try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js");
    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = isMobile ? 10.8 : 8.8;

    const group = new THREE.Group();
    group.position.x = isMobile ? 0 : 2.4;
    scene.add(group);

    const isConsoleInit = document.documentElement.getAttribute("data-theme") === "console";
    const outerMat = new THREE.MeshBasicMaterial({
      color: isConsoleInit ? 0x00b4d8 : 0x0066ff,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
    });
    const innerMat = new THREE.MeshBasicMaterial({
      color: isConsoleInit ? 0x38f9d7 : 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const ringMat = new THREE.MeshBasicMaterial({
      color: isConsoleInit ? 0x38f9d7 : 0x00d2ff,
      transparent: true,
      opacity: 0.18,
    });

    const outerPoly = new THREE.Mesh(new THREE.IcosahedronGeometry(2.85, 1), outerMat);
    const innerPoly = new THREE.Mesh(new THREE.OctahedronGeometry(1.5, 0), innerMat);
    const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(3.65, 0.015, 8, isMobile ? 48 : 84), ringMat);
    orbitRing.rotation.x = Math.PI * 0.36;
    group.add(outerPoly, innerPoly, orbitRing);

    const count = isMobile ? 60 : 140;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 19;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    const ptsGeo = new THREE.BufferGeometry();
    ptsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const ptsMat = new THREE.PointsMaterial({
      color: isConsoleInit ? 0x38f9d7 : 0x00d2ff,
      size: isMobile ? 0.055 : 0.048,
      transparent: true,
      opacity: 0.4,
    });
    const cloud = new THREE.Points(ptsGeo, ptsMat);
    scene.add(cloud);

    state.bg3dSyncTheme = (consoleMode) => {
      outerMat.color.setHex(consoleMode ? 0x00b4d8 : 0x0066ff);
      innerMat.color.setHex(consoleMode ? 0x38f9d7 : 0x00d2ff);
      ringMat.color.setHex(consoleMode ? 0x38f9d7 : 0x00d2ff);
      ptsMat.color.setHex(consoleMode ? 0x38f9d7 : 0x00d2ff);
    };

    let targetX = 0;
    let targetY = 0;
    let scrollAngle = 0;

    if (!isMobile) {
      window.addEventListener(
        "pointermove",
        (e) => {
          targetX = (e.clientX / window.innerWidth - 0.5) * 0.45;
          targetY = (e.clientY / window.innerHeight - 0.5) * 0.32;
        },
        { passive: true }
      );
    }

    window.addEventListener(
      "scroll",
      () => {
        scrollAngle = (window.scrollY || 0) * 0.0006;
      },
      { passive: true }
    );

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = w < 768 ? 10.8 : 8.8;
      group.position.x = w < 768 ? 0 : 2.4;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize, { passive: true });

    let rafId = 0;
    const renderLoop = () => {
      if (document.hidden) {
        rafId = 0;
        return;
      }
      outerPoly.rotation.y += 0.0017;
      outerPoly.rotation.x += 0.0008;
      innerPoly.rotation.y -= 0.003;
      innerPoly.rotation.z += 0.0014;
      orbitRing.rotation.z += 0.0022;
      cloud.rotation.y = scrollAngle * 0.5 + performance.now() * 0.00004;

      group.position.y += (targetY * -0.9 - group.position.y) * 0.04;
      group.rotation.y += (targetX + scrollAngle - group.rotation.y) * 0.04;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(renderLoop);
    };

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !rafId) rafId = requestAnimationFrame(renderLoop);
    });

    renderer.render(scene, camera);
    canvas.classList.add("is-active");
    rafId = requestAnimationFrame(renderLoop);

    window.addEventListener(
      "pagehide",
      () => {
        if (rafId) cancelAnimationFrame(rafId);
        ptsGeo.dispose();
        outerPoly.geometry.dispose();
        innerPoly.geometry.dispose();
        orbitRing.geometry.dispose();
        outerMat.dispose();
        innerMat.dispose();
        ringMat.dispose();
        ptsMat.dispose();
        renderer.dispose();
      },
      { once: true }
    );
  } catch {
    canvas.hidden = true;
  }
}

/* === 14. ARRANQUE DE LA APLICACIÓN === */
initPreloader();
initNavigationAndScroll();
initHeroAndArchitecture();
initSolutionsCatalog();
initCommandPalette();
initCard3DTilt();
bindEvents();
updatePreview();
initBackendConnection();

// Diferir la carga de Three.js para no competir con el renderizado crítico inicial
if ("requestIdleCallback" in window) {
  window.requestIdleCallback(() => initThreeBackground(), { timeout: 1200 });
} else {
  setTimeout(initThreeBackground, 450);
}
