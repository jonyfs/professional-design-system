# Tasks: Overlays — Modal, Slide-over, Toast

**Input**: Design documents from `/specs/003-overlays-modal-toast/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/,
quickstart.md, constitution.md (v1.3.4)

**Tests**: Included — Playwright visual regression + `@axe-core/playwright`
accessibility scans, plus new keyboard-navigation assertions (Tab-cycle
containment, Escape-close, backdrop-click-close, focus-return), same
pattern as features 001/002.

**Organization**: Tasks are grouped by user story (Modal P1, Toast P2,
Slide-over P3). No Setup/Foundational phase for existing tooling (Vite,
Tailwind, Playwright, `tests/e2e/a11y-helper.ts`) — unchanged from feature
001. **One piece of foundational work is already done**, not a task here:
`scripts/audit-tokens.mjs` and `scripts/check-contrast.mjs` were extended
during this feature's `/speckit-analyze` pass to also scan `tailwind.css`'s
`@apply` blocks (commit `a9cdd36`) — this is committed, working
infrastructure this feature's implementation tasks rely on, not pending
work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Same single-project static frontend layout as features 001/002:
`src/components/<name>/`, `src/scripts/`, `tests/e2e/`.

---

## Phase 1: User Story 1 - Focus-Trapped Modal Dialog (Priority: P1) 🎯 MVP

**Goal**: Ship a Modal primitive using native `<dialog>` + `showModal()`
that traps focus, returns focus to its trigger, and closes via Escape,
backdrop click, and an explicit control — per `contracts/modal.contract.md`.

**Independent Test**: Drop the Modal markup, its trigger, and
`overlay.js` into a blank page; verify Tab/Shift+Tab never escapes the
open dialog, Escape closes it, clicking the backdrop closes it, and focus
returns to the trigger — all without any other component present.

### Tests for User Story 1

> Write first; they MUST fail until T002-T004 exist.

- [ ] T001 [P] [US1] Write `tests/e2e/modal.spec.ts`: visual regression at
      320/768/1024/1440px for closed/open/empty-content states, an axe scan,
      a Tab-cycle-containment assertion (Tab repeatedly from the last
      focusable element inside the open dialog never reaches the trigger
      or page content behind it), a Shift+Tab-wrap assertion (from the
      first focusable element back to the last), an Escape-closes assertion
      with a focus-returned-to-trigger check, a backdrop-click-closes
      assertion (click at a point outside the panel but inside the
      viewport) with the same focus-return check, and a Tab-lands-on-
      dialog-itself assertion for the `tabindex="-1"` empty-content variant
      (Edge Case, `modal.contract.md`'s "no focusable content" section)

### Implementation for User Story 1

- [ ] T002 [US1] Add `.modal-dialog`, `.modal-panel`, `.close-icon-btn` to
      `src/styles/tailwind.css`'s `@layer components` per
      `modal.contract.md` and `data-model.md` (including the
      `.modal-dialog::backdrop { background-color: theme('colors.neutral.900 / 50%'); }`
      rule) and `close-icon-btn`'s full resting/hover/active/focus-visible/
      disabled state table
- [ ] T003 [US1] Create `src/scripts/overlay.js` exporting
      `initDialogTriggers()` per `modal.contract.md`'s Behavior wiring
      section (open via `showModal()` on `[data-dialog-trigger]` click,
      close on backdrop click via `event.target === dialog`)
- [ ] T004 [US1] Implement `src/components/modal/modal.html` per
      `modal.contract.md` (primary interactive demo with Cancel/Delete
      buttons and close icon) plus the `tabindex="-1"` empty-content demo
      variant from the contract's Edge Case section; import
      `overlay.js` as a module and call `initDialogTriggers()` on load
- [ ] T005 [US1] Wire the Modal partial into `index.html`'s gallery as a
      new card linking to the standalone page (same pattern as prior
      features' cards)
- [ ] T006 [US1] Run `npm run audit:tokens` and `npm run audit:contrast`;
      fix any violation before proceeding (expected: 0 — `close-icon-btn`'s
      `text-neutral-500`/`text-neutral-600` are covered via the
      `ICON_FILL_TEXT_TOKENS`/`RING_PAIRINGS` mechanism added during
      `/speckit-analyze`, not a new gap)

**Checkpoint**: User Story 1 (Modal) is fully functional and testable
independently — MVP.

---

## Phase 2: User Story 2 - Dismissible Toast Notification (Priority: P2)

**Goal**: Ship a Toast primitive that announces itself via `aria-live`
without stealing focus or blocking the page, dismissible via a close
button — per `contracts/toast.contract.md`.

**Independent Test**: Drop the Toast markup and `toast.js` into a blank
page independently of Modal/Slide-over; verify it does not move keyboard
focus on appearance, is announced via `aria-live="polite"`, and its close
button removes it entirely from the DOM.

### Tests for User Story 2

- [ ] T007 [P] [US2] Write `tests/e2e/toast.spec.ts`: visual regression at
      all four breakpoints for the success/error/info variants, an axe
      scan, a `role="status"`/`aria-live="polite"` presence assertion, a
      focus-not-stolen assertion (focus a form-like element, trigger/render
      a toast, assert focus is unchanged), and a dismiss assertion (click
      close, assert the node is removed from the DOM via `toBeHidden()` or
      count-based assertion, not just visually hidden)

### Implementation for User Story 2

- [ ] T008 [US2] Add `.toast`, `.toast-stack` to `src/styles/tailwind.css`'s
      `@layer components` per `toast.contract.md` and `data-model.md`
      (`bg-white shadow-lg ring-1 ring-neutral-900/5` surface; variant
      icon colors — `text-success-strong`/`text-error-strong`/
      `text-brand-dark` — applied directly in markup per variant, not
      baked into `.toast` itself, since they vary per instance); reuse the
      existing `close-icon-btn` class for the dismiss button (no new
      `toast-close-btn` class — consolidated per `/speckit-analyze`)
- [ ] T009 [US2] Create `src/scripts/toast.js` exporting
      `initToastDismissal()` per `toast.contract.md`'s Behavior wiring
      section (a `click` listener per `[data-testid='toast-close']`
      removing its closest `[role="status"]` ancestor)
- [ ] T010 [US2] Implement `src/components/toast/toast.html` per
      `toast.contract.md` (success/error/info variants stacked in a
      `.toast-stack` container per the Edge Case — multiple simultaneous
      toasts); import `toast.js` as a module and call
      `initToastDismissal()` on load
- [ ] T011 [US2] Wire the Toast partial into `index.html`'s gallery
- [ ] T012 [US2] Run `npm run audit:tokens` and `npm run audit:contrast`;
      fix any violation before proceeding (expected: 0)

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 3: User Story 3 - Focus-Trapped Slide-over Panel (Priority: P3)

**Goal**: Ship a Slide-over primitive sharing Modal's exact focus-trap/
dismissal mechanism, sliding in from the right edge instead of appearing
centered — per `contracts/slide-over.contract.md`.

**Independent Test**: Drop the Slide-over markup, its trigger, and
`overlay.js` into a blank page independently of Modal/Toast; verify the
same Tab-cycle-containment, Escape-close, backdrop-click-close, and
focus-return behavior as Modal, with a slide-in-from-edge animation.

### Tests for User Story 3

- [ ] T013 [P] [US3] Write `tests/e2e/slide-over.spec.ts`: visual
      regression at all four breakpoints for closed/open states, an axe
      scan, and the same Tab-cycle-containment, Shift+Tab-wrap,
      Escape-closes-with-focus-return, and backdrop-click-closes-with-
      focus-return assertions as `modal.spec.ts` (same underlying
      mechanism — see research.md)

### Implementation for User Story 3

- [ ] T014 [US3] Add `.slide-over-dialog`, `.slide-over-panel` to
      `src/styles/tailwind.css`'s `@layer components` per
      `slide-over.contract.md` and `data-model.md` (right-edge anchored
      positioning, `translate-x` slide-in transition, plus the
      `.slide-over-dialog::backdrop` `theme()` rule matching Modal's); the
      close button reuses `close-icon-btn` verbatim
- [ ] T015 [US3] Implement `src/components/slide-over/slide-over.html` per
      `slide-over.contract.md`; import `overlay.js` and call
      `initDialogTriggers()` — no new script needed, `overlay.js` is
      already generic over any `[data-dialog-trigger]`/`<dialog>` pair
      (research.md: "no second focus-trap mechanism, no code duplication
      beyond CSS")
- [ ] T016 [US3] Wire the Slide-over partial into `index.html`'s gallery
- [ ] T017 [US3] Run `npm run audit:tokens` and `npm run audit:contrast`;
      fix any violation before proceeding (expected: 0 — no new tokens)

**Checkpoint**: All three user stories (Modal, Toast, Slide-over) are
independently functional.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Whole-feature verification spanning all three new components,
plus the project-wide CSP addition this feature's first `<script>` tags
trigger (research.md's I1 correction).

- [ ] T018 Add a `<meta http-equiv="Content-Security-Policy" content=
      "default-src 'self'; script-src 'self'; style-src 'self';
      object-src 'none'; base-uri 'self';">` tag to every HTML page's
      `<head>` — `index.html` and all ten component pages (the seven from
      features 001/002 plus Modal/Toast/Slide-over). Verified no inline
      `style="..."` attributes exist anywhere in the project (research.md),
      so `style-src 'self'` needs no `'unsafe-inline'` exception; confirm
      `npm run dev`/`npm run build` output still loads and functions
      correctly (module scripts are same-origin, satisfying `script-src 'self'`)
