import { useId, type ReactNode } from "react";
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
  const { isOpen, panelRef, triggerRef, itemRefs, onPanelKeyDown, selectItem } =
    useDropdownMenu(items);
  // aria-labelledby (an ID reference), not aria-label: gives the menu an
  // accessible name regardless of what content `trigger` contains — the
  // static reference's own aria-labelledby="dropdown-trigger" mechanism.
  // An earlier draft used aria-label={typeof trigger === "string" ? ... :
  // undefined}, which silently dropped the accessible name entirely for
  // any non-string trigger (e.g. an icon-only button) — a real
  // accessibility regression the harness's plain-string trigger never
  // exercised (code review finding).
  const triggerId = useId();

  return (
    <div className="relative inline-block text-left">
      {/* No onClick handler: the trigger<->panel relationship is wired
          via the native popoverTargetElement/popoverTargetAction invoker
          properties (set imperatively in useDropdownMenu's effect) —
          required, not optional, since a manual togglePopover() onClick
          handler has a real bug where clicking the trigger while open
          re-opens the menu instead of closing it (see the hook's own
          comment for why). */}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className="btn-secondary"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        data-testid={triggerTestId}
      >
        {trigger}
      </button>
      <div
        ref={panelRef}
        role="menu"
        aria-labelledby={triggerId}
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
