import { stripNonDigits, type ValidationResult } from "./common";

export function format(rawValue: string): string {
  const digits = stripNonDigits(rawValue).slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

// Standard Luhn algorithm (research.md R7) — shared by Visa/Mastercard/
// Amex/etc., per FR-014.
export function isComplete(rawValue: string): boolean {
  return stripNonDigits(rawValue).length >= 12;
}

export function validate(rawValue: string): ValidationResult {
  const digits = stripNonDigits(rawValue);
  if (digits.length < 12 || digits.length > 19) {
    return { valid: false, reason: "Card number must be between 12 and 19 digits." };
  }

  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  if (sum % 10 !== 0) {
    return { valid: false, reason: "Card number fails the Luhn checksum." };
  }
  return { valid: true };
}
