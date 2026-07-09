import { useId, type InputHTMLAttributes } from "react";

export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label text — see contracts/002-form-primitives-round-2/toggle.contract.md */
  label: string;
}

export function Toggle({ label, id, className, ...rest }: ToggleProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const wrapperClasses = [
    "group inline-flex items-center gap-2",
    rest.disabled ? "cursor-not-allowed" : "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label htmlFor={inputId} className={wrapperClasses}>
      <span className="relative inline-flex h-6 w-11 items-center">
        <input id={inputId} type="checkbox" className="peer sr-only" {...rest} />
        <span className="toggle-track"></span>
        <span className="toggle-dot"></span>
      </span>
      <span className="text-sm text-neutral-900 group-has-[:disabled]:opacity-50">{label}</span>
    </label>
  );
}
