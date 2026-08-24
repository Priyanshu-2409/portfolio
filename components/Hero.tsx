"use client";

import { useEffect, useRef, useState } from "react";
import content from "@/content/content.json";
import Hero3D from "./Hero3D";
import { scrollState } from "@/lib/scroll";

/** Types the positioning line over ~2.8s once, then stays static.
 *  Renders the full text for no-JS/reduced-motion — the animation only
 *  ever hides characters temporarily. */
function Typewriter({ text }: { text: string }) {
  const [chars, setChars] = useState(text.length);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setChars(0);
    const total = 2800;
    const step = Math.max(total / text.length, 12);
    const id = setInterval(() => {
      setChars((c) => {
        if (c >= text.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, step);
    return () => clearInterval(id);
  }, [text]);

  return (
    <p className="hero-positioning">
      {chars >= text.length ? text : text.slice(0, chars)}
    </p>
  );
}

export default function Hero() {
  const h = content.hero;
  const trackRef = useRef<HTMLElement>(null);

  // Scroll-scrubbed hero: progress 0..1 across the track drives the 3D scene
  // (via scrollState) and the copy/status transforms (via the --hp CSS var).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scrollState.p = 0;
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const span = track.offsetHeight - window.innerHeight;
      const top = track.getBoundingClientRect().top;
      const p = span > 0 ? Math.min(Math.max(-top / span, 0), 1) : 0;
      scrollState.p = p;
      track.style.setProperty("--hp", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      scrollState.p = 0;
    };
  }, []);

  return (
    <section className="hero-track" id="top" ref={trackRef}>
      <div className="hero-sticky">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker">{h.headline}</p>
            <h1 className="hero-name">
              {h.name}
              <span className="caret" aria-hidden="true" />
            </h1>
            <Typewriter text={h.positioning} />
            <div className="hero-ctas">
              <a className="btn btn-primary" href={h.ctaPrimary.href}>
                {h.ctaPrimary.label}
              </a>
              <a className="btn btn-ghost" href={h.ctaSecondary.href} download>
                {h.ctaSecondary.label}
              </a>
            </div>
          </div>
          <Hero3D />
        </div>
        <div className="hero-status">
          <div className="container">
            <div className="line">
              {h.statusLine}
              <span className="cursor" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="scroll-hint" aria-hidden="true">
          <span>scroll</span>
          <span className="scroll-hint-line" />
        </div>
      </div>
    </section>
  );
}
