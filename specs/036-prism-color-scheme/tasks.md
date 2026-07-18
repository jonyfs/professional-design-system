---
description: "Task list for feature implementation"
---

# Tasks: Prism Color Scheme (Synthesized Cross-Collection Theme)

**Input**: Design documents from `/specs/036-prism-color-scheme/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: This feature adds one static-data theme entry to an
already-tested mechanism (feature 017/021's Theme Gallery/switcher).
No new Playwright spec is warranted (matching feature 027's own
precedent — new theme *values* are exercised by the existing
per-theme-parametrized suite automatically, not a hand-written test per
theme); the full pre-existing suite is the regression backstop (T011).

**Organization**: Tasks are grouped by user story (spec.md US1-US2).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Confirm the pre-existing baseline is clean before starting: `npm run audit:tokens` and `npm run audit:contrast` (expect 0 findings against the current 48 themes) — confirmed clean

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Finalize the actual, AAA-verified 21-token Prism palette before it can be added anywhere.

- [X] T002 Finalize the full 21-key `ThemeTokens` value set for `prism` — implemented via a one-off OKLab/OKLCH derivation script (Björn Ottosson's public sRGB<->OKLab formulas, since no OKLCH library is installed) plus the actual WCAG relative-luminance contrast formula, then re-verified against the project's real `npm run audit:contrast` (not just the hand-computed checks). Initial `brand` anchor `HSL(190°,70%,50%)` (`#26BBD9`) failed both the 3:1 Text Input focus-ring AND 4.5:1 Button focus-visible-outline checks (2.28:1 — the same brand-vs-neutral-50 pairing checked against two thresholds); iterated down to `HSL(190°,70%,34%)` (`#1A7F93`), which clears both (4.67:1) plus the 3:1 Progress fill-vs-track check (5.46:1). `success-strong`/`warning-strong` needed extra OKLCH-darkening (0.22→0.34/0.36) past the first pass to clear 7:1 text AAA. **Result: exactly ONE genuine gap** — Sidebar's fixed dark-item-on-neutral-900 pairing (5.78:1, need 7:1), a structural conflict already present in ~20 of the other 48 themes, not Prism-specific (see T006). Final values: `brand-light` #91EBFF, `brand` #1A7F93, `brand-dark` #004052, `neutral-100`-`800` #D6D7D8/#B3B4B6/#959799/#797C7F/#616467/#4A4D51/#35393D/#22262A, `success` #3ECA75/`success-strong` #00600B, `warning` #ECA322/`warning-strong` #773600, `error` #DA3B36/`error-strong` #9A0000, `info` #3288F8/`info-strong` #0049B4

**Checkpoint**: Final hex values for all 21 tokens are computed and contrast-verified; ready to write into the two source files.

---

## Phase 3: User Story 1 - A new theme distilled from the collection's shared visual DNA (Priority: P1) 🎯 MVP

**Goal**: Ship the `prism` theme, selectable and rendering correctly across every existing component.

**Independent Test**: Open the Theme Gallery, select "Prism," and confirm every existing component re-colors correctly under it.

### Implementation for User Story 1

