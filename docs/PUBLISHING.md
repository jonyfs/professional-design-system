# Publishing `professional-design-system`

A documented, repeatable process for releasing a new version of the React package. This is a maintainer runbook — for consumer-facing usage docs, see [`packages/react/README.md`](../packages/react/README.md).

## As of feature 051: publishing is automated

Merging the "Version Packages" PR (see Step 1 below) is now the *only* step a maintainer performs — `.github/workflows/release.yml` runs the build/verify/tarball checks and the actual `npm publish` itself immediately afterward, authenticating with a repository `NPM_TOKEN` secret. The PR merge is the human authorization the constitution's `Distribution & Ecosystem Standards` (v2.0.0) requires; no further manual command is needed. The rest of this document's "Manual fallback" section describes the steps the automation now performs, kept as the documented path for when the automation can't run (e.g. `NPM_TOKEN` unavailable or invalid, an emergency out-of-band release).

## Prerequisites

- **Automated path (default)**: an `NPM_TOKEN` repository secret (GitHub Settings → Secrets and variables → Actions), holding an npm "Automation" access token scoped to `professional-design-system` publish access under the `jonfys` account. Provisioned once by whoever administers this repository; not something CI or an agent can create.
- **Manual fallback only**: npm registry credentials for the personal `jonfys` account with publish access to `professional-design-system` (`npm whoami` must succeed and return `jonfys` — this repo's own CI/development environment does not hold personal credentials, so the manual path is always run by a maintainer).
- A clean working tree on `main`, with all changes for the release already merged.

## Before you get here: every PR needs a changeset

As of feature 050, version bumps and changelog entries are no longer hand-written at release time — they're assembled automatically from **changesets**, small Markdown files contributors add to their own PRs. If you're making a change to `packages/react/`:

```bash
npx changeset
```

This interactively asks which package changed, the semver impact (patch/minor/major), and a one-line consumer-facing summary, then writes a file to `.changeset/`. Commit it alongside the rest of your PR. CI (`changeset-check.yml`) fails the PR if this is missing for any change under `packages/react/`; it never runs for PRs that don't touch that path.

## Steps

1. **Review and merge the automated "Version Packages" PR.** Once changesets exist on `main`, `.github/workflows/release.yml` (via `changesets/action`) opens or updates a PR that has already computed the correct version bump (taking the highest-impact pending changeset) and assembled the `packages/react/CHANGELOG.md` entry from every accumulated changeset's summary. Review it like any other PR, then merge it.

2. **That's it.** The same `release.yml` workflow runs again on the merge commit, and this time — since there are no more pending changesets and `packages/react`'s version now differs from what's on the npm registry — it builds, verifies, sanity-checks the tarball, and runs `npm publish` for you, then pushes a `professional-design-system@$(version)` git tag. Watch the workflow run in the Actions tab if you want to confirm it succeeded; `npm view professional-design-system version` will reflect the new version within a minute or two of the run completing.

## Manual fallback

Use this path only if the automated workflow can't run (e.g. `NPM_TOKEN` missing/invalid, or an emergency release outside the normal PR-merge flow).

1. **Pull the merged version bump locally.**

   ```bash
   git checkout main && git pull
   ```

   `packages/react/package.json`'s `version` is now whatever the Version Packages PR computed — safe to trust as-is, since `deploy-pages.yml`'s own auto-bump job only touches the root `package.json`, never `packages/react/`'s (a code-review finding fixed before this feature shipped: it used to force-write its own unrelated patch counter onto `packages/react/package.json` on every merge to `main`, silently overwriting whatever Changesets had just computed).

2. **Build and verify.**

   ```bash
   npm run build --workspace packages/react
   npm run typecheck --workspace packages/react
   npm run audit:tokens
   npm run audit:contrast
   ```

   All four must pass with zero errors before proceeding.

3. **Sanity-check the tarball contents.**

   ```bash
   npm pack --workspace packages/react --pack-destination /tmp
   tar -tzf /tmp/professional-design-system-*.tgz
   ```

   Confirm `LICENSE`, `README.md`, `CHANGELOG.md`, and the full `dist/` directory (including `dist/styles.css`) are all present — then delete the tarball (`rm /tmp/professional-design-system-*.tgz`), it was only for inspection.

4. **Publish.**

   ```bash
   npm publish --workspace packages/react --access public
   ```

   Requires the personal-account credentials from Prerequisites. This is the only step in this runbook that is irreversible and public (a published version cannot be unpublished after 72 hours per npm's own policy).

5. **Tag the release** (Changesets doesn't create a git tag on its own — `npm version` used to, this replaces that part of its behavior).

   ```bash
   git tag "professional-design-system@$(node -p "require('./packages/react/package.json').version")"
   git push origin main --tags
   ```

## Notes

- Steps 2-3 of the manual fallback (build/verify, tarball sanity-check) were written and verified during feature 048's external-consumption work, using `npm pack` + install-into-a-separate-project as a stand-in for a real publish, since that session had no registry credentials. The same commands are what `release.yml` now runs automatically (feature 051).
- Steps 1-2 of the main Steps section, and the changeset-authoring step above, were added and verified (`npx changeset`, `changeset version` run locally then reverted) during feature 050, which introduced the automated version/changelog tooling. See `packages/react/CHANGELOG.md`'s own header for why its intro text is deliberately short (Changesets always inserts new entries directly below the title).
- Feature 051 amended the constitution (`Distribution & Ecosystem Standards`, v2.0.0) to recognize CI-run `npm publish` — gated on a human merging the Version Packages PR — as a second compliant authorization form alongside the original manual path. An AI agent still never invokes `npm publish` directly under either form.
