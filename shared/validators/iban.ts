import { stripNonAlphanumeric, type ValidationResult } from "./common";

// ISO 13616 mod-97-10 checksum, computed via chunked remainder (research.md
// R6) since JS numbers lose precision on the very long numeric strings a
// full IBAN converts to — no BigInt precedent exists elsewhere in this
// catalog, so this avoids introducing one for a single call site.
function mod97(numericString: string): number {
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + Number(numericString[i])) % 97;
  }
  return remainder;
}

function letterToDigits(char: string): string {
  if (/[0-9]/.test(char)) return char;
  return String(char.toUpperCase().charCodeAt(0) - 55); // A=10 ... Z=35
}

export function format(rawValue: string): string {
  const chars = stripNonAlphanumeric(rawValue).toUpperCase();
  return chars.replace(/(.{4})/g, "$1 ").trim();
}

export function isComplete(rawValue: string): boolean {
  const length = stripNonAlphanumeric(rawValue).length;
  return length >= 15 && length <= 34;
}

export function validate(rawValue: string): ValidationResult {
  const chars = stripNonAlphanumeric(rawValue).toUpperCase();
  if (chars.length < 15 || chars.length > 34) {
    return { valid: false, reason: "IBAN must be between 15 and 34 characters." };
  }
  if (!/^[A-Z]{2}[0-9A-Z]+$/.test(chars)) {
    return { valid: false, reason: "IBAN must start with a 2-letter country code." };
  }

  const rearranged = chars.slice(4) + chars.slice(0, 4);
  const numeric = rearranged
    .split("")
    .map(letterToDigits)
    .join("");

  if (mod97(numeric) !== 1) {
    return { valid: false, reason: "IBAN fails the mod-97 checksum." };
  }
  return { valid: true };
}
