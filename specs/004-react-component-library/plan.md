# Implementation Plan: React Component Library (Claude Design Compatibility)

**Branch**: `main` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-react-component-library/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a publishable React + TypeScript package (`packages/react/`) exposing
all ten existing components as typed function components, satisfying
Claude Design's `design-sync` skill's "package source" ingestion mode
(built `dist/` entry, extractable `.d.ts` prop types, self-contained
compiled CSS). The existing static HTML gallery and its Playwright suite
are untouched — they remain the ratified visual/behavioral reference this
migration is checked against, not something this feature replaces.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (function components +
hooks only, per spec.md's Assumptions).

**Primary Dependencies**: `react`, `react-dom` (peer dependencies, not
bundled — a consuming app supplies its own); `tsup` for the package build
(see research.md); Tailwind CSS 3.4.x (same version as the existing
static site) for the package's own compiled stylesheet.

**Storage**: N/A

**Testing**: Playwright, same pattern as features 001-003 — a small React
test-harness app (Vite + React, dev-only, not shipped) renders each
component so the *exact same* visual-regression/axe/keyboard-navigation
assertions can run against it, giving a real cross-check against the
static HTML baselines rather than a from-scratch test suite. React
Testing Library is explicitly NOT added (see research.md) — Playwright
already covers this project's testing needs end-to-end and a second test
framework would duplicate coverage, not add it.

**Target Platform**: npm package consumable by any React 18 app; the
package itself targets the same evergreen-browser matrix as the static
site (native `<dialog>` support required for Modal/Slide-over, same as
feature 003).

**Project Type**: Adds a single new workspace package to what remains a
single-repo project — npm workspaces (built into npm, zero new tooling)
rather than adopting a monorepo tool (Turborepo, Nx, etc.) the project
doesn't otherwise need.

**Performance Goals**: Package bundle size is not a hard constraint for
this feature (a component library's per-component tree-shaken size is a
consumer-app concern, not this package's own CI gate) — SC-002/SC-005
(clean type extraction, fast onboarding) are the binding success metrics.

**Constraints**: Same design-token/contrast/state-completeness principles
as every prior feature (Principles II/III/IV/V) apply to the `.tsx`
source, not just `.html` — enforced by extending the existing audit
scripts to also scan `.tsx` files (research.md).

**Scale/Scope**: 10 components, 1 new package, reused build knowledge
across User Stories 2-3 once User Story 1 proves the pipeline. **This is
not a same-size continuation of features 001-003** (`/speckit-analyze`
flagged the risk of treating it that way): those features added 3-4
components to an already-proven, single-paradigm HTML+Tailwind pipeline;
this feature simultaneously introduces four toolchains/paradigms the
project has never used before (React, TypeScript component authoring,
npm workspaces, a second publishable package, a parallel Tailwind build,
a dev-only Vite+React test harness) while porting all 10 existing
components. `/speckit-tasks` MUST reflect this: three checkpointed
phases (one per user story, matching spec.md's own priority ordering),
each independently completable and verified, not one flat task list
sized like a prior feature's. User Story 1 (Button alone) is the
appropriate place to discover any structural problem with the whole
approach — before, not after, porting the other nine.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Requirement | Status |
|------|-----------|-------------|--------|
| G1 | II — Absolute Semantic Accessibility (AAA) | Same AAA contrast, focus-trap, and native-semantics-first requirements, now on `.tsx` markup | PASS — every component ports its existing contract's exact class list; no new color/contrast decisions are made in this feature (verified in research.md, not assumed) |
| G2 | III — Tailwind-Only Architecture | No parallel CSS system | PASS — the React package compiles its own Tailwind CSS from the same ratified tokens; `@apply`/`@layer components` remains the sanctioned reuse mechanism, now duplicated (not diverged — see research.md's shared-token-source decision) between the static site's `tailwind.css` and the package's own |
| G3 | IV — Design Token Discipline | Zero raw palette classes | PASS — enforced by extending `scripts/audit-tokens.mjs`/`scripts/check-contrast.mjs` to also scan `.tsx` files (a genuine new scan target, tracked as an explicit task, not silently assumed to already work) |
| G4 | V — Interactive State Completeness | Full hover/active/focus-visible/disabled coverage | PASS — every component's existing state set is ported as-is; no new interactive elements are introduced by this feature |
| G5 | VI — Project Language Policy | English artifacts, PT-BR agent chat | PASS |
| G6 | VII — Autonomous Skill Acquisition | `design-sync` skill consulted directly (its own `SKILL.md`) to ground technical requirements, not guessed | PASS — this plan's requirements (dist/, .d.ts, compiled CSS) are read from `non-storybook/SKILL.md` with specific quoted lines now cited in research.md (an earlier draft asserted this without a direct citation for the core requirements themselves, only for the tsup build-tool choice — corrected after `/speckit-analyze`) |

No violations requiring `Complexity Tracking` — adding one workspace
package via npm's built-in workspaces feature is the minimal structure
satisfying FR-001, not an unjustified addition.

## Project Structure

### Documentation (this feature)

```text
specs/004-react-component-library/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   ├── react-package.contract.md      # package.json/build/exports shape
│   └── component-props.contract.md    # per-component prop interface mapping
└── tasks.md               # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root, additions only — existing scaffold unchanged)

```text
package.json                    # MODIFIED — add "workspaces": ["packages/*"]
tailwind.config.ts               # MODIFIED — import colors/borderRadius/fontFamily from
                                  # shared/design-tokens.ts instead of declaring them inline
                                  # (the exact literals are unchanged, only their source moves)
scripts/audit-tokens.mjs         # MODIFIED — scan packages/react/src/**/*.tsx className
                                  # string literals, same pattern as the existing HTML/@apply scan
scripts/check-contrast.mjs       # MODIFIED — same .tsx scan extension, contrast side
packages/react/
├── package.json                # name, version, module/main/exports, peerDeps
├── tsconfig.json
├── tailwind.config.ts          # imports the SAME shared token source as the root config
├── tsup.config.ts
├── src/
│   ├── index.ts                 # barrel export of all 10 components
│   ├── styles.css                # @tailwind directives + @layer components (mirrors root tailwind.css)
│   ├── Button/Button.tsx
│   ├── TextInput/TextInput.tsx
│   ├── Badge/Badge.tsx
│   ├── Checkbox/Checkbox.tsx
│   ├── Radio/Radio.tsx
│   ├── Select/Select.tsx
│   ├── Toggle/Toggle.tsx
│   ├── Modal/Modal.tsx
│   ├── Toast/Toast.tsx
│   ├── SlideOver/SlideOver.tsx
│   └── hooks/useDialogTrigger.ts # React port of overlay.js's initDialogTriggers()
└── dist/                        # build output (gitignored)
shared/design-tokens.ts          # NEW — single source of truth for color/radius/fontFamily
                                  # tokens (data-model.md — fontFamily included to prevent an
                                  # Inter-vs-default-sans drift), imported by both
                                  # tailwind.config.ts (root) and packages/react/tailwind.config.ts
tests/react-harness/              # NEW — minimal Vite+React app, dev-only, renders each
                                  # packages/react component for Playwright to test against
tests/e2e/react-*.spec.ts         # NEW — one spec per component, mirroring the existing
                                  # tests/e2e/<name>.spec.ts pattern against the harness
```

**Structure Decision**: npm workspaces (zero new tooling) with the React
package under `packages/react/`. A shared `shared/design-tokens.ts` module
is the single source of truth both Tailwind configs import from — the
alternative (each config independently re-declaring the same hex values)
would silently drift the moment either one is edited without the other,
exactly the class of bug this project's `/speckit-analyze` passes have
repeatedly caught elsewhere. The existing static site's structure is
completely untouched.

## Complexity Tracking

*No entries — no Constitution Check violations. npm workspaces is the
platform's own built-in feature for exactly this shape (one repo, one new
publishable sub-package), not a new tool adopted for convenience.*
