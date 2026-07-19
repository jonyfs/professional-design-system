# Feature Specification: CI Reliability & Radical Test Speedup

**Feature Branch**: `043-ci-reliability-speedup`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "revise os ultimos workflow actions no github pois estão falhando. os testes ainda demoram muito a executar, busque na internet solucoes que vise acelerar estes testes, diminuindo radicalmente o tempo de execucao, ou seja, melhorando a performance" (the last GitHub Actions workflow runs are failing; the test suite still takes too long — research internet solutions to radically cut execution time and improve performance)

**Context** (observed directly during this session): the current `CI` workflow's `e2e` job (feature 041) already shards the 6690-test Playwright suite across 4 parallel `ubuntu-latest` jobs, but the two most recent runs on `main` still failed — root cause was that the Linux visual-regression baseline `.png` snapshots checked into the repo were generated in a local Docker container, and pixel-level rendering (anti-aliasing, font hinting) differs just enough between that container and the real `ubuntu-latest` GitHub-hosted runner to fail `toHaveScreenshot` comparisons across ~21 tests. A separate, temporary workflow was already dispatched to regenerate baselines directly on a real `ubuntu-latest` runner as an immediate hotfix. Independently, the developer reports the suite is still too slow even when it passes — each of the 4 shards reinstalls Playwright's browser binaries from scratch (`npx playwright install --with-deps`) and rebuilds `packages/react` before running any test, and there is no cross-run caching of either the npm-installed Playwright browsers or a merged single test report across shards.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - CI reliably reflects real code health, not environment drift (Priority: P1)

A developer pushes a change to `main` and expects CI to fail only when their change actually broke something — not because a visual baseline was captured in an environment that doesn't pixel-match the CI runner that checks it.

**Why this priority**: Recurring false-positive failures are worse than slow tests — they train developers to ignore red CI, which defeats the entire purpose of gating the GitHub Pages deploy + auto-semver pipeline (feature 039) on CI success.

**Independent Test**: Push a change that does not alter any visual output, and confirm CI passes on the first attempt — no visual-regression failures attributable to baseline/runner environment drift.

**Acceptance Scenarios**:

1. **Given** a push to `main` with no visual changes, **When** CI runs the `e2e` job, **Then** zero tests fail due to baseline-vs-runner rendering drift.
2. **Given** the process used to generate or refresh visual baselines, **When** a developer or CI regenerates them, **Then** the generation happens in an environment that pixel-matches the real CI runner (not a local Docker approximation of it), so this class of failure cannot recur silently.
3. **Given** a genuine visual regression (an actual unintended UI change), **When** CI runs, **Then** it still fails and reports exactly which test/component/viewport changed — reliability fixes must not reduce detection of real regressions.

---

### User Story 2 - Every push gets a fast, trustworthy result (Priority: P1)

A developer pushes to `main` and wants the full CI result — type check, audits, build, and the entire 6690-test E2E suite — back significantly faster than today, without losing any coverage or per-test failure detail.

**Why this priority**: This is the direct ask ("diminuindo radicalmente o tempo de execução") and, combined with User Story 1, is what actually unblocks fast, confident iteration and the deploy pipeline built on top of CI.

**Independent Test**: Push a small, low-risk change and measure wall-clock time from push to final CI result; confirm it is substantially lower than the current baseline while every one of the 6690 tests still ran and reported individually.

**Acceptance Scenarios**:

1. **Given** a push to `main`, **When** CI runs, **Then** total wall-clock time from trigger to final result is substantially reduced from the current baseline (post feature-041 sharding).
2. **Given** repeated CI runs on unchanged dependencies, **When** the `e2e` job starts, **Then** it does not pay the full fixed cost of re-downloading/reinstalling Playwright's browser binaries from the network on every single run.
3. **Given** 4 (or more) parallel shards each produce their own result, **When** CI finishes, **Then** a developer can see one unified, aggregated report (pass/fail counts, which shard, which project/browser/viewport) rather than needing to open multiple separate per-shard artifacts to understand overall health.
4. **Given** the sped-up pipeline, **When** any single test fails, **Then** its exact name, browser/viewport project, and shard remain identifiable with no loss of the diagnostic detail available today.

---

### User Story 3 - Slow or flaky visual checks don't hold the functional pipeline hostage (Priority: P2)

A developer wants a fast signal on functional correctness (does the app still work) even in cases where a visual/screenshot check is inherently slower or more environment-sensitive.

**Why this priority**: Separating "did I break behavior" from "did a screenshot shift by a few pixels" lets the fast, high-confidence signal return quickly while the more failure-prone visual layer is isolated — this directly serves both the reliability and speed goals without trading one for the other.

**Independent Test**: Introduce a deliberate, isolated visual-only change (e.g. a 1px spacing tweak) and confirm the functional/accessibility signal is unaffected and returns at its normal fast speed, while the visual layer surfaces the change clearly on its own.

**Acceptance Scenarios**:

1. **Given** the test suite contains both functional/accessibility tests and pixel-level visual-regression tests, **When** CI runs, **Then** the two categories are distinguishable in the CI result (which failed: behavior vs. visuals).
2. **Given** a known pre-existing flaky test (e.g. the Menubar rapid-keypress case noted in feature 041), **When** the suite is restructured for speed, **Then** it remains exactly as flaky as before — not hidden, not newly retried into false confidence.

---

### Edge Cases

