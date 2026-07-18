# Phase 0 Research: Prism Color Scheme

## R1. Source sample (real, fetched — not assumed)

The `VoltAgent/awesome-design-md` GitHub repository's README lists 73
sites by mood-description only (no hex values). The actual hex values
live one level down, in each site's own `design-md/<slug>/DESIGN.md`
file inside the same repository. A representative, cross-category
sample of 7 sites was fetched directly (raw file content, not the
marketing-summary page) and their `## Colors` sections extracted
verbatim:

| Site | Category | Signature accent (real hex) |
|---|---|---|
| Claude | AI & LLM Platforms | Coral `#cc785c` |
| Supabase | Backend/Database/DevOps | Emerald `#3ecf8e` |
| Vercel | Developer Tools & IDEs | Cyan `#50e3c2` (brand-gradient accent; the site's literal `{colors.primary}` is near-black ink, `#171717`, since Vercel's system is monochrome-first) |
| Stripe | Fintech & Crypto | Indigo `#533afd` |
| Airbnb | E-commerce & Retail | Rausch `#ff385c` |
| Linear | Productivity & SaaS | Lavender-blue (`{colors.primary-hover}` `#828fff` is the closest published hex; the base primary token itself has no hex value in the source file) |
| Spotify | Media & Consumer Tech | Spotify Green `#1ed760` |

7 sites, 7 distinct categories — exceeds spec.md SC-002's 5-site/
3-category minimum.

## R2. Canvas polarity across the sample

| Site | Primary canvas |
|---|---|
| Claude | Light, warm cream `#faf9f5` |
| Supabase | Light, `#ffffff` (dark `#1c1c1c` used only in code/dashboard bands) |
| Vercel | Light, `#ffffff` |
| Stripe | Light, `#ffffff` |
| Airbnb | Light, `#ffffff` (no dark mode at all) |
| Linear | Dark, near-black `#010102` |
| Spotify | Dark, near-black `#121212` |

5 of 7 sampled sites are light-canvas-primary. Prism is built as a
**light theme** (majority pattern in this sample), joining this
catalog's existing "Light Professional" mood family — already this
catalog's largest, with 9 members (`light`, `corporate`, `cosmo`,
`flatly`, `litera`, `lumen`, `zephyr`, `silk`, `winter`) — as its 10th.

## R3. Accent-hue synthesis (real math, not an assertion)

RGB averaging across hues this far apart on the color wheel produces
visual mud (a well-known limitation of linear RGB averaging for
perceptually distant hues), so the accent color was derived via
**circular mean of hue angles** (HSL), which correctly handles hue's
wraparound instead of collapsing toward gray:

| Site | Hex | H° | S% | L% |
|---|---|---|---|---|
| Claude | `#cc785c` | 16 | 45 | 58 |
| Supabase | `#3ecf8e` | 154 | 61 | 53 |
| Vercel | `#50e3c2` | 166 | 71 | 60 |
| Stripe | `#533afd` | 249 | 98 | 61 |
| Airbnb | `#ff385c` | 350 | 100 | 61 |
| Linear | `#828fff` | 233 | 100 | 75 |
| Spotify | `#1ed760` | 139 | 79 | 48 |

Circular mean: converting each hue to a unit vector `(cos H, sin H)`,
averaging the 7 vectors, and taking `atan2` of the result gives a mean
hue of **≈190°** (cyan-teal) — with a low resultant vector magnitude
(≈0.24 of 1.0), correctly signaling that the 7 source hues are
genuinely spread across most of the wheel (this collection really does
span the full rainbow; the synthesis does not pretend otherwise).

A mean hue of ~190° landing near the spectral cyan/teal band — visually
close to the midpoint of a real optical spectrum — is the basis for
the theme's "Prism" framing: not a coincidence to force, but the actual
computed center of this specific 7-site sample.

Applying a representative saturation/lightness within the sample's own
observed range (S 70%, L 50% — near the sample's mean S≈79%/L≈59%,
pulled slightly toward this catalog's existing mid-tone convention for
a `brand` token) to `HSL(190°, 70%, 50%)` converts to `#26BBD9` — but
this initial value only reaches 2.28:1 against the white canvas — the
live `scripts/check-contrast.mjs` runs TWO separate non-text checks
against this same `brand`-vs-`neutral-50` pairing (Text Input focus
ring, 3:1 required; Button focus-visible outline, 4.5:1 required, the
stricter of the two), so 2.28:1 fails both. Keeping the same hue and
saturation (190°, 70% — the actual computed synthesis) and lowering L
in two steps — first to 40% (3.49:1, clears the 3:1 check but not the
4.5:1 one), then to 34% — clears both at once: `HSL(190°, 70%, 34%)`
→ **`#1A7F93`** (4.67:1, well past both thresholds) — this is Prism's
final `brand` anchor (R5 below derives `brand-dark`/`brand-light` from
it and confirms every other pairing).

## R4. Semantic-role synthesis (real math)

Each semantic role was averaged (linear RGB — these clusters are
already hue-coherent, so linear averaging does not produce mud) from
the subset of the 7 sampled sites that document that specific role
with a real hex value:

