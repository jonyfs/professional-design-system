# Component Contract: Root Gallery Redesign (User Stories 1 & 2)

## Opening section (FR-001, research.md R3)

- Positioned above the categorized grid, below the existing `<header>`.
- Contains 3-4 concrete stat/claims (component count, dual-surface
  guarantee, WCAG AAA commitment, curated theme count) — each a short
  sentence or number+label pair, not paragraph copy.
- Uses only already-ratified typography/color tokens — no new palette
  entries (Constitution Principle IV).

## Quick-jump navigation (FR-003, research.md R4)

- A `<nav>` containing one `<a href="#<category-id>">` per Gallery
  Category Section, positioned between the opening section and the
  first category.
- Zero JavaScript — native same-page anchor navigation.
- Each link gets the full hover/focus-visible state set (Constitution
  Principle V), matching every other in-page link already in this
  catalog.

## Category sections (FR-002, research.md R1)

- Each category is a `<section id="<category-id>">` with an `<h2>`
  heading matching its constitution-sourced label, containing that
  category's component cards.
- Card markup stays structurally the same as today's (title,
  description, "View full demo →" link) — the redesign changes
  grouping/hierarchy/flagship treatment, not the individual card's
  own internal contract (spec.md FR-007: zero behavior change to any
  component).

## Flagship treatment (FR-004, research.md R2)

- Data Table, Chart, Command Palette, and the curated theme system's
  cards span 2 grid columns at `sm:` and wider breakpoints (vs. 1 for
  routine cards), placed first within their category, and include one
  additional line of "why this matters" copy beyond the existing
  description.
- At the narrowest breakpoint (320px), flagship cards collapse to the
  same single-column width as routine cards — no horizontal overflow
  (spec.md Edge Cases).

## Preserved guarantees (Edge Cases)

- Every component's own demo page remains independently viewable and
  its markup remains directly copyable — this feature changes
  `index.html`'s presentation layer only, never a linked page's
  underlying component markup/behavior.
- Zero-JavaScript components remain zero-JavaScript.

## Acceptance mapping

- Spec.md US1 AC1–AC3, US2 AC1–AC2 → this contract.
- FR-001 through FR-005, FR-007, FR-008 → this contract.
