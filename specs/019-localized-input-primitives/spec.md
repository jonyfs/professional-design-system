# Feature Specification: Localized Input Primitives

**Feature Branch**: `[019-localized-input-primitives]`

**Created**: 2026-07-12

**Status**: Draft

**Input**: User description: "a criacao de componentes para códigos mundiais e brasileiros tais como cep, telefone, cpf com validadores reais de valores, crie componentes com respectivos validadores de conteudo e formatacao. use os principais codigos internacionais e brasieliros, pesquise para saber quais são interessantes adicionar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Brazilian Document & Contact Fields (Priority: P1)

A user filling out a Brazilian registration or checkout form types a CPF
(individual taxpayer number), CNPJ (company taxpayer number), CEP (postal
code), or phone number into a field. As they type, the value is
automatically punctuated into the standard national display format (e.g.
`123.456.789-09`, `12.345.678/0001-95`, `12345-678`,
`(11) 98765-4321`), and once the field holds a complete value the system
tells them immediately whether it is a genuinely valid number — not just
correctly shaped, but one that satisfies the official check-digit rule
(where one exists) — so a mistyped or fabricated number never silently
passes as legitimate.

**Why this priority**: These four codes are the most common identifier
fields on Brazilian-market forms (registration, checkout, KYC, HR
onboarding). Shipping only this story already delivers a complete,
usable MVP for the catalog's primary market.

**Independent Test**: Can be fully tested by dropping each of the four
components into a form, typing a mix of valid and deliberately invalid
values (including well-known invalid edge cases such as all-repeated-digit
CPF/CNPJ sequences), and confirming correct formatting and pass/fail
feedback for each — without any other component in this feature existing
yet.

**Acceptance Scenarios**:

1. **Given** an empty CPF field, **When** the user types 11 digits with
   no punctuation, **Then** the field displays them grouped as
   `000.000.000-00` and reports whether the number's check digits are
   valid.
2. **Given** a CPF field, **When** the user types a value consisting of
   the same digit repeated 11 times (a value that is correctly shaped
   but never a real CPF), **Then** the system reports it as invalid.
3. **Given** an empty CEP field, **When** the user types 8 digits,
   **Then** the field displays them as `00000-000`.
4. **Given** an empty Brazilian phone field, **When** the user types a
   10-digit number, **Then** it is displayed as a landline
   (`(00) 0000-0000`); **When** they instead type an 11-digit number,
   **Then** it is displayed as a mobile number (`(00) 00000-0000`).
5. **Given** a field showing an invalid-value error, **When** the user
   corrects the value to a genuinely valid one, **Then** the error
   message disappears and the field reflects a valid state.

---

### User Story 2 - Extended Brazilian Identifiers (Priority: P2)

A user filling out an HR onboarding, elections-related, or vehicle
registration form enters a voter registration number (Título de
Eleitor), a PIS/PASEP/NIT number, or a vehicle license plate. Each value
is formatted to its standard national display pattern and, where an
official check-digit rule exists, validated against it.

**Why this priority**: Less universal than Story 1's four fields, but
still common enough in Brazilian HR, government-adjacent, and
automotive-sector forms to justify dedicated components rather than
leaving every consuming team to hand-roll their own masking and
validation logic.

**Independent Test**: Can be fully tested independently of Story 1 by
dropping each of these three components into a form and confirming
correct formatting and check-digit validation with known valid/invalid
sample values.

**Acceptance Scenarios**:

1. **Given** an empty Título de Eleitor field, **When** the user types
   12 digits, **Then** the system validates them against the official
   check-digit rule and reports pass/fail.
2. **Given** an empty PIS/PASEP field, **When** the user types 11 digits,
   **Then** the field is formatted as `000.00000.00-0` and validated
   against its check-digit rule.
3. **Given** an empty vehicle plate field, **When** the user types a
   value matching the legacy pattern (3 letters + 4 digits), **Then** it
   is displayed as `AAA-0000`; **When** they instead type a value
   matching the Mercosul pattern (3 letters + 1 digit + 1 letter + 2
   digits), **Then** it is displayed as `AAA0A00`.

---

### User Story 3 - International Codes (Priority: P3)

A user filling out an international payment, banking, or contact form
enters an IBAN, a payment card number, or an international phone number.
Each value is formatted for readability and validated against its public
checksum standard, independent of any single country's rules.

**Why this priority**: Extends the catalog beyond the Brazilian market
to the international use cases the request explicitly asked for, but is
lower priority than Stories 1-2 because Brazilian document fields are
this catalog's most immediate, highest-volume need.

