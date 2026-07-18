# Quickstart: Homepage Component Showcase

## Validation steps

1. `npm run audit:tokens` — expect 0 violations.
2. `npm run audit:contrast` — expect 0 new findings across all 49
   themes.
3. `npm run dev`, open `/`, confirm:
   - Hero shows the live "proof wall" of real staged components, not
     a bare stat strip.
   - Every one of the 114 cards shows a real live preview (not text-
     only), sized per its bento tier (large/wide/standard).
   - Tabbing through the page reaches exactly one focusable element
     per card (the whole-card link) — nothing inside `.showcase-card-
     preview` is reachable via Tab.
   - Clicking/Enter-activating any card navigates to that exact
     component's existing demo page.
   - No horizontal overflow at 320/768/1024/1440.
   - Switching themes (Theme Gallery or the header selector) re-colors
     every card correctly with zero markup change.
4. `npx playwright test tests/e2e/gallery-showcase.spec.ts` — expect
   all extended assertions to pass, including 0 axe-core violations.
5. `npx playwright test` (full suite, all 6 projects) — expect zero
   regressions.
