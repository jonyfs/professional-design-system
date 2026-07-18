# Contract: RollingNumber

No new CSS — this is a pure text-content animation, no visual
mechanism beyond existing typography.

## `src/scripts/rolling-number.js`

```js
// Feature 034 (research.md R2) — applies this catalog's established
// rAF-throttle pattern (Scroll Progress Bar/Affix, features 031/032)
// to a numeric tween instead of a scroll-gated callback. A new
// animation always cancels any in-flight one first (spec.md Edge
// Case: rapid successive value changes must not stack/queue).
const DURATION_MS = 400;

export function initRollingNumbers() {
  document.querySelectorAll("[data-rolling-number]").forEach((el) => {
    let currentValue = Number(el.dataset.rollingNumber) || 0;
    let animationFrameId = null;
    el.textContent = currentValue.toLocaleString();

    function animateTo(target) {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      const start = currentValue;
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min(1, (now - startTime) / DURATION_MS);
        currentValue = Math.round(start + (target - start) * progress);
        el.textContent = currentValue.toLocaleString();
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          animationFrameId = null;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    }

    // Exposed for the demo page's own trigger buttons.
    el._rollingNumberSetValue = animateTo;
  });
}
```

## Static HTML usage

```html
<p class="text-3xl font-bold text-neutral-900" data-rolling-number="1204" data-testid="rolling-number-demo" aria-live="polite">1,204</p>
<button type="button" data-testid="rolling-number-increment" class="btn-secondary mt-2">+500</button>
```

Demo wiring (in the page's own script, not the primitive itself):

```js
const el = document.querySelector("[data-rolling-number]");
document.querySelector("[data-testid='rolling-number-increment']").addEventListener("click", () => {
  el._rollingNumberSetValue(Number(el.dataset.rollingNumber) + 500);
  el.dataset.rollingNumber = String(Number(el.dataset.rollingNumber) + 500);
});
```

## React wrapper shape

```tsx
import { useEffect, useRef, useState } from "react";

const DURATION_MS = 400;

export interface RollingNumberProps {
  value: number;
  "data-testid"?: string;
}
export function RollingNumber({ value, "data-testid": testId }: RollingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationFrameId = useRef<number | null>(null);
  const currentValue = useRef(value);

  useEffect(() => {
    if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
    const start = currentValue.current;
    const startTime = performance.now();

    function step(now: number) {
      const progress = Math.min(1, (now - startTime) / DURATION_MS);
      const next = Math.round(start + (value - start) * progress);
      currentValue.current = next;
      setDisplayValue(next);
      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(step);
      } else {
        animationFrameId.current = null;
      }
    }
    animationFrameId.current = requestAnimationFrame(step);
    return () => {
      if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
    };
  }, [value]);

  return (
    <span data-testid={testId} aria-live="polite">
      {displayValue.toLocaleString()}
    </span>
  );
}
```

## Acceptance mapping

- FR-002, spec.md US2 Acceptance Scenario 1 → the script/component above
- spec.md Edge Case (rapid successive value changes) → `cancelAnimationFrame` before starting a new tween, both surfaces
