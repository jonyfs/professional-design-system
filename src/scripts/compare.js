// Feature 034 (research.md R5) — CSSOM clip-path/left assignment
// (this project's CSP), driven by a native range input's value. The
// range input itself provides keyboard operability and 0-100%
// clamping natively — no custom drag/keyboard logic is written here.
export function initCompares() {
  document.querySelectorAll("[data-compare]").forEach((container) => {
    const slider = container.querySelector("[data-compare-slider]");
    const afterWrapper = container.querySelector("[data-compare-after-wrapper]");
    const dividerLine = container.querySelector("[data-compare-divider-line]");
    if (!slider || !afterWrapper) return;

    function render() {
      const value = Number(slider.value);
      afterWrapper.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
      if (dividerLine) dividerLine.style.left = `${value}%`;
    }

    slider.addEventListener("input", render);
    render();
  });
}
