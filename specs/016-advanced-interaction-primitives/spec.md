# Feature Specification: Advanced Interaction Primitives

**Feature Branch**: `016-advanced-interaction-primitives`

**Created**: 2026-07-12

**Status**: Draft

**Input**: User description: "Ship the next reasonable batch of components from
the 'Known Catalog Gaps' list ratified in constitution v1.12.0 that are
genuinely reusable/simple enough to build with this project's existing
mechanisms — deliberately excluding Date Picker/Calendar, interactive/sortable
Data Table, Carousel, Chart, Scroll Area, and Resizable panels (each requires
a substantially new architectural decision better scoped as its own future
feature). Four components: TreeView (reusing Accordion's native
`<details>/<summary>` disclosure, recursively nested), Rating (read-only
display variant only, clickable input deferred), Menubar (reusing Dropdown
Menu's Popover-API/Anchor-Positioning wiring plus Tabs' roving-tabindex
pattern), and ColorPicker/ColorInput (native `<input type='color'>`, not a
custom JS color-swatch picker)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hierarchical navigation via TreeView (Priority: P1)

A user browsing a nested structure (e.g. a file system, a nested category
list, an org chart) needs to expand and collapse branches to find the item
they're looking for, without every branch's contents being visible at once.

**Why this priority**: TreeView is the most structurally novel of the four
components (recursive nesting) and the one most likely to reveal a real
accessibility gap if the "reuse native `<details>`" approach turns out to be
insufficient — de-risking it first protects the rest of the batch's schedule.

**Independent Test**: Open `tree-view.html`, confirm at least one nested
(grandchild) branch exists, confirm collapsed branches hide their children,
and confirm expanding a parent branch does not auto-expand its own children.

**Acceptance Scenarios**:

1. **Given** a TreeView with a collapsed top-level branch, **When** the user
   activates its disclosure triangle (click or Enter/Space when focused),
   **Then** its direct children become visible and its own indicator reflects
   the expanded state.
2. **Given** an expanded parent branch containing a collapsed nested branch,
   **When** the parent is collapsed again, **Then** the nested branch's own
   expand/collapse state is preserved (collapsing the parent hides it, it
   does not silently reset to collapsed).
3. **Given** a TreeView rendered with only default browser/user-agent
   styles removed, **When** inspected with a screen reader, **Then** each
   branch's expanded/collapsed state and nesting depth are announced
   correctly using native semantics, with no custom ARIA tree role needed.

---

### User Story 2 - At-a-glance quality signal via Rating (Priority: P2)

A user scanning a list of items (e.g. products, reviews, agents) needs to
gauge a quality/satisfaction score at a glance via a familiar star-based
visual, backed by the real numeric value for anyone not relying on the
visual alone.

**Why this priority**: Second because it is purely a read-only display
composition (no new interaction model), but still needs its own real
accessibility verification (the star glyphs must not be the only carrier of
the value).

**Independent Test**: Open `rating.html`, confirm the real numeric value
(e.g. "4.2 out of 5") is present as visible, real text — not conveyed by
star count alone — and confirm the star glyphs are `aria-hidden`.

**Acceptance Scenarios**:

1. **Given** a Rating showing 4.2 out of 5, **When** the page is rendered,
   **Then** the numeric value is visible as real text and the star icons
   are marked `aria-hidden="true"`.
2. **Given** a Rating with a fractional value (e.g. 4.2), **When** rendered,
   **Then** the partial-star visual (if any) does not misrepresent the
   value to a sighted user relying only on the stars (the real text value
   is the source of truth either way).

---

### User Story 3 - Multi-menu application navigation via Menubar (Priority: P3)

A user working in an application-style page (as opposed to a marketing/
content page, which Navbar already serves) needs a horizontal row of
top-level menu triggers (e.g. File, Edit, View), each opening its own
dropdown panel, navigable end-to-end via keyboard without touching a mouse.

