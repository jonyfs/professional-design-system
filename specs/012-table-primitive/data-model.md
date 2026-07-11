# Data Model: Table Primitive

## Table

A semantic `<table>` wrapped in a horizontally-scrollable container.

| Field | Type | Notes |
|---|---|---|
| columns | Table Header Cell[] | Rendered inside `<thead><tr>` |
| rows | Table Row[] | Rendered inside `<tbody>` |

**CSS**: `.data-table-wrapper` — `overflow-x-auto` (research.md R6).
`.data-table` — `min-w-full divide-y divide-neutral-200` applied to the
`<table>` element itself.

## Table Header Cell

| Field | Type | Notes |
|---|---|---|
| label | string | Column heading text |

**CSS**: `.data-table-header-cell` — `bg-neutral-50 px-6 py-3 text-left
text-xs font-semibold text-neutral-600 uppercase tracking-wider`
(7.23:1 AAA against `bg-neutral-50`, research.md R1). Rendered as
`<th scope="col">`.

## Table Row

| Field | Type | Notes |
|---|---|---|
| cells | Table Cell[] | Rendered inside `<tr>` |
| zebraStriped | boolean | Variant-level flag applied uniformly to every `<tr>` in a zebra-striped table — `.data-table-row-zebra`'s `even:bg-neutral-50` (an `nth-child` selector) does the actual per-row alternation, not a per-row true/false value at markup time (User Story 2) |

## Table Cell

| Field | Type | Notes |
|---|---|---|
| content | string | Cell text; truncates with ellipsis if it overflows |
| trailingAction | Badge \| link \| none | Only valid on the last cell in a row (User Story 3) |

**CSS**: `.data-table-cell` — `max-w-xs truncate px-6 py-4 text-sm
text-neutral-900` (16.98-17.74:1 AAA, research.md R1). `truncate`
matches Lists' own ellipsis-overflow precedent (feature 011) and is
required by spec.md's long-content edge case — a bare `whitespace-
nowrap` alone (an earlier draft's mistake, caught by /speckit-analyze
before implementation) would overflow the cell instead of truncating
it. Rendered as `<td>`.

**Validation rules**:

- A Table Cell's `trailingAction`, when a link, MUST be the only
  interactive element inside its `<td>` — no nested interactive
  controls (structural, not runtime-checked, since this is static
  markup with no JS behavior).
