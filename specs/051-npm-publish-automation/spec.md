# Feature Specification: NPM Publish Automation

**Feature Branch**: `051-npm-publish-automation`

**Created**: 2026-07-20

**Status**: Draft

**Input**: User description: "Já existe workflow no GitHub para fazer o install automático no npm repository" — clarified with the requester: no such workflow exists today (`.github/workflows/release.yml` only opens/updates a changesets "Version Packages" PR; the actual `npm publish` is still a fully manual step per `docs/PUBLISHING.md`). The requester wants real automation: GitHub Actions runs `npm publish` itself once a maintainer merges that Version Packages PR into `main` — no local `npm publish` command required anymore.

**Context**: Feature 050 built the version/changelog half of this pipeline (changesets, `release.yml`, `changeset-check.yml`). Feature 052 (the immediately preceding session) renamed the published package to `professional-design-system` and confirmed it's unclaimed on the registry — nothing has ever been published yet, so this feature's very first successful run is also this package's first-ever release. Prior to this feature, the constitution's `Distribution & Ecosystem Standards` section stated `npm publish` "is a human-authorized action, never an autonomous one," worded broadly enough to forbid any CI-run publish step. That principle was amended (v2.0.0, same session, immediately before this spec) to recognize a second compliant authorization form: CI running `npm publish` gated on a human merging the release PR — that merge is the human authorization. This feature is the first to build against that amended principle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Merging the Version Packages PR ships the release (Priority: P1)

A maintainer reviews and merges the changesets-generated "Version Packages" PR (already produced by `release.yml`) into `main`. Without running any further command themselves, the new version becomes installable from the public npm registry shortly after.

**Why this priority**: This is the entire point of the feature — without it, merging the PR still leaves a human on the hook for the actual `npm publish`, which is exactly today's status quo this feature exists to change.

**Independent Test**: Merge a Version Packages PR that bumps `packages/react`'s version, and confirm the new version is fetchable from the npm registry (`npm view professional-design-system version` matches) without any command run outside GitHub Actions.

**Acceptance Scenarios**:

1. **Given** a Version Packages PR that bumps `packages/react`'s version, **When** a maintainer merges it into `main`, **Then** a GitHub Actions workflow run starts that publishes the new version to the npm registry.
2. **Given** that workflow run succeeds, **When** a consumer runs `npm view professional-design-system version`, **Then** it reports the newly merged version number.
3. **Given** a push to `main` that is NOT a Version Packages PR merge (e.g. an ordinary feature PR merge with no pending version bump), **When** CI runs, **Then** no `npm publish` is attempted — publishing only fires off the actual version-bump commit, never every push to `main`.

---

### User Story 2 - A failed publish is visible and doesn't silently corrupt release state (Priority: P1)

If the automated `npm publish` step fails (bad credentials, network error, npm registry outage), a maintainer is not left thinking a release shipped when it didn't — and the next release attempt isn't blocked by leftover broken state from the failed one.

**Why this priority**: Equal priority to Story 1 — a publish automation that can silently fail, or that corrupts the ability to retry, is worse than the fully manual process it replaces, since a human doing it by hand would immediately notice a failed command.

**Independent Test**: Force the publish step to fail (e.g. temporarily invalid `NPM_TOKEN`), confirm the workflow run is clearly marked failed in GitHub Actions, and confirm a subsequent successful run still publishes the correct pending version.

**Acceptance Scenarios**:

1. **Given** the `NPM_TOKEN` secret is invalid or expired, **When** the publish workflow runs, **Then** the GitHub Actions run reports a clear failure — not a silent no-op.
2. **Given** a publish attempt failed, **When** the underlying issue is fixed and the workflow is re-run (or triggered again), **Then** it successfully publishes the same still-pending version — no manual state cleanup required first.
3. **Given** `npm publish` partially succeeds at the registry but the workflow step reports failure for an unrelated reason (e.g. a post-publish step failing), **When** a maintainer investigates, **Then** the workflow log makes clear whether the registry actually received the new version, so they don't double-publish or wrongly assume nothing shipped.

---

### User Story 3 - Every published version still gets tagged and matches `docs/PUBLISHING.md`'s existing verification steps (Priority: P2)

The automation preserves this project's existing release hygiene: a git tag for the published version, and the same tarball-contents sanity check `docs/PUBLISHING.md` already documents for a manual release.

**Why this priority**: Lower priority than Stories 1-2 — the release working at all matters more than every ancillary step being preserved, but dropping tagging or verification would be a real regression from today's documented manual process, not just a nice-to-have.

**Independent Test**: After an automated publish, confirm a git tag matching `docs/PUBLISHING.md`'s existing `@jonyfs/react@$(version)`-style convention exists on the published commit, and that the workflow ran the same `npm pack` + install verification step the manual runbook already performs.

**Acceptance Scenarios**:

1. **Given** a successful automated publish, **When** the repository's tags are checked, **Then** a tag exists for the newly published version on the corresponding commit.
2. **Given** the publish workflow runs, **When** it reaches the publish step, **Then** it has already run the same `npm pack` + isolated-install verification `docs/PUBLISHING.md` documents for a manual release, failing the workflow before publishing if that verification fails.

