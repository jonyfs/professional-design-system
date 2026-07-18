# Feature Specification: Material Catalog Layout

**Feature Branch**: `040-material-catalog-layout`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "deixe a página inicial deste design system na mesma diagramação de https://m3.material.io/components use /ui-ux-pro-max para ajudar nesta transformação"

**Design references** (verified directly via browser, not assumed):
- The referenced page (m3.material.io/components) uses: a persistent left sidebar listing every component category as a single scrollable navigation list; a hero region with a large display headline plus a short explanatory subtitle; a uniform 3-column card grid per category (no cards larger than others); each card is one visual unit — a tinted preview area showing a real rendered example of the component on top, and the component's name plus a one-line description below it.
- Clarified with the requester (2026-07-18) before drafting: this catalog's own multi-theme architecture (119 reactive themes, light and dark) takes precedence over the reference site's fixed dark background — the new layout adopts the reference's STRUCTURE (sidebar, hero, uniform grid, card composition) while every color remains driven by whichever theme the user has selected, exactly like the rest of this catalog. The reference's uniform 3-column grid replaces this catalog's current variable-sized ("bento") grid. The new persistent sidebar replaces the current top quick-jump anchor navigation rather than coexisting with it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse every category from a persistent sidebar (Priority: P1)

A visitor lands on the homepage and wants to jump directly to a specific category (e.g. "Data Display & Listings") without scrolling through unrelated categories first. They see a fixed, always-visible sidebar listing all 10 categories; clicking one scrolls the main content to that category while the sidebar itself never moves or disappears.

**Why this priority**: This is the layout's defining structural change — without it, the rest of the redesign (hero, grid) is cosmetic only. Persistent category navigation is the reference layout's core value: instant orientation regardless of scroll position.

**Independent Test**: Load the homepage, scroll partway down, click a sidebar category link, and confirm the page jumps to that category's section while the sidebar remains fixed in place and visually indicates which category is currently active.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded at any scroll position, **When** the user looks at the left edge of the viewport, **Then** the sidebar with all 10 category names is visible without needing to scroll the page.
2. **Given** the user clicks a category name in the sidebar, **When** the click registers, **Then** the main content area scrolls so that category's heading is at the top of the visible area, with no full page reload.
3. **Given** the user manually scrolls the main content past a category's section, **When** that category becomes the one currently in view, **Then** the sidebar visually marks that category as active (distinct from the other 9).
4. **Given** a keyboard-only user, **When** they Tab through the sidebar, **Then** every category link is reachable and activatable via Enter, with a visible focus indicator.

---

### User Story 2 - Understand the catalog's scale and purpose from the hero (Priority: P2)

A first-time visitor wants to immediately understand what this catalog is before browsing categories. They see a hero region with a large headline and a short subtitle explaining what's below, matching the reference layout's opening treatment, but keeping this catalog's own real, verifiable claims (component count, dual-surface guarantee, AAA contrast, theme count) rather than generic marketing copy.

**Why this priority**: The hero is the first thing every visitor sees; it must orient them before they reach the sidebar or grid, but it's secondary to the sidebar's functional navigation value.

**Independent Test**: Load the homepage and confirm the hero region renders above the first category section, with a headline and subtitle legible at 320px, 768px, and 1440px viewport widths.

**Acceptance Scenarios**:

1. **Given** the homepage loads, **When** the user views the top of the page, **Then** a hero region appears above every category section, containing a large headline and a subtitle sentence.
2. **Given** the hero's real, verifiable claims (component count, surface count, contrast level, theme count), **When** any of those underlying numbers changes in a future feature, **Then** the hero must be updated to match (no stale hardcoded figures), consistent with this catalog's existing "no marketing copy, only verifiable claims" convention.
3. **Given** any currently-selected theme (light or dark), **When** the hero renders, **Then** its text meets this catalog's AAA contrast requirement against its own background in that theme.

---

### User Story 3 - Scan components in a uniform, predictable grid (Priority: P3)

A visitor browsing a category wants to compare components at a glance without some cards appearing more "important" than others through size alone. Every card in every category renders at the same size — a preview area on top, the component's name and a one-line description below — arranged in a 3-column grid on desktop that reflows responsively on narrower viewports.

**Why this priority**: This is the most visible visual change but the least functionally critical — sidebar navigation and hero orientation matter more to a first-time visitor than card uniformity, which mainly affects returning visitors comparing components.

**Independent Test**: Open any category section and confirm every card within it renders at the same width and the same internal layout (preview, name, description), with the grid reflowing to fewer columns as the viewport narrows.

**Acceptance Scenarios**:

1. **Given** any category section, **When** its cards render on a desktop-width viewport, **Then** all cards in that section share the same width and height ratio — no card spans multiple columns or rows.
2. **Given** the viewport narrows to tablet or mobile width, **When** the grid reflows, **Then** columns reduce (e.g. 3 → 2 → 1) without any card overflowing the viewport or requiring horizontal scroll.
3. **Given** a card's underlying component preview (the existing `inert`-wrapped live excerpt from feature 037), **When** the new uniform card size is applied, **Then** the real preview content remains fully visible and legible within the smaller/uniform preview area — not clipped or cut off.
4. **Given** all 123 existing components across their 10 categories, **When** the new grid ships, **Then** every one of them still appears in a card, reachable and clickable to its own demo page, with zero components dropped.

---

### Edge Cases

