/**
 * Logica de cliente para el portafolio real y recepcion de solicitudes + imagenes.
 * Conecta con el backend Java + C++ + SQLite (/api/proyectos, /api/solicitudes)
 * y conserva respaldo estatico funcional para GitHub Pages si no hay servidor activo.
 */
const CONFIG = {
  whatsappCountryCode: "51",
  whatsappNumber: "914662798",
  maxImages: 8,
  maxFileSizeBytes: 12 * 1024 * 1024,
  apiBaseUrl: "", // Vacio = mismo origen; configurable si se publica frontend estatico aparte
};

// Solo los 5 proyectos reales verificados (sin agregar C++ ni Java dentro del portafolio).
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

const state = {
  projects: FALLBACK_PROJECTS,
  backendOnline: false,
  images: [], // { id, file, previewUrl, note }
  activeModalProject: null,
};

const el = {
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
  const desc = el.description.value.trim() || "[Describe aqui que necesitas que haga tu software]";

  const lines = [
    "Hola, quiero solicitar el desarrollo de un software.",
    "",
    `*Cliente / Empresa:* ${name}`,
  ];
  if (sector) lines.push(`*Rubro:* ${sector}`);
  if (contact) lines.push(`*Contacto:* ${contact}`);
  lines.push(`*Tipo de solucion:* ${types.length ? types.join(", ") : "Por definir"}`);
  if (features.length) lines.push(`*Funciones:* ${features.join(", ")}`);
  lines.push(`*Plazo:* ${timeline}`);
  lines.push("", "*Que necesito que haga:*", desc);

  if (state.images.length) {
    lines.push("", `*Imagenes de referencia adjuntas (${state.images.length}):*`);
    state.images.forEach((img, idx) => {
      const notePart = img.note.trim() ? ` - ${img.note.trim()}` : "";
      lines.push(`${idx + 1}) ${img.file.name}${notePart}`);
    });
  }
  return lines.join("\n");
}

function updatePreview() {
  el.preview.textContent = buildPreviewMessage();
  updateNativeShareVisibility();
}

