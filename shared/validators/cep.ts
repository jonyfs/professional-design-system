import { groupDigits, stripNonDigits, type ValidationResult } from "./common";

export const CEP_LENGTH = 8;

export function format(rawValue: string): string {
  const digits = stripNonDigits(rawValue).slice(0, CEP_LENGTH);
  return groupDigits(digits, [5, 3], ["-"]);
}

// CEP has no public check-digit algorithm (FR-003) — 8 numeric digits is
// the full validation.
export function isComplete(rawValue: string): boolean {
  return stripNonDigits(rawValue).length === CEP_LENGTH;
}

export function validate(rawValue: string): ValidationResult {
  const digits = stripNonDigits(rawValue);
  if (digits.length !== CEP_LENGTH) {
    return { valid: false, reason: `CEP must have ${CEP_LENGTH} digits.` };
  }
  return { valid: true };
}
