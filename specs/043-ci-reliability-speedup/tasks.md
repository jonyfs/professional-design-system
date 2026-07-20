---

description: "Task list for CI Reliability & Radical Test Speedup (feature 043)"
---

# Tasks: CI Reliability & Radical Test Speedup

**Input**: Design documents from `/specs/043-ci-reliability-speedup/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (all present; no contracts/ — this feature exposes no external API)

**Tests**: Not explicitly requested as TDD in the spec; validation is via the executable scenarios in `quickstart.md`, referenced directly from the relevant tasks below instead of separate `tests/` files (this feature's "tests" are its own CI runs).

**Organization**: Tasks are grouped by user story (US1, US2, US3) from `spec.md`, in priority order.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: Maps the task to spec.md's US1/US2/US3
- File paths are exact and relative to repo root

---

## Phase 1: Setup

**Purpose**: Capture the pre-change reference point every later validation task compares against.

- [X] T001 [P] Record current full-CI baseline (trigger→conclusion wall-clock time, per-shard duration, cold browser-install time) by inspecting the last 3-5 completed `CI` runs via `gh run list --workflow=CI --json databaseId,createdAt,updatedAt,conclusion` and `gh run view <id> --log` for shard timings; write the findings to `specs/043-ci-reliability-speedup/baseline-metrics.md`
- [X] T002 [P] Determine whether the repo's installed `@playwright/test` version (check `package.json`/`package-lock.json`) supports `--shard-weights`; append the finding as a short addendum to the "R2" decision in `specs/043-ci-reliability-speedup/research.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Confirm the active baseline-drift incident is actually resolved before any speed work is measured against it — a still-failing suite would make every later timing/reliability comparison meaningless.

