# Quickstart: Validating CI Reliability & Radical Test Speedup

Prerequisites: push access to `main` (or a PR), `gh` CLI authenticated against this repo.

## 1. Confirm baseline-drift reliability (User Story 1 / SC-001)

1. Push a commit that touches no visual output (e.g. a comment-only or non-rendering change).
2. Watch the run: `gh run watch $(gh run list --workflow=CI --limit 1 --json databaseId --jq '.[0].databaseId')`
3. **Expected**: the `e2e` job's shards all pass — zero failures attributable to `toHaveScreenshot` baseline mismatch.
4. Repeat once more on a second unrelated no-visual-change commit to confirm it's not a one-off pass (spec SC-001 requires two consecutive clean runs).

## 2. Confirm wall-clock speedup (User Story 2 / SC-002, SC-005)

1. Note the current baseline: last full `CI` run duration before this feature's changes land (`gh run list --workflow=CI --json databaseId,createdAt,updatedAt --limit 5`).
2. Land this feature's CI changes (caching, blob reporter/merge, any shard-count/weight adjustment).
3. Push a small, low-risk change and time the run the same way.
4. **Expected**: total wall-clock time (trigger → final conclusion) is substantially lower than the pre-change baseline; a second, back-to-back run (browser cache warm) shows further-reduced per-shard setup time versus a cold-cache run.

## 3. Confirm unified reporting (User Story 2 / SC-004)

1. Deliberately introduce a failing test (temporarily) in one shard's assigned range.
2. Run CI and open the workflow run's artifacts/summary.
3. **Expected**: a single merged report identifies the failing test's exact name, browser/viewport project, and originating shard — no need to open more than one artifact to find it.
4. Revert the deliberate failure.

## 4. Confirm functional/visual separation (User Story 3)

1. Introduce an isolated 1px visual-only change to one component.
2. Run CI.
3. **Expected**: functional/accessibility results are unaffected and return at normal speed; the visual-only failure is clearly attributable as a visual-regression result, not conflated with a functional failure.
4. Revert the deliberate change.

## 5. Confirm hotfix workflow cleanup (FR-010 / SC-006)

1. `gh run list --workflow="Regenerate Linux Snapshots (temporary, manual)"` — confirm the one-time run completed successfully and its baseline commit landed on `main`.
2. `ls .github/workflows/regen-snapshots.yml` — confirm it has been deleted as part of this feature's implementation.
3. `ls .github/workflows/` — confirm no other temporary/one-off workflow files remain.

## 6. Confirm gating semantics unchanged (FR-007)

1. Introduce a deliberate failure in exactly one shard (leave the rest passing).
2. **Expected**: the overall `CI` workflow conclusion is `failure`; `deploy-pages.yml` (gated on `workflow_run` + CI `success`) does NOT trigger a deploy or version bump.
3. Revert the deliberate failure.
