// Dropdown Menu behavior wiring (contracts/dropdown-menu.contract.md).
// The native Popover API (popover="auto") provides top-layer rendering,
// Escape-to-close, and light-dismiss (outside click) entirely natively
// (research.md R1) — this file only adds what it doesn't: aria-expanded
// syncing on the trigger, arrow-key roving focus among items, Tab closing
// the menu (WAI-ARIA APG Menu Button convention), and explicit
// focus-return to the trigger on every closing path.
//
// anchorCounter (feature 010 fix): a top-layer element's position:
// absolute containing block resets to the viewport, not its DOM
// ancestor, so .dropdown-menu-panel's `right-0`/`mt-2` never actually
// anchored to the trigger — confirmed via direct bounding-box
// measurement. CSS Anchor Positioning (anchor-name/position-anchor/
// anchor()) fixes this, but needs a unique anchor-name per instance —
// a single hardcoded name would misbehave the moment a page renders
// more than one Dropdown Menu, the same multi-instance collision class
// already found and fixed for Accordion's native group name (feature
// 009).
let anchorCounter = 0;

export function initDropdownMenus() {
  document.querySelectorAll("[data-dropdown-trigger]").forEach((trigger) => {
    const menu = document.getElementById(trigger.getAttribute("popovertarget"));
    if (!menu) return;
    const anchorName = `--dropdown-anchor-${anchorCounter++}`;
    trigger.style.anchorName = anchorName;
    menu.style.positionAnchor = anchorName;
    const items = () => Array.from(menu.querySelectorAll('[role="menuitem"]:not(:disabled)'));

    // Popover API's native "toggle" event fires on every open/close
    // transition (Escape, light-dismiss, and hidePopover() calls alike).
    // Focus-return to the trigger is NOT assumed to be automatic Popover
    // API behavior — this project already learned once, in feature 003,
    // that a similar native-restoration claim about <dialog> didn't hold
    // in every engine (WebKit), so it's reinforced explicitly here.
    menu.addEventListener("toggle", (event) => {
      const open = event.newState === "open";
      trigger.setAttribute("aria-expanded", String(open));
      if (open) {
        items()[0]?.focus();
      } else {
        trigger.focus();
      }
    });

    menu.addEventListener("keydown", (event) => {
      const list = items();
      const currentIndex = list.indexOf(document.activeElement);
      const lastIndex = list.length - 1;
      if (event.key === "ArrowDown") {
        list[currentIndex === lastIndex ? 0 : currentIndex + 1]?.focus();
      } else if (event.key === "ArrowUp") {
        list[currentIndex <= 0 ? lastIndex : currentIndex - 1]?.focus();
      } else if (event.key === "Tab") {
        // Per the WAI-ARIA APG's Menu Button pattern: Tab closes the menu
        // and lets the browser's normal Tab order proceed from the
        // trigger, rather than cycling within the menu.
        menu.hidePopover();
        return;
      } else {
        return;
      }
      event.preventDefault();
    });

    // Selecting an item closes the menu and fires its action. hidePopover()
    // itself triggers the "toggle" listener above, which returns focus to
    // the trigger — no separate trigger.focus() call needed here.
    menu.querySelectorAll('[role="menuitem"]').forEach((item) => {
      item.addEventListener("click", () => {
        menu.hidePopover();
      });
    });
  });
}
