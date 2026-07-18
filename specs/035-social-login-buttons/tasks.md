---

description: "Task list for feature implementation"
---

# Tasks: Configurable Social Login Buttons

**Input**: Design documents from `/specs/035-social-login-buttons/`

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

**Purpose**: Shared token + CSS shell every user story's presets and custom entries render through.

- [X] T002 Add the `providerBrand` fixed, non-theme-reactive color constants to `shared/design-tokens.ts`, kept structurally separate from `colors`/`REQUIRED_THEME_PROPERTIES`/`THEMES` (research.md R2, plan.md Complexity Tracking)
- [X] T003 [P] Add `.social-login-*` component classes (`.social-login-group`, `.social-login-btn`, `.social-login-btn-icon`, `.social-login-btn-label`, monochrome variants, etc.) to `src/styles/tailwind.css` per contracts/social-login-group.contract.md
- [X] T004 [P] Add the SAME `.social-login-*` classes to `packages/react/src/styles.css`'s `@layer components` block (verbatim duplicate, matching that file's own established convention). **Verify this step is actually done** — this session found that every component class from features 028 through 034 was silently never duplicated into this file, leaving ~40 React components unstyled in the published package; do not repeat that gap here.

**Checkpoint**: Token + CSS shell ready on both surfaces; user stories can proceed.

---

## Phase 3: User Story 1 - Brand-compliant login with the top providers (Priority: P1) 🎯 MVP

**Goal**: Ship `SocialLoginGroup` with the 5 built-in presets (Google, Apple, Facebook, Microsoft, GitHub) rendering per each provider's real brand guideline, on both surfaces.

**Independent Test**: Render the group with `["google", "apple", "github"]` (static HTML fixed example + React) and verify each button's icon, approved CTA text, and color treatment matches contracts/social-login-group.contract.md (Apple/GitHub's optional monochrome fill; the other 3 on the default neutral surface).

### Tests for User Story 1

- [X] T005 [P] [US1] Playwright scaffold in `tests/e2e/social-login-buttons.spec.ts` covering all 5 presets: correct icon/label per provider, Apple/GitHub's monochrome-fill option, zero axe-core violations — per contracts/social-login-group.contract.md

### Implementation for User Story 1

- [X] T006 [US1] Author the 5 preset brand-mark inline SVGs (Google "G", Apple mark, Facebook "f", Microsoft 4-square, GitHub Octocat), sourced from each provider's own published brand/press assets (research.md R3)
- [X] T007 [P] [US1] Create `packages/react/src/SocialLoginGroup/providers.tsx` — the closed `PRESETS` map (data-model.md `ProviderPreset`), embedding the 5 SVG marks as React nodes
- [X] T008 [US1] Create `packages/react/src/SocialLoginGroup/SocialLoginGroup.tsx` per contracts/social-login-group.contract.md — `providers`/`mode`/`onProviderSelect`; FR-006's closed preset table (no code path exists for a caller to override Apple/Google's color or icon)
- [X] T009 [P] [US1] Create `src/scripts/social-login.js` (vanilla wiring: click/keyboard → `providerselect` CustomEvent; zero network calls, per FR-003)
- [X] T010 [US1] Create `src/components/social-login/social-login.html` — fixed example with all 5 presets (research.md R7)
- [X] T011 [US1] Add to `packages/react/src/index.ts`, `vite.config.ts`/`tests/react-harness/vite.config.ts` multi-page entries; create `tests/react-harness/social-login-buttons.html` + `src/social-login-buttons-main.tsx`
- [X] T012 [US1] Add a card to `index.html`'s gallery — placed in the existing "Forms, Validation & Inputs" section (a login/sign-in action control is a form action, consistent with Button/TextInput/localized inputs already living there; no new category warranted for one component) and bumped the hero stat count 113 → 114

**Checkpoint**: User Story 1 is independently verifiable and shippable as the MVP — a real, brand-compliant 3-provider group works end-to-end on both surfaces.

---

## Phase 4: User Story 2 - One config array drives the whole group (Priority: P2)

**Goal**: Per-provider `loading`/`disabled` state, and confirm reordering/subsetting needs no markup changes.

**Independent Test**: Reorder the `providers` array, shrink it to one entry, and set `loadingProviderIds`/`disabledProviderIds` for a single provider — confirm only the targeted button's state changes.

### Tests for User Story 2

- [X] T013 [P] [US2] Extend `tests/e2e/social-login-buttons.spec.ts`: reordering/subsetting the `providers` array, and independent per-provider `loading`/`disabled` state (FR-005) — per contract

### Implementation for User Story 2

