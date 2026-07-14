# Implementation Plan: Gallery Theme Selector

**Branch**: `021-gallery-theme-selector` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/021-gallery-theme-selector/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a theme-selection `<select>` (grouped by mood family via `<optgroup>`)
to `index.html`'s header so every one of the ~50 component cards on the
main gallery page restyles live when a theme is chosen — without
navigating to the separate Theme Gallery page. Zero new infrastructure:
the control reads `THEMES`/`MOOD_FAMILIES` from `shared/design-tokens.ts`
and calls the existing `selectTheme()`/`KNOWN_THEME_IDS` exports from
`src/scripts/theme-switcher.js` (feature 017) — the identical mechanism
`theme-gallery.js`'s card grid already uses, just a lighter-weight,
native-`<select>`-based control instead of a card grid, scoped to the
page that most benefits from an at-a-glance full-catalog preview.

## Technical Context

**Language/Version**: Vanilla JavaScript ES modules (matches
`src/scripts/theme-gallery.js`'s existing convention — a `.js` script
directly importing a `.ts` data module, which Vite already transpiles for
every other static-gallery script)

**Primary Dependencies**: None new — reuses `src/scripts/theme-switcher.js`
(`selectTheme`, `applyTheme`, `KNOWN_THEME_IDS`) and
`shared/design-tokens.ts` (`THEMES`, `MOOD_FAMILIES`) verbatim

**Storage**: `localStorage` key `pds-theme` — the existing key
feature 017 already established; this feature introduces no new key and
no new persistence code path (it only ever calls the existing
`selectTheme()`, never touches `localStorage` directly)

**Testing**: Playwright (`tests/e2e/gallery-theme-selector.spec.ts`, new
file, following `tests/e2e/theme-persistence.spec.ts`/`theme-gallery.spec.ts`'s
existing conventions — real `localStorage`/real page reload, not mocked)

**Target Platform**: Web — the static gallery's `index.html` only; no
change to `packages/react`, no change to any individual component's own
demo page (spec.md FR-008)

**Project Type**: Static HTML + vanilla JS addition to the existing
single-project static site (`root` Vite config)

**Performance Goals**: Theme switch reflects across every visible card
within the same paint the `data-theme` attribute change already triggers
elsewhere in this catalog — no additional work needed since every card
already uses the same CSS-custom-property mechanism

**Constraints**: Zero new theme tokens, zero new persistence mechanism
(spec.md Assumptions); control MUST NOT reload the page (FR-002/FR-007);
MUST NOT overflow at 320px (SC-004)

**Scale/Scope**: One new small JS module (or an addition to `index.html`
+ a new script file) wiring a single `<select>` with 7 `<optgroup>`s
(one per `MOOD_FAMILIES` entry) and 43 `<option>`s (one per `THEMES`
entry) — no change to the ~50 existing component-card `<section>`s
themselves

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | A single labeled `<select>` in the header is a low-footprint addition that doesn't compete with the page's primary content (the component card grid) — no new visual-hierarchy conflict | PASS |
| II. Absolute Semantic Accessibility (WCAG AAA) | Native `<select>` is keyboard-operable and labelable by construction (FR-009); reuses `.form-select`'s already-AAA-verified token pairing (Principle IV below) — no new contrast pairing introduced | PASS |
| III. Tailwind-Only Architecture | The control reuses the existing `.form-select` component class (already ratified, Forms/Validation/Inputs catalog section) — no new CSS | PASS |
| IV. Design Token Discipline | Zero new tokens — every color the control itself uses is `.form-select`'s existing ratified set; the themes it lists are pre-existing catalog data, not new tokens | PASS |
| V. Interactive State Completeness | `<select>` inherits `.form-select`'s already-complete hover/focus-visible/disabled state set verbatim — no new interactive element type introduced | PASS |
| VI. Project Language Policy | Code/docs in English; chat responses in PT-BR | PASS |
| VII. Autonomous Skill Acquisition Protocol | No new dependency, library, or skill — reuses existing in-repo modules exclusively | PASS (not applicable) |

No violations — Complexity Tracking intentionally omitted.

## Project Structure

### Documentation (this feature)

```text
specs/021-gallery-theme-selector/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html                        # add the <select> control to <header>
src/scripts/
└── gallery-theme-selector.js     # NEW — populates <optgroup>/<option>s
                                   # from THEMES/MOOD_FAMILIES, wires
                                   # change → selectTheme(), sets initial
                                   # selected value from document.
                                   # documentElement.dataset.theme (already
                                   # resolved by theme-switcher.js's
                                   # earlier <head> activation)

tests/e2e/
└── gallery-theme-selector.spec.ts  # NEW — control lists all themes,
                                     # selecting restyles cards live,
                                     # reflects theme set via the
                                     # dedicated Theme Gallery page and
                                     # vice versa, persists across
                                     # reload, no overflow at 320px
```

**Structure Decision**: Single static-site addition — one new small JS
module (`src/scripts/gallery-theme-selector.js`, sibling to the existing
`theme-gallery.js`/`theme-switcher.js`) plus a markup addition to
`index.html`'s `<header>`. No `packages/react` change, no change to any
individual component's own demo page, matching spec.md FR-008.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally omitted.
