# Audit Findings (consolidated from 5 parallel batch audits)

## Batch 1: Layout & Structure + Feedback (25 components) — COMPLETE

**Critical React-parity gaps (no `packages/react/src/<Name>` directory at all)**: aspect-ratio, divider, empty-state, progress, skeleton, spinner, stat-card, indicator (8 total)

**Flagged for 2026 refinement (Required Qualities < 4/10, visible content components)**: alert (2/10 — flat severity list, no depth/hierarchy), loading-overlay (2/10 — functional but visually bare), toast (3/10 — elevated but generic, no motion despite being a transient/motion-suited component)

**Not flagged (structural primitives, correctly minimal)**: affix, app-shell, aspect-ratio*, background-image, center, container, divider*, flex, grid, group, paper, simple-grid, stack, watermark, ring-progress (3/10, noted as polish candidate not blocking), semi-circle-progress (3/10, same)

(*gap components not scored on Required Qualities per audit methodology)

## Batch 2: Navigation & Disclosure + Overlays/Modals (23 components) — COMPLETE

**Critical React-parity gaps**: context-menu, menubar, tree-view, popover, tooltip (5 total — all completely missing `packages/react/src/<Name>` directories and index.ts exports, despite shipping HTML demos + passing e2e specs)

**Flagged for 2026 refinement**: navbar (2/10 — plain bordered bar, single accent, no shadow/motion), sidebar (2/10 — flat panel, no elevation), tabs (2/10 — underline-only selected state, no transition/depth)

**Not flagged**: accordion, anchor, breadcrumbs, collapse, dropdown-menu, nav-link, pagination, spoiler, onboarding-tour (4/10), overflow-list, modal (4/10), slide-over (4/10), bottom-sheet (4/10), session-timeout-modal (4/10), command-palette (4/10)

**Notable defect found**: Modal's destructive "Delete" action reuses the same brand-blue as any primary action rather than a semantic danger color (not a React-parity gap, but a real Principle-I/consistency observation worth a follow-up fix).

## Batch 3: Advanced Forms & Localized Inputs (24 components) — COMPLETE

**Critical React-parity gap**: pin-input (1 total — no `packages/react/src/PinInput` directory, no export)

**Flagged for 2026 refinement**: none (all 23 zero-gap components sit in a consistent 1-3/10 range matching this catalog's deliberate, uniform demo-page convention for minimal masked inputs — not a per-component defect)

Note: this batch's subagent flagged the recurring `graphify` PreToolUse hook reminders as a possible injection pattern. Confirmed benign — it's this repo's own pre-existing, user-configured Claude Code hook (documented in this project's CLAUDE.md, and visible firing on my own tool calls throughout this whole session too), not an actual injection.

## Batch 5 (Data Display + Composed Examples, 23 components) — COMPLETE

**Critical React-parity gaps**: data-list, kbd, timeline, team-switcher (4 total — genuinely reusable primitives/patterns with zero React implementation)

**Flagged for 2026 refinement**: data-table (3/10 — flat, no depth, "no layering" banned pattern), list (2/10), table (1/10 — reuses data-table's flat classes verbatim), chart (1/10 but with caveat — demo page is an intentional stub linking to /showcase, not a design failure), gallery (3/10), pick-list (1/10), card (3/10 — "uniform radius/spacing/shadows everywhere" banned pattern), compare (3/10), dashboard-example (2/10 — explicitly matches "dashboard-by-numbers, no point of view" banned pattern), notification-center (2/10)

**Not flagged**: avatar, avatar-group, badge, blockquote, code, color-swatch, highlight, composed-example, settings-example (all minimal primitives/illustrative pages, appropriately plain)

**Note**: chart already has full 1:1 React parity across all 11 Recharts types (Line/Bar/Pie/Area/Composed/Scatter/Funnel/Treemap/Sankey/Radar/RadialChart) — no gap there, just the static-HTML-demo caveat.

## Batch 4 (Forms & Basic Inputs + System/Utility, 27 components) — COMPLETE

**Critical React-parity gaps**: button-group, textarea, slider (single-value; only RangeSlider exists), file-input, color-input, language-switcher, maintenance-banner, two-factor-reminder-banner, stepper (9 total)

**Flagged for 2026 refinement**: button (1/10 — banned "safe gray-on-white + one accent"), select (1/10, same generic shell), theme-gallery (2/10 — banned "default card grid, no hierarchy" pattern, textbook match), social-login (2/10 — generic shell despite rich provider-brand colors)

**Not flagged**: checkbox, radio, text-input, toggle, number-input, password-input, split-button, action-icon, copy-button, dark-mode-toggle, offline-banner, theme-icon, scroll-feedback, rolling-number (all minimal, correct primitives)

---

## FINAL TOTALS (all 5 batches complete)

**Critical React-parity gaps — 27 components with ZERO React implementation despite shipping HTML demo + passing E2E spec:**
aspect-ratio, divider, empty-state, progress, skeleton, spinner, stat-card, indicator, context-menu, menubar, tree-view, popover, tooltip, pin-input, data-list, kbd, timeline, team-switcher, button-group, textarea, slider, file-input, color-input, language-switcher, maintenance-banner, two-factor-reminder-banner, stepper

**Flagged for 2026 visual refinement (Required Qualities < 4/10, visible/substantial components) — 20 total:**
alert, loading-overlay, toast, navbar, sidebar, tabs, data-table, list, table, chart (caveat — demo page is an intentional stub, not a design failure), gallery, pick-list, card, compare, dashboard-example, notification-center, button, select, theme-gallery, social-login

**Explicit BANNED-pattern matches (highest-confidence fixes)**: card ("uniform radius/spacing/shadows everywhere"), dashboard-example ("dashboard-by-numbers layouts...no point of view"), data-table ("flat layouts with no layering"), button/select/theme-gallery ("safe gray-on-white styling with one decorative accent color" / "default card grids with uniform spacing and no hierarchy")

**Scope reality check**: 27 missing React components is a substantial finding — implementing all of them with genuine quality (matching each one's full e2e-exercised state surface) is more work than can be responsibly completed with real quality in one remaining implementation pass. Prioritization for this pass: implement the highest-value/most-common missing primitives first (tooltip, popover, button-group, textarea — everyday form/overlay primitives with broad reuse) plus the explicit banned-pattern visual fixes (card, dashboard-example, data-table), and document the remainder as clearly-itemized follow-up scope rather than silently dropping or claiming full completion.
