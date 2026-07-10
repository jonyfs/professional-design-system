# Tasks: Application Shell Primitives

**Input**: Design documents from `/specs/007-application-shell-primitives/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/,
quickstart.md, constitution.md (v1.5.0)

**Tests**: Included — Playwright visual regression + `@axe-core/playwright`
accessibility scans, same pattern as every prior feature.

**Organization**: Tasks are grouped by user story (Pagination P1, Sidebar
P2, Navbar P3). No Setup/Foundational phase for existing tooling — reuses
the scaffold entirely. `scripts/audit-tokens.mjs` needs no changes (no
new tokens). `scripts/check-contrast.mjs` DOES need new
`BASE_TOKENS`/`PAIRINGS` entries for `neutral-300`-on-`neutral-900`
(Sidebar dark resting text, a real AAA correction — see research.md R3)
and `neutral-700`-on-white (Sidebar light resting text, previously
unspecified) — added as part of Phase 2's implementation, not deferred.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Same single-project static frontend layout as every prior feature:
`src/components/<name>/`, `tests/e2e/`. No `src/scripts/` additions (zero
JS this feature) and no `packages/react/` changes (FR-011).

---

## Phase 1: User Story 1 - Pagination (Priority: P1) 🎯 MVP

**Goal**: Ship a Pagination primitive with zero JavaScript — current
page marked via `aria-current`, genuinely-disabled Previous/Next at
boundaries, truncation for large ranges — per `contracts/pagination.contract.md`.

**Independent Test**: Drop the Pagination markup into a blank page and
verify the current page is visually/semantically distinct, Previous/Next
are correctly disabled/enabled, and every page link is keyboard-focusable.

### Tests for User Story 1

- [x] T001 [P] [US1] Write `tests/e2e/pagination.spec.ts`: visual
      regression at 320/768/1024/1440px for the first-page (Previous
      disabled), middle-page, and last-page (Next disabled) variants, an
      axe scan, an assertion that the current page carries
      `aria-current="page"` and a distinct visual treatment, an assertion
      that Previous/Next are genuinely `disabled` (not just styled) at
      their respective boundaries, a single-total-page assertion (both
      controls disabled, one page link shown and current), and an
      assertion that the ellipsis is `aria-hidden` and passes AAA
      contrast (`text-neutral-600`, not the `text-neutral-500`
      `/speckit-analyze` caught and corrected — `aria-hidden` exempts
      content from assistive technology, not from sighted low-vision
      users)

### Implementation for User Story 1

- [x] T002 [US1] Implement `src/components/pagination/pagination.html`
      per `contracts/pagination.contract.md` (first-page, middle-page,
      and last-page variants on the same standalone page)
- [x] T003 [US1] Add `.pagination-nav`/`.pagination-link`/
      `.pagination-link[aria-current="page"]`/`.pagination-control`/
      `.pagination-ellipsis` `@apply` classes to `src/styles/tailwind.css`
      per `data-model.md`'s Pagination composition (using `bg-brand-dark
      text-white` for the current page, not the ratified Sidebar
      pattern's literal `bg-brand text-white` — see research.md R3)
- [x] T004 [US1] Add a Pagination card to `index.html`'s gallery, linking
      to `src/components/pagination/pagination.html`
- [x] T005 [US1] Add `pagination: resolve(__dirname, "src/components/pagination/pagination.html")`
      to `vite.config.ts`'s `rollupOptions.input`
- [x] T006 [US1] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations (no new tokens; existing pairings reused)

**Checkpoint**: Pagination is independently shippable — zero JS, visually
correct at all breakpoints, AAA-compliant, wired into the gallery and the
production build.

---

## Phase 2: User Story 2 - Sidebar (Priority: P2)

**Goal**: Ship a Sidebar primitive implementing (and correcting) the
constitution's pre-existing ratified pattern — light + dark themes, one
active item — per `contracts/sidebar.contract.md`.

**Independent Test**: Drop the Sidebar markup into a blank page and
verify the active item is distinct, hover states work, and both themes
independently pass an axe-core AAA scan.

### Tests for User Story 2

- [x] T007 [P] [US2] Write `tests/e2e/sidebar.spec.ts`: visual regression
      at 320/768/1024/1440px for both light and dark themes, an axe scan
      run separately against **both** themes (not just light — the whole
      point of research.md R3's correction), an assertion that exactly
      one item carries `aria-current="page"`, and a long-label wrapping
      assertion (Edge Case)

### Implementation for User Story 2

- [x] T008 [US2] Implement `src/components/sidebar/sidebar.html` per
      `contracts/sidebar.contract.md` (light theme demo, dark theme demo,
      and a long-label item for the Edge Case)
- [x] T009 [US2] Add `.sidebar`/`.sidebar-light`/`.sidebar-dark`/
      `.sidebar-item`/`.sidebar-item-light`/`.sidebar-item-dark`/
      `.sidebar-item[aria-current="page"]` `@apply` classes to
      `src/styles/tailwind.css` per `data-model.md`'s Sidebar composition
      — using the two corrected pairs (`text-neutral-300` not `-400` for
      dark resting text; `bg-brand-dark text-white` not `bg-brand
      text-white` for the active item)
- [x] T010 [US2] Extend `scripts/check-contrast.mjs`'s `BASE_TOKENS` with
      `neutral-300` (if not already present) and add `PAIRINGS` entries
      for "Sidebar dark item text (text-neutral-300 on bg-neutral-900)"
      and "Sidebar light item text (text-neutral-700 on white)" — do this
      now, not as a follow-up, per feature 006's established discipline
      of extending the script alongside the feature that needs it
- [x] T011 [US2] Add a Sidebar card to `index.html`'s gallery, linking to
      `src/components/sidebar/sidebar.html`
- [x] T012 [US2] Add `sidebar: resolve(__dirname, "src/components/sidebar/sidebar.html")`
      to `vite.config.ts`'s `rollupOptions.input`
- [x] T013 [US2] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations, including the two newly-registered pairings

**Checkpoint**: Pagination + Sidebar both independently shippable.

---

## Phase 3: User Story 3 - Navbar / Header (Priority: P3)

**Goal**: Ship a Navbar primitive implementing the constitution's
pre-existing ratified pattern, plus a `backdrop-filter` fallback and a
native `<details>`/`<summary>` mobile menu (zero JavaScript) — per
`contracts/navbar.contract.md`.

**Independent Test**: Render the Navbar at a wide viewport (full nav, no
hamburger) and a narrow viewport (hamburger, no full nav), confirm it
stays pinned to the top while scrolling.

### Tests for User Story 3

- [x] T014 [P] [US3] Write `tests/e2e/navbar.spec.ts`: visual regression
      at 320/768/1024/1440px (closed mobile menu) plus an open-mobile-menu
      variant at 320px, an axe scan for both states, an assertion that
      the full nav is hidden and the hamburger visible at 320px (and vice
      versa at 1440px), an assertion that the mobile menu trigger has an
      accessible name and a ≥44×44px bounding box, a `position: sticky`
      computed-style assertion, a keyboard-activation assertion (Enter/
      Space on the `<summary>` toggles the mobile menu open), and an
      open-menu-then-resize-to-wide assertion (open the mobile menu at
      320px, resize the viewport to 1440px, confirm the `<details>` is
      hidden regardless of its own `open` attribute — spec.md Edge Case)

### Implementation for User Story 3

- [x] T015 [US3] Implement `src/components/navbar/navbar.html` per
      `contracts/navbar.contract.md` (full nav, mobile `<details>` menu,
      brand wordmark)
- [x] T016 [US3] Add `.navbar`/`.navbar-inner`/`.navbar-link`/
      `.navbar-menu-trigger`/`.navbar-mobile-panel` `@apply` classes to
      `src/styles/tailwind.css` per `data-model.md`'s Navbar composition
      — including the `supports-[backdrop-filter]:...` fallback pattern
- [x] T017 [US3] Add a Navbar card to `index.html`'s gallery, linking to
      `src/components/navbar/navbar.html`
- [x] T018 [US3] Add `navbar: resolve(__dirname, "src/components/navbar/navbar.html")`
      to `vite.config.ts`'s `rollupOptions.input`
- [x] T019 [US3] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations

**Checkpoint**: All three Application Shell primitives independently
shippable.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [x] T020 Run the full project test suite (`npm run test:e2e`) — all
      existing specs (features 001-006 static + React harness) plus the
      three new ones; confirm zero regressions. Also run `npm run build`
      and confirm `dist/src/components/{pagination,sidebar,navbar}/` all
      exist
- [ ] T021 [P] Manual QA: execute quickstart.md's discoverability check
      (SC-005) — time an unfamiliar developer composing a Sidebar with an
      active item highlighted using only its own gallery page. **NOT
      DONE by an AI agent** — requires a human tester, same outstanding
      status as every prior feature's equivalent item
- [x] T022 Code review pass over
      `src/components/{pagination,sidebar,navbar}/**` and the
      `tailwind.css`/`vite.config.ts`/`check-contrast.mjs` diffs using
      the code-reviewer agent; address any CRITICAL/HIGH findings
- [ ] T023 Generate Linux Playwright baselines via
      `gh workflow run update-snapshots.yml` → `gh run download` → copy
      the new `*-linux.png` files into each new component's
      `tests/e2e/<name>.spec.ts-snapshots/` directory. Never locally,
      never via local Docker. Confirm via `cmp` that pre-existing
      baselines this run regenerates are byte-identical to what's already
      committed before committing only the genuinely new files
- [x] T024 Run `/speckit-constitution` to fold the two real AAA
      corrections (Sidebar's active-item and dark-theme resting-text
      pairings) and the new Pagination pattern into the Application &
      Navigation Component Catalog section (MINOR version bump), per
      `quickstart.md`'s reminder — do not skip once implementation is
      verified stable
- [x] T025 [P] Update root `README.md`'s Project Structure section to
      list the three new component directories, consistent with every
      prior feature's README update pattern

---

## Dependencies & Execution Order

- **US1 (Pagination)** has no dependencies — can start immediately. MVP
  scope.
- **US2 (Sidebar)** has no dependency on US1 — independently
  implementable, ordered second by spec.md priority.
- **US3 (Navbar)** has no dependency on US1/US2 — independently
  implementable, ordered last (most responsive-layout complexity).
- Within each story: tests before implementation, same TDD ordering as
  every prior feature.

## Parallel Execution Examples

```text
# Per-story test-writing tasks are the natural parallel entry points:
T001 [US1] tests/e2e/pagination.spec.ts
T007 [US2] tests/e2e/sidebar.spec.ts
T014 [US3] tests/e2e/navbar.spec.ts

# Within Phase 4, T021/T025 are independent of each other and of
# T020/T022/T023/T024 (sequenced: full-suite verification before code
# review, before baseline generation, before the constitution amendment):
T021 [P] manual discoverability QA
T025 [P] README update
```

## Implementation Strategy

**MVP first**: Phase 1 (Pagination) alone is a complete, shippable
increment — zero JS, no pre-existing ratified pattern to correct. Phases
2-3 add independently-testable increments in spec.md's priority order.
Phase 4's T023 (Linux baselines) and T024 (constitution ratification,
including the two real AAA corrections) are required before this feature
is considered fully shipped, matching the precedent set by every prior
feature.
