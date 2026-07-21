# Implementation Plan: NPM Publish Automation

**Branch**: `051-npm-publish-automation` | **Date**: 2026-07-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/051-npm-publish-automation/spec.md`

## Summary

Extend the existing `.github/workflows/release.yml` `changesets/action@v1` step with a `publish` command, so the same job that already opens/updates the "Version Packages" PR also runs `npm publish` automatically — but only on the run immediately after a maintainer merges that PR, which is `changesets/action`'s own built-in distinction (pending changesets → PR; no pending changesets & versions differ from the registry → run the publish command). This reuses the action's native mechanism rather than hand-rolling version-bump detection, registry-state checking, or tagging — `changeset publish` already skips already-published versions and creates git tags itself.

## Technical Context

**Language/Version**: GitHub Actions YAML workflow (same as every other file in `.github/workflows/`); no new language.

**Primary Dependencies**: `changesets/action@v1` (already a dependency of `release.yml`, feature 050) — its `publish` input is the only new capability enabled, no new action or package added. `@changesets/cli`'s own `changeset publish` command (already in `devDependencies` transitively via the `changesets/action` toolchain, confirmed by `npx changeset` already working per `docs/PUBLISHING.md`).

**Storage**: N/A.

**Testing**: This is a CI-workflow change; there is no unit-test framework for GitHub Actions YAML in this repo. Verification is: (a) a dry run using `npm pack` + install-into-a-separate-project (the same stand-in feature 048 already established for testing publish behavior without real registry credentials — reused here to verify the tarball contents step, FR-006, before this ships), and (b) `docs/PUBLISHING.md`'s own existing Steps 3-4 (build/verify, tarball sanity-check) become the automated verification step this workflow runs before publishing, so passing them locally already tests the exact commands the workflow will run.

**Target Platform**: GitHub Actions (`ubuntu-latest`), same runner already used by every other workflow in `.github/workflows/`.

**Project Type**: CI/CD configuration change — one workflow file modified, one documentation file (`docs/PUBLISHING.md`) updated, one new repository secret (`NPM_TOKEN`) provisioned manually by whoever administers this repo (not something this plan or any workflow can create — a human step, named explicitly in Project Structure below).

**Performance Goals**: N/A — publish automation is not latency-sensitive; SC-001 through SC-005 are correctness/visibility outcomes, not speed targets.

**Constraints**: `NPM_TOKEN` MUST be scoped to publish access only (npm "Automation" token type, per npm's own guidance for CI use — least-privilege, matches this project's existing secret-handling posture for `GITHUB_TOKEN` usage elsewhere in `.github/workflows/`); MUST never be logged or exposed to a non-publish job step; the publish step MUST run only in the same job as `changesets/action` (not a separate job triggered by output-passing, which would need its own credential-scoping review) to keep the credential blast radius identical to what `release.yml` already has for `GITHUB_TOKEN`.

**Scale/Scope**: 1 workflow file modified (`.github/workflows/release.yml`), 1 doc file updated (`docs/PUBLISHING.md`), 1 repository secret added (`NPM_TOKEN`, manual/human step). No application code, no new workspace package, no new test files (per Testing above — this feature has no unit-test surface, only the pack/install-verification dry run already used in feature 048).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| Distribution & Ecosystem Standards — publish authorization (v2.0.0, amended this session) | Publish only fires on the commit representing a merged Version Packages PR — the merge itself is the human authorization; no AI agent or unattended trigger runs `npm publish` directly | ✅ |
| Distribution & Ecosystem Standards — changelog/semver discipline | Publish automation doesn't change what's published or how versions are computed (already Changesets' job since feature 050) — it only automates the final manual command | ✅ |
| Distribution & Ecosystem Standards — README/CHANGELOG/LICENSE stay current | Unaffected — `npm pack` tarball-contents check (FR-006) already verifies these ship in every published version, same as today's manual Step 4 | ✅ |
| Secret Management (constitution `security.md`-equivalent discipline already followed by `GITHUB_TOKEN` usage in this repo's workflows) | `NPM_TOKEN` stored as a GitHub Actions repository secret, never in a workflow file or committed anywhere; scoped to publish-only per Constraints above | ✅ |
| Test-First (where the plan calls for code) | No application code is added by this feature — the "test" is the existing pack/install dry-run reused, and Constitution Principle VI's test-first discipline is not applicable to a CI-workflow-only change with no testable application logic | N/A |

No violations — no Complexity Tracking entry needed.

## Project Structure

### Documentation (this feature)

```text
specs/051-npm-publish-automation/
├── plan.md              # This file
└── checklists/
    └── requirements.md  # Already present
```

No `research.md`/`data-model.md`/`contracts/` needed — this is a CI workflow extension reusing an existing, already-integrated action's built-in publish mechanism, with no new data model or API surface.

### Source Code (repository root)

```text
.github/workflows/release.yml   # MODIFIED: changesets/action@v1 step (currently
                                 #   title/commit inputs only, L38-43) gains:
                                 #   - a `publish: npx changeset publish` input
                                 #   - an `NPM_TOKEN: ${{ secrets.NPM_TOKEN }}` env var
                                 #     alongside the existing `GITHUB_TOKEN` env
                                 #   - a preceding step running the same build +
                                 #     verify + `npm pack`/tarball-contents check
                                 #     docs/PUBLISHING.md's Steps 3-4 already document,
                                 #     so publishing is gated on it passing in this run
docs/PUBLISHING.md              # MODIFIED: Prerequisites section updated to describe
                                 #   the automated path as default (NPM_TOKEN lives in
                                 #   the repository's Actions secrets, provisioned once
                                 #   by whoever administers this repo); Steps 5-6
                                 #   (publish, tag) reframed as "what the automation
                                 #   now does for you" with the original manual commands
                                 #   kept as an explicit fallback section, not deleted
```

### Manual, non-code step (outside version control)

- A repository administrator creates an npm "Automation" access token scoped to
  `professional-design-system` publish access, and adds it as the `NPM_TOKEN`
  repository secret in GitHub Settings → Secrets and variables → Actions. This
  is the one-time human action this plan cannot automate or script — no
  workflow file or agent action can provision a real npm credential.

## Next Steps

- Run `specjedi-tasks` to break this plan into ordered, dependency-aware tasks.
