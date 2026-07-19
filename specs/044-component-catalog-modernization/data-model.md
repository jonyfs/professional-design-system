# Data Model: Component Catalog Quality & 2026 Modernization Audit

This feature has no application data model — it audits and, where warranted, modifies existing static/component source files. The "entities" below are audit-tracking records, produced and consumed entirely within this feature's own working documents (not persisted at runtime).

## Component audit record

One row per catalogued component (124 total, per `src/components/*`, minus the 5 constitution-documented deferred components with no shipped implementation — see research.md R2 scope note — leaving the ~110-119 actually-shippable components this audit covers).

| Field | Description |
|---|---|
| Component name | e.g. `button`, `accordion`, `tree-view` — matches `src/components/<name>/`, `tests/e2e/<name>.spec.ts`, `packages/react/src/<PascalName>/` |
| Category (research R2) | Which constitution Component Catalog batch it belongs to (Layout & Structure, Feedback, Forms/Inputs, Data Display, Navigation, Overlays, Advanced Forms & Interaction, etc.) |
| Visibility/contrast result | Pass/fail from `npm run audit:contrast` scoped to this component's tokens/usages, across the theme sample (research R4) |
| Consistency result | Pass/fail from `npm run audit:tokens` scoped to this component (zero raw-Tailwind-class violations) |
| Theme-adaptability result | Pass/fail rendering correctly across the fixed theme sample (default light, default dark, one `KNOWN_THEME_CONTRAST_GAPS` theme) |
| Responsiveness result | Pass/fail across the 4 automated visual-regression breakpoints, plus a 375/1920 spot-check where the component is breakpoint-sensitive (research R4) |
| React parametrization result | Pass/fail: does every visual/behavioral state exercised in `tests/e2e/<name>.spec.ts` have a corresponding React prop in `packages/react/src/<PascalName>`? |
| Required Qualities count (0-10) | How many of `rules/web/design-quality.md`'s 10 Required Qualities the component currently demonstrates — only computed/recorded for components that already pass all five dimensions above (FR-004 only applies once a component is otherwise fully compliant) |
| Fix applied | What was changed, if anything, and why (references the specific failing dimension or, for FR-004, the specific missing Required Qualities that pushed the count below 4) |
| Regression check | Confirmation that fixing one failing dimension didn't break a previously-passing one, or any existing test for this component |

## Quality dimension

The five fixed, always-checked axes from spec.md's User Story 1: visibility/contrast, cross-component consistency, theme-adaptability, responsiveness, React parametrization. Each has a binary pass/fail per component — no partial credit, since each maps to an existing binary automated gate (research R1) except React parametrization, which is a discrete "every exercised state has a prop" check.

## Design-quality rubric (FR-004 only)

The already-existing, not-newly-invented rubric from `rules/web/design-quality.md`:
- **Anti-Template Policy**: a fixed list of banned generic patterns (uniform card grids, stock hero sections, unmodified library defaults, flat/no-depth layouts, uniform radius/spacing/shadow, safe gray-on-white + one accent color, dashboard-by-numbers layouts, default font stacks with no rationale).
- **Required Qualities** (10 items, threshold: 4+ to be considered non-generic): hierarchy via scale contrast, intentional spacing rhythm, depth/layering, distinctive typography pairing, semantic (not decorative) color use, designed hover/focus/active states, grid-breaking/editorial/bento composition where appropriate, texture/motion/atmosphere where it fits, motion that clarifies flow, data-viz treated as part of the system.

This rubric is applied only to components that already pass every Quality Dimension above (per the user's scope decision) — it is never used to justify touching a component that's still failing a functional/accessibility/consistency check.

## Batch (research R2)

A named group of components audited and fixed together as one `tasks.md` unit, corresponding to an existing constitution Component Catalog category. Batches are independently reviewable and revertible — a regression discovered in one batch does not block or roll back another.
