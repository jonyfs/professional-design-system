# Implementation Plan: Overlays — Modal, Slide-over, Toast

**Branch**: `main` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-overlays-modal-toast/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship three production-grade overlay primitives (Modal, Slide-over, Toast),
completing the Overlays, Modals & Feedback section of the Component
Catalog. This is the first feature in the project requiring JavaScript:
Principle II mandates focus trapping and focus-return for Modal/Slide-over,
which pure CSS cannot express. Phase 0 research (below) resolves this by
choosing the native HTML `<dialog>` element — which provides focus
trapping, Escape-to-close, and focus-return natively, in every target
browser, with zero hand-rolled focus-trap logic — needing only two small
event listeners (open via `showModal()`, backdrop-click detection) rather
than a general-purpose focus-trap library.

## Technical Context

**Language/Version**: HTML5, Tailwind CSS 3.4.x (existing scaffold),
vanilla JS (ES2022) — the first use of custom JS in this project, scoped
narrowly to what native `<dialog>` doesn't provide for free (see research.md).

**Primary Dependencies**: None new — reuses the existing Vite/Tailwind/
Playwright/audit-script scaffold from features 001/002. No focus-trap
library, no framework: native `<dialog>` covers the hard part.

**Storage**: N/A

**Testing**: Same Playwright visual regression (320/768/1024/1440,
Chrome/Firefox/Safari) + `@axe-core/playwright` pattern as features
001/002, plus new keyboard-navigation assertions (Tab-cycle containment,
Escape-close, focus-return) that exercise the actual browser's native
`<dialog>` behavior rather than mocking it. Linux baselines generated via
`update-snapshots.yml` `workflow_dispatch` only, per the established
lesson from feature 001's CI incident.

**Target Platform**: Web — current stable evergreen browsers (Chrome,
Firefox, Safari, Edge), responsive 320px–1920px. `<dialog>` with
`showModal()` is supported in all four (Safari since 15.4). Same as
features 001/002.

**Project Type**: Single-project static frontend component library
(unchanged — no new structure beyond three new component files and,
for the first time, one small shared JS file).

**Performance Goals**: Same CSS bundle budget as prior features (<15kb
gzipped). New: the JS file must stay minimal — target <1kb gzipped, since
it does only `showModal()`/backdrop-click wiring, not a general framework.

**Constraints**: Same as features 001/002 (Tailwind-only *styling*
architecture — Principle III governs CSS, not behavior scripting; zero raw
palette classes; full interactive state coverage; English-only artifacts).

**Scale/Scope**: 3 primitives (Modal, Slide-over, Toast), single feature
slice, reuses all existing styling/testing tooling, adds one small JS file.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Requirement | Status |
|------|-----------|-------------|--------|
| G1 | II — Absolute Semantic Accessibility (AAA) | AAA text contrast; **explicit focus-management mandate**: "modals and slide-overs MUST trap keyboard focus within the active element and return it to the original trigger on close" | PASS — resolved via native `<dialog>`/`showModal()` (see research.md), which implements this natively per the HTML spec in every target browser. Verified, not assumed, in Phase 0. |
| G2 | III — Tailwind-Only Architecture | No parallel `.css`; `@layer components` for shared classes | PASS — Principle III governs styling, not behavior scripting. The new `scripts/overlay.js` (or similar) contains zero CSS; all visual states remain pure Tailwind, consistent with every prior feature. |
| G3 | IV — Design Token Discipline | Zero raw palette classes | PASS — enforced by the existing `scripts/audit-tokens.mjs`, no changes anticipated (verify in Phase 1 data-model, not assumed, per this project's own precedent of catching exactly this kind of gap late in features 001/002). |
| G4 | V — Interactive State Completeness (Button/Link scope) | Any `<button>`/`<a>` inside these overlays (triggers, close buttons) still needs the full hover/active/focus-visible/disabled set | PASS — trigger and close buttons reuse the existing `.btn-primary`/`.btn-secondary` classes from feature 001, not a new button style. |
| G5 | VI — Project Language Policy | English artifacts, PT-BR agent chat | PASS |
| G6 | VII — Autonomous Skill Acquisition | No new external skill/library needed — native `<dialog>` requires no dependency | PASS |

No violations requiring `Complexity Tracking` justification — introducing
minimal vanilla JS is a requirement of Principle II itself (focus trapping),
not a design choice made without justification, and native `<dialog>`
minimizes the amount of new code to the smallest set that satisfies it.

## Project Structure

### Documentation (this feature)

```text
specs/003-overlays-modal-toast/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   ├── modal.contract.md
│   ├── slide-over.contract.md
│   └── toast.contract.md
└── tasks.md               # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root, additions only — existing scaffold unchanged)

```text
src/
├── components/
│   ├── modal/modal.html          # new
│   ├── slide-over/slide-over.html # new
│   └── toast/toast.html          # new
└── scripts/
    ├── overlay.js                 # new — showModal()/backdrop-click wiring for Modal/Slide-over
    └── toast.js                   # new — dismiss-button wiring for Toast (separate: no dialog/focus-trap semantics)
tests/e2e/
├── modal.spec.ts                  # new
├── slide-over.spec.ts             # new
└── toast.spec.ts                  # new
```

**Structure Decision**: Extends features 001/002's structure exactly — one
standalone HTML page per component, one Playwright spec per component,
linked from the existing gallery `index.html`. Adds a single new
`src/scripts/` directory for the first (and, per Principle III, the only
sanctioned kind of) JS this project ships: behavior wiring, never styling.

## Complexity Tracking

*No entries — no Constitution Check violations. Introducing JS is a
Principle II requirement, not an unjustified complexity addition, and is
scoped to the minimum native `<dialog>` doesn't cover for free.*
