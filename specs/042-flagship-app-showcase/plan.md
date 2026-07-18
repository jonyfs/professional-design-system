# Implementation Plan: Flagship App Showcase

**Branch**: `042-flagship-app-showcase` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/042-flagship-app-showcase/spec.md`

## Summary

A new, standalone, published single-page application (`showcase/`) — a
realistic SaaS dashboard composed from this catalog's own real,
already-shipped components (`@professional-design-system/react`),
built and deployed to GitHub Pages alongside the main static site, but
kept architecturally separate from `tests/react-harness` (that
directory's own header comment states it is "Dev-only harness, never
published" — repurposing it here would silently break that stated
contract). At least one real Chart is required by spec.md FR-002,
which is React-only (this catalog's own established constraint, first
documented in feature 020) — this is the deciding factor for building
the showcase as a React app rather than on the static HTML surface.

## Technical Context

**Language/Version**: TypeScript/React, matching `packages/react`'s
existing stack

**Primary Dependencies**: `@professional-design-system/react` (the
published package itself, consumed the same way any real product
would), reusing its existing peer dependencies (React, Recharts via
the Chart component) — no new dependency introduced

**Storage**: N/A — all displayed data (metrics, table rows,
notifications) is static, fictional sample data bundled with the page
(spec.md FR-009), never fetched from a real backend

**Testing**: Playwright — a new `tests/e2e/flagship-showcase.spec.ts`,
matching this catalog's convention of one dedicated spec file per
feature; axe-core for the accessibility scan (SC-002); a component-
count assertion for SC-001's 15-component floor

**Target Platform**: A new, separate small Vite + React app under
`showcase/`, built independently from both the static site
(`vite.config.ts`) and the dev-only test harness
(`tests/react-harness/`), deployed to GitHub Pages under a
`/showcase/` subpath alongside the main site (`deploy-pages.yml`,
feature 039)

**Performance Goals**: Standard SPA load — no specific new target
beyond this catalog's existing bundle-size discipline; Chart/Recharts
is already an accepted dependency weight (feature 020)

**Constraints**: FR-004 (spec.md) — re-colors correctly under all 119
themes; FR-005 — AAA contrast + zero a11y violations; FR-007 — must
not modify the existing homepage or catalog; FR-008 — no horizontal
overflow at 320/768/1024/1440px

**Scale/Scope**: 1 new page, assembling >=15 of the 123 existing
components (SC-001) into one realistic composition; zero changes to
any existing component's own implementation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle II (WCAG 2.2 AAA)**: PASS (pending verification) — every
  component reused already carries its own AAA-verified token
  contrast; no new color pairing is introduced by this feature itself.
  Verified via the real Playwright a11y scan + `npm run audit:contrast`
  during implementation, not assumed clean by construction.
- **Principle III (Tailwind-only)**: PASS — the showcase app consumes
  `@professional-design-system/react`'s own already-compiled styles
  (`@professional-design-system/react/styles.css`, the same import
  every `tests/react-harness` page already uses) rather than
  authoring new Tailwind config of its own.
- **Principle IV (zero new tokens)**: PASS — no new color, radius, or
  typography token; every visual element is an existing component
  rendered with its own existing token-driven classes.
- **Principle V (interactive state completeness)**: PASS — every
  interactive element reused is the SAME shipped component already
  verified against this Principle on its own dedicated catalog page;
  this feature adds no new bespoke interactive element of its own.
- **Principle VI (English artifacts / PT-BR agent comms)**: PASS —
  spec/plan/code in English; chat communication in PT-BR.
- **Principle VII (skill acquisition)**: N/A — no new external
  dependency; Recharts (via Chart) is an already-adopted dependency
  from feature 020, not a new one introduced here.

No violations requiring justification — Complexity Tracking documents
one deliberate, non-principle architectural decision (new `showcase/`
app vs. reusing `tests/react-harness/`) instead.

## Project Structure

### Documentation (this feature)

```text
specs/042-flagship-app-showcase/
├── plan.md              # This file
├── research.md          # Phase 0: surface decision, component selection, data shape
├── data-model.md        # Phase 1: the showcase's sample-data entities
├── contracts/
│   └── flagship-showcase.contract.md
├── quickstart.md         # Phase 1: validation steps
└── tasks.md               # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
showcase/                          # New: standalone published app, NOT tests/react-harness
├── package.json                   # Depends on @professional-design-system/react (workspace)
├── vite.config.ts                 # base: /professional-design-system/showcase/ for the Pages build
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # The single composed dashboard screen
│   ├── data/
│   │   └── sample-data.ts         # Fictional metrics/table-rows/notifications (spec.md FR-009)
│   └── harness.css                # Same minimal wrapper CSS pattern as tests/react-harness

.github/workflows/deploy-pages.yml  # MODIFIED: build showcase/ too, copy its dist/ into
                                     # the main dist/showcase/ before upload-pages-artifact
                                     # (same pattern already used for react-harness/chart.html's fix)

src/components/chart/chart.html     # MODIFIED: broken hardcoded localhost:5174 link fixed
                                     # to point at the deployed /showcase/ (or a dedicated
                                     # react-harness path) — tracked as a pre-existing,
                                     # unrelated bug found while investigating this feature

index.html                          # MODIFIED: one new link to showcase/index.html (FR-006)

tests/e2e/flagship-showcase.spec.ts  # New dedicated spec
```

**Structure Decision**: `showcase/` is a new top-level workspace,
independent of `tests/react-harness/` (explicitly dev-only, never
published, per its own existing header comment) and independent of the
static site's own `vite.config.ts` (which has no React/JSX pipeline at
all). It depends on `@professional-design-system/react` as a normal
consumer would, proving the package works standalone outside this
monorepo's own test infrastructure — arguably a more honest
"real app" proof than reusing the test harness would have been.

## Complexity Tracking

| Decision | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| New `showcase/` app instead of reusing `tests/react-harness/` | The harness's own header comment states it is dev-only and never published; repurposing it to also be a public-facing showcase silently breaks that documented contract and conflates test infrastructure with a production demo | Reusing the harness directly would have been less work, but would mean a "dev-only" directory is now silently load-bearing for a real, published, user-facing page — a maintenance trap the first person to "clean up unused dev tooling" would walk into |
