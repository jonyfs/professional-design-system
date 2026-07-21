# Tasks: NPM Publish Automation

**Input**: Design documents from `/specs/051-npm-publish-automation/`
**Prerequisites**: plan.md

## Phase 1: Setup

- [x] T001 [Manual, non-code] A repository administrator creates an npm
  "Automation" access token scoped to `professional-design-system` publish
  access, and adds it as the `NPM_TOKEN` repository secret in GitHub
  Settings → Secrets and variables → Actions. Blocks every task below —
  the workflow change can be written and merged without it, but cannot
  actually publish until this exists.
  **Done 2026-07-20**: since the package has never been published, npm's
  "Trusted Publisher" page (the more secure OIDC alternative — no
  long-lived token) can't be pre-configured for it; that page only
  exists once a package has published at least once. Generated a
  granular access token instead (name `github-actions-initial-publish`,
  read/write, all packages since none can be pre-selected, bypass-2FA
  enabled since GitHub Actions can't complete an interactive 2FA
  challenge, 7-day expiry) and added it as the `NPM_TOKEN` repository
  secret. **Follow-up once the first publish succeeds**: configure
  Trusted Publishing/OIDC on the now-existing package's settings page,
  switch `release.yml` to OIDC (drop `NPM_TOKEN`), then revoke this
  token — tracked as new work, not yet a task here.

## Phase 2: User Story 1 — Merging the Version Packages PR ships the release (P1)

**Goal**: Merging the changesets Version Packages PR into `main` triggers
an automated `npm publish` — no manual command required — and an ordinary
feature-PR merge never triggers a publish attempt.

**Independent Test**: Merge a Version Packages PR that bumps
`packages/react`'s version, confirm a GitHub Actions run publishes it, and
confirm `npm view professional-design-system version` reflects the new
version with no command run outside GitHub Actions.

- [x] T002 [US1] In `.github/workflows/release.yml`, add a step before
  the existing `changesets/action@v1` step (L38-43) that runs the same
  build + verify commands `docs/PUBLISHING.md`'s Steps 3-4 document
  (`npm run build --workspace packages/react`, `npm run typecheck
  --workspace packages/react`, `npm run audit:tokens`, `npm run
  audit:contrast`), failing the job if any fail — gates FR-006's
  pre-publish verification before T003 can run.
- [x] T003 [US1] Add an `npm pack` + tarball-contents check step
  immediately after T002 (same commands as `docs/PUBLISHING.md` Step 4:
  `npm pack --workspace packages/react --pack-destination /tmp`, then
  confirm `LICENSE`, `README.md`, `CHANGELOG.md`, and `dist/` including
  `dist/styles.css` are present in the tarball, then delete it) —
  completes FR-006's verification gate; the job fails before reaching
  T004 if this check fails.
- [x] T004 [US1] Extend the existing `changesets/action@v1` step
  (`.github/workflows/release.yml` L38-43) with a `publish: npx changeset
  publish` input, and add `NPM_TOKEN: ${{ secrets.NPM_TOKEN }}` to its
  existing `env:` block (alongside `GITHUB_TOKEN`) — this is
  `changesets/action`'s own built-in mechanism (FR-001): it opens/updates
  the Version Packages PR when changesets are pending, and instead runs
  the `publish` command when there are none pending and the local version
  differs from the registry (i.e. exactly the run immediately after that
  PR is merged).
