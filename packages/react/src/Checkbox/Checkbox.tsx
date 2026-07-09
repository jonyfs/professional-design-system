import { useId, type InputHTMLAttributes } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label text — see contracts/001-primitive-components/checkbox.contract.md */
  label: string;
}

export function Checkbox({ label, id, className, disabled, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputClasses = ["checkbox-input", disabled ? "peer" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex items-center gap-2">
      <input
        id={inputId}
        type="checkbox"
        disabled={disabled}
        className={inputClasses}
        {...rest}
      />
      <label
        htmlFor={inputId}
        className={
          disabled
            ? "text-sm text-neutral-900 peer-disabled:opacity-50"
            : "text-sm text-neutral-900 cursor-pointer"
        }
      >
        {label}
      </label>
    </div>
  );
}
