// File Input behavior wiring (contracts/file-input.contract.md). A
// `/speckit-analyze` finding caught that spec.md's "selected filename is
// visible" requirement has no CSS-only solution: the native input is
// visually transparent (opacity-0), so its own browser-native filename
// chrome is never seen. This is the ONE piece of real interactivity File
// Input needs — distinct from the drag-and-drop deferral decision
// (research.md R6), which is about intercepting DROPPED files, a
// materially larger surface than reading the `change` event's own
// `.files` list a user already produced via native click-to-browse.
export function initFileInputs() {
  document.querySelectorAll("[data-file-input]").forEach((input) => {
    const filenameEl = document.querySelector(
      `[data-file-input-filename="${CSS.escape(input.id)}"]`,
    );
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file && filenameEl) {
        filenameEl.textContent = file.name;
        filenameEl.hidden = false;
      } else if (filenameEl) {
        filenameEl.hidden = true;
      }
    });
  });
}
