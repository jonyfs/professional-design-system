# Phase 1 Data Model: External Package Consumption

This feature ships documentation and packaging metadata, not application data — there is no database schema or runtime entity model. The "entities" below are the concrete documentation/metadata artifacts this feature produces, listed for traceability back to spec.md's Key Entities and Functional Requirements.

## Package README (`packages/react/README.md`)

- **Represents**: the package's own, authoritative consumer-facing documentation (distinct from the monorepo root's).
- **Key sections**: description, install command, minimal usage snippet, non-obvious setup requirements (CSS import, `data-theme` theming), peer-dependency range, pointer to full component list, license line.
- **Satisfies**: FR-002, FR-003, FR-004.

## Changelog (`packages/react/CHANGELOG.md`)

- **Represents**: a versioned, consumer-facing record of what changed between published versions, in Keep a Changelog format.
- **Key sections**: `[Unreleased]` (empty until the next change), `[0.1.0] - <date>` (the current, already-shipped state, described retroactively so a first-time reader has a baseline to compare future entries against).
- **Satisfies**: FR-005.

## License (`packages/react/LICENSE` + `package.json`'s `license` field)

- **Represents**: the legal terms under which the package may be used by others — MIT, per direct confirmation with the project owner (research.md R4).
- **Satisfies**: a precondition of FR-002/SC-001 (a package without a stated license is not genuinely adoptable by any organization with legal/procurement review, regardless of how well it installs).

## Publish runbook (`docs/PUBLISHING.md`)

- **Represents**: the documented, repeatable process for building, versioning, and publishing a new package version.
- **Key sections**: version bump, changelog update, build + typecheck verification, the actual `npm publish` command (for whoever holds real registry credentials).
- **Satisfies**: FR-006.

## External consumer project (verification mechanism, not shipped)

- **Represents**: a throwaway Vite + React scaffold, created outside this repo entirely, used once to install `packages/react`'s `npm pack` tarball and prove real-world installability.
- **Not committed to the repository** — per spec.md's explicit framing, this is a verification mechanism for User Story 1's Independent Test, not a deliverable.
- **Satisfies**: FR-001, SC-001; its findings (pass/fail, any defect discovered) feed FR-007.
