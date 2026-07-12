// Context Menu behavior wiring (contracts/context-menu.contract.md,
// feature 014). Forked from dropdown-menu.js, not a verbatim reuse — the
// panel must anchor to the cursor's coordinates, not to a fixed DOM
// trigger, and CSS Anchor Positioning (anchor-name/position-anchor) can
// only anchor to a real element, never a synthetic point (research.md
// R5). Arrow-key roving focus and the toggle-driven focus-init/
// focus-return wiring ARE copied verbatim from dropdown-menu.js, since
// neither depends on the positioning mechanism.
export function initContextMenus() {
  document.querySelectorAll("[data-context-menu-target]").forEach((target) => {
    const panel = document.getElementById(target.getAttribute("data-context-menu-target"));
    if (!panel) return;
    const items = () => Array.from(panel.querySelectorAll('[role="menuitem"]:not(:disabled)'));

    target.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      panel.showPopover();
      // Clamp against the viewport using the panel's own measured
      // dimensions (research.md R5) — CSS Anchor Positioning has no
      // coordinate-based anchor, so positioning is set imperatively here.
      const { offsetWidth: w, offsetHeight: h } = panel;
      const x = Math.min(event.clientX, window.innerWidth - w);
      const y = Math.min(event.clientY, window.innerHeight - h);
      panel.style.left = `${Math.max(0, x)}px`;
      panel.style.top = `${Math.max(0, y)}px`;
    });

    // Same toggle-driven focus-init (first item on open) and
    // focus-return (to the right-clicked target on close) wiring as
    // dropdown-menu.js — forked here, not imported, since the two
    // modules have no shared runtime dependency (research.md R5).
    panel.addEventListener("toggle", (event) => {
      const open = event.newState === "open";
      if (open) {
        items()[0]?.focus();
      } else {
        target.focus();
      }
    });

    panel.addEventListener("keydown", (event) => {
      const list = items();
      const currentIndex = list.indexOf(document.activeElement);
      const lastIndex = list.length - 1;
      if (event.key === "ArrowDown") {
        list[currentIndex === lastIndex ? 0 : currentIndex + 1]?.focus();
      } else if (event.key === "ArrowUp") {
        list[currentIndex <= 0 ? lastIndex : currentIndex - 1]?.focus();
      } else if (event.key === "Tab") {
        panel.hidePopover();
        return;
      } else {
        return;
      }
      event.preventDefault();
    });

    panel.querySelectorAll('[role="menuitem"]').forEach((item) => {
      item.addEventListener("click", () => {
        panel.hidePopover();
      });
    });
  });
}
