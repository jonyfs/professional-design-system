# Component Contract: Indicator

## Markup contract

```html
<span class="indicator-wrapper">
  <svg aria-hidden="true" class="h-6 w-6 text-neutral-600">...</svg>
  <span class="sr-only">3 unread notifications</span>
  <span class="indicator indicator-error" aria-hidden="true">3</span>
</span>
```

```css
.indicator-wrapper {
  @apply relative inline-flex;
}
.indicator {
  @apply absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center
    justify-center rounded-full px-1 text-xs font-semibold text-white;
}
.indicator-error {
  @apply bg-error-strong;
}
.indicator-success {
  @apply bg-success-strong;
}
.indicator-warning {
  @apply bg-warning-strong;
}
.indicator-info {
  @apply bg-info-strong;
}
.indicator-neutral {
  @apply bg-neutral-700;
}
.indicator-dot {
  @apply h-2.5 w-2.5 min-w-0 p-0;
}
```

Plain `.relative`/`.absolute` positioning (R3) — no CSS Anchor Positioning
needed, since the indicator overlays its own direct parent, never a
separate top-layer element. Counts above 99 render as "99+" (truncated in
markup/at render time, not CSS-clipped) per spec.md's Edge Cases.

**Contrast correction (real defect caught before shipping, not assumed
transferable from Badge)**: Badge's own established pattern is `bg-{status}/5`
(a 5%-opacity tint) + `text-{status}-strong`, never `text-white` on the
*base* status color — the base status colors were never calibrated for
solid-fill + white-text use. Computed directly: `text-white` on the base
`bg-success`/`bg-warning`/`bg-error`/`bg-info`/`bg-neutral-500` measures
2.54:1 / 2.15:1 / 3.76:1 / 3.68:1 / 4.83:1 — all fail this project's AAA
7:1 normal-text bar, and four of five fail even AA 4.5:1. The `-strong`
variants (already ratified, calibrated specifically for text-on-color use
in Badge/Alert) instead measure 7.68:1 / 9.07:1 / 8.31:1 / 8.72:1 against
white text — all clear AAA comfortably. `neutral-700` (10.31:1) replaces
`neutral-500` for the same reason.

## Required classes (Principle V gate)

Non-interactive/decorative — no state suffixes apply.

## Required attributes

- `aria-hidden="true"` on the indicator itself — the count/status is
  supplementary visual information carried instead by the host icon's own
  accessible name
- **MUST** (not optional — a `/speckit-analyze` finding caught this as
  under-specified) — the host element's own accessible name (a
  visually-hidden sibling span, e.g. "3 unread notifications", or the
  host's own `aria-label` when it has no visible text at all) MUST
  include the count/status value whenever it's semantically meaningful
  (i.e. the `count`/`status` variant, not the plain `dot` variant, which
  carries no information beyond "something changed" and MAY use a
  simpler label like "Unread notifications" with no number). Without
  this, a screen-reader user gets zero notification-count information —
  the indicator badge itself is `aria-hidden` and carries nothing on its
  own.

## Token allowlist used

`bg-error-strong`, `bg-success-strong`, `bg-warning-strong`, `bg-info-strong`,
`bg-neutral-700`, `text-white` — the `-strong` tokens (already ratified for
Badge/Alert text) reused here for solid-fill backgrounds instead. No new
tokens; see the contrast correction above for why the base status colors
were rejected.

## Acceptance mapping

- FR-003, SC-001 → `tests/e2e/indicator.spec.ts`
