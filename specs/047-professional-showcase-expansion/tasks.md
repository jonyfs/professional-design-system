---

description: "Task list for Professional Multi-Screen Showcase Expansion (feature 047)"
---

# Tasks: Professional Multi-Screen Showcase Expansion

**Input**: Design documents from `/specs/047-professional-showcase-expansion/`

**Key constraint discovered during planning**: `showcase/src/App.tsx`'s existing Dashboard content (metrics cards, chart, Customers/Team tabs, CommandPalette with its documented execute-order workaround, Modal, Toast) is exercised by `tests/e2e/flagship-showcase.spec.ts` via specific test-ids and anchor ids (`#customers`, `#team`). To avoid risking the 4 already-fixed defects (FR-007), the existing Dashboard content moves into `DashboardScreen.tsx` **unchanged**, mounted at the router's root route — the 4 new screens are purely additive routes, not a rewrite of existing behavior.

## Phase 1: Setup

- [X] T001 Add `react-router-dom` to `showcase/package.json` dependencies
- [X] T002 Extract `showcase/src/App.tsx`'s existing `<main>` content (metrics, chart, Tabs, CommandPalette, Toast, Modal) verbatim into `showcase/src/screens/DashboardScreen.tsx` with zero behavioral changes; `App.tsx` becomes the router + persistent layout shell (Sidebar/Navbar chrome + `<Outlet />`)

## Phase 2: Foundational

