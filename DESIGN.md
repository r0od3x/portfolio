---
version: alpha
name: Signal Ink
description: A dark, engineering-grade design system for an AI/ML engineer's portfolio. Premium, minimal, quietly technical.
colors:
  surface: "#0A0A0C"
  surface-dim: "#050506"
  surface-bright: "#1E1E23"
  surface-container-lowest: "#050506"
  surface-container-low: "#0E0E11"
  surface-container: "#131316"
  surface-container-high: "#1A1A1F"
  surface-container-highest: "#232329"
  on-surface: "#F2F1ED"
  on-surface-variant: "#9C9CA3"
  on-surface-faint: "#5C5C64"
  outline: "#2A2A30"
  outline-variant: "#1C1C20"
  primary: "#F2F1ED"
  on-primary: "#0A0A0C"
  secondary: "#6C7278"
  on-secondary: "#F2F1ED"
  tertiary: "#A78BFA"
  on-tertiary: "#0A0D17"
  tertiary-container: "#2A1D5C"
  on-tertiary-container: "#C4B5FD"
  success: "#7FB89A"
  error: "#D97757"
  on-error: "#1A0E08"
  background: "#0A0A0C"
  on-background: "#F2F1ED"
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 104px
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: -0.035em
  headline-lg:
    fontFamily: Inter
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: "JetBrains Mono"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.02em
  label-caps:
    fontFamily: "JetBrains Mono"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.14em
  data-lg:
    fontFamily: "JetBrains Mono"
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.02em
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  unit: 8px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 80px
  2xl: 128px
  gutter: 24px
  container-padding: 32px
  section-padding: 160px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
    typography: "{typography.body-sm}"
  button-primary-hover:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    borderColor: "{colors.outline}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  card:
    backgroundColor: "{colors.surface-container}"
    borderColor: "{colors.outline-variant}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-hover:
    borderColor: "{colors.outline}"
    backgroundColor: "{colors.surface-container-high}"
  badge:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
    typography: "{typography.label-caps}"
  nav:
    backgroundColor: "color-mix(in srgb, {colors.surface} 72%, transparent)"
    borderColor: "{colors.outline-variant}"
---

## Overview

Signal Ink is the design system for Mohamed Reda Ghalbi's engineering portfolio. The brand personality is that of a systems builder, not a designer showing off — quiet confidence, precision, and restraint. The emotional register is closer to a well-documented API or a Stripe changelog than a creative agency reel: dense with substance, generous with space, never loud.

The site is dark by default — a near-black "signal ink" background — because dark surfaces read as technical and considered, the natural habitat of terminals, IDEs, and ML training logs. Every accent is earned: a violet (`tertiary`) and cyan (`secondary`) pair, taken from the GitHub profile, are the only saturated colors in the system, reserved for the one thing per screen that most deserves attention (a primary CTA, a live metric, a hovered link). Everything else lives in a tight range of near-blacks and warm off-whites.

Monospace type (JetBrains Mono) is used deliberately and sparingly — for labels, metrics, timestamps, and tech-stack tags — to signal "this is real engineering," the way a terminal prompt or a `git diff` does. The narrative voice (headlines, body copy) stays in Inter, a humane, highly legible grotesque that reads as premium SaaS rather than gaming or crypto.

## Colors

