# Component Contract: Navigation & Disclosure Utilities — NavLink, Anchor, Collapse, Spoiler (User Story 4)

## NavLink

- Markup: a single `<a href>` reusing Sidebar's exact active-item
  classes (research.md R6) when `current` is true, including
  `aria-current="page"`; the same classes minus the active treatment
  when false.
- Behavior: purely presentational/navigational — no client-side state
  beyond the `current` prop the caller supplies (this catalog does not
  do client-side routing; `current` is caller-determined, e.g. from the
  current URL).

## Anchor

- Markup: a single `<a href>` using this catalog's existing inline-link
  typography/color tokens (no new tokens, research.md).
- Behavior: none — the simplest component in this batch.

## Collapse

- Markup: native `<details><summary>...</summary><div>...content...
  </div></details>` (research.md R5) — no custom JS-driven
  `aria-expanded` toggling needed; the browser's native disclosure
  semantics handle accessibility for free, matching Accordion/TreeView's
  existing precedent.
- Behavior: exactly one instance's open/closed state, with zero
  awareness of any other Collapse instance on the page (distinct from
  Accordion, which the caller can additionally choose to render as a
  group of Accordion items with mutually-exclusive open state — Collapse
  is the single-item primitive Accordion composes from, exposed
  standalone for the first time in this batch).

## Spoiler

- Markup: Collapse's exact `<details>` structure, plus a truncation
  measurement (`max-height` via a Tailwind `line-clamp-*` utility) applied
  to the content while closed, removed while open.
- Behavior: while closed and the content's natural height exceeds the
  clamp, a "Show more" `<summary>` control is shown; once opened, full
  content displays with a "Show less" control to re-collapse (spec.md
  US4 AC4). If content never exceeds the clamp threshold, Spoiler
  renders as plain, unclamped content with no controls at all (an
  implicit edge case: a "show more" affordance for content that doesn't
  need it would be confusing, not merely redundant).

## Acceptance mapping

- Spec.md US4 AC1–AC4 → this contract.
- FR-011, FR-012, FR-013, FR-014, FR-016 → this contract.
