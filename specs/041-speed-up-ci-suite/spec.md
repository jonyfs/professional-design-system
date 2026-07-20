# Feature Specification: Speed Up CI Test Suite

**Feature Branch**: `041-speed-up-ci-suite`

**Created**: 2026-07-18

**Status**: Superseded by 043-ci-reliability-speedup. This spec's core work (E2E suite sharded across 4 parallel CI jobs) was implemented directly (2026-07-18, no formal plan.md/tasks.md ever written for it); 043's spec explicitly references that shipped sharding as its own starting context and carries the speed/reliability problem forward.

**Input**: User description: "o que pode ser realizado para deixar os testes mais [rápidos]. Está demorando muito" (what can be done to make the tests faster — it's taking too long)

**Context** (observed directly during this session, not assumed): a full CI run of this catalog's E2E suite (6690 tests across 6 browser/viewport projects) currently takes 30-55 minutes wall-clock, both on GitHub Actions and in an equivalent local Docker run. This is the single largest source of feedback delay for every push to `main`, and now directly gates the GitHub Pages deploy + auto-semver pipeline (feature 039's constitution amendment) — a slow suite means a slow, delayed public release cycle, not just a slow feedback loop for the developer.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Faster feedback on every push to main (Priority: P1)

A developer pushes a change to `main` and wants to know, as soon as reasonably possible, whether it broke anything — including whether the change is safe to auto-deploy and auto-version. Today they wait 30-55 minutes for a single, serial CI job to work through all 6690 tests one browser/viewport project at a time.

**Why this priority**: This is the actual, current pain point driving the request — every other improvement is secondary to cutting the real wall-clock wait.

**Independent Test**: Push a small, low-risk change to `main` and measure the time from push to CI reporting a result (success or failure) — confirm it is meaningfully shorter than today's 30-55 minute baseline, with no reduction in what is actually verified.

**Acceptance Scenarios**:

1. **Given** a push to `main`, **When** CI runs, **Then** the total wall-clock time from trigger to final result is measurably lower than the pre-existing 30-55 minute baseline.
2. **Given** the same commit, **When** the sped-up suite finishes, **Then** it reports exactly the same pass/fail/skip verdict as the pre-existing full serial run would have — no test is dropped or silently weakened to gain speed.
3. **Given** the sped-up suite fails, **When** a developer inspects the failure, **Then** they can identify which specific test(s) failed exactly as easily as with today's single-job report (no loss of failure attribution from splitting work across parallel jobs).

---

### User Story 2 - Deploy pipeline gate is no longer the long pole (Priority: P2)

Following feature 039's new policy, GitHub Pages only deploys — and semantic version only bumps — after CI reports success on `main`. A slow CI run means a slow, delayed public release for every change, even ones that will obviously pass.

**Why this priority**: This is a direct, real consequence of the P1 problem specifically for the deploy pipeline this catalog just adopted, but it's a downstream effect rather than the root cause itself.

**Independent Test**: Push a change to `main`, and measure the elapsed time from push to the GitHub Pages site actually reflecting the change (through the full CI → Pages deploy → version bump chain) — confirm it is meaningfully shorter than today's baseline.

**Acceptance Scenarios**:

1. **Given** a push to `main` that passes all checks, **When** the full pipeline (CI, then Pages deploy, then version bump) completes, **Then** the total elapsed time is meaningfully reduced from today's baseline.

---

### Edge Cases

- What happens if splitting the work across more parallel jobs increases *total compute time/cost* even while reducing *wall-clock* time? (Acceptable trade-off — this feature explicitly optimizes for wall-clock feedback speed, not total CI minutes consumed, since the repository is public and GitHub Actions minutes are free for public repos.)
- What happens to visual-regression baseline maintenance (Linux `.png` snapshots, feature 039's own recent fix) if the suite is restructured? (Every existing baseline must remain valid and discoverable — restructuring how tests are distributed across parallel jobs must not change snapshot file naming/lookup.)
- What happens if one parallel shard/job takes much longer than the others (uneven distribution)? (The slowest shard determines the real wall-clock savings — work should be distributed to keep shards roughly balanced in duration, not just in test count.)
- What happens to the already-known, pre-existing flaky tests (Menubar rapid-keypress edge case, occasional webkit timing-sensitive tests) under a restructured pipeline? (They must remain exactly as flaky/non-flaky as before — this feature is about wall-clock speed, not test reliability, and must not mask or hide existing flakiness.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: CI MUST distribute the existing 6690 tests across multiple parallel jobs/runners rather than one single serial job, reducing total wall-clock time.
- **FR-002**: Every test currently run MUST continue to run — no test may be dropped, skipped, or sampled to achieve a speed improvement.
- **FR-003**: The final CI result MUST clearly report which specific test(s) failed and in which browser/viewport project, with no loss of the current per-test failure detail when work is split across parallel jobs.
- **FR-004**: The overall CI job MUST only be considered "successful" (for the purposes of gating the GitHub Pages deploy + auto-semver pipeline) when ALL parallel portions of the suite succeed — a partial-success state must not trigger a deploy/version bump.
- **FR-005**: Visual regression baseline files (the existing per-platform `.png` snapshots) MUST remain valid and correctly discovered by whichever parallel job renders each test, with zero changes to snapshot file naming or lookup behavior.
- **FR-006**: The change MUST NOT alter what "passing" means for any individual test — existing known pre-existing flaky tests remain exactly as flaky as before, not hidden or newly retried away.
- **FR-007**: Local development workflows (running the suite or a subset of it on a developer's own machine) MUST continue to work exactly as they do today — this feature only changes how CI distributes work, not the test suite's own structure or the local `npx playwright test` experience.

### Key Entities

- **Test shard**: a subset of the full 6690-test suite assigned to run in one parallel CI job; shards run concurrently, and the overall CI result is the combination of every shard's own result.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A full CI run's wall-clock time (trigger to final result) is reduced by at least 50% from the pre-existing 30-55 minute baseline.
- **SC-002**: 100% of the 6690 tests currently run continue to run on every CI trigger — zero coverage reduction.
- **SC-003**: A failing test's exact name, browser/viewport project, and shard are all identifiable from the CI result with no additional investigation steps beyond what today's single-job report already requires.
- **SC-004**: The GitHub Pages deploy + auto-semver pipeline's end-to-end time (push to live, versioned deploy) is reduced proportionally to the CI wall-clock improvement.

## Assumptions

- "Faster" is interpreted as wall-clock time to a result, not total compute/CI-minutes consumed — the repository is public, so GitHub Actions minutes are free and not a cost constraint driving this request.
- The existing 6 browser/viewport projects (chromium-320/768/1024/1440, firefox-1440, webkit-1440) and their current test assignment stay as-is; this feature is about distributing that existing work across more parallel runners, not reducing or restructuring what each project tests.
- Splitting work across parallel jobs is expected to reuse Playwright's own built-in sharding mechanism rather than a hand-rolled test-splitting scheme, consistent with this catalog's own "reuse an established mechanism over inventing a new one" convention seen throughout prior features.
- This feature is scoped to CI (`.github/workflows/ci.yml`) only; the GitHub Pages deploy workflow's own gating logic (feature 039) is unchanged except for reacting faster once CI itself completes sooner.
