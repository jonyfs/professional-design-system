# Contract: BackgroundImage, Watermark

Both need a dynamically-computed `background-image` value (a
caller-supplied image URL / a generated SVG data URI for the
watermark text) — this project's CSP (`style-src 'self'`) blocks
inline `style="..."` attributes, so both are set via direct CSSOM
`element.style.backgroundImage` assignment (the same pattern
`progress.js` already established for dynamically-computed values),
never a literal `style="background-image:..."` in markup.

**CSP note, verified against real precedent, not this template's
generic default**: Watermark's SVG data URI (and any `data:`-sourced
background image) needs the `img-src 'self' data:;` CSP directive —
the generic per-page template omits `img-src` entirely, which falls
back to `default-src 'self'` and blocks `data:` sources. Grepping this
catalog's existing pages found the exact precedent already in use
(Avatar, Card, List, Aspect Ratio all ship
`img-src 'self' data:;` in their CSP `<meta>` tag) — both
`background-image.html` and `watermark.html` use that same variant,
not the plain default template.

## `src/styles/tailwind.css` additions

```css
@layer components {
  .background-image-container {
    @apply relative overflow-hidden rounded-lg bg-neutral-200 bg-cover bg-center;
  }
  .background-image-scrim {
    @apply absolute inset-0 bg-neutral-900/50;
  }
  .background-image-content {
    @apply relative z-10 p-6 text-white;
  }

  .watermark-container {
    @apply relative overflow-hidden;
  }
  .watermark-layer {
    @apply pointer-events-none absolute inset-0 z-0 bg-repeat;
  }
  .watermark-content {
    @apply relative z-10;
  }
}
```

## `src/scripts/background-image.js`

```js
// Feature 033 (research.md R4) — CSSOM background-image assignment,
// not a literal style="..." attribute (this project's CSP). The
// bg-neutral-200 fallback in .background-image-container is the CSS
// background-color underneath, so a failed/missing image still shows
// a neutral surface (spec.md Edge Case), never a transparent gap.
export function initBackgroundImages() {
  document.querySelectorAll("[data-background-image-src]").forEach((el) => {
    el.style.backgroundImage = `url(${el.dataset.backgroundImageSrc})`;
  });
}
```

## `src/scripts/watermark.js`

```js
// Feature 033 (research.md R5) — a pure CSS repeating-background
// technique: an SVG data URI containing the caller's text, tiled via
// background-repeat, set through the identical CSSOM pattern as
// background-image.js. No canvas, no watermark library dependency.
export function initWatermarks() {
  document.querySelectorAll("[data-watermark-text]").forEach((container) => {
    const layer = container.querySelector("[data-watermark-layer]");
    if (!layer) return;
    const text = container.dataset.watermarkText;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">
      <text x="10" y="60" transform="rotate(-30 100 50)" font-size="16" fill="rgb(156 163 175 / 0.35)" font-family="sans-serif">${text}</text>
    </svg>`;
    layer.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  });
}
```

## Static HTML usage

### BackgroundImage

```html
<div data-background-image-src="/some-image.jpg" data-testid="background-image-demo" class="background-image-container h-48 w-full max-w-md">
  <div class="background-image-scrim"></div>
  <div class="background-image-content">
    <h2 class="text-lg font-semibold">Overlaid content</h2>
    <p class="mt-1 text-sm">Legible against the image via the scrim.</p>
  </div>
</div>
```

### Watermark

```html
<div data-watermark-text="CONFIDENTIAL" data-testid="watermark-demo" class="watermark-container rounded-lg border border-neutral-200 p-6">
  <div data-watermark-layer data-testid="watermark-layer" class="watermark-layer"></div>
  <div class="watermark-content">
    <p class="text-sm text-neutral-900">This document contains sensitive information.</p>
  </div>
</div>
```

## React wrapper shape

```tsx
import { useEffect, useRef, type ReactNode } from "react";

export interface BackgroundImageProps {
  src: string;
  children: ReactNode;
  "data-testid"?: string;
}
export function BackgroundImage({ src, children, "data-testid": testId }: BackgroundImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.style.backgroundImage = `url(${src})`;
  }, [src]);

  return (
    <div ref={ref} data-testid={testId} className="background-image-container h-48 w-full max-w-md">
      <div className="background-image-scrim" />
      <div className="background-image-content">{children}</div>
    </div>
  );
}

export interface WatermarkProps {
  text: string;
  children: ReactNode;
  "data-testid"?: string;
}
export function Watermark({ text, children, "data-testid": testId }: WatermarkProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!layerRef.current) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">
      <text x="10" y="60" transform="rotate(-30 100 50)" font-size="16" fill="rgb(156 163 175 / 0.35)" font-family="sans-serif">${text}</text>
    </svg>`;
    layerRef.current.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [text]);

  return (
    <div data-testid={testId} className="watermark-container">
      <div ref={layerRef} className="watermark-layer" />
      <div className="watermark-content">{children}</div>
    </div>
  );
}
```

## Acceptance mapping

- FR-003, spec.md US2 Acceptance Scenario 2 → BackgroundImage markup/scripts above
- FR-004, spec.md US3 Acceptance Scenario 1 → Watermark markup/scripts above
- spec.md Edge Case (image fails to load) → `.background-image-container`'s `bg-neutral-200` fallback
- spec.md Edge Case (short content region) → the watermark layer simply renders whatever portion of the tile fits, no error path needed
