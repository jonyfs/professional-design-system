import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export interface PopoverProps {
  /** Trigger content — the visible button contents. */
  trigger: ReactNode;
  /** Arbitrary floating-panel content. */
  children: ReactNode;
  /**
   * Controlled open state. Omit for an uncontrolled Popover (the default —
   * the native Popover API drives open/close/light-dismiss on its own).
   * When provided, the panel is kept in sync with this value.
   */
  open?: boolean;
  /** Fired on every open/close transition (click, Escape, outside-click,
   * or trigger removal). Required to observe state in the uncontrolled case
   * and to drive it in the controlled case. */
  onOpenChange?: (open: boolean) => void;
  triggerTestId?: string;
  panelTestId?: string;
}

// Content-agnostic click-triggered floating panel (contracts/
// popover.contract.md, feature 014) — the native Popover API provides
// top-layer rendering, Escape-to-close, and outside-click light-dismiss
// for free. The trigger<->panel relationship is wired via the NATIVE
// invoker properties (popoverTargetElement/popoverTargetAction), never a
// manual onClick calling togglePopover(): a manual handler has a real,
// reproducible bug where clicking the trigger while open re-opens instead
// of closing it (see useDropdownMenu.ts's extensive comment on why).
//
// Beyond aria-expanded sync and close-time focus-return, this adds a
// MutationObserver watching the trigger's removal from the DOM — native
// popover="auto" panels do NOT auto-close when their invoker is removed
// (e.g. a deleted list row), which would otherwise strand the panel open
// with no way to dismiss it (research.md R10).
export function Popover({
  trigger,
  children,
  open,
  onOpenChange,
  triggerTestId,
  panelTestId,
}: PopoverProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  // useId() sanitized to a valid CSS custom-ident (React's value contains
  // ":"): a unique anchor-name per instance so two Popovers never collide,
  // mirroring useDropdownMenu's identical isolation.
  const anchorName = `--popover-anchor-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  // Native invoker wiring + per-instance anchor names. anchor-name/
  // position-anchor aren't in this package's pinned TS DOM lib, so
  // setProperty() (generically typed) is used, exactly as useDropdownMenu.
  useEffect(() => {
    const panel = panelRef.current;
    const triggerEl = triggerRef.current;
    if (!panel || !triggerEl) return;
    panel.popover = "auto";
    triggerEl.popoverTargetElement = panel;
    triggerEl.popoverTargetAction = "toggle";
    triggerEl.style.setProperty("anchor-name", anchorName);
    panel.style.setProperty("position-anchor", anchorName);
  }, [anchorName]);

  // The panel's native `toggle` event is the single source of truth for
  // every open/close path (click, Escape, light-dismiss, trigger removal).
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    function handleToggle(event: ToggleEvent) {
      const nextOpen = event.newState === "open";
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
      if (!nextOpen) triggerRef.current?.focus();
    }
    panel.addEventListener("toggle", handleToggle);
    return () => panel.removeEventListener("toggle", handleToggle);
  }, [onOpenChange]);

  // Close the panel if the trigger is removed from the DOM while open.
  useEffect(() => {
    const triggerEl = triggerRef.current;
    const panel = panelRef.current;
    if (!triggerEl || !panel) return;
    const parent = triggerEl.parentElement;
    if (!parent) return;
    const observer = new MutationObserver(() => {
      if (!parent.contains(triggerEl) && panel.matches(":popover-open")) {
        panel.hidePopover();
      }
    });
    observer.observe(parent, { childList: true });
    return () => observer.disconnect();
  }, []);

  // Controlled sync: drive the native popover from the `open` prop.
  useEffect(() => {
    if (!isControlled) return;
    const panel = panelRef.current;
    if (!panel) return;
    const isPanelOpen = panel.matches(":popover-open");
    if (open && !isPanelOpen) panel.showPopover();
    else if (!open && isPanelOpen) panel.hidePopover();
  }, [open, isControlled]);

  const expanded = isControlled ? open : internalOpen;

  return (
    <div className="relative inline-block">
      {/* No onClick: the trigger<->panel relationship is the native invoker
          mechanism (set imperatively above), required — not optional — to
          avoid the click-reopens-while-open bug. */}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className="btn-secondary"
        aria-expanded={expanded}
        aria-haspopup="dialog"
        data-testid={triggerTestId}
      >
        {trigger}
      </button>
      <div
        ref={panelRef}
        aria-labelledby={triggerId}
        className="popover-panel"
        data-testid={panelTestId}
      >
        {children}
      </div>
    </div>
  );
}
