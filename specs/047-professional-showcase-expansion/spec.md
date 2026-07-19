# Feature Specification: Professional Multi-Screen Showcase Expansion

**Feature Branch**: `047-professional-showcase-expansion`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "verifique o que pode ser melhorado, se o design system está competitivo, com ótimo UX e qualidade, revise o showcase para que ele pareça uma aplicação profissional, usando o máximo possível de componentes, navegação, novas telas para conter o máximo de componentes usado" (assess whether the design system is competitive with great UX and quality, and revise the showcase so it reads as a professional application — using as many components as possible, with navigation and new screens to contain the maximum number of components used)

**Context** (observed directly during this session): the existing Flagship App Showcase (feature 042, `showcase/` workspace) is a single-page dashboard — one `App.tsx` (387 lines), no client-side routing, using 21 of the catalog's 110+ exported React components (~19% coverage). It already found and fixed 4 real defects during its own build (documented in the constitution) precisely because composing real components together surfaces integration bugs that isolated component demos don't. A prospective adopter evaluating "is this design system competitive/production-ready" today sees exactly one screen — a real product has multiple, distinctly-purposed screens (an overview, a records/management view, a settings area, etc.) connected by real navigation, and that structure itself is part of what reads as "professional" versus "a component gallery with extra steps."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Evaluating the catalog through a realistic, multi-screen application (Priority: P1)

A team evaluating whether to adopt this design system for their own product wants to see it holding together across a real application's worth of distinct screens — not just one dashboard — so they can judge navigation feel, cross-screen consistency, and whether the catalog actually supports building a full product, not just a landing page.

**Why this priority**: this is the direct, stated ask — a single-screen showcase cannot demonstrate cross-screen navigation, layout consistency under different content shapes, or a realistic information architecture, all of which matter more to a "is this competitive" judgment than any individual component's polish.

**Independent Test**: Open the showcase, navigate to each screen via the app's own navigation (sidebar/navbar), and confirm each screen is reachable, has a distinct and coherent purpose, and the overall app reads as one connected product rather than several unrelated component demos stitched together.

**Acceptance Scenarios**:

1. **Given** the showcase app, **When** a visitor opens it, **Then** they can navigate between at least 4 distinct screens (in addition to the existing dashboard/overview) via the app's own navigation, without a full page reload.
2. **Given** any two screens in the showcase, **When** compared side by side, **Then** they share consistent navigation chrome, theming, and layout conventions — no screen looks like it was dropped in from a different application.
3. **Given** a screen is reached via direct URL (not only by clicking through navigation), **When** it loads, **Then** it renders correctly (deep-linkable, not solely reachable via in-app state).

---

### User Story 2 - Seeing real breadth of the catalog in context (Priority: P1)

The same evaluating team wants to see a meaningfully larger share of the catalog's components in realistic use — not necessarily every single one, but enough that "is this competitive" can be judged from genuine breadth, not a hand-picked 21-component sample.

**Why this priority**: breadth-in-context is the second explicit ask ("usando o máximo possível de componentes") and is what turns this from "a nicer dashboard" into an actual evaluation tool — but it's secondary to User Story 1 because breadth without coherent screens would just be a bigger, still-single-page component dump.

**Independent Test**: Count distinct catalog components rendered across all showcase screens combined, and confirm the total is a substantial, measurable increase over the current 21, with every included component appearing because it genuinely fits that screen's realistic purpose (not padding for a number).

**Acceptance Scenarios**:

1. **Given** the expanded showcase, **When** every screen's rendered components are combined and de-duplicated, **Then** the total count of distinct catalog components used is substantially higher than the current 21.
2. **Given** any component appearing in the showcase, **When** its usage is inspected, **Then** it serves a genuine, realistic purpose on that screen — no component is present merely to inflate the count.
3. **Given** the existing dashboard screen (feature 042), **When** this feature ships, **Then** its already-fixed defects (dark-theme contrast, theme-toggle desync, command-palette execute-order, chart resize false-positive) remain fixed — expansion must not reintroduce them.

---

### User Story 3 - A concrete, prioritized list of what to improve (Priority: P2)

The requester wants a direct answer to "what can be improved" and "is this competitive" — not just a bigger showcase, but a short, evidence-based assessment of where the catalog currently falls short of a competitive, best-in-class design system, so future work has a clear starting point.

**Why this priority**: this is explicitly asked for ("verifique o que pode ser melhorado, se o design system está competitivo") but is a research/assessment deliverable, not a blocking dependency for the showcase expansion itself — the two can and should proceed together, but the showcase doesn't need to wait on the assessment being "finished."

**Independent Test**: Read the delivered assessment and confirm it names specific, concrete gaps (not generic praise or generic criticism) with enough detail that a future feature could be scoped directly from it.

**Acceptance Scenarios**:

