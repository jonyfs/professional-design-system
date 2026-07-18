# Implementation Plan: Configurable Social Login Buttons

**Branch**: `035-social-login-buttons` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/035-social-login-buttons/spec.md`

## Summary

Ship a single configurable `SocialLoginGroup` component: an ordered
array of provider entries (5 brand-governed presets — Google, Apple,
Facebook, Microsoft, GitHub — plus a caller-supplied custom-entry
mechanism for any other provider) renders as a set of real, focusable
buttons that fire a selection callback and perform no auth logic of
their own. The one genuinely hard technical problem — provider brand
colors vs. this catalog's non-negotiable WCAG AAA mandate — is resolved
by confining brand color to the icon glyph and keeping every button's
surface on this catalog's existing AAA-verified neutral-50/neutral-900
pairing by default, rather than the solid brand-color fills that fail
AAA (Facebook's blue: ~4.24:1; a representative custom color like
Instagram's magenta: ~4.3-4.8:1 against either black or white). Apple
and GitHub's own black/near-black or pure-white brand fills are the
only ones extreme enough to stay AAA-safe on their own, so those two
presets may optionally render their real monochrome fill instead.

## Technical Context

**Language/Version**: TypeScript 5.x / vanilla JS, matching this
catalog's existing stack

**Primary Dependencies**: None new — no icon package exists anywhere in
this catalog (every icon in every existing component is hand-authored
inline SVG); the 5 preset brand marks and example custom-provider
glyphs (Instagram, TikTok) follow the same convention, sourced from
each provider's own published brand/press assets

**Storage**: N/A — fully caller-controlled, stateless component

**Testing**: Playwright (visual + a11y across all 6 browser/viewport
projects), `npm run audit:tokens`/`audit:contrast`, matching every
prior feature's convention

**Target Platform**: Static HTML site + React package, both surfaces

**Project Type**: Web design system (dual-surface), existing structure
unchanged

**Performance Goals**: N/A — static render, no continuous loops, no
network activity of the component's own (FR-003)

**Constraints**: FR-006 (Apple/Google presets structurally cannot
accept a color-override prop) — FR-008 (every button is a real
focusable native `<button>`, including in compact/icon-only mode) —
FR-003 (zero network/OAuth calls; the component is presentation +
callback only)

**Scale/Scope**: 1 new composite component (`SocialLoginGroup`, 1 entry
point) covering 5 built-in provider presets plus an open-ended custom-
entry mechanism (spec.md SC-004: at least 8 working example
configurations shipped in the catalog)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle II (WCAG 2.2 AAA, NON-NEGOTIABLE)**: PASS, via a
  deliberate design decision (research.md R1) — every preset and every
  custom entry defaults to this catalog's existing AAA-verified
  neutral-50-background/neutral-900-text pairing, with the provider's
  brand color confined to the icon mark rather than the button's fill.
  This was not assumed safe; the alternative (solid brand-color fills)
  was computed via the WCAG relative-luminance formula and found to
  fail AAA (Facebook ~4.24:1; a representative custom color like
  Instagram's magenta ~4.3-4.8:1 against either black or white text) —
  see research.md R1 for the full computation. Apple/GitHub's own
  black/near-black/white fills remain an allowed optional alternate
  appearance for those two presets specifically, since text against
  those extremes clears AAA at roughly 17-21:1.
- **Principle III (Tailwind-Only Architecture)**: PASS — all new
  styling via `@apply`/Tailwind config, no parallel CSS file.
- **Principle IV (Design Token Discipline, NON-NEGOTIABLE)**:
  VIOLATION requiring justification — see Complexity Tracking below.
  Provider brand colors (Google/Facebook/Microsoft/GitHub icon marks,
  Apple's monochrome fill, example custom-provider glyph colors) are
  externally mandated, fixed identifiers that must render identically
  regardless of the host app's selected theme — they cannot be woven
  into this catalog's 21-token, 42-theme-reactive semantic palette
  without breaking the mandate (Google's "G" must stay Google's actual
  colors even when the app is running the "dracula" theme).
- **Principle V (Interactive State Completeness, NON-NEGOTIABLE)**:
  PASS — every provider button declares `hover:`/`active:`/
  `focus-visible:`/`disabled:` per this catalog's standard Button/
  ActionIcon convention (research.md R6).
- **Dual-surface shipping convention**: PASS — static HTML + React,
  per this catalog's convention for every component. The static
  surface ships fixed, concrete example configurations (it has no
  runtime configuration mechanism of its own, same as every other
  "configurable" static demo in this catalog); the React package ships
  the actual dynamic, caller-configurable API.
- **Single-mechanism reuse**: PARTIAL reuse, not a duplicate — the new
  provider-button class family reuses Button's height/padding/radius
  scale (research.md R6) but cannot reuse Button's existing `variant`
  prop (`primary`/`secondary` only), since no combination of those two
  expresses "5 distinct brand identities plus an open-ended custom
  one." This is new, justified surface, not a parallel implementation
  of something Button already does.
- **De-duplication verified, not assumed**: PASS — confirmed via a
  graphify query against feature 018's 105-candidate inventory before
  drafting the spec: no social-login/OAuth-button candidate exists
  there. This is a genuinely new pattern, requested directly by the
  user, outside that inventory's scope.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| New `providerBrand` color constants in `shared/design-tokens.ts`, deliberately OUTSIDE the `colors`/`REQUIRED_THEME_PROPERTIES`/`THEMES` re-theming system (Principle IV) | Provider brand identity (Google's 4-color "G", Facebook's blue, GitHub's near-black, Microsoft's 4-square palette) is externally mandated and must render the same regardless of which of this catalog's 42 curated themes the host app has selected — folding these into the swappable semantic palette would mean Google's own G-logo colors silently change when a consumer switches themes, which would itself violate the providers' own brand guidelines this feature exists to satisfy (spec.md FR-002) | Reusing an existing semantic token (e.g. `bg-brand`, `bg-info`) for a provider's mandated color was rejected outright: those tokens are themeable by design (that's their entire purpose elsewhere in this catalog) and none of their values equal any real provider's mandated color in the first place — this isn't a styling preference, it's a hard external constraint the tokens were never designed to carry. Precedent for this exact category of exception already exists in this constitution: `KNOWN_THEME_CONTRAST_GAPS` (curated-theme AAA exceptions) and `ICON_FILL_TEXT_TOKENS`/`DECORATIVE_ARIA_HIDDEN_TOKENS` (icon-fill exemptions) are both "documented, individually-named, reasoned exception" patterns for a different constraint class — this is the same governance shape applied to provider-brand-color fixedness. |

## Project Structure

### Documentation (this feature)

```text
specs/035-social-login-buttons/
├── plan.md              # This file
├── research.md          # Phase 0: AAA-vs-brand-color resolution, token placement, icon sourcing
├── data-model.md        # Phase 1: ProviderPreset / CustomProviderEntry / SocialLoginGroup shapes
├── contracts/
│   └── social-login-group.contract.md
├── quickstart.md        # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
shared/
└── design-tokens.ts             # + `providerBrand` fixed color constants (contracts/social-login-group.contract.md — refined during implementation from this sketch's original separate-file idea, since the constants are few and the existing per-package Tailwind configs already import this one file)

src/
├── styles/
│   └── tailwind.css            # New @apply blocks: .social-login-btn, .social-login-btn-icon, per-preset icon-accent classes
├── scripts/
│   └── social-login.js         # Vanilla init: wires each button's click/keyboard activation to a callback attribute, per-button loading/disabled toggling
└── components/
    └── social-login/social-login.html   # Fixed example configurations (5 presets + 3 example custom entries: Instagram, TikTok, Discord)

packages/react/src/
└── SocialLoginGroup/
    ├── SocialLoginGroup.tsx     # The configurable component (providers array, mode, onProviderSelect)
    └── providers.tsx            # Preset definitions with inline SVG icon components

tests/e2e/
└── social-login-buttons.spec.ts

tests/react-harness/
├── social-login-buttons.html
└── src/social-login-buttons-main.tsx
```

**Structure Decision**: Follows this catalog's existing per-component
convention. No `data:` URIs anywhere in this feature (all icons are
inline `<svg>`, not raster images), so the standard per-page CSP
template applies with no `img-src` variant needed — unlike Gallery/
Compare/BackgroundImage/Watermark in prior features.
