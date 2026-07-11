# Implementation Plan: React Port — Batch 2 (Remaining Static Components)

**Branch**: `013-react-port-batch-2` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/013-react-port-batch-2/spec.md`

## Summary

Port the ten remaining static HTML + Tailwind components (Pagination,
Sidebar, Navbar, Avatar, Card, List, Table, Alert, Combobox, Command
Palette) to `packages/react/`, following feature 009's established
porting methodology exactly. Seven are pure prop-driven markup
translations (User Story 1); Alert needs a simple dismiss-callback
prop (User Story 2); Combobox and Command Palette need real hooks
(`useCombobox`, `useCommandPalette`) mirroring `useDropdownMenu`'s
architecture, with Command Palette directly reusing the existing
`useDialogTrigger` hook rather than re-deriving dialog-close logic.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (this package's pinned
version)

**Primary Dependencies**: `packages/react`'s existing build (tsup +
Tailwind), Playwright + axe-core (via the shared test harness pattern
established in feature 004/009)

**Storage**: N/A

**Testing**: Playwright against `tests/react-harness/` — visual
regression parity with each static reference, axe-core zero-violations,
and interaction tests for Combobox/Command Palette (filter, keyboard
nav, global shortcut)

**Target Platform**: Same browser matrix as every prior feature
(Chromium/Firefox/WebKit)

**Project Type**: Monorepo package addition (`packages/react/`) plus
test harness entries — no new project structure

**Performance Goals**: N/A beyond existing bundle budgets

**Constraints**: Zero new visual/interaction capability beyond each
static reference (spec FR-008); `useId()` for any per-instance
identifier, never a hardcoded/module counter value visible across
instances in a way that could collide (FR-007)

**Scale/Scope**: 10 components across 4 user stories; 2 new hooks
(`useCombobox`, `useCommandPalette`); 1 reused hook (`useDialogTrigger`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Pure port — no new hierarchy, reuses each static reference's existing hierarchy | PASS |
| II. Absolute Semantic Accessibility (WCAG AAA) | Zero axe-core violations required for every ported component, matching each static reference's own baseline | PASS |
| III. Tailwind-Only Architecture | React components apply existing `@apply`-generated classes via `className`; `packages/react/src/styles.css` already independently builds these (feature 004's established two-build pattern) — no new CSS | PASS |
| IV. Design Token Discipline | No new tokens (research.md R5) | PASS |
| V. Interactive State Completeness | Combobox/Command Palette reuse each static reference's already-ratified hover/focus-visible/active states verbatim | PASS |
| VI. Project Language Policy | English artifacts | PASS |
| VII. Autonomous Skill Acquisition Protocol | No new external skill/library | PASS (N/A) |

No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/013-react-port-batch-2/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── react-port-batch-2.contract.md   # consolidated, one section per component
└── tasks.md
```

### Source Code (repository root)

```text
packages/react/src/
├── Pagination/Pagination.tsx          # NEW
├── Sidebar/Sidebar.tsx                # NEW
├── Navbar/Navbar.tsx                  # NEW
├── Avatar/Avatar.tsx                  # NEW
├── Card/Card.tsx                      # NEW
├── List/List.tsx                      # NEW
├── Table/Table.tsx                    # NEW
├── Alert/Alert.tsx                    # NEW
├── Combobox/Combobox.tsx              # NEW
├── CommandPalette/CommandPalette.tsx  # NEW
├── hooks/
│   ├── useCombobox.ts                 # NEW
│   └── useCommandPalette.ts           # NEW (composes useDialogTrigger)
├── index.ts                           # MODIFIED — export all 10
└── styles.css                        # MODIFIED — add any missing @apply blocks
                                        #  (most already exist from static features)

tests/react-harness/src/
└── <component>-main.tsx                # NEW, one per component (10 files)

tests/e2e/
├── react-pagination.spec.ts           # NEW (×10, one per component)
```

**Structure Decision**: Extends the existing `packages/react` monorepo
package and `tests/react-harness` test app, identical to feature 009's
structure — no new top-level directories.

## Complexity Tracking

*No violations — table omitted.*