1. **Given** the delivered assessment, **When** reviewed, **Then** it identifies specific, named gaps or risks (not vague statements), each traceable to something concrete in the current catalog or showcase.
2. **Given** the assessment's findings, **When** compared against already-known, already-tracked gaps (e.g. feature 044's 20 flagged components, the deliberately-deferred component list in the constitution), **Then** it doesn't simply repeat what's already tracked without adding new information — it either confirms those are still the top priorities or surfaces something not yet captured.

---

### Edge Cases

- What happens to the existing dashboard screen's URL/entry point? It remains the default/landing screen of the expanded showcase — existing links to it must keep working.
- What happens if a newly-added screen needs a component that has a known, documented quality flag (e.g. one of feature 044's 20 flagged-for-refinement components)? It can still be used as-is (the flag is about visual polish, not functional correctness) — using it in the showcase doesn't require fixing it first, but if its use in-context surfaces a genuine new defect (matching feature 042's own precedent), that defect gets fixed as part of this feature, not deferred.
- What happens to bundle size as more components and a router are added? Must stay within this catalog's own documented performance budget for an "App page" (`rules/web/performance.md`) — growth is expected and acceptable, but not unbounded.
- What happens if two screens would naturally want to show the same component (e.g. a Card on both the dashboard and a records screen)? Reuse across screens is expected and fine — the "substantially higher than 21" count in User Story 2 is about distinct components, not preventing reuse.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The showcase MUST support client-side navigation between at least 5 distinct screens total (the existing dashboard/overview plus at least 4 new ones), each independently reachable by URL (deep-linkable) without a full page reload between them.
- **FR-002**: Each new screen MUST have a distinct, realistic product purpose (e.g., a records/management view, a settings/preferences area, an analytics/reporting view, an onboarding or authentication-adjacent flow) — screens must read as different parts of one coherent product, not interchangeable component grids.
- **FR-003**: Across all screens combined, the showcase MUST render a substantially higher number of distinct catalog components than the current 21 — every included component MUST serve a genuine purpose on the screen it appears on.
- **FR-004**: Navigation between screens MUST be provided by the catalog's own existing navigation components (e.g. Sidebar/Navbar, already used in the current dashboard), not a bespoke navigation UI built outside the catalog.
- **FR-005**: Every screen MUST independently meet this project's existing non-negotiable quality bars — WCAG 2.2 AAA contrast, zero raw-Tailwind-class hardcoding, correct rendering across the standard breakpoint set — exactly as the existing dashboard screen already does.
- **FR-006**: Content on every screen MUST be realistic and purpose-appropriate for that screen (representative sample data, not lorem-ipsum placeholder text), consistent with the existing dashboard's own precedent.
- **FR-007**: The four defects already found and fixed during the original dashboard's build (dark-theme Modal/Slide-over contrast, DarkModeToggle/theme-select desync, CommandPalette execute-order, Chart resize false-positive) MUST remain fixed — this expansion must not reintroduce any of them.
- **FR-008**: A written competitive/quality assessment MUST be delivered identifying specific, concrete gaps or risks in the current catalog — not generic commentary — informed by direct inspection of the catalog's current state (not assumed).
- **FR-009**: If using a component in a new screen's realistic context surfaces a genuine new defect (matching how feature 042 found its own 4), that defect MUST be fixed as part of this feature, not silently noted and deferred.

### Key Entities

- **Screen**: one distinct, routable view within the showcase application, with its own URL, realistic purpose, and set of rendered components.
- **Component usage record**: which catalog components appear on which screen(s), used to compute the total distinct-component coverage claimed by User Story 2.
- **Competitive assessment**: the written, evidence-based document identifying specific improvement opportunities (User Story 3's deliverable).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The showcase has at least 5 distinct, independently-navigable, deep-linkable screens (up from 1 today).
- **SC-002**: The total count of distinct catalog components rendered across all showcase screens combined is substantially higher than the current 21 — a majority of the catalog's exported components are represented somewhere in the showcase.
- **SC-003**: 100% of the 4 previously-fixed showcase defects remain fixed after this feature ships.
- **SC-004**: Every screen passes the existing automated contrast and token-discipline audits with zero violations, and renders correctly across the standard breakpoint set.
- **SC-005**: A written assessment identifying specific, named improvement opportunities is delivered and is traceable to concrete evidence (not generic).

## Assumptions

- "Revise o showcase" refers to extending the existing `showcase/` workspace from feature 042 (same app, more screens) — not standing up a second, separate showcase application.
- "Máximo possível de componentes" (maximum possible components) is interpreted as maximizing *realistic, purposeful* coverage, not forcing every single catalog component into some screen regardless of fit — a numeric target is a consequence of good screen design, not a goal to hit by padding.
- Client-side routing is a reasonable, expected technical addition for a multi-screen application; the specific routing mechanism is a plan-phase (not spec-phase) decision.
- The competitive/quality assessment (User Story 3) draws on and cross-references already-known findings from this session's own recent work (feature 044's audit findings, the constitution's documented deferred-components list) rather than re-deriving them from scratch, while still checking whether they remain accurate and surfacing anything genuinely new.
- New screens' realistic sample data follows the same convention already established by `showcase/src/data` for the existing dashboard.
