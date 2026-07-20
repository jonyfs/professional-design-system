# Implementation Plan: Material Catalog Layout

**Branch**: `040-material-catalog-layout` | **Date**: 2026-07-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/040-material-catalog-layout/spec.md`

## Summary

Restructure `index.html`'s homepage from top quick-jump anchor nav + variable-sized ("bento") card grid to a persistent left sidebar (scroll-spy active-state, keyboard-reachable, collapses to the existing `slide-over` drawer pattern below a breakpoint) + a hero region with real catalog numbers + a uniform 3-column `showcase-card-standard`-only grid, across all 10 categories and all 123 components, driven entirely by existing semantic tokens so every one of the 119 shipped themes still re-colors correctly.

## Technical Context

**Language/Version**: Plain HTML + Tailwind CSS (utility classes via `@apply` in `src/styles/tailwind.css`) + vanilla JS for scroll-spy — matches `index.html`'s existing stack; no framework introduced (React catalog under `packages/react` is a separate, already-parity'd surface untouched by this feature).

**Primary Dependencies**: None new. Reuses `IntersectionObserver` (no existing precedent in this codebase's plain-HTML surface — new but framework-free, matching the project's zero-new-dependency convention) for sidebar active-state tracking; reuses the existing `slide-over` component pattern (`src/components/slide-over/`) for the sub-breakpoint collapsed sidebar.

**Storage**: N/A — static site, no persistence beyond existing theme-selection mechanism (already handled by feature 025's sitewide theme persistence, untouched here).

**Testing**: Playwright, following `tests/e2e/*.spec.ts`'s existing structure — new `tests/e2e/material-catalog-layout.spec.ts` covering sidebar keyboard nav, scroll-spy active state, uniform grid reflow at 320/768/1024/1440px, zero-dropped-component count (123), and AAA contrast across a representative theme sample (full 119-theme contrast audit runs via the existing `npm run audit:contrast` script, not per-test).

**Target Platform**: Static site served via GitHub Pages (existing `deploy-pages.yml`), same as every other page in this catalog.

**Project Type**: Web (single static HTML page + Tailwind stylesheet + new vanilla-JS module).

**Performance Goals**: Sidebar category jump visible within 1s (SC-001) — trivially met by same-page anchor scroll; no new network requests or heavy assets introduced.

**Constraints**: Zero regressions to the existing `tests/e2e/*.spec.ts` suite (SC-005); zero hardcoded color values (Constitution Principle IV); AAA contrast across all 119 themes (SC-003); WCAG 2.2 AAA keyboard/focus coverage (FR-004, FR-010).

**Scale/Scope**: 1 page (`index.html`), 1 stylesheet (`src/styles/tailwind.css`), 1 new small JS module for scroll-spy, 1 new E2E spec file. 10 categories, 123 existing component cards re-templated to one uniform size — no new components created, no existing component pages touched.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| III (Tailwind, semantic tokens only) | Sidebar/hero/grid CSS added via `@apply` using existing `neutral-*`/`brand-*` token classes already used by `.showcase-card` — no raw hex/rgb introduced | ✅ |
| IV (zero hardcoded palette values) | New sidebar/hero surfaces reuse existing token classes (`bg-neutral-50`, `text-neutral-900`, etc.) exactly as `.showcase-card` already does | ✅ |
| WCAG 2.2 AAA contrast | FR-012/SC-003 — every new text/background pairing checked via existing `npm run audit:contrast` across all 119 themes before merge | ✅ (gate at PR time) |
| Interactive states (hover/focus/active) | Sidebar items get `focus-visible:outline` + active-state class, matching `.showcase-card`'s existing focus-visible pattern | ✅ |
| Reduced motion | FR-011 — scroll-to-section behavior branches on `prefers-reduced-motion` (instant jump vs. smooth scroll), consistent with existing `float-label.html` precedent for this media query | ✅ |
| Reuse existing mechanism over inventing new one | Sub-breakpoint sidebar collapse reuses `slide-over` drawer pattern per spec's own Assumptions section, rather than a new off-canvas implementation | ✅ |
| Test-First | New `material-catalog-layout.spec.ts` written before the markup/CSS changes land, covering every FR above | ✅ (enforced at implementation time) |

No violations — no Complexity Tracking entry needed.

## Project Structure

### Documentation (this feature)

```text
specs/040-material-catalog-layout/
├── plan.md              # This file
└── checklists/
    └── requirements.md  # Already present
```

No `research.md`/`data-model.md`/`contracts/` needed — this is a layout/markup restructuring of one existing page with no new data model or API surface; Technical Context above covers what those would otherwise hold.

### Source Code (repository root)

```text
index.html                          # MODIFIED: replace top <nav aria-label="Jump to category"> (L100)
                                     #   with persistent left sidebar; add hero region above first
                                     #   <section id="app-nav"> (L117); every showcase-card-wide/
                                     #   showcase-card-large class (L150+ and throughout) collapses
                                     #   to showcase-card-standard only
src/styles/tailwind.css             # MODIFIED: add sidebar/hero component classes (L46-81 region,
                                     #   alongside existing .showcase-card rules); showcase-grid
                                     #   (L79-81) becomes a fixed 3-column-max grid, dropping the
                                     #   lg:grid-cols-4/col-span-2/row-span-2 variable sizing
src/scripts/catalog-sidebar.js       # NEW: follows this directory's existing one-module-per-
                                     #   behavior convention (e.g. affix.js, collapse.js); scroll-spy
                                     #   IntersectionObserver wiring sidebar active-state to the 10
                                     #   <section id=...> targets already present at L117-1451
tests/e2e/material-catalog-layout.spec.ts   # NEW: covers FR-001 through FR-012 and SC-001 through SC-005
```

## Next Steps

- Run `specjedi-tasks` to break this plan into ordered, dependency-aware tasks.
