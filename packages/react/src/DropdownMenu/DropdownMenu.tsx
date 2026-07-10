import type { ReactNode } from "react";
import { useDropdownMenu, type DropdownMenuItemData } from "../hooks/useDropdownMenu";

export type { DropdownMenuItemData };

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItemData[];
  triggerTestId?: string;
  panelTestId?: string;
}

// Thin consumer of useDropdownMenu (contracts/009-react-port-nav-disclosure/
// dropdown-menu.contract.md) — the real Popover API drives open/close/
// light-dismiss/top-layer natively; the hook adds arrow-key roving focus,
// aria-expanded sync, Tab-closes-menu, and explicit focus-return.
export function DropdownMenu({ trigger, items, triggerTestId, panelTestId }: DropdownMenuProps) {
  const { isOpen, panelRef, triggerRef, itemRefs, onTriggerClick, onPanelKeyDown, selectItem } =
    useDropdownMenu(items);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        className="btn-secondary"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        data-testid={triggerTestId}
        onClick={onTriggerClick}
      >
        {trigger}
      </button>
      <div
        ref={panelRef}
        role="menu"
        aria-label={typeof trigger === "string" ? trigger : undefined}
        className="dropdown-menu-panel"
        data-testid={panelTestId}
        onKeyDown={onPanelKeyDown}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => (itemRefs.current[i] = el)}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            className="dropdown-menu-item"
            data-testid={item.id}
            onClick={() => selectItem(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
