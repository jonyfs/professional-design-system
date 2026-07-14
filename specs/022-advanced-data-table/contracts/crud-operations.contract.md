# Component Contract: CRUD Operations (User Story 3)

## Markup contract

- "Add record" affordance: a `.btn-primary` button above the table,
  rendered only when `crud.create` is enabled for this instance —
  absent entirely otherwise (spec.md US3 AC5), never present-but-disabled.
- Per-row actions: up to 3 icon buttons (view/edit/delete) at the end of
  each row (spec.md Research Summary point 9's "≤3 row-level action
  icons" convention) — only the actions this instance's `crud` config
  enables are rendered.
- Create/edit form: rendered inside Modal's existing `.modal-dialog`/
  `.modal-panel` chrome (research.md R7), fields built from `TextInput`/
  `Select` (or their static equivalents), each field's validation error
  using their existing `error`/`aria-invalid`/`aria-describedby` pattern
  (research.md R8, FR-011).
- Delete confirmation: the same Modal chrome, a simple confirm/cancel
  body (no form fields) — reuses `research.md R7`'s mechanism, not a new
  dialog type.

## Required behavior (FR mapping)

- Submitting a valid create form appends the new record to `rows` and
  closes the dialog, reflected in the table immediately (US3 AC1).
- Submitting a valid edit form updates that record in `rows` in place —
  `sortState`/`filterState`/`page`/other rows' `selection` membership
  MUST NOT be reset by an edit (US3 AC2).
- Submitting an invalid create/edit form keeps the dialog open, shows
  field-level errors via `fieldErrors` (data-model.md), and preserves
  every field's currently-entered `values` — no field is cleared because
  another field failed validation (FR-011).
- Triggering delete opens the confirm step before the row is removed
  from `rows` (FR-012); confirming removes it, canceling leaves `rows`
  unchanged and closes the dialog.
- Attempting to close/navigate away from a form with `isDirty === true`
  (data-model.md) MUST warn before discarding it (FR-018) — reuses the
  browser-native `beforeunload`-equivalent confirm pattern this catalog
  has not yet needed elsewhere, or a simple in-app confirm step; either
  satisfies FR-018, exact mechanism decided during implementation.
- Completing any create/edit/delete operation announces a short status
  message via the shared `aria-live="polite"` region (research.md R9,
  FR-016).
- Every form control and action button declares the full hover/active/
  focus-visible/disabled state set (FR-019).

## Acceptance mapping

- Spec.md US3 AC1–AC5 → this contract.
- FR-010, FR-011, FR-012, FR-016 (CRUD portion), FR-018, FR-019 → this
  contract.
