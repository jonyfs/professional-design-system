# Contract: Cascader

## `src/styles/tailwind.css` additions

```css
@layer components {
  .cascader-trigger {
    @apply form-input flex items-center justify-between text-left;
  }
  .cascader-panels {
    @apply absolute z-10 mt-1 flex gap-0 rounded-md bg-neutral-50 shadow-lg ring-1
      ring-neutral-900/5;
  }
  .cascader-panel {
    @apply max-h-60 w-48 overflow-auto border-r border-neutral-200 py-1 last:border-r-0;
  }
  .cascader-option {
    @apply flex cursor-pointer items-center justify-between px-3 py-2 text-sm
      text-neutral-900 aria-selected:bg-brand aria-selected:text-white;
  }
}
```

## `src/scripts/cascader.js`

```js
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

    let path = []; // array of selected ids, root to leaf

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
      const labels = path.map((id, i) => optionsForPath()[i]?.find((o) => o.id === id)?.label ?? id);
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
```

## Static HTML usage

```html
<div
  data-cascader
  data-testid="cascader-demo"
  class="relative"
  data-tree='[{"id":"eu","label":"Europe","children":[{"id":"pt","label":"Portugal"},{"id":"de","label":"Germany"}]}]'
>
  <button type="button" data-cascader-trigger class="cascader-trigger">Select a region</button>
  <div data-cascader-panels class="cascader-panels" hidden></div>
  <input data-cascader-value type="hidden" name="region" />
</div>
```

## React wrapper shape

```tsx
import { useState } from "react";

export interface CascadeOption {
  id: string;
  label: string;
  children?: CascadeOption[];
}
export interface CascaderProps {
  tree: CascadeOption[];
  onCommit: (path: string[]) => void;
  "data-testid"?: string;
}
export function Cascader({ tree, onCommit, "data-testid": testId }: CascaderProps) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<string[]>([]);

  function panelsForPath(): CascadeOption[][] {
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

  function select(levelIndex: number, option: CascadeOption) {
    const nextPath = [...path.slice(0, levelIndex), option.id];
    setPath(nextPath);
    if (!option.children) {
      onCommit(nextPath);
      setOpen(false);
    }
  }

  return (
    <div data-testid={testId} className="relative">
      <button type="button" className="cascader-trigger" onClick={() => setOpen((o) => !o)}>
        {path.length ? path.join(" / ") : "Select a region"}
      </button>
      {open && (
        <div className="cascader-panels">
          {panelsForPath().map((levelOptions, levelIndex) => (
            <div key={levelIndex} role="listbox" className="cascader-panel">
              {levelOptions.map((option) => (
                <div
                  key={option.id}
                  role="option"
                  aria-selected={path[levelIndex] === option.id}
                  className="cascader-option"
                  onClick={() => select(levelIndex, option)}
                >
                  {option.label}
                  {option.children ? " ›" : ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Acceptance mapping

- FR-004, spec.md US2 Acceptance Scenario 1 → `optionsForPath`/`panelsForPath` per-level rendering, `commit` only firing at a leaf
- spec.md US2 Acceptance Scenario 3 (Escape closes without change) → `close()` never calls `commit()`
