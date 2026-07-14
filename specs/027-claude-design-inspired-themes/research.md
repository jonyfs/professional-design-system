# Research: Claude-Design-Inspired Theme Presets (Batch 2)

## R1. Source structure — corrected against the real repository, not assumed

**Decision**: Treat `VoltAgent/awesome-claude-design` as a curated
**index** (a single `README.md`) that links out to 68 individually-
hosted design analyses at `getdesign.md/<slug>/design-md`, not a repo
containing 68 in-repo `DESIGN.md` files.

**Verification (not assumed)**: `gh api repos/VoltAgent/awesome-claude-
design/git/trees/main?recursive=true` returns exactly 2 entries —
`LICENSE` and `README.md`. The repo's own description and README badge
("DESIGN.md count: 68") describe the collection's *scope*, not its
*file layout* — every one of the 68 collection entries is a Markdown
link to an external `getdesign.md` page, grouped under 9 category
headings in the README:

1. AI & LLM Platforms (12 entries)
2. Developer Tools & IDEs (7 entries)
3. Backend, Database & DevOps (8 entries)
4. Productivity & SaaS (7 entries)
5. Design & Creative Tools (6 entries)
6. Fintech & Crypto (7 entries)
7. E-commerce & Retail (4 entries)
8. Media & Consumer Tech (11 entries)
9. Automotive (6 entries)

