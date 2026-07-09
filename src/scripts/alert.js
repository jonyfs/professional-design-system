// Alert/Banner dismiss wiring (contracts/alert.contract.md). Deliberately
// NOT a reuse of toast.js — toast.js hardcodes a [role="status"] ancestor
// selector, and Alert/Banner has no such role (research.md R1: this is
// static page content, not a live-region announcement).
export function initAlertDismissal() {
  document.querySelectorAll("[data-alert]").forEach((alert) => {
    // Query the child <button> directly rather than a data-testid — a
    // testing hook shouldn't gate production behavior, and each
    // dismissible alert has exactly one dismiss button.
    const dismissButton = alert.querySelector("button");
    dismissButton?.addEventListener("click", () => alert.remove());
  });
}
