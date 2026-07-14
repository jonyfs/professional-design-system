# Implementation Plan: Demo Gallery Visual Showcase

**Branch**: `026-demo-gallery-showcase` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/026-demo-gallery-showcase/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Redesign the root gallery (`index.html`, currently 78 identically-
styled cards in one flat, uncategorized grid) into a categorized,
hierarchical showcase with an opening section communicating scale and
differentiators, quick-jump category navigation, and visually-distinct
treatment for this catalog's flagship components (Data Table, Chart,
Command Palette, curated theming). Individual component demo pages get
a lighter, uniform structural polish (consistent section framing)
applied via the same scripted-rollout pattern feature 025 already
established for a catalog-wide markup change, NOT 78 bespoke
redesigns. The actual visual craft decisions (palette confirmation,
spacing rhythm, hero composition) are made during implementation by
invoking the `/impeccable` and `/frontend-skill` design skills per the
user's explicit request (spec.md Assumptions) — this plan fixes the
technical/structural approach those skills will execute within, not
the pixel-level visual design itself.

## Technical Context

**Language/Version**: Vanilla HTML/Tailwind (matches every existing
static page), zero new build tooling, zero new JavaScript framework.

**Primary Dependencies**: None new — Principle VII not triggered.

**Storage**: N/A.

**Testing**: Playwright — a new spec
(`tests/e2e/gallery-showcase.spec.ts`) verifying category navigation,
zero regressions to existing markup-copy/component-discovery
guarantees, and responsive behavior at all supported breakpoints; the
existing full-catalog suite is the regression backstop for "every
component's markup/behavior is unchanged" (spec.md FR-007).

**Target Platform**: Web — the static HTML gallery only (root
`index.html` + all `src/components/**/*.html` pages); the React
harness is out of scope (spec.md Assumptions, same scoping as feature
025).

**Performance Goals**: No LCP/CLS regression — any new imagery/motion
must stay within this catalog's existing performance discipline (no
new perf budget introduced, but not to be silently traded away either).

**Constraints**: Zero new npm dependency; zero new design tokens
beyond what's needed for the categorized layout (spacing/grid
utilities already in the existing Tailwind allowlist); zero
regressions to any shipped component's markup, behavior, or
accessibility (spec.md FR-007/FR-008); reduced-motion respected for
any new motion (spec.md FR-009); the existing "open any page directly,
copy its markup" guarantee must survive unchanged (spec.md Edge
Cases).

**Scale/Scope**: 1 substantially-redesigned page (`index.html`, ~78
cards reorganized into 6 category sections matching this catalog's own
existing Component Catalog structure, plus a new opening/hero
section and quick-jump nav) + 77 component demo pages receiving a
lighter, uniform structural polish (consistent section wrapper,
applied by script, not by hand) + 1 new Playwright spec.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | This feature's entire purpose is fixing a documented violation of this principle (the current flat, undifferentiated grid) — the redesign is explicitly measured against the catalog's own Anti-Template Policy's "Required Qualities" checklist (spec.md SC-005) | PASS (this is the feature) |
| II. Absolute Semantic Accessibility (WCAG AAA) | Any new hierarchy/categorization/hero content must meet the existing AAA contrast and full keyboard-operability bar — verify empirically in Phase 3, this catalog's own repeated "verify, don't assume" precedent | PASS (verify empirically in Phase 3) |
| III. Tailwind-Only Architecture | New layout classes (category section wrappers, quick-jump nav) follow existing naming/`@apply` conventions — no parallel CSS | PASS |
| IV. Design Token Discipline | Zero new tokens — categorization/hierarchy achieved via existing spacing/typography/color scale, not new palette entries | PASS |
| V. Interactive State Completeness | The new quick-jump nav's links need the full hover/focus-visible state set, matching every other in-page link in this catalog | PASS (enforced in contracts) |
| VI. Project Language Policy | Code/docs in English; chat responses in PT-BR | PASS |
| VII. Autonomous Skill Acquisition Protocol | Not triggered — zero new dependencies | PASS (not triggered) |

No violations — Complexity Tracking intentionally omitted.

## Project Structure

### Documentation (this feature)

```text
specs/026-demo-gallery-showcase/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md         # Phase 1 output (/speckit-plan command)
├── contracts/            # Phase 1 output (/speckit-plan command)
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html                 # Substantially redesigned: opening/hero
                            # section, 6 category sections (matching
                            # this catalog's existing Component Catalog
                            # structure), quick-jump nav, flagship
                            # visual treatment for Data Table/Chart/
                            # Command Palette/theming

src/components/**/*.html    # 77 files — lighter, uniform structural
                            # polish (consistent section wrapper around
                            # each page's existing content), applied via
                            # scripts/apply-demo-page-polish.mjs
                            # (same scripted-rollout pattern as feature
                            # 025's scripts/apply-theme-rollout.mjs)

tests/e2e/
└── gallery-showcase.spec.ts  # category nav, quick-jump, responsive,
                                # zero-regression spot checks
```

**Structure Decision**: The two halves of this feature get
deliberately different treatment: `index.html` gets genuine, bespoke
visual craft (invoking `/impeccable`/`/frontend-skill` for real design
decisions, since it's the single highest-leverage page); the 77
individual demo pages get a scripted, uniform structural improvement
(same category of change as feature 025's rollout) rather than 77
bespoke redesigns, which would be wildly disproportionate to "present
each component within clearer visual framing" (spec.md FR-006).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally omitted.
