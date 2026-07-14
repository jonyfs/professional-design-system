---

description: "Task list for feature implementation"
---

# Tasks: Recharts Additional Chart Types (Batch 2)

**Input**: Design documents from `/specs/024-recharts-additional-charts/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright, React-only (same documented exception
feature 020 established), one spec file for this batch.

**Organization**: Tasks are grouped by user story (spec.md US1-US3).
All 5 new chart types are additive to feature 020's existing
`packages/react/src/Chart/` — no shared-module changes needed beyond
extending `types.ts` with new prop-shape definitions.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Extend `packages/react/src/Chart/types.ts` with `ComposedSeriesConfig`, `ScatterSeriesConfig`, `FunnelStageDatum`, `TreemapNode`, `SankeyNode`, `SankeyLink` per data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: None beyond T001 — every new chart type reuses feature 020's existing shared chrome (`ChartFrame`, `ChartLegend`, `ChartTooltip`, `ChartEmptyState`, `ChartDataTable`, `useChartColors`, `usePrefersReducedMotion`) unchanged, no new shared module required.

**⚠️ CRITICAL**: All 3 user stories depend only on T001 — otherwise fully independent and parallelizable.

**Checkpoint**: Type definitions exist — all 3 user stories can proceed.

---

## Phase 3: User Story 1 - Combined and Correlation Charts (Priority: P1) 🎯 MVP

**Goal**: ComposedChart and ScatterChart (spec.md US1).

**Independent Test**: Drop a Composed Chart (bar+line) and a Scatter Chart into a page with representative datasets, switch themes, confirm both re-color and remain readable at every breakpoint — per spec.md US1's own Independent Test.

### Tests for User Story 1

- [X] T002 [P] [US1] Playwright scaffold in `tests/e2e/react-chart-batch-2.spec.ts` covering: ComposedChart bar+line alignment, secondary-axis rendering when a series requests it, ScatterChart point placement/tooltip distinguishability, both re-theme correctly, both meet SC-006 responsive behavior

### Implementation for User Story 1

- [X] T003 [P] [US1] Implement `packages/react/src/Chart/ComposedChart.tsx` per contracts/composed-scatter.contract.md (depends on T001)
- [X] T004 [P] [US1] Implement `packages/react/src/Chart/ScatterChart.tsx` per contracts/composed-scatter.contract.md (depends on T001)
- [X] T005 [US1] Export `ComposedChart`, `ScatterChart` (+ prop/series types) from `packages/react/src/index.ts`

**Checkpoint**: User Story 1 is fully functional and independently testable — this is the MVP.

---

## Phase 4: User Story 2 - Funnel/Conversion Visualization (Priority: P2)

**Goal**: FunnelChart (spec.md US2).

**Independent Test**: Drop a Funnel Chart into a page with a representative multi-stage dataset, confirm proportional sizing and labeling — per spec.md US2's own Independent Test.

### Tests for User Story 2

- [X] T006 [P] [US2] Extend `tests/e2e/react-chart-batch-2.spec.ts` covering: FunnelChart stage proportions/labels, zero-value stage renders without error

### Implementation for User Story 2

- [X] T007 [US2] Implement `packages/react/src/Chart/FunnelChart.tsx` per contracts/funnel.contract.md (depends on T001)
- [X] T008 [US2] Export `FunnelChart` (+ prop types) from `packages/react/src/index.ts`

**Checkpoint**: User Story 2 is fully functional and independently testable.

---

## Phase 5: User Story 3 - Hierarchical and Flow Visualization (Priority: P3)

**Goal**: Treemap and Sankey (spec.md US3).

**Independent Test**: Drop a Treemap with nested data and a Sankey diagram with node/link data into a page, confirm both render correctly and remain accessible — per spec.md US3's own Independent Test.

### Tests for User Story 3

- [X] T009 [P] [US3] Extend `tests/e2e/react-chart-batch-2.spec.ts` covering: Treemap nested-node proportional sizing, single-top-level-node edge case, Sankey link-width proportionality and node labeling

### Implementation for User Story 3

- [X] T010 [P] [US3] Implement `packages/react/src/Chart/Treemap.tsx` per contracts/treemap-sankey.contract.md (depends on T001)
- [X] T011 [P] [US3] Implement `packages/react/src/Chart/Sankey.tsx` per contracts/treemap-sankey.contract.md (depends on T001)
- [X] T012 [US3] Export `Treemap`, `Sankey` (+ prop/node/link types) from `packages/react/src/index.ts`

**Checkpoint**: User Story 3 is fully functional and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T013 Create `tests/react-harness/chart-batch-2.html` + `tests/react-harness/src/chart-batch-2-main.tsx` with real usage examples for all 5 new chart types (mirroring `chart-main.tsx`'s dataset style), and add the build entry to `tests/react-harness/vite.config.ts`
- [X] T014 Add a "Chart — Batch 2" or equivalent gallery cross-reference on `src/components/chart/chart.html` (React-only components, same cross-reference-not-duplicate pattern feature 020 established) — no root `index.html` gallery card needed since Chart already has one entry covering all Recharts-based types
- [X] T015 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes
- [X] T016 [P] Run `npm run audit:contrast` — confirm zero new contrast findings
- [X] T017 [P] Run `npm run typecheck` — confirm the whole monorepo type-checks cleanly
- [X] T018 Run the full Playwright suite for this feature across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures
- [X] T019 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions
- [X] T020 Draft the constitution amendment updating the Chart Component Catalog entry to note full 11/11 Recharts chart-type coverage (6 from feature 020 + 5 from this feature), and mark the "Chart" Known Catalog Gap's remaining-scope note as fully closed

---

## Dependencies & Execution Order

- Phase 1 (Setup, T001) → Phase 2 (no-op beyond T001) → Phases 3-5 (all 3 user stories, fully parallel — no cross-story dependencies) → Phase 6 (Polish, depends on all of 3-5).
- Within each story, the component-implementation task(s) marked [P] are independent files and can run in parallel; each story's own index.ts export task runs last within that story (touches the shared file — sequence across stories during implementation, not a design dependency).

## Implementation Strategy

**MVP = User Story 1** (ComposedChart + ScatterChart) — the two most
broadly-applicable new types, independently shippable. User Stories 2-3
can each be delivered as their own incremental slice afterward, in any
order (no dependencies between them).
