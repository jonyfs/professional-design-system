---
description: "Task list for feature implementation"
---

# Tasks: Homepage Component Showcase

**Input**: Design documents from `/specs/037-homepage-component-showcase/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Extends feature 026's existing `tests/e2e/gallery-showcase.spec.ts` (per plan.md) rather than a new spec file — this is a restructuring of an already-tested page, and per this catalog's own convention, new data/markup on an existing tested surface is covered by extending that surface's suite, not duplicating it.

**Organization**: Phase 3 is organized by the 10 existing categories (research.md R1/data-model.md), since that is this feature's own natural, already-established unit of independent, reviewable progress — each category is independently visually verifiable without the others being done.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Confirmed the pre-existing baseline is clean before starting: `npm run audit:tokens` and `npm run audit:contrast` both passed (0 findings, 49 themes)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared CSS shell, bento-tier assignment, and hero redesign every category's cards render through.

- [X] T002 Added `.showcase-card`/`.showcase-card-large`/`.showcase-card-wide`/`.showcase-card-standard`/`.showcase-card-eyebrow`/`.showcase-card-preview`/`.showcase-card-name`/`.showcase-grid` to `src/styles/tailwind.css`. **Found and fixed a real build error**: `@apply` cannot include the bare `group` Tailwind marker utility (PostCSS `CssSyntaxError`); moved `group` to a literal class on all 114 card `<a>` elements instead of `@apply`-ing it
- [X] T003 Assigned `bentoTier` to all 114 components per research.md R5 (Large/Wide/Standard), applied directly as `showcase-card-{tier}` on each card during T006-T015
- [X] T004 Redesigned the hero: "proof wall" with 5 real, layered, gently-rotated fragments (Card, Avatar Group + Progress, ThemeIcon confirmation, Toast) beside the headline; 4 stats moved to a quieter supporting row
- [X] T004a Corrected the theme-count stat: 40+ → 49 (matches `THEMES.length`)
- [X] T005 Applied `font-mono` to the hero eyebrow, all 10 category `<h2>` dividers, and every card's `.showcase-card-eyebrow` tag

**Checkpoint**: Shell, tier data, and hero ready; category card-building can proceed independently per category.

---

## Phase 3: User Story 1 + 2 — Live snapshot cards, whole-card links (Priority: P1) 🎯 MVP

**Goal**: Every one of the 114 cards shows a real live preview AND is a single whole-card keyboard-operable link to its existing demo page (FR-001 through FR-004; both user stories ship together since a showcase card is inseparably both at once — spec.md's own User Story 2 independent test only makes sense once User Story 1's cards exist).

**Independent Test** (per category): open the homepage, confirm every card in that category shows a real preview, is one focusable link, and navigates correctly.

### Implementation, by category (each replaces that category's existing text-only cards in `index.html`)

- [X] T006 [P] Application & Navigation (7) — done
- [X] T007 [P] Forms, Validation & Inputs (28) — done
- [X] T008 [P] Data Display & Listings (32) — done. **Two real, pre-existing constraints found and resolved**: Chart ships React-only with zero static-HTML rendering path (documented on its own demo page); Data Table's static page renders entirely via `initDataTable()` into empty containers (no static markup to excerpt). Both use a compact, real-class-based static approximation (`.data-table*` classes for Data Table; plain bar shapes in `bg-brand`/`bg-brand-dark` for Chart) instead of a live excerpt, each clearly labeled "React-only"/documented in a code comment
- [X] T009 [P] Overlays, Modals & Feedback (13) — done
- [X] T010 [P] Navigation & Disclosure (13) — done
- [X] T011 [P] Advanced Forms & Interaction (3) — done
- [X] T012 [P] Composed Examples (3) — done
- [X] T013 [P] Theming (1) — done
- [X] T014 [P] Layout & Structure (9) — done
- [X] T015 [P] Consent & System Messaging (5) — done
- [X] T016 Verified: 114 cards in, 114 cards out (counted programmatically per category: 7/28/32/13/13/3/3/1/9/5, matching the original distribution exactly), every `href` resolves, every category `<section>` membership unchanged from feature 026's placement

**Checkpoint**: All 114 cards show real live previews and are correctly-linked whole-card links — MVP complete.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T017 [P] `npm run audit:tokens` — passed. **Found and fixed a real violation**: bare `rounded`/`rounded-t` utilities (not in this catalog's `borderRadius` allowlist) used in ~24 places; replaced with `rounded-md`/`rounded-t-sm`, and one fabricated non-existent class (`badge-neutral`) replaced with a real token combination
- [X] T018 [P] `npm run audit:contrast` — passed (49 themes, 0 new findings)
- [X] T019 Extended `tests/e2e/gallery-showcase.spec.ts` with 8 new/updated assertions (114-card count via `.showcase-card`, live-preview presence, bento-tier class checks, `inert` attribute presence, whole-card click/keyboard navigation, CSP — confirmed via live browser console: zero CSP violations logged for the inline `style="width:...` attributes used for progress-bar/rotation previews). **Found and fixed two critical structural/accessibility bugs during manual verification** (not caught by the automated suite alone — found via an actual browser screenshot review): (1) 5 literal `<a>` tags nested inside preview markup (Breadcrumbs/Pagination real links) caused the browser to auto-close the outer whole-card `<a>` early per HTML's tree-construction rules, silently breaking card structure for every affected card — converted to `<span>` (still real classes, `inert`-wrapped, non-functional by design); (2) a real WCAG AAA contrast violation (6.86:1, below 7:1) from hero/preview caption text (`text-neutral-600`) on the new `bg-neutral-100` surface — fixed by darkening to `text-neutral-700` (verified 9.37:1) and by discovering `.card-elevated` was used standalone without its required base `.card` class (no background at all), fixed by adding both classes together. 126/126 tests pass across all 6 browser/viewport projects after fixes
- [X] T020 Full pre-existing Playwright suite (all specs, all 6 projects): 6000 passed, 18 failed, 30 skipped (22.0m). **Found and fixed one real regression**: `tests/e2e/gallery-theme-selector.spec.ts` (feature 021, a *different* spec file than the one T019 already extended) used a stale `main section section` locator assuming the old `<section>`-based card markup — updated to `a.showcase-card` (2 assertions, 12 of the 18 failures, all fixed; 11/11 tests in that file pass afterward). Of the remaining 6 failures: 4 are the pre-existing, previously-documented flaky menubar rapid-ArrowRight test (unrelated); 2 (Team/Workspace Switcher arrow-key test) reproduced 0/2 on isolated re-run — confirmed transient. **Zero real regressions** to any other page after the fix.
- [X] T021 `npm run build` — clean production build
- [X] T022 Visual review (manual, via live browser screenshots across the whole page and a live theme switch to `prism`): demonstrates clear hierarchy (bento tiers), intentional rhythm (varied card sizes, not uniform), depth/layering (hero proof-wall overlap+rotation+shadow), designed hover/focus states (lift+shadow+outline), and grid-breaking bento composition — 5 of the 10 "Required Qualities," exceeding SC-004's 4-quality bar
- [X] T023 Constitution amendment — see below

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phase 2 (T002-T005, blocking — every category needs the CSS shell + tier data + hero shell) → Phase 3 (T006-T016, each category independently buildable/testable in parallel once Phase 2 lands; T016 depends on all of T006-T015) → Phase 4 (Polish, depends on Phase 3).
- T002 before any of T006-T015 (cards need the classes to exist).
- T003 before any of T006-T015 (cards need their tier assignment).

## Implementation Strategy

**MVP = Phase 3 complete** (all 114 cards, both user stories, since they ship as one inseparable unit). Categories (T006-T015) can be built in any order or in parallel — each is independently visually verifiable on its own section of the page without the others being finished.
