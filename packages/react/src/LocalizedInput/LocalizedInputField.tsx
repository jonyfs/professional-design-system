import { forwardRef, useEffect, useId, type InputHTMLAttributes } from "react";
import { useValidatedInput, type CodeTypeConfig, type Validity } from "../hooks/useValidatedInput";

export interface LocalizedInputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label: string;
  config: CodeTypeConfig;
  required?: boolean;
  onValidityChange?: (validity: Validity) => void;
}

// Internal shared presentational component every localized input in this
// feature composes (not exported from the package) — extends TextInput's
// exact error/aria-invalid/aria-describedby markup (packages/react/src/
// TextInput/TextInput.tsx) rather than inventing a new pattern (FR-017),
// plus an `aria-live="polite"` error region (FR-019, research.md R10) so
// a validity change is announced without interrupting ongoing typing.
export const LocalizedInputField = forwardRef<HTMLInputElement, LocalizedInputFieldProps>(
  function LocalizedInputField({ label, config, required, onValidityChange, id, className, ...rest }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const { value, validity, errorMessage, handleChange, handleBlur } = useValidatedInput(config, required);
    const isInvalid = validity === "invalid";
    const errorId = isInvalid ? `${inputId}-error` : undefined;

    // Notifies the consumer of validity changes only — deliberately not
    // including onValidityChange itself in the dependency array (an event
    // callback prop, not state this effect reads) to avoid re-running on
    // every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      onValidityChange?.(validity);
    }, [validity]);

    const inputClasses = ["text-input", isInvalid ? "ring-error focus:ring-error" : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <>
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-900">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={isInvalid ? "true" : undefined}
          aria-describedby={errorId}
          className={inputClasses}
          {...rest}
        />
        {isInvalid && errorMessage && (
          <p id={errorId} aria-live="polite" className="text-xs text-error-strong mt-1 font-medium">
            {errorMessage}
          </p>
        )}
      </>
    );
  },
);
