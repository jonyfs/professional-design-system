# Feature Specification: Prism Color Scheme (Synthesized Cross-Collection Theme)

**Feature Branch**: `036-prism-color-scheme`

**Created**: 2026-07-17

**Status**: Draft

**Input**: User description: "visite todos os design system descritos
neste github https://github.com/VoltAgent/awesome-design-md/ e tente
criar um esquema de cores baseando-se em todos os design systems desta
página e acrescente como tema, usando nomes sugestivos, porém sem
copiar o nome atual."

(Translation: visit all the design systems described in this GitHub
repo and try to create a color scheme based on all the design systems
on this page, then add it as a theme, using suggestive names, without
copying the current name.)

**Source reviewed (verified, not assumed)**: the referenced repository
is a curated collection of 73 `DESIGN.md` files — plain-text visual-
language documents (color palette, typography, component stylings,
layout, elevation, do's/don'ts, responsive behavior) — each describing
the publicly observable aesthetic of a real, named company/product
across 10 categories: AI & LLM Platforms (12), Developer Tools & IDEs
(7), Backend/Database/DevOps (8), Productivity & SaaS (7), Design &
Creative Tools (6), Fintech & Crypto (7), E-commerce & Retail (5),
Media & Consumer Tech (12), Automotive (7), and a 2-entry "Retro Web"
nostalgia series. This is the same repository family as feature 027's
source (`awesome-claude-design`), one repo later in VoltAgent's series,
with a broader, non-Claude-specific roster. Its README documents each
site's mood in prose (e.g. "Stripe — signature purple gradients,
weight-300 elegance"; "Supabase — dark emerald theme, code-first";
"Vercel — black and white precision, Geist font") but does not publish
exact hex values in the README itself — those live one level down, in
each site's individual `DESIGN.md`/`preview.html` page.

**Naming decision (resolved with the user)**: unlike feature 017/027,
which each shipped one theme *per* source mood, this feature explicitly
asks for a single color scheme synthesized *across the whole
collection* — one new theme representing the collection's shared
visual DNA, not a per-company palette. Per the user's explicit
instruction and this catalog's established precedent (feature 027:
generic mood-based names, never a literal brand name), the new theme
is named **"Prism"** — a light-splitting-into-a-spectrum metaphor for
one new palette distilled from many sources — and does not reuse the
source repository's name, VoltAgent's name, or any single cataloged
company's name.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A new theme distilled from the collection's shared visual DNA (Priority: P1)

A user browsing this system's Theme Gallery wants a new, genuinely
distinct aesthetic option grounded in real research — not an arbitrary
invented palette — that captures the common thread running through a
large, credible cross-section of today's most-cited product design
systems (the awesome-design-md collection), rather than cloning any
single one of them.

**Why this priority**: This is the feature's entire user-facing
deliverable. Without a real, well-reasoned synthesis, "add a theme"
has no way to be validated as genuinely research-grounded rather than
arbitrary.

**Independent Test**: Open the Theme Gallery, select "Prism," and
confirm it re-colors every existing component correctly while
presenting a coherent visual mood that is traceably derived from (and
documented against) a representative, cross-category sample of the
awesome-design-md collection's real, published color values — not
already duplicated by any of this catalog's 48 existing themes.

**Acceptance Scenarios**:

1. **Given** the Theme Gallery, **When** a user selects "Prism," **Then**
   every existing shipped component re-colors correctly under it,
   exactly like every previously-shipped theme already does.
2. **Given** the Prism theme's palette, **When** compared against a
   documented sample of real hex values pulled from named sites in the
   awesome-design-md collection, **Then** the derivation is traceable
   (which sites were sampled, what values they contributed) rather than
   asserted without evidence.
3. **Given** the Prism theme, **When** measured against this catalog's
   existing AAA contrast bar, **Then** it either meets that bar or is
   explicitly, individually documented as a known gap in
   `KNOWN_THEME_CONTRAST_GAPS`, matching every prior theme batch's
   honesty standard — never a silently lowered bar.
4. **Given** the Prism theme's name and description, **When** a user
   reads it, **Then** it names a distilled aesthetic concept, never the
   source repository, VoltAgent, or any single cataloged company.

---

### User Story 2 - Prism appears correctly in the gallery's existing organization (Priority: P2)

A user browsing the Theme Gallery wants Prism to be discoverable
alongside the other 48 themes, correctly categorized by mood family and
counted in the gallery's totals, with no special-casing that would
make it behave differently from any other theme.

