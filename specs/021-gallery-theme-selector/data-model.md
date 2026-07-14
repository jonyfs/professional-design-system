# Phase 1 Data Model: Gallery Theme Selector

This feature introduces no new persisted entity — every entity below
already exists (feature 017) and is read-only from this feature's
perspective.

## Gallery Theme Selection (ephemeral UI state, not a new entity)

- **value**: the `<select>`'s current value — always kept equal to
  `document.documentElement.dataset.theme`.
- **source of truth**: `UserThemeSelection` (feature 017's existing
  entity — `localStorage` key `pds-theme`, resolved via
  `resolveInitialTheme()`), never a separate, page-local state variable.
- Relationship: this feature's `<select>` is a *view* onto the existing
  `UserThemeSelection` state, plus a *write* path into it via the
  existing `selectTheme()` function — it does not introduce a competing
  state representation.

## Theme Collection (existing entity, read-only here)

- Consumed exactly as `THEMES`/`MOOD_FAMILIES` already exist in
  `shared/design-tokens.ts` (see specs/017-curated-theme-presets/
  data-model.md's `Theme`/`ThemeCollection` entities for the full
  definition) — this feature adds no field, no theme, no mood family.

## Cross-cutting invariant

- The `<select>`'s displayed value and `document.documentElement`'s
  actual `data-theme` attribute MUST never disagree at any point after
  this feature's script runs — every write path goes through the same
  `selectTheme()` function feature 017 already ratified, and the initial
  read comes directly from the already-applied attribute (research.md R3),
  so no independent state can drift from it.
