# Component Contract: Core Brazilian Fields (CPF, CNPJ, CEP, Phone-BR) — User Story 1

## Components
`CpfInput`, `CnpjInput`, `CepInput`, `PhoneBrInput` (React:
`packages/react/src/{Cpf,Cnpj,Cep,PhoneBr}Input/`; static:
`src/components/{cpf,cnpj,cep,phone-br}-input/`), each backed by its
`shared/validators/{cpf,cnpj,cep,phone-br}.ts` Code Type Definition.

## Props (React shape; static HTML uses equivalent `data-*` attributes)
Extends `TextInputProps` (label, error, disabled, ...rest) — no new props
beyond:
- `required?: boolean` — gates FR-008's empty-field exemption.
- `onValidityChange?: (validity: "not-yet-evaluated" | "valid" | "invalid") => void`

## Markup contract
Identical structure to `TextInput` (label → input → conditional error `<p>`),
with the error `<p>` given `aria-live="polite"` (research.md R10) in addition
to the existing `id`/`aria-describedby` wiring. `inputMode="numeric"` on the
underlying `<input>` for all four (all-digit entry) to trigger a numeric
keyboard on mobile.

## Required behavior (FR mapping)
- On every keystroke: strip non-digits, apply `format()`, update the visible
  value — never format on a paste differently than on typed input
  (research.md R9, FR-009).
- Validity is evaluated (and `error`/`aria-invalid` set) only once
  `rawValue.length` reaches the type's `expectedLength` or on blur (FR-007);
  never marked invalid while empty unless `required` (FR-008).
- CPF/CNPJ: reject all-repeated-digit values explicitly, before the
  weighted-sum check (FR-005, research.md R2).
- CEP: format-only, no check-digit (FR-003).
- Phone-BR: format switches between landline/mobile patterns purely by
  digit count, 10 → `(00) 0000-0000`, 11 → `(00) 00000-0000` (FR-004).
- Backspacing through an auto-inserted separator removes one logical digit,
  never gets stuck on punctuation the user didn't type (spec.md Edge Cases).

## Acceptance mapping
- Spec.md US1 AC1–AC5 → this contract.
- FR-001–FR-009, FR-016, FR-017, FR-018, FR-019 → this contract.
