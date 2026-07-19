import { forwardRef, useId, type TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label text. */
  label: string;
  /** When present, renders the AAA-safe inline error and sets aria-invalid/aria-describedby. */
  error?: string;
}

// React port of src/components/textarea/textarea.html. Mirrors TextInput's
// label + native control + inline error shell, over a multi-line
// <textarea>. `resize-y` locks resizing to the vertical axis only
// (computed `resize: vertical`); the error variant swaps the neutral ring
// for the error ring and links a visible message via aria-describedby.
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className, rows = 4, ...rest },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;

  const textareaClasses = [
    "mt-1 block w-full resize-y rounded-md border-0 py-1.5 text-neutral-900 shadow-sm",
    "ring-1 ring-inset placeholder:text-neutral-600 focus:ring-2 focus:ring-inset",
    "disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm sm:leading-6",
    error ? "ring-error focus:ring-error" : "ring-neutral-300 focus:ring-brand",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // A Fragment, not an owned wrapper div: the static HTML contract's
  // `space-y-1` spacing lives on the consumer's section element, mirroring
  // TextInput exactly (see its comment for the pixel-parity rationale).
  return (
    <>
      <label htmlFor={textareaId} className="text-sm font-medium text-neutral-900">
        {label}
      </label>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={textareaClasses}
        {...rest}
      />
      {error && (
        <p id={errorId} className="text-xs text-error-strong mt-1 font-medium">
          {error}
        </p>
      )}
    </>
  );
});