**Why this priority**: Consistency with the existing theme
infrastructure (feature 017's gallery/switcher/persistence mechanism)
is what makes this a one-theme addition rather than a parallel system;
skipping it would ship a theme that "exists" but is not actually usable
the way every other theme is.

**Independent Test**: Open the Theme Gallery, confirm Prism's card
renders with correct swatches and mood-family grouping, select it via
the gallery's existing selector, reload the page, and confirm the
choice persists — identical mechanics to any pre-existing theme, with
zero Prism-specific code paths.

**Acceptance Scenarios**:

1. **Given** the Theme Gallery, **When** it renders, **Then** Prism
   appears exactly once, grouped under whichever existing
   `MOOD_FAMILIES` entry its palette actually belongs to.
2. **Given** Prism is selected and the page is reloaded, **When** the
   page re-renders, **Then** Prism remains the active theme
   (`localStorage`-backed persistence, feature 017/025 mechanism,
   unchanged).

### Edge Cases

- What happens if a future maintainer wants a second synthesized theme
  from this same source collection? This feature ships exactly one
  theme ("Prism"); a second synthesis is out of scope and would be a
  separate future feature, not an extension of this one.
- How does the system handle the fact that the source collection's
  README does not itself publish hex codes? The synthesis is grounded
  in a documented, representative sample of individual sites' actual
  published `DESIGN.md`/`preview.html` pages (fetched directly),
  spanning the collection's largest categories — not fabricated from
  the README's prose mood-descriptions alone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST ship exactly one new theme, internal id
  `prism`, display name "Prism," added to the existing `THEMES` array
  in `shared/design-tokens.ts` using this catalog's existing 21-token
  schema (brand/brand-light/brand-dark, neutral-50..900,
  success/warning/error/info + `-strong` variants) — no new token
  categories.
- **FR-002**: Prism's palette MUST be derived from real, documented
  color values sampled from a representative, cross-category subset of
  the awesome-design-md collection's individual site pages (not
  invented, not sourced from the README's prose descriptions alone),
  with the sampled sites and their contributed values recorded in
  `research.md`.
- **FR-003**: Prism's name and every user-facing description MUST refer
  to a distilled aesthetic concept, never the source repository name,
  VoltAgent, or any single cataloged company name (matching feature
  027's established precedent and the user's explicit instruction).
- **FR-004**: Prism MUST render correctly across every existing shipped
  component when selected via the Theme Gallery/switcher — the same
  zero-markup-change, CSS-custom-property mechanism every existing
  theme already uses (feature 017 architecture), with no
  Prism-specific code path.
- **FR-005**: Prism MUST be checked against this catalog's existing
  AAA contrast audit (`audit:contrast`); any pairing that cannot clear
  AAA MUST be individually documented in `KNOWN_THEME_CONTRAST_GAPS`
  with its actual measured ratio, never silently suppressed.
- **FR-006**: Prism MUST pass the existing token-discipline audit
  (`audit:tokens`) — no new raw/undocumented Tailwind classes
  introduced to support it.
- **FR-007**: The Theme Gallery's displayed theme count and Prism's
  card (name, swatches, mood-family grouping) MUST update to reflect
  the new 48th theme, using the gallery's existing rendering mechanism
  (feature 017/021), not a one-off card.
- **FR-008**: Prism's addition MUST NOT alter the visual output or
  token values of any of the 48 existing themes.

### Key Entities

- **Prism (theme)**: One new entry in the `ThemeDefinition[]` `THEMES`
  array — id, display name, mood-family assignment, source-derivation
  documentation, and the 21-token color set. Same shape as every
  existing theme entry; no new entity type.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Theme Gallery lists 49 themes (48 existing + Prism),
  and users can select, apply, and persist Prism exactly as they can
  any pre-existing theme, with zero regressions to the other 48.
- **SC-002**: Prism's palette derivation cites at least 5 real, named
  sites from the awesome-design-md collection spanning at least 3 of
  its 10 categories, each with an actual sampled color value recorded
  in `research.md` — a traceable synthesis, not an assertion.
- **SC-003**: 100% of Prism's color pairings either clear this
  catalog's AAA (7:1 text) / WCAG 1.4.11 (3:1 non-text) thresholds, or
  are individually documented as known, pre-existing-pattern-consistent
  gaps.
- **SC-004**: The full pre-existing Playwright suite (all specs, all 6
  browser/viewport projects) passes with zero regressions after
  Prism's addition.

## Assumptions

- "Todos os design systems desta página" (all the design systems on
  this page) is interpreted as: research and cite a representative,
  cross-category sample large enough to credibly back a single
  synthesized palette (SC-002's 5-site/3-category minimum), rather than
  literally fetching and averaging all 73 individual pages — consistent
  with how feature 017/027 each derived themes from real, but not
  individually exhaustive, source sampling.
- "Acrescente como tema" (add as a theme) is interpreted as exactly one
  new theme (singular), not a per-company batch like feature 017/027 —
  this is the key difference in intent from those two prior features.
- Prism's mood-family placement (which of the 7 existing
  `MOOD_FAMILIES` it belongs to) is decided during planning, once the
  actual synthesized palette (dark vs. light canvas, accent hue) is
  derived — not pre-decided in this spec.
- No new dependency, icon, or component is introduced — this is a
  palette-only addition to the existing theme architecture.
