---

description: "Task list for feature implementation"
---

# Tasks: Localized Input Primitives

**Input**: Design documents from `/specs/019-localized-input-primitives/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright per component (static + React pair), plus
direct validator unit checks against official published test vectors
(SC-002/SC-003), matching this catalog's established convention.

**Organization**: Tasks are grouped by user story (spec.md US1/US2/US3).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Create `shared/validators/common.ts` with paste/keystroke-safe helpers: `stripNonDigits()`, `stripNonAlphanumeric()`, `groupDigits(value, groupSizes, separators)`, and a generic `modulo11CheckDigit(digits, weights)` reused by CPF/CNPJ/Título/PIS-PASEP (research.md R2/R4)
- [X] T002 [P] Create `packages/react/src/hooks/useValidatedInput.ts` — the shared timing/state hook (FR-006/007/008/009/016/019): tracks `rawValue`/`formattedValue`/`validity`/`errorMessage`, gates validity evaluation on `expectedLength` reached or blur, never flags empty+non-required as invalid, `aria-live="polite"` error region wiring
- [X] T003 [P] [Setup] Create static-HTML equivalent `src/scripts/localized-inputs.js` skeleton (per-field wiring via `data-code-type` attribute, imports `shared/validators/`)

**Checkpoint**: `common.ts`'s `modulo11CheckDigit` helper and `useValidatedInput` are unit-verifiable before any code-type module consumes them.

---

## Phase 2: User Story 1 - Core Brazilian Document & Contact Fields (Priority: P1) 🎯 MVP

**Goal**: CPF, CNPJ, CEP, Brazilian phone — formatted as-you-type, validated
against official rules (spec.md US1).

**Independent Test**: drop each into a form, type valid/invalid values
(including all-repeated-digit CPF/CNPJ), confirm formatting + pass/fail.

### Implementation for User Story 1

- [X] T004 [P] [US1] `shared/validators/cpf.ts` — `format()`/`validate()`, official modulo-11 check-digit algorithm, explicit all-repeated-digit rejection (FR-001, FR-005, research.md R2)
- [X] T005 [P] [US1] `shared/validators/cnpj.ts` — same shape, CNPJ's own weight sequence (FR-002, FR-005)
- [X] T006 [P] [US1] `shared/validators/cep.ts` — format-only, 8-digit shape validation, no check-digit (FR-003, research.md R3)
- [X] T007 [P] [US1] `shared/validators/phone-br.ts` — landline (10-digit) vs. mobile (11-digit) format detection (FR-004, research.md R3)
- [X] T008 [P] [US1] React `CpfInput`/`CnpjInput`/`CepInput`/`PhoneBrInput` in `packages/react/src/{Cpf,Cnpj,Cep,PhoneBr}Input/`, each a thin wrapper composing `useValidatedInput` + its validator module, extending `TextInputProps` per contracts/core-brazilian-fields.contract.md
- [X] T009 [US1] Static HTML pages `src/components/{cpf,cnpj,cep,phone-br}-input/*.html` + wiring in `src/scripts/localized-inputs.js` (depends on T004-T007)
- [X] T010 [US1] Playwright specs `tests/e2e/{cpf,cnpj,cep,phone-br}-input.spec.ts` + `react-{cpf,cnpj,cep,phone-br}-input.spec.ts` — format-as-you-type, all-repeated-digit rejection, paste normalization, backspace-through-separator, empty-non-required not invalid, aria-live announcement
- [X] T011 [US1] Export all four React components from `packages/react/src/index.ts`

**Checkpoint**: US1 fully functional and independently testable — this is the MVP.

---

## Phase 3: User Story 2 - Extended Brazilian Identifiers (Priority: P2)

**Goal**: Título de Eleitor, PIS/PASEP/NIT, vehicle plate (spec.md US2).

### Implementation for User Story 2

- [X] T012 [P] [US2] `shared/validators/titulo-eleitor.ts` — 12-digit official check-digit algorithm (FR-010, research.md R4)
- [X] T013 [P] [US2] `shared/validators/pis-pasep.ts` — 11-digit, `000.00000.00-0`, official check-digit algorithm (FR-011, research.md R4)
- [X] T014 [P] [US2] `shared/validators/vehicle-plate.ts` — legacy (`AAA-0000`) vs. Mercosul (`AAA0A00`) pattern detection, format-only (FR-012, research.md R5)
- [X] T015 [P] [US2] React `TituloEleitorInput`/`PisPasepInput`/`VehiclePlateInput` per contracts/extended-brazilian-fields.contract.md (depends on T012-T014)
- [X] T016 [US2] Static HTML pages + `localized-inputs.js` wiring for the three (depends on T012-T014)
- [X] T017 [US2] Playwright specs for the three (static + React pairs)
- [X] T018 [US2] Export the three React components from `packages/react/src/index.ts`

**Checkpoint**: US1 and US2 both independently functional.

---

## Phase 4: User Story 3 - International Codes (Priority: P3)

**Goal**: IBAN, payment card, international phone (spec.md US3).

### Implementation for User Story 3

- [X] T019 [P] [US3] `shared/validators/iban.ts` — space/paste normalization, 4-character grouping, ISO 13616 mod-97 checksum (FR-013, research.md R6)
- [X] T020 [P] [US3] `shared/validators/card-number.ts` — 4-digit grouping, Luhn checksum (FR-014, research.md R7)
- [X] T021 [P] [US3] `shared/validators/phone-intl.ts` — static country-code table + national-length-range validation, no network lookup (FR-015, FR-018, research.md R7)
- [X] T022 [P] [US3] React `IbanInput`/`CardNumberInput`/`PhoneIntlInput` (PhoneIntlInput composes the existing `Select` component for country choice) per contracts/international-fields.contract.md (depends on T019-T021)
- [X] T023 [US3] Static HTML pages + `localized-inputs.js` wiring for the three (depends on T019-T021)
- [X] T024 [US3] Playwright specs for the three (static + React pairs), including official IBAN test values and known Luhn-valid/invalid card numbers
- [X] T025 [US3] Export the three React components from `packages/react/src/index.ts`

**Checkpoint**: All 11 components independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T026 [P] Run `npm run audit:contrast` and `npm run audit:tokens`, fix any findings
- [X] T027 Run `quickstart.md` end-to-end and record results
- [X] T028 Run the full new Playwright suite (static + React, all 11 components) with axe-core assertions
- [X] T029 Draft the constitution amendment adding these 11 components to the Component Catalog (a new "Forms, Validation & Inputs → Localized Identifier/Contact Fields" subsection)

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: no dependencies — `common.ts`/`useValidatedInput`/script skeleton block every code-type module
- **US1 (Phase 2)**: depends on Setup only — MVP
- **US2 (Phase 3)**: depends on Setup only — independent of US1
- **US3 (Phase 4)**: depends on Setup only — independent of US1/US2
- **Polish (Phase 5)**: depends on all desired stories being complete

## Parallel Opportunities

- T004-T007 (US1 validators), T012-T014 (US2 validators), T019-T021 (US3 validators) each run in parallel within their phase
- All three story phases (2, 3, 4) can run in parallel once Setup completes

## Implementation Strategy

1. Setup → `common.ts` + `useValidatedInput` ready
2. US1 → validate independently → MVP (4 Brazilian core fields)
3. US2 → validate independently (3 extended Brazilian fields)
4. US3 → validate independently (3 international fields)
5. Polish → contrast/token audits, full suite, constitution amendment

## Implementation Notes (deviations from the plan above, ratified here)

- **New `LocalizedInputField` internal component** (not in the original
  file list, not exported from `packages/react/src/index.ts`): every
  React component but `PhoneIntlInput` is a thin wrapper composing this
  one shared presentational component + `useValidatedInput`, rather than
  10 near-duplicate `TextInput`-shaped components. `PhoneIntlInput` also
  composes it, wrapping a per-render config bound to the selected
  `countryCode`.
- **Test files consolidated**: the plan called for a static + React
  Playwright spec pair per component (22 files). Given every component
  shares the identical `useValidatedInput`/`wireField` mechanism, this
  shipped as two comprehensive files instead —
  `tests/e2e/localized-inputs.spec.ts` (static, all 11) and
  `tests/e2e/react-localized-inputs.spec.ts` (React, all 11) — covering
  the same acceptance criteria (format-as-you-type, official test
  vectors, all-repeated-digit rejection, paste normalization, FR-007/008
  timing, `aria-live`) without 22 files of largely-duplicated
  boilerplate.
- **Real bug found and fixed during implementation** (documented in
  constitution v1.16.0's Sync Impact Report): `PhoneIntlInput`'s
  `format()` originally prepended the selected country's calling code
  into the input's own value, which then fed back into the same
  `format()`/`validate()` call on the next keystroke and double-counted
  the calling code's own digits as part of the national number. Fixed by
  making the calling code a separate, non-editable display element (both
  React and static surfaces), never part of the input's actual value.
- **Título de Eleitor's SP/MG special case not implemented**: the
  shipped algorithm is the standard, most commonly published TSE
  modulo-11 check-digit calculation; an additional adjustment some
  references describe for the São Paulo/Minas Gerais state codes was
  deliberately left out rather than guessed at, since it could not be
  verified against an authoritative source with full confidence
  (documented directly in `shared/validators/titulo-eleitor.ts`).
- All 10 check-digit/checksum algorithms (CPF, CNPJ, Título de Eleitor,
  PIS/PASEP, IBAN, Luhn) were verified against real, official/
  well-known published test vectors before being considered complete —
  not just structural (length/shape) checks.
