import { useState } from "react";

export interface TreeSelectNode {
  id: string;
  label: string;
  children?: TreeSelectNode[];
}

export interface TreeSelectProps {
  label?: string;
  tree: TreeSelectNode[];
  onCommit?: (node: TreeSelectNode) => void;
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

// React port of src/scripts/tree-select.js — reuses the same native
// <details>/<summary> disclosure TreeView uses, with a new selection
// layer (contracts/tree-select.contract.md).
export function TreeSelect({ label, tree, onCommit, "data-testid": testId }: TreeSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TreeSelectNode | null>(null);

  return (
    <div>
      {label && <span className="mb-1 block text-sm font-medium text-neutral-900">{label}</span>}
      <div data-testid={testId} className="relative">
        <button
          type="button"
          className="tree-select-trigger"
          aria-haspopup="tree"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
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
                    onCommit?.(n);
                    setOpen(false);
                  }}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
