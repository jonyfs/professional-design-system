# Feature Specification: 2026 External Design-Trend Adoption

**Feature Branch**: `045-2026-trend-adoption`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "visite o a página e tente extrair o que há de interessante para melhorar este design system: https://lovable.dev/pt-br/guides/website-design-trends-2026" (visit the page and extract what's interesting to improve this design system)

**Context** (extracted directly from the source during this session): the article lists 10 trends for 2026 — AI-powered personalization, kinetic typography, micro-interactions/motion, dark mode/dynamic theming, organic shapes/anti-grid layouts, anti-design/neo-brutalism, accessibility-first design, 3D/immersive visuals, variable fonts, and performance-driven design. Cross-checking each against this project's own current state found: **micro-interactions, neo-brutalism, accessibility-first, and performance-driven design are already fully covered** (existing constitutional Principles II/V, `rules/web/performance.md`, and `rules/web/design-quality.md`'s style-direction list already meet or exceed the article's bar — no action needed). **AI-powered personalization is out of scope** — it's an application-behavior concern (visitor segmentation, session tracking), not something a static component library owns. The remaining trends surfaced two concrete, previously-undiscovered gaps and two genuinely new opportunities: (1) the typography token claims `["Inter", "system-ui", "sans-serif"]` but **no such font file is ever actually loaded anywhere in the project** (no `@font-face`, no Google Fonts link, no self-hosted package) — every page silently renders in the OS default font, never the intended "Inter" typeface; (2) no `prefers-color-scheme` OS-preference auto-detection exists anywhere in `packages/react` (only `prefers-reduced-motion` does) — dark mode requires manual user action on every first visit; (3) organic/fluid shapes and (4) 3D/immersive visuals are not part of the catalog's current style-direction vocabulary at all.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The catalog's own typography actually renders as designed (Priority: P1)

A visitor to the component gallery sees the typeface the design system was actually specified to use — not a silent fallback to whatever font happens to be installed on their OS — and benefits from the smaller, single-file weight range a variable font provides instead of the missing static font it currently (and silently) fails to load.

**Why this priority**: this is not a stylistic preference but a real, previously-undiscovered defect — the project has shipped with a broken typography promise since its first component, and every visual/consistency claim elsewhere in the catalog rests on a font that has never actually rendered.

**Independent Test**: Load any page of the site with browser dev tools open; confirm the "Inter" font family is actually being requested, downloaded, and applied (not silently falling through to a system font), across both the main site and the React package's consuming applications.

**Acceptance Scenarios**:

1. **Given** any page in the catalog, **When** it loads, **Then** the browser's computed font-family for body/heading text is the intended "Inter" typeface, not a system fallback.
2. **Given** the font is now actually loaded, **When** page load performance is measured, **Then** it still meets the existing LCP/FCP targets (`rules/web/performance.md`) — a variable single-file font must not regress load performance versus the current (broken) state.
3. **Given** the font now loads correctly, **When** any component's text is inspected, **Then** no component's visual appearance is broken by the font actually rendering (line-height, truncation, or wrapping assumptions that accidentally depended on the fallback font must be caught and fixed).

---

### User Story 2 - Dark mode respects the visitor's system preference on first visit (Priority: P2)

A visitor whose OS is set to dark mode sees the catalog in dark mode immediately on first visit, without having to find and click a manual toggle — while still being able to override that choice manually, exactly as today.

**Why this priority**: this is a well-established, low-risk, high-value UX expectation (2026 trend research explicitly calls it out, and it's a one-line browser API this project already uses for reduced-motion) but is secondary to User Story 1's outright broken typography defect.

**Independent Test**: With the OS/browser set to prefer dark color scheme, load the site for the first time (no prior theme choice stored) and confirm it renders in a dark theme immediately; manually switch to light and confirm the manual choice persists and overrides the system preference afterward.

**Acceptance Scenarios**:

1. **Given** a first-time visitor whose OS prefers dark mode and who has no stored theme preference, **When** they load the site, **Then** it renders in a dark curated theme by default.
2. **Given** a visitor who has manually chosen a theme before, **When** they return, **Then** their explicit choice is respected over the OS preference (manual override always wins, matching existing `DarkModeToggle` behavior).
3. **Given** the existing dark curated themes, **When** their primary surface color is inspected, **Then** it uses a dark grey rather than pure black, if not already the case — a smaller, low-risk visual-consistency check(, not a functional requirement, since some curated themes may already do this deliberately).

---

### User Story 3 - Two new style-direction options are available for future components (Priority: P3)

A team building a new component or reskinning an existing one under the catalog's already-established "Worthwhile Style Directions" list (`rules/web/design-quality.md`) has two additional, currently-missing options available: organic/fluid shapes and 3D/immersive visuals — each documented with the same rigor (when to use, how to keep it performant/accessible) as the catalog's existing 9 style directions.

**Why this priority**: this is a forward-looking vocabulary addition, not a fix to anything currently broken — lowest priority, and explicitly scoped to documentation/pattern availability rather than retrofitting either style onto existing components (which would conflict with feature 044's "audit-flagged only" scope decision).

**Independent Test**: A new component or refinement task can reference "organic" or "3D/immersive" as a named, documented style direction with concrete guidance, the same way it already can reference "Bento" or "Glassmorphism."

**Acceptance Scenarios**:

1. **Given** the catalog's existing style-direction documentation, **When** this feature ships, **Then** "Organic/Fluid" and "3D/Immersive" are documented alongside the existing 9 directions with the same level of concrete guidance (when appropriate, performance/accessibility constraints).
2. **Given** these two new documented directions, **When** no existing component is retrofitted to use them by this feature, **Then** the catalog's existing components remain visually unchanged — this story adds vocabulary/reference patterns, not a mandate to reskin anything (that decision belongs to feature 044 or future feature scope).

---

### Edge Cases

- What happens to visitors on very old browsers without variable-font support? The chosen font format must degrade gracefully to a static weight rather than failing to render text at all.
- What happens if a component's design silently depended on the previously-broken fallback font's specific metrics (line-height, character width)? Any such breakage must be caught (via the existing visual-regression suite) and fixed as part of loading the real font, not shipped as a new visual regression.
- What happens to a returning visitor's already-stored manual theme choice when this feature ships? It must be read and respected exactly as before — OS-preference detection only applies to visitors with no stored choice yet (User Story 2, Acceptance Scenario 2).
- What happens to the two new style-direction entries if no team ever uses them? They remain valid, documented, unused options — same as any of the existing 9 directions not every component adopts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The catalog MUST actually load and apply the "Inter" typeface it already declares as its primary sans-serif token, using a variable-font format so the full weight/width range is available from a single file.
- **FR-002**: Loading the corrected font MUST NOT regress any existing performance budget (`rules/web/performance.md`'s LCP/FCP targets, font-loading rules) or visual-regression test.
- **FR-003**: Any component whose current appearance depended on the previously-missing font's fallback metrics MUST be identified and fixed so it still renders correctly once the real font loads.
- **FR-004**: A first-time visitor with no stored theme preference and an OS set to prefer dark mode MUST see a dark curated theme by default; a visitor with a previously stored manual choice MUST still see that exact choice, unaffected.
- **FR-005**: The default dark curated theme(s) MUST use a dark grey (not pure black) primary surface color, unless a specific curated theme has a deliberate, already-documented reason to use pure black.
- **FR-006**: Two new style-direction entries — "Organic/Fluid" and "3D/Immersive" — MUST be documented within this project's own governance (the constitution's Component Catalog section, alongside its existing references to the 9 "Worthwhile Style Directions"), with the same structure and rigor: when each is appropriate and its performance/accessibility constraints. This documents project-local guidance and does not modify the user's cross-project global rule files.
- **FR-007**: This feature MUST NOT retrofit any existing shipped component to use either new style direction — it adds documented options for future/optional use, not a mandate to reskin the current catalog (that scope belongs to feature 044 or a future feature).
- **FR-008**: AI-powered personalization is explicitly out of scope for this feature — it is an application-behavior concern outside a static component library's ownership, not a gap in this catalog.

### Key Entities

- **Font asset**: the actual "Inter" variable-font file(s) this feature adds, replacing the currently-silent fallback.
- **Theme preference**: the existing stored-choice-vs-OS-preference relationship already established by `DarkModeToggle`, extended (not replaced) to seed its initial value from `prefers-color-scheme` when no stored choice exists.
- **Style direction entry**: one named, documented visual-direction option, recorded in this project's own constitution alongside its existing references to the "Worthwhile Style Directions" concept (existing entities being extended by two new project-local members, not a modification of the user's global cross-project rule files).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of pages in the catalog render body/heading text in the actual "Inter" typeface (verifiable via browser dev tools' computed font-family), where 0% do today.
- **SC-002**: Font-loading changes cause zero regression in existing LCP/FCP measurements or existing visual-regression test pass rate.
- **SC-003**: A first-time visitor with an OS dark-mode preference and no stored choice sees a dark theme on first paint, with zero flash-of-wrong-theme.
- **SC-004**: Two new style-direction entries are documented and discoverable in the same reference location as the existing 9.
- **SC-005**: Zero existing components are modified for style-direction adoption as part of this feature (verifies FR-007's scope boundary).

## Assumptions

- "Interessante para melhorar este design system" (interesting to improve this design system) is interpreted as: adopt trends that surface a genuine, concrete, low-risk improvement or fix a real defect — not every trend in the source article, several of which (personalization, micro-interactions, neo-brutalism, accessibility-first, performance) are either out of this project's scope as a component library or already met/exceeded by its existing constitution and rules.
- The variable-font file is self-hosted within this project (consistent with `rules/web/performance.md`'s general preference for controlling critical assets directly) rather than loaded from a third-party CDN like Google Fonts, avoiding a new external runtime dependency for a core visual asset.
- "Dark grey not pure black" (FR-005) is a visual-consistency check across the existing 100+ curated themes' dark entries, not a mandate to redesign any theme already reviewed and intentionally shipped with a different choice — existing, deliberate exceptions are respected if documented.
- The two new style-direction entries (FR-006) are documentation/reference additions recorded in this project's own constitution (not the user's global, cross-project rule files) — no existing component's classification or implementation is affected by adding them.