- [x] T005 [US1] Verify (dry run, no real registry credentials required
  per feature 048's established pattern): `npm pack --workspace
  packages/react --pack-destination /tmp` followed by installing the
  tarball into a project outside this workspace, confirming the package
  resolves and its `exports` map works — the same faithful stand-in
  `plan.md`'s Testing section names, exercising T002-T003's exact
  commands before this workflow is trusted with a real token.

**Checkpoint**: Story 1 independently testable — a real Version Packages
PR merge (once T001's secret exists) should publish without further
manual steps.

## Phase 3: User Story 2 — A failed publish is visible and doesn't silently corrupt release state (P1)

**Goal**: A failed publish attempt (bad credentials, network error)
reports as a clearly failed GitHub Actions run, and a subsequent
successful run still publishes the correct pending version with no manual
cleanup.

**Independent Test**: Force the publish step to fail (temporarily invalid
`NPM_TOKEN`), confirm the run is marked failed, fix the token, re-run, and
confirm it successfully publishes.

- [x] T006 [US2] Confirm (via `changesets/action`'s documented behavior,
  verified against its own source/README since this project has no
  registry credentials to force a live failure) that a failed `npx
  changeset publish` inside the action's `publish` input causes the
  action step itself to report failure — not swallow the error — so
  FR-004 holds without any extra error-handling code in `release.yml`.
  If the action does NOT already surface failures this way, this task
  becomes: wrap the publish input in a script that explicitly checks the
  command's exit code and fails the step.
- [x] T007 [US2] Confirm `npx changeset publish`'s own behavior satisfies
  FR-003/FR-005: it checks each package's version against what's already
  on the registry before publishing, skipping (not erroring) an
  already-published version — this is the mechanism that makes a re-run
  after a fixed failure safe with zero manual state cleanup, since the
  action naturally re-attempts only what hasn't successfully published
  yet.
- [x] T008 [US2] [P] Update `docs/PUBLISHING.md`'s Prerequisites section
  (FR-009) to note: the automated path (T001-T005) is now the default;
  `NPM_TOKEN` lives in the repository's Actions secrets, not a
  maintainer's local npm session; manual `npm publish` (the existing
  Step 5) remains documented as an explicit fallback for when the
  automation can't run (e.g. `NPM_TOKEN` unavailable, an emergency
  out-of-band release) — this task only edits prose, independent of
  T002-T007's workflow-file changes.

**Checkpoint**: Story 2 independently testable via a deliberately-broken
token and a subsequent fix, without depending on Story 3's tagging work.

## Phase 4: User Story 3 — Every published version is tagged and matches `docs/PUBLISHING.md`'s verification steps (P2)

**Goal**: An automated publish still creates a git tag for the published
version, and still runs the same tarball-contents sanity check the manual
runbook already performs.

**Independent Test**: After a real or dry-run publish, confirm a git tag
matching `docs/PUBLISHING.md`'s `professional-design-system@$(version)`
convention exists on the published commit.

- [x] T009 [US3] Confirm `npx changeset publish`'s own behavior creates a
  git tag per published package (`changesets/action`'s documented
  behavior) matching the `professional-design-system@$(version)` naming
  `docs/PUBLISHING.md`'s existing Step 6 already uses — if the action
  does not push tags automatically, add a follow-up step after T004 that
  runs `git push origin main --tags`, since `changesets/action` alone
  creates local tags but a separate push may still be required depending
  on the action's own tag-push behavior (verify against its README, not
  assumed).
- [x] T010 [US3] [P] Update `docs/PUBLISHING.md`'s Steps 5-6 (currently
  the manual publish and manual tag commands) to describe them as what
  the automation now performs on a maintainer's behalf, retaining the
  original manual commands verbatim underneath as the documented
  fallback path referenced by T008 — independent of T009's workflow
  verification, only touches prose.

**Checkpoint**: Story 3 independently testable — tag existence check
doesn't require re-running Stories 1/2's failure-path tests.

## Dependencies

- T001 (the `NPM_TOKEN` secret) blocks any task that requires a real
  publish to actually succeed end-to-end, but does NOT block writing or
  merging the workflow-file changes themselves (T002-T004, T009) — those
  can be written and reviewed without the secret existing yet, the same
  way `release.yml`'s original PR-only version already merged before any
  publish capability existed.
- T002 → T003 → T004 are strictly sequential — each is a step within the
  same `release.yml` job, and T003 depends on T002's build/verify output
  existing; T004's publish step must come last since it's gated on both
  passing.
- T005 (dry-run verification) depends on T002-T004 being written, but not
  on T001 (real credentials) — it uses the same `npm pack`-based stand-in
  feature 048 established.
- T006-T007 (User Story 2) can be investigated/confirmed in parallel with
  T002-T005 (User Story 1) — they're about `changesets/action`'s existing
  documented behavior, not new code in `release.yml`, so they don't block
  or get blocked by the workflow edits themselves.
- T008, T010 (documentation updates) are marked `[P]` — both edit
  `docs/PUBLISHING.md` but in different sections (Prerequisites vs. Steps
  5-6) and neither depends on the other's wording, only on the underlying
  workflow behavior (T004, T009) being confirmed first so the docs
  describe what actually ships.
- T009 depends on T004 (the publish step must exist before its tagging
  behavior can be verified).
