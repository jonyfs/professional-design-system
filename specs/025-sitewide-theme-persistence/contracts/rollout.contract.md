# Component Contract: Sitewide Theme Rollout (User Stories 1 & 2)

## Per-page markup contract

Every static gallery page (root `index.html` already compliant; every
`src/components/**/*.html` page is the rollout target) MUST contain,
in this exact form (research.md R1):

1. **Head-level activation** — immediately after the stylesheet
   `<link>`:
   ```html
   <script type="module" src="/src/scripts/theme-switcher.js"></script>
   ```
2. **Selector markup** — positioned immediately after the page's
   `<h1>` (and intro `<p>`, where present):
   ```html
   <div class="mt-4 max-w-xs">
     <label for="gallery-theme-select" class="text-sm font-medium text-neutral-900">
       Preview theme
     </label>
     <select id="gallery-theme-select" data-testid="gallery-theme-select" class="form-select">
     </select>
   </div>
   ```
3. **Selector wiring** — immediately before `</body>`:
   ```html
   <script type="module" src="/src/scripts/gallery-theme-selector.js"></script>
   ```

No page-specific variation in any of the three — the exact same
strings, verbatim, on every page (research.md R1's rationale: the
underlying scripts already resolve generically).

## Behavioral contract

- **FR-001/FR-004**: navigating from any page with a selected
  non-default theme to any other rollout-target page MUST show that
  theme applied before first paint (no flash of the default).
- **FR-002**: every rollout-target page MUST expose a working,
  populated selector control identical in behavior to `index.html`'s.
- **FR-003**: selecting a theme via the control MUST persist through
  the existing `pds-theme` localStorage key — no new key, no parallel
  mechanism.
- **FR-005**: a page loaded with no prior selection (fresh
  `localStorage`) MUST show the default theme, matching
  `resolveInitialTheme`'s existing fallback behavior.

## Acceptance mapping

- Spec.md US1 AC1–AC3, US2 AC1–AC2 → this contract.
- FR-001 through FR-007 → this contract.
