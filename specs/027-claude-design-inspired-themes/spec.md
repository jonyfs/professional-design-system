# Feature Specification: Claude-Design-Inspired Theme Presets (Batch 2)

**Feature Branch**: `027-claude-design-inspired-themes`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "veja os design system implementados em
https://github.com/VoltAgent/awesome-claude-design e crie temas
baseados nesta lista e verifique por componentes que podem ser
adicionados aqui usando como base este repositório do github."

(Translation: look at the design systems implemented in
https://github.com/VoltAgent/awesome-claude-design, create themes based
on that list, and check for components that could be added here using
that GitHub repo as a reference.)

**Source reviewed (verified, not assumed)**: the referenced repository
is a curated collection of 68 `DESIGN.md` files — plain-text visual-
language specs (color palette, typography, component stylings, layout,
elevation, do's/don'ts, responsive behavior) — each inspired by the
publicly observable aesthetic of a real, named company/product across 9
categories (AI/LLM Platforms, Developer Tools, Backend/DevOps,
Productivity/SaaS, Design Tools, Fintech/Crypto, E-commerce/Retail,
Media/Consumer Tech, Automotive). The repository's own license
explicitly states these are "curated starting points inspired by
publicly observable design patterns," not official or endorsed brand
assets, and recommends treating them as inspiration for an original
system rather than a 1:1 clone.

**Naming decision (resolved with the user)**: new theme presets in this
feature use generic, mood-based names describing the visual aesthetic
(e.g. "violet-gradient," "editorial-minimal," "mono-precision") rather
than the inspiring company's name — consistent with this catalog's
existing curated-theme naming convention (feature 017's DaisyUI-derived
names like `dracula`, `synthwave`, `nord` are themselves generic mood
references, never literal brand names) and avoiding any trademark or
endorsement implication.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A new, distinctly different batch of curated themes (Priority: P1)

A user browsing this system's Theme Gallery wants access to visually
distinct aesthetic directions beyond the 44 themes already shipped
(feature 017) — several of the source collection's described moods
(e.g. signature gradient-driven elegance, ultra-minimal precision,
stark monochrome with full-bleed imagery, warm editorial serif
minimalism, technical dashboard density) are not yet represented in
this system's existing theme roster.

**Why this priority**: Directly fulfills the explicit request — this
is the only user-facing outcome of this feature. Without genuinely new,
non-overlapping aesthetic directions, this feature would just be a
research exercise with no shipped value.

**Independent Test**: Open the Theme Gallery, select any newly-added
theme, and confirm it re-colors every existing component correctly
while presenting a visual mood that is not already covered by any of
the 44 previously-shipped themes.

**Acceptance Scenarios**:

1. **Given** the Theme Gallery, **When** a user selects a newly-added
   theme from this feature, **Then** every existing shipped component
   re-colors correctly under it, exactly like every previously-shipped
   theme already does.
2. **Given** any newly-added theme, **When** compared against this
   system's 44 existing themes, **Then** it presents a genuinely
   distinct visual mood (color relationship, typographic weight,
   surface treatment) rather than a near-duplicate of an existing one.
3. **Given** any newly-added theme, **When** measured against this
   system's existing AAA contrast bar, **Then** it either meets that
   bar or is explicitly, individually documented as a known gap — the
   same honesty standard feature 017 already established for its own
   themes (`KNOWN_THEME_CONTRAST_GAPS`), not a lowered bar for this
   batch.
4. **Given** a newly-added theme's name and description, **When** a
   user reads it, **Then** it names an aesthetic mood, never a company,
   brand, or product name.

---

### User Story 2 - Confirm whether the source suggests any new components (Priority: P2)

A user planning this system's roadmap wants a credible answer to
whether the referenced collection surfaces any genuinely new component
types this catalog doesn't already have — not just new visual themes
for existing components.

