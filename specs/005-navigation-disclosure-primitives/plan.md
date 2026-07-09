# Implementation Plan: Navigation & Disclosure Primitives

**Branch**: `main` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-navigation-disclosure-primitives/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship four navigation/disclosure primitives (Breadcrumbs, Accordion/
Disclosure, Tabs, Dropdown Menu) as static HTML + Tailwind, opening the
Navigation & Disclosure section of the Component Catalog and moving this
project toward broader Tailwind UI coverage. Continues the "native element
first" philosophy established by Modal/Slide-over's `<dialog>` in feature
003: Accordion uses native `<details>`/`<summary>` (zero JS), Breadcrumbs
needs zero JS (pure semantic markup), and Dropdown Menu adopts the native
Popover API for its open/close/light-dismiss/top-layer behavior (research.md
R1) — the same relationship `<dialog>` had to Modal. Only Tabs and a small
sliver of Dropdown Menu (arrow-key roving focus, `aria-expanded` sync) need
new JS, because no native element covers the WAI-ARIA Tabs/Menu keyboard
patterns (research.md R2). React porting is explicitly out of scope (FR-014)
— reserved for a future feature, matching the sequencing already used for
features 001-003's eventual port in feature 004.

## Technical Context

**Language/Version**: HTML5, Tailwind CSS 3.4.x (existing scaffold),
vanilla JS (ES2022) — reuses the JS pattern established in feature 003
(`overlay.js`/`toast.js`), extended with two new small modules.

**Primary Dependencies**: None new — reuses the existing Vite/Tailwind/
Playwright/audit-script scaffold from features 001-003. No component
library, no focus-trap/positioning dependency: native `<details>` and the
native Popover API cover the two hardest interaction requirements for
free (research.md R1).

**Storage**: N/A

**Testing**: Same Playwright visual regression (320/768/1024/1440,
Chrome/Firefox/Safari) + `@axe-core/playwright` pattern as every prior
feature, plus new keyboard-navigation assertions specific to each
component (arrow-key roving focus for Tabs and Dropdown Menu, Escape/
outside-click dismissal for Dropdown Menu, native disclosure toggling for
Accordion). Linux baselines generated via `update-snapshots.yml`
`workflow_dispatch` only, per the established lesson from feature 001's CI
incident (research.md R4).

**Target Platform**: Web — current stable evergreen browsers (Chrome,
Firefox, Safari), responsive 320px–1920px. `<details>`/`<summary>` and the
Popover API are both Baseline "Widely available" across all three engines
(research.md R1). Same baseline as features 001-004.

**Project Type**: Single-project static frontend component library
(unchanged — four new component files, two new small JS files, no new
tooling).

