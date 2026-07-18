---
description: "Task list for feature implementation"
---

# Tasks: Per-Source Theme Batch (awesome-design-md Coverage)

**Input**: Design documents from `/specs/038-per-source-theme-batch/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: This feature adds 70 static-data theme entries to an
already-tested mechanism (feature 017/021's Theme Gallery/switcher).
No new Playwright spec is warranted (matching feature 027/036's own
precedent — new theme *values* are exercised by the existing
per-theme-parametrized suite automatically); the full pre-existing
suite is the regression backstop (T009).

**Organization**: Tasks are grouped by user story (spec.md US1-US2).
Given the 70x scale, per-theme work is batched into single tasks
operating over the full set (not 70 individual task entries), matching
this feature's own plan.md rationale for a scriptable pipeline over
manual per-theme tuning.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [x] T001 Confirm the pre-existing baseline is clean before starting: `npm run audit:tokens` and `npm run audit:contrast` (expect 0 findings against the current 49 themes)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Finalize the actual, AAA-verified 21-token palette for all 70 themes before any is added anywhere.

- [x] T002 Finalize the full 21-key `ThemeTokens` value set for all 70 themes per research.md R6/contracts/batch-derivation.contract.md — values already produced by the scratchpad derivation pipeline (`batch-theme-derive.mjs`, `derived_themes.json`); confirm each entry's fields (`id`, `displayName`, `moodFamily`, `sourceReference`, 21-key `tokens`) are complete and internally consistent before writing into source files

**Checkpoint**: Final hex values for all 70×21 tokens are computed; ready to write into the two source files.

---

## Phase 3: User Story 1 - Every collection source gets its own distinct theme (Priority: P1) 🎯 MVP

**Goal**: Ship all 70 themes, each selectable and rendering correctly across every existing component.

**Independent Test**: Open the Theme Gallery, select any of the 70 new themes, and confirm every existing component re-colors correctly under it.

### Implementation for User Story 1

- [x] T003 [US1] Append all 70 `ThemeDefinition` entries to the `THEMES` array in `shared/design-tokens.ts` (generated TS blocks in `/tmp/gen_ts_blocks.txt`), each with its `sourceReference` documenting the originating site per data-model.md
- [x] T004 [US1] Append the matching 70 `[data-theme="..."]` CSS custom-property blocks to `src/styles/themes.css` (generated CSS blocks in `/tmp/gen_css_blocks.txt`, same 21-RGB-triplet format as every existing theme block)
- [x] T005 [US1] Add all 70 new theme ids to `tests/e2e/theme-restyle.spec.ts`'s `NEW_THEMES` array (this hardcoded list drives visual-regression baselines, not automatic — feature 036's own T004b finding) and generate their baseline screenshots (`--update-snapshots`, one per browser/viewport project)
- [x] T006 [US1] Confirmed (matching feature 027/036's own finding): `packages/react/src/styles.css` intentionally carries only the default `:root` layer for all themes — no per-theme mirroring exists for any theme, so none is needed for these 70 either
- [x] T007 [US1] Run the real `npm run audit:contrast` script against all 119 themes; for any genuine gap it reports that the derivation pipeline's own approximation missed, add it to `KNOWN_THEME_CONTRAST_GAPS` in `scripts/check-contrast.mjs` with its real measured ratio

**Checkpoint**: All 70 themes exist, are selectable, and re-color every component correctly — MVP complete.

---

## Phase 4: User Story 2 - New themes appear correctly in the gallery's existing organization (Priority: P2)

**Goal**: Confirm all 70 new themes are discoverable and persist exactly like every other theme, with zero special-casing.

**Independent Test**: Open the Theme Gallery, confirm each new theme's card and mood-family grouping, select one, reload, confirm persistence.

### Implementation for User Story 2

- [x] T008 [US2] Verify programmatically (`THEMES.length === 119`, all 70 new ids present with correct `displayName`/`moodFamily`, all `moodFamily` values valid against `MOOD_FAMILIES`, all 119 ids unique) and via Playwright (`theme-gallery.spec.ts`, `gallery-theme-selector.spec.ts`); update `gallery-theme-selector.spec.ts`'s hardcoded `toHaveCount(49)` assertion to `toHaveCount(119)`; bump any stray hardcoded theme-count references in `index.html` (e.g. "49-theme picker" copy) to 119
- [x] T009 [US2] Verify via the existing Playwright `theme-persistence.spec.ts` suite — selecting/reloading persists via the existing `localStorage` (`pds-theme`) mechanism for the new themes too, no new persistence code

**Checkpoint**: Both user stories independently verified — all 70 themes are fully first-class members of a 119-theme catalog.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T010 [P] Run `npm run audit:tokens` — confirm 0 violations
- [x] T011 [P] Run `npm run audit:contrast` — confirm passing: 119 themes checked, 0 undocumented findings
- [x] T012 Run the full pre-existing Playwright suite (all specs, all 6 browser/viewport projects) — confirm zero regressions to the other 49 themes
- [x] T013 Run `npm run build` for both the static site and `packages/react` — confirm clean production builds
- [x] T014 Amend `.specify/memory/constitution.md` — new "Per-Source Theme Batch (feature 038)" paragraph under Theming & Multi-Palette Architecture documenting the 70-theme addition, the monochrome-primary handling rule, and the hue-rotation de-duplication rule; bump version (MINOR)

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phase 2 (T002, blocking — every downstream task needs the final verified values) → Phase 3 (T003-T007) → Phase 4 (T008-T009, purely verification once Phase 3 lands) → Phase 5 (Polish, depends on Phase 3+4).
- T003 before T004/T005 (the CSS blocks and baselines mirror the token values decided in T003).
- T008/T009 depend on T003-T005 (nothing to verify before the themes exist).

## Implementation Strategy

**MVP = User Story 1** (T001-T007) — all 70 themes exist and render correctly. User Story 2 (T008-T009) is verification-only, since the Theme Gallery's existing enumeration mechanism requires no new code for new themes to appear correctly.
