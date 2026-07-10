# Feature Specification: Advanced Forms Primitives (Combobox, Command Palette)

**Feature Branch**: `008-advanced-forms-primitives`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Implement the design system's sixth slice of
primitives — Combobox (autocomplete/typeahead select) and Command Palette
(Cmd+K-style fuzzy-search action launcher) — in HTML using Tailwind CSS,
built exclusively on the semantic design tokens already ratified in the
project constitution (v1.6.0). This is the 'Advanced Forms' catalog
expansion (the third and final slice of the 'implemente todos os 3 acima'
scope, after 006-data-display-primitives and 007-application-shell-primitives)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Combobox (Priority: P1) 🎯 MVP

A user filling out a form needs to select a value from a large list (e.g. a
country or a product) without scrolling through every option. They start
typing and the list narrows to matching options; they can confirm a match
with the keyboard or the mouse without ever leaving the input.

**Why this priority**: Combobox is the more broadly reusable of the two
components — it fits directly into existing form contexts (alongside
Select from feature 002) and has no dependency on Command Palette.

**Independent Test**: Drop the Combobox markup into a blank page, type a
partial match, and verify the option list narrows, arrow keys move among
filtered options, Enter selects the highlighted option and closes the list,
and Escape closes the list without changing the input's value.

**Acceptance Scenarios**:

1. **Given** an empty Combobox input, **When** the user types a substring
   that matches one or more options, **Then** the listbox opens showing
   only the matching options, each visually highlighting the matched
   substring.
2. **Given** an open Combobox listbox with filtered options, **When** the
   user presses ArrowDown/ArrowUp, **Then** focus (via
   `aria-activedescendant`) moves among the visible options, wrapping at
   either end.
3. **Given** a highlighted option, **When** the user presses Enter,
   **Then** that option's value fills the input, the listbox closes, and
   focus remains on the input.
4. **Given** an open listbox, **When** the user presses Escape, **Then**
   the listbox closes and the input's value is unchanged.
5. **Given** a Combobox input, **When** the user types a substring that
   matches zero options, **Then** the listbox shows a "No results" state
   rather than an empty popup or no popup at all.

---

### User Story 2 - Command Palette (Priority: P2)

A power user wants to jump straight to an action (e.g. "New Project",
"Settings") from anywhere on the page without using the mouse. They press
Cmd/Ctrl+K, a centered dialog opens with a search input already focused,
they type part of the action's name, and the filtered list narrows so they
can execute it with Enter.

**Why this priority**: Depends on no other component in this feature, but
is scoped after Combobox because its keyboard-shortcut/focus-trap
machinery is more involved and benefits from reusing patterns (the
`<dialog>` element) already proven by Modal in feature 003.

**Independent Test**: Drop the Command Palette markup and its script into
a blank page, press Cmd/Ctrl+K, verify the dialog opens with the search
input focused, type a partial action name, verify the list narrows, press
Enter on a highlighted action, and verify the dialog closes.

**Acceptance Scenarios**:

1. **Given** any focus state on the page, **When** the user presses
   Cmd+K (macOS) or Ctrl+K (Windows/Linux), **Then** the Command Palette
   dialog opens with its search input immediately focused.
2. **Given** an open Command Palette, **When** the user types a substring
   matching one or more actions, **Then** the action list narrows to only
   matching actions, each highlighting the matched substring.
3. **Given** a highlighted action in the filtered list, **When** the user
   presses Enter, **Then** the action's associated behavior fires (in this
   static reference, a visible confirmation) and the dialog closes.
4. **Given** an open Command Palette, **When** the user presses Escape,
   **Then** the dialog closes and focus returns to whatever element had
   focus before the palette opened.
5. **Given** an open Command Palette, **When** the user presses Tab
   repeatedly, **Then** focus stays trapped within the dialog (native
   `<dialog>`/`showModal()` behavior, reused verbatim from Modal).

---

### Edge Cases

- What happens when the Combobox's option list is empty because the
  underlying dataset itself has zero entries (not just zero matches)? The
  listbox never opens in this state — there is nothing to disclose,
  consistent with Dropdown Menu's trigger having no button state for an
  empty menu.
- What happens when a Combobox option is disabled? It renders with
  `aria-disabled="true"` (not the `disabled` attribute — that attribute
  has no effect on a non-form-control element like a `<li>`/`<div>`
  serving as a listbox option) and is visually dimmed, skipped during
  arrow-key navigation, and not selectable via click or Enter — the same
  skip-disabled-items behavior Dropdown Menu already established in
  feature 005.
- What happens if Cmd/Ctrl+K is pressed while a native text input or
  textarea already has focus elsewhere on the page? The shortcut still
  opens the Command Palette (this is a global shortcut, matching every
  real-world command-palette implementation), and the previously-focused
  element's state is preserved so focus can return to it on close.
- What happens when the Command Palette is opened while already open
  (double-firing the shortcut)? The shortcut handler is idempotent — a
  second Cmd/Ctrl+K while already open is a no-op (does not toggle it
  closed), matching `<dialog>`'s own `showModal()` semantics of being a
  no-op on an already-open dialog.
