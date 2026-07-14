import { stripNonAlphanumeric, type ValidationResult } from "./common";

const LEGACY_PATTERN = /^[A-Z]{3}[0-9]{4}$/;
const MERCOSUL_PATTERN = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

export function format(rawValue: string): string {
  const chars = stripNonAlphanumeric(rawValue).toUpperCase().slice(0, 7);
  if (chars.length <= 3) return chars;
  const letters = chars.slice(0, 3);
  const rest = chars.slice(3);
  // Mercosul's 5th character (index 4 overall, index 1 of `rest`) is a
  // letter; the legacy plate's is a digit — detected as soon as it's
  // typed, format-only (no check-digit exists for either pattern).
  if (rest.length >= 2 && /[A-Z]/.test(rest[1])) {
    return `${letters}${rest}`; // Mercosul: AAA0A00, no separator
  }
  return `${letters}-${rest}`; // legacy: AAA-0000
}

export function isComplete(rawValue: string): boolean {
  return stripNonAlphanumeric(rawValue).length === 7;
}

export function validate(rawValue: string): ValidationResult {
  const chars = stripNonAlphanumeric(rawValue).toUpperCase();
  if (LEGACY_PATTERN.test(chars) || MERCOSUL_PATTERN.test(chars)) {
    return { valid: true };
  }
  return { valid: false, reason: "Vehicle plate does not match the legacy (AAA-0000) or Mercosul (AAA0A00) pattern." };
}
