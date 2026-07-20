---

description: "Task list for NPM Release Automation (feature 050)"
---

# Tasks: NPM Release Automation

**Input**: Design documents from `/specs/050-npm-release-automation/`

**Tests**: no automated unit-test framework applies to third-party CI tooling adoption — verification is quickstart.md's own scripted steps (real `npx changeset`/`changeset version` runs, real CI job behavior), matching feature 048's own precedent for a tooling/process feature.

## Phase 1: Setup

- [X] T001 Ran `npx changeset init` (after installing `@changesets/cli` as a root devDependency) to scaffold `.changeset/config.json` and `.changeset/README.md`
- [X] T002 Edited `.changeset/config.json`: `ignore` set to `["showcase", "react-harness"]`, `access` set to `"public"` (default was `"restricted"` — wrong for a package meant to be publicly installable)
- [X] T003 Added a root `package.json` script: `"changeset": "changeset"`

**Checkpoint**: Changesets is installed and scoped correctly to only ever version `packages/react/`.

## Phase 2: User Story 1 - A contributor records what changed at the same time they change it (P1) 🎯 MVP

- [X] T004 [US1] Authored a real demo changeset via a direct `.changeset/*.md` file (matching the exact format `npx changeset`'s interactive wizard produces — verified against `.changeset/README.md`'s own documented format) and confirmed `npx changeset status --verbose` recognized it correctly (computed `0.1.0 → 0.1.1`, patch). Removed before finalizing, per quickstart.md's own instruction — a demo entry duplicating already-changelogged content shouldn't ship.
- [X] T005 [US1] Wrote `.github/workflows/changeset-check.yml`: path-filtered to `packages/react/**` on `pull_request`, running `npx changeset status --since=origin/main`
- [X] T006 [US1] Verified by construction (the workflow's own `paths:` filter, GitHub Actions' documented behavior) rather than a live throwaway PR: a PR touching `packages/react/**` triggers the job; a PR that doesn't is never even queued for it — this is stronger than "passes trivially," it structurally cannot run

**Checkpoint**: every `packages/react/`-touching PR is required to carry a change record; nothing else is affected.

## Phase 3: User Story 2 - The next version number and changelog write themselves (P1)

- [X] T007 [US2] Wrote `.github/workflows/release.yml` using `changesets/action@v1`, triggered on push to `main` — **no `publish` command configured** in the action's `with:` block (research.md R4, constitution v1.39.0's human-only-publish rule)
- [X] **T008 [US2] Real defect found and fixed during verification**: ran `npx changeset version` locally against the demo changeset and found Changesets' default changelog generator produces a heading format (`## 0.1.1`, no brackets/date) that doesn't match this package's existing hand-written Keep-a-Changelog-style headings (`## [0.1.1] - YYYY-MM-DD`), and — more consequentially — Changesets always inserts its new section immediately below the file's H1 title, pushing any existing intro prose further down with every release (not configurable via the changelog-generator plugin interface, which only controls per-change bullet lines, not the version heading or insertion point). Confirmed this isn't a one-off bug by testing twice (once against a version-less test file, once against the real feature-048 `CHANGELOG.md`) — genuinely a hard constraint of the tool. Fixed by rewriting `packages/react/CHANGELOG.md`'s intro to be deliberately short and to explicitly explain why (so it reads sensibly wherever it ends up after repeated releases), rather than accepting a growing structural mismatch silently. Reverted the local dry-run version bump afterward, per quickstart.md.
- [X] T009 [US2] Confirmed by reading `release.yml`: its only output is a pull request via `changesets/action`; no step calls `npm publish` or pushes a version tag directly — satisfies FR-006/SC-004 by construction

**Checkpoint**: version bump + changelog generation is automatic and reviewable; publishing remains untouched, manual, and separate.

## Phase 4: User Story 3 - Confidence that automation matches what was manually verified before (P2)

