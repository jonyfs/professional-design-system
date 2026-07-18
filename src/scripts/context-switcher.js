// Feature 031 (research.md R1) — a thin display-update layer on top of
// dropdown-menu.js's existing wiring (data-dropdown-trigger), which
// this script does NOT duplicate: closing, focus-return, and arrow-key
// navigation all still come from dropdown-menu.js/initDropdownMenus().
export function initContextSwitchers() {
  document.querySelectorAll("[data-context-switcher-trigger]").forEach((trigger) => {
    const currentLabel = trigger.querySelector("[data-context-switcher-current-label]");
    const currentAvatar = trigger.querySelector("[data-context-switcher-current-avatar]");
    const panel = document.getElementById(trigger.getAttribute("popovertarget"));
    if (!panel || !currentLabel) return;

    panel.querySelectorAll("[data-context-switcher-option]").forEach((option) => {
      option.addEventListener("click", () => {
        currentLabel.textContent = option.dataset.contextSwitcherLabel;
        if (currentAvatar && option.dataset.contextSwitcherAvatar) {
          currentAvatar.textContent = option.dataset.contextSwitcherAvatar;
        }
      });
    });
  });
}
