# Quickstart: React Port — Batch 2

## Prerequisites

- Repo dependencies installed (`npm install`)
- React package built: `npm run build --workspace packages/react`
- React test harness dev server running (per-component, mirroring
  feature 009/010's pattern): `npm run dev --workspace tests/react-harness`

## Validate a component

1. Open the harness page for the component under test (e.g.
   `http://localhost:5174/pagination.html`).
2. Confirm visual parity against the static reference
   (`http://localhost:5173/src/components/pagination/pagination.html`).
3. For Combobox/Command Palette specifically: type a filter query,
   arrow-navigate, Enter to commit/execute, Escape to cancel.

## Run the test suite

```bash
npx playwright test tests/e2e/react-pagination.spec.ts \
  tests/e2e/react-sidebar.spec.ts \
  tests/e2e/react-navbar.spec.ts \
  tests/e2e/react-avatar.spec.ts \
  tests/e2e/react-card.spec.ts \
  tests/e2e/react-list.spec.ts \
  tests/e2e/react-table.spec.ts \
  tests/e2e/react-alert.spec.ts \
  tests/e2e/react-combobox.spec.ts \
  tests/e2e/react-command-palette.spec.ts
```

Expected: all pass, including zero axe-core violations and visual
regression parity with each static reference.

## Verify no regressions

```bash
npm run test:e2e
node scripts/audit-tokens.mjs
node scripts/check-contrast.mjs
```
