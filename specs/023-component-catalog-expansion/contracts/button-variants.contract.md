# Component Contract: Button Variants — ActionIcon, CopyButton, Split Button (User Story 2)

## ActionIcon

- Markup: `<button>` reusing Button's existing variant/size classes,
  sized square (icon-only), with a mandatory `aria-label` prop — this
  catalog's build MUST NOT allow an ActionIcon with no accessible name
  (spec.md FR-004; enforced at the type level in the React surface via a
  required prop, and documented as required in the static surface's
  markup convention).
- States: identical hover/active/focus-visible/disabled set as Button.

## CopyButton

- Markup: reuses Button verbatim; icon and/or label swap between a
  default state and a temporary confirmation state.
- Behavior: on click, calls `navigator.clipboard.writeText(textToCopy)`;
  on success, `status` becomes `"copied"` and the button shows a
  checkmark/"Copied" treatment for a fixed duration (research.md R7)
  before reverting to `"idle"`; on rejection (caught via try/catch),
  `status` becomes `"failed"` and a distinct failure treatment shows
  instead (spec.md Edge Cases) — never silently reporting success on
  failure.
- The confirmation/failure state change is announced via the same
  `aria-live="polite"` convention this catalog already uses elsewhere
  (e.g. Toast), so screen-reader users get the outcome without needing
  to re-focus the button.

## Split Button

- Markup: `<div role="group" aria-label="...">` containing two adjacent
  `<button>`s sharing Button Group's existing segment-adjacency border-
  radius treatment (research.md R4) — a primary action button, then a
  `<button aria-haspopup="menu" aria-expanded="...">` that opens the
  exact same Dropdown Menu panel component already shipped.
- Behavior: clicking the primary segment fires `primaryAction`
  immediately; clicking (or keyboard-activating) the second segment
  opens the dropdown, fully keyboard-navigable exactly like standalone
  Dropdown Menu (spec.md Edge Cases — no new keyboard model).

## Acceptance mapping

- Spec.md US2 AC1–AC3 → this contract.
- FR-004, FR-005, FR-006, FR-016 → this contract.