- [ ] T019 Run `npm run build && npm run test:e2e` for the full suite (all
      ten component specs — seven from features 001/002 plus Modal/Toast/
      Slide-over); confirm every visual regression, axe scan, and
      keyboard-navigation assertion passes, including with the new CSP
      meta tag in place (a strict CSP can break things silently — check
      the browser console for CSP violation reports during the run)
- [ ] T020 Trigger `gh workflow run update-snapshots.yml`, wait for
      completion, download its `updated-snapshots` artifact
      (`gh run download <run-id> -n updated-snapshots -D /tmp/updated-snapshots`),
      and copy the three new component specs' `*-linux.png` files into
      their `tests/e2e/<name>.spec.ts-snapshots/` directories. Do **not**
      generate these locally or via local Docker — feature 001's CI
      incident showed neither is bit-identical to the real runner
- [ ] T021 [P] Manual QA: execute quickstart.md's "Discoverability check
      (SC-001)" — time an unfamiliar teammate copying a working Modal into
      a scratch page; record whether it took under 2 minutes. **NOT DONE
      by an AI agent** — requires a human tester, same outstanding status
      as features 001/002's equivalent items
- [ ] T022 [P] Manual QA: walk through quickstart.md's 9 numbered manual
      validation scenarios end to end and record pass/fail for each. If no
      interactive browser session is available in this session (as with
      features 001/002), substitute with explicit confirmation that each
      scenario has a corresponding automated Playwright assertion in
      `modal.spec.ts`/`toast.spec.ts`/`slide-over.spec.ts` — do not mark
      this done without one or the other
