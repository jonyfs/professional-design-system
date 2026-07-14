---

description: "Task list for feature implementation"
---

# Tasks: Gallery Theme Selector

**Input**: Design documents from `/specs/021-gallery-theme-selector/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright (`tests/e2e/gallery-theme-selector.spec.ts`),
matching this catalog's established convention for every prior feature.

**Organization**: Tasks are grouped by user story (spec.md US1/US2/US3).
This feature's entire implementation surface is small (one markup edit,
one new script file) and shared by all three stories, so the Foundational
phase below carries the real implementation weight — the per-story phases
are almost entirely verification of behavior that mechanism already
provides via already-shipped feature 017 infrastructure.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Confirm `npm install`/`npm run dev` still work with no new dependency required (this feature adds none) — sanity check only

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The one shared control every user story depends on existing.

**⚠️ CRITICAL**: No user story can be verified until this phase is complete.

- [X] T002 Add the "Preview theme" `<label>` + `<select id="gallery-theme-select">` markup to `index.html`'s `<header>` per contracts/gallery-theme-selector.contract.md (empty `<select>`, populated at runtime)
- [X] T003 Create `src/scripts/gallery-theme-selector.js` — imports `THEMES`/`MOOD_FAMILIES` from `shared/design-tokens.ts` and `selectTheme`/`KNOWN_THEME_IDS` from `src/scripts/theme-switcher.js`, populates `<optgroup>`/`<option>` per research.md R1, sets initial value from `document.documentElement.dataset.theme` (research.md R3), wires a `change` listener calling `selectTheme()` (depends on T002)
- [X] T004 Add `<script type="module" src="/src/scripts/gallery-theme-selector.js"></script>` to `index.html` (depends on T003)
- [X] T005 Register `src/scripts/gallery-theme-selector.js` in `vite.config.ts`'s Tailwind `content` glob coverage if not already covered by the existing `./src/scripts/**/*.js` pattern (verify only — no change expected)

**Checkpoint**: Opening `/` shows a populated, labeled theme `<select>` in the header reflecting the currently active theme.

---

## Phase 3: User Story 1 - Preview the Whole Catalog Under Any Theme (Priority: P1) 🎯 MVP

**Goal**: Selecting a theme restyles every visible component card live, with every theme reachable from the control (spec.md US1).

**Independent Test**: Open the gallery page, select a non-default theme, confirm every card's colors update with no reload — per spec.md US1's own Independent Test.

### Tests for User Story 1

- [X] T006 [P] [US1] Playwright scaffold in `tests/e2e/gallery-theme-selector.spec.ts` covering: control lists every theme grouped by mood family, selecting a theme updates `data-theme` and card colors with no navigation/reload, scrolled-out-of-view cards also reflect the new theme — write first, confirm it fails before T002-T004 exist (contracts/gallery-theme-selector.contract.md)

### Implementation for User Story 1

- [X] T007 [US1] Verify (and fix if needed) that `index.html`'s existing component cards use only already-themed tokens (`border-neutral-200`, `text-neutral-900`, `text-neutral-600`, etc.) with no hardcoded color — they should already comply per Constitution Principle IV, this task is a verification pass, not new styling work

**Checkpoint**: User Story 1 fully functional and independently testable — this is the MVP.

---

## Phase 4: User Story 2 - Theme Choice Persists Across Visits (Priority: P2)

**Goal**: A theme selected on the gallery page is still applied on reload or after navigating away and back (spec.md US2).

**Independent Test**: Select a theme, reload the page directly, confirm the same theme is still applied and shown as selected — per spec.md US2's own Independent Test.

### Tests for User Story 2

- [X] T008 [P] [US2] Playwright scaffold covering: selecting a theme then reloading `/` shows the same `data-theme` and the same `<select>` value with no flash of the previous theme; navigating to a component demo page and back preserves the theme (extends `tests/e2e/gallery-theme-selector.spec.ts`)

### Implementation for User Story 2

- [X] T009 [US2] No new code expected — `selectTheme()`'s existing `localStorage` persistence (feature 017, unmodified) already satisfies this story per research.md R2; this task is running T008 and confirming it passes without modification, not new implementation

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Control Stays Usable Alongside the Dedicated Theme Gallery (Priority: P3)

**Goal**: A theme selected via either the new control or the dedicated Theme Gallery page is reflected in the other (spec.md US3).

**Independent Test**: Select a theme via the dedicated Theme Gallery page, open the main gallery page, confirm the new control already shows that theme selected — per spec.md US3's own Independent Test.

### Tests for User Story 3

- [X] T010 [P] [US3] Playwright scaffold covering both directions: Theme Gallery page → main gallery control, and main gallery control → Theme Gallery page, confirming agreement each time (extends `tests/e2e/gallery-theme-selector.spec.ts`)

### Implementation for User Story 3

- [X] T011 [US3] No new code expected — both surfaces already share the same `pds-theme` `localStorage` key and `selectTheme()` function (research.md R4); this task is running T010 and confirming it passes without modification

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T012 [P] Run `npm run audit:tokens` and `npm run audit:contrast` — expect 0 new findings (T007 already confirmed no hardcoded colors, and `.form-select` is already AAA-verified)
- [X] T013 Run `quickstart.md` end-to-end (all validation sections) and record results
- [X] T014 Run `npx playwright test tests/e2e/gallery-theme-selector.spec.ts` across all configured projects (320/768/1024/1440 × chromium/firefox/webkit) with axe-core assertions, confirm 0 violations and 0 overflow at 320px
- [X] T015 Draft the constitution amendment documenting this feature's addition to `index.html`/`src/scripts/` (a small addendum to the existing Theming & Multi-Palette Architecture section, not a new Component Catalog entry — this feature adds no component)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup — BLOCKS all user stories (the `<select>` control itself must exist first)
- **User Story 1 (Phase 3)**: depends on Foundational only — this is the MVP
- **User Story 2 (Phase 4)**: depends on Foundational only — independently testable, though it reuses Phase 2's control
- **User Story 3 (Phase 5)**: depends on Foundational only — independently testable
- **Polish (Phase 6)**: depends on all desired stories being complete

### Parallel Opportunities

- T006, T008, T010 (test scaffolds for each story) can be written in parallel once T002-T004 exist, since they extend the same file but cover independent scenarios
- T012 audits can run in parallel with T013/T014

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (the `<select>` control itself)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: run `tests/e2e/gallery-theme-selector.spec.ts`'s US1 tests, confirm SC-001/SC-003 hold
5. This alone delivers the core value: previewing the whole catalog under any theme

### Incremental Delivery

1. Setup + Foundational → the control exists and works
2. User Story 1 → validate independently → MVP
3. User Story 2 → validate independently (persistence, expected to already pass with zero new code)
4. User Story 3 → validate independently (Theme Gallery agreement, expected to already pass with zero new code)
5. Polish → audits, quickstart validation, constitution amendment

## Notes

- [P] tasks = different files or independent test scenarios, no dependencies
- Unlike most features in this catalog, US2 and US3 are expected to pass
  with zero additional implementation once Phase 2 lands — they exist as
  separate phases to give each acceptance scenario its own explicit,
  independently-run test, not because separate code is anticipated
- Commit after each task or logical group

## Implementation Notes (deviations from the plan above, ratified here)

- **US2/US3 required genuinely zero new code**, exactly as anticipated —
  `tests/e2e/gallery-theme-selector.spec.ts`'s persistence and
  Theme-Gallery-agreement tests passed on the first run against
  `selectTheme()`'s existing, unmodified feature-017 behavior.
- **Real, unrelated pre-existing bug found and fixed** while running
  T014's 320px/WebKit check: `index.html`'s header `<code>` element
  (`.specify/memory/constitution.md`, present since feature 017's
  2026-07-09 commit `ba3cc89`) doesn't wrap on narrow viewports in
  WebKit specifically, overflowing the page by 4px — invisible until
  this feature's own SC-004 320px-overflow test exercised the whole
  page rather than just the new `<select>`. Fixed with a one-class
  addition (`break-words`) to that `<code>` element; zero relation to
  the theme-selector control itself, confirmed via `git blame` before
  fixing.
- 66 Playwright tests (11 scenarios × 6 browser/viewport projects) all
  pass; the full pre-existing theme-related suite (73 tests across
  `theme-restyle.spec.ts`, `theme-persistence.spec.ts`,
  `theme-gallery.spec.ts`, `theme-architecture.spec.ts`) still passes
  with zero regressions.
