import { useId, useState } from "react";
import { useDropdownMenu, type DropdownMenuItemData } from "../hooks/useDropdownMenu";

export interface TeamOption {
  label: string;
  /** Avatar fallback initials shown in the trigger and the option row. */
  avatarInitials: string;
  /** Test id applied to this option's menu item. */
  "data-testid"?: string;
}

export interface TeamSwitcherProps {
  options: TeamOption[];
  initialSelected?: number;
  onChange?: (option: TeamOption, index: number) => void;
  /** Test id applied to the trigger button. */
  triggerTestId?: string;
  /** Test id applied to the popover panel. */
  panelTestId?: string;
  /** Test id applied to the trigger's current-label span. */
  currentLabelTestId?: string;
  /** Test id applied to the trigger's current-avatar chip. */
  currentAvatarTestId?: string;
}

// Feature 042 (audit backfill) — dropdown identity switcher with an
// Avatar fallback chip per workspace. Reuses Dropdown Menu's panel
// mechanics verbatim via the shared useDropdownMenu hook, which supplies
// the arrow-key roving focus and Escape/light-dismiss the E2E exercises.
// Selecting an option updates BOTH the trigger's avatar chip and its
// label in a single state update, so they can never drift apart.
export function TeamSwitcher({
  options,
  initialSelected = 0,
  onChange,
  triggerTestId,
  panelTestId,
  currentLabelTestId,
  currentAvatarTestId,
}: TeamSwitcherProps) {
  const [currentIndex, setCurrentIndex] = useState(initialSelected);
  const current = options[currentIndex];
  const items: DropdownMenuItemData[] = options.map((opt, i) => ({
    id: `team-option-${i}`,
    label: opt.label,
    onSelect: () => {
      setCurrentIndex(i);
      onChange?.(opt, i);
    },
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
        data-testid={triggerTestId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="btn-secondary inline-flex items-center gap-2"
      >
        <span className="avatar-fallback" data-testid={currentAvatarTestId}>
          {current.avatarInitials}
        </span>
        <span data-testid={currentLabelTestId}>{current.label}</span>
      </button>
      <div
        ref={panelRef}
        role="menu"
        aria-labelledby={triggerId}
        data-testid={panelTestId}
        className="dropdown-menu-panel"
        onKeyDown={onPanelKeyDown}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => (itemRefs.current[i] = el)}
            type="button"
            role="menuitem"
            data-testid={options[i]["data-testid"]}
            className="dropdown-menu-item flex items-center gap-2"
            onClick={() => selectItem(item)}
          >
            <span className="avatar-fallback avatar-sm">{options[i].avatarInitials}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
