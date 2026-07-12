# Research: Curated Theme Presets

## R1. Theme architecture mechanism — CSS custom properties via Tailwind's RGB-tuple technique, confirmed empirically

**Decision**: Migrate `shared/design-tokens.ts`'s 21 color values (brand:
light/DEFAULT/dark; neutral: 50-900, 10 shades; success/warning/error/
info: DEFAULT/strong each) from static hex strings to CSS custom
properties, referenced in `tailwind.config.ts` via Tailwind's documented
RGB-tuple opacity-compatible pattern: `rgb(var(--color-brand-dark) /
<alpha-value>)`. Each theme becomes a `[data-theme="name"]` CSS rule
block declaring ~21 `--color-*` custom properties as space-separated RGB
components (e.g. `--color-brand-dark: 0 75 179;`). Switching
`document.documentElement.dataset.theme` at runtime restyles every
existing component with **zero markup or component-file changes**.

**Verification (not assumed)**: Built a real, standalone Tailwind v3
proof-of-concept — a `tailwind.config.js` with `colors.brand.dark: "rgb(var(--color-brand-dark) / <alpha-value>)"`, two `[data-theme]` blocks
("ocean" and "sunset") each declaring the same custom-property names with
different RGB values, and a page using `bg-brand-dark`, `bg-success/5`
(opacity modifier), and `border-neutral-900` — the exact utility shapes
this catalog's real components already use. Result, verified via
Playwright's real computed styles:
- `data-theme="ocean"` (default): button background computed to
  `rgb(0, 75, 179)` — the ocean theme's `brand-dark` value, correct.
- Switching to `data-theme="sunset"` via a single JS attribute change (NO
  page reload, NO markup edit): button background immediately recomputed
  to `rgb(154, 52, 18)` — the sunset theme's `brand-dark` value.
- The opacity-modifier utility `bg-success/5` (this catalog's own Badge
  pattern) correctly computed to `rgba(22, 163, 74, 0.05)` under the
  sunset theme's `success` value — confirming the RGB-tuple technique
  fully preserves Tailwind's opacity-modifier syntax, which a plain
  `var(--color-x)` (without the RGB-tuple decomposition) would NOT
  support.

