# Tasks: Data Display Primitives

**Input**: Design documents from `/specs/006-data-display-primitives/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/,
quickstart.md, constitution.md (v1.4.0)

**Tests**: Included — Playwright visual regression + `@axe-core/playwright`
accessibility scans, same pattern as every prior feature.

**Organization**: Tasks are grouped by user story (Avatar P1, Card P2,
Alert/Banner P3). No Setup/Foundational phase for existing tooling — reuses
the scaffold entirely. `scripts/audit-tokens.mjs` needs no changes.
`scripts/check-contrast.mjs` DOES need changes — one real gap and one new
token, both found by `/speckit-analyze` and already fixed as part of
finalizing this task list (not deferred to an implementation task):
`neutral-700`/`neutral-100` (Avatar's fallback pairing) had no
`BASE_TOKENS`/`PAIRINGS` entries despite the coverage-scan mechanism
existing specifically to catch this; and Alert's `info` severity needed a
new `info-strong` token (`shared/design-tokens.ts`) since `status.info`
existed but had no AAA-safe `-strong` text variant, unlike
success/error/warning — both are committed alongside this tasks.md.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Same single-project static frontend layout as every prior feature:
`src/components/<name>/`, `src/scripts/`, `tests/e2e/`. No
`packages/react/` changes (FR-013).

---

## Phase 1: User Story 1 - Avatar (Priority: P1) 🎯 MVP

**Goal**: Ship an Avatar primitive with zero JavaScript — image variant
with required `alt` text, and an initials-fallback variant — per
`contracts/avatar.contract.md`.

**Independent Test**: Drop the Avatar markup into a blank page and verify
both the image and fallback variants render as perfect circles at both
sizes, with legible/accessible text in every case.

### Tests for User Story 1

- [x] T001 [P] [US1] Write `tests/e2e/avatar.spec.ts`: visual regression
      at 320/768/1024/1440px for image and fallback variants at both
      sizes, an axe scan, an assertion that the image variant has
      non-empty `alt` text, an assertion that the fallback variant has an
      `aria-label`, and an assertion that both variants render as a
      perfect circle (`border-radius` computed style)

### Implementation for User Story 1

- [x] T002 [US1] Implement `src/components/avatar/avatar.html` per
      `contracts/avatar.contract.md` (image + fallback variants, both
      sizes, plus the single-initial vs. two-initial Edge Case demo)
- [x] T003 [US1] Add `.avatar-img`/`.avatar-fallback`/`.avatar-sm`/
      `.avatar-lg` `@apply` classes to `src/styles/tailwind.css` per
      `data-model.md`'s Avatar composition
- [x] T004 [US1] Add an Avatar card to `index.html`'s gallery, linking to
      `src/components/avatar/avatar.html`
- [x] T005 [US1] Add `avatar: resolve(__dirname, "src/components/avatar/avatar.html")`
      to `vite.config.ts`'s `rollupOptions.input` (feature 005's
      code-review-caught gap — do this now, not as a follow-up fix)
- [x] T006 [US1] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations

**Checkpoint**: Avatar is independently shippable — zero JS, both variants
visually correct at all breakpoints, AAA-compliant, wired into the
gallery and the production build.

---

## Phase 2: User Story 2 - Card (Priority: P2)

**Goal**: Ship a Card primitive with zero JavaScript — default and
hover-elevated variants, composable with Avatar/Badge — per
`contracts/card.contract.md`.

**Independent Test**: Drop 2+ Card instances into a blank page and verify
each has a visually-distinct boundary from the page and from its
neighbors, with no dependency on any other component.

### Tests for User Story 2

- [x] T007 [P] [US2] Write `tests/e2e/card.spec.ts`: visual regression at
      320/768/1024/1440px for default, elevated (including hover state),
      and composed (with Avatar + Badge) variants; an axe scan; a hover
      assertion confirming `box-shadow` changes with no bounding-box
      dimension change (no layout shift, FR-005)

### Implementation for User Story 2

- [x] T008 [US2] Implement `src/components/card/card.html` per
      `contracts/card.contract.md` (default, elevated, and composed demos)
- [x] T009 [US2] Add `.card`/`.card-elevated` `@apply` classes to
      `src/styles/tailwind.css` per `data-model.md`'s Card composition
- [x] T010 [US2] Add a Card card(!) to `index.html`'s gallery, linking to
      `src/components/card/card.html`
- [x] T011 [US2] Add `card: resolve(__dirname, "src/components/card/card.html")`
      to `vite.config.ts`'s `rollupOptions.input`
- [x] T012 [US2] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations

**Checkpoint**: Avatar + Card both independently shippable.

---

## Phase 3: User Story 3 - Alert / Banner (Priority: P3)

**Goal**: Ship an Alert/Banner primitive with four severity variants, an
optional dismissible variant via a new `alert.js` module, per
`contracts/alert.contract.md`.

**Independent Test**: Drop each severity variant and the dismissible
variant into a blank page and verify each is visually distinguishable by
color/icon alone, and that the dismissible variant's close button removes
it from the DOM.

### Tests for User Story 3

- [x] T013 [P] [US3] Write `tests/e2e/alert.spec.ts`: visual regression
      at 320/768/1024/1440px for all four severity variants plus the
      dismissible variant, an axe scan confirming no `role="status"`/
      `aria-live`/`role="alert"` attribute is present anywhere, a
      dismissal assertion (click closes, node fully removed from DOM —
      not just hidden), a keyboard-activation assertion (focus the
      dismiss button, press Enter, confirm removal — `/speckit-analyze`
      caught this missing despite being asserted in the contract's Edge
      Cases prose), a multi-instance independence assertion (render 2+
      dismissible alerts, dismiss one, confirm the other remains in the
      DOM), an assertion that the non-dismissible default variant has
      zero close buttons in its markup, and a long-message assertion that
      the icon/dismiss button stay top-aligned (`items-start`) rather
      than vertically centered against wrapped text

### Implementation for User Story 3

- [x] T014 [US3] Implement `src/scripts/alert.js`'s `initAlertDismissal()`
      per `contracts/alert.contract.md`'s reference implementation
      (deliberately not a reuse of `toast.js` — no `role="status"`
      ancestor to select, per research.md R1)
- [x] T015 [US3] Implement `src/components/alert/alert.html` per
      `contracts/alert.contract.md` (all four severities, the
      dismissible variant, and a long-message demo for the Edge Case),
      loading `alert.js` as a module
- [x] T016 [US3] Add `.alert`/`.alert-success`/`.alert-error`/
      `.alert-warning`/`.alert-info` `@apply` classes to
      `src/styles/tailwind.css` per `data-model.md`'s Alert/Banner
      composition (reusing `.close-icon-btn` verbatim for the dismiss
      button — no new interactive class)
- [x] T017 [US3] Add an Alert/Banner card to `index.html`'s gallery,
      linking to `src/components/alert/alert.html`
- [x] T018 [US3] Add `alert: resolve(__dirname, "src/components/alert/alert.html")`
      to `vite.config.ts`'s `rollupOptions.input`
- [x] T019 [US3] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations

**Checkpoint**: All three Data Display primitives independently shippable.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [x] T020 Run the full project test suite (`npm run test:e2e`) — all
      existing specs (features 001-005 static + React harness) plus the
      three new ones; confirm zero regressions. Also run `npm run build`
      and confirm `dist/src/components/{avatar,card,alert}/` all exist
      (quickstart.md's build-config verification)
- [ ] T021 [P] Manual QA: execute quickstart.md's discoverability check
      (SC-005) — time an unfamiliar developer composing a Card containing
      an Avatar and a Badge using only each component's own gallery page.
      **NOT DONE by an AI agent** — requires a human tester, same
      outstanding status as every prior feature's equivalent item
- [x] T022 Code review pass over
      `src/components/{avatar,card,alert}/**`, `src/scripts/alert.js`,
      and the `tailwind.css`/`vite.config.ts` diffs using the
      code-reviewer agent; address any CRITICAL/HIGH findings
- [x] T023 Generate Linux Playwright baselines via
      `gh workflow run update-snapshots.yml` → `gh run download` → copy
      the new `*-linux.png` files into each new component's
      `tests/e2e/<name>.spec.ts-snapshots/` directory. Never locally,
      never via local Docker. Confirm via `cmp` that pre-existing
      baselines this run regenerates are byte-identical to what's already
      committed before committing only the genuinely new files
- [ ] T024 Run `/speckit-constitution` to ratify the new Avatar/Card/
      Alert patterns into the Data Display & Listings Component Catalog
      section (MINOR version bump), per `quickstart.md`'s reminder — do
      not skip once implementation is verified stable
- [x] T025 [P] Update root `README.md`'s Project Structure section to
      list the three new component directories and `src/scripts/alert.js`,
      consistent with every prior feature's README update pattern

---

## Dependencies & Execution Order

- **US1 (Avatar)** has no dependencies — can start immediately. MVP scope.
- **US2 (Card)** has no hard dependency on US1, but its "composed" demo
  variant (T008) visually references Avatar markup — implement US1 first
  in practice, even though US2 remains independently testable on its own
  (a Card with no composed-Avatar demo is still a complete, valid
  increment).
- **US3 (Alert/Banner)** has no dependency on US1/US2 — independently
  implementable, ordered last by spec.md priority (the only story with
  any interaction surface).
- Within each story: tests before implementation, same TDD ordering as
  every prior feature.

## Parallel Execution Examples

```text
# Per-story test-writing tasks are the natural parallel entry points:
T001 [US1] tests/e2e/avatar.spec.ts
T007 [US2] tests/e2e/card.spec.ts
T013 [US3] tests/e2e/alert.spec.ts

# Within Phase 4, T021/T025 are independent of each other and of
# T020/T022/T023/T024 (sequenced: full-suite verification before code
# review, before baseline generation, before the constitution amendment):
T021 [P] manual discoverability QA
T025 [P] README update
```

## Implementation Strategy

**MVP first**: Phase 1 (Avatar) alone is a complete, shippable increment
— zero JS, reuses the existing ratified Lists avatar size for its large
variant. Phases 2-3 add independently-testable increments in spec.md's
priority order. Phase 4's T023 (Linux baselines) and T024 (constitution
ratification) are required before this feature is considered fully
shipped, matching the precedent set by every prior feature.
