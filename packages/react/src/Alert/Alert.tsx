export interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  message: string;
  onDismiss?: () => void;
  "data-testid"?: string;
}

// Feature 044 visual pass: each severity icon seats in a tinted circular
// chip (bg-*/10 + rounded-full + padding on the svg itself, box-content so
// the 20px glyph keeps its size) — a small depth layer that matches the
// static alert.html markup exactly.
const VARIANT_ICON_CLASSES: Record<AlertProps["variant"], string> = {
  success: "rounded-full bg-success/10 p-1.5 box-content text-success-strong",
  error: "rounded-full bg-error/10 p-1.5 box-content text-error-strong",
  warning: "rounded-full bg-warning/10 p-1.5 box-content text-warning-strong",
  info: "rounded-full bg-info/10 p-1.5 box-content text-info-strong",
};

const VARIANT_ICON_PATHS: Record<AlertProps["variant"], string> = {
  success:
    "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z",
  error:
    "M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z",
  warning:
    "M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  info: "M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z",
};

// Direct port of alert.html (feature 006/007) — static page-level
// notice, no role="status"/aria-live (unlike Toast). onDismiss is a
// callback, not internal DOM removal (research.md R6): a React
// component doesn't remove itself from a list it doesn't own, matching
// Toast's own already-shipped precedent, not alert.js's `.remove()`.
export function Alert({ variant, message, onDismiss, "data-testid": testId }: AlertProps) {
  return (
    <div data-testid={testId} className={`alert alert-${variant}`}>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`h-5 w-5 shrink-0 ${VARIANT_ICON_CLASSES[variant]}`}
        aria-hidden="true"
      >
        <path fillRule="evenodd" d={VARIANT_ICON_PATHS[variant]} clipRule="evenodd" />
      </svg>
      <p className="flex-1 text-sm font-medium text-neutral-900">{message}</p>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          className="close-icon-btn"
          onClick={onDismiss}
          data-testid={testId && `${testId}-dismiss`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      )}
    </div>
  );
}
