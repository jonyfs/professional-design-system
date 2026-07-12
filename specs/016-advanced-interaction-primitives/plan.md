# Implementation Plan: Advanced Interaction Primitives

**Branch**: `016-advanced-interaction-primitives` | **Date**: 2026-07-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/016-advanced-interaction-primitives/spec.md`

## Summary

Ship four new static HTML + Tailwind components closing the next tier of
genuine gaps from the "Known Catalog Gaps" list ratified in constitution
v1.12.0: TreeView, Rating (read-only), Menubar, and ColorPicker/ColorInput.
Each reuses an already-ratified mechanism rather than inventing a new one —
confirmed empirically in Phase 0, not assumed: TreeView is recursively
nested native `<details>/<summary>` (verified via Chromium's real
accessibility tree: role `DisclosureTriangle`, correct independent
`expanded` state per instance, correct `level` property from `<ul>/<li>`
nesting — zero ARIA needed); Rating's star glyphs reuse `text-warning`/
`text-neutral-300` as a decorative-only pairing (real value conveyed via
text, matching the already-accepted decorative-element exception used by
Stepper/Timeline's connector lines); Menubar composes Dropdown Menu's
existing `initDropdownMenus()` verbatim (zero changes) with one new small
module (`src/scripts/menubar.js`) adding only the roving-tabindex-between-
top-level-triggers layer adapted from Tabs' pattern; ColorInput is a
native `<input type="color">` (confirmed via Playwright across all three
target engines: `border`/`border-radius`/`box-shadow` all apply
consistently to the input's own box) styled to match TextInput's ring
treatment, explicitly rejecting a custom JS color-swatch picker as
unnecessary complexity for what the native element already solves.

## Technical Context

**Language/Version**: HTML5, Tailwind CSS (existing project version), vanilla JavaScript (ES modules) only where JS is genuinely required

**Primary Dependencies**: This repo's existing scaffold only — Vite, Tailwind config, Playwright, `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`, `tests/e2e/a11y-helper.ts`. No new dependency added.

**Storage**: N/A

**Testing**: Playwright visual regression at 320/768/1024/1440px + axe-core zero-violations, matching every prior static-component feature; new keyboard-navigation assertions per research (TreeView's Enter/Space-on-summary, Menubar's Left/Right/Down/Enter/Escape, ColorInput's Tab-reachability/focus-visible)

**Target Platform**: Same browser matrix as every prior feature (Chromium/Firefox/WebKit, visual baselines generated on `ubuntu-latest` via `update-snapshots.yml`)

**Project Type**: Static multi-page Vite site — four new co-located component directories under `src/components/`, no new project structure

**Performance Goals**: N/A beyond existing bundle budgets; TreeView, Rating, and ColorInput introduce zero JavaScript; Menubar needs one small new module (`src/scripts/menubar.js`) layered on top of the already-shipped, unmodified `dropdown-menu.js`

**Constraints**: Zero new client-side dependency; every new color/contrast pairing empirically verified rather than assumed; NEVER use inline `style="..."` attributes anywhere (this project's CSP silently blocks them — the lesson from feature 014's R12, reapplied in feature 015); Menubar's per-trigger `anchor-name` MUST use the same `anchorCounter` CSSOM-assignment pattern already proven in `dropdown-menu.js`/`combobox.js`, never a new idiom

**Scale/Scope**: 4 components across 4 user stories (P1: TreeView; P2: Rating; P3: Menubar; P4: ColorPicker/ColorInput); 1 new JS module (`menubar.js` — roving-tabindex-between-triggers plus auto-open-adjacent-panel-on-arrow-navigate behavior); zero new design tokens (Rating's star color reuses the already-ratified `warning`/`neutral-300` tokens, justified as a decorative-only pairing per research R2)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Every component reuses this catalog's existing visual vocabulary (Accordion's disclosure chrome for TreeView, Card/typography for Rating, Dropdown Menu's panel chrome for Menubar, TextInput's ring treatment for ColorInput) — no new visual language introduced | PASS |
| II. Absolute Semantic Accessibility (WCAG 2.2 AAA) | Zero axe-core violations required for all four; TreeView's native semantics confirmed via real Chromium accessibility-tree inspection (R1); Rating's star glyphs are `aria-hidden` decorative reinforcement of a real-text value, not the sole information carrier | PASS |
| III. Tailwind-Only Architecture (Zero Parallel CSS) | All four styled via `@apply` blocks or plain utilities; Rating's whole/empty star technique avoids SVG clip-path/gradient hacks entirely (R2) | PASS |
| IV. Design Token Discipline (Zero Hardcoding) | Zero new tokens — Rating reuses `text-warning`/`text-neutral-300` (already-ratified), justified as the same class of accepted decorative-only exception as Stepper/Timeline's connector lines (R2) | PASS |
| V. Interactive State Completeness | Menubar (focus-visible on triggers, roving tabindex, Escape-return-focus via reused `dropdown-menu.js` toggle listener), ColorInput (focus-visible, disabled) ship the states this catalog's established pattern requires; TreeView/Rating are non-interactive beyond native `<details>` toggling (no additional state suffixes apply) | PASS |
| VI. Project Language Policy | English-only markup/copy, matching every prior feature | PASS |
| VII. Autonomous Skill Acquisition Protocol | No new external library/tool introduced | PASS |

No violations — Complexity Tracking section is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/016-advanced-interaction-primitives/
├── plan.md              # This file
├── research.md          # Phase 0 output (complete)
├── data-model.md         # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks, not yet created)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── tree-view/tree-view.html
│   ├── rating/rating.html
│   ├── menubar/menubar.html
│   └── color-input/color-input.html
├── scripts/
│   └── menubar.js          # NEW — roving-tabindex between top-level triggers
│                           #   + auto-open-adjacent-panel-on-arrow-navigate
└── styles/tailwind.css      # new @apply blocks (TreeView/Rating need minimal
                              # ones for indentation/star-row layout — see
                              # contracts; ColorInput reuses TextInput's ring
                              # pattern via a small new class)

tests/e2e/
├── tree-view.spec.ts
├── rating.spec.ts
├── menubar.spec.ts
└── color-input.spec.ts
```

**Structure Decision**: Mirrors every prior static-component feature exactly
(006/007/014/015's `src/components/<name>/<name>.html` convention,
registered in `vite.config.ts`'s `rollupOptions.input` and the `index.html`
gallery). No new top-level directories. `menubar.js` is the one new script;
TreeView, Rating, and ColorInput ship zero JavaScript. `dropdown-menu.js`
itself is reused completely unmodified for Menubar's per-trigger panel
mechanics (open/close/in-panel-arrow-keys/focus-return) — confirmed during
research (R3) that its existing `anchorCounter` pattern already handles
multiple independent trigger+panel instances on one page with no changes
needed.

## Complexity Tracking

*No violations — table intentionally omitted.*
