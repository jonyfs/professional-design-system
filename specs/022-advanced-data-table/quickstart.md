# Quickstart: Advanced Data Table

## Prerequisites
- `npm install` (no new dependency added by this feature).

## Setup
```bash
npm run build --workspace packages/react
npm run build
npm run dev
```

## Validate: sort, filter, paginate a large dataset (SC-001)
1. Open `/src/components/data-table/data-table.html` (static) or the
   React harness's `data-table.html` demo, populated with ≥1,000 rows.
2. Sort by a column, then a second column (multi-sort) — confirm order
   and `aria-sort` update with no perceptible delay.
3. Type into the global search field — confirm rows narrow and
   pagination reflects the new filtered count.
4. Page forward/back — confirm sort and filter remain applied.
5. Filter to zero matches — confirm the "No results match your filters"
   state renders, distinct from a genuinely empty dataset's "No data yet".

## Validate: selection and bulk actions (SC-002)
```bash
npx playwright test tests/e2e/data-table.spec.ts tests/e2e/react-data-table.spec.ts --grep "selection|bulk"
```
Expected: selecting several rows shows the bulk-action toolbar with the
correct count; the header control's "select this page" vs. "select all
matching" choice appears once the dataset exceeds one page; triggering a
`requiresConfirmation` bulk action opens a confirm step before applying.

## Validate: CRUD (SC-003)
1. With `crud.create`/`edit`/`delete` all enabled on the demo instance,
   create a record, edit it, then delete it — confirm each operation
   completes without losing the table's current sort/filter/page/
   selection.
2. Submit an invalid form — confirm field-level errors appear and other
   field values are preserved.
3. Toggle a table instance to read-only (all three `crud` flags `false`)
   — confirm zero CRUD affordances render.

## Validate: accessibility and responsive behavior (SC-004, SC-005)
```bash
npx playwright test tests/e2e/data-table.spec.ts tests/e2e/react-data-table.spec.ts --project=chromium-320
npm run audit:contrast
npm run audit:tokens
```
Expected: 0 axe-core violations, 0 new contrast/token findings, full
keyboard operability, no horizontal page overflow at 320px (the table's
own region scrolls per `.data-table-wrapper`'s existing convention).

## Full success-criteria trace
See `spec.md`'s Success Criteria (SC-001–SC-006) and `data-model.md`'s
Cross-cutting invariants for the complete list this quickstart validates
against.
