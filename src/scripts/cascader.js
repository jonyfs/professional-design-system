// Feature 039 (research.md R1/R2) — reuses Dropdown Menu's panel-open/
// outside-click mechanics; per-level child-panel rendering and path
// accumulation are genuinely new.
export function initCascaders() {
  document.querySelectorAll("[data-cascader]").forEach((container) => {
    const trigger = container.querySelector("[data-cascader-trigger]");
    const panelsEl = container.querySelector("[data-cascader-panels]");
    const tree = JSON.parse(container.dataset.tree || "[]");
    const hiddenInput = container.querySelector("[data-cascader-value]");
    if (!trigger || !panelsEl) return;

    let path = [];

    function optionsForPath() {
      let level = tree;
      const panels = [level];
      for (const id of path) {
        const found = level.find((o) => o.id === id);
        if (!found?.children) break;
        level = found.children;
        panels.push(level);
      }
      return panels;
    }

    function render() {
      panelsEl.innerHTML = "";
      optionsForPath().forEach((levelOptions, levelIndex) => {
        const panel = document.createElement("div");
        panel.className = "cascader-panel";
        panel.setAttribute("role", "listbox");
        levelOptions.forEach((option) => {
          const item = document.createElement("div");
          item.className = "cascader-option";
          item.setAttribute("role", "option");
          item.dataset.testid = `cascader-option-${option.id}`;
          item.textContent = option.label + (option.children ? " ›" : "");
          item.setAttribute("aria-selected", String(path[levelIndex] === option.id));
          item.addEventListener("click", () => {
            path = [...path.slice(0, levelIndex), option.id];
            if (!option.children) commit();
            else render();
          });
          panel.appendChild(item);
        });
        panelsEl.appendChild(panel);
      });
    }

    function commit() {
      if (hiddenInput) {
        hiddenInput.value = path.join(",");
        hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const panels = optionsForPath();
      const labels = path.map((id, i) => panels[i]?.find((o) => o.id === id)?.label ?? id);
      trigger.textContent = labels.join(" / ");
      close();
    }

    function open() {
      panelsEl.hidden = false;
      render();
    }
    function close() {
      panelsEl.hidden = true;
    }

    trigger.addEventListener("click", () => (panelsEl.hidden ? open() : close()));
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        panelsEl.hidden ? open() : close();
      }
    });
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) close();
    });

    close();
  });
}