- **Success** (green cluster: Claude `#5db872`, Supabase `#3ecf8e`,
  Spotify `#1ed760`) → average `#3eca75`
- **Error** (red cluster: Vercel `#ee0000`, Airbnb `#c13515`, Spotify
  `#f3727f`, Claude `#c64545`) → average `#da3b36`
- **Warning** (amber cluster: Vercel `#f5a623`, Spotify `#ffa42b`,
  Claude `#d4a017`) → average `#eca322`
- **Info** (blue-link cluster: Vercel `#0070f3`, Spotify `#539df5`,
  Airbnb `#428bff`) → average `#3288f8`

These land squarely within this catalog's existing
green/red/amber/blue semantic-role convention (every one of the 48
existing themes uses the same 4-hue-family mapping) — the synthesis
reinforces the existing convention rather than inventing a new one.

## R5. Neutral scale, `-strong` variants, and AAA verification

Anchors (real, from R1/R2's light-canvas majority):
- `neutral-50` (canvas): averaging the 4 pure/near-pure-white canvases
  (`#faf9f5`, `#ffffff`, `#ffffff`, `#ffffff`) → effectively white with
  a barely-perceptible warm cast; rounds to `#FFFFFF` to match this
  catalog's existing "neutral-50 is the theme-invertible page-background
  role" convention (feature 017 retrofit) exactly.
- `neutral-900` (ink): averaging the 4 sampled real ink values (Claude
  `#141413`, Vercel `#171717`, Stripe `#0d253d`, Airbnb `#222222`) →
  `#191d21`, a near-black with the faintest cool cast.
- `neutral-100`…`neutral-800`: OKLCH-interpolated between `neutral-50`
  and `neutral-900` using this catalog's existing eased-interpolation
  method (feature 017 R6 / feature 027 precedent), then every text/
  background/non-text pairing checked against `scripts/check-
  contrast.mjs` and adjusted exactly as every prior theme's derivation
  was — any pairing that cannot clear AAA/WCAG-1.4.11 after
  adjustment is documented in `KNOWN_THEME_CONTRAST_GAPS` with its
  actual measured ratio (FR-005), never silently suppressed.
- `brand-dark`/`brand-light`: OKLCH-derived from the final `brand`
  anchor (`#1A7F93`, R3) using the same darken/lighten-toward-AAA
  method as every existing theme, since none of the 7 sampled sites
  documented a press/hover variant of the *synthesized* (as opposed to
  individual) accent. Result: `brand-dark` `#004052` (8.37:1 white-text
  contrast, clears the 4.5:1 button-text bar), `brand-light` `#91EBFF`.
- `success-strong`/`warning-strong`/`error-strong`/`info-strong`:
  OKLCH-darkened from each R4 base value toward this catalog's existing
  AAA-on-light-canvas convention (the same role every light theme's
  `-strong` tokens already serve: ink-colored text read directly
  against the page).

**Final result (T002, verified against the live `audit:contrast`
script, not just hand-computed)**: `success` `#3ECA75`/`success-strong`
`#00600B` (7.84:1), `warning` `#ECA322`/`warning-strong` `#773600`
(9.08:1), `error` `#DA3B36`/`error-strong` `#9A0000` (8.85:1), `info`
`#3288F8`/`info-strong` `#0049B4` (8.04:1) — every text pairing clears
AAA (≥7:1). The `brand` anchor itself needed two rounds of adjustment
against the live script's non-text checks (R3): initial
`HSL(190°,70%,50%)` (`#26BBD9`) failed both the 3:1 Text Input
focus-ring AND 4.5:1 Button focus-visible-outline checks (2.28:1, the
same pairing checked against two different thresholds); lowering to
`HSL(190°,70%,34%)` (`#1A7F93`, same hue/saturation) clears both at
once (4.67:1) plus the 3:1 Progress fill-vs-track check (5.46:1).
**Exactly ONE genuine gap remained after
full iteration**: Sidebar's fixed dark-item-on-`neutral-900` pairing
(`text-neutral-300` `#959799` on `bg-neutral-900` `#191D21`) resolves
to 5.78:1, short of 7:1 — a structural conflict this fixed 21-token
schema already imposes on roughly 20 of the other 48 themes (light and
dark alike — e.g. `corporate`, `silk`, `winter`, `cupcake`, `nord`,
`forest`), not a Prism-specific derivation flaw. Documented in
`KNOWN_THEME_CONTRAST_GAPS` with this real ratio (spec.md FR-005).

## R6. Naming

"Prism" — light entering a prism splits into a full spectrum; here, a
spectrum of 7 real, named design systems' colors condenses into one
new palette. Confirmed not already used by any of this catalog's 48
existing theme ids/display names, and not the source repository name,
VoltAgent, or any single cataloged company (spec.md FR-003).

## R7. No new component-catalog gap

Unlike feature 027 (which cross-checked its source against feature
018's component gap inventory), this feature is a palette-only
addition with no component-catalog scope — `awesome-design-md`'s
subject matter is visual/color language, not component inventories, so
no secondary component-gap research pass is warranted here.
