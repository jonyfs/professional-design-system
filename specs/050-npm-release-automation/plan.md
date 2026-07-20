# Implementation Plan: NPM Release Automation

**Branch**: `050-npm-release-automation` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/050-npm-release-automation/spec.md`

## Summary

Adopts Changesets (`@changesets/cli` + `changesets/action`) to automate version-bump computation and changelog generation for `packages/react/`, closing the last unaddressed recommendation from the npm-distribution research that also prompted this session's constitution amendment (Distribution & Ecosystem Standards, v1.39.0). Contributors record a short change summary + semver impact via `npx changeset` as part of their PR; CI enforces this is present for any `packages/react/`-touching PR; a new `release.yml` workflow opens/updates a "Version Packages" PR automatically. The actual `npm publish` step remains fully manual, per the constitution's explicit human-only-publish rule — this feature automates *preparing* a release, never *publishing* one.

## Technical Context

**Language/Version**: TypeScript/Node.js (matching the existing monorepo toolchain); `@changesets/cli` is itself a Node CLI tool, no new language runtime.

**Primary Dependencies**: `@changesets/cli` (new devDependency, root-level), `changesets/action` (new GitHub Action, third-party but the same widely-adopted, actively-maintained tool named directly in the originating research — not a speculative adoption).

**Storage**: N/A

**Testing**: Verified by exercising the actual tool end-to-end (create a real changeset, run `changeset version` locally, confirm the resulting version bump/changelog match what a maintainer would write by hand) rather than unit-testing third-party tooling.

**Target Platform**: GitHub Actions CI (new `release.yml` workflow) + local developer CLI usage.

**Project Type**: Tooling/process automation for an existing package (`packages/react/`) — no application code changes.

**Performance Goals**: N/A — CI-time tooling only, no runtime/user-facing performance impact.

**Constraints**: MUST NOT auto-publish to npm under any configuration (constitution v1.39.0, non-negotiable). MUST NOT require a changeset for PRs that don't touch `packages/react/` (FR-003). MUST NOT change any of feature 048's already-verified build/typecheck/audit/tarball-check steps (FR-008).

**Scale/Scope**: One package (`packages/react/`) in a 4-workspace monorepo; the other 3 workspaces (`showcase`, `tests/react-harness`, root) are explicitly excluded from versioning.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Distribution & Ecosystem Standards (this session's own new section, v1.39.0)**: this feature exists specifically to help satisfy it ("every published version MUST have a changelog entry") — and is itself gated by its own "human-authorized publish only" rule, which is why FR-006 and R1/R4 explicitly reject any auto-publish configuration. Direct compliance, not a violation.
- **Principle VII (Autonomous Skill Acquisition Protocol)**: adopting `@changesets/cli` and `changesets/action` is a new external dependency — diligence check: source trustworthiness (widely-adopted, actively maintained, used by a large share of the JS ecosystem's own monorepos), safety (well-known, auditable, no obfuscated behavior), relevance (directly serves this project's package-distribution need per its own constitution section), license compatibility (MIT, compatible). Diligence satisfied; user is informed via this plan/spec rather than installed silently.
- **No other principle applies** — no markup, no components, no tokens, no accessibility surface changes.
- **No violations requiring Complexity Tracking.**

## Project Structure

### Documentation (this feature)

```text
specs/050-npm-release-automation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output — runnable verification steps
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
.changeset/
├── config.json           # NEW — ignores showcase/react-harness/root, points at packages/react
└── README.md              # NEW — Changesets' own generated usage doc (npx changeset init default)

.github/workflows/
├── changeset-check.yml    # NEW — fails if a packages/react-touching PR has no pending changeset
└── release.yml            # NEW — opens/updates the "Version Packages" PR via changesets/action
                            #        (no publish command configured — see research.md R4)

package.json               # root — adds "changeset": "changeset" script, @changesets/cli devDependency

docs/PUBLISHING.md          # UPDATED — describes the new starting point (review/merge the
                             # auto-generated Version Packages PR) before the existing,
                             # unchanged build/typecheck/audit/tarball/publish steps
```

**Structure Decision**: purely additive tooling/CI configuration layered onto the existing `packages/react/` package and `docs/PUBLISHING.md` — no new application directory, no changes to any shipped component.

## Complexity Tracking

*No Constitution Check violations — table not needed.*
