# Implementation Plan: Curated Theme Presets

**Branch**: `017-curated-theme-presets` | **Date**: 2026-07-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/017-curated-theme-presets/spec.md`

## Summary

Ship a runtime-swappable theme system with 42 curated, named color
palettes (comfortably clearing the 40+ requirement), a browsable gallery,
and a persisted user selection — with zero markup or component-file
changes to any of this catalog's ~48 previously-shipped components.
Confirmed empirically (research.md R1) that migrating
`shared/design-tokens.ts`'s 21 color values to CSS custom properties,
referenced via Tailwind's documented RGB-tuple opacity-compatible
pattern, and toggled via a `data-theme` attribute, achieves this: a real
proof-of-concept switched two themes at runtime with zero component
changes, including correct opacity-modifier behavior (`bg-success/5`).
The 42 theme names/directions are grounded in two live-fetched real
collections (DaisyUI's 35 built-in themes, Bootswatch's 27) plus
well-established standalone GitHub-native color schemes (Nord, Dracula,
Catppuccin, Gruvbox, Tokyo Night, Rose Pine, Everforest, Solarized),
explicitly rejecting algorithmic hue-rotation generation as the
"AI-generated" look the original request called out. The AAA/AA contrast
bottleneck (40+ themes × this project's NON-NEGOTIABLE Principle II) is
resolved by parametrizing the EXISTING `scripts/check-contrast.mjs`
pairing structure to run once per theme (research.md R2), not by hand-
verifying each theme separately.

## Technical Context

**Language/Version**: HTML5, Tailwind CSS (existing project version, CSS custom properties), vanilla JavaScript (ES modules) for the gallery/persistence layer

**Primary Dependencies**: This repo's existing scaffold only — Vite, Tailwind config, Playwright, `scripts/check-contrast.mjs` (extended, not replaced). No new client-side dependency.

**Storage**: `localStorage` (client-side only, key `pds-theme`) — this is the first feature in this project to use browser storage (research.md R5)

**Testing**: Playwright for the gallery page + a representative component sample (Button, Badge, Card, Alert, TextInput) under a representative theme subset (default + 1 light + 1 dark + 1 high-contrast-adjacent), plus real `localStorage` persistence/corruption-fallback assertions; a single parametrized script run replaces 42x manual contrast verification (research.md R2)

**Target Platform**: Same browser matrix as every prior feature (Chromium/Firefox/WebKit, visual baselines on `ubuntu-latest`)

**Project Type**: Static multi-page Vite site — one new theme-architecture layer (`shared/design-tokens.ts` + `tailwind.config.ts` changes, one new `themes.css`) plus one new gallery page, no changes to any existing component file

**Performance Goals**: N/A beyond existing bundle budgets — 42 theme blocks of ~21 CSS custom properties each is a small, fixed CSS payload addition (roughly 1-2KB gzipped), not per-theme JS or duplicated component CSS

**Constraints**: Zero markup/component-file changes to any of the ~48 existing components (verified empirically, research.md R1); zero new client-side dependency; every theme independently re-clears the existing WCAG AAA/AA bar via the parametrized audit (research.md R2), no exceptions; NEVER use inline `style="..."` attributes (this project's CSP) — the gallery's theme-switching script uses `dataset.theme` assignment (a DOM property, not a `style` attribute), which is unaffected by `style-src`

**Scale/Scope**: 42 curated themes (research.md R3), delivered in batches per the Scale/Scope batching decision below — this plan does not commit to a single monolithic implementation pass

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Themes only change color values, never layout/spacing/typography hierarchy — every theme inherits this catalog's existing visual structure unchanged | PASS |
| II. Absolute Semantic Accessibility (WCAG 2.2 AAA) | Every one of the 42 themes MUST independently pass the parametrized `check-contrast.mjs` run (research.md R2) — zero exceptions, not a reduced bar for "extra" themes | PASS (pending per-theme verification during implementation) |
| III. Tailwind-Only Architecture (Zero Parallel CSS) | The CSS-custom-property mechanism is a standard, Tailwind-documented technique (`rgb(var(--x) / <alpha-value>)`) expressed through the existing `theme.extend.colors` config — not a parallel CSS system | PASS |
| IV. Design Token Discipline (Zero Hardcoding) | Every theme's colors ARE the design tokens — this feature is the token layer becoming multi-valued, not a bypass of it. `shared/design-tokens.ts` remains the single source of truth, extended (not replaced) to also emit CSS custom-property declarations | PASS |
| V. Interactive State Completeness | The theme gallery's own selector cards need focus-visible/hover states like any other interactive element in this catalog; existing components' own interactive states are untouched (zero markup changes) | PASS |
| VI. Project Language Policy | English-only theme names and markup, matching every prior feature | PASS |
| VII. Autonomous Skill Acquisition Protocol | No new external library/tool introduced | PASS |

No violations — Complexity Tracking section is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/017-curated-theme-presets/
├── plan.md              # This file
├── research.md          # Phase 0 output (complete)
├── data-model.md         # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks, not yet created)
```