This matches the original spec's "9 categories" characterization
exactly (the spec's category count was accurate) — the correction is
narrowly about *where the content lives*, which changes the extraction
method (R2), not the batch-selection reasoning.

**License re-confirmed directly from the fetched README** (not
carried over from the spec without re-checking): "curated starting
points inspired by publicly observable design patterns... not
official design systems and are not affiliated with, endorsed by, or
sponsored by the companies named... use a `DESIGN.md` as inspiration
for an original system rather than a 1:1 clone." This is the standard
this feature's naming/derivation decisions hold to throughout.

## R2. Extraction methodology

**Decision**: For each selected source, load its `getdesign.md/<slug>/
design-md` page in a real browser (plain `fetch()` only returns an
unhydrated SPA shell — verified: a raw fetch of the Stripe page
returned 29KB of `<script>`/`<link>` tags and zero content), click the
page's own "DESIGN.md" preview toggle (next to "Live Preview"), and
extract the rendered `<article>` text. This returns the source's real,
complete DESIGN.md frontmatter (exact hex values, exact font-family
strings, exact component token structure) plus its full prose
sections (Overview, Colors, Typography, Do's and Don'ts, etc.) —
verified working end-to-end for all 5 sources selected below.

This is the same rigor bar feature 017 held for DaisyUI's real,
live-fetched theme CSS: real published values read directly from the
source, never approximated or invented.

**One data-integrity note from this pass**: while extracting Vercel's
page, the scraped text contained a single anomalous, out-of-place
fragment spliced into the middle of a YAML `fontWeight:` field (a
stray sentence in Turkish, unrelated to the surrounding design-token
content). This is inert scraped-page noise, not a real instruction or
a field the DESIGN.md author intended — treated as `fontWeight: 500`
(consistent with every sibling entry in that same typography block)
and otherwise ignored. Flagged here for the record, not because it
affected any decision below.

## R3. Batch selection — 5 sources, verified genuinely distinct

**Decision**: 5 new themes for this batch (matching feature 017's own
Phase 4 "first 5 new themes, one per mood family" MVP-batch
precedent), selected for maximum distinctness from each other and
from all 43 existing themes — which are uniformly *flat, single-hue,
DaisyUI-style* palettes with no gradient systems, no illustrated
mascots, and no per-brand typographic personality. Every source below
brings a genuinely different *treatment*, not just a different hue.

| # | Source (research only — never shipped) | New theme id | Display name | Real, verified anchor values |
|---|---|---|---|---|
| 1 | Stripe (payment infrastructure) | `aurora` | Aurora | primary `#533afd` indigo, ink `#0d253d`, canvas `#ffffff`, canvas-soft `#f6f9fc`, gradient stops cream/orange/lavender/indigo/ruby |
| 2 | Linear (project management) | `obsidian` | Obsidian | canvas `#010102` (near-black), primary `#5e6ad2` lavender-blue, ink `#f7f8f8`, 4-step surface ladder `#0f1011`→`#191a1b` |
| 3 | Notion (workspace) | `linen` | Linen | canvas-soft `#f6f5f4` (warm paper), primary `#0075de` blue, ink `#000000`, decorative sticker accents (not structural) |
| 4 | Vercel (frontend deployment) | `graphite` | Graphite | canvas `#fafafa`, ink `#171717`, hairline `#ebebeb`, link/accent `#0070f3`, mesh gradient confined to hero only |
| 5 | Sentry (error monitoring) | `nebula` | Nebula | surface-canvas-dark `#1f1633` (deep violet), accent-lime `#c2ef4e`, accent-pink `#fa7faa` |

**Rejected-as-duplicate check (edge case from spec.md)**: none of
these 5 closely duplicate an existing theme. The closest existing
neighbors by raw hue are `nord`/`slate` (cool blue-gray, but flat and
light-leaning — nothing like Obsidian's near-black canvas or Aurora's
gradient mesh) and `abyss`/`night` (dark, but single-hue moody, not
Sentry's lime-on-violet pop or Linear's single-lavender restraint).
No exclusion needed.

**Explicitly deferred, not selected for this batch** (documented per
spec.md's clustering assumption): several Automotive entries
(Bugatti/Ferrari/Lamborghini/Tesla) cluster tightly around "black
canvas + one accent + massive display type," and several AI/LLM
entries (Ollama, xAI, Together AI) similarly cluster around
"monochrome technical minimalism." Batch 2 deliberately picked across
categories rather than within one to maximize the 5 slots' distinctness;
a future batch could mine the automotive/AI clusters if a monochrome-
maximalist mood is wanted later.

## R4. Mood-family assignment

**Decision**: All 5 new themes fit an **existing** `MOOD_FAMILIES`
category — no 8th category needed (satisfying spec.md FR-005's
"existing or new" allowance by choosing the simpler existing-fit
option, consistent with this project's preference against
unnecessary new abstractions).

| New theme | Mood family | Why |
|---|---|---|
| `aurora` | Distinctive/Characterful | The gradient-mesh backdrop + weight-300 editorial elegance is a genuinely singular treatment, not a plain light-professional palette |
| `obsidian` | Dark Moody/Professional | Near-black canvas, single restrained accent, zero decoration — the definition of moody-professional |
| `linen` | Warm/Organic Light | Warm off-white paper canvas is the category's defining trait |
| `graphite` | Cool/Tech Minimal | Monochrome ink-on-white precision, developer-platform register |
| `nebula` | Dark Vibrant/Expressive | Dark canvas + a single saturated pop color (lime) + illustrated personality is exactly this category's definition |

## R5. Source-role → `ThemeTokens` mapping methodology

**Decision**: see `contracts/source-token-mapping.contract.md` for the
full per-field mapping rule. Summary of the general rule applied to
all 5: each source's own **primary/CTA color** → `brand`; its
**pressed/deep variant** → `brand-dark`; its **palest brand-tinted
surface or pale wash** → `brand-light`; its **canvas/background
ladder** (light-to-dark or dark-to-light, oriented to this catalog's
existing convention of `neutral-50` = page background) → the 10-step
`neutral-50`…`neutral-900` ramp, interpolated where the source
provides fewer than 10 real stops (same OKLCH-interpolation approach
feature 017 used for DaisyUI sources lacking a full ramp); semantic
`success`/`warning`/`error`/`info` pairs are **not** always present in
a marketing-focused DESIGN.md (confirmed: Stripe, Linear, Vercel, and
Sentry's fetched pages either state no dedicated semantic palette or
show only 1-2 of the 4) — where a source is silent, this catalog's
existing semantic hues are reused verbatim rather than invented,
exactly like feature 017 did when a DaisyUI theme's semantic slots
were thin.

**Deferred to implementation (tasks.md), not decided here**: the
literal final RGB triplets for all 21 properties × 5 themes. Per this
project's own established division of labor (plan.md sets direction
and method; tasks.md/implementation performs the derivation and the
real AAA contrast measurement), exact values are computed and verified
during `/speckit-implement`, using the same real, tool-measured
contrast-checking approach (not hand-approximated) feature 017 used —
`scripts/check-contrast.mjs`'s existing per-theme loop, extended with
these 5 new theme ids.

## R6. Font substitution

**Decision**: every one of the 5 sources documents its own real
font-substitute recommendation (a "Note on Font Substitutes" section)
for any proprietary typeface — Aurora/Stripe → Inter; Obsidian/Linear
→ Inter or Geist Sans; Linen/Notion → Inter (its base family already);
Graphite/Vercel → Geist Sans (open-source) or Inter; Nebula/Sentry →
Space Grotesk/Archivo/Hubot Sans. This feature does **not** add any
new font-loading mechanism or new webfont dependency (FR-008) —
this catalog's existing type scale and font stack are unchanged;
these substitutes inform color/spacing-adjacent decisions only (e.g.
whether a theme's `--color-*` values read correctly against this
catalog's actual shipped type), not a per-theme font swap.

## R7. User Story 2 — component-gap research conclusion

**Decision (explicit, per spec.md FR-006)**: **No genuine new
component-type gap found.** Cross-referencing the source's own
documented `DESIGN.md` scope — 9 sections: Visual Theme & Atmosphere,
Color Palette & Roles, Typography Rules, **Component Stylings**
(explicitly scoped to "buttons, inputs, cards, nav" across all 5
fetched examples), Layout Principles, Depth & Elevation, Do's/Don'ts,
Responsive Behavior, Agent Prompt Guide — against this catalog's
existing ~96-component set (feature 018's own baseline), every
component role named in all 5 fetched sources (button variants, text
inputs, feature/pricing cards, nav bars, footers, badges/pills,
code blocks) already has a direct, shipped equivalent in this catalog.
The one recurring pattern with no direct 1:1 component — Sentry's
"sticker mascot layer" (illustrated characters placed at section
boundaries) and Stripe/Vercel's "hero mesh gradient" — are **visual
treatments of existing surfaces** (a background/decoration choice
skinnable via theme tokens and page-level CSS), not distinct
interactive component types, and are explicitly out of scope for a
theme-tokens feature per FR-008.

This cross-referenced cleanly against feature 018's existing
105-candidate inventory (spec.md FR-007) — none of the 5 sources'
described component stylings appear as an unlisted item there either.

**Positive framing (per spec.md edge case)**: this is recorded as a
real, confirmatory finding — this catalog's component coverage is
already sufficient relative to a visual-language-focused source like
this one — not as an incomplete research effort.