- What happens if browser-binary caching goes stale (a new Playwright version ships but the cache key wasn't bumped)? System must key the cache to the installed Playwright version so a version bump automatically invalidates and refreshes the cache rather than silently running mismatched browser binaries.
- What happens if the aggregated/merged report generation step itself fails (e.g. one shard produced no artifact because the runner crashed)? The overall CI result must still surface as a failure — a missing shard must never be silently treated as "passed" by the merge step.
- What happens to the temporary hotfix workflow (`regen-snapshots.yml`) created to unblock the currently-failing runs? It is out of scope for this feature's long-term design but must be removed once baselines are confirmed regenerated on a real runner, so it doesn't linger as one-off, undocumented CI surface area.
- What happens if radical speedup techniques (more shards, weighted sharding, caching) increase total compute/CI-minutes even while cutting wall-clock time? Acceptable — consistent with feature 041's existing assumption that this public repo optimizes for wall-clock feedback speed, not total Actions minutes consumed.
- What happens when a shard has disproportionately more slow tests than others (uneven shard duration)? Work distribution must account for actual runtime balance, not just raw test count, so the slowest shard doesn't erase the benefit of parallelizing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Visual-regression baseline images MUST be produced (initially and on every future refresh) in an environment that pixel-matches the real CI runner used to check them — not approximated via a separately-maintained local container — so this specific class of false-positive failure cannot silently reappear.
- **FR-002**: CI MUST NOT report failure for any test whose only difference from baseline is attributable to environment/runner drift rather than an actual code or content change.
- **FR-003**: The `e2e` job MUST avoid re-fetching Playwright's browser binaries from the network on every run when the required version is unchanged from a prior successful run.
- **FR-004**: CI MUST continue to run all 6690+ existing tests on every trigger — no test may be dropped, sampled, or skipped to achieve a speed improvement.
- **FR-005**: CI MUST produce one unified, aggregated test report/summary across all parallel shards, in addition to (or replacing the need to check) each shard's individual artifact.
- **FR-006**: The final CI result MUST clearly attribute any failure to its exact test name, browser/viewport project, and shard — with no loss of the per-test diagnostic detail available in the current single-artifact-per-shard setup.
- **FR-007**: CI MUST only be considered "successful" (for gating the GitHub Pages deploy + auto-semver pipeline) when every parallel shard succeeds — a partial pass must not trigger a deploy/version bump.
- **FR-008**: Known pre-existing flaky tests MUST remain exactly as flaky as before this change — the speedup/reliability work must not mask or newly paper over existing flakiness through added retries or altered thresholds.
- **FR-009**: Local development workflows (running the full suite or a subset on a developer's own machine) MUST continue to work exactly as they do today.
- **FR-010**: The temporary hotfix workflow created to regenerate the current failing baselines MUST be removed once its one-time job is confirmed complete and its output committed — it is not part of this feature's permanent CI surface.
- **FR-011**: Work distribution across parallel shards SHOULD account for actual test runtime, not only test count, to keep shard durations balanced and avoid one slow shard eroding the overall speedup.

### Key Entities

- **Visual baseline snapshot**: a checked-in per-platform `.png` reference image used by visual-regression assertions; must be generated in an environment matching the runner that later checks it.
- **Test shard**: a subset of the full test suite assigned to one parallel CI job; shards run concurrently and are combined into one overall CI result.
- **Merged test report**: a single aggregated view of pass/fail/skip results and failure detail across all shards of one CI run.
- **Browser binary cache**: a persisted, version-keyed cache of Playwright's downloaded browser binaries, reused across CI runs to avoid redundant network installs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Two consecutive CI runs on `main` with no visual changes both pass with zero baseline/runner-drift failures.
- **SC-002**: A full CI run's wall-clock time (trigger to final result) is reduced by a further, substantial margin from the current post-sharding baseline.
- **SC-003**: 100% of currently-run tests continue to run and report individually on every CI trigger — zero coverage reduction.
- **SC-004**: A developer can determine overall pass/fail status and identify any failing test's name, browser/viewport, and shard from a single aggregated report, without opening more than one artifact.
- **SC-005**: Repeated CI runs with an unchanged Playwright version show measurably reduced per-shard setup time compared to a full from-scratch browser install.
- **SC-006**: Zero temporary/hotfix workflows remain in `.github/workflows/` once the current baseline-drift incident is resolved.

## Assumptions

- "Radically faster" is measured as wall-clock time from push to final CI result, not total compute/Actions-minutes consumed — consistent with feature 041's existing assumption for this public repository.
- The existing 6 browser/viewport projects (chromium-320/768/1024/1440, firefox-1440, webkit-1440) and current 4-way shard count are a starting point, not a fixed ceiling — this feature may adjust shard count or weighting if that yields a substantial further speedup, per FR-004's "no dropped coverage" constraint.
- "An environment that pixel-matches the real CI runner" is interpreted as: generate/refresh baselines by running the actual job on a real `ubuntu-latest`-hosted GitHub Actions runner (as the in-progress hotfix already does), rather than introducing a new local Docker approximation layer — since a prior Docker-based approximation is exactly what caused the current incident.
- Caching Playwright browser binaries and npm dependencies is expected to reuse GitHub Actions' own built-in caching mechanisms (`actions/cache`, `actions/setup-node`'s npm cache) rather than a third-party or hand-rolled caching scheme, consistent with this project's convention of reusing established mechanisms.
- Merged/aggregated reporting is expected to reuse Playwright's own built-in blob-reporter/merge-report mechanism rather than a custom report-stitching script.
- This feature is scoped to `.github/workflows/ci.yml`, `playwright.config.ts`, and the visual-baseline regeneration process; the GitHub Pages deploy workflow's own gating logic (feature 039) is unchanged except for reacting once CI completes sooner and reliably.
