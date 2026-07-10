# Fix Contract: Combobox Listbox Positioning

## CSS change (`src/styles/tailwind.css`)

```css
.combobox-listbox {
  @apply mt-1 max-h-60 overflow-auto rounded-md bg-white py-1
    shadow-lg ring-1 ring-neutral-300;
  position: absolute;
  top: anchor(bottom);
  left: anchor(left);
  right: anchor(right);
}
```

Removed from the `@apply` line: `left-0 right-0` (superseded by `left:
anchor(left); right: anchor(right)`, which stretches the listbox to the
input's exact width — the same visual result as before, now correctly
anchored rather than accidentally correct-width-but-wrong-position).

## JS change — unique per-instance anchor name

**Vanilla** (`src/scripts/combobox.js`), inside `initCombobox({ input,
listbox, options })`:

```js
let anchorCounter = 0; // module-level, shared across all initCombobox() calls
// ...
const anchorName = `--combobox-anchor-${anchorCounter++}`;
input.style.anchorName = anchorName;
listbox.style.positionAnchor = anchorName;
```

## Required verification (Principle II / FR-004 gate)

| Assertion | Mechanism |
|---|---|
| Listbox positioned directly below the input, not viewport-centered | New Playwright test: compare `listbox.boundingBox()` against `input.boundingBox()` — listbox's top edge within a few pixels of the input's bottom edge, horizontally aligned |
| No regression to existing filter/keyboard/ARIA behavior | Full existing `combobox.spec.ts` suite re-run, zero regressions expected |
| No new design tokens | `audit-tokens.mjs`/`check-contrast.mjs` unchanged pass |

## Acceptance mapping

- FR-002, FR-003, FR-004, FR-005, FR-006 → this contract
- SC-001, SC-002, SC-003 → verified by `tests/e2e/combobox.spec.ts`
