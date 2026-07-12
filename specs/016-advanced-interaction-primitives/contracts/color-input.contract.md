# Component Contract: ColorPicker/ColorInput

## Markup contract

```html
<label for="color-accent" class="text-sm font-medium text-neutral-900">Accent color</label>
<input
  type="color"
  id="color-accent"
  value="#004BB3"
  class="color-input mt-2"
/>
```

```css
.color-input {
  @apply h-10 w-16 cursor-pointer appearance-none rounded-md border-0 p-1
    shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2
    focus:ring-inset focus:ring-brand disabled:cursor-not-allowed
    disabled:opacity-50;
}
```

Native `<input type="color">` — zero JavaScript. `border`/`border-radius`/
`box-shadow` (the CSS property Tailwind's `ring`/`shadow` utilities compile
to) apply to the input's own box across all three target engines, but
`appearance-none` is REQUIRED for `box-shadow` (the `ring`/`shadow-sm`
utilities) to actually render — a `/speckit-implement` finding: an
isolated inline-`style` test computed `box-shadow` correctly without it,
but a real class-based rule was silently suppressed by the element's
default `appearance: auto` swatch-box rendering until `appearance-none`
was added (research.md R4). Explicit `h-10 w-16` normalizes each engine's
differing default intrinsic size (Chromium 50×27, Firefox 64×32, WebKit
44×23 — confirmed, not assumed identical). The internal color-swatch
preview graphic itself is NOT further stylable beyond the outer box in
any engine — an accepted OS-chrome limitation, the same class of accepted
limitation as File Input's native file-picker dialog (feature 015).
WebKit additionally excludes this input type from the natural Tab
sequence entirely (confirmed on a bare, unstyled element, ruling out any
CSS/markup cause) — an accepted engine limitation, not a defect; the
element still accepts focus via `.focus()` or a real click.

**Rejected alternative**: a custom JS-driven color-swatch grid/picker —
explicitly rejected (research.md R4) since the native element already
provides a full OS-level picker UI, complete keyboard operability, and a
real hex `value`, at zero JavaScript and zero additional accessibility
surface to get wrong.

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| focus | `focus:ring-2 focus:ring-inset focus:ring-brand` |
| disabled | `disabled:cursor-not-allowed disabled:opacity-50` |

## Required attributes

- Real `<label for="...">` referencing the native input's `id`
- `value` as a valid 7-character hex color string

## Token allowlist used

`ring-neutral-300`, `ring-brand`, `text-neutral-900` — identical to
TextInput's/PinInput's existing ratified pattern. No new tokens.

## Acceptance mapping

- FR-007, SC-001 → `tests/e2e/color-input.spec.ts`
