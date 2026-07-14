import { stripNonDigits, type ValidationResult } from "./common";

export const PHONE_BR_LANDLINE_LENGTH = 10;
export const PHONE_BR_MOBILE_LENGTH = 11;

// Landline (10 digits) vs. mobile (11 digits) is determined purely by
// digit count (FR-004, research.md R3) — no area-code lookup needed.
export function format(rawValue: string): string {
  const digits = stripNonDigits(rawValue).slice(0, PHONE_BR_MOBILE_LENGTH);
  const areaCode = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (digits.length <= 2) return digits.length ? `(${areaCode}` : "";

  const splitAt = digits.length > PHONE_BR_LANDLINE_LENGTH ? 5 : 4;
  const firstBlock = rest.slice(0, splitAt);
  const secondBlock = rest.slice(splitAt);
  return secondBlock ? `(${areaCode}) ${firstBlock}-${secondBlock}` : `(${areaCode}) ${firstBlock}`;
}

export function isComplete(rawValue: string): boolean {
  const length = stripNonDigits(rawValue).length;
  return length === PHONE_BR_LANDLINE_LENGTH || length === PHONE_BR_MOBILE_LENGTH;
}

export function validate(rawValue: string): ValidationResult {
  const digits = stripNonDigits(rawValue);
  if (digits.length !== PHONE_BR_LANDLINE_LENGTH && digits.length !== PHONE_BR_MOBILE_LENGTH) {
    return {
      valid: false,
      reason: `Brazilian phone must have ${PHONE_BR_LANDLINE_LENGTH} (landline) or ${PHONE_BR_MOBILE_LENGTH} (mobile) digits.`,
    };
  }
  return { valid: true };
}
