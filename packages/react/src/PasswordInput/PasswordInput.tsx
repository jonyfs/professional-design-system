import { useId, useRef, useState, type InputHTMLAttributes } from "react";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visible label text (contracts/form-inputs.contract.md, feature 023). */
  label: string;
}

// Direct React port of src/scripts/password-input.js. TextInput's shell plus
// a trailing icon button that flips `type` between "password" and "text".
//
// React makes the "don't lose value/cursor" guarantee easy: because we only
// change the `type` prop (never the element's key or identity), React
// reconciles the same DOM node — value, focus, and caret are preserved by
// construction. We still restore the selection range in the click handler as
// belt-and-braces, since a bare `type` flip can collapse the selection in
// some engines. The button's aria-label always names the NEXT action.
export function PasswordInput({ label, id, className, ...rest }: PasswordInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputClasses = [
    "block w-full rounded-md border-0 bg-neutral-50 py-1.5 pr-11 text-neutral-900 shadow-sm",
    "ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-600",
    "focus:ring-2 focus:ring-inset focus:ring-brand",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "sm:text-sm sm:leading-6",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  function toggle() {
    const input = inputRef.current;
    const start = input?.selectionStart ?? null;
    const end = input?.selectionEnd ?? null;
    setVisible((prev) => !prev);
    // Restore caret/selection + focus after the re-render commits.
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      if (start !== null && end !== null) {
        try {
          el.setSelectionRange(start, end);
        } catch {
          /* type without text selection support — nothing to restore */
        }
      }
    });
  }

  return (
    <>
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-900">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type={visible ? "text" : "password"}
          className={inputClasses}
          {...rest}
        />
        <button
          type="button"
          data-testid="password-input-toggle"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          disabled={rest.disabled}
          onClick={toggle}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-600
            hover:text-neutral-900 active:text-neutral-900
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {visible ? (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M3.3 2.3a1 1 0 0 0-1.4 1.4l2.1 2.1A11 11 0 0 0 1.4 9.7a.8.8 0 0 0 0 .6C2.8 13.6 6.1 16 10 16a10 10 0 0 0 3.6-.7l3.1 3.1a1 1 0 0 0 1.4-1.4L3.3 2.3Zm7.8 10.6A3 3 0 0 1 7.1 8.9l1.3 1.3a1 1 0 0 0 1.4 1.4l1.3 1.3ZM10 6c.4 0 .8 0 1.1.1L7.4 2.4A11 11 0 0 1 10 2c3.9 0 7.2 2.4 8.6 5.7a.8.8 0 0 1 0 .6 11 11 0 0 1-2.4 3.4l-2.9-2.9A4 4 0 0 0 10 6Z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 4c-3.9 0-7.2 2.4-8.6 5.7a.8.8 0 0 0 0 .6C2.8 13.6 6.1 16 10 16s7.2-2.4 8.6-5.7a.8.8 0 0 0 0-.6C17.2 6.4 13.9 4 10 4Zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
