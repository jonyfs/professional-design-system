# Feature Specification: Data Display Composables

**Feature Branch**: `033-data-display-composables`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "implemente as primitivas de Data Display
identificadas no inventário da feature 018 que são composições triviais
de tokens já existentes (ThemeIcon, BackgroundImage, Blockquote,
Watermark) — reutilizam fortemente Badge, Avatar e as convenções de
tipografia já existentes."

**Source (verified, not assumed)**: `specs/018-component-gap-inventory/
research.md`'s "Data Display (16)" category — 4/16 already shipped
(ColorSwatch, Spoiler, Highlight, Code, feature 023). Of the 12
remaining, this feature ships the 4 flagged with the simplest
buildability signal ("trivial CSS composition"/"reuses existing
tokens verbatim") — ThemeIcon, BackgroundImage, Blockquote, Watermark
— deliberately split from the category's other 5 genuinely-new-pattern
candidates (OverflowList, RollingNumber, PickList/Transfer, Gallery,
Compare), which warrant their own future feature rather than one
oversized batch. TreeTable and QRCode remain explicitly deferred per
the inventory's own notes (TreeTable cross-references the
already-deferred interactive Data Table gap; QRCode needs a new
client-side dependency, flagged for a future Principle VII review).

This feature ships **4** of the category's remaining 12 items,
bringing the category to 8/16.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Iconography with semantic color meaning (Priority: P1)

A developer needs an icon wrapped in a colored circle to convey
semantic meaning at a glance (e.g. a feature icon on a pricing page, a
status icon in a list) — reusing this catalog's existing semantic
color conventions (the same success/warning/error/info/brand palette
Badge already uses) rather than inventing a new color system.

**Why this priority**: The most broadly reusable item, directly
analogous to Badge/Avatar's existing patterns.

**Independent Test**: Render ThemeIcon with each semantic color —
confirm the icon sits centered in a colored circle matching Badge's
exact color-token convention.

**Acceptance Scenarios**:

1. **Given** a semantic color is specified, **When** ThemeIcon renders,
   **Then** it shows an icon centered in a circle using that color's
   existing token (background + icon color), matching Badge's own
   opacity/ring convention.

---

### User Story 2 - Text-focused display composables (Priority: P2)

A developer needs a quoted passage (Blockquote) or a background-image
container with overlaid content (BackgroundImage) — both pure
composition of this catalog's existing typography/spacing tokens, no
new visual mechanism.

**Why this priority**: Common content-display needs, moderate
priority since narrower in scope than ThemeIcon's broad applicability.

**Independent Test**: Render Blockquote — confirm it visually
distinguishes quoted text (border/indent/italic) using existing
typography tokens. Render BackgroundImage — confirm content overlays
a background image with legible contrast.

**Acceptance Scenarios**:

1. **Given** a quoted passage, **When** Blockquote renders, **Then**
   it's visually distinguished from body text via an accent border and
   typographic treatment, using only existing tokens.
2. **Given** a background image and overlaid content, **When**
   BackgroundImage renders, **Then** the content remains legible
   against the image (a scrim/overlay ensures contrast), reusing
   existing neutral/overlay tokens.

---

### User Story 3 - Repeated background watermark (Priority: P3)

A developer needs a repeated background text/image watermark (e.g. a
"DRAFT" or "CONFIDENTIAL" overlay) for a content region — primarily a
CSS technique, no new component mechanism.

**Why this priority**: Narrowest, most specific use case of the four.

**Independent Test**: Render a Watermark-wrapped content region —
confirm the watermark text repeats across the background without
obscuring the actual content's legibility.

**Acceptance Scenarios**:

1. **Given** a content region wrapped in Watermark, **When** it
   renders, **Then** the watermark text tiles across the background at
   low opacity, and the foreground content remains fully legible.

---

### Edge Cases

- What happens if ThemeIcon receives an icon significantly larger or
  smaller than its circle? The circle MUST size to accommodate the
  icon consistently at each of this catalog's existing size scales
  (matching Avatar's `sm`/`lg` convention), never clipping the icon.
- What happens if BackgroundImage's image fails to load? Content MUST
  remain legible and usable even without the image (a neutral
  fallback background), not break the layout.
- What happens if Watermark's content region is very short (less than
  one repeat of the watermark pattern)? It MUST still render without
  error, even if only a partial watermark tile is visible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide ThemeIcon reusing this catalog's
  existing semantic color tokens (brand/success/warning/error/info),
  matching Badge's own opacity/ring convention, at Avatar's existing
  `sm`/`lg` size scale.
- **FR-002**: System MUST provide Blockquote using only existing
  typography/spacing tokens, with no new color or font token.
- **FR-003**: System MUST provide BackgroundImage compositing
  arbitrary content over a caller-supplied image with a legible-
  contrast scrim, degrading gracefully if the image fails to load.
- **FR-004**: System MUST provide Watermark as a pure CSS repeating-
  background technique layered behind arbitrary content, never
  obscuring that content's legibility.
- **FR-005**: Every new primitive MUST ship on both this catalog's
  existing surfaces (static HTML and React), per the dual-surface
  convention.
- **FR-006**: None of the 4 primitives MUST introduce a new design
  token — reuse this catalog's existing brand/semantic/neutral/
  typography set.
- **FR-007**: Every new primitive MUST meet this catalog's existing
  WCAG AAA contrast bar for any text content it displays.

### Key Entities

- **ThemeIcon**: an icon (caller-supplied SVG/markup), a semantic
  color, and a size (`sm`/`lg`, matching Avatar).
- **Blockquote**: quoted text content, optionally an attribution/cite.
- **BackgroundImage**: an image URL/source and arbitrary overlaid
  content.
- **Watermark**: a repeating text/pattern value and arbitrary
  foreground content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 4 primitives ship, bringing feature 018's inventory's
  Data Display category from 4/16 to 8/16 — the remaining 8 items
  (5 genuinely-new-pattern candidates deferred to a future feature,
  TreeTable/QRCode explicitly out of scope per prior notes) are
  documented, not silently dropped.
- **SC-002**: Zero new design tokens introduced — 100% verified via
  this catalog's existing token audit.
- **SC-003**: BackgroundImage's overlaid content and Watermark's
  foreground content both meet this catalog's AAA contrast bar against
  their respective backgrounds, verified via a real contrast check,
  not assumed from the scrim/opacity values alone.

## Assumptions

- **ThemeIcon's icon content is caller-supplied**: the primitive
  provides the colored-circle wrapper and sizing; it does not ship its
  own icon library (consistent with how this catalog's other icon-
  using components — Alert, ActionIcon — accept caller-supplied SVG
  markup rather than bundling an icon set).
- **BackgroundImage's fallback is a neutral background color**, not a
  placeholder image — consistent with this catalog's existing
  no-new-dependency discipline (no image-loading library introduced).
- **React port for every primitive**: all 4 ship a React component
  wrapper too, per this catalog's existing dual-surface convention.
- **No de-duplication conflict**: none of the 4 items appear in
  feature 018's own "Flagged for de-duplication review" list.
