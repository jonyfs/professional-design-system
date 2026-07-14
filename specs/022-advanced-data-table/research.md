# Phase 0 Research: Advanced Data Table

No NEEDS CLARIFICATION markers remain in plan.md's Technical Context.
Items below extend spec.md's own Research Summary into concrete
architectural decisions.

## R1: No new dependency — hand-rolled state, not a headless table library

- **Decision**: build sort/filter/pagination/selection state from scratch
  in `shared/data-table/`, using plain array operations — no library
  dependency added.
- **Rationale**: spec.md's Research Summary identified TanStack Table
  (headless, ~15KB gzip) as the closest real-world fit for a
  Tailwind-native table. It was seriously considered, then rejected:
  this catalog has already built comparable-or-greater interaction
  complexity from scratch twice (Combobox's from-scratch WAI-ARIA 1.2
  pattern, feature 008; Dropdown Menu's Popover-API-driven roving focus,
  feature 005) specifically because no existing mechanism covered them —
  the same "substantially new interaction pattern, build it properly"
  standard this constitution already applies. Sort/filter/paginate/select
  state machines are well-understood, boundable in scope (spec.md's own
  Assumptions explicitly exclude virtualization/export/grouping — the
  genuinely complex, enterprise-tier features), and at the 1,000-row
  scale spec.md's SC-001 targets, plain JavaScript array `.sort()`/
  `.filter()`/`.slice()` operations complete with no perceptible delay —
  no algorithmic sophistication a library would meaningfully add value
  over. Adopting a library here would also reintroduce feature 020's own
  documented tension (a headless library still needs *some* rendering
  layer per surface) for a problem this catalog can solve natively.
