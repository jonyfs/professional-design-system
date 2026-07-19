# CI Baseline Metrics (captured 2026-07-18, before feature 043 changes)

Captured via `gh run list --workflow=CI` / `gh run view <id> --json jobs` against the current post-feature-041 (4-shard) `CI` workflow, before any feature 043 caching/reporting/reliability changes land.

## Reference run: 29664848475 (2026-07-18, most recent full 4-shard e2e execution)

| Job | Start | End | Duration |
|---|---|---|---|
| `verify` | 23:13:33 | 23:14:01 | 28s |
| `e2e (1)` | 23:14:05 | 23:30:43 | 16m38s |
| `e2e (2)` | 23:14:03 | 23:34:23 | 20m20s |
| `e2e (3)` | 23:14:03 | 23:34:12 | 20m9s |
| `e2e (4)` | 23:14:04 | 23:57:26 | **43m22s** |
| **Total wall-clock (trigger → conclusion)** | | | **43m57s** |

**Key finding**: shard 4 is the long pole at more than 2x the duration of shards 2/3 — direct, concrete confirmation of the "uneven shard duration" risk called out in spec.md's Edge Cases and FR-011. All 4 shards failed on this run (baseline-drift visual failures), and `retries: 1` (per `playwright.config.ts`) means every failing test re-runs once, which very likely explains shard 4's outsized duration if its assigned tests included a disproportionate share of the ~21 failing visual tests. This is exactly the kind of imbalance T011 (shard count/weight re-tuning) should address, and exactly the kind of noise T006's "two consecutive no-visual-change" validation must be measured against — a clean run (no retries triggered) is needed for an apples-to-apples "after" comparison, not just this failing "before" run.

## Other recent runs (context, not used as the primary reference)

| Run | Conclusion | Wall-clock | Note |
|---|---|---|---|
| 29658668249 | failure | 21m14s | Faster than 29664848475 — likely fewer retry-inducing failures that run |
| 29651061238 | failure | 53m57s | Slower — consistent with the same shard-imbalance / retry-noise pattern |
| 29650422475 | failure | 3s | Pre-existing, unrelated infra failure (see `github-actions-billing-block` memory note), not representative of suite runtime |

**No successful `CI` run exists in the last 40 runs** (most recent success: 2026-07-11, before feature 041's sharding was even added) — the suite has been red for reasons unrelated to code correctness (billing block, then baseline drift) for over a week. This is itself part of the case for User Story 1: there is currently no reliable recent "healthy suite" timing baseline to compare against, only failing-run durations, which is why T006 (two clean consecutive runs) is a hard prerequisite for any credible "before vs. after" speed claim in T012.

## Cold browser-install cost (fixed overhead per shard, every run)

Every shard currently runs `npx playwright install --with-deps` from a cold cache (no `actions/cache` step exists yet in `.github/workflows/ci.yml`). This is paid 4 times per run (once per shard) regardless of whether the Playwright version changed since the last run — the exact fixed cost T007's browser-binary cache targets.

## Baseline for comparison after feature 043 lands

- **Wall-clock target (SC-002)**: a further substantial reduction from the 43m57s failing-run reference above, measured instead against a clean (non-retry-triggering) run per T006/T012.
- **Per-shard setup target (SC-005)**: cache-warm shard startup measurably faster than the cold-install cost implied above (research R2 cites sub-15s once warm, versus the full `--with-deps` install today).
