// Alert/Banner dismiss wiring (contracts/alert.contract.md). Deliberately
// NOT a reuse of toast.js — toast.js hardcodes a [role="status"] ancestor
// selector, and Alert/Banner has no such role (research.md R1: this is
// static page content, not a live-region announcement).
export function initAlertDismissal() {
  document.querySelectorAll("[data-alert]").forEach((alert) => {
    const dismissButton = alert.querySelector("[data-testid='alert-dismiss']");
    dismissButton?.addEventListener("click", () => alert.remove());
  });
}
