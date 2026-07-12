# Component Contract: Progress

## Markup contract

```html
<div class="w-full">
  <span class="sr-only" id="prog-label">Upload progress</span>
  <div
    role="progressbar"
    aria-labelledby="prog-label"
    aria-valuenow="60"
    aria-valuemin="0"
    aria-valuemax="100"
    class="progress-track"
  >
    <div class="progress-fill" style="width: 60%"></div>
  </div>
</div>
```

Indeterminate variant (edge case): omit `aria-valuenow`, add
`.progress-fill-indeterminate` (a looping `translate-x` sweep, gated by
`motion-reduce:animate-none` per R7's precedent).

```css
.progress-track {
  @apply h-2 w-full overflow-hidden rounded-full bg-neutral-200;
}
.progress-fill {
  @apply h-full rounded-full bg-brand-dark transition-[width] duration-300;
}
```

## Required classes (Principle V gate)

Non-interactive/read-only — no hover/focus/disabled states apply. The one
required behavior is the `transition-[width]` on value change.

## Required attributes

- `role="progressbar"`
- `aria-valuenow`/`aria-valuemin`/`aria-valuemax` (omit `aria-valuenow` only
  for the indeterminate state)
- `aria-labelledby` or `aria-label` — an accessible name is required

## Token allowlist used

`bg-neutral-200` (track), `bg-brand-dark` (fill) — verified 6.38:1 against
WCAG 1.4.11's 3:1 non-text floor (R1). No new tokens.

## Acceptance mapping

- FR-006, SC-004 → `tests/e2e/progress.spec.ts` + `scripts/check-contrast.mjs`
