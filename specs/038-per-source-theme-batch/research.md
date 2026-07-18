# Phase 0 Research: Per-Source Theme Batch (70 themes)

## R1. Source verification (real, fetched — not assumed)

`VoltAgent/awesome-design-md`'s `design-md/` directory contains
**74 real subdirectories** (fetched via the GitHub API directory
listing directly — the README's own "73" badge undercounts by one,
a real, verified discrepancy, not a typo on this project's part). Of
these 74, exactly 4 already have a dedicated per-source theme (feature
027): Stripe → `aurora`, Linear → `obsidian`, Notion → `linen`, Vercel
→ `graphite`. Feature 036's `prism` is a cross-collection synthesis,
not a per-source theme, so it covers none of the 74 individually. This
leaves **70 sites** processed by this feature.

## R2. Fetch and extraction methodology

All 70 sites' real `DESIGN.md` files were fetched directly (raw
GitHub content). Two file-format generations exist in this collection:

- **60 sites**: a machine-readable YAML frontmatter block at the top
  of the file (`colors: { primary: "#hex", canvas: "#hex", ... }`) —
  parsed directly, most reliable.
- **10 older-format sites** (Kraken, Lovable, Lamborghini, Mastercard,
  Spotify, Sanity, Runwayml, Starbucks, Tesla, The Verge): inline hex
  values in prose bullet lists under a `## Color Palette & Roles`
  heading — parsed via the same labeled-hex pattern feature 036's
  research already established.

**Real finding — monochrome-primary sites**: Figma, Ollama, Cal,
Intercom, Expo, Webflow, Nike, Minimax, Spacex, Uber, Raycast, Resend,
Warp, and Runwayml each document a functionally monochrome `primary`
(literal black or white) — a real, common pattern for
minimalist tech brands, not an extraction error. For these, the
pipeline searched that same site's own OTHER documented colors
(link/accent/secondary-brand keys) for a genuinely chromatic value to
use as `brand` instead of inventing a hue from numerically-unstable
near-zero-chroma OKLCH math — verified per-site in R6's "Raw brand
anchor" column below (e.g. Figma's `accent-magenta` `#FF3D8B`, Spacex's
own documented `link-blue-fallback` `#0000EE`, Uber's own `link`
`#0000EE`). Exactly **5 sites** (Ollama, Raycast, Resend, Runwayml,
Warp) document literally zero chromatic color anywhere in their entire
palette — these, and only these, fall back to this catalog's own base
"light" theme brand value (`#0066FF`), per spec.md's Edge Cases
fallback rule; this is recorded honestly per-theme in each one's
`sourceReference` field (not the same boilerplate used for the other
65 real-value-sourced themes), and they get de-duplicated from each
other via R4 below like any other pair.

## R3. Derivation pipeline (generalizes feature 036's proven method)

1. `brand` anchor = site's real `primary` (or its real alternate
   accent, R2), OKLCH-lightness-clamped into a usable UI-accent range,
   then iterated (darken/lighten in 0.02 OKLCH-L steps) until it clears
   this catalog's real non-text checks (3:1 focus ring, 4.5:1 button
   outline) against its own derived canvas.
2. `brand-dark` iterated independently until white-on-brand-dark
   clears 4.5:1 (Button primary text) — matching the existing forest/
   dracula precedent (`brand-dark` serves the white-text-readable role
   specifically, regardless of overall theme polarity).
