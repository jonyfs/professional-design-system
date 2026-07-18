---

description: "Task list for feature implementation"
---

# Tasks: Data Display Composables

**Input**: Design documents from `/specs/033-data-display-composables/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright visual regression + axe-core across
all 6 browser/viewport projects, matching every prior feature's
convention, plus the full pre-existing catalog suite as the
zero-regression backstop.

**Organization**: Tasks are grouped by user story (spec.md US1-US3).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Confirm the pre-existing baseline is clean before starting: `npm run audit:tokens` and `npm run audit:contrast` (expect 0 findings)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: None beyond T001 — all 3 user stories are independent of each other.

**Checkpoint**: Baseline confirmed clean.

---

## Phase 3: User Story 1 - Iconography with semantic color meaning (Priority: P1) 🎯 MVP

**Goal**: Ship ThemeIcon (spec.md US1).

**Independent Test**: Render ThemeIcon with each semantic color — confirm it matches Badge's color-token convention.

### Tests for User Story 1

- [X] T002 [P] [US1] Playwright scaffold in `tests/e2e/data-display-composables.spec.ts` covering ThemeIcon: each color variant, both sizes, accessible name via `role="img"`/`aria-label` — per contracts/theme-icon-blockquote.contract.md

### Implementation for User Story 1

- [X] T003 [US1] Add `.theme-icon*` to `src/styles/tailwind.css` per contracts/theme-icon-blockquote.contract.md
- [X] T004 [P] [US1] Create `src/components/theme-icon/theme-icon.html`
- [X] T005 [P] [US1] Create `packages/react/src/ThemeIcon/ThemeIcon.tsx`
- [X] T006 [US1] Add to `packages/react/src/index.ts`, `vite.config.ts`/`tests/react-harness/vite.config.ts` multi-page entries; create `tests/react-harness/data-display-composables.html` + `src/data-display-composables-main.tsx`
- [X] T007 [US1] Add card to `index.html`'s appropriate category section

**Checkpoint**: User Story 1 is independently verifiable and shippable as the MVP.

---

## Phase 4: User Story 2 - Text-focused display composables (Priority: P2)

**Goal**: Ship Blockquote, BackgroundImage (spec.md US2).

**Independent Test**: Render Blockquote — confirm visual distinction. Render BackgroundImage — confirm legible overlaid content.

### Tests for User Story 2

- [X] T008 [P] [US2] Extend `tests/e2e/data-display-composables.spec.ts` with Blockquote (visual distinction, citation) and BackgroundImage (scrim contrast, fallback on failed image load) — per contracts/theme-icon-blockquote.contract.md and contracts/background-image-watermark.contract.md

### Implementation for User Story 2

- [X] T009 [US2] Add `.blockquote*` to `src/styles/tailwind.css`; create `src/components/blockquote/blockquote.html`
- [X] T010 [US2] Add `.background-image*` to `src/styles/tailwind.css`; create `src/scripts/background-image.js`
- [X] T011 [US2] Create `src/components/background-image/background-image.html` — uses the `img-src 'self' data:;` CSP variant (research.md), a data: URI placeholder image (matching Avatar's own precedent, no real image asset needed)
- [X] T012 [P] [US2] Create `packages/react/src/Blockquote/Blockquote.tsx`, `packages/react/src/BackgroundImage/BackgroundImage.tsx`
- [X] T013 [US2] Add to `packages/react/src/index.ts`, vite.config.ts entries, 2 `index.html` cards

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Repeated background watermark (Priority: P3)

**Goal**: Ship Watermark (spec.md US3).

**Independent Test**: Render a Watermark-wrapped region — confirm the tiled text doesn't obscure foreground legibility.

### Tests for User Story 3

- [X] T014 [P] [US3] Extend `tests/e2e/data-display-composables.spec.ts` with Watermark: tile renders, foreground content contrast meets AAA against the watermark layer — per contracts/background-image-watermark.contract.md

### Implementation for User Story 3

- [X] T015 [US3] Add `.watermark*` to `src/styles/tailwind.css`; create `src/scripts/watermark.js` (SVG data URI generation, research.md R5)
- [X] T016 [US3] Create `src/components/watermark/watermark.html` — uses the `img-src 'self' data:;` CSP variant
- [X] T017 [US3] Create `packages/react/src/Watermark/Watermark.tsx`
- [X] T018 [US3] Add to `packages/react/src/index.ts`, vite.config.ts entries, `index.html` card

**Checkpoint**: All 3 user stories independently functional — 4/4 primitives shipped, bringing feature 018's Data Display category to 8/16 (8 remaining items documented, not silently dropped).

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T019 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes
- [X] T020 [P] Run `npm run audit:contrast` — confirm zero new findings
- [X] T021 Run the full `data-display-composables.spec.ts` suite across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures
- [X] T022 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions (spec.md SC-004). Before trusting the result: verify ports 5173/5174 are clean, reconcile the pass+fail+skip tally against `npx playwright test --list`'s CURRENT true total (re-run --list fresh, don't reuse a stale number), and check whether `gallery-showcase.spec.ts`'s component count needs updating now that 4 more components exist (104 → 108)
- [X] T023 Draft the constitution amendment documenting the 4 new primitives and bringing feature 018's Data Display category to 8/16

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phases 3-5 (fully independent of each other) → Phase 6 (Polish, depends on all 3 stories).
- T010 (script) before T011 (HTML using it); T015 before T016.

## Implementation Strategy

**MVP = User Story 1** (ThemeIcon) — the most broadly reusable item.
US2/US3 each ship independently.
