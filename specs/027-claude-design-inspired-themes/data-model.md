# Data Model: Claude-Design-Inspired Theme Presets (Batch 2)

This feature adds instances to feature 017's existing entities — it
introduces no new entity types. See `specs/017-curated-theme-presets/
data-model.md` for the full original definitions; only what's new or
notable for this batch is documented below.

## ThemeToken (existing, feature 017 — unchanged)

The fixed 21-property schema (`brand-light`, `brand`, `brand-dark`,
`neutral-50`…`neutral-900`, `success`/`success-strong`, `warning`/
`warning-strong`, `error`/`error-strong`, `info`/`info-strong`) is
reused verbatim. Each of this batch's 5 new themes MUST declare all
21 — no partial themes.

## Theme (existing, feature 017 — 5 new instances)

- **id**: `aurora`, `obsidian`, `linen`, `graphite`, `nebula`
  (research.md R3) — all verified non-colliding with the 43 existing
  ids.
- **displayName**: "Aurora", "Obsidian", "Linen", "Graphite", "Nebula".
- **moodFamily**: assigned per research.md R4, all 5 fitting an
  existing `MOOD_FAMILIES` entry — no new category added.
- **sourceReference**: for this batch, documents the *derivation
  method* (real getdesign.md DESIGN.md page, browser-extracted,
  mapped per contracts/source-token-mapping.contract.md), not the
  inspiring company's name — per spec.md's resolved naming decision,
  the company-to-theme mapping is an internal research artifact only
  (this research.md / plan.md), never shipped in code, comments, or
  user-facing copy. The `sourceReference` field's shipped value reads
  as e.g. "Independently derived light/dark palette research,
  gradient-mesh and typographic-elegance mood family — see this
  catalog's feature 027 research notes for derivation methodology,"
  mirroring how feature 017's own `sourceReference` values name real
  tooling/methodology, not a hidden attribution.
- **isDefault**: `false` for all 5 (unchanged — `light` remains the
  one default theme).
- **tokens**: the 21 `ThemeTokens` values, derived per research.md R5
  during `/speckit-implement` (not finalized in this plan).

## UserThemeSelection (existing, feature 017 — unchanged)

No change — the existing `localStorage` key `pds-theme` and
resolution logic (`resolvedThemeId` falls back to the default `light`
theme for any unrecognized `storedValue`) already handles new theme
ids transparently; adding entries to `THEMES` requires no change to
this entity or its resolution logic.

## ThemeCollection (existing, feature 017 — grows from 43 to 48)

The full ordered set `THEMES` grows by 5. Grouped-by-`moodFamily`
gallery display (feature 017 User Story 3) requires no new code —
the existing Theme Gallery renders whatever `MOOD_FAMILIES` categories
have at least one theme, which all 7 already do before this batch and
continue to after it.

## Aesthetic Reference (new, research-only — spec.md's own entity)

Not user-facing, not persisted in shipped code — a research-time
artifact living in this feature's `research.md` (R3 table) only:
`{ sourceSlug, category, publiclyDescribedMood, newThemeId | null }`.
Every one of the 68 collection entries doesn't need its own row here
— only the 5 that informed a shipped theme, per spec.md's own
Key Entities note ("Not user-facing").
