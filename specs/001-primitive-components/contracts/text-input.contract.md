# Component Contract: Text Input

## Markup contract (default/focus)

```html
<div class="space-y-1">
  <label for="example-input" class="text-sm font-medium text-neutral-900">
    Label
  </label>
  <input
    id="example-input"
    type="text"
    class="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm
           ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400
           focus:ring-2 focus:ring-inset focus:ring-brand
           sm:text-sm sm:leading-6"
    placeholder="Placeholder text"
  />
</div>
```

## Markup contract (error state)

```html
<div class="space-y-1">
  <label for="example-input-error" class="text-sm font-medium text-neutral-900">
    Label
  </label>
  <input
    id="example-input-error"
    type="text"
    aria-invalid="true"
    aria-describedby="example-input-error-message"
    class="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm
           ring-1 ring-inset ring-error focus:ring-2 focus:ring-inset
           focus:ring-error sm:text-sm sm:leading-6"
  />
  <p id="example-input-error-message" class="text-xs text-error-strong mt-1 font-medium">
    Error message text
  </p>
</div>
```

**AAA note**: the error message text uses `text-error-strong` (#991B1B, 8.31:1
on white), not the base `text-error` (#EF4444, 3.76:1 on white — fails AAA).
Found during `/speckit-analyze` and fixed via the same constitution amendment
(v1.3.0) that added the Badge `-strong` tokens. The input's `ring-error` stays
as the base token since a focus/validation ring is a non-text UI-boundary use.

## Required attributes (Principle II gate)

| State | Required attribute/class |
|---|---|
| error | `aria-invalid="true"`, `aria-describedby` pointing at the error message id, `ring-error` (ring), `text-error-strong` (message text) |
| focus | `focus:ring-2 focus:ring-inset focus:ring-brand` (or `focus:ring-error` in error state) |
| disabled | native `disabled` attribute + `disabled:opacity-50 disabled:cursor-not-allowed` |

## Token allowlist used

`text-neutral-900`, `ring-neutral-300`, `placeholder:text-neutral-400`,
`ring-brand`, `ring-error`, `text-error-strong`. No raw palette classes
permitted (FR-005).

## Acceptance mapping

- FR-002, FR-005, FR-006, FR-007 → this contract
- SC-001, SC-002 (focus/error distinctness), SC-003, SC-004 → verified by
  `tests/e2e/text-input.spec.ts`, `scripts/check-contrast.mjs`,
  `scripts/audit-tokens.mjs`
