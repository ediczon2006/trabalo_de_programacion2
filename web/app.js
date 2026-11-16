/**
 * ==========================================================================
 * EVM SOFTWARE STUDIO — INTERACTIVE FRONTEND ENGINE (Vanilla ES6+)
 * Arquitectura modular sin dependencias externas.
 * Conecta con el backend Java + C++ + SQLite (/api/proyectos, /api/solicitudes)
 * y conserva respaldo estático funcional para GitHub Pages.
 * ==========================================================================
 */

const CONFIG = {
  whatsappCountryCode: "51",
  whatsappNumber: "914662798",
  maxImages: 8,
  maxFileSizeBytes: 12 * 1024 * 1024,
  apiBaseUrl: "",
};

const SCRIPT_BASE_URL =
  document.currentScript && document.currentScript.src
    ? new URL(".", document.currentScript.src).href
    : window.location.href;

function resolveAssetUrl(relPath) {
  if (!relPath || /^https?:\/\//i.test(relPath)) return relPath;
  try {
    return new URL(relPath, SCRIPT_BASE_URL).href;
  } catch {
    return relPath;
  }
}

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* === DATOS VERIFICADOS DE CASOS Y ESPECIFICACIONES DE MÓDULOS === */
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
    slug: "02_Pelitos_Administracion",
    nombre: "Pelitos Docs",
    tipo: "Aplicación web de gestión documental",
    descripcion:
      "Biblioteca y explorador empresarial de documentos organizado por unidades de negocio y servicios compartidos, con búsqueda, filtros por formato, carga de archivos e inspector visual.",
    urlPublica: "https://ediczon2006.github.io/-administracion_de_clientes_pelitos_veterinaria/",
    imagenPrincipal:
      "assets/portafolio/02_Pelitos_Administracion/capturas_limpias/01_inicio_escritorio.png",
    galeria: [
      "assets/portafolio/02_Pelitos_Administracion/capturas_limpias/01_inicio_escritorio.png",
      "assets/portafolio/02_Pelitos_Administracion/capturas_limpias/02_explorador_documental.png",
    ],
    aspectos: [
      "Organización por unidades de negocio y servicios compartidos",
      "Buscador por nombre y filtro por formato de documento",
      "Explorador con árbol de directorios e inspector lateral",
    ],
  },
  {
    slug: "03_Ferreteria_Sullcairi",
    nombre: "Ferretería Sullcairi PRO POS",
    tipo: "Sistema web de inventario y reportes comerciales",
    descripcion:
      "Sistema de control de stock y caja en modo local con indicadores de inventario, importación y exportación en Excel, alertas de reposición y resumen comercial de ventas.",
    urlPublica: "https://ediczon2006.github.io/ferreteria_sullcairi/",
    imagenPrincipal:
      "assets/portafolio/03_Ferreteria_Sullcairi/capturas_limpias/01_inventario_y_stock.png",
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
    summary: "Sitios corporativos de alto impacto, catálogos interactivos y portales de autogestión con rendimiento perfecto.",
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
  "02_Pelitos_Administracion": "gestion",
  "03_Ferreteria_Sullcairi": "ventas",
  "04_Sullcairi": "gestion",
  "05_Leyder": "gestion",
};

const state = {
  projects: FALLBACK_PROJECTS,
  activeFilter: "all",
  activeSolFilter: "all",
  activeSolSort: "demand",
  backendOnline: false,
  images: [],
  activeModalProject: null,
  activeSpecId: null,
  cmdkItems: [],
  cmdkIndex: 0,
};

