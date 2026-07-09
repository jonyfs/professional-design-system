import { useId, type HTMLAttributes, type ReactNode, type RefObject } from "react";
import { useDialogTrigger } from "../hooks/useDialogTrigger";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title"> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** `false` renders no focusable content — sets tabindex="-1" on the dialog
   * itself so focus has a valid, non-lost target (see contracts/003-overlays-modal-toast/modal.contract.md). */
  hasFocusableContent?: boolean;
  /** Passthrough test id for the internal close-icon button, which the
   * component owns and a consumer otherwise has no way to target. */
  closeButtonTestId?: string;
  /**
   * Ref to the element that opened this Modal, so focus can return to it
   * on close. Strongly recommended: without it, focus-return falls back
   * to `document.activeElement` at open time, which is unreliable in
   * WebKit specifically — WebKit does not focus a `<button>` on mouse
   * click (only on keyboard activation), so a mouse-triggered open would
   * silently have nothing to focus on close (found empirically, not
   * assumed — see useDialogTrigger.ts).
   */
  triggerRef?: RefObject<HTMLElement | null>;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  hasFocusableContent = true,
  closeButtonTestId,
  triggerRef,
  className,
  ...rest
}: ModalProps) {
  const dialogRef = useDialogTrigger(open, onClose, triggerRef);
  // useId(), not a hardcoded literal: a Modal instantiated more than once
  // on the same page (any real app with several dialogs, and this
  // project's own test harness) would otherwise produce duplicate DOM ids
  // and broken aria-labelledby semantics from the second instance onward
  // — caught by /speckit-analyze before this became the reference every
  // other overlay component copied.
  const titleId = useId();
  const dialogClasses = ["modal-dialog", className].filter(Boolean).join(" ");

  return (
    <dialog
      ref={dialogRef}
      className={dialogClasses}
      aria-labelledby={titleId}
      tabIndex={hasFocusableContent ? undefined : -1}
      {...rest}
    >
      <div className="modal-panel">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          {/* Omitted (not just hidden) when hasFocusableContent is false —
              the contract's empty-content Edge Case demo has NO close
              button at all (only a heading + paragraph). Rendering it
              unconditionally would give the dialog a focusable descendant
              even in the "no focusable content" case, so showModal()'s
              native autofocus would land on the button instead of the
              dialog's own tabindex="-1" fallback — defeating the entire
              point of the Edge Case (found by the empty-content tests
              actually failing, not assumed). */}
          {hasFocusableContent && (
            <form method="dialog">
              <button
                type="submit"
                aria-label="Close"
                className="close-icon-btn"
                data-testid={closeButtonTestId}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </form>
          )}
        </div>
        {children}
      </div>
    </dialog>
  );
}
