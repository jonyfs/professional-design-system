import { useEffect, useId, useRef, useState } from "react";

// Reuses the same native invoker wiring useDropdownMenu establishes
// (popoverTargetElement/popoverTargetAction set imperatively, not a manual
// onClick togglePopover() — see useDropdownMenu's own comment for the
// reproducible bug that pattern avoids: a manual handler re-opens the
// popover instead of closing it when clicking the trigger while open).
// Notification Center's panel lists static, non-interactive items, so
// this hook omits useDropdownMenu's roving-focus/selectItem machinery —
// there's nothing here for arrow keys to move focus between.
export function useNotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const anchorName = `--notification-anchor-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  useEffect(() => {
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    if (!panel || !trigger) return;
    panel.popover = "auto";
    trigger.popoverTargetElement = panel;
    trigger.popoverTargetAction = "toggle";
    trigger.style.setProperty("anchor-name", anchorName);
    panel.style.setProperty("position-anchor", anchorName);

    function handleToggle(event: ToggleEvent) {
      setIsOpen(event.newState === "open");
    }

    panel.addEventListener("toggle", handleToggle);
    return () => panel.removeEventListener("toggle", handleToggle);
  }, [anchorName]);

  return { isOpen, panelRef, triggerRef };
}
