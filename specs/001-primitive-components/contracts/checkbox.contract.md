# Component Contract: Checkbox

## Markup contract

```html
<div class="flex items-center gap-2">
  <input
    id="example-checkbox"
    type="checkbox"
    class="h-4 w-4 rounded-sm border-neutral-300 text-brand
           focus-visible:outline focus-visible:outline-2
           focus-visible:outline-offset-2 focus-visible:outline-brand
           disabled:opacity-50 disabled:cursor-not-allowed"
  />
  <label for="example-checkbox" class="text-sm text-neutral-900 cursor-pointer">
    Checkbox label
  </label>
</div>
```

## Required attributes (Principle II + V gates)

| State | Required attribute/class |
|---|---|
| checked | native `checked` attribute/property; `text-brand` renders the checked mark via native `accent`/`text-*` mapping |
| focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand` |
| disabled | native `disabled` attribute + `disabled:opacity-50 disabled:cursor-not-allowed`, combinable with `checked` |
| aria | native `<input type="checkbox">` already exposes `checked` state to assistive tech; no extra `aria-checked` needed unless the element is reimplemented as a custom `role="checkbox"` `<div>` — this slice uses the native element, so FR-007's `aria-checked` requirement is satisfied structurally |

## Keyboard behavior (FR-006)

Native `<input type="checkbox">` already toggles on Space when focused — no
custom JS required for this slice's static markup.

## Token allowlist used

`border-neutral-300`, `text-brand`, `text-neutral-900`. No raw palette classes
permitted (FR-005).

## Acceptance mapping

- FR-004, FR-005, FR-006, FR-007 → this contract
- SC-002, SC-004 → verified by `tests/e2e/checkbox.spec.ts`,
  `scripts/audit-tokens.mjs`
