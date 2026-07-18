---

description: "Task list for feature implementation"
---

# Tasks: Consent & System Messaging Primitives

**Input**: Design documents from `/specs/030-consent-system-messaging/`

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

## Phase 3: User Story 1 - Session timeout warning before forced logout (Priority: P1) 🎯 MVP

**Goal**: Ship Session Timeout Modal (spec.md US1).

**Independent Test**: Trigger the timeout warning — confirm the modal shows a live, updating countdown and that "Stay signed in" dismisses it without navigating away.

### Tests for User Story 1

- [X] T002 [P] [US1] Playwright scaffold in `tests/e2e/consent-system-messaging.spec.ts` covering Session Timeout Modal: countdown updates live, reaches expired state, "Stay signed in" stops the countdown and closes cleanly (no stray interval) — per contracts/session-timeout-modal.contract.md

### Implementation for User Story 1

- [X] T003 [US1] Create `src/scripts/session-timeout-modal.js` (setInterval countdown, research.md R1/R2) — verify the interval is cleared on close
- [X] T004 [US1] Create `src/components/session-timeout-modal/session-timeout-modal.html`, reusing Modal's exact `<dialog class="modal-dialog">`/`.modal-panel` markup verbatim
- [X] T005 [P] [US1] Create `packages/react/src/SessionTimeoutModal/SessionTimeoutModal.tsx`, composing the existing `Modal` component (not a new dialog mechanism) per contracts/session-timeout-modal.contract.md
- [X] T006 [US1] Add to `packages/react/src/index.ts`, `vite.config.ts`/`tests/react-harness/vite.config.ts` multi-page entries; create `tests/react-harness/consent-system-messaging.html` + `src/consent-system-messaging-main.tsx`
- [X] T007 [US1] Add card to `index.html`'s appropriate category section

**Checkpoint**: User Story 1 is independently verifiable and shippable as the MVP.

---

## Phase 4: User Story 2 - System-status banners (Priority: P2)

**Goal**: Ship Offline Banner, 2FA reminder banner, Maintenance Bar (spec.md US2).

**Independent Test**: Simulate going offline — confirm the banner appears/disappears automatically. Confirm the 2FA reminder and Maintenance Bar render as full-width/persistent Alert variants.

### Tests for User Story 2

- [X] T008 [P] [US2] Extend `tests/e2e/consent-system-messaging.spec.ts` with: Offline Banner appears/disappears on `context.setOffline()`, no dismiss control on any of the 3; Maintenance Bar renders full-width — per contracts/system-banners.contract.md

### Implementation for User Story 2

- [X] T009 [US2] Create `src/scripts/offline-banner.js` (online/offline events, research.md R3)
- [X] T010 [P] [US2] Create `src/components/offline-banner/offline-banner.html`, `src/components/two-factor-reminder-banner/two-factor-reminder-banner.html`, `src/components/maintenance-banner/maintenance-banner.html`, each reusing `.alert`/`.alert-*` verbatim (research.md R4)
- [X] T011 [P] [US2] Create `packages/react/src/OfflineBanner/OfflineBanner.tsx` and `packages/react/src/SystemBanner/SystemBanner.tsx` (parametrized, covers both the 2FA reminder and Maintenance Bar per plan.md's Structure Decision)
- [X] T012 [US2] Add to `packages/react/src/index.ts`, vite.config.ts entries, 3 `index.html` cards

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Quick light/dark switch (Priority: P3)

**Goal**: Ship Dark Mode Toggle (spec.md US3).

**Independent Test**: Activate the toggle — confirm `data-theme` switches between `light`/`dim` and persists across a reload.

### Tests for User Story 3

- [X] T013 [P] [US3] Extend `tests/e2e/consent-system-messaging.spec.ts` with Dark Mode Toggle: toggling applies/persists `dim`, reload preserves it, activating a 3rd theme via the page's theme `<select>` shows the toggle as "off" — per contracts/dark-mode-toggle.contract.md

### Implementation for User Story 3

- [X] T014 [US3] Create `src/scripts/dark-mode-toggle.js` (reuses `theme-switcher.js`'s `selectTheme`/`KNOWN_THEME_IDS` verbatim, research.md R5)
- [X] T015 [US3] Create `src/components/dark-mode-toggle/dark-mode-toggle.html`, reusing Toggle's `.toggle-track`/`.toggle-dot` markup verbatim
- [X] T016 [US3] Create `packages/react/src/DarkModeToggle/DarkModeToggle.tsx` — a self-contained minimal port (NOT importing the static site's `theme-switcher.js`, a different package/bundle; verify against `useChartColors.ts`'s read-only `MutationObserver` precedent before writing, per contracts/dark-mode-toggle.contract.md's own documented correction)
- [X] T017 [US3] Add to `packages/react/src/index.ts`, vite.config.ts entries, `index.html` card

**Checkpoint**: All 3 user stories independently functional — 5/5 primitives shipped, closing feature 018's Consent & System Messaging category to 100%.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T018 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes
- [X] T019 [P] Run `npm run audit:contrast` — confirm zero new findings
- [X] T020 Run the full `consent-system-messaging.spec.ts` suite across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures
- [X] T021 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions (spec.md SC-004). Before trusting the result: verify ports 5173/5174 are clean, reconcile the pass+fail+skip tally against `npx playwright test --list`'s CURRENT true total (re-run --list fresh, don't reuse a stale number — this exact discrepancy has bitten features 027/028 before), and check whether `gallery-showcase.spec.ts`'s component count needs updating now that 5 more components exist (91 → 96)
- [X] T022 Draft the constitution amendment documenting the 5 new primitives, the `dim`-pairing scope decision, and closing feature 018's Consent & System Messaging category to 5/5

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phases 3-5 (fully independent of each other) → Phase 6 (Polish, depends on all 3 stories).
- T003 (script) before T004 (HTML using it); same for T009→T010, T014→T015.
- T016 has NO dependency on `theme-switcher.js` (a different package) — do not attempt to import across package boundaries.

## Implementation Strategy

**MVP = User Story 1** (Session Timeout Modal) — the highest-priority,
most novel item in this batch. US2/US3 each ship independently.
