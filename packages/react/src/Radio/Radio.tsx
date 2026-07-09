import { useId, type InputHTMLAttributes } from "react";

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label text — see contracts/002-form-primitives-round-2/radio.contract.md */
  label: string;
  /** Shared across a group for native mutual exclusivity — no custom JS */
  name: string;
  /**
   * Wrapper alignment — the static HTML contract's long-label Edge Case
   * uses `items-start` (so a wrapped multi-line label aligns to the
   * input's top) instead of the default `items-center`.
   */
  wrapperClassName?: string;
}

export function Radio({
  label,
  name,
  id,
  className,
  wrapperClassName,
  disabled,
  ...rest
}: RadioProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputClasses = ["radio-input", disabled ? "peer" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName ?? "flex items-center gap-2"}>
      <input
        id={inputId}
        type="radio"
        name={name}
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
