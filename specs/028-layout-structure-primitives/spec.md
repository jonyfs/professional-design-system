# Feature Specification: Layout & Structure Primitives

**Feature Branch**: `028-layout-structure-primitives`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "implemente as primitivas de Layout &
Structure identificadas no inventário da feature 018 (AppShell,
Container, Grid, Flex, SimpleGrid, Stack, Group, Center, Paper) — a
única categoria do inventário de 105 candidatos ainda em 0/9
implementados, e a mais fundamental já que outros componentes
dependem dessas primitivas de layout."

**Source (verified, not assumed)**: `specs/018-component-gap-inventory/
research.md`'s "Layout & Structure (9)" category — the only one of
the inventory's 13 categories with zero shipped candidates. Each of
the 9 is cross-referenced there against a real source library
(Mantine, Chakra, Carbon) with a buildability signal (reuses an
existing mechanism in this catalog vs. needs a new pattern):
Container, Flex, Stack, Group, Center, and Paper are flagged as
reusing this catalog's existing token conventions (max-width/padding,
flex utilities, `space-y-*`, `gap-*`, Card's surface/shadow tokens,
respectively); Grid is flagged as a new pattern; SimpleGrid reuses
Grid's conventions once built; AppShell is flagged as the most
structurally distinct — a page-level layout shell, not a variant of
this catalog's existing Sidebar/Navbar.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent spacing without hand-rolled margins (Priority: P1)

A developer assembling a page currently reaches for ad hoc margin/
padding utility combinations every time they need vertical or
horizontal spacing between elements, or need to center a single item.
They want ratified, named primitives for these three universal
patterns instead.

**Why this priority**: These three (Stack, Group, Center) are the
simplest, most-reused, and most foundational of the 9 — nearly every
other component and page composition in this catalog already
implicitly wants one of these patterns. They deliver immediate,
catalog-wide value with the lowest implementation risk.

**Independent Test**: Compose a small page fragment using only Stack,
Group, and Center — confirm consistent, token-driven spacing renders
correctly with zero hardcoded margin/padding values.

**Acceptance Scenarios**:

1. **Given** a list of items needing consistent vertical spacing,
   **When** a developer wraps them in Stack, **Then** the spacing
   between each item uses one of this catalog's ratified spacing
   tokens, configurable by a size prop.
2. **Given** a row of items needing consistent horizontal spacing
   (e.g., a button toolbar), **When** a developer wraps them in Group,
   **Then** the items lay out horizontally with ratified gap spacing
   and wrap sensibly on narrow viewports.
3. **Given** a single item that needs to be centered within its
   container, **When** a developer wraps it in Center, **Then** it is
   both horizontally and vertically centered with no manual
   flex/margin calculation.

---

### User Story 2 - Consistent content width and a lightweight surface (Priority: P2)

A developer wants a standard way to constrain page content to a
readable maximum width with consistent side padding (rather than
repeating the same max-width/padding combination on every page), and
a lightweight surface for grouping content that doesn't need Card's
full visual weight (border, shadow, header/footer slots).

