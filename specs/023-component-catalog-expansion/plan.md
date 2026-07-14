# Implementation Plan: Component Catalog Expansion (Batch 1)

**Branch**: `023-component-catalog-expansion` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/023-component-catalog-expansion/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship 14 new components across both surfaces (static HTML/vanilla JS +
React), each a deliberately low-risk slice of feature 018's pre-existing
105-candidate gap inventory, re-validated against a fresh round of 22
named competitor design systems in total: NumberInput, PasswordInput,
MultiSelect (form inputs); ActionIcon, CopyButton, Split Button (button
variants); Avatar Group, Highlight, Code, ColorSwatch (data-display
micro-components); NavLink, Anchor, Collapse, Spoiler (navigation/
disclosure utilities). Every component reuses an existing mechanism
already in this catalog (Button's variant system, Accordion's native
`<details>`, Sidebar's active-link pattern, Dropdown Menu's panel,
Avatar's sizing tokens) — zero new interaction patterns, zero new
dependencies, zero new design tokens.

## Technical Context

**Language/Version**: TypeScript 5.6 (React components + one small
shared module), vanilla ES modules for the static wiring layer (matches
every other static-gallery script)

**Primary Dependencies**: None new — every component is built from
native browser APIs (Clipboard API for CopyButton, native `<details>`
for Collapse/Spoiler, native `<input type="number">` for NumberInput)
or by directly extending an already-shipped component's existing
mechanism (Button, Accordion, Sidebar, Dropdown Menu, Avatar, Combobox)

**Storage**: N/A — all 14 components are stateless/caller-controlled UI
primitives, no persistence

**Testing**: Playwright, one spec pair per component group following
this catalog's established dual-surface convention (static + React),
consistent with how features 019/022 grouped related components into
fewer, larger spec files rather than one file per component

**Target Platform**: Web — both the static HTML gallery and
`@professional-design-system/react` (default dual-shipping, no
exception needed)

**Performance Goals**: No component in this batch has a performance-
sensitive dataset or animation loop (spec.md explicitly excludes
RingProgress/LoadingOverlay, the two candidates in the source inventory
carrying any animation cost) — standard interaction-latency expectations
apply, nothing measurable beyond that

**Constraints**: Zero new npm dependency (Principle VII not triggered
for any of the 14); zero new design tokens (Principle IV) — every class
composes only already-ratified `bg-*`/`text-*`/`ring-*`/`border-*`/
`rounded-*` tokens; every new interactive element needs the full
hover/active/focus-visible/disabled state set (spec.md FR-016,
Constitution Principle V)

**Scale/Scope**: 14 components grouped into 4 user-story batches; one
new shared module (`shared/multi-select/`) only for MultiSelect's chip-
state logic (the one component in this batch with genuine cross-surface
state beyond simple DOM toggling); the remaining 13 need no shared
module — CopyButton's clipboard-state and Collapse/Spoiler's open-state
are trivial enough to implement natively per surface without a shared
abstraction, matching this catalog's precedent of only extracting a
`shared/*` module when logic is non-trivial (compare: `shared/
validators/` for checksum algorithms, `shared/data-table/` for
sort/filter/paginate — vs. Accordion/Toggle/Modal, which have never
needed one)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | Every component is a variant or direct extension of an already-ratified pattern (Button, Accordion, Sidebar, Avatar) — visual hierarchy is inherited, not reinvented, minimizing the risk of an inconsistent new pattern | PASS |
| II. Absolute Semantic Accessibility (WCAG AAA) | ActionIcon requires a mandatory `aria-label` (FR-004); NavLink uses `aria-current="page"` (FR-011); PasswordInput's toggle must not break password-manager autofill heuristics (verify empirically in Phase 3, this catalog's own repeated lesson about verifying rather than assuming); Collapse/Spoiler use native `<details>`/`aria-expanded` patterns already proven accessible by Accordion/TreeView | PASS (verify empirically in Phase 3) |
| III. Tailwind-Only Architecture | New classes follow existing naming conventions per extended component (`.btn-action-icon`, `.copy-btn`, `.avatar-group`, `.nav-link`, etc.) — no parallel CSS | PASS |
| IV. Design Token Discipline | Zero new tokens — spec.md SC-004 makes this an explicit success criterion, not just an aspiration | PASS |
| V. Interactive State Completeness | Every new interactive element (NumberInput's steppers, PasswordInput's toggle, MultiSelect's chips/removal, ActionIcon, CopyButton, Split Button's two segments, NavLink, Anchor, Collapse/Spoiler triggers) declares the full hover/active/focus-visible/disabled set, enforced per contract | PASS (enforced in contracts) |
| VI. Project Language Policy | Code/docs in English; chat responses in PT-BR | PASS |
| VII. Autonomous Skill Acquisition Protocol | Zero new dependencies proposed for any of the 14 components — the protocol's adoption-review step is not triggered; QRCode, Emoji Picker, and Rich Text Editor (the inventory's only genuine new-dependency candidates) are explicitly excluded from this batch (spec.md Assumptions) | PASS (not triggered) |

