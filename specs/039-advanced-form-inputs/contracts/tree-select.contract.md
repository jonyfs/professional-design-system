# Contract: TreeSelect

## `src/styles/tailwind.css` additions

```css
@layer components {
  .tree-select-trigger {
    @apply form-input flex items-center justify-between text-left;
  }
  .tree-select-panel {
    @apply absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md bg-neutral-50
      p-2 shadow-lg ring-1 ring-neutral-900/5;
  }
  .tree-select-node[aria-selected="true"] > summary,
  .tree-select-leaf[aria-selected="true"] {
    @apply bg-brand text-white;
  }
  .tree-select-leaf {
    @apply cursor-pointer rounded px-2 py-1 text-sm text-neutral-900 hover:bg-neutral-100;
  }
}
```

## `src/scripts/tree-select.js`

```js
// Feature 039 (research.md R1/R2) — reuses TreeView's native
// <details>/<summary> disclosure verbatim; the selection layer (which
// single node is committed) is genuinely new.
export function initTreeSelects() {
  document.querySelectorAll("[data-tree-select]").forEach((container) => {
    const trigger = container.querySelector("[data-tree-select-trigger]");
    const panel = container.querySelector("[data-tree-select-panel]");
    const hiddenInput = container.querySelector("[data-tree-select-value]");
    if (!trigger || !panel) return;

    function commit(node, label) {
      if (hiddenInput) {
        hiddenInput.value = node;
        hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      trigger.textContent = label;
      panel.querySelectorAll("[aria-selected]").forEach((el) => el.removeAttribute("aria-selected"));
      const selectedEl = panel.querySelector(`[data-node-id="${node}"]`);
      selectedEl?.setAttribute("aria-selected", "true");
      close();
    }

    function open() {
      panel.hidden = false;
    }
    function close() {
      panel.hidden = true;
    }

    panel.querySelectorAll("[data-node-selectable]").forEach((leaf) => {
      leaf.addEventListener("click", () => commit(leaf.dataset.nodeId, leaf.textContent.trim()));
      leaf.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          commit(leaf.dataset.nodeId, leaf.textContent.trim());
        }
      });
    });

    trigger.addEventListener("click", () => (panel.hidden ? open() : close()));
    trigger.addEventListener("keydown", (e) => e.key === "Escape" && close());
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) close();
    });

    close();
  });
}
```

## Static HTML usage

```html
<div data-tree-select data-testid="tree-select-demo" class="relative">
  <button type="button" data-tree-select-trigger class="tree-select-trigger">Select a folder</button>
  <div data-tree-select-panel class="tree-select-panel" hidden>
    <ul class="tree-view">
      <li>
        <details open class="tree-select-node">
          <summary class="tree-view-summary">src</summary>
          <ul class="tree-view-children">
            <li>
              <span
                data-node-selectable
                data-node-id="src-components"
                tabindex="0"
                role="option"
                class="tree-select-leaf"
                >components</span
              >
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
  <input data-tree-select-value type="hidden" name="folder" />
</div>
```

## React wrapper shape

```tsx
import { useState } from "react";

export interface TreeSelectNode {
  id: string;
  label: string;
  children?: TreeSelectNode[];
  selectable?: boolean;
}
export interface TreeSelectProps {
  tree: TreeSelectNode[];
  onCommit: (node: TreeSelectNode) => void;
  "data-testid"?: string;
}
function TreeSelectNodeView({
  node,
  selectedId,
  onSelect,
}: {
  node: TreeSelectNode;
  selectedId: string | null;
  onSelect: (node: TreeSelectNode) => void;
}) {
  if (!node.children) {
    return (
      <li>
        <span
          role="option"
          tabIndex={0}
          aria-selected={selectedId === node.id}
          className="tree-select-leaf"
          onClick={() => onSelect(node)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(node)}
        >
          {node.label}
        </span>
      </li>
    );
  }
  return (
    <li>
      <details open className="tree-select-node">
        <summary className="tree-view-summary">{node.label}</summary>
        <ul className="tree-view-children">
          {node.children.map((child) => (
            <TreeSelectNodeView key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </ul>
      </details>
    </li>
  );
}
export function TreeSelect({ tree, onCommit, "data-testid": testId }: TreeSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TreeSelectNode | null>(null);

  return (
    <div data-testid={testId} className="relative">
      <button type="button" className="tree-select-trigger" onClick={() => setOpen((o) => !o)}>
        {selected?.label ?? "Select a folder"}
      </button>
      {open && (
        <div className="tree-select-panel">
          <ul className="tree-view">
            {tree.map((node) => (
              <TreeSelectNodeView
                key={node.id}
                node={node}
                selectedId={selected?.id ?? null}
                onSelect={(n) => {
                  setSelected(n);
                  onCommit(n);
                  setOpen(false);
                }}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Acceptance mapping

- FR-005, spec.md US2 Acceptance Scenario 2 → `<details>`/`<summary>` reused verbatim from TreeView + the new `commit`/`onSelect` selection layer
