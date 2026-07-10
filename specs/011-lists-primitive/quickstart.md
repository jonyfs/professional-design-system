# Quickstart: Lists Primitive

## Prerequisites

- Repo dependencies installed (`npm install`)
- Dev server running: `npm run dev`

## Validate the component

1. Open `http://localhost:5173/src/components/list/list.html`
2. Confirm three sections render: read-only list, interactive list,
   list with trailing Badge.
3. Tab through the interactive list — each row should show a visible
   focus ring in document order; pressing Enter on a focused row should
   navigate (per its `href`).
4. Hover over an interactive row — background should shift to
   `neutral-50`.

## Run the test suite

```bash
npx playwright test tests/e2e/list.spec.ts
```

Expected: all tests pass, including:
- Zero axe-core violations (read-only and interactive states)
- Visual regression baselines at 320/768/1024/1440px
- Keyboard navigation (Tab reaches every interactive row, Enter activates it)

## Verify the contrast fix

```bash
node scripts/check-contrast.mjs
```

Expected: `text-neutral-600` (list-item metadata) reported as a passing
AAA pairing; confirms the corrected token, not the old failing
`text-neutral-500`.

## Verify token discipline

```bash
node scripts/audit-tokens.mjs
```

Expected: zero violations — no raw utility classes, no hardcoded colors
in `list.html` or the new `@apply` blocks.
