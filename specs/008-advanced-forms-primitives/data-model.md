# Phase 1 Data Model: Advanced Forms Primitives

## Combobox

**Entities**:
- **Option**: `{ value: string, label: string, disabled?: boolean }` — a
  single candidate. `label` is what's rendered/matched against;
  `value` is what the input is filled with on commit (identical to
  `label` in this static reference — a real integration might diverge).
- **ComboboxState** (owned by `combobox.js`, not persisted): `query`
  (current input text), `filteredOptions` (options whose `label`
  case-insensitively contains `query` as a substring), `activeIndex`
  (index into `filteredOptions` currently marked via
  `aria-activedescendant`, or `-1` when none is active).

**Utility composition** (`src/styles/tailwind.css` `@layer components`):

```css
.combobox-input {
  @apply block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm
    ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400
    focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6;
  /* Identical to the ratified Text Input pattern (feature 001) — a
     combobox input is a text input with a popup attached, not a new
     input treatment. */
}

.combobox-listbox {
  @apply mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1
    shadow-lg ring-1 ring-neutral-300;
  /* popover="auto" — top-layer rendering, native Escape/light-dismiss
     (research.md R2) */
}

.combobox-option {
  @apply relative cursor-pointer select-none px-3 py-2 text-sm
    text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100;
}

.combobox-option[aria-selected="true"] {
  @apply bg-neutral-100;
  /* the keyboard-"active" option (aria-activedescendant target) —
     reuses Dropdown Menu's active:bg-neutral-100 value as a persistent
     class rather than a :active pseudo-class, since aria-activedescendant
     moves a data attribute, not real focus (research.md R4) */
}

.combobox-option[aria-disabled="true"] {
  @apply cursor-not-allowed opacity-50;
  /* aria-disabled, not the disabled attribute — this is a <li>/<div>,
     not a form control, so `disabled` has no native effect (spec.md
     Edge Cases) */
}

.combobox-option mark {
  @apply bg-transparent font-semibold text-neutral-900;
  /* <mark> renders the matched substring; explicitly stripped of the
     browser's default yellow background and given font-semibold
     instead — research.md R5's weight-only highlight, zero new
     contrast-verification surface */
}

.combobox-empty {
  @apply px-3 py-2 text-sm text-neutral-600;
  /* "No results" state, FR-004 */
}
```

## Command Palette

**Entities**:
- **Action**: `{ id: string, label: string, disabled?: boolean }` — a
  single executable command. In this static reference, "executing" an
  action renders a visible confirmation (e.g. updating a status line in
  the demo page) rather than performing a real side effect.
- **PaletteState** (owned by `command-palette.js`, not persisted):
  identical shape to `ComboboxState` (`query`, `filteredActions`,
  `activeIndex`) — the two components share the same filtering/arrow-key
  logic, factored as a small shared helper within each script rather than
  a third shared module, since the two contexts differ enough
  (`aria-activedescendant` + Popover API for Combobox vs. `<dialog>` +
  global shortcut for Command Palette) that a forced shared abstraction
  would cost more than the ~15 lines of duplicated filter/nav logic it
  would save.

**Utility composition**:

```css
.command-palette-dialog {
  @apply relative transform overflow-hidden rounded-lg bg-white p-0
    text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg;
  /* rounded-lg/shadow-xl/sm:max-w-lg — Modal's exact dialog treatment
     (feature 003), reused verbatim per research.md R3 */
}

.command-palette-input {
  @apply block w-full border-0 border-b border-neutral-200 px-4 py-3
    text-neutral-900 placeholder:text-neutral-400 focus:ring-0 sm:text-sm;
}

.command-palette-list {
  @apply max-h-72 overflow-auto py-2;
}

.command-palette-action {
  @apply flex cursor-pointer select-none items-center px-4 py-2 text-sm
    text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100;
}

.command-palette-action[aria-selected="true"] {
  @apply bg-neutral-100;
}

.command-palette-action[aria-disabled="true"] {
  @apply cursor-not-allowed opacity-50;
}

.command-palette-action mark {
  @apply bg-transparent font-semibold text-neutral-900;
}

.command-palette-empty {
  @apply px-4 py-2 text-sm text-neutral-600;
}
```

## Shared behavior notes

- Both components' `mark` treatment intentionally overrides the
  browser's default `<mark>` styling (`background-color: yellow` in the
  UA stylesheet) — left unstyled, that default would itself be an
  unverified, unratified color introduced by omission, exactly the kind
  of gap this project's audit scripts exist to catch structurally, not
  just by omission from new markup.
- `aria-activedescendant` on `.combobox-input` and (structurally
  identical) on `.command-palette-input` is updated by script on every
  arrow-key move and on every filter re-run (since `activeIndex` may
  point past the new `filteredOptions`/`filteredActions` length after a
  keystroke narrows the set — both scripts clamp `activeIndex` back into
  range or reset it to `0`/`-1` on every filter pass).
