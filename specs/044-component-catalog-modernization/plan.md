# Implementation Plan: Component Catalog Quality & 2026 Modernization Audit

**Branch**: `044-component-catalog-modernization` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/044-component-catalog-modernization/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

A systematic, batch-by-category audit of all ~119 shippable catalog components (124 `src/components/*` directories minus 5 constitution-documented deferred components with nothing shipped) against five quality dimensions — visibility/contrast, cross-component consistency, theme-adaptability, responsiveness, and React parametrization — reusing this project's own existing automated gates (`audit:tokens`, `audit:contrast`, the Playwright visual/a11y suite) as the objective pass/fail signal wherever one already exists. Components that already pass every dimension but demonstrate fewer than 4 of the 10 already-documented "Required Qualities" (`rules/web/design-quality.md`) receive a targeted 2026-trend visual refinement — audit-flagged only, never a proactive full-catalog reskin (per the user's explicit scope decision). Delivered as a single PR; since no PR-preview deployment mechanism exists today (a real gap found during planning — `deploy-pages.yml` only deploys `main`), this plan adds one small, additional workflow using the established `rossjrw/pr-preview-action` to publish a live, disposable preview of the PR build to the same GitHub Pages site.

## Technical Context

**Language/Version**: TypeScript, HTML/CSS (Tailwind CSS v3), React (via `packages/react` workspace); Node.js LTS

**Primary Dependencies**: Tailwind CSS, `@playwright/test` + `@axe-core/playwright` (existing E2E/a11y/visual-regression suite), Vite (build), the project's own `scripts/audit-tokens.mjs` and `scripts/check-contrast.mjs`; **new**: `rossjrw/pr-preview-action` (GitHub Action, MIT-licensed, 428★, actively maintained — verified via `gh api repos/rossjrw/pr-preview-action` and a web security check, no red flags found) for PR-preview deployment only

**Storage**: N/A — no application data store; this feature reads/writes static component source files and CI workflow config only

**Testing**: The project's existing Playwright E2E suite (visual regression + accessibility) is both the subject of the React-parametrization/responsiveness dimensions AND the regression-safety net for every fix this feature makes

**Target Platform**: Static site (Vite build) + GitHub Pages hosting; `packages/react` as a versioned workspace package

**Project Type**: Web design-system monorepo (existing structure) — `src/components/<name>/<name>.html` (HTML/CSS demo pages), `packages/react/src/<PascalName>` (React wrappers), `tests/e2e/<name>.spec.ts` (Playwright suites per component)

**Performance Goals**: No new performance targets — any visual refinement (FR-004) must continue to meet the existing CWV/bundle budgets in `rules/web/performance.md`; this is a constraint, not a goal, of this feature

**Constraints**: FR-002/FR-003 (fix only real, provable gaps — no speculative rewrites), FR-004 (refinement gated at <4/10 Required Qualities, only for components already passing all five dimensions — per explicit user decision), FR-007 (WCAG 2.2 AAA preserved), FR-010 (zero test-coverage reduction), FR-008/FR-009 (single PR, live previewable before merge)

**Scale/Scope**: ~119 shippable components (124 `src/components/*` dirs minus 5 deferred), 110 `tests/e2e/*.spec.ts` suites, 115 `packages/react/src/*` wrappers, 100+ curated themes (sampled per research.md R4, not exhaustively checked)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Unlike feature 043 (pure CI infra), this feature directly engages Principles I-V — it exists specifically to re-verify and, where genuinely lacking, restore compliance with them across the catalog.

