# Implementation Plan: Feedback & Data Display Primitives

**Branch**: `015-feedback-data-display-primitives` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/015-feedback-data-display-primitives/spec.md`

## Summary

Ship ten new static HTML + Tailwind components closing genuine gaps found
against a 10-major-design-system comparison (shadcn/ui, Radix UI, Material
UI, Ant Design, Chakra UI, Mantine, Carbon, Polaris, Primer, Fluent 2),
across four priority tiers: foundational feedback/layout primitives
(Spinner, AspectRatio, Indicator, DataList), form/progress primitives
(Slider, Stepper, File Input), Timeline, and the highest-risk tier
(Stat/Metric Card, PinInput — the only component needing new interaction
script). Research (R1-R8) resolved every technical unknown empirically:
Slider reuses Progress's exact fill/track pairing (6.38:1, same two
colors); `accent-color` (universally supported) styles the native range
thumb rather than vendor-prefixed pseudo-elements; Indicator needs only
plain relative/absolute positioning, not Anchor Positioning; AspectRatio
and DataList need no new CSS classes; File Input's drag-and-drop is
explicitly scoped to static-visual-only, with real DnD JS deferred; and
Stepper's decorative connector line reuses this project's already-accepted
low-contrast-decorative-border exception (the same one Card/Divider/List
already rely on) rather than being treated as a new violation.

## Technical Context

**Language/Version**: HTML5, Tailwind CSS (existing project version), vanilla JavaScript (ES modules) only where JS is genuinely required

**Primary Dependencies**: This repo's existing scaffold only — Vite, Tailwind config, Playwright, `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`, `tests/e2e/a11y-helper.ts`. No new dependency added.

**Storage**: N/A

**Testing**: Playwright visual regression at 320/768/1024/1440px + axe-core zero-violations, matching every prior static-component feature; new keyboard-navigation assertions per R8 (Slider arrow/Home/End, PinInput auto-advance/paste-split/Backspace-retreat, File Input focusability)

**Target Platform**: Same browser matrix as every prior feature (Chromium/Firefox/WebKit, visual baselines generated on `ubuntu-latest` via `update-snapshots.yml`)

**Project Type**: Static multi-page Vite site — ten new co-located component directories under `src/components/`, no new project structure

**Performance Goals**: N/A beyond existing bundle budgets; Spinner/AspectRatio/Indicator/DataList/Slider/Stepper/Timeline/Stat introduce zero JavaScript; File Input needs one small `change`-event listener (filename display, no CSS-only equivalent exists — a `/speckit-analyze` finding, see plan Scale/Scope)

**Constraints**: Zero new client-side dependency; every new color/contrast pairing empirically verified rather than assumed; NEVER use inline `style="..."` attributes anywhere (this project's CSP silently blocks them — the hard lesson from feature 014's R12); PinInput is the only component requiring a genuinely new JS module

**Scale/Scope**: 10 components across 4 user stories (P1: Spinner, AspectRatio, Indicator, DataList; P2: Slider, Stepper, File Input; P3: Timeline; P4: Stat/Metric Card, PinInput); 2 new JS modules (`pin-input.js` — paste-splitting/auto-advance; `file-input.js` — filename display, small `change`-event listener, added after a `/speckit-analyze` finding caught that spec.md's "selected filename is visible" requirement has no CSS-only implementation); zero new design tokens (every color pairing reuses already-ratified tokens)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Every component reuses this catalog's existing visual vocabulary (Progress's fill/track for Slider, Pagination's active pairing for Stepper, Card/typography for Stat, Empty State's compositional precedent for DataList) — no new visual language introduced | PASS |
| II. Absolute Semantic Accessibility (WCAG 2.2 AAA) | Zero axe-core violations required for all ten; every new contrast pairing empirically verified (R1: reuses 6.38:1, R7: 7.90:1 completed-segment / 1.24:1 decorative-only upcoming-segment, matching the already-accepted decorative-border exception) | PASS |
| III. Tailwind-Only Architecture (Zero Parallel CSS) | All ten styled via `@apply` blocks or plain utilities; `accent-color` (R2) and `aspect-ratio` (R5) are standard CSS properties Tailwind's own utilities already expose | PASS |
| IV. Design Token Discipline (Zero Hardcoding) | Zero new tokens — every color pairing reuses already-ratified tokens (`brand-dark`, `neutral-200`, existing border-radius scale) | PASS |
| V. Interactive State Completeness | Slider (focus-visible via native `:focus-visible`, disabled), File Input (focus-visible, disabled), PinInput (focus-visible per box, disabled) — no `hover:` variant is declared for any of the three, matching TextInput's own established no-hover precedent for native form controls in this catalog | PASS |
| VI. Project Language Policy | English-only markup/copy, matching every prior feature | PASS |
| VII. Autonomous Skill Acquisition Protocol | No new external library/tool introduced; PinInput's paste-splitting technique is documented in research.md (R4) as this project's own applied knowledge | PASS |

No violations — Complexity Tracking section is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/015-feedback-data-display-primitives/
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
│   ├── spinner/spinner.html
│   ├── aspect-ratio/aspect-ratio.html
│   ├── indicator/indicator.html
│   ├── data-list/data-list.html
│   ├── slider/slider.html
│   ├── stepper/stepper.html
│   ├── file-input/file-input.html
│   ├── timeline/timeline.html
│   ├── stat-card/stat-card.html
│   └── pin-input/pin-input.html
├── scripts/
│   ├── pin-input.js        # NEW — paste-splitting/auto-advance/Backspace-retreat
│   └── file-input.js       # NEW — small change-event listener for filename display
└── styles/tailwind.css     # new @apply blocks (AspectRatio/DataList need none — R5)

tests/e2e/
├── spinner.spec.ts
├── aspect-ratio.spec.ts
├── indicator.spec.ts
├── data-list.spec.ts
├── slider.spec.ts
├── stepper.spec.ts
├── file-input.spec.ts
├── timeline.spec.ts
├── stat-card.spec.ts
└── pin-input.spec.ts
```

**Structure Decision**: Mirrors every prior static-component feature exactly
(006/007/011/012/014's `src/components/<name>/<name>.html` convention,
registered in `vite.config.ts`'s `rollupOptions.input` and the `index.html`
gallery). No new top-level directories. `pin-input.js` and `file-input.js`
are the two new scripts; every other component ships zero JavaScript.

## Complexity Tracking

*No violations — table intentionally omitted.*
