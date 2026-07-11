# Implementation Plan: Table Primitive

**Branch**: `012-table-primitive` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/012-table-primitive/spec.md`

## Summary

Ship Table as a real, standalone static HTML + Tailwind component
(`.data-table`/`.data-table-header-cell`/`.data-table-cell` primitives), closing the
catalog gap discovered during feature 011's planning: the constitution
documents a Tables pattern that was never built. Unlike Lists, the
documented pattern's contrast is empirically correct as-is (research.md
R1) — this feature ships the component and documents that verification,
without needing a token correction.

## Technical Context

**Language/Version**: TypeScript 5.x tooling, plain HTML5 for the
component itself (no client-side JS — Table has no interactive
behavior beyond native link/Badge composition)

**Primary Dependencies**: Vite, Tailwind CSS 3.x (`@apply`-only
component classes), Playwright (visual regression + accessibility),
axe-core (via `tests/e2e/a11y-helper.ts`)

**Storage**: N/A (static markup, no data layer)

**Testing**: Playwright (`tests/e2e/table.spec.ts`) — visual regression
at 320/768/1024/1440px, axe-core zero-violations for all three variants

**Target Platform**: Static web (Chromium/Firefox/WebKit)

**Project Type**: Web component library (single Vite project, static
multi-page build — Option 1 single-project structure)

**Performance Goals**: N/A beyond existing bundle budgets (no new JS)

**Constraints**: WCAG 2.2 AAA (7:1) for all text, Tailwind-only
styling, zero new design tokens, real semantic `<table>` markup

**Scale/Scope**: One new component (`Table`), 3 user stories (baseline,
zebra-striped, trailing-action), no constitution *correction* needed
(only new documentation, since the pattern was already contrast-correct)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Header vs. cell hierarchy via existing scale/weight/case conventions — no new hierarchy invented | PASS |
| II. Absolute Semantic Accessibility (WCAG AAA) | Header (7.23:1) and cell text (16.98-17.74:1) verified AAA via research.md R1; zero axe-core violations required | PASS |
| III. Tailwind-Only Architecture | `.data-table`/`.data-table-header-cell`/`.data-table-cell` via `@apply`, no parallel CSS | PASS |
| IV. Design Token Discipline | No new tokens - reuses `neutral-50/200/600/900` verbatim | PASS |
| V. Interactive State Completeness | Trailing-action link/Badge reuse already-ratified interactive states (Badge has none; a plain `<a>` link's states are covered by this project's existing link/demo-link precedent) | PASS |
| VI. Project Language Policy | English artifacts, matching every prior feature | PASS |
| VII. Autonomous Skill Acquisition Protocol | No new external skill/library needed | PASS (N/A) |

No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/012-table-primitive/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── table.contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   └── table/
│       └── table.html          # NEW - component demo page (3 user stories)
└── styles/
    └── tailwind.css              # MODIFIED - add .data-table/.data-table-header-cell/
                                   #  .data-table-cell @apply blocks

tests/
└── e2e/
    └── table.spec.ts              # NEW - visual regression + a11y

vite.config.ts                     # MODIFIED - register `table` in rollupOptions.input
index.html                         # MODIFIED - add Table card to the gallery
```

**Structure Decision**: Single-project static site (Option 1), identical
to feature 011's Lists and every prior static-component feature.

## Complexity Tracking

*No violations - table omitted.*
