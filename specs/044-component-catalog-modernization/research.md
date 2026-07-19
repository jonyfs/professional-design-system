# Research: Component Catalog Quality & 2026 Modernization Audit

## R1. Audit rubric — reuse existing tooling/rules rather than inventing a new one

**Decision**: The five quality dimensions map onto existing, already-automated project mechanisms wherever one exists, and onto the project's own already-documented design rubric where automation doesn't reach:

| Dimension | Existing mechanism reused | Gap this feature fills |
|---|---|---|
| Visibility/contrast | `scripts/check-contrast.mjs` (`npm run audit:contrast`, AAA gate, Principle II) | Confirm it actually runs clean per-component today; fix any real failure |
| Cross-component consistency | `scripts/audit-tokens.mjs` (`npm run audit:tokens`, zero-hardcoding gate, Principle IV) | Same — token-discipline violations are the objective definition of "inconsistent" per FR-006 |
| Theme-adaptability | The token-discipline + contrast audits above, run across a representative theme sample (research R4) | Neither audit currently loops over every curated theme per component by default — this feature adds that sampling pass |
| Responsiveness | Existing Playwright visual-regression suite (`tests/e2e/**/*.spec.ts-snapshots`, breakpoints 320/768/1024/1440 per `playwright.config.ts`) | Extend spot-checks to 375/1920 per `rules/web/testing.md`'s broader responsive matrix where a component's layout is breakpoint-sensitive (grids, tables, nav) |
| React parametrization | `packages/react/src/*` wrappers + their own `react-*.spec.ts` suites | Systematic prop-vs-documented-state comparison (no existing automated check for this specific claim) |
| 2026 design-trend quality (FR-004) | `rules/web/design-quality.md`'s existing Anti-Template Policy + 10-item Required Qualities checklist | No existing automation — this is a judgment-based audit pass, scoped per the user's decision to audit-flagged components only |

**Rationale**: this project's constitution already treats token discipline and AAA contrast as non-negotiable, machine-checked gates — re-running and trusting them is more reliable than a fresh manual per-component contrast check, and directly satisfies FR-006's "consistency means actually uses the shared system, not a subjective judgment."

**Alternatives considered**: building a brand-new automated "design trend score" tool — rejected as disproportionate; the Required Qualities checklist is inherently judgment-based (hierarchy, editorial composition, motion) and not mechanically scorable without a much larger investment than this feature's scope justifies.

## R2. Batching strategy for 124 components

**Decision**: Batch the audit by the constitution's own existing Component Catalog taxonomy (Layout & Structure Primitives, Feedback Primitives, Forms/Inputs, Data Display & Listings, Navigation & Disclosure, Overlays/Modals/Feedback, Advanced Forms & Interaction, etc. — the same groupings the constitution already uses to document each feature's shipped components), rather than an arbitrary alphabetical or numeric split. Each batch is audited and (where needed) fixed as one unit of work in `tasks.md`.

**Rationale**: components within the same existing category already share structural conventions (e.g. every overlay already traps focus per Principle II; every form input already follows the same label/error pattern) — auditing by category surfaces category-wide consistency issues (FR-006) more directly than a random split would, and keeps each batch's findings independently reviewable/revertible.

