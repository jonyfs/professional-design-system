import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue"> {
  /** Visible label text (contracts/form-inputs.contract.md, feature 023). */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  /** Uncontrolled initial value. */
  defaultValue?: number | "";
}

// Direct React port of src/scripts/number-input.js. TextInput's exact shell
// plus two <button> steppers; clamping to [min, max] happens on blur for a
// typed value (spec.md Edge Cases — clamping mid-keystroke fights the caret)
// and immediately on a stepper click. Each stepper disables at its bound.
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { label, min, max, step = 1, defaultValue = "", disabled, id, className, onChange, onBlur, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [value, setValue] = useState<number | "">(defaultValue);

  function clamp(next: number): number {
    let result = next;
    if (min !== undefined && result < min) result = min;
    if (max !== undefined && result > max) result = max;
    return result;
  }

  function nudge(direction: 1 | -1) {
    if (disabled) return;
    const base = value === "" ? (min ?? 0) : value;
    const next = value === "" ? clamp(base) : clamp(base + direction * step);
    setValue(next);
  }

  const numericValue = value === "" ? null : value;
  const incrementDisabled = disabled || (max !== undefined && numericValue !== null && numericValue >= max);
  const decrementDisabled = disabled || (min !== undefined && numericValue !== null && numericValue <= min);

  const inputClasses = [
    "block w-full rounded-md border-0 bg-neutral-50 py-1.5 pr-16 text-neutral-900 shadow-sm",
    "ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-600",
    "focus:ring-2 focus:ring-inset focus:ring-brand",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "sm:text-sm sm:leading-6",
    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const stepperClasses =
    "flex h-6 w-6 items-center justify-center rounded-sm text-neutral-600 hover:text-neutral-900 active:text-neutral-900 " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-900">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={value}
          className={inputClasses}
          {...rest}
          onChange={(event) => {
            const raw = event.target.value;
            setValue(raw === "" ? "" : Number.parseFloat(raw));
            onChange?.(event);
          }}
          onBlur={(event) => {
            if (value !== "" && Number.isFinite(value)) {
              const clamped = clamp(value);
              if (clamped !== value) setValue(clamped);
            }
            onBlur?.(event);
          }}
        />
        <div className="absolute inset-y-0 right-1 flex items-center gap-0.5">
          <button
            type="button"
            data-testid="number-input-decrement"
            aria-label="Decrement"
            disabled={decrementDisabled}
            className={stepperClasses}
            onClick={() => nudge(-1)}
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            data-testid="number-input-increment"
            aria-label="Increment"
            disabled={incrementDisabled}
            className={stepperClasses}
            onClick={() => nudge(1)}
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
});
