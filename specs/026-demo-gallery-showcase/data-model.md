# Phase 1 Data Model: Demo Gallery Visual Showcase

This feature reorganizes presentation, not data — no runtime entities.
The following are structural/content entities within `index.html` and
the demo-page polish script.

## Gallery Category Section

- **id**: anchor-link target (e.g. `#forms-inputs`) for the quick-jump
  nav.
- **label**: the category's display name, reused verbatim from the
  constitution's Component Catalog section headings (research.md R1).
- **components**: the ordered list of component cards within it —
  flagship components (if any) first, then the rest in the same
  relative order `index.html` already uses today.

## Flagship Component (a flag on an existing Gallery Category entry)

- **name**: Data Table, Chart, Command Palette, or the curated theme
  system (research.md R2) — a fixed, small set, not extensible by this
  feature.
- **rationale**: the one-line "why this matters" note shown on its
  card.

## Opening Section Stat

- **claim**: a short, concrete, verifiable statement (component count,
  dual-surface guarantee, WCAG AAA commitment, theme count) —
  research.md R3. Not a data entity with a schema, just content.

## Demo Page Polish (the feature-025-style rollout unit)

- **path**: the static HTML file's location.
- **has_polish_wrapper**: boolean — whether the consistent structural
  wrapper (research.md R5) has been applied. Rollout target: false →
  true for 77 pages.
