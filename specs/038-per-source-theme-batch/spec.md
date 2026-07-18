# Feature Specification: Per-Source Theme Batch (awesome-design-md Coverage)

**Feature Branch**: `038-per-source-theme-batch`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "verifique todos os DESIGN.md em
https://github.com/VoltAgent/awesome-design-md/tree/main/design-md
para criar um tema para cada caso, caso não tenha sido criado ainda,
execute as speckit-* skills conforme as sugestões, de forma
automática, até terminar tudo."

(Translation: check every DESIGN.md in that GitHub collection and
create a theme for each one that doesn't already have one, running the
speckit workflow automatically to completion.)

**Current state (verified, not assumed)**: the `VoltAgent/awesome-
design-md` repository's `design-md/` directory contains exactly 74
site subdirectories, each with a real `DESIGN.md` (fetched and listed
directly via the GitHub API, not assumed from the README). Of these
74, exactly **4 already have a dedicated, per-source theme** in this
catalog, from feature 027's earlier batch: Stripe → `aurora`, Linear →
`obsidian`, Notion → `linen`, Vercel → `graphite` (confirmed by reading
`specs/027-claude-design-inspired-themes/research.md`'s own source
mapping table). Feature 036's `prism` theme is a *synthesis* across 7
sampled sites (Claude, Supabase, Vercel, Stripe, Airbnb, Linear,
Spotify) — one blended palette, not a per-company theme — so it does
not count as "covering" any individual site in the per-source sense
this feature asks for. This leaves **70 sites with no dedicated theme
yet**.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A dedicated, real-sourced theme for every remaining catalog site (Priority: P1)

A user browsing this system's Theme Gallery wants the option to apply
a theme inspired by any of the well-known product design languages
cataloged in the `awesome-design-md` collection — not just the 4
already covered — so the gallery's theme roster genuinely reflects
"today's most-cited product design systems," the same goal feature 017
and 027 already established for their own source collections.

**Why this priority**: This is the feature's entire, explicit
deliverable — without new themes actually shipping for the 70
remaining sites, "check every DESIGN.md and create a theme for each"
has not happened.

**Independent Test**: Open the Theme Gallery and confirm a new theme
exists, selectable and rendering every existing component correctly,
for each of the 70 currently-uncovered sites — traceable back to that
site's own real, fetched `DESIGN.md` color values.

**Acceptance Scenarios**:

1. **Given** the Theme Gallery, **When** a user selects any of the 70
   new themes, **Then** every existing shipped component re-colors
   correctly under it, exactly like every previously-shipped theme.
2. **Given** any new theme's palette, **When** compared against its
   source site's real, fetched `DESIGN.md` hex values, **Then** the
   derivation is traceable (which values were used, how derived) —
   never invented.
3. **Given** any new theme, **When** measured against this catalog's
   AAA contrast bar, **Then** it either clears AAA or is explicitly,
   individually documented in `KNOWN_THEME_CONTRAST_GAPS` with its real
   measured ratio — the same honesty standard every prior theme batch
   already established, never a lowered bar.
4. **Given** any new theme's name, **When** a user reads it, **Then**
   it names a distilled aesthetic mood, never the source company's own
   name — matching feature 027's already-resolved naming precedent and
   this repository's own license terms ("curated starting points...
   not official or endorsed").
5. **Given** the full set of 70 new themes, **When** compared against
   each other and the 49 pre-existing themes, **Then** no new theme is
   a near-duplicate of an existing one (a genuinely distinct visual
   mood per site, not 70 palettes that all look the same).

### Edge Cases

- What happens if two source sites (e.g. two automotive brands, or two
  AI-platform companies) would produce a near-identical palette (same
  dark-canvas-plus-one-accent shape, similar hue)? Each still ships its
  own theme (this is a per-source coverage mandate, not a curation
  filter) — but if their FINAL derived hex values would be visually
  indistinguishable, the later one in processing order is nudged
  (hue/lightness) enough to remain genuinely distinct, documented as
  such, rather than silently shipping two identical themes under
  different names.
- What happens for a site whose own `DESIGN.md` doesn't cleanly map
  onto this catalog's fixed 21-token schema (e.g. a site with no
  documented semantic/status colors at all)? Reuse the existing
  fallback precedent already established in feature 017/027: missing
  semantic roles fall back to this catalog's existing default values
  rather than being invented from nothing.
