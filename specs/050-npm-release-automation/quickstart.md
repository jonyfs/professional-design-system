# Quickstart: Verifying NPM Release Automation

Runnable steps proving User Stories 1-3's Independent Tests and Success Criteria SC-001 through SC-005.

## §1: Confirm Changesets is configured correctly (research.md R2)

```bash
cat .changeset/config.json
```

**Expected outcome**: `ignore` includes `showcase` and `react-harness`; no `publish` command is configured anywhere in `.github/workflows/release.yml` (grep for `publish:` in that file should return nothing).

## §2: Author a real change record (FR-001)

```bash
npx changeset
# interactively select @professional-design-system/react, "patch",
# and write a one-line summary
git status   # confirm a new .changeset/*.md file appears
```

**Expected outcome**: a new Markdown file under `.changeset/` with the correct frontmatter and summary.

## §3: Confirm the CI check enforces FR-002/FR-003

- Open a throwaway PR that modifies a file under `packages/react/src/` with no changeset: confirm the `changeset-check` CI job fails with a clear message.
- Open a throwaway PR that only modifies `README.md` at the repo root (outside `packages/react/`): confirm the `changeset-check` job does not run, or passes trivially — never blocks.

## §4: Compute a version bump locally (FR-004, SC-003)

```bash
npx changeset version
git diff packages/react/package.json packages/react/CHANGELOG.md
```

**Expected outcome**: `packages/react/package.json`'s `version` field bumps correctly (matching the highest-impact pending changeset), and `CHANGELOG.md` gains a new entry assembled from the changeset's summary — in the same style as the existing `[0.1.0]`/`[Unreleased]` entries written by hand in feature 048.

```bash
git checkout -- packages/react/package.json packages/react/CHANGELOG.md .changeset/
```

(Revert this local dry run — the real version bump should only happen via the automated "Version Packages" PR, not a manual local run left uncommitted.)

## §5: Confirm feature 048's existing verification steps still pass unchanged (FR-008)

```bash
npm run build --workspace packages/react
npm run typecheck --workspace packages/react
npm run audit:tokens
npm run audit:contrast
npm pack --workspace packages/react --pack-destination /tmp
tar -tzf /tmp/professional-design-system-react-*.tgz
rm /tmp/professional-design-system-react-*.tgz
```

**Expected outcome**: identical to feature 048's own verification — all pass, tarball still contains `LICENSE`, `README.md`, `CHANGELOG.md`, and `dist/`.

## §6: Confirm `docs/PUBLISHING.md` reads correctly end to end (FR-007, SC-005)

Read `docs/PUBLISHING.md` start to finish and confirm it now describes: author a changeset per change → CI enforces this → review/merge the auto-generated "Version Packages" PR → the existing (unchanged) build/typecheck/audit/tarball-check/publish steps.
