# Feature Specification: Advanced Form Inputs Batch

**Feature Branch**: `039-advanced-form-inputs`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Feature 039 — Advanced Form Inputs batch. Add 10 new advanced form input components to close genuine gaps identified in feature 018's component gap inventory (specs/018-component-gap-inventory/research.md candidates #10-27, cross-referenced against the 115 components already shipped in features 001-038): TagsInput, Autocomplete, InputMask, JsonInput, Cascader, TreeSelect, RangeSlider, Mentions, FloatLabel/IftaLabel, and Interactive Rating. Ship on both the static HTML surface and the React package, matching every prior feature's two-surface parity requirement, with AAA contrast and the existing 21-token theme system already in place across all 119 themes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Freeform and suggestion-driven entry (Priority: P1)

A form builder needs a user to enter multiple discrete values (skills, keywords, recipient list) or pick one item from a large, dynamically-filtered set, without hand-rolling keyboard/list logic for each case. They drop in TagsInput for freeform multi-value entry, Autocomplete for single-select suggestion, or Mentions for `@name` lookups inline inside a longer text field — each reusing this catalog's existing filtered-listbox mechanics (the same engine behind the existing Combobox) rather than a bespoke implementation per field.

**Why this priority**: These are the highest-frequency real-world form patterns in this batch (tag/keyword entry, type-ahead search, @-mention lookup all appear across the vast majority of modern SaaS forms) and share the most implementation machinery with an existing, already-shipped, already-accessible component — the fastest path to real user value.

**Independent Test**: Render TagsInput, Autocomplete, and Mentions independently on their own demo pages; confirm each opens/filters/selects correctly with mouse and keyboard alone, and that TagsInput's committed tags and Mentions' committed mentions are each individually removable.

**Acceptance Scenarios**:

1. **Given** an empty TagsInput, **When** a user types a value and presses Enter or comma, **Then** that value becomes a removable tag and the text field clears for the next entry.
2. **Given** an Autocomplete field with a large option set, **When** a user types a partial match, **Then** the suggestion list filters to matching options only, and selecting one (mouse or Enter) commits that single value and closes the list.
3. **Given** a Mentions-enabled text field, **When** a user types `@` followed by characters, **Then** a filtered suggestion popover appears anchored at the cursor, and selecting an entry inserts a formatted mention token in place of the typed characters.
4. **Given** any of the three components, **When** a user operates it with keyboard only (Tab, Arrow keys, Enter, Escape, Backspace), **Then** every action available via mouse remains available and the current focus/selection state is always visibly indicated.

---

### User Story 2 - Hierarchical and structured selection (Priority: P2)

A form builder needs a user to pick a value from data that has real structure — a category with subcategories (Cascader) or a tree of nested options where either a leaf or a parent may be selected (TreeSelect) — instead of flattening the hierarchy into one long, context-free list.

**Why this priority**: Hierarchical selection is a common but more specialized need than P1's flat-list patterns; it reuses this catalog's existing TreeView disclosure mechanism and Dropdown Menu panel mechanics, but the selection layer on top of them is new, higher-effort work than P1.

**Independent Test**: Render Cascader and TreeSelect independently against a real 3-level sample dataset; confirm a full path can be selected via mouse and via keyboard alone, and the trigger displays the selected path/label afterward.

**Acceptance Scenarios**:

1. **Given** a closed Cascader, **When** a user opens it and selects a first-level option, **Then** a second-level panel appears showing that option's children, and the trigger only commits a final value once a leaf (or a configured selectable intermediate level) is chosen.
2. **Given** a closed TreeSelect, **When** a user opens it, **Then** the same expand/collapse affordance as the existing TreeView appears, and clicking or activating (Enter/Space) any selectable node commits that node as the value and closes the panel.
3. **Given** either component is open, **When** a user presses Escape, **Then** the panel closes without changing the previously committed value.

---

### User Story 3 - Formatted, validated, and range value entry (Priority: P3)

A form builder needs a user to enter a value that must conform to a specific shape (a phone number, date, or currency mask), a syntactically valid JSON document, or a numeric range with two ends (a price band, a date range) — with real-time feedback rather than only failing on submit.

**Why this priority**: These extend existing single-purpose inputs (TextInput, Textarea, Slider) with validation/formatting logic; valuable but narrower in audience than P1/P2's general-purpose selection patterns.

