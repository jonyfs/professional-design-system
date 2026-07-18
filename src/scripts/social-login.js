// Social Login Group behavior wiring (contracts/035-social-login-buttons/
// social-login-group.contract.md). Presentation + callback only — no
// network request, redirect, or OAuth flow anywhere in this file (spec.md
// FR-003). Fires a `providerselect` CustomEvent that bubbles to the
// document, so the host page (or, in this demo, a single polite result
// region) can react without this module needing to know who's listening.
export function initSocialLoginGroups() {
  document.querySelectorAll("[data-social-login-group]").forEach((group) => {
    group.querySelectorAll("[data-social-login-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        group.dispatchEvent(
          new CustomEvent("providerselect", {
            detail: { providerId: btn.dataset.providerId },
            bubbles: true,
          }),
        );
      });
    });
  });
}
