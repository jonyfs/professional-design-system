# Implementation Plan: Application Shell Primitives

**Branch**: `main` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-application-shell-primitives/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship three application-shell primitives (Pagination, Sidebar, Navbar) as
static HTML + Tailwind, completing the constitution's existing (partially
ratified-but-never-implemented) Application & Navigation catalog section
and adding a new Pagination pattern. All three ship with **zero**
JavaScript (research.md R1) — Navbar's mobile menu reuses Accordion's
exact native `<details>`/`<summary>` mechanism rather than the Popover API
or custom JS, since no light-dismiss/floating-positioning requirement
exists for a menu that pushes content down. React porting is explicitly
out of scope (FR-011).

## Technical Context

**Language/Version**: HTML5, Tailwind CSS 3.4.x (existing scaffold) — no
JavaScript at all in this feature (a first among the static-HTML
features since 003 introduced JS; even 001-002's primitives needed none,
but 003/005/006 each added at least one JS module).

**Primary Dependencies**: None new — reuses the existing Vite/Tailwind/
Playwright/audit-script scaffold from features 001-006.

**Storage**: N/A

**Testing**: Same Playwright visual regression (320/768/1024/1440,
Chrome/Firefox/Safari) + `@axe-core/playwright` pattern as every prior
feature. Linux baselines via `update-snapshots.yml` `workflow_dispatch`
only. New component pages added to `vite.config.ts`'s
`rollupOptions.input` as part of implementation (features 005/006's
established discipline).

**Target Platform**: Web — current stable evergreen browsers (Chrome,
Firefox, Safari), responsive 320px–1920px.

**Project Type**: Single-project static frontend component library
(unchanged — three new component files, zero new JS files).

**Performance Goals**: Same CSS bundle budget as prior features (<15kb
gzipped). No new JS budget needed at all.

**Constraints**: Same as every prior feature (Tailwind-only *styling*
architecture; zero raw palette classes; full interactive state coverage;
English-only artifacts; no React port — FR-011).

**Scale/Scope**: 3 primitives (Pagination, Sidebar, Navbar), single
feature slice, reuses all existing styling/testing tooling, adds zero new
JS files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Requirement | Status |
|------|-----------|-------------|--------|
| G1 | II — Absolute Semantic Accessibility (AAA) | AAA text contrast; `aria-current`; genuinely disabled Previous/Next controls | PASS — but only after research.md R3 found **two** real, previously-undiscovered gaps in the ratified Sidebar pattern by computing exact contrast ratios rather than assuming already-ratified text is correct: `bg-brand text-white` (active item) measures 4.83:1, failing AAA — the exact gap Button primary already avoids via `brand-dark`; and `text-neutral-400` on `bg-neutral-900` (dark-treatment resting text) measures 6.99:1, failing AAA by a hair. Both corrected before implementation (`bg-brand-dark text-white`; `text-neutral-300`) and will be folded into the constitution amendment, not left as silent local fixes. |
| G2 | III — Tailwind-Only Architecture | No parallel `.css`; `@layer components` for shared classes | PASS — zero JavaScript this feature, so no behavior/styling split to police; all visual states remain pure Tailwind `@layer components` classes. |
| G3 | IV — Design Token Discipline | Zero raw palette classes | PASS — every token used (`brand-dark`, `neutral-300`/`700`/`800`/`900`, `white`) is already ratified; no new color tokens introduced (research.md R2-R3). |
| G4 | V — Interactive State Completeness | Pagination's Previous/Next need genuinely-disabled states using the literal `disabled:opacity-50 disabled:cursor-not-allowed` pattern (FR-010, learned directly from features 005/006's repeated `/speckit-analyze`-caught deviations) | PASS — Previous/Next are native `<button disabled>` elements (not styled `<a>` — `<a>` has no native disabled state, the same technical constraint established for Breadcrumbs in feature 005), using the literal pattern from the first draft, not a custom color substitute this time. |
| G5 | VI — Project Language Policy | English artifacts, PT-BR agent chat | PASS |
| G6 | (informational) | Whether Navbar's mobile menu needs a new JS mechanism | Resolved in research.md R1: reuses Accordion's exact native `<details>`/`<summary>` mechanism — no new JS, no Popover API needed (no light-dismiss requirement for a menu that pushes content down rather than floating). |

No violations requiring `Complexity Tracking` justification.

## Project Structure

### Documentation (this feature)

```text
specs/007-application-shell-primitives/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   ├── pagination.contract.md
│   ├── sidebar.contract.md
│   └── navbar.contract.md
└── tasks.md               # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root, additions only — existing scaffold unchanged)

```text
src/
├── components/
│   ├── pagination/pagination.html  # new
│   ├── sidebar/sidebar.html        # new
│   └── navbar/navbar.html          # new
└── styles/tailwind.css             # MODIFIED — new @layer components classes
                                     # (pagination-*, sidebar-*, navbar-*)
index.html                          # MODIFIED — gallery links to the 3 new pages
vite.config.ts                      # MODIFIED — 3 new rollupOptions.input entries
tests/e2e/
├── pagination.spec.ts              # new
├── sidebar.spec.ts                 # new
└── navbar.spec.ts                  # new
```

**Structure Decision**: Extends features 001-006's structure exactly —
one standalone HTML page per component, one Playwright spec per
component, linked from the existing gallery `index.html` AND registered
as a `vite.config.ts` build input. No `src/scripts/` additions (zero JS
this feature) and no `packages/react/` changes (FR-011).

## Complexity Tracking

*No entries — no Constitution Check violations.*
