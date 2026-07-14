# Quickstart: Localized Input Primitives

## Prerequisites
- `shared/validators/` module builds cleanly (`npm run typecheck`).
- `packages/react` builds cleanly (`npm run build --workspace packages/react`).
- Root Vite build succeeds (`npm run build`) for the static gallery pages.

## Setup
```bash
npm install
npm run typecheck
npm run build --workspace packages/react
npm run build
```

## Validate: format-as-you-type with zero manual punctuation (SC-001)
1. Open `src/components/cpf-input/cpf-input.html` (or the React demo
   equivalent) in a browser.
2. Type 11 raw digits with no punctuation; confirm the field displays
   `000.000.000-00` on every keystroke with no perceptible lag.
3. Repeat for CNPJ, CEP, and Brazilian phone (10 vs. 11 digits →
   landline/mobile).

## Validate: known-invalid values are rejected (SC-002)
```bash
npx playwright test tests/e2e/cpf-input.spec.ts tests/e2e/cnpj-input.spec.ts tests/e2e/card-number-input.spec.ts
```
Expected: a documented set of known-invalid CPF/CNPJ/card values —
including all-repeated-digit sequences (e.g. `111.111.111-11`) — are all
reported invalid.

## Validate: known-valid values are accepted (SC-003)
Run the same suites above plus `iban-input.spec.ts`, `pis-pasep-input.spec.ts`,
and `titulo-eleitor-input.spec.ts` against each standard's officially
published valid test values. Expected: 100% accepted.

## Validate: error message is self-explanatory (SC-004)
Manually (or via a Playwright text assertion) confirm a rejected CPF/IBAN/
card value shows an inline message naming the specific failure (e.g. "fails
check-digit" vs. "wrong length") without needing external documentation.

## Validate: accessibility, zero regressions (SC-006)
```bash
npx playwright test tests/e2e/ --grep "localized-input|cpf-input|cnpj-input|cep-input|phone-br-input|titulo-eleitor|pis-pasep|vehicle-plate|iban-input|card-number-input|phone-intl-input"
npm run audit:contrast
```
Expected: 0 axe-core violations across all 11 components (both static and
React surfaces), 0 new `check-contrast.mjs` failures.

## Validate: offline-capable, no network calls (FR-018)
With devtools network tab open (or Playwright's `page.route('**/*', ...)`
assertion), type a complete value into every component and confirm zero
outgoing requests are triggered by validation.

## Full success-criteria trace
See `spec.md`'s Success Criteria (SC-001–SC-006) and `data-model.md`'s
Cross-cutting invariants for the complete list this quickstart validates
against.
