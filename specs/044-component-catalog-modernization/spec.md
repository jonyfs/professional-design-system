# Feature Specification: Component Catalog Quality & 2026 Modernization Audit

**Feature Branch**: `044-component-catalog-modernization`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "revise cada componente deste design system usando /ui-ux-pro-max e /frontend-skill para validar a qualidade de cada um: visibilidade, se funciona em todos os tamanhos de telas possíveis e estão seguindo o mesmo padrão, são alteráveis conforme o tema selecionado e se são parametrizáveis usando o react. Deixe os componentes o mais possível com as tendências do mercado em 2026 em design e UX, planeje, crie tarefas, e implemente, e me avise quando ficar pronto e com pull request para validar no github pages" (review every component in this design system for visibility/quality, full responsiveness, cross-component consistency, theme-adaptability, and React parametrization; push components toward 2026 market design/UX trends; plan, create tasks, implement, and deliver a pull request with a live GitHub Pages preview for review)

**Context** (observed directly during this session): the catalog currently ships 110 E2E test suites covering component behavior and 115 React component wrappers in `packages/react/src` — React parity is already close, unlike the ~40-component gap discovered and fixed earlier this session. The project's own global design rules already define a concrete "2026 trends" rubric (an Anti-Template Policy banning generic card grids, stock hero sections, uniform spacing/shadows/radius, and safe gray-on-white styling; a Required Qualities checklist of 10 traits — hierarchy, rhythm, depth/layering, distinctive typography, semantic color, designed interactive states, editorial/bento composition, texture/motion, and data-viz-as-design-system — of which each surface should show at least 4) and a standard responsive test matrix (320/375/768/1024/1440/1920). The constitution already mandates WCAG 2.2 AAA contrast, zero raw-Tailwind hardcoding (semantic tokens only), and complete interactive-state coverage for every component — this feature's audit measures the existing catalog against those already-established bars rather than inventing a new one.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A trustworthy, current quality baseline for every catalogued component (Priority: P1)

A design-system consumer (an internal product team building on top of this catalog) wants confidence that every component — not just the ones most recently touched — actually meets the catalog's own stated bar: visible/legible in every curated theme, functional at every standard breakpoint, structurally consistent with its sibling components, and fully usable from the React package with real props rather than DOM-editing workarounds.

**Why this priority**: without a systematic, catalog-wide audit, quality is only as good as whichever component was most recently reviewed by hand — gaps accumulate silently in older components (as already happened once with the React-parity gap), and there is no way to know the true state of the other ~100+ components without checking.

**Independent Test**: Run the audit checklist (visibility/contrast, responsiveness, cross-component consistency, theme-adaptability, React parametrization) against every component in the catalog and produce a pass/fail result per component per dimension; every component that fails any dimension gets a corresponding fix.

**Acceptance Scenarios**:

1. **Given** the full component catalog, **When** the audit runs, **Then** every single component has a recorded pass/fail result for each of the five quality dimensions (visibility, responsiveness, consistency, theming, React parametrization) — none are skipped or assumed.
2. **Given** a component that fails a dimension (e.g. a hardcoded color that breaks under a dark curated theme, or a breakpoint where content overflows), **When** the fix is applied, **Then** the component passes that dimension on re-check without regressing any other dimension or any existing passing test.
3. **Given** a component that already passes every dimension, **When** the audit runs, **Then** it is left functionally unchanged — the audit fixes real, provable gaps, not working code.

---

### User Story 2 - Components that look and feel current, not templated (Priority: P2)

A visitor to the live component gallery or a product team evaluating whether to adopt this catalog wants the components to read as an intentional, contemporary design system — not a generic, unmodified library-default look — consistent with the catalog's own already-documented design-quality standard.

**Why this priority**: passing functional/accessibility checks is necessary but not sufficient — a catalog that is technically correct but visually generic undersells the product and doesn't serve the "market trends" half of the request; this is explicitly secondary to User Story 1 because a good-looking component that's broken under a theme or breakpoint is a worse outcome than a plain one that works everywhere.

