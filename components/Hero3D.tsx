"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";

// 3D bundle loads after first paint, never server-rendered.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

/** Static SVG that echoes the network-knot aesthetic. Used when WebGL is
 *  unavailable, the device is low-end, or rendering fails. */
function StaticFallback() {
  return (
    <div className="hero-fallback">
      <svg viewBox="0 0 400 340" role="img" aria-label="Abstract network diagram: a wireframe knot connected to floating points" fill="none">
        <g stroke="#7c9bdb" strokeOpacity="0.22">
          <line x1="200" y1="170" x2="60" y2="70" />
          <line x1="200" y1="170" x2="340" y2="60" />
          <line x1="200" y1="170" x2="352" y2="230" />
          <line x1="200" y1="170" x2="70" y2="270" />
          <line x1="60" y1="70" x2="340" y2="60" />
          <line x1="352" y1="230" x2="70" y2="270" />
        </g>
        <g stroke="#7c9bdb" strokeOpacity="0.55" strokeWidth="1.4">
          <ellipse cx="200" cy="170" rx="105" ry="64" transform="rotate(-24 200 170)" />
          <ellipse cx="200" cy="170" rx="105" ry="64" transform="rotate(36 200 170)" />
          <ellipse cx="200" cy="170" rx="105" ry="64" transform="rotate(96 200 170)" />
        </g>
        <ellipse cx="200" cy="170" rx="118" ry="76" transform="rotate(6 200 170)" stroke="#1b2a4a" strokeWidth="10" strokeOpacity="0.9" />
        <g fill="#7c9bdb">
          <circle cx="60" cy="70" r="4" />
          <circle cx="340" cy="60" r="4" />
          <circle cx="352" cy="230" r="4" />
          <circle cx="70" cy="270" r="4" />
        </g>
      </svg>
    </div>
  );
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticFallback /> : this.props.children;
  }
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function isLowEnd(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;
  return cores <= 4 || mem <= 4;
}

export default function Hero3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "fallback">("pending");
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  useEffect(() => {
    if (!webglAvailable()) {
      setMode("fallback");
      return;
    }
    const low = isLowEnd();
    setQuality(low ? "low" : "high");
    setDpr([1, Math.min(window.devicePixelRatio || 1, low ? 1.5 : 2)]);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);

    setMode("3d");
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause the render loop when the hero is off-screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || mode !== "3d") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  return (
    <div
      ref={wrapRef}
      className="hero-visual"
      role="img"
      aria-label="Abstract rotating network of connected geometric shapes"
    >
      {mode === "fallback" && <StaticFallback />}
      {mode === "3d" && (
        <div className={`scene ${ready ? "ready" : ""}`} aria-hidden="true">
          <SceneErrorBoundary>
            <Scene
              quality={quality}
              animate={visible && !reduced}
              dpr={dpr}
              onReady={() => setReady(true)}
            />
          </SceneErrorBoundary>
        </div>
      )}
    </div>
  );
}
