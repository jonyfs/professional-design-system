# Quickstart: Claude-Design-Inspired Theme Presets (Batch 2)

## Prerequisites

- Existing scaffold only — no new dependencies to install (FR-008).

## Run the dev gallery

```bash
npm run dev
```

Open `http://localhost:5173/src/components/theme-gallery/theme-gallery.html`.

## Validate User Story 1 (new themes, P1 MVP)

1. Confirm the Theme Gallery lists 48 themes total (43 existing + 5
   new: `aurora`, `obsidian`, `linen`, `graphite`, `nebula`), each
   grouped under its assigned existing `moodFamily` (research.md R4 —
   no new mood-family section should appear).
2. Select each of the 5 new themes in turn — confirm every existing
   shipped component (Button, Badge, Card, Alert, TextInput, and at
   least one from each Component Catalog category) re-colors
   correctly, exactly like every pre-existing theme already does.
3. For each new theme, confirm a reviewer can name its distinguishing
   visual characteristic in one sentence, and that it reads as
   genuinely different from all other 47 themes (SC-001) — not a
   near-duplicate of any existing theme or of another theme in this
   same batch.
4. Confirm no new theme's name, description, or any shipped comment
   names the real company/product that inspired it (SC-005) —
   `grep -ri` the 5 new `sourceReference` values and theme
   display names against the 5 real company names in research.md R3;
   zero matches expected.

## Validate User Story 2 (component-gap research)

1. Read research.md R7 — confirm it states an explicit conclusion
   ("no genuine new component-type gap found") for each of the
   source's 9 `DESIGN.md` sections, not silence (FR-006).
2. Confirm any candidate mentioned is cross-referenced against feature
   018's 105-candidate inventory (FR-007) — expected: none needed,
   since R7 concludes no new candidates were found.

## Automated validation

```bash
node scripts/check-contrast.mjs   # now runs 48x (was 43x), zero new failures beyond any explicitly-documented KNOWN_THEME_CONTRAST_GAPS entry
npm run audit:tokens              # confirm zero raw palette classes introduced
npx playwright test theme-        # theme-architecture, theme-gallery, gallery-theme-selector specs extended with the 5 new ids
```

## Expected outcomes

- Zero visual or behavioral change to any of the 43 existing themes
  (SC-002) — this is a pure additive batch, verified by the existing
  per-theme contrast audit and visual-regression baselines for all
  pre-existing themes staying unchanged.
- All 5 new themes pass the same AAA contrast bar as the existing
  batch, or have an explicit, individually-documented gap in
  `KNOWN_THEME_CONTRAST_GAPS` (SC-003) — never a silent, unverified
  theme.
- The Theme Gallery's category structure (7 `MOOD_FAMILIES`) is
  unchanged — all 5 new themes fit an existing category (research.md
  R4).
