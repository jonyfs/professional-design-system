# Research: Professional Multi-Screen Showcase Expansion

## R1. Routing mechanism

**Decision**: Adopt `react-router-dom` (industry-standard, ~7-10kb gzipped for the core `RouterProvider`/`Routes` API) inside `showcase/` only — the main static site and `packages/react` are unaffected.

**Rationale**: this project's own convention (per feature 020's Chart/Recharts precedent) is to adopt a well-established, widely-used dependency rather than hand-roll equivalent infrastructure, with the exception documented. A hand-rolled "screen" switcher (plain `useState`) would not give deep-linkable URLs (spec.md FR-001's explicit requirement) without reimplementing history/URL-sync — exactly what a router exists to solve.

**Alternatives considered**: plain `useState`-based screen switching — rejected, fails FR-001's deep-linking requirement. A meta-framework (Next.js/Remix) — rejected as disproportionate; this is a client-only demo app with no need for SSR/data-loading infrastructure.

## R2. Screen selection and component-cluster mapping

**Decision**: 5 screens total (1 existing + 4 new), each mapped to a distinct realistic purpose and component cluster:

| Screen | Purpose | Primary new components (beyond the existing 21) |
|---|---|---|
| Dashboard (existing) | Overview/landing | unchanged — StatCard, LineChart, DataTable, NotificationCenter, etc. |
| Team | User/member management | DataList or extended DataTable, AvatarGroup, Badge, Modal (invite), Tooltip, ContextMenu (row actions), Pagination |
| Settings | Preferences/account | Textarea, ColorInput, FileInput, Toggle, Radio, Checkbox, Tabs (sections), Accordion, Divider |
| Analytics | Reporting | Additional Recharts types (BarChart/PieChart/AreaChart), Progress, RingProgress, SemiCircleProgress, Skeleton (loading state), EmptyState (no-data state) |
| Onboarding | Auth-adjacent flow | Stepper, PinInput (2FA-style step), SocialLoginGroup, PasswordStrengthMeter, OnboardingTour |

**Rationale**: each screen corresponds to a genuinely distinct area of a real SaaS product (this matches spec.md FR-002's "distinct, realistic product purpose" requirement) and each cluster deliberately draws heavily from feature 044's 27 newly-added components — giving those components their first real, in-context exercise (the same mechanism that found feature 042's original 4 defects).

**Alternatives considered**: a single long "kitchen sink" page with more components added to the existing Dashboard — rejected outright, directly contradicts FR-001/FR-002's multi-screen requirement.

## R3. Navigation chrome

**Decision**: Reuse the existing `Sidebar` (already used for primary nav in the current Dashboard) and extend its item list to include the 4 new screens; `Navbar`'s existing top bar (breadcrumbs, notifications, dark-mode toggle, context switcher) stays as shared chrome across all screens via a layout route.

**Rationale**: FR-004 explicitly requires navigation to come from the catalog's own components, not bespoke UI — this is already true today for the single Dashboard, so the layout just needs to wrap multiple routed screens instead of one static one.

## R4. Component coverage measurement

**Decision**: A small script (or manual audit at implementation time) counts distinct `@professional-design-system/react` imports across all `showcase/src/**/*.tsx` screen files combined, reported in the PR description — not automated/gated in CI (this is a demo app, not a catalog-wide enforcement point).

**Rationale**: matches SC-002's "substantially higher than 21" measurable outcome without inventing new CI machinery for a one-time reporting need.

## R5. Competitive/quality assessment (User Story 3)

**Decision**: Delivered as a written document (`specs/047-professional-showcase-expansion/competitive-assessment.md`) produced by direct inspection of: (a) feature 044's `audit-findings.md` (20 flagged components, 3 explicit banned-pattern matches), (b) the constitution's "Known Catalog Gaps" list (Date Picker/Calendar, Carousel, Scroll Area, Resizable panels still deferred), (c) direct comparison against 2-3 well-known competitor design systems' public component lists (e.g., what a Date Picker/Calendar gap means competitively, since it's one of the most commonly-expected components in any real product).

**Rationale**: reuses this session's own already-verified findings rather than re-deriving them, while adding external competitive context (what's genuinely missing relative to what a real evaluator would expect) that hasn't been captured yet.