**Independent Test**: Can be fully tested independently by dropping
these three components into a form and confirming correct formatting and
checksum validation with known valid/invalid sample values (official
IBAN test values, standard Luhn-valid/invalid card numbers, and
E.164-formatted phone numbers).

**Acceptance Scenarios**:

1. **Given** an empty IBAN field, **When** the user types or pastes a
   value with or without spaces, **Then** it is normalized into grouped
   4-character blocks and validated against the international checksum
   standard.
2. **Given** an empty payment-card field, **When** the user types a
   card number, **Then** it is grouped into 4-digit blocks and validated
   against the checksum standard used by all major card networks.
3. **Given** an empty international phone field, **When** the user
   selects a country and types a national number, **Then** the value is
   displayed with its country calling code and validated for correct
   overall length.

---

### Edge Cases

- What happens when a user pastes a value that is already fully
  punctuated (e.g. pastes `123.456.789-09` into the CPF field)? The
  field MUST normalize it to the same standard display format rather
  than double-punctuating or rejecting it outright.
- What happens when a user pastes a value containing extra characters
  (stray spaces, letters, or punctuation the field doesn't expect)? The
  system MUST strip non-relevant characters before formatting/validating
  rather than treating the whole paste as invalid.
- How does the system handle a value that is syntactically well-formed
  (correct length and character set) but numerically invalid (fails the
  official check-digit rule)? It MUST be reported as invalid, not merely
  "differently formatted."
- How does the system handle a field left empty when the surrounding
  form does not require that field? An empty value MUST NOT be reported
  as invalid unless the field has been explicitly marked required by the
  consuming form.
- How does the system handle backspacing through an auto-inserted
  separator character (e.g. the `.` or `-` in a CPF)? The deletion MUST
  feel natural — removing one logical digit per backspace, not getting
  stuck on punctuation the user never typed.
- How does the system announce a validity change to assistive
  technology users, given the value updates on every keystroke? The
  error/valid state MUST be announced without interrupting the user's
  typing flow.
- What happens for known "canonical invalid" values that are a common
  real-world trap, such as all-identical-digit CPF/CNPJ numbers (e.g.
  `111.111.111-11`), which are syntactically 11 digits but are
  explicitly excluded by the official algorithm? These MUST be rejected.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a CPF input that auto-formats entered
  digits as `000.000.000-00` and validates the value against the
  official Brazilian CPF check-digit algorithm.
- **FR-002**: System MUST provide a CNPJ input that auto-formats entered
  digits as `00.000.000/0000-00` and validates the value against the
  official Brazilian CNPJ check-digit algorithm.
- **FR-003**: System MUST provide a CEP input that auto-formats entered
  digits as `00000-000` and validates that the value is exactly 8
  numeric digits (CEP has no public check-digit algorithm, so format
  correctness is the full validation).
- **FR-004**: System MUST provide a Brazilian phone input that
  auto-formats a 10-digit value as `(00) 0000-0000` (landline) and an
  11-digit value as `(00) 00000-0000` (mobile), determining which
  pattern applies from the number of digits entered.
- **FR-005**: System MUST reject syntactically well-formed CPF/CNPJ
  values that fail their official check-digit algorithm, including
  values consisting of a single digit repeated across the full length.
- **FR-006**: System MUST surface a clear, human-readable inline error
  message when a value fails validation, and MUST clear that message as
  soon as the field again holds a valid value.
- **FR-007**: System MUST NOT report a value as invalid while it is
  still incomplete (fewer digits than the target code type requires) —
  validation feedback MUST only fire once the value reaches the code
  type's expected length, or when the field loses focus.
- **FR-008**: System MUST NOT report an empty field as invalid unless
  the consuming form has explicitly marked that field as required.
- **FR-009**: System MUST normalize pasted values — stripping
  non-relevant characters and re-applying the component's standard
  formatting — rather than rejecting a paste outright or double-applying
  punctuation.
- **FR-010**: System MUST provide a voter registration (Título de
  Eleitor) input that formats and validates a 12-digit value against its
  official check-digit algorithm.
- **FR-011**: System MUST provide a PIS/PASEP/NIT input that formats an
  11-digit value as `000.00000.00-0` and validates it against its
  official check-digit algorithm.
- **FR-012**: System MUST provide a Brazilian vehicle license plate
  input that recognizes and formats both the legacy pattern (`AAA-0000`)
  and the Mercosul pattern (`AAA0A00`).
- **FR-013**: System MUST provide an IBAN input that normalizes entered
  or pasted values (with or without spaces) into 4-character groups and
  validates them against the international IBAN checksum standard.
- **FR-014**: System MUST provide a payment card number input that
  groups digits into 4-digit blocks and validates the value against the
  checksum standard shared by all major card networks.
- **FR-015**: System MUST provide an international phone input that
  displays a country calling code alongside the national number and
  validates the combined value's length against that country's expected
  range.
- **FR-016**: Every component in this feature MUST expose its current
  validity state (valid / invalid / not-yet-evaluated) in a form the
  surrounding form logic can read, so a form can block submission on an
  invalid required field.
- **FR-017**: Every component in this feature MUST support the
  catalog's existing disabled and error interactive states, matching the
  established Text Input state conventions.
- **FR-018**: System MUST NOT perform network calls to third-party
  lookup services (e.g. postal-code-to-address lookups) as part of a
  component's own validation logic — all validation in this feature MUST
  be self-contained, deterministic, and usable offline.
- **FR-019**: Each component MUST announce validity changes to
  assistive technology in a way that does not interrupt the user's
  ongoing typing.

### Key Entities

- **Validated Code Field**: A single instance of one of this feature's
  input components, holding a raw entered value, its formatted display
  value, its code type, and its current validity state plus an optional
  error message.
- **Code Type Definition**: The reusable formatting mask and validation
  rule for one specific identifier or contact code (e.g. CPF, IBAN),
  independent of any single field instance — defines expected length,
  display pattern, and (where applicable) the check-digit algorithm used
  to confirm a value is genuinely valid rather than merely correctly
  shaped.
- **Validation Result**: The outcome of evaluating one value against a
  Code Type Definition — a pass/fail state plus, on failure, a
  human-readable reason a form can display to the user.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users entering any of this feature's Brazilian code types
  (CPF, CNPJ, CEP, phone) see the value auto-formatted with zero manual
  punctuation required, on every keystroke, with no perceptible input
  lag.
- **SC-002**: 100% of a documented set of known-invalid CPF, CNPJ, and
  card-number test values — including values that are correctly shaped
  but fail their checksum, such as all-repeated-digit sequences — are
  correctly rejected.
- **SC-003**: 100% of a documented set of known-valid CPF, CNPJ, IBAN,
  card-number, PIS/PASEP, and Título de Eleitor test values (drawn from
  each standard's official published examples) are correctly accepted.
- **SC-004**: Users can identify why a value was rejected from the
  inline message alone, without needing to consult external
  documentation.
- **SC-005**: The catalog gains at least 11 new, distinct real-world
  identifier/contact code components spanning both Brazilian and
  international scope by the end of this feature.
- **SC-006**: Every new component meets this catalog's existing
  accessibility bar (contrast, full keyboard operability, and
  screen-reader announcement of validity changes) with zero regressions
  to any previously shipped component.

## Assumptions

- **Component scope for this feature**: based on researching the most
  commonly required identifier/contact codes for Brazilian-market and
  general-international forms, this feature covers 11 code types across
  three priority tiers: CPF, CNPJ, CEP, and Brazilian phone (P1, Story
  1); Título de Eleitor, PIS/PASEP/NIT, and vehicle license plate (P2,
  Story 2); IBAN, payment card number, and international (E.164) phone
  (P3, Story 3). Widely-used codes with no meaningful public checksum or
  standardized universal format (e.g. RG, passport numbers, which vary
  by issuing state/country with no single national algorithm) are
  explicitly out of scope for this feature — they would only ever
  receive free-text entry with no real validation value-add over a plain
  Text Input.
- **One component per code type**: each code type in scope ships as its
  own named, purpose-built component (matching this catalog's existing
  one-component-per-primitive convention), rather than a single generic
  "localized code" component with a runtime country/type switcher.
- **Validation timing**: format-as-you-type is continuous, but
  pass/fail validity feedback only fires once a value reaches its code
  type's expected length or the field loses focus — matching this
  catalog's existing Text Input error-state convention and avoiding
  premature "invalid" flashes while a user is mid-entry.
- **No live external lookups**: this feature does not include
  postal-code-to-address or bank-code-to-institution-name lookups
  against third-party services; every component's validation is
  self-contained and offline-capable (see FR-018).
- **Existing accessibility and token conventions apply unchanged**:
  this feature reuses the catalog's established WCAG AAA contrast,
  interactive-state, and design-token conventions rather than
  introducing new ones.
