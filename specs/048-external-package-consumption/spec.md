# Feature Specification: External Package Consumption

**Feature Branch**: `048-external-package-consumption`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "verifique como usar estes componentes para que possam ser usados em outros projetos que desejam usar este design system" (check how to use these components so they can be used in other projects that want to use this design system)

**Context** (observed directly during this session): `packages/react/` is already configured as a publishable package (`private: false`, a correct `exports` map for ESM/CJS/types, `peerDependencies` on React 18) exporting 137 components, and the root `README.md` documents a basic install/import snippet. But direct inspection turns up three concrete blockers to an external team actually adopting it today: (1) the package has **never been published** — `npm view @professional-design-system/react` returns a 404, so the documented `npm install @professional-design-system/react` command fails for anyone outside this repo; (2) `packages/react/` has **no README of its own** — npmjs.com and most IDEs render a package's own README on its listing/hover-docs, not the monorepo root's; (3) the root README's usage snippet is stale (says "14 of the components," the package now exports 137) and, critically, was **never verified against a real external consumer** — every existing usage of the package (the showcase, the dev harness) lives inside this same monorepo via npm workspace symlinks, which silently tolerates problems (missing peer deps, broken `exports` resolution, CSS not actually self-contained) that only surface once a project outside the workspace tries to install and import it for real.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Installing and rendering a first component in an external project (Priority: P1)

A developer on a different team, working in their own separate repository, wants to add this design system to their project: install it, import one component and its styles, and see it render correctly with full functionality (theming, interactive states) — without needing access to this monorepo's source or tooling.

**Why this priority**: this is the direct, literal ask ("used in other projects") and the foundational capability every other scenario depends on — if a fresh install-and-render doesn't work, nothing else about the package matters.

**Independent Test**: Create a new, throwaway project entirely outside this repository (not an npm workspace member), install the package the way an external consumer actually would, import a component plus its stylesheet, and confirm it renders with correct styling and no missing-dependency or module-resolution errors.

**Acceptance Scenarios**:

1. **Given** a fresh project outside this monorepo, **When** the package is installed the way documented, **Then** installation succeeds with only the documented peer dependencies (React 18) needing to be present.
2. **Given** the package is installed, **When** a component and its stylesheet are imported per the documented snippet, **Then** the component renders with its intended visual styling (not unstyled/broken), matching what it looks like inside this monorepo's own showcase.
3. **Given** the rendered component supports interactive states or theming, **When** those are exercised (hover/focus, or switching the `data-theme` attribute), **Then** they behave identically to their behavior inside this monorepo.

---

### User Story 2 - Understanding what's available and how to use it correctly (Priority: P1)

The same adopting developer, once installation works, wants to discover which components exist, what props each one accepts, and any non-obvious setup requirements (e.g. that CSS must be imported separately, that theming needs a `data-theme` attribute) — without having to read this project's internal source tree or specs.

**Why this priority**: install-without-documentation is barely more useful than no package at all for a team unfamiliar with this codebase — this is tied for top priority with User Story 1 because a working-but-undocumented package still fails the actual goal ("so they can be used in other projects").

**Independent Test**: Given only the package's own published documentation (not this monorepo's internal specs/constitution), a developer unfamiliar with this codebase can find the correct import path and required setup for a specific, named component without asking anyone or reading source.

**Acceptance Scenarios**:

