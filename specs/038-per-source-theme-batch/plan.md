# Implementation Plan: Per-Source Theme Batch (awesome-design-md Coverage)

**Branch**: `038-per-source-theme-batch` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/038-per-source-theme-batch/spec.md`

## Summary

Ship 70 new themes — one per currently-uncovered site in the
`VoltAgent/awesome-design-md` collection (74 total sites − 4 already
covered by feature 027's `aurora`/`obsidian`/`linen`/`graphite`) —
bringing this catalog from 49 to 119 themes. Given the scale (roughly
3x the largest prior single-feature batch), derivation uses a
reusable, scriptable pipeline generalizing feature 036's (Prism)
OKLCH-interpolation + real-WCAG-formula method: fetch each site's real
`DESIGN.md`, extract its own documented brand/canvas/ink anchors,
derive the full 21-token palette, iterate lightness until the real
non-text/text AAA checks clear, and de-duplicate near-identical
resulting hues via a small, documented, deterministic hue rotation
(spec.md FR-008).

## Technical Context

**Language/Version**: TypeScript (design tokens), CSS custom
properties (theme values) — same as feature 036/017/027

**Primary Dependencies**: None new — reuses `shared/design-tokens.ts`,
`src/styles/themes.css`, `scripts/check-contrast.mjs`

**Storage**: N/A

**Testing**: `npm run audit:tokens`/`audit:contrast` (all 119 themes);
full Playwright suite as the zero-regression gate

**Target Platform**: Static HTML site (theme tokens are surface-
agnostic; `packages/react/` carries no per-theme CSS, per feature
017/027's own established convention — confirmed again, not assumed)

**Project Type**: Web design system, theme-data batch addition

**Performance Goals**: N/A — 70 more CSS custom-property blocks has no
measurable runtime cost distinct from the existing 49

**Constraints**: spec.md FR-001/FR-009 — no new token categories, no
new mechanism, the 4 already-covered themes and `prism` untouched

**Scale/Scope**: 70 new `ThemeDefinition` entries (49 → 119 total)

## Research methodology (Phase 0, condensed — full data in research.md)

1. **Fetch**: all 70 sites' real `DESIGN.md` files fetched directly
   (raw GitHub content, not the marketing-summary page — the same
   distinction research.md R1 from feature 036 already established).
   Two real file-format generations exist in this collection: 60 sites
   ship a machine-readable YAML frontmatter block (`colors: { primary:
   "#hex", ... }`) at the top of the file; 10 older-format sites only
   have inline hex values in prose bullet lists — both parsed
   programmatically.
2. **Anchor extraction**: `primary` (brand), `canvas`/`ink` (or their
   nearest documented equivalents) pulled per site. **Real finding**:
   several sites (Figma, Ollama, Cal, Intercom, Expo, Webflow, Nike,
   Minimax, Spacex, Uber, Raycast, Resend, Warp, Runwayml — see
   research.md for the full list) document a functionally monochrome
   `primary` (literal black/white) — a real, common pattern (several
   of these sites' own README mood-lines already say so, e.g.
   "monochrome"), not an extraction bug. For these, the pipeline
   searches that SAME site's own other documented colors (link/accent/
   secondary-brand keys) for a genuinely chromatic real value to use as
   `brand` instead — never inventing a hue from unstable near-zero-
   chroma OKLCH math.
3. **Derivation**: OKLCH-interpolated neutral ramp between real canvas/
   ink anchors (feature 017's eased-interpolation method); brand
   lightness iterated until it clears this catalog's real non-text (3:1
   focus ring, 4.5:1 button-outline) and text (7:1) checks, verified
   against the actual WCAG relative-luminance formula this catalog's
   own `check-contrast.mjs` uses.
4. **De-duplication** (FR-008): processed in a fixed order; any theme
   whose resulting brand hue/chroma/lightness lands within a tight
   tolerance of an already-placed theme (same canvas polarity) is
   rotated +27° in hue, re-deriving only the brand-dependent tokens —
   documented per-theme in research.md, not silently invented.
5. **Naming**: hue-bucketed against a curated evocative-word bank
   (feature 027 precedent: mood word, never the company name),
   guaranteed unique against all 49 existing + all 70 new themes.
6. **Mood family**: assigned from canvas polarity + saturation/hue
   character into the 7 existing `MOOD_FAMILIES` — no 8th category
   needed (matches feature 027's own precedent finding).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle IV (Theming & Multi-Palette Architecture)**: PASS — 70
  new `ThemeDefinition` entries in the existing mechanism, each
  declaring the full fixed 21-property schema.
- **Principle II (Accessibility, AAA where feasible)**: PASS — same
  honesty convention as every prior batch; any pairing that cannot
  clear AAA after the derivation pipeline's own iteration is
  individually documented in `KNOWN_THEME_CONTRAST_GAPS` with its real
  measured ratio (verified against the ACTUAL `audit:contrast.mjs`
  script, not just the pipeline's own approximation).
- **Dual-surface shipping convention**: PASS — theme tokens are
  surface-agnostic; no per-surface duplication needed (feature 017/027
  precedent).
- **No new dependency/mechanism**: PASS — reuses existing derivation/
  verification tooling; the only new artifact is this feature's own
  one-off batch-derivation script (not shipped code).
- **Trademark/attribution honesty**: PASS — every new theme's name and
  user-facing description name a distilled aesthetic concept only; the
  70 source companies are cited as research provenance in
  `research.md`/`sourceReference` only, matching the source
  collection's own license terms and feature 027's established
  precedent.

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/038-per-source-theme-batch/
├── plan.md              # This file
├── research.md          # Phase 0: 70-site derivation table (real hex anchors, methodology, de-dup log)
├── data-model.md         # Phase 1: reuses feature 017's ThemeDefinition/ThemeTokens — 70 new entries
├── contracts/
│   └── batch-derivation.contract.md  # Phase 1: derivation rule + verification gate
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
shared/
└── design-tokens.ts          # THEMES array — 70 new entries appended

src/
└── styles/
    └── themes.css             # 70 new [data-theme="..."] blocks

scripts/
└── check-contrast.mjs          # KNOWN_THEME_CONTRAST_GAPS extended only for genuine, documented gaps found by the real audit
```

## Complexity Tracking

*No entries — no constitutional violations to justify.*
