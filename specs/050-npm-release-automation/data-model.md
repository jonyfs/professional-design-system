# Phase 1 Data Model: NPM Release Automation

No application data model — this feature is CI/tooling configuration. The entities below are the concrete artifacts this feature introduces, traced back to spec.md's Key Entities.

## Change record (`.changeset/<random-name>.md`)

- **Represents**: a contributor-authored, per-PR record of one change's semver impact and consumer-facing summary.
- **Format** (Changesets' own standard): YAML frontmatter naming the affected package + bump type, followed by a one-line Markdown summary.
  ```md
  ---
  "@professional-design-system/react": patch
  ---

  Fixed npm theme-switching for external consumers.
  ```
- **Satisfies**: FR-001.

## Changeset CI check (`.github/workflows/changeset-check.yml`)

- **Represents**: the automated gate enforcing FR-002/FR-003 — fails a `packages/react/`-touching PR with zero pending changesets; never runs (or always passes) for a PR that doesn't touch `packages/react/`.

## Release proposal ("Version Packages" PR, produced by `.github/workflows/release.yml`)

- **Represents**: the automatically-computed version bump + assembled `packages/react/CHANGELOG.md` entry, opened as a reviewable pull request rather than published directly.
- **Satisfies**: FR-004, FR-005, FR-006.

## `.changeset/config.json`

- **Represents**: Changesets' own configuration — which workspaces to ignore (`showcase`, `react-harness`; the root `professional-design-system` is never a workspace changesets versions), changelog format, and access level.
- **Satisfies**: research.md R2 (monorepo scope).
