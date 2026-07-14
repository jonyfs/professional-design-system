# Phase 1 Data Model: Localized Input Primitives

## Code Type Definition (one per `shared/validators/*.ts` module)

- **id**: stable identifier (e.g. `cpf`, `iban`).
- **expectedLength**: the raw digit/character count the value must reach
  before pass/fail validity is evaluated (research.md R8).
- **displayMask**: the formatting pattern applied on every keystroke (e.g.
  `000.000.000-00`).
- **hasCheckDigit**: boolean — `false` only for CEP and vehicle plate
  (format-only validation, research.md R3/R5); `true` for every other type.
- **validate(rawValue: string) → ValidationResult**: pure function running
  the type's official algorithm (or shape-only regex where
  `hasCheckDigit` is `false`).
- **format(rawValue: string) → string**: pure function applying
  `displayMask`, paste-normalization-safe (research.md R9).
- Relationship: exactly 11 Code Type Definitions exist for this feature
  (spec.md Assumptions' fixed scope) — CPF, CNPJ, CEP, Brazilian phone,
  Título de Eleitor, PIS/PASEP/NIT, vehicle plate, IBAN, payment card,
  international phone (10 listed — international phone's `expectedLength`
  is a per-country range, not a single number, see below).

## Validated Code Field (one per rendered component instance)

- **rawValue**: the untrusted, unformatted digit/character sequence the
  user has typed or pasted so far.
- **formattedValue**: `codeType.format(rawValue)` — what the `<input>`
  actually displays.
- **codeType**: which Code Type Definition this field instance is bound to.
- **validity**: one of `not-yet-evaluated` / `valid` / `invalid` —
  `not-yet-evaluated` until `rawValue.length` reaches `expectedLength` or
  the field blurs (FR-007); never `invalid` for an empty value unless the
  consuming form marks the field `required` (FR-008).
- **errorMessage**: present only when `validity === "invalid"` — a
  human-readable reason (e.g. "CPF inválido — dígito verificador incorreto")
  sourced from `ValidationResult.reason`.
- Relationship: every Validated Code Field exposes `validity` through a
  form-readable prop/attribute (FR-016) — React components via a
  `validity`/`onValidityChange` prop, static HTML via a `data-validity`
  attribute `localized-inputs.js` keeps in sync.

## Validation Result

- **valid**: boolean.
- **reason**: present only when `valid === false` — a stable, human-readable
  string per failure mode (e.g. distinct reasons for "wrong length" vs.
  "fails check-digit" vs. "all-repeated-digit trap"), satisfying SC-004
  ("identify why a value was rejected from the inline message alone").

## International Phone's variant shape

- International phone's Code Type Definition additionally holds a
  **countryTable**: `Array<{ countryCode: string; callingCode: string;
  nationalLengthRange: [number, number] }>` (research.md R7) — `validate()`
  for this type looks up the selected country's range rather than using a
  single fixed `expectedLength`.

## Cross-cutting invariants

- No component ever calls a network API as part of `validate()`/`format()`
  (FR-018) — every Code Type Definition is a pure, synchronous function.
- No component reports `invalid` before `rawValue` reaches `expectedLength`
  (or the type-specific range, for international phone) or the field blurs
  (FR-007), and never reports an empty, non-required field as `invalid`
  (FR-008).
- Every component's error region is `aria-live="polite"` (research.md R10)
  and reuses `TextInput`'s exact `aria-invalid`/`aria-describedby`/
  `text-error-strong` pattern (FR-006, FR-017) — no new error-display
  pattern invented.
