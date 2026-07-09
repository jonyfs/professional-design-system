import { forwardRef, useId, type InputHTMLAttributes } from "react";

export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label text — see contracts/002-form-primitives-round-2/toggle.contract.md */
  label: string;
}

// forwardRef — same rationale as TextInput: form libraries need a DOM ref
// on the actual <input>.
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, id, className, disabled, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const wrapperClasses = [
    "group inline-flex items-center gap-2",
    disabled ? "cursor-not-allowed" : "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label htmlFor={inputId} className={wrapperClasses}>
      <span className="relative inline-flex h-6 w-11 items-center">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className="peer sr-only"
          {...rest}
        />
        <span className="toggle-track"></span>
        <span className="toggle-dot"></span>
      </span>
      <span className="text-sm text-neutral-900 group-has-[:disabled]:opacity-50">{label}</span>
    </label>
  );
});
