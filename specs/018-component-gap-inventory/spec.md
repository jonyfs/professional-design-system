# Feature Specification: Component Gap Inventory

**Feature Branch**: `018-component-gap-inventory`

**Created**: 2026-07-12

**Status**: Draft

**Input**: User description: "busque na internet por outros componentes
visuais que podem ser agradados a este Design System, trazendo o máximo
de componentes profissionais existentes, tente chegar ao no mínimo 100
componentes adicionais, busque na internet, por github bem avaliados
para pensar nestes componentes, veja a qualidade do que importa."

(Translation: research the internet for additional visual components
that could be added to this design system, drawing on the maximum number
of existing professional components, aiming for at least 100 additional
components, researching well-rated GitHub projects to inform this list,
prioritizing quality over quantity for what actually matters.)

**Scope note**: this is a research/inventory feature, not an
implementation commitment. The deliverable is a prioritized, quality-
reasoned list of genuine gaps — not a promise that all 100+ ship in one
batch. Actual implementation is scoped and sequenced in future features,
the same way features 014-016 each took a curated slice of a larger,
previously-researched gap list rather than building everything at once.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand what's genuinely missing (Priority: P1)

A user planning this design system's roadmap wants a clear, credible
picture of which real, professionally-established UI components this
catalog still lacks compared to the industry's most-used component
libraries — grounded in actual research, not guesswork — so they can
make an informed decision about what to build next.

**Why this priority**: Without a credible inventory, "add more
components" has no way to be prioritized or trusted — this is the
foundation the rest of the roadmap depends on.

**Independent Test**: Read the inventory and confirm each listed
component (a) is cross-referenced against at least one real, named,
well-established component library, (b) is not already present in this
catalog's existing ~47 shipped components, and (c) is not already
recorded on the existing "Known Catalog Gaps" list without new
information added.

**Acceptance Scenarios**:

1. **Given** the inventory, **When** any entry is checked against this
   catalog's actual shipped components (features 001-016), **Then** it
   is confirmed to be a genuine gap, not a duplicate under a different
   name.
2. **Given** the inventory, **When** any entry is examined, **Then** it
   names at least one real, currently-popular library or design system
   where that component is established (not a component invented purely
   to hit a quota).

---

### User Story 2 - Distinguish real components from page-level content blocks (Priority: P1)

A user reviewing the inventory wants confidence that every entry is a
genuine, reusable UI *component* at the same granularity as this
catalog's existing 47 (e.g. a single control, overlay, or data-display
primitive) — not a marketing-page *section* (e.g. a full pricing table,
hero section, or testimonial block) that would actually just be a
composition of components this catalog already has.

**Why this priority**: Equal priority to Story 1 — mixing atomic
components with page-level content blocks would silently violate this
project's own established scope and inflate the "100 components" number
with things that don't belong in a design system's component catalog
(this project's own composed-example/dashboard-example/settings-example
pages already demonstrate that page-level compositions are built FROM
components, not cataloged as new components themselves).

**Independent Test**: Confirm the inventory has two clearly separated
lists — genuine component candidates, and explicitly-excluded page-level
patterns — with a one-line rationale for each exclusion.

**Acceptance Scenarios**:

1. **Given** the inventory's excluded-patterns list, **When** any entry
   is examined, **Then** its exclusion rationale explains it is a
   composition of already-existing (or already-inventoried) components,
   not a new atomic primitive.
2. **Given** the inventory's included component list, **When** counted,
   **Then** it reaches at least 100 genuine candidates meeting the
   atomic-component bar.

---

### User Story 3 - Prioritize by real value, not alphabetical order (Priority: P2)

A user deciding what to build next wants the inventory grouped in a way
that reflects genuine usefulness and buildability (e.g. by category and
by how novel the required interaction pattern is), rather than a flat,
unordered wall of 100+ names.

**Why this priority**: Lower priority than Stories 1-2 — this is about
the inventory's usability as a planning tool, not its correctness, so it
matters once the list itself is trustworthy.

**Independent Test**: Confirm the inventory is organized into named
categories (e.g. Layout, Advanced Form Inputs, Navigation, Overlays,
Feedback, Data Display, Utility) and that at least a preliminary
buildability signal (reuses an existing mechanism vs. needs a genuinely
new one) is noted per entry or per group.

**Acceptance Scenarios**:

