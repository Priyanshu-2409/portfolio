"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Scroll-scrubbed reveal manager: one rAF-throttled scroll listener drives
 *  every registered element. Each gets a --sp CSS var (0..1) mapping how far
 *  it has entered the viewport — CSS turns that into translate/scale/fade.
 *  Scrubbing is reversible: scroll back up and sections sink away again,
 *  which is what makes the page read as a continuous journey. */

type Entry = { el: HTMLElement };
const entries = new Set<Entry>();
let listening = false;
let raf = 0;
let reduced = false;

function updateAll() {
  raf = 0;
  const vh = window.innerHeight;
  entries.forEach(({ el }) => {
    const rect = el.getBoundingClientRect();
    if (rect.top > vh + 80 || rect.bottom < -80) return; // far off-screen
    // 0 when the element's top crosses the viewport bottom,
    // 1 once it has risen 45% of the way up the screen.
    const p = Math.min(Math.max((vh - rect.top) / (vh * 0.45), 0), 1);
    el.style.setProperty("--sp", p.toFixed(4));
  });
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(updateAll);
}

function ensureListener() {
  if (listening || typeof window === "undefined") return;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return; // CSS forces everything visible; nothing to drive
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    ensureListener();
    if (reduced) {
      el.style.setProperty("--sp", "1");
      return;
    }
    const entry: Entry = { el };
    entries.add(entry);
    onScroll(); // position correctly on mount (above-the-fold content)
    return () => {
      entries.delete(entry);
    };
  }, []);

  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}
