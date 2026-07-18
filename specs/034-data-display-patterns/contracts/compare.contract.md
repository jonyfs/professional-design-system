# Contract: Compare

The divider is a native `<input type="range">` — this catalog's exact
existing `.slider` component (feature 002) — layered transparently
over the image area; keyboard operability (arrow keys, Home/End) and
0-100% clamping come from the native input, not custom logic
(research.md R5).

## `src/styles/tailwind.css` additions

```css
@layer components {
  .compare-container {
    @apply relative overflow-hidden rounded-lg select-none;
  }
  .compare-image {
    @apply block h-full w-full object-cover;
  }
  .compare-after-wrapper {
    @apply absolute inset-0 overflow-hidden;
  }
  .compare-divider-line {
    @apply pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-md;
  }
  .compare-slider {
    @apply absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0;
  }
}
```

## `src/scripts/compare.js`

```js
// Feature 034 (research.md R5) — CSSOM clip-path/left assignment
// (this project's CSP), driven by a native range input's value. The
// range input itself provides keyboard operability and 0-100%
// clamping natively — no custom drag/keyboard logic is written here.
export function initCompares() {
  document.querySelectorAll("[data-compare]").forEach((container) => {
    const slider = container.querySelector("[data-compare-slider]");
    const afterWrapper = container.querySelector("[data-compare-after-wrapper]");
    const dividerLine = container.querySelector("[data-compare-divider-line]");
    if (!slider || !afterWrapper) return;

    function render() {
      const value = Number(slider.value);
      afterWrapper.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
      if (dividerLine) dividerLine.style.left = `${value}%`;
    }

    slider.addEventListener("input", render);
    render();
  });
}
```

## Static HTML usage

```html
<div data-compare data-testid="compare-demo" class="compare-container mt-8 h-64 w-full max-w-md">
  <img src="/before.jpg" alt="Before" class="compare-image" />
  <div data-compare-after-wrapper data-testid="compare-after-wrapper" class="compare-after-wrapper">
    <img src="/after.jpg" alt="After" class="compare-image" />
  </div>
  <div data-compare-divider-line data-testid="compare-divider-line" class="compare-divider-line" aria-hidden="true"></div>
  <input
    type="range"
    data-compare-slider
    data-testid="compare-slider"
    min="0"
    max="100"
    value="50"
    aria-label="Comparison position"
    class="compare-slider slider"
  />
</div>
```

## React wrapper shape

```tsx
import { useEffect, useRef, useState } from "react";

export interface CompareProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  "data-testid"?: string;
}
export function Compare({ beforeSrc, afterSrc, beforeAlt, afterAlt, "data-testid": testId }: CompareProps) {
  const [position, setPosition] = useState(50);

  return (
    <div data-testid={testId} className="compare-container mt-8 h-64 w-full max-w-md">
      <img src={beforeSrc} alt={beforeAlt} className="compare-image" />
      <div className="compare-after-wrapper" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={afterSrc} alt={afterAlt} className="compare-image" />
      </div>
      <div className="compare-divider-line" style={{ left: `${position}%` }} aria-hidden="true" />
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        aria-label="Comparison position"
        className="compare-slider slider"
        onChange={(e) => setPosition(Number(e.target.value))}
      />
    </div>
  );
}
```

Note: React's `style` prop compiles to a direct DOM property
assignment, not a literal `style="..."` HTML attribute — so it isn't
subject to this project's static-HTML CSP restriction (the same
distinction documented for Password Strength Meter, feature 029).

## Acceptance mapping

- FR-005, spec.md US3 Acceptance Scenario 2 → the markup/scripts above
- spec.md Edge Case (divider dragged past either edge) → native `<input type="range">` clamps to `min`/`max` (0/100) itself
