# Implementation Plan: Micro-Interaction & Utility Primitives

**Branch**: `014-micro-interaction-primitives` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/014-micro-interaction-primitives/spec.md`

## Summary

Ship ten new static HTML + Tailwind components closing genuine gaps found
against shadcn/ui and Radix UI Primitives, across four priority tiers:
zero-JS statics (Textarea, Divider, Kbd, Skeleton), feedback primitives with
no new state machinery (Tooltip, Progress, Button Group, Empty State),
Popover (reuses Dropdown Menu's Popover-API/Anchor-Positioning mechanism
verbatim), and Context Menu (forks Dropdown Menu's JS module for
cursor-position anchoring, the one genuinely novel mechanism in this batch).
Research (R1-R9) resolved every technical unknown empirically: Progress's
fill/track pairing clears WCAG 1.4.11 at 6.38:1; Button Group ships as
native radio inputs styled as segments (zero JS, reusing Accordion's
`name`-attribute exclusivity precedent) rather than porting Tabs' custom
roving-tabindex widget; Kbd needs one new `mono` design token (none existed);
Tooltip needs zero JavaScript (CSS Anchor Positioning without the Popover
API); Context Menu's cursor anchoring is architecturally impossible via CSS
Anchor Positioning alone and requires a small, explicit divergence from
Dropdown Menu; Empty State needs no new CSS class; this feature establishes
the codebase's first `prefers-reduced-motion` handling (none existed
previously) via Tailwind's built-in `motion-reduce:` variant for Skeleton's
pulse; and, per a `/speckit-analyze` finding, Popover's viewport-edge
repositioning (a gap Dropdown Menu itself never solved) is genuinely
addressed via `position-try-fallbacks`, verified supported on all three
target engines (R8) rather than a "reuse Dropdown Menu" claim that didn't
hold up.

## Technical Context

**Language/Version**: HTML5, Tailwind CSS (existing project version), vanilla JavaScript (ES modules) only where JS is genuinely required

**Primary Dependencies**: This repo's existing scaffold only — Vite, Tailwind config, Playwright, `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`, `tests/e2e/a11y-helper.ts`. No new dependency added.

**Storage**: N/A

**Testing**: Playwright visual regression at 320/768/1024/1440px + axe-core zero-violations, matching every prior static-component feature; new keyboard-navigation assertions per R9 (Tooltip focus-visible reveal, Popover Escape/outside-click dismiss, Context Menu arrow-key roving focus + viewport-edge clamping, Button Group native radio-group keyboard behavior)

**Target Platform**: Same browser matrix as every prior feature (Chromium/Firefox/WebKit, visual baselines generated on `ubuntu-latest` via `update-snapshots.yml`)

**Project Type**: Static multi-page Vite site — ten new co-located component directories under `src/components/`, no new project structure

**Performance Goals**: N/A beyond existing bundle budgets; Skeleton/Tooltip/Divider/Kbd introduce zero JavaScript

**Constraints**: Zero new client-side dependency; every new color/contrast pairing empirically verified (R1, R2) rather than assumed; Context Menu is the only component requiring a JS module that diverges from an existing one (forked from Dropdown Menu's, per R5) rather than reusing it verbatim

**Scale/Scope**: 10 components across 4 user stories (P1: Textarea, Divider, Kbd, Skeleton; P2: Tooltip, Progress, Button Group, Empty State; P3: Popover; P4: Context Menu); 1 new design token (`mono` font stack); 2 new JS modules (Popover's content-agnostic extraction of Dropdown Menu's wiring, and Context Menu's cursor-anchoring fork)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Every component reuses this catalog's existing visual vocabulary (Button styling for Button Group segments, Card/typography for Empty State, Sidebar's active-item pairing for Progress/Button Group) — no new visual language introduced | PASS |
| II. Absolute Semantic Accessibility (WCAG 2.2 AAA) | Zero axe-core violations required for all ten; every new contrast pairing empirically verified (R1: 6.38:1 non-text, R2: 7.90:1 text, both clearing AAA/1.4.11 floors with margin) | PASS |
| III. Tailwind-Only Architecture (Zero Parallel CSS) | All ten styled via `@apply` blocks, with the same narrow plain-CSS exception this catalog already accepts for Dropdown Menu (`anchor-name`/`position-anchor`/`anchor()` properties have no `@apply`-expressible form) — Tooltip, Button Group's sibling selectors, and Popover's `position-try-fallbacks` follow that identical precedent; reduced-motion handling (R7) uses Tailwind's built-in `motion-reduce:` variant, not raw CSS | PASS |
| IV. Design Token Discipline (Zero Hardcoding) | One new token added (`mono` font stack, R3) following the existing `sans` key's exact structure; every other component reuses already-ratified tokens (`brand-dark`, `neutral-200/300`, existing border-radius scale) | PASS |
| V. Interactive State Completeness | Tooltip (hover + focus-visible), Popover (open/closed/focus-visible on trigger), Context Menu (open/closed/keyboard-roving/disabled items), Button Group (native `:checked`/`:focus-visible` per segment) — every interactive component ships hover/focus-visible/disabled states matching this project's established pattern | PASS |
| VI. Project Language Policy | English-only markup/copy, matching every prior feature | PASS |
| VII. Autonomous Skill Acquisition Protocol | No new external library/tool introduced; Context Menu's cursor-positioning technique is documented in research.md (R5) as this project's own applied knowledge, not an imported skill | PASS |

No violations — Complexity Tracking section is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/014-micro-interaction-primitives/
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
│   ├── tooltip/tooltip.html
│   ├── textarea/textarea.html
│   ├── popover/popover.html
│   ├── progress/progress.html
│   ├── divider/divider.html
│   ├── button-group/button-group.html
│   ├── skeleton/skeleton.html
│   ├── context-menu/context-menu.html
│   ├── empty-state/empty-state.html   # composition-only (R6) — no new CSS class
│   └── kbd/kbd.html
├── scripts/
│   ├── dropdown-menu.js    # existing — item-list logic stays here; its generic
│   │                       #   Popover-API/Anchor-Positioning wiring is the
│   │                       #   basis both new modules below build from
│   ├── popover.js          # NEW — generic-content variant of Dropdown Menu's
│   │                       #   open/close/anchor wiring, no fixed item list (US3)
│   └── context-menu.js     # NEW — forks Dropdown Menu's roving-focus logic;
│                            #   cursor-position anchoring instead of Anchor
│                            #   Positioning (US4, R5)
└── styles/tailwind.css     # new @apply blocks for the 9 componentized entries (Empty State excluded, R6)

shared/design-tokens.ts     # + `mono` fontFamily key (R3)

tests/e2e/
├── tooltip.spec.ts
├── textarea.spec.ts
├── popover.spec.ts
├── progress.spec.ts
├── divider.spec.ts
├── button-group.spec.ts
├── skeleton.spec.ts
├── context-menu.spec.ts
├── empty-state.spec.ts
└── kbd.spec.ts
```

**Structure Decision**: Mirrors every prior static-component feature exactly
(006/007/011/012's `src/components/<name>/<name>.html` convention, registered
in `vite.config.ts`'s `rollupOptions.input` and the `index.html` gallery).
No new top-level directories. Both Popover and Context Menu add new JS
modules; Popover's is a thin, content-agnostic variant of Dropdown Menu's
existing open/close/`aria-expanded`/Anchor-Positioning wiring (same
mechanism, no fixed item list), while Context Menu's is a genuine fork per
R5 (cursor-position anchoring, not Anchor Positioning).

## Complexity Tracking

*No violations — table intentionally omitted.*
