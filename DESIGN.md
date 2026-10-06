# Design system — "Engineering notebook"

An editorial, print-inspired portfolio: big confident type, hairline rules, mono annotations that read like figure captions in a paper, and motion that explains rather than decorates. The goal is a site that looks *made*, not generated.

## Principles

1. **Type does the heavy lifting.** Hierarchy comes from scale and the sans/serif pairing, not from cards, icons, badges or gradients.
2. **Show the work.** Every project gets a diagram of how it actually works (Fig. 01–04) instead of a stock card.
3. **One signature moment.** The pixel portrait in the hero is built from the GitHub avatar; nothing else competes with it.
4. **Restraint with colour.** Navy ink, off-white text, violet as the only regular accent. Cyan appears only inside figures as "data moving".
5. **Motion must be cheap.** Transforms and opacity only; nothing animates while off-screen; no per-frame layout reads.

## Colour

Matched to github.com/r0od3x (GitHub-dark navy, violet/cyan accents).

| Token | Value | Use |
|---|---|---|
| `ink` / `ink-2` / `ink-3` | `#0A0D17` / `#0F1320` / `#151A2A` | Page / panels / figure backgrounds |
| `line` / `line-2` | `#1C2236` / `#2A3150` | Hairlines, borders, figure strokes |
| `fg` / `fg-2` / `fg-3` | `#E6E9F0` / `#9AA3B7` / `#5E6880` | Text: primary / secondary / annotations |
| `accent` | `#A78BFA` | Serif accent words, active states, key data |
| `accent-2` | `#22D3EE` | Figures only: packets, scan lines |
| `ok` | `#34D399` | "Available" status dot |
| `paper` / `on-paper` / `accent-ink` | `#E9EBF2` / `#0A0D17` / `#6D3FE0` | The light contact sheet |

## Typography

Self-hosted via Fontsource (no third-party font requests).

- **Geist** (variable): everything sans. Display at 500–600 weight with tight tracking (−0.045 to −0.06em); body 15.5–19px.
- **Instrument Serif Italic**: accent words inside headlines ("*actually use them*", "*Ghalbi*", "*talk.*"). One or two per heading, never whole paragraphs.
- **Geist Mono**: `.label` — 11.5px uppercase annotations: section indices `(01)`, figure captions, dates, stacks.

Giant type (hero name, footer name) is sized with `useFitText` so it spans the page width exactly.

## Layout

- 12-column grid (`.grid-12`), gutters `clamp(20px, 3.2vw, 56px)` (`.page-x`), full-bleed — no max-width container.
- Every section opens with `SectionLabel`: `(index) Label ———— note`, the rule drawing in on scroll.
- Lists are typographic tables separated by hairlines, not card grids.
- `tall-lg` variant (≥1024px wide and ≥720px tall) enables the pinned/stacked layouts; everything else falls back to normal flow.

## Motion

GSAP 3.15 with ScrollTrigger, SplitText, ScrambleText, DrawSVG, MotionPath and CustomEase; Lenis for smooth scroll. House ease: `settle` (`0.16, 1, 0.3, 1`).

| Piece | Behaviour |
|---|---|
| Preloader | Counter to 100, panel lifts; once per session |
| Hero | Name letters rise; pixel portrait assembles, reacts to the cursor, dissolves on scroll; letters drift apart on scroll-out |
| About | Statement lights up word by word (scrubbed) |
| Marquee | Velocity-reactive, paused off-screen |
| Work | Sticky panels stack; covered panel scales/darkens; figures draw in then loop while visible |
| Experience | Vertical timeline 2022 → now: line draws on scroll, comet at its tip, icons light up as it passes |
| Toolbox / Education | Line-mask reveals; CSS-only hovers |
| Contact | Paper sheet; footer name rises with scroll |

**Performance rules** (measured; see git history):

- No `mix-blend-mode` on fixed elements (forces full-page compositing every frame).
- No per-frame CSS-variable writes across many elements, and never read layout in a loop of writes.
- No CSS transitions on elements GSAP animates — they fight the tween (wrap the hover effect instead).
- Create scroll-scrubbed tweens *after* a `from()` intro on the same targets, or they record the hidden state.
- Canvas: batch fills by colour; tick only while something is moving and on screen.
- Every effect respects `prefers-reduced-motion` with a fully static, fully readable fallback.
