import {
  groupDigits,
  isRepeatedDigitSequence,
  stripNonDigits,
  weightedModulo11,
  type ValidationResult,
} from "./common";

export const CPF_LENGTH = 11;

export function format(rawValue: string): string {
  const digits = stripNonDigits(rawValue).slice(0, CPF_LENGTH);
  return groupDigits(digits, [3, 3, 3, 2], [".", ".", "-"]);
}

// Official Receita Federal modulo-11 algorithm (research.md R2): two check
// digits, each a weighted sum of the preceding digits.
export function isComplete(rawValue: string): boolean {
  return stripNonDigits(rawValue).length === CPF_LENGTH;
}

export function validate(rawValue: string): ValidationResult {
  const digits = stripNonDigits(rawValue);
  if (digits.length !== CPF_LENGTH) {
    return { valid: false, reason: `CPF must have ${CPF_LENGTH} digits.` };
  }
  if (isRepeatedDigitSequence(digits)) {
    return { valid: false, reason: "CPF cannot be a single digit repeated." };
  }

  const nums = digits.split("").map(Number);
  const d10 = weightedModulo11(nums.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d11 = weightedModulo11(nums.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

  if (d10 !== nums[9] || d11 !== nums[10]) {
    return { valid: false, reason: "CPF check digits do not match." };
  }
  return { valid: true };
}
