# Research: CI Reliability & Radical Test Speedup

## R1. Root cause of the current baseline-drift failures

**Decision**: Visual baselines MUST be generated (and refreshed, whenever a genuine visual change is intended) by running the actual Playwright job on a real `ubuntu-latest`-hosted GitHub Actions runner — never in a locally-run Docker container meant to approximate that runner.

**Rationale**: this session's own incident is the direct evidence — baselines regenerated in a local Docker container (Node 22, matched OS string) still diverged pixel-for-pixel from the real `ubuntu-latest` runner, failing ~21 tests. Community consensus (TestQuality's 2026 Playwright Visual Regression guide, Duncan Mackenzie's CI visual-testing writeup) treats "run the official Playwright Docker image, both locally and in CI" as the standard fix for macOS-vs-Linux drift, but that treats Docker-on-a-dev-machine as equivalent to the CI runner — an assumption this project's own incident falsifies. GitHub's `ubuntu-latest` runner image (font packages, GPU/software rendering path, exact glibc/fontconfig versions) is not guaranteed identical to any Docker image built to approximate it, only to itself.

**Alternatives considered**:
- *Docker image locally, matched to CI* — already tried; caused the current incident. Rejected as the primary generation mechanism, though still useful for day-to-day local dev iteration where near-exact (not pixel-exact) parity is enough.
- *Loosen comparison thresholds (`maxDiffPixelRatio`, `threshold`)* — would mask a real class of regression along with the noise; rejected as it directly conflicts with spec FR-002 ("no reliability fix may reduce detection of real regressions").
- *Pin exact runner image version/digest* — reduces future drift within GitHub's own runner updates, but does not fix the Docker-vs-runner gap itself; adopted as a secondary hardening measure (see R5), not the primary fix.

## R2. Reducing E2E wall-clock time beyond the existing 4-way shard (feature 041)

**Decision**: Adopt three complementary, low-risk techniques on top of the existing `--shard` matrix: (a) cache Playwright's downloaded browser binaries keyed on the installed Playwright version, (b) switch each shard's reporter to Playwright's built-in `blob` reporter and add a final `merge-reports` job that produces one aggregated HTML report, (c) evaluate increasing shard count and/or using Playwright's `--shard-weights` (if the installed Playwright version supports it) to keep shard durations balanced by actual runtime rather than raw test count.

**Rationale** (from research, July 2026 sources — Playwright docs, TestDino, Qaskills, Bug0, endform.dev):
- Every one of the 4 current shards pays the full cost of `npx playwright install --with-deps` from a cold cache — a fixed cost that recurs on every run regardless of whether the Playwright version changed. `actions/cache` keyed on the Playwright version (already resolvable from `package-lock.json`/`node_modules/.package-lock.json`) is the standard, GitHub-native fix; TestDino/Qaskills both cite sub-15-second shard startup once the browser cache is warm, versus a much larger cold-install cost.
- The current setup uses `reporter: "html"` per shard with a separate `playwright-report/` artifact per shard — a developer investigating a red run must open up to 4 separate HTML reports. Playwright's own `--reporter=blob` + `playwright merge-reports` mechanism (documented on playwright.dev, reused across all surveyed 2026 guides) produces exactly one aggregated report with full per-test, per-project, per-shard attribution preserved — directly satisfying FR-005/FR-006/SC-004 without a custom report-stitching script.
- Community guidance (Qaskills' "Playwright CI on GitHub Actions: Complete 2026 Guide") frames shard count against wall-clock SLA bands: 8–20 minutes → 4–6 shards, 20+ minutes → 6–10+. The current suite's ~30-55 minute baseline (pre-041) and unknown post-041/pre-cache actual duration puts it plausibly past the "4 shards" band; whether to increase further is a decision `/speckit-tasks` should re-evaluate against a measured, current run time once caching lands (measure-then-tune, not a blind increase).
- `--shard-weights` (Playwright 1.57+ per this research) directly addresses spec edge case "uneven shard duration" (FR-011) — worth adopting IF the repository's installed Playwright version supports it; otherwise, keeping the existing project list stable and letting `fullyParallel: true` (already set) plus Playwright's own internal load-balancing across `--shard` do the work is an acceptable fallback.

**T002 verification (2026-07-18)**: the repo's installed `@playwright/test` is `1.61.1` (`npx playwright --version`). `npx playwright test --help` confirms `--reporter blob` and a working `npx playwright merge-reports` command are both available — R2's caching + blob/merge plan is directly supported. However, `--shard-weights` does **not** appear in `npx playwright test --help`'s output on this version, so it is not adopted; T011 falls back to re-tuning shard *count* (informed by `baseline-metrics.md`'s finding that shard 4 ran 2x longer than shards 2/3 on the reference run) rather than a weights flag that isn't available.

