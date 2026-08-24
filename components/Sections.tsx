"use client";

import { useEffect, useState } from "react";
import content from "@/content/content.json";
import Reveal from "./Reveal";

const isPlaceholder = (s: string) => !s || s.startsWith("[EDIT");

export function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <Reveal>
          <h2 className="section-heading">skills</h2>
        </Reveal>
        <Reveal>
          <div className="skills-grid">
            {content.skills.buckets.map((b) => (
              <div key={b.label} className="skill-bucket">
                <h3>{b.label}</h3>
                <div className="chips">
                  {b.items.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="skills-footnote">{content.skills.footnote}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience">
      <div className="container">
        <Reveal>
          <h2 className="section-heading">experience</h2>
        </Reveal>
        <div>
          {content.experience.map((xp) => (
            <Reveal key={xp.company}>
              <div className="xp-item">
                <div className="xp-head">
                  <div className="xp-role">
                    {xp.role} · <span className="xp-company">{xp.company}</span>
                  </div>
                  <div className="xp-dates">{xp.dates}</div>
                </div>
                <ul className="xp-bullets">
                  {xp.bullets
                    .filter((b) => !isPlaceholder(b))
                    .concat(xp.bullets.filter(isPlaceholder))
                    .map((b) => (
                      <li key={b.slice(0, 32)} style={isPlaceholder(b) ? { color: "var(--faint)", fontStyle: "italic" } : undefined}>
                        {b}
                      </li>
                    ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Education() {
  const e = content.education;
  return (
    <section id="education">
      <div className="container">
        <Reveal>
          <h2 className="section-heading">education</h2>
        </Reveal>
        <Reveal>
          <div className="edu-card">
            <div className="edu-head">
              <div className="edu-school">{e.school}</div>
              <div className="edu-meta">
                {e.graduation} · {e.cgpa}
              </div>
            </div>
            <p className="edu-degree">{e.degree}</p>
            <div className="edu-label">RELEVANT COURSEWORK</div>
            <div className="chips">
              {e.coursework.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
            <div className="edu-label">EXTRAS</div>
            <ul className="ach-list">
              {e.extras.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Achievements() {
  return (
    <section id="achievements" style={{ paddingBottom: 48 }}>
      <div className="container">
        <Reveal>
          <h2 className="section-heading">signal</h2>
        </Reveal>
        <Reveal>
          <ul className="ach-list">
            {content.achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  const l = content.links;
  return (
    <section id="contact" style={{ paddingTop: 48 }}>
      <div className="container">
        <Reveal>
          <h2 className="section-heading">contact</h2>
        </Reveal>
        <Reveal>
          <p className="contact-lede">
            The fastest way to reach me is email — I reply within a day. No forms,
            no friction.
          </p>
          <div className="contact-row">
            <a className="contact-link" href={`mailto:${l.email}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 6L2 7" />
              </svg>
              {l.email}
            </a>
            {!isPlaceholder(l.linkedin) && (
              <a className="contact-link" href={l.linkedin} target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
                LinkedIn
              </a>
            )}
            <a className="contact-link" href={l.github} target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              github.com/Priyanshu-2409
            </a>
            {!isPlaceholder(l.calendly) && (
              <a className="contact-link" href={l.calendly} target="_blank" rel="noopener noreferrer">
                Book a chat ↗
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function daysSinceDeploy(): number {
  const built = Number(process.env.NEXT_PUBLIC_BUILD_TIME || Date.now());
  return Math.max(0, Math.floor((Date.now() - built) / 86400000));
}

export function Footer() {
  const [days, setDays] = useState(0);
  useEffect(() => setDays(daysSinceDeploy()), []);
  const sha = process.env.NEXT_PUBLIC_COMMIT_SHA || "dev";

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="sys-status">
          <span className="status-dot" aria-hidden="true" />
          $ system: operational · uptime: {days}d since last deploy
        </span>
        <span>
          © {new Date().getFullYear()} Priyanshu Mullick · {content.footer.builtWith} ·{" "}
          {content.footer.version} · {sha}
        </span>
      </div>
    </footer>
  );
}
