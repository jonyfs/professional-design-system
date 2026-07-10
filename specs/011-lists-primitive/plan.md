# Implementation Plan: Lists Primitive

**Branch**: `011-lists-primitive` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-lists-primitive/spec.md`

## Summary

Ship Lists as a real, standalone static HTML + Tailwind component
(`.list`/`.list-item` primitives), closing the catalog gap flagged in
feature 006: the constitution documents a Lists pattern that was never
built, and its ratified metadata text token (`text-neutral-500`, 4.83:1)
fails WCAG AAA. This feature builds the component and corrects the token
at the source to `text-neutral-600` (7.56:1 AAA, verified via the WCAG
relative-luminance formula — research.md R1), reusing the already-shipped
Avatar component verbatim for the avatar slot.

## Technical Context

**Language/Version**: TypeScript 5.x tooling, plain HTML5 + vanilla
markup for the component itself (no client-side JS needed — Lists has
no interactive behavior beyond native `<a>` hover/focus states)

**Primary Dependencies**: Vite (build/dev server), Tailwind CSS 3.x
(`@apply`-only component classes), Playwright (visual regression +
accessibility), axe-core (via `tests/e2e/a11y-helper.ts`)

**Storage**: N/A (static markup, no data layer)

**Testing**: Playwright (`tests/e2e/list.spec.ts`) — visual regression at
320/768/1024/1440px, axe-core zero-violations for both read-only and
interactive states, keyboard-navigation assertion for the interactive
variant

**Target Platform**: Static web (Chromium/Firefox/WebKit, matching every
prior feature's browser matrix)

**Project Type**: Web component library (single Vite project, static
multi-page build — Option 1 single-project structure)

**Performance Goals**: N/A beyond this project's existing bundle budgets
(no new JS, negligible CSS delta)

**Constraints**: WCAG 2.2 AAA (7:1) for all text, Tailwind-only styling
(no raw utility soup, no hardcoded colors), zero new design tokens beyond
the corrected metadata text class

**Scale/Scope**: One new component (`Lists`), 3 user stories (read-only,
interactive, trailing-action), one constitution correction

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | List rows use existing scale/weight hierarchy (title `text-sm font-semibold`, metadata `text-xs`) — no new hierarchy invented | PASS |
| II. Absolute Semantic Accessibility (WCAG AAA) | This feature's entire purpose is closing an AAA gap (4.83:1 → 7.56:1); zero axe-core violations required in both states | PASS |
| III. Tailwind-Only Architecture | `.list`/`.list-item` expressed purely via `@apply`, no parallel CSS file | PASS |
| IV. Design Token Discipline | No new tokens — reuses `neutral-600`, `neutral-50`, `neutral-200`, Avatar's existing classes verbatim | PASS |
| V. Interactive State Completeness | Interactive row variant defines hover, focus-visible, and active states explicitly (FR-005) | PASS |
| VI. Project Language Policy | Spec/plan/code comments in English per project convention (matching every prior feature) | PASS |
| VII. Autonomous Skill Acquisition Protocol | No new external skill/library needed — pure Tailwind + native HTML | PASS (N/A) |

No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/011-lists-primitive/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── list.contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── list/
│       └── list.html          # NEW — component demo page (3 user stories)
└── styles/
    └── tailwind.css            # MODIFIED — add .list/.list-item/.list-item-interactive
                                 #  @apply blocks; correct the Lists catalog's
                                 #  metadata token in the constitution (not this file)

tests/
└── e2e/
    └── list.spec.ts            # NEW — visual regression + a11y + keyboard nav

vite.config.ts                  # MODIFIED — register `list` in rollupOptions.input
index.html                      # MODIFIED — add Lists card to the gallery
```

**Structure Decision**: Single-project static site (Option 1), identical
to every prior static-component feature (e.g. feature 006). No new
directories beyond the one component folder; no backend, no mobile
target, no new build tooling.

## Complexity Tracking

*No violations — table omitted.*
