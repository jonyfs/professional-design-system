# Component Contract: Textarea

## Markup contract

```html
<label class="block">
  <span class="block text-sm font-medium text-neutral-900">Description</span>
  <textarea
    rows="4"
    class="mt-1 block w-full resize-y rounded-md border-0 py-1.5
           text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300
           placeholder:text-neutral-400 focus:ring-2 focus:ring-inset
           focus:ring-brand sm:text-sm sm:leading-6"
  ></textarea>
</label>
```

Identical ratified pattern to Text inputs/selects (constitution's "Forms,
Validation & Inputs" entry) — the only difference is the element and
`resize-y` (never bare `resize`, which permits horizontal resize and breaks
responsive layouts).

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| focus | `focus:ring-2 focus:ring-inset focus:ring-brand` |
| disabled | `disabled:opacity-50 disabled:cursor-not-allowed` (add to the shared pattern, matching TextInput) |
| error | parent adds `ring-error focus:ring-error`; inline message uses `text-xs text-error-strong mt-1 font-medium` |

## Required attributes

- Real `<label>` wrapping (or `for`/`id` pairing) — never a placeholder-only label
- `rows` attribute for a sensible default height (4)
- `aria-invalid="true"` when an error is present

## Token allowlist used

Identical to TextInput's existing allowlist: `text-neutral-900`,
`ring-neutral-300`, `ring-brand`, `text-error-strong`, `ring-error`. No new
tokens.

## Acceptance mapping

- FR-001, SC-001, SC-002 → `tests/e2e/textarea.spec.ts`
- Closes the "documented but never shipped" gap (spec Assumptions)
