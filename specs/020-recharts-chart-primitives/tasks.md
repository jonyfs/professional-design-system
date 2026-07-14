---

description: "Task list for feature implementation"
---

# Tasks: Recharts-Based Chart Primitives

**Input**: Design documents from `/specs/020-recharts-chart-primitives/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — this catalog's established convention is a Playwright
`tests/e2e/*.spec.ts` per component/feature (see `tests/e2e/react-table.spec.ts`),
extended here to Playwright test scaffolds per user-story phase.

**Organization**: Tasks are grouped by user story (spec.md US1/US2/US3) to
enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Paths are relative to repo root, matching plan.md's Project Structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the new dependency and scaffold the directories every later
phase writes into.

- [X] T001 Add `recharts` to `packages/react/package.json` dependencies (Constitution Check G-VII — verify version/license per research.md before pinning); run `npm install`
- [X] T002 [P] Create empty `packages/react/src/Chart/` directory with a placeholder `packages/react/src/Chart/index.ts` barrel (no exports yet)
- [X] T003 [P] Create `tests/react-harness/react-chart.html` demo page skeleton (mounts a React root, imports the theme-switcher script per feature 017's existing harness pages)

**Checkpoint**: `npm run build --workspace packages/react` succeeds with the new dependency installed and an empty Chart barrel.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared color/accessibility/empty-state mechanisms every one
of the 6 chart types and 2 shared primitives depends on (research.md
R2/R3/R4/R5, data-model.md Cross-cutting invariants).

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Implement `useChartColors()` hook in `packages/react/src/hooks/useChartColors.ts` — reads `--color-*` custom properties live via `getComputedStyle`, returns the 8-slot ordered palette (research.md R2/R3), re-evaluates on a `MutationObserver` watching `document.documentElement`'s `data-theme` attribute
- [X] T005 [P] Implement `ChartDataTable` in `packages/react/src/Chart/ChartDataTable.tsx` — `sr-only` table reusing `.data-table`/`.data-table-header-cell`/`.data-table-cell` classes (data-model.md ChartDataTable, research.md R4)
- [X] T006 [P] Implement `ChartEmptyState` in `packages/react/src/Chart/ChartEmptyState.tsx` — "no data" message shown when `data.length === 0` (FR-012)
- [X] T007 [P] Implement (or confirm/reuse if one already exists in `packages/react/src/hooks/`) a `usePrefersReducedMotion()` hook reading `window.matchMedia('(prefers-reduced-motion: reduce)')` for FR-013/research.md R5
- [X] T008 Write a `packages/react/src/Chart/chartColorPalette.ts` constant documenting the 8-token ordering from research.md R3 (`brand`, `success`, `warning`, `error`, `info`, `brand-dark`, `success-strong`, `info-strong`), consumed by T004

**Checkpoint**: `useChartColors`, `ChartDataTable`, `ChartEmptyState`, and the
reduced-motion hook are unit-verifiable in isolation (e.g. a throwaway
Storybook-less test render) before any chart type consumes them.

---

## Phase 3: User Story 1 - Core Chart Types (Priority: P1) 🎯 MVP

**Goal**: Line, Bar, Area (+ stacked), and Pie/Donut charts render on-theme
with zero manual color config, resize responsively, and expose a non-visual
data equivalent (spec.md US1).

**Independent Test**: Drop each of the four components into a page with a
small dataset, switch the active theme, confirm re-color + readability +
accessible equivalent — per spec.md US1's own Independent Test.

### Tests for User Story 1

- [X] T009 [P] [US1] Playwright scaffold in `tests/e2e/react-chart-core.spec.ts` covering: renders with theme colors, re-colors on theme switch, resizes on container change, empty-dataset shows `ChartEmptyState`, null-value mid-series shows a visual gap, zero-value Pie slice renders zero-width — write first, confirm it fails before implementation (contracts/core-charts.contract.md)

### Implementation for User Story 1

- [X] T010 [P] [US1] Implement `LineChart` in `packages/react/src/Chart/LineChart.tsx` (Recharts `ResponsiveContainer`/`LineChart`/`Line`, `connectNulls={false}`, `isAnimationActive={!prefersReducedMotion}`, colors from `useChartColors()`) per contracts/core-charts.contract.md
- [X] T011 [P] [US1] Implement `BarChart` in `packages/react/src/Chart/BarChart.tsx` (multi-series support per FR-002) per contracts/core-charts.contract.md
- [X] T012 [P] [US1] Implement `AreaChart` in `packages/react/src/Chart/AreaChart.tsx` with a `stacked` boolean prop (FR-003) per contracts/core-charts.contract.md
- [X] T013 [P] [US1] Implement `PieChart` in `packages/react/src/Chart/PieChart.tsx` with a `donut` boolean prop controlling `innerRadius` (FR-004), zero-value slice handling per spec.md Edge Cases
- [X] T014 [US1] Wire `<figure role="img" aria-label aria-describedby>` + `ChartDataTable` + `ChartEmptyState` into all four components from T010-T013 (depends on T010, T011, T012, T013, T005, T006)
- [X] T015 [US1] Add all four core charts to `tests/react-harness/react-chart.html` with representative sample datasets (depends on T010-T013)
- [X] T016 [US1] Export `LineChart`, `BarChart`, `AreaChart`, `PieChart` from `packages/react/src/index.ts` and `packages/react/src/Chart/index.ts`

**Checkpoint**: User Story 1 is fully functional and independently testable — `npx playwright test tests/e2e/react-chart-core.spec.ts` passes.

---

## Phase 4: User Story 2 - Extended Chart Types (Priority: P2)

**Goal**: Radar and Radial charts render correctly, re-theme, and remain
accessible, matching the core charts' bar (spec.md US2).

**Independent Test**: Drop a Radar Chart and a Radial Chart into a page with
representative data and confirm rendering/re-theming/accessibility
independently of Story 1 — per spec.md US2's own Independent Test.

### Tests for User Story 2

- [X] T017 [P] [US2] Playwright scaffold in `tests/e2e/react-chart-extended.spec.ts` covering Radar axis labeling + series distinguishability, Radial value-vs-range unambiguity — write first, confirm it fails before implementation (contracts/extended-charts.contract.md)

### Implementation for User Story 2

- [X] T018 [P] [US2] Implement `RadarChart` in `packages/react/src/Chart/RadarChart.tsx` (Recharts `RadarChart`/`Radar`, labeled attribute axes, FR-005) per contracts/extended-charts.contract.md
- [X] T019 [P] [US2] Implement `RadialChart` in `packages/react/src/Chart/RadialChart.tsx` (Recharts `RadialBarChart`/`RadialBar`, centered numeric value-vs-range text label, FR-006, research.md R6) per contracts/extended-charts.contract.md
- [X] T020 [US2] Wire `ChartDataTable`/`ChartEmptyState`/`role="img"` into Radar/Radial (depends on T018, T019, T005, T006)
- [X] T021 [US2] Add both to `tests/react-harness/react-chart.html` and export from `packages/react/src/index.ts` / `packages/react/src/Chart/index.ts` (depends on T018, T019)

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Shared Interactive Chart Chrome (Priority: P3)

**Goal**: A shared Tooltip and Legend behave identically across all 6 chart
types (spec.md US3).

**Independent Test**: Add the shared tooltip/legend to an already-rendered
chart from Story 1 or 2 and confirm hover/focus + toggle behavior — per
spec.md US3's own Independent Test.

### Tests for User Story 3

- [X] T022 [P] [US3] Playwright scaffold in `tests/e2e/react-chart-chrome.spec.ts` covering tooltip hover/focus exact-value display and legend toggle show/hide, run once per chart type — write first, confirm it fails before implementation (contracts/shared-chart-chrome.contract.md)

### Implementation for User Story 3

- [X] T023 [P] [US3] Implement `ChartTooltip` in `packages/react/src/Chart/ChartTooltip.tsx` (Recharts custom `content` renderer, Card/Popover surface tokens) per contracts/shared-chart-chrome.contract.md
- [X] T024 [P] [US3] Implement `ChartLegend` in `packages/react/src/Chart/ChartLegend.tsx` (real `<button>` per series with full `hover:`/`active:`/`focus-visible:`/`disabled:` states — Constitution Principle V) per contracts/shared-chart-chrome.contract.md
- [X] T025 [US3] Add `showTooltip`/`showLegend` props (default `true`) to all 6 chart components from Phases 3-4, composing `ChartTooltip`/`ChartLegend` via Recharts' `<Tooltip content={<ChartTooltip/>}>`/`<Legend content={<ChartLegend/>}>` (depends on T010-T013, T018, T019, T023, T024)
- [X] T026 [US3] Export `ChartTooltip`, `ChartLegend` from `packages/react/src/index.ts` / `packages/react/src/Chart/index.ts`

**Checkpoint**: All 6 chart types + 2 shared primitives are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Catalog-wide verification and documentation closing this
feature per this project's established practice.

- [X] T027 [P] Run `npm run audit:contrast` and fix any AAA/3:1 failures found in chart labels/axis text/tooltip/legend (Constitution Principle II, plan.md Constitution Check "verify empirically")
- [X] T028 [P] Add a static-HTML gallery cross-reference entry (e.g. `src/components/chart/chart.html` linking to the React demo) per spec.md Assumptions' documented exception — no standalone static chart implementation
- [X] T029 Run `quickstart.md` end-to-end (all 6 validation sections) and record results
- [X] T030 Run `npx playwright test tests/e2e/react-chart-core.spec.ts tests/e2e/react-chart-extended.spec.ts tests/e2e/react-chart-chrome.spec.ts` with axe-core assertions (reuse `tests/e2e/a11y-helper.ts`'s `expectNoA11yViolations()`) and fix any violations
- [X] T031 Draft the constitution amendment moving "Chart" from Known Catalog Gaps (deferred) to a new Component Catalog entry, following this project's "propose in Phase 1, ratify what shipped" sequence (`.specify/memory/constitution.md`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories (every chart needs `useChartColors`/`ChartDataTable`/`ChartEmptyState`/reduced-motion)
- **User Story 1 (Phase 3)**: Depends on Foundational only — this is the MVP
- **User Story 2 (Phase 4)**: Depends on Foundational only — independent of US1, though naturally built after it
- **User Story 3 (Phase 5)**: Depends on Foundational AND on the chart components from Phases 3-4 existing (it wires into them) — the one phase that is not fully independent of the others, since "shared chrome across every chart type" requires those chart types to exist first
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### Within Each User Story

- Tests written first, confirmed failing, then implementation (T009/T017/T022 before their respective implementation tasks)
- Chart components (T010-013, T018-019) before their wiring/export tasks
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003 (Setup) in parallel
- T005, T006, T007 (Foundational, after T004) in parallel
- T010, T011, T012, T013 (US1 chart components) in parallel
- T018, T019 (US2 chart components) in parallel
- T023, T024 (US3 shared primitives) in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all four core chart component implementations together:
Task: "Implement LineChart in packages/react/src/Chart/LineChart.tsx"
Task: "Implement BarChart in packages/react/src/Chart/BarChart.tsx"
Task: "Implement AreaChart in packages/react/src/Chart/AreaChart.tsx"
Task: "Implement PieChart in packages/react/src/Chart/PieChart.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Line/Bar/Area/Pie)
4. **STOP and VALIDATE**: run `tests/e2e/react-chart-core.spec.ts`, confirm SC-001/SC-003/SC-004 hold
5. This alone closes the catalog's longest-open Chart gap for the four most common chart shapes

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. User Story 1 → validate independently → MVP
3. User Story 2 → validate independently (Radar/Radial)
4. User Story 3 → validate independently (shared Tooltip/Legend wired into all 6)
5. Polish → contrast/a11y verification, static-gallery cross-reference, constitution amendment

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No chart type ships without `useChartColors()`-derived colors, the hidden `ChartDataTable`, and reduced-motion gating — these are Foundational, not per-story, precisely because every story depends on them identically
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently

## Implementation Notes (deviations from the plan above, ratified here)

- **Recharts 3.9.2, not 2.x**: `npm view recharts version` at implementation
  time showed 3.9.2 is current (MIT, React 18-compatible) — research.md R1
  updated accordingly before installing.
- **ChartTooltip/ChartLegend built during Phase 3, not deferred to Phase 5**:
  every core chart's `showTooltip`/`showLegend` defaults to `true`, so
  these two shared primitives were a real dependency of Phase 3 from the
  start, not an independent Phase 5 add-on as originally scoped. The user
  story boundaries in spec.md (US1/US2/US3) still hold at the
  requirements level — this is purely an implementation-order correction.
- **New `ChartFrame` component** (not in the original file list): extracted
  to fix a real axe-core `no-focusable-content` violation — `role="img"`
  must wrap only the chart visualization, never `ChartLegend`'s
  interactive buttons. See the Component Catalog entry (constitution
  v1.15.0) for the full fix.
- **Two real bugs found and fixed during implementation** (both now
  documented in constitution v1.15.0's Sync Impact Report): (1) the
  `role="img"`/Legend nesting violation above; (2) `.data-table-header-cell`
  (Table, feature 012) failing AAA at 6.86:1 — surfaced only after fixing
  `tests/react-harness/src/harness.css` to actually import
  `src/styles/themes.css`, which also exposed that `packages/react`'s own
  published styles never define default `--color-*` values (recorded as
  an unresolved package-level gap, Theming & Multi-Palette Architecture
  section).
- **Recharts' entrance animation** sweeps progressively — a screenshot or
  assertion taken before it settles sees a partial chart, not a real bug
  (spent real debugging time confirming this empirically before concluding
  it wasn't an angle-math defect). All three Playwright specs emulate
  `prefers-reduced-motion: reduce` for deterministic, instant renders.
- **14 pre-existing React-harness visual baselines regenerated** (Accordion,
  Combobox, List, Sidebar, Tabs, TextInput) — a direct, expected consequence
  of the harness theme-import fix above finally rendering real colors
  instead of unset/invalid ones; `tests/e2e/table.spec.ts`'s hardcoded
  header-color assertion updated to match the Table fix.
