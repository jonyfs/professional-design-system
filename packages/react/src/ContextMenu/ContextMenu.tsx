import { useEffect, useRef, type ReactNode } from "react";

export interface ContextMenuItemData {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface ContextMenuProps {
  /** Menu items shown on right-click. */
  items: ContextMenuItemData[];
  /** The right-clickable target region's content. */
  children: ReactNode;
  /** Accessible name for the menu (role="menu"). */
  menuLabel?: string;
  /** Extra classes merged onto the target region wrapper. */
  targetClassName?: string;
  targetTestId?: string;
  panelTestId?: string;
}

// Right-click context menu (contracts/context-menu.contract.md, feature
// 014) — forked from the Dropdown Menu mechanics, not a verbatim reuse:
// the panel must anchor to the cursor's coordinates, and CSS Anchor
// Positioning can only anchor to a real element, never a synthetic point
// (research.md R5), so placement is set imperatively against the click's
// clientX/clientY and clamped to the viewport using the panel's own
// measured size. Arrow-key roving focus and the toggle-driven focus-init
// (first enabled item on open) / focus-return (to the right-clicked
// target on close) are the same as Dropdown Menu, since neither depends on
// the positioning mechanism.
export function ContextMenu({
  items,
  children,
  menuLabel = "Actions",
  targetClassName,
  targetTestId,
  panelTestId,
}: ContextMenuProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Right-click opens the panel at the cursor, clamped on-screen.
  useEffect(() => {
    const target = targetRef.current;
    const panel = panelRef.current;
    if (!target || !panel) return;
    panel.popover = "auto";

    function handleContextMenu(event: MouseEvent) {
      if (!panel) return;
      event.preventDefault();
      panel.showPopover();
      const { offsetWidth: w, offsetHeight: h } = panel;
      const x = Math.min(event.clientX, window.innerWidth - w);
      const y = Math.min(event.clientY, window.innerHeight - h);
      panel.style.left = `${Math.max(0, x)}px`;
      panel.style.top = `${Math.max(0, y)}px`;
    }

    target.addEventListener("contextmenu", handleContextMenu);
    return () => target.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Focus the first enabled item on open; return focus to the target on close.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    function handleToggle(event: ToggleEvent) {
      if (event.newState === "open") {
        const firstEnabled = itemRefs.current.find((el, i) => el && !items[i]?.disabled);
        firstEnabled?.focus();
      } else {
        targetRef.current?.focus();
      }
    }
    panel.addEventListener("toggle", handleToggle);
    return () => panel.removeEventListener("toggle", handleToggle);
  }, [items]);

  function enabledIndices() {
    return items.reduce<number[]>((acc, item, i) => {
      if (!item.disabled) acc.push(i);
      return acc;
    }, []);
  }

  function onPanelKeyDown(event: React.KeyboardEvent) {
    const enabled = enabledIndices();
    const currentIndex = itemRefs.current.findIndex((el) => el === document.activeElement);
    const posInEnabled = enabled.indexOf(currentIndex);
    const lastEnabled = enabled.length - 1;
    if (event.key === "ArrowDown") {
      itemRefs.current[enabled[posInEnabled === lastEnabled ? 0 : posInEnabled + 1]]?.focus();
    } else if (event.key === "ArrowUp") {
      itemRefs.current[enabled[posInEnabled <= 0 ? lastEnabled : posInEnabled - 1]]?.focus();
    } else if (event.key === "Tab") {
      panelRef.current?.hidePopover();
      return;
    } else {
      return;
    }
    event.preventDefault();
  }

  function selectItem(item: ContextMenuItemData) {
    if (item.disabled) return;
    item.onSelect();
    panelRef.current?.hidePopover();
  }

  const targetClasses = [
    "flex items-center justify-between rounded-md border border-neutral-200 px-4 py-3",
    targetClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div ref={targetRef} tabIndex={0} className={targetClasses} data-testid={targetTestId}>
        {children}
      </div>
      <div
        ref={panelRef}
        role="menu"
        aria-label={menuLabel}
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
    </>
  );
}