- What happens on narrow (320px) viewports? Both components remain fully
  usable — the Combobox listbox does not overflow the viewport
  horizontally, and the Command Palette dialog uses the same responsive
  sizing (`sm:max-w-lg`, full-width below `sm:`) already ratified for
  Modal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Combobox MUST expose `role="combobox"` on its input,
  `role="listbox"` on its popup, and `role="option"` on each candidate,
  per the WAI-ARIA 1.2 combobox pattern.
- **FR-002**: The Combobox MUST filter its options as the user types,
  using case-insensitive substring matching against each option's label.
- **FR-003**: The Combobox MUST support ArrowUp/ArrowDown to move a
  visually- and programmatically-indicated "active" option among the
  currently filtered set, Enter to commit the active option, and Escape
  to close the listbox without committing a value.
- **FR-004**: The Combobox MUST show a "No results" state when the
  current filter matches zero options, rather than an empty or absent
  popup.
- **FR-005**: The Combobox MUST support a disabled-option state via
  `aria-disabled="true"`, visually dimmed and unreachable via keyboard
  navigation or pointer selection.
- **FR-006**: The Command Palette MUST open in response to a global
  Cmd+K (macOS) / Ctrl+K (Windows/Linux) keyboard shortcut, from anywhere
  on the page, regardless of current focus.
- **FR-007**: The Command Palette MUST focus its search input immediately
  upon opening, and MUST trap focus within the dialog while open
  (equivalent to Modal's existing focus-trap behavior).
- **FR-008**: The Command Palette MUST filter its flat action list as the
  user types, using the same case-insensitive substring matching strategy
  as the Combobox, and MUST support ArrowUp/ArrowDown/Enter navigation
  identical in spirit to the Combobox's.
- **FR-009**: The Command Palette MUST close on Escape and MUST return
  focus to whichever element held focus immediately before the palette
  opened.
- **FR-010**: Both components MUST be expressible entirely with design
  tokens already ratified in the project constitution — zero raw Tailwind
  palette classes.
- **FR-011**: Both components MUST pass a WCAG 2.2 AAA (7:1) automated
  contrast scan for every new text/background pairing they introduce.
- **FR-012**: Both components' every interactive element MUST declare
  hover, active (press), and focus-visible states, per this project's
  Interactive State Completeness principle.
- **FR-013**: This feature MUST ship as static HTML + Tailwind only,
  matching every prior catalog-expansion feature (005, 006, 007) — a
  React port is explicitly out of scope (reserved for feature 009).

### Key Entities

- **Combobox**: a text input paired with a filterable popup listbox of
  candidate options; each option has a label and an optional disabled
  state; the input's value reflects the most recently committed option
  (or free text, if the consuming form allows it).
- **Command Palette**: a focus-trapped dialog containing a search input
  and a flat list of actions; each action has a label and an associated
  behavior (in this static reference, a visible confirmation of which
  action fired); opened/closed via a global keyboard shortcut.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can narrow a 50-option Combobox list to a single
  match by typing 3-4 characters, with the correct option selectable via
  keyboard alone (no mouse required).
- **SC-002**: A user can open the Command Palette from any point on the
  page and execute a target action in under 5 keystrokes total (shortcut
  + partial query + Enter) for a palette of 20 actions.
- **SC-003**: 100% of interactive elements in both components pass an
  automated axe-core accessibility scan with zero violations.
- **SC-004**: 100% of new text/background color pairings introduced by
  this feature measure at or above 7:1 contrast (WCAG 2.2 AAA), verified
  by this project's `check-contrast.mjs` gate.
- **SC-005**: An unfamiliar developer can compose a working Combobox with
  a custom option list using only that component's own gallery page as a
  reference, without consulting any other documentation.

## Assumptions

- Both components' filtering is substring-based (not full fuzzy/typo-
  tolerant matching like Sublime Text's Ctrl+P) — this keeps the
  reference implementation's JavaScript simple and dependency-free,
  consistent with every prior feature's zero-external-dependency
  discipline. A future feature could add fuzzy scoring without changing
  either component's markup contract.
- The native `<datalist>` element is assumed insufficient for a fully
  accessible, stylable Combobox (per WAI-ARIA APG guidance — it cannot be
  styled, its filtering behavior is inconsistent across browsers, and it
  does not expose the ARIA combobox roles), but this MUST be confirmed
  explicitly during Phase 0 research rather than taken purely on
  assumption, consistent with this project's established research
  discipline (Popover API investigation in feature 005).
- The Command Palette's dialog chrome (backdrop, sizing, entry
  transition) is assumed to reuse Modal's existing `<dialog>`/
  `showModal()` pattern from feature 003 rather than introducing a new
  overlay mechanism, but this MUST also be confirmed during Phase 0
  research.
- Both components' example datasets in their standalone gallery pages are
  static, hardcoded arrays (no live API/search-index dependency) — this
  is a reference implementation, not a production data-fetching layer.
- Disabled options use `aria-disabled` rather than the `disabled`
  attribute, since the underlying elements (`<li>`/`<div>` serving as
  listbox options) are not native form controls and the `disabled`
  attribute has no effect on them.
