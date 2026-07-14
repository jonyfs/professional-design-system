# Phase 0 Research: Gallery Theme Selector

No NEEDS CLARIFICATION markers remain in plan.md's Technical Context —
every decision below was resolvable directly from existing, already-
shipped feature 017 infrastructure.

## R1: Control type — native `<select>` with `<optgroup>`, not a card grid

- **Decision**: a single native `<select>` element, grouped into 7
  `<optgroup>`s (one per `MOOD_FAMILIES` entry) containing 43 `<option>`s
  (one per `THEMES` entry), reusing the already-ratified `.form-select`
  class verbatim.
- **Rationale**: `theme-gallery.js`'s existing card-grid approach is
  right for that page's job (compare themes side-by-side via swatches),
  but is too large a footprint for a header control on a page whose
  primary content is the ~50 component cards themselves (spec.md's own
  framing: a "fast preview shortcut", not a second browsing experience).
  A native `<select>` is keyboard-operable and labelable with zero custom
  ARIA (Principle II), needs zero new CSS (Principle III/IV — `.form-select`
  already exists and is already AAA-verified), and `<optgroup>` is the
  native, zero-JS mechanism for keeping 43 flat options navigable
  (FR-006) — no custom listbox/combobox needed.
- **Alternatives considered**: reusing `theme-gallery.js`'s card grid
  directly on `index.html` (rejected — 43 cards at the top of the page
  would visually compete with, not complement, the component-card grid
  spec.md explicitly frames as the primary content); a custom dropdown
  component like Combobox/DropdownMenu (rejected — pure over-engineering
  for a single-select-from-a-list control a native element already
  handles completely).

## R2: Data source and selection mechanism — reuse verbatim, no adapter layer

- **Decision**: import `THEMES`, `MOOD_FAMILIES` from
  `shared/design-tokens.ts` and `selectTheme`, `KNOWN_THEME_IDS` from
  `src/scripts/theme-switcher.js` directly — identical imports
  `theme-gallery.js` already uses, no new intermediate module.
- **Rationale**: spec.md's Assumptions explicitly rule out any new theme
  token source or persistence mechanism; `selectTheme()` already handles
  the full persist-then-apply sequence (including the `try/catch`
  localStorage-failure degradation from feature 017 Phase 8's T074 fix),
  so this feature's own script needs zero error handling of its own for
  that path — calling the existing function is sufficient.
- **Alternatives considered**: none seriously — duplicating any part of
  this logic would violate spec.md's explicit "single source of truth"
  framing (FR-003) and reintroduce the exact class of drift risk
  `shared/design-tokens.ts` was created (feature 004) to eliminate.

## R3: Reflecting the current theme in the control on load

- **Decision**: on script initialization, read
  `document.documentElement.dataset.theme` (already set by
  `theme-switcher.js`'s `<head>`-level activation, which runs before this
  feature's own script) and set the `<select>`'s value to match.
- **Rationale**: `theme-switcher.js` already resolves and applies the
  correct theme (stored, or default) before any other script on the page
  runs (contracts/theme-switcher.contract.md's "run as early as possible"
  requirement) — reading the already-applied `data-theme` attribute is
  simpler and more reliable than independently re-deriving the theme from
  `localStorage` a second time in this feature's own script, and
  guarantees the control can never disagree with what's actually applied.
- **Alternatives considered**: calling `resolveInitialTheme()` again
  independently (rejected — redundant, and a second, separate resolution
  call is exactly the kind of "two places doing the same thing" this
  project's own `/speckit-analyze` passes have repeatedly flagged as
  drift risk elsewhere).

## R4: Keeping the dedicated Theme Gallery page and this control in sync

- **Decision**: no new synchronization code needed. Both surfaces persist
  through the same `pds-theme` `localStorage` key via the same
  `selectTheme()` function; a change made on either page is visible on
  the other simply because both independently call `resolveInitialTheme()`
  (via `theme-switcher.js`'s own module-load-time side effect) on their
  next load.
- **Rationale**: spec.md SC-005 only requires agreement "on next view",
  not live cross-tab/cross-page synchronization while both are open
  simultaneously (out of scope — not requested, and this catalog has no
  existing cross-tab sync mechanism to extend). The existing persistence
  mechanism already satisfies the stated requirement without new code.
- **Alternatives considered**: a `storage` event listener for live
  cross-tab sync (rejected — spec.md does not require it, and it would be
  the first cross-tab-reactive code in this catalog, a materially larger
  scope than this feature's stated need).

## R5: Avoiding layout overflow at 320px

- **Decision**: the `<select>` sits in `index.html`'s existing `<header>`,
  which already uses simple block-level stacking (`<h1>` then `<p>`) with
  no fixed-width flex row to fit it alongside — appending the control as
  its own block-level element (or a simple `flex flex-wrap` row if placed
  next to existing header text) avoids introducing a new narrow-viewport
  constraint. `.form-select` is already `w-full`-capable and used at
  narrow viewports elsewhere in this catalog (e.g. Select's own component
  page) with no known overflow issue.
- **Rationale**: reuses an already-verified-safe layout pattern rather
  than inventing new responsive behavior for this feature specifically.
