# Quickstart: Table Primitive

## Prerequisites

- Repo dependencies installed (`npm install`)
- Dev server running: `npm run dev`

## Validate the component

1. Open `http://localhost:5173/src/components/table/table.html`
2. Confirm three sections render: baseline table, zebra-striped table,
   table with a trailing-action column.
3. Resize to 320px width — confirm the table scrolls horizontally
   within its wrapper rather than breaking the page layout.

## Run the test suite

```bash
npx playwright test tests/e2e/table.spec.ts
```

Expected: all tests pass, including zero axe-core violations, visual
regression baselines at 320/768/1024/1440px, and correct `scope="col"`
usage on every header cell.

## Verify contrast

```bash
node scripts/check-contrast.mjs
```

Expected: `text-neutral-600` (header, on `bg-neutral-50`) and
`text-neutral-900` (cells) both reported AAA-compliant.

## Verify token discipline

```bash
node scripts/audit-tokens.mjs
```

Expected: zero violations.
