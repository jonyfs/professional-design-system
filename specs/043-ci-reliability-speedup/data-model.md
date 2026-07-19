# Data Model: CI Reliability & Radical Test Speedup

This feature has no application data model — it operates entirely on CI configuration and build/test artifacts. The "entities" below are CI artifacts and configuration objects, documented for traceability back to the spec's Key Entities section.

## Visual baseline snapshot

- **Represents**: a checked-in per-platform `.png` reference image consumed by `toHaveScreenshot()` assertions in `tests/e2e/**/*.spec.ts`.
- **Location**: `tests/e2e/**/*.spec.ts-snapshots/*-linux.png` (existing convention; naming/lookup unchanged per spec FR-005 precedent from feature 041).
- **Generation rule** (this feature): MUST be produced by a real `ubuntu-latest` GitHub Actions run, never a local Docker approximation (research R1).
- **Validation rule**: a snapshot is considered valid for a CI run only if the runner that generated it and the runner that checks it are both real GitHub-hosted `ubuntu-latest` runners (or a pinned equivalent, per R5).

## Test shard

- **Represents**: one `--shard=N/M` slice of the full `tests/e2e/` suite, executed as one matrix entry in the `e2e` job of `.github/workflows/ci.yml`.
- **Attributes**: shard index, shard total, assigned tests (Playwright-internal, test-count or weight-based), pass/fail/skip counts, wall-clock duration.
- **Relationship**: N shards together cover exactly the full suite with no overlap gaps; the overall `e2e` job (and therefore the `CI` workflow's conclusion consumed by `deploy-pages.yml`'s `workflow_run` gate) is `success` only if every shard is `success` (spec FR-007, already true today via GitHub Actions matrix semantics — must remain true).

## Browser binary cache

- **Represents**: a persisted cache of Playwright's downloaded browser binaries (Chromium, Firefox, WebKit + OS deps), reused across CI runs.
- **Cache key**: derived from the installed Playwright version (e.g. resolved from `package-lock.json`), so a version bump invalidates the cache automatically (spec edge case: stale-cache risk).
- **Scope**: shared across all 4 (or N) shards of the `e2e` job within a run, and across runs on `main` until the key changes.

## Merged test report

- **Represents**: one aggregated Playwright HTML report combining every shard's `blob` reporter output for a single CI run.
- **Inputs**: one blob artifact per shard (uploaded by each matrix job).
- **Output**: a single downloadable/browsable report showing pass/fail/skip per test, per project (browser/viewport), per originating shard — no loss of the current per-shard diagnostic granularity (spec FR-006).
- **Failure handling**: if any shard's blob artifact is missing (e.g. runner crash), the merge/aggregation step MUST NOT report an overall "success" — a missing shard is a failure, not a silent pass (spec edge case).
