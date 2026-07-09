import { forwardRef, useId, type InputHTMLAttributes } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label text — see contracts/001-primitive-components/text-input.contract.md */
  label: string;
  /** When present, renders the AAA-safe inline error and sets aria-invalid/aria-describedby */
  error?: string;
}

// forwardRef: ref-based form libraries (React Hook Form's register(), Formik,
// or a consumer imperatively calling .focus()) need a DOM ref on the actual
// <input>. A plain function component silently drops any ref passed to it.
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, error, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const inputClasses = [
    "text-input",
    error ? "ring-error focus:ring-error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // A Fragment, not an owned wrapper div: the static HTML contract's
  // `space-y-1` spacing lives on the *consumer's* section/container
  // element, not inside the component. An earlier draft wrapped this in
  // its own `<div className="space-y-1">`, which — nested inside a
  // consumer's own `space-y-1` container (exactly how every demo/contract
  // usage is structured) — doubled the vertical gap and broke pixel
  // parity with the static reference (measured 88px vs. 84px tall for the
  // identical default-state demo).
  return (
    <>
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-900">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        type="text"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={inputClasses}
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