- **Alternatives considered**: `@tanstack/table-core` (framework-agnostic
  core) driving both surfaces — rejected: `table-core`'s state shape and
  update model would still need to be learned, wrapped, and kept in sync
  across two surfaces, which is not meaningfully less integration work
  than the shared/data-table/ module this plan builds directly, while
  adding an external dependency and its update/security-patch surface for
  no proportionate benefit at this feature's stated scale. `AG Grid
  Community`/`MUI X Data Grid` (full pre-built grids) — rejected outright,
  identical reasoning to why Chart adopted Recharts only because
  charting genuinely has no reasonable from-scratch path at this
  catalog's scale; a sortable/filterable table does have one.

## R2: Sort model — array of `{ columnId, direction }`, cycling per column

- **Decision**: `sorting.ts` holds an ordered array of
  `{ columnId: string; direction: "asc" | "desc" }` entries — clicking a
  column's sort control appends/cycles/removes that column's entry
  (asc → desc → removed), and multi-column sort is simply "more than one
  entry in the array," applied in array order as a compound comparator.
- **Rationale**: an array (not a single `{columnId, direction}` object)
  is the minimal structure that supports both FR-002 (single-column,
  cycling through asc/desc/unsorted) and FR-003 (multi-column with
  precedence order) without two separate code paths — single-column sort
  is just the one-element case of the general array model.
- **Alternatives considered**: a `Map` keyed by column id — rejected,
  loses insertion-order precedence semantics an array preserves natively
  (JS `Map` does technically preserve insertion order too, but an array
  makes the "precedence = position" relationship explicit and avoids
  needing `Array.from(map.entries())` conversions at every consumption
  site).

## R3: Filter model — one global predicate + per-column predicates, ANDed

- **Decision**: `filtering.ts` holds a `globalQuery: string` (matched
  against every designated-filterable column's stringified value) plus a
  `columnFilters: Record<string, string>` map (one raw filter value per
  column that opts in) — a row is visible iff it matches the global
  query AND every active per-column filter.
- **Rationale**: directly matches FR-004's explicit dual requirement
  ("both via a single global search... and via per-column filter
  controls"); ANDing is the standard, least-surprising combination
  semantic (narrowing, never widening, as more filters are applied) and
  requires no new UI concept to explain.
- **Alternatives considered**: OR-combination between global and
  per-column filters — rejected, would make "type in the search box"
  potentially *widen* an already-filtered view, contradicting the
  ordinary mental model of filtering as narrowing.

## R4: Pagination — reuse the existing `Pagination` component's markup, new state math only

- **Decision**: `pagination.ts` exports pure functions (`paginate(rows,
  page, pageSize)`, `pageCount(totalRows, pageSize)`) with zero new
  navigation UI — the table's pagination control reuses this catalog's
  already-ratified `.pagination-nav`/`.pagination-link`/
  `.pagination-control` classes and `aria-current="page"` convention
  verbatim (feature 007).
- **Rationale**: FR-005 only requires page navigation with sort/filter
  preserved across it — this catalog already has a fully AAA-verified,
  zero-JavaScript-capable pagination pattern; inventing a second one
  would be pure duplication.
- **Alternatives considered**: none seriously — reusing an
  already-ratified pattern for an already-solved sub-problem is the
  default, not a considered alternative.

## R5: Selection model — a Set of row ids + an explicit page-vs-all-matching scope flag

- **Decision**: `selection.ts` holds `{ ids: Set<string>; scope:
  "page" | "all-matching" }`. Individual row checkboxes always add/remove
  from `ids` directly (`scope` stays `"page"`). The "select all" control
  offers two explicit actions once more rows exist than the current page
  shows: "select this page" (`scope: "page"`, `ids` = current page's row
  ids) and "select all N matching rows" (`scope: "all-matching"`, `ids`
  populated from the full filtered set) — never one ambiguous checkbox
  silently meaning different things.
- **Rationale**: directly implements FR-007's explicit requirement to
  distinguish these two scopes, grounded in the UX research (spec.md
  Research Summary point 9 — bulk selection commonly needs to span
  beyond the current page, per HashiCorp Helios' documented pattern).
  Storing `scope` explicitly (not just inferring it from `ids.size`)
  lets the UI correctly re-label "N selected" even as filtering changes
  which rows `ids` would otherwise resolve to.
- **Alternatives considered**: storing only a boolean "all selected" flag
  with no distinction — rejected, directly the FR-007 ambiguity the
  requirement exists to prevent.

## R6: Bulk-action toolbar — appears above the table, not a floating overlay

- **Decision**: the bulk-action toolbar renders as a normal in-flow
  region directly above the table (reusing `.pagination-nav`-adjacent
  spacing conventions), shown only when `selection.ids.size > 0`, hidden
  otherwise — not a fixed/floating overlay.
- **Rationale**: spec.md's Research Summary (point 9) notes both
  floating and fixed-position bulk toolbars as real, common patterns
  (Jira, ClickUp), but an in-flow toolbar avoids this catalog's first
  `position: fixed`/floating-overlay layout concern for a *toolbar*
  (Popover/Tooltip/Dropdown Menu already use floating positioning for
  *transient* panels, not persistent page chrome) and keeps the
  implementation simpler and more predictable across all supported
  viewports without new z-index/stacking-context management.
- **Alternatives considered**: a fixed-bottom floating toolbar (ClickUp's
  pattern) — rejected for this feature's initial scope; flagged as a
  reasonable future enhancement, not ruled out permanently, just not
  required to meet spec.md's acceptance criteria.

## R7: CRUD forms — reuse Modal's `<dialog>`/`showModal()` chrome verbatim

- **Decision**: create/edit forms render inside this catalog's existing
  Modal dialog chrome (`.modal-dialog`/`.modal-panel`, native
  `<dialog>`/`showModal()`), reusing `overlay.js`'s exported
  `wireDialogClose(dialog)` helper for the static surface — the exact
  mechanism Command Palette already reused from Modal (feature 008) for
  a dialog with no single dedicated trigger button.
- **Rationale**: FR-010's create/edit affordances are exactly Modal's
  existing job (a focused, dismissible, focus-trapped surface for a
  bounded task) — no new dialog/overlay mechanism needed. Delete
  confirmation (FR-009/FR-012) reuses the same Modal chrome with a
  simpler confirm/cancel body instead of a form.
- **Alternatives considered**: inline row editing (editing values
  directly in table cells, no modal) — evaluated (it's one of the
  patterns the UX research surfaced, e.g. Handsontable's spreadsheet-
  style editing) but not adopted as the primary mechanism: inline editing
  across an arbitrary caller-defined column set is a materially larger
  scope (per-column-type editor components, cell-level focus management)
  than spec.md's stated acceptance criteria require, and modal-based
  editing already satisfies every US3 acceptance scenario. Not
  precluded as a future enhancement.

## R8: Field validation — reuse `TextInput`/`Select`'s existing error convention

- **Decision**: the create/edit form's fields are built from this
  catalog's existing `TextInput`/`Select` components (or their static
  equivalents) — validation errors use the exact same `error` prop /
  `aria-invalid`/`aria-describedby` pattern already ratified, per field.
- **Rationale**: FR-011 requires "clear, field-level error messages" —
  this is verbatim what `TextInput`'s existing contract already
  provides; no new error-display pattern needed.

## R9: Accessibility announcements — one shared `aria-live="polite"` status region

- **Decision**: one `aria-live="polite"` status element per table
  instance announces sort changes, filter-result-count changes, and
  completed create/edit/delete operations (FR-016) — a single region
  updated with a short message per event, not one live region per event
  type.
- **Rationale**: matches this catalog's established `aria-live="polite"`
  convention (feature 019's per-field error regions, feature 003's Toast)
  for "announce without interrupting" — one shared region avoids
  redundant/competing announcements when multiple state changes occur
  close together (e.g. a filter change that also changes the visible
  page).

## R10: Empty states — reuse the existing Empty State recipe, two message variants

- **Decision**: `DataTableEmptyState` (React) / equivalent static markup
  renders this catalog's existing Empty State recipe (feature 014) with
  one of two messages: "No data yet" (dataset genuinely empty) vs. "No
  results match your filters" (filter produced zero rows) — determined
  by whether any filter/global-query is currently active, per FR-006.
- **Rationale**: reuses an already-ratified compositional pattern
  (heading + message + optional icon) rather than inventing a new empty-
  state treatment specific to tables.