### Edge Cases

- What happens if `release.yml`'s Version Packages PR bumps multiple workspace packages at once (today only `packages/react` is published; `showcase`/`react-harness` are `changeset`-ignored)? Only actually-publishable, non-private, non-ignored packages are published — an ignored or `private: true` package in the same PR is never published.
- What happens if a maintainer merges the Version Packages PR but the working tree at that commit doesn't actually differ in `packages/react`'s published `version` field from what's already on the npm registry (e.g. a re-merge, or the PR was merged twice)? The publish step MUST detect the version is already published and skip re-publishing rather than erroring the whole workflow or attempting to publish an already-existing version.
- What happens to `docs/PUBLISHING.md`'s existing manual-publish runbook once this automation exists? It stays as documented fallback/reference (per the amended constitution's "either path is compliant" wording) — not deleted, but its Prerequisites section is updated to note the automated path is now the default, with manual publish reserved for cases the automation can't handle (e.g. `NPM_TOKEN` unavailable, emergency out-of-band release).
- What happens if `NPM_TOKEN` is missing entirely (never configured as a repository secret)? The workflow MUST fail clearly at the publish step with an actionable error, not hang or silently skip publishing while reporting overall success.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A GitHub Actions workflow MUST run `npm publish` for `packages/react` automatically when a commit is pushed to `main` that represents a merged changesets Version Packages PR (i.e. a version-bump commit), and MUST NOT run `npm publish` on an ordinary feature-PR merge with no pending version bump.
- **FR-002**: The workflow MUST authenticate to the npm registry using a repository-level `NPM_TOKEN` secret — never a credential embedded in a workflow file or exposed to any non-publish job.
- **FR-003**: The workflow MUST detect and skip publishing a version that's already present on the npm registry, rather than erroring the whole run or attempting a duplicate publish.
- **FR-004**: A failed publish attempt MUST surface as a clearly failed GitHub Actions run — never a silent no-op or a run reported as successful despite the registry not receiving the new version.
- **FR-005**: A subsequent successful workflow run MUST be able to publish the same still-pending version after a prior failed attempt, with no manual state cleanup required first.
- **FR-006**: The workflow MUST run the same `npm pack` + isolated-install verification `docs/PUBLISHING.md` already documents for a manual release, and MUST fail before publishing if that verification fails.
- **FR-007**: A successful automated publish MUST create a git tag for the published version on the corresponding commit, matching the naming convention already used in `docs/PUBLISHING.md`.
- **FR-008**: The workflow MUST only ever publish `packages/react` (or any future package explicitly marked public and non-`changeset`-ignored) — a `private: true` or changeset-`ignore`d workspace package MUST NEVER be published, even if included in the same Version Packages PR.
- **FR-009**: `docs/PUBLISHING.md` MUST be updated to describe the automated path as the default release mechanism, retaining the manual steps as a documented fallback.
- **FR-010**: If `NPM_TOKEN` is unavailable or invalid, the workflow MUST fail clearly at the publish step with an actionable error message, distinguishable in the GitHub Actions log from every other failure mode this feature introduces.

### Key Entities

- **Version Packages PR**: the changesets-generated pull request (already produced by existing `release.yml`) that bumps `packages/react`'s version and updates its changelog; merging it into `main` is this feature's trigger and the human-authorization gate per the amended constitution.
- **Publish workflow run**: one execution of the new automated publish job — verifies, checks registry state, publishes, and tags, reporting success or a clearly attributable failure.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From a maintainer merging a Version Packages PR to the new version being fetchable via `npm view professional-design-system version`, zero manual commands are required.
- **SC-002**: 100% of ordinary (non-version-bump) pushes to `main` during this feature's validation trigger zero `npm publish` attempts.
- **SC-003**: A deliberately-forced publish failure (e.g. temporarily invalid `NPM_TOKEN`) is visibly reported as a failed GitHub Actions run within the same run, with no false "success" status.
- **SC-004**: After fixing a forced failure from SC-003, a re-run publishes the correct pending version with zero manual state cleanup.
- **SC-005**: Every version published via this automation has a corresponding git tag, matching 100% of a manual sample check across the feature's first several real releases.

## Assumptions

- "Automatic" is interpreted per the amended constitution (v2.0.0): CI performs the actual `npm publish` call, gated on a human merging the Version Packages PR — not a human running `npm publish` locally, and not a fully unattended publish with no human action anywhere in the chain.
- Only `packages/react` (published as `professional-design-system`) is in scope; `showcase` and `react-harness` remain `changeset`-ignored, non-published workspace packages, unaffected by this feature.
- This feature's first successful run will also be this package's first-ever publish to the npm registry (confirmed unclaimed as of feature 052) — there is no pre-existing published version to reconcile against.
- The existing `changesets/action@v1` step in `release.yml` (PR creation/update) is unchanged by this feature; this feature adds a new job/workflow step that runs only after that PR is merged, not a replacement of the existing version-PR mechanism.
