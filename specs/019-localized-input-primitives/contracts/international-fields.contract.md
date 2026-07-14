# Component Contract: International Codes (IBAN, Payment Card, International Phone) — User Story 3

## Components
`IbanInput`, `CardNumberInput`, `PhoneIntlInput`, backed by
`shared/validators/{iban,card-number,phone-intl}.ts`.

## Props
Same base shape as the other two contracts
(contracts/core-brazilian-fields.contract.md,
contracts/extended-brazilian-fields.contract.md) — `PhoneIntlInput`
additionally takes:
- `countryCode: string` — selects the active entry from `phone-intl.ts`'s
  static country table (data-model.md "International Phone's variant shape").
- `onCountryChange?: (countryCode: string) => void`

## Markup contract
Same label/input/error/`aria-live="polite"` structure as the other two
contracts. `PhoneIntlInput` additionally renders a country selector (reuses
this catalog's existing `Select` component) immediately before the number
`<input>`, displaying the selected country's calling code as a fixed prefix
inside or directly adjacent to the input (spec.md US3 AC3).

## Required behavior (FR mapping)
- IBAN: accepts input/paste with or without spaces, normalizes to uppercase,
  strips spaces, groups into 4-character blocks for display, validates via
  ISO 13616 mod-97 (FR-013, research.md R6, R9).
- Payment card: groups into 4-digit blocks, validates via Luhn (FR-014,
  research.md R7).
- International phone: displays the selected country's calling code
  alongside the typed national number, validates overall length against
  that country's `nationalLengthRange` (FR-015, research.md R7) — no
  national-number formatting-rule validation beyond length, no network
  lookup (FR-018).
- Same FR-007/FR-008 validation-timing rule — international phone's
  "expected length" is the selected country's range, not a fixed number
  (data-model.md).

## Acceptance mapping
- Spec.md US3 AC1–AC3 → this contract.
- FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019 → this contract.
