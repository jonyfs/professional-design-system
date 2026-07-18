// Feature 039 — real cross-browser finding: Tailwind auto-generates a
// `:-moz-placeholder` fallback for any `:placeholder-shown` selector,
// and that fallback is unconditionally true in modern Firefox (the
// pseudo-class no longer exists there), floating every label
// regardless of actual fill state. This toggles a plain `data-filled`
// attribute from the field's real `.value` instead, sidestepping the
// vendor-prefix bug entirely (contracts/float-label.contract.md).
export function initFloatLabels() {
  document.querySelectorAll(".float-label-wrapper").forEach((wrapper) => {
    const field = wrapper.querySelector(".float-label-field");
    if (!field) return;

    function sync() {
      wrapper.dataset.filled = field.value !== "" ? "true" : "false";
    }

    field.addEventListener("input", sync);
    sync();
  });
}
