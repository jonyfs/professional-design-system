import { useEffect, useId, useRef } from "react";

export interface MenubarItemData {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface MenubarMenuData {
  id: string;
  /** Top-level trigger label (File, Edit, View, …). */
  label: string;
  items: MenubarItemData[];
  triggerTestId?: string;
  panelTestId?: string;
}

export interface MenubarProps {
  menus: MenubarMenuData[];
  ariaLabel?: string;
  testId?: string;
}

// Horizontal application menu bar (contracts/menubar.contract.md, feature
// 016). Composes two layers:
//   1. Per top-level trigger: the exact Dropdown Menu mechanics — native
//      Popover-API invoker (popoverTargetElement/Action), toggle-driven
//      focus-init (first item on open) / focus-return (trigger on close),
//      aria-expanded sync, and in-panel ArrowUp/Down/Tab roving.
//   2. Between triggers: a roving-tabindex layer (Left/Right/Home/End, and
//      Down/Enter to open) adapted from the tabs roving pattern.
//
// The between-trigger keydown listener sits on the menubar container and
// relies on bubbling: once a panel opens, focus moves INTO its first item,
// so a per-trigger listener would never see ArrowLeft/ArrowRight again —
// the container catches it wherever focus currently is. A single
// showPopover() on a sibling auto-popover closes whichever one is open as
// one atomic native operation (no explicit hidePopover() race), and a
// generation guard drops a second keypress that lands before the first
// transition settles, so a rapid double-arrow can never corrupt the
// focus/panel state (feature 016 code-review finding, HIGH).
export function Menubar({ menus, ariaLabel = "Application menu", testId }: MenubarProps) {
  const menubarRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[][]>([]);
  // Imperative generation counters (persist across renders, mutate in place)
  // exactly like the vanilla menubar.js — React state would batch/defer
  // these and defeat the synchronous same-keypress guard.
  const generation = useRef(0);
  const settledGeneration = useRef(0);
  const idPrefix = useId().replace(/[^a-zA-Z0-9-]/g, "");

  // Per-trigger Dropdown Menu wiring: native invoker, per-instance anchor
  // names, and the toggle-driven focus-init/return + aria-expanded sync.
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    menus.forEach((menu, i) => {
      const trigger = triggerRefs.current[i];
      const panel = panelRefs.current[i];
      if (!trigger || !panel) return;
      const anchorName = `--menubar-anchor-${idPrefix}-${i}`;
      panel.popover = "auto";
      trigger.popoverTargetElement = panel;
      trigger.popoverTargetAction = "toggle";
      trigger.style.setProperty("anchor-name", anchorName);
      panel.style.setProperty("position-anchor", anchorName);

      function handleToggle(event: ToggleEvent) {
        const open = event.newState === "open";
        trigger?.setAttribute("aria-expanded", String(open));
        if (open) {
          const items = itemRefs.current[i] ?? [];
          const firstEnabled = items.find((el, j) => el && !menu.items[j]?.disabled);
          firstEnabled?.focus();
        } else {
          trigger?.focus();
        }
      }
      panel.addEventListener("toggle", handleToggle);
      cleanups.push(() => panel.removeEventListener("toggle", handleToggle));
    });
    return () => cleanups.forEach((fn) => fn());
  }, [menus, idPrefix]);

  function panelOpen(i: number) {
    return panelRefs.current[i]?.matches(":popover-open") ?? false;
  }

  function focusTrigger(index: number) {
    triggerRefs.current.forEach((t, i) => {
      if (t) t.tabIndex = i === index ? 0 : -1;
    });
    triggerRefs.current[index]?.focus();
  }

  // In-panel roving (ArrowUp/Down among enabled items, Tab closes) — the
  // Dropdown Menu panel behavior. ArrowLeft/ArrowRight are deliberately NOT
  // handled here so they bubble to the container's between-trigger layer.
  function onPanelKeyDown(menuIndex: number, event: React.KeyboardEvent) {
    const menu = menus[menuIndex];
    const items = itemRefs.current[menuIndex] ?? [];
    const enabled = menu.items.reduce<number[]>((acc, item, j) => {
      if (!item.disabled) acc.push(j);
      return acc;
    }, []);
    const currentIndex = items.findIndex((el) => el === document.activeElement);
    const posInEnabled = enabled.indexOf(currentIndex);
    const lastEnabled = enabled.length - 1;
    if (event.key === "ArrowDown") {
      items[enabled[posInEnabled === lastEnabled ? 0 : posInEnabled + 1]]?.focus();
    } else if (event.key === "ArrowUp") {
      items[enabled[posInEnabled <= 0 ? lastEnabled : posInEnabled - 1]]?.focus();
    } else if (event.key === "Tab") {
      panelRefs.current[menuIndex]?.hidePopover();
      return;
    } else {
      return;
    }
    event.preventDefault();
  }

  // Between-trigger roving on the container (bubbling-based).
  function onMenubarKeyDown(event: React.KeyboardEvent) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End", "ArrowDown"].includes(event.key)) return;

    // A transition from an earlier keypress hasn't reached its final focus
    // placement yet — ignore this one rather than starting an overlapping
    // second transition.
    if (settledGeneration.current !== generation.current) {
      event.preventDefault();
      return;
    }

    const currentIndex = triggerRefs.current.findIndex(
      (t, i) =>
        t === document.activeElement ||
        panelRefs.current[i]?.contains(document.activeElement),
    );
    if (currentIndex === -1) return;
    const last = triggerRefs.current.length - 1;

    // ArrowDown only opens THIS trigger's panel (focus is then moved into
    // the panel's first item by the per-trigger toggle listener) — it never
    // switches which trigger is current.
    if (event.key === "ArrowDown") {
      if (!panelOpen(currentIndex)) panelRefs.current[currentIndex]?.showPopover();
      event.preventDefault();
      return;
    }

    let newIndex: number;
    if (event.key === "ArrowRight") newIndex = currentIndex === last ? 0 : currentIndex + 1;
    else if (event.key === "ArrowLeft") newIndex = currentIndex === 0 ? last : currentIndex - 1;
    else if (event.key === "Home") newIndex = 0;
    else newIndex = last;

    const wasOpen = triggerRefs.current.some((_, i) => panelOpen(i));
    const newPanel = panelRefs.current[newIndex];
    const myGeneration = ++generation.current;

    function settle() {
      focusTrigger(newIndex);
      settledGeneration.current = myGeneration;
    }

    if (wasOpen && newPanel) {
      // showPopover() on a sibling auto-popover atomically closes the open
      // one. The per-trigger toggle listener (registered first) reacts by
      // focusing the new panel's first item; this once-listener (registered
      // second) then overrides that, landing final focus on the TRIGGER —
      // arrow navigation moves between top-level triggers, not into a panel.
      newPanel.addEventListener("toggle", settle, { once: true });
      newPanel.showPopover();
    } else {
      settle();
    }

    event.preventDefault();
  }

  return (
    <div
      ref={menubarRef}
      role="menubar"
      aria-label={ariaLabel}
      data-menubar
      data-testid={testId}
      className="menubar"
      onKeyDown={onMenubarKeyDown}
    >
      {menus.map((menu, i) => {
        const triggerId = `${idPrefix}-trigger-${i}`;
        return (
          <div key={menu.id} className="relative inline-block">
            <button
              ref={(el) => (triggerRefs.current[i] = el)}
              id={triggerId}
              type="button"
              role="menuitem"
              aria-expanded={false}
              aria-haspopup="menu"
              tabIndex={i === 0 ? 0 : -1}
              className="menubar-trigger"
              data-testid={menu.triggerTestId}
            >
              {menu.label}
            </button>
            <div
              ref={(el) => (panelRefs.current[i] = el)}
              role="menu"
              aria-labelledby={triggerId}
              className="dropdown-menu-panel"
              data-testid={menu.panelTestId}
              onKeyDown={(event) => onPanelKeyDown(i, event)}
            >
              {menu.items.map((item, j) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    (itemRefs.current[i] ??= [])[j] = el;
                  }}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  className="dropdown-menu-item"
                  data-testid={item.id}
                  onClick={() => {
                    if (item.disabled) return;
                    item.onSelect();
                    panelRefs.current[i]?.hidePopover();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
