# Implementation Plan: Advanced Data Table

**Branch**: `022-advanced-data-table` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/022-advanced-data-table/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship a new, interactive `DataTable` component — distinct from and additive
to feature 012's existing zero-JavaScript `Table` — supporting sort
(single/multi-column), filtering (global + per-column), pagination, row
selection (single/page/all-matching-across-pages) with a bulk-action
toolbar, and opt-in per-instance CRUD (create/edit/delete) with
validation and confirmation. Built with **zero new dependencies**: a
shared, framework-agnostic state module (`shared/data-table/`, mirroring
feature 019's `shared/validators/` precedent) drives both a vanilla-JS
static implementation and a React implementation, reusing this catalog's
already-ratified `Pagination`, `Modal`, `TextInput`/`Select` error
pattern, and Empty State recipe rather than inventing new interaction
primitives or importing a headless table library.

## Technical Context

**Language/Version**: TypeScript 5.6 (shared state module + React),
vanilla ES modules for the static wiring layer (matches every other
static-gallery script)

**Primary Dependencies**: None new — research.md R1 documents why a
headless table library (TanStack Table, the closest real-world fit
surveyed in spec.md's Research Summary) was evaluated and rejected in
favor of hand-rolled state, following this catalog's own Combobox/
Dropdown-Menu precedent of building comparable-complexity WAI-ARIA
interaction patterns from scratch

**Storage**: N/A — the component operates on a caller-supplied in-memory
dataset (spec.md Assumptions: "data source is caller-supplied, not this
feature's concern"); no persistence of its own

**Testing**: Playwright (`tests/e2e/data-table.spec.ts` +
`tests/e2e/react-data-table.spec.ts`, this catalog's established
dual-surface convention)

**Target Platform**: Web — both the static HTML gallery and
`@professional-design-system/react` (default dual-shipping, no exception
needed, unlike feature 020's Chart)

**Performance Goals**: Sort/filter/page/select operations on a
1,000-row dataset complete with no perceptible delay (spec.md SC-001) —
achievable with plain array operations at this scale, no virtualization
needed (spec.md Assumptions explicitly defers virtualization)

**Constraints**: Zero new npm dependency (Principle VII not triggered);
zero new design tokens (Principle IV); must remain usable via the
existing `.data-table-wrapper` horizontal-scroll convention at 320px
(spec.md FR-014); every new interactive element needs the full
hover/active/focus-visible/disabled state set (spec.md FR-019,
Constitution Principle V)

**Scale/Scope**: One new shared state module (`shared/data-table/`,
~5-6 files: sorting, filtering, pagination, selection, plus an
index barrel), one new static component (`src/components/data-table/`
+ `src/scripts/data-table.js`), one new React component
(`packages/react/src/DataTable/`), reusing 4 already-ratified catalog
patterns (Pagination, Modal, TextInput/Select error convention, Empty
State recipe) rather than building new ones

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Bulk-action toolbar and row actions follow the researched UX precedent (spec.md Research Summary: contextual toolbar on selection, ≤3 row-level action icons) — primary vs. secondary actions stay visually distinct, matching this catalog's existing Button primary/secondary hierarchy | PASS |
| II. Absolute Semantic Accessibility (WCAG AAA) | Sortable headers use real `<button>` + `aria-sort` on `<th>`; sort/filter-count/CRUD-result changes announced via `aria-live="polite"` (FR-016); destructive actions require confirmation (FR-009/FR-012, reusing Modal); form validation errors reuse TextInput's already-AAA-verified error pattern — all must be verified empirically once built, per this catalog's own repeated "ratified but never empirically verified" lesson | PASS (verify empirically in Phase 3) |
| III. Tailwind-Only Architecture | New classes (`.data-table-sort-button`, `.data-table-filter-input`, `.data-table-toolbar`, etc.) follow the exact `.data-table*`/`.pagination-*` naming and `@apply`-block convention already established (feature 012/007) — no parallel CSS | PASS |
| IV. Design Token Discipline | Zero new tokens — every new class composes only already-ratified `bg-*`/`text-*`/`ring-*`/`border-*` tokens | PASS |
| V. Interactive State Completeness | Every new interactive element (sort button, filter input, selection checkbox, bulk-action button, row action button, CRUD form controls) MUST declare the full hover/active/focus-visible/disabled set — enforced per contract, checked in Phase 3 | PASS (enforced in contracts) |
| VI. Project Language Policy | Code/docs in English; chat responses in PT-BR | PASS |
| VII. Autonomous Skill Acquisition Protocol | A real candidate dependency (TanStack Table) was identified and evaluated per spec.md's own research phase, then explicitly rejected in favor of a zero-dependency, hand-rolled approach (research.md R1) — Principle VII's diligence was applied and its conclusion was "do not adopt," which is itself a valid, documented outcome of the protocol | PASS (documented non-adoption) |

No violations — Complexity Tracking intentionally omitted. One
architectural note carried into Phase 1: this is this catalog's most
JS-heavy interactive component to date (comparable to, and built using
the same rigor as, Combobox/Dropdown Menu's from-scratch WAI-ARIA work),
not a Constitution violation but a genuine scope/complexity fact worth
flagging for the tasks phase.

## Project Structure

### Documentation (this feature)

```text
specs/022-advanced-data-table/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
shared/data-table/
├── sorting.ts            # multi-column sort state + comparator application
├── filtering.ts           # global + per-column filter application
├── pagination.ts          # page/pageSize slicing, reuses no new UI, just math
├── selection.ts           # selection Set + "page" vs "all-matching" scope
└── index.ts                # barrel

src/components/data-table/
└── data-table.html         # static demo — sort/filter/paginate/select/CRUD
src/scripts/
└── data-table.js           # vanilla wiring: imports shared/data-table/,
                             # binds sort buttons, filter inputs, checkboxes,
                             # bulk toolbar, row actions, CRUD <dialog> forms
                             # (reuses overlay.js's wireDialogClose() for the
                             # CRUD modal, same mechanism Command Palette
                             # reused from Modal in feature 008)

packages/react/src/DataTable/
├── DataTable.tsx           # top-level component
├── DataTableToolbar.tsx    # bulk-action toolbar (shown when selection > 0)
├── DataTableRowActions.tsx # per-row view/edit/delete action group
├── DataTableForm.tsx       # create/edit form, composed inside Modal
└── DataTableEmptyState.tsx # "no data" vs "no results" (reuses Empty State recipe)

packages/react/src/hooks/
└── useDataTable.ts         # wraps shared/data-table/ state functions in
                             # React state, mirrors useValidatedInput's
                             # "thin hook over shared pure functions" shape
                             # from feature 019

tests/e2e/
├── data-table.spec.ts       # static: sort/filter/paginate/select/bulk/CRUD
└── react-data-table.spec.ts # React: same acceptance criteria
```

**Structure Decision**: Dual-surface addition (static HTML + React),
this catalog's default convention. The one new architectural element is
`shared/data-table/` — a framework-agnostic TypeScript module holding
every piece of table *state logic* (sort/filter/paginate/select), mirroring
`shared/validators/`'s (feature 019) single-source-of-truth pattern so
neither surface reimplements the same logic twice. All *rendering* stays
surface-specific (`src/scripts/data-table.js` for static, React components
+ `useDataTable` for the package) — only the state transitions are shared.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally omitted (see Constitution Check
above; the "most JS-heavy component yet" note is a scope observation for
task planning, not a principle violation requiring justification).
