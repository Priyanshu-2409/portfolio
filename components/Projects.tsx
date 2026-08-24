"use client";

import { useEffect, useState } from "react";
import content from "@/content/content.json";
import Reveal from "./Reveal";

const isPlaceholder = (s: string) => !s || s.startsWith("[EDIT");

/** Tiny live widget wired to Pharos's own public status endpoint.
 *  Expects JSON like { "status": "operational", "uptime30d": 99.98 }.
 *  Renders nothing until statusEndpoint is set; hides itself on any error. */
function PharosStatusWidget({ endpoint }: { endpoint: string }) {
  const [data, setData] = useState<{ status: string; uptime30d?: number } | null>(null);

  useEffect(() => {
    if (isPlaceholder(endpoint)) return;
    let cancelled = false;
    fetch(endpoint)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!cancelled && d && typeof d.status === "string") setData(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  if (!data) return null;
  return (
    <div className="status-widget" title="Live data from Pharos's own status API">
      <span className="status-dot" aria-hidden="true" />
      <span>
        pharos api: {data.status}
        {typeof data.uptime30d === "number" && ` · ${data.uptime30d}% / 30d`}
      </span>
    </div>
  );
}

/** Renders inline code (backtick-free heuristic: the IDOR bullet). */
function Bullet({ text }: { text: string }) {
  const marker = "findFirst({ where: { id, userId } })";
  if (text.includes(marker)) {
    const [before, after] = text.split(marker);
    return (
      <li>
        {before}
        <code>{marker}</code>
        {after}
      </li>
    );
  }
  return <li>{text}</li>;
}

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <Reveal>
          <h2 className="section-heading">projects</h2>
        </Reveal>
        <div className="project-grid">
          {content.projects.map((p) => (
            <Reveal key={p.name}>
              <article className={`project-card ${p.featured ? "featured" : ""}`}>
                <div className="project-head">
                  <h3 className="project-name">
                    {p.name}
                    {p.featured && <span className="featured-tag">FEATURED</span>}
                  </h3>
                  <div className="project-links mono">
                    {!isPlaceholder(p.demo) && (
                      <a href={p.demo} target="_blank" rel="noopener noreferrer">
                        demo ↗
                      </a>
                    )}
                    {!isPlaceholder(p.github) && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer">
                        source ↗
                      </a>
                    )}
                  </div>
                </div>
                <p className="project-tagline">{p.tagline}</p>
                <div className="chips">
                  {p.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
                <ul className="project-bullets">
                  {p.bullets.map((b) => (
                    <Bullet key={b.slice(0, 24)} text={b} />
                  ))}
                </ul>
                {p.featured && <PharosStatusWidget endpoint={p.statusEndpoint} />}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