### Source Code (repository root)

```text
shared/
└── design-tokens.ts       # MODIFIED — colors object values become
                            # CSS-custom-property references; theme
                            # definitions (42 palettes) added as a new
                            # exported map

tailwind.config.ts          # MODIFIED — colors config switches to the
                             # RGB-tuple `rgb(var(--x) / <alpha-value>)`
                             # pattern (research.md R1)

src/
├── styles/
│   ├── tailwind.css        # UNCHANGED — no existing @apply block needs
│   │                       # to change; components reference the same
│   │                       # utility classes, which now resolve through
│   │                       # CSS custom properties instead of static hex
│   └── themes.css          # NEW — 42 `[data-theme="name"]` blocks, ~21
│                           # custom properties each
├── scripts/
│   └── theme-switcher.js   # NEW — reads/validates/applies the
│                           # persisted theme before first paint,
│                           # wires the gallery's theme-selection cards
└── components/
    └── theme-gallery/theme-gallery.html   # NEW — browsable gallery page

scripts/
└── check-contrast.mjs      # MODIFIED — parametrized to loop the
                             # existing PAIRINGS/RING_PAIRINGS structure
                             # once per theme (research.md R2)

tests/e2e/
├── theme-gallery.spec.ts    # NEW
├── theme-persistence.spec.ts # NEW
└── theme-restyle.spec.ts    # NEW — representative-component-sample
                              # restyle verification under a
                              # representative theme subset
```

**Structure Decision**: No existing component HTML/CSS file changes at
all (research.md R1's zero-markup-change finding, the central design
constraint of this feature) — every existing component continues to
reference the exact same Tailwind utility classes it always has; only
what those classes RESOLVE TO at the CSS-custom-property level changes
per active theme. New files are additive: one CSS file (`themes.css`),
one JS module (`theme-switcher.js`), one new gallery page, and a
parametrization (not a rewrite) of the existing contrast-audit script.

## Complexity Tracking

*No violations — table intentionally omitted.*

## Scale/Scope Batching Decision (research.md, Scale/Scope section)

This plan explicitly does NOT commit to shipping all 42 themes in one
monolithic implementation pass. Matching every prior multi-item
feature's (014/015/016) priority-tier sequencing:

- **P1 (MVP)**: the architecture itself (token migration, parametrized
  contrast audit, gallery page, persistence) + the current single
  existing palette re-expressed as the "light" default theme (a pure
  refactor — existing visual regression baselines MUST stay
  byte-identical, proving zero visual change) + 4-5 first NEW themes
  (one per mood family from research.md R3), proving the full pipeline
  end-to-end for genuinely additional themes, not just the default.
- **P2-P4**: the remaining ~37 themes in batches of ~10-12, each batch
  re-running the same parametrized contrast audit and the representative-
  sample visual check (not a full 48-component re-verification per
  batch).
- All batches ship within this same feature's scope — this is a
  sequencing decision for `/speckit-tasks`, not a scope reduction.