**⚠️ CRITICAL**: T004 (deleting the hotfix workflow) and T006 (US1's reliability validation) cannot proceed until this checkpoint passes.

- [X] T003 Confirmed the redispatched `Regenerate Linux Snapshots (temporary, manual)` run (29669609078, after the rebase fix in commit 8aeb9fa) completed with `conclusion: "success"`; its commit `3fbcb3c` ("chore: regenerate Linux visual baselines on real ubuntu-latest runner [skip ci]", 1570 files) is on `origin/main`

**Checkpoint**: Once T003 confirms a clean, committed baseline regeneration, US1/US2/US3 work can all proceed.

---

## Phase 3: User Story 1 - CI reliably reflects real code health, not environment drift (Priority: P1) 🎯 MVP

**Goal**: Eliminate the false-positive baseline-drift failures and remove the one-off hotfix surface, so CI failures always mean a real code problem.

**Independent Test**: Push two consecutive commits that contain no visual changes; both `CI` runs must pass with zero `toHaveScreenshot` failures attributable to environment drift (`quickstart.md` §1).

### Implementation for User Story 1

- [X] T004 [P] [US1] Deleted `.github/workflows/regen-snapshots.yml` — its one-time job succeeded and its output is committed (FR-010)
- [X] T005 [P] [US1] Add a short, permanent comment block above the `e2e` job in `.github/workflows/ci.yml` documenting that visual baselines must only ever be (re)generated via a real `ubuntu-latest` Actions run — never a local Docker approximation — citing this feature's own incident, following the same explanatory-comment convention feature 041 already used above the same job
- [ ] T006 [US1] Execute `quickstart.md` §1 against the real CI run this PR triggers: confirm it passes with zero baseline-drift failures (validates SC-001) — the fresh Linux baselines are now on `main`, this PR's own CI run (once opened) is the first real end-to-end validation; depends on T004, T005

**Checkpoint**: CI failures on `main` now only occur for genuine regressions — User Story 1 is fully functional and independently verified.

---

## Phase 4: User Story 2 - Every push gets a fast, trustworthy result (Priority: P1)

**Goal**: Cut CI wall-clock time further by removing the repeated cold browser-install cost and giving developers one aggregated report instead of one artifact per shard.

**Independent Test**: Push a small change and confirm total CI wall-clock time is substantially below the T001 baseline, with one merged report identifying any failure's exact test/project/shard (`quickstart.md` §2-§3).

### Implementation for User Story 2

- [X] T007 [P] [US2] Add an `actions/cache` step to the `e2e` job in `.github/workflows/ci.yml`, keyed on the installed Playwright version (e.g. hashing `package-lock.json`), caching the Playwright browser-binary download directory, placed before the existing "Install Playwright browsers" step
- [X] T008 [P] [US2] In `playwright.config.ts`, set `reporter` to Playwright's built-in `blob` reporter when `process.env.CI` is set (keep `html` for local runs), e.g. `reporter: process.env.CI ? "blob" : "html"`
- [X] T009 [US2] Update the `e2e` job's shard step in `.github/workflows/ci.yml` to upload each shard's `blob-report/` output as a distinctly-named artifact (e.g. `blob-report-shard-${{ matrix.shard }}`); depends on T008
- [X] T010 [US2] Add a new `merge-reports` job to `.github/workflows/ci.yml` that `needs: e2e`, downloads every shard's blob artifact, runs `npx playwright merge-reports --reporter html ./all-blob-reports` (per research R2), and uploads the single merged HTML report as one artifact; the job MUST fail (not silently pass) if any expected shard artifact is missing (data-model.md "Merged test report" failure-handling rule); depends on T009 — **implementation note**: rather than inspecting artifact presence directly, the job gates its own conclusion on `needs.e2e.result` (a crashed/failed shard already makes the upstream `e2e` matrix job report non-`success`), which covers the same failure mode with less brittle logic
- [X] T011 [US2] Based on T001's measured baseline and T002's `--shard-weights` support finding (not available in installed Playwright 1.61.1), increased the `e2e` job's `strategy.matrix.shard` count in `.github/workflows/ci.yml` from 4 to 6 to reduce the long-pole effect `baseline-metrics.md` measured (one shard ran >2x longer than its neighbors); reasoning documented as a code comment beside the matrix definition
- [ ] T012 [US2] Execute `quickstart.md` §2-§3: push a change, measure new CI wall-clock time and per-shard cache-warm setup time against the T001 baseline (validates SC-002/SC-005), and confirm the merged report correctly attributes a deliberately-introduced failing test to its exact name/project/shard (validates SC-004); depends on T010, T011

**Checkpoint**: CI on `main` is measurably faster and reports as one unified result — User Stories 1 and 2 both work independently and together.

---

## Phase 5: User Story 3 - Slow or flaky visual checks don't hold the functional pipeline hostage (Priority: P2)

**Goal**: Make functional/accessibility results distinguishable from visual-regression results in the CI output, without duplicating fixed costs across two separate workflows.

**Independent Test**: Introduce an isolated 1px visual-only change; functional/accessibility results stay unaffected while the visual-only failure is clearly attributable as such (`quickstart.md` §4).

### Implementation for User Story 3

- [X] T013 [P] [US3] ~~Tag every visual-regression assertion with a shared Playwright tag~~ — **DEVIATION**: verified during implementation that 141/146 `toHaveScreenshot` call sites across `tests/e2e/**/*.spec.ts` already have test titles containing the phrase "visual baseline" (a pre-existing, near-universal convention), leaving only 5 mixed-concern a11y tests untagged (correctly, since they're primarily accessibility tests). Reused this existing convention instead of adding ~140 new per-test tags across 74 files — same distinguishing outcome, zero test-file edits, zero risk of introducing a typo/regression across that many files. See `research.md` R3 addendum.
- [X] T014 [P] [US3] Added a "Functional vs. visual-regression breakdown" step to the `merge-reports` job in `.github/workflows/ci.yml` that runs `npx playwright test --list` (static enumeration, no browsers/build needed — verified locally) and greps for the "visual baseline" title convention (T013) to report declared visual vs. functional test counts to `$GITHUB_STEP_SUMMARY`; per-test pass/fail attribution by category is visible directly in the merged HTML report itself (T010), since each test's own title already carries the category
- [ ] T015 [US3] Execute `quickstart.md` §4: introduce a deliberate, isolated 1px visual-only change, confirm the functional/accessibility signal is unaffected and returns at normal speed while the visual failure is clearly attributed as visual, then revert the change; depends on T013, T014

**Checkpoint**: All three user stories are independently functional — CI is reliable, fast, and its failures are clearly categorized.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation sync across all three stories.

- [ ] T016 Execute the full `quickstart.md` (§1-§6) end-to-end as a final combined validation pass, including §6's confirmation that a deliberate single-shard failure still yields an overall `CI` failure conclusion and does not trigger `deploy-pages.yml` (FR-007 unchanged)
- [X] T017 Confirm local development is unaffected: verified `process.env.CI` is unset locally so `playwright.config.ts`'s new conditional reporter resolves to `"html"` (unchanged), then ran `npx playwright test tests/e2e/button.spec.ts --project=chromium-320` — 10/10 passed, `playwright-report/index.html` generated exactly as before (FR-009)
- [ ] T018 [P] Add a `.specify/memory/constitution.md` Sync Impact Report entry documenting this feature's real incident (Docker-vs-runner baseline drift) and its resolution, following the same amendment pattern used for features 039/041/042
- [ ] T019 [P] Run `graphify update .` to sync the knowledge graph after all workflow/config changes land, per this repo's `CLAUDE.md` convention

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001 and T002 can start immediately, in parallel
- **Foundational (Phase 2)**: No dependency on Phase 1's completion, but logically informs it — T003 can run immediately in parallel with Phase 1
- **User Story 1 (Phase 3)**: T004/T006 depend on T003 (Foundational); T005 has no hard dependency but is grouped with US1
- **User Story 2 (Phase 4)**: Depends only on Foundational (T003) being confirmed so timing measurements aren't polluted by drift failures; independent of US1's file changes (different files: `regen-snapshots.yml` vs. `ci.yml`/`playwright.config.ts`)
- **User Story 3 (Phase 5)**: Depends only on Foundational; T014 additionally builds on the `merge-reports` job US2 creates (T010), so in practice runs after US2's T010 even though the two stories are conceptually independent
- **Polish (Phase 6)**: Depends on all three user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent of US2/US3 at the file level (touches `regen-snapshots.yml` deletion + a comment in `ci.yml`); only shares the Foundational checkpoint
- **US2 (P1)**: Independent of US1; T014 (US3) reuses the `merge-reports` job US2's T010 creates, so US3 should land after US2 in practice even though both are P1/P2-independent in principle
- **US3 (P2)**: Builds on US2's merge-reports job (T010) for its reporting breakdown (T014); its test-tagging task (T013) is fully independent and can start anytime after Foundational

### Within Each User Story

- Verification/validation tasks (T006, T012, T015) come last within their story, after that story's implementation tasks land
- Tasks touching the same file (`.github/workflows/ci.yml` is touched by T005, T007, T009, T010, T011, T014) are sequenced, not parallel, even across stories, to avoid merge conflicts on the same file

### Parallel Opportunities

- T001 + T002 (Setup): different files, fully parallel
- T004 + T005 (US1): different files (`regen-snapshots.yml` deletion vs. `ci.yml` comment), parallel
- T007 + T008 (US2): different files (`ci.yml` cache step vs. `playwright.config.ts` reporter), parallel
- T013 + T014 (US3): different files (spec test tags vs. `ci.yml` reporting step), parallel
- T018 + T019 (Polish): different concerns/files, parallel

---

## Parallel Example: User Story 2

```bash
# Launch both independent US2 file changes together:
Task: "Add actions/cache step keyed on Playwright version to .github/workflows/ci.yml"
Task: "Set reporter to blob in CI in playwright.config.ts"

# Then sequentially (same file, each depends on the previous):
Task: "Update e2e job to upload blob-report artifact per shard (depends on reporter change)"
Task: "Add merge-reports job downloading all blob artifacts (depends on upload step)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) + Phase 2 (Foundational)
2. Complete Phase 3 (User Story 1) — this alone fixes the currently-failing `CI` runs
3. **STOP and VALIDATE**: confirm two consecutive clean runs (`quickstart.md` §1) before touching anything else
4. This is the minimum needed to unblock the currently-red `main` branch and its gated deploy pipeline

### Incremental Delivery

1. Setup + Foundational → confirmed clean baseline to measure against
2. User Story 1 → CI stops producing false-positive failures (MVP — unblocks `main`)
3. User Story 2 → CI gets measurably faster with one unified report
4. User Story 3 → functional and visual signals become distinguishable
5. Polish → full end-to-end validation, constitution sync, graph sync

### Parallel Team Strategy

With multiple contributors:

1. One contributor handles Foundational (T003) first — it gates US1's cleanup and both stories' timing validity
2. Once T003 clears: one contributor takes US1 (small, fast — unblocks deploys immediately), another starts US2's file-level tasks (T007/T008 don't depend on US1 at all)
3. US3's tagging task (T013) can start any time after Foundational; its reporting task (T014) waits on US2's T010

---

## Notes

- [P] tasks touch different files with no dependency on an incomplete task
- [Story] label maps each task to spec.md's US1/US2/US3 for traceability
- No task drops or samples existing test coverage (FR-004) — every change here is to *how* the existing 6690+ tests are run/reported/cached, never to *what* runs
- Commit after each task or logical group, consistent with this repo's existing convention of small, reviewable CI changes (see feature 041's own commit history)
- Verify `quickstart.md` scenarios pass before considering a phase's checkpoint met