- [X] T010 [US3] Re-ran feature 048's full verification sequence on this branch (rebased onto 048's tip mid-implementation — see Implementation Notes below): `build`/`typecheck --workspace packages/react`, `audit:tokens` (558 @apply blocks, 142 .tsx files, 0 violations), `audit:contrast` (0 new failures, only pre-existing documented `KNOWN_THEME_CONTRAST_GAPS`), `npm pack` + tarball-contents check (9 files: `LICENSE`, `README.md`, `CHANGELOG.md`, full `dist/`) — all pass unchanged (FR-008)
- [X] T011 [US3] Updated `docs/PUBLISHING.md`: added a "Before you get here: every PR needs a changeset" section, replaced the old hand-write-changelog/hand-bump-version steps 1-2 with "review and merge the automated Version Packages PR" + "pull the merged bump," renumbered the unchanged build/audit/tarball/publish steps, replaced the stale `npm version`-based git-tag step with a Changesets-compatible tag command, and updated the closing Notes to attribute which steps came from feature 048 vs. feature 050
- [X] T012 [US3] Read the updated `docs/PUBLISHING.md` end to end — accurately describes automated (version/changelog) vs. still-manual (build/verify/tarball-check/publish/tag) steps, no stale references to the old fully-manual flow

**Checkpoint**: the new process is fully documented and verified not to have silently changed anything feature 048 already proved works.

## Phase 5: Polish

- [X] T013 [P] Ran `graphify update .` to sync the knowledge graph after all changes landed

---

## Implementation Notes

**Branch base correction**: this feature was originally branched from `main`, but its own spec/plan directly reference `docs/PUBLISHING.md` and `packages/react/CHANGELOG.md` — both created in feature 048, not yet merged to `main`. Discovered this when T011 had no file to update. Fixed by deleting and recreating the branch from `048-external-package-consumption`'s tip (mirroring the same dependency-chain pattern already used for 044→047→048) before continuing — no work was lost, since nothing had been committed yet at that point.

**This PR tripped its own `changeset-check`**: once opened, CI failed because the PR edits `packages/react/CHANGELOG.md` (this feature's own intro-text fix, T008) with no changeset — `getVersionableChangedPackages` counts any file change under `packages/react/**`, not just source code, so even a changelog-formatting edit counts. Fixed correctly per the tool's own suggested remedy (`npx changeset add --empty`, not by narrowing the path filter, since the broad `packages/react/**` scope is intentional per FR-002). A second, real gotcha surfaced while verifying the fix locally: `changeset status --since=<ref>` compares **committed** git history — an uncommitted, freshly-created changeset file is invisible to it and the check still fails, which cost a round of confused re-testing before realizing the file simply hadn't been committed yet. Documented here since any future contributor hitting the same "I added a changeset but the check still fails" confusion should commit it first before re-checking.

---

## Dependencies & Execution Order

- Setup (T001-T003) blocks everything — Changesets must exist before it can be used or enforced.
- US1 (T004-T006) depends on Setup.
- US2 (T007-T009) depends on Setup; T008 depends on T004 (needs a real changeset to version). Independent of US1's CI-check work otherwise.
- US3 (T010-T012) depends on US1+US2 being in place (there's a real process to verify/document).
- Polish depends on everything above.

### Parallel Opportunities

- T005 (changeset-check.yml) and T007 (release.yml) touch different files — parallelizable once Setup completes.

## Implementation Strategy

### MVP First

1. Setup (T001-T003) → Changesets installed and scoped correctly.
2. US1 (T004-T006) → the foundational capability: a change record exists and its absence is caught by CI.
3. **STOP and VALIDATE**: a real changeset authored, CI check behaves correctly on both a touching and a non-touching PR.

### Incremental Delivery

1. Setup → tool installed, scoped to `packages/react/` only.
2. US1 → change records are captured and enforced (MVP).
3. US2 → version/changelog generation automated, publish still manual.
4. US3 → confidence nothing regressed, documentation current.
5. Polish → graphify sync.