**Conclusion**: this is the correct, minimal-surface-area mechanism.
Every existing component's HTML/CSS stays completely unmodified — only
`tailwind.config.ts` (colors object) and `shared/design-tokens.ts` (now
emitting CSS custom-property declarations instead of/alongside static
hex, for the React package's own theming) change, plus one new small
`themes.css` (or similar) file declaring each `[data-theme]` block.

**Alternatives considered**:
- Runtime Tailwind recompilation per theme (e.g. generating 40 separate
  compiled stylesheets, one per theme, swapped via `<link>` tag) —
  rejected: 40x the CSS bundle size shipped to every visitor, and 40x
  this project's own build/audit pipeline runs, for a problem CSS custom
  properties solve with a single shared stylesheet and ~21 custom
  properties per theme.
- Inline `style` custom-property injection via JS (`el.style.setProperty`)
  scoped per-component — rejected: this project's CSP already blocks
  inline `style="..."` attributes (feature 014 R12), and per-component
  injection would require touching every one of the ~48 existing
  component files, the opposite of the zero-markup-change goal.

## R2. The AAA/AA contrast re-verification bottleneck — parametrize the existing audit script, don't hand-verify 40 times

**Decision**: Extend `scripts/check-contrast.mjs` so its existing
`PAIRINGS`/`RING_PAIRINGS` arrays — which already encode the CORRECT
relationships (e.g. "text-neutral-900 on white", "text-white on
bg-brand-dark") — are re-evaluated once per theme, substituting each
theme's own token values for the token names, rather than hand-computing
new pairing entries 40 times. The relationships themselves (which two
roles must contrast against each other) don't change per theme; only the
underlying RGB values do. A new theme fails the audit exactly the same
way an existing single-theme color choice would fail it today — a real,
automated gate, not a rubber stamp.

**Structural constraint that makes compliance likely by construction,
verified rather than assumed sufficient on its own**: requiring every
theme's `neutral-900` (body text) to independently clear 7:1 against
that theme's own background (`neutral-50`/white), and every `-strong`
status variant (already-established convention from features 014/015)
to independently clear 7:1 against white, means the SAME two rules this
catalog already enforces for its one existing theme apply per-theme —
no new rule invented, just re-run per theme. This is NOT treated as
sufficient BY ITSELF (a theme's specific hue could still fail even with
this constraint in place, e.g. a very light "-dark" or "-strong" pick)
— the automated per-theme audit run is the actual gate, this constraint
only makes passing it more likely on the first attempt per theme,
reducing (not eliminating) iteration.

**Alternatives considered**: A purely formulaic/algorithmic constraint
(e.g. "every accent hue's `-dark` variant is generated by darkening in
OKLCH until L* crosses a fixed threshold, guaranteeing 7:1 by
construction, no verification needed") — rejected as the sole mechanism:
this project's own established discipline (features 014/015/016) is to
verify empirically, not trust a formula's math alone, since real
rendering/color-space edge cases have repeatedly surfaced defects a
formula alone would have missed (e.g. feature 015's Indicator R9 defect,
feature 016's ColorInput `appearance-none` finding). The formulaic
approach is used to CHOOSE each theme's candidate values efficiently,
but the automated audit script re-verification remains the actual gate.

## R3. Where the 40+ theme names/directions come from — real, fetched inventories, not invented

Fetched two real, live theme-collection sources directly (not assumed
from training knowledge) to ground this list:

- **DaisyUI** (fetched live): ships exactly 35 built-in named themes —
  light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro,
  cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel,
  fantasy, wireframe, black, luxury, dracula, cmyk, autumn, business,
  acid, lemonade, night, coffee, winter, dim, nord, sunset, caramellatte,
  abyss, silk.
- **Bootswatch** (fetched live): ships 27 named themes — Default, Brite,
  Cerulean, Cosmo, Cyborg, Darkly, Flatly, Journal, Litera, Lumen, Lux,
  Materia, Minty, Morph, Pulse, Quartz, Sandstone, Simplex, Sketchy,
  Slate, Solar, Spacelab, Superhero, United, Vapor, Yeti, Zephyr.

Combined with well-established, independently popular GitHub-native
developer color schemes not already covered by either list above
(Catppuccin, Gruvbox, Rose Pine, Tokyo Night, Everforest, Solarized —
each with real, large GitHub followings as standalone color-scheme
projects, several of which DaisyUI itself already recognizes as
worth including, e.g. its own "nord"/"dracula" entries), this gives a
combined real-name pool of 65+ candidates to select a non-overlapping,
genuinely varied 42 from — comfortably clearing the 40+ requirement with
margin, and grounded entirely in real, fetched, or independently
well-known references rather than invented names.

**Curated selection** (42 themes, name + mood/hue direction + primary
reference — final hex values are Phase 1 `data-model.md`/`contracts`
work, not decided here):

*Light, professional/corporate (8)*: Corporate (DaisyUI) — cool
blue-gray, boardroom-safe; Cosmo (Bootswatch) — crisp blue, clean SaaS;
Flatly (Bootswatch) — flat teal/green; Litera (Bootswatch) — editorial
serif-adjacent blue; Lumen (Bootswatch) — soft warm-gray minimal;
Zephyr (Bootswatch) — light airy blue; Silk (DaisyUI) — warm off-white,
premium-soft; Winter (DaisyUI) — cool icy blue-white.

*Warm/organic light (6)*: Cupcake (DaisyUI) — soft pastel pink/cream;
Sandstone (Bootswatch) — warm tan/brown; Garden (DaisyUI) — soft
pink-green nature palette; Autumn (DaisyUI) — burnt orange/brown; Lemonade
(DaisyUI) — bright citrus yellow-green; Caramellatte (DaisyUI) — warm
caramel/cream.

*Nature/earth (5)*: Forest (DaisyUI) — deep green; Everforest (community,
GitHub-popular) — muted forest-green/warm-neutral; Gruvbox (community,
GitHub-popular) — warm retro-earth amber/olive; Aqua (DaisyUI) —
blue-green/teal marine; Emerald (DaisyUI) — jewel-tone green.

*Cool/tech minimal (6)*: Nord (DaisyUI + community) — cool arctic
blue-gray, one of GitHub's most-recognized palettes; Slate (Bootswatch)
— cool blue-gray dark; Spacelab (Bootswatch) — cool lavender-blue; Cerulean
(Bootswatch) — bright sky blue; Quartz (Bootswatch) — cool pink-purple
crystal; Journal (Bootswatch) — clean editorial blue.

*Dark, moody/professional (7)*: Business (DaisyUI) — dark navy/charcoal
boardroom; Dim (DaisyUI) — soft dark gray-blue; Night (DaisyUI) — deep
navy dark mode; Darkly (Bootswatch) — classic dark charcoal; Cyborg
(Bootswatch) — high-contrast near-black; Superhero (Bootswatch) — dark
navy with red accent, high-contrast; Abyss (DaisyUI) — deep near-black
blue. (Slate, listed once above under Cool/tech minimal, is NOT
double-counted here.)

*Dark, vibrant/expressive (6)*: Dracula (DaisyUI + community) — one of
GitHub's most-starred color schemes, purple/pink-on-dark; Synthwave
(DaisyUI) — neon pink/purple retro-futurist; Cyberpunk (DaisyUI) — neon
yellow/magenta high-energy; Tokyo Night (community, GitHub-popular) —
cool blue-purple neon-on-dark; Halloween (DaisyUI) — orange/black
seasonal-vibrant; Luxury (DaisyUI) — dark gold/black premium.

*Distinctive/characterful (4)*: Retro (DaisyUI) — warm muted 70s
palette; Coffee (DaisyUI) — warm deep brown; Rose Pine (community,
GitHub-popular) — muted rose/dusk pastel-on-dark; Catppuccin (community,
GitHub-popular, one of the most-adopted developer-tool palettes in
recent years) — soft pastel-on-dark, four sub-variants in the original
but represented here as one curated entry.

That's 42 distinct themes (8 light professional + 6 warm/organic light +
5 nature/earth + 6 cool/tech minimal + 7 dark moody/professional + 6
dark vibrant/expressive + 4 distinctive/characterful = 42), each with a
real source and a distinct mood direction rather than a hue rotation of
the same structure (spec.md FR-009's requirement) — comfortably clearing
the 40+ requirement with a 2-theme margin.

**Alternatives considered**: Generating 40 palettes algorithmically by
rotating a single base hue by `360/40` degrees — explicitly rejected;
this is precisely the "looks AI-generated" failure mode the original
request called out. Real, named, independently-recognized references are
used instead, matching how DaisyUI/Bootswatch themselves are each
individually curated by named contributors, not generated.

## R4. Gallery/preview mechanism

**Decision**: The theme gallery page renders one shared preview region
containing a representative sample of already-shipped components
(Button, Badge, Card, Alert — matching the same representative set this
project's own `dashboard-example`/`settings-example` composed pages
already use). Selecting a theme card sets `data-theme` on that preview
region's container (or `<html>`, matching the real activation mechanism)
— confirmed via R1's proof-of-concept that this requires no reload and
no markup change. Each theme's own gallery card additionally shows a
small always-visible color-swatch strip (the theme's brand/neutral/
status colors) so all 42 are scannable at a glance without switching the
live preview 42 times.

## R5. Persistence mechanism

**Decision**: `localStorage`, key `pds-theme` (namespaced to avoid
collision, matching this project's existing convention of namespacing
nothing so far since no other feature has used `localStorage` yet — this
is the first). On page load, a small inline-module script (not an inline
`style`/`script` attribute — a real `<script type="module" src="...">`
tag, CSP-compliant per this project's existing pattern) reads the stored
value, validates it against the actual known theme-name list (not just
"is it a non-empty string"), and applies `data-theme` before first
paint if valid; falls back to the one designated default theme
("light", DaisyUI's own naming, this catalog's existing single shipped
palette) for a missing, corrupted, or unrecognized value — satisfying
spec.md FR-006's fallback requirement structurally rather than per-theme.

## Testing strategy

Given this feature's fundamentally different shape (not "does this one
new component work" but "does switching themes correctly restyle every
existing component, and does every theme clear the contrast bar"):

1. **Contrast**: a single parametrized script run (R2) covering all 42
   themes' `PAIRINGS`/`RING_PAIRINGS` — one command, not 42 manual
   verifications.
2. **Cross-component restyle correctness**: rather than re-testing every
   one of the ~48 existing components under all 42 themes (a
   combinatorial explosion with near-zero marginal signal once the
   mechanism itself is proven, per R1), a SMALL representative sample
   (Button, Badge, Card, Alert, TextInput — covering solid-fill,
   tint+ring, border-surface, and form-control patterns) is
   Playwright-verified under a FEW representative themes (the shipped
   default, one light, one dark, one high-contrast-adjacent) to confirm
   the mechanism generalizes, rather than exhaustively re-testing
   components whose own CSS is provably unmodified (R1's zero-markup-
   change finding is exactly why exhaustive re-testing isn't needed —
   the component CSS is identical across all themes, only the custom
   property VALUES the browser resolves differ).
3. **Persistence**: real `localStorage` set/reload/corrupt-value
   Playwright assertions (matching this project's established
   discipline for behavior verification via real simulation, not
   assumption).
4. Visual regression baselines are captured for the gallery page itself
   and the representative-sample-under-representative-themes matrix
   from point 2, NOT for all 48 components × 42 themes (1,764 screenshots
   — an unreasonable scale with near-zero marginal signal over the
   representative sample, given R1's mechanism guarantee).

## Scale/Scope batching decision

Given the sheer scope, implementation (a future `/speckit-tasks` +
`/speckit-implement` pass, not this planning pass) MUST be sequenced,
matching every prior multi-item feature's (014/015/016) priority-tier
approach:

- **P1 (MVP)**: the architecture itself — migrate `shared/design-
  tokens.ts`/`tailwind.config.ts` to the CSS-custom-property mechanism
  (R1), extend `check-contrast.mjs` for per-theme parametrized runs
  (R2), ship the CURRENT single existing palette as the "light" default
  theme under the new mechanism (zero visual change for existing users
  — a pure refactor, verified via the existing visual regression
  baselines staying byte-identical), plus 4-5 first NEW themes
  (one from each mood family in R3) as the initial proof that the full
  pipeline — architecture + contrast audit + gallery + persistence —
  works end to end for real, additional themes, not just the
  default.
- **P2-P4**: the remaining ~37 themes, generated in batches of ~10-12
  (matching this project's own established per-feature batch size from
  014/015/016), each batch re-running the same parametrized contrast
  audit (R2) and a lighter representative-sample visual check (not a
  full 48-component re-verification per batch, per the testing strategy
  above).
- This batching is an implementation-SEQUENCING decision, not a
  reduction of the 40+ requirement itself — all batches ship within this
  same feature's scope.
