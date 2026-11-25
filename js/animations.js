/**
 * ==========================================================================
 * EVM SOFTWARE STUDIO — MOTOR DE ANIMACIONES Y TRANSICIONES (animations.js)
 * IntersectionObserver, contadores, progreso de scroll y transición de página.
 * ==========================================================================
 */

(function () {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. IntersectionObserver para animar elementos al hacer scroll */
  let revealObserver = null;
  if ("IntersectionObserver" in window && !REDUCED) {
    revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -36px 0px" }
    );
  }

  function observeReveals(scope = document) {
    const nodes = scope.querySelectorAll("[data-reveal]:not(.is-visible)");
    nodes.forEach((node) => {
      if (revealObserver) revealObserver.observe(node);
      else node.classList.add("is-visible");
    });
  }

  /* 2. Contadores numéricos animados */
  function initCounters() {
    document.querySelectorAll("[data-count-to]").forEach((node) => {
      const target = Number(node.getAttribute("data-count-to") || "0");
      if (!target || REDUCED) {
        node.textContent = String(target);
        return;
      }
      const start = performance.now();
      const duration = 950;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* 3. Barra de progreso de lectura, navbar sticky y botón volver arriba */
  function initScrollUI() {
    const nav = document.getElementById("nav");
    const bar = document.getElementById("scroll-progress");
    const topBtn = document.getElementById("back-to-top");

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle("is-scrolled", y > 18);
      if (topBtn) topBtn.hidden = y < 460;
      if (bar) {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        bar.style.setProperty("--scroll-pct", Math.min(1, Math.max(0, y / max)).toFixed(4));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    if (topBtn) {
      topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
      });
    }
  }

  /* 4. Botones magnéticos sutiles en punteros finos */
  function initMagneticButtons() {
    if (REDUCED || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
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

  /* 5. Transición suave entre páginas HTML individuales */
  function initPageTransitions() {
    if (REDUCED) return;
    document.addEventListener("click", (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const rawHref = link.getAttribute("href") || "";
      if (!rawHref || rawHref.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

      try {
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin || url.href === window.location.href) return;
        e.preventDefault();
        document.body.classList.add("is-leaving");
        setTimeout(() => { window.location.href = url.href; }, 170);
      } catch {}
    });

    window.addEventListener("pageshow", () => {
      document.body.classList.remove("is-leaving");
    });
  }

  window.EVM = Object.assign(window.EVM || {}, { observeReveals });

  observeReveals(document);
  initCounters();
  initScrollUI();
  initMagneticButtons();
  initPageTransitions();
})();
