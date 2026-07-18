# Contract: RangeSlider

## `src/styles/tailwind.css` additions

```css
@layer components {
  .range-slider {
    @apply pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2
      appearance-none bg-transparent
      [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto;
  }
  .range-slider-track {
    @apply relative h-1 w-full rounded-full bg-neutral-200;
  }
}
```

## `src/scripts/range-slider.js`

```js
// Feature 039 (research.md R1/R2) — two overlapping native
// <input type="range"> elements (no true cross-browser dual-thumb
// native control exists, per feature 018 research.md's own open
// question); the clamping logic below is the one genuinely new
// piece, reusing Slider's exact `accent-color`-styled native input
// otherwise.
export function initRangeSliders() {
  document.querySelectorAll("[data-range-slider]").forEach((container) => {
    const lowInput = container.querySelector("[data-range-slider-low]");
    const highInput = container.querySelector("[data-range-slider-high]");
    if (!lowInput || !highInput) return;

    lowInput.addEventListener("input", () => {
      if (Number(lowInput.value) > Number(highInput.value)) {
        lowInput.value = highInput.value; // clamp, never cross
      }
      lowInput.dispatchEvent(new CustomEvent("range-slider-change", { bubbles: true }));
    });
    highInput.addEventListener("input", () => {
      if (Number(highInput.value) < Number(lowInput.value)) {
        highInput.value = lowInput.value; // clamp, never cross
      }
      highInput.dispatchEvent(new CustomEvent("range-slider-change", { bubbles: true }));
    });
  });
}
```

## Static HTML usage

```html
<div data-range-slider data-testid="range-slider-demo" class="relative h-1 w-full">
  <div class="range-slider-track"></div>
  <input
    data-range-slider-low
    class="range-slider"
    type="range"
    min="0"
    max="100"
    value="20"
    aria-label="Minimum price"
  />
  <input
    data-range-slider-high
    class="range-slider"
    type="range"
    min="0"
    max="100"
    value="80"
    aria-label="Maximum price"
  />
</div>
```

## React wrapper shape

```tsx
export interface RangeSliderProps {
  min: number;
  max: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
  "data-testid"?: string;
}
export function RangeSlider({ min, max, low, high, onChange, "data-testid": testId }: RangeSliderProps) {
  return (
    <div data-testid={testId} className="relative h-1 w-full">
      <div className="range-slider-track" />
      <input
        className="range-slider"
        type="range"
        min={min}
        max={max}
        value={low}
        aria-label="Minimum"
        onChange={(e) => onChange(Math.min(Number(e.target.value), high), high)}
      />
      <input
        className="range-slider"
        type="range"
        min={min}
        max={max}
        value={high}
        aria-label="Maximum"
        onChange={(e) => onChange(low, Math.max(Number(e.target.value), low))}
      />
    </div>
  );
}
```

## Acceptance mapping

- FR-008, spec.md US3 Acceptance Scenario 3 → the `Math.min`/`Math.max` clamp in both surfaces' change handlers, each handle independently focusable/keyboard-operable via the native range input's own built-in Arrow-key behavior
- spec.md Edge Case (zero room between handles) → both `<input type="range">` elements remain independently focusable regardless of visual overlap, since focus targets the underlying native element, not a derived visual position