**Why this priority**: Both reuse existing tokens directly (Container
from this catalog's existing max-width/padding conventions, Paper from
Card's existing surface/shadow tokens) — low implementation risk,
immediately useful, but secondary to Story 1's more universal spacing
primitives.

**Independent Test**: Replace a page's hand-written max-width wrapper
with Container, and a Card used purely as a plain content grouping
(no header/footer) with Paper — confirm both render identically to
the hand-rolled version they replace.

**Acceptance Scenarios**:

1. **Given** page content that should be width-constrained and
   centered, **When** a developer wraps it in Container, **Then** it
   renders at a consistent, ratified max-width with consistent side
   padding at every breakpoint.
2. **Given** content that needs a minimal surface (background +
   optional border) without Card's full chrome, **When** a developer
   uses Paper, **Then** it renders with the same surface/shadow tokens
   Card already uses, at a lighter visual weight.

---

### User Story 3 - Responsive multi-item layout arrangement (Priority: P3)

A developer wants to arrange multiple items in a responsive grid or
flexible row/column layout — for example, a gallery of cards that
should reflow from 4 columns to 1 as the viewport narrows — using a
ratified primitive instead of hand-writing CSS Grid or Flexbox
utility combinations on every page.

**Why this priority**: Genuinely new layout mechanics (Grid) with
higher implementation surface than Stories 1-2's direct token reuse,
but still clearly scoped and valuable — this is the natural next step
once the simpler primitives exist.

**Independent Test**: Replace a hand-written responsive grid (e.g., an
existing demo page's card grid) with the new Grid primitive — confirm
identical responsive column behavior at all four standard
breakpoints (320/768/1024/1440).

**Acceptance Scenarios**:

1. **Given** a set of items needing a responsive grid layout, **When**
   a developer uses Grid with a column-count prop, **Then** items
   reflow to fewer columns at narrower breakpoints per a documented,
   consistent rule.
2. **Given** a set of items needing a simpler, evenly-sized grid
   (no per-item column spanning), **When** a developer uses
   SimpleGrid, **Then** items lay out in equal-width columns that
   reflow the same way Grid does.
3. **Given** items needing flexible (not strictly gridded) row or
   column arrangement, **When** a developer uses Flex, **Then** they
   arrange using this catalog's existing flex-utility conventions
   under one named primitive.

---

### User Story 4 - Composable page shell (Priority: P4)

A developer starting a new page with a header, a sidebar, and a main
content region currently wires Navbar, Sidebar, and a content wrapper
together by hand each time, re-deriving the same layout math. They
want a single primitive that composes this catalog's existing Navbar
and Sidebar into one consistent page-shell arrangement.

**Why this priority**: The most structurally distinct and highest-
scope item in this batch (a genuine new layout pattern, not a token-
reuse variant) — appropriately last, and independently valuable on
its own once shipped.

**Independent Test**: Build a representative page (header + sidebar +
scrollable main content) using only AppShell, Navbar, and Sidebar —
confirm the regions position and scroll correctly at all standard
breakpoints, including the mobile-collapsed sidebar state.

**Acceptance Scenarios**:

1. **Given** a page needing a header, collapsible sidebar, and main
   content region, **When** a developer composes AppShell with this
   catalog's existing Navbar and Sidebar, **Then** the three regions
   position correctly with no layout-math duplication.
2. **Given** a narrow viewport, **When** AppShell's sidebar region is
   present, **Then** it reflows to a stacked, full-width layout above
   the main content region via CSS alone — Sidebar itself has no
   existing collapse mechanism to reuse (verified directly, research.md
   R5), so AppShell does not invent a new toggle/drawer pattern to
   compensate.

---

### Edge Cases

- What happens when Stack/Group's children include an item with its
  own conflicting margin? These primitives MUST NOT strip or override
  a child's own styling — spacing is applied via the parent's own
  gap/space mechanism, not by mutating children.
- What happens when Container is nested inside another Container? The
  inner one MUST still apply its max-width/padding consistently — no
  special-cased "first Container only" behavior.
- What happens when Grid/SimpleGrid receives more items than fit one
  screen height? Items MUST wrap to additional rows, never overflow
  or clip.
- What happens when AppShell is used without a Sidebar (header +
  content only)? The content region MUST still render correctly
  full-width — Sidebar is an optional region, not a hard dependency.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide Stack, Group, and Center as
  standalone primitives, each reusing this catalog's existing spacing
  token conventions (`space-y-*`/`gap-*`) rather than introducing new
  spacing values.
- **FR-002**: System MUST provide Container and Paper, reusing this
  catalog's existing max-width/padding tokens and Card's existing
  surface/shadow tokens respectively.
- **FR-003**: System MUST provide Grid, SimpleGrid, and Flex as
  responsive layout primitives, each following this catalog's
  existing 4-breakpoint convention (320/768/1024/1440).
- **FR-004**: System MUST provide AppShell as a composition of this
  catalog's existing Navbar and Sidebar components — AppShell MUST
  reuse Navbar's existing responsive mobile-menu behavior verbatim
  (verified real and working: a native `<details>/<summary>` menu).
  Sidebar has no equivalent existing mobile-collapse mechanism
  (verified directly against its source, not assumed) — AppShell's
  own mobile behavior for the sidebar region is a pure CSS reflow
  (stacks above main content below 768px), not a reuse of a
  collapse behavior that doesn't exist. A hidden/toggleable sidebar
  drawer is explicitly out of scope for this feature (see research.md
  R5).
- **FR-005**: Every one of the 9 primitives MUST ship on both this
  catalog's existing surfaces (static HTML and React), per this
  catalog's dual-surface shipping convention — Grid/SimpleGrid/Flex/
  Stack/Group/Center/Container/Paper are presentational-only (no
  interactive state), so the static-HTML surface for those is a
  direct Tailwind-class usage pattern documented in this catalog's
  existing conventions, not a scripted component requiring its own
  demo page — see plan.md for the exact per-primitive shipping
  decision.
- **FR-006**: None of the 9 primitives MUST introduce a new spacing,
  breakpoint, radius, shadow, or color token — 100% token reuse from
  this catalog's existing ratified set (Constitution Principle IV).
- **FR-007**: Every new primitive MUST meet this catalog's existing
  WCAG AAA contrast bar wherever it renders text or a border boundary
  (inherited automatically since no new colors are introduced, but
  verified per this catalog's standing audit process, not assumed).

### Key Entities

- **Layout Primitive**: a presentational-only building block (one of
  the 9) with zero interactive state, zero new design tokens, and a
  documented composition contract (what children it accepts, what
  props control its ratified-token spacing/sizing choices).
- **AppShell Region**: header / sidebar / main — a named layout slot
  AppShell arranges, each populated by this catalog's own existing
  components (Navbar for header, Sidebar for sidebar), not by new
  region-specific components.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 9 primitives ship, closing the Layout & Structure
  category's gap from 0/9 to 9/9 in the feature 018 inventory.
- **SC-002**: Zero new design tokens introduced across all 9
  primitives (Constitution Principle IV) — 100% verified via this
  catalog's existing token audit.
- **SC-003**: A developer can replace an existing hand-written
  layout pattern (e.g., a demo page's max-width wrapper, or a
  responsive card grid) with the new primitives with zero visual
  regression, verified via this catalog's existing visual-regression
  suite.
- **SC-004**: AppShell composes with zero duplicated logic — Navbar's
  existing sticky/mobile-menu behavior is reused verbatim; the
  sidebar region reflows to a stacked, full-width layout below 768px
  via CSS alone (Sidebar has no existing collapse mechanism to reuse
  — see research.md R5), not reimplemented as a new toggle script.

## Assumptions

- **Static-HTML shipping form for pure-layout primitives**: Stack,
  Group, Center, Container, Paper, Grid, SimpleGrid, and Flex have no
  interactive behavior — their "static HTML surface" is a documented
  Tailwind-class composition pattern (consistent with how this
  catalog documents its own existing utility conventions), not a
  scripted component needing its own JS file. AppShell, composing
  Navbar/Sidebar, inherits whatever minimal script those already
  require (mobile menu toggle) with no new script of its own. Exact
  per-primitive shipping mechanics are a planning-phase decision, not
  fixed here.
- **React port for every primitive**: all 9 ship a React component
  wrapper too, per this catalog's existing dual-surface convention,
  even where the "component" is thin (e.g., Stack as a styled `<div>`
  wrapper) — consistency with the rest of the catalog outweighs the
  minor duplication cost for such simple primitives.
- **AppShell scope boundary**: AppShell composes exactly 2 existing
  regions (header via Navbar, sidebar via Sidebar) plus a main content
  slot — it does NOT introduce a new "footer region" or new
  multi-sidebar support; those would be considered a future
  enhancement, not part of this feature's initial scope.
- **No de-duplication conflict**: none of these 9 primitives were
  flagged in feature 018's own "Flagged for de-duplication review"
  list — confirmed distinct from every existing shipped component.
