import { forwardRef, useId, type InputHTMLAttributes } from "react";

export interface ColorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visible label text (optional — omit to render the bare control). */
  label?: string;
}

// React port of src/components/color-input/color-input.html. A native
// <input type="color"> (the `.color-input` class) — a full OS-level color
// picker, complete keyboard operability, and a real 7-char hex value, all
// for free with zero JS. Distinct from ColorSwatch, which is a static
// non-interactive color chip.
export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(function ColorInput(
  { label, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputClasses = ["color-input mt-2", className].filter(Boolean).join(" ");

  return (
    <>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-900">
          {label}
        </label>
      )}
      <input ref={ref} id={inputId} type="color" className={inputClasses} {...rest} />
    </>
  );
});