**Independent Test**: For each component the audit (User Story 1) flags as visually generic against the catalog's own established rubric, apply a targeted visual refinement and confirm it now demonstrates at least the minimum number of required design qualities from that rubric, without breaking any functional/accessibility/theming check from User Story 1.

**Acceptance Scenarios**:

1. **Given** a component the audit flags as visually generic (e.g. uniform spacing/shadow with no hierarchy, or a stock unmodified layout), **When** it is refined, **Then** it demonstrably meets the catalog's own already-documented design-quality bar.
2. **Given** a component that already meets that bar, **When** the audit runs, **Then** no unnecessary visual rewrite is applied — refinement targets genuine gaps, not stylistic preference-churn on components that already qualify.
3. **Given** any visually-refined component, **When** re-tested, **Then** it still passes every User Story 1 quality dimension (visibility, responsiveness, consistency, theming, React parametrization) — visual polish never regresses functional correctness.

---

### User Story 3 - Reviewable, live-previewable delivery (Priority: P3)

A stakeholder (the requester) wants to see and click through the actual result before it's merged — not just read a summary of changes — using the catalog's existing live-preview deployment mechanism.

**Why this priority**: a change of this breadth (potentially touching most of the catalog) carries real regression risk; a reviewable, live-previewable delivery is how that risk gets caught before it reaches consumers, but the delivery mechanism itself only has value once User Stories 1 and 2 have produced something worth reviewing.

**Independent Test**: Open the delivered pull request, review its live preview deployment, and confirm every changed component is visually inspectable in-browser across the standard breakpoint set and a representative sample of curated themes before deciding whether to merge.

**Acceptance Scenarios**:

1. **Given** the completed audit-and-fix work, **When** it is delivered, **Then** it arrives as a single reviewable pull request (not directly merged to `main`) with an accessible live preview reflecting every change.
2. **Given** the live preview, **When** the requester reviews it, **Then** they can see the actual rendered result of every touched component before approving.

---

### Edge Cases

