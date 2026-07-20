# Phase 0 Research: NPM Release Automation

## R1: Changesets vs. Semantic Release

**Decision**: [Changesets](https://github.com/changesets/changesets) (`@changesets/cli` + `changesets/action`).

**Rationale**: the spec's FR-006 requires release *preparation* (version + changelog) to be automated while the actual `npm publish` stays a separate, human-authorized action, per this session's own newly-amended constitution (Distribution & Ecosystem Standards, v1.39.0). Changesets is built around exactly this split by design: `changeset version` bumps versions and writes the changelog, producing a commit/PR; `changeset publish` is a distinct, separate command that a maintainer runs (or a CI job runs) only when they're ready to actually publish — the two are never conflated into one automatic step. Semantic Release, by contrast, is built around "commit → CI computes version → CI publishes" as a single continuous pipeline; disabling its publish step is possible but fights the tool's own design center, whereas Changesets treats "prepare" and "publish" as separate first-class commands already.

Changesets also matches this project's existing authoring style more directly: a change record is a short, hand-written Markdown file (not a parsed conventional-commit message), which fits this project's own precedent of descriptive, human-written prose in commits and changelogs (`packages/react/CHANGELOG.md`'s existing entries are hand-written narrative, not auto-generated from commit titles) — Semantic Release's model (deriving everything from commit message conventions like `feat:`/`fix:`) would require retrofitting a commit-message convention onto a project that doesn't currently enforce one.

**Alternatives considered**: Semantic Release (rejected per above — conflates prepare+publish, and its conventional-commits requirement doesn't fit this project's existing commit style); a fully hand-rolled script (rejected — Changesets is a widely-adopted, well-maintained tool solving exactly this problem, and hand-rolling it would repeat work already done well, with no genuine project-specific need it doesn't cover).

## R2: Monorepo scope — which workspaces need a changeset

**Finding**: this monorepo has 4 workspaces (root `professional-design-system`, `packages/react` `@professional-design-system/react`, `showcase`, `tests/react-harness` `react-harness`). Only `packages/react` has `"private": false` — the other three are `private: true` and never published. Changesets' own `ignore` config (`.changeset/config.json`) will explicitly list `showcase` and `react-harness` (and Changesets' `linked`/versioning logic only ever considers non-ignored, non-private packages for version bumps in the first place) so a change to the showcase demo app or the test harness never triggers a spurious changeset requirement or version bump for the actual published package.

## R3: CI enforcement of "every packages/react change needs a changeset" (FR-002)

**Decision**: `changesets/action`'s companion check, `changeset status --since=main` (or the simpler community pattern: a dedicated CI job running `npx changeset status` and failing if a `packages/react`-touching PR has zero pending changesets), gated by a path filter so it only runs when files under `packages/react/**` changed (satisfying FR-003's "a PR that doesn't touch `packages/react/` must not require a change record").

**Rationale**: this mirrors the existing pattern this project already uses for other non-negotiable gates (`audit:tokens`, `audit:contrast` — automated CI checks, not reliance on manual review discipline) rather than introducing a new enforcement philosophy.

## R4: The "Version Packages" PR and the existing manual runbook

**Decision**: `changesets/action` (added as a new CI job, `release.yml`) runs `changeset version` whenever changesets exist on `main`, opening/updating a "Version Packages" pull request containing the computed version bump and assembled `CHANGELOG.md` entry. **No `publish` command is configured in the action** — this is the deliberate mechanism (per R1) that keeps actual `npm publish` a separate, human-run step. `docs/PUBLISHING.md` (feature 048) is updated to describe the new starting point: instead of hand-computing the version bump and hand-writing the changelog entry (its old steps 1-2), a maintainer reviews and merges the auto-generated "Version Packages" PR, then continues from the existing build/typecheck/audit/tarball-check/publish steps exactly as before (unchanged, per FR-008).

**Alternatives considered**: configuring `changesets/action` with a `publish` command (e.g. `npm publish`) so it auto-publishes on merge — rejected outright, this is precisely what the constitution's new Distribution & Ecosystem Standards section forbids ("a real `npm publish`... is a human-authorized action, never an autonomous one").

## R5: Change-record authoring workflow (FR-001)

**Decision**: contributors run `npx changeset` locally (or via a documented `npm run changeset` script) after making a change to `packages/react/`, which interactively prompts for the affected package, the bump type (patch/minor/major), and a one-line summary — writing a small Markdown file to `.changeset/` that gets committed alongside the rest of the PR's changes.

**Rationale**: this is Changesets' own standard, well-documented workflow — no custom tooling needed, and it directly satisfies FR-001's "low-friction way to record a change... as part of the same pull request."
