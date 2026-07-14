# Component Contract: Extended Brazilian Identifiers (Título de Eleitor, PIS/PASEP, Vehicle Plate) — User Story 2

## Components
`TituloEleitorInput`, `PisPasepInput`, `VehiclePlateInput`, following the
identical file-layout convention as
contracts/core-brazilian-fields.contract.md's four components, backed by
`shared/validators/{titulo-eleitor,pis-pasep,vehicle-plate}.ts`.

## Props
Same shape as contracts/core-brazilian-fields.contract.md (extends
`TextInputProps` + `required` + `onValidityChange`).

## Markup contract
Identical to contracts/core-brazilian-fields.contract.md — same
label/input/error/`aria-live="polite"` structure, no divergence. Vehicle
Plate uses no `inputMode="numeric"` (mixed letters+digits) while Título de
Eleitor and PIS/PASEP do.

## Required behavior (FR mapping)
- Título de Eleitor: 12-digit value validated against its official
  check-digit algorithm (FR-010, research.md R4).
- PIS/PASEP: 11-digit value formatted `000.00000.00-0`, validated against
  its official check-digit algorithm (FR-011, research.md R4).
- Vehicle Plate: recognizes legacy (`AAA-0000`) vs. Mercosul (`AAA0A00`)
  pattern from the entered character shape, format-only (no check-digit
  exists) — FR-012, research.md R5.
- Same FR-007/FR-008 validation-timing and FR-009 paste-normalization rules
  as Story 1's fields — no divergent timing model.

## Acceptance mapping
- Spec.md US2 AC1–AC3 → this contract.
- FR-010, FR-011, FR-012, FR-016, FR-017, FR-018, FR-019 → this contract.
