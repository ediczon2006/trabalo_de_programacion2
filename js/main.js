/**
 * ==========================================================================
 * EVM SOFTWARE STUDIO — LÓGICA PRINCIPAL Y MÓDULOS DE PÁGINA (main.js)
 * Compatible con estructura multipágina en GitHub Pages y backend local Java.
 * ==========================================================================
 */

(function () {
  const ROOT = (document.body && document.body.getAttribute("data-root")) || ".";
  const CONFIG = {
    whatsappDigits: "51914662798",
    maxImages: 8,
    maxFileSizeBytes: 12 * 1024 * 1024,
    apiBaseUrl: "",
  };

  function resolvePath(relPath) {
    if (!relPath) return "";
    if (/^(https?:|data:|blob:)/i.test(relPath)) return relPath;
    let clean = String(relPath).replace(/^[./\\]+/, "");
    // Compatibilidad con rutas heredadas del servidor Java/SQLite
    clean = clean.replace(/^assets\/portafolio\/([^/]+)\/capturas_limpias\//, "assets/img/portafolio/$1/");
    clean = clean.replace(/^assets\/brand\//, "assets/img/brand/");
    return `${ROOT}/${clean}`;
  }

  function isStaticHost() {
    if (CONFIG.apiBaseUrl) return false;
    if (window.location.protocol === "file:") return true;
    const h = window.location.hostname.toLowerCase();
    return h.endsWith(".github.io") || h.endsWith(".pages.dev") || h.endsWith(".netlify.app");
  }

  function escapeHtml(val) {
    return String(val || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function refreshIcons(scope = document) {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({ attrs: { "stroke-width": 1.9 }, nameAttr: "data-lucide", root: scope });
    }
  }

  /* === Datos reales verificados del proyecto === */
  const PROJECTS = [
    {
      slug: "01_Pelitos_Web",
      cat: "web",
      nombre: "Pelitos Veterinaria",
      tipo: "Sitio web comercial y catálogo en línea",
      descripcion: "Sitio web informativo y comercial de clínica veterinaria, estética canina y petshop en Huánuco, con reserva rápida de citas, directorio de servicios y catálogo de productos.",
      urlPublica: "https://ediczon2006.github.io/Pelitos_Veterinarias/",
      imagenPrincipal: "assets/img/portafolio/01_Pelitos_Web/01_inicio_escritorio.png",
      galeria: [
        "assets/img/portafolio/01_Pelitos_Web/01_inicio_escritorio.png",
        "assets/img/portafolio/01_Pelitos_Web/02_catalogo_petshop.png",
        "assets/img/portafolio/01_Pelitos_Web/03_servicios_veterinarios.png",
        "assets/img/portafolio/01_Pelitos_Web/04_vista_movil.png",
      ],
      aspectos: [
        "Selector rápido de reserva de cita en portada",
        "Catálogo PetShop con buscador, conteo y filtros",
        "Directorio de servicios médicos con detalle desplegable",
      ],
    },
    {
      slug: "03_Ferreteria_Sullcairi",
      cat: "ventas",
      nombre: "Ferretería Sullcairi PRO POS",
      tipo: "Sistema web de inventario y reportes comerciales",
      descripcion: "Sistema de control de stock y caja en modo local con indicadores de inventario, importación y exportación en Excel, alertas de reposición y resumen comercial de ventas.",
      urlPublica: "https://ediczon2006.github.io/ferreteria_sullcairi/",
      imagenPrincipal: "assets/img/portafolio/03_Ferreteria_Sullcairi/01_inventario_y_stock.png",
      galeria: [
        "assets/img/portafolio/03_Ferreteria_Sullcairi/01_inventario_y_stock.png",
        "assets/img/portafolio/03_Ferreteria_Sullcairi/02_resumen_de_ventas.png",
      ],
      aspectos: [
        "Control de inventario con filtros por categoría y stock",
        "Plantilla, importación y exportación de catálogo a Excel",
        "Resumen comercial con ingresos, ganancia neta e historial",
      ],
    },
    {
      slug: "04_Sullcairi",
      cat: "gestion",
      nombre: "Estación de Servicios Sullcairi",
      tipo: "Portal de acceso de sistema operativo",
      descripcion: "Portal de autenticación para estación de servicios con selector visual por perfil/turno y teclado numérico táctil para ingreso seguro mediante código PIN.",
      urlPublica: "https://ediczon2006.github.io/sullcairi/login.html",
      imagenPrincipal: "assets/img/portafolio/04_Sullcairi/01_login_escritorio.png",
      galeria: [
        "assets/img/portafolio/04_Sullcairi/01_login_escritorio.png",
        "assets/img/portafolio/04_Sullcairi/02_login_movil.png",
      ],
      aspectos: [
        "Selector de perfiles de administrador y turnos de atención",
        "Teclado numérico en pantalla para código PIN",
        "Interfaz centrada adaptable en escritorio y móvil",
      ],
    },
    {
      slug: "05_Leyder",
      cat: "gestion",
      nombre: "Leytrix ISP",
      tipo: "Panel administrativo para proveedor de internet",
      descripcion: "Panel de control para gestión de clientes de internet por zonas geográficas, registro de pagos y vouchers bancarios, cortes y reconexiones, y galería fotográfica.",
      urlPublica: "https://ediczon2006.github.io/leyder/",
      imagenPrincipal: "assets/img/portafolio/05_Leyder/01_panel_de_control.png",
      galeria: [
        "assets/img/portafolio/05_Leyder/01_panel_de_control.png",
        "assets/img/portafolio/05_Leyder/02_cortes_y_reconexion.png",
        "assets/img/portafolio/05_Leyder/03_pagos_y_vouchers.png",
        "assets/img/portafolio/05_Leyder/04_vista_movil.png",
      ],
      aspectos: [
        "Panel de control con métricas de red y tabla por zonas",
        "Gestión de cortes, reconexiones y morosidad",
        "Registro de pagos y comprobantes Yape / BCP",
      ],
    },
  ];

  const MODULES = [
    { id: "core-erp", cat: "erp", catLabel: "ERP & Finanzas", icon: "landmark", tier: "Enterprise", demand: 98, deploy: 16, cx: 5, cxText: "5 / 5 (Alta)", deployText: "12–16 semanas", presetType: "Sistema Web a Medida", title: "Core Bancario & ERP Cloud", desc: "Contabilidad, tesorería y operaciones integradas en un núcleo transaccional auditable.", stack: "TypeScript • Go • PostgreSQL • AWS", summary: "Núcleo transaccional multi-sucursal con libro mayor inmutable, conciliación automática y auditoría completa.", deliverables: ["Motor contable y tesorería multi-moneda con trazabilidad total", "API Gateway autenticado con control de acceso por roles (RBAC)", "Reportes financieros en tiempo real y exportación contable", "Transferencia 100% de código fuente y manuales de arquitectura"] },
    { id: "billing", cat: "erp", catLabel: "ERP & Finanzas", icon: "receipt", tier: "Modular", demand: 92, deploy: 6, cx: 3, cxText: "3 / 5 (Media)", deployText: "4–6 semanas", presetType: "Sistema de Ventas / Inventario", title: "Facturación Electrónica & Tesorería", desc: "Emisión SUNAT, conciliación bancaria automatizada y flujo de caja en tiempo real.", stack: "Java 21 • Spring • Redis • REST", summary: "Emisión automatizada de comprobantes electrónicos, notas de crédito, liquidaciones y cuentas por cobrar.", deliverables: ["Integración directa con OSE / SUNAT y firmas digitales", "Bandeja PDF/XML con envío automático por WhatsApp y correo", "Dashboard de flujo de caja y alertas de vencimiento"] },
    { id: "pos", cat: "erp", catLabel: "ERP & Finanzas", icon: "monitor-smartphone", tier: "Modular", demand: 95, deploy: 4, cx: 2, cxText: "2 / 5 (Ágil)", deployText: "3–4 semanas", presetType: "Sistema de Ventas / Inventario", title: "POS & Inventario Omnicanal", desc: "Control de caja, stock con alertas de reposición y reportes exportables a Excel.", stack: "JavaScript • Node.js • SQLite • PWA", summary: "Punto de venta veloz con kardex valorizado, alertas de reposición y cierre diario de caja.", deliverables: ["Terminal optimizado para lector de barras y pantallas táctiles", "Importación y exportación masiva de catálogo en Excel", "Resumen diario de ingresos, margen neto y rotación"] },
    { id: "multicloud", cat: "cloud", catLabel: "Cloud & DevOps", icon: "cloud", tier: "Enterprise", demand: 88, deploy: 10, cx: 5, cxText: "5 / 5 (Alta)", deployText: "8–10 semanas", presetType: "Sistema Web a Medida", title: "Arquitectura Multi-Cloud", desc: "Infraestructura como código, alta disponibilidad multi-zona y observabilidad SRE.", stack: "Terraform • Kubernetes • AWS • GCP", summary: "Diseño y aprovisionamiento de infraestructura elástica con recuperación ante desastres.", deliverables: ["Módulos Terraform versionados para dev, staging y prod", "Clústeres con auto-escalado horizontal y balanceo multi-zona", "Tableros de métricas, logs y trazas distribuidas"] },
    { id: "cicd", cat: "cloud", catLabel: "Cloud & DevOps", icon: "git-branch", tier: "Modular", demand: 84, deploy: 3, cx: 3, cxText: "3 / 5 (Media)", deployText: "2–3 semanas", presetType: "Rediseño o Mejoras", title: "Pipelines CI/CD & GitOps", desc: "Compilaciones reproducibles, pruebas automáticas y despliegues continuos sin caídas.", stack: "GitHub Actions • Docker • ArgoCD", summary: "Automatización de compilación, pruebas, escaneo de seguridad y despliegue sin interrupciones.", deliverables: ["Pipelines automatizados de build y test en cada Pull Request", "Imágenes de contenedor multi-stage optimizadas", "Rollback instantáneo y despliegues canary/blue-green"] },
    { id: "agents", cat: "ia", catLabel: "IA & Agentes", icon: "bot", tier: "Enterprise", demand: 97, deploy: 8, cx: 5, cxText: "5 / 5 (Alta)", deployText: "6–8 semanas", presetType: "Sistema Web a Medida", title: "Agentes Autónomos IA", desc: "Agentes con herramientas, memoria semántica y supervisión humana sobre tus datos.", stack: "Python • LangGraph • Gemini • pgvector", summary: "Agentes empresariales conectados a tus bases de datos y APIs internas con RAG y guardrails.", deliverables: ["Indexación semántica de documentos y manuales corporativos", "Ejecución segura de herramientas y generación de reportes", "Panel de auditoría de conversaciones y métricas"] },
    { id: "wa-bot", cat: "ia", catLabel: "IA & Agentes", icon: "message-square", tier: "Modular", demand: 93, deploy: 3, cx: 3, cxText: "3 / 5 (Media)", deployText: "2–3 semanas", presetType: "Catálogo o Tienda Online", title: "Asistentes WhatsApp con IA", desc: "Atención comercial, cotizaciones y reservas 24/7 conectadas a tu catálogo y CRM.", stack: "Node.js • WhatsApp Cloud API • RAG", summary: "Canal comercial automatizado que responde consultas, muestra catálogo y deriva a asesores.", deliverables: ["Flujos conversacionales híbridos (IA + reglas de negocio)", "Sincronización con catálogo de productos, stock y reservas", "Bandeja de traspaso a asesor humano con historial"] },
    { id: "vision", cat: "ia", catLabel: "IA & Agentes", icon: "scan-eye", tier: "Enterprise", demand: 72, deploy: 9, cx: 4, cxText: "4 / 5 (Avanzada)", deployText: "7–9 semanas", presetType: "Sistema Web a Medida", title: "Visión Computacional & OCR", desc: "Lectura estructurada de comprobantes, control de calidad y validación nativa de imágenes.", stack: "C++17 • Python • OpenCV • ONNX", summary: "Extracción de datos desde vouchers, facturas y validación binaria de imágenes en alta velocidad.", deliverables: ["Motor nativo C++17 de validación y preprocesamiento", "Reconocimiento automático de campos en comprobantes", "API REST de baja latencia integrable con ERP o móvil"] },
    { id: "web", cat: "web", catLabel: "Apps & Web", icon: "globe", tier: "Modular", demand: 96, deploy: 4, cx: 2, cxText: "2 / 5 (Ágil)", deployText: "3–4 semanas", presetType: "Sitio Web / Portafolio", title: "Plataformas Web & Portales", desc: "Sitios corporativos, catálogos interactivos y portales de clientes de carga instantánea.", stack: "TypeScript • Next.js • Edge CDN", summary: "Sitios corporativos de alto impacto, catálogos y portales con rendimiento óptimo.", deliverables: ["Diseño UI/UX adaptable a celular, tablet y escritorio", "Optimización SEO técnico, Core Web Vitals y WCAG 2.1 AA", "Integración directa con WhatsApp y analítica"] },
    { id: "mobile", cat: "web", catLabel: "Apps & Web", icon: "smartphone", tier: "Enterprise", demand: 90, deploy: 10, cx: 4, cxText: "4 / 5 (Avanzada)", deployText: "8–10 semanas", presetType: "Sistema Web a Medida", title: "Apps Móviles Nativas", desc: "Aplicaciones iOS y Android con sincronización offline, notificaciones y pagos integrados.", stack: "Flutter • Kotlin • Swift • Firebase", summary: "Aplicaciones móviles para fuerza de ventas, reparto, operaciones en campo y clientes.", deliverables: ["App compilada para Android e iOS con modo offline-first", "Notificaciones push, geolocalización y captura de fotos", "Acompañamiento en publicación Google Play y App Store"] },
    { id: "iam", cat: "sec", catLabel: "Ciberseguridad", icon: "key-round", tier: "Enterprise", demand: 78, deploy: 5, cx: 4, cxText: "4 / 5 (Avanzada)", deployText: "4–5 semanas", presetType: "Panel Administrativo", title: "Identidad & Zero Trust (IAM)", desc: "Inicio de sesión único (SSO), MFA, permisos por turno/PIN y custodia de secretos.", stack: "Keycloak • OAuth 2.1 • Vault", summary: "Autenticación centralizada, doble factor y protección granular de rutas críticas.", deliverables: ["SSO y políticas de acceso por rol, sede u horario", "Bitácora inmutable de accesos y acciones sensibles", "Cifrado TLS 1.3 / AES-256 y rotación de credenciales"] },
    { id: "devsecops", cat: "sec", catLabel: "Ciberseguridad", icon: "radar", tier: "Modular", demand: 81, deploy: 3, cx: 4, cxText: "4 / 5 (Avanzada)", deployText: "2–3 semanas", presetType: "Rediseño o Mejoras", title: "Auditoría DevSecOps & Pentesting", desc: "Análisis SAST/DAST, endurecimiento de servidores y plan de remediación priorizado.", stack: "OWASP ASVS • SAST • DAST • SBOM", summary: "Evaluación exhaustiva de vulnerabilidades en aplicaciones web, APIs e infraestructura.", deliverables: ["Informe ejecutivo y técnico con severidad CVSS", "Pruebas sobre autenticación, lógica de negocio y APIs", "Acompañamiento técnico y re-verificación de parches"] },
  ];

  const ARCH_LAYERS = {
    clientes: { eyebrow: "CAPA 01 · CLIENTES", title: "Web Semántica, Apps Móviles Nativas y Canales WhatsApp", desc: "Interfaces rápidas optimizadas para Core Web Vitals, accesibilidad WCAG 2.1 AA, modo offline-first y pedidos directos por WhatsApp.", meta: "LCP < 1.2 s · WCAG 2.1 AA · Responsive" },
    edge: { eyebrow: "CAPA 02 · EDGE & WAF", title: "CDN Global, TLS 1.3 y Protección Anti-Abuso en el Borde", desc: "Terminación cifrada TLS 1.3, cabeceras de seguridad estrictas, rate limiting adaptativo y entrega perimetral de activos estáticos.", meta: "TLS 1.3 · HTTP/3 · DDoS Mitigation" },
    gateway: { eyebrow: "CAPA 03 · API GATEWAY", title: "Java 21 con Hilos Virtuales y Contratos REST Versionados", desc: "Enrutamiento concurrente sin bloqueo, validación estricta multipart/form-data, control de cuota por IP y trazabilidad OpenTelemetry.", meta: "SLA 99.99% · p95 38 ms · Zero Downtime" },
    servicios: { eyebrow: "CAPA 04 · SERVICIOS & IA", title: "Módulos Nativos C++17, Agentes IA y Lógica de Negocio", desc: "Validación binaria real de imágenes en C++17 (FNV-1a + firmas mágicas), pipelines RAG con Gemini y microservicios desacoplados.", meta: "C++17 Nativo · LangGraph · Contenedores" },
    datos: { eyebrow: "CAPA 05 · PERSISTENCIA", title: "PostgreSQL, SQLite Transaccional y Almacenamiento de Objetos", desc: "Esquemas normalizados con claves foráneas, respaldos automáticos cifrados y almacenamiento seguro de adjuntos y comprobantes.", meta: "ACID · Cifrado AES-256 · Backups Diarios" },
  };

  /* === Utilidades de Toast y Modales === */
  let toastTimer = 0;
  let lastFocused = null;

  function showToast(msg) {
    const t = document.getElementById("evm-toast");
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  }

  function openDialog(dlg) {
    if (!dlg) return;
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (typeof dlg.showModal === "function" && !dlg.open) dlg.showModal();
    else dlg.setAttribute("open", "");
  }

  function closeDialog(dlg) {
    if (!dlg) return;
    if (typeof dlg.close === "function" && dlg.open) dlg.close();
    else dlg.removeAttribute("open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
      lastFocused = null;
    }
  }

  /* === 1. Encabezado común, tema, menú móvil y buscador Ctrl+K === */
  function initSharedShell() {
    const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || "");
    document.querySelectorAll("[data-kbd-mod]").forEach((k) => { k.textContent = isMac ? "⌘" : "Ctrl"; });

    const themeBtn = document.getElementById("theme-toggle");
    const syncTheme = () => {
      const isConsole = document.documentElement.getAttribute("data-theme") === "console";
      if (themeBtn) themeBtn.setAttribute("aria-pressed", String(isConsole));
      window.dispatchEvent(new CustomEvent("evm:themechange", { detail: { isConsole } }));
    };
    syncTheme();

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "console" ? "studio" : "console";
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("evm-theme", next); } catch {}
        syncTheme();
        showToast(next === "console" ? "Modo Consola activado" : "Modo Studio activado");
      });
    }

    const nav = document.getElementById("nav");
    const navLinks = document.getElementById("nav-links");
    const navToggle = document.getElementById("nav-toggle");

    const setMenu = (open, focusBtn = false) => {
      if (!navLinks || !navToggle) return;
      navLinks.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
      navToggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}" aria-hidden="true"></i>`;
      refreshIcons(navToggle);
      if (!open && focusBtn) navToggle.focus();
    };

    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && navLinks.classList.contains("is-open")) setMenu(false, true); });
      document.addEventListener("click", (e) => { if (nav && !nav.contains(e.target) && navLinks.classList.contains("is-open")) setMenu(false); });
    }

    const yr = document.getElementById("year");
    if (yr) yr.textContent = String(new Date().getFullYear());

    // Buscador rápido global (Ctrl + K) disponible en cualquier página
    const cmdkDlg = document.createElement("dialog");
    cmdkDlg.id = "cmdk";
    cmdkDlg.className = "dialog dialog--cmdk";
    cmdkDlg.setAttribute("aria-label", "Buscador rápido de páginas y módulos");
    cmdkDlg.innerHTML = `
      <div class="cmdk">
        <div class="cmdk__search">
          <i data-lucide="search" aria-hidden="true"></i>
          <input id="cmdk-input" class="cmdk__input" type="text" placeholder="Ir a página o solicitar módulo…" autocomplete="off" />
          <kbd class="kbd">Esc</kbd>
        </div>
        <ul id="cmdk-list" class="cmdk__list" role="listbox"></ul>
        <p class="cmdk__foot"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navegar <kbd class="kbd">Enter</kbd> abrir <kbd class="kbd">Esc</kbd> cerrar</p>
      </div>`;
    document.body.appendChild(cmdkDlg);

    const commands = [
      { label: "Ir a Inicio", meta: "Página", href: resolvePath("index.html") },
      { label: "Ir a Nosotros & Arquitectura", meta: "Página", href: resolvePath("paginas/about.html") },
      { label: "Ir a Servicios & Soluciones", meta: "Página", href: resolvePath("paginas/servicios.html") },
      { label: "Ir a Casos en Producción", meta: "Página", href: resolvePath("paginas/casos.html") },
      { label: "Ir a Contacto / Iniciar Proyecto", meta: "Página", href: resolvePath("paginas/contacto.html") },
      { label: "Alternar Tema (Studio / Consola)", meta: "Acción", action: () => themeBtn && themeBtn.click() },
      ...MODULES.map((m) => ({ label: `Módulo: ${m.title}`, meta: m.catLabel, href: `${resolvePath("paginas/contacto.html")}?modulo=${m.id}` })),
    ];

    const cmdkInput = cmdkDlg.querySelector("#cmdk-input");
    const cmdkList = cmdkDlg.querySelector("#cmdk-list");
    let filtered = commands;
    let activeIdx = 0;

    const renderCmdk = (q = "") => {
      const term = q.trim().toLowerCase();
      filtered = commands.filter((c) => !term || c.label.toLowerCase().includes(term) || c.meta.toLowerCase().includes(term));
      activeIdx = 0;
      cmdkList.innerHTML = filtered.map((c, i) => `<li class="cmdk__item" role="option" aria-selected="${i === 0}" data-idx="${i}"><span>${escapeHtml(c.label)}</span><small>${escapeHtml(c.meta)}</small></li>`).join("");
    };

    const runCmd = (item) => {
      closeDialog(cmdkDlg);
      if (!item) return;
      if (item.action) item.action();
      else if (item.href) window.location.href = item.href;
    };

    const openCmdk = () => {
      renderCmdk("");
      cmdkInput.value = "";
      openDialog(cmdkDlg);
      cmdkInput.focus();
    };

    const trigger = document.getElementById("cmdk-trigger");
    if (trigger) trigger.addEventListener("click", openCmdk);
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (cmdkDlg.open) closeDialog(cmdkDlg);
        else openCmdk();
      }
    });
    cmdkInput.addEventListener("input", () => renderCmdk(cmdkInput.value));
    cmdkInput.addEventListener("keydown", (e) => {
      if (!filtered.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        activeIdx = (activeIdx + (e.key === "ArrowDown" ? 1 : -1) + filtered.length) % filtered.length;
        cmdkList.querySelectorAll(".cmdk__item").forEach((li, i) => li.setAttribute("aria-selected", String(i === activeIdx)));
      } else if (e.key === "Enter") {
        e.preventDefault();
        runCmd(filtered[activeIdx]);
      }
    });
    cmdkList.addEventListener("click", (e) => {
      const li = e.target.closest("[data-idx]");
      if (li) runCmd(filtered[Number(li.getAttribute("data-idx"))]);
    });

    document.querySelectorAll(".dialog").forEach((dlg) => {
      dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close-dialog]")) closeDialog(dlg); });
    });
  }

  /* === 2. Controlador de Inicio (index.html) === */
  function initHomePage() {
    const dash = document.getElementById("dash");
    const shot = document.getElementById("screen-shot");
    const tabs = Array.from(document.querySelectorAll("[data-screen]"));
    if (!tabs.length) return;

    const img = document.getElementById("hero-showcase-img");
    const label = document.getElementById("hero-showcase-label");
    const visit = document.getElementById("hero-screen-visit");

    const activate = (tab) => {
      const key = tab.getAttribute("data-screen");
      tabs.forEach((b) => {
        const on = b === tab;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
      });
      if (key === "dashboard") {
        if (dash) dash.hidden = false;
        if (shot) shot.hidden = true;
      } else {
        const proj = PROJECTS.find((p) => p.slug === key) || PROJECTS[0];
        if (img) { img.src = resolvePath(proj.imagenPrincipal); img.alt = `Vista real de ${proj.nombre}`; }
        if (label) label.textContent = `${proj.nombre} · ${proj.tipo}`;
        if (visit) visit.href = proj.urlPublica;
        if (dash) dash.hidden = true;
        if (shot) shot.hidden = false;
      }
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
        next.focus();
        activate(next);
      });
    });

    const rps = document.getElementById("kpi-rps");
    const lat = document.getElementById("kpi-lat");
    const bars = Array.from(document.querySelectorAll("#dash-bars span"));
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(() => {
        if (document.hidden || (dash && dash.hidden)) return;
        if (rps) rps.textContent = `${(11.8 + Math.random() * 1.4).toFixed(1)}k`;
        if (lat) lat.textContent = `${Math.round(34 + Math.random() * 7)} ms`;
        bars.forEach((b) => b.style.setProperty("--v", (0.3 + Math.random() * 0.65).toFixed(2)));
      }, 2200);
    }
  }

  /* === 3. Controlador de Nosotros & Arquitectura (about.html) === */
  function initAboutPage() {
    const buttons = Array.from(document.querySelectorAll("[data-arch-layer]"));
    if (buttons.length) {
      const eyebrow = document.getElementById("arch-layer-eyebrow");
      const title = document.getElementById("arch-layer-title");
      const desc = document.getElementById("arch-layer-desc");
      const meta = document.getElementById("arch-layer-meta");

      const select = (btn) => {
        const info = ARCH_LAYERS[btn.getAttribute("data-arch-layer")];
        if (!info) return;
        buttons.forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        if (eyebrow) eyebrow.textContent = info.eyebrow;
        if (title) title.textContent = info.title;
        if (desc) desc.textContent = info.desc;
        if (meta) meta.textContent = info.meta;
      };

      buttons.forEach((btn, i) => {
        btn.addEventListener("click", () => select(btn));
        btn.addEventListener("keydown", (e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          const next = buttons[(i + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length];
          next.focus();
          select(next);
        });
      });
    }

    const wpBtn = document.getElementById("btn-whitepaper");
    if (wpBtn) {
      wpBtn.addEventListener("click", () => {
        const content = [
          "====================================================================",
          "EVM SOFTWARE STUDIO — WHITEPAPER DE ARQUITECTURA & ESTÁNDARES (2026)",
          "====================================================================",
          "",
          "1. RESUMEN EJECUTIVO",
          "EVM Software Studio diseña, construye y opera plataformas empresariales",
          "bajo cuatro pilares: Soporte Crítico 24/7, Seguridad por Capas,",
          "Código Limpio con transferencia de IP e Infraestructura CI/CD.",
          "",
          "2. ARQUITECTURA DE REFERENCIA",
          "- Clientes: Web semántica (WCAG 2.1 AA), Apps móviles y WhatsApp.",
          "- Backend: Java 21 (Hilos Virtuales), Go, Node.js y validador C++17.",
          "- Persistencia: PostgreSQL, SQLite embebido y almacenamiento de objetos.",
          "",
          "3. CONTACTO: https://wa.me/51914662798 | https://github.com/ediczon2006",
        ].join("\n");
        const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = "EVM_Software_Studio_Whitepaper_2026.txt";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast("Whitepaper técnico descargado");
      });
    }
  }

  /* === 4. Controlador de Servicios & Soluciones (servicios.html) === */
  function initServicesPage() {
    const grid = document.getElementById("sol-grid");
    if (!grid) return;

    let activeFilter = "all";
    let sortBy = "demand";
    const countEl = document.getElementById("sol-count");
    const specModal = document.getElementById("spec-modal");

    const render = () => {
      const list = MODULES
        .filter((m) => activeFilter === "all" || m.cat === activeFilter)
        .sort((a, b) => {
          if (sortBy === "deploy") return a.deploy - b.deploy;
          if (sortBy === "complexity") return b.cx - a.cx;
          return b.demand - a.demand;
        });

      grid.innerHTML = list.map((m, idx) => {
        const dots = Array.from({ length: 5 }, (_, k) => `<i class="${k < m.cx ? "on" : ""}"></i>`).join("");
        return `
          <li class="sol-grid__item" data-reveal="scale" style="--d:${idx % 4}">
            <article class="sol-card tilt-3d">
              <div class="sol-card__head">
                <span class="sol-card__ico"><i data-lucide="${m.icon}" aria-hidden="true"></i></span>
                <span class="tier ${m.tier === "Enterprise" ? "tier--enterprise" : ""}">${m.tier}</span>
              </div>
              <p class="sol-card__cat">${escapeHtml(m.catLabel)}</p>
              <h2 class="sol-card__title">${escapeHtml(m.title)}</h2>
              <p class="sol-card__desc">${escapeHtml(m.desc)}</p>
              <p class="code-tag">${escapeHtml(m.stack)}</p>
              <div class="sol-card__meta">
                <span>~${m.deploy} sem</span>
                <span class="cx" role="img" aria-label="Complejidad ${m.cx} de 5">${dots}</span>
              </div>
              <button type="button" class="sol-card__cta" data-spec="${m.id}">Ver Especificaciones <span aria-hidden="true">→</span></button>
            </article>
          </li>`;
      }).join("");

      if (countEl) countEl.textContent = list.length === 1 ? "1 módulo disponible" : `${list.length} módulos disponibles`;
      refreshIcons(grid);
      if (window.EVM && window.EVM.observeReveals) window.EVM.observeReveals(grid);
    };

    render();

    const filters = document.getElementById("sol-filters");
    if (filters) {
      filters.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-sol-filter]");
        if (!btn) return;
        activeFilter = btn.getAttribute("data-sol-filter") || "all";
        filters.querySelectorAll("[data-sol-filter]").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        render();
      });
    }

    const sortSel = document.getElementById("sol-sort");
    if (sortSel) sortSel.addEventListener("change", () => { sortBy = sortSel.value; render(); });

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-spec]");
      if (!btn || !specModal) return;
      const mod = MODULES.find((m) => m.id === btn.getAttribute("data-spec"));
      if (!mod) return;
      document.getElementById("spec-cat").textContent = mod.catLabel;
      document.getElementById("spec-title").textContent = mod.title;
      document.getElementById("spec-summary").textContent = mod.summary;
      document.getElementById("spec-deploy").textContent = mod.deployText;
      document.getElementById("spec-cx").textContent = mod.cxText;
      document.getElementById("spec-demand").textContent = `${mod.demand}% índice`;
      document.getElementById("spec-tier").textContent = mod.tier;
      document.getElementById("spec-stack").textContent = mod.stack;
      document.getElementById("spec-deliverables").innerHTML = mod.deliverables.map((d) => `<li>${escapeHtml(d)}</li>`).join("");
      document.getElementById("spec-request").href = `contacto.html?modulo=${encodeURIComponent(mod.id)}`;
      openDialog(specModal);
    });
  }

  /* === 5. Controlador de Casos en Producción (casos.html) === */
  async function initCasesPage() {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    let projects = PROJECTS;
    let activeFilter = "all";

    if (!isStaticHost()) {
      try {
        const res = await fetch(`${ROOT}/api/proyectos`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.proyectos) && data.proyectos.length) {
            projects = data.proyectos.map((p) => ({
              ...p,
              cat: (PROJECTS.find((x) => x.slug === p.slug) || {}).cat || "web",
            }));
          }
        }
      } catch {}
    }

    const render = () => {
      const list = activeFilter === "all" ? projects : projects.filter((p) => (p.cat || "web") === activeFilter);
      grid.innerHTML = list.map((p, idx) => {
        const realIdx = projects.indexOf(p);
        const bullets = (p.aspectos || []).map((b) => `<li>${escapeHtml(b)}</li>`).join("");
        return `
          <article class="project-card tilt-3d" data-reveal="up" style="--d:${idx % 2}">
            <div class="project-card__chrome" aria-hidden="true">
              <div class="project-card__dots"><span></span><span></span><span></span></div>
              <span>${escapeHtml(p.nombre)}</span>
            </div>
            <div class="project-card__thumb" data-open-project="${realIdx}" role="button" tabindex="0" aria-label="Ampliar capturas de ${escapeHtml(p.nombre)}">
              <img src="${escapeHtml(resolvePath(p.imagenPrincipal))}" alt="Captura real del proyecto ${escapeHtml(p.nombre)}" width="1600" height="1000" loading="lazy" decoding="async" />
              <span class="project-card__badge">${(p.galeria || []).length} capturas reales</span>
            </div>
            <div class="project-card__body">
              <span class="project-card__type">${escapeHtml(p.tipo)}</span>
              <h2 class="project-card__title">${escapeHtml(p.nombre)}</h2>
              <p class="project-card__desc">${escapeHtml(p.descripcion)}</p>
              <ul class="project-card__list">${bullets}</ul>
              <div class="project-card__actions">
                <button type="button" class="btn btn--primary btn--sm" data-open-project="${realIdx}">Ver capturas</button>
                <a class="btn btn--secondary btn--sm" href="${escapeHtml(p.urlPublica)}" target="_blank" rel="noopener noreferrer">Visitar sitio ↗</a>
              </div>
            </div>
          </article>`;
      }).join("");
      if (window.EVM && window.EVM.observeReveals) window.EVM.observeReveals(grid);
    };

    render();

    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.getAttribute("data-filter") || "all";
        document.querySelectorAll("[data-filter]").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        render();
      });
    });

    const modal = document.getElementById("project-modal");
    const mainImg = document.getElementById("modal-main-img");
    const thumbs = document.getElementById("modal-thumbs");

    const openProj = (idx) => {
      const p = projects[idx];
      if (!p || !modal) return;
      document.getElementById("modal-type").textContent = p.tipo;
      document.getElementById("modal-title").textContent = p.nombre;
      document.getElementById("modal-desc").textContent = p.descripcion;
      document.getElementById("modal-btn-visit").href = p.urlPublica;
      document.getElementById("modal-btn-similar").href = `contacto.html?caso=${encodeURIComponent(p.slug)}`;

      const imgs = (p.galeria && p.galeria.length ? p.galeria : [p.imagenPrincipal]).map(resolvePath);
      mainImg.src = imgs[0];
      mainImg.alt = `Captura principal de ${p.nombre}`;
      thumbs.innerHTML = imgs.map((src, i) => `
        <button type="button" class="modal__thumb-btn ${i === 0 ? "is-active" : ""}" data-thumb-src="${escapeHtml(src)}" data-num="${i + 1}">
          <img src="${escapeHtml(src)}" alt="Miniatura ${i + 1} de ${escapeHtml(p.nombre)}" width="160" height="100" loading="lazy" decoding="async" />
        </button>`).join("");
      openDialog(modal);
    };

    grid.addEventListener("click", (e) => {
      const t = e.target.closest("[data-open-project]");
      if (t) openProj(Number(t.getAttribute("data-open-project")));
    });
    grid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const t = e.target.closest("[data-open-project]");
      if (t) { e.preventDefault(); openProj(Number(t.getAttribute("data-open-project"))); }
    });
    if (modal) {
      modal.addEventListener("click", (e) => {
        const b = e.target.closest("[data-thumb-src]");
        if (!b) return;
        thumbs.querySelectorAll(".modal__thumb-btn").forEach((x) => x.classList.remove("is-active"));
        b.classList.add("is-active");
        mainImg.src = b.getAttribute("data-thumb-src");
      });
    }
  }

  /* === 6. Controlador de Contacto, Imágenes, Ficha PNG y WhatsApp (contacto.html) === */
  async function initContactPage() {
    const form = document.getElementById("brief-form");
    if (!form) return;

    const clientName = document.getElementById("client-name");
    const businessSector = document.getElementById("business-sector");
    const clientContact = document.getElementById("client-contact");
    const timeline = document.getElementById("project-timeline");
    const description = document.getElementById("project-description");
    const preview = document.getElementById("message-preview");
    const feedback = document.getElementById("form-feedback");
    const dropzone = document.getElementById("dropzone");
    const imageInput = document.getElementById("image-input");
    const imageListWrap = document.getElementById("image-list-wrap");
    const imageCountLabel = document.getElementById("image-count-label");
    const imageGrid = document.getElementById("image-grid");
    const btnShareNative = document.getElementById("btn-share-native");
    const btnSubmit = document.getElementById("btn-submit-request");
    const pillText = document.querySelector("#server-status-pill .status-pill__text");

    let backendOnline = false;
    let images = [];

    // Precarga automática desde parámetros ?modulo= o ?caso=
    const params = new URLSearchParams(window.location.search);
    const modParam = params.get("modulo");
    const casoParam = params.get("caso");
    if (modParam) {
      const m = MODULES.find((x) => x.id === modParam);
      if (m) {
        const chk = form.querySelector(`input[name="projectType"][value="${m.presetType}"]`);
        if (chk) chk.checked = true;
        description.value = `Solicito el módulo "${m.title}" (${m.catLabel}) adaptado a mi empresa con...`;
      }
    } else if (casoParam) {
      const p = PROJECTS.find((x) => x.slug === casoParam);
      if (p) description.value = `Quiero un sistema o página similar a "${p.nombre}", adaptado a mi negocio con...`;
    }

    if (!isStaticHost()) {
      try {
        const r = await fetch(`${ROOT}/api/health`);
        if (r.ok) {
          const h = await r.json();
          backendOnline = Boolean(h.ok);
          if (pillText && backendOnline) pillText.textContent = h.cppAnalyzerReady ? "Sistema activo · Java + C++ + SQLite" : "Servidor activo · Java + SQLite";
        }
      } catch {}
    }

    const getChecked = (name) => Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((i) => i.value);

    const buildMsg = () => {
      const lines = [
        "Hola equipo de EVM Software Studio, quiero iniciar un proyecto de software.",
        "",
        `*Cliente / Empresa:* ${clientName.value.trim() || "[Tu nombre o empresa]"}`,
      ];
      if (businessSector.value.trim()) lines.push(`*Rubro:* ${businessSector.value.trim()}`);
      if (clientContact.value.trim()) lines.push(`*Contacto:* ${clientContact.value.trim()}`);
      const types = getChecked("projectType");
      const feats = getChecked("features");
      lines.push(`*Tipo de solución:* ${types.length ? types.join(", ") : "Por definir"}`);
      if (feats.length) lines.push(`*Funciones:* ${feats.join(", ")}`);
      lines.push(`*Plazo:* ${timeline.value}`);
      lines.push("", "*Qué necesito que haga:*", description.value.trim() || "[Describe aquí qué necesitas que haga tu software]");
      if (images.length) {
        lines.push("", `*Imágenes de referencia adjuntas (${images.length}):*`);
        images.forEach((im, i) => lines.push(`${i + 1}) ${im.file.name}${im.note.trim() ? ` - ${im.note.trim()}` : ""}`));
      }
      return lines.join("\n");
    };

    const updatePreview = () => {
      preview.textContent = buildMsg();
      if (btnShareNative) {
        try {
          btnShareNative.hidden = !(navigator.share && navigator.canShare && images.length && navigator.canShare({ files: images.map((x) => x.file) }));
        } catch { btnShareNative.hidden = true; }
      }
    };

    const showMsg = (txt, kind) => {
      feedback.textContent = txt;
      feedback.className = `feedback feedback--${kind}`;
      feedback.hidden = false;
    };

    const renderImages = () => {
      if (!images.length) {
        imageListWrap.hidden = true;
        imageGrid.innerHTML = "";
        updatePreview();
        return;
      }
      imageListWrap.hidden = false;
      imageCountLabel.textContent = images.length === 1 ? "1 imagen adjunta" : `${images.length} imágenes adjuntas`;
      imageGrid.innerHTML = images.map((item, idx) => `
        <li class="img-item">
          <div class="img-item__media">
            <img src="${item.previewUrl}" alt="Referencia ${escapeHtml(item.file.name)}" decoding="async" />
            <button type="button" class="img-item__remove" data-rm="${item.id}" aria-label="Quitar ${escapeHtml(item.file.name)}">✕</button>
          </div>
          <div class="img-item__body">
            <span class="img-item__name">${escapeHtml(item.file.name)}</span>
            <span class="img-item__size">${Math.max(1, Math.round(item.file.size / 1024))} KB</span>
            <input type="text" data-note="${idx}" value="${escapeHtml(item.note)}" placeholder="Nota (ej. Mi logo)" aria-label="Nota para ${escapeHtml(item.file.name)}" />
          </div>
        </li>`).join("");
      updatePreview();
    };

    const addFiles = (fileList) => {
      feedback.hidden = true;
      for (const file of Array.from(fileList || [])) {
        if (images.length >= CONFIG.maxImages) { showMsg(`Máximo ${CONFIG.maxImages} imágenes por pedido.`, "error"); break; }
        if (!file.type.startsWith("image/")) { showMsg(`"${file.name}" no es una imagen válida.`, "error"); continue; }
        if (file.size > CONFIG.maxFileSizeBytes) { showMsg(`"${file.name}" supera los 12 MB.`, "error"); continue; }
        images.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, file, previewUrl: URL.createObjectURL(file), note: "" });
      }
      renderImages();
    };

    const validate = () => {
      if (!clientName.value.trim()) { clientName.setAttribute("aria-invalid", "true"); showMsg("Ingresa tu nombre o el nombre de tu empresa.", "error"); clientName.focus(); return false; }
      clientName.removeAttribute("aria-invalid");
      if (!description.value.trim()) { description.setAttribute("aria-invalid", "true"); showMsg("Cuéntanos brevemente qué debe hacer tu software.", "error"); description.focus(); return false; }
      description.removeAttribute("aria-invalid");
      return true;
    };

    form.addEventListener("input", updatePreview);
    form.addEventListener("change", updatePreview);
    document.getElementById("btn-pick-images").addEventListener("click", (e) => { e.stopPropagation(); imageInput.click(); });
    dropzone.addEventListener("click", (e) => { if (!e.target.closest("button")) imageInput.click(); });
    dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("is-dragover"); });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("is-dragover"));
    dropzone.addEventListener("drop", (e) => { e.preventDefault(); dropzone.classList.remove("is-dragover"); addFiles(e.dataTransfer.files); });
    imageInput.addEventListener("change", () => { addFiles(imageInput.files); imageInput.value = ""; });
    document.addEventListener("paste", (e) => { if (e.clipboardData && e.clipboardData.files.length) addFiles(e.clipboardData.files); });

    imageGrid.addEventListener("click", (e) => {
      const rm = e.target.closest("[data-rm]");
      if (!rm) return;
      const idx = images.findIndex((x) => x.id === rm.getAttribute("data-rm"));
      if (idx >= 0) { URL.revokeObjectURL(images[idx].previewUrl); images.splice(idx, 1); renderImages(); }
    });
    imageGrid.addEventListener("input", (e) => {
      const inp = e.target.closest("[data-note]");
      if (inp && images[Number(inp.getAttribute("data-note"))]) { images[Number(inp.getAttribute("data-note"))].note = inp.value; updatePreview(); }
    });
    document.getElementById("btn-clear-images").addEventListener("click", () => {
      images.forEach((x) => URL.revokeObjectURL(x.previewUrl));
      images = [];
      renderImages();
    });

    document.getElementById("btn-copy-text").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(buildMsg()); showToast("Mensaje copiado al portapapeles"); } catch {}
    });

    btnSubmit.addEventListener("click", async () => {
      feedback.hidden = true;
      if (!validate()) return;
      btnSubmit.disabled = true;
      try {
        if (backendOnline) {
          const fd = new FormData();
          fd.append("clientName", clientName.value.trim());
          fd.append("businessSector", businessSector.value.trim());
          fd.append("clientContact", clientContact.value.trim());
          fd.append("timeline", timeline.value);
          fd.append("description", description.value.trim());
          getChecked("projectType").forEach((v) => fd.append("projectType", v));
          getChecked("features").forEach((v) => fd.append("features", v));
          images.forEach((im) => { fd.append("images", im.file, im.file.name); fd.append("imageNotes", im.note.trim()); });

          const res = await fetch(`${ROOT}/api/solicitudes`, { method: "POST", body: fd });
          const data = await res.json();
          if (!res.ok || !data.ok) throw new Error(data.error || "Error al registrar solicitud.");
          document.getElementById("saved-code").textContent = data.codigo;
          document.getElementById("saved-detail-text").textContent = "Solicitud e imágenes registradas en SQLite.";
          document.getElementById("saved-wa-link").href = data.whatsappUrl;
          document.getElementById("saved-view-link").href = data.viewUrl;
          document.getElementById("saved-view-link").hidden = false;
          document.getElementById("saved-result-box").hidden = false;
          window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
        } else {
          const msg = buildMsg();
          const waUrl = `https://wa.me/${CONFIG.whatsappDigits}?text=${encodeURIComponent(msg)}`;
          if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(msg).catch(() => {});
          document.getElementById("saved-code").textContent = "ENVÍO-DIRECTO";
          document.getElementById("saved-detail-text").textContent = images.length ? "Se abrió WhatsApp con tu mensaje. Adjunta tus imágenes o descarga la Ficha PNG abajo." : "Se abrió WhatsApp con tu mensaje listo.";
          document.getElementById("saved-wa-link").href = waUrl;
          document.getElementById("saved-view-link").hidden = true;
          document.getElementById("saved-result-box").hidden = false;
          showMsg("Redirigiendo a WhatsApp...", "ok");
          window.open(waUrl, "_blank", "noopener,noreferrer");
        }
      } catch (err) {
        showMsg(err.message || "Error al procesar la solicitud.", "error");
      } finally {
        btnSubmit.disabled = false;
      }
    });

    if (btnShareNative) {
      btnShareNative.addEventListener("click", async () => {
        if (!validate()) return;
        try { await navigator.share({ title: "Solicitud · EVM Software Studio", text: buildMsg(), files: images.map((x) => x.file) }); } catch {}
      });
    }

    document.getElementById("btn-download-sheet").addEventListener("click", async () => {
      if (!validate()) return;
      try {
        const loaded = await Promise.all(images.map((item) => new Promise((res, rej) => {
          const im = new Image();
          im.onload = () => res(im);
          im.onerror = rej;
          im.src = item.previewUrl;
        })));
        const width = 1080, pad = 56, thumbW = (width - pad * 2 - 20) / 2, thumbH = 220;
        const rows = loaded.length ? Math.ceil(loaded.length / 2) : 0;
        const words = description.value.trim().split(/\s+/);
        const descLines = [];
        let cur = "";
        words.forEach((w) => {
          const next = cur ? `${cur} ${w}` : w;
          if (next.length <= 76) cur = next;
          else { if (cur) descLines.push(cur); cur = w; }
        });
        if (cur) descLines.push(cur);
        const lines = descLines.slice(0, 10);
        const height = Math.max(720, 380 + lines.length * 28 + rows * (thumbH + 54));

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
        ctx.fillText(clientName.value.trim().slice(0, 42), pad, 114);
        ctx.fillStyle = "#b3bfd4";
        ctx.font = "22px Segoe UI, sans-serif";
        const types = getChecked("projectType");
        ctx.fillText(`Solución: ${(types.length ? types.join(", ") : "Por definir").slice(0, 68)}`, pad, 156);

        let y = 192;
        ctx.fillStyle = "#0e1522";
        ctx.fillRect(pad, y, width - pad * 2, lines.length * 28 + 40);
        ctx.fillStyle = "#f2f6fb";
        ctx.font = "20px Segoe UI, sans-serif";
        lines.forEach((l, i) => ctx.fillText(l, pad + 20, y + 34 + i * 28));
        y += lines.length * 28 + 68;

        loaded.forEach((im, i) => {
          const x = pad + (i % 2) * (thumbW + 20);
          const ty = y + Math.floor(i / 2) * (thumbH + 50);
          ctx.fillStyle = "#0e1522";
          ctx.fillRect(x, ty, thumbW, thumbH);
          const sc = Math.min(thumbW / im.width, thumbH / im.height);
          ctx.drawImage(im, x + (thumbW - im.width * sc) / 2, ty + (thumbH - im.height * sc) / 2, im.width * sc, im.height * sc);
          ctx.fillStyle = "#b3bfd4";
          ctx.font = "16px Segoe UI, sans-serif";
          ctx.fillText(`${i + 1}. ${(images[i].note.trim() || images[i].file.name).slice(0, 38)}`, x, ty + thumbH + 24);
        });

        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "ficha_solicitud_evm.png";
        a.click();
        showMsg("Ficha PNG descargada correctamente.", "ok");
      } catch {
        showMsg("No se pudo generar la ficha PNG.", "error");
      }
    });

    updatePreview();
  }

  window.EVM = Object.assign(window.EVM || {}, { resolvePath, refreshIcons });

  initSharedShell();
  initHomePage();
  initAboutPage();
  initServicesPage();
  initCasesPage();
  initContactPage();
  refreshIcons();
  window.addEventListener("load", () => refreshIcons());
})();
