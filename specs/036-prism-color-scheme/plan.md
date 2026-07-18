# Implementation Plan: Prism Color Scheme (Synthesized Cross-Collection Theme)

**Branch**: `036-prism-color-scheme` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/036-prism-color-scheme/spec.md`

## Summary

Add exactly one new theme, `prism`, to this catalog's existing
48-theme collection (feature 017's architecture — a fixed 21-token
`ThemeTokens` schema applied via `data-theme` attribute, zero new
mechanism). Unlike feature 017/027 (one theme *per* source), Prism
synthesizes ONE new palette from a representative, cross-category
sample of 7 real sites in the `VoltAgent/awesome-design-md` collection
(research.md R1-R2), using circular-mean hue averaging for the accent
color (R3) and linear-RGB averaging for the semantic roles (R4) — real
math over real fetched hex values, not an invented palette.

## Technical Context

**Language/Version**: TypeScript 5.x (design tokens), CSS custom
properties (theme values), vanilla JS (no framework change)

**Primary Dependencies**: None new — reuses feature 017's existing
`shared/design-tokens.ts` (`ThemeDefinition`/`ThemeTokens`/`THEMES`/
`MOOD_FAMILIES`), `src/styles/themes.css`, `packages/react/src/
styles.css`, `scripts/check-contrast.mjs` (`KNOWN_THEME_CONTRAST_GAPS`)

**Storage**: N/A — theme selection persists via existing
`localStorage` key `pds-theme` (feature 017), unchanged

**Testing**: Playwright (existing per-theme visual/contrast pattern,
feature 017/021); `scripts/check-contrast.mjs` and
`scripts/audit-tokens.mjs` (build-time audits, parametrized per-theme
already)

**Target Platform**: Static HTML site (`src/`) + React package
(`packages/react/`) — both surfaces already theme-aware, no new
platform work

**Project Type**: Web design system (dual-surface: static HTML +
React), existing structure unchanged

**Performance Goals**: N/A — adding one CSS custom-property block has
no measurable runtime cost distinct from feature 017's existing 48

**Constraints**: FR-001/FR-004 (spec.md) — MUST NOT introduce any new
npm dependency, CSS/theming mechanism, or font-loading approach beyond
what feature 017 already established; exactly one new theme, not a
batch

**Scale/Scope**: 1 new `ThemeDefinition` entry (research.md), bringing
the collection from 48 to 49 themes; zero new components, zero new
pages beyond the existing Theme Gallery's automatic enumeration of
`THEMES`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle IV (Theming & Multi-Palette Architecture)**: PASS — adds
  one `ThemeDefinition` instance to the existing mechanism
  (`shared/design-tokens.ts`), introduces zero new theming
  infrastructure, and declares the full, fixed 21-property
  `ThemeTokens` schema — the same gate feature 017 established and
  `scripts/check-contrast.mjs` already enforces per-theme.
- **Principle II (Accessibility, AAA where feasible)**: PASS with the
  same honesty convention feature 017/027 set — Prism is measured
  against the existing AAA bar; any gap is recorded in the existing
  `KNOWN_THEME_CONTRAST_GAPS` structure, never silently shipped
  (spec.md FR-005).
- **Dual-surface shipping convention**: PASS — theme tokens are
  surface-agnostic CSS custom properties; both `src/` and
  `packages/react/` consume the same `themes.css`/`design-tokens.ts`
  source of truth already, so no per-surface duplication is introduced
  beyond the existing verbatim-duplication convention.
- **No new dependency/mechanism**: PASS — research.md's methodology
  reuses feature 017's existing derivation/verification tooling; the
  only new work is a one-time browser-research pass (not shipped
  code) plus real arithmetic (hue-circular-mean, RGB-linear-mean)
  documented in research.md, not a new script or library.
- **Trademark/attribution honesty**: PASS — Prism's name and every
  user-facing description name a distilled aesthetic concept only
  (spec.md FR-003); the 7 sampled companies are cited as research
  provenance in `research.md`/`sourceReference`, never as the shipped
  theme's name or marketing claim, consistent with the source
  collection's own license terms.

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/036-prism-color-scheme/
├── plan.md              # This file
├── research.md          # Phase 0: 7-site real sample, hue/RGB-averaging math, neutral/semantic derivation, naming
├── data-model.md         # Phase 1: reuses feature 017's ThemeDefinition/ThemeTokens entities — one new entry
├── contracts/
│   └── prism-token-derivation.contract.md  # Phase 1: synthesis derivation rule + verification gate
├── quickstart.md         # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
shared/
└── design-tokens.ts          # THEMES array — 1 new ThemeDefinition entry appended ("prism"); MOOD_FAMILIES unchanged (reuses existing "Light Professional")

src/
└── styles/
    └── themes.css             # 1 new [data-theme="prism"] block, 21 properties (existing pattern, feature 017)

packages/react/
└── src/
    └── styles.css              # Same block mirrored (existing dual-surface convention)

scripts/
└── check-contrast.mjs          # KNOWN_THEME_CONTRAST_GAPS extended only if Prism has genuine, documented gaps

index.html                      # Gallery hero stat count 114 → (no change; count reflects components, not themes — verified in research, themes are enumerated automatically from THEMES, no hardcoded count to bump)
```

## Complexity Tracking

*No entries — no constitutional violations to justify.*
