---

description: "Task list for External Package Consumption (feature 048)"
---

# Tasks: External Package Consumption

**Input**: Design documents from `/specs/048-external-package-consumption/`

**Tests**: no automated test framework applies to documentation/packaging artifacts — verification is the quickstart.md's own scripted steps (an external throwaway project), not a Playwright/unit-test suite. This matches the feature's own nature (FR-001 through FR-006 are documentation/process requirements), not a gap in rigor.

## Phase 1: Setup

- [X] T001 Created `docs/` directory at repo root for `docs/PUBLISHING.md`

## Phase 2: Foundational

- [X] T002 Added `packages/react/LICENSE` (MIT, confirmed with the project owner) and set `"license": "MIT"` plus a `repository` field in `packages/react/package.json`

**Checkpoint**: package has a real, stated license.

## Phase 3: User Story 1 - Installing and rendering a first component in an external project (P1) 🎯 MVP

- [X] T003 [US1] Built, typechecked, and packed `packages/react` (`npm pack --workspace packages/react --pack-destination /tmp`)
- [X] T004 [US1] Installed the tarball into a throwaway Vite+React scaffold (`/tmp/external-consumer-verify`, genuinely outside this repo's npm workspaces), imported `Button`+`Modal`+stylesheet, rendered and screenshotted both, exercised the `data-theme` mechanism — Acceptance Scenarios 1-2 passed on the first attempt; **Scenario 3 (theming) initially FAILED** (see the real defect below), then passed after the fix
- [X] T005 [US1] Confirmed the installed `dist/styles.css` has zero unprocessed `@tailwind`/`@apply`/`@layer` at-rules — the non-Tailwind-consumer Edge Case is unfounded (research.md R6)
- [X] **T006 [US1] Real, major defect found and fixed**: `data-theme` attribute switching did nothing at all for any npm consumer. Root cause: `packages/react/src/styles.css` had, since an earlier feature, hand-copied only the default/light theme's `:root` custom-property values (a deliberate but undocumented-to-consumers scope decision: "this package ships no theme switcher of its own") instead of the full 43-theme system that `src/styles/themes.css` defines and the main site imports. Confirmed empirically in the external throwaway project: `--color-brand-dark` was byte-identical between `data-theme="light"` and `data-theme="dim"`. **Presented to the user as a real scope decision** (ship all 43 themes vs. document the limitation vs. a small light/dark subset) rather than assumed unilaterally, since it's a real bundle-size trade-off — user chose full parity. Fixed by replacing the hand-copied block with `@import "../../../src/styles/themes.css";`, which also closes off the "hand-maintained CSS subset drifts from source" defect class found three other times this session (single source of truth now). **A second, smaller defect surfaced during the fix itself**: the `@import` initially compiled with no error but produced zero theme rules, because it was placed after the `@tailwind` directives — CSS silently drops an `@import` that isn't the first rule in a stylesheet. Fixed by moving it to the top of the file. Re-verified in the same external project after rebuilding: theme switching now works, confirmed both via computed-style inspection and a visual screenshot (button re-colors from blue to green on `data-theme="dim"`). `dist/styles.css` grew from 88KB to 161KB (22KB → gzipped, well within the `<50KB` App-page CSS budget). Full `tests/e2e/react-*.spec.ts` suite (288 tests) re-run afterward: zero regression.
- [X] T007 [US1] Cleaned up: removed the throwaway external-consumer project and all temp tarballs/debug files

**Checkpoint**: real, external installability — including full theme parity — is proven, not assumed.

## Phase 4: User Story 2 - Understanding what's available and how to use it correctly (P1)

- [X] T008 [P] [US2] Wrote `packages/react/README.md`: description, install command, usage snippet, the non-obvious setup requirements (CSS import; `data-theme` theming, now genuinely accurate after T006's fix; peer-dependency range — including an honest note that React 19 isn't yet an officially verified peer, discovered when the default `npm create vite` scaffold installed 19 and required an explicit React 18 downgrade to proceed), pointer to `src/index.ts`, license line
- [X] T009 [P] [US2] Refreshed the root `README.md`'s "React package" section and its earlier project-structure listing: replaced the stale "14 of the components"/"10 components" figures with the actual 137, added a pointer to `packages/react/README.md` as the authoritative doc instead of duplicating its content
- [X] T010 [US2] Verified the export count directly (`Object.keys(require(...dist/index.cjs)).length` → 137) matches exactly what both READMEs now state (SC-004)

**Checkpoint**: a developer unfamiliar with this codebase can install and correctly use any component using only the package's own documentation.

## Phase 5: User Story 3 - Confidence that the package won't silently break on the next update (P2)

- [X] T011 [P] [US3] Wrote `packages/react/CHANGELOG.md` in Keep a Changelog format: `[Unreleased]` documents this feature's own additions/fixes (LICENSE/README/CHANGELOG added; the theme-switching fix), `[0.1.0]` describes the pre-existing shipped state retroactively as a baseline
- [X] T012 [P] [US3] Wrote `docs/PUBLISHING.md`: changelog-update step, version bump, build+typecheck+audit verification, tarball-contents sanity check, the actual `npm publish` command, and a tag-push step — explicitly framed as a human-run runbook, not something this session executes (no registry credentials available, and publishing is an irreversible public action)
- [X] T013 [US3] Read `docs/PUBLISHING.md` start to finish; steps 1-4 are unambiguous and were in fact just executed live during T003-T006 (build/typecheck/audit/pack all really ran) — step 5 (actual publish) intentionally not executed

**Checkpoint**: a future version bump has a defined, repeatable process and consumers have a real changelog to consult.

## Phase 6: Polish

- [X] T014 Ran `npm run typecheck --workspace packages/react`, `npm run audit:tokens`, `npm run audit:contrast` (all pass, contrast's printed lines are pre-existing documented `KNOWN_THEME_CONTRAST_GAPS`, not new failures), and the full `tests/e2e/react-*.spec.ts` suite (288 passed, 1 pre-existing skip) — zero regression from the theme-import change
- [X] T015 [P] Ran `graphify update .` to sync the knowledge graph after all changes landed

---

## Dependencies & Execution Order

- Setup (T001) has no dependencies.
- Foundational (T002, the license) blocks T008 (package README references the license) — must complete before Phase 4.
- Phase 3 (US1, T003-T007) is independent of Foundational's license work and can run in parallel with it, but should complete before Phase 4/5's documentation describes a verified-working package.
- Phase 4 (US2, T008-T010): T008/T009 are parallel (different files), T010 depends on both.
- Phase 5 (US3, T011-T013): T011/T012 are parallel (different files), T013 depends on T012.
- Polish depends on everything above.

### Parallel Opportunities

- T008 and T009 (different README files).
- T011 and T012 (different files, different concerns).
- T015 is parallel with T014.

## Implementation Strategy

### MVP First

1. T002 (license) — closes the single hardest adoption blocker first.
2. T003-T007 (US1) — proves real external installability actually works (or fixes it if it doesn't). This is the load-bearing verification the rest of the feature's documentation claims depend on.
3. **STOP and VALIDATE**: external consumer project renders correctly, themes correctly, no defects outstanding.

### Incremental Delivery

1. Foundational (license) → real adoptability unblocked.
2. US1 → proven, working external installation (MVP).
3. US2 → documentation so a stranger can actually use what US1 proved works.
4. US3 → sustained-adoption confidence (changelog + publish process).
5. Polish → final verification + graphify sync.
