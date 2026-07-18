# Implementation Plan: Advanced Form Inputs Batch

**Branch**: `039-advanced-form-inputs` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/039-advanced-form-inputs/spec.md`

## Summary

Ship 10 new form-input components closing genuine gaps from feature
018's inventory (research.md candidates #10-27): TagsInput,
Autocomplete, Mentions (P1 — flat suggestion/entry family), Cascader,
TreeSelect (P2 — hierarchical selection family), InputMask, JsonInput,
RangeSlider (P3 — formatted/range value entry), FloatLabel and
Interactive Rating (P4 — small enhancements to existing components).
Every item reuses an already-shipped mechanism rather than
introducing a new one: the existing MultiSelect's filter/select/
remove engine (`shared/multi-select/index.ts`) for TagsInput/
Autocomplete/Mentions, TreeView's disclosure mechanism for TreeSelect,
Dropdown Menu's panel mechanics for Cascader, the existing Slider's
native `<input type="range">` for RangeSlider, TextInput's label/
input pairing for FloatLabel, and the existing read-only Rating
component's markup for Interactive Rating.

## Technical Context

**Language/Version**: TypeScript 5.x / vanilla JS, matching this
catalog's existing stack

**Primary Dependencies**: None new — reuses `shared/multi-select/
index.ts`'s `filterOptions`/`addSelection`/`removeSelection`
(TagsInput, Autocomplete, Mentions), the existing TreeView disclosure
pattern (TreeSelect), Dropdown Menu's panel-positioning mechanism
(Cascader), the existing Slider's native range input + `.slider`
class (RangeSlider, extended to two thumbs), TextInput's markup
(FloatLabel), and the existing Rating component's star markup
(Interactive Rating)

**Storage**: N/A — all 10 components are stateless/caller-controlled

**Testing**: Playwright (visual + a11y across all 6 browser/viewport
projects), `npm run audit:tokens`/`audit:contrast`, matching every
prior feature's convention

**Target Platform**: Static HTML site + React package, both surfaces

**Project Type**: Web design system (dual-surface), existing
structure unchanged

**Performance Goals**: Every component's interaction handler is
event-driven (keydown/input/click), not a continuous/polling loop;
Mentions' popover positioning reuses the existing Popover API
mechanism rather than a scroll/resize listener

**Constraints**: FR-012 (spec.md) — zero new tokens across all 119
themes; FR-013 — full keyboard operability, no mouse-only path;
FR-009 — FloatLabel's animation MUST respect `prefers-reduced-motion`

**Scale/Scope**: 10 new components, closing feature 018's Advanced
Form Inputs category candidates #10-27 (minus items already flagged
for de-duplication: NativeSelect vs. Select, SegmentedControl vs.
Button Group, Knob/AngleSlider/HueSlider/AlphaSlider deferred as
niche/out-of-scope per research.md)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle II (WCAG 2.2 AAA)**: PASS (pending verification) —
  every component's contrast pairings reuse existing token roles
  already audited across all 119 themes; no new color role is
  introduced. Verified via the real Playwright a11y scan + `npm run
  audit:contrast` during implementation, not assumed clean by
  construction.
- **Principle III (Tailwind-only)**: PASS — no component requires
  custom CSS beyond `@apply` blocks in `src/styles/tailwind.css`,
  matching every prior feature's convention.
- **Principle IV (zero new tokens)**: PASS — TagsInput/Autocomplete/
  Mentions reuse MultiSelect's existing chip/listbox classes;
  Cascader/TreeSelect reuse Dropdown Menu's/TreeView's existing
  surface classes; RangeSlider reuses Slider's exact `.slider` class
  on a second thumb; FloatLabel reuses TextInput's existing label/
  ring/focus classes; Interactive Rating reuses the existing Rating
  component's star-icon classes verbatim.
- **Principle V (interactive state completeness)**: PASS (pending
  verification) — every new interactive element (tag remove buttons,
  cascade level triggers, tree-select nodes, range handles, rating
  stars) declares `hover:`/`active:`/`focus-visible:`/`disabled:`
  states per this catalog's existing button/input state conventions.
- **Principle VI (English artifacts / PT-BR agent comms)**: PASS —
  spec/plan/code in English; all chat communication with the user in
  PT-BR.
- **Principle VII (skill acquisition)**: N/A — no new external
  dependency or unfamiliar domain is introduced; masking, JSON
  validation, and dual-thumb range are standard patterns already
  within this catalog's existing implementation vocabulary (the one
  inventory candidate that would have required a new dependency, QR
  Code, is explicitly out of scope for this batch per spec.md
  Assumptions).

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/039-advanced-form-inputs/
├── plan.md              # This file
├── research.md          # Phase 0: mechanism-reuse verification per component
├── data-model.md        # Phase 1: the 10 entity shapes
├── contracts/
│   ├── tags-input.contract.md
│   ├── autocomplete.contract.md
│   ├── mentions.contract.md
│   ├── cascader.contract.md
│   ├── tree-select.contract.md
│   ├── input-mask.contract.md
│   ├── json-input.contract.md
│   ├── range-slider.contract.md
│   ├── float-label.contract.md
│   └── interactive-rating.contract.md
├── quickstart.md         # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── tailwind.css              # New @apply blocks per contract
├── shared/
│   ├── mentions/index.ts         # New: trigger-character detection helper
│   │                                (parallels shared/multi-select/index.ts)
│   └── input-mask/index.ts       # New: mask-pattern parser, shared by both surfaces
├── scripts/
│   ├── tags-input.js
│   ├── autocomplete.js
│   ├── mentions.js
│   ├── cascader.js
│   ├── tree-select.js
│   ├── input-mask.js
│   ├── json-input.js
│   ├── range-slider.js
│   └── float-label.js            # Trivial: focus/blur/value listeners only
└── components/
    ├── tags-input/tags-input.html
    ├── autocomplete/autocomplete.html
    ├── mentions/mentions.html
    ├── cascader/cascader.html
    ├── tree-select/tree-select.html
    ├── input-mask/input-mask.html
    ├── json-input/json-input.html
    ├── range-slider/range-slider.html
    ├── float-label/float-label.html
    └── rating/rating.html            # MODIFIED: existing component,
                                         adds interactive mode, not a new dir

packages/react/src/
├── TagsInput/TagsInput.tsx
├── Autocomplete/Autocomplete.tsx
├── Mentions/Mentions.tsx
├── Cascader/Cascader.tsx
├── TreeSelect/TreeSelect.tsx
├── InputMask/InputMask.tsx
├── JsonInput/JsonInput.tsx
├── RangeSlider/RangeSlider.tsx
├── FloatLabel/FloatLabel.tsx
└── Rating/Rating.tsx              # MODIFIED: adds `interactive` prop

tests/e2e/
└── advanced-form-inputs.spec.ts

tests/react-harness/
├── advanced-form-inputs.html
└── src/advanced-form-inputs-main.tsx
```

**Structure Decision**: Follows this catalog's existing per-component
convention. Rating is the one MODIFIED (not new) directory/component
on both surfaces, adding an opt-in interactive mode without breaking
its existing read-only default (backward-compatible per spec.md FR-010).
A new `shared/mentions/index.ts` helper is introduced for `@`-trigger
detection, mirroring the existing `shared/multi-select/index.ts`
extraction pattern rather than inlining that logic into the component
script directly.

## Complexity Tracking

*No violations — this section is intentionally empty.*
