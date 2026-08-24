"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./Nav";

/** Landing portal: layered pixel night-desert (or day-desert) scene.
 *  Click → dino sprints left-to-right → zoom through the 'o' into the hero.
 *  Theme toggle lives here too: dark = glowing moon + campfire;
 *  light = glowing sun + extinguished fire (ash, charred logs, smoke).
 *  The dinosaur is an original voxel-shaded design, not the Chrome sprite. */
export default function Intro() {
  const [phase, setPhase] = useState<"idle" | "run" | "zoom" | "gone">("idle");
  const rootRef = useRef<HTMLDivElement>(null);
  const oRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (phase === "gone") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  const enter = () => {
    if (phase !== "idle") return;
    const root = rootRef.current;
    const o = oRef.current;
    if (!root || !o || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("gone");
      return;
    }
    setPhase("run");
    window.setTimeout(() => {
      const r = o.getBoundingClientRect();
      root.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      setPhase("zoom");
      window.setTimeout(() => setPhase("gone"), 1050);
    }, 1100);
  };

  return phase === "gone" ? null : (
    <>
      <div
        ref={rootRef}
        className={`intro ${phase === "run" ? "run" : ""} ${phase === "zoom" ? "run zoom" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Enter site"
        onClick={enter}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            enter();
          }
        }}
      >
        <div className="intro-scene" aria-hidden="true">
          <div className="horizon" />

          {/* moon (dark) / sun (light) */}
          <div className="moon-wrap">
            <svg className="px" viewBox="0 0 24 24" width="76" height="76">
              <circle cx="10" cy="12" r="8" fill="#c7d3ee" opacity="0.85" />
              <circle cx="13.6" cy="10.2" r="7" fill="var(--bg)" />
            </svg>
          </div>
          <div className="sun-wrap">
            <svg className="px" viewBox="0 0 28 28" width="84" height="84">
              <g fill="#fcd34d" opacity="0.9">
                <rect x="13" y="1" width="2" height="4" />
                <rect x="13" y="23" width="2" height="4" />
                <rect x="1" y="13" width="4" height="2" />
                <rect x="23" y="13" width="4" height="2" />
                <rect x="4" y="4" width="3" height="2" />
                <rect x="21" y="4" width="3" height="2" />
                <rect x="4" y="22" width="3" height="2" />
                <rect x="21" y="22" width="3" height="2" />
              </g>
              <circle cx="14" cy="14" r="7" fill="#fbbf24" />
              <circle cx="12" cy="12" r="3" fill="#fde68a" />
            </svg>
          </div>

          {/* stars (dark theme only) */}
          <span className="star s1" /><span className="star s2" /><span className="star s3" />
          <span className="star s4" /><span className="star s5" /><span className="star s6" />

          {/* clouds */}
          <svg className="px cloud c1" viewBox="0 0 20 6" width="120" height="36">
            <rect x="2" y="3" width="16" height="2" fill="var(--faint)" opacity="0.45" />
            <rect x="6" y="1" width="7" height="2" fill="var(--faint)" opacity="0.45" />
          </svg>
          <svg className="px cloud c2" viewBox="0 0 20 6" width="88" height="26">
            <rect x="1" y="3" width="15" height="2" fill="var(--faint)" opacity="0.35" />
            <rect x="8" y="1" width="6" height="2" fill="var(--faint)" opacity="0.35" />
          </svg>

          {/* birds: two wing frames each, looping left → right */}
          {[1, 2, 3].map((n) => (
            <svg key={n} className={`px bird b${n}`} viewBox="0 0 6 5" width="22" height="18">
              <g className="wing wA" fill="var(--muted)">
                <rect x="0" y="1" width="2" height="1" />
                <rect x="2" y="2" width="2" height="1" />
                <rect x="4" y="1" width="2" height="1" />
              </g>
              <g className="wing wB" fill="var(--muted)">
                <rect x="0" y="3" width="2" height="1" />
                <rect x="2" y="2" width="2" height="1" />
                <rect x="4" y="3" width="2" height="1" />
              </g>
            </svg>
          ))}

          <div className="ground" />

          {/* cacti: one foreground + four background for depth */}
          {[
            { cls: "cx-a", w: 58, h: 84 },
            { cls: "cx-b", w: 34, h: 48 },
            { cls: "cx-c", w: 26, h: 38 },
            { cls: "cx-d", w: 40, h: 56 },
            { cls: "cx-e", w: 22, h: 32 },
          ].map((c) => (
            <svg key={c.cls} className={`px cactus ${c.cls}`} viewBox="0 0 9 12" width={c.w} height={c.h}>
              <g>
                <rect className="cac-lit" x="4" y="0" width="1" height="12" />
                <rect className="cac-dim" x="5" y="0" width="1" height="12" />
                <rect className="cac-lit" x="1" y="3" width="1" height="4" />
                <rect className="cac-lit" x="2" y="6" width="2" height="1" />
                <rect className="cac-dim" x="7" y="2" width="1" height="3" />
                <rect className="cac-dim" x="6" y="4" width="1" height="1" />
              </g>
            </svg>
          ))}
          <div className="shadow sh-cactus" />

          {/* campfire (dark) / ash & charred logs (light) */}
          <div className="fire-spot">
            <svg className="px fire" viewBox="0 0 10 10" width="52" height="52">
              <rect x="2" y="8" width="6" height="1" fill="#6b4a2f" />
              <rect x="3" y="7" width="4" height="1" fill="#54371f" />
              <g className="flame fA">
                <rect x="4" y="1" width="2" height="2" fill="#ea580c" />
                <rect x="3" y="3" width="4" height="2" fill="#ea580c" />
                <rect x="2" y="5" width="6" height="3" fill="#f97316" />
                <rect x="4" y="5" width="2" height="2" fill="#fbbf24" />
              </g>
              <g className="flame fB">
                <rect x="3" y="1" width="2" height="2" fill="#ea580c" />
                <rect x="3" y="3" width="5" height="2" fill="#f97316" />
                <rect x="2" y="5" width="6" height="3" fill="#ea580c" />
                <rect x="5" y="4" width="2" height="3" fill="#fbbf24" />
              </g>
            </svg>
            <svg className="px ash" viewBox="0 0 10 10" width="52" height="52">
              <rect x="2" y="8" width="6" height="1" fill="#3a3a40" />
              <rect x="3" y="7" width="4" height="1" fill="#2c2c31" />
              <rect x="4" y="6" width="3" height="1" fill="#9a9aa2" />
              <rect x="3" y="7" width="1" height="1" fill="#b9b9c0" />
              <rect x="6" y="8" width="1" height="1" fill="#7a5540" />
            </svg>
            <span className="puff p1" /><span className="puff p2" /><span className="puff p3" />
            <div className="shadow sh-fire" />
          </div>

          {/* original voxel-shaded dino */}
          <div className="dino-wrap">
            <svg className="px dino" viewBox="0 0 20 18" width="112" height="101">
              {/* tail */}
              <rect x="1" y="6" width="2" height="2" fill="#3fae76" />
              <rect x="1" y="6" width="2" height="1" fill="#57c98c" />
              <rect x="3" y="7" width="2" height="2" fill="#3fae76" />
              {/* body */}
              <rect x="5" y="7" width="8" height="6" fill="#3fae76" />
              <rect x="5" y="7" width="8" height="1" fill="#57c98c" />
              <rect x="12" y="8" width="1" height="5" fill="#2c8a5e" />
              <rect x="5" y="12" width="8" height="1" fill="#2c8a5e" />
              {/* arm */}
              <rect x="13" y="9" width="2" height="1" fill="#3fae76" />
              <rect x="14" y="10" width="1" height="1" fill="#2c8a5e" />
              {/* neck + head */}
              <rect x="10" y="5" width="2" height="3" fill="#3fae76" />
              <rect x="11" y="1" width="9" height="1" fill="#57c98c" />
              <rect x="11" y="2" width="9" height="3" fill="#3fae76" />
              <rect x="19" y="2" width="1" height="3" fill="#2c8a5e" />
              <rect x="11" y="5" width="4" height="2" fill="#3fae76" />
              <rect x="15" y="5" width="5" height="1" fill="var(--bg)" />
              <rect x="14" y="6" width="6" height="1" fill="#2c8a5e" />
              {/* eye */}
              <rect x="13" y="2" width="1" height="1" fill="#ffffff" />
              {/* legs: two run frames */}
              <g className="legA">
                <rect x="6" y="13" width="2" height="3" fill="#3fae76" />
                <rect x="6" y="16" width="3" height="1" fill="#2c8a5e" />
                <rect x="10" y="13" width="2" height="3" fill="#2c8a5e" />
              </g>
              <g className="legB">
                <rect x="6" y="13" width="2" height="3" fill="#2c8a5e" />
                <rect x="10" y="13" width="2" height="3" fill="#3fae76" />
                <rect x="10" y="16" width="3" height="1" fill="#2c8a5e" />
              </g>
            </svg>
            <div className="shadow sh-dino" />
          </div>
        </div>

        <div className="intro-toggle" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <ThemeToggle />
        </div>

        <div className="intro-word">
          welc
          <span ref={oRef} className="intro-o">
            o
          </span>
          me
        </div>
        <p className="intro-hint">
          tap to start
          <span className="cursor" aria-hidden="true" />
        </p>
      </div>
    </>
  );
}