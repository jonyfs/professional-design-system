import { useId, useState } from "react";
import { useDropdownMenu, type DropdownMenuItemData } from "../hooks/useDropdownMenu";

export interface LanguageOption {
  label: string;
  /** Test id applied to this option's menu item. */
  "data-testid"?: string;
}

export interface LanguageSwitcherProps {
  options: LanguageOption[];
  initialSelected?: number;
  onChange?: (option: LanguageOption, index: number) => void;
  /** Test id applied to the trigger button. */
  triggerTestId?: string;
  /** Test id applied to the popover panel. */
  panelTestId?: string;
  /** Test id applied to the trigger's current-label span. */
  currentLabelTestId?: string;
}

// Feature 042 (audit backfill) — dropdown identity switcher with no
// avatars. Reuses Dropdown Menu's panel mechanics verbatim via the
// shared useDropdownMenu hook (top-layer Popover, Escape/light-dismiss,
// arrow-key roving focus). The E2E exercises: opening the panel,
// selecting an option, and the trigger's current label updating to the
// chosen language.
export function LanguageSwitcher({
  options,
  initialSelected = 0,
  onChange,
  triggerTestId,
  panelTestId,
  currentLabelTestId,
}: LanguageSwitcherProps) {
  const [currentIndex, setCurrentIndex] = useState(initialSelected);
  const current = options[currentIndex];
  const items: DropdownMenuItemData[] = options.map((opt, i) => ({
    id: `language-option-${i}`,
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
        className="btn-secondary"
      >
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
            className="dropdown-menu-item"
            onClick={() => selectItem(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
