# Quickstart: Feedback Primitives

## Prerequisites

- Existing scaffold only — no new dependencies (zero new npm packages).

## Run the dev gallery

```bash
npm run dev
```

## Validate User Story 1 (RingProgress, SemiCircleProgress)

1. Open `ring-progress.html` — confirm the filled arc's proportion
   matches the demoed values (0%, 50%, 100%) and each has an accessible
   text equivalent (check via accessibility tree, not just visually).
2. Open `semi-circle-progress.html` — confirm identical value behavior
   as a half-circle gauge.

## Validate User Story 2 (Notification Center)

1. Open `notification-center.html` — confirm the bell icon shows an
   Indicator badge with the correct unread count.
2. Click the trigger — confirm the panel opens listing notifications,
   read/unread visually distinguished.
3. Confirm the empty-state demo shows explicit "No notifications yet"
   text, not a blank panel.

## Validate User Story 3 (Password Strength Meter)

1. Open `password-strength-meter.html` — type increasingly complex
   passwords, confirm the fill and accessible label update through
   Weak → Fair → Strong.
2. Confirm an empty input shows a neutral/empty state, not "Weak".

## Automated validation

```bash
npm run audit:tokens
npm run audit:contrast
npx playwright test feedback-primitives
```

## Expected outcomes

- All 4 primitives render correctly on both surfaces (SC-001).
- Zero new design tokens introduced (SC-002).
- Every state (progress value, strength level, read/unread) has a
  verified non-color-alone signal (SC-003).
- Notification Center composes Indicator + Dropdown Menu with zero
  duplicated logic (SC-004).
