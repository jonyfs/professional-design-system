# Research: 2026 External Design-Trend Adoption

## R1. Font fix — self-hosted Inter variable font

**Decision**: Self-host the Inter variable font (`InterVariable.woff2`, a single file covering the full weight range) via `@font-face` in `src/styles/tailwind.css`, with `font-display: swap` and a `system-ui`/`sans-serif` fallback stack retained exactly as today for the loading gap and for any environment where the file fails to load.

**Rationale**: `shared/design-tokens.ts`'s `fontFamily.sans` already declares `["Inter", "system-ui", "sans-serif"]` — the token is correct, only the actual font asset was never added. Google's official Inter variable font is free (SIL Open Font License), single-file, and directly satisfies both the font-loading fix (User Story 1) and the "Variable Fonts" trend (full weight/width range from one file, smaller than shipping multiple static weights). Self-hosting (versus a Google Fonts `<link>`) avoids a new third-party runtime request/dependency and matches `rules/web/performance.md`'s general preference for controlling critical assets directly.

**Alternatives considered**:
- *Google Fonts CDN link* — rejected: adds a new external network dependency and a render-blocking-risk third-party request for a asset central to every page, when self-hosting one file avoids both.
- *Static weight files (400/500/600/700) instead of variable* — rejected: more total bytes for the same expressive range, and directly contradicts the "Variable Fonts" trend's own stated benefit (one file, full range).

## R2. Font-loading regression safety net

**Decision**: After adding the font, run the existing visual-regression suite for a representative sample of text-heavy components (headings, buttons, form labels, tables) and regenerate only the snapshots that actually shift pixel output, exactly as any other legitimate visual change would be handled — not a blanket re-baseline of the whole suite.

**Rationale**: matches this project's own established convention (feature 043's incident, and every prior visual-change feature) of only touching baselines that a real, intentional change actually affects.

## R3. Dark-mode OS-preference detection

**Decision**: Add a `usePrefersColorScheme` hook to `packages/react/src/hooks/`, mirroring the existing `usePrefersReducedMotion` hook's exact shape (`window.matchMedia('(prefers-color-scheme: dark)')`), and use the same underlying check directly in `src/scripts/theme-switcher.js`'s `resolveInitialTheme()` — only when no theme has been explicitly/manually stored yet — seeding `"dim"`, the exact id `packages/react/src/DarkModeToggle/DarkModeToggle.tsx` already treats as light's established binary dark counterpart (`DARK_THEME_ID = "dim"`), discovered and reused during implementation rather than picking a new default from the mood-family list.

**Rationale**: reuses this project's own existing, proven pattern (the reduced-motion hook) for the exact same category of browser API (a `matchMedia`-based OS preference), rather than inventing a new detection mechanism. A manually-stored choice always wins over the OS preference, preserving existing `DarkModeToggle` behavior exactly (spec.md FR-004's edge case).

**Alternatives considered**: server-side detection via a `Sec-CH-Prefers-Color-Scheme` client hint — rejected as this is a static site with no server-side rendering step to act on it; the client-side `matchMedia` check (already proven for reduced-motion) is the only mechanism this project's architecture actually supports.

## R4. Dark-grey-not-pure-black audit (FR-005)

**Finding**: already satisfied. A direct check of `src/styles/themes.css`'s dark-family theme blocks found representative `--color-neutral-50` (surface/page-background role) values like `#1B1717` and `#282A36` — dark greys, not pure black (`#000000`) — and no theme block using pure black as its surface color was found. This requirement is a confirming audit, not a fix: no theme changes are expected, but the check runs across all dark-family themes (not just the two spot-checked here) to catch any exception before closing this out.

## R5. New style-direction documentation (Organic/Fluid, 3D/Immersive)

**Decision**: Add two new entries to the constitution's Component Catalog section, in the same style/format as its existing references to "Worthwhile Style Directions," each with: a one-line description, when it's appropriate, and its specific performance/accessibility constraint (per research from the source article):
- **Organic/Fluid**: curved section dividers, soft asymmetry, SVG-mask shape dividers — start subtle, avoid fully asymmetrical layouts without testing, must not compromise reading order/content structure (Principle I).
- **3D/Immersive**: interactive 3D models or scroll-triggered depth effects — reserved for product-showcase/portfolio/hero moments only (never a default component treatment), MUST lazy-load and compress any 3D asset, and MUST stay within the existing bundle budgets (`rules/web/performance.md`) — a heavy 3D library is a real risk to the "App page < 300kb JS" budget, so this direction is opt-in and scoped, never baked into a shared/core component.

**Rationale**: this is documentation only (FR-006/FR-007) — no existing component adopts either direction as part of this feature, avoiding any overlap with feature 044's audit-driven (not proactive) scope decision.
