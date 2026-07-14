# Implementation Plan: Localized Input Primitives

**Branch**: `019-localized-input-primitives` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/019-localized-input-primitives/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship 11 masked, self-validating identifier/contact-code input components
(CPF, CNPJ, CEP, Brazilian phone, Título de Eleitor, PIS/PASEP/NIT, vehicle
plate, IBAN, payment card, international phone) across both this catalog's
static HTML gallery and the React package — the first feature since 004 to
add net-new components in both surfaces simultaneously. Every component's
formatting mask and check-digit/checksum algorithm lives in one new
framework-agnostic module (`shared/validators/`, mirroring `shared/
design-tokens.ts`'s existing single-source-of-truth pattern) so the static
HTML `<script type="module">` wiring and the React components consume
identical validation logic — no algorithm is hand-typed twice. Each component
extends the existing `TextInput` error/disabled/`aria-invalid` convention
rather than inventing a new one.

## Technical Context

**Language/Version**: TypeScript 5.6 (shared validators + React), vanilla ES
modules via Vite (static gallery scripts, matching `src/scripts/*.js`'s
existing convention)

**Primary Dependencies**: None new — every check-digit/checksum algorithm in
scope (CPF/CNPJ modulo-11, Título de Eleitor, PIS/PASEP modulo-11, IBAN
mod-97, Luhn for card numbers) is simple, well-documented modular arithmetic
implementable in a few lines with no library; international phone validation
uses a small self-contained static table of country calling codes + expected
national-number length ranges (FR-018 forbids network calls, so no
`libphonenumber-js`-style runtime dependency is needed or justified)

**Storage**: N/A — components are stateless controlled inputs, no persistence

**Testing**: Playwright (`tests/e2e/*.spec.ts` for both the static and React
surfaces, this project's existing convention) plus a unit-test pass on
`shared/validators/` directly (official published test vectors per code
type — SC-002/SC-003) via the project's existing `tsc`/build pipeline

**Target Platform**: Web — both the static HTML gallery (`src/components/`)
and `@professional-design-system/react` consumers

**Project Type**: Component library addition (dual-surface: static + React,
this catalog's established default — no exception needed, unlike feature 020)

**Performance Goals**: Format-as-you-type with no perceptible input lag on
every keystroke (SC-001); validation is synchronous, in-memory arithmetic —
no async work on the input path

**Constraints**: Zero network calls in any component's own validation logic
(FR-018); validity feedback MUST NOT fire before a value reaches its code
type's expected length or the field loses focus (FR-007); assistive-tech
announcements MUST NOT interrupt ongoing typing (FR-019)

**Scale/Scope**: 11 new components + 1 new shared validators module,
spanning 3 priority tiers (P1: CPF/CNPJ/CEP/phone-BR; P2: Título de
Eleitor/PIS-PASEP/vehicle plate; P3: IBAN/card/phone-intl)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Each component is a single labeled field extending `TextInput`'s existing layout — no new hierarchy pattern introduced | PASS |
| II. Absolute Semantic Accessibility (WCAG AAA) | FR-006/FR-016/FR-019 mandate a readable inline error (reusing `TextInput`'s `text-error-strong` AAA-passing token), a machine-readable validity state, and a non-interrupting assistive-tech announcement (`aria-live="polite"` on the error region, matching this catalog's existing dynamic-notification convention) — no new token needed | PASS |
| III. Tailwind-Only Architecture (Zero Parallel CSS) | Every component's markup reuses `TextInput`'s existing `.text-input`/error/label classes verbatim — no new CSS surface | PASS |
| IV. Design Token Discipline (Zero Hardcoding) | No new color/radius/typography token needed — 100% reuse of `TextInput`'s existing token set | PASS |
| V. Interactive State Completeness | FR-017 requires the existing disabled/error state conventions; no new interactive control type (still a text `<input>`) beyond what `TextInput` already declares | PASS |
| VI. Project Language Policy | All code/docs in English (including Portuguese-specific code-type names like "Título de Eleitor" used only as user-facing label text, not identifiers); chat responses in PT-BR | PASS |
| VII. Autonomous Skill Acquisition Protocol | No new external dependency is added (Technical Context above) — every algorithm in scope is self-containable arithmetic, so Principle VII's adoption-review protocol is not triggered this feature | PASS (not applicable) |

No violations — Complexity Tracking section intentionally minimal (see below).

## Project Structure

### Documentation (this feature)

```text
specs/019-localized-input-primitives/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
shared/
└── validators/
    ├── cpf.ts / cnpj.ts / cep.ts / phone-br.ts
    ├── titulo-eleitor.ts / pis-pasep.ts / vehicle-plate.ts
    ├── iban.ts / card-number.ts / phone-intl.ts
    └── index.ts              # re-exports format()/validate() per code type

src/components/                # static HTML gallery (dual-shipping, no
├── cpf-input/cpf-input.html   # exception — unlike feature 020's Recharts
├── cnpj-input/cnpj-input.html # charts, these 11 are plain masked inputs
├── cep-input/...
├── phone-br-input/...
├── titulo-eleitor-input/...
├── pis-pasep-input/...
├── vehicle-plate-input/...
├── iban-input/...
├── card-number-input/...
└── phone-intl-input/...
src/scripts/
└── localized-inputs.js        # imports shared/validators/, wires masking +
                                # validity feedback to [data-*-input] fields
                                # (mirrors pin-input.js's per-component wiring
                                # but delegates the algorithm to shared/)

packages/react/src/
├── CpfInput/ CnpjInput/ CepInput/ PhoneBrInput/
├── TituloEleitorInput/ PisPasepInput/ VehiclePlateInput/
├── IbanInput/ CardNumberInput/ PhoneIntlInput/
└── index.ts                   # new component exports added here

tests/e2e/
├── cpf-input.spec.ts / react-cpf-input.spec.ts   # (+ 10 more pairs, one
└── ...                                            # static + one React per
                                                    # component, existing
                                                    # per-component convention
```

**Structure Decision**: Dual-surface addition (static HTML gallery + React
package), this catalog's default convention — no exception needed, unlike
feature 020's React-only Recharts charts. The one new architectural element
is `shared/validators/`: a framework-agnostic TypeScript module holding every
code type's pure `format()`/`validate()` functions, imported directly by both
`src/scripts/localized-inputs.js` (Vite-bundled, so a `.ts` import from a
`.js` script resolves the same way `shared/design-tokens.ts` already does for
`tailwind.config.ts`) and every React component — the single source of truth
so no check-digit algorithm is hand-typed twice across surfaces.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally omitted (see Constitution Check above,
all gates PASS with zero exceptions).
