# Phase 0 Research: Localized Input Primitives

All items below were resolvable directly from spec.md's explicit Assumptions
and this project's existing conventions — no NEEDS CLARIFICATION markers
remain in plan.md's Technical Context.

## R1: Shared validators module, not per-surface duplication

- **Decision**: one new `shared/validators/` TypeScript module, one file per
  code type, each exporting a pure `format(rawDigits: string): string` and
  `validate(rawDigits: string): { valid: boolean; reason?: string }` pair.
  Both `src/scripts/localized-inputs.js` (static gallery) and every React
  component import from here directly — no algorithm is reimplemented per
  surface.
- **Rationale**: mirrors `shared/design-tokens.ts`'s already-established
  precedent (feature 004's research.md: "two independently hand-typed copies
  of the same hex values is exactly the kind of drift this project's own
  `/speckit-analyze` passes have caught repeatedly") — the same drift risk
  applies to a check-digit algorithm even more acutely, since a subtly wrong
  copy would silently accept/reject the wrong values on one surface only.
- **Alternatives considered**: duplicating the algorithm once in
  `src/scripts/` (plain JS) and once in `packages/react/src/` (TypeScript)
  — rejected for the drift risk above; a runtime-shared npm package — rejected
  as unnecessary ceremony for an in-repo monorepo module already resolvable
  via a relative import (no publish step needed, unlike the real
  `packages/react` package boundary).

## R2: CPF/CNPJ check-digit algorithm

- **Decision**: implement the official modulo-11 weighted-sum algorithm
  directly (11 digits for CPF: 2 check digits computed from weighted sums of
  the preceding 9/10 digits; CNPJ: 14 digits, same modulo-11 family with its
  own weight sequence). Explicitly reject any value consisting of a single
  digit repeated across the full length (e.g. `00000000000`, `11111111111`)
  before running the weighted-sum check — these are numerically "valid" by
  the raw formula for some repeated-digit sequences but are universally
  treated as invalid by every real-world Brazilian validator, per spec.md's
  explicit edge case and FR-005.
- **Rationale**: this is the single official algorithm (Receita Federal),
  well-documented, and requires no external library — a handful of lines of
  arithmetic. The repeated-digit exclusion is a well-known, explicitly
  spec'd trap (spec.md Edge Cases, US1 AC2) that a naive weighted-sum-only
  implementation would fail.
- **Alternatives considered**: an npm CPF/CNPJ validation package — rejected;
  the algorithm is simple enough that a dependency adds more supply-chain
  surface than it saves, and this catalog's Principle VII diligence is
  easier to satisfy by not needing it at all.

## R3: CEP, Brazilian phone format detection

- **Decision**: CEP is format-only (8 digits, `00000-000`) — spec.md FR-003
  is explicit that CEP has no public check-digit algorithm. Brazilian phone
  auto-detects landline (10 digits → `(00) 0000-0000`) vs. mobile (11 digits
  → `(00) 00000-0000`) purely from input length, per FR-004 — no area-code
  lookup table needed since the pattern depends only on total digit count.
- **Rationale**: directly matches FR-003/FR-004's explicit, exhaustive
  formatting rules — no ambiguity to resolve.

## R4: Título de Eleitor and PIS/PASEP check-digit algorithms

- **Decision**: both use their official modulo-11-family check-digit
  algorithms (Título de Eleitor: 12 digits including state-code-derived
  digits and 2 check digits; PIS/PASEP: 11 digits, `000.00000.00-0`, a
  weighted modulo-11 sum with its own official weight sequence), implemented
  the same way as R2 — pure arithmetic, no library.
- **Rationale**: both are official, publicly documented government
  algorithms (TSE for Título de Eleitor, Caixa/INSS for PIS/PASEP) with
  well-known reference implementations to verify test vectors against
  (SC-003).

## R5: Vehicle plate pattern recognition (legacy vs. Mercosul)

- **Decision**: detect pattern by matching entered characters against two
  regexes — legacy `^[A-Z]{3}\d{4}$` (displayed `AAA-0000`) and Mercosul
  `^[A-Z]{3}\d[A-Z]\d{2}$` (displayed `AAA0A00`) — per FR-012, no
  check-digit exists for either (plates have no public checksum standard).
- **Rationale**: directly matches FR-012's two explicit patterns; plate
  validity is purely shape-based per Brazil's DENATRAN/Mercosul
  specification, no algorithm to run beyond pattern matching.

## R6: IBAN checksum (international, mod-97)

- **Decision**: implement the standard ISO 13616 mod-97-10 checksum
  (rearrange the first 4 characters to the end, convert letters to numbers
  A=10...Z=35, compute the numeric string mod 97, valid iff remainder is 1),
  applied after stripping spaces from the input and normalizing to uppercase.
  Displayed in grouped 4-character blocks per FR-013.
- **Rationale**: mod-97 on an arbitrarily long numeric string requires
  chunked modular arithmetic (JS numbers lose precision beyond ~15-16
  digits) — implemented via iterative remainder computation over string
  chunks, a well-known technique, no library needed. Official IBAN test
  values (spec.md US3 Independent Test) validate the implementation.
- **Alternatives considered**: `BigInt` for the full numeric conversion
  before `% 97n` — viable and arguably simpler; either approach is
  acceptable, chunked-remainder chosen only for not needing a `BigInt`
  browser-support floor check (this catalog otherwise has no `BigInt`
  precedent to extend).

## R7: Payment card checksum (Luhn) and international phone

- **Decision**: standard Luhn algorithm (double every second digit from the
  right, subtract 9 if the result exceeds 9, sum all digits, valid iff the
  total is divisible by 10) for card numbers, grouped in 4-digit blocks per
  FR-014. International phone (FR-015) uses a small static table (country
  code → calling code + expected national-number digit-length range) checked
  entirely client-side — no network call (FR-018), consistent with every
  other component in this feature.
- **Rationale**: Luhn is the universal algorithm shared by Visa/Mastercard/
  Amex/etc. per FR-014's own wording, trivial arithmetic. The international
  phone table only needs to cover length-range validation (FR-015's stated
  bar — "correct overall length"), not full national-number formatting
  rules per country, keeping its scope self-contained and offline-capable.
- **Alternatives considered**: `libphonenumber-js` for full international
  phone validation/formatting — evaluated but rejected as disproportionate:
  FR-015 only requires country-code-prefixed display and overall-length
  validation, not full national significant-number formatting rules per
  country, and adding a ~145KB library for a length check would be a
  Principle VII-reviewable dependency this feature does not actually need.

## R8: Validation timing (format-as-you-type vs. pass/fail feedback)

- **Decision**: formatting mask applies on every keystroke; the
  valid/invalid verdict itself is only computed and surfaced once the raw
  digit count reaches the code type's expected length, or on blur — reusing
  `TextInput`'s existing error-display convention (`error` prop → inline
  message + `aria-invalid`), gated by this timing rule rather than firing
  on every partial keystroke (FR-007).
