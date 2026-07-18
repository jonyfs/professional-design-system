# Contract: Prism Token Derivation

Reuses feature 017's `ThemeTokens` schema and `[data-theme="prism"]`
CSS-custom-property mechanism verbatim (`specs/017-curated-theme-
presets/contracts/theme-tokens.contract.md`) — no new mechanism. This
contract covers only the derivation rule this feature introduces:
synthesizing ONE theme from a cross-section of real external sources,
rather than mapping one theme per source (feature 017/027's pattern).

## Derivation rule

| This catalog's token | Derivation |
|---|---|
| `brand` | Circular-mean hue (research.md R3) of 7 real sampled sites' signature accents, at representative S/L → `HSL(190°,70%,40%)` = `#1A7F93` (nudged from an initial L=50% after the 3:1 non-text check failed at that lightness) |
| `brand-dark` | OKLCH-darkened from `brand` → `#004052`, same method as every existing theme |
| `brand-light` | OKLCH-lightened from `brand` → `#91EBFF`, same method as every existing theme |
| `neutral-50` | Averaged real light-canvas sample (research.md R5) → `#FFFFFF`, matching the existing theme-invertible page-background convention |
| `neutral-900` | Averaged real ink-text sample (research.md R5) → `#191d21` anchor |
| `neutral-100`…`neutral-800` | OKLCH-interpolated between `neutral-50`/`neutral-900` (feature 017's eased-interpolation method), AAA-verified per-pairing |
| `success`/`success-strong` | Linear-RGB average of 3 real green accents (research.md R4) → `#3eca75` anchor, `-strong` OKLCH-darkened |
| `warning`/`warning-strong` | Linear-RGB average of 3 real amber accents → `#eca322` anchor, `-strong` OKLCH-darkened |
| `error`/`error-strong` | Linear-RGB average of 4 real red accents → `#da3b36` anchor, `-strong` OKLCH-darkened |
| `info`/`info-strong` | Linear-RGB average of 3 real blue-link accents → `#3288f8` anchor, `-strong` OKLCH-darkened |

## Verification gate (mandatory before shipping, same as every prior theme)

1. `npm run audit:tokens` — 0 new/raw Tailwind classes (this is a
   pure data addition; the audit should report identical class-count
   baselines).
2. `npm run audit:contrast` — every Prism pairing clears AAA (7:1 text)
   / WCAG 1.4.11 (3:1 non-text), or is individually added to
   `KNOWN_THEME_CONTRAST_GAPS` with its real measured ratio.
3. Theme Gallery renders Prism's card with correct swatches, grouped
   under `Light Professional`, and the gallery's displayed theme count
   updates from 48 to 49.
4. Full Playwright suite (all specs, all 6 browser/viewport projects)
   passes with zero regressions to the other 48 themes.