- What happens when a category has very few components (e.g. only 1-2), leaving mostly-empty space in a 3-column grid row? (The row simply renders fewer cards than columns — no placeholder/filler cards are invented to fill the row.)
- What happens when the sidebar's category list is too tall to fit the viewport height (e.g. a very short browser window)? (The sidebar scrolls independently of the main content, never overlapping or hiding categories.)
- What happens on a touch device with no persistent hover, where the reference layout's sidebar assumes a wide desktop viewport? (Below a defined breakpoint, the sidebar collapses to a toggleable drawer or an equivalent compact navigation control — it never silently disappears with no alternative way to reach a category.)
- What happens to the 4 components the previous bento grid gave a larger card to (Data Table, Chart, Command Palette, Theme Gallery)? (They render in the same uniform card size as every other component in this new grid; their "flagship" framing moves to their own individual demo pages if still warranted, not the homepage grid.)
- What happens when a user has `prefers-reduced-motion` enabled and clicks a sidebar category link? (The scroll-to-section behavior is instant, not a smooth/animated scroll.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a persistent left sidebar on the homepage listing all 10 existing component categories (Application & Navigation, Forms/Validation & Inputs, Data Display & Listings, Overlays/Modals & Feedback, Navigation & Disclosure, Advanced Forms & Interaction, Composed Examples, Theming, Layout & Structure, Consent & System Messaging), replacing the existing top quick-jump anchor navigation.
- **FR-002**: The sidebar MUST remain visible at a fixed screen position while the main content area scrolls independently, at desktop viewport widths.
- **FR-003**: The sidebar MUST visually indicate which category section is currently in view as the user scrolls, updating without a full page reload.
- **FR-004**: Every sidebar category link MUST be reachable and activatable via keyboard alone, with a visible focus indicator.
- **FR-005**: System MUST render a hero region above the first category section containing a large headline and a subtitle, using this catalog's own real, verifiable claims (component count, dual-surface guarantee, contrast level, theme count) — never invented marketing copy.
- **FR-006**: System MUST replace every category's current variable-sized ("bento") card grid with a uniform grid where every card renders at the same size within that category, at 3 columns on desktop viewports, reflowing to fewer columns on narrower viewports with no horizontal overflow.
- **FR-007**: Every component card MUST retain its existing structure of a preview area (the real, `inert`-wrapped live component excerpt already established by feature 037) followed by the component's name and a one-line description — only the outer card's size/grid position changes, not its internal content mechanism.
- **FR-008**: All colors, surfaces, and text in the new sidebar, hero, and grid MUST be driven by this catalog's existing semantic design tokens and MUST re-color correctly under every one of the 119 currently-shipped themes — no hardcoded dark-only treatment.
- **FR-009**: Every one of the 123 existing components MUST remain present, reachable, and clickable to its own demo page after the layout change — zero components dropped or hidden.
- **FR-010**: Below a defined viewport breakpoint, the persistent sidebar MUST convert to a compact, still fully keyboard- and screen-reader-reachable navigation control (e.g. a toggleable drawer) rather than silently disappearing.
- **FR-011**: The sidebar's scroll-to-section behavior MUST respect `prefers-reduced-motion` — an instant jump instead of an animated smooth scroll when the user has that preference enabled.
- **FR-012**: Every text/background pairing introduced by this layout (sidebar, hero, cards) MUST meet this catalog's AAA contrast requirement across all 119 themes, consistent with every other page in this catalog.

### Key Entities

- **Category**: one of the 10 existing top-level groupings of components; has a name, an anchor/section id, and an ordered list of component cards.
- **Sidebar item**: a category's entry in the persistent navigation; has a label, a target section reference, and an active/inactive visual state.
- **Component card**: one component's entry within a category's grid; has a preview (the existing live `inert`-wrapped excerpt), a name, and a one-line description — now rendered at one single uniform size across the entire catalog rather than the prior 3-tier (standard/wide/large) sizing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can navigate from any scroll position to any of the 10 categories in a single click/tap via the sidebar, with the target category visible within 1 second.
- **SC-002**: All 123 previously-shipped components remain individually reachable from the homepage grid — zero regressions in component count or link integrity.
- **SC-003**: The homepage passes this catalog's automated accessibility scan with zero violations, and the AAA contrast audit with zero new undocumented findings, across all 119 themes.
- **SC-004**: The page renders with no horizontal overflow and no card content clipping at 320px, 768px, 1024px, and 1440px viewport widths.
- **SC-005**: The full pre-existing Playwright suite continues to pass unchanged after this layout ships, confirming zero regressions to any other page or component.

## Assumptions

- "Mesma diagramação" (same layout) refers to the M3 components page's structural pattern — persistent sidebar, hero treatment, uniform card grid, and card composition (preview + name + description) — not its literal brand colors, typography, or dark-only background, which this catalog's own multi-theme architecture and Principle IV (zero hardcoded palette values) take precedence over. Confirmed with the requester before drafting.
- The uniform 3-column grid replaces feature 037's bento (large/wide/standard) sizing entirely; the 4 components previously given a larger "flagship" card (Data Table, Chart, Command Palette, Theme Gallery) render at the same uniform size as every other card in this new grid.
- The new sidebar replaces the existing top quick-jump anchor navigation rather than coexisting with it, per the requester's confirmed choice.
- Category names, groupings, and the underlying live-preview mechanism (each card's `inert`-wrapped real component excerpt) are unchanged by this feature — only the outer layout (navigation placement, hero content, grid sizing) is in scope.
- The sidebar's responsive collapse behavior (drawer or equivalent) below the desktop breakpoint reuses this catalog's existing off-canvas/drawer interaction pattern rather than inventing a new one, consistent with this catalog's "reuse an existing mechanism" convention across prior features.
