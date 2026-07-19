---

description: "Task list for 2026 External Design-Trend Adoption (feature 045)"
---

# Tasks: 2026 External Design-Trend Adoption

**Input**: Design documents from `/specs/045-2026-trend-adoption/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Existing Playwright suite serves as the regression safety net; no new test framework introduced.

## Phase 1: Setup

- [ ] T001 Download the official Inter variable font (`InterVariable.woff2`, SIL Open Font License, rain.svg source: Google/rsms Inter releases) into `public/fonts/InterVariable.woff2`

## Phase 2: Foundational

*(none — this feature's three stories touch independent files with no shared blocking prerequisite)*

## Phase 3: User Story 1 - The catalog's own typography actually renders as designed (P1) 🎯 MVP

- [X] T002 [P] [US1] ~~Investigate~~ confirmed during planning: `shared/design-tokens.ts`'s `fontFamily.sans` has always declared `["Inter", "system-ui", "sans-serif"]` but no font asset/`@font-face`/CDN link exists anywhere (research.md finding)
- [ ] T003 [US1] Add an `@font-face` rule for `InterVariable.woff2` to `src/styles/tailwind.css` (`font-family: "Inter"`, `font-weight: 100 900`, `font-display: swap`, `src: url("/fonts/InterVariable.woff2") format("woff2-variations")` with a `format("woff2")` fallback); depends on T001
- [ ] T004 [US1] Run `npm run dev`, verify in browser dev tools (Network + Computed styles) that Inter now actually loads and applies (quickstart.md §1); depends on T003
- [ ] T005 [US1] Run `npm run test:e2e`; for any visual-regression failure caused by the font actually rendering (not a pre-existing failure), regenerate only that component's snapshot (`npx playwright test <file> --update-snapshots`) after visually confirming the new output is correct, not broken; depends on T004
- [ ] T006 [US1] Run a production build (`npm run build`) and check bundle/LCP impact stays within `rules/web/performance.md` budgets; depends on T003

**Checkpoint**: Inter actually renders catalog-wide, with no coverage/performance regression.

---

## Phase 4: User Story 2 - Dark mode respects the visitor's system preference on first visit (P2)

- [X] T007 [P] [US2] Create `packages/react/src/hooks/usePrefersColorScheme.ts`, mirroring `usePrefersReducedMotion.ts`'s exact shape (`window.matchMedia('(prefers-color-scheme: dark)')`, SSR-safe guard, change-listener cleanup)
- [X] T008 [US2] Modify `src/scripts/theme-switcher.js`'s `resolveInitialTheme()`: when nothing valid is stored, check `prefers-color-scheme: dark` — if true, return `"dim"` instead of `DEFAULT_THEME = "light"`. **Correction from plan**: uses `"dim"`, not `"business"` — discovered during implementation that `DarkModeToggle.tsx` already treats `"dim"` as light's established binary dark counterpart (`DARK_THEME_ID = "dim"`); reusing that existing precedent instead of introducing a second, inconsistent default. Also updated `tests/e2e/theme-persistence.spec.ts`'s two existing "falls back to light" tests to pin `page.emulateMedia({ colorScheme: "light" })` (they implicitly relied on the runner's own OS preference before, which is now a real branch in the code) and added 2 new tests for the dark-preference path — 6/6 pass.
- [X] T009 [US2] Executed via the updated `theme-persistence.spec.ts` (chromium-1440, 6/6 passed): OS dark preference + no stored choice → seeds `"dim"`; stored choice present → always wins over OS preference, matching `quickstart.md` §2 exactly
- [X] T010 [US2] Executed `quickstart.md` §3: `grep -n "neutral-50: 0 0 0" src/styles/themes.css` — zero matches confirmed (FR-005 audit, already satisfied per research.md R4)

**Checkpoint**: First-time visitors get the right theme by default; manual choice is never overridden.

---

## Phase 5: User Story 3 - Two new style-direction options documented (P3)

- [X] T011 [P] [US3] Added "Organic/Fluid" and "3D/Immersive" entries to `.specify/memory/constitution.md`'s new "2026 Style Direction Extensions (feature 045)" subsection, with description/applicability/constraint each; bumped constitution to v1.39.0 (MINOR) with a Sync Impact Report entry
- [X] T012 [US3] Confirmed via `git status --short packages/react/src src/components`: only the new `usePrefersColorScheme.ts` hook appears (untracked) — zero existing components modified (FR-007/SC-005)

**Checkpoint**: New vocabulary documented; zero existing components retrofitted.

---

## Phase 6: Polish

- [ ] T013 Run `npm run verify` (typecheck → token audit → contrast audit → build → full E2E) as a final combined check across all three stories
- [ ] T014 [P] Run `graphify update .` to sync the knowledge graph after all changes land

---

## Dependencies & Execution Order

- Setup (T001) blocks US1's T003.
- US1 (T002-T006), US2 (T007-T010), and US3 (T011-T012) touch entirely different files (`tailwind.css`+font asset vs. `theme-switcher.js`+new hook vs. `constitution.md`) and have no dependency on each other — fully parallelizable as three independent stories.
- T012 (US3's no-retrofit confirmation) reads the diff from all three stories, so it runs last, after T003/T008/T011 land.
- Polish (T013-T014) depends on all three stories being complete.

### Parallel Opportunities

- T001 (font download) + T007 (new hook) + T011 (constitution doc) can all start immediately, in parallel — no shared files.
- T013 + T014 in Polish are independent, parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T001 → T003 → T004 → T005 → T006. This alone fixes the actual, previously-undiscovered typography defect — the highest-value, most surprising finding from this feature.

### Incremental Delivery

1. US1 (font fix) → verify → this is the MVP, ships real user-visible value on its own.
2. US2 (dark-mode seeding) → verify independently.
3. US3 (documentation) → verify independently.
4. Polish → final combined verification.
