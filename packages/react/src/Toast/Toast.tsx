import type { HTMLAttributes } from "react";

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  variant: "success" | "error" | "info";
  message: string;
  onDismiss: () => void;
}

// Feature 044 visual pass: severity icon in a tinted circular chip (bg-*/10 +
// rounded-full + padding on the svg, box-content to preserve the 20px glyph),
// matching the static toast.html markup.
const VARIANT_ICON_CLASSES: Record<ToastProps["variant"], string> = {
  success: "rounded-full bg-success/10 p-1.5 box-content text-success-strong",
  error: "rounded-full bg-error/10 p-1.5 box-content text-error-strong",
  info: "rounded-full bg-brand/10 p-1.5 box-content text-brand-dark",
};

// Per-severity left accent rail, applied to the toast container so the stack
// reads as a color-coded set at a glance (matches toast.html).
const VARIANT_BORDER_CLASSES: Record<ToastProps["variant"], string> = {
  success: "border-success",
  error: "border-error",
  info: "border-brand",
};

// Deliberately NOT a <dialog> — Toast is non-modal (research.md/data-model.md:
// "no internal DOM removal, unlike toast.js, since a React component
// doesn't remove itself from a list it doesn't own"). onDismiss is the
// consumer's signal to stop rendering this Toast (typical React
// unidirectional data flow), a deliberate deviation from the static
// version's `toast.js`, which called `.remove()` on the DOM node directly
// since there was no framework-level list to own the removal.
export function Toast({ variant, message, onDismiss, className, ...rest }: ToastProps) {
  const classes = ["toast", VARIANT_BORDER_CLASSES[variant], className].filter(Boolean).join(" ");
  return (
    <div role="status" aria-live="polite" className={classes} {...rest}>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`h-5 w-5 shrink-0 ${VARIANT_ICON_CLASSES[variant]}`}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clipRule="evenodd"
        />
      </svg>
      <p className="flex-1 text-sm font-medium text-neutral-900">{message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        className="close-icon-btn"
        data-testid="toast-close"
        onClick={onDismiss}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>
  );
}
