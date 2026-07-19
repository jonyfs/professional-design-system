# Implementation Plan: 2026 External Design-Trend Adoption

**Branch**: `045-2026-trend-adoption` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/045-2026-trend-adoption/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Of the 10 trends surveyed from the source article, 5 required no action (already met or out of scope) and 3 surfaced concrete, scoped work: (1) fix a real, previously-undiscovered defect — the `fontFamily.sans` token has claimed `["Inter", "system-ui", "sans-serif"]` since this project's first component, but no Inter font asset has ever actually been loaded, so every page silently renders in a system fallback font; (2) add OS dark-mode-preference detection (`prefers-color-scheme`) mirroring the existing `prefers-reduced-motion` hook, seeding the initial theme only when no manual choice is stored; (3) document two new style-direction options (Organic/Fluid, 3D/Immersive) in this project's own constitution, without retrofitting any existing component. A 4th item (dark-grey-not-pure-black) is a confirming audit — already satisfied per research, re-verified rather than fixed.

## Technical Context

**Language/Version**: TypeScript, HTML/CSS (Tailwind CSS v3), React (via `packages/react`); Node.js LTS

**Primary Dependencies**: Existing stack only — Tailwind CSS, Vite, `@playwright/test`; **new static asset**: a self-hosted Inter variable font file (`.woff2`, SIL Open Font License, no new npm/JS dependency)

**Storage**: N/A — theme preference already persists via existing localStorage mechanism (feature 025); this feature only adds a new initial-seed source, not new storage

**Testing**: Existing Playwright visual-regression suite (re-run/selectively re-baselined per research.md R2 for the font change), manual dev-tools verification for computed font-family and OS-preference seeding (quickstart.md)

**Target Platform**: Static site (Vite build) + GitHub Pages; `packages/react` workspace

**Project Type**: Web design-system monorepo (existing structure, no new workspaces)

**Performance Goals**: Zero regression in existing LCP/FCP targets (`rules/web/performance.md`) despite now actually loading a font asset that was previously (incorrectly) never loaded

**Constraints**: FR-002 (no performance regression), FR-003 (fix any component that accidentally depended on the broken fallback font's metrics), FR-004 (manual theme choice always wins over OS preference), FR-007 (zero existing components retrofitted to the two new style directions)

**Scale/Scope**: One font asset + `@font-face` rule, one new React hook (~15 lines, mirroring `usePrefersReducedMotion`), one small integration point in the existing theme-persistence logic, one constitution documentation addition, a targeted visual-regression re-check (not a full-catalog change)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Cognitive Ergonomics)**: PASS. Unaffected — no layout/hierarchy changes.
- **Principle II (WCAG 2.2 AAA, NON-NEGOTIABLE)**: PASS. The font swap doesn't change color/contrast tokens; OS dark-mode seeding still routes through the same already-AAA-audited curated themes; FR-002 explicitly requires no regression.
- **Principle III (Tailwind-Only)**: PASS. Font loading via a `@font-face` rule inside the existing Tailwind CSS entrypoint (already the project's own convention for global CSS additions, e.g. `themes.css`) — no parallel stylesheet system introduced.
- **Principle IV (Design Token Discipline, NON-NEGOTIABLE)**: PASS. `fontFamily.sans`'s token value is unchanged — this feature makes the existing token's promise true, it doesn't alter or bypass it.
- **Principle V (Interactive State Completeness, NON-NEGOTIABLE)**: PASS/N/A. No new interactive component is introduced; `DarkModeToggle`'s existing states are unaffected.
- **Principle VI (Project Language Policy, NON-NEGOTIABLE)**: PASS. English source/docs, PT-BR agent communication.
- **Principle VII (Autonomous Skill Acquisition Protocol, NON-NEGOTIABLE)**: PASS. The Inter variable font is a static asset (SIL Open Font License, Google's own official variable-font build), not a new skill, plugin, or code dependency — no new package is added to `package.json`. No new external service/action is introduced by this feature.

**Result**: No violations. No Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/045-2026-trend-adoption/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

No new workspaces or directories. Small, targeted additions/edits to existing files:

```text
public/fonts/InterVariable.woff2        # NEW — self-hosted variable font asset
src/styles/tailwind.css                 # MODIFIED — add @font-face rule for Inter
                                         # (fontFamily.sans token itself is unchanged)

packages/react/src/hooks/
└── usePrefersColorScheme.ts            # NEW — mirrors usePrefersReducedMotion.ts's shape

# Wherever feature 025's theme-persistence initial-load logic lives (identified
# during /speckit-tasks by locating DarkModeToggle's existing localStorage read) —
# MODIFIED to seed from usePrefersColorScheme only when no stored choice exists

.specify/memory/constitution.md         # MODIFIED — two new style-direction entries
                                         # (Organic/Fluid, 3D/Immersive) in the
                                         # Component Catalog section

tests/e2e/**/*.spec.ts-snapshots/        # SELECTIVELY REGENERATED only for snapshots
                                         # the font change actually shifts (research R2)
```

**Structure Decision**: No new workspaces. This is a small, surgical feature touching a static asset, one new hook (following an exact existing pattern), one integration point in existing theme logic, and project governance documentation — deliberately scoped away from any component-catalog-wide change (FR-007), keeping it independent of and non-overlapping with feature 044's audit work. No `contracts/` directory: this feature exposes no external API surface.

## Complexity Tracking

*No entries — Constitution Check passed with no violations.*
