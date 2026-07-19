# Implementation Plan: Professional Multi-Screen Showcase Expansion

**Branch**: `047-professional-showcase-expansion` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/047-professional-showcase-expansion/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Expands the existing single-screen Flagship App Showcase (feature 042, `showcase/` workspace) into a 5-screen application (Dashboard + Team, Settings, Analytics, Onboarding) connected by `react-router-dom`, reusing the existing `Sidebar`/`Navbar` chrome as shared layout. Each new screen deliberately draws on feature 044's 27 newly-added React components, giving them their first real, in-context exercise — the same mechanism that surfaced feature 042's original 4 defects. Also delivers a written competitive/quality assessment cross-referencing feature 044's audit findings and the constitution's documented deferred-component list against what a real evaluator would expect from a competitive design system.

## Technical Context

**Language/Version**: TypeScript, React 18 (existing `showcase/` workspace)

**Primary Dependencies**: Existing (`@professional-design-system/react`, React, Vite) + **new**: `react-router-dom` (industry-standard client-side router, ~7-10kb gzipped core), scoped to `showcase/` only

**Storage**: N/A — client-only demo app, typed fixture data following `showcase/src/data/sample-data.ts`'s existing convention

**Testing**: Existing `tests/e2e/flagship-showcase.spec.ts` (extended for the 4 new screens); manual breakpoint/theme verification per quickstart.md

**Target Platform**: Static site (Vite build), deployed under `/showcase/` on GitHub Pages exactly as feature 042 already is

**Project Type**: Single-page web application (client-side routed) within the existing monorepo — `showcase/` workspace only, no changes to the main catalog site or `packages/react`'s own build

**Performance Goals**: Stay within `rules/web/performance.md`'s "App page" budget (<300kb JS gzipped) despite adding a router and more component usage

**Constraints**: FR-007 (the 4 originally-fixed defects must remain fixed), FR-003 (every included component must serve a genuine purpose, not padding), FR-005 (every screen independently meets AAA contrast/token-discipline/responsive requirements)

**Scale/Scope**: 4 new screens + 1 existing, targeting a majority of the catalog's 137 exported components (110 pre-044 + 27 from feature 044) represented somewhere across the app, up from 21 today

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Cognitive Ergonomics)**: PASS. Each screen's own information architecture (research.md R2) is deliberately scoped to one realistic purpose, not a component dump.
- **Principle II (WCAG 2.2 AAA, NON-NEGOTIABLE)**: PASS. FR-005 requires every new screen to meet the same AAA bar as the existing Dashboard; no new exception introduced.
- **Principle III (Tailwind-Only)**: PASS. New screens compose existing catalog components; no parallel CSS.
- **Principle IV (Design Token Discipline)**: PASS. All rendering goes through existing catalog components' own token-compliant styling — the showcase app itself doesn't author raw Tailwind classes for component internals.
- **Principle V (Interactive State Completeness)**: PASS/N/A — inherited from the catalog components used, not re-implemented here.
- **Principle VI (Language)**: PASS. English source, PT-BR communication.
- **Principle VII (Autonomous Skill Acquisition Protocol, NON-NEGOTIABLE)**: PASS, with disclosure. `react-router-dom` is a new dependency, added to `showcase/`'s own `package.json` only (not the core catalog or `packages/react`). Verified before adoption: the de facto standard React router (millions of weekly downloads, MIT license, actively maintained), matching this project's existing precedent of adopting an established library over hand-rolling equivalent infrastructure (feature 020's Recharts adoption is the direct precedent). Disclosed here per Principle VII.

**Result**: No violations. One disclosed new dependency, scoped to the demo app only (Complexity Tracking below).

## Project Structure

### Documentation (this feature)

```text
specs/047-professional-showcase-expansion/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
├── competitive-assessment.md   # User Story 3 deliverable
└── tasks.md
```

### Source Code (repository root)

```text
showcase/
├── package.json                 # MODIFIED — add react-router-dom
├── src/
│   ├── App.tsx                  # MODIFIED — becomes the router + shared layout shell
│   ├── screens/                 # NEW
│   │   ├── DashboardScreen.tsx  # existing content, extracted from App.tsx
│   │   ├── TeamScreen.tsx       # NEW
│   │   ├── SettingsScreen.tsx   # NEW
│   │   ├── AnalyticsScreen.tsx  # NEW
│   │   └── OnboardingScreen.tsx # NEW
│   └── data/
│       └── sample-data.ts       # MODIFIED — extended with per-screen fixture data

tests/e2e/flagship-showcase.spec.ts  # MODIFIED — extended for the 4 new screens
```

**Structure Decision**: A `screens/` directory is introduced within the existing `showcase/src/` (not a new workspace) — the current single `App.tsx` becomes the router shell, and its existing content moves into `DashboardScreen.tsx` unchanged. No changes to `packages/react` or the main catalog site. No `contracts/` directory: this feature exposes no external API.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| New dependency: `react-router-dom` (scoped to `showcase/` only) | Spec.md FR-001 requires deep-linkable, independently-navigable screens | A hand-rolled `useState` screen switcher was rejected — it cannot produce real URLs/browser history without reimplementing what a router already solves, and this project's own precedent (feature 020) favors adopting an established library over that |
