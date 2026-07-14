// Split Button behavior wiring (contracts/023-component-catalog-expansion/
// button-variants.contract.md). The dropdown segment reuses the ratified
// Dropdown Menu panel mechanics VERBATIM — this file adds no new popup
// mechanism, it just calls the existing initDropdownMenus() (which discovers
// the second segment via its [data-dropdown-trigger]/popovertarget
// attributes, exactly like a standalone Dropdown Menu). The only extra
// wiring here is a demo/test-observable effect: reflecting which action
// fired into a polite aria-live region (CSP blocks inline scripts, so this
// small module is the CSP-compliant way to give the primary segment an
// observable click effect).
import { initDropdownMenus } from "/src/scripts/dropdown-menu.js";

export function initSplitButtons() {
  // Reuse the exact Dropdown Menu wiring for every split-button dropdown
  // segment on the page (aria-expanded sync, arrow-key roving focus,
  // Tab/Escape/outside-click close, focus-return) — nothing new.
  initDropdownMenus();

  document.querySelectorAll(".split-button").forEach((group) => {
    // The demo exposes a single polite result region per page (the ratified
    // single-instance gallery pattern, same as dropdown-menu.html); reflect
    // the fired action into it so the primary segment has an observable,
    // CSP-compliant click effect.
    const result = document.querySelector("[data-split-result]");
    if (!result) return;

    const primary = group.querySelector("[data-split-primary]");
    primary?.addEventListener("click", () => {
      result.textContent = `Ran: ${primary.textContent?.trim() ?? "Save"}`;
    });

    // Menu items fire their alternate action; the shared dropdown-menu.js
    // already closes the panel and returns focus on click, so here we only
    // record which alternate action ran.
    const panel = document.getElementById(
      group.querySelector("[data-dropdown-trigger]")?.getAttribute("popovertarget") ?? "",
    );
    panel?.querySelectorAll('[role="menuitem"]:not(:disabled)').forEach((item) => {
      item.addEventListener("click", () => {
        result.textContent = `Ran: ${item.textContent?.trim() ?? ""}`;
      });
    });
  });
}
