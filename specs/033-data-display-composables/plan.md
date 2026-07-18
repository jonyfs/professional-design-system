# Implementation Plan: Data Display Composables

**Branch**: `033-data-display-composables` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/033-data-display-composables/spec.md`

## Summary

Ship 4 of feature 018's remaining 12 Data Display candidates —
ThemeIcon, Blockquote, BackgroundImage, Watermark — the 4 flagged
with the simplest buildability signal ("trivial CSS composition").
The other 5 remaining candidates (genuinely new patterns) and 2
already-deferred items (TreeTable, QRCode) stay explicitly out of
scope, bringing the category from 4/16 to 8/16. Zero new design
tokens or dependencies — every primitive is pure composition of
already-ratified tokens (Badge/Avatar's color-and-size conventions,
existing typography, the existing backdrop-overlay convention).

## Technical Context

**Language/Version**: TypeScript 5.x / vanilla JS, matching this
catalog's existing stack

**Primary Dependencies**: None new — reuses existing Badge/Avatar
color-and-size tokens, existing typography classes, and the CSSOM
background-image assignment pattern `progress.js` established for
CSP compliance

**Storage**: N/A — all 4 primitives are stateless composition

**Testing**: Playwright (visual + a11y across all 6 browser/viewport
projects), `npm run audit:tokens`/`audit:contrast`, matching every
prior feature's convention

**Target Platform**: Static HTML site + React package, both surfaces

**Project Type**: Web design system (dual-surface), existing
structure unchanged

**Performance Goals**: N/A — presentational primitives, no continuous
computation

**Constraints**: FR-006 (spec.md) — zero new tokens; Watermark's
`data:` SVG background needs the `img-src 'self' data:;` CSP variant
already established by Avatar/Card/List/Aspect Ratio, not the generic
per-page template's CSP

**Scale/Scope**: 4 new components, bringing feature 018's Data
Display category from 4/16 to 8/16 (8 remaining items explicitly
deferred to a future feature or already out of scope, documented)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle IV (zero new tokens)**: PASS — ThemeIcon reuses Badge's
  exact per-color opacity/ring values (plus Alert's `info` value and
  Button's `brand` pair, all already-ratified); Blockquote/
  BackgroundImage/Watermark reuse existing typography/neutral/overlay
  tokens verbatim.
- **CSP compliance**: PASS — BackgroundImage/Watermark's dynamically-
  computed `background-image` values use CSSOM assignment, never
  inline `style="..."`; both demo pages use the `img-src 'self'
  data:;` CSP variant already established by this catalog's other
  `data:`-URI-using pages (verified directly, not the generic template
  assumed sufficient).
- **Dual-surface shipping convention**: PASS — all 4 ship both
  surfaces.
- **De-duplication verified, not assumed**: PASS — none of the 4 items
  appear in feature 018's "Flagged for de-duplication review" list.
- **WCAG AAA**: PASS — BackgroundImage's scrim and Watermark's
  low-opacity layer are both verified via a real contrast audit
  against their respective foreground content during implementation.

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/033-data-display-composables/
├── plan.md              # This file
├── research.md          # Phase 0: batch-scoping rationale, token-reuse verification
├── data-model.md         # Phase 1: the 4 entity shapes
├── contracts/
│   ├── theme-icon-blockquote.contract.md
│   └── background-image-watermark.contract.md
├── quickstart.md         # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── tailwind.css          # New @apply blocks: .theme-icon*, .blockquote*, .background-image*, .watermark*
├── scripts/
│   ├── background-image.js
│   └── watermark.js           # ThemeIcon/Blockquote need no new script (pure CSS)
└── components/
    ├── theme-icon/theme-icon.html
    ├── blockquote/blockquote.html
    ├── background-image/background-image.html   # img-src 'self' data: CSP variant
    └── watermark/watermark.html                  # img-src 'self' data: CSP variant

packages/react/src/
├── ThemeIcon/ThemeIcon.tsx
├── Blockquote/Blockquote.tsx
├── BackgroundImage/BackgroundImage.tsx
└── Watermark/Watermark.tsx

tests/e2e/
└── data-display-composables.spec.ts

tests/react-harness/
├── data-display-composables.html
└── src/data-display-composables-main.tsx
```

**Structure Decision**: Follows this catalog's existing per-component
convention. `background-image.html`/`watermark.html` use the
`img-src 'self' data:;` CSP variant (matching Avatar/Card/List/Aspect
Ratio) instead of the generic per-page template, since both need a
`data:`-sourced image.

## Complexity Tracking

*No violations — this section is intentionally empty.*
