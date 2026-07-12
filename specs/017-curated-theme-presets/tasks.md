# Tasks: Curated Theme Presets

**Input**: Design documents from `/specs/017-curated-theme-presets/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md,
contracts/*.md (3 files), quickstart.md, constitution.md (v1.13.0)

**Tests**: Included — Playwright visual regression + axe-core, per this
project's established discipline, PLUS a parametrized contrast-audit
script run per theme (not 42x manual verification, per research.md R2).

**Organization**: This is the largest-scope feature in this project's
history (42 themes). Tasks are organized in 7 phases, NOT as 42 flat
"add theme X" tasks in one phase, matching plan.md's explicit Scale/
Scope batching decision: architecture → contrast-audit parametrization →
persistence+gallery → 5-theme P1 pilot batch → 3 batches of ~12-13
covering the remaining ~37 → polish.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Architecture — CSS custom property token migration (P1, MVP)

**Goal**: Every existing component restyles via a `data-theme` attribute
switch with ZERO markup/component-file changes (research.md R1).
**Independent test**: switch `data-theme` on `<html>` between two values
and confirm a representative component sample restyles live.

- [ ] T001 [P] Write `tests/e2e/theme-architecture.spec.ts` FIRST:
      assert that setting `document.documentElement.dataset.theme =
      "poc-test"` (a temporary throwaway value used only for this one
      test, added as a minimal extra `[data-theme="poc-test"]` block in
      a scratch stylesheet included ONLY by this test's fixture page,
      never shipped) changes a representative component sample's
      (Button, Badge, Card, Alert, TextInput) computed background/text/
      ring colors, AND assert that `bg-success/5`-style opacity-modifier
      utilities still compute the correct alpha-blended color under a
      non-default theme (contract: contracts/theme-tokens.contract.md)
      — confirm it FAILS against the current static-hex
      `tailwind.config.ts`
- [ ] T002 Migrate `shared/design-tokens.ts`'s `colors` export from
      static hex strings to the RGB-tuple CSS-custom-property reference
      pattern (research.md R1): `brand.light/DEFAULT/dark`,
      `neutral.50-900` (10 shades), `success/warning/error/info.DEFAULT/
      strong` — each becomes `"rgb(var(--color-<name>) / <alpha-value>)"`
- [ ] T003 Update `tailwind.config.ts` to import the migrated `colors`
      export unchanged (no structural change needed here beyond what
      T002 already produces upstream)
- [ ] T004 Update `packages/react/tailwind.config.ts` identically, to
      keep both configs importing from the same
      `shared/design-tokens.ts` source of truth (matching this
      project's existing anti-drift discipline, feature 004's
      research.md)
- [ ] T005 Create `src/styles/themes.css` with the `:root,
      [data-theme="light"]` block (contracts/theme-tokens.contract.md) —
      convert this catalog's CURRENT existing 21 hex values (the ones
      T002 just moved out of `design-tokens.ts`) to space-separated RGB
      triplets, one `--color-*` custom property per token. This block
      MUST produce byte-identical visual output to today — it is a pure
      refactor of the existing single palette, not a new theme
- [ ] T006 Import `themes.css` in `src/styles/tailwind.css` (or the
      appropriate build entry point) so it loads on every page
- [ ] T007 Re-run the FULL existing Playwright visual regression suite
      (all ~48 previously-shipped components' own baselines) locally and
      confirm ZERO diffs — this proves T002-T006's refactor changed
      nothing visually for the default theme
- [ ] T008 Re-run T001's assertions — confirm they now PASS

**Checkpoint**: The architecture itself is proven — theme switching
works, opacity modifiers survive the migration, and the default theme is
visually unchanged.

---

## Phase 2: Contrast audit parametrization (P1, MVP)

**Goal**: 42 themes' WCAG AAA/AA compliance is verified by ONE
parametrized script run, not 42 manual computations (research.md R2).
**Independent test**: run the parametrized script and confirm the
"light" theme's existing pairings still report identically to today.

- [ ] T009 Extend `scripts/check-contrast.mjs` per
      contracts/theme-tokens.contract.md's parametrization pattern: add
      a themes loop that re-resolves each `PAIRINGS`/`RING_PAIRINGS`
      entry's `fg`/`bg` token names against a new per-theme token map
      (imported from `shared/design-tokens.ts`'s new theme-definitions
      export, added in this task), reporting `[theme: <id>] <name>:
      <ratio> — below required <threshold>` per failure. The existing
      single-theme `TOKENS` lookup becomes the "light" theme's entry in
      this new map — do NOT duplicate the pairing arrays themselves
- [ ] T009a Add a completeness check to `scripts/check-contrast.mjs`'s
      themes loop (T009): before running any pairing check, assert that
      every theme entry in the theme-definitions map declares all 21
      required `--color-*` properties (contracts/theme-tokens.contract.md
      — a `/speckit-analyze` finding, F1, that this MUST-level
      requirement had no corresponding task). A theme silently missing a
      property falls back to `:root`'s ("light"'s) value for that one
      property, which would otherwise pass the contrast audit
      undetected while shipping a broken/incomplete theme — fail loudly
      instead, listing which theme(s) and which missing propert(y/ies)
- [ ] T010 Run `node scripts/check-contrast.mjs` and confirm the
      "light" theme's existing 23 text + 6 non-text pairings report
      IDENTICALLY to their pre-parametrization results (23 pass, 6 pass)
      — proving the parametrization itself introduced zero behavior
      change for the one existing theme

**Checkpoint**: The compliance-verification bottleneck is solved — every
future theme batch just needs its token values added to the map and one
script run, not hand-computed contrast math.

---

## Phase 3: Persistence + gallery (P1, MVP)

**Goal**: A user can browse themes, select one, and have it persist and
apply consistently. **Independent test**: select a theme in the gallery,
reload, confirm it's still active; visit an unrelated existing
component's own page and confirm it also reflects the selection.

- [ ] T011 [P] Write `tests/e2e/theme-persistence.spec.ts` FIRST per
      contracts/theme-switcher.contract.md: assert `resolveInitialTheme`
      returns the stored value when it's a known theme id, returns the
      default ("light") when `localStorage` is empty, and returns the
      default when the stored value is an unrecognized/corrupted string
      — confirm it FAILS (module doesn't exist yet)
- [ ] T012 Create `src/scripts/theme-switcher.js` implementing
      `resolveInitialTheme`, `applyTheme`, `selectTheme` exactly per
      contracts/theme-switcher.contract.md, using `localStorage` key
      `pds-theme`
- [ ] T013 Re-run T011's assertions — confirm they now PASS
- [ ] T014 [P] Write `tests/e2e/theme-gallery.spec.ts` FIRST per
      contracts/theme-gallery.contract.md: assert at least the "light"
      theme's card renders with the correct `data-theme-id`, assert
      clicking a card sets `aria-pressed="true"` on it and `"false"` on
      all others, assert the preview region's representative components
      restyle after a click, and assert ZERO elements have an inline
      `style="..."` attribute anywhere on the page (swatch colors MUST
      be set via CSSOM, per the CSP lesson from feature 014 R12) —
      confirm it FAILS (page doesn't exist yet)
- [ ] T015 Create `src/components/theme-gallery/theme-gallery.html` per
      contracts/theme-gallery.contract.md: one `<section>` per mood
      family (7, matching research.md R3's categories), one
      `.theme-card` per theme currently defined in `themes.css` (just
      "light" at this point — more appear automatically as later phases
      add themes, since cards are generated from the same theme-
      definitions map `check-contrast.mjs` now reads in T009), a
      preview region with Button/Badge/Card/Alert/TextInput, wired to
      `theme-switcher.js`. Swatch colors set via
      `element.style.backgroundColor = ...` (CSSOM), never inline HTML
      `style="..."`
- [ ] T016 Add `.theme-card`/`.theme-card-swatches`/`.theme-card-swatch`
      `@apply` blocks to `src/styles/tailwind.css` per
      contracts/theme-gallery.contract.md
- [ ] T017 Register `theme-gallery` in `vite.config.ts`'s
      `rollupOptions.input` and add a Theme Gallery card to `index.html`'s
      gallery
- [ ] T018 Re-run T014's assertions — confirm they now PASS

**Checkpoint**: The full pipeline (architecture + audit + gallery +
persistence) works end-to-end for the one existing "light" theme. Ready
to prove it generalizes to genuinely new themes.

---

## Phase 4: First 5 new themes — one per mood family (P1, MVP)

**Goal**: Prove the full pipeline works for real, additional themes, not
just the pre-existing default — one theme from each of 5 different mood
families (research.md R3), using REAL published values fetched during
planning (research.md R6), not invented ones.

For EACH of the 5 themes below: (a) convert its real OKLCH source values
(research.md R6) to sRGB, then to space-separated RGB triplets; (b) add
its `[data-theme="<id>"]` block to `themes.css`; (c) add its entry to the
theme-definitions map (`shared/design-tokens.ts`) that both
`check-contrast.mjs` (T009) and the gallery (T015) read from; (d) run
`node scripts/check-contrast.mjs` and confirm it passes for this theme —
if any pairing fails, adjust that theme's `-dark`/`-strong`/neutral-900
value and re-run until it passes (real iteration against the automated
gate, never skipped); (e) add a Playwright visual regression baseline
applying this theme to the representative component sample.

- [ ] T019 [P] [US-THEMES] Add **Corporate** (light professional,
      DaisyUI source) — `src/styles/themes.css`,
      `shared/design-tokens.ts`
- [ ] T020 [P] [US-THEMES] Add **Forest** (nature/earth, DaisyUI
      source) — `src/styles/themes.css`, `shared/design-tokens.ts`
- [ ] T021 [P] [US-THEMES] Add **Nord** (cool/tech minimal — decide
      during this task whether to follow DaisyUI's light re-
      interpretation or the original project's dark Polar Night base,
      per research.md R6's explicit note that either is a valid real
      reference; document the choice made) — `src/styles/themes.css`,
      `shared/design-tokens.ts`
- [ ] T022 [P] [US-THEMES] Add **Dracula** (dark vibrant/expressive —
      decide during this task whether to follow DaisyUI's OKLCH
      re-expression or the original standalone project's raw hex
      values, per research.md R6; document the choice made) —
      `src/styles/themes.css`, `shared/design-tokens.ts`
- [ ] T023 [P] [US-THEMES] Add **Business** (dark moody/professional,
      DaisyUI source) — `src/styles/themes.css`,
      `shared/design-tokens.ts`
- [ ] T024 For each of T019-T023: run `node scripts/check-contrast.mjs`,
      confirm all 5 pass (iterate on any that fail per the loop
      described above)
- [ ] T025 Confirm all 5 new themes automatically appear as gallery
      cards (T015's design reads from the same theme-definitions map) —
      no separate gallery markup edit needed per theme
- [ ] T026 Add Playwright visual regression baselines for the
      representative component sample under each of the 5 new themes
      (320/768/1024/1440px, matching this project's standard breakpoints)

**Checkpoint**: 6 themes shipped (light + 5 new), one per mood family
plus the default, proving the pipeline generalizes. 36 themes remaining
across 3 batches.

---

## Phase 5: Batch 2 — ~12-13 themes (P2)

Same per-theme procedure as Phase 4 (real values → CSS block → map
entry → contrast audit pass → visual baseline), covering the remainder
of the **Light Professional**, **Warm/Organic Light**, and
**Nature/Earth** mood families from research.md R3 (minus the ones
already shipped in Phase 4):

- [ ] T027 [P] [US-THEMES] Add **Cosmo** (Bootswatch)
- [ ] T028 [P] [US-THEMES] Add **Flatly** (Bootswatch)
- [ ] T029 [P] [US-THEMES] Add **Litera** (Bootswatch)
- [ ] T030 [P] [US-THEMES] Add **Lumen** (Bootswatch)
- [ ] T031 [P] [US-THEMES] Add **Zephyr** (Bootswatch)
- [ ] T032 [P] [US-THEMES] Add **Silk** (DaisyUI)
- [ ] T033 [P] [US-THEMES] Add **Winter** (DaisyUI)
- [ ] T034 [P] [US-THEMES] Add **Cupcake** (DaisyUI)
- [ ] T035 [P] [US-THEMES] Add **Sandstone** (Bootswatch)
- [ ] T036 [P] [US-THEMES] Add **Garden** (DaisyUI)
- [ ] T037 [P] [US-THEMES] Add **Autumn** (DaisyUI)
- [ ] T038 [P] [US-THEMES] Add **Lemonade** (DaisyUI)
- [ ] T039 [P] [US-THEMES] Add **Caramellatte** (DaisyUI)
- [ ] T040 For each of T027-T039: fetch/confirm real source values
      (matching research.md R6's method — DaisyUI's own theme CSS
      source or Bootswatch's own published SCSS variables, not invented),
      run the contrast audit, iterate until passing
- [ ] T041 Add Playwright visual regression baselines for all 13 themes
      added in this batch

**Checkpoint**: 19 themes shipped.

---

## Phase 6: Batch 3 — ~12-13 themes (P3)

Same per-theme procedure, covering the remainder of **Nature/Earth**,
**Cool/Tech Minimal**, and part of **Dark Moody/Professional**:

- [ ] T042 [P] [US-THEMES] Add **Everforest** (community — fetch real
      published values from the Everforest project's own repository)
- [ ] T043 [P] [US-THEMES] Add **Gruvbox** (community — fetch real
      published values from the Gruvbox project's own repository)
- [ ] T044 [P] [US-THEMES] Add **Aqua** (DaisyUI)
- [ ] T045 [P] [US-THEMES] Add **Emerald** (DaisyUI)
- [ ] T046 [P] [US-THEMES] Add **Slate** (Bootswatch)
- [ ] T047 [P] [US-THEMES] Add **Spacelab** (Bootswatch)
- [ ] T048 [P] [US-THEMES] Add **Cerulean** (Bootswatch)
- [ ] T049 [P] [US-THEMES] Add **Quartz** (Bootswatch)
- [ ] T050 [P] [US-THEMES] Add **Journal** (Bootswatch)
- [ ] T051 [P] [US-THEMES] Add **Dim** (DaisyUI)
- [ ] T052 [P] [US-THEMES] Add **Night** (DaisyUI)
- [ ] T053 [P] [US-THEMES] Add **Darkly** (Bootswatch)
- [ ] T054 [P] [US-THEMES] Add **Cyborg** (Bootswatch)
- [ ] T055 For each of T042-T054: fetch/confirm real source values per
      research.md R6's method (DaisyUI/Bootswatch's own published theme
      source, or each community project's own repository for
      Everforest/Gruvbox — never invented), run the contrast audit,
      iterate until passing
- [ ] T056 Add Playwright visual regression baselines for all 13 themes
      added in this batch

**Checkpoint**: 32 themes shipped.

---

## Phase 7: Batch 4 — remaining ~10 themes (P4)

Same per-theme procedure, covering the remainder of **Dark Moody/
Professional**, **Dark Vibrant/Expressive**, and **Distinctive/
Characterful**:

- [ ] T057 [P] [US-THEMES] Add **Superhero** (Bootswatch)
- [ ] T058 [P] [US-THEMES] Add **Abyss** (DaisyUI)
- [ ] T059 [P] [US-THEMES] Add **Synthwave** (DaisyUI)
- [ ] T060 [P] [US-THEMES] Add **Cyberpunk** (DaisyUI)
- [ ] T061 [P] [US-THEMES] Add **Tokyo Night** (community — fetch real
      published values from the Tokyo Night project's own repository)
- [ ] T062 [P] [US-THEMES] Add **Halloween** (DaisyUI)
- [ ] T063 [P] [US-THEMES] Add **Luxury** (DaisyUI)
- [ ] T064 [P] [US-THEMES] Add **Retro** (DaisyUI)
- [ ] T065 [P] [US-THEMES] Add **Coffee** (DaisyUI)
- [ ] T066 [P] [US-THEMES] Add **Rose Pine** (community — fetch real
      published values from the Rose Pine project's own repository)
- [ ] T067 [P] [US-THEMES] Add **Catppuccin** (community — fetch real
      published values from the Catppuccin project's own repository;
      pick one of its 4 official flavors as this catalog's single
      curated entry, matching research.md R3's note)
- [ ] T068 For each of T057-T067: fetch/confirm real source values per
      research.md R6's method (DaisyUI/Bootswatch's own published theme
      source, or each community project's own repository for Tokyo
      Night/Rose Pine/Catppuccin — never invented), run
      the contrast audit, iterate until passing
- [ ] T069 Add Playwright visual regression baselines for all 11 themes
      added in this batch

**Checkpoint**: 43 themes shipped (6 from Phase 4 [light + 5 new] + 13
from Phase 5 + 13 from Phase 6 + 11 from Phase 7 = 43) — SC-001's "at
least 40" floor cleared with a 3-theme margin. The exact final count is
not a target to hit precisely, just a floor to clear; if a theme is
dropped during implementation for a real reason (e.g. two candidates
turn out too similar after building both, per spec.md FR-009), the
remaining count still comfortably clears 40.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T070 Run the full Playwright suite locally, scoped to functional
      and axe-core assertions only (not pixel-diff visual regression for
      the ~48 pre-existing components' OWN prior baselines — matching
      established project practice). Confirm zero functional/
      accessibility regressions to any previously-shipped component AND
      confirm the "light" theme (the default) still produces
      byte-identical visual output to the pre-feature-017 baselines
      specifically (the core "pure refactor" guarantee)
- [ ] T071 Run a CSP-violation sweep on `theme-gallery.html`: a
      Playwright console-listener checking for zero "Content Security
      Policy" violation messages, and confirm zero elements have an
      inline `style="..."` attribute (swatch colors via CSSOM only, per
      T014/T015)
- [ ] T072 Run `npm run audit:tokens` across the whole `src/` tree and
      confirm zero raw palette classes were introduced. Diff
      `package.json`/lockfile against this feature's starting commit and
      confirm zero new dependencies were added
- [ ] T073 Run the final parametrized `node scripts/check-contrast.mjs`
      across all 42+ shipped themes and confirm 100% pass — zero
      exceptions (SC-003)
- [ ] T074 Code review pass over the token-migration architecture
      (`shared/design-tokens.ts`, `tailwind.config.ts`,
      `packages/react/tailwind.config.ts`, `src/styles/themes.css`),
      `theme-switcher.js`, `theme-gallery.html`, and the
      `check-contrast.mjs` parametrization — address CRITICAL/HIGH
      findings before proceeding
- [ ] T075 Generate Linux Playwright visual baselines via
      `gh workflow_dispatch` on `.github/workflows/update-snapshots.yml`
      (ubuntu-latest) — NEVER locally or via Docker. First run
      `gh run list` to check whether the GitHub Actions billing block
      that has stalled every feature since 014 has cleared; if still
      blocked, document that explicitly rather than assuming success
- [ ] T076 Run `/speckit-constitution` to document the theme
      architecture and all shipped theme names. Propose during that
      step (per plan.md's own note) whether this warrants a NEW
      top-level constitution section (e.g. "Theming & Multi-Palette
      Architecture") given its scope, rather than folding 42 theme names
      into the existing "Design Foundations" or "Component Catalog"
      sections — this is a real structural question for the constitution
      skill to resolve, not pre-decided here. MINOR version bump at
      minimum (new architecture + 42 themes, zero principle changes)
- [ ] T077 Verify CI is green on the final commit (real GitHub Actions
      run, not a local test pass) before declaring this feature shipped

---

## Dependencies & Execution Order

- **Phase 1 (Architecture)**: No dependencies beyond the existing
  scaffold. MUST complete before any other phase — every later phase
  depends on the CSS-custom-property mechanism existing.
- **Phase 2 (Contrast audit)**: Depends on Phase 1 (needs the theme-
  definitions map format Phase 1's `design-tokens.ts` changes establish).
- **Phase 3 (Persistence + gallery)**: Depends on Phases 1-2.
- **Phase 4 (First 5 themes)**: Depends on Phases 1-3. The 5 themes
  within this phase are mutually independent (`[P]` markers) — each
  touches only its own `themes.css` block + map entry.
- **Phases 5-7 (Batches 2-4)**: Each depends on Phase 4 completing (to
  confirm the pipeline generalizes) but themes WITHIN each batch are
  mutually independent (`[P]` markers).
- **Phase 8 (Polish)**: Depends on ALL prior phases completing.

## Parallel Execution Examples

Within Phase 4, all 5 themes can be worked in parallel (disjoint CSS
blocks + map entries):

```
T019 [P] Corporate
T020 [P] Forest
T021 [P] Nord
T022 [P] Dracula
T023 [P] Business
```

The same pattern applies within Phases 5-7 — every theme-addition task
in a batch touches only its own `themes.css` block and its own map
entry, so all can proceed in parallel within that batch.

## Implementation Strategy

### MVP First (Phases 1-4 only)

Complete Phases 1-4 (T001-T026) and stop — the architecture, contrast-
audit parametrization, gallery, persistence, and 6 total themes (light +
5 new, one per mood family) are independently valuable and prove the
entire pipeline works end-to-end, before taking on the remaining ~36-37
themes' comparatively repetitive-but-real per-theme work.

### Incremental Delivery

1. Phase 1 → architecture proven, zero visual change for existing users
2. Phase 2 → contrast bottleneck solved
3. Phase 3 → gallery + persistence working
4. Phase 4 → MVP checkpoint: 6 themes, one per mood family, ship/demo
5. Phase 5 → 19 themes, ship/demo
6. Phase 6 → 32 themes, ship/demo
7. Phase 7 → 42+ themes, full scope met
8. Phase 8 → polish, catalog documentation, CI verification, final ship
