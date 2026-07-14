import { stripNonDigits, type ValidationResult } from "./common";

export interface CountryPhoneEntry {
  countryCode: string;
  displayName: string;
  callingCode: string;
  nationalLengthRange: [number, number];
}

// A small, self-contained table covering national significant-number
// length ranges (research.md R7) — deliberately not a full metadata
// library (e.g. libphonenumber-js): FR-015 only requires country-code
// display + overall-length validation, not per-country formatting rules.
export const COUNTRY_PHONE_TABLE: CountryPhoneEntry[] = [
  { countryCode: "BR", displayName: "Brazil", callingCode: "+55", nationalLengthRange: [10, 11] },
  { countryCode: "US", displayName: "United States", callingCode: "+1", nationalLengthRange: [10, 10] },
  { countryCode: "PT", displayName: "Portugal", callingCode: "+351", nationalLengthRange: [9, 9] },
  { countryCode: "GB", displayName: "United Kingdom", callingCode: "+44", nationalLengthRange: [10, 10] },
  { countryCode: "DE", displayName: "Germany", callingCode: "+49", nationalLengthRange: [10, 11] },
  { countryCode: "FR", displayName: "France", callingCode: "+33", nationalLengthRange: [9, 9] },
  { countryCode: "ES", displayName: "Spain", callingCode: "+34", nationalLengthRange: [9, 9] },
  { countryCode: "AR", displayName: "Argentina", callingCode: "+54", nationalLengthRange: [10, 11] },
  { countryCode: "JP", displayName: "Japan", callingCode: "+81", nationalLengthRange: [9, 10] },
  { countryCode: "CN", displayName: "China", callingCode: "+86", nationalLengthRange: [11, 11] },
];

export function getCountryEntry(countryCode: string): CountryPhoneEntry {
  const entry = COUNTRY_PHONE_TABLE.find((c) => c.countryCode === countryCode);
  if (!entry) throw new Error(`Unknown country code: ${countryCode}`);
  return entry;
}

// Returns only the national number's own digits — deliberately does NOT
// prepend the calling code into the returned string. An earlier version
// did, which broke idempotency: the formatted output (e.g. "+1
// 1234567890") fed back into format()/validate() on the next keystroke,
// and stripNonDigits() then counted the calling code's own digits ("1")
// as part of the national number, inflating the digit count. The calling
// code is display-only chrome the consuming component renders alongside
// the input (a fixed prefix), never part of the input's own value.
export function format(rawValue: string, countryCode: string): string {
  getCountryEntry(countryCode); // validates countryCode, throws if unknown
  return stripNonDigits(rawValue);
}

export function isComplete(rawValue: string, countryCode: string): boolean {
  const entry = getCountryEntry(countryCode);
  const digits = stripNonDigits(rawValue);
  return digits.length >= entry.nationalLengthRange[0];
}

export function validate(rawValue: string, countryCode: string): ValidationResult {
  const entry = getCountryEntry(countryCode);
  const digits = stripNonDigits(rawValue);
  const [min, max] = entry.nationalLengthRange;
  if (digits.length < min || digits.length > max) {
    return {
      valid: false,
      reason: `${entry.displayName} phone numbers must be ${min === max ? min : `${min}-${max}`} digits.`,
    };
  }
  return { valid: true };
}
