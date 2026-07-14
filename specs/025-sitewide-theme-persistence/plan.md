# Implementation Plan: Sitewide Theme Selector & Persistence

**Branch**: `025-sitewide-theme-persistence` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/025-sitewide-theme-persistence/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Roll out feature 017's already-shipped theme-activation script
(`theme-switcher.js`) and feature 021's already-shipped selector-
population script (`gallery-theme-selector.js`) to all 77 static
component demo pages currently missing them — verified directly (not
assumed): only `index.html` and `theme-gallery.html` of 78 static
gallery pages currently load `theme-switcher.js`, so every other page
silently ignores the persisted theme and shows no selector at all.
This is a mechanical, uniform rollout (same 2 `<head>`-level script
tags + the same `<select>` markup block, copied verbatim per page) —
zero new theming logic, zero new persistence mechanism, zero new
selector-population code.

## Technical Context

**Language/Version**: Vanilla ES modules (matches every existing
static page), zero new build tooling.

**Primary Dependencies**: None new — reuses `src/scripts/
theme-switcher.js` and `src/scripts/gallery-theme-selector.js`
verbatim, both already shipped (features 017/021).

**Storage**: `localStorage` under the existing `pds-theme` key
(feature 017) — no new storage mechanism.

**Testing**: Playwright — a new cross-page navigation spec
(`tests/e2e/sitewide-theme-persistence.spec.ts`) verifying the theme
persists across a representative sample of pages, plus a template
verification that every static page includes both required elements.

**Target Platform**: Web — the static HTML gallery only (root
`index.html` + all `src/components/**/*.html` pages). The React
package's test harness (`tests/react-harness/*.html`) is explicitly
out of scope (spec.md Assumptions) — internal Playwright testing
infrastructure, not user-facing documentation.

**Performance Goals**: No regression to first-paint timing —
`theme-switcher.js` already runs synchronously before first paint on
the 2 pages that have it today; adding the identical script tag to 77
more pages doesn't change its per-page cost.

**Constraints**: Zero new npm dependency (Principle VII not
triggered); zero new design tokens (Principle IV); the `<head>` script
tag MUST be placed in the exact same position `index.html` already
uses (before any other script, immediately after the stylesheet
`<link>`) so the "before first paint" guarantee (FOUC prevention)
holds identically everywhere.

**Scale/Scope**: 77 static HTML files edited (2 script tags + one
`<select>`+`<label>` block, mechanically identical per file), 2
existing scripts reused verbatim (zero changes), 1 new Playwright spec
file. No new components, no new shared modules.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Reuses `index.html`'s existing selector placement/styling verbatim on every page — no new visual pattern, no inconsistency risk | PASS |
| II. Absolute Semantic Accessibility (WCAG AAA) | The `<select>` + `<label>` markup is copied byte-for-byte from `index.html`'s already-AAA-verified selector — no new accessibility surface to re-verify from scratch | PASS |
| III. Tailwind-Only Architecture | No new CSS — reuses `index.html`'s existing `.form-select` class | PASS |
| IV. Design Token Discipline | Zero new tokens | PASS |
| V. Interactive State Completeness | The selector's hover/focus states are inherited from the already-ratified `.form-select` class, unchanged | PASS |
| VI. Project Language Policy | Code/docs in English; chat responses in PT-BR | PASS |
| VII. Autonomous Skill Acquisition Protocol | Not triggered — zero new dependencies | PASS (not triggered) |

No violations — Complexity Tracking intentionally omitted. The only
notable risk is pure execution scale (77 files), not architectural
complexity — flagged for the tasks phase to sequence as a small number
of large, mechanically-identical batches rather than 77 individually
bespoke tasks.

## Project Structure

### Documentation (this feature)

```text
specs/025-sitewide-theme-persistence/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md         # Phase 1 output (/speckit-plan command)
├── contracts/            # Phase 1 output (/speckit-plan command)
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/components/**/*.html   # 77 files — each gets:
                            #   1. <script type="module" src="/src/scripts/
                            #      theme-switcher.js"> added to <head>,
                            #      immediately after the stylesheet <link>
                            #   2. The theme <select>+<label> block (copied
                            #      from index.html) added to the page,
                            #   3. <script type="module" src="/src/scripts/
                            #      gallery-theme-selector.js"> added before
                            #      </body>, matching index.html's placement

tests/e2e/
└── sitewide-theme-persistence.spec.ts  # cross-page persistence + a
                                          # representative-sample template
                                          # check across component categories
```

**Structure Decision**: No new source directories — this feature only
edits existing static HTML files to include already-shipped scripts
and markup. No shared module, no new script, no new component.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally omitted.
