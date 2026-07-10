# Implementation Plan: Fix Popover Panel Positioning (Dropdown Menu, Combobox)

**Branch**: `main` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-fix-popover-positioning/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Fix a real, previously-undiscovered positioning bug in two already-shipped
components: Dropdown Menu's panel (feature 005 + its feature 009 React
port) and Combobox's listbox (feature 008) don't visually anchor to their
trigger/input, because promoting an element to the browser's top layer
(via the Popover API) resets its `position: absolute` containing block to
the viewport instead of its DOM ancestor. Fixed using the CSS Anchor
Positioning API (`anchor-name`/`position-anchor`/`anchor()`), confirmed
via direct testing to be natively supported in all three of this
project's target Playwright browser engines (research.md R1) — no JS
fallback needed. Each affected component gets a unique per-instance
anchor name (research.md R3, mirroring feature 009's `useId()`-based
Accordion group-name fix) and a new bounding-box-adjacency test assertion
(FR-004) so this exact bug class cannot silently regress again.

## Technical Context

**Language/Version**: CSS Anchor Positioning API (native, no new
dependency); minimal JS additions to `dropdown-menu.js`/`combobox.js`
(a per-instance anchor-name counter) and `useDropdownMenu.ts` (a
`useId()`-derived anchor-name, sanitized to a valid CSS custom-ident).

**Primary Dependencies**: None new — pure CSS + a few lines of existing-
module JS.

**Storage**: N/A

**Testing**: Existing Playwright visual-regression + axe-core pattern,
extended with a new bounding-box-adjacency assertion per fixed component
(research.md "Testing Strategy"). Linux baselines regenerated via
`update-snapshots.yml` only if any existing screenshot's pixel content
actually changes (expected: no change, verified via `cmp`).

**Target Platform**: Same evergreen browser matrix as every prior
feature (Chrome, Firefox, Safari) — CSS Anchor Positioning support
confirmed empirically in all three (research.md R1).

**Project Type**: Bug-fix touching existing static components
(`src/styles/tailwind.css`, `src/scripts/dropdown-menu.js`,
`src/scripts/combobox.js`) and the existing React port
(`packages/react/src/styles.css`, `packages/react/src/hooks/
useDropdownMenu.ts`) — no new components, no new files beyond test
additions.

**Performance Goals**: N/A — CSS Anchor Positioning is a native browser
mechanism with no additional runtime cost beyond the existing Popover
API usage already ratified.

**Constraints**: Same Principles II/III/IV/V as every prior feature
apply unchanged — this fix touches positioning only, introduces no new
color/spacing tokens, and changes no interactive state.

**Scale/Scope**: 2 components fixed (Dropdown Menu static + React,
Combobox static), 0 new files besides test/baseline additions, 0 new
design tokens.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Requirement | Status |
|------|-----------|-------------|--------|
| G1 | II — Absolute Semantic Accessibility (AAA) | No ARIA/keyboard/focus behavior changes; positioning-only fix | PASS — research.md R4 confirms zero interaction-logic changes needed. |
| G2 | III — Tailwind-Only Architecture | `anchor()`/`anchor-name`/`position-anchor` aren't expressible as Tailwind utilities — plain CSS properties alongside the existing `@apply` block | PASS — consistent with existing precedent (`::backdrop`, `group-open:` already mix `@apply` with plain CSS in this project's `@layer components` blocks). |
| G3 | IV — Design Token Discipline | Zero new tokens | PASS — positioning mechanism change only (research.md, spec.md FR-006). |
| G4 | V — Interactive State Completeness | No new interactive elements introduced | PASS — N/A, no new elements. |
| G5 | VI — Project Language Policy | English artifacts, PT-BR agent chat | PASS |
| G6 | (informational) | Whether CSS Anchor Positioning is mature enough across the target browser matrix | Resolved in research.md R1: confirmed via direct `CSS.supports()` testing against this project's actual Playwright browser engines (Chromium, Firefox, WebKit) — all three report full support. |
| G7 | (informational) | Whether a single hardcoded `anchor-name` is sufficient | Resolved in research.md R3: no — a unique per-instance anchor-name is required to avoid the same multi-instance collision class already found and fixed for Accordion's native group name in feature 009. |

No violations requiring `Complexity Tracking` justification.

## Project Structure

### Documentation (this feature)

```text
specs/010-fix-popover-positioning/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   ├── dropdown-menu-positioning.contract.md
│   └── combobox-positioning.contract.md
└── tasks.md               # Phase 2 output (/speckit-tasks command)
```

No `data-model.md` — this is a CSS/layout correctness fix with no new
data entities.

### Source Code (repository root, modifications only — no new components)

```text
src/styles/tailwind.css              # MODIFIED — .dropdown-menu-panel,
                                      # .combobox-listbox: anchor() positioning
src/scripts/dropdown-menu.js         # MODIFIED — per-instance anchor-name assignment
src/scripts/combobox.js              # MODIFIED — per-instance anchor-name assignment
packages/react/src/styles.css        # MODIFIED — .dropdown-menu-panel: anchor() positioning
packages/react/src/hooks/
  useDropdownMenu.ts                 # MODIFIED — useId()-derived anchor-name assignment
tests/e2e/dropdown-menu.spec.ts      # MODIFIED — new bounding-box-adjacency assertion
tests/e2e/combobox.spec.ts           # MODIFIED — new bounding-box-adjacency assertion
tests/e2e/react-dropdown-menu.spec.ts # MODIFIED — new bounding-box-adjacency assertion
```

**Structure Decision**: Pure modification of existing files — no new
component directories, no new harness pages, no new `vite.config.ts`
entries. Both the static and React Dropdown Menu paths are fixed
together since they share the same root cause; Combobox's React port
doesn't exist yet (feature 008 is static-only), so only its static path
is touched.

## Complexity Tracking

*No entries — no Constitution Check violations.*
