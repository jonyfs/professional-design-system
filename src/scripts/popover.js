// Popover behavior wiring (contracts/popover.contract.md, feature 014).
// A content-agnostic extraction of dropdown-menu.js's Popover-API +
// unique-anchor-name-per-instance + aria-expanded-sync wiring — no
// roving-focus/item-list logic here, since Popover hosts arbitrary
// content, not a fixed menu-item list.
//
// Two things ARE carried over from dropdown-menu.js's `toggle` listener,
// not just aria-expanded sync: the close-path `trigger.focus()` call
// (a real component hosting interactive content must return focus
// somewhere sane on close, the same discipline Dropdown Menu/Context Menu
// already apply) and a MutationObserver watching for
// the trigger's removal from the DOM (research.md R10 — native
// popover="auto" panels do not auto-close when their trigger is removed;
// left unhandled, a programmatically-removed trigger — e.g. a deleted
// list row — would leave the panel open with no way to dismiss it).
let anchorCounter = 0;

export function initPopovers() {
  document.querySelectorAll("[data-popover-trigger]").forEach((trigger) => {
    const panel = document.getElementById(trigger.getAttribute("popovertarget"));
    if (!panel) return;
    const anchorName = `--popover-anchor-${anchorCounter++}`;
    trigger.style.anchorName = anchorName;
    panel.style.positionAnchor = anchorName;

    panel.addEventListener("toggle", (event) => {
      const open = event.newState === "open";
      trigger.setAttribute("aria-expanded", String(open));
      if (!open) {
        trigger.focus();
      }
    });

    const parent = trigger.parentElement;
    if (parent) {
      const observer = new MutationObserver(() => {
        if (!parent.contains(trigger) && panel.matches(":popover-open")) {
          panel.hidePopover();
        }
      });
      observer.observe(parent, { childList: true });
    }
  });
}
