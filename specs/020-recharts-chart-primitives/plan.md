# Implementation Plan: Recharts-Based Chart Primitives

**Branch**: `020-recharts-chart-primitives` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/020-recharts-chart-primitives/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship six Recharts-based chart components (Line, Bar, Area, Pie/Donut, Radar,
Radial) plus two shared interactive primitives (Tooltip, Legend) in the React
package only — closing this catalog's longest-open deferred gap (Chart,
flagged since feature 014). Every chart derives its color palette at render
time from the existing `--color-*` CSS custom properties (the same tokens
Tailwind utilities resolve to, per feature 017's theming layer) via a new
`useChartColors` hook, so theme-preset switching re-colors charts automatically
with zero per-chart reconfiguration and zero new token source. Each chart also
renders a visually-hidden data table as its accessible non-visual equivalent.

## Technical Context

**Language/Version**: TypeScript 5.6, React 18.3 (matches `packages/react`'s existing peer/devDependencies)

**Primary Dependencies**: `recharts` (new dependency — MIT license, SVG-based
composable chart library, no CSS-in-JS/parallel stylesheet of its own);
existing `packages/react` toolchain (tsup, Tailwind 3.4, TypeScript)

**Storage**: N/A — components render caller-supplied datasets, no persistence

**Testing**: Playwright (`tests/e2e/*.spec.ts`, this project's existing
convention — see `tests/e2e/react-table.spec.ts`) against the React demo
harness (`tests/react-harness/`); `scripts/check-contrast.mjs` for the AAA/3:1
gates; `scripts/audit-tokens.mjs` does not apply to chart SVG props (see
Constitution Check G3 below)

**Target Platform**: Web (React 18 consumers of `@professional-design-system/react`); no static-HTML-gallery twin for this feature (see Assumptions in spec.md)

**Project Type**: Component library addition (single package: `packages/react`)

**Performance Goals**: Chart re-render on theme change and container resize
within the same paint/interaction the rest of the page uses (SC-002, SC-006) —
no user-perceptible lag distinct from a normal re-render

**Constraints**: Zero-JavaScript static HTML twin is explicitly out of scope
for this feature only (Recharts has no framework-independent output); reduced-
motion MUST disable/reduce entrance animation (FR-013); no live/streaming data
handling (spec.md Assumptions)

**Scale/Scope**: 6 chart types + 2 shared primitives (Tooltip, Legend) + 1
new `useChartColors` hook; up to at least 6 distinguishable series colors per
chart before cycling (FR-008)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Charts are data-display, not primary-action controls — no Fitts's-Law click-target conflict. Legend/tooltip interactive affordances follow existing spacing/hierarchy conventions | PASS |
| II. Absolute Semantic Accessibility (WCAG AAA) | FR-009/FR-010/FR-016 mandate a non-visual data equivalent, AAA text/3:1 non-text contrast, and no color-only meaning — all derived from the *default* theme's already-AAA-passing tokens, so no new `KNOWN_THEME_CONTRAST_GAPS` entry is anticipated. Must be verified empirically post-implementation (this catalog's established practice — every prior "ratified but unverified" gap was a real bug) | PASS (verify empirically in Phase 3) |
| III. Tailwind-Only Architecture (Zero Parallel CSS) | Recharts requires per-element SVG color props (`stroke`/`fill` as literal color strings), which Tailwind `className` utilities cannot target on Recharts' internally-rendered SVG nodes. **Justified, scoped exception**: colors are read from the *same* `--color-*` custom properties Tailwind already resolves to (via `getComputedStyle`, never a hardcoded hex/rgb literal) through the new `useChartColors` hook — no parallel `.css` file is introduced, and no color value exists that isn't already a ratified token. See Complexity Tracking | PASS (documented exception) |
| IV. Design Token Discipline (Zero Hardcoding) | `useChartColors` is the single, shared source every chart component pulls its palette from — no chart hardcodes a color literal. Chart color *ordering* (which token maps to series 1, 2, 3, ...) is itself a new small ratified sequence documented in `data-model.md`, not an arbitrary per-component choice | PASS |
| V. Interactive State Completeness | Applies to the shared Legend's toggle entries (real `<button>` elements) — MUST declare `hover:`/`active:`/`focus-visible:`/`disabled:` per this Principle, same as every other catalog control | PASS (enforced in contracts) |
| VI. Project Language Policy | All code/docs in English; this plan and all chat responses in PT-BR | PASS |
| VII. Autonomous Skill Acquisition Protocol | `recharts` is a new client-side dependency, not a Claude skill, but this catalog's own precedent (feature 018's research.md flags QRCode/Emoji-Picker candidates for "a future Principle VII skill-adoption review" before adding a new client-side dependency) extends the same diligence to library adoption: source trustworthiness (recharts — actively maintained, ~3M weekly npm downloads, used across major production dashboards), safety (plain composable React components, no obfuscated/eval'd code, inspectable source), relevance (directly serves spec.md's explicit "use Recharts" input), license (MIT — compatible). Verified before adding to `package.json`; user informed in PT-BR per Principle VII | PASS (documented adoption) |