**Alternatives considered**:
- *Third-party test-splitting/orchestration service* — rejected; conflicts with this project's established "reuse an established mechanism over inventing/adopting a new one" convention (feature 041's own assumption, reaffirmed in this feature's spec), and Playwright's own sharding is sufficient and already in use.
- *Reduce number of browser/viewport projects (drop firefox or webkit, or fewer breakpoints)* — rejected outright: directly violates FR-004 ("no coverage reduction") and `rules/web/testing.md`'s mandated breakpoint/cross-browser matrix.
- *Self-hosted/larger GitHub-hosted runners* — plausible further lever, but introduces cost/infra a public open-source repo (per feature 041's own "Actions minutes are free for public repos" framing) doesn't need; not pursued unless the caching + reporting + shard-tuning combination proves insufficient.

## R3. Isolating visual-regression tests from functional/accessibility tests

**Decision**: Tag visual-regression (`toHaveScreenshot`) tests distinctly (e.g. a Playwright tag/grep pattern) so CI output — and, if useful, a dedicated job or step — can report "functional" vs. "visual" results separately, without introducing a second full test run or duplicating browser installs.

**Rationale**: multiple 2026 sources (bugbug.io, testquality.com) independently recommend `--grep-invert`/tag-based separation specifically so a slower-to-stabilize visual layer doesn't hide or delay the faster, higher-confidence functional signal. This is additive to the existing shard structure — it changes what's reported, not how work is distributed — so it composes cleanly with R2's caching/merge-report changes.

**Alternatives considered**:
- *Separate CI workflow entirely for visual tests* — would duplicate the `npm ci` / build / browser-install fixed costs across two workflows; rejected as working against the wall-clock goal.
- *No separation (status quo)* — rejected only insofar as it doesn't serve User Story 3; not a blocking issue, so this is treated as a should-have, not a must-have, to avoid over-scoping the feature.

## R4. Removing the temporary hotfix workflow

**Decision**: Once `.github/workflows/regen-snapshots.yml`'s one-time baseline-regeneration run is confirmed complete and its output committed to `main`, delete the workflow file entirely (already tracked as FR-010/SC-006).

**Rationale**: it was explicitly created as a one-off, manually-dispatched fix for the current incident, not a permanent CI surface; leaving it in place after use is unmanaged, undocumented CI surface area with no owner or trigger discipline.

## R5. Preventing recurrence of runner-drift baseline failures

**Decision**: Where practical, pin the GitHub Actions runner to a specific image label/version rather than a floating `ubuntu-latest` tag for the steps that render visual baselines, OR (if pinning proves impractical/unsupported for this repo's Actions plan) document that any future baseline regeneration MUST happen via a real Actions run (per R1), never a local approximation — closing the loop that caused this incident.

**Rationale**: `ubuntu-latest` is a moving target GitHub updates periodically; even after fixing today's Docker-vs-runner mismatch, a future silent runner image update could reintroduce drift. This is a defense-in-depth measure, not a replacement for R1.

**Alternatives considered**: pinning every CI job to a fixed runner version — rejected as overly broad (would also freeze the `verify` job and every non-visual step against a stale image for no benefit); scoped only to where visual baselines are generated/checked.
