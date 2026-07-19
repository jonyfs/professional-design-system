# Feature Specification: NPM Release Automation

**Feature Branch**: `050-npm-release-automation`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description (via external research shared by the user on npm distribution best practices for design systems): adopt automated versioning/changelog tooling (e.g. Changesets or Semantic Release) integrated into CI, rather than a fully manual `npm publish` process, so version bumps and changelog entries are generated from actual changes rather than hand-written after the fact.

**Context**: Feature 048 already closed the documentation half of this gap — `packages/react/` now has a real README, CHANGELOG, LICENSE, and a documented manual publish runbook (`docs/PUBLISHING.md`). What's left is the one concrete recommendation from that research not yet acted on: the version bump and changelog entry are still entirely hand-written by whoever runs the release, with no tooling connecting "what actually changed in this PR" to "what the next version number and changelog entry should be." This is also the last unaddressed item from this session's newly-amended constitution (`Distribution & Ecosystem Standards`, v1.39.0): "Every published version MUST have a changelog entry... in consumer-relevant terms" — automation makes that requirement easy to keep meeting instead of something that quietly lapses under time pressure, the same failure mode already found (and fixed) for the package's CSS, README, and changelog in features 044 and 048.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A contributor records what changed at the same time they change it (Priority: P1)

A contributor making a change to `packages/react/` (a new prop, a bug fix, a new component) records a short, consumer-facing description of that change as part of the same pull request — not as a separate, easily-forgotten step before the next release.

**Why this priority**: this is the foundational capability everything else depends on — without a per-change record captured at PR time, there's nothing for automation to assemble into a version bump or changelog later.

**Independent Test**: Open a pull request that changes `packages/react/` without including a change record, and confirm the project surfaces this as a visible, actionable prompt (not a silent gap discovered only at release time).

**Acceptance Scenarios**:

1. **Given** a pull request that adds a new prop to an existing component, **When** the contributor is finishing the PR, **Then** they have a clear, low-friction way to record a one-line, consumer-facing description of the change and its semantic-version impact (patch/minor/major).
2. **Given** a pull request that changes `packages/react/` with no change record attached, **When** CI runs, **Then** this is flagged visibly (not silently allowed through) — matching this project's existing pattern of automated gates (`audit:tokens`, `audit:contrast`) catching what a human might forget under time pressure.
3. **Given** a pull request that does not touch `packages/react/` at all (e.g. the static HTML catalog, or CI config), **When** CI runs, **Then** no change record is required — this only applies to the published package's own surface.

---

### User Story 2 - The next version number and changelog write themselves (Priority: P1)

Whoever is preparing the next release no longer hand-picks a version number or hand-writes the changelog entry — both are generated automatically from the accumulated change records since the last release, and presented as a reviewable pull request before anything is finalized.

**Why this priority**: this is the direct ask (automate versioning/changelog) and the second half of the foundational capability — tied with User Story 1 because collecting change records without ever assembling them into a real release artifact wouldn't close the gap this feature exists for.

**Independent Test**: With one or more change records accumulated since the last release, run the automation's "prepare release" step and confirm it produces a correct version bump (following the highest-impact change record's patch/minor/major) and a changelog entry that reads the same way `packages/react/CHANGELOG.md`'s existing entries do — then confirm nothing is actually published until a human takes a further, separate, explicit action.

**Acceptance Scenarios**:

1. **Given** two accumulated change records since the last release, one "patch" and one "minor", **When** the release-preparation step runs, **Then** the resulting version bump is MINOR (the higher of the two), not PATCH.
2. **Given** the release-preparation step has run, **When** its output is inspected, **Then** it is a proposed, reviewable change (e.g. a pull request) — not a version already bumped and published without a further explicit step.
3. **Given** the proposed release is reviewed and approved, **When** a human then follows the actual publish step, **Then** it is the same explicit, credential-gated, human-run action already documented in `docs/PUBLISHING.md` (feature 048) — this feature automates *preparing* a release, not *publishing* one; automatic publishing on merge is explicitly out of scope (see Assumptions).

---

### User Story 3 - Confidence that automation matches what was manually verified before (Priority: P2)

A maintainer wants confidence that adopting this tooling doesn't silently change or weaken anything about the release process already verified working in feature 048 (the tarball's contents, the build/typecheck/audit sequence, the actual publish command).

**Why this priority**: lower priority than getting the core automation working, but real — this session found genuine defects by verifying things directly rather than assuming, and that same discipline applies to a change in the release *process* itself, not just the package's code.

**Independent Test**: Run the full existing release-verification sequence from `docs/PUBLISHING.md` (build, typecheck, audits, tarball-contents check) against a version bumped by the new automation, and confirm every step still passes exactly as it did when performed manually in feature 048.

**Acceptance Scenarios**:

1. **Given** a version bump produced by the new automation, **When** `docs/PUBLISHING.md`'s existing build/typecheck/audit/tarball-check steps are run against it, **Then** all pass with no changes needed to those steps.
2. **Given** the new tooling is in place, **When** `docs/PUBLISHING.md` is read end to end, **Then** it accurately reflects the updated process (which steps are now automated vs. still manual) — not left describing the old, fully-manual flow.

---

### Edge Cases

- What happens if a contributor forgets to add a change record and the PR is already merged? The gap should be surfaced as early as possible (at PR time, per User Story 1's Acceptance Scenario 2) precisely to make this edge case rare — but if it happens anyway, the next release-preparation run should make it easy to add a missed record retroactively before the version is finalized, not require re-opening the merged PR.
- What happens to `packages/react/CHANGELOG.md`'s existing `[Unreleased]` and `[0.1.0]` entries (written by hand in feature 048)? They remain as historical record — this feature changes how *future* entries are produced, it does not rewrite history.
- What happens if a change record is added for a change that turns out not to affect `packages/react/` at all (e.g., a docs-only fix to the monorepo root README)? Automation should not force a version bump for changes that don't touch the published package's actual contents — this matches SC-002 below.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Contributors MUST have a low-friction way to record a change's consumer-facing description and semantic-version impact as part of the same pull request that makes the change.
- **FR-002**: A pull request that modifies `packages/react/`'s source without an accompanying change record MUST be flagged visibly by CI — not silently allowed through.
- **FR-003**: A pull request that does not touch `packages/react/` MUST NOT require a change record.
- **FR-004**: The system MUST be able to compute the correct next version number (patch/minor/major) automatically from all accumulated, unreleased change records, taking the highest-impact one when multiple exist.
- **FR-005**: The system MUST generate a changelog entry from accumulated change records, in the same consumer-relevant style already established in `packages/react/CHANGELOG.md`.
- **FR-006**: Release preparation (version bump + changelog generation) MUST produce a reviewable artifact (e.g., a pull request) — it MUST NOT publish to the npm registry automatically or without a further, separate, explicit human action, per this project's constitution (`Distribution & Ecosystem Standards`, v1.39.0: "a real `npm publish`... is a human-authorized action, never an autonomous one").
- **FR-007**: `docs/PUBLISHING.md` MUST be updated to accurately describe the new process end to end (which steps are now automated, which remain manual).
- **FR-008**: Adopting this tooling MUST NOT change or weaken any step already verified in feature 048 (build, typecheck, token/contrast audits, tarball-contents check) — those steps continue to run exactly as before against whatever version the new automation proposes.

### Key Entities

- **Change record**: a per-PR, contributor-authored artifact describing one change's consumer-facing summary and semantic-version impact (patch/minor/major).
- **Release proposal**: the automatically-generated, human-reviewable bundle of a computed version number plus an assembled changelog entry, produced from all accumulated change records since the last release.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of merged pull requests that change `packages/react/`'s source have an accompanying change record (enforced by an automated CI check, not manual review discipline).
- **SC-002**: A pull request that does not touch `packages/react/` never requires a change record and is never blocked by this feature's checks.
- **SC-003**: Given a set of accumulated change records, the automatically-computed version bump matches what a maintainer would have chosen by hand, on the first attempt, with zero manual correction needed.
- **SC-004**: Zero versions are published to npm without a human explicitly and separately authorizing the actual `npm publish` step, even after this automation is adopted.
- **SC-005**: `docs/PUBLISHING.md` accurately describes the current (post-automation) process, verified by a maintainer unfamiliar with the change being able to follow it successfully end to end.

## Assumptions

- "Automatize o Release" is interpreted as automating *version computation and changelog generation*, not automating the actual publish-to-registry step — the constitution amended earlier this session (v1.39.0) makes the latter explicitly a human-only action, and this feature must respect that rather than override it.
- Changesets (the tool named in the originating research alongside Semantic Release) is the leading candidate given it fits this constraint naturally (it separates "prepare a release" from "publish a release" by design, unlike fully-automatic Semantic Release setups) — the specific tool choice is a plan-phase decision, not a spec-phase one.
- This feature applies only to `packages/react/`, the one published package in this monorepo — the static HTML/CSS catalog and the `showcase/`/`tests/react-harness/` workspaces are not published and are out of scope.
- Storybook or other living-documentation tooling (also mentioned in the originating research) is explicitly out of scope for this feature — feature 048 already substantially addressed the "documentation goes stale" risk via the package's own README/CHANGELOG, and a full interactive-docs tool is a large enough undertaking to warrant its own separate feature if there's real demand for it.
- Framework-lock-in concerns (also raised in the originating research) are already addressed directly in the constitution's new Distribution & Ecosystem Standards section as a stated, accepted scope boundary — no action item here.
