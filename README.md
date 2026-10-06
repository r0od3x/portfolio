# Mohamed Reda Ghalbi — Portfolio

Personal portfolio built with React 19, TypeScript, Tailwind CSS v4, GSAP and Lenis. Design notes live in [`DESIGN.md`](DESIGN.md).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks, then builds to dist/
npm run preview   # serve the production build locally
npm run lint
```

## Project structure

```
src/
  components/
    layout/     Preloader, Navbar, Cursor
    sections/   Hero, About, Work, Experience, Toolbox, Education, Contact (+ footer)
    figures/    Animated SVG diagrams for each project + useFigure (shared choreography)
    ui/         PixelPortrait (canvas), Marquee, SectionLabel, RollText, ScrambleText,
                LiveClock, ScrollProgress
  data/         content.ts — every piece of copy, in one typed file
  hooks/        useLenis, useFitText
  lib/          gsap.ts (plugins + house ease), scroll.ts
scripts/
  gen_resume.py    regenerates public/resume.pdf     (pip install reportlab)
  gen_og_image.py  regenerates public/og-image.png   (pip install pillow)
```

## Editing content

All text lives in `src/data/content.ts`. Words wrapped in `*asterisks*` in the About statement render as serif-italic accents. After changing experience or projects, update and re-run `python scripts/gen_resume.py` so the downloadable résumé stays in sync.

The hero portrait is drawn from `public/avatar.webp` (the GitHub avatar); replace that file to change it.

## Deploying

Static site: `npm run build` outputs `dist/`, deployable as-is to Vercel, Netlify, Cloudflare Pages or GitHub Pages.

Set **`VITE_SITE_URL`** (e.g. `https://your-domain.com`, no trailing slash) in the host's environment variables. It fills in the canonical URL and absolute Open Graph image URLs (needed for LinkedIn previews), and emits `robots.txt` + `sitemap.xml`.

## Accessibility & performance

- `prefers-reduced-motion`: no preloader, no smooth scroll, no pinning; all content static and readable.
- Custom cursor and pointer effects are disabled on touch devices.
- Nothing animates while off-screen (canvas, figure loops and the marquee all pause).
- Fonts are self-hosted and split by unicode range; no third-party requests.
