# Contract: Per-Source Batch Theme Derivation

Reuses feature 017's `ThemeTokens` schema and `[data-theme="..."]`
CSS-custom-property mechanism verbatim — no new mechanism. This
contract covers the derivation rule this feature introduces:
synthesizing 70 themes, ONE per real external source, generalizing
feature 036's (Prism) single-synthesis method and feature 027's
per-source-mapping precedent to batch scale.

## Derivation rule (per theme, applied identically 70 times)

| This catalog's token | Derivation |
|---|---|
| `brand` | The site's own real documented `primary` (or, when that is
functionally monochrome — research.md R2 — its own alternate real
chromatic accent, else this catalog's base `#0066FF` fallback),
OKLCH-lightness-iterated until it clears the real non-text checks (3:1
focus ring, 4.5:1 button outline) against its own derived canvas |
| `brand-dark` | OKLCH-darkened/lightened independently until white
text on it clears 4.5:1 (Button primary text), per the existing
forest/dracula precedent |
| `brand-light` | OKLCH-lightened from `brand`, same method as every
existing theme |
| `neutral-50`/`neutral-900` | The site's own real documented
canvas/ink anchors (or catalog default when undocumented) |
| `neutral-100`…`neutral-800` | OKLCH-interpolated between
`neutral-50`/`neutral-900` (feature 017's eased-interpolation method) |
| `success`/`warning`/`error`/`info` (+`-strong`) | The site's own
documented semantic colors where present, else this catalog's existing
defaults; `-strong` variants OKLCH-darkened/lightened until 7:1 |
| De-duplication | Any theme whose `brand` OKLCH position lands within
`dH<6° AND ΔC<0.05 AND ΔL<0.08` of an already-placed theme (same
canvas polarity) is rotated +27° in hue (repeated until clear),
re-deriving only `brand`/`brand-dark`/`brand-light` — neutral ramp and
semantic tokens untouched (research.md R4) |

## Verification gate (mandatory before shipping, same as every prior theme batch)

1. `npm run audit:tokens` — 0 new/raw Tailwind classes (pure data
   addition; identical class-count baseline).
2. `npm run audit:contrast` — every one of the 70 themes' pairings
   clears AAA (7:1 text) / WCAG 1.4.11 (3:1 non-text) / Button 4.5:1,
   or is individually added to `KNOWN_THEME_CONTRAST_GAPS` with its
   real measured ratio — never silently suppressed.
3. Theme Gallery renders all 70 new cards with correct swatches,
   grouped under their assigned mood family; displayed theme count
   updates from 49 to 119.
4. `tests/e2e/theme-restyle.spec.ts`'s `NEW_THEMES` array includes all
   70 new ids so visual regression baselines are generated for each.
5. `tests/e2e/gallery-theme-selector.spec.ts`'s hardcoded theme count
   assertion updates from 49 to 119.
6. Full Playwright suite (all specs, all 6 browser/viewport projects)
   passes with zero regressions to the other 49 themes.