**Why this priority**: Third because it composes two already-shipped,
already-verified mechanisms (Dropdown Menu's Popover/Anchor-Positioning
wiring, Tabs' roving-tabindex) rather than introducing a new one — lower
technical risk than TreeView, but still a genuinely new composed widget
requiring its own keyboard-conformance verification.

**Independent Test**: Open `menubar.html`, confirm Left/Right arrow keys
move focus between top-level triggers, confirm Down or Enter/Space opens
the focused trigger's panel, and confirm only one panel is open at a time.

**Acceptance Scenarios**:

1. **Given** focus on the "File" menubar trigger, **When** the user presses
   the Right arrow key, **Then** focus moves to the "Edit" trigger without
   opening either panel.
2. **Given** focus on a menubar trigger, **When** the user presses Enter,
   Space, or Down, **Then** that trigger's panel opens and focus moves to
   its first menu item.
3. **Given** one menubar panel already open, **When** the user moves focus
   to a different top-level trigger via arrow key, **Then** the previously
   open panel closes and (if the interaction model calls for it) the newly
   focused trigger's panel opens in its place, so at most one panel is ever
   open at once.

---

### User Story 4 - Color selection via ColorPicker/ColorInput (Priority: P4)

A user configuring a visual preference (e.g. a label color, a theme accent)
needs to pick an arbitrary color via a familiar OS-level color picker
interface, with the result exposed as a real, form-submittable value.

**Why this priority**: Lowest risk in this batch — a native `<input
type="color">` already provides the entire picker UI, keyboard operability,
and value handling for free; the only work is visual integration with this
catalog's existing form-control language.

**Independent Test**: Open `color-input.html`, confirm the native color
input is keyboard-focusable and exposes a real hex `value`, and confirm its
visual treatment (border/ring) matches TextInput's established language.

**Acceptance Scenarios**:

1. **Given** the ColorInput is focused, **When** the user presses Enter or
   Space (or clicks), **Then** the browser's native color-picker UI opens
   (out of this project's test scope to assert on directly, per platform
   chrome, matching File Input's precedent for native OS pickers).
2. **Given** a ColorInput with a pre-set value, **When** inspected, **Then**
   its `value` attribute is a valid 7-character hex color string.

---

### Edge Cases

- TreeView: what happens when a branch has no children (a leaf node) — it
  MUST NOT render a disclosure triangle/expand affordance for a node with
  nothing to expand.
- TreeView: what happens at very deep nesting (4+ levels) — indentation
  MUST remain visually distinguishable at each level without becoming
  illegibly cramped at the 320px breakpoint.
- Rating: what happens when the value is a whole number (e.g. "5 out of
  5") — the display MUST NOT imply a fractional/partial star that doesn't
  exist.
- Rating: what happens when the count of reviews/votes backing the rating
  is zero or not provided — the component MUST NOT display a rating value
  with no real backing data implied.
- Menubar: what happens when the user presses Escape while a panel is
  open — focus MUST return to the triggering top-level item (matching
  Dropdown Menu's existing close-and-return-focus behavior), not be lost
  to the document body.
- Menubar: what happens when the user Tabs away from the menubar entirely
  while a panel is open — the panel MUST close (matching light-dismiss
  behavior already established for Dropdown Menu/Popover), not remain open
  and orphaned.
- ColorInput: what happens when the input is disabled — it MUST NOT be
  focusable or openable, matching every other disabled form control in
  this catalog.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a TreeView displaying a hierarchical,
  recursively-nested structure where each branch with children can be
  independently expanded and collapsed, preserving each branch's own state
  independent of its ancestors' state.
- **FR-002**: TreeView's expand/collapse affordance MUST be reachable and
  operable via keyboard alone, using native semantics rather than a custom
  ARIA tree role, unless empirical verification finds native semantics
  insufficient (in which case the contract MUST document why and what was
  used instead).
- **FR-003**: System MUST provide a Rating display conveying a numeric
  score as real, visible text, with any star/icon visualization marked
  decorative (`aria-hidden`) and never the sole carrier of the value.
- **FR-004**: Rating in this feature is read-only/display-only; no
  clickable/settable rating input is included in this batch's scope.
- **FR-005**: System MUST provide a Menubar with a horizontal row of
  top-level triggers, each opening an associated dropdown panel, where
  Left/Right arrow keys move focus among top-level triggers and Down/
  Enter/Space open the focused trigger's panel.
- **FR-006**: Menubar MUST ensure at most one panel is open at a time and
  MUST return focus to the triggering element when its panel closes
  (via Escape or light-dismiss).
- **FR-007**: System MUST provide a ColorPicker/ColorInput using the
  native `<input type="color">` element, styled to match this catalog's
  existing form-control visual language (border/ring treatment), with no
  custom JavaScript-driven color-swatch picker.
- **FR-008**: All four components MUST meet this design system's existing
  accessibility bar (zero automated accessibility-scan violations, full
  keyboard operability, WCAG AAA text contrast / WCAG AA non-text contrast
  for every color pairing they introduce).
- **FR-009**: All four components MUST be visually verified at this design
  system's four standard breakpoints and MUST NOT introduce any new
  client-side dependency beyond what this design system already uses.

### Key Entities

- **TreeView**: a recursively-nested hierarchy of labeled nodes, each
  optionally containing child nodes and independently tracking its own
  expanded/collapsed state.
- **Rating**: a numeric score bounded by a minimum and maximum (e.g. 0–5),
  displayed as real text with a decorative star visualization.
- **Menubar**: a horizontal collection of top-level menu triggers, each
  associated with one dropdown panel of menu items; at most one panel open
  at a time.
- **ColorPicker/ColorInput**: a single color value, exposed as a hex
  string, selected via the native OS-level color-picker interface.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four components pass automated accessibility scans with
  zero violations across every interactive and static state.
- **SC-002**: All four components are fully operable using only a
  keyboard, with no functionality reachable exclusively via mouse or
  touch.
- **SC-003**: A team composing a real page using TreeView and/or Rating
  alongside components from features 001–015 can do so using only
  already-shipped components, with zero one-off custom markup needed for
  anything covered by this feature.
- **SC-004**: Every new color/contrast pairing introduced by this feature
  is independently, empirically verified against the applicable WCAG
  threshold rather than assumed from a superficially similar existing
  pairing.
- **SC-005**: Adding any of these four components to an existing page
  introduces zero visual regressions to any previously shipped component.

## Assumptions

- This feature ships as static HTML + Tailwind components only, in this
  repository's existing `src/components/<name>/` convention; a React port
  is explicitly deferred to a future feature, mirroring how features
  011/012/014/015 (static) preceded their respective React port batches.
- Date Picker/Calendar, interactive/sortable Data Table, Carousel, Chart,
  Scroll Area, Resizable panels, and HoverCard remain on the "Known
  Catalog Gaps" list (constitution v1.12.0) — explicitly out of scope for
  this feature, not silently dropped, each requiring a substantially new
  architectural decision (a date library, a data-viz strategy,
  virtualization, drag-resize physics) better scoped as its own future
  feature.
- Rating ships read-only/display-only in this batch; a clickable/settable
  rating input is a possible future enhancement, explicitly deferred
  rather than partially built.
- TreeView's approach (native `<details>/<summary>` recursively nested,
  zero JavaScript) is a starting hypothesis to be empirically verified
  during planning/research, not a foregone conclusion — if nested
  `<details>` genuinely cannot produce correct accessible semantics or
  indentation, the plan MUST document the actual mechanism used instead
  and why the native-first approach was rejected.
- Menubar's keyboard model (Left/Right between top-level triggers, Down/
  Enter/Space to open) mirrors the WAI-ARIA Menubar pattern and reuses
  this catalog's existing Dropdown Menu (panel mechanics) and Tabs
  (roving-tabindex) precedents rather than inventing a third keyboard
  idiom.
