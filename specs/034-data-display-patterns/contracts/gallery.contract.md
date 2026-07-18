# Contract: Gallery

Reuses Modal's exact native `<dialog>` focus-trap mechanism verbatim
(`overlay.js`'s `initDialogTriggers()`/`wireDialogClose()`, feature
003) — only the CSS geometry (full-screen instead of centered) and
the image-cycling state are new (research.md R4).

## `src/styles/tailwind.css` additions

```css
@layer components {
  .gallery-dialog {
    @apply h-screen w-screen max-h-none max-w-none border-0 bg-neutral-900 p-0;
  }
  .gallery-dialog::backdrop {
    background-color: theme("colors.neutral.900");
  }
  .gallery-image {
    @apply mx-auto block max-h-full max-w-full object-contain;
  }
  .gallery-controls {
    @apply absolute inset-x-0 bottom-6 flex items-center justify-center gap-4;
  }
  .gallery-close {
    @apply absolute right-4 top-4;
  }
}
```

## `src/scripts/gallery.js`

```js
// Feature 034 (research.md R4) — reuses overlay.js's exact dialog
// mechanism. Wired directly (not through initDialogTriggers()'s
// generic per-trigger loop) since each thumbnail needs its own click
// handler to set the current index — but still reuses
// wireDialogClose() for backdrop-click-to-close and the WebKit
// focus-return safeguard (the same reasoning Session Timeout Modal,
// feature 030, already established for this exact situation).
// Previous/Next disable at the sequence's ends (spec.md Edge Case: a
// single-image gallery has both disabled).
//
// Real bug found by the keyboard/focus-return test failing, not
// assumed correct: an earlier draft used bare <img> elements as
// [data-gallery-thumb] triggers — an <img> has no native focusability,
// so neither keyboard activation nor wireDialogClose()'s focus-return
// (dialog._lastTrigger.focus()) worked. Triggers are real <button>s
// now, each wrapping its thumbnail <img>; alt text for the full-size
// display image is read from the thumbnail's own inner <img>, not the
// button itself (a button has no .alt property).
import { wireDialogClose } from "./overlay.js";

export function initGalleries() {
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const dialog = document.getElementById(gallery.dataset.gallery);
    if (!dialog) return;
    const thumbs = Array.from(gallery.querySelectorAll("[data-gallery-thumb]"));
    const displayImg = dialog.querySelector("[data-gallery-display]");
    const prevButton = dialog.querySelector("[data-gallery-prev]");
    const nextButton = dialog.querySelector("[data-gallery-next]");
    let currentIndex = 0;

    function render() {
      const thumb = thumbs[currentIndex];
      displayImg.src = thumb.dataset.fullSrc;
      displayImg.alt = thumb.querySelector("img")?.alt ?? "";
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === thumbs.length - 1;
    }

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        dialog._lastTrigger = thumb;
        currentIndex = index;
        render();
        dialog.showModal();
      });
    });
    prevButton?.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        render();
      }
    });
    nextButton?.addEventListener("click", () => {
      if (currentIndex < thumbs.length - 1) {
        currentIndex++;
        render();
      }
    });
    wireDialogClose(dialog);
  });
}
```

## Static HTML usage

```html
<div data-gallery="gallery-dialog" data-testid="gallery-thumbs" class="mt-8 flex gap-3">
  <button type="button" data-gallery-thumb data-full-src="/img-1-full.jpg" data-testid="gallery-thumb-0" aria-label="Open Mountain landscape fullscreen">
    <img src="/img-1-thumb.jpg" alt="Mountain landscape" class="h-20 w-20 cursor-pointer rounded-md object-cover" />
  </button>
  <button type="button" data-gallery-thumb data-full-src="/img-2-full.jpg" data-testid="gallery-thumb-1" aria-label="Open Ocean sunset fullscreen">
    <img src="/img-2-thumb.jpg" alt="Ocean sunset" class="h-20 w-20 cursor-pointer rounded-md object-cover" />
  </button>
</div>

<dialog id="gallery-dialog" data-testid="gallery-dialog" aria-label="Image viewer" class="gallery-dialog">
  <form method="dialog">
    <button type="submit" data-testid="gallery-close" aria-label="Close" class="gallery-close close-icon-btn">
      <svg viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 text-white" aria-hidden="true">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
      </svg>
    </button>
  </form>
  <img data-gallery-display data-testid="gallery-display-image" class="gallery-image" alt="" />
  <div class="gallery-controls">
    <button type="button" data-gallery-prev data-testid="gallery-prev" aria-label="Previous image" class="action-icon action-icon-secondary">‹</button>
    <button type="button" data-gallery-next data-testid="gallery-next" aria-label="Next image" class="action-icon action-icon-secondary">›</button>
  </div>
</dialog>
```

The close button uses the SAME `<form method="dialog">` + `type="submit"`
pattern Modal/Slide-over already establish (native form submission
closes a `<dialog>` with zero JS needed for the close action itself),
not a literal inline event-handler attribute.

## React wrapper shape

```tsx
import { useRef, useState } from "react";
import { useDialogTrigger } from "../hooks/useDialogTrigger";

export interface GalleryImage {
  src: string;
  thumbnailSrc?: string;
  alt: string;
}
export interface GalleryProps {
  images: GalleryImage[];
  "data-testid"?: string;
}
export function Gallery({ images, "data-testid": testId }: GalleryProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // The ref passed to useDialogTrigger must point at WHICHEVER
  // thumbnail was actually clicked, not always index 0 — an earlier
  // draft hardcoded `ref={index === 0 ? triggerRef : undefined}`,
  // which only worked when opening from the FIRST thumbnail; opening
  // from any other one would return focus to the wrong (or no)
  // element on close.
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useDialogTrigger(open, () => setOpen(false), activeTriggerRef);

  return (
    <>
      <div data-testid={testId} className="mt-8 flex gap-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            ref={(el) => (triggerRefs.current[index] = el)}
            type="button"
            onClick={() => {
              activeTriggerRef.current = triggerRefs.current[index];
              setCurrentIndex(index);
              setOpen(true);
            }}
          >
            <img
              src={image.thumbnailSrc ?? image.src}
              alt={image.alt}
              className="h-20 w-20 cursor-pointer rounded-md object-cover"
            />
          </button>
        ))}
      </div>
      <dialog ref={dialogRef} aria-label="Image viewer" className="gallery-dialog">
        <button type="button" aria-label="Close" className="gallery-close close-icon-btn" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-white" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
        <img src={images[currentIndex]?.src} alt={images[currentIndex]?.alt} className="gallery-image" />
        <div className="gallery-controls">
          <button
            type="button"
            aria-label="Previous image"
            className="action-icon action-icon-secondary"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            className="action-icon action-icon-secondary"
            disabled={currentIndex === images.length - 1}
            onClick={() => setCurrentIndex((i) => i + 1)}
          >
            ›
          </button>
        </div>
      </dialog>
    </>
  );
}
```

## Acceptance mapping

- FR-004, spec.md US3 Acceptance Scenario 1 → the markup/scripts above
- spec.md Edge Case (single-image gallery) → `prevButton.disabled`/`nextButton.disabled` both true when `images.length === 1`
