# Priyanshu Mullick — Portfolio

Single-page, dark-themed portfolio. Next.js 14 (App Router) + React Three Fiber, no CSS framework, deployable to Vercel with one click.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com/new — zero config needed, defaults work.
3. The footer commit SHA and "days since deploy" wire themselves up automatically from Vercel's build env (`VERCEL_GIT_COMMIT_SHA`).

## Editing content — `content/content.json`

**All text lives in this one file.** Layout code never needs touching. Anything currently wrapped in `[EDIT: ...]` is a placeholder waiting for you:

- `links.linkedin` — your LinkedIn URL
- `projects[*].github` / `projects[0].demo` — repo + live demo URLs
- `experience[*].dates` and the Techsharks bullets (write these in XYZ format — no metrics were invented for you)
- `education.coursework` — 2–3 more courses
- `meta.siteUrl` — your deployed domain

Placeholder links are automatically **hidden** on the live site (the code checks for the `[EDIT` prefix), and placeholder experience bullets render dimmed/italic so you'll notice them — nothing fake ever ships.

## Résumé

Replace `public/resume.pdf` with your real résumé. The current file is a one-line placeholder so the hero button works out of the box.

## Pharos live status widget

The featured card can show live uptime from Pharos itself. Set `projects[0].statusEndpoint` to your public endpoint (e.g. `https://pharos.yourdomain.com/api/public/status/demo`). Expected response:

```json
{ "status": "operational", "uptime30d": 99.98 }
```

`uptime30d` is optional. The endpoint must send CORS headers (`Access-Control-Allow-Origin: *` or your portfolio domain). The widget renders nothing until the endpoint is set, and hides itself silently on any fetch error — it can never break the page.

## Theming

Design tokens live at the top of `app/globals.css`. Your accent `#1B2A4A` is used two ways:

- `--accent-deep: #1B2A4A` — fills, glows, the 3D mesh body
- `--accent: #7C9BDB` — a lighter tint of the same hue for interactive text/borders in dark mode (the raw navy is invisible against `#0a0a0f`)
- In light mode, `--accent` **is** `#1B2A4A` — it has excellent contrast there

The 3D scene's colors are constants at the top of `components/Scene.tsx` (`DEEP`, `LINE`) — change both places if you re-theme.

## Scroll-scrubbed hero

The hero pins for ~2.3 viewport heights (1.75 on phones). Scroll progress across that span drives the 3D scene — extra rotation (~1.4 turns), a camera dolly-in, slight scale-up, wireframe brightening — with light damping so it feels weighted rather than glued to the wheel. The copy and status line drift up and fade as the scene takes over, then Projects slides over it. Every section is scroll-scrubbed: it rises, settles, and sharpens tied to scrollbar position, and sinks back when you scroll up — one shared rAF-throttled listener drives all of them (components/Reveal.tsx), identical in every browser. The 3D canvas bleeds ~20% past its container so the knot's arcs never clip against a square edge. `prefers-reduced-motion` disables the pinning entirely: normal one-screen hero, no scrubbing. Tuning knobs: `.hero-track { height }` in `globals.css` controls scrub length; the multipliers in `Scene.tsx`'s `useFrame` control how far the scene travels.

## The 3D scene

Torus-knot "network mesh" built with React Three Fiber + drei. Behavior:

- Dynamically imported (`ssr: false`) — hero text and CTAs paint first from static HTML; the canvas fades in over 400ms
- **Reduced motion:** static single frame, no rotation
- **Low-end devices** (`hardwareConcurrency <= 4` or `deviceMemory <= 4`): lower polygon count, DPR capped at 1.5
- **No WebGL / render crash:** static SVG fallback with the same aesthetic
- Render loop pauses when the hero scrolls off-screen (IntersectionObserver)
- Never interactive — `pointer-events: none`, so no accidental gestures on mobile, no focus traps
- DPR capped at 2 everywhere

Measured bundle: the lazy 3D chunks total **~211 KB gzipped** (budget was 500 KB). First-load JS for the page is ~95 KB before the 3D loads.

## Structure

```
app/            layout, page, 404, global CSS (all design tokens)
components/     Nav, Hero, Hero3D (fallback logic), Scene (r3f), Projects, Sections, Reveal
content/        content.json — edit this
public/         resume.pdf — replace this
```

## Verification checklist (from the brief)

Verified in this build: production compile, static prerender, all sections render, resume serves, 404 terminal page, bundle budgets. Still on you (needs a real browser/device): Lighthouse runs at 1440×900 and throttled mobile, and an FPS check on a real entry-level phone — the low-end fallback path is in place if any device struggles.
