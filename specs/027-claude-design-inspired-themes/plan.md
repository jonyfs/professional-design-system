# Implementation Plan: Claude-Design-Inspired Theme Presets (Batch 2)

**Branch**: `027-claude-design-inspired-themes` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/027-claude-design-inspired-themes/spec.md`

## Summary

Add a curated batch of new theme presets to this catalog's existing
43-theme collection (feature 017's architecture — a fixed 21-token
`ThemeTokens` schema applied via `data-theme` attribute, zero new
mechanism), drawing aesthetic direction from 5 real, verified design
profiles in the `VoltAgent/awesome-claude-design` collection —
selected for genuine visual distinctness from each other and from all
43 existing themes. Each new theme is given a generic, mood-based name
(never the inspiring company's name) per the spec's resolved naming
decision. A secondary, confirmatory research pass checks whether the
source surfaces any component-catalog gap feature 018 missed
(expected conclusion: no material gap, since the source is a visual-
language collection, not a component inventory).

## Technical Context

**Language/Version**: TypeScript 5.x (design tokens), CSS custom
properties (theme values), vanilla JS (no framework change)

**Primary Dependencies**: None new — reuses feature 017's existing
`shared/design-tokens.ts` (`ThemeDefinition`/`ThemeTokens`/`THEMES`/
`MOOD_FAMILIES`), `src/styles/themes.css`, `packages/react/src/
styles.css`, `scripts/check-contrast.mjs` (`KNOWN_THEME_CONTRAST_GAPS`)

**Storage**: N/A — theme selection persists via existing
`localStorage` key `pds-theme` (feature 017), unchanged

**Testing**: Playwright (visual + contrast-audit verification per new
theme, extending feature 017/021's existing per-theme test pattern);
`scripts/check-contrast.mjs` (build-time contrast audit, parametrized
per-theme already)

**Target Platform**: Static HTML site (`src/`) + React package
(`packages/react/`) — both surfaces already theme-aware, no new
platform work

**Project Type**: Web design system (dual-surface: static HTML +
React), existing structure unchanged

**Performance Goals**: N/A — adding CSS custom-property blocks has no
measurable runtime cost distinct from feature 017's existing 43

**Constraints**: FR-008 (spec.md) — MUST NOT introduce any new npm
dependency, CSS/theming mechanism, or font-loading approach beyond
what feature 017 already established

**Scale/Scope**: 5 new `ThemeDefinition` entries (research.md R3),
bringing the collection from 43 to 48 themes; zero new components,
zero new pages beyond the existing Theme Gallery's automatic
enumeration of `THEMES`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle IV (Theming & Multi-Palette Architecture)**: PASS — this
  feature adds `ThemeDefinition` instances to the existing mechanism
  (`shared/design-tokens.ts`), introduces zero new theming
  infrastructure (FR-008), and every new theme MUST declare the full,
  fixed 21-property `ThemeTokens` schema — the same gate feature 017
  established and `scripts/check-contrast.mjs` already enforces
  per-theme.
- **Principle II (Accessibility, AAA where feasible)**: PASS with the
  same honesty convention feature 017 set — every new theme is
  measured against the existing AAA bar; any gap is recorded in the
  existing `KNOWN_THEME_CONTRAST_GAPS` structure, never silently
  shipped (FR-004).
- **Dual-surface shipping convention**: PASS — theme tokens are
  surface-agnostic CSS custom properties; both `src/` and
  `packages/react/` consume the same `themes.css`/`design-tokens.ts`
  source of truth already, so no per-surface duplication is introduced.
- **No new dependency/mechanism (FR-008)**: PASS — verified against
  research.md's methodology, which explicitly reuses feature 017's
  existing derivation/verification tooling rather than adding new
  scripts or libraries beyond one new one-time browser-research pass
  (not shipped code).
- **Trademark/attribution honesty**: PASS — spec.md's resolved naming
  decision (generic, mood-based names only) and this plan's
  research.md keep the source-company mapping as an internal research
  artifact (`.design-sync`-adjacent notes, not shipped code, comments,
  or user-facing text), matching the source collection's own license
  terms ("curated starting points... not official or endorsed").

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/027-claude-design-inspired-themes/
├── plan.md              # This file
├── research.md          # Phase 0: source methodology, 5-theme selection, mood-family/naming decisions, US2 gap conclusion
├── data-model.md         # Phase 1: reuses feature 017's Theme/ThemeCollection/UserThemeSelection entities
├── contracts/
│   └── source-token-mapping.contract.md  # Phase 1: how each real source's semantic roles map onto the fixed 21-token ThemeTokens schema
├── quickstart.md         # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
shared/
└── design-tokens.ts          # THEMES array — 5 new ThemeDefinition entries appended; MOOD_FAMILIES extended only if a genuinely new grouping is needed (research.md R4)

src/
└── styles/
    └── themes.css             # 5 new [data-theme="..."] blocks, 21 properties each (existing pattern, feature 017)

packages/react/
└── src/
    └── styles.css              # Same 5 new blocks mirrored (existing dual-surface convention)

scripts/
└── check-contrast.mjs         # No code change — KNOWN_THEME_CONTRAST_GAPS gains entries only if a new theme has a documented gap (existing structure, feature 017)

tests/e2e/
└── theme-architecture.spec.ts # Extended with the 5 new theme ids (existing per-theme test pattern, feature 017/021)
```

**Structure Decision**: Pure data-layer addition to feature 017's
existing architecture — no new directories, no new build steps, no new
test files beyond extending the existing per-theme-parametrized
suites. This mirrors feature 017's own batch-phased delivery (Phase
4-7 in its tasks.md each added themes to the same files).

## Complexity Tracking

*No violations — this section is intentionally empty.*
