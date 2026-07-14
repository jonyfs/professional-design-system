# Component Contract: Form Inputs — NumberInput, PasswordInput, MultiSelect (User Story 1)

## NumberInput

- Markup: reuses TextInput's exact wrapper/label/ring/focus classes,
  `type="number"`, with two `<button type="button">` steppers
  (increment/decrement) positioned inside the same input shell (no new
  border/shadow treatment).
- Behavior: clicking a stepper adjusts `value` by `step`, clamped to
  `[min, max]`; typing a value out of bounds clamps on `blur`, not on
  every keystroke (spec.md Edge Cases — clamping while typing would
  fight the user's cursor).
- Steppers are disabled individually at their respective bound (the
  increment button disables at `max`, decrement at `min`).

## PasswordInput

- Markup: reuses TextInput verbatim plus one icon `<button
  type="button" aria-label="Show password"|"Hide password">` inside the
  input's trailing edge.
- Behavior: clicking the toggle flips `type` between `"password"` and
  `"text"` without re-mounting the input (no value, focus, or cursor-
  position loss — verify empirically per Constitution Principle II,
  since a naive re-render could lose cursor position).
- `aria-label` on the toggle button updates to reflect the action it
  will perform next ("Show password" while hidden, "Hide password"
  while shown), not a static label.

## MultiSelect

- Shared logic: `shared/multi-select/index.ts` — pure functions for
  adding/removing a selection and filtering the option list by `query`,
  consumed identically by `src/scripts/multi-select.js` and
  `packages/react/src/MultiSelect/MultiSelect.tsx` (research.md R3).
- Markup: extends Combobox's existing `role="listbox"`/`role="option"`/
  `aria-selected` pattern; selected options render as removable chips
  (reusing Badge's chip styling) above or inside the input, each chip's
  remove control is a real `<button aria-label="Remove {label}">`.
- Behavior: opening/filtering/arrow-key navigation matches Combobox's
  existing keyboard model exactly (research.md R3) — the only new
  interaction is that selecting an option adds it to `selectedIds`
  instead of replacing a single value, and the options panel stays open
  after a selection (multi-select convention, unlike single-select
  Combobox which closes).
- Empty state: zero selections shows the same placeholder-text
  convention as Select/Combobox (spec.md Edge Cases), not a bare box.

## Acceptance mapping

- Spec.md US1 AC1–AC3 → this contract.
- FR-001, FR-002, FR-003, FR-015, FR-016 → this contract.
