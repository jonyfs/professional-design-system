# Phase 0 Research: Configurable Social Login Buttons

## R1: Solid brand-color fill vs. neutral surface + colored icon mark

**Decision**: Every provider button — every built-in preset AND every
custom entry — defaults to this catalog's existing AAA-verified
neutral surface (`neutral-50` background, `neutral-900` text/border),
with the provider's brand color confined to the icon glyph only. Apple
and GitHub's own presets MAY optionally render their real brand-
mandated monochrome fill (Apple: black / white / white-with-outline;
GitHub: near-black or white) as an alternate `appearance`, since text
against those two extremes clears AAA by a wide margin regardless.

**Rationale**: computed directly via the WCAG relative-luminance
formula (`L = 0.2126R + 0.7152G + 0.0722B` on linearized channels;
contrast = `(L_lighter + 0.05) / (L_darker + 0.05)`), not assumed:

| Treatment | Computed contrast | Clears AAA (7:1)? | Clears AA (4.5:1)? |
|---|---|---|---|
| Facebook official blue `#1877F2` bg + white text | **4.24:1** | ❌ No | ❌ No (barely) |
| A representative custom brand color — Instagram magenta `#E1306C` bg + white text | **4.34:1** | ❌ No | ❌ No |
| Instagram magenta `#E1306C` bg + black text | **4.84:1** | ❌ No | ✅ Yes (barely) |
| Google's recommended neutral button — white bg + dark-gray text `#3C4043` | **10.46:1** | ✅ Yes | ✅ Yes |
| GitHub dark bg `#24292E` + white text | **~17.2:1** | ✅ Yes | ✅ Yes |
| Apple black bg + white text (or white bg + black text) | **~21:1** | ✅ Yes | ✅ Yes |