- **Rationale**: directly matches FR-007/FR-008 and spec.md's Assumptions
  ("Validation timing") — avoids the "invalid" flash a naive
  validate-on-every-keystroke approach would produce mid-entry.

## R9: Paste normalization

- **Decision**: every component's input handler strips all non-alphanumeric
  (or non-digit, where the code type is purely numeric) characters from
  both typed and pasted input before re-applying the mask — so a
  fully-punctuated paste (e.g. `123.456.789-09`) or a paste with stray
  characters normalizes to the same result as digit-only entry (FR-009,
  spec.md Edge Cases).
- **Rationale**: a single strip-then-format pass handles both edge cases
  (already-punctuated paste, paste-with-junk) uniformly — no separate
  branch needed for "was this pasted or typed."

## R10: Assistive-technology announcement without interrupting typing

- **Decision**: the error message region uses `aria-live="polite"`
  (announces after the current speech queue finishes, never interrupts),
  the same mechanism this catalog already uses for dynamic
  notifications/loaders (Principle II's "`aria-live=\"polite\"` on dynamic
  notifications/loaders" mandate) — not `role="alert"`/`aria-live="assertive"`,
  which would interrupt (FR-019).
- **Rationale**: `polite` is the documented ARIA mechanism for exactly this
  "don't interrupt, but do announce" requirement; `assertive` is reserved
  for genuinely urgent interruptions this feature's inline validation is
  not.
