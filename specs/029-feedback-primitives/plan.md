# Implementation Plan: Feedback Primitives

**Branch**: `029-feedback-primitives` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/029-feedback-primitives/spec.md`

## Summary

Ship 4 of feature 018's 5 Feedback-category candidates — RingProgress,
SemiCircleProgress, Notification Center, Password Strength Meter —
the 5th (Notification) excluded per a verified de-duplication finding
(Toast's existing `.toast-stack` already covers it). RingProgress/
SemiCircleProgress are SVG-based circular progress indicators sharing
one mechanism; Notification Center composes existing Indicator +
Dropdown Menu; Password Strength Meter reuses Progress's existing
fill/track visual mechanism.

## Technical Context

**Language/Version**: TypeScript 5.x / vanilla JS, matching this
catalog's existing stack

**Primary Dependencies**: None new — reuses existing Progress (`.progress-track`/`.progress-fill`
+ CSSOM-assignment script pattern, since this project's CSP `style-src
'self'` blocks inline `style="..."` attributes — verified directly in
`src/scripts/progress.js`), Indicator (`.indicator-wrapper`/
`.indicator-*`), and Dropdown Menu (native Popover API,
`popovertarget`/`popover="auto"`)

**Storage**: N/A — Notification Center's demo uses static sample data,
no new persistence (FR-002, spec.md Assumptions)

**Testing**: Playwright (visual + a11y across all 6 browser/viewport
projects), `npm run audit:tokens`/`audit:contrast`, matching every
prior feature's convention

**Target Platform**: Static HTML site + React package, both surfaces

**Project Type**: Web design system (dual-surface), existing
structure unchanged

**Performance Goals**: N/A — presentational primitives; RingProgress's
SVG arc updates are a one-time CSSOM assignment on mount, not a
continuous animation loop

**Constraints**: FR-006 (spec.md) — zero new color tokens; FR-007 —
no state conveyed by color alone (progress value, strength level,
read/unread all need a text/shape equivalent)

**Scale/Scope**: 4 new components, closing 4 of 5 Feedback-category
items (the 5th explicitly de-duplicated, not silently dropped)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle IV (zero new tokens)**: PASS — RingProgress/
  SemiCircleProgress reuse existing brand/semantic colors for the
  filled arc; Notification Center reuses Indicator's existing
  semantic badge colors; Password Strength Meter reuses Progress's
  existing fill colors mapped to severity (error/warning/success),
  already-ratified tokens.
- **CSP compliance (style-src 'self')**: PASS — RingProgress's dynamic
  per-instance arc value is set via CSSOM (`element.style.strokeDashoffset
  = ...`), the same verified pattern `src/scripts/progress.js` already
  uses for Progress's fill width — never an inline `style="..."`
  attribute.
- **Dual-surface shipping convention**: PASS — all 4 ship both
  surfaces.
- **De-duplication verified, not assumed**: PASS — confirmed directly
  against `src/styles/tailwind.css`/`src/scripts/toast.js` that Toast's
  `.toast-stack` already covers the excluded "Notification" candidate
  (spec.md's own verified finding); RingProgress/SemiCircleProgress/
  Notification Center/Password Strength Meter don't appear in feature
  018's "Flagged for de-duplication review" list.
- **WCAG AAA / no color-alone signaling**: PASS — FR-007 requires a
  text equivalent for every state; verified via a real contrast audit
  run during implementation, not assumed clean by construction.

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/029-feedback-primitives/
├── plan.md              # This file
├── research.md          # Phase 0: CSSOM-arc-value pattern, de-duplication verification, scoring heuristic
├── data-model.md         # Phase 1: the 4 primitive entities
├── contracts/
│   ├── circular-progress.contract.md   # RingProgress, SemiCircleProgress
│   ├── notification-center.contract.md
│   └── password-strength-meter.contract.md
├── quickstart.md         # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── tailwind.css          # New @apply blocks: .ring-progress*, .notification-center*, .password-strength-meter*
├── scripts/
│   ├── ring-progress.js       # CSSOM strokeDashoffset assignment (progress.js's pattern)
│   └── password-strength-meter.js
└── components/
    ├── ring-progress/ring-progress.html
    ├── semi-circle-progress/semi-circle-progress.html
    ├── notification-center/notification-center.html
    └── password-strength-meter/password-strength-meter.html

packages/react/src/
├── RingProgress/RingProgress.tsx
├── SemiCircleProgress/SemiCircleProgress.tsx
├── NotificationCenter/NotificationCenter.tsx
└── PasswordStrengthMeter/PasswordStrengthMeter.tsx

tests/e2e/
└── feedback-primitives.spec.ts

tests/react-harness/
├── feedback-primitives.html
└── src/feedback-primitives-main.tsx
```

**Structure Decision**: Follows this catalog's existing per-component
convention exactly. SemiCircleProgress shares RingProgress's underlying
SVG/CSSOM mechanism (research.md) but ships as its own demo page/React
component per this catalog's one-component-one-page convention.

## Complexity Tracking

*No violations — this section is intentionally empty.*
