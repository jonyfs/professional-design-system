# Data Model: 2026 External Design-Trend Adoption

No application data model. Two runtime-relevant entities and one documentation entity:

## Font asset

- **Represents**: the self-hosted Inter variable font file(s) added under this feature.
- **Location**: a new `public/fonts/` (or equivalent Vite-served static asset path) + `@font-face` declaration in `src/styles/tailwind.css`.
- **Relationship**: consumed by the existing `fontFamily.sans` token in `shared/design-tokens.ts` — the token itself is unchanged; this feature makes the token's promise actually true.

## Theme preference (extended)

- **Represents**: the existing stored theme choice (feature 025, sitewide persistence) plus its new initial-seed source.
- **Fields**: `storedChoice` (existing, localStorage-backed, wins if present), `osPreference` (new — read via `usePrefersColorScheme`, used only when `storedChoice` is absent).
- **State transition**: no stored choice + OS prefers dark → seed dark theme on first render. No stored choice + OS prefers light/no-preference → seed light (existing default), unchanged. Any stored choice present → always wins, OS preference ignored (existing `DarkModeToggle` behavior, unchanged).

## Style direction entry (new documentation)

- **Represents**: one named visual-direction reference recorded in this project's constitution, alongside its existing "Worthwhile Style Directions" references.
- **New entries**: "Organic/Fluid", "3D/Immersive" — each with a description, applicability guidance, and a performance/accessibility constraint (research.md R5).
- **Explicitly not an entity change**: no existing component is re-tagged or modified to use either new direction as part of this feature (FR-007).