**Independent Test**: Render InputMask, JsonInput, and RangeSlider independently; confirm InputMask blocks characters that don't fit the configured mask, JsonInput visibly flags invalid JSON before submit, and RangeSlider's two handles can each be moved independently (mouse and keyboard) without either ever crossing the other.

**Acceptance Scenarios**:

1. **Given** an InputMask configured for a phone number, **When** a user types digits, **Then** literal mask characters (parentheses, dashes) are inserted automatically and non-matching characters are rejected.
2. **Given** a JsonInput, **When** a user types syntactically invalid JSON, **Then** a visible inline error state appears without blocking further typing; **when** the content becomes valid JSON, **then** the error state clears.
3. **Given** a RangeSlider with two handles, **When** a user drags or keyboard-nudges (Arrow keys) either handle, **Then** that handle's value updates independently and is prevented from crossing the other handle's current position.

---

### User Story 4 - Small enhancements to existing inputs (Priority: P4)

A form builder wants a more compact label treatment for a text field (FloatLabel — the label animates into the field until focused/filled, then floats above it) or wants the existing read-only Rating display to become a real input a user can click or keyboard-select a value on, closing a gap explicitly left open when Rating first shipped.

**Why this priority**: Both are the smallest-scope items in this batch — a CSS-only variant of an existing component and an interactivity add-on to an existing component — valuable polish but not new interaction models.

**Independent Test**: Render FloatLabel on a TextInput and confirm the label animates between placeholder and floated-above-field position on focus/blur/fill; render Interactive Rating and confirm a value can be set by clicking a star and by arrow-key navigation while focused.

**Acceptance Scenarios**:

1. **Given** an empty FloatLabel field, **When** a user focuses it, **Then** the label animates to a smaller floated position above the field; **when** the user blurs it while still empty, **then** the label animates back to its original resting position.
2. **Given** a FloatLabel field with a pre-filled value, **When** the page loads, **Then** the label starts in the floated position without requiring a focus event first.
3. **Given** an Interactive Rating at its default value, **When** a user clicks a given star, **Then** the rating updates to that value and the change is exposed the same way this catalog's other input components expose value changes.
4. **Given** an Interactive Rating is focused, **When** a user presses Arrow Right/Left (or Up/Down), **Then** the value increments/decrements by one unit per keypress, clamped to the component's configured minimum and maximum.

---

### Edge Cases

- What happens when TagsInput or Mentions receives a paste containing multiple comma/newline-separated values at once? (Each value MUST be split into its own separate tag/mention rather than becoming one malformed entry.)
- How does Autocomplete/Cascader/TreeSelect behave when the underlying option set is empty or a filter matches nothing? (An explicit "no results" state MUST be shown, never a silently empty panel.)
- What happens when InputMask receives a pasted value that doesn't fully match the mask? (Only the matching prefix is accepted; the rest is discarded, never silently corrupting the mask.)
- What happens when RangeSlider's two handles are given equal min/max bounds so there is zero room between them? (Both handles MUST remain independently focusable and announce their state, even if visually adjacent.)
- How does Interactive Rating behave for a user who prefers reduced motion or uses a screen reader? (Value changes MUST be announced via the same live-region/ARIA pattern already used by this catalog's other rating/progress-style components, with no motion-dependent-only feedback.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a TagsInput component that accepts freeform text entry, commits each entry as a discrete, individually-removable tag on Enter/comma/paste-splitting, and prevents duplicate tags by default.
- **FR-002**: System MUST provide an Autocomplete component that filters a provided option list as the user types and commits exactly one selected value, reusing this catalog's existing filtered-listbox/combobox interaction pattern.
- **FR-003**: System MUST provide a Mentions component that detects an `@` trigger character inside a text field, opens a filtered suggestion popover anchored at the cursor position, and inserts a distinct, styled mention token on selection.
- **FR-004**: System MUST provide a Cascader component that renders a new panel of child options per level as a user drills into a hierarchical dataset, and commits a full selected path.
- **FR-005**: System MUST provide a TreeSelect component that reuses this catalog's existing TreeView expand/collapse mechanism inside a selection panel, committing a single selected node (leaf or, where configured, an intermediate node) as the value.
- **FR-006**: System MUST provide an InputMask component that accepts a configurable mask pattern (at minimum: phone number, date, and currency presets) and both blocks non-conforming characters during typing and formats pasted content to the matching prefix.
- **FR-007**: System MUST provide a JsonInput component that validates its content as JSON on every change and exposes a visible, non-blocking error state when the content is not valid JSON.
- **FR-008**: System MUST provide a RangeSlider component with two independently draggable and keyboard-operable handles, each constrained so it can never cross the other handle's current position.
- **FR-009**: System MUST provide a FloatLabel treatment (composable with the existing TextInput) where the label animates between a resting placeholder position and a floated-above-field position based on focus and fill state, with `prefers-reduced-motion` respected (no animation, only a state-instant position change).
- **FR-010**: System MUST extend the existing read-only Rating component with an interactive mode: mouse click and Arrow-key navigation both set a new value while focused, clamped to the component's configured minimum/maximum, exposed via the same value-change mechanism this catalog's other input components already use.
- **FR-011**: Every component in this batch MUST ship on both the static HTML surface and the React package (`packages/react`) with equivalent behavior on both surfaces, per this catalog's existing two-surface parity requirement.
- **FR-012**: Every component in this batch MUST meet this catalog's AAA contrast requirement across all 119 currently-shipped themes, using the existing 21-token theme system with no new tokens introduced.
- **FR-013**: Every component in this batch MUST be fully operable via keyboard alone (no mouse-only interaction), with visible focus indication at every interactive state.
- **FR-014**: Every component in this batch MUST expose value changes and open/close or validity state changes to assistive technology via ARIA attributes consistent with this catalog's existing components of the same interaction family (listbox-pattern components for TagsInput/Autocomplete/Mentions/Cascader/TreeSelect; the existing Slider's ARIA pattern for RangeSlider).

