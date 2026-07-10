import { useEffect, useRef, useState } from "react";

export interface DropdownMenuItemData {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

// Direct React port of dropdown-menu.js's initDropdownMenus() (feature
// 005). The Popover API (research.md R3) provides top-layer rendering,
// Escape-to-close, and outside-click light-dismiss entirely natively —
// this hook adds only what it doesn't: aria-expanded syncing, arrow-key
// roving focus among items, Tab closing the menu (WAI-ARIA APG Menu
// Button convention), and explicit focus-return to the trigger.
//
// Architecture note (refined during implementation, not the original
// contract's simpler "effect reacts to isOpen state" sketch): the
// panel's own native `toggle` event fires on EVERY open/close transition
// — Escape, outside light-dismiss, and explicit hidePopover() calls
// alike — exactly like the vanilla script relies on. Treating that event
// as the single source of truth (rather than a one-way `isOpen` state ->
// showPopover()/hidePopover() effect) is what actually keeps React state
// in sync when the browser closes the popover through a path React never
// triggered itself (Escape, outside click) — a one-way effect would miss
// those and leave `isOpen` state stale.
export function useDropdownMenu(items: DropdownMenuItemData[]) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    // Set imperatively via the DOM property, not a JSX `popover` attribute
    // — confirmed against this package's pinned @types/react (^18.3.0):
    // the popover JSX attribute only exists in React 19's canary types.
    // HTMLElement.prototype.popover is natively typed in lib.dom.d.ts
    // independent of React's own JSX attribute set.
    (panel as HTMLDivElement & { popover: string }).popover = "auto";

    function handleToggle(event: Event) {
      const toggleEvent = event as ToggleEvent;
      const open = toggleEvent.newState === "open";
      setIsOpen(open);
      if (open) {
        const firstEnabled = itemRefs.current.find(
          (el, i) => el && !items[i]?.disabled,
        );
        firstEnabled?.focus();
      } else {
        triggerRef.current?.focus();
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

  function onTriggerClick() {
    const panel = panelRef.current as (HTMLDivElement & { showPopover?: () => void }) | null;
    panel?.showPopover?.();
  }

  function onPanelKeyDown(event: React.KeyboardEvent) {
    const enabled = enabledIndices();
    const currentIndex = itemRefs.current.findIndex((el) => el === document.activeElement);
    const posInEnabled = enabled.indexOf(currentIndex);
    const lastEnabled = enabled.length - 1;
    if (event.key === "ArrowDown") {
      const next = enabled[posInEnabled === lastEnabled ? 0 : posInEnabled + 1];
      itemRefs.current[next]?.focus();
    } else if (event.key === "ArrowUp") {
      const next = enabled[posInEnabled <= 0 ? lastEnabled : posInEnabled - 1];
      itemRefs.current[next]?.focus();
    } else if (event.key === "Tab") {
      // Per the WAI-ARIA APG Menu Button pattern: Tab closes the menu and
      // lets the browser's normal Tab order proceed from the trigger,
      // rather than cycling within the menu. hidePopover() fires the
      // native `toggle` event above, which handles focus-return.
      (panelRef.current as (HTMLDivElement & { hidePopover?: () => void }) | null)?.hidePopover?.();
      return;
    } else {
      return;
    }
    event.preventDefault();
  }

  function selectItem(item: DropdownMenuItemData) {
    if (item.disabled) return;
    item.onSelect();
    // hidePopover() fires the native `toggle` event above, which returns
    // focus to the trigger — no separate triggerRef.current.focus() call
    // needed here, mirroring dropdown-menu.js's own comment on this point.
    (panelRef.current as (HTMLDivElement & { hidePopover?: () => void }) | null)?.hidePopover?.();
  }

  return { isOpen, panelRef, triggerRef, itemRefs, onTriggerClick, onPanelKeyDown, selectItem };
}
