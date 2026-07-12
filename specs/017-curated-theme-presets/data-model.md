# Data Model: Curated Theme Presets

## ThemeToken

- **name**: the semantic role, identical to this catalog's existing 21
  color tokens — `brand-light`, `brand`, `brand-dark`, `neutral-50`
  through `neutral-900` (10 shades), `success`, `success-strong`,
  `warning`, `warning-strong`, `error`, `error-strong`, `info`,
  `info-strong`.
- **value**: an RGB triplet (space-separated components, e.g.
  `"0 75 179"`), NOT a hex string — required by Tailwind's
  opacity-compatible `rgb(var(--x) / <alpha-value>)` pattern
  (research.md R1).
- Relationship: every Theme has exactly one value per ThemeToken name —
  21 values per theme, no more, no fewer (the existing token SET is
  fixed; only the underlying values vary per theme).

## Theme

- **id**: a URL/attribute-safe slug (e.g. `nord`, `dracula`,
  `caramellatte`) — becomes the literal `data-theme` attribute value.
- **displayName**: the human-readable name shown in the gallery (e.g.
  "Nord", "Dracula").
- **moodFamily**: one of the 7 categories from research.md R3 (Light
  Professional, Warm/Organic Light, Nature/Earth, Cool/Tech Minimal,
  Dark Moody/Professional, Dark Vibrant/Expressive, Distinctive/
  Characterful) — used for the gallery's grouping (spec.md User Story 3).
- **sourceReference**: which real, named collection or standalone
  project this theme is grounded in (e.g. "DaisyUI", "Bootswatch",
  "community — Nord project") — satisfies spec.md FR-008's "documented
  design rationale" requirement structurally, not per-theme prose.
- **tokens**: the 21 ThemeToken values for this theme.
- **isDefault**: boolean, exactly one Theme has this set to `true` (the
  "light" theme, this catalog's pre-existing single palette re-expressed
  under the new mechanism) — the fallback target for spec.md FR-006.

## UserThemeSelection

- **storedValue**: the raw string read from `localStorage` key
  `pds-theme` — untrusted input until validated.
- **resolvedThemeId**: `storedValue` if it matches a real `Theme.id` in
  the known set; otherwise the default Theme's `id` (spec.md FR-006,
  research.md R5) — this resolution MUST happen before first paint to
  avoid a flash of the wrong theme.

## ThemeCollection

- The full ordered set of 43 Theme entities (42 new + the pre-existing
  "light" default re-expressed under this feature's mechanism — a
  `/speckit-analyze` finding, I1, standardized this count across
  plan.md/data-model.md/tasks.md, which previously disagreed on whether
  "42" meant the new themes only or the total collection size), grouped
  by `moodFamily` for gallery display (spec.md User Story 3) — not a
  separate persisted entity, just the complete list
  `themes.css`/`design-tokens.ts`
  together define.