### Key Entities

- **Tag** (TagsInput): a single committed freeform text value within an ordered, de-duplicated collection; removable independently of its siblings.
- **Mention token** (Mentions): a committed, styled reference to a selected suggestion entry, embedded inline within surrounding free text.
- **Cascade path** (Cascader): an ordered list of selections, one per hierarchy level, from root to the committed leaf (or intermediate) value.
- **Mask pattern** (InputMask): a configuration describing literal characters and input-character-class placeholders (digit, letter, alphanumeric) that a raw value must conform to.
- **Range value** (RangeSlider): a pair of numeric values (low, high) within a single component's shared min/max bounds, with low always constrained to be less than or equal to high.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 10 components in this batch are individually reachable, keyboard-operable, and pass this catalog's automated accessibility scan with zero violations, across all 6 browser/viewport projects in the existing Playwright suite.
- **SC-002**: All 10 components pass this catalog's AAA contrast audit against all 119 currently-shipped themes with zero new undocumented findings.
- **SC-003**: A developer integrating any component in this batch needs to write zero custom keyboard-handling or ARIA-wiring code of their own — the shipped component provides it out of the box, matching this catalog's existing components' zero-custom-JS-required bar.
- **SC-004**: The full pre-existing Playwright suite (all prior features' specs) continues to pass unchanged after this batch ships, confirming zero regressions to any of the 115 previously-shipped components.
- **SC-005**: Each of the 10 components ships with an equivalent demo/example on both the static HTML surface and the React package, verified to behave identically for the acceptance scenarios above.

## Assumptions

- TagsInput, Autocomplete, and Mentions reuse this catalog's existing Combobox filtering/listbox mechanism as their underlying engine rather than three independent implementations, per feature 018 research.md's own buildability notes.
- Cascader and TreeSelect are scoped to single-select (one committed path/node); multi-select variants of either are out of scope for this batch.
- InputMask ships with phone, date, and currency mask presets plus a documented custom-pattern API; it does not attempt to cover every possible locale-specific mask format in this first batch (locale-specific presets beyond this catalog's existing `phone-br-input`/`phone-intl-input`/`cep-input` family remain a future consideration, not a gap this batch must close).
- RangeSlider's underlying mechanism follows the same native-range/`accent-color` approach as the existing single-handle Slider where the browser/engine supports it; a documented two-overlapping-inputs fallback is used elsewhere, per feature 018 research.md's own open buildability question for this component.
- FloatLabel is delivered as a composable variant/wrapper of the existing TextInput, not a new standalone text-entry component.
- Interactive Rating is an enhancement to the existing `src/components/rating/` component (adding interactivity), not a new component directory.
- No new external dependency is introduced by this batch (unlike the QR Code or Rich Text Editor candidates flagged separately in feature 018's inventory, which remain out of scope here).
