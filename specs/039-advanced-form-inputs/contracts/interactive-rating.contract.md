# Contract: Interactive Rating (modifies existing Rating component)

## Real finding (research.md R1)

The existing `src/components/rating/rating.html` renders its star row
with `aria-hidden="true"` — decorative only, per its own code comment
("the star row is decorative reinforcement only"). The real numeric
value is conveyed via adjacent plain text. Adding a click handler on
top of this `aria-hidden` markup would NOT make it accessible — an
`aria-hidden` subtree is unavailable to assistive tech regardless of
what JavaScript is attached to it. Interactive mode therefore uses a
different, genuinely accessible markup: a native radio-group (real
`<input type="radio">` per star value), the standard CSS-only
accessible star-rating pattern, reusing this catalog's existing
Radio component's semantics rather than reinventing an ARIA widget
by hand. The pre-existing read-only markup is UNCHANGED and remains
the default (`interactive: false`); this is purely an additive mode,
not a breaking change to the shipped Rating component.

## `src/styles/tailwind.css` additions

```css
@layer components {
  .rating-interactive {
    @apply flex flex-row-reverse gap-1;
  }
  .rating-interactive-input {
    @apply peer sr-only;
  }
  .rating-interactive-star {
    @apply h-6 w-6 cursor-pointer text-neutral-300 hover:text-brand-light
      peer-checked:text-brand peer-focus-visible:outline
      peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2
      peer-focus-visible:outline-brand;
  }
  /* `flex-row-reverse` + the general sibling combinator is the
     standard CSS-only "fill this star and every star before it in
     visual order" trick: checking star N (DOM-order last-to-first)
     visually fills every star from the row's start up to N, since
     each label only needs to react to ITS OWN preceding input being
     checked OR any input still earlier in DOM order (rendered later
     visually, in row-reverse) being checked. Resolved via a plain
     CSS combinator (Principle III's `@layer` escape hatch), not
     expressible as a bare Tailwind utility class. Verified against a
     live browser render during implementation, not assumed correct
     from the selector text alone.
  */
  .rating-interactive-input:checked ~ .rating-interactive-input ~ .rating-interactive-star,
  .rating-interactive-input:checked ~ .rating-interactive-star {
    @apply text-brand;
  }
}
```

## Markup addition to `src/components/rating/rating.html`

```html
<div data-testid="rating-interactive-demo" class="mt-8">
  <p class="text-sm font-medium text-neutral-900" id="rating-interactive-label">Rate this product</p>
  <div
    role="radiogroup"
    aria-labelledby="rating-interactive-label"
    class="rating-interactive"
    data-rating-interactive
    data-max="5"
  >
    <input type="radio" name="rating-interactive" value="5" id="ri-5" class="rating-interactive-input" />
    <label for="ri-5" class="rating-interactive-star" aria-label="5 stars">★</label>
    <input type="radio" name="rating-interactive" value="4" id="ri-4" class="rating-interactive-input" />
    <label for="ri-4" class="rating-interactive-star" aria-label="4 stars">★</label>
    <input type="radio" name="rating-interactive" value="3" id="ri-3" class="rating-interactive-input" />
    <label for="ri-3" class="rating-interactive-star" aria-label="3 stars">★</label>
    <input type="radio" name="rating-interactive" value="2" id="ri-2" class="rating-interactive-input" />
    <label for="ri-2" class="rating-interactive-star" aria-label="2 stars">★</label>
    <input type="radio" name="rating-interactive" value="1" id="ri-1" class="rating-interactive-input" />
    <label for="ri-1" class="rating-interactive-star" aria-label="1 star">★</label>
  </div>
</div>
```

No JavaScript is required for click-to-rate or Arrow-key navigation:
native radio groups already provide Arrow Left/Right (and Up/Down)
navigation between same-`name` radios, and label/input pairing already
provides click-to-select — this is a CSS + native-semantics-only
component, matching Slider's and FloatLabel's zero-JS discipline.

## React wrapper shape

```tsx
export interface RatingProps {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  "data-testid"?: string;
}
export function Rating({ value, max = 5, interactive = false, onChange, "data-testid": testId }: RatingProps) {
  if (!interactive) {
    // Unchanged pre-existing read-only rendering (aria-hidden stars + visible text value).
    return (
      <div className="rating" data-testid={testId}>
        <span className="rating-stars" aria-hidden="true">
          {Array.from({ length: max }, (_, i) => (
            <StarIcon key={i} filled={i < Math.round(value)} />
          ))}
        </span>
        <span className="rating-value">
          {value} out of {max}
        </span>
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={`Rate this ${max === 5 ? "product" : "item"}`}
      className="rating-interactive"
      data-testid={testId}
    >
      {Array.from({ length: max }, (_, i) => max - i).map((star) => (
        <label key={star} className="rating-interactive-star">
          <input
            type="radio"
            name={`rating-${testId}`}
            className="rating-interactive-input"
            checked={value === star}
            onChange={() => onChange?.(star)}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
          />
          ★
        </label>
      ))}
    </div>
  );
}
```

## Acceptance mapping

- FR-010, spec.md US4 Acceptance Scenarios 3-4 → native `<input type="radio">` group provides click-to-select and Arrow-key value changes with zero custom JavaScript; `checked` state is the single source of truth for the current value
- Edge Case (reduced motion / screen reader) → `role="radiogroup"` + per-star `aria-label` is announced by every screen reader as a real form control, not a decorative overlay; no motion-dependent feedback is used at all (a solid color-fill state change, not an animation)
