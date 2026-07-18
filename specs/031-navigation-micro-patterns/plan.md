# Implementation Plan: Navigation Micro-Patterns

**Branch**: `031-navigation-micro-patterns` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/031-navigation-micro-patterns/spec.md`

## Summary

Ship the 5 remaining candidates from feature 018's Navigation
micro-patterns category (1/6 already shipped: Avatar Group, feature
023) — Team/Workspace Switcher, Language Switcher, Back-to-Top Button,
Scroll Progress Bar, Onboarding Tour/Coachmark — closing the category
to 6/6, the third fully-closed category after Layout & Structure
(028) and Consent & System Messaging (030). 4 of 5 are direct reuses
of Dropdown Menu/Progress/a scroll listener with zero new CSS; only
Onboarding Tour introduces genuinely new sequencing logic, reusing
Popover's positioning mechanism.

## Technical Context

**Language/Version**: TypeScript 5.x / vanilla JS, matching this
catalog's existing stack

**Primary Dependencies**: None new — reuses existing Dropdown Menu
(native Popover API + `useDropdownMenu`), Avatar (`.avatar-fallback`),
Progress (`.progress-track`/`.progress-fill` + CSSOM assignment), and
Popover (`.popover-panel` + per-instance anchor positioning)

**Storage**: No new persistence — every primitive resets to its
initial state on reload (spec.md Assumptions)

**Testing**: Playwright (visual + a11y across all 6 browser/viewport
projects), `npm run audit:tokens`/`audit:contrast`, matching every
prior feature's convention

**Target Platform**: Static HTML site + React package, both surfaces

**Project Type**: Web design system (dual-surface), existing
structure unchanged

**Performance Goals**: Scroll feedback uses one shared,
`requestAnimationFrame`-throttled listener (not per-primitive
handlers) to avoid scroll-handler churn (this project's performance
rules)

**Constraints**: FR-006 (spec.md) — zero new tokens; FR-007 — the
Onboarding Tour and Back-to-Top must be fully keyboard-operable

**Scale/Scope**: 5 new components, closing feature 018's Navigation
micro-patterns category from 1/6 to 6/6

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle IV (zero new tokens)**: PASS — every primitive reuses
  existing brand/semantic/neutral tokens; no new theme or palette
  entry.
- **CSP compliance (style-src 'self')**: PASS — Scroll Progress Bar's
  dynamic fill width uses CSSOM assignment (`element.style.width =
  ...`), the same verified pattern `progress.js` already uses; no new
  primitive needs any other dynamically-computed inline style.
- **Dual-surface shipping convention**: PASS — all 5 ship both
  surfaces.
- **Scope discipline (no silent category-absorption)**: PASS — Back-
  to-Top ships only its own minimal scroll-threshold logic, NOT a
  standalone "Affix" primitive (a different inventory category),
  mirroring feature 030's identical Countdown-Timer scoping decision.
- **De-duplication verified, not assumed**: PASS — none of the 5 items
  appear in feature 018's "Flagged for de-duplication review" list.
- **WCAG AAA / keyboard operability**: PASS — FR-007 requires the
  Onboarding Tour and Back-to-Top to be keyboard-operable; verified
  via a real contrast audit and keyboard-navigation Playwright tests
  during implementation, not assumed clean by construction.

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/031-navigation-micro-patterns/
├── plan.md              # This file
├── research.md          # Phase 0: reuse verification, Affix-scoping, sequencing decision
├── data-model.md         # Phase 1: the 3 entity shapes
├── contracts/
│   ├── context-switchers.contract.md   # Team/Workspace Switcher, Language Switcher
│   ├── scroll-feedback.contract.md     # Back-to-Top Button, Scroll Progress Bar
│   └── onboarding-tour.contract.md
├── quickstart.md         # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── scripts/
│   ├── context-switcher.js
│   ├── scroll-feedback.js
│   └── onboarding-tour.js
└── components/
    ├── team-switcher/team-switcher.html
    ├── language-switcher/language-switcher.html
    ├── scroll-feedback/scroll-feedback.html      # Back-to-Top + Scroll Progress Bar, one demo page (shared script)
    └── onboarding-tour/onboarding-tour.html

packages/react/src/
├── ContextSwitcher/ContextSwitcher.tsx    # Team/Workspace Switcher and Language Switcher (same component)
├── ScrollProgressBar/ScrollProgressBar.tsx
├── BackToTop/BackToTop.tsx
└── OnboardingTour/OnboardingTour.tsx

tests/e2e/
└── navigation-micro-patterns.spec.ts

tests/react-harness/
├── navigation-micro-patterns.html
└── src/navigation-micro-patterns-main.tsx
```

**Structure Decision**: Team/Workspace Switcher and Language Switcher
share ONE React component (`ContextSwitcher`, parametrized by
`options`) since Language Switcher is a pure content variant with no
avatars (research.md R1) — but each still gets its own static HTML
demo page/gallery card, matching how this catalog treats every
inventory item as its own discoverable demo regardless of
implementation sharing underneath (the same decision feature 030 made
for `SystemBanner` covering 2 inventory items).

## Complexity Tracking

*No violations — this section is intentionally empty.*
