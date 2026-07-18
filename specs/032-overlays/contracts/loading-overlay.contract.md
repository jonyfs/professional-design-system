# Contract: LoadingOverlay

## `src/styles/tailwind.css` additions

```css
@layer components {
  .loading-overlay-container {
    @apply relative;
  }
  .loading-overlay {
    @apply absolute inset-0 z-10 flex items-center justify-center bg-neutral-50/75;
  }
}
```

## `src/scripts/loading-overlay.js`

```js
// Feature 032 (research.md R3) — reuses Spinner's exact markup inside
// a container-scoped overlay. The visual block comes for free from DOM
// stacking (no pointer-events trick needed); aria-busy is the explicit
// accessible signal a screen reader user needs, since navigating by
// DOM order would otherwise still reach the underlying content.
//
// Real bug found by running this against a live browser, not assumed
// clean — same root cause as feature 030's Offline Banner: `.loading-
// overlay`'s `@apply flex` gives it an author-origin `display: flex`
// declaration that the CSS cascade lets win over the browser's
// UA-origin `[hidden] { display: none }` default. Fixed via direct
// CSSOM `style.display` assignment (the same pattern `progress.js`/
// `offline-banner.js` already use).
export function initLoadingOverlay() {
  document.querySelectorAll("[data-loading-toggle]").forEach((toggle) => {
    const container = document.getElementById(toggle.dataset.loadingToggle);
    if (!container) return;
    const overlay = container.querySelector("[data-loading-overlay]");
    if (!overlay) return;

    function render() {
      overlay.style.display = container.getAttribute("aria-busy") === "true" ? "" : "none";
    }

    toggle.addEventListener("click", () => {
      const isLoading = container.getAttribute("aria-busy") === "true";
      container.setAttribute("aria-busy", String(!isLoading));
      render();
    });

    render(); // correct initial state from the container's own aria-busy
  });
}
```

## Static HTML usage

```html
<button type="button" data-loading-toggle="loading-overlay-demo" data-testid="loading-overlay-toggle" class="btn-secondary">
  Toggle loading
</button>

<div id="loading-overlay-demo" data-testid="loading-overlay-container" aria-busy="false" class="loading-overlay-container mt-4 rounded-lg border border-neutral-200 p-6">
  <p class="text-sm text-neutral-900">Table content goes here.</p>
  <div data-loading-overlay data-testid="loading-overlay" role="status" class="loading-overlay">
    <span class="sr-only">Loading</span>
    <svg class="spinner spinner-lg motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  </div>
</div>
```

Correction, found by actually running this against a live browser (an
earlier draft of this contract assumed `hidden` was safe here — it was
not): `.loading-overlay` DOES carry the identical `@apply flex`
declaration that caused feature 030's Offline Banner bug — the same
collision, the same fix (direct CSSOM `style.display` assignment
above, not the `hidden` IDL property/attribute).

## React wrapper shape

```tsx
import { useState, type ReactNode } from "react";

export interface LoadingOverlayProps {
  children: ReactNode;
  isLoading: boolean;
  "data-testid"?: string;
}
export function LoadingOverlay({ children, isLoading, "data-testid": testId }: LoadingOverlayProps) {
  return (
    <div className="loading-overlay-container" aria-busy={isLoading} data-testid={testId}>
      {children}
      {isLoading && (
        <div role="status" className="loading-overlay">
          <span className="sr-only">Loading</span>
          <svg className="spinner spinner-lg motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
    </div>
  );
}
```

## Acceptance mapping

- FR-002, spec.md US2 Acceptance Scenarios 1-2 → the markup/scripts above
- spec.md Edge Case (no explicit position context) → `.loading-overlay-container`'s own `relative` is always applied by this contract, never assumed present on the caller's markup
