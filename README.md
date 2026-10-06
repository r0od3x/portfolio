# Mohamed Reda Ghalbi — Portfolio

A premium, dark-themed personal portfolio built with React 19, TypeScript, Tailwind CSS v4, and GSAP. Follows the `DESIGN.md` design system included in this repo ("Signal Ink").

## Stack & why

- **Vite + React 19 + TypeScript** — chosen over Next.js because this is a fully static, client-rendered site with no server data fetching; Vite gives the same React/TS/Tailwind stack with a simpler build and faster iteration, and deploys identically to Vercel/Netlify/GitHub Pages as static output.
- **Tailwind CSS v4** — theme tokens defined directly in `src/index.css` via `@theme`, mirrored from `DESIGN.md`.
- **GSAP + ScrollTrigger** — hero/section reveals, magnetic buttons, timeline draw, tech-stack marquee, radial skill gauges, project card tilt.
- **Lenis** — smooth scrolling, synced to GSAP's ticker/ScrollTrigger.
- **lucide-react** — iconography (GitHub/LinkedIn marks are custom SVGs since lucide dropped brand icons).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks then builds to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  components/
    layout/     Navbar, Footer, CustomCursor, Preloader
    sections/   Hero, About, Timeline (experience), Projects, TechStack,
                Certifications, Education, Contact
    ui/         MagneticButton, AnimatedCounter, RevealText, SectionHeading,
                Badge, ProjectCard, BrandIcons, EngineerIllustration (three.js)
  data/         content.ts: all copy in one typed file
  hooks/        useLenis, useScrollReveal, useReducedMotion, useMediaQuery
  lib/          gsap.ts (GSAP + SplitText/ScrambleText registration), scroll.ts
scripts/
  gen_resume.py    regenerates public/resume.pdf (pip install reportlab)
  gen_og_image.py  regenerates public/og-image.png, the link-preview image (pip install pillow)
```

## Editing content

All text (profile, experience, projects, stack, certifications, education) lives in
`src/data/content.ts`. After changing experience or projects, also update and re-run
`python scripts/gen_resume.py` so the downloadable résumé stays in sync.

## Deploying

Static site: `npm run build` outputs `dist/`, which deploys as-is to Vercel, Netlify,
Cloudflare Pages or GitHub Pages.

Set **`VITE_SITE_URL`** (e.g. `https://your-domain.com`, no trailing slash) in your host's
environment variables or in `.env.production` (see `.env.example`). At build time it fills in
the canonical URL, absolute Open Graph image URLs (needed for LinkedIn previews), the JSON-LD
profile, and emits `robots.txt` + `sitemap.xml`. Without it the site still builds, but link
previews may not show an image.

## Accessibility & performance notes

- Respects `prefers-reduced-motion`: preloader, cursor, split-text and scroll reveals are skipped.
- The three.js hero illustration is lazy-loaded in its own chunk and only one WebGL canvas is
  mounted (desktop or mobile layout), so text paints before the 3D loads.
- Custom cursor and mouse-follow effects are disabled on touch devices.
- Buttons and links are real `<button>` / `<a>` elements; external links open in a new tab.
