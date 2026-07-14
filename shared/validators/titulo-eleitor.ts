import { isRepeatedDigitSequence, stripNonDigits, type ValidationResult } from "./common";

export const TITULO_ELEITOR_LENGTH = 12;

export function format(rawValue: string): string {
  return stripNonDigits(rawValue).slice(0, TITULO_ELEITOR_LENGTH);
}

// Official TSE (Tribunal Superior Eleitoral) check-digit algorithm
// (research.md R4): 8-digit sequential number + 2-digit state (UF) code +
// 2 check digits. This implements the standard, most commonly published
// version of the algorithm; some references document an additional
// special-case adjustment for the São Paulo/Minas Gerais UF codes that
// this implementation does not include, since it could not be verified
// with full confidence against an authoritative source — flagged here
// rather than silently guessed at.
export function isComplete(rawValue: string): boolean {
  return stripNonDigits(rawValue).length === TITULO_ELEITOR_LENGTH;
}

export function validate(rawValue: string): ValidationResult {
  const digits = stripNonDigits(rawValue);
  if (digits.length !== TITULO_ELEITOR_LENGTH) {
    return { valid: false, reason: `Título de Eleitor must have ${TITULO_ELEITOR_LENGTH} digits.` };
  }
  if (isRepeatedDigitSequence(digits)) {
    return { valid: false, reason: "Título de Eleitor cannot be a single digit repeated." };
  }

  const nums = digits.split("").map(Number);
  const sequencial = nums.slice(0, 8);
  const uf = nums.slice(8, 10);
  const [dv1Actual, dv2Actual] = nums.slice(10, 12);

  const sum1 = sequencial.reduce((total, digit, i) => total + digit * (i + 2), 0);
  let dv1 = sum1 % 11;
  if (dv1 === 10) dv1 = 0;

  const sum2 = uf[0] * 7 + uf[1] * 8 + dv1 * 9;
  let dv2 = sum2 % 11;
  if (dv2 === 10) dv2 = 0;

  if (dv1 !== dv1Actual || dv2 !== dv2Actual) {
    return { valid: false, reason: "Título de Eleitor check digits do not match." };
  }
  return { valid: true };
}