- [X] T014 [US2] Add `loadingProviderIds`/`disabledProviderIds` handling to `SocialLoginGroup.tsx` — independent `disabled` attribute + "Signing in…" label swap per targeted button only
- [X] T015 [US2] Add a static HTML example in `social-login.html` demonstrating the `disabled` attribute on one button (a fixed illustrative example — the static surface has no live config mechanism, per research.md R7)
- [X] T016 [US2] Update `tests/react-harness/src/social-login-buttons-main.tsx` with interactive controls (buttons/checkboxes) that toggle a provider's loading/disabled state, to exercise FR-005 live in the harness

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Providers without a mandated button spec (Priority: P3)

**Goal**: The `CustomProviderEntry` mechanism, demonstrated with Instagram/TikTok/Discord example entries.

**Independent Test**: Add a custom entry (`{ id: "instagram", label, icon, color, onSelect }`) alongside the Google/Apple presets and confirm identical height/padding/radius, with the brand color visible only in the icon accent.

### Tests for User Story 3

- [X] T017 [P] [US3] Extend `tests/e2e/social-login-buttons.spec.ts`: a custom entry renders with the same button shape as the presets; the supplied `color` never applies to the button's own background/text (FR-004; research.md R1) — per contract

### Implementation for User Story 3

- [X] T018 [US3] Author 3 example custom-provider inline SVG glyphs (Instagram, TikTok, Discord), sourced from each provider's public brand assets (research.md R3/R7)
- [X] T019 [US3] Add `CustomProviderEntry` handling to `SocialLoginGroup.tsx` — the supplied `color` styles only the icon's accent backing via `style={{ backgroundColor: color }}` (React prop, CSP-safe per research.md R5), never the button surface or text
- [X] T020 [US3] Add the 3 example custom entries as fixed markup to `src/components/social-login/social-login.html` (research.md R7)
- [X] T021 [US3] Update `tests/react-harness/src/social-login-buttons-main.tsx` to include the 3 custom entries alongside the 5 presets

**Checkpoint**: All 3 user stories independently functional — `SocialLoginGroup` ships with 5 governed presets + a working custom-entry mechanism, demonstrated with at least 8 total example configurations (spec.md SC-004).

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T022 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes
- [X] T023 [P] Run `npm run audit:contrast` — confirm zero new findings (research.md R4 — the default neutral appearance introduces no new text/background pairing)
- [X] T024 Run the full `social-login-buttons.spec.ts` suite across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures (90/90 passed)
- [X] T025 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions. Result: 5977 passed / 5 failed / 30 skipped = 6012, reconciled against a fresh `--list` (6012 total: 5922 prior + 90 new). 4 of the 5 failures are the pre-existing known-flaky menubar test; the 5th (`theme-restyle.spec.ts` aqua theme) reproduced 5/5 clean in isolation — confirmed transient, non-blocking. `gallery-showcase.spec.ts` bumped 113 → 114 (no new `CATEGORIES` entry — reused "Forms, Validation & Inputs").
- [X] T026 Draft the constitution amendment documenting the new `SocialLoginGroup` component, the `providerBrand` non-theme-reactive token exception (plan.md Complexity Tracking), and the AAA-vs-brand-color research finding (research.md R1). Version bumped 1.31.0 → 1.32.0.

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phase 2 (T002-T004, blocking — every preset needs the token + class shell) → Phases 3-5 (each independently testable once Phase 2 is done) → Phase 6 (Polish, depends on all 3 stories).
- T002 before T006/T007 (icons reference `providerBrand` accents); T003/T004 before T010/T011 (markup needs the classes to exist).
- US2 (T013-T016) and US3 (T017-T021) both extend `SocialLoginGroup.tsx` from US1 (T008) — sequential on that one file, but each still independently testable once its own tasks land.

## Implementation Strategy

**MVP = User Story 1** (the 5 governed presets, static config) — the
dominant real-world use case per research.md's own industry-guidance
citation. US2 (per-provider async state) and US3 (custom entries) each
ship independently on top of it.

## Follow-up (out of this feature's scope, flagged during planning)

A significant pre-existing gap was found while foundational work for
this feature was being scoped: **every component class from features
028 through 034 (~40 components) was never duplicated into
`packages/react/src/styles.css`**, so the published
`@professional-design-system/react` package has been shipping those
components with zero compiled CSS. This feature's own Phase 2 (T004)
does not repeat that mistake, but the historical gap itself is a
separate, larger remediation effort (verify + duplicate ~40 components'
worth of classes, rebuild, full regression) that the user has chosen to
address as its own follow-up rather than block this feature on.