No unjustified violations — one documented Principle III exception (see
Complexity Tracking) covering the same underlying mechanism across all 8
components, not a per-component exception.

## Project Structure

### Documentation (this feature)

```text
specs/020-recharts-chart-primitives/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   ├── Chart/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── AreaChart.tsx
│   │   ├── PieChart.tsx
│   │   ├── RadarChart.tsx
│   │   ├── RadialChart.tsx
│   │   ├── ChartTooltip.tsx      # shared, chart-type-independent (US3)
│   │   ├── ChartLegend.tsx       # shared, chart-type-independent (US3)
│   │   ├── ChartDataTable.tsx    # non-visual data equivalent (FR-009)
│   │   └── ChartEmptyState.tsx   # "no data" state (FR-012)
│   ├── hooks/
│   │   └── useChartColors.ts     # reads --color-* custom properties (FR-007/FR-008)
│   └── index.ts                  # new chart exports added here
├── package.json                  # add `recharts` dependency
└── tailwind.config.ts            # unchanged — no new tokens needed

tests/
├── react-harness/
│   └── react-chart.html          # new demo page (cross-referenced from the
│                                  # static gallery per spec.md Assumptions —
│                                  # no standalone static-HTML chart page)
└── e2e/
    └── react-chart.spec.ts       # Playwright: render, theme-switch re-color,
                                   # resize, empty-dataset, reduced-motion,
                                   # tooltip/legend interaction, axe-core scan
```

**Structure Decision**: Single-package addition inside the existing
`packages/react` component library — no new package, no static-HTML
`src/components/` twin (the feature's one documented exception, per spec.md
Assumptions and this plan's Constitution Check). All 6 chart components share
one `useChartColors` hook and one `Chart/` directory rather than being
scattered per-component, matching this catalog's existing convention of
grouping tightly-related primitives (e.g. `TextInput/`, `Table/`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| Principle III exception: chart SVG colors set via JS props (`stroke`/`fill`), not Tailwind `className` | Recharts renders its own internal SVG tree; there is no `className` hook into a `<Line>`/`<Bar>`/`<Cell>`'s stroke/fill from the consuming component — Recharts' documented API is JS color props | A Tailwind-`className`-only approach is technically impossible with Recharts' rendering model (not just harder) — the only true alternative is hand-rolling raw SVG charts, which reintroduces the "substantially new interaction pattern" cost this feature explicitly adopts Recharts to avoid (spec.md Assumptions) |
| No static-HTML twin for this feature (breaks the catalog's established dual-shipping practice) | Recharts is React-only with no framework-independent/vanilla-JS output | Reimplementing 6 chart types + 2 shared primitives in hand-rolled zero-JS SVG/Canvas to preserve the static twin is exactly the "substantially new interaction pattern" this catalog has deferred Chart for since feature 014 — out of proportion to this feature's scope. The static gallery instead cross-references the React demo (spec.md Assumptions) |