1. **Given** the inventory, **When** browsed, **Then** components are
   grouped into clearly labeled categories matching this catalog's
   existing Component Catalog structure (Application & Navigation, Forms
   & Inputs, Data Display & Listings, Overlays & Feedback, Advanced
   Forms & Interaction).
2. **Given** any entry, **When** examined, **Then** a rough buildability
   signal is available (e.g. "reuses existing X mechanism" vs. "needs a
   new interaction pattern"), consistent with how prior features'
   research phases made this same distinction before committing to a
   build.

### Edge Cases

- What happens when two different well-known libraries use different
  names for what is functionally the same component (e.g. Ant Design's
  "Transfer" and PrimeReact's "PickList")? The inventory MUST list it
  once, noting both names, rather than double-counting toward the 100+
  total.
- What happens when a candidate component is already effectively
  provided by an existing shipped component under a different name
  (e.g. Ant Design's "Descriptions" vs. this catalog's existing
  DataList)? It MUST be excluded from the new-candidates list and,
  if useful, noted as a naming cross-reference instead.
- What happens when a candidate is already on the existing "Known
  Catalog Gaps" list (Date Picker/Calendar, interactive Data Table,
  Carousel, Chart, Scroll Area, Resizable panels, HoverCard)? It MUST NOT
  be re-listed as a "new" gap — at most, cross-referenced.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The inventory MUST identify at least 100 genuine component
  candidates not already present in this catalog's existing ~47 shipped
  components.
- **FR-002**: Every candidate MUST be cross-referenced against at least
  one real, named, currently-popular component library or design system
  (not invented to hit a quota).
- **FR-003**: The inventory MUST explicitly separate genuine atomic
  component candidates from page-level content-block patterns (e.g.
  pricing tables, hero sections, testimonial blocks, footers), with the
  latter excluded and a one-line rationale given per exclusion.
- **FR-004**: The inventory MUST NOT duplicate anything already on the
  existing "Known Catalog Gaps" list (constitution v1.13.0) without new
  information — those remain cross-referenced, not re-counted.
- **FR-005**: The inventory MUST group candidates into named categories
  consistent with this catalog's existing Component Catalog structure.
- **FR-006**: Each candidate SHOULD carry a rough buildability signal
  (reuses an existing mechanism already in this catalog vs. requires a
  genuinely new interaction pattern), to inform future prioritization.
- **FR-007**: This feature produces a research artifact and prioritized
  roadmap only — it MUST NOT be treated as an implementation commitment
  for all 100+ candidates in one batch.

### Key Entities

- **Component Candidate**: a named UI component not yet in this catalog,
  with a source-library cross-reference, a category, and a buildability
  signal.
- **Excluded Pattern**: a page-level content block considered and
  explicitly excluded, with a rationale.
- **Category**: a grouping consistent with this catalog's existing
  Component Catalog structure.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 100 genuine, non-duplicate component candidates
  are documented.
- **SC-002**: 100% of listed candidates cite at least one real,
  currently-popular source library.
- **SC-003**: Zero listed candidates duplicate an already-shipped
  component or an already-recorded Known Catalog Gap.
- **SC-004**: A reader can identify, for any given candidate, which
  category it belongs to and whether it reuses an existing mechanism or
  needs a new one, without additional research.

## Assumptions

- "Additional components" means genuine, reusable UI primitives at the
  same granularity as this catalog's existing 47 (single controls,
  overlays, data-display elements, navigation elements) — not full
  marketing-page sections, which this project's own precedent already
  treats as compositions built FROM components (composed-example/
  dashboard-example/settings-example), not components themselves.
- Research draws primarily on component inventories from PrimeReact (78
  components across 10 categories, the largest single-library reference
  point available), Mantine (117 components), and named individual
  components from Ant Design, Radix Primitives, Chakra UI, Carbon,
  Polaris, Primer, and Fluent 2 (several of which were already
  cross-referenced during features 014/015/016's own research phases).
- This feature does not commit to a JavaScript/interaction-pattern
  decision for any individual candidate — that level of design (matching
  features 014-016's own research-phase rigor: verify empirically before
  building, prefer reusing an existing mechanism) is deferred to
  whichever future feature actually takes on a slice of this inventory.
- Given the scale (100+ candidates), this feature's own deliverable is
  the inventory and its prioritization — NOT a plan.md/tasks.md/
  implementation cycle for building all of them. A future feature (or
  several, matching the batching pattern already established by
  014→015→016) will select and build curated slices from this list.
