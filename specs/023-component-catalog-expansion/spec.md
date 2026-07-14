# Feature Specification: Component Catalog Expansion (Batch 1)

**Feature Branch**: `023-component-catalog-expansion`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "busque por mais componentes amplamente
usados e que poderiam ser adicionados a este System Design, busque na
internet o que estiver faltando aqui, olhe para no minimo vinte
concorrentes e revise possíveis componentes para adicionar aqui,
planeje, crie taks e implemente automaticamente."

(Translation: search for more widely-used components that could be
added to this design system, search the internet for what's missing
here, look at a minimum of twenty competitors and review possible
components to add here, plan, create tasks, and implement
automatically.)

**Research basis**: This feature draws on two rounds of research: (1)
feature 018's "Component Gap Inventory" — a 105-candidate inventory
already cross-referenced against PrimeReact, Mantine, Ant Design, Radix
Primitives, Chakra UI, Carbon, Polaris, Primer, and Fluent 2 — and (2) a
fresh confirmatory round for this feature covering Material UI (MUI),
shadcn/ui, Salesforce Lightning Design System (85+ components), Adobe
Spectrum (70+ components), Atlassian Design System, Headless UI, Base
UI, DaisyUI, Bootstrap, Semantic UI, Blueprint, Evergreen, and NextUI/
HeroUI — 22 named competitors in total across both rounds, comfortably
clearing the requested minimum of 20. The fresh round confirmed no
material new component category has emerged since 018 (see
`research.md` for citations); this feature selects and ships a
concrete, buildable slice of the existing 105-candidate inventory rather
than re-deriving it from scratch.

