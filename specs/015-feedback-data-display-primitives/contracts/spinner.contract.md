# Component Contract: Spinner

## Markup contract

```html
<svg
  class="spinner spinner-lg motion-reduce:animate-none"
  role="status"
  aria-label="Loading"
  viewBox="0 0 24 24"
  fill="none"
>
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
</svg>
```

```css
.spinner {
  @apply animate-spin text-brand-dark;
}
.spinner-sm {
  @apply h-8 w-8;
}
.spinner-lg {
  @apply h-10 w-10;
}
```

Reuses Skeleton's `motion-reduce:` precedent (feature 014) for the same
class of continuous/looping animation.

## Required classes (Principle V gate)

Non-interactive — no state suffixes apply. `motion-reduce:animate-none` is
the one required behavior.

## Required attributes

- `role="status"` + `aria-label` (or `aria-labelledby`) — no visible text
  label competes for space, but assistive technology still announces the
  loading state

## Token allowlist used

`text-brand-dark`. No new tokens.

## Acceptance mapping

- FR-001, SC-001 → `tests/e2e/spinner.spec.ts`
