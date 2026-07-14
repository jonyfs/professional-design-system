# Contract: Source-Role → ThemeTokens Mapping

Reuses feature 017's `ThemeTokens` schema and `[data-theme="..."]`
CSS-custom-property mechanism verbatim (see `specs/017-curated-theme-
presets/contracts/theme-tokens.contract.md`) — this contract covers
only the NEW mapping step this batch introduces: translating each
real source's own semantic color roles (as extracted per research.md
R2) onto this catalog's fixed 21-property schema.

## General mapping rule

| This catalog's token | Source-role equivalent (typical DESIGN.md field name) |
|---|---|
| `brand` | The source's own documented "primary" / signature CTA color |
| `brand-dark` | The source's documented pressed/deep/press-state variant of primary |
| `brand-light` | The source's palest brand-tinted surface, subdued-hover wash, or (if absent) an OKLCH-lightened derivative of `brand` clearing this catalog's own AAA bar |
| `neutral-50` | The source's default page canvas/background |
| `neutral-900` | The source's primary ink/text-on-canvas color |
| `neutral-100`…`neutral-800` | OKLCH-interpolated between `neutral-50` and `neutral-900` (feature 017's existing eased-interpolation method for sources lacking a full 10-stop ramp), anchored to any REAL intermediate surface/hairline/ink-tier values the source does document (several sources document 3-4 real intermediate stops — e.g. Linear's 4-step surface ladder, Vercel's ink/body/mute/faint text ladder — used as real anchors, not just the two endpoints) |
| `success`/`success-strong` | Source's own semantic success color if documented; else this catalog's existing default reused verbatim (research.md R5 — most fetched sources don't define a full semantic set) |
| `warning`/`warning-strong` | Same rule as success |
| `error`/`error-strong` | Same rule as success |
| `info`/`info-strong` | Same rule as success — several sources' documented "link" color is a reasonable `info` anchor when present (e.g. Vercel's `{colors.link}` #0070f3, Sentry's focus-ring blue) |

## Per-theme anchor values (real, extracted — research.md R3)

### `aurora` (Stripe-derived)
- `brand` anchor: `#533afd` (indigo, the source's documented primary/CTA)
- `brand-dark` anchor: `#2e2b8c` (source's `primary-press`)
- `brand-light` anchor: `#b9b9f9` (source's `primary-bg-subdued-hover`)
- `neutral-50` anchor: `#ffffff` (source's `canvas`)
- `neutral-900` anchor: `#0d253d` (source's `ink`)
- Real intermediate anchors available: `#f6f9fc` (canvas-soft), `#e3e8ee` (hairline), `#64748d` (ink-mute)

### `obsidian` (Linear-derived)
- `brand` anchor: `#5e6ad2` (source's primary lavender-blue)
- `brand-dark` anchor: `#5e69d1` (source's `primary-focus`)
- `brand-light` anchor: `#828fff` (source's `primary-hover`, lightened further if AAA requires)
- `neutral-50` anchor: `#010102` (source's `canvas` — this is a DARK theme, so `neutral-50` inherits the existing dark-theme convention from feature 017: `neutral-50` = page/surface background regardless of light/dark polarity, per the ratified "Theme-invertible neutral scale" convention)
- `neutral-900` anchor: `#f7f8f8` (source's `ink`, light text on dark canvas)
- Real intermediate anchors available: 4-step surface ladder `#0f1011`/`#141516`/`#18191a`/`#191a1b`, hairlines `#23252a`/`#34343a`/`#3e3e44`, text ladder `#d0d6e0`/`#8a8f98`/`#62666d`

### `linen` (Notion-derived)
- `brand` anchor: `#0075de` (source's primary blue)
- `brand-dark` anchor: `#005bab` (source's `primary-active`)
- `brand-light` anchor: derived (OKLCH-lightened `#0075de`, no direct pale-brand wash documented — the sticker palette is explicitly decorative-only per research.md, not a valid `brand-light` source)
- `neutral-50` anchor: `#f6f5f4` (source's `canvas-soft`, the signature warm-paper page background — NOT `#ffffff`, which the source reserves for card surfaces one step up)
- `neutral-900` anchor: `#000000` (source's `ink`)
- Real intermediate anchors available: `#31302e` (ink-secondary), `#615d59` (ink-muted), `#a39e98` (ink-faint), `#e6e6e6` (hairline)

### `graphite` (Vercel-derived)
- `brand` anchor: `#0070f3` (source's `link`/accent blue — the closest documented "structural color" role, since Vercel's true primary is ink/black, already covered by `neutral-900`)
- `brand-dark` anchor: `#0761d1` (source's `link-deep`)
- `brand-light` anchor: `#d3e5ff` (source's `link-soft`)
- `neutral-50` anchor: `#fafafa` (source's `canvas`)
- `neutral-900` anchor: `#171717` (source's `ink`)
- Real intermediate anchors available: `#ffffff` (canvas-elevated), `#ebebeb`/`#f2f2f2` (hairlines), `#4d4d4d`/`#8f8f8f`/`#a1a1a1` (body/mute/faint text ladder)
- `error` anchor available: `#ee0000` (source's documented error); `warning` anchor available: `#f5a623`

### `nebula` (Sentry-derived)
- `brand` anchor: `#422082` (source's `accent-violet-deep`) — **corrected during implementation** from the contract's original pick of the source's literal primary `#150f23`: that near-black primary sits almost exactly as dark as this theme's own `neutral-50` (`#1f1633`), which would make `brand` text/borders/fills nearly invisible against the page background — the same dark-theme "brand token needs its own visible register, distinct from a literal same-polarity source anchor" issue feature 017 already documented and solved once for `forest`/`dracula` (its `brand-dark` correction note). `accent-violet-deep` is real, documented, and sits at a genuinely distinct lightness from `neutral-50`.
- `brand-dark`: derived (OKLCH-darkened `#422082` toward black), following the same correction — no real anchor darker than `accent-violet-deep` exists that isn't the too-close-to-canvas primary
- `brand-light` anchor: `#79628c` (source's `accent-violet-mid`, the closest pale/muted brand-family tone)
- `neutral-50` anchor: `#1f1633` (source's `surface-canvas-dark`, the dominant marketing/product-page canvas — the source's OWN light canvas `#ffffff` is reserved for a secondary transactional-page polarity, not the theme's base register, consistent with `obsidian`'s same "dark canvas = neutral-50" convention)
- `neutral-900` anchor: `#ffffff` (source's `on-primary`, the text-on-dark-canvas color)
- Real intermediate anchors available: `#150f23` (surface-night, one step deeper than canvas — used as a `neutral-100`-adjacent anchor), `#362d59` (hairline-violet)
- Signature accent carried through as decorative-only, NOT a `ThemeTokens` field: `accent-lime` `#c2ef4e` and `accent-pink` `#fa7faa` have no direct slot in the fixed 21-token schema (this catalog's schema has no "decorative accent" role) — consistent with FR-008 (no new theming mechanism), these do not get shipped as new CSS custom properties; the theme's brand/neutral/semantic tokens alone carry the mood.

## What this contract deliberately leaves to implementation

Exact RGB triplets for every one of the 21 properties × 5 themes,
the OKLCH interpolation math for `neutral-100`…`neutral-800`, and the
real, tool-measured (not hand-approximated) AAA contrast verification
via `scripts/check-contrast.mjs` — same division of labor as feature
017's own `theme-tokens.contract.md`, which explicitly left "exact
values" as "an implementation-phase task."

## Acceptance mapping

- FR-001, FR-003 → the anchor table above, realized as full 21-property
  `[data-theme="..."]` blocks during implementation
- FR-004, SC-003 → `scripts/check-contrast.mjs`'s existing per-theme
  loop, extended to include `aurora`/`obsidian`/`linen`/`graphite`/
  `nebula`
- FR-002, SC-005 → `sourceReference` field wording (data-model.md) —
  verified to never contain a company/brand name
