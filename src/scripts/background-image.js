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
