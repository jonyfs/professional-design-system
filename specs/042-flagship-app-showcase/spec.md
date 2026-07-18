# Feature Specification: Flagship App Showcase

**Feature Branch**: `042-flagship-app-showcase`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "transforme a página de saída do GitHub pages numa simulação de um app estático contendo todos os componentes criados. Simule uma aplicação real para mostrar todo o poder deste design system criado para o Claude" (turn the GitHub Pages output into a simulation of a static app containing all the created components — simulate a real application to show the full power of this design system)

**Clarified with the requester (2026-07-18) before drafting**:
- This is a NEW, separate page/experience, reachable from the homepage — it does NOT replace the existing 123-component catalog homepage (which is the subject of feature 040's own, separate M3-style layout work).
- Scope is a single, rich flagship dashboard screen (not a multi-screen navigable product flow) — the existing `dashboard-example.html` (2 stat cards, 79 lines) is a minimal precedent this feature grows substantially, not a full realistic product screen.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the design system's real power in one realistic screen (Priority: P1)

A visitor who has already browsed the component catalog (or arrives directly at this page) wants to see what this catalog actually looks like assembled into a real, plausible product — not an isolated grid of cards, but a single coherent application screen: navigation, real data, real interactions, real states, all built from this catalog's own shipped components.

**Why this priority**: This is the entire point of the feature — a convincing, realistic composition is the only thing that actually "shows the power" the request asks for; anything less than a genuinely plausible product screen fails the request.

**Independent Test**: Load the showcase page and confirm it presents as a believable, realistic SaaS-style application screen (not a component grid, not a wireframe) built from this catalog's own real, live components — verified by counting how many distinct shipped components appear in real, functioning use on the page.

**Acceptance Scenarios**:

1. **Given** the showcase page loads, **When** a visitor views it, **Then** it presents as one coherent application screen — persistent navigation (sidebar and/or top bar), a main content area with real, populated data (metrics, a data table, at least one chart), and realistic secondary UI (notifications, user menu, search) — not a bare list of isolated component demos.
2. **Given** the page's interactive elements (dropdown menus, a data table's sort/filter, a command palette, toasts, modals, etc.), **When** a visitor actually operates them, **Then** each behaves exactly as its own dedicated catalog demo already proves — this page reuses real component behavior, it does not fake or screenshot it.
3. **Given** the page is themed, **When** any of the 119 curated themes is selected via the existing theme switcher, **Then** the entire showcase re-colors correctly, exactly like every other page in this catalog.
4. **Given** a visitor wants to learn more about any component they see in use, **When** they look for a way back to that component's own dedicated catalog page, **Then** a clear link/path exists (this page is a showcase of composition, not a replacement for the catalog's own per-component documentation).

---

### User Story 2 - Reach the showcase from the homepage (Priority: P2)

A visitor browsing the homepage catalog wants to discover this richer, composed demonstration without already knowing a direct URL.

**Why this priority**: Without discoverability, the showcase page delivers no value to a visitor who doesn't already know it exists — but it is secondary to the showcase's own content quality (P1).

**Independent Test**: Load the homepage and confirm a clear, prominent link/entry point to the showcase page exists and correctly navigates there.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** a visitor looks for it, **Then** a clearly-labeled link to the flagship showcase is present and visible without requiring the visitor to already know it exists.
2. **Given** a visitor is on the showcase page, **When** they want to return to the full catalog, **Then** a clear way back to the homepage exists.

---

### Edge Cases

- What happens when the showcase is viewed at a narrow (320px) viewport? (The simulated application layout must remain usable — no horizontal overflow, navigation collapses to a mobile-appropriate pattern, exactly like this catalog's own existing responsive conventions elsewhere.)
- What happens to components that are React-only (e.g., Chart) within a page built primarily on the static HTML surface? (The showcase page follows whichever surface convention makes the richest, most realistic composition possible for its own content — if it needs Chart's real rendering, it may be built as a React-harness-backed page rather than forcing a static-only approximation; this is a technical decision for planning, not fixed here.)
- What happens if a visitor's `prefers-reduced-motion` is enabled? (Every component's existing reduced-motion handling applies unchanged — the showcase introduces no new motion of its own beyond what each reused component already does.)
- What happens when the showcase's simulated data (metrics, table rows, notifications) needs to look realistic? (Data is static, plausible, and clearly fictional — no real user data, no implication of a live backend, consistent with this catalog's existing composed examples' own convention.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a new page presenting a single, coherent, realistic application screen (not a component grid) composed from this catalog's own real, shipped components.
- **FR-002**: The showcase page MUST include, at minimum: persistent navigation (sidebar and/or top bar with real navigation items), a main content area with populated metrics/stat displays, at least one data table with realistic rows, at least one chart, and at least one overlay-style interaction (modal, dropdown menu, command palette, or toast) that a visitor can actually trigger.
- **FR-003**: Every interactive element on the showcase page MUST be the catalog's real, already-shipped component behavior — no faked, static-only, or screenshot-based representation of an interactive element.
- **FR-004**: The showcase page MUST re-color correctly under every one of the 119 currently-shipped themes via the existing theme switcher.
- **FR-005**: The showcase page MUST meet this catalog's AAA contrast requirement and pass the existing automated accessibility scan with zero violations, exactly like every other page in this catalog.
- **FR-006**: The homepage MUST contain a clear, visible link to the showcase page; the showcase page MUST contain a clear, visible link back to the homepage.
- **FR-007**: The showcase page MUST NOT replace, modify, or remove any part of the existing 123-component catalog homepage — it is an additional, separate page.
- **FR-008**: The showcase page MUST remain usable with no horizontal overflow at 320px, 768px, 1024px, and 1440px viewport widths.
- **FR-009**: Any simulated data shown (metrics, table rows, notifications, user identity) MUST be clearly plausible-but-fictional, never implying a real backend or real user data.

### Key Entities

- **Showcase screen**: the single composed application page itself; references the specific catalog components it assembles (navigation, stat cards, data table, chart, overlay) and the realistic sample data each displays.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The showcase page visibly and functionally incorporates at least 15 distinct shipped components in realistic, interactive use (not a passive screenshot-like arrangement).
- **SC-002**: The showcase page passes this catalog's automated accessibility scan with zero violations and the AAA contrast audit with zero new undocumented findings, across all 119 themes.
- **SC-003**: A visitor can navigate from the homepage to the showcase and back in two clicks or fewer.
- **SC-004**: The full pre-existing Playwright suite continues to pass unchanged after this page ships, confirming zero regressions to any existing page or component.
- **SC-005**: The showcase page renders with no horizontal overflow and no content clipping at 320px, 768px, 1024px, and 1440px viewport widths.

## Assumptions

- "All the created components" is interpreted as realistically as many components as a single coherent application screen can plausibly host (per SC-001's 15-component floor) — not literally all 123 in one screen, which would stop looking like a real application and revert to being another component grid, defeating the request's own stated purpose.
- This showcase is additive: the existing homepage catalog, feature 040's own separate M3-style layout work on that catalog, and every individual component's own dedicated demo page are all unchanged by this feature.
- The showcase reuses this catalog's existing "Composed Examples" precedent (`dashboard-example.html`, `composed-example.html`, `settings-example.html`) as prior art for the general pattern, but is scoped and built as a materially richer, standalone flagship page rather than a small addition to those existing minimal examples.
- If any component needed for a realistic composition is React-only (per feature 020's own documented Chart exception), the showcase page may be built on the React-harness-backed surface rather than the static HTML surface, whichever produces the more genuinely realistic result — this decision is deferred to planning, not fixed here.
