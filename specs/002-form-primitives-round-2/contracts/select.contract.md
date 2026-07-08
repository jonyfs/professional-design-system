# Component Contract: Select

## Markup contract (default/focus)

```html
<div class="space-y-1">
  <label for="example-select" class="text-sm font-medium text-neutral-900">
    Country
  </label>
  <select
    id="example-select"
    class="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm
           ring-1 ring-inset ring-neutral-300
           focus:ring-2 focus:ring-inset focus:ring-brand
           sm:text-sm sm:leading-6"
  >
    <option value="">Select a country…</option>
    <option value="br">Brazil</option>
    <option value="us">United States</option>
    <option value="pt">Portugal</option>
  </select>
</div>
```

## Markup contract (error state)

```html
<div class="space-y-1">
  <label for="example-select-error" class="text-sm font-medium text-neutral-900">
    Country
  </label>
  <select
    id="example-select-error"
    aria-invalid="true"
    aria-describedby="example-select-error-message"
    class="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm
           ring-1 ring-inset ring-error focus:ring-2 focus:ring-inset
           focus:ring-error sm:text-sm sm:leading-6"
  >
    <option value="" selected>Select a country…</option>
    <option value="br">Brazil</option>
    <option value="us">United States</option>
    <option value="pt">Portugal</option>
  </select>
  <p id="example-select-error-message" class="text-xs text-error-strong mt-1 font-medium">
    Please select a country.
  </p>
</div>
```

## Required attributes (Principle II gate)

| State | Required attribute/class |
|---|---|
| error | `aria-invalid="true"`, `aria-describedby` pointing at the error message id, `ring-error` |
| focus | `focus:ring-2 focus:ring-inset focus:ring-brand` (or `focus:ring-error` in error state) |
| disabled | native `disabled` attribute + `disabled:opacity-50 disabled:cursor-not-allowed` |

This matches Text Input's contract (`text-input.contract.md`) with
`<input type="text">` swapped for `<select>` and no `placeholder:*` utility
(native `<select>` has no `::placeholder` pseudo-element) — same tokens,
same states otherwise. The **text** pairings (`text-neutral-900`,
`text-error-strong`) were already AAA-verified for Text Input in feature
001. The **ring** boundaries (`ring-brand`, `ring-error`) were not
previously checked by tooling at all — feature 001 never added ring-token
entries to `check-contrast.mjs` — and are now covered by dedicated
`RING_PAIRINGS` entries added during this feature's code review (a real
gap the review found: this line previously, incorrectly, claimed they
needed "no new contrast check").

## Token allowlist used

`text-neutral-900`, `ring-neutral-300`, `ring-brand`, `ring-error`,
`text-error-strong`. No raw palette classes permitted (FR-004). No new
tokens.

## Acceptance mapping

- FR-002, FR-004, FR-005, FR-006 → this contract
- SC-002, SC-004 → verified by `tests/e2e/select.spec.ts`,
  `scripts/audit-tokens.mjs`
