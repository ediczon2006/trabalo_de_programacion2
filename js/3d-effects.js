/**
 * ==========================================================================
 * EVM SOFTWARE STUDIO — EFECTOS 3D CSS Y FONDO THREE.JS (3d-effects.js)
 * Tarjetas 3D reactivas al mouse, estación holográfica y escena WebGL ligera.
 * ==========================================================================
 */

(function () {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* 1. Estación Holográfica 3D y Nodos Satelitales en Inicio */
  function initHeroWorkstation3D() {
    const stage = document.getElementById("hero-stage");
    if (!stage || REDUCED || !FINE_POINTER) return;

    const tiltNode = stage.querySelector("[data-tilt]");
    const satellites = Array.from(stage.querySelectorAll(".sat"));
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

    const step = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      if (tiltNode) {
        tiltNode.style.setProperty("--rx", `${(5 - cy * 7).toFixed(2)}deg`);
        tiltNode.style.setProperty("--ry", `${(-7 + cx * 9).toFixed(2)}deg`);
      }
      satellites.forEach((sat) => {
        const depth = parseFloat(sat.getAttribute("data-depth") || "1");
        sat.style.setProperty("--px", `${(cx * 18).toFixed(1)}px`);
        sat.style.setProperty("--py", `${(cy * 14).toFixed(1)}px`);
        sat.style.setProperty("--depth", String(depth));
      });
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(step);
      else raf = 0;
    };

    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(step);
    });

    stage.addEventListener("pointerleave", () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(step);
    });
  }

  /* 2. Inclinación 3D Multicapa en Tarjetas (.tilt-3d) */
  function initCards3DTilt() {
    if (REDUCED || !FINE_POINTER) return;

    let activeCard = null;
    let pending = false;
    let rx = 0, ry = 0, mx = 50, my = 50;

    const reset = (card) => {
      if (!card) return;
      card.classList.remove("is-tilting");
      card.style.removeProperty("--rx");
      card.style.removeProperty("--ry");
    };

    const flush = () => {
      pending = false;
      if (!activeCard) return;
      activeCard.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      activeCard.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      activeCard.style.setProperty("--mx", `${mx.toFixed(1)}%`);
      activeCard.style.setProperty("--my", `${my.toFixed(1)}%`);
    };

    document.addEventListener("pointermove", (e) => {
      const card = e.target instanceof Element ? e.target.closest(".tilt-3d") : null;
      if (activeCard && activeCard !== card) reset(activeCard);
      activeCard = card;
      if (!card) return;
      card.classList.add("is-tilting");

      const r = card.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rx = (0.5 - py) * 10;
      ry = (px - 0.5) * 12;
      mx = px * 100;
      my = py * 100;

      if (!pending) {
        pending = true;
        requestAnimationFrame(flush);
      }
    }, { passive: true });

    document.addEventListener("pointerout", (e) => {
      if (activeCard && (!e.relatedTarget || !activeCard.contains(e.relatedTarget))) {
        reset(activeCard);
        activeCard = null;
      }
    });
  }

  /* 3. Fondo 3D Interactivo Ligero con Three.js (compatible con celular) */
  async function initThreeScene() {
    const canvas = document.getElementById("evm-bg-3d");
    if (!canvas || REDUCED || window.location.protocol === "file:") return;
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
      group.position.x = isMobile ? 0 : 2.3;
      scene.add(group);

      const isConsole = document.documentElement.getAttribute("data-theme") === "console";
      const outerMat = new THREE.MeshBasicMaterial({ color: isConsole ? 0x00b4d8 : 0x0066ff, wireframe: true, transparent: true, opacity: 0.13 });
      const innerMat = new THREE.MeshBasicMaterial({ color: isConsole ? 0x38f9d7 : 0x00d2ff, wireframe: true, transparent: true, opacity: 0.22 });
      const ringMat  = new THREE.MeshBasicMaterial({ color: isConsole ? 0x38f9d7 : 0x00d2ff, transparent: true, opacity: 0.18 });

      const outerMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.8, 1), outerMat);
      const innerMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.45, 0), innerMat);
      const ringMesh  = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.015, 8, isMobile ? 48 : 84), ringMat);
      ringMesh.rotation.x = Math.PI * 0.36;
      group.add(outerMesh, innerMesh, ringMesh);

      const count = isMobile ? 55 : 135;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 19;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 7;
      }
      const ptsGeo = new THREE.BufferGeometry();
      ptsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const ptsMat = new THREE.PointsMaterial({ color: isConsole ? 0x38f9d7 : 0x00d2ff, size: isMobile ? 0.055 : 0.048, transparent: true, opacity: 0.4 });
      const cloud = new THREE.Points(ptsGeo, ptsMat);
      scene.add(cloud);

      window.addEventListener("evm:themechange", (ev) => {
        const c = Boolean(ev.detail && ev.detail.isConsole);
        outerMat.color.setHex(c ? 0x00b4d8 : 0x0066ff);
        innerMat.color.setHex(c ? 0x38f9d7 : 0x00d2ff);
        ringMat.color.setHex(c ? 0x38f9d7 : 0x00d2ff);
        ptsMat.color.setHex(c ? 0x38f9d7 : 0x00d2ff);
      });

      let px = 0, py = 0, scrollRot = 0;
      if (!isMobile) {
        window.addEventListener("pointermove", (e) => {
          px = (e.clientX / window.innerWidth - 0.5) * 0.45;
          py = (e.clientY / window.innerHeight - 0.5) * 0.32;
        }, { passive: true });
      }
      window.addEventListener("scroll", () => { scrollRot = (window.scrollY || 0) * 0.0006; }, { passive: true });

      window.addEventListener("resize", () => {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.position.z = w < 768 ? 10.8 : 8.8;
        group.position.x = w < 768 ? 0 : 2.3;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }, { passive: true });

      let raf = 0;
      const animate = () => {
        if (document.hidden) { raf = 0; return; }
        outerMesh.rotation.y += 0.0017;
        outerMesh.rotation.x += 0.0008;
        innerMesh.rotation.y -= 0.003;
        innerMesh.rotation.z += 0.0014;
        ringMesh.rotation.z  += 0.0022;
        cloud.rotation.y = scrollRot * 0.5 + performance.now() * 0.00004;
        group.position.y += (py * -0.9 - group.position.y) * 0.04;
        group.rotation.y += (px + scrollRot - group.rotation.y) * 0.04;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };

      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && !raf) raf = requestAnimationFrame(animate);
      });

      renderer.render(scene, camera);
      canvas.classList.add("is-active");
      raf = requestAnimationFrame(animate);
    } catch {
      canvas.hidden = true;
    }
  }

  initHeroWorkstation3D();
  initCards3DTilt();

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => initThreeScene(), { timeout: 1200 });
  } else {
    setTimeout(initThreeScene, 400);
  }
})();
