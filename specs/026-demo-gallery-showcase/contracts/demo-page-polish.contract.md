# Component Contract: Individual Demo Page Polish (User Story 3)

## Scope

Applies uniformly to all 77 `src/components/**/*.html` pages
(research.md R5) via `scripts/apply-demo-page-polish.mjs`, the same
scripted-rollout pattern feature 025 established.

## Markup contract

- The page's existing `<h1>` + intro `<p>` (where present) + theme
  selector block (feature 025) are wrapped in a slightly more
  considered header treatment — consistent vertical rhythm and a
  subtle visual separation (e.g. a bottom border or background tint
  using already-ratified tokens) from the component demonstration
  content that follows.
- Multi-state components (e.g. Button's primary/secondary, Badge's
  four severities) keep their EXISTING internal section/heading
  structure — this feature does not restructure how a page organizes
  its own variants, only the page-level framing around that content
  (spec.md US3 AC2 is satisfied by pages that already use per-variant
  `<section>`/`<h2>` headings, which most already do; this is a
  presentation-consistency pass, not a markup rewrite of per-component
  demo content).
- No change to any `data-testid` attribute, component markup, or
  script reference — this is purely additive wrapper/spacing markup
  around existing content (spec.md FR-007).

## Preserved guarantees

- Zero-JavaScript pages remain zero-JavaScript (spec.md Edge Cases).
- The page remains independently viewable with directly copyable
  component markup — the wrapper is presentation chrome, not part of
  "the component's own markup" a visitor would copy.

## Acceptance mapping

- Spec.md US3 AC1–AC2 → this contract.
- FR-006, FR-007, FR-008 → this contract.
