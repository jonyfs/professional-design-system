// Tabs behavior wiring (contracts/tabs.contract.md). No native HTML element
// covers the WAI-ARIA Tabs pattern's roving-tabindex/arrow-key keyboard
// model (research.md R2, verified not assumed) — this is the minimum JS
// surface not covered for free.
export function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

    // Disabled tabs must be skipped during roving-tabindex arrow-key
    // navigation — the same class of problem dropdown-menu.js's
    // :not(:disabled) filter solves for menu items. Selecting index-only
    // (ignoring disabled state) would set aria-selected/panel-visibility
    // on a disabled tab and then call .focus() on it, which browsers
    // silently refuse (disabled elements aren't focusable), leaving
    // keyboard focus stuck while the selection state has already moved —
    // an ARIA/focus desync, found by code review since .tab-trigger's own
    // disabled: state (data-model.md) is unconditional per Principle V
    // even though no acceptance scenario in this slice exercises it yet.
    function enabledIndices() {
      return tabs.reduce((acc, tab, i) => {
        if (!tab.disabled) acc.push(i);
        return acc;
      }, []);
    }

    function select(index) {
      if (tabs[index]?.disabled) return;
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[i].hidden = !selected;
      });
      tabs[index].focus();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(index));
      tab.addEventListener("keydown", (event) => {
        const enabled = enabledIndices();
        const posInEnabled = enabled.indexOf(index);
        const lastEnabled = enabled.length - 1;
        if (event.key === "ArrowRight") {
          select(enabled[posInEnabled === lastEnabled ? 0 : posInEnabled + 1]);
        } else if (event.key === "ArrowLeft") {
          select(enabled[posInEnabled === 0 ? lastEnabled : posInEnabled - 1]);
        } else if (event.key === "Home") {
          select(enabled[0]);
        } else if (event.key === "End") {
          select(enabled[lastEnabled]);
        } else {
          return;
        }
        event.preventDefault();
      });
    });
  });
}
