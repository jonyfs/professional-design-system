# Component Contract: Slider

## Markup contract

```html
<label for="slider-volume" class="text-sm font-medium text-neutral-900">Volume</label>
<input
  type="range"
  id="slider-volume"
  min="0"
  max="100"
  step="1"
  value="60"
  class="slider mt-2 w-full"
/>
```

```css
.slider {
  @apply h-2 cursor-pointer appearance-none rounded-full bg-neutral-200
    accent-brand-dark disabled:cursor-not-allowed disabled:opacity-50;
}
.slider:focus-visible {
  @apply outline outline-2 outline-offset-2 outline-brand;
}
```

`accent-color` (via Tailwind's `accent-*` utility) styles both the thumb
and the filled portion of the track in a single, standard CSS property —
confirmed supported in all three target engines (research.md R2), avoiding
the need for parallel `::-webkit-slider-thumb`/`::-moz-range-thumb`
vendor-prefixed rules. Native `<input type="range">` provides drag,
click-to-jump, and Left/Right/Up/Down/Home/End/PageUp/PageDown keyboard
support for free.

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| focus-visible | `focus-visible:outline outline-2 outline-offset-2 outline-brand` |
| disabled | `disabled:cursor-not-allowed disabled:opacity-50` |

## Required attributes

- Real `<label for="...">` — never a placeholder-only label
- `min`/`max`/`step`/`value` native attributes

## Token allowlist used

`bg-neutral-200`, `accent-brand-dark` — identical fill/track pairing to
Progress (research.md R1, 6.38:1, same two colors). No new tokens.

## Acceptance mapping

- FR-005, SC-001, SC-002 → `tests/e2e/slider.spec.ts` (arrow keys/Home/End
  value changes asserted directly, per R8)
