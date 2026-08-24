"use client";

import { useEffect, useRef } from "react";

/** WebGL fluid-simulation cursor trail (desktop only).
 *  Mounts a fixed, pointer-events-none canvas over the page and injects
 *  splats manually from window mousemove — the overlay can therefore never
 *  block a click. Skipped entirely on touch devices, low-end hardware,
 *  reduced-motion preference, or missing WebGL. */
export default function FluidCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Gate: fine pointer (mouse/trackpad), motion allowed, capable device, WebGL
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4) return;
    try {
      const probe = document.createElement("canvas");
      if (!probe.getContext("webgl2") && !probe.getContext("webgl")) return;
    } catch {
      return;
    }

    type Sim = {
      start: () => void;
      stop: () => void;
      setConfig: (c: Record<string, unknown>) => void;
      splatAtLocation: (x: number, y: number, dx: number, dy: number, color?: string) => void;
    };

    let sim: Sim | null = null;
    let cancelled = false;
    let lastX = -1;
    let lastY = -1;
    let raf = 0;
    let pending: { x: number; y: number; dx: number; dy: number } | null = null;

    const flush = () => {
      raf = 0;
      if (!sim || !pending) return;
      const canvas = el.querySelector("canvas");
      // Quirk in the lib: x is divided by buffer width, y by client height —
      // so x needs scaling into drawing-buffer pixels, y stays in CSS pixels.
      const scaleX = canvas ? canvas.width / (canvas.clientWidth || 1) : 1;
      sim.splatAtLocation(pending.x * scaleX, pending.y, pending.dx, pending.dy);
      pending = null;
    };

    const onMove = (e: MouseEvent) => {
      if (!sim) return;
      if (lastX < 0) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (dx * dx + dy * dy < 9) return; // ignore sub-3px jitter
      lastX = e.clientX;
      lastY = e.clientY;
      pending = {
        x: e.clientX,
        y: e.clientY,
        dx: Math.max(-800, Math.min(800, dx * 14)),
        dy: Math.max(-800, Math.min(800, dy * 14)),
      };
      if (!raf) raf = requestAnimationFrame(flush);
    };

    import("webgl-fluid-enhanced")
      .then(({ default: WebGLFluidEnhanced }) => {
        if (cancelled) return;
        sim = new WebGLFluidEnhanced(el) as unknown as Sim;
        sim.setConfig({
          transparent: true,
          colorful: false,
          colorPalette: ["#7c9bdb", "#5b82c7", "#a8bee8", "#1b2a4a"],
          simResolution: 128,
          dyeResolution: 512,
          densityDissipation: 4.2, // trails fade fast — a garnish, not a lightshow
          velocityDissipation: 2.4,
          curl: 26, // the liquid swirl
          splatRadius: 0.1,
          pressureIterations: 16,
          shading: true,
          bloom: false,
          sunrays: false,
        });
        sim.start();
        el.classList.add("on");
        window.addEventListener("mousemove", onMove, { passive: true });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
      try {
        sim?.stop();
      } catch {}
      el.classList.remove("on");
      el.replaceChildren();
    };
  }, []);

  return <div ref={ref} className="fluid-cursor" aria-hidden="true" />;
}