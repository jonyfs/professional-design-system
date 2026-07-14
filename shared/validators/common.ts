export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

// Strips everything except digits — the single normalization pass that
// handles both "paste already-punctuated" and "paste with stray
// characters" edge cases identically (research.md R9): re-applying the
// mask to a digit-only string never double-punctuates and never rejects
// a messy paste outright.
export function stripNonDigits(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

export function stripNonAlphanumeric(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "");
}

// Groups a digit/character string per a fixed size sequence, joining with
// the given separators (one fewer than groupSizes.length). Stops once the
// input is exhausted — a partial in-progress value still formats sensibly
// mid-entry rather than waiting for the full length.
export function groupDigits(value: string, groupSizes: number[], separators: string[]): string {
  let result = "";
  let position = 0;
  for (let i = 0; i < groupSizes.length && position < value.length; i++) {
    const chunk = value.slice(position, position + groupSizes[i]);
    result += chunk;
    position += chunk.length;
    if (position < value.length && i < separators.length) {
      result += separators[i];
    }
  }
  return result;
}

// Generic weighted modulo-11 check-digit algorithm shared by CPF, CNPJ,
// Título de Eleitor, and PIS/PASEP (research.md R2/R4) — each official
// algorithm is "multiply each digit by its weight, sum, mod 11, map the
// remainder to a check digit" with only the weight sequence and the
// remainder-to-digit mapping differing per code type.
export function weightedModulo11(digits: number[], weights: number[]): number {
  const sum = digits.reduce((total, digit, i) => total + digit * weights[i], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

// True iff every digit in the string is identical (e.g. "11111111111") —
// the well-known CPF/CNPJ trap: syntactically valid length, numerically
// excluded by the official algorithm (FR-005, spec.md Edge Cases).
export function isRepeatedDigitSequence(digits: string): boolean {
  return digits.length > 0 && digits.split("").every((d) => d === digits[0]);
}
