# Quickstart: Navigation Micro-Patterns

## Prerequisites

- Repo installed (`npm install`), dev server available via `npm run dev` (static site, port 5173) and `npm run dev --workspace=tests/react-harness` (React harness, port 5174).

## Validate Team/Workspace Switcher & Language Switcher

1. Open `/src/components/team-switcher/team-switcher.html` — click the trigger, confirm the panel lists workspaces with avatars; select one, confirm the trigger's avatar+label update.
2. Open `/src/components/language-switcher/language-switcher.html` — same, without avatars.
3. Confirm arrow-key navigation and Escape/outside-click close both, matching Dropdown Menu's existing behavior exactly.

## Validate Back-to-Top Button & Scroll Progress Bar

1. Open `/src/components/scroll-feedback/scroll-feedback.html` (a long demo page).
2. Scroll down — confirm the top progress bar's fill grows and the Back-to-Top button appears past ~400px.
3. Click Back-to-Top — confirm a smooth scroll to the top and the button disappearing again.

## Validate Onboarding Tour

1. Open `/src/components/onboarding-tour/onboarding-tour.html`.
2. Click "Start tour" — confirm step 1's panel appears anchored near its target, with "1 of 3".
3. Click Next repeatedly through all steps, then Previous back — confirm the indicator and content update correctly at each step, especially at both ends (no Previous on step 1, "Finish" not "Next" on the last step).
4. Restart the tour — confirm it always begins at step 1 (no persisted progress).

## Full regression

`npx playwright test` — confirm zero regressions against the pre-existing catalog, per `tests/e2e/navigation-micro-patterns.spec.ts`'s own dedicated suite passing across all 6 browser/viewport projects first.