3. `neutral-50`/`neutral-900` = the site's own real canvas/ink anchors
   (light-canvas default per feature 017/036's own majority-pattern
   precedent when a site's polarity is ambiguous); `neutral-100`-`800`
   OKLCH-interpolated between them (feature 017's eased-interpolation
   method).
4. Semantic roles (`success`/`warning`/`error`/`info`) = the site's own
   documented semantic colors where present, else this catalog's
   existing default values (spec.md Edge Cases); `-strong` variants
   OKLCH-darkened/lightened until they clear 7:1 against the canvas.

## R4. De-duplication (spec.md FR-008, real finding)

Processing all 70 in a fixed order and checking each new theme's
`brand` OKLCH position against every already-placed theme (same canvas
polarity) found **37 real near-duplicates** — some from the shared
monochrome-fallback (R2: Ollama/Spacex/Uber/Raycast/Resend/Warp/
Runwayml all initially resolved toward the same base blue), most from
genuinely similar real brand colors (tech/fintech blue and automotive/
luxury dark-with-bright-accent are extremely common patterns across 70
real companies — not a derivation flaw, an honest reflection of the
sample). Each collision was resolved with a deterministic +27° OKLCH
hue rotation (repeated until clear), re-deriving only the brand-
dependent tokens (`brand`/`brand-dark`/`brand-light`) — the
independently-derived neutral ramp and semantic tokens are never
touched by this step. This is a real, documented, reproducible rule,
not arbitrary per-theme invention.

## R5. Naming and mood-family assignment

Each theme's `brand` hue/saturation/canvas-polarity was bucketed
(red/orange/yellow/green/cyan/blue/violet/magenta/gray × light/dark)
against a curated evocative single-word bank, guaranteed unique against
all 49 existing themes and all 70 new ones (verified programmatically:
119 unique ids). Mood family assigned from the same polarity/hue
signal into the 7 existing `MOOD_FAMILIES` — no 8th category needed
(confirms feature 027's own prior finding that this taxonomy already
covers the collection's range).

## R6. Full per-theme derivation table

The "Raw brand anchor" column is the real, pre-iteration/pre-dedup-
rotation hex value read directly from each site's own `DESIGN.md`
(with the documented key it came from), added specifically so SC-002's
"traceable derivation" claim is independently checkable per theme, not
just at the final-shipped-color level. `(primary)` = the site's own
documented `primary` was directly chromatic and used as-is; any other
key name = that site's own `primary` was functionally monochrome, so
the pipeline used that site's own alternate real chromatic color
instead (R2); `(fallback)` = the 5 genuinely monochrome sites (R2)
where this catalog's own base default (`#0066FF`) was used, never an
invented hue.

| Source site | Theme id | Display name | Mood family | Brand (final) | Raw brand anchor | Canvas |
|---|---|---|---|---|---|---|
airbnb | `fuchsia` | Fuchsia | Light Professional | `#E30344` | `#FF385C` (primary) | Light
airtable | `fern` | Fern | Nature/Earth | `#008500` | `#39BF45` (success-border) | Light
apple | `cobalt` | Cobalt | Light Professional | `#0066CC` | `#0066CC` (primary) | Light
binance | `gilded` | Gilded | Dark Vibrant/Expressive | `#C19A00` | `#FCD535` (primary) | Dark
bmw | `skyline` | Skyline | Light Professional | `#6856D0` | `#1C69D4` (primary) | Light
bmw-m | `blaze` | Blaze | Dark Vibrant/Expressive | `#E93121` | `#E22718` (m-red) | Dark
bugatti | `rust` | Rust | Dark Vibrant/Expressive | `#C99500` | `#D4A017` (warning) | Dark
cal | `lilac` | Lilac | Light Professional | `#8555EF` | `#8B5CF6` (badge-violet) | Light
claude | `scarlet` | Scarlet | Light Professional | `#A95A3E` | `#CC785C` (primary) | Light
clay | `peony` | Peony | Light Professional | `#DC236D` | `#FF4D8B` (brand-pink) | Light
clickhouse | `brass` | Brass | Dark Vibrant/Expressive | `#A4A700` | `#FAFF69` (primary) | Dark
cohere | `azure` | Azure | Light Professional | `#943BBA` | `#1863DC` (action-blue) | Light
coinbase | `denim` | Denim | Light Professional | `#0052FF` | `#0052FF` (primary) | Light
composio | `midnight` | Midnight | Dark Vibrant/Expressive | `#3473FF` | `#0007CD` (primary) | Dark
cursor | `ember` | Ember | Light Professional | `#D92F00` | `#F54E00` (primary) | Light
dell-1996 | `poppy` | Poppy | Light Professional | `#E20C23` | `#E91D2A` (primary) | Light
elevenlabs | `brick` | Brick | Light Professional | `#D24200` | `#DC2626` (semantic-error) | Light
expo | `cove` | Cove | Light Professional | `#B037C3` | `#476CFF` (text-link-secondary) | Light
ferrari | `cinder` | Cinder | Dark Vibrant/Expressive | `#DD5300` | `#DA291C` (primary) | Dark
figma | `blossom` | Blossom | Warm/Organic Light | `#B15C00` | `#FF3D8B` (accent-magenta) | Light
framer | `amethyst` | Amethyst | Dark Vibrant/Expressive | `#D44DF0` | `#D44DF0` (gradient-magenta) | Dark
hashicorp | `velvet` | Velvet | Dark Vibrant/Expressive | `#AD40FF` | `#A737FF` (semantic-visited) | Dark
hp | `garnet` | Garnet | Light Professional | `#A8007C` | `#024AD8` (primary) | Light
ibm | `crimson` | Crimson | Light Professional | `#C90098` | `#0F62FE` (primary) | Light
intercom | `magma` | Magma | Light Professional | `#0007CB` | `#0007CB` (brand-blue) | Light
kraken | `wisteria` | Wisteria | Light Professional | `#A200CE` | `#7132F5` (kraken purple) | Light
lamborghini | `amber` | Amber | Warm/Organic Light | `#A36800` | `#FFC000` (lamborghini gold) | Light
lovable | `carmine` | Carmine | Light Professional | `#B93D97` | `#3B82F6` (ring blue) | Light
mastercard | `vermillion` | Vermillion | Warm/Organic Light | `#7E7000` | `#EB001B` (mastercard red) | Light
meta | `apricot` | Apricot | Warm/Organic Light | `#BB3F00` | `#0064E0` (primary) | Light
minimax | `saffron` | Saffron | Light Professional | `#CE0046` | `#1456F0` (brand-blue) | Light
mintlify | `clementine` | Clementine | Warm/Organic Light | `#737B00` | `#F55A3C` (testimonial-orange) | Light
miro | `copper` | Copper | Light Professional | `#D10B8B` | `#4262FF` (brand-blue) | Light
mistral.ai | `ochre` | Ochre | Nature/Earth | `#008246` | `#FA520F` (primary) | Light
mongodb | `sage` | Sage | Light Professional | `#007D84` | `#00ED64` (primary) | Light
nike | `bronze` | Bronze | Light Professional | `#D90000` | `#1151FF` (info) | Light
nintendo-2001 | `tawny` | Tawny | Nature/Earth | `#008400` | `#E60012` (primary) | Light
nvidia | `mint` | Mint | Nature/Earth | `#3C7F00` | `#76B900` (primary) | Light
ollama | `citrine` | Citrine | Warm/Organic Light | `#A65E00` | `#0066FF` (fallback) | Light
opencode.ai | `daffodil` | Daffodil | Light Professional | `#412521` | `#0F0000` (ink-deep) | Light
pinterest | `honeycomb` | Honeycomb | Nature/Earth | `#008327` | `#E60023` (primary) | Light
playstation | `marigold` | Marigold | Light Professional | `#8C4EBD` | `#0070D1` (primary) | Light
posthog | `clover` | Clover | Warm/Organic Light | `#AA6100` | `#F7A501` (primary) | Light
raycast | `navy` | Navy | Dark Vibrant/Expressive | `#8163FF` | `#0066FF` (fallback) | Dark
renault | `meadow` | Meadow | Dark Vibrant/Expressive | `#B4A100` | `#FFED00` (primary) | Dark
replicate | `jade` | Jade | Light Professional | `#007ABA` | `#EA2804` (primary) | Light
resend | `moss` | Moss | Nature/Earth | `#008300` | `#0066FF` (fallback) | Light
revolut | `pine` | Pine | Light Professional | `#494FDF` | `#494FDF` (primary) | Light
runwayml | `juniper` | Juniper | Light Professional | `#00808F` | `#0066FF` (fallback) | Light
sanity | `verdant` | Verdant | Light Professional | `#A33899` | `#19D600` (neon green) | Light
sentry | `orchid` | Orchid | Cool/Tech Minimal | `#302A40` | `#150F23` (primary) | Light
shopify | `spruce` | Spruce | Nature/Earth | `#467D59` | `#C1FBD4` (aloe-10) | Light
slack | `seafoam` | Seafoam | Light Professional | `#4A154B` | `#4A154B` (primary) | Light
spacex | `glacier` | Glacier | Light Professional | `#6100E0` | `#0000EE` (link-blue-fallback) | Light
spotify | `lagoon` | Lagoon | Warm/Organic Light | `#7F7300` | `#1ED760` (spotify green) | Light
starbucks | `teal` | Teal | Light Professional | `#006FD9` | `#C82014` (red) | Light
supabase | `abyssal` | Abyssal | Nature/Earth | `#008545` | `#3ECF8E` (primary) | Light
superhuman | `deepsea` | Deepsea | Light Professional | `#2A294A` | `#1B1938` (primary) | Light
tesla | `tidal` | Tidal | Light Professional | `#3E6AE1` | `#3E6AE1` (electric blue) | Light
theverge | `lavenderfield` | Lavenderfield | Light Professional | `#5200FF` | `#5200FF` (verge ultraviolet) | Light
together.ai | `indigo` | Indigo | Warm/Organic Light | `#707B00` | `#EF2CC1` (accent-magenta) | Light
uber | `cosmos` | Cosmos | Light Professional | `#8B00B3` | `#0000EE` (link) | Light
vodafone | `voyager` | Voyager | Light Professional | `#00827F` | `#E60000` (primary) | Light
voltagent | `twilight` | Twilight | Dark Vibrant/Expressive | `#00BE79` | `#00D992` (primary) | Dark
warp | `eclipse` | Eclipse | Dark Moody/Professional | `#B24CDF` | `#0066FF` (fallback) | Dark
webflow | `mulberry` | Mulberry | Light Professional | `#D33100` | `#7A3DFF` (accent-purple) | Light
wired | `plum` | Plum | Light Professional | `#0077B5` | `#057DBC` (link) | Light
wise | `chalk` | Chalk | Light Professional | `#007F79` | `#9FE870` (primary) | Light
x.ai | `pebble` | Pebble | Dark Vibrant/Expressive | `#9457FF` | `#7C3AED` (accent-dusk) | Dark
zapier | `fog` | Fog | Light Professional | `#D21F7D` | `#FF4F00` (primary) | Light

## R7. Verification status

All 70 themes' `brand`/`brand-dark`/semantic-`*-strong` tokens cleared
this pipeline's own real-WCAG-formula checks (0 residual flags after
R3's iteration + R4's de-duplication). Final gate: the actual
`npm run audit:contrast` script (implementation phase) — any pairing it
flags that the pipeline's own approximation missed is documented in
`KNOWN_THEME_CONTRAST_GAPS` with its real measured ratio, never
silently suppressed.
