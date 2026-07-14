# Quickstart: Sitewide Theme Selector & Persistence

## Prerequisites
- `npm install` (no new dependency added by this feature).

## Setup
```bash
npm run dev
```

## Validate: theme persists across navigation (US1, SC-001/SC-003)
1. Open the root gallery, select a non-default theme (e.g. `dracula`).
2. Click through to any individual component's demo page — confirm it
   renders in the selected theme immediately, no flash of the default.
3. Navigate to 2-3 more component pages in sequence — confirm the
   theme continues to apply on every one.

## Validate: selector present on every page (US2, SC-002)
1. Load any individual component's demo page directly (paste its URL,
   don't navigate via the gallery).
2. Confirm a "Preview theme" selector is visible and populated with
   every theme, grouped the same way `index.html`'s selector groups
   them.
3. Change the theme via that control — confirm the page re-themes
   immediately.

## Validate: completeness across all 77 rollout-target pages
```bash
node scripts/check-theme-rollout.mjs   # or equivalent — confirms every
                                          # src/components/**/*.html file
                                          # contains all 3 required
                                          # snippets (research.md R3)
```

## Validate: no regressions
```bash
npx playwright test tests/e2e/sitewide-theme-persistence.spec.ts --project=chromium-320 --project=chromium-768 --project=chromium-1024 --project=chromium-1440 --project=firefox-1440 --project=webkit-1440
npm run audit:tokens
npm run audit:contrast
```

## Full success-criteria trace
See `spec.md`'s Success Criteria (SC-001–SC-004) for the complete list
this quickstart validates against.
