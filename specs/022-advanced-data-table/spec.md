# Feature Specification: Advanced Data Table

**Feature Branch**: `[022-advanced-data-table]`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "adicione o componente DataTable customizável, avançado e completo de features, podendo ter opcões de selecionar multiplos itens, CRUD completo (caso se aplique), busque 10 melhores ideias de datatable na internet, avalie as funcionalidades e crie este componente."

## Research Summary

Per the request, real-world data-table implementations were surveyed
before drafting requirements (not invented from scratch), covering both
widely-used component libraries and independent UX-pattern guidance:

1. **TanStack Table** (headless, framework-agnostic sort/filter/pagination/
   selection state) — the most common foundation for custom-styled tables.
2. **shadcn/ui Data Table** (TanStack Table + Tailwind) — the closest
   reference for a Tailwind-native, non-enterprise table.
3. **AG Grid** (Community/Enterprise) — full-featured "spreadsheet-like"
   grid: inline editing, pivoting, Excel-style filters, virtualization.
4. **MUI X Data Grid** (Community/Pro/Premium) — row grouping,
   aggregation, Excel export at higher tiers.
5. **Syncfusion React Data Grid** — in-grid editing, Excel-style
   filtering, row aggregation, advanced selection.
6. **PrimeReact / Ant Design / Mantine DataTable** — component-library-
   bundled tables with built-in selection checkboxes, row expansion, and
   toolbar patterns.
7. **Handsontable** — spreadsheet-style cell editing for data-entry-heavy
   internal tools.
8. **react-data-table-component** — a lighter-weight, opinionated
   selection/pagination/sort implementation.
9. **UX pattern guidance** (Pencil & Paper, Eleken, HashiCorp Helios
   design system, UX Design World) on bulk-action toolbars, row-level
   action placement, and selection feedback.
10. **This catalog's own existing Table component** (feature 012,
    `.data-table`) — the static, zero-JavaScript baseline this feature
    extends rather than replaces.

**Recurring, cross-cutting feature set** these converge on: multi-column
sort, per-column and global filtering, pagination, row selection
(single/select-page/select-all-across-pages) surfaced via a floating or
inline bulk-action toolbar, per-row action affordances (view/edit/
delete), inline or modal-based editing, column visibility toggling, data
export, and empty/loading/error states — this is the basis for the
requirements below.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sort, Filter, and Page Through a Large Dataset (Priority: P1)

A user viewing a dataset too large to scan at a glance (customers,
orders, inventory, etc.) wants to sort it by any column, narrow it down
by a search term or per-column filter, and move through it a manageable
page at a time — without the page ever fully reloading.

**Why this priority**: This is the floor every reference implementation
surveyed shares — sort, filter, and pagination are the table's core
read-oriented value and are useful standalone even before any
selection or editing capability exists.

**Independent Test**: Populate the table with a representative dataset,
sort by a column, apply a filter, and page forward/back — fully testable
with zero selection or CRUD functionality present yet.

**Acceptance Scenarios**:

1. **Given** an unsorted table, **When** a user activates a column
   header's sort control, **Then** the table re-orders by that column
   ascending; activating it again reverses to descending, and a third
   activation returns to the unsorted/default order.
2. **Given** a table with more rows than one page holds, **When** the
   user types into the table's search field, **Then** only rows matching
   the term across the visible columns remain, and the pagination control
   updates to reflect the filtered result count.
3. **Given** a filtered, sorted table spanning multiple pages, **When**
   the user navigates to the next page, **Then** the sort and filter
   remain applied to the new page's rows.
4. **Given** a filter that matches zero rows, **When** it is applied,
   **Then** the table shows a clear "no matching results" state rather
   than an empty, unexplained table body.

---

### User Story 2 - Select Multiple Rows and Act on Them Together (Priority: P2)

A user managing a list of records wants to select several rows at once
(e.g. to delete, export, or tag them together) instead of repeating the
same action one row at a time.

**Why this priority**: Multi-select is the specific capability the
request calls out by name, and is the second-most-universal feature
across every table implementation surveyed — but it depends on User
Story 1's rendering/pagination already existing to have rows to select
across.

**Independent Test**: With a populated, paginated table, select several
rows via their checkboxes, confirm a bulk-action affordance appears
showing the selection count, and confirm it disappears when the
selection is cleared — testable independently of any CRUD capability.

**Acceptance Scenarios**:

1. **Given** an unselected table, **When** the user checks two or more
   individual row checkboxes, **Then** a bulk-action control appears
   showing the number of selected rows and the actions available for
   that selection.
2. **Given** a table with a "select all" control, **When** it is
   activated, **Then** every row on the current page is selected, and the
   control clearly communicates whether "all on this page" or "all
   matching rows across every page" was selected when more rows exist
   than the current page shows.
3. **Given** a partial selection, **When** the user changes the applied
   filter or sort, **Then** the system clearly indicates whether the
   previous selection still applies to the now-different visible rows,
   rather than silently carrying over a stale, invisible selection.
