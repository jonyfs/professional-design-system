import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

export interface PinInputProps {
  /** Number of digit boxes (default 6). */
  length?: number;
  /** Visible legend text for the surrounding fieldset. */
  label?: string;
  /** Controlled value (padded/truncated to `length`). Omit for uncontrolled. */
  value?: string;
  /** Fires with the full joined value on every change. */
  onChange?: (value: string) => void;
  /** Fires once every box is filled. */
  onComplete?: (value: string) => void;
  /** Disables every box. */
  disabled?: boolean;
  "data-testid"?: string;
}

function toBoxes(value: string, length: number): string[] {
  const digits = value.replace(/[^0-9]/g, "").slice(0, length).split("");
  return Array.from({ length }, (_, i) => digits[i] ?? "");
}

// React port of src/components/pin-input/pin-input.html + the focus /
// paste state machine in src/scripts/pin-input.js. Real, separate
// <input> boxes: per-box numeric filtering with auto-advance, Backspace
// retreat on an empty box (clear-in-place on a filled one), and paste
// splitting across the remaining boxes (non-numeric rejected, excess
// truncated). Mirrors PasswordInput's internal-ref pattern for focus
// management.
export function PinInput({
  length = 6,
  label = "Verification code",
  value,
  onChange,
  onComplete,
  disabled,
  "data-testid": testId = "pin-input",
}: PinInputProps) {
  const generatedId = useId();
  const [internal, setInternal] = useState<string[]>(() => toBoxes(value ?? "", length));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const isControlled = value !== undefined;
  const boxes = isControlled ? toBoxes(value, length) : internal;

  function commit(next: string[]) {
    if (!isControlled) setInternal(next);
    const joined = next.join("");
    onChange?.(joined);
    if (next.every((digit) => digit !== "")) onComplete?.(joined);
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const digit = event.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const next = [...boxes];
    next[index] = digit;
    commit(next);
    if (digit && refs.current[index + 1]) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    // Only retreat when the box is already empty; a filled box lets the
    // native Backspace clear the digit in place, keeping focus put.
    if (event.key === "Backspace" && !boxes[index] && refs.current[index - 1]) {
      refs.current[index - 1]?.focus();
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const digits = event.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length - index);
    if (!digits) return;
    const next = [...boxes];
    digits.split("").forEach((digit, offset) => {
      if (index + offset < length) next[index + offset] = digit;
    });
    commit(next);
    const target = Math.min(index + digits.length, length - 1);
    requestAnimationFrame(() => refs.current[target]?.focus());
  }

  return (
    <fieldset className="pin-input mt-8" data-testid={testId}>
      <legend className="text-sm font-medium text-neutral-900">{label}</legend>
      <div className="mt-2 flex gap-2">
        {boxes.map((digit, index) => (
          <input
            key={`${generatedId}-${index}`}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="pin-input-box"
            aria-label={`Digit ${index + 1}`}
            data-testid={`pin-box-${index}`}
            disabled={disabled}
            value={digit}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
          />
        ))}
      </div>
    </fieldset>
  );
}
