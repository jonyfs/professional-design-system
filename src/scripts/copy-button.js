// Copy Button behavior wiring (contracts/023-component-catalog-expansion/
// button-variants.contract.md). On click, writes data-copy-text to the
// clipboard via the native async Clipboard API; on success it shows a
// temporary "Copied" confirmation for a fixed duration, then reverts; on
// rejection (caught via try/catch) it shows a DISTINCT "Copy failed" state
// instead of silently claiming success (spec.md Edge Cases). The outcome is
// mirrored into a polite aria-live region so screen-reader users hear it
// without re-focusing the button (the same convention as Toast).

// Milliseconds the transient copied/failed state stays visible before
// reverting to idle (research.md R7 — a fixed, short confirmation window).
const REVERT_DELAY_MS = 2000;

/**
 * @param {HTMLElement} root  the copy button element
 * @param {"idle" | "copied" | "failed"} status
 */
function renderStatus(root, status) {
  root.querySelectorAll("[data-copy-icon]").forEach((icon) => {
    icon.classList.toggle("hidden", icon.getAttribute("data-copy-icon") !== status);
  });

  const label = root.querySelector("[data-copy-label]");
  // Each demo section holds exactly one copy button plus its own polite
  // status region — scope the lookup to the button's section so two
  // buttons on the page never announce into each other's live region.
  const statusRegion = root.closest("section")?.querySelector("[data-copy-status]");

  if (status === "idle") {
    if (label) label.textContent = "Copy link";
    root.removeAttribute("data-copy-state");
  } else if (status === "copied") {
    if (label) label.textContent = "Copied";
    root.setAttribute("data-copy-state", "copied");
    if (statusRegion) statusRegion.textContent = "Copied to clipboard";
  } else {
    if (label) label.textContent = "Copy failed";
    root.setAttribute("data-copy-state", "failed");
    if (statusRegion) statusRegion.textContent = "Copy failed";
  }
}

export function initCopyButtons() {
  document.querySelectorAll("[data-copy-button]").forEach((button) => {
    let revertTimer;
    button.addEventListener("click", async () => {
      const text = button.getAttribute("data-copy-text") ?? "";
      clearTimeout(revertTimer);
      try {
        // data-copy-fail lets a demo/test exercise the rejection path
        // deterministically without depending on a denied-permission or
        // insecure-context environment.
        if (button.hasAttribute("data-copy-fail")) {
          throw new Error("Copy forced to fail (demo)");
        }
        await navigator.clipboard.writeText(text);
        renderStatus(button, "copied");
      } catch {
        // Never report success on failure (spec.md Edge Cases).
        renderStatus(button, "failed");
      }
      revertTimer = setTimeout(() => renderStatus(button, "idle"), REVERT_DELAY_MS);
    });
  });
}
