// Feature 032 (research.md R3) — reuses Spinner's exact markup inside
// a container-scoped overlay. The visual block comes for free from DOM
// stacking (no pointer-events trick needed); aria-busy is the explicit
// accessible signal a screen reader user needs, since navigating by
// DOM order would otherwise still reach the underlying content.
//
// Real bug found by running this against a live browser, not assumed
// clean (same root cause as feature 030's Offline Banner): `.loading-
// overlay`'s `@apply flex` gives it an author-origin `display: flex`
// declaration, which the CSS cascade lets win over the browser's
// UA-origin `[hidden] { display: none }` default regardless of
// selector specificity — the native `hidden` IDL property alone
// doesn't reliably hide it. Fixed via direct CSSOM `style.display`
// assignment (the same pattern `progress.js`/`offline-banner.js`
// already use), which — being inline style — outranks the class-based
// `display` declaration.
export function initLoadingOverlay() {
  document.querySelectorAll("[data-loading-toggle]").forEach((toggle) => {
    const container = document.getElementById(toggle.dataset.loadingToggle);
    if (!container) return;
    const overlay = container.querySelector("[data-loading-overlay]");
    if (!overlay) return;

    function render() {
      overlay.style.display = container.getAttribute("aria-busy") === "true" ? "" : "none";
    }

    toggle.addEventListener("click", () => {
      const isLoading = container.getAttribute("aria-busy") === "true";
      container.setAttribute("aria-busy", String(!isLoading));
      render();
    });

    render(); // correct initial state from the container's own aria-busy, not just after the first toggle
  });
}
