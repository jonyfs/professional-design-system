# Phase 0 Research: External Package Consumption

## R1: How to verify real external installation without an actual registry publish

**Decision**: use `npm pack` to produce a real installable tarball from `packages/react/`, then `npm install <tarball-path>` into a throwaway project created outside this repo's npm workspaces.

**Rationale**: `npm view @professional-design-system/react` returns a 404 (confirmed by direct check) and this environment has no npm registry authentication configured (`npm whoami` fails with `ENEEDAUTH`) — an actual `npm publish` isn't possible here even if it were desirable to run autonomously. It also isn't desirable: publishing to the public npm registry is an irreversible, public action (a real package version, once published, cannot be unpublished after 72 hours and the name becomes permanently associated with this content) — exactly the class of action this session's safety rules reserve for the user's own explicit action, not something to do as a side effect of "verify this works." `npm pack` produces the exact same tarball a real `npm publish` would upload (same `files` field, same `prepare`/`build` lifecycle), so installing it into a separate project exercises the real installation mechanics (module resolution, `exports` map, peer-dependency resolution) with no functional difference from a registry install, apart from the source being a local path instead of a registry URL.

**Alternatives considered**:
- *Verdaccio (local private npm registry)*: would exercise the exact `npm install <name>@<version>` command a real consumer types, but adds a new local service/dependency for a one-time verification, which is disproportionate given `npm pack` already proves the same module-resolution behavior.
- *Actually publishing to the real registry*: rejected — irreversible, public, and requires credentials this session doesn't have; the user must do this themselves per this project's own publish runbook (this feature's FR-006 deliverable), not the agent.

## R2: Changelog format and versioning

**Decision**: `CHANGELOG.md` in `packages/react/` following the [Keep a Changelog](https://keepachangelog.com) convention (`## [Unreleased]`, `## [x.y.z] - YYYY-MM-DD` sections with `Added`/`Changed`/`Fixed` subsections), paired with semantic versioning (already declared as `0.1.0` in `package.json`, semver-compatible).

**Rationale**: this is the de facto standard format recognized by npm tooling and virtually every peer library this project's constitution already compares itself against; it requires no new dependency (hand-maintained, like this project's existing `.specify/memory/constitution.md` Sync Impact Reports, which already follow a similar "what changed and why" discipline) and directly satisfies FR-005 without adopting a new tool (`changesets`, `standard-version`, etc.) for a package that has shipped exactly one version so far.

**Alternatives considered**: `@changesets/cli` — a genuinely good tool at higher publish cadence/multi-package-release complexity, but adopting a new dependency for a project that has never published its first version yet is premature; revisit if/when multiple packages need coordinated releases.

## R3: Package README content and structure

**Decision**: `packages/react/README.md` covers, in order: one-line description, install command, minimal usage snippet (import a component + its stylesheet), a note on the two non-obvious setup requirements (separate CSS import; `data-theme` attribute for runtime theming), the declared peer-dependency range, a pointer to the full component/prop list (the package's own `src/index.ts` barrel export — already the practice the root README uses, kept consistent), and a license line.

**Rationale**: this is the standard shape of npm's own package-page rendering expectations (README rendered directly on the npmjs.com listing) and matches what the root README already does for its "React package" section (research.md doesn't need to invent a new structure, just relocate and refresh accurate content per FR-002/FR-004) — the two documents will cross-reference each other rather than duplicate: root README keeps a short pointer, `packages/react/README.md` carries the authoritative detail.

## R4: License

**Decision**: MIT license, confirmed directly with the project owner (no LICENSE file, `package.json` `license` field, or any mention existed anywhere in the repo prior to this feature — this was a genuine gap, not an oversight to route around silently, since choosing a license is a business decision the agent shouldn't make unilaterally).

**Rationale**: MIT is the license used by the peer projects this constitution already benchmarks against (shadcn/ui, Radix UI, Mantine, Chakra UI) and is the simplest, most-adopted choice for a design-system component library aimed at external reuse.

## R5: Publish runbook location and content

**Decision**: `docs/PUBLISHING.md` (new `docs/` directory at repo root) documents: version bump (`npm version <patch|minor|major> --workspace packages/react`), changelog update step (move `[Unreleased]` entries under the new version heading), build verification (`npm run build --workspace packages/react && npm run typecheck --workspace packages/react`), and the actual publish command (`npm publish --workspace packages/react --access public`) — framed explicitly as a runbook for whoever holds real npm credentials, not a command this session executes.

**Rationale**: FR-006 requires the process to be "a documented, repeatable set of steps or an automated workflow" — a fully automated CI publish workflow would need an `NPM_TOKEN` secret this session cannot safely provision (adding secrets to CI is itself a "modifying shared infrastructure" action needing explicit user setup), so a precise, repeatable runbook satisfies FR-006 without requiring credentials the agent doesn't have and shouldn't request on its own. `docs/` (not `packages/react/`) because this is a maintainer-facing process document, distinct from the consumer-facing package README.

## R6: `dist/styles.css` self-containment for non-Tailwind consumers (Edge Case verification)

**Finding**: direct inspection of the compiled `packages/react/dist/styles.css` confirms zero remaining `@tailwind`, `@apply`, or `@layer` at-rules (`grep -c` returns 0) — the file is fully compiled, plain CSS. This confirms the spec's Edge Case concern doesn't describe an actual defect: a consumer with no Tailwind installation at all can import this stylesheet directly and it will apply correctly, since nothing in it depends on a Tailwind build step running in the consumer's own project. Recorded as a verified fact (not an assumption) for the package README to state confidently (FR-003).
