import { useId, type SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Visible label text — see contracts/002-form-primitives-round-2/select.contract.md */
  label: string;
  /** When present, renders the AAA-safe inline error and sets aria-invalid/aria-describedby */
  error?: string;
  options: SelectOption[];
}

export function Select({ label, error, options, id, className, ...rest }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = error ? `${selectId}-error` : undefined;
  const selectClasses = [
    "form-select",
    error ? "ring-error focus:ring-error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Fragment, not an owned wrapper div — same fix as TextInput (found by
  // the same visual-parity test failure): spacing belongs to the
  // consumer's container, not doubled up inside the component too.
  return (
    <>
      <label htmlFor={selectId} className="text-sm font-medium text-neutral-900">
        {label}
      </label>
      <select
        id={selectId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={selectClasses}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-xs text-error-strong mt-1 font-medium">
          {error}
        </p>
      )}
    </>
  );
}