1. **Given** the published package, **When** a consumer looks at its own documentation (not the monorepo root's), **Then** they find accurate installation steps, a working usage example, and where to find each component's prop types.
2. **Given** a component that requires non-obvious setup (e.g. runtime theming via `data-theme`, or CSS Anchor Positioning support), **When** the documentation is consulted, **Then** that requirement is stated explicitly, not left for the consumer to discover by trial and error.
3. **Given** the documented component/export count, **When** compared against the actual package contents, **Then** the two match — no stale counts or removed/renamed exports left undocumented.

---

### User Story 3 - Confidence that the package won't silently break on the next update (Priority: P2)

A team that has adopted the package wants a predictable way to know what changed when they upgrade to a newer version, and confidence that publishing is a repeatable, low-risk process rather than a manual one-off.

**Why this priority**: this matters for sustained adoption rather than the first install — a team evaluating whether to adopt at all cares most about User Stories 1-2, but won't stay adopted if every upgrade is a guessing game; secondary to getting the first install working at all.

**Independent Test**: Inspect the shipped package for a version-history document, and confirm the publishing process is defined as a repeatable command/workflow rather than undocumented manual steps.

**Acceptance Scenarios**:

1. **Given** a new version of the package is published, **When** a consumer wants to know what changed, **Then** a changelog entry exists describing the change in consumer-relevant terms (not just an internal commit message).
2. **Given** someone needs to publish a new version, **When** they follow the documented process, **Then** it's a defined, repeatable set of steps (or an automated workflow), not tribal knowledge.

---

### Edge Cases

- What happens if a consumer's project doesn't use Tailwind CSS at all? The package's `dist/styles.css` is self-contained (already compiled, not requiring the consumer to run Tailwind) — this must be verified true, not assumed, since it's the single most likely point of failure for a non-Tailwind consumer.
- What happens if a consumer is on React 19 or a version outside the declared `^18.0.0` peer range? The documented peer range is the current, honest constraint — expanding it is out of scope for this feature (a compatibility feature would be its own spec), but the constraint must be stated clearly enough that a consumer on an incompatible version finds out from the docs, not from a runtime error.
- What happens to consumers who want to customize the theme/palette rather than use one of the 43 curated themes? Out of scope for this feature — this feature verifies and documents *using the package as-is*, not a customization/theming-extension API (that would be its own feature if there's demand).
- What happens if the package has never been published and this feature can't get npm publish credentials/access during implementation? The plan phase must account for this — verification can use a local package tarball (`npm pack` + install from the local `.tgz`) as a stand-in for a real registry publish if publishing access isn't available, while still documenting the real `npm publish` step for whoever does have access.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The package MUST be installable and importable from a project genuinely outside this monorepo (not an npm workspace member), verified directly rather than assumed from the existing in-monorepo usage.
- **FR-002**: `packages/react/` MUST have its own README (rendered by npm's package page and most IDEs), with accurate installation steps, a working usage example, and a pointer to where full prop documentation lives.
- **FR-003**: The documentation MUST state every non-obvious setup requirement explicitly: importing the separate stylesheet, the `data-theme` attribute mechanism for runtime theming, and the declared peer-dependency range.
- **FR-004**: The documented component/export count and usage examples MUST match the package's actual current contents — no stale counts carried over from an earlier version of the package.
- **FR-005**: A versioned changelog MUST exist, with at least an initial entry describing the package's current state in consumer-relevant terms.
- **FR-006**: The publish process (building `dist/`, versioning, and publishing) MUST be a documented, repeatable set of steps or an automated workflow — not undocumented manual knowledge.
- **FR-007**: If a genuine defect in external consumption is found during verification (matching this project's own established precedent of fixing real bugs found through real usage), it MUST be fixed as part of this feature, not silently noted and deferred.

### Key Entities

- **Package README**: `packages/react/`'s own documentation file, distinct from the monorepo root's.
- **Changelog**: a versioned, consumer-facing record of what changed between published versions.
- **External consumer project**: a throwaway project outside this monorepo used to verify real-world installability (Key Entity because it's the mechanism User Story 1's Independent Test depends on, not because it's part of the shipped system).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A component installed and imported in a project outside this monorepo renders correctly on the first attempt, with zero undocumented manual workarounds needed.
- **SC-002**: A developer unfamiliar with this codebase can find correct installation and usage instructions using only the package's own README, without reading this repository's internal specs or source tree.
- **SC-003**: 100% of non-obvious setup requirements (separate CSS import, `data-theme` theming, peer dependency range) are stated explicitly in the package's own documentation.
- **SC-004**: The package's documentation accurately reflects its actual current export count and contents (zero stale figures).
- **SC-005**: A new package version can be published by following a documented set of steps from a clean checkout, with no undocumented manual steps required.

## Assumptions

- "Estes componentes" (these components) refers to the existing `@professional-design-system/react` package in `packages/react/` — not the static HTML/CSS catalog in `src/`, which is not designed to be installed as a dependency by another project (it's a reference site, not a package).
- "Outros projetos" (other projects) means external consumers outside this monorepo — verification requires a genuinely separate project, not another workspace member (which resolves the package via a symlink and would mask real installation problems).
- Publishing to the public npm registry may not be something this session has credentials for; if so, `npm pack` + install-from-tarball is an acceptable stand-in to verify real external consumption, provided the actual `npm publish` step is still documented for whoever does have access (see Edge Cases).
- This feature verifies and documents consuming the package *as it already exists* — it does not add new components, change the component API, or add a theme-customization API; those would be separate features.
- The existing `showcase/` workspace and `tests/react-harness/` remain in-monorepo consumers (via workspace symlink) and are out of scope for this feature's external-consumption verification, though they remain useful as a "does it look the same" comparison baseline.
