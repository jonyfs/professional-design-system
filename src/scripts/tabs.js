// Tabs behavior wiring (contracts/tabs.contract.md). No native HTML element
// covers the WAI-ARIA Tabs pattern's roving-tabindex/arrow-key keyboard
// model (research.md R2, verified not assumed) — this is the minimum JS
// surface not covered for free.
export function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

    function select(index) {
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
        const lastIndex = tabs.length - 1;
        if (event.key === "ArrowRight") select(index === lastIndex ? 0 : index + 1);
        else if (event.key === "ArrowLeft") select(index === 0 ? lastIndex : index - 1);
        else if (event.key === "Home") select(0);
        else if (event.key === "End") select(lastIndex);
        else return;
        event.preventDefault();
      });
    });
  });
}
