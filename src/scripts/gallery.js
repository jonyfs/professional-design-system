// Feature 034 (research.md R4) — reuses overlay.js's exact dialog
// mechanism. Wired directly (not through initDialogTriggers()'s
// generic per-trigger loop) since each thumbnail needs its own click
// handler to set the current index — but still reuses
// wireDialogClose() for backdrop-click-to-close and the WebKit
// focus-return safeguard every other dialog in this catalog already
// gets (the same reasoning Session Timeout Modal, feature 030, already
// established for this exact situation). Previous/Next disable at the
// sequence's ends (spec.md Edge Case: a single-image gallery has both
// disabled).
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
