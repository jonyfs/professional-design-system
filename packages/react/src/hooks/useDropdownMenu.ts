import { useEffect, useId, useRef, useState } from "react";

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
// Architecture note (refined during implementation): the panel's own
// native `toggle` event fires on EVERY open/close transition — Escape,
// outside light-dismiss, and explicit hidePopover()/togglePopover()
// calls alike — exactly like the vanilla script relies on. Treating
// that event as the single source of truth (rather than a one-way
// `isOpen` state -> showPopover()/hidePopover() effect) is what
// actually keeps React state in sync when the browser closes the
// popover through a path React never triggered itself.
//
// The trigger<->panel relationship is wired via the NATIVE invoker
// mechanism (`button.popoverTargetElement`/`popoverTargetAction`, set
// imperatively via a ref effect — the equivalent of the static
// reference's declarative `popovertarget="..."` attribute, which JSX
// can't express directly since it isn't typed in this package's pinned
// React 18), not a manual onClick handler calling togglePopover().
// This distinction is load-bearing, not stylistic: a manual onClick
// handler calling togglePopover() has a real, reproducible bug — the
// trigger sits outside the popover's own DOM subtree, so clicking it
// while open fires the light-dismiss algorithm on `pointerdown` (closing
// the popover) BEFORE the `click` event fires; a handler that then calls
// togglePopover() on click sees an already-closed popover and reopens
// it, so the menu can never be closed by clicking its own trigger a
// second time. Browsers special-case the native invoker mechanism to
// coordinate correctly with light-dismiss (confirmed by reproducing the
// bug with a standalone script, then confirming the native invoker
// property doesn't exhibit it) — this is the actual reason the HTML
// spec recommends invoker attributes/properties over manual
// show/hide/toggle calls for a toggle-style trigger button in the first
// place, not just convenience.
export function useDropdownMenu(items: DropdownMenuItemData[]) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // useId(), sanitized to a valid CSS custom-ident (React's useId()
  // return value contains ":" characters, invalid in a custom-ident):
  // a unique anchor-name per hook instance, so two DropdownMenu
  // instances on the same page never collide (feature 010 fix,
  // mirroring Accordion's identical useId()-based group-name isolation
  // from feature 009).
  const anchorName = `--dropdown-anchor-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  useEffect(() => {
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    if (!panel || !trigger) return;
    panel.popover = "auto";
    trigger.popoverTargetElement = panel;
    trigger.popoverTargetAction = "toggle";
    // anchor-name/position-anchor aren't in this package's pinned
    // TypeScript's DOM lib yet (confirmed: no match in lib.dom.d.ts),
    // unlike popover/showPopover/hidePopover — setProperty() is
    // generically typed on CSSStyleDeclaration and works identically at
    // runtime (verified directly against Chromium/Firefox/WebKit).
    trigger.style.setProperty("anchor-name", anchorName);
    panel.style.setProperty("position-anchor", anchorName);

    function handleToggle(event: ToggleEvent) {
      const open = event.newState === "open";
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
      panelRef.current?.hidePopover();
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
    panelRef.current?.hidePopover();
  }

  return { isOpen, panelRef, triggerRef, itemRefs, onPanelKeyDown, selectItem };
}
