# Implementation Plan: Homepage Component Showcase

**Branch**: `037-homepage-component-showcase` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/037-homepage-component-showcase/spec.md`

## Summary

Replace `index.html`'s 114 text-only cards with cards that each render
a real, `inert`-wrapped excerpt of that component's own existing static
demo markup (research.md R6), sized into a content-driven bento grid
(large/wide/standard, research.md R5) grouped under the same 10
categories feature 026 already established, with a live "proof wall"
hero (research.md R3) as this redesign's one deliberate signature risk,
and a mono-face-as-structural-label typographic system (research.md
R4) requiring zero new font dependency. Design direction was informed
by `/ui-ux-pro-max` (Quick Reference rules — its search tool is broken
in this environment, confirmed via `stat`, so its inline SKILL.md rules
were applied directly) and `/frontend-design:frontend-design`'s
brainstorm→plan→critique process.

## Technical Context

**Language/Version**: HTML/Tailwind CSS (static site), vanilla JS
where a small script is genuinely needed (none anticipated — this is a
markup/CSS restructuring, not new interactivity)

**Primary Dependencies**: None new — no new font, no new npm package;
reuses this catalog's existing Tailwind config, `fontFamily.mono`
(already shipped), and the 114 components' own already-existing static
demo markup as the source for each preview excerpt

**Storage**: N/A

**Testing**: Playwright — extend `tests/e2e/gallery-showcase.spec.ts`
(feature 026's own suite) rather than create a parallel one; axe-core
for the nested-interactive-content/`inert` verification (contract
item 4)

**Target Platform**: Static HTML site (`index.html`) only — this
feature does not touch `packages/react/` (the homepage has no React
package equivalent; the React package ships components, not a gallery
page)

**Project Type**: Web design system, static-site homepage restructuring

**Performance Goals**: No new render-blocking resources; 114 inline
preview excerpts reuse markup patterns already proven performant on
each component's own existing demo page (this catalog already renders
many components on other multi-component pages, e.g. the current
`index.html` itself, with no documented performance issue)

**Constraints**: FR-006/FR-007 (spec.md) — zero new token categories,
zero new raw Tailwind classes beyond token-backed utilities, zero CSP
change, responsive at 320/768/1024/1440, theme-reactive across all 49
themes with zero markup change per theme (existing architecture)

**Scale/Scope**: 114 cards restructured across 10 existing categories;
1 redesigned hero section; 0 new pages; 0 changes to the 114
individual component demo pages themselves (their markup is *read
from*, for preview excerpts, not modified)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle II (WCAG 2.2 AAA, NON-NEGOTIABLE)**: PASS — no new color
  pairing is introduced (every card reuses this catalog's existing
  AAA-verified neutral-50/neutral-900/brand tokens); the `inert`
  wrapper (research.md R6) is itself an accessibility *improvement*
  over a naive nested-interactive-content card, verified via axe-core
  (contract item 4).
- **Principle III (Tailwind-Only Architecture)**: PASS — new
  `.showcase-card*` classes via `@apply` only, matching this catalog's
  established component-class convention.
- **Principle IV (Design Token Discipline, NON-NEGOTIABLE)**: PASS —
  zero new tokens; reuses the existing 21-token schema and the
  already-shipped `fontFamily.mono` stack (research.md R4).
- **Principle V (Interactive State Completeness, NON-NEGOTIABLE)**:
  PASS — `.showcase-card` declares `hover:`/`active:`/`focus-visible:`
  per contracts/showcase-card.contract.md's States table; `disabled:`
  is N/A (the whole-card link is never functionally disabled — the
  same precedent this catalog's existing `.demo-link` class already
  sets, since a plain navigational `<a>` has no disabled state to
  declare).
- **Dual-surface shipping convention**: N/A for this feature — the
  homepage is a static-site-only artifact (no React package
  equivalent exists or is being created); this is a deliberate,
  documented exception, not an oversight.
- **Single-mechanism reuse**: PASS — reuses feature 026's existing
  category-section structure and quick-jump nav verbatim; reuses each
  component's own already-existing static demo markup as the preview
  source (no new "second implementation" of any component is created
  for preview purposes).

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/037-homepage-component-showcase/
├── plan.md              # This file
├── research.md          # Phase 0: prior-art check (026), design-skill guidance applied, bento-tier taxonomy, inert resolution
├── data-model.md         # Phase 1: showcase card (conceptual), relationships to the 114 existing demo pages
├── contracts/
│   └── showcase-card.contract.md  # Phase 1: markup shape, states, verification gate
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html                        # Hero redesigned (proof wall), 114 cards restructured into bento tiers with live preview excerpts, category sections/quick-jump nav preserved verbatim from feature 026

src/styles/tailwind.css           # New .showcase-card* component classes (@apply only)

tests/e2e/gallery-showcase.spec.ts  # Extended: preview presence, inert/tab-order verification, bento-tier responsive behavior, zero regressions to existing quick-jump/category assertions
```
