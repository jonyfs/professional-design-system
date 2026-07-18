# Implementation Plan: Layout & Structure Primitives

**Branch**: `028-layout-structure-primitives` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/028-layout-structure-primitives/spec.md`

## Summary

Ship the 9 Layout & Structure primitives from feature 018's inventory
(Stack, Group, Center, Container, Paper, Grid, SimpleGrid, Flex,
AppShell) — the only inventory category still at 0/9. All 9 are
presentational, reuse this catalog's existing token set with zero new
design tokens, and ship dual-surface (static HTML + React) per this
catalog's established convention. AppShell composes the existing
Navbar and Sidebar components rather than reimplementing their
responsive/collapse behavior.

## Technical Context

**Language/Version**: TypeScript 5.x / vanilla JS (static surface),
matching this catalog's existing stack

**Primary Dependencies**: None new — reuses existing Tailwind
utility/token conventions (`space-y-*`, `gap-*`, flex utilities,
existing `max-w-*`/padding scale, Card's surface/shadow tokens, CSS
Grid) and this catalog's existing Navbar/Sidebar components for
AppShell

**Storage**: N/A

**Testing**: Playwright (visual regression across the 4 standard
breakpoints + axe-core accessibility checks), `npm run audit:tokens`
(zero new/raw Tailwind classes), matching every prior feature's
convention

**Target Platform**: Static HTML site (`src/`) + React package
(`packages/react/`), both surfaces

**Project Type**: Web design system (dual-surface), existing
structure unchanged

**Performance Goals**: N/A — presentational primitives with no
runtime logic beyond AppShell's reuse of Sidebar's existing mobile
collapse script

**Constraints**: FR-006 (spec.md) — zero new spacing/breakpoint/
radius/shadow/color tokens; 100% reuse of the existing ratified set

**Scale/Scope**: 9 new components (8 presentational primitives + 1
composition primitive), closing feature 018's Layout & Structure
category from 0/9 to 9/9

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle IV (zero new tokens)**: PASS — every primitive maps to
  an already-ratified token per research.md R1's per-primitive
  mapping table; verified against `shared/design-tokens.ts` and
  `src/styles/tailwind.css` directly, not assumed.
- **Dual-surface shipping convention**: PASS — all 9 ship both static
  HTML and React surfaces, matching the convention established by
  every feature since 019 (Chart remains the catalog's sole
  documented React-only exception; this feature introduces no new
  exception).
- **No de-duplication conflict**: PASS — re-verified against feature
  018's own "Flagged for de-duplication review" list (NativeSelect,
  SegmentedControl, CloseButton, Burger, Drawer) — none of this
  batch's 9 appear there.
- **AppShell composition, not reimplementation**: PASS — FR-004/SC-004
  require AppShell to reuse Navbar/Sidebar's existing responsive
  logic verbatim; verified in research.md R5 against those
  components' actual current implementation, not assumed compatible.
- **WCAG AAA where feasible**: PASS — no new colors are introduced, so
  no new contrast surface exists; verified via a full `check-contrast.mjs`
  run against a working build during implementation, not assumed
  clean by construction alone.

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/028-layout-structure-primitives/
├── plan.md              # This file
├── research.md          # Phase 0: per-primitive token mapping, AppShell composition contract, static-HTML shipping decision
├── data-model.md         # Phase 1: the 9 Layout Primitive entities + AppShell Region
├── contracts/
│   ├── spacing-primitives.contract.md   # Stack, Group, Center
│   ├── surface-primitives.contract.md   # Container, Paper
│   ├── grid-primitives.contract.md      # Grid, SimpleGrid, Flex
│   └── app-shell.contract.md            # AppShell
├── quickstart.md         # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── tailwind.css          # New @apply blocks: .stack, .group-row, .center, .container-page, .paper, .grid-responsive, .simple-grid, .flex-row/.flex-col, .app-shell-*
└── components/
    ├── stack/stack.html
    ├── group/group.html
    ├── center/center.html
    ├── container/container.html
    ├── paper/paper.html
    ├── grid/grid.html
    ├── simple-grid/simple-grid.html
    ├── flex/flex.html
    └── app-shell/app-shell.html      # Composes existing navbar/sidebar markup

packages/react/src/
├── Stack/Stack.tsx
├── Group/Group.tsx
├── Center/Center.tsx
├── Container/Container.tsx
├── Paper/Paper.tsx
├── Grid/Grid.tsx
├── SimpleGrid/SimpleGrid.tsx
├── Flex/Flex.tsx
└── AppShell/AppShell.tsx             # Composes existing Navbar/Sidebar React components

tests/e2e/
└── layout-structure-primitives.spec.ts   # Visual regression + a11y across all 9, all 6 browser/viewport projects

tests/react-harness/
├── layout-structure-primitives.html
└── src/layout-structure-primitives-main.tsx
```

**Structure Decision**: Follows this catalog's existing per-component
convention exactly (one `src/components/<name>/<name>.html` + one
`packages/react/src/<Name>/<Name>.tsx` per primitive, no new
top-level directories). AppShell is the one primitive with
cross-component dependencies (Navbar, Sidebar) — its contract
explicitly documents which existing pieces it composes rather than
reimplements.

## Complexity Tracking

*No violations — this section is intentionally empty.*
