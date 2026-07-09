# Implementation Plan: Data Display Primitives

**Branch**: `main` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-data-display-primitives/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship three data-display primitives (Avatar, Card, Alert/Banner) as static
HTML + Tailwind, expanding the constitution's existing Data Display &
Listings catalog section (which already covers Tables/Badges/Lists) and
opening a new Card visual pattern. Avatar and Card need zero JavaScript
(pure display/layout, matching Breadcrumbs/Accordion's precedent from
feature 005); Alert/Banner's optional dismiss control needs a small new
`alert.js` module (research.md R1) — not a reuse of Toast's `toast.js`,
since Alert/Banner deliberately carries no live-region semantics (FR-011),
unlike Toast. React porting is explicitly out of scope (FR-013), matching
features 001-003/005's eventual-port sequencing.

## Technical Context

**Language/Version**: HTML5, Tailwind CSS 3.4.x (existing scaffold),
vanilla JS (ES2022) — `alert.js` is the only new JS, reusing the minimal
"find dismiss button, remove ancestor" idiom already established by
`toast.js`.

**Primary Dependencies**: None new — reuses the existing Vite/Tailwind/
Playwright/audit-script scaffold from features 001-005.

**Storage**: N/A

**Testing**: Same Playwright visual regression (320/768/1024/1440,
Chrome/Firefox/Safari) + `@axe-core/playwright` pattern as every prior
feature. Linux baselines via `update-snapshots.yml` `workflow_dispatch`
only. New component pages added to `vite.config.ts`'s
`rollupOptions.input` as part of implementation, not a follow-up fix
(research.md R5 — feature 005's real, code-review-caught gap).

**Target Platform**: Web — current stable evergreen browsers (Chrome,
Firefox, Safari), responsive 320px–1920px. Same baseline as every prior
feature.

**Project Type**: Single-project static frontend component library
(unchanged — three new component files, one new small JS file).

**Performance Goals**: Same CSS bundle budget as prior features (<15kb
gzipped). `alert.js` stays minimal (<0.5kb gzipped — dismiss-button wiring
only, smaller than `toast.js` since there's no severity-icon logic to
manage in JS).

**Constraints**: Same as every prior feature (Tailwind-only *styling*
architecture; zero raw palette classes; full interactive state coverage;
English-only artifacts; no React port — FR-013).

**Scale/Scope**: 3 primitives (Avatar, Card, Alert/Banner), single
feature slice, reuses all existing styling/testing tooling, adds one
small JS file (`alert.js`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Requirement | Status |
|------|-----------|-------------|--------|
| G1 | II — Absolute Semantic Accessibility (AAA) | AAA text contrast; dismissal removes from a11y tree; Alert/Banner perceivable without live-region semantics (FR-011) | PASS — planned tokens (research.md R2) chosen at `text-neutral-600`/`-700`/`-900` floor, applying feature 005's lesson proactively (never `text-neutral-500` for new body text) rather than discovering the same AAA failure again. To be confirmed by a real axe-core scan during implementation, not assumed from the plan alone. |
| G2 | III — Tailwind-Only Architecture | No parallel `.css`; `@layer components` for shared classes | PASS — `alert.js` contains zero CSS; all visual states remain pure Tailwind `@layer components` classes. |
| G3 | IV — Design Token Discipline | Zero raw palette classes | PASS — research.md R2-R4 verify every proposed token is already ratified (no new Base Semantic Palette entries needed); `scripts/audit-tokens.mjs`/`scripts/check-contrast.mjs` run unmodified. |
| G4 | V — Interactive State Completeness | Alert/Banner's dismiss control needs the full hover/active/focus-visible/disabled state set, using the literal `disabled:opacity-50 disabled:cursor-not-allowed` pattern (FR-012, learned directly from feature 005's two `/speckit-analyze`-caught deviations) | PASS — reuses the existing `close-icon-btn` shared class verbatim (feature 003), which already declares the full state set correctly; no new interactive element class is introduced, so there is no new surface to get wrong this time. |
| G5 | VI — Project Language Policy | English artifacts, PT-BR agent chat | PASS |
| G6 | (informational) | Whether Alert/Banner needs its own dismiss mechanism or should share Toast's | Resolved in research.md R1: a new small file, not a shared/parameterized one — semantic difference (static vs. live-region) justifies separate files, consistent with `overlay.js`/`toast.js`'s existing precedent of separation-by-semantics over code-reuse. |

No violations requiring `Complexity Tracking` justification.

## Project Structure

### Documentation (this feature)

```text
specs/006-data-display-primitives/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   ├── avatar.contract.md
│   ├── card.contract.md
│   └── alert.contract.md
└── tasks.md               # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root, additions only — existing scaffold unchanged)

```text
src/
├── components/
│   ├── avatar/avatar.html    # new
│   ├── card/card.html        # new
│   └── alert/alert.html      # new
├── scripts/
│   └── alert.js               # new — dismiss-button wiring (no live-region semantics, unlike toast.js)
└── styles/tailwind.css        # MODIFIED — new @layer components classes
                                # (avatar-*, card, alert-*)
index.html                     # MODIFIED — gallery links to the 3 new pages
vite.config.ts                 # MODIFIED — 3 new rollupOptions.input entries
tests/e2e/
├── avatar.spec.ts             # new
├── card.spec.ts               # new
└── alert.spec.ts              # new
```

**Structure Decision**: Extends features 001-005's structure exactly —
one standalone HTML page per component, one Playwright spec per
component, linked from the existing gallery `index.html` AND registered
as a `vite.config.ts` build input (the explicit fix for feature 005's
gap). No `packages/react/` changes — React porting is explicitly out of
scope for this feature (FR-013).

## Complexity Tracking

*No entries — no Constitution Check violations.*