**Scope note**: unlike feature 018 (research/inventory only), this
feature commits to actually shipping a batch. Given the 105-candidate
inventory is far too large for one feature (018's own stated scope), this
batch is deliberately curated to the 14 candidates that (a) reuse an
existing mechanism already in this catalog rather than requiring a
genuinely new interaction pattern, and (b) are broadly, cross-library
established (not one-off or niche). Remaining candidates stay in the
inventory for future batches, matching the precedent already set by
features 014-017/019/020/022 each taking a slice of 018's inventory.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Richer form inputs without leaving this catalog (Priority: P1)

A developer building a form with this catalog currently has to drop to
plain `TextInput` for a password field (no show/hide toggle), a
quantity/stepper field (no +/- control), or a multi-value tag field (no
removable-chip select) — all near-universal, cross-library form
patterns (PrimeReact, Mantine, Ant Design) this catalog doesn't yet
offer as first-class components.

**Why this priority**: Forms are this catalog's largest existing
category (Forms, Validation & Inputs) and the most frequently composed
into real pages — closing these three specific, well-established gaps
delivers the broadest immediate value.

**Independent Test**: Each of NumberInput, PasswordInput, and
MultiSelect can be dropped into a page on its own, used with keyboard
and mouse, and produces a correct value — independent of the other
stories in this feature.

**Acceptance Scenarios**:

1. **Given** a NumberInput, **When** a user clicks the increment/
   decrement buttons or types a value directly, **Then** the value
   updates and respects any configured min/max/step bounds.
2. **Given** a PasswordInput, **When** a user clicks the show/hide
   toggle, **Then** the field's `type` switches between `password` and
   `text` without losing the typed value or cursor position.
3. **Given** a MultiSelect, **When** a user picks multiple options,
   **Then** each becomes a removable chip, and removing a chip updates
   the underlying value immediately.

---

### User Story 2 - Common button variants for real-world toolbars (Priority: P1)

A developer building a toolbar or card action row currently has only
this catalog's single `Button` component and no icon-only, copy-to-
clipboard, or button+dropdown-attached variant — all of which are
near-universal across Mantine, Fluent 2, and Carbon's button
inventories and are used constantly in real toolbars (e.g. a copy-link
button next to a URL, an icon-only "more" action, a "Save ▾ Save as
draft" split action).

**Why this priority**: Equal priority to Story 1 — buttons are this
catalog's second-most-composed primitive after form inputs, and all
three variants reuse the existing `Button` component's own variant
system rather than introducing a new one.

**Independent Test**: Each of ActionIcon, CopyButton, and Split Button
can be dropped into a page independently and exercised via keyboard and
mouse.

**Acceptance Scenarios**:

1. **Given** an ActionIcon, **When** rendered, **Then** it exposes an
   accessible name via `aria-label` (there is no visible text label) and
   receives visible focus like any other button.
2. **Given** a CopyButton, **When** clicked, **Then** the target text is
   written to the clipboard and the button shows a temporary "Copied"
   confirmation state before reverting.
3. **Given** a Split Button, **When** the primary segment is clicked,
   **Then** its default action fires; **When** the attached dropdown
   segment is clicked, **Then** a menu of alternate actions opens (reusing
   Dropdown Menu's existing panel mechanics).

---

### User Story 3 - Small, high-frequency data-display primitives (Priority: P2)

A developer composing a page currently has to hand-roll a stacked-
avatar cluster, a highlighted search-match substring, inline/block code
display, or a color swatch chip — all trivial-to-moderate, extremely
common building blocks (Mantine, Ant Design, PrimeReact) that don't
warrant a bespoke one-off implementation every time they're needed.

**Why this priority**: Lower priority than Stories 1-2 — these are
smaller, more decorative primitives rather than core interactive
controls, but still genuinely reused across many page types (user lists,
search results, documentation, theme/brand pages).

**Independent Test**: Each of Avatar Group, Highlight, Code, and
ColorSwatch renders correctly and independently, with no dependency on
the other stories.

**Acceptance Scenarios**:

1. **Given** an Avatar Group with more members than its configured
   visible limit, **When** rendered, **Then** it shows the limit's worth
   of overlapping avatars plus a "+N" overflow indicator.
2. **Given** Highlight with a substring to match, **When** rendered,
   **Then** only the matching substring(s) receive the highlight
   treatment, case-insensitively.
3. **Given** Code in its inline and block variants, **When** rendered,
   **Then** both use a monospace token consistent with this catalog's
   existing Kbd component.
4. **Given** a ColorSwatch, **When** rendered, **Then** it displays the
   given color as a small chip with an accessible text alternative (not
   color alone) conveying the value.

---

### User Story 4 - Navigation and content-disclosure utilities (Priority: P2)

A developer building navigation or long-form content currently has to
reuse Sidebar's active-link styling by hand for a plain nav link, use a
raw `<a>` for inline links with no consistent token, or hand-roll a
"show more" text truncation and a non-grouped collapsible container
(this catalog's existing Accordion always groups items and closes
siblings — sometimes a single, independent collapsible is what's
actually needed).

**Why this priority**: Same tier as Story 3 — genuinely useful,
frequently-reused utilities, but secondary to the core interactive
controls in Stories 1-2.

**Independent Test**: Each of NavLink, Anchor, Collapse, and Spoiler
renders and behaves correctly on its own.

**Acceptance Scenarios**:

1. **Given** a NavLink marked as the current page, **When** rendered,
   **Then** it carries `aria-current="page"` and the same visual
   treatment Sidebar's active item already uses.
2. **Given** an Anchor, **When** rendered inline within a paragraph,
   **Then** it uses this catalog's existing link/text tokens rather than
   unstyled browser defaults.
3. **Given** a Collapse, **When** toggled open, **Then** its content
   becomes visible without affecting any sibling Collapse instances
   (unlike Accordion's grouped, mutually-exclusive behavior).
4. **Given** a Spoiler over long text, **When** collapsed, **Then** the
   text is visually truncated with a "Show more" control; **When**
   expanded, **Then** the full text is shown with a "Show less" control.

---

### Edge Cases

- What happens when NumberInput's typed value is manually entered outside
  its configured min/max? It MUST clamp to the nearest bound on blur,
  matching the native `<input type="number">` clamping convention this
  catalog already relies on elsewhere.
- What happens when CopyButton's clipboard write fails (e.g. permissions
  denied, non-secure context)? It MUST show a distinct failure state
  rather than silently claiming success.
- What happens when Avatar Group receives fewer members than its visible
  limit? No "+N" overflow indicator is shown at all.
- What happens when Split Button's dropdown segment is activated via
  keyboard only? It MUST open and be fully keyboard-navigable, matching
  this catalog's existing Dropdown Menu keyboard behavior exactly (no new
  keyboard model to learn).
- What happens when MultiSelect has zero options selected? It MUST show
  the same placeholder-text convention this catalog's Select/Combobox
  already use, not a bare empty box.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a NumberInput component with
  increment/decrement controls, direct keyboard entry, and configurable
  min/max/step.
- **FR-002**: System MUST provide a PasswordInput component with a
  show/hide visibility toggle that preserves the field's value and
  cursor position across toggles.
- **FR-003**: System MUST provide a MultiSelect component allowing
  multiple option selection, rendering each selection as a removable
  chip.
- **FR-004**: System MUST provide an ActionIcon component: an icon-only
  button variant with a mandatory accessible name.
- **FR-005**: System MUST provide a CopyButton component that writes
  given text to the clipboard and shows a temporary success (or failure)
  confirmation state.
- **FR-006**: System MUST provide a Split Button component: a primary
  action segment plus an attached dropdown segment exposing alternate
  actions, reusing Dropdown Menu's existing panel mechanics.
- **FR-007**: System MUST provide an Avatar Group component that
  displays a configurable number of overlapping avatars plus a "+N"
  overflow indicator when the member count exceeds that limit.
- **FR-008**: System MUST provide a Highlight component that renders
  text with a given substring (or substrings) visually highlighted,
  case-insensitively.
- **FR-009**: System MUST provide a Code component with inline and block
  variants, reusing this catalog's existing monospace/Kbd token.
- **FR-010**: System MUST provide a ColorSwatch component displaying a
  given color value as a chip, with a non-color-only accessible text
  alternative.
- **FR-011**: System MUST provide a NavLink component supporting an
  active/current state (`aria-current="page"`), reusing Sidebar's
  existing active-item visual treatment.
- **FR-012**: System MUST provide an Anchor component: a styled inline
  link primitive reusing this catalog's existing text/link tokens.
- **FR-013**: System MUST provide a Collapse component: a single,
  independent collapsible container (distinct from Accordion's grouped,
  mutually-exclusive multi-item behavior).
- **FR-014**: System MUST provide a Spoiler component: expandable/
  collapsible text truncation with "Show more"/"Show less" controls.
- **FR-015**: Every new component in this batch MUST ship on both
  surfaces (static HTML/vanilla JS and the React package), consistent
  with this catalog's existing dual-surface convention.
- **FR-016**: Every new component MUST meet this catalog's WCAG 2.2 AAA
  contrast and keyboard-accessibility requirements (Constitution
  Principle II), using only already-ratified design tokens (Principle
  IV) — no new colors, spacing, or radii introduced for this batch.

### Key Entities

- **NumberInput / PasswordInput / MultiSelect**: form input components,
  each an enhancement of this catalog's existing TextInput/Select/
  Combobox mechanics.
- **ActionIcon / CopyButton / Split Button**: button variants, each
  reusing the existing Button component's variant system.
- **Avatar Group / Highlight / Code / ColorSwatch**: data-display
  micro-components, each reusing existing Avatar/typography/Badge
  tokens.
- **NavLink / Anchor / Collapse / Spoiler**: navigation and content-
  disclosure utilities, reusing Sidebar/Accordion mechanics.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 14 components in this batch are usable independently
  (each can be dropped into a page and used correctly with zero
  dependency on the others).
- **SC-002**: 100% of the 14 components pass this catalog's existing
  automated accessibility check (axe-core, zero violations) across all
  tested viewports.
- **SC-003**: 100% of the 14 components are available on both the
  static HTML and React surfaces with identical behavior.
- **SC-004**: Zero new design tokens (colors, spacing, radii, or
  typography scale values) are introduced — every component reuses
  already-ratified tokens.
- **SC-005**: A developer can find and correctly use any of the 14 new
  components by following the same page-per-component gallery
  convention already used by this catalog's other ~60 components,
  without needing external documentation.

## Assumptions

- This batch deliberately excludes "Dark Mode Toggle", even though
  feature 018's inventory flagged it as "the most directly actionable
  entry" at the time it was written (2026-07-12) — that framing predates
  feature 021's Gallery Theme Selector, which already shipped a full
  N-way curated-theme `<select>` (not a binary light/dark toggle). A
  simple binary Dark Mode Toggle would conflict with, not complement,
  the theming model this catalog has since built. Deferred, with this
  rationale recorded, rather than mechanically included.
- This batch deliberately excludes candidates already flagged in 018's
  research.md for de-duplication review (NativeSelect, SegmentedControl,
  CloseButton, Burger, Drawer, Statistic, Activity Feed, Autocomplete) —
  each has enough overlap with an existing shipped component that
  including it risks a redundant, confusing near-duplicate rather than a
  genuine gap.
- This batch deliberately excludes candidates requiring a materially new
  interaction pattern (RingProgress, LoadingOverlay, TagsInput, Cascader,
  TreeSelect, PickList/Transfer, and others still in the 105-candidate
  inventory) to keep this feature's scope buildable in one pass — they
  remain available for a future batch.
- "Both surfaces" follows this catalog's existing dual-surface
  convention (static HTML/vanilla JS + React), with shared pure logic
  (e.g. clipboard-copy state, chip removal) factored into a
  `shared/catalog-expansion/` module only where genuine cross-surface
  logic exists (e.g. MultiSelect's chip state) — purely presentational
  components (Anchor, ColorSwatch, Code) need no shared module.
- No new npm dependency is required for any of the 14 components — all
  rely on native browser APIs (Clipboard API for CopyButton, native
  `<details>` for Collapse/Spoiler) or already-established patterns from
  this catalog's existing components.
