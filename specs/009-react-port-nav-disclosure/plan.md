# Implementation Plan: React Port — Navigation & Disclosure Primitives

**Branch**: `main` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-react-port-nav-disclosure/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Port feature 005's four static HTML + Tailwind components (Breadcrumbs,
Accordion, Tabs, Dropdown Menu) into `packages/react/`, completing the
"cotninue implementando 2 e 3" directive's option 3 (the fourth and final
feature in the confirmed sequential plan, after 006/007/008's catalog
expansion). Breadcrumbs is a direct markup translation (research.md:
zero new logic). Accordion keeps the native `<details name="...">`
exclusive-group mechanism verbatim in JSX (research.md R1) — no React
state needed at all. Tabs and Dropdown Menu are reimplemented as
idiomatic React hooks (roving-tabindex state for Tabs, R2; a
`useDropdownMenu` hook driving the real Popover API imperatively via
refs for Dropdown Menu, R3) rather than wrapped vanilla JS. Pure platform
port — no new visual/interaction capability (FR-008).

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (function components +
hooks only, matching feature 004's established constraint).

**Primary Dependencies**: None new — reuses `packages/react/`'s existing
`tsup` build, compiled Tailwind stylesheet, and `tests/react-harness/`
dev-only Vite+React app from feature 004.

**Storage**: N/A

**Testing**: Same `react-*.spec.ts` pixel-parity Playwright pattern as
feature 004's first 10 ports — visual regression against the static
gallery's own approved baselines, axe-core scans, and a full port of
every keyboard-acceptance-scenario from feature 005's static specs
(research.md "Testing Strategy").

**Target Platform**: npm package consumable by any React 18 app; same
evergreen-browser matrix as the static site (native Popover API support
required for Dropdown Menu, matching feature 005's own requirement for
its static version).

**Project Type**: Adds four new components to the existing
`packages/react/` workspace package — no new package, no new tooling.

**Performance Goals**: Same as feature 004 — bundle size is not a hard
per-component CI gate; SC-003 (clean prop-type ergonomics) and SC-004
(100% keyboard-parity) are the binding metrics.

**Constraints**: Same Principles II/III/IV/V enforcement on `.tsx`
source as every prior React port (audit scripts already extended to
scan `.tsx` files since feature 004 — no further script changes needed
here since no new tokens are introduced, research.md).

**Scale/Scope**: 4 components ported, 0 new design tokens, 1 new custom
hook (`useDropdownMenu`), reuses all existing package tooling.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Requirement | Status |
|------|-----------|-------------|--------|
| G1 | II — Absolute Semantic Accessibility (AAA) | Same ARIA roles/keyboard model as each static reference; AAA contrast (reused tokens only) | PASS — no new text/background pairing introduced (FR-008); keyboard models are direct ports of already-AAA-verified static references. |
| G2 | III — Tailwind-Only Architecture | No parallel CSS; reuse the package's existing compiled stylesheet | PASS — all four components reuse the exact `@layer components` classes already ratified for their static references; no new CSS. |
| G3 | IV — Design Token Discipline | Zero raw palette classes in `.tsx` source | PASS — zero new tokens (research.md); existing `audit-tokens.mjs`/`check-contrast.mjs` `.tsx`-scanning extension (feature 004) covers this without modification. |
| G4 | V — Interactive State Completeness | Every interactive element needs hover/active/focus-visible states | PASS — ported verbatim from each static reference's already-compliant classes; no new interactive element introduced. |
| G5 | VI — Project Language Policy | English artifacts, PT-BR agent chat | PASS |
| G6 | (informational) | Whether Accordion's exclusive-group mechanism needs React state | Resolved in research.md R1: no — native `<details name="...">` passes through JSX unmodified, verified against React 18's attribute handling rather than assumed. |
| G7 | (informational) | Whether Dropdown Menu's Popover API usage needs new JSX typing | Resolved in research.md R3: no — invoked imperatively via refs in a `useEffect`, the same pattern this package already uses for `<dialog>`/`showModal()` in Modal/SlideOver (feature 004), not a new pattern. |

No violations requiring `Complexity Tracking` justification.

## Project Structure

### Documentation (this feature)

```text
specs/009-react-port-nav-disclosure/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   ├── breadcrumbs.contract.md
│   ├── accordion.contract.md
│   ├── tabs.contract.md
│   └── dropdown-menu.contract.md
└── tasks.md               # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root, additions only — existing scaffold unchanged)

```text
packages/react/src/
├── Breadcrumbs/Breadcrumbs.tsx        # new
├── Accordion/Accordion.tsx            # new
├── Tabs/Tabs.tsx                      # new
├── DropdownMenu/DropdownMenu.tsx      # new
├── hooks/useDropdownMenu.ts           # new — open/active-index state,
│                                      # Popover API refs, keyboard handling
├── styles.css                         # MODIFIED — this package maintains its
│                                      # OWN duplicated @layer components
│                                      # block (feature 004's established,
│                                      # documented "two independent Tailwind
│                                      # builds" pattern — src/styles/
│                                      # tailwind.css's classes are NOT
│                                      # @import-able here); adds the
│                                      # breadcrumb-*/accordion-*/tab-*/
│                                      # dropdown-menu-* classes, ported
│                                      # verbatim from the root stylesheet
└── index.ts                           # MODIFIED — 4 new exports
tests/react-harness/                   # MODIFIED — mount points for the 4 new components
tests/e2e/
├── react-breadcrumbs.spec.ts          # new
├── react-accordion.spec.ts            # new
├── react-tabs.spec.ts                 # new
└── react-dropdown-menu.spec.ts        # new
```

**Structure Decision**: Extends feature 004's package structure exactly —
one component directory per port, one `react-*.spec.ts` per component,
exported from the package's existing `index.ts`. One new file outside the
per-component pattern: `hooks/useDropdownMenu.ts`, since Dropdown Menu's
interaction logic is substantial enough to warrant its own hook rather
than living inline in the component (consistent with `hooks/` already
existing in the package for this purpose). No `src/` (static HTML)
changes — the static references are the already-ratified source of
truth this port is verified against, not modified by it.

## Complexity Tracking

*No entries — no Constitution Check violations.*
