# Implementation Plan: Overlays

**Branch**: `032-overlays` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/032-overlays/spec.md`

## Summary

Ship 3 of feature 018's 6 Overlays-category candidates — Affix,
LoadingOverlay, Bottom Sheet — closing the category from 0% to 3/6;
the other 3 (Drawer, Dialog Manager, Popover Combobox variant) are
excluded per verified de-duplication/out-of-scope findings, not
silently dropped. Affix is genuinely new scroll-threshold pinning
infrastructure; LoadingOverlay reuses Spinner verbatim inside a new
container-scoped overlay; Bottom Sheet reuses Slide-over's exact
`<dialog>` mechanism with different anchor geometry.

## Technical Context

**Language/Version**: TypeScript 5.x / vanilla JS, matching this
catalog's existing stack

**Primary Dependencies**: None new — reuses existing Spinner
(`.spinner`/`.spinner-lg`) and Slide-over's native `<dialog>` +
`overlay.js` mechanism (`initDialogTriggers()`/`wireDialogClose()`)

**Storage**: No new persistence — Affix/LoadingOverlay state is
derived live (scroll position / caller-controlled boolean)

**Testing**: Playwright (visual + a11y across all 6 browser/viewport
projects), `npm run audit:tokens`/`audit:contrast`, matching every
prior feature's convention

**Target Platform**: Static HTML site + React package, both surfaces

**Project Type**: Web design system (dual-surface), existing
structure unchanged

**Performance Goals**: Affix uses a `requestAnimationFrame`-throttled
scroll listener (this project's performance rules against
scroll-handler churn), matching feature 031's Scroll Progress Bar/
Back-to-Top pattern

**Constraints**: FR-006 (spec.md) — zero new tokens; FR-007 —
LoadingOverlay's non-interactive state must be exposed to assistive
technology via `aria-busy`, not merely a visual overlay

**Scale/Scope**: 3 new components, closing feature 018's Overlays
category from 0% to 3/6 (3 items explicitly excluded, documented)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle IV (zero new tokens)**: PASS — every primitive reuses
  existing brand/semantic/neutral tokens.
- **CSP compliance (style-src 'self')**: PASS — Affix's per-instance
  placeholder sizing uses CSSOM assignment (`element.style.width/
  height = ...`), matching the verified pattern already established
  for dynamically-computed values; no other primitive needs any
  dynamically-computed inline style.
- **Dual-surface shipping convention**: PASS — all 3 ship both
  surfaces.
- **De-duplication verified, not assumed**: PASS — Drawer confirmed
  identical to Slide-over by reading `.slide-over-dialog`'s real CSS
  directly; Dialog Manager and Popover Combobox variant confirmed
  out-of-scope per the inventory's own notes, re-verified here.
- **Single-mechanism-per-behavior discipline**: PASS — Bottom Sheet
  reuses Slide-over's exact `<dialog>` mechanism (no second focus-trap
  implementation), matching how Slide-over itself reused Modal's
  mechanism in feature 003.
- **WCAG AAA / accessible non-interactive state**: PASS — FR-007
  requires `aria-busy` on LoadingOverlay's container, verified via a
  real contrast audit and accessibility tests during implementation.

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/032-overlays/
├── plan.md              # This file
├── research.md          # Phase 0: de-duplication findings, Affix/LoadingOverlay/Bottom Sheet decisions
├── data-model.md         # Phase 1: the 3 entity shapes
├── contracts/
│   ├── affix.contract.md
│   ├── loading-overlay.contract.md
│   └── bottom-sheet.contract.md
├── quickstart.md         # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── tailwind.css          # New @apply blocks: .affix-pinned, .loading-overlay*, .bottom-sheet-*
├── scripts/
│   ├── affix.js
│   └── loading-overlay.js    # Bottom Sheet needs no new script (reuses overlay.js)
└── components/
    ├── affix/affix.html
    ├── loading-overlay/loading-overlay.html
    └── bottom-sheet/bottom-sheet.html

packages/react/src/
├── Affix/Affix.tsx
├── LoadingOverlay/LoadingOverlay.tsx
└── BottomSheet/BottomSheet.tsx

tests/e2e/
└── overlays.spec.ts

tests/react-harness/
├── overlays.html
└── src/overlays-main.tsx
```

**Structure Decision**: Follows this catalog's existing per-component
convention exactly. Bottom Sheet's React component is textually
near-identical to `SlideOver.tsx` (only class names differ) — kept as
its own file/component rather than a parametrized variant of
`SlideOver`, matching how Slide-over itself is its own component
rather than a "Modal with a prop", since each is independently
discoverable in the gallery and contract docs.

## Complexity Tracking

*No violations — this section is intentionally empty.*
