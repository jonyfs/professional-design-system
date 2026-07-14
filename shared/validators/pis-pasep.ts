import { groupDigits, stripNonDigits, weightedModulo11, type ValidationResult } from "./common";

export const PIS_PASEP_LENGTH = 11;

export function format(rawValue: string): string {
  const digits = stripNonDigits(rawValue).slice(0, PIS_PASEP_LENGTH);
  return groupDigits(digits, [3, 5, 2, 1], [".", ".", "-"]);
}

// Official Caixa/INSS modulo-11 algorithm (research.md R4) — weighted sum
// of the first 10 digits, one check digit.
export function isComplete(rawValue: string): boolean {
  return stripNonDigits(rawValue).length === PIS_PASEP_LENGTH;
}

export function validate(rawValue: string): ValidationResult {
  const digits = stripNonDigits(rawValue);
  if (digits.length !== PIS_PASEP_LENGTH) {
    return { valid: false, reason: `PIS/PASEP must have ${PIS_PASEP_LENGTH} digits.` };
  }

  const nums = digits.split("").map(Number);
  const checkDigit = weightedModulo11(nums.slice(0, 10), [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  if (checkDigit !== nums[10]) {
    return { valid: false, reason: "PIS/PASEP check digit does not match." };
  }
  return { valid: true };
}