- [ ] T023 Code review pass over the three new components
      (`src/components/{modal,toast,slide-over}/**`), the new
      `src/scripts/{overlay,toast}.js`, and the `tailwind.css`/
      `audit-tokens.mjs`/`check-contrast.mjs` diffs using the
      code-reviewer agent; address any CRITICAL/HIGH findings before
      considering the feature done
- [ ] T024 [P] Update `README.md`'s project structure section and
      component list to include Modal/Slide-over/Toast, `src/scripts/`,
      and `specs/003-overlays-modal-toast/`, and bump any stale version/
      component-count references — verify with `grep`, not assumption,
      per the documentation-accuracy gap found and fixed after feature 002

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Stories (Phases 1-3)**: No shared setup/foundational phase needed
  beyond the already-completed script extensions (see Organization above).
  Independent of each other; this session proceeds sequentially in
  priority order (P1 → P2 → P3). Toast (US2) has zero dependency on
  Modal's `overlay.js` — it uses its own `toast.js`. Slide-over (US3)
  depends on `overlay.js` existing (created in US1) but adds no new
  behavior to it.
- **Polish (Phase 4)**: Depends on all three user stories being complete.

### User Story Dependencies

- **User Story 1 (Modal, P1)**: No dependency on other stories. Creates
  `overlay.js`, reused (not modified) by US3.
- **User Story 2 (Toast, P2)**: No dependency on US1 — uses its own
  `toast.js`, not `overlay.js`.
- **User Story 3 (Slide-over, P3)**: Reuses `overlay.js` created in US1
  (import only, zero new code in that file) — sequenced after US1 for
  that reason, though its own markup/CSS work is independent.

### Within Each User Story

- Test written and observed failing before the matching implementation task.
- Shared CSS classes before the HTML that references them.
- Implementation before gallery wiring before the audit-script run.
- Story complete (including its audit run) before moving to the next
  priority.

### Parallel Opportunities

- T001, T007, T013 (the three story tests) can run in parallel across
  stories if staffed — each touches a different file.
- T021/T022/T024 (Polish) can run in parallel — independent activities.
  T018 (CSP) and T020 (baselines) are not parallel with T019 (both must
  precede/follow the full-suite run they affect).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: User Story 1 (Modal)
2. **STOP and VALIDATE**: run T006's audits and T001's Playwright spec
   independently — confirm real cross-browser focus-trap behavior, not
   just markup shape
3. This is a legitimate, demoable MVP increment on top of features 001/002

### Incremental Delivery (the order this session follows)

1. User Story 1 (Modal) → validate independently → MVP
2. User Story 2 (Toast) → validate independently
3. User Story 3 (Slide-over) → validate independently
4. Phase 4 Polish → project-wide CSP, full-suite verification (against
   CI-runner-generated baselines), manual QA, code review

---

## Notes

- [P] tasks touch different files with no unmet dependencies.
- Every implementation task cites its `contracts/*.md` file — do not
  deviate from the documented markup contract without updating the
  contract first (and the constitution, if a token is involved).
- Commit after each checkpoint (end of each user story), matching prior
  features' cadence.
- SC-001 (T021) is a manual UX timing outcome, not a scripted assertion —
  do not attempt to automate it.
- T020 exists specifically because feature 001 shipped one CI failure from
  darwin-vs-linux snapshot naming and a second from local-Docker-vs-real-
  runner font rendering — this task encodes the lesson so it isn't
  relearned.
- T018 (CSP) is the one task in this feature not traceable to a spec.md
  functional requirement — it exists because `/speckit-analyze` corrected
  a factual error in research.md and the right response was to actually
  add the missing policy, not just fix the citation.
