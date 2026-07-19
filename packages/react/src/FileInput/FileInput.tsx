import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visible label text (optional). */
  label?: string;
  /** Overrides the default drop-zone body (icon + copy). */
  children?: ReactNode;
}

// React port of src/components/file-input/file-input.html + the filename
// wiring in src/scripts/file-input.js. A native <input type="file"> laid
// transparently over a styled drop-zone: click-to-browse is native; the
// `.file-input-native:focus-visible ~ .file-drop-zone-content` and
// `:disabled ~ .file-drop-zone-content` sibling selectors drive the
// focus outline + disabled dimming purely in CSS. The one piece of real
// interactivity — surfacing the chosen filename — is handled in React
// state (the native filename chrome is invisible under opacity-0).
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { label, children, id, className, onChange, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [filename, setFilename] = useState("");

  const inputClasses = ["file-input-native", className].filter(Boolean).join(" ");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFilename(file ? file.name : "");
    onChange?.(event);
  }

  return (
    <>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-900">
          {label}
        </label>
      )}
      <div className="file-drop-zone mt-2" data-testid="file-drop-zone">
        <input
          ref={ref}
          id={inputId}
          type="file"
          className={inputClasses}
          onChange={handleChange}
          {...rest}
        />
        <div className="file-drop-zone-content">
          {children ?? (
            <>
              <svg
                aria-hidden="true"
                className="h-8 w-8 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5 5 5M12 5v12" />
              </svg>
              <p className="text-sm text-neutral-600">
                <span className="font-medium text-brand-dark">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-neutral-600">PNG, JPG, or PDF up to 10MB</p>
            </>
          )}
        </div>
      </div>
      {filename && (
        <p className="mt-2 text-sm text-neutral-600" data-testid="file-input-filename">
          {filename}
        </p>
      )}
    </>
  );
});
