# Component Contract: Stepper

## Markup contract

```html
<ol class="stepper" aria-label="Checkout progress">
  <li class="stepper-step stepper-step-completed">
    <span class="stepper-circle" aria-hidden="true">✓</span>
    <span class="text-sm font-medium text-neutral-900">Cart</span>
  </li>
  <li class="stepper-step stepper-step-current" aria-current="step">
    <span class="stepper-circle">2</span>
    <span class="text-sm font-semibold text-neutral-900">Shipping</span>
  </li>
  <li class="stepper-step stepper-step-upcoming">
    <span class="stepper-circle" aria-hidden="true">3</span>
    <span class="text-sm font-medium text-neutral-600">Payment</span>
  </li>
</ol>
```

```css
.stepper {
  @apply flex items-center gap-2;
}
.stepper-step {
  @apply flex flex-1 items-center gap-2;
}
.stepper-step:not(:last-child)::after {
  content: "";
  @apply h-0.5 flex-1 bg-neutral-200;
}
.stepper-step-completed::after {
  @apply bg-brand-dark;
}
.stepper-circle {
  @apply flex h-8 w-8 shrink-0 items-center justify-center rounded-full
    bg-neutral-200 text-sm font-semibold text-neutral-600;
}
.stepper-step-completed .stepper-circle,
.stepper-step-current .stepper-circle {
  @apply bg-brand-dark text-white;
}
```

Reuses Pagination's `bg-brand-dark text-white` current/active-item pairing
verbatim (research.md R7, 7.90:1). The connector line
(`border`/`bg-neutral-200` for upcoming, `bg-brand-dark` for completed) is
purely decorative — the step's own circle/glyph and color already
communicate status — matching this catalog's existing accepted
low-contrast-decorative-border exception (Card/Divider/List), not a new
1.4.11 gap (research.md R7).

## Required classes (Principle V gate)

Non-interactive/presentational in this feature (research.md, spec.md
Assumptions) — no hover/focus-visible/disabled states apply; a future
click-to-navigate enhancement would need them.

## Required attributes

- `aria-current="step"` on the current step (not `"page"` — a step is not
  a page)
- `aria-hidden="true"` on decorative glyphs (checkmark, step number) where
  the adjacent text label already conveys the same meaning

## Token allowlist used

`bg-neutral-200`, `bg-brand-dark`, `text-white`, `text-neutral-600`,
`text-neutral-900` — all already-ratified. No new tokens.

## Acceptance mapping

- FR-006, SC-001 → `tests/e2e/stepper.spec.ts`