**Performance Goals**: Same CSS bundle budget as prior features (<15kb
gzipped). New JS stays minimal — `tabs.js` and `dropdown-menu.js` combined
target <1.5kb gzipped (roving-tabindex/keydown wiring only, same order of
magnitude as feature 003's `overlay.js`).

**Constraints**: Same as every prior feature (Tailwind-only *styling*
architecture — Principle III governs CSS, not behavior scripting; zero raw
palette classes; full interactive state coverage; English-only artifacts;
no React port — FR-014).

**Scale/Scope**: 4 primitives (Breadcrumbs, Accordion/Disclosure, Tabs,
Dropdown Menu), single feature slice, reuses all existing styling/testing
tooling, adds two small JS files (`tabs.js`, `dropdown-menu.js`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Requirement | Status |
|------|-----------|-------------|--------|
| G1 | II — Absolute Semantic Accessibility (AAA) | AAA text contrast; mandatory ARIA state attributes (`aria-expanded`, `aria-selected`, `aria-current`, etc.); focus management | PASS — Tabs implements the full WAI-ARIA Tabs pattern (`aria-selected`, `aria-controls`, roving `tabindex`); Dropdown Menu syncs `aria-expanded` on the trigger via the popover's native `toggle` event; Breadcrumbs' current item uses `aria-current="page"` per the constitution's own pre-existing Breadcrumbs catalog entry (research.md R3). `/speckit-analyze` caught a real focus-management gap: Dropdown Menu's first draft assumed the Popover API restores focus to the trigger natively on every closing path (Escape, outside-click, selection), the same unverified-native-restoration mistake this project already learned from once with `<dialog>` in feature 003 (where WebKit didn't restore focus natively, unlike Chromium/Firefox). Fixed by having `dropdown-menu.js` explicitly call `trigger.focus()` on the popover's closed transition, not left to an unverified assumption. Will be confirmed by real Playwright keyboard-navigation + axe-core assertions during implementation, not assumed from spec text alone, same discipline as feature 003. |
| G2 | III — Tailwind-Only Architecture | No parallel `.css`; `@layer components` for shared classes | PASS — `tabs.js`/`dropdown-menu.js` contain zero CSS; all visual states remain pure Tailwind `@layer components` classes, consistent with `overlay.js`/`toast.js`'s precedent. |
| G3 | IV — Design Token Discipline | Zero raw palette classes | PASS — verified explicitly in research.md R3 (not assumed): all four components render entirely within the already-ratified Base Semantic Palette. `scripts/audit-tokens.mjs`/`scripts/check-contrast.mjs` run unmodified against the new component files; no new tokens, no script changes needed for this feature. |
| G4 | V — Interactive State Completeness | Every interactive `<button>`/`<a>` (tab, breadcrumb link, dropdown trigger/item) needs the full hover/active/focus-visible/disabled state set unconditionally, using the literal `disabled:opacity-50 disabled:cursor-not-allowed` pattern | PASS — but only after **two** `/speckit-analyze` passes caught real, not just hypothetical, gaps. Pass 1 (post-planning): FR-013 originally hedged with "where applicable," letting `.tab-trigger` ship with no `active:`/`disabled:` and `.dropdown-menu-item` ship with `focus-visible:outline-none` (silently dropping the mandated outline for a bg highlight alone). Pass 2 (pre-implementation, after tasks.md existed): caught that `.breadcrumb-link` (a literal `<a>`) was never actually fixed by Pass 1's FR-013 tightening — still explicitly exempted via the same forbidden hedge — and that `.tab-trigger`/`.dropdown-menu-item`'s new `disabled:` declarations used a custom color-only treatment instead of the literal `opacity-50`/`cursor-not-allowed` pattern every one of this project's 8 existing disabled declarations uses without exception, with no `Complexity Tracking` entry justifying the deviation. All fixed: `.breadcrumb-link` now declares `active:`; `disabled:` is deliberately NOT added to it, since Tailwind's `disabled:` variant targets the `:disabled` pseudo-class, which cannot match an `<a>` under any circumstance — a technical impossibility, not a scope hedge (the unreachable-ancestor case is handled by the already-established `.breadcrumb-current` non-interactive-span pattern instead); `.tab-trigger`/`.dropdown-menu-item` now use the literal `opacity-50`/`cursor-not-allowed` pattern. `<summary>` (Accordion's trigger) sits outside Principle V's literal `<button>`/`<a>` scope — declared hover/active/focus-visible states anyway per the principle's intent, with the formal scope question deferred to this feature's own planned post-implementation constitution amendment (data-model.md). |
| G5 | VI — Project Language Policy | English artifacts, PT-BR agent chat | PASS |
| G6 | (informational — no single principle governs a runtime API choice directly) | Whether the Popover API counts as a "dependency" requiring justification | Native Popover API needs no dependency and no Principle VII skill-adoption review (it is a browser API, not an external skill/library) — same reasoning already applied to `<dialog>` in feature 003's G6. |

No violations requiring `Complexity Tracking` justification — the two new
JS modules are the minimum surface not covered by native elements
(WAI-ARIA Tabs keyboard model, Dropdown Menu's roving focus + `aria-expanded`
sync), verified in research.md R1/R2 rather than assumed, mirroring
feature 003's Modal/Slide-over precedent exactly.

## Project Structure

### Documentation (this feature)

```text
specs/005-navigation-disclosure-primitives/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   ├── breadcrumbs.contract.md
│   ├── accordion.contract.md
│   ├── tabs.contract.md
│   └── dropdown-menu.contract.md
└── tasks.md               # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root, additions only — existing scaffold unchanged)

```text
src/
├── components/
│   ├── breadcrumbs/breadcrumbs.html   # new
│   ├── accordion/accordion.html       # new
│   ├── tabs/tabs.html                 # new
│   └── dropdown-menu/dropdown-menu.html # new
├── scripts/
│   ├── tabs.js                        # new — roving-tabindex/arrow-key wiring
│   └── dropdown-menu.js               # new — aria-expanded sync + arrow-key
│                                       #       roving focus (Popover API handles
│                                       #       open/close/light-dismiss natively)
└── styles/tailwind.css                # MODIFIED — new @layer components classes
                                        # (breadcrumb-*, accordion-*, tab-*,
                                        # dropdown-menu-*)
index.html                             # MODIFIED — gallery links to the 4 new pages
tests/e2e/
├── breadcrumbs.spec.ts                # new
├── accordion.spec.ts                  # new
├── tabs.spec.ts                       # new
└── dropdown-menu.spec.ts              # new
```

**Structure Decision**: Extends features 001-003's structure exactly — one
standalone HTML page per component, one Playwright spec per component,
linked from the existing gallery `index.html`. Adds two new files to the
existing `src/scripts/` directory (no new directory needed — the pattern
was already established in feature 003). No `packages/react/` changes —
React porting is explicitly out of scope for this feature (FR-014).

## Complexity Tracking

*No entries — no Constitution Check violations. The two new JS modules are
each the minimum surface not covered by a native element, verified in
research.md rather than assumed, mirroring feature 003's precedent.*
