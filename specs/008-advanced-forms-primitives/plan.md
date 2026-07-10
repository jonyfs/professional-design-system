# Implementation Plan: Advanced Forms Primitives

**Branch**: `main` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-advanced-forms-primitives/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship two form-interaction primitives (Combobox, Command Palette) as
static HTML + Tailwind, completing the "implemente todos os 3 acima"
catalog-expansion scope (after 006-data-display-primitives and
007-application-shell-primitives). Both require custom JavaScript — the
third and fourth JS modules this project has shipped, after `tabs.js`/
`dropdown-menu.js` (feature 005). Combobox is a from-scratch WAI-ARIA 1.2
combobox (research.md R1 — `<datalist>` verified insufficient) using the
Popover API for its listbox panel (R2, reusing Dropdown Menu's mechanism).
Command Palette reuses Modal's `<dialog>`/`showModal()` chrome verbatim
(R3) plus this project's first document-level global keyboard shortcut.
Neither introduces a new design token (R4) or a new contrast-verification
surface for match-highlighting (R5 — weight change, not a new color).
React porting is explicitly out of scope (FR-013, reserved for feature
009 alongside the feature 005 React port).

## Technical Context

**Language/Version**: HTML5, Tailwind CSS 3.4.x (existing scaffold),
vanilla ES module JavaScript (`src/scripts/combobox.js`,
`src/scripts/command-palette.js`) — this project's third and fourth JS
modules after `tabs.js`/`dropdown-menu.js` (feature 005); 001-002/007
needed none, 003 introduced the first (`overlay.js`/`toast.js`).

**Primary Dependencies**: None new — reuses the existing Vite/Tailwind/
Playwright/audit-script scaffold from features 001-007, plus the Popover
API (already used by Dropdown Menu) and `<dialog>`/`showModal()` (already
used by Modal/Slide-over).

**Storage**: N/A — both components' example datasets are static, hardcoded
arrays (Assumptions in spec.md).

**Testing**: Same Playwright visual regression (320/768/1024/1440,
Chrome/Firefox/Safari) + `@axe-core/playwright` pattern as every prior
feature, plus keyboard-navigation and global-shortcut assertions
(research.md "Testing Strategy"). Linux baselines via
`update-snapshots.yml` `workflow_dispatch` only. New component pages
added to `vite.config.ts`'s `rollupOptions.input` as part of
implementation (established discipline since features 005-007).

**Target Platform**: Web — current stable evergreen browsers (Chrome,
Firefox, Safari), responsive 320px–1920px.

**Project Type**: Single-project static frontend component library
(unchanged — two new component files, two new JS modules).

**Performance Goals**: Same CSS bundle budget as prior features (<15kb
gzipped). Both new JS modules are small, dependency-free vanilla scripts,
consistent with every existing `src/scripts/*.js` file's footprint.

**Constraints**: Same as every prior feature (Tailwind-only *styling*
architecture; zero raw palette classes; full interactive state coverage;
English-only artifacts; no React port — FR-013).

**Scale/Scope**: 2 primitives (Combobox, Command Palette), single feature
slice, reuses all existing styling/testing tooling, adds 2 new JS files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Requirement | Status |
|------|-----------|-------------|--------|
| G1 | II — Absolute Semantic Accessibility (AAA) | WAI-ARIA 1.2 combobox roles; AAA text contrast; keyboard operability (arrow keys, Enter, Escape) | PASS — research.md R1 confirms `<datalist>` cannot satisfy this gate at all (no ARIA roles, no axe-core-inspectable internals); the from-scratch combobox exposes `role="combobox"`/`listbox`/`option` directly. R5 sidesteps a new contrast-verification surface entirely by using a weight change (not a new color) for match-highlighting. |
| G2 | III — Tailwind-Only Architecture | No parallel `.css`; `@layer components` for shared classes | PASS — all visual states are pure Tailwind `@layer components` classes; the two new JS modules handle behavior only (filtering, keyboard nav, focus/ARIA syncing), never styling, matching `tabs.js`/`dropdown-menu.js`'s existing behavior/style split. |
| G3 | IV — Design Token Discipline | Zero raw palette classes | PASS — research.md R4 verifies explicitly against the ratified Base Semantic Palette that every pairing needed (`neutral-900`/`600`/`100`/`50`/`300`, `brand` for focus rings) already exists; zero new tokens. |
| G4 | V — Interactive State Completeness | Every interactive element needs hover/active/focus-visible states; disabled options need a real skip/dim treatment | PASS — reuses Dropdown Menu's exact item-state treatment (`hover:bg-neutral-50`, `active:bg-neutral-100`) verbatim for both components' option/action rows; disabled options use `aria-disabled="true"` + `opacity-50` (research.md R4/spec.md Edge Cases — the literal `disabled:` Tailwind variant cannot apply to a non-form-control element serving as a listbox option, the same class of constraint Breadcrumbs' current-item `<span>` already established in feature 005). |
| G5 | VI — Project Language Policy | English artifacts, PT-BR agent chat | PASS |
| G6 | (informational) | Whether Command Palette's global shortcut collides with any existing JS module's keydown handling | Resolved in research.md R3: verified, not assumed — every existing keydown listener in this project is element-scoped (`tabs.js` on the tablist, `dropdown-menu.js` per-popover), none calls `stopPropagation()`, so a new document-level listener is safe. A guard against opening while another `<dialog open>` already exists is added regardless. |

No violations requiring `Complexity Tracking` justification.

## Project Structure

### Documentation (this feature)

```text
specs/008-advanced-forms-primitives/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   ├── combobox.contract.md
│   └── command-palette.contract.md
└── tasks.md               # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root, additions only — existing scaffold unchanged)

```text
src/
├── components/
│   ├── combobox/combobox.html            # new
│   └── command-palette/command-palette.html  # new
├── scripts/
│   ├── combobox.js                       # new — filtering, arrow-key nav,
│   │                                      # aria-activedescendant, Popover API wiring
│   ├── command-palette.js                # new — global Cmd/Ctrl+K shortcut,
│   │                                      # filtering, arrow-key nav, calls
│   │                                      # overlay.js's wireDialogClose(dialog)
│   └── overlay.js                        # MODIFIED — extracts wireDialogClose(dialog)
│                                          # (backdrop-click-close + WebKit-safe
│                                          # close-time refocus) out of
│                                          # initDialogTriggers()'s per-trigger loop,
│                                          # so command-palette.js can call it for
│                                          # its trigger-less dialog too (research.md
│                                          # R3, /speckit-analyze finding I1) — no
│                                          # behavior change for existing Modal/
│                                          # Slide-over callers
└── styles/tailwind.css                   # MODIFIED — new @layer components classes
                                           # (combobox-*, command-palette-*)
index.html                                # MODIFIED — gallery links to the 2 new pages
vite.config.ts                            # MODIFIED — 2 new rollupOptions.input entries
scripts/check-contrast.mjs                # MODIFIED — 2 new PAIRINGS entries (R4)
tests/e2e/
├── combobox.spec.ts                      # new
└── command-palette.spec.ts               # new
```

**Structure Decision**: Extends features 001-007's structure exactly —
one standalone HTML page per component, one Playwright spec per
component, linked from the existing gallery `index.html` AND registered
as a `vite.config.ts` build input. Two new `src/scripts/` modules (this
project's 3rd and 4th JS files) since both components require real
interaction logic no native element/CSS-only pattern can cover. No
`packages/react/` changes (FR-013).

## Complexity Tracking

*No entries — no Constitution Check violations.*