const el = {
  preloader: document.getElementById("preloader"),
  preloaderRail: document.getElementById("preloader-rail"),
  preloaderFill: document.getElementById("preloader-fill"),
  preloaderNode: document.getElementById("preloader-node"),
  preloaderPct: document.getElementById("preloader-pct"),
  nav: document.getElementById("nav"),
  navLinks: document.getElementById("nav-links"),
  navToggle: document.getElementById("nav-toggle"),
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

function apiUrl(path) {
  return `${CONFIG.apiBaseUrl}${path}`;
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function animateCounters() {
  document.querySelectorAll("[data-count-to]").forEach((node) => {
    const target = Number(node.getAttribute("data-count-to") || "0");
    if (!target || REDUCED_MOTION) {
      node.textContent = String(target);
      return;
    }
    const start = performance.now();
    const dur = 950;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* === PRELOADER LOGIC === */
function initPreloader() {
  const root = document.documentElement;
  if (!el.preloader || REDUCED_MOTION) {
    root.classList.remove("is-loading");
    root.classList.add("is-ready");
    if (el.preloader) el.preloader.classList.add("is-complete");
    animateCounters();
    return;
  }

  const duration = 1150;
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
      }, 220);
    }
  }

  requestAnimationFrame(tick);
}

/* === NAVBAR, SCROLL SPY, THEME CONSOLE & REVEAL === */
function initNavigationAndTheme() {
  const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || "");
  document.querySelectorAll("[data-kbd-mod]").forEach((k) => {
    k.textContent = isMac ? "⌘" : "Ctrl";
  });

  const syncThemeBtn = () => {
    const isConsole = document.documentElement.getAttribute("data-theme") === "console";
    if (el.themeToggle) el.themeToggle.setAttribute("aria-pressed", String(isConsole));
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
    });
  }

  if (el.navToggle && el.navLinks) {
    el.navToggle.addEventListener("click", () => {
      const open = el.navLinks.classList.toggle("is-open");
      el.navToggle.setAttribute("aria-expanded", String(open));
    });
    el.navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        el.navLinks.classList.remove("is-open");
        el.navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const onScroll = () => {
    if (el.nav) el.nav.classList.toggle("is-scrolled", window.scrollY > 18);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Scroll Spy de secciones
  const spyLinks = new Map();
  document.querySelectorAll("[data-spy]").forEach((a) => spyLinks.set(a.getAttribute("data-spy"), a));

  if ("IntersectionObserver" in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            spyLinks.forEach((link, key) => link.classList.toggle("is-active", key === id));
          }
        });
      },
      { rootMargin: "-38% 0px -52% 0px" }
    );
    spyLinks.forEach((_, id) => {
      const sec = document.getElementById(id);
      if (sec) spyObserver.observe(sec);
    });

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04, rootMargin: "80px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));
  } else {
    document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
  }

  const yr = document.getElementById("year");
  if (yr) yr.textContent = String(new Date().getFullYear());
}

/* === HERO PARALLAX, MAGNETIC CTA, LIVE TELEMETRY & WHITEPAPER === */
function initHeroInteractions() {
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
        tiltNode.style.setProperty("--rx", `${(4 - curY * 6).toFixed(2)}deg`);
        tiltNode.style.setProperty("--ry", `${(-6 + curX * 8).toFixed(2)}deg`);
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

  // Micro-hover magnético en botones principales
  if (!REDUCED_MOTION) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // Selector de vistas del Workstation en Hero
  document.querySelectorAll("[data-screen]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-screen");
      document.querySelectorAll("[data-screen]").forEach((b) => {
        const active = b === tab;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
        b.tabIndex = active ? 0 : -1;
      });

      if (target === "dashboard") {
        if (el.dash) el.dash.hidden = false;
        if (el.screenShot) el.screenShot.hidden = true;
      } else {
        const proj = state.projects.find((p) => p.slug === target) || state.projects[0];
        if (proj && el.heroShowcaseImg && el.heroShowcaseLabel) {
          el.heroShowcaseImg.src = resolveAssetUrl(proj.imagenPrincipal);
          el.heroShowcaseImg.alt = `Vista de ${proj.nombre}`;
          el.heroShowcaseLabel.textContent = `${proj.nombre} · ${proj.tipo}`;
          if (el.dash) el.dash.hidden = true;
          if (el.screenShot) el.screenShot.hidden = false;
        }
      }
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

  // Generador de Whitepaper Corporativo descargable
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
    });
  }
}

