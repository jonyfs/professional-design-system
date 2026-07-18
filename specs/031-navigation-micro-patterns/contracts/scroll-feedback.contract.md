# Contract: Back-to-Top Button, Scroll Progress Bar

## `src/scripts/scroll-feedback.js`

```js
// Feature 031 (research.md R2/R3) — one shared, rAF-throttled scroll
// listener drives both primitives, avoiding two independent scroll
// handlers on the same page (this project's performance rules warn
// against scroll-handler churn). Back-to-Top's threshold logic is
// scoped to what it itself needs — NOT a standalone, separately
// reusable "Affix" primitive (a different inventory category).
const THRESHOLD = 400;
let ticking = false;

function computeScrollPercent() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) return 0; // no scrollable content — never NaN/negative
  return Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100));
}

export function initScrollFeedback() {
  const backToTop = document.getElementById("back-to-top");
  const progressFill = document.getElementById("scroll-progress-fill");
  if (!backToTop && !progressFill) return;

  function render() {
    if (backToTop) {
      backToTop.style.display = window.scrollY > THRESHOLD ? "" : "none";
    }
    if (progressFill) {
      // CSSOM assignment (this project's CSP), same pattern as progress.js.
      progressFill.style.width = `${computeScrollPercent()}%`;
    }
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(render);
      ticking = true;
    }
  }, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  render(); // correct initial state, not just after the first scroll event
}
```

## Static HTML usage

```html
<div id="scroll-progress-track" data-testid="scroll-progress-track" class="progress-track fixed top-0 left-0 right-0 z-50 h-1 rounded-none">
  <div id="scroll-progress-fill" data-testid="scroll-progress-fill" class="progress-fill"></div>
</div>

<button
  type="button"
  id="back-to-top"
  data-testid="back-to-top"
  aria-label="Back to top"
  class="btn-primary fixed bottom-6 right-6 z-50 rounded-full p-3"
>
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
    <path fill-rule="evenodd" d="M10 3a.75.75 0 01.53.22l6 6a.75.75 0 01-1.06 1.06L10.75 5.56V16.5a.75.75 0 01-1.5 0V5.56L4.53 10.28a.75.75 0 01-1.06-1.06l6-6A.75.75 0 0110 3z" clip-rule="evenodd" />
  </svg>
</button>
```

Note: `rounded-none` is NOT in this catalog's `borderRadius` allowlist
(feature 030's own audit finding, `shared/design-tokens.ts` only
ratifies `sm`/`md`/`lg`/`full`) — the scroll progress track uses `h-1`
(a thin bar) where the corner radius is visually negligible regardless,
so this demo omits any radius utility instead of fighting the
allowlist.

## React wrapper shape

```tsx
import { useEffect, useState } from "react";

const THRESHOLD = 400;

function computeScrollPercent() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) return 0;
  return Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100));
}

export interface ScrollProgressBarProps {
  "data-testid"?: string;
}
export function ScrollProgressBar({ "data-testid": testId }: ScrollProgressBarProps) {
  const [percent, setPercent] = useState(computeScrollPercent);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setPercent(computeScrollPercent());
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div data-testid={testId} className="progress-track fixed top-0 left-0 right-0 z-50 h-1">
      <div className="progress-fill" style={{ width: `${percent}%` }} />
    </div>
  );
}

export interface BackToTopProps {
  "data-testid"?: string;
}
export function BackToTop({ "data-testid": testId }: BackToTopProps) {
  const [visible, setVisible] = useState(() => window.scrollY > THRESHOLD);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      type="button"
      data-testid={testId}
      aria-label="Back to top"
      className="btn-primary fixed bottom-6 right-6 z-50 rounded-full p-3"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l6 6a.75.75 0 01-1.06 1.06L10.75 5.56V16.5a.75.75 0 01-1.5 0V5.56L4.53 10.28a.75.75 0 01-1.06-1.06l6-6A.75.75 0 0110 3z" clipRule="evenodd" />
      </svg>
    </button>
  );
}
```

## Acceptance mapping

- FR-002, FR-003, spec.md US2 Acceptance Scenarios 1-2 → the markup/scripts above
- spec.md Edge Case (zero scrollable height) → `computeScrollPercent()`'s early `<= 0` guard