No violations — Complexity Tracking intentionally omitted. This is this
catalog's largest single-feature component COUNT (14) but each is
individually far smaller in scope than DataTable/Chart — the aggregate
complexity is spread across many small, independent components, not
concentrated in one large one, matching feature 019's 11-component
batch shape more than feature 022's single-large-component shape.

## Project Structure

### Documentation (this feature)

```text
specs/023-component-catalog-expansion/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
shared/multi-select/
└── index.ts                   # MultiSelect's chip-add/remove/filter pure
                                # functions, the one genuinely shared piece
                                # of logic in this batch

src/components/
├── number-input/number-input.html
├── password-input/password-input.html
├── multi-select/multi-select.html
├── action-icon/action-icon.html
├── copy-button/copy-button.html
├── split-button/split-button.html
├── avatar-group/avatar-group.html
├── highlight/highlight.html
├── code/code.html
├── color-swatch/color-swatch.html
├── nav-link/nav-link.html
├── anchor/anchor.html
├── collapse/collapse.html
└── spoiler/spoiler.html
src/scripts/
├── number-input.js
├── password-input.js
├── multi-select.js             # imports shared/multi-select/
├── copy-button.js
├── split-button.js
└── collapse.js                  # shared script for both Collapse + Spoiler
                                  # (same <details>-based mechanism, Spoiler
                                  # adds only truncation measurement)
                                  # ActionIcon/Highlight/Code/ColorSwatch/
                                  # NavLink/Anchor/Avatar Group are pure
                                  # markup+CSS, no script needed

packages/react/src/
├── NumberInput/NumberInput.tsx
├── PasswordInput/PasswordInput.tsx
├── MultiSelect/MultiSelect.tsx  # imports shared/multi-select/
├── ActionIcon/ActionIcon.tsx
├── CopyButton/CopyButton.tsx
├── SplitButton/SplitButton.tsx
├── AvatarGroup/AvatarGroup.tsx
├── Highlight/Highlight.tsx
├── Code/Code.tsx
├── ColorSwatch/ColorSwatch.tsx
├── NavLink/NavLink.tsx
├── Anchor/Anchor.tsx
├── Collapse/Collapse.tsx
└── Spoiler/Spoiler.tsx

tests/e2e/
├── catalog-expansion-inputs.spec.ts        # static: NumberInput/PasswordInput/MultiSelect
├── catalog-expansion-buttons.spec.ts       # static: ActionIcon/CopyButton/SplitButton
├── catalog-expansion-data-display.spec.ts  # static: AvatarGroup/Highlight/Code/ColorSwatch
├── catalog-expansion-nav-utility.spec.ts   # static: NavLink/Anchor/Collapse/Spoiler
└── react-catalog-expansion-*.spec.ts       # React mirrors of the four above
```

**Structure Decision**: Dual-surface addition (static HTML + React),
this catalog's default convention. Unlike feature 022's single large
`shared/data-table/` module, only `shared/multi-select/` is introduced
here — the other 13 components are simple enough that surface-specific
implementation (not a shared abstraction) is the right call, avoiding
the anti-pattern of a premature shared module for logic that's just a
few lines per surface. Tests are grouped by user story (4 static + 4
React spec files) rather than one file per component, matching this
catalog's precedent of grouping related, smaller components (e.g.
feature 019's localized inputs shared fewer, larger spec files rather
than 11 individual ones).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally omitted.
