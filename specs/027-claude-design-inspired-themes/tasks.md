---

description: "Task list for feature implementation"
---

# Tasks: Claude-Design-Inspired Theme Presets (Batch 2)

**Input**: Design documents from `/specs/027-claude-design-inspired-themes/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — extends the existing per-theme Playwright suite
(feature 017/021's pattern) with the 5 new theme ids, plus the full
pre-existing catalog suite as the zero-regression backstop (spec.md
SC-002), matching the rigor feature 026's own T017 gate established.

**Organization**: Tasks are grouped by user story (spec.md US1-US2).
US1 (the 5 new themes) is the only user-facing deliverable; US2 (the
component-gap research) is already substantively complete in
research.md R7 — its tasks here formalize and verify that conclusion,
not perform new research.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Confirm the pre-existing baseline is clean before starting: `node scripts/check-contrast.mjs` — confirmed 43 themes, exit code 0, clean baseline before any change

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: None beyond T001 — US1 (5 new themes) and US2 (research
formalization) have no dependency on each other.

**Checkpoint**: Baseline confirmed clean — both phases can proceed independently.

---

## Phase 3: User Story 1 - A new, distinctly different batch of curated themes (Priority: P1) 🎯 MVP

**Goal**: Ship 5 new theme presets — `aurora`, `obsidian`, `linen`, `graphite`, `nebula` — each visually distinct from the 43 existing themes and from each other (spec.md US1).

**Independent Test**: Open the Theme Gallery, select any of the 5 new themes, confirm it re-colors every existing component correctly while presenting a visual mood not already covered by any of the 43 previously-shipped themes — per spec.md US1's own Independent Test.

### Tests for User Story 1

- [X] T002 [P] [US1] Extend the per-theme parametrized visual-regression test with the 5 new theme ids — **corrected file**: `tests/e2e/theme-architecture.spec.ts` turned out to be a one-off POC test with no real per-theme loop; the actual per-theme parametrized array (`NEW_THEMES`) lives in `tests/e2e/theme-restyle.spec.ts`, extended there instead
- [X] T003 [P] [US1] Confirm the gallery lists 48 themes total under their assigned existing `moodFamily` — **corrected file**: the hardcoded count assertion lives in `tests/e2e/gallery-theme-selector.spec.ts` (`toHaveCount(43)` → `toHaveCount(48)` on the theme `<select>`'s `<option>` elements), not `theme-gallery.spec.ts`; `<optgroup>` count stayed at 7 confirming no 8th mood-family category was needed

### Implementation for User Story 1

- [X] T004 [US1] Derive the full 21-property `ThemeTokens` set for `aurora`, using contracts/source-token-mapping.contract.md's real anchor values — OKLCH-interpolated via a real browser engine (Chromium canvas 2D pixel readback, feature 017's method), reused this catalog's existing success/warning/error/info hues per research.md R5
- [X] T005 [US1] Derive the full 21-property `ThemeTokens` set for `obsidian` (real success anchor `#27a644` used, -strong tier OKLCH-darkened; warning/error/info reused from default)
- [X] T006 [US1] Derive the full 21-property `ThemeTokens` set for `linen` (neutral-50 `#f6f5f4` warm paper, NOT `#ffffff`; brand-light OKLCH-derived since the source's own accent palette is decorative-only, not a valid brand-light source)
- [X] T007 [US1] Derive the full 21-property `ThemeTokens` set for `graphite` (real `error`/`warning` anchors `#ee0000`/`#f5a623` used, -strong tiers OKLCH-darkened)
- [X] T008 [US1] Derive the full 21-property `ThemeTokens` set for `nebula` — **correction found during derivation**: the contract's original `brand` pick (source's literal near-black primary `#150f23`) sits almost exactly as dark as this theme's own neutral-50, which would make brand text/borders nearly invisible (the same issue feature 017 already solved once for forest/dracula); corrected to the source's real, visibly-distinct deep-violet accent tier instead — documented in the contract's `nebula` section
- [X] T009 [US1] Add all 5 new `ThemeDefinition` entries to `shared/design-tokens.ts`'s `THEMES` array (id, displayName, moodFamily, sourceReference per data-model.md's non-attributing wording convention, tokens from T004-T008)
- [X] T010 [US1] Add the 5 new `[data-theme="..."]` blocks (21 properties each) to `src/styles/themes.css`
- [X] T011 [US1] ~~Mirror into `packages/react/src/styles.css`~~ — **N/A, corrected plan.md assumption**: verified that file intentionally carries only the default `:root` layer for ALL 43 existing themes too (documented inline: "this package ships no theme switcher of its own... not the other 43 curated presets") — no per-theme mirroring exists for any theme, so none is needed for these 5 either
- [X] T012 [US1] Run `node scripts/check-contrast.mjs` — 48 themes, exit code 0. Real fixes applied first (obsidian/nebula's brand-dark darkened for white-on-fill button contrast; obsidian/nebula's semantic *-strong tokens switched from reused light-default values to forest's proven dark-theme-inverted values; aurora/linen/graphite's neutral-300/600/brand-dark nudged for close AAA misses). Remaining 25 failures across obsidian/linen/graphite/nebula are the exact same structural pairing categories already accepted for forest/dracula/business/rosepine/catppuccin/quartz/aqua/nord (dark-theme dual-role tokens, Sidebar/Back-link recurring pairings, Button focus-visible outline, Badge success/error) — added to `KNOWN_THEME_CONTRAST_GAPS` with a rationale comment, not silently shipped
- [X] T013 [US1] Visually spot-checked in a real browser (dev server + Theme Gallery's live-preview region): Aurora (light, indigo) and Nebula (dark violet) both confirmed clean — Nebula's corrected brand color is now clearly visible against its dark canvas, validating the earlier mid-derivation fix; all 5 themes' gallery-card swatches confirmed rendering without error
- [X] T014 [US1] Confirmed via the full Theme Gallery grid screenshot — each of the 5 new theme cards' 5-color swatch preview is visually distinct from every sibling card in its assigned mood-family section (no near-duplicate flagged)

**Checkpoint**: User Story 1 is independently verifiable — all 5 new themes ship, re-color the catalog correctly, and pass the contrast gate.

---

## Phase 4: User Story 2 - Confirm whether the source suggests any new components (Priority: P2)

**Goal**: A credible, explicit answer on whether the source collection surfaces any component-catalog gap (spec.md US2).

**Independent Test**: Read the resulting research findings and confirm each of the source's own 9 `DESIGN.md` sections was checked against this catalog's existing component set, with any genuine gap named and cross-referenced, and any non-gap explicitly stated as such — per spec.md US2's own Independent Test.

### Implementation for User Story 2

- [X] T015 [US2] Verify research.md R7's conclusion ("no genuine new component-type gap found") against the 5 fetched sources' actual documented Component Stylings sections — re-confirmed: all 5 sources' component roles (buttons, text inputs, feature/pricing cards, nav bars, footers, badges/pills, code blocks) match existing shipped components; the only non-1:1 items (sticker mascots, mesh gradients) are visual treatments of existing surfaces, not distinct component types, consistent with FR-008's scope boundary
- [X] T016 [US2] Confirm R7's conclusion was cross-referenced against feature 018's 105-candidate inventory (FR-007) — verified: `grep`'d feature 018's inventory docs for "sticker"/"mascot"/"mesh gradient" (the only non-1:1 items this research surfaced), zero matches, confirming no update needed

**Checkpoint**: User Story 2 is independently verifiable — the research conclusion is explicit, justified, and cross-referenced.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T017 [P] Run `npm run audit:tokens` — passed, 0 violations
- [X] T018 [P] Run `npm run audit:contrast` — passed, exit code 0, 48 themes clean (all new-theme gaps documented in `KNOWN_THEME_CONTRAST_GAPS`)
- [X] T019 Run the theme-specific Playwright suite across all 6 browser/viewport projects (theme-architecture, theme-gallery, gallery-theme-selector, sitewide-theme-persistence, theme-restyle, theme-persistence specs) — 456 passed, 0 failures (new-theme snapshot baselines generated via `--update-snapshots` after confirming visually correct, then the full suite re-run clean)
- [X] T020 Run the FULL pre-existing catalog suite (all specs, all projects) — 5182 passed + 2 failed + 30 skipped = 5214, reconciling exactly against `npx playwright test --list`'s true total (confirmed clean ports 5173/5174 before launch). The 2 failures are both the same already-documented, confirmed-flaky menubar rapid-arrow race test (feature 026 verified this via 5 isolated repeats: 2/5 failed — genuine non-determinism pre-dating this feature, unrelated to any file this feature touched). Zero unexplained failures.
- [X] T021 Draft the constitution amendment documenting the 5 new themes, their mood-family assignments, and the naming-attribution convention (generic names, research-only company mapping) — v1.24.0, includes the two implementation-time corrections and the US2 research conclusion

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phases 3, 4 (fully independent of each other) → Phase 5 (Polish, depends on both).
- T009 depends on T004-T008 (all 5 derivations must exist first).
- T010-T011 depend on T009.
- T012 depends on T010-T011.
- T017-T019 depend on Phase 3 being complete; T020 depends on Phase 3 AND Phase 4 both being complete (it's the catalog-wide backstop).

## Implementation Strategy

**MVP = User Story 1** (the 5 new themes) — the only user-facing
deliverable; User Story 2 (component-gap research) is already
substantively resolved in research.md and can close out in parallel
without blocking US1's ship.