- [X] T003 **Deviation from plan**: used `HashRouter` instead of `BrowserRouter`+`basename`. Sidebar/Navbar (`packages/react/src/Sidebar`, `src/Navbar`) render plain `<a href>` anchors with no click-interception hook available for a bespoke `<Link>` wrapper without modifying their prop API (which FR-004 says to avoid — reuse the catalog's own nav components as shipped). `HashRouter` lets those real anchors (`href="#/team"`) "just work" as client-side navigation since a hash-only href change is always a same-document navigation, never a full reload — this also sidesteps the GitHub Pages subpath/basename problem entirely.
- [X] T004 Sidebar/Navbar items now include all 5 routes (`/`, `/team`, `/settings`, `/analytics`, `/onboarding`) as `href="#<path>"` anchors, with `onItemClick`/`useNavigate()` handling the actual route change; Dashboard's own internal Customers/Team tab anchors (`#customers`, `#team`) are untouched per T002's constraint

**Checkpoint**: Router shell in place, Dashboard behavior verified unchanged, 4 new routes are reachable.

## Phase 3: User Story 1 + 2 - Multi-screen navigation with real component breadth (P1)

- [X] T005 [P] [US1/US2] Built `TeamScreen.tsx` — member management: `AvatarGroup`, `Badge` (role legend), `DataTable` (plain-string cells only — confirmed `DataTable.tsx`'s cell renderer stringifies any value, so `ReactNode` cells silently show `[object Object]`), `Modal` (invite), `Tooltip` (on Invite button), `ContextMenu` (row actions, including a functional "Remove member")
- [X] T006 [P] [US1/US2] Built `SettingsScreen.tsx` — preferences: `Tabs` (Profile/Notifications/Security), `TextInput`, `Textarea`, `ColorInput`, `FileInput`, `Toggle`, `Radio`, `Checkbox`, `Accordion`, `Divider`
- [X] T007 [P] [US1/US2] Built `AnalyticsScreen.tsx` — reporting: `RingProgress`, `SemiCircleProgress`, `Progress`, `BarChart`, `PieChart` (donut), `AreaChart`, `Skeleton`, `EmptyState`
- [X] T008 [P] [US1/US2] Built `OnboardingScreen.tsx` — auth-adjacent flow: `Stepper`, `SocialLoginGroup`, `PasswordStrengthMeter`, `PinInput`, `OnboardingTour`, as a real controlled multi-step wizard (not a static demo)
- [X] T009 Extended `showcase/src/data/sample-data.ts` with `teamRecords`, `analyticsSeries`, `acquisitionChannels`, `onboardingSteps` — same static/fictional convention as the existing fixtures
- [X] T010 All 4 new screens wired into `showcase/src/App.tsx`'s `<Routes>`
- [X] T011 Verified via Playwright + manual browser check: all 5 screens reachable via Sidebar with no full reload; direct-URL load of `#/team`, `#/settings`, `#/analytics`, `#/onboarding` each renders correctly (HashRouter deep-links by construction)
- [X] T012 Executed quickstart.md §2's method: 45 distinct `@professional-design-system/react` component imports across all 5 screens + shared chrome combined (up from 21), out of 137 total exported components (~33% coverage, up from ~19%). **Note**: this clears the "substantially higher than 21" bar in SC-002 (+114%) but does not clear that same criterion's second clause, "a majority of the catalog's exported components are represented" (45/137 is not a majority) — recorded honestly rather than rounded up; see competitive-assessment.md §1-2 for what the highest-leverage next additions would be.
- [X] T013 Re-ran `tests/e2e/flagship-showcase.spec.ts` (29 tests) against the new router structure: all pass, including the 4 originally-fixed-defect regression checks (dark-theme contrast, DarkModeToggle/select desync, CommandPalette execute-order, Chart resize) — zero regression (SC-003)

**Checkpoint**: 5-screen app navigable, component coverage more than doubled, zero regression to the original Dashboard's fixed defects.

## Phase 4: User Story 3 - Competitive/quality assessment (P2)

- [X] T014 Wrote `specs/047-professional-showcase-expansion/competitive-assessment.md`: cross-references feature 044's `audit-findings.md` (20 flagged components, unremediated) and the constitution's "Known Catalog Gaps" (Date Picker/Calendar, Carousel, Scroll Area, Resizable panels, HoverCard, unchanged since feature 024) — plus one genuinely new finding: the template-literal CSS-purge defect (see T012b-2 below) is a *recurring defect class*, not an isolated bug, with no automated check catching it.

### Real defects found and fixed during this feature (FR-009)

- [X] **T012b-1** PieChart entrance-animation defect (pre-existing, not introduced by this feature): with `isAnimationActive={true}` (the default, non-reduced-motion path), zero `<Cell>`/sector elements ever rendered — confirmed via DOM inspection across 3 independent contexts (this feature's Analytics screen, the pre-existing `tests/react-harness`, and a production `vite preview` build). Existing E2E tests never caught this because `tests/e2e/*.spec.ts`'s `beforeEach` always forces `reducedMotion: "reduce"`, which takes the already-working code path. Fixed in `packages/react/src/Chart/PieChart.tsx` by hardcoding `isAnimationActive={false}` unconditionally. Verified: 5 sectors now render in the harness; full 28-test chart E2E suite (`react-chart-core/extended/batch-2/chrome.spec.ts`) still passes, zero regression.
- [X] **T012b-2** Stepper/Tooltip template-literal CSS purge (pre-existing, stems from feature 044's own new components): `Stepper.tsx`'s `stepper-step-${status}` and `Tooltip.tsx`'s `tooltip-anchor-${anchor}`/`tooltip-target-${anchor}` build class names from runtime template literals — Tailwind's content scanner can't see a class name that only exists as an interpolated string, so it silently purged the rule from the npm package's compiled CSS (same root cause already fixed once for `sidebar-${theme}`, never generalized). Tooltip was the severe case: `.tooltip-anchor-2/3/4` and all four `.tooltip-target-*` rules were missing — CSS Anchor Positioning never worked for any Tooltip shipped via npm. Fixed on the `044-component-catalog-modernization` branch (commit `5723d6c`, PR #3) by extending `packages/react/tailwind.config.ts`'s `safelist`, then fast-forward-merged into this feature's branch. Verified live in-browser: computed `anchor-name`/`position-anchor` now resolve correctly; Stepper renders as a proper horizontal step indicator with connector lines.

## Phase 5: Polish

- [X] T015 The existing `tests/e2e/flagship-showcase.spec.ts` overflow checks only navigate to the dashboard root, not the 4 new routes — so this ran a dedicated ad-hoc check (not committed to the suite) hitting all 4 new screens × the standard breakpoints (320/768/1024/1440) plus a dark-theme render check per screen: 20/20 pass, zero horizontal overflow, zero console errors under `data-theme="dim"`
- [X] T016 `npm run build --workspace showcase`: 773.96 KB JS / 209.81 KB gzipped, 167.51 KB CSS / 23.47 KB gzipped — within the "App page" budget (<300kb JS gzipped, <50kb CSS gzipped) in `rules/web/performance.md`
- [ ] T017 [P] Run `graphify update .` to sync the knowledge graph after all changes land — deferred to just before commit, once all files are final

---

## Dependencies & Execution Order

- Setup (T001-T002) blocks Foundational.
- Foundational (T003-T004) blocks all 4 new screens.
- T005-T008 (the 4 screens) are fully independent — different files, parallelizable.
- T009 (shared data file) can proceed in parallel with T005-T008 if screens are stubbed against planned data shapes first, or sequentially after — low risk either way given small file size.
- T010 depends on T005-T009.
- T011-T013 (validation) depend on T010.
- T014 (assessment) is independent of the screens' implementation — can proceed in parallel with Phase 3.
- Polish depends on everything above.

## Implementation Strategy

### MVP First

1. Setup + Foundational (router shell, Dashboard preserved unchanged) — this alone proves the risky part (routing doesn't break existing behavior) before adding new screens.
2. Add screens one at a time (T005-T008), validating after each that routing/existing behavior stays intact.
3. Assessment (T014) can be written any time, independently.
