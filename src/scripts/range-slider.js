// Feature 039 (research.md R1/R2) — two native <input type="range">
// elements share one value pair; the clamping logic below is the one
// genuinely new piece.
//
// Real accessibility finding (not assumed clean): an earlier draft
// stacked both inputs at an IDENTICAL absolute position (the classic
// "two overlapping range inputs" dual-slider technique). Automated
// a11y scanning (axe-core's target-size/target-offset checks, WCAG
// 2.5.8) correctly flagged this — both bounding boxes are perfectly
// identical regardless of where each thumb visually renders, so the
// measured gap between the two targets is 0px, a real hit-testing
// ambiguity for pointer/touch/switch-access users, not merely a tool
// false-positive (confirmed by also breaking a real Playwright
// pointer interaction against the clipped element in the same test
// run). Two full-width rows, genuinely separate in the DOM/layout
// (never overlapping), avoids the whole class of problem instead of
// trying to patch it with clip-path.
export function initRangeSliders() {
  document.querySelectorAll("[data-range-slider]").forEach((container) => {
    const lowInput = container.querySelector("[data-range-slider-low]");
    const highInput = container.querySelector("[data-range-slider-high]");
    if (!lowInput || !highInput) return;

    lowInput.addEventListener("input", () => {
      if (Number(lowInput.value) > Number(highInput.value)) {
        lowInput.value = highInput.value;
      }
      lowInput.dispatchEvent(new CustomEvent("range-slider-change", { bubbles: true }));
    });
    highInput.addEventListener("input", () => {
      if (Number(highInput.value) < Number(lowInput.value)) {
        highInput.value = lowInput.value;
      }
      highInput.dispatchEvent(new CustomEvent("range-slider-change", { bubbles: true }));
    });
  });
}
