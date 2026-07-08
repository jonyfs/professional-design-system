# Implementation Plan: Design System Primitive Components

**Branch**: `main` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-primitive-components/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship four production-grade, accessible HTML + Tailwind CSS primitives (Button,
Text Input, Badge, Checkbox) built exclusively on the semantic tokens ratified
in the project constitution (v1.3.0). No new design tokens are introduced by
this feature (the three `-strong` status tokens were added directly to the
constitution during `/speckit-analyze` remediation, before this feature's
implementation began — see `research.md`); no
JavaScript framework is introduced. The technical approach is a static
HTML/Tailwind component library with a minimal Vite-based dev/build pipeline,
validated by an automated token-compliance audit, a contrast checker, and a
Playwright suite covering visual regression and accessibility across four
breakpoints.

## Technical Context

**Language/Version**: HTML5, Tailwind CSS 3.4.x, vanilla JS (ES2022) only
where native HTML/CSS cannot express a state (none required for this slice —
all four components use native pseudo-classes: `:hover`, `:active`,
`:focus-visible`, `:disabled`, `:checked`)

**Primary Dependencies**: `tailwindcss@^3.4`, `vite@^5` (dev server + static
build), `@playwright/test`, `@axe-core/playwright` (automated a11y), `wcag-contrast`
(programmatic AAA contrast verification of the token table)

**Storage**: N/A (static markup, no persistence)

**Testing**: Playwright — visual regression screenshots at 320/768/1024/1440px
per [web/testing.md] rules, plus `@axe-core/playwright` accessibility scans on
every component page. A standalone Node script (`scripts/audit-tokens.mjs`)
statically greps rendered class lists for non-token Tailwind palette classes
(Principle IV gate) and a second script (`scripts/check-contrast.mjs`) computes
WCAG AAA contrast ratios for every token pairing declared in the constitution's
color table (Principle II gate).

**Target Platform**: Web — current stable evergreen browsers (Chrome, Firefox,
Safari, Edge), responsive from 320px to 1920px. No native-app variant in scope.

**Project Type**: Single-project static frontend component library (no
backend/API — this is a design-system component catalog, not an application).

**Performance Goals**: Component gallery page loads with LCP < 2.5s and CSS
bundle < 15kb gzipped (microsite budget per [web/performance.md]), since the
shipped artifact is CSS + static markup with no client JS runtime cost.

**Constraints**:
- Zero parallel custom CSS outside Tailwind's `theme()`/`@layer` mechanism
  (Principle III).
- Zero raw Tailwind palette classes in shipped markup (Principle IV).
- Every interactive element declares the full hover/active/focus-visible/
  disabled state set (Principle V).
- All source, comments, and docs in English; agent responses to the user in
  PT-BR (Principle VI).

**Scale/Scope**: 4 primitive components (Button, Text Input, Badge, Checkbox),
single feature slice, no future scope assumed.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Requirement | Status |
|------|-----------|-------------|--------|
| G1 | II — Absolute Semantic Accessibility (AAA) | All 4 components pass WCAG 2.2 AAA contrast, expose mandatory ARIA state attributes, and manage focus correctly | PASS — `/speckit-analyze` found the original contracts violated this gate (Button on `bg-brand`, Badge/error text on the base status tokens); remediated by switching Button to `bg-brand-dark` and adding the `-strong` status tokens (constitution v1.3.0). Enforced going forward by `scripts/check-contrast.mjs` + axe scans. |
| G2 | III — Tailwind-Only Architecture | No parallel `.css` files outside Tailwind theme config; single generated stylesheet | PASS (Vite + Tailwind CLI only, no hand-written CSS files) |
| G3 | IV — Design Token Discipline | Zero raw palette classes (`bg-blue-600`, etc.) in shipped markup | PASS — Badge ring colors corrected from raw `ring-green-600/20`-style classes during v1.3.0; a second `/speckit-analyze` pass caught that the Badge *background* colors (`bg-green-50`/`bg-red-50`/`bg-amber-50`) were also raw palette classes, fixed in v1.3.1 by switching to `bg-success/5`-style opacity-modified status tokens. Enforced by `scripts/audit-tokens.mjs`. |
| G4 | FR-004 (Checkbox states) + V — Interactive State Completeness (Button/Link scope) | Button declares hover/active/focus-visible/disabled per Principle V; Checkbox declares the equivalent state set per FR-004 (Principle V's literal text scopes to `<button>`/`<a>`, not `<input>`) | PASS (component contracts in `contracts/` enumerate every required class) |
| G5 | VI — Project Language Policy | All artifacts in English; agent chat in PT-BR | PASS (enforced by this plan and all subsequent artifacts) |
| G6 | VII — Autonomous Skill Acquisition | Any new skill adopted is vetted (trust/safety/relevance/license) and announced to the user in PT-BR | PASS (no external skill installation anticipated for this feature; `impeccable` and `ui-ux-pro-max`, already available in the current toolchain, cover design-quality review needs) |

No violations requiring `Complexity Tracking` justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-primitive-components/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md         # Phase 1 output (/speckit-plan command)
├── contracts/            # Phase 1 output (/speckit-plan command)
│   ├── button.contract.md
│   ├── text-input.contract.md
│   ├── badge.contract.md
│   └── checkbox.contract.md
└── tasks.md               # Phase 2 output (/speckit-tasks command - NOT created here)
```

### Source Code (repository root)

```text
professional-design-system/
├── package.json
├── vite.config.ts
├── tailwind.config.ts        # semantic token theme, mapped 1:1 to the constitution
├── postcss.config.js
├── index.html                 # component gallery (manual QA entry point)
├── src/
│   ├── styles/
│   │   └── tailwind.css       # @tailwind directives only — no custom rules
│   └── components/
│       ├── button/
│       │   └── button.html
│       ├── text-input/
│       │   └── text-input.html
│       ├── badge/
│       │   └── badge.html
│       └── checkbox/
│           └── checkbox.html
├── scripts/
│   ├── audit-tokens.mjs       # Principle IV gate — fails on raw palette classes
│   └── check-contrast.mjs     # Principle II gate — WCAG AAA contrast verification
└── tests/
    └── e2e/
        ├── button.spec.ts
        ├── text-input.spec.ts
        ├── badge.spec.ts
        └── checkbox.spec.ts
```

**Structure Decision**: Single static frontend project (Option 1 variant — no
backend, no separate frontend/backend split, since this feature has no server
component). Components live as standalone HTML partials under
`src/components/<name>/`, each embeddable independently (matches the spec's
"Independent Test" requirement per user story), and are all linked into
`index.html` as a gallery for manual/visual QA. Tests live in `tests/e2e/`,
one spec file per component, mirroring the source layout.

## Complexity Tracking

*No entries — no Constitution Check violations.*