- [X] T003 [US1] Add the `prism` entry to the `THEMES` array in `shared/design-tokens.ts` — `id: "prism"`, `displayName: "Prism"`, `moodFamily: "Light Professional"`, the T002 token values, and a `sourceReference` documenting the 7-site real sample + hue/RGB-averaging methodology (research.md R1-R5), per data-model.md
- [X] T004 [US1] Add the matching `[data-theme="prism"]` CSS custom-property block to `src/styles/themes.css` (21 RGB-triplet properties, same format as every existing theme block)
- [X] T004b [US1] Discovered during implementation: `tests/e2e/theme-restyle.spec.ts`'s visual-regression coverage is driven by a hardcoded `NEW_THEMES` array (every prior batch — 017's 4 phases, 027 — added its own themes to this same list), not automatic; added `"prism"` and generated its 6 baseline screenshots (`--update-snapshots`, one per browser/viewport project) — 48/48 passed on chromium-1440 (47 existing + prism)
- [X] T005 [US1] ~~Mirror into `packages/react/src/styles.css`~~ — **N/A, corrected plan.md assumption**: verified (matching feature 027's own T011 finding) that file intentionally carries only the default `:root` layer for ALL 48 existing themes too — no per-theme mirroring exists for any theme, so none is needed for Prism either
- [X] T006 [US1] Added `prism:Sidebar dark item text (text-neutral-300 on bg-neutral-900)` to `KNOWN_THEME_CONTRAST_GAPS` in `scripts/check-contrast.mjs` with its real measured ratio (5.78:1, need 7:1) — the one genuine gap T002 found, matching an existing pattern already present on ~20 other themes

**Checkpoint**: Prism exists, is selectable, and re-colors every component correctly — MVP complete.

---

## Phase 4: User Story 2 - Prism appears correctly in the gallery's existing organization (Priority: P2)

**Goal**: Confirm Prism is discoverable and persists exactly like every other theme, with zero special-casing.

**Independent Test**: Open the Theme Gallery, confirm Prism's card and mood-family grouping, select it, reload, confirm persistence.

### Implementation for User Story 2

- [X] T007 [US2] Verified programmatically (`THEMES.length === 49`, `THEMES.find(id==="prism")` present with correct `displayName`/`moodFamily`, all `moodFamily` values valid against `MOOD_FAMILIES`) and via Playwright (`theme-gallery.spec.ts`, `gallery-theme-selector.spec.ts` — all 27 tests passed, 0 Prism-specific code needed). **Found and fixed one hardcoded pre-existing count**: `gallery-theme-selector.spec.ts` asserted `toHaveCount(48)` options; bumped to 49 (a legitimate, expected consequence of adding a 49th theme, same as feature 027's `gallery-showcase.spec.ts` bump). Also bumped one stray hardcoded "48-theme picker" reference in `index.html`'s Dark Mode Toggle card copy to 49
- [X] T008 [US2] Verified via the existing Playwright `theme-persistence.spec.ts` suite (4/4 passed) — selecting/reloading persists via the existing `localStorage` (`pds-theme`) mechanism, no new persistence code

**Checkpoint**: Both user stories independently verified — Prism is a fully first-class 49th theme.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T009 [P] Run `npm run audit:tokens` — confirmed 0 violations (114 HTML, 472 @apply blocks, 105 .tsx files scanned)
- [X] T010 [P] Run `npm run audit:contrast` — confirmed passing: 49 themes checked, 0 undocumented findings (the 1 genuine Prism gap is documented in `KNOWN_THEME_CONTRAST_GAPS`, T006)
- [X] T011 Ran the full pre-existing Playwright suite (all specs, all 6 browser/viewport projects): 5977 passed, 5 failed, 30 skipped (22.8m). Of the 5 failures: 4 are the pre-existing, previously-documented flaky menubar rapid-ArrowRight test (unrelated, confirmed pattern from feature 035); 1 (`retro` theme-restyle at chromium-320) reproduced 0/1 on isolated re-run — confirmed transient resource-contention flakiness from the large parallel run, not a real regression. **Zero regressions to the other 48 themes.**
- [X] T012 Run `npm run build` for both the static site and `packages/react` — both built cleanly
- [X] T013 Amended `.specify/memory/constitution.md` — new "Prism — a synthesized theme, not a source-mapped one" paragraph under Theming & Multi-Palette Architecture; version bumped 1.32.0 → 1.33.0

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phase 2 (T002, blocking — every downstream task needs the final verified values) → Phase 3 (T003-T006) → Phase 4 (T007-T008, purely verification once Phase 3 lands) → Phase 5 (Polish, depends on Phase 3+4).
- T003 before T004/T005 (the CSS blocks mirror the token values decided in T003's `sourceReference`/token set).
- T007/T008 depend on T003-T005 (nothing to verify before Prism exists).

## Implementation Strategy

**MVP = User Story 1** (T001-T006) — Prism exists and renders correctly. User Story 2 (T007-T008) is verification-only, since the Theme Gallery's existing enumeration mechanism requires no new code for a new theme to appear correctly.
