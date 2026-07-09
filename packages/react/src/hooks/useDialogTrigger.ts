import { useEffect, useRef, type RefObject } from "react";

// Direct React port of overlay.js's initDialogTriggers() (feature 003).
// Native <dialog> + showModal() already provides focus trapping,
// Escape-to-close, and background inertness in every target browser — this
// hook adds only what showModal() doesn't do for free: backdrop-click-to-
// close, plus an explicit WebKit focus-return safeguard.
//
// Scoped to one dialog per hook call/component instance (each owns its own
// ref) — the "1:1 trigger↔dialog" bug class feature 003's code review
// found in the imperative version (two triggers sharing one dialog id,
// each attaching its own `close` listener) can't occur here by construction.
export function useDialogTrigger(
  open: boolean,
  onClose: () => void,
  triggerRef?: RefObject<HTMLElement | null>,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const capturedTriggerRef = useRef<Element | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      // Prefer an explicit trigger ref over document.activeElement:
      // overlay.js's vanilla-JS version (feature 003) captured the exact
      // clicked element directly (a closure variable in its own click
      // listener), never inferring it. This React port's first draft used
      // document.activeElement instead — which broke specifically in
      // WebKit, found by direct reproduction: WebKit does not move focus
      // to a <button> on a mouse click (only on keyboard activation, e.g.
      // Tab+Enter/Space), so document.activeElement was still `<body>` at
      // this point for any mouse-triggered open, and the later
      // focus-return call in the `close` handler below had nothing
      // meaningful to focus. An explicit ref sidesteps the ambiguity
      // entirely, matching overlay.js's original directness.
      capturedTriggerRef.current = triggerRef?.current ?? document.activeElement;
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, triggerRef]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      if (capturedTriggerRef.current instanceof HTMLElement) {
        capturedTriggerRef.current.focus();
      }
      onClose();
    };
    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleBackdropClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, [onClose]);

  return dialogRef;
}
