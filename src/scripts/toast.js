// Toast dismiss-button wiring (contracts/toast.contract.md). Deliberately
// separate from overlay.js — Toast is non-modal and has no dialog/focus-trap
// semantics to wire (research.md).
export function initToastDismissal() {
  document.querySelectorAll('[data-testid="toast-close"]').forEach((button) => {
    button.addEventListener("click", () => {
      button.closest('[role="status"]')?.remove();
    });
  });
}
