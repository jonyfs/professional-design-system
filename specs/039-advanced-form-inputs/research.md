# Research: Advanced Form Inputs Batch

## R1. Verified reuse targets (real code inspected, not assumed)

Each candidate's plan.md reuse claim was checked directly against the
current source, not assumed from the component's name alone:

- **`shared/multi-select/index.ts`** exports `filterOptions`
  (case-insensitive substring match over a fixed `{id, label}` option
  list — the same match combobox.js/`useCombobox.ts` already use) and
  `addSelection`/`removeSelection` (immutable `Set<string>` add/
  remove). **Real fit**: `filterOptions` reuses directly for
  Autocomplete and for Mentions' suggestion list. `addSelection`/
  `removeSelection` reuse directly for TagsInput's committed-tag
  collection ONLY in shape (an immutable Set of strings) — TagsInput
  has no fixed option list to filter against (its values are
  freeform), so `filterOptions` does NOT apply to it.
- **`src/scripts/combobox.js`**'s `commit(option)` (single-value
  select-and-close) is the correct reuse target for Autocomplete
  (single-select), not `multi-select.js`'s multi-value commit —
  Autocomplete is a lighter single-select sibling of Combobox, per
  spec.md's own framing, so it reuses Combobox's commit semantics
  with MultiSelect's `filterOptions` for the list-narrowing itself.
- **TreeView** (`src/components/tree-view/tree-view.html`) uses native
  `<details>`/`<summary>` for expand/collapse — zero JavaScript for
  disclosure. TreeSelect reuses this exact markup for its hierarchy
  and adds a NEW selection layer on top (a `<details>` tree has no
  concept of a "selected" node today) — the disclosure mechanism is
  reused verbatim; selection state is genuinely new.
- **Slider** (`src/components/slider/slider.html`) is a native
  `<input type="range">` styled via `accent-color` — zero JavaScript.
  A true native dual-thumb range input does not exist cross-browser;
  RangeSlider needs two overlapping native range inputs (the
  documented fallback feature 018's own research.md already
  anticipated) plus a small clamping script so neither handle can
  cross the other — this clamping logic is the one genuinely new
  piece, not a reuse.
- **Rating** (`src/components/rating/rating.html`) currently renders
  its star row with `aria-hidden="true"` — the value is conveyed to
  assistive tech via adjacent text only, "decorative reinforcement
  only" per its own code comment. **Real finding**: making Rating
  interactive is not just "add a click handler" — the `aria-hidden`
  star markup must be replaced with a real interactive pattern
  (`role="radiogroup"` + one `role="radio"`/native radio per star,
  the standard accessible star-rating pattern) so keyboard/AT users
  get a real control, not a decorative overlay on top of hidden
  markup. This is the one component in this batch requiring a
  structural accessibility change, not just an additive one.
- **TextInput** (`src/components/text-input/text-input.html`) uses a
  standard `<label>` + `<input class="form-input">` pairing with no
  floating-label CSS today. FloatLabel is a genuinely new CSS
  transform/transition on top of this exact markup (label position
  driven by `:placeholder-shown`/`:focus` CSS selectors — no
  JavaScript needed at all for the state itself, matching this
  catalog's zero-JS-where-possible discipline).
- **Dropdown Menu** (`src/scripts/dropdown-menu.js`) provides the
  panel-open/panel-position/outside-click-close mechanics Cascader
  reuses for each level's popover; the multi-level "open a new panel
  per selection, keep prior levels visible or collapse them" behavior
  is new logic on top of that base.

## R2. Genuinely new logic per component (not covered by any reuse)

| Component | New logic required |
|---|---|
| TagsInput | Enter/comma commit, paste-splitting into multiple tags, duplicate prevention |
| Autocomplete | None beyond wiring Combobox's `commit` + MultiSelect's `filterOptions` together — the lightest item in this batch |
| Mentions | `@`-trigger detection at cursor position inside a text field, popover anchoring at the cursor (not the field's edge), token insertion/deletion as a unit |
| Cascader | Per-level child-panel rendering, path accumulation, "commit only at leaf (or configured level)" logic |
| TreeSelect | Selection state layered onto TreeView's existing disclosure tree; single committed node |
| InputMask | Mask-pattern parser (literal vs. placeholder characters), keystroke interception, paste-prefix-matching |
| JsonInput | `JSON.parse` validity check on every change, debounced only if needed for large documents, inline error state |
| RangeSlider | Two-handle clamping (low <= high always), keyboard step handling on whichever handle last received focus |
| FloatLabel | CSS-only: `:placeholder-shown`/`:focus` driven label transform; `prefers-reduced-motion` swaps the transition for an instant state change |
| Interactive Rating | Replace `aria-hidden` star markup with `role="radiogroup"`/`role="radio"` (or equivalent native radio group), click + Arrow-key value changes, clamped to min/max |

## R3. De-duplication re-check (spec.md Assumptions)

Re-verified against feature 018 research.md's own "Flagged for
de-duplication review" list before scoping this batch:
NativeSelect (vs. existing Select) and SegmentedControl (vs. existing
Button Group) are excluded, matching that flag. Knob/AngleSlider/Hue/
AlphaSlider are excluded as niche radial-input variants explicitly
tied to a ColorPicker decision this catalog has not revisited (feature
016 research.md R4) — none of the 10 components in this batch overlap
with any of the 115 already-shipped components.

## R4. Mentions helper placement

`shared/mentions/index.ts` is introduced as a new shared module
(parallel to `shared/multi-select/index.ts`'s existing extraction
pattern) rather than inlining trigger-detection logic directly into
`src/scripts/mentions.js`, since the same cursor-position/trigger-
character detection logic must be shared verbatim between the static
HTML surface and `packages/react/src/Mentions/Mentions.tsx` — the same
reason `multi-select/index.ts` exists as a separate module in the
first place (feature 023's own precedent, confirmed via its file
header comment).
