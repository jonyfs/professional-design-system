import { useState } from "react";

export interface CascadeOption {
  id: string;
  label: string;
  children?: CascadeOption[];
}

export interface CascaderProps {
  label?: string;
  tree: CascadeOption[];
  onCommit?: (path: string[]) => void;
  "data-testid"?: string;
}

// React port of src/scripts/cascader.js — per-level child-panel
// rendering + path accumulation (contracts/cascader.contract.md).
export function Cascader({ label, tree, onCommit, "data-testid": testId }: CascaderProps) {
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
      onCommit?.(nextPath);
      setOpen(false);
    }
  }

  return (
    <div>
      {label && <span className="mb-1 block text-sm font-medium text-neutral-900">{label}</span>}
      <div data-testid={testId} className="relative">
        <button
          type="button"
          className="cascader-trigger"
          aria-haspopup="listbox"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
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
    </div>
  );
}
