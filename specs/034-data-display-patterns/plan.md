# Implementation Plan: Data Display Patterns

**Branch**: `034-data-display-patterns` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/034-data-display-patterns/spec.md`

## Summary

Ship the 5 remaining "new pattern" candidates from feature 018's Data
Display category (deliberately deferred by feature 033) —
OverflowList, RollingNumber, PickList/Transfer, Gallery, Compare —
bringing the category from 8/16 to 13/16, its practical ceiling
without absorbing TreeTable's Data Table dependency or QRCode's new
client-side dependency. Each composes an already-established mechanism
(List, Modal's `<dialog>`, the native `<input type="range">`, the
rAF-throttle pattern) with exactly 2 genuinely new techniques:
`ResizeObserver`-driven measurement and rAF-driven value tweening.

## Technical Context

**Language/Version**: TypeScript 5.x / vanilla JS, matching this
catalog's existing stack

**Primary Dependencies**: None new — reuses existing List
(`.list`/`.list-row`), Modal's `<dialog>` + `overlay.js` mechanism,
Slider's native `<input type="range">` + `.slider` class, ActionIcon's
`.action-icon` classes, and the rAF-throttle pattern already
established for scroll listeners

**Storage**: N/A — all 5 primitives are stateless/caller-controlled

**Testing**: Playwright (visual + a11y across all 6 browser/viewport
projects), `npm run audit:tokens`/`audit:contrast`, matching every
prior feature's convention

**Target Platform**: Static HTML site + React package, both surfaces

**Project Type**: Web design system (dual-surface), existing
structure unchanged

**Performance Goals**: OverflowList's ResizeObserver callback and
RollingNumber's rAF tween are both bounded, self-terminating
operations (fixed measurement pass / fixed-duration animation), not
continuous/unbounded loops

**Constraints**: FR-007 (spec.md) — zero new tokens; FR-008 — PickList/
Gallery/Compare must be fully keyboard-operable (RollingNumber is
display-only and exempt per spec.md)

**Scale/Scope**: 5 new components, bringing feature 018's Data
Display category from 8/16 to 13/16

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle IV (zero new tokens)**: PASS — every primitive reuses
  existing brand/semantic/neutral tokens; OverflowList's chip styling
  matches Badge's neutral variant, PickList reuses List/Checkbox/
  ActionIcon verbatim, Gallery reuses Modal's dialog geometry pattern,
  Compare reuses Slider's exact `.slider` class.
- **CSP compliance**: PASS — RollingNumber's `textContent` update
  needs no style assignment at all; Compare's `clip-path`/divider
  `left` are set via CSSOM, never inline `style="..."`.
- **Dual-surface shipping convention**: PASS — all 5 ship both
  surfaces.
- **Single-mechanism-per-behavior discipline**: PASS — Gallery reuses
  Modal's exact `<dialog>` focus-trap (no second implementation);
  Compare reuses the native range input's built-in keyboard/clamping
  behavior (no custom drag/keyboard layer); PickList reuses List's
  exact row markup (no new list-rendering mechanism).
- **De-duplication verified, not assumed**: PASS — none of the 5 items
  appear in feature 018's "Flagged for de-duplication review" list.
- **WCAG AAA / keyboard operability**: PASS — FR-008 requires PickList/
  Gallery/Compare to be fully keyboard-operable; verified via real
  Playwright keyboard-navigation tests during implementation, not
  assumed clean by construction.

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/034-data-display-patterns/
├── plan.md              # This file
├── research.md          # Phase 0: mechanism-reuse verification per primitive
├── data-model.md         # Phase 1: the 5 entity shapes
├── contracts/
│   ├── overflow-list.contract.md
│   ├── rolling-number.contract.md
│   ├── pick-list.contract.md
│   ├── gallery.contract.md
│   └── compare.contract.md
├── quickstart.md         # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── tailwind.css          # New @apply blocks per contract
├── scripts/
│   ├── overflow-list.js
│   ├── rolling-number.js
│   ├── pick-list.js
│   ├── gallery.js
│   └── compare.js
└── components/
    ├── overflow-list/overflow-list.html
    ├── rolling-number/rolling-number.html
    ├── pick-list/pick-list.html
    ├── gallery/gallery.html                   # img-src 'self' data:; CSP variant
    └── compare/compare.html                    # img-src 'self' data:; CSP variant

packages/react/src/
├── OverflowList/OverflowList.tsx
├── RollingNumber/RollingNumber.tsx
├── PickList/PickList.tsx
├── Gallery/Gallery.tsx
└── Compare/Compare.tsx

tests/e2e/
└── data-display-patterns.spec.ts

tests/react-harness/
├── data-display-patterns.html
└── src/data-display-patterns-main.tsx
```

**Structure Decision**: Follows this catalog's existing per-component
convention. `gallery.html`/`compare.html` use the `img-src 'self'
data:;` CSP variant (matching Avatar/Card/List/Aspect Ratio/feature
033's BackgroundImage/Watermark) since both need `data:`-sourced
placeholder images.

## Complexity Tracking

*No violations — this section is intentionally empty.*
