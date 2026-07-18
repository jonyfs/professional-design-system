---

description: "Task list for feature implementation"
---

# Tasks: Flagship App Showcase

**Input**: Design documents from `/specs/042-flagship-app-showcase/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright a11y + interaction tests for the new
page, plus the full pre-existing catalog suite as the zero-regression
backstop.

**Organization**: Single-story feature (spec.md has 2 user stories:
US1 the showcase itself, US2 discoverability) — tasks grouped
accordingly.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Confirm the pre-existing baseline is clean before starting: `npm run audit:tokens` and `npm run audit:contrast`
- [X] T002 Scaffold `showcase/` as a new npm workspace: `package.json` (depends on `@professional-design-system/react` via workspace protocol, `react`, `react-dom`, `vite`, `@vitejs/plugin-react`), add it to the root `package.json`'s `workspaces` array

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The sample data module and Vite config are shared by every screen section built in Phase 3.

- [X] T003 Create `showcase/src/data/sample-data.ts` per data-model.md (Team Member, Organization, Table Row, Chart Series Point, Notification, Metric)
- [X] T004 Create `showcase/vite.config.ts` (React plugin, `base` driven by `GITHUB_PAGES_BASE` env var per contracts/flagship-showcase.contract.md) and `showcase/index.html`

**Checkpoint**: Data and build config ready; screen composition can begin.

---

## Phase 3: User Story 1 - See the design system's real power in one realistic screen (Priority: P1) 🎯 MVP

**Goal**: Ship the composed dashboard screen itself (spec.md US1).

**Independent Test**: Load the showcase page; confirm it presents as one coherent, realistic application screen with >=15 real, interactive shipped components (research.md R2's 18-component list), re-colors under the theme switcher, and meets AAA contrast/a11y with zero violations.

### Tests for User Story 1

- [X] T005 [P] [US1] Create `tests/e2e/flagship-showcase.spec.ts`: a11y scan (zero violations), a component-presence assertion covering all 18 components from research.md R2 (SC-001), real interaction checks (command palette opens, dropdown menu opens, data table sorts/paginates, a toast/notification can be dismissed, dark mode toggle re-colors the page), and a 320px no-overflow check (FR-008)

### Implementation for User Story 1

- [X] T006 [US1] Create `showcase/src/main.tsx` (mounts `<App />`, imports `@professional-design-system/react/styles.css`)
- [X] T007 [US1] Create `showcase/src/App.tsx` shell: `Sidebar` + `Navbar` + main content region layout per contracts/flagship-showcase.contract.md
- [X] T008 [US1] Add identity/org-switching section: `Avatar`, `AvatarGroup`, `ContextSwitcher` wired to `sample-data.ts`'s Team Member/Organization entries
- [X] T009 [US1] Add global-actions section: `CommandPalette`, `DropdownMenu` (user menu), `ActionIcon`, `Button`
- [X] T010 [US1] Add metrics section: `Card` + `Badge` + `RollingNumber` (or `RingProgress`) rendering `sample-data.ts`'s Metric entries
- [X] T011 [US1] Add `Chart` rendering `sample-data.ts`'s Chart Series Point entries
- [X] T012 [US1] Add `DataTable` + `Pagination` rendering `sample-data.ts`'s Table Row entries
- [X] T013 [US1] Add feedback elements: `Toast` (triggered by a real action, e.g. a table row action), `NotificationCenter` rendering `sample-data.ts`'s Notification entries, `Modal` (a confirm-style dialog reachable from a real action)
- [X] T014 [US1] Add wayfinding + theming: `Breadcrumbs`, `Tabs`, `DarkModeToggle`/`ThemeIcon`
- [X] T015 [US1] Verify all 18 components from research.md R2 are present and each is genuinely interactive (not decorative) — run T005's test and fix any gap found

**Checkpoint**: The showcase screen itself is complete and independently verifiable.

---

## Phase 4: User Story 2 - Reach the showcase from the homepage (Priority: P2)

**Goal**: Make the showcase discoverable and round-trippable (spec.md US2).

**Independent Test**: From the homepage, reach the showcase in one click; from the showcase, return to the homepage in one click.

### Implementation for User Story 2

- [X] T016 [US2] Add a link to `showcase/index.html` in `index.html`'s hero/stat region (FR-006), root-absolute so `scripts/rewrite-base-path.mjs` rewrites it automatically for the Pages subpath
- [X] T017 [US2] Add a "Back to full catalog" link in `showcase/src/App.tsx`'s own header, pointing at the main site's `index.html`
- [X] T018 [US2] Extend `tests/e2e/flagship-showcase.spec.ts` (or `gallery-showcase.spec.ts`) with the round-trip navigation check (SC-003)

**Checkpoint**: Both user stories independently verified.

---

## Phase 5: Deploy integration & pre-existing bug fix

- [X] T019 Add a "Build showcase app" step + `dist/showcase` copy step to `.github/workflows/deploy-pages.yml`'s `build` job, after the main site's own build (research.md R4, contracts/flagship-showcase.contract.md)
- [X] T020 Fix `src/components/chart/chart.html`'s pre-existing broken `href="http://localhost:5174/chart.html"` link (research.md R5) to point at a real, reachable deployed path
- [X] T021 Verify locally: `GITHUB_PAGES_BASE=/professional-design-system/showcase/ npm run build --prefix showcase` produces correctly-prefixed asset paths; confirm the chart.html fix resolves correctly in a simulated subpath build

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T022 [P] Run `npm run audit:tokens` — confirm zero violations (showcase consumes only already-compiled package styles, introduces no new Tailwind usage of its own to audit, but verify no stray raw classes were added to `index.html`/`chart.html`)
- [X] T023 [P] Run `npm run audit:contrast` — confirm zero new undocumented findings across all 119 themes
- [X] T024 Run `tests/e2e/flagship-showcase.spec.ts` across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures
- [X] T025 Run the FULL pre-existing catalog suite — confirm zero regressions
- [X] T026 Draft the constitution amendment documenting the new `showcase/` app, its architectural separation from `tests/react-harness/`, and the chart.html bug fix

---

## Dependencies & Execution Order

- Phase 1 (T001-T002) → Phase 2 (T003-T004, blocking) → Phase 3 (T005-T015) → Phase 4 (T016-T018, depends on Phase 3's page existing) → Phase 5 (T019-T021, depends on Phase 3/4 complete) → Phase 6 (Polish).
- T006 before T007; T007 before T008-T014 (all extend the same `App.tsx` shell); T015 depends on T008-T014 all landing first.

## Implementation Strategy

**MVP = User Story 1** (the showcase screen itself) — User Story 2
(discoverability) is a small, fast follow-on once the screen exists.