**Why this priority**: Explicitly requested ("verifique por
componentes que podem ser adicionados aqui"), but secondary to Story
1 — the source is fundamentally a visual-language ( color/type/
spacing/elevation) resource, not a component-library inventory, so this
story is more likely to conclude "no material new gap" than to surface
a large new list, unlike feature 018's dedicated component-inventory
research.

**Independent Test**: Read the resulting research findings and confirm
each of the source's own 9 `DESIGN.md` sections was checked against
this catalog's existing ~96+ shipped components, with any genuine gap
named and cross-referenced, and any non-gap explicitly stated as such
(not silently omitted).

**Acceptance Scenarios**:

1. **Given** the source collection's own definition of what a
   `DESIGN.md` covers (visual theme, color, typography, component
   stylings limited to buttons/inputs/cards/nav, layout, elevation,
   do's/don'ts, responsive behavior, agent prompts), **When** cross-
   referenced against this catalog's existing component set, **Then**
   the finding — whether "no new component gap" or "N specific
   candidates" — is explicit and justified, not left ambiguous.
2. **Given** any genuine component candidate the research does surface,
   **When** it is documented, **Then** it is cross-referenced against
   the already-existing 105-candidate inventory from feature 018 to
   avoid re-listing something already recorded there.

---

### Edge Cases

- What happens if a described aesthetic in the source collection is
  already effectively covered by one of this system's 44 existing
  themes (e.g. a dark-purple-accent theme very close to an existing
  one)? It MUST be excluded from the new batch or explicitly noted as
  a close variant with a stated reason for including it anyway — never
  silently duplicated.
- What happens to a described aesthetic that relies on a proprietary or
  paid font this system cannot legally/practically ship (e.g. a
  bespoke display typeface mentioned in the source)? The new theme MUST
  substitute a comparable, freely-licensed alternative (the same
  approach the source collection's own Claude Design output already
  takes for proprietary brand fonts), never silently omit typography
  distinctiveness.
- What happens to a described aesthetic that relies primarily on
  photography/imagery (e.g. full-bleed cinematic photography) rather
  than color/type/spacing alone? Since this system's existing theme
  mechanism re-colors tokens, not photography, such an aesthetic MUST
  be adapted to its color/type/spacing/elevation essence rather than
  attempted as a literal photographic treatment this system's theming
  layer cannot express.
- What happens if the research in User Story 2 finds zero genuine new
  component gaps? That MUST be reported as a real, positive finding
  (confirms this catalog's existing component coverage is already
  sufficient relative to this source), not treated as an incomplete or
  failed research effort.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST add a curated batch of new theme presets,
  each visually distinct from all 44 currently-shipped themes, drawing
  aesthetic direction (color relationships, typographic weight/mood,
  surface/elevation treatment) from the referenced collection's
  publicly-described visual languages.
- **FR-002**: Every new theme preset MUST use a generic, mood-based
  name and description — never the name of the company/product that
  inspired it.
- **FR-003**: Every new theme preset MUST re-color every existing
  shipped component correctly, using this system's existing theme-
  token architecture (feature 017) — no new theming mechanism.
- **FR-004**: Every new theme preset MUST be checked against this
  system's existing WCAG AAA contrast standard, with any gap explicitly
  documented (reusing feature 017's existing known-gap documentation
  convention), not silently shipped or silently excluded.
- **FR-005**: Every new theme preset MUST be assigned to an existing or
  new mood-family grouping consistent with this system's existing Theme
  Gallery categorization, so it is discoverable the same way existing
  themes are.
- **FR-006**: The research MUST explicitly state, for each of the
  source collection's own 9 `DESIGN.md` sections, whether it surfaces
  any component type this catalog does not already have — producing an
  explicit "no gap found" or "N candidates found" conclusion, not
  silence.
- **FR-007**: Any genuine new component candidate the research does
  surface MUST be cross-referenced against feature 018's existing
  105-candidate inventory to avoid duplicate recording.
- **FR-008**: This feature MUST NOT introduce any new npm dependency,
  new CSS/theming mechanism, or new font-loading approach beyond what
  feature 017 already established — it is an additive batch of theme
  data, not new theming infrastructure.

### Key Entities

- **Theme Preset** (existing entity, feature 017): this feature adds
  new instances to the existing set — id, generic display name, mood
  family, and a full token set (colors, typography weight/scale
  adjustments, surface/elevation treatment).
- **Aesthetic Reference**: an internal research artifact — one entry
  from the source collection's 68, its publicly-described visual
  language, and which new Theme Preset (if any) it informed. Not
  user-facing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A curated batch of new theme presets ships, each visually
  distinguishable from all 44 previously-shipped themes and from each
  other, verified by a reviewer able to name the distinguishing visual
  characteristic of each.
- **SC-002**: 100% of new theme presets re-color every existing shipped
  component with zero regressions to any previously-shipped theme.
- **SC-003**: 100% of new theme presets are measured against the
  existing AAA contrast standard, with pass/fail status explicitly
  recorded for each (reusing feature 017's existing documentation
  convention) — zero silently-unverified themes.
- **SC-004**: The component-gap research produces an explicit,
  justified conclusion (not silence) for each of the source's 9
  `DESIGN.md` sections.
- **SC-005**: Zero new theme presets are named after, or otherwise
  suggest affiliation with, the company/product whose publicly-
  observable aesthetic inspired them.

## Assumptions

- **Naming convention resolved with the user**: generic, mood-based
  names only — see "Naming decision" above. No code comments or other
  artifacts attribute a specific shipped theme to a specific company;
  the connection exists only in this feature's own research notes as
  an internal design-inspiration record, not a redistributed artifact.
- **Batch size is decided during planning, not this spec**: the source
  lists 68 aesthetics, many of which cluster into very similar moods
  (e.g. several automotive entries are variations of "black canvas +
  one accent color + massive display type") — the exact count and
  final roster of new theme presets is a research/curation decision for
  `/speckit-plan`'s research phase, bounded only by this spec's
  requirement that each new theme be genuinely, visually distinct from
  every other theme (new or existing).
- **No literal brand asset reuse**: no logos, proprietary typefaces, or
  exact brand hex values are reused verbatim — each new theme
  approximates the publicly-observable MOOD only, consistent with the
  source repository's own stated approach and license.
- **Component research is confirmatory, not a new full inventory**:
  this feature does not repeat feature 018's from-scratch 105-candidate
  research — it specifically checks whether THIS source (a
  visual-language collection, not a component-library collection)
  surfaces anything feature 018 missed, and is expected to likely
  conclude it does not, given the source's own narrow "buttons/inputs/
  cards/nav" component scope.