- **Principle I (Cognitive Ergonomics)**: PASS. The audit's "consistency" and "Required Qualities" dimensions directly measure this; fixes only tighten compliance, never loosen it.
- **Principle II (WCAG 2.2 AAA, NON-NEGOTIABLE)**: PASS. Reuses the existing non-negotiable `audit:contrast` gate as-is (research.md R1); FR-007 explicitly requires every refinement to keep passing it. No new exception is introduced.
- **Principle III (Tailwind-Only)**: PASS. All fixes and refinements stay within Tailwind utilities/tokens — no parallel CSS is introduced by this feature's scope.
- **Principle IV (Design Token Discipline, NON-NEGOTIABLE)**: PASS. Reuses the existing non-negotiable `audit:tokens` gate as-is; this is the literal, objective definition of "consistency" this feature uses (FR-006), not a new interpretation.
- **Principle V (Interactive State Completeness, NON-NEGOTIABLE)**: PASS. The React-parametrization dimension (FR-005) is this Principle applied specifically to the React package's prop surface, reusing each component's own existing E2E suite as the authoritative list of states to check (research.md R3).
- **Principle VI (Project Language Policy, NON-NEGOTIABLE)**: PASS. All audited source, workflow YAML, and planning docs stay in English; all agent-to-user communication for this feature is in PT-BR.
- **Principle VII (Autonomous Skill Acquisition Protocol, NON-NEGOTIABLE)**: PASS, with one flagged addition requiring disclosure. `/ui-ux-pro-max` and `/frontend-design` are already-installed local skills reused for their checklists (no new install). However, research.md R5 identifies a genuine gap — no PR-preview deployment mechanism exists — and proposes adding `rossjrw/pr-preview-action` (a new external GitHub Action) to close it. Verified before adoption: MIT license (compatible), actively maintained (428★, pushed 2026-04-26, not archived), single-purpose and narrowly scoped (deploys a PR's static build to a subpath of the existing Pages site and *cleans up after itself* — no orphaned previews), no security advisories found via a targeted check. This is disclosed here and again in the completion report per Principle VII's "inform the user which skill/dependency and why" requirement — this is the smallest, most narrowly-scoped way to satisfy spec.md FR-009, versus hand-rolling equivalent subpath-deploy logic.
- **Governance — Live Deployment & Semantic Versioning (feature 039, v1.37.0)**: PASS, unaffected. The new `pr-preview.yml` workflow is additive and triggers only on `pull_request` events — it does not touch `deploy-pages.yml`'s existing `workflow_run`-gated production deploy or the auto-semver `version` job, and does not deploy to the production Pages root.

**Result**: No blocking violations. One disclosed, justified new dependency (Complexity Tracking below).

## Project Structure

### Documentation (this feature)

```text
specs/044-component-catalog-modernization/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

No new workspaces. This feature audits and, where a genuine gap or FR-004 refinement is found, modifies existing catalog source across three parallel trees that already exist per-component:

```text
src/components/<name>/<name>.html       # AUDITED, fixed/refined per-component where needed
packages/react/src/<PascalName>/        # AUDITED for prop-parity (FR-005); fixed where a state
                                         # lacks a corresponding prop
tests/e2e/<name>.spec.ts                # Source of truth for "which states exist" (research R3);
                                         # coverage only ever added here, never removed (FR-010)
tests/e2e/<name>.spec.ts-snapshots/     # REGENERATED only for components whose visual output
                                         # actually changed as part of a fix/refinement

scripts/audit-tokens.mjs                # REUSED as-is (no changes) — the consistency gate
scripts/check-contrast.mjs              # REUSED as-is (no changes) — the AAA contrast gate
rules/web/design-quality.md             # REUSED as-is (no changes) — the FR-004 rubric

.github/workflows/pr-preview.yml        # NEW — publishes a disposable PR-scoped preview to
                                         # GitHub Pages via rossjrw/pr-preview-action
                                         # (research.md R5); additive, does not modify
                                         # deploy-pages.yml or ci.yml
```

**Structure Decision**: No new source directories or workspaces. The audit works across the three existing, already-parallel per-component trees (`src/components`, `packages/react/src`, `tests/e2e`) batch-by-batch (research.md R2's category grouping), reusing existing automated gates rather than building new tooling. The only net-new file is the additive `pr-preview.yml` workflow. No `contracts/` directory is generated: this feature's "contract" (what props/states each component must expose) is discovered per-component by the audit itself and recorded in each component's own audit record (data-model.md), not a fixed schema to design upfront across 119 heterogeneous components.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| New external GitHub Action (`rossjrw/pr-preview-action`) | Spec.md FR-009/SC-004 requires a live, browsable PR preview before merge; no such mechanism exists today (research.md R5) | Hand-rolling equivalent subpath-deploy-and-cleanup logic would be a larger, less-audited custom surface than adopting a narrowly-scoped, actively-maintained, MIT-licensed action built exactly for this purpose; manually re-dispatching the production `deploy-pages.yml` against a PR branch was rejected as it would overwrite the live production site mid-review |
