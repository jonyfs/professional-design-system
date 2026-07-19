# Quickstart: Validating Professional Multi-Screen Showcase Expansion

## 1. Confirm multi-screen navigation (User Story 1 / SC-001)

1. `npm run dev --workspace showcase`, open the app.
2. Click through the Sidebar to each of the 5 screens (Dashboard, Team, Settings, Analytics, Onboarding).
3. **Expected**: each loads without a full page reload; the URL changes to a distinct path per screen.
4. Directly load a non-Dashboard screen's URL fresh (paste into address bar / `page.goto()` in a test).
5. **Expected**: it renders correctly on its own, not only reachable by clicking through from Dashboard.

## 2. Confirm component coverage (User Story 2 / SC-002)

1. `grep -roE "^import \{[^}]*\} from \"@professional-design-system/react\"" showcase/src | ...` (or equivalent) across all screen files, count distinct component names.
2. **Expected**: substantially more than 21 distinct components, each traceable to a real usage on some screen (spot-check a sample).

## 3. Confirm the 4 original defects remain fixed (SC-003)

1. Re-run `tests/e2e/flagship-showcase.spec.ts` (or the accessibility check within it).
2. **Expected**: dark-theme Modal/Slide-over contrast, DarkModeToggle/select desync, CommandPalette execute-order, and Chart resize behavior all still pass as originally fixed.

## 4. Confirm quality gates per screen (SC-004)

1. Run `npm run audit:tokens` and `npm run audit:contrast` — both scan `packages/react/src/**/*.tsx`, not `showcase/`, so also manually verify each new screen visually across the standard breakpoints (320/768/1024/1440) and at least light + dark theme.

## 5. Confirm the competitive assessment was delivered (SC-005)

1. Open `specs/047-professional-showcase-expansion/competitive-assessment.md`.
2. **Expected**: specific, named findings with evidence, not generic commentary.