/* === GLASS GRID: FILTRADO, ORDENAMIENTO Y MODAL DE ESPECIFICACIONES === */
function applySolutionsCatalog() {
  if (!el.solGrid) return;
  const cards = Array.from(el.solGrid.querySelectorAll(".sol-card"));
  const filter = state.activeSolFilter;
  const sortBy = state.activeSolSort;

  cards.sort((a, b) => {
    if (sortBy === "deploy") {
      return Number(a.dataset.deploy) - Number(b.dataset.deploy);
    }
    if (sortBy === "complexity") {
      return Number(b.dataset.complexity) - Number(a.dataset.complexity);
    }
    return Number(b.dataset.demand) - Number(a.dataset.demand);
  });

  cards.forEach((c) => c.classList.add("is-filtering-out"));

  setTimeout(() => {
    let visibleCount = 0;
    cards.forEach((card) => {
      el.solGrid.appendChild(card);
      const match = filter === "all" || card.dataset.cat === filter;
      card.hidden = !match;
      if (match) visibleCount++;
      requestAnimationFrame(() => card.classList.remove("is-filtering-out"));
    });
    if (el.solCount) {
      el.solCount.textContent =
        visibleCount === 1 ? "1 módulo disponible" : `${visibleCount} módulos disponibles`;
    }
  }, REDUCED_MOTION ? 0 : 140);
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
  if (typeof el.specModal.showModal === "function") {
    el.specModal.showModal();
  } else {
    el.specModal.setAttribute("open", "");
  }
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
      if (spec) {
        const box = el.form.querySelector(`input[name="projectType"][value="${spec.presetType}"]`);
        if (box) box.checked = true;
        if (!el.description.value.trim()) {
          el.description.value = `Solicito el módulo "${spec.title}" (${spec.cat}) adaptado a mi empresa con...`;
        }
        updatePreview();
      }
      closeDialog(el.specModal);
      document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
    });
  }
}

