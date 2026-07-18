# Feature Specification: Homepage Component Showcase

**Feature Branch**: `037-homepage-component-showcase`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "transforme a página inicial dos exemplos
de design system mais atraente, criando um snapshot de todos os
componentes, podendo clicar neste snapshot e ver a página de cada
componente. [...] use a ajuda de /ui-ux-pro-max para ajudar na
diagramação da página e /frontend-design:frontend-design para trazer
um melhor ux para este design system. Já utilize conceitos dos
componentes na organização desta página."

(Translation: transform the design system's homepage/example index
into something more visually attractive, creating a visual snapshot of
every component that can be clicked to reach that component's own
page. Use the `/ui-ux-pro-max` and `/frontend-design:frontend-design`
skills to improve the page's layout and UX. Use the catalog's own
component concepts to organize this page.)

**Current state (verified, not assumed)**: `index.html` is this
catalog's single homepage — a hero stat strip (114 components, 2
surfaces, AAA, 40+ themes), a category jump-nav, and 114 identical
plain cards (title + 1-line description + a bare "View full demo →"
text link), grouped into 10 categories (Application & Navigation,
Forms/Validation/Inputs, Data Display & Listings, Overlays/Modals/
Feedback, Navigation & Disclosure, Advanced Forms & Interaction,
Composed Examples, Theming, Layout & Structure, Consent & System
Messaging). No card shows what the component actually looks like —
every card is text-only, a generic, unstyled-feeling grid this
catalog's own design-quality standard explicitly names as an
anti-pattern ("default card grids with uniform spacing and no
hierarchy").

## Clarifications

### Session 2026-07-18

- Q: Overlay/triggered components (Modal, Toast, Slide-over, Command
  Palette, Dropdown Menu, Tooltip, Popover-based components) can't all
  be forced into their real, functionally-open state simultaneously on
  one page — multiple native `<dialog open>`/Popover-API elements
  active at once would visually stack incorrectly, and several
  components' focus-trap behavior would fight over the same page's tab
  order. How should their snapshot cards render? → A: Render a visually
  faithful FROZEN state — the component's real classes/markup/CSS in
  its open-state appearance, but without actually invoking the
  triggering mechanism (no real `showModal()`/Popover-API activation,
  no live focus-trap, no auto-dismiss timers). This satisfies FR-001
  ("real markup/classes, not a placeholder") and FR-004 ("shows the
  real visual appearance") while avoiding any multi-component runtime
  conflict — each card is a real visual instance, just not a live,
  independently-triggerable one, matching the "gallery, not a
  functional recreation of every interaction" framing already in User
  Story 1's acceptance scenario 2.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See what a component looks like before clicking into it (Priority: P1)

A person evaluating this design system for their own project lands on
the homepage and wants to visually scan what's actually available —
seeing each component's real look, not just its name — before deciding
which one to open in full.

**Why this priority**: This is the literal, explicit ask ("um snapshot
de todos os componentes") and the core value proposition of a
component-catalog homepage — a name-only list can't communicate visual
quality or fit, which is the whole reason someone would browse a
design system in the first place.

**Independent Test**: Load the homepage and confirm every one of the
114 components renders a real, live visual preview of itself (not a
placeholder icon, not just text) inside its own card, grouped by the
same 10 existing categories.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** it loads, **Then** every one of the
   114 component cards shows an actual rendered instance of that
   component (its real classes/markup), not a text-only description.
2. **Given** a component whose live rendering would be interactive
   (e.g. a Modal, Toast, or Command Palette that normally opens via a
   trigger), **When** its card renders on the homepage, **Then** it
   shows that component's real visual appearance in a representative
   open/default state rather than requiring the viewer to trigger it
   first — the homepage is a gallery, not a functional recreation of
   every interaction.
3. **Given** the homepage's overall layout, **When** compared to the
   previous plain grid, **Then** it demonstrates real visual hierarchy,
   intentional rhythm, and uses this catalog's own components (Card,
   Badge, Grid/Bento layout primitives) to construct itself — not a
   generic uniform grid.

---

### User Story 2 - Click a snapshot to open that component's full page (Priority: P1)

Having spotted a component that looks interesting, the person wants to
go straight to that component's dedicated demo page to see it in full,
read its usage notes, and interact with it for real.

**Why this priority**: Equally explicit in the request ("podendo
clicar neste snapshot e ver a página de cada componente") — a snapshot
with no way to act on it is a dead end, not a catalog.

**Independent Test**: Click anywhere on any component's snapshot card
and confirm it navigates to that exact component's existing individual
demo page (`/src/components/<slug>/<slug>.html`) — the same 114
destination pages that already exist today.

**Acceptance Scenarios**:

1. **Given** any component's snapshot card, **When** a user clicks it
   (anywhere on the card, not just a small text link), **Then** the
   browser navigates to that component's own existing demo page.
2. **Given** the same interaction via keyboard, **When** a user tabs
   to a card and presses Enter, **Then** the same navigation occurs —
   the whole card is a real, focusable link, not a div with a
   click handler.

### Edge Cases

- What happens to the existing category jump-nav and hero stat strip?
  They are restyled to match the new visual direction but keep their
  existing function (category anchors, live stat figures) — this
  feature is a visual/structural redesign of the card grid and overall
  page composition, not a removal of existing navigation aids.
- How does a component that needs its own `<script type="module">` to
  render correctly (e.g. a component driven by `src/scripts/*.js`)
  behave when many of its siblings' scripts also load on the same
  page? Every script in this catalog is already idempotent and scoped
  to its own DOM subtree (verified pattern across all existing
  multi-component pages, e.g. this same `index.html` today already
  loads every component's script simultaneously) — no new isolation
  mechanism is required.
- What happens on narrow viewports where 114 full live previews could
  be heavy? Layout must remain responsive at this catalog's standard
  breakpoints (320/768/1024/1440) with no horizontal overflow; if any
  performance mitigation (e.g. lazy-rendering off-screen cards) proves
  necessary, it is an implementation detail resolved during planning,
  not a scope change.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The homepage MUST replace all 114 text-only cards with
  cards that each render a real, live visual preview of that
  component, using the component's actual markup/classes (not a static
  image, screenshot, or icon substitute).
- **FR-002**: Every component card MUST remain grouped under its
  existing category (the same 10 categories already on the page today)
  — no component is recategorized, added, or removed by this feature.
- **FR-003**: Every component card MUST be a single, whole-card
  focusable link (native `<a>`, not a `<div>` with a click handler)
  that navigates to that component's existing individual demo page —
  keyboard-operable identically to mouse interaction.
- **FR-004**: Components whose typical interaction is triggered (e.g.
  opens via a button/trigger — Modal, Toast, Slide-over, Command
  Palette, Dropdown Menu, Popover, Context Menu, Menubar, Tooltip,
  Notification Center, Session Timeout Modal, and any other
  Popover-API/native-`<dialog>`-based component) MUST render their
  real classes/markup in a visually faithful FROZEN open-state
  appearance on the homepage snapshot (per Clarifications 2026-07-18)
  — never the real triggering mechanism invoked live, and never
  omitted from the redesign or left in a closed/untriggered
  state.
- **FR-005**: The homepage's overall composition (hero area, category
  navigation, card grid) MUST be restyled to demonstrate real visual
  hierarchy and intentional rhythm — not a uniform, single-column-per-
  breakpoint grid with identical card treatment throughout — and MUST
  reuse this catalog's own existing components (e.g. Card, Badge,
  Grid/Bento/SimpleGrid primitives) in its own construction rather than
  one-off bespoke markup.
- **FR-006**: The redesigned homepage MUST remain fully theme-reactive
  (correct under all 49 existing curated themes, zero markup change
  per theme, this catalog's existing architecture) and MUST pass this
  catalog's existing token-discipline (`audit:tokens`) and contrast
  (`audit:contrast`) audits with zero new violations.
- **FR-007**: The redesigned homepage MUST remain responsive with zero
  horizontal overflow at this catalog's standard breakpoints (320,
  768, 1024, 1440) and MUST keep its existing CSP compliance (no new
  inline scripts/styles).
- **FR-008**: The existing hero stat strip and category jump-navigation
  MUST continue to function (accurate live figures, working anchor
  links) after the redesign.

### Key Entities

- **Component showcase card**: One visual card per shipped component —
  a live rendered preview, the component's name, its category, and a
  whole-card link to its individual demo page. Not a new data entity;
  a presentational restructuring of the existing per-component entries
  already enumerated in `index.html`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the 114 shipped components show a real, live
  visual preview of themselves on the homepage (0 text-only or
  placeholder-only cards remaining).
- **SC-002**: 100% of component cards are reachable and activatable via
  keyboard alone, landing on the correct individual demo page every
  time.
- **SC-003**: The redesigned homepage passes `audit:tokens` and
  `audit:contrast` with zero new violations, and the full Playwright
  suite (all specs, all 6 browser/viewport projects) passes with zero
  regressions to any existing page.
- **SC-004**: The homepage demonstrates at least 4 of this catalog's
  own "Required Qualities" design standard (clear hierarchy, intentional
  rhythm, depth/layering, designed hover/focus states, grid-breaking
  bento composition, etc.) — verifiable by visual review against that
  existing standard, not a new one invented for this feature.

## Assumptions

- "Snapshot" means a real, live-rendered visual preview built from the
  component's actual markup/CSS (consistent with this catalog's
  existing zero-screenshot, real-component-rendering convention used
  by the Theme Gallery), not a captured image/screenshot file.
- Interactive/triggered components are shown in their representative
  default-open visual state for preview purposes only, on this
  showcase page — their live-triggered behavior is unchanged on their
  own dedicated demo pages, which remain the functional destination.
- The existing 10-category taxonomy and 114-component roster are
  unchanged by this feature — this is a visual/structural redesign of
  the existing homepage, not a content or information-architecture
  change.
- `/ui-ux-pro-max` and `/frontend-design:frontend-design` inform the
  visual direction, layout system, and interaction-state polish chosen
  during planning and implementation; this spec intentionally leaves
  the specific visual style (e.g. bento grid vs. masonry, exact color
  treatment) open for that phase, per this catalog's own guidance that
  implementation choices belong in plan.md, not spec.md.
