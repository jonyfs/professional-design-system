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