/* === COMMAND PALETTE (Ctrl+K / Cmd+K) === */
function initCommandPalette() {
  if (!el.cmdkDialog || !el.cmdkInput || !el.cmdkList) return;

  const baseCommands = [
    { label: "Ir a Inicio (Hero)", meta: "Sección", action: () => location.assign("#inicio") },
    { label: "Ir a Catálogo de Soluciones", meta: "Sección", action: () => location.assign("#soluciones") },
    { label: "Ir a Stack Técnico", meta: "Sección", action: () => location.assign("#stack") },
    { label: "Ir a Arquitectura de Referencia", meta: "Sección", action: () => location.assign("#arquitectura") },
    { label: "Ir a Casos en Producción", meta: "Sección", action: () => location.assign("#casos") },
    { label: "Iniciar Proyecto / Enviar Brief", meta: "Acción", action: () => location.assign("#contacto") },
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
    if (typeof el.cmdkDialog.showModal === "function") {
      el.cmdkDialog.showModal();
    } else {
      el.cmdkDialog.setAttribute("open", "");
    }
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

function closeDialog(dlg) {
  if (!dlg) return;
  if (typeof dlg.close === "function") dlg.close();
  else dlg.removeAttribute("open");
}

/* === PORTAFOLIO DE CASOS EN PRODUCCIÓN Y CONEXIÓN BACKEND === */
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
    .map((p) => {
      const realIndex = state.projects.indexOf(p);
      const bullets = (p.aspectos || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      const count = (p.galeria || []).length;
      return `
        <article class="project-card">
          <div class="project-card__chrome" aria-hidden="true">
            <div class="project-card__dots"><span></span><span></span><span></span></div>
            <span>${escapeHtml(p.nombre)}</span>
          </div>
          <div class="project-card__thumb" data-open-project="${realIndex}" role="button" tabindex="0" aria-label="Ampliar capturas de ${escapeHtml(p.nombre)}">
            <img src="${escapeHtml(resolveAssetUrl(p.imagenPrincipal))}" alt="Captura real de ${escapeHtml(p.nombre)}" loading="lazy" decoding="async" />
            <span class="project-card__badge">${count} capturas reales</span>
          </div>
          <div class="project-card__body">
            <span class="project-card__type">${escapeHtml(p.tipo)}</span>
            <h3 class="project-card__title">${escapeHtml(p.nombre)}</h3>
            <p class="project-card__desc">${escapeHtml(p.descripcion)}</p>
            <ul class="project-card__list">${bullets}</ul>
            <div class="project-card__actions">
              <button type="button" class="btn btn--primary btn--sm" data-open-project="${realIndex}">Ver capturas</button>
              <a class="btn btn--secondary btn--sm" href="${escapeHtml(p.urlPublica)}" target="_blank" rel="noopener noreferrer">Visitar sitio</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
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
  setModalImage(imgs[0], proj.nombre);

  el.modalThumbs.innerHTML = imgs
    .map(
      (src, i) => `
      <button type="button" class="modal__thumb-btn ${i === 0 ? "is-active" : ""}" data-thumb-src="${escapeHtml(src)}">
        <img src="${escapeHtml(src)}" alt="${escapeHtml(proj.nombre)} miniatura ${i + 1}" />
      </button>
    `
    )
    .join("");

  if (typeof el.modal.showModal === "function") el.modal.showModal();
  else el.modal.setAttribute("open", "");
}

function setModalImage(src, altText) {
  el.modalMainImg.src = src;
  el.modalMainImg.alt = altText || "Captura de proyecto";
}

/* === FORMULARIO DE SOLICITUD, SUBIDA DE IMÁGENES Y WHATSAPP === */
function getCheckedValues(name) {
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
  el.feedback.textContent = text;
  el.feedback.className = `feedback feedback--${kind}`;
  el.feedback.hidden = false;
}

function clearFeedback() {
  el.feedback.hidden = true;
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
          <img src="${item.previewUrl}" alt="${escapeHtml(item.file.name)}" />
          <button type="button" class="img-item__remove" data-remove-img="${item.id}" aria-label="Quitar imagen">✕</button>
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
            placeholder="Nota (ej. Mi logo, diseño)"
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
    showFeedback("Por favor ingresa tu nombre o el nombre de tu empresa.", "error");
    el.clientName.focus();
    return false;
  }
  if (!el.description.value.trim()) {
    showFeedback("Cuéntanos brevemente qué quieres que haga tu página o sistema.", "error");
    el.description.focus();
    return false;
  }
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
  labelNode.textContent = "Procesando y guardando...";

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

      const res = await fetch(apiUrl("/api/solicitudes"), { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo guardar la solicitud.");
      }

      el.savedCode.textContent = data.codigo;
      el.savedDetailText.textContent =
        data.imagenes && data.imagenes.length
          ? `Se registraron ${data.imagenes.length} imagen(es) en base de datos. Ya puedes abrir WhatsApp con el enlace directo.`
          : "Tu solicitud fue guardada en base de datos.";
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
      el.savedCode.textContent = "MODO-LOCAL";
      el.savedDetailText.textContent = state.images.length
        ? "Se abrió WhatsApp con tu mensaje. Arrastra tus imágenes al chat o descarga la Ficha PNG abajo."
        : "Se abrió WhatsApp con tu mensaje listo.";
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
    showFeedback("Imágenes y mensaje compartidos.", "ok");
  } catch (err) {
    if (err && err.name !== "AbortError") {
      showFeedback("No se pudo abrir el menú de compartir directo en este navegador.", "error");
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

  ctx.fillStyle = "#07090e";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#00d2ff";
  ctx.font = "bold 20px Segoe UI, sans-serif";
  ctx.fillText("EVM SOFTWARE STUDIO · BRIEF DE PROYECTO", pad, 64);

  ctx.fillStyle = "#f0f4f8";
  ctx.font = "bold 36px Segoe UI, sans-serif";
  ctx.fillText(el.clientName.value.trim().slice(0, 40), pad, 114);

  const types = getCheckedValues("projectType");
  ctx.fillStyle = "#a3adc2";
  ctx.font = "22px Segoe UI, sans-serif";
  ctx.fillText(`Solución: ${(types.length ? types.join(", ") : "Por definir").slice(0, 68)}`, pad, 156);

  const features = getCheckedValues("features");
  let y = 194;
  if (features.length) {
    ctx.fillStyle = "#8a94a6";
    ctx.font = "19px Segoe UI, sans-serif";
    ctx.fillText(`Funciones: ${features.join(" · ").slice(0, 80)}`, pad, y);
    y += 38;
  }

  ctx.fillStyle = "#0f141c";
  ctx.fillRect(pad, y, width - pad * 2, descLines.length * 28 + 44);
  ctx.fillStyle = "#f0f4f8";
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

    ctx.fillStyle = "#0f141c";
    ctx.fillRect(x, ty, thumbW, thumbH);
    const scale = Math.min(thumbW / im.width, thumbH / im.height);
    const dw = im.width * scale;
    const dh = im.height * scale;
    ctx.drawImage(im, x + (thumbW - dw) / 2, ty + (thumbH - dh) / 2, dw, dh);

    ctx.fillStyle = "#a3adc2";
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
}

async function initBackendConnection() {
  const pillText = el.serverStatusPill && el.serverStatusPill.querySelector(".status-pill__text");
  try {
    const [healthRes, projRes] = await Promise.all([
      fetch(apiUrl("/api/health")),
      fetch(apiUrl("/api/proyectos")),
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
      throw new Error("offline");
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

function bindEvents() {
  el.form.addEventListener("input", updatePreview);
  el.form.addEventListener("change", updatePreview);

  el.btnPickImages.addEventListener("click", (e) => {
    e.stopPropagation();
    el.imageInput.click();
  });

  el.dropzone.addEventListener("click", () => el.imageInput.click());

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

  document.addEventListener("paste", (e) => {
    if (!e.clipboardData || !e.clipboardData.files || !e.clipboardData.files.length) return;
    addFiles(e.clipboardData.files);
  });

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

  el.btnClearImages.addEventListener("click", clearAllImages);
  el.btnSubmit.addEventListener("click", submitRequest);
  el.btnShareNative.addEventListener("click", shareNative);
  el.btnDownloadSheet.addEventListener("click", downloadVisualSheet);

  el.btnCopyText.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(buildPreviewMessage());
      const prev = el.btnCopyText.textContent;
      el.btnCopyText.textContent = "Copiado";
      setTimeout(() => {
        el.btnCopyText.textContent = prev;
      }, 1600);
    } catch {
      showFeedback("No se pudo copiar al portapapeles en este navegador.", "error");
    }
  });

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

  // Cierre accesible para todos los <dialog>
  document.querySelectorAll(".dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-close-dialog]")) {
        closeDialog(dlg);
      }
    });
  });

  if (el.modal) {
    el.modal.addEventListener("click", (e) => {
      const thumb = e.target.closest("[data-thumb-src]");
      if (thumb) {
        el.modalThumbs.querySelectorAll(".modal__thumb-btn").forEach((b) => b.classList.remove("is-active"));
        thumb.classList.add("is-active");
        setModalImage(thumb.getAttribute("data-thumb-src"), el.modalTitle.textContent);
      }
    });
  }

  if (el.modalBtnSimilar) {
    el.modalBtnSimilar.addEventListener("click", () => {
      if (state.activeModalProject && !el.description.value.trim()) {
        el.description.value = `Quiero un sistema o página similar a "${state.activeModalProject.nombre}", adaptado a mi negocio con...`;
        updatePreview();
      }
      closeDialog(el.modal);
      document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
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

/* === BOOTSTRAP === */
initPreloader();
initNavigationAndTheme();
initHeroInteractions();
initSolutionsCatalog();
initCommandPalette();
bindEvents();
updatePreview();
initBackendConnection();
