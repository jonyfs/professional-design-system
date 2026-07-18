import { useId, type HTMLAttributes, type ReactNode, type RefObject } from "react";
import { useDialogTrigger } from "../hooks/useDialogTrigger";

// aria-labelledby and tabIndex are omitted from the passthrough surface —
// same rationale as ModalProps/SlideOverProps.
export interface BottomSheetProps
  extends Omit<HTMLAttributes<HTMLDialogElement>, "title" | "aria-labelledby" | "tabIndex"> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** `false` renders no focusable content — sets tabindex="-1" on the dialog
   * itself, same as Modal's/Slide-over's Edge Case. */
  hasFocusableContent?: boolean;
  /** Passthrough test id for the internal close-icon button. */
  closeButtonTestId?: string;
  /** Ref to the element that opened this Bottom Sheet — same WebKit
   * focus-return rationale as ModalProps.triggerRef. */
  triggerRef?: RefObject<HTMLElement | null>;
}

// Textually identical to SlideOver.tsx except .bottom-sheet-dialog/
// .bottom-sheet-panel classes instead of .slide-over-dialog/
// .slide-over-panel — same "only the CSS differs" relationship as the
// static HTML contracts (research.md R4: Bottom Sheet reuses
// Slide-over's exact native <dialog> mechanism, no second focus-trap
// implementation).
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  hasFocusableContent = true,
  closeButtonTestId,
  triggerRef,
  className,
  ...rest
}: BottomSheetProps) {
  const dialogRef = useDialogTrigger(open, onClose, triggerRef);
  const titleId = useId();
  const dialogClasses = ["bottom-sheet-dialog", className].filter(Boolean).join(" ");

  return (
    <dialog
      ref={dialogRef}
      className={dialogClasses}
      aria-labelledby={titleId}
      tabIndex={hasFocusableContent ? undefined : -1}
      {...rest}
    >
      <div className="bottom-sheet-panel">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
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
