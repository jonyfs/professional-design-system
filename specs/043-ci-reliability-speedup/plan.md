# Implementation Plan: CI Reliability & Radical Test Speedup

**Branch**: `043-ci-reliability-speedup` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/043-ci-reliability-speedup/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Two of the most recent `CI` runs on `main` failed because Linux visual-regression baselines were generated in a local Docker container that doesn't pixel-match the real `ubuntu-latest` GitHub Actions runner. Independently, the E2E suite (6690+ tests, already sharded 4-ways per feature 041) is still slower than desired — every shard reinstalls Playwright's browser binaries from scratch and there's no unified report across shards. The technical approach: (1) generate/refresh visual baselines exclusively via real `ubuntu-latest` Actions runs, never a local Docker approximation (already underway as a hotfix); (2) cache Playwright's browser binaries keyed on the installed version to cut fixed per-shard startup cost; (3) switch to Playwright's built-in `blob` reporter + `merge-reports` for one aggregated report across shards; (4) re-tune shard count/weighting once the above land and current run time is re-measured; (5) tag/separate visual-regression tests from functional/accessibility tests for clearer, faster functional signal; (6) delete the temporary `regen-snapshots.yml` hotfix workflow once its one-time job is confirmed done.

## Technical Context

**Language/Version**: TypeScript (repo-wide) + YAML (GitHub Actions workflow definitions); Node.js LTS (`actions/setup-node` with `node-version: 'lts/*'`)

**Primary Dependencies**: `@playwright/test` (E2E + visual regression + accessibility), GitHub Actions (`actions/checkout@v5`, `actions/setup-node@v5`, `actions/cache`, `actions/upload-artifact@v4`), npm workspaces (root + `packages/react` + `tests/react-harness` + `showcase`)

**Storage**: N/A — no application data store; this feature manages GitHub Actions cache entries (browser binaries) and workflow artifacts (blob reports, HTML reports) only

**Testing**: Playwright Test — the subject of this feature is the test *infrastructure* itself (`.github/workflows/ci.yml`, `playwright.config.ts`), not new application test cases

**Target Platform**: GitHub Actions, `ubuntu-latest`-hosted runners (all jobs); no change to the 6 existing browser/viewport projects (chromium-320/768/1024/1440, firefox-1440, webkit-1440), which continue to run inside Playwright's own Chromium/Firefox/WebKit engines regardless of runner OS

**Project Type**: Web design-system monorepo (single repo, multiple npm workspaces) — this feature is CI/build tooling, not a new application feature; no new source directories

**Performance Goals**: Substantially reduce full-suite CI wall-clock time from the current post-feature-041 (4-shard) baseline; sub-15-second per-shard Playwright browser setup once the binary cache is warm (per research R2); zero increase in false-positive (environment-drift) failures (SC-001)

**Constraints**: FR-004 (zero test-coverage reduction), FR-007 (deploy-pages.yml's `workflow_run` gate semantics — overall `CI` success only when every shard passes — must remain exactly as strict), FR-008 (no masking of pre-existing flaky tests via new retries/thresholds), FR-009 (local `npx playwright test` workflow unchanged)

**Scale/Scope**: 6690+ tests across 6 browser/viewport projects, currently 4 parallel CI shards (subject to re-tuning per research R2); one `.github/workflows/ci.yml` file, one `playwright.config.ts` file, one temporary hotfix workflow to be removed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This feature is CI/build infrastructure, not a UI component or design-token change, so Principles I (Cognitive Ergonomics), II (WCAG AAA), III (Tailwind-Only), IV (Design Token Discipline), and V (Interactive State Completeness) do not apply — no new UI is introduced.

- **Principle VI (Project Language Policy, NON-NEGOTIABLE)**: PASS. All workflow YAML, config, and planning-doc changes are in English; this plan and all specs/research/data-model/quickstart docs are in English; all agent-to-user communication for this feature is in PT-BR.
- **Principle VII (Autonomous Skill Acquisition Protocol, NON-NEGOTIABLE)**: PASS / N/A. All proposed mechanisms (`actions/cache`, Playwright's own `--shard`, `blob` reporter, `merge-reports`, optionally `--shard-weights`) are either already-adopted GitHub-first-party actions or built-in Playwright CLI features — no new external skill, plugin, or third-party service is being installed.
- **Governance — Live Deployment & Semantic Versioning (feature 039, v1.37.0)**: PASS, with an explicit constraint carried forward: `deploy-pages.yml` triggers only via `workflow_run` keyed on the `CI` workflow's own `success` conclusion, never an independent trigger. Every change in this feature (caching, reporting, shard re-tuning) MUST preserve "the `CI` workflow's overall conclusion is `success` if and only if every shard/job succeeded" exactly as strictly as today (spec FR-007) — this plan introduces no new deploy trigger path and does not touch `deploy-pages.yml`'s own gating logic.

**Result**: No violations. No entries required in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/043-ci-reliability-speedup/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md         # Phase 1 output (/speckit-plan command)
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

No new source directories. This feature modifies existing CI/build configuration in place:

```text
.github/
└── workflows/
    ├── ci.yml                    # MODIFIED: browser-binary cache, blob reporter +
    │                             # merge-reports job, possible shard count/weight
    │                             # re-tuning, visual/functional test tagging
    └── regen-snapshots.yml       # DELETED once its one-time hotfix run is
                                  # confirmed complete (FR-010)

playwright.config.ts             # MODIFIED (if adopted): reporter set to "blob" in
                                  # CI, tags/grep pattern separating visual-regression
                                  # tests from functional/accessibility tests

tests/e2e/**/*.spec.ts-snapshots/*-linux.png
                                  # REGENERATED (already in progress via a real
                                  # ubuntu-latest run) — naming/lookup unchanged
```

**Structure Decision**: No new workspaces, packages, or application directories — this is a targeted, in-place change to the existing single `CI` GitHub Actions workflow and the single root `playwright.config.ts` already used by every E2E test across every workspace (`tests/e2e`, `packages/react`, `tests/react-harness`, `showcase`). No "contracts/" directory is generated: this feature exposes no external API, CLI surface, or public interface — its only "contract" is the internal one already documented in data-model.md (shard matrix, cache key, merged-report shape), which is CI-internal and doesn't warrant a separate public contract artifact.

## Complexity Tracking

*No entries — Constitution Check passed with no violations.*
