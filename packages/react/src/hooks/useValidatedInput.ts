import { useState, type ChangeEvent } from "react";
import type { ValidationResult } from "../../../../shared/validators";

export type Validity = "not-yet-evaluated" | "valid" | "invalid";

export interface CodeTypeConfig {
  format: (raw: string) => string;
  validate: (raw: string) => ValidationResult;
  isComplete: (raw: string) => boolean;
}

export interface UseValidatedInputResult {
  value: string;
  validity: Validity;
  errorMessage?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
}

// Shared timing/state logic for every localized input component (FR-006/
// FR-007/FR-008/FR-016/FR-019, data-model.md Validated Code Field) — a
// value is only ever evaluated for pass/fail once it reaches its code
// type's expected length or the field has blurred at least once, and an
// empty, non-required field is never reported invalid. `config.format`
// re-applies the mask on every keystroke (paste-safe, research.md R9)
// since every validator module's `format()` internally strips and
// re-groups the raw input regardless of what punctuation the user typed
// or pasted.
export function useValidatedInput(config: CodeTypeConfig, required = false): UseValidatedInputResult {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(config.format(event.target.value));
  };
  const handleBlur = () => setTouched(true);

  let validity: Validity = "not-yet-evaluated";
  let errorMessage: string | undefined;

  if (value.length === 0) {
    if (required && touched) {
      validity = "invalid";
      errorMessage = "This field is required.";
    }
  } else if (config.isComplete(value) || touched) {
    const result = config.validate(value);
    validity = result.valid ? "valid" : "invalid";
    errorMessage = result.reason;
  }

  return { value, validity, errorMessage, handleChange, handleBlur };
}
