# Publishing `@professional-design-system/react`

A documented, repeatable process for releasing a new version of the React package. This is a maintainer runbook — for consumer-facing usage docs, see [`packages/react/README.md`](../packages/react/README.md).

## Prerequisites

- npm registry credentials with publish access to the `@professional-design-system` org (`npm whoami` must succeed and return an account with publish rights — this repo's own CI/development environment does not hold these credentials, so this final step is always run by a maintainer, not automated).
- A clean working tree on `main`, with all changes for the release already merged.

## Before you get here: every PR needs a changeset

As of feature 050, version bumps and changelog entries are no longer hand-written at release time — they're assembled automatically from **changesets**, small Markdown files contributors add to their own PRs. If you're making a change to `packages/react/`:

```bash
npx changeset
```

This interactively asks which package changed, the semver impact (patch/minor/major), and a one-line consumer-facing summary, then writes a file to `.changeset/`. Commit it alongside the rest of your PR. CI (`changeset-check.yml`) fails the PR if this is missing for any change under `packages/react/`; it never runs for PRs that don't touch that path.

## Steps

1. **Review and merge the automated "Version Packages" PR.** Once changesets exist on `main`, `.github/workflows/release.yml` (via `changesets/action`) opens or updates a PR that has already computed the correct version bump (taking the highest-impact pending changeset) and assembled the `packages/react/CHANGELOG.md` entry from every accumulated changeset's summary. Review it like any other PR, then merge it — this replaces the old manual "hand-write the changelog, hand-pick the version" step entirely. **This workflow never publishes anything itself** — merging it only updates `package.json`'s version and the changelog in the repo, per this project's constitution (`Distribution & Ecosystem Standards`, v1.39.0: a real `npm publish` is human-authorized, never autonomous).

2. **Pull the merged version bump locally.**

   ```bash
   git checkout main && git pull
   ```

   `packages/react/package.json`'s `version` is now whatever the Version Packages PR computed.

3. **Build and verify.**

   ```bash
   npm run build --workspace packages/react
   npm run typecheck --workspace packages/react
   npm run audit:tokens
   npm run audit:contrast
   ```

   All four must pass with zero errors before proceeding.

4. **Sanity-check the tarball contents.**

   ```bash
   npm pack --workspace packages/react --pack-destination /tmp
   tar -tzf /tmp/professional-design-system-react-*.tgz
   ```

   Confirm `LICENSE`, `README.md`, `CHANGELOG.md`, and the full `dist/` directory (including `dist/styles.css`) are all present — then delete the tarball (`rm /tmp/professional-design-system-react-*.tgz`), it was only for inspection.

5. **Publish.**

   ```bash
   npm publish --workspace packages/react --access public
   ```

   Requires the credentials from Prerequisites. This is the only step in this runbook that is irreversible and public (a published version cannot be unpublished after 72 hours per npm's own policy) — it is deliberately a manual, human-run command, not part of an automated CI workflow, since provisioning registry credentials into CI is itself a decision requiring explicit setup by whoever administers this repository's secrets.

6. **Tag the release** (Changesets doesn't create a git tag on its own — `npm version` used to, this replaces that part of its behavior).

   ```bash
   git tag "@professional-design-system/react@$(node -p "require('./packages/react/package.json').version")"
   git push origin main --tags
   ```

## Notes

- Steps 3-4 (build/verify, tarball sanity-check) were written and verified during feature 048's external-consumption work, using `npm pack` + install-into-a-separate-project as a stand-in for a real publish, since that session had no registry credentials. Step 5 (the actual `npm publish`) has not been executed by an automated agent, and should not be — see the note in step 5.
- Steps 1-2 and the changeset-authoring step above were added and verified (`npx changeset`, `changeset version` run locally then reverted) during feature 050, which introduced the automated version/changelog tooling. See `packages/react/CHANGELOG.md`'s own header for why its intro text is deliberately short (Changesets always inserts new entries directly below the title).
