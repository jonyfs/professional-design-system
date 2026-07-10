# Quickstart: Fix Popover Panel Positioning

## Prerequisites

Same as every prior feature — no new dependencies.

```bash
npm install
npx playwright install --with-deps
```

## Verify the fix manually

```bash
npm run dev
```

Open Dropdown Menu and Combobox's pages, click/type to open the panel/
listbox, and confirm it visually appears directly under the trigger/
input, not near the top of the page.

## Validate token discipline and AAA/non-text contrast (Principle IV / II gates)

```bash
npm run audit:tokens
npm run audit:contrast
```

**Expected outcome**: both pass unchanged — no new tokens introduced.

## Run the full test suite

```bash
npm run build --workspace packages/react
npm run test:e2e
```

**Expected outcome**: all specs pass, including the new bounding-box-
adjacency assertions in `dropdown-menu.spec.ts`, `combobox.spec.ts`, and
`react-dropdown-menu.spec.ts`.

## Confirm the new assertion actually catches the bug

Before finalizing, temporarily revert the CSS fix (or comment out the
anchor-name/position-anchor JS lines) and re-run the new assertions —
they MUST fail. This proves the new test coverage would have caught the
original bug (SC-003), not just that it passes now.

## Generating new visual regression baselines

Only if `cmp` shows any existing screenshot's pixel content actually
changed (expected: none, since screenshots crop to the element itself).
If needed, same process as every prior feature — **never locally, never
via local Docker**:

```bash
gh workflow run update-snapshots.yml
gh run list --workflow=update-snapshots.yml --limit 1
gh run download <run-id> -n updated-snapshots -D /tmp/updated-snapshots
```

## Constitution amendment reminder

This is a correctness fix to already-ratified components, not a new
catalog entry — no new Component Catalog section is needed. Still worth
a small documentation note if the constitution's own Dropdown Menu/
Combobox descriptions imply correct positioning was already guaranteed;
confirm during implementation whether any wording needs tightening.
