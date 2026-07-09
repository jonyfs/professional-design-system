# Quickstart: Overlays — Modal, Slide-over, Toast

## Prerequisites

Same as features 001/002 — no new dependencies. If you haven't already:

```bash
npm install
npx playwright install --with-deps
```

## Run the component gallery

```bash
npm run dev
```

Modal, Slide-over, and Toast each get their own gallery card. Unlike prior
components, Modal and Slide-over's demo pages load `src/scripts/overlay.js`
as a module; Toast's loads `src/scripts/toast.js`.

## Validate token discipline and AAA/non-text contrast (Principle IV / II gates)

```bash
npm run audit:tokens
npm run audit:contrast
```

**Expected outcome**: both pass. This feature corrects one ratified-
catalog gap found during research (the close-icon color,
`text-neutral-400` → `text-neutral-500`/`text-neutral-600`) — the
correction reuses existing tokens, so no new `PAIRINGS`/`RING_PAIRINGS`
entries are strictly required, but add one for the close-icon color
(`text-neutral-500` vs. white) during implementation for the same reason
feature 002's code review added `RING_PAIRINGS` entries for Select: a
correction is only real if verified by tooling, not just documented.

## Run the full test suite

```bash
npm run build
npm run test:e2e
```

**Expected outcome**: all specs pass, including the three new ones
(`modal.spec.ts`, `slide-over.spec.ts`, `toast.spec.ts`) alongside the
seven existing ones from features 001/002. New assertions to watch:
Tab-cycle containment (focus never escapes an open Modal/Slide-over),
Escape-close, backdrop-click-close, and focus-return-to-trigger — these
exercise the browser's real native `<dialog>` behavior, not a mock.

## Generating new visual regression baselines

Same process as features 001/002 — **never locally, never via local
Docker**:

```bash
gh workflow run update-snapshots.yml
gh run list --workflow=update-snapshots.yml --limit 1
gh run download <run-id> -n updated-snapshots -D /tmp/updated-snapshots
# copy the new *-linux.png files into tests/e2e/<component>.spec.ts-snapshots/
```

## Manual validation scenarios (traceable to spec.md)

1. **Modal focus trap** (User Story 1, AC1): open the Modal, press Tab
   repeatedly — focus cycles only among the close icon, Cancel, and Delete
   buttons, never reaching the trigger or page content behind it.
2. **Modal Escape** (AC2): with the Modal open, press Escape — it closes
   and focus returns to the "Delete item" trigger button.
3. **Modal backdrop click** (AC3): with the Modal open, click outside the
   white panel (on the dimmed backdrop) — it closes and focus returns to
   the trigger.
4. **Modal empty-content fallback** (Edge Case): open the informational
   modal variant (no buttons) — focus lands on the dialog itself
   (`tabindex="-1"`), not lost to the page.
5. **Toast announcement** (User Story 2, AC1): open the gallery with a
   screen reader running — the Toast's message is announced without an
   explicit navigation action.
6. **Toast dismissal** (AC2): click the Toast's close button — it is
   removed from the page (inspect via DevTools that the node is gone, not
   just hidden).
7. **Toast doesn't steal focus** (AC3): focus a form field, then trigger a
   Toast to appear — focus remains on the field.
8. **Slide-over focus trap + dismissal** (User Story 3, AC1-AC2): same
   Tab-cycle, Escape, and backdrop-click behavior as Modal, sliding in
   from the right edge instead of appearing centered.
9. **Slide-over Shift+Tab wrap** (Edge Case): with the Slide-over open,
   Shift+Tab from its first focusable element — focus wraps to the last,
   never escaping to the page behind it.

## Discoverability check (SC-001)

Same manual, human-only timing check as features 001/002 — not
automatable. Track as an outstanding manual QA item in `tasks.md`.
