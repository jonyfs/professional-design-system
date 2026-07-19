import { forwardRef, useId, type InputHTMLAttributes } from "react";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visible label text (optional — omit to render the bare control). */
  label?: string;
}

// React port of src/components/slider/slider.html. A single-thumb native
// <input type="range"> styled via `accent-color` (the `.slider` class).
// All keyboard interaction — arrow stepping, Home/End jump-to-min/max,
// Page Up/Down — is native to the range input, so there is zero JS here.
// This is the single-value sibling of RangeSlider's dual-thumb component.
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const sliderClasses = ["slider mt-2 w-full", className].filter(Boolean).join(" ");

  return (
    <>
      {label && (
        <label htmlFor={sliderId} className="text-sm font-medium text-neutral-900">
          {label}
        </label>
      )}
      <input ref={ref} id={sliderId} type="range" className={sliderClasses} {...rest} />
    </>
  );
});
