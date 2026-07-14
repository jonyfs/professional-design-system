import {
  groupDigits,
  isRepeatedDigitSequence,
  stripNonDigits,
  weightedModulo11,
  type ValidationResult,
} from "./common";

export const CNPJ_LENGTH = 14;

export function format(rawValue: string): string {
  const digits = stripNonDigits(rawValue).slice(0, CNPJ_LENGTH);
  return groupDigits(digits, [2, 3, 3, 4, 2], [".", ".", "/", "-"]);
}

// Official Receita Federal modulo-11 algorithm for CNPJ — same family as
// CPF (research.md R2), its own weight sequence over a 12-digit base.
export function isComplete(rawValue: string): boolean {
  return stripNonDigits(rawValue).length === CNPJ_LENGTH;
}

export function validate(rawValue: string): ValidationResult {
  const digits = stripNonDigits(rawValue);
  if (digits.length !== CNPJ_LENGTH) {
    return { valid: false, reason: `CNPJ must have ${CNPJ_LENGTH} digits.` };
  }
  if (isRepeatedDigitSequence(digits)) {
    return { valid: false, reason: "CNPJ cannot be a single digit repeated." };
  }

  const nums = digits.split("").map(Number);
  const d13 = weightedModulo11(nums.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d14 = weightedModulo11(nums.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  if (d13 !== nums[12] || d14 !== nums[13]) {
    return { valid: false, reason: "CNPJ check digits do not match." };
  }
  return { valid: true };
}