**Scope note (from constitution's "Known Catalog Gaps" section)**: Date Picker/Calendar, Carousel, Scroll Area, Resizable panels, and HoverCard are deliberately not part of the catalog (evaluated and explicitly deferred/rejected across features 014-024) — they are out of this audit's scope entirely, since there is nothing shipped to audit.

**Alternatives considered**: auditing strictly by priority/traffic (most-used components first) — appealing but this project has no usage-analytics data to rank by; category-based batching is the closest available proxy for "related, comparably risky" grouping and matches how the constitution itself already documents the catalog.

## R3. React parametrization comparison method

**Decision**: For each of the 110 core components, diff its `packages/react/src/<Component>` public prop surface against the visual/behavioral states its `tests/e2e/<component>.spec.ts` file actually exercises (hover, focus-visible, disabled, checked, error, expanded, etc. — states already enumerated per-component in each spec file's own test titles). A state exercised in the HTML/CSS test suite but unreachable via a React prop is a genuine FR-005 gap. The 5 React components without a same-named core suite (115 React dirs vs. 110 e2e suites) are triaged individually — some are likely legitimate (e.g. a shared hook/provider, or a variant wrapper) rather than orphaned coverage gaps, but each is checked, not assumed benign.

**Rationale**: this reuses the project's own existing source of truth for "what states does this component have" (the E2E suite, which the constitution already treats as authoritative for Interactive State Completeness, Principle V) instead of re-deriving a states list from scratch per component.

## R4. Responsive/theme sampling strategy

**Decision**: 
- **Responsive**: Every component already has visual-regression coverage at 320/768/1024/1440 (per `playwright.config.ts`'s 4 chromium viewport projects) plus firefox/webkit at 1440 — this is reused as the default responsiveness signal. Components whose layout is structurally breakpoint-sensitive (grids, tables/data-display, nav/sidebar, multi-column forms) additionally get a manual spot-check at 375 and 1920 (`rules/web/testing.md`'s fuller matrix) since those two sizes aren't part of the automated snapshot set today.
- **Theming**: audited against a fixed representative sample per component: the default light theme, the default dark theme, and one theme from `scripts/check-contrast.mjs`'s `KNOWN_THEME_CONTRAST_GAPS` allowlist (the catalog's own documented "hardest case" themes) — deliberately stress-testing the known-trickiest cases rather than an arbitrary sample.

**Rationale**: matches spec.md's Assumptions (exhaustive every-component × every-theme checking is disproportionate) while still being a deliberately-chosen, defensible sample rather than an arbitrary one.

## R5. Delivery mechanism — PR + live GitHub Pages preview

**Decision**: This is a genuine gap, not a pure reuse. `deploy-pages.yml` (feature 039) only builds and deploys `main` — triggered by `workflow_run` after `CI` succeeds on `main`, or manual `workflow_dispatch` (which also targets whatever ref is currently checked out, effectively `main` in practice). **There is no existing PR-preview deployment mechanism in this repository.** Spec.md's Assumption ("the pull request and GitHub Pages preview mechanism already exists... reused as-is") is only half right — the PR mechanism exists (`gh pr create`), but the live-preview-of-a-PR-before-merge mechanism does not.

**Resolution**: add one small, additional workflow, `pr-preview.yml`, triggered on `pull_request` (opened/synchronize) against `main`, that builds the PR branch exactly like `deploy-pages.yml`'s `build` job already does and publishes it to a PR-scoped subpath of the same GitHub Pages site (e.g. `/pr-preview/pr-<number>/`) using `rossjrw/pr-preview-action` — a widely-used, MIT-licensed, single-purpose GitHub Action built exactly for "preview a PR's static build on the project's existing GitHub Pages site without disturbing the production deploy," rather than hand-rolling subpath/branch logic. This satisfies Principle VII's "reuse an established mechanism over inventing one" even though it is a new addition, since the alternative (hand-written subpath deploy scripting) would itself be the larger, riskier custom-build option.

**Alternatives considered**:
- *Manually `workflow_dispatch` `deploy-pages.yml` from the PR branch* — rejected: it would overwrite the live production site with an unreviewed PR build, with no easy path back except a second manual redeploy of `main`.
- *A third-party preview host (Netlify/Vercel)* — rejected: introduces a new external service/account this project doesn't already use, when GitHub Pages (already adopted, feature 039) can host a PR preview via a well-established, narrowly-scoped action.
- *No live preview; static screenshots in the PR description instead* — rejected: does not satisfy FR-009/SC-004's requirement that a reviewer can browse the actual rendered result interactively.