4. **Given** one or more rows selected, **When** the user triggers a bulk
   action (e.g. bulk delete), **Then** the system asks for confirmation
   before an irreversible action is applied to every selected row.

---

### User Story 3 - Create, Edit, and Delete Records Directly in the Table (Priority: P3)

A user managing a list of records wants to add a new record, correct a
mistake in an existing one, or remove a record entirely, without leaving
the table for a separate page — a complete CRUD workflow scoped to
whatever entity the table represents.

**Why this priority**: Full CRUD is explicitly requested ("caso se
aplique" — "where applicable"), acknowledging not every table usage needs
every operation; it is sequenced last because it is meaningfully more
complex than read/select and several reference implementations surveyed
treat it as an optional, opt-in layer on top of the base table rather
than a universal requirement.

**Independent Test**: Create a new record via the table's add-record
control, edit an existing row's values, delete a single row, and confirm
each operation is independently triggerable and reflected in the table
immediately — testable independently of User Story 2's bulk-selection
flow (single-row CRUD does not require multi-select to exist).

**Acceptance Scenarios**:

1. **Given** a table configured for record creation, **When** the user
   triggers "add record" and submits valid values, **Then** a new row
   appears in the table reflecting those values.
2. **Given** an existing row, **When** the user triggers its edit action
   and submits changed values, **Then** the row reflects the updated
   values without the rest of the table's state (sort, filter, page,
   other rows' selection) being lost.
3. **Given** an existing row, **When** the user triggers its delete
   action, **Then** the system asks for confirmation before the row is
   permanently removed.
4. **Given** an edit or create form, **When** the user submits values
   that fail validation, **Then** the system shows a clear, field-level
   error and does not silently discard the user's other entered values.
5. **Given** a table not configured for a particular CRUD operation
   (e.g. a read-only reporting table), **When** the table renders,
   **Then** no affordance for that unavailable operation is shown.

---

### Edge Cases

- What happens when the underlying dataset is empty from the start (no
  rows have ever existed, vs. a filter matching zero rows)? The table
  MUST distinguish a genuine "no data yet" state from a "no results for
  this filter" state with different messaging.
- What happens when a sort, filter, or page-size change is applied while
  a bulk action or an edit/create form is still open/pending? The system
  MUST NOT silently lose the pending action; if changing state would
  discard unsaved input, the user MUST be warned first.
- What happens when a user attempts to select more rows than exist
  (e.g. "select all" on a filtered view that later becomes unfiltered)?
  The selection scope MUST be explicitly bounded and communicated (this
  page vs. all matching rows), never ambiguous.
- What happens when two overlapping edits could conflict (e.g. an
  in-progress edit on a row that a bulk action would also affect)? The
  system MUST prevent a bulk action from silently overwriting an
  in-progress, unsaved single-row edit.
- What happens at the narrowest supported viewport width, where the full
  column set cannot fit? The table MUST remain usable (e.g. via
  horizontal scroll within its own region, matching this catalog's
  existing Table component's convention) rather than breaking the
  surrounding page layout.
- What happens when a column contains no sortable/filterable meaningful
  value (e.g. an actions column, an avatar column)? That column MUST be
  exempt from sort/filter controls rather than exposing a control that
  does nothing meaningful.
- How does the system announce a sort change, a filter result count
  change, or a completed CRUD operation to a screen reader user, given
  none of these involve a full page navigation? Each MUST be announced
  without interrupting the user's current focus/task.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a table component that renders a
  caller-supplied dataset with a caller-defined set of columns.
- **FR-002**: System MUST allow sorting the dataset by any designated
  sortable column, cycling ascending → descending → unsorted, with the
  current sort direction visibly indicated on that column's header.
- **FR-003**: System MUST support sorting by more than one column at once
  for callers who need it, with a clear indication of sort precedence
  order.
- **FR-004**: System MUST provide a way to filter the visible rows, both
  via a single global search across designated columns and via
  per-column filter controls for callers who need more precise
  narrowing.
- **FR-005**: System MUST paginate the dataset, with a caller-
  configurable page size, and MUST keep the active sort and filter
  applied across page navigation.
- **FR-006**: System MUST show a distinct "no data" state (nothing has
  ever existed) and a distinct "no results" state (a filter matched
  nothing), never a blank, unexplained table body for either case.
- **FR-007**: System MUST provide an optional per-row selection checkbox
  and a "select all" control, with select-all explicitly distinguishing
  between "every row on the current page" and "every row matching the
  current filter across all pages" whenever those two sets differ.
- **FR-008**: System MUST surface a bulk-action affordance whenever one
  or more rows are selected, showing the current selection count and the
  actions available, and MUST hide that affordance when the selection is
  empty.
- **FR-009**: System MUST require explicit confirmation before an
  irreversible bulk action (e.g. bulk delete) is applied to the selected
  rows.
- **FR-010**: System MUST provide optional, independently enabled
  affordances for creating a new record, editing an existing record, and
  deleting an existing record — each configurable on or off per table
  instance, so a read-only usage shows no CRUD affordances at all
  (spec.md's "caso se aplique" requirement).
- **FR-011**: System MUST validate create/edit input and show clear,
  field-level error messages on invalid submission without discarding
  the user's other entered values.
- **FR-012**: System MUST require explicit confirmation before a
  single-row delete is applied.
- **FR-013**: System MUST let a caller toggle individual columns' visibility
  without losing the current sort/filter/pagination/selection state.
- **FR-014**: System MUST remain usable at this catalog's narrowest
  supported viewport width via horizontal scrolling within the table's
  own region, without breaking the surrounding page layout.
- **FR-015**: System MUST exempt columns with no meaningful sortable/
  filterable value (e.g. an actions or avatar column) from sort/filter
  controls.
- **FR-016**: System MUST announce sort changes, filter-result-count
  changes, and completed create/edit/delete operations to assistive
  technology without interrupting the user's current focus or in-
  progress input.
- **FR-017**: System MUST prevent a bulk action from silently discarding
  an in-progress, unsaved single-row edit affecting one of the selected
  rows — the conflict MUST be surfaced to the user, not silently resolved
  in either direction.
- **FR-018**: System MUST warn the user before a sort, filter, page-size,
  or column-visibility change would discard unsaved input in an open
  create/edit form, rather than discarding it silently.
- **FR-019**: Every interactive affordance this feature adds (sort
  control, filter input, selection checkbox, bulk-action button, row
  action, create/edit form control) MUST meet this catalog's existing
  interactive-state completeness standard (hover, active, focus-visible,
  disabled) already required of every other component.

### Key Entities

- **Data Table Instance**: One rendering of this component — holds its
  caller-supplied dataset, column definitions, current sort state,
  current filter state, current page, current page size, current
  selection set, and which CRUD affordances (create/edit/delete) are
  enabled for it.
- **Column Definition**: One caller-defined column — its identifier,
  display label, whether it participates in sorting, whether it
  participates in filtering, and whether it is currently visible.
- **Row Selection**: The current set of selected records for one Data
  Table Instance, plus whether that set represents "current page only"
  or "all rows matching the current filter."
- **Bulk Action**: One operation a caller has made available to apply to
  the current Row Selection as a whole (e.g. bulk delete, bulk export,
  bulk tag).
- **Record Edit/Create Form**: The set of field values a user is actively
  entering or changing for one record, plus its current validation
  state, before it is submitted or discarded.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can sort, filter, and page through a dataset of at
  least 1,000 rows without any full page reload and without a
  perceptible delay between an action and the table reflecting it.
- **SC-002**: A user can select any subset of rows — including every row
  across every page of a filtered result — and apply a bulk action to
  exactly that subset, with zero ambiguity about which rows were
  affected.
- **SC-003**: A user can complete a create, edit, or delete operation on
  a single record, when that operation is enabled for the table, without
  losing their current sort, filter, page, or the rest of their
  selection.
- **SC-004**: 100% of this feature's interactive controls remain fully
  operable via keyboard alone and meet this catalog's existing
  accessibility bar, with zero regressions to any previously shipped
  component.
- **SC-005**: The table remains fully usable — no broken layout, no
  inaccessible controls — at every viewport width this catalog already
  supports, including its narrowest (320px).
- **SC-006**: This feature closes the "interactive/sortable Data Table"
  catalog gap explicitly flagged as deferred since this project's
  feature-014 research phase.

## Assumptions

- **Extends, does not replace, the existing Table component**: this
  catalog's existing zero-JavaScript `Table`/`.data-table` component
  (feature 012) remains the right choice for genuinely static, non-
  interactive data display; this feature is a distinct, more capable
  component for cases that need sorting, filtering, selection, or CRUD,
  not a breaking change to the existing one.
- **CRUD is opt-in per instance, not per-deployment-wide**: per the
  request's own "caso se aplique" qualifier, a single table instance used
  purely for reporting can enable none of the create/edit/delete
  affordances; another instance managing an editable list can enable all
  three independently.
- **Data source is caller-supplied, not this feature's concern**: this
  feature renders and operates on whatever dataset and column
  definitions the consuming page provides; it does not define how that
  data is fetched, stored, or persisted server-side — the create/edit/
  delete acceptance scenarios describe the client-facing interaction
  contract (form submission, validation, confirmation, and the table
  reflecting the result), not a backend/API design.
- **"Select all across pages" is a real, distinct capability**: per the
  UX research above (bulk selection commonly needs to span beyond the
  current page), the component must support and clearly label this
  distinction rather than only offering "select all on this page."
- **Column visibility toggling and multi-column sort are included as
  core requirements, not deferred**: both appeared consistently enough
  across the surveyed implementations (and are low-complexity relative to
  selection/CRUD) to include in this feature's initial scope rather than
  a future extension.
- **Export, virtualization for very large datasets, and row
  grouping/aggregation are out of scope for this feature**: these
  appeared primarily in the enterprise-tier tools surveyed (AG Grid
  Enterprise, MUI X Premium) and are not part of the request's explicit
  ask — flagged here as a natural future extension rather than silently
  bundled in or silently dropped.