- What happens to components that are already fully compliant on every dimension? They are recorded as passing and left untouched — no speculative rewrites (per User Story 2's Acceptance Scenario 2).
- What happens if fixing one component's gap (e.g. a shared token change) affects other components that already passed? Any shared/token-level fix must be re-validated against every component that consumes it, not just the one that originally failed.
- What happens to components in the temporary/showcase-only workspace (`showcase/`, feature 042) versus the core catalog (`tests/e2e/`, `packages/react/src`)? This audit's primary scope is the core, published component catalog; the flagship showcase (an internal composition demo) is out of scope except where it already surfaced a real defect in a core component (per its own constitution entry).
- What happens if a genuine fix requires a breaking change to a React component's public prop API? It is made, documented, and left to the existing automated semantic-versioning pipeline (feature 039) to reflect as a major-version bump — this feature does not add compatibility shims for it.
- What happens if the number of components is too large to fix in a single pass? Work is planned and tracked as prioritized, ordered batches within this one feature's task list (most-used/highest-visibility components first), delivered as one cumulative, reviewable pull request per Success Criteria — not as an indefinite, unbounded effort.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every component currently published in the catalog (every suite under `tests/e2e/` and every corresponding React wrapper under `packages/react/src`) MUST be audited against all five quality dimensions: visibility/contrast, responsiveness across the catalog's standard breakpoint set, cross-component structural/pattern consistency, correct rendering across a representative sample of the catalog's curated themes, and full React prop-driven parametrization.
- **FR-002**: Any component found failing a dimension MUST be fixed so it passes that dimension, without causing a previously-passing component or dimension to regress.
- **FR-003**: A component already passing all five dimensions MUST NOT be modified for its own sake — the audit targets genuine, provable gaps, not stylistic churn.
- **FR-004**: A component that already passes every existing quality gate (User Story 1's five dimensions) but demonstrates fewer than 4 of the catalog's 10 documented Required Qualities (`rules/web/design-quality.md`) MUST receive a targeted visual refinement toward that rubric. A component already demonstrating 4 or more of those qualities MUST be left visually unchanged — the "2026 trends" push is scoped to audit-flagged, genuinely generic/dated components, never a proactive re-skin of components that already qualify (resolved per user decision: audit-driven scope, not a full-catalog reskin).
- **FR-005**: Every component's React wrapper MUST expose its full range of documented visual/behavioral states as props — no functionality that requires direct DOM manipulation or CSS override outside the component's own public API.
- **FR-006**: Cross-component consistency MUST be measured against the catalog's own existing shared foundations (design tokens, spacing scale, radius scale, interactive-state pattern) — not a newly-invented standard — so that "consistent" means "actually uses the shared system," not a subjective aesthetic judgment.
- **FR-007**: Any component visually refined under this feature MUST continue to pass WCAG 2.2 AAA contrast and every other existing constitutional accessibility requirement.
- **FR-008**: The complete body of work (audit findings, fixes, and any visual refinements) MUST be delivered as a single pull request, not committed directly to `main`.
- **FR-009**: The pull request MUST be attached to (or otherwise produce) a live, browsable preview deployment so every changed component can be visually inspected before merge, using the catalog's existing preview/deployment mechanism.
- **FR-010**: The audit and its fixes MUST NOT reduce existing automated test coverage (visual regression, accessibility, functional) for any component — coverage may only be added to close a newly-discovered gap, never removed.

### Key Entities

- **Component audit record**: one catalogued component's pass/fail result across the five quality dimensions, plus any fix or refinement applied.
- **Quality dimension**: one of the five measured aspects (visibility/contrast, responsiveness, cross-component consistency, theme-adaptability, React parametrization).
- **Design-quality rubric**: the catalog's own already-documented "2026 trends" standard (Anti-Template Policy + Required Qualities checklist) used as the bar for User Story 2's visual refinements.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of catalogued components have a recorded audit result for all five quality dimensions — zero components skipped or assumed compliant without checking.
- **SC-002**: Every component that failed at least one dimension during the audit passes that dimension after this feature's fixes, with zero regressions in previously-passing dimensions or existing tests.
- **SC-003**: Every component demonstrates full functional parametrization from the React package — no documented visual/behavioral state is reachable only via direct HTML/CSS and not via a React prop.
- **SC-004**: The delivered pull request includes a working, browsable live preview that a non-technical reviewer can use to visually confirm every changed component before approving.
- **SC-005**: Zero reduction in existing automated test count or coverage as a result of this feature's changes.

## Assumptions

- "Todos os tamanhos de telas possíveis" (all possible screen sizes) is interpreted as the catalog's own already-established standard responsive test matrix (320/375/768/1024/1440/1920), not an unbounded set of device sizes — this is the existing, documented convention this project already tests against.
- "Alteráveis conforme o tema selecionado" (theme-adaptable) is validated against a representative sample of the catalog's 100+ curated themes (including at least one light, one dark, and any theme already on the constitution's documented contrast-exception list), not every single theme exhaustively for every component — full-matrix (every component × every theme) exhaustive checking is out of scope as disproportionate to the request's intent.
- "Parametrizáveis usando o react" (React-parametrizable) is validated against the existing `packages/react` workspace's current near-complete parity (115 React components vs. 110 core test suites) — this feature closes any remaining real gaps rather than assuming a large gap exists.
- Using `/ui-ux-pro-max` and `/frontend-design` (referenced by the requester as `/frontend-skill`) is an implementation-detail choice for how the audit and refinement work is actually carried out, to be applied during planning/implementation — this specification stays focused on the outcome (a verifiably audited, consistent, current catalog) rather than which tool performs the audit.
- The pull request and GitHub Pages preview mechanism already exists in this project (feature 039's deploy pipeline, GitHub Pages hosting) and is reused as-is, not redesigned by this feature.
- Given the catalog's size (110+ components), work is planned and executed as prioritized batches within this single feature, not as 110+ separate features — the deliverable is one cumulative, reviewable pull request covering the full audit.
