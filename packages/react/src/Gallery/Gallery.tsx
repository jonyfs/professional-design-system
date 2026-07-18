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

// Feature 034 (contracts/gallery.contract.md) — reuses Modal's exact
// native <dialog> focus-trap mechanism via useDialogTrigger (feature
// 003); only the full-screen CSS geometry and image-cycling state are
// new. Previous/Next disable at the sequence's ends (spec.md Edge
// Case: a single-image gallery has both disabled).
export function Gallery({ images, "data-testid": testId }: GalleryProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
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
        <button
          type="button"
          aria-label="Close"
          className="gallery-close close-icon-btn"
          onClick={() => setOpen(false)}
        >
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
