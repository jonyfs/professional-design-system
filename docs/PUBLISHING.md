# Publishing `@professional-design-system/react`

A documented, repeatable process for releasing a new version of the React package. This is a maintainer runbook — for consumer-facing usage docs, see [`packages/react/README.md`](../packages/react/README.md).

## Prerequisites

- npm registry credentials with publish access to the `@professional-design-system` org (`npm whoami` must succeed and return an account with publish rights — this repo's own CI/development environment does not hold these credentials, so this final step is always run by a maintainer, not automated).
- A clean working tree on `main`, with all changes for the release already merged.

## Steps

1. **Update the changelog first.** Move every entry under `packages/react/CHANGELOG.md`'s `## [Unreleased]` heading into a new `## [x.y.z] - YYYY-MM-DD` section, in consumer-relevant terms (what changed and why it matters to someone installing the package — not an internal commit-message dump). Leave `## [Unreleased]` in place, empty, for the next round of changes.

2. **Bump the version.**

   ```bash
   npm version patch --workspace packages/react   # or: minor / major
   ```

   This updates `packages/react/package.json`'s `version` field and creates a git tag. Use [semantic versioning](https://semver.org/): `patch` for bug fixes (like the theme-switching fix in this package's own changelog), `minor` for new components/props that don't break existing usage, `major` for anything that changes an existing component's public API.

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

6. **Push the version tag.**

   ```bash
   git push origin main --tags
   ```

## Notes

- This runbook was written and verified (steps 1-4) during feature 048's external-consumption work, using `npm pack` + install-into-a-separate-project as a stand-in for a real publish, since that session had no registry credentials. Step 5 itself has not been executed by an automated agent, and should not be — see the note in step 5.
