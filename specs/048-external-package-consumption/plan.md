# Implementation Plan: External Package Consumption

**Branch**: `048-external-package-consumption` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/048-external-package-consumption/spec.md`

## Summary

`packages/react/` is structurally publish-ready (correct `exports` map, declared peer deps, 137 components) but has never actually been published, has no README of its own, no changelog, and no documented publish process — and every existing consumer (showcase, dev harness) resolves it via an npm workspace symlink, which never exercised real external installation. This feature verifies real external consumption using a `npm pack` tarball installed into a genuinely separate throwaway project (standing in for a registry publish, since actually running `npm publish` to the public registry is an irreversible, public action requiring the user's own explicit action, not something this session performs autonomously), fixes any real defect that verification surfaces, and ships the three missing documentation/process artifacts (package README, CHANGELOG, publish runbook).

## Technical Context

**Language/Version**: TypeScript 5.6 / Node.js (matching `packages/react`'s existing toolchain)

**Primary Dependencies**: None new. Verification uses `npm pack` (built into npm, already available) and a minimal Vite + React scaffold for the throwaway external-consumer project — no new dependency added to the shipped package or the monorepo's own `package.json`/workspaces.

**Storage**: N/A

**Testing**: Manual, scripted verification via `npm pack` + install-from-tarball in a project outside the npm workspace (per spec.md's Edge Cases, since a real registry publish is out of scope for autonomous execution); existing `packages/react` typecheck/build scripts re-used, not replaced.

**Target Platform**: npm registry consumers (any Node.js/bundler-based React 18 project) — verified via a Vite-based scaffold as the concrete stand-in.

**Project Type**: Documentation + packaging verification for an existing library package (`packages/react/`), not a new application.

**Performance Goals**: N/A — no runtime behavior changes; existing performance budgets (`rules/web/performance.md`) are unaffected since no shipped code path changes.

**Constraints**: Must not perform an actual `npm publish` to the public registry (irreversible, public action — requires the user's own explicit action per this session's safety rules). Verification must use a project that is genuinely outside the monorepo's npm workspaces (`packages/*`, `tests/react-harness`, `showcase`), not another workspace member, or it would silently resolve via symlink and not prove anything new.

**Scale/Scope**: One package (`@professional-design-system/react`), 137 exported components — no new components added.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle III (Tailwind-Only Architecture)**: N/A — no new CSS is authored; this feature verifies the already-compiled `dist/styles.css` is genuinely self-contained for a non-Tailwind consumer, it doesn't add styling.
- **Principle IV (Design Token Discipline)**: N/A — no new markup/components.
- **Principle VI (Project Language Policy)**: the package's own README/CHANGELOG are consumer-facing technical documentation intended for a global npm audience — written in English, consistent with the existing root README, `packages/react/src/*.tsx` JSDoc, and every prior feature's own code comments (all already English); this is the same precedent already established, not a new exception.
- **Principle VII (Autonomous Skill Acquisition)**: no new external skill or dependency is being adopted (verification reuses `npm pack`, already part of npm itself) — diligence protocol doesn't trigger.
- **No violations requiring Complexity Tracking.**

## Project Structure

### Documentation (this feature)

```text
specs/048-external-package-consumption/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (documentation artifacts, not a data schema)
├── quickstart.md         # Phase 1 output — the actual runnable verification steps
└── tasks.md             # Phase 2 output (/speckit-tasks — not created by this command)
```

### Source Code (repository root)

```text
packages/react/
├── README.md             # NEW — package's own README (FR-002)
├── CHANGELOG.md          # NEW — versioned, consumer-facing changelog (FR-005)
├── package.json          # unchanged unless verification finds a real defect (FR-007)
└── src/, dist/           # unchanged unless verification finds a real defect

README.md                 # root — "React package" section refreshed: accurate export
                           # count, pointer to packages/react/README.md, publish-process
                           # pointer (FR-004)

docs/PUBLISHING.md         # NEW — the documented, repeatable publish runbook (FR-006);
                           # placed under docs/ (not packages/react/) since it's a
                           # maintainer-facing process doc, not consumer-facing package
                           # documentation

(verification artifact, NOT committed — spec.md's Key Entities explicitly frames the
external-consumer project as a throwaway verification mechanism, not a shipped
deliverable)
/tmp or scratchpad/external-consumer-verify/   # throwaway Vite+React scaffold,
                                                 # installs packages/react's npm-pack
                                                 # tarball, used once to prove FR-001/
                                                 # SC-001, then discarded
```

**Structure Decision**: this is a documentation/packaging feature layered onto an existing package (`packages/react/`) — no new application directory is added to the permanent repository structure. The one throwaway project used for verification lives outside the repo entirely (this session's scratchpad), per spec.md's explicit framing of the "External consumer project" as a verification mechanism, not a shipped artifact.

## Complexity Tracking

*No Constitution Check violations — table not needed.*