- What happens to the 4 already-covered sites (Stripe/Linear/Notion/
  Vercel)? Out of scope — they already have `aurora`/`obsidian`/
  `linen`/`graphite`; this feature does not re-derive or duplicate
  them.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST ship exactly one new theme per each of
  the 70 currently-uncovered `awesome-design-md` sites, added to the
  existing `THEMES` array using this catalog's existing 21-token
  schema — no new token categories, no new mechanism.
- **FR-002**: Each new theme's palette MUST be derived from that
  site's own real, fetched `DESIGN.md` color values (brand/accent,
  canvas, ink at minimum) — never invented — with the sourced values
  recorded in `research.md`.
- **FR-003**: Each new theme's id/display name/description MUST name a
  distilled aesthetic mood, never the source company's name (feature
  027 precedent, restated here since it applies again).
- **FR-004**: Every new theme MUST render correctly across all
  existing shipped components via the existing zero-markup-change
  `data-theme` mechanism (feature 017 architecture).
- **FR-005**: Every new theme MUST be checked against this catalog's
  AAA contrast audit; any pairing that cannot clear AAA MUST be
  individually documented in `KNOWN_THEME_CONTRAST_GAPS` with its real
  measured ratio.
- **FR-006**: Every new theme MUST pass the existing token-discipline
  audit — no new raw/undocumented Tailwind classes.
- **FR-007**: The Theme Gallery's rendering and count MUST update
  automatically to reflect all 70 new themes via its existing
  `THEMES`/`MOOD_FAMILIES` enumeration mechanism — no per-theme code
  path.
- **FR-008**: No new theme may be a near-duplicate (same hue family +
  same canvas polarity + materially indistinguishable lightness/
  saturation) of any of the 49 pre-existing themes or of another new
  theme in this same batch.
- **FR-009**: This feature MUST NOT modify the 4 already-covered
  themes (`aurora`, `obsidian`, `linen`, `graphite`) or feature 036's
  `prism`.

### Key Entities

- **Per-source theme**: One new `ThemeDefinition` entry per uncovered
  site — id, display name, mood-family assignment, source-derivation
  documentation (citing the real site by name as research provenance,
  never in the shipped name), and the 21-token color set. Same shape
  as every existing theme; no new entity type. 70 instances.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Theme Gallery lists 119 themes (49 existing + 70
  new), and users can select, apply, and persist every new theme
  exactly as they can any pre-existing theme, with zero regressions to
  the 49 existing themes.
- **SC-002**: 100% of the 70 new themes cite real, fetched hex values
  from their own source site's `DESIGN.md`, recorded in `research.md`
  — a traceable derivation for every single one, not a sample.
- **SC-003**: 100% of new-theme color pairings either clear AAA (7:1
  text) / WCAG 1.4.11 (3:1 non-text), or are individually documented
  as known gaps.
- **SC-004**: The full pre-existing Playwright suite passes with zero
  regressions after all 70 additions.

## Assumptions

- "Verifique todos os DESIGN.md... para criar um tema para cada caso,
  caso não tenha sido criado ainda" is interpreted literally and
  exhaustively: all 70 currently-uncovered sites, not a representative
  sample — this is the key difference from feature 036 (one
  synthesized theme from a 7-site sample) and closer in spirit to
  feature 017/027's per-source batches, just at a larger scale (the
  entire remaining collection in one feature, phased across several
  task batches within it, matching feature 017's own P1-P4 batching
  precedent for its 43-theme rollout).
- Given the sheer scale (70 themes, each needing individual AAA
  verification), derivation is done via a reusable, scriptable
  OKLCH-interpolation + real-contrast-formula pipeline (the same
  method feature 036 built and proved), rather than fully bespoke
  manual tuning per theme — this keeps the per-theme process
  consistent and auditable across all 70, not a source of quality
  drift.
- Mood-family assignment for each new theme is decided per-theme
  during planning/implementation once each real palette is derived
  (canvas polarity + hue family), not pre-decided in this spec.
- No new dependency, icon, font, or component is introduced — this is
  a palette-only addition to the existing theme architecture, 70 times
  over.
