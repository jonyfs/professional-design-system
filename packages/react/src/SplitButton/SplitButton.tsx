import { useId, type ReactNode } from "react";
import { useDropdownMenu, type DropdownMenuItemData } from "../hooks/useDropdownMenu";

export type SplitButtonAction = DropdownMenuItemData;

export interface SplitButtonProps {
  /** Label for the primary action segment. */
  primaryLabel: ReactNode;
  /** Fired when the primary segment is clicked. */
  onPrimary: () => void;
  /** Alternate actions shown in the attached dropdown segment. */
  menuActions: SplitButtonAction[];
  /** Accessible name for the whole two-segment control. */
  ariaLabel: string;
  /** Accessible name for the dropdown-toggle segment (icon-only). */
  toggleAriaLabel?: string;
  primaryTestId?: string;
  triggerTestId?: string;
  panelTestId?: string;
}

// A primary action segment plus an attached dropdown segment, styled as one
// connected control (contracts/023.../button-variants.contract.md). The
// dropdown segment reuses useDropdownMenu VERBATIM — the SAME hook
// DropdownMenu.tsx uses — so it inherits the exact ratified keyboard model
// (arrow-key roving focus, Tab/Escape/outside-click close, focus-return,
// aria-expanded sync) with no new popup mechanism. The hook's triggerRef is
// attached to the SECOND (toggle) segment, which is the Popover invoker; the
// primary segment is an independent button with its own onClick.
export function SplitButton({
  primaryLabel,
  onPrimary,
  menuActions,
  ariaLabel,
  toggleAriaLabel = "More options",
  primaryTestId,
  triggerTestId,
  panelTestId,
}: SplitButtonProps) {
  const { isOpen, panelRef, triggerRef, itemRefs, onPanelKeyDown, selectItem } =
    useDropdownMenu(menuActions);
  const triggerId = useId();

  return (
    <div className="relative inline-block text-left">
      <div className="split-button" role="group" aria-label={ariaLabel}>
        <button
          type="button"
          className="split-button-primary"
          data-testid={primaryTestId}
          onClick={onPrimary}
        >
          {primaryLabel}
        </button>

        {/* No onClick: the trigger<->panel relationship is wired via the
            native popoverTargetElement/popoverTargetAction invoker inside
            useDropdownMenu (required, not optional — see the hook's comment
            on why a manual togglePopover() onClick has a real reopen bug). */}
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          className="split-button-toggle"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label={toggleAriaLabel}
          data-testid={triggerTestId}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        ref={panelRef}
        role="menu"
        aria-labelledby={triggerId}
        className="dropdown-menu-panel"
        data-testid={panelTestId}
        onKeyDown={onPanelKeyDown}
      >
        {menuActions.map((item, i) => (
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