The palette is rooted in a GitHub-dark navy surface with cool off-white text and the violet -> blue -> cyan accent gradient from github.com/r0od3x (#A78BFA -> #60A5FA -> #22D3EE).

- **Surface (#0A0A0C):** The base "signal ink" background — not pure black, carries a faint warmth so it never feels like a code editor's default theme.
- **Surface Container (#131316 → #232329):** A four-step tonal ladder used to stack cards, panels, and nav bars above the base without resorting to shadows.
- **On-Surface (#F2F1ED):** A warm off-white, never pure `#FFFFFF`, used for headlines and primary text.
- **On-Surface Variant (#9C9CA3):** Cool slate gray for secondary text, captions, and metadata.
- **Tertiary / Violet (#A78BFA):** The main accent color, with cyan (#22D3EE, `secondary`) as its partner and the violet -> blue -> cyan gradient reserved for signature moments (the hero "AI.", the scroll bar, the avatar ring). Used exclusively for primary actions, active states, key metrics, and the most important highlight per section. Never used decoratively or repeated more than once in the same viewport.
- **Outline (#2A2A30 / #1C1C20):** Hairline borders that replace heavy drop shadows as the primary tool for separating surfaces.
- **Error / Coral (#D97757):** Reserved for form validation and destructive states only.

## Typography

Two typefaces carry the entire system: **Inter** for narrative content, **JetBrains Mono** for anything technical or data-like.

- **Display (72–104px):** Inter Semi-Bold, extremely tight tracking (-0.035em to -0.04em), used once per page in the hero. Line-height is near 1.0 so multi-line headlines feel sculpted, not just wrapped text.
- **Headlines (22–44px):** Inter Semi-Bold, used for section titles and card titles. Always paired with a small mono `label-caps` eyebrow above it (e.g. `FEATURED PROJECTS`).
- **Body (14–19px):** Inter Regular at a generous 1.6–1.65 line-height for long-form readability in project write-ups and about copy.
- **Labels (11–13px, mono):** JetBrains Mono Medium, uppercase, wide letter-spacing (0.14em) for eyebrows, nav items, and tech-stack pills. This is the system's signature detail — it's what makes the site feel like it was built by an engineer.
- **Data (40px, mono):** JetBrains Mono Medium, used only for animated counters and hero metrics (e.g. "35.7% MAE ↓").

## Layout

A **Fixed-Max-Width Grid** (1280px content width, generous 32px side gutters that grow to 80px+ on ultra-wide) governs every section. Vertical rhythm is intentionally spacious: sections are separated by 160px of breathing room on desktop, collapsing gracefully on mobile. An 8px base spacing unit underlies all component-level spacing so nothing feels arbitrary.

Content within a section follows a 12-column grid; project case studies typically break to a 5/7 or 6/6 split (copy vs. visual), while the skills and certifications grids use 3–4 equal columns that reflow to 1–2 on mobile.

## Elevation & Depth

Depth is conveyed through **tonal layering and hairline borders**, not shadows. Each surface level (`surface` → `surface-container-highest`) is a slightly lighter step of near-black; a card sits one or two steps above its parent background. A single soft ambient glow (a low-opacity radial gradient in `tertiary` or `on-surface`) is permitted behind hero and CTA sections to suggest depth without literal drop shadows. On hover, interactive cards lift 4–6px via `transform: translateY()` and their border shifts from `outline-variant` to `outline` — motion communicates elevation more than static shadow does.

## Shapes

The shape language is **Soft Engineering** — a 16px corner radius (`rounded.lg`) on cards and panels feels considered but not playful, while pills (`rounded.full`) are reserved for buttons, badges, and tags to keep interactive elements visually distinct from static containers. Sharp 90° corners appear only in code blocks and data tables, reinforcing their technical nature.

## Components

- **Buttons**: Primary buttons are solid off-white pills with near-black text that invert to the violet accent on hover with a subtle magnetic pull toward the cursor. Secondary buttons are transparent with a 1px `outline` border that brightens on hover. Both use mono `body-sm` type, never Inter, to keep CTAs feeling precise.
- **Cards**: Project and certification cards use `surface-container` backgrounds, a 1px `outline-variant` border, 32px internal padding, and 16px rounding. On hover they lift, brighten one surface step, and their border sharpens to `outline`.
- **Badges / Tags**: Pill-shaped, mono, uppercase, used for tech-stack tags and status labels ("IN PROGRESS", "PLANNED"). Neutral by default; violet only for a single "featured" or "current" badge per group.
- **Nav**: A translucent, blurred bar pinned to top, using `color-mix` to blend `surface` at 72% opacity over blur, with an `outline-variant` bottom hairline that only appears after scroll.
- **Input fields**: Transparent background, `outline` border, violet border and subtle glow on focus, mono label above the field.

## Do's and Don'ts

- Do reserve the violet accent (`tertiary`) for exactly one focal element per viewport.
- Do pair every headline with a small mono eyebrow label.
- Don't use pure black (`#000000`) or pure white (`#FFFFFF`) anywhere — always the warm-tinted `surface`/`on-surface` values.
- Don't mix more than two font families on a single screen.
- Don't use drop shadows as the primary depth cue — prefer tonal surface steps and hairline borders.
- Do maintain WCAG AA contrast for all body text against its surface.
- Don't animate more than one large element simultaneously on scroll — stagger, don't compete.
