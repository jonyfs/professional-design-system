import { useId, useState } from "react";
import { useDropdownMenu, type DropdownMenuItemData } from "../hooks/useDropdownMenu";

export interface SwitcherOption {
  label: string;
  avatarInitials?: string;
}

export interface ContextSwitcherProps {
  options: SwitcherOption[];
  initialSelected?: number;
  "data-testid"?: string;
}

// Feature 031 (contracts/context-switchers.contract.md) — reuses
// useDropdownMenu directly, not the base DropdownMenu component, which
// has no per-item avatar content slot. Serves BOTH Team/Workspace
// Switcher and Language Switcher (options without avatarInitials
// simply render no avatar chip) — a pure content variant, not a
// second component (research.md R1).
export function ContextSwitcher({
  options,
  initialSelected = 0,
  "data-testid": testId,
}: ContextSwitcherProps) {
  const [current, setCurrent] = useState(options[initialSelected]);
  const items: DropdownMenuItemData[] = options.map((opt, i) => ({
    id: `option-${i}`,
    label: opt.label,
    onSelect: () => setCurrent(opt),
  }));
  const { isOpen, panelRef, triggerRef, itemRefs, onPanelKeyDown, selectItem } =
    useDropdownMenu(items);
  const triggerId = useId();

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        data-testid={testId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="btn-secondary inline-flex items-center gap-2"
      >
        {current.avatarInitials && (
          <span className="avatar-fallback">{current.avatarInitials}</span>
        )}
        <span>{current.label}</span>
      </button>
      <div
        ref={panelRef}
        role="menu"
        aria-labelledby={triggerId}
        className="dropdown-menu-panel"
        onKeyDown={onPanelKeyDown}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => (itemRefs.current[i] = el)}
            type="button"
            role="menuitem"
            className="dropdown-menu-item flex items-center gap-2"
            onClick={() => selectItem(item)}
          >
            {options[i].avatarInitials && (
              <span className="avatar-fallback avatar-sm">{options[i].avatarInitials}</span>
            )}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
