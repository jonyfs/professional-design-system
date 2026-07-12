# Component Contract: DataList

## Markup contract

```html
<dl class="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
  <div>
    <dt class="text-sm font-medium text-neutral-900">Status</dt>
    <dd class="mt-1 text-sm text-neutral-600">Active</dd>
  </div>
  <div>
    <dt class="text-sm font-medium text-neutral-900">Created</dt>
    <dd class="mt-1 text-sm text-neutral-600">Jan 12, 2024</dd>
  </div>
</dl>
```

**No new CSS class** (R5) — real semantic `<dl>`/`<dt>`/`<dd>`, styled with
the same `text-sm font-medium text-neutral-900` (label) /
`text-sm text-neutral-600` (value) pairing already used throughout Forms
and Empty State. `<dt>`/`<dd>` natively associate each term with its
description for assistive technology — no ARIA needed.

## Required classes (Principle V gate)

Non-interactive — no state suffixes apply.

## Required attributes

- Real `<dl>`/`<dt>`/`<dd>` elements (never a styled `<div>` grid standing
  in for them)

## Token allowlist used

`text-neutral-900`, `text-neutral-600` — already-ratified, reused
verbatim. No new tokens.

## Acceptance mapping

- FR-004, SC-001 → `tests/e2e/data-list.spec.ts`
