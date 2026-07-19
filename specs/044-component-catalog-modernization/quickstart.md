# Quickstart: Validating Component Catalog Quality & 2026 Modernization Audit

Prerequisites: local checkout with dependencies installed (`npm ci`), `gh` CLI authenticated.

## 1. Confirm audit completeness (User Story 1 / SC-001)

1. Open the audit tracking artifact (produced during `/speckit-tasks`/implementation) and count rows against `ls src/components | wc -l` minus the 5 deferred components (research.md R2).
2. **Expected**: every catalogued component has a recorded pass/fail result for all five quality dimensions — none blank or assumed.

## 2. Confirm fixes resolved real gaps with no regressions (User Story 1 / SC-002)

1. Run the full existing verification suite: `npm run verify` (typecheck → token audit → contrast audit → build → full E2E suite).
2. **Expected**: zero failures. Every component that previously failed a dimension (per the audit record) now passes it; no previously-passing test regressed.
3. Spot-check a sample of "already compliant, left untouched" components (data-model.md) — confirm their source files are unchanged (`git diff` empty for those paths) per FR-003.

## 3. Confirm React parametrization (User Story 1 / SC-003)

1. For a sample of components across different categories, compare the props documented in `packages/react/src/<PascalName>`'s type definitions against the states exercised in `tests/e2e/<name>.spec.ts`.
2. **Expected**: every exercised state (hover, focus-visible, disabled, checked, error, expanded, etc.) is reachable via a documented React prop — no state requires reaching into the DOM or overriding CSS from outside the component's own API.
3. Run `npm run typecheck` (root + `packages/react` workspace) — confirms the audited/fixed prop types are still sound.

## 4. Confirm targeted 2026 refinement stayed in scope (User Story 2)

1. Diff the components flagged during the audit (Required Qualities count < 4) against the components left untouched (count ≥ 4, per data-model.md).
2. **Expected**: only flagged components show source changes; refined components now demonstrate ≥4 Required Qualities; re-run `npm run verify` to confirm no functional/accessibility/theming regression from the visual refinement (spec.md User Story 2, Acceptance Scenario 3).

## 5. Confirm reviewable delivery with a live preview (User Story 3 / SC-004)

1. Confirm the work lands as a single PR: `gh pr view <number> --json title,state,baseRefName`.
2. Confirm the PR triggered the new `pr-preview.yml` workflow (research.md R5): `gh run list --workflow=pr-preview.yml --json databaseId,status,conclusion --limit 1`.
3. Open the resulting preview URL (posted as a PR comment by `rossjrw/pr-preview-action`, typically `https://<owner>.github.io/<repo>/pr-preview/pr-<number>/`) and visually browse a sample of changed components across the standard breakpoints (320/768/1024/1440) and at least two themes (light + dark).
4. **Expected**: the live preview reflects every changed component; no build/deploy error; production `main` deployment is untouched by this PR-preview build.

## 6. Confirm no coverage reduction (SC-005)

1. Compare the total Playwright test count before and after this feature: `npx playwright test --list 2>&1 | tail -1` (prints `Total: N tests in M files`).
2. **Expected**: N is greater than or equal to the pre-feature baseline — never lower.