function updateNativeShareVisibility() {
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

function renderPortfolio(projects) {
  if (!projects.length) {
    el.portfolioGrid.innerHTML = "<p>No hay proyectos disponibles por el momento.</p>";
    return;
  }
  el.portfolioGrid.innerHTML = projects
    .map((p, index) => {
      const bullets = (p.aspectos || [])
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");
      const count = (p.galeria || []).length;
      return `
        <article class="project-card">
          <div class="project-card__thumb" data-open-project="${index}" role="button" tabindex="0" aria-label="Ampliar capturas de ${escapeHtml(p.nombre)}">
            <img src="${escapeHtml(p.imagenPrincipal)}" alt="Captura real de ${escapeHtml(p.nombre)}" loading="lazy" />
            <span class="project-card__badge">${count} capturas reales</span>
          </div>
          <div class="project-card__body">
            <span class="project-card__type">${escapeHtml(p.tipo)}</span>
            <h3 class="project-card__title">${escapeHtml(p.nombre)}</h3>
            <p class="project-card__desc">${escapeHtml(p.descripcion)}</p>
            <ul class="project-card__list">${bullets}</ul>
            <div class="project-card__actions">
              <button type="button" class="btn btn--primary btn--sm" data-open-project="${index}">Ver capturas</button>
              <a class="btn btn--secondary btn--sm" href="${escapeHtml(p.urlPublica)}" target="_blank" rel="noopener noreferrer">Visitar pagina</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function openProjectModal(index) {
  const proj = state.projects[index];
  if (!proj) return;
  state.activeModalProject = proj;

  el.modalType.textContent = proj.tipo;
  el.modalTitle.textContent = proj.nombre;
  el.modalDesc.textContent = proj.descripcion;
  el.modalBtnVisit.href = proj.urlPublica;

  const imgs = proj.galeria && proj.galeria.length ? proj.galeria : [proj.imagenPrincipal];
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

  el.modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function setModalImage(src, altText) {
  el.modalMainImg.src = src;
  el.modalMainImg.alt = altText || "Captura de proyecto";
}

function closeModal() {
  el.modal.hidden = true;
  document.body.style.overflow = "";
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
      <div class="img-item" data-img-id="${item.id}">
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
            placeholder="Nota (ej. Mi logo, diseño)"
          />
        </div>
      </div>
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
  const originalLabel = el.btnSubmit.textContent;
  el.btnSubmit.textContent = "Procesando y guardando...";

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
      el.savedDetailText.textContent = data.imagenes && data.imagenes.length
        ? `Se registraron ${data.imagenes.length} imagen(es) en base de datos. Ya puedes abrir WhatsApp con el enlace directo.`
        : "Tu solicitud fue guardada en base de datos.";
      el.savedWaLink.href = data.whatsappUrl;
      el.savedViewLink.href = data.viewUrl;
      el.savedViewLink.hidden = false;
      el.savedBox.hidden = false;

      showFeedback("Solicitud guardada correctamente. Abriendo WhatsApp...", "ok");
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    } else {
      // Modo estatico de respaldo cuando no hay servidor Java conectado
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

      showFeedback("Redirigiendo a WhatsApp (914 662 798)...", "ok");
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  } catch (err) {
    showFeedback(err.message || "Ocurrió un error al enviar la solicitud.", "error");
  } finally {
    el.btnSubmit.disabled = false;
    el.btnSubmit.textContent = originalLabel;
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
      title: "Solicitud de proyecto de software",
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

async function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function downloadVisualSheet() {
  clearFeedback();
  if (!validateForm()) return;

  const width = 1080;
  const pad = 56;
  const loadedImgs = await Promise.all(state.images.map((item) => loadImageElement(item.previewUrl)));

  // Calcula altura dinamica segun cantidad de imagenes
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

  ctx.fillStyle = "#0b1324";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#93c5fd";
  ctx.font = "bold 20px Segoe UI, sans-serif";
  ctx.fillText("SOLICITUD DE SOFTWARE · WHATSAPP 914 662 798", pad, 64);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px Segoe UI, sans-serif";
  ctx.fillText(el.clientName.value.trim().slice(0, 40), pad, 114);

  const types = getCheckedValues("projectType");
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "22px Segoe UI, sans-serif";
  ctx.fillText(`Solucion: ${(types.length ? types.join(", ") : "Por definir").slice(0, 68)}`, pad, 156);

  const features = getCheckedValues("features");
  let y = 194;
  if (features.length) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "19px Segoe UI, sans-serif";
    ctx.fillText(`Funciones: ${features.join(" · ").slice(0, 80)}`, pad, y);
    y += 38;
  }

  ctx.fillStyle = "#16223d";
  ctx.fillRect(pad, y, width - pad * 2, descLines.length * 28 + 44);
  ctx.fillStyle = "#e2e8f0";
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

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(x, ty, thumbW, thumbH);
    const scale = Math.min(thumbW / im.width, thumbH / im.height);
    const dw = im.width * scale;
    const dh = im.height * scale;
    ctx.drawImage(im, x + (thumbW - dw) / 2, ty + (thumbH - dh) / 2, dw, dh);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "16px Segoe UI, sans-serif";
    const label = state.images[idx].note.trim() || state.images[idx].file.name;
    ctx.fillText(`${idx + 1}. ${label.slice(0, 38)}`, x, ty + thumbH + 24);
  });

  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "ficha_solicitud_software.png";
  a.click();
  showFeedback("Ficha PNG descargada. Puedes adjuntarla directo en WhatsApp.", "ok");
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

async function initBackendConnection() {
  try {
    const [healthRes, projRes] = await Promise.all([
      fetch(apiUrl("/api/health")),
      fetch(apiUrl("/api/proyectos")),
    ]);
    if (healthRes.ok) {
      const h = await healthRes.json();
      state.backendOnline = Boolean(h.ok);
      el.serverStatusPill.textContent = h.cppAnalyzerReady
        ? "Java + C++ + SQLite activos"
        : "Servidor Java + SQLite activo";
      el.serverStatusPill.className = "status-pill status-pill--ok";
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
    el.serverStatusPill.textContent = "Modo estatico (WhatsApp directo)";
    el.serverStatusPill.className = "status-pill status-pill--static";
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
  el.dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.imageInput.click();
    }
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
    if (trigger) {
      openProjectModal(Number(trigger.getAttribute("data-open-project")));
    }
  });

  el.modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close-modal")) {
      closeModal();
      return;
    }
    const thumb = e.target.closest("[data-thumb-src]");
    if (thumb) {
      el.modalThumbs.querySelectorAll(".modal__thumb-btn").forEach((b) => b.classList.remove("is-active"));
      thumb.classList.add("is-active");
      setModalImage(thumb.getAttribute("data-thumb-src"), el.modalTitle.textContent);
    }
  });

  el.modalBtnSimilar.addEventListener("click", () => {
    if (state.activeModalProject && !el.description.value.trim()) {
      el.description.value = `Quiero un sistema o pagina similar a "${state.activeModalProject.nombre}", adaptado a mi negocio con...`;
      updatePreview();
    }
    closeModal();
    document.getElementById("solicitud").scrollIntoView({ behavior: "smooth" });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !el.modal.hidden) closeModal();
  });
}

bindEvents();
updatePreview();
initBackendConnection();