The pattern is consistent: any mid-luminance brand color (the common
case — vivid blues, pinks, purples most identity providers use) fails
this catalog's non-negotiable Principle II bar when used as a solid
fill with either black or white text, because no text color choice can
rescue a background whose own luminance sits in the ~0.15–0.4 range.
Only colors at the true extremes (pure black, near-black, pure white,
or a provider's own light/neutral alternate) are safe as a fill. Since
FR-004 requires the custom-entry mechanism to accept *any* caller-
supplied brand color — not a pre-vetted list — a per-color contrast
computation at render time would be needed to guarantee AAA under the
fill approach, and some colors would still have no safe text-color
solution at all (see Instagram row above: both black and white text
fail AAA against it).

Confining brand color to the icon mark sidesteps the entire problem:
the button surface is always the same pre-verified neutral-50/
neutral-900 pairing used throughout this catalog (Card, List, and
others), so AAA is guaranteed by construction for every preset and
every custom entry, regardless of which color a caller supplies. This
also matches how Google, Microsoft, and GitHub's own official button
kits actually present their *recommended* (not solid-fill) button
style — a light/neutral surface with a full-color or monochrome
logotype — so the design decision converges with each provider's own
best-practice guidance, not just this catalog's constraint.

**Alternatives considered**:
- *Solid brand-color fill, always* — rejected per the computation
  above; fails this catalog's non-negotiable AAA bar for the two
  presets with the least extreme brand colors (Facebook, and by
  extension any custom entry using a similarly mid-luminance color).
- *Runtime per-color contrast computation choosing black or white text
  for custom entries* — rejected as the DEFAULT because, as shown, some
  real brand colors (Instagram) have no AAA-safe text color against
  them at all; a "best effort, may not reach AAA" fallback would be a
  silent, unverifiable accessibility gap for exactly the providers
  (Instagram, TikTok) the spec's User Story 3 exists to support well.
- *Always fall back to the neutral surface with no color at all* —
  rejected: it satisfies AAA trivially but defeats the actual purpose
  (User Story 3 explicitly wants a provider to look "at home," i.e.
  visually identifiable, next to the mandated presets).

## R2: Where fixed provider-brand colors live in the token architecture

**Decision**: add a new, explicitly non-theme-reactive
`providerBrand` export to `shared/design-tokens.ts`, kept structurally
separate from the existing `colors` export and NOT added to
`REQUIRED_THEME_PROPERTIES` or any `ThemeTokens`/`THEMES` entry. It is
consumed via a small dedicated Tailwind color namespace (e.g.
`provider.google`, `provider.facebook`, `provider.apple`,
`provider.microsoft`, `provider.github`) wired to literal hex values,
not `rgb(var(--color-x) / <alpha-value>)` — the mechanism every other
color in this file uses specifically so it CAN swap per `[data-theme]`.

**Rationale**: this catalog's entire palette exists to be swappable
(feature 017's 42-curated-theme architecture) — that is the explicit
purpose of every existing token. Provider brand colors are the
opposite: Google's logo must render with Google's actual mandated
colors even when the host app is running, say, the "dracula" theme —
re-theming it would itself violate the provider guideline this feature
exists to satisfy (spec.md FR-002). This is a new category of design
constant, not a gap in the existing one. This constitution already
has precedent for a documented, individually-named, reasoned exception
of exactly this shape applied to a *different* constraint (curated-
theme AAA gaps → `KNOWN_THEME_CONTRAST_GAPS`; icon-fill AAA exemptions
→ `ICON_FILL_TEXT_TOKENS`/`DECORATIVE_ARIA_HIDDEN_TOKENS`) — this
follows the same governance shape (Complexity Tracking in plan.md).

**Alternatives considered**:
- *Add provider colors as a 22nd+ semantic token, themed per curated
  theme like everything else* — rejected: nonsensical for a brand
  mandate (there is no "Google blue for the Nord theme"; there is only
  Google's actual blue).
- *Inline hardcoded hex directly in component/preview markup, no token
  at all* — rejected: violates Principle IV's spirit even though these
  aren't swappable — a single named source of truth is still required
  so the 5 preset colors aren't hand-retyped in both the static HTML
  and React surfaces and silently drift.

## R3: Icon sourcing

**Decision**: hand-authored inline SVG for all 5 built-in preset marks
(Google, Apple, Facebook, Microsoft, GitHub) and the example custom
entries (Instagram, TikTok, Discord), traced from each provider's own
published brand/press-kit assets. No icon package dependency is added.

**Rationale**: this catalog has no icon library dependency anywhere —
every existing icon (ActionIcon consumers, Gallery's close glyph,
CommandPalette, etc.) is a hand-authored inline `<svg>`. Introducing an
icon package for 8 marks would be a new dependency for a need this
catalog has never needed a dependency for.

## R4: Contrast-audit coverage for the new fixed pairing

**Decision**: no new audit-script plumbing is required.
`scripts/check-contrast.mjs`'s per-theme loop only sweeps
`REQUIRED_THEME_PROPERTIES`/`THEMES` pairings by design — this
feature's actual TEXT/BACKGROUND pairing (neutral-50/neutral-900) is
already part of that existing, continuously-audited semantic set, so
it's covered for free. The `providerBrand` constants themselves never
appear as a text/background pairing (brand color is confined to icon
fill, per R1), so there is no new pairing for the audit loop to miss.
Apple/GitHub's optional monochrome-fill alternate uses literal `#000`/
`#FFF` extremes whose contrast (~21:1/~17:1) cannot realistically
regress, so a one-time analytical verification here (R1's table) is
sufficient — no dedicated ongoing check is warranted for a value that
cannot drift (it isn't theme-driven, isn't computed, and isn't user-
configurable).

## R5: Custom-entry accent application (CSP-safe)

**Decision**: a custom entry's caller-supplied `color` styles ONLY a
small accent (a colored circular backing behind a monochrome icon
glyph, matching how this catalog already renders single-color icon
accents elsewhere) via React's `style={{ backgroundColor: color }}`
prop — never the button's own background or text color, and never a
literal HTML `style="..."` attribute.

**Rationale**: this project's CSP (`style-src 'self'`) blocks literal
inline `style="..."` attributes, but React's `style={{...}}` prop
compiles to a direct DOM property assignment at runtime, not an HTML
attribute — an established, already-documented exception on the React
surface specifically (Password Strength Meter, feature 029; Compare,
feature 034). The static HTML surface never needs this at all (R7):
its example custom entries use fixed, build-time `@apply` classes for
their (fixed, known-in-advance) example colors.

## R6: Button shape and layout modes

**Decision**: reuse Button's existing height/padding/border-radius
scale (so a `SocialLoginGroup` visually belongs next to a real
`<Button>` on the same screen) via a new `.social-login-btn` class
family, since Button's own `variant` prop (`primary`/`secondary` only)
cannot express 5 distinct preset identities plus an open custom one.
Two layout modes: `stacked` (one full-width button per row, icon +
label) and `compact` (icon-forward, visually-hidden label promoted to
`aria-label` per FR-008). Every provider button declares the same
`hover:`/`active:`/`focus-visible:`/`disabled:` state set this
catalog's Principle V requires for every interactive element.

## R7: Static HTML surface and the custom-entry mechanism

**Decision**: the static HTML demo (`social-login.html`) ships a fixed,
concrete example configuration — all 5 presets plus 3 example custom
entries (Instagram, TikTok, Discord) — authored directly in markup and
CSS at build time. It does not attempt to expose a live "pass in a
provider list" runtime API, because the static site has no such
mechanism anywhere else in this catalog either (every "configurable"
static demo in this catalog is a concrete illustration of the pattern;
real runtime configurability lives in the React component's props,
per the existing dual-surface convention). The React `SocialLoginGroup`
is where FR-001/FR-004's actual configurability lives.
