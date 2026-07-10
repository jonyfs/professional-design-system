# Phase 0 Research: Advanced Forms Primitives (Combobox, Command Palette)

## R1: `<datalist>` vs. a from-scratch WAI-ARIA 1.2 Combobox

**Decision**: Build a from-scratch combobox following the WAI-ARIA APG
"Combobox with List Autocomplete" pattern (`role="combobox"` on the input,
`role="listbox"` on the popup, `role="option"` on each candidate,
`aria-activedescendant` tracking the visually-highlighted option). Do
**not** use native `<input list="...">` + `<datalist>`.

**Rationale**: `<datalist>` was evaluated against this feature's actual
requirements (FR-004 "No results" state, FR-005 disabled options,
substring-match highlighting) and fails all three:
- **No styling control**: the suggestion popup is rendered by the browser
  itself (its own native UI, outside the page's DOM/CSS reach) — it cannot
  be given this project's visual treatment (rounded panel, ring,
  `text-neutral-*` tokens), violating this project's zero-raw-Tailwind-
  but-fully-designed-surface expectation for every other component.
- **No "No results" state**: an empty/non-matching `<datalist>` simply
  shows no suggestions with no way to inject custom markup for FR-004.
- **No disabled-option support**: `<option>` elements inside a `<datalist>`
  have no meaningful disabled/skip semantics for FR-005.
- **Inconsistent cross-browser filtering**: WHATWG leaves matching
  behavior to the browser; Chromium and Firefox differ on
  substring-vs-prefix matching and case sensitivity, which would make
  this project's own documented behavior (FR-002, case-insensitive
  substring) unverifiable/untestable.
- **No ARIA combobox semantics**: `<datalist>` exposes no `listbox`/
  `option` roles at all — assistive technology support is inconsistent,
  and this project's Principle II (AAA-level semantic accessibility) MUST
  be verifiable via axe-core, which cannot inspect the native suggestion
  UI's internals.

This mirrors the same research discipline feature 005 applied before
choosing custom JS + the Popover API for Dropdown Menu over a hypothetical
simpler native alternative: verify the native option against actual
requirements before defaulting to a custom implementation, but don't
assume the native option is sufficient just because one exists.

**Alternatives considered**: `<input list>`/`<datalist>` (rejected, above).
A third-party combobox library (rejected — this project has shipped zero
external JS dependencies since inception; every interactive component
uses vanilla JS matching `src/scripts/*.js`'s existing pattern).

## R2: Popover API for the Combobox listbox panel

**Decision**: Use the Popover API (`popover="auto"`) for the listbox panel,
the same mechanism Dropdown Menu already uses (feature 005), for the same
reason: top-layer rendering avoids clipping/z-index fights with any
ancestor that has `overflow: hidden` or its own stacking context (e.g. a
Combobox used inside a Modal or a Card), and the browser's native
light-dismiss-on-outside-interaction + Escape-to-close come for free.

**Rationale**: Dropdown Menu's listbox needed the Popover API because its
trigger is a `<button>` and the menu is a separate floating panel that can
open/close independent of any single element's focus state. Combobox's
listbox is different in one respect — the WAI-ARIA combobox pattern keeps
DOM focus on the `<input>` at all times, using `aria-activedescendant` to
communicate the "active" option rather than moving real focus into the
listbox. This was checked explicitly rather than assumed to disqualify
Popover API: native light-dismiss triggers on *pointer/focus interaction
outside the popover's DOM subtree*, not on which element currently holds
focus — so a click on an `<li role="option">` *inside* the popover still
counts as "inside" for dismiss purposes, and the input keeping focus the
whole time does not conflict with the popover auto-closing when the user
clicks or tabs elsewhere. This is a real, verified compatibility, not an
assumption carried over from Dropdown Menu.

**Alternatives considered**: A plain `absolute`-positioned `<div>` with a
manual document-level `click` listener for outside-dismiss (this project's
pre-Popover-API approach, superseded once feature 005 confirmed Popover
API's cross-browser maturity) — rejected as strictly more code for less
correctness (manual outside-click logic, manual Escape handling, and
manual z-index/overflow management the Popover API's top-layer avoids for
free).

**Correction (`/speckit-analyze` finding)**: an earlier draft of this
contract placed `popovertarget="combobox-listbox"` directly on the
`<input type="text">`, copying Dropdown Menu's `<button popovertarget=
...>` pattern without re-verifying it against a different element type.
Per the HTML Living Standard, `popovertarget` is a recognized invoker
attribute only on `<button>` and on `<input>` elements whose `type` is
`submit`/`reset`/`image`/`button` — **not** `type="text"`. On a text
input it is inert. The markup contract now omits it entirely; the
listbox is opened/closed exclusively via `combobox.js`'s imperative
`showPopover()`/`hidePopover()` calls (already required regardless, since
the popover must open whenever the query is non-empty — including a
zero-match query, which shows the `.combobox-empty` "No results" state
per FR-004 rather than staying closed — a plain declarative invoker
couldn't express that condition anyway).

**See R6 below** for why `.combobox-option`/`.command-palette-action`
intentionally have no `focus-visible:` state — a separate correction from
the same `/speckit-analyze` pass that produced this section, inserted
here out of R1-R5's original sequence.

## R6: `:focus-visible` on option/action rows — why it's intentionally absent

**Decision**: `.combobox-option`/`.command-palette-action` do **not**
declare a `focus-visible:` state, and this is a deliberate, documented
exemption, not an oversight.

**Rationale**: the WAI-ARIA `aria-activedescendant` model (used by both
components, per FR-001/FR-003/FR-008) keeps real DOM focus on the
`<input>` at all times — the "active" option/action is communicated via
`aria-activedescendant` + `aria-selected`, never by moving focus onto the
`<li>`. Since focus never lands there, `:focus-visible` structurally
cannot match those elements in any browser; declaring the utility would
be dead CSS. The input's own `focus-visible:` ring (already required by
Principle V and already present via the existing Text Input pattern,
research.md R4) is the single, persistent focus indicator for the whole
composite widget — WCAG 2.4.7/2.4.13 are satisfied there, not per-row.
`aria-selected="true"` → `bg-neutral-100` on the active row is a
*selection/highlight* indicator, analogous to a `<select>`'s native
highlighted option, not a substitute focus indicator — it was checked
against feature 005's Dropdown Menu precedent specifically because that
component's own first draft made the mistake of relying on a background
alone as a focus substitute (correctly rejected then); this case differs
because no real focus ever needs indicating on these rows in the first
place, so there's no focus-outline gap to fill.

**Alternatives considered**: moving real DOM focus onto each `<li>` as
the user arrow-keys (rejected — this is precisely the interaction model
WAI-ARIA APG's "Combobox with Manual/List Autocomplete" pattern uses
`aria-activedescendant` to avoid, since moving real focus in and out of
an input while typing causes IME and virtual-keyboard problems on mobile
and is the reason the roving-DOM-focus alternative exists as a *separate,
non-preferred* APG pattern).

## R3: Command Palette's dialog chrome and global shortcut scoping

**Decision**: Reuse `<dialog>` + `showModal()` for the Command Palette's
chrome — no new overlay primitive. `overlay.js`'s existing
`initDialogTriggers()` only wires its backdrop-click-close and
`close`-time refocus listeners onto dialogs discovered via
`document.querySelectorAll("[data-dialog-trigger]")`; the Command
Palette's dialog has no such trigger button (it opens via a global
shortcut, not a click), so that loop never reaches it. **`overlay.js` is
therefore MODIFIED, not just reused**: its per-dialog wiring
(`dialog.addEventListener("click", ...)` for backdrop-close and
`dialog.addEventListener("close", () => dialog._lastTrigger?.focus())`
for refocus) is extracted into an exported `wireDialogClose(dialog)`
helper, called once per dialog by both `initDialogTriggers()` (for each
`data-dialog-trigger` dialog, as before — no behavior change for
Modal/Slide-over) and by `command-palette.js` (once, for its own
dialog). Add exactly one new **document-level** `keydown` listener (this
project's first) that checks `(event.metaKey || event.ctrlKey) &&
event.key.toLowerCase() === "k"`, calls `event.preventDefault()`, sets
`dialog._lastTrigger = document.activeElement` (there is no
`data-dialog-trigger` button to capture this from, since the palette can
open from *any* focus state per FR-006), and calls `showModal()` if the
dialog is not already open.

**Rationale**: `<dialog>`/`showModal()` already provides everything FR-007
and FR-009 need — native focus-trapping, Escape-to-close, and (per
feature 003's own research, verified via real cross-browser Playwright
testing, not assumed) focus-restoration to the previously-focused element
that Chromium/Firefox honor natively but WebKit does not, requiring the
explicit `dialog._lastTrigger?.focus()` safeguard on `close`. Extracting
`wireDialogClose()` rather than describing this as an unmodified reuse
(an earlier draft of this research incorrectly claimed "verbatim,
unmodified" reuse — caught by `/speckit-analyze` before implementation,
since the actual `initDialogTriggers()` loop structurally cannot register
anything for a trigger-less dialog) keeps the WebKit-safe refocus logic
in exactly one place for Modal, Slide-over, and Command Palette alike,
rather than duplicating it a second time in `command-palette.js`.

**Global-shortcut collision check** (verified, not assumed): this
project's other keydown listeners are all element-scoped, not
document-level — `tabs.js` listens on the tablist container, `dropdown-
menu.js` listens on each popover element, and `overlay.js` has no keydown
listener at all (Escape-to-close is native `<dialog>` behavior, not
custom JS). Command Palette's document-level listener is the first of its
kind in this project and does not collide with any existing handler,
since none of them call `stopPropagation()` on a `keydown` that could
prevent it from reaching `document`. One guard is added regardless: the
shortcut handler no-ops if another `<dialog open>` already exists on the
page (e.g. Modal already open) — showModal() on a second dialog while one
is already open is legal per spec but produces a confusing double top-
layer stack this project has no tested pattern for, so it's out of scope
rather than silently allowed.

**Alternatives considered**: A custom non-native overlay (rejected — no
reason to deviate from the already-proven `<dialog>` pattern). Scoping the
keydown listener to individual focusable elements instead of `document`
(rejected — FR-006 explicitly requires the shortcut to work from *any*
focus state, including no focus at all, which only a document-level
listener can guarantee).

## R4: New design tokens needed?

**Decision**: None. Verified explicitly against the ratified Base
Semantic Palette (`.specify/memory/constitution.md`) rather than assumed:

| Use | Token |
|---|---|
| Input/action text | `text-neutral-900` (existing) |
| Secondary/hint text ("No results", helper copy) | `text-neutral-600` (the AAA-safe floor since feature 005's Breadcrumbs correction) |
| Input border / listbox ring | `border-neutral-300` (existing, Text Input/Select) |
| Focus ring | `focus:ring-brand` / `focus-visible:outline-brand` (existing) |
| Keyboard-highlighted ("active") option row | `bg-neutral-100` (Dropdown Menu's existing `active:bg-neutral-100` treatment, reused verbatim rather than introducing `bg-brand` — this is a transient keyboard-focus indicator, not a persistent "selected/current" state like Sidebar's active item, so it does not warrant a brand-colored treatment) |
| Hover on an option row | `hover:bg-neutral-50` (Dropdown Menu's existing item hover, reused verbatim) |
| Disabled option | `aria-disabled="true"` + `opacity-50` (parallel to the literal `disabled:opacity-50 disabled:cursor-not-allowed` pattern, adapted for a non-form-control element — see R5) |

No new entries needed in `shared/design-tokens.ts` or
`scripts/check-contrast.mjs`'s `BASE_TOKENS` — every pairing above is
already a verified-AAA pairing reused from an existing ratified pattern
(Dropdown Menu's item states, Text Input's border/focus ring, Breadcrumbs'
`text-neutral-600` floor).

**Correction (verified during implementation, not assumed)**: an earlier
draft of this section additionally claimed `check-contrast.mjs` needed
two new `PAIRINGS` entries for this feature's own `text-neutral-900`-on-
white and `text-neutral-600`-on-white usage. Running the actual script
after implementing Combobox showed this was unnecessary — inspection of
`check-contrast.mjs`'s coverage mechanism (`COVERED_FG_TOKENS`, built
from `PAIRINGS.map(p => p.fg)`) shows it tracks coverage per **foreground
token**, not per exact (foreground, background) pair; `neutral-900` and
`neutral-600` are already covered foreground tokens (via Button/Text
Input/Checkbox and Breadcrumbs' entries respectively) against the same
white background this feature also uses, so `npm run audit:contrast`
passed with zero new entries. This differs from feature 007's Sidebar,
where `neutral-300` was a genuinely *new* foreground token with no prior
`PAIRINGS` entry at all — that case correctly required a new entry; this
one doesn't, and adding one anyway would have been pure duplication. The
lesson generalizes the project's "verify, don't assume" discipline one
level further: even a claim about *tooling requirements* should be
checked by running the tool, not inferred from a prior feature's
precedent that looks superficially similar.

## R5: Highlighted-match substring style — sidesteps new-pairing risk entirely

**Decision**: Render the matched substring within an option/action label
as `font-semibold` on the existing `text-neutral-900`, not as a new
background-highlight color.

**Rationale**: A background-highlight treatment (e.g. `bg-warning/20`
behind the matched characters) would introduce a brand-new text-on-
background pairing requiring its own WCAG relative-luminance verification
before ratification — the exact kind of finding that produced real,
previously-undiscovered AAA failures in Breadcrumbs (feature 005) and
Sidebar (feature 007). A weight-only change (`font-semibold` vs. the
surrounding `font-normal`) uses the *same* color for both the highlighted
and non-highlighted portions of the label, so it inherits `text-
neutral-900`-on-white's already-ratified 17.74:1 AAA compliance (computed
directly via the WCAG relative-luminance formula, not assumed) with zero
new verification surface — the simplest option that fully satisfies FR-002
/FR-008's "narrows to matches" requirement (visually distinguishing the
matched substring) without manufacturing a new contrast risk.

**Alternatives considered**: `bg-warning/20` highlight behind the matched
substring (rejected — introduces an unverified new pairing for a purely
cosmetic upgrade with no functional benefit over a weight change).
`text-brand` on the matched substring (rejected — `text-brand` at normal
body-text size measures below AAA against white per this project's
existing `check-contrast.mjs` data, the same class of error this project
now checks for by default rather than assuming any existing token is safe
in a new usage).

## Testing Strategy

Same Playwright visual-regression (320/768/1024/1440px, Chrome/Firefox/
Safari) + `@axe-core/playwright` accessibility-scan pattern as every prior
feature. New assertions specific to this feature:
- Combobox: typing narrows the listbox to matching options; ArrowUp/
  ArrowDown moves `aria-activedescendant` among the filtered set (wrapping
  at both ends); Enter commits the active option's value into the input
  and closes the listbox; Escape closes the listbox without changing the
  input's value; a non-matching filter shows the "No results" state; a
  disabled option is skipped during arrow-key traversal and does not
  commit on Enter/click.
- Command Palette: a document-level `page.keyboard.press("Control+K")` (and
  a `Meta+K` variant, mapped per `testInfo.project.name`'s platform where
  Playwright's own OS reporting allows it — otherwise both are asserted on
  every project, since `<dialog>` behavior is platform-independent) opens
  the dialog with the search input focused, from an arbitrary starting
  focus state (e.g. focus already on an unrelated link elsewhere on the
  page); typing narrows the action list; Enter on a highlighted action
  fires a visible confirmation and closes the dialog; Escape closes the
  dialog and restores focus to the pre-open focus target (mirroring
  Modal's existing focus-return test pattern from feature 003, including a
  WebKit-specific check since `overlay.js`'s explicit refocus is the
  actual fix there, not a native guarantee).

New visual regression baselines MUST be generated via the
`update-snapshots.yml` GitHub Actions `workflow_dispatch` job on
`ubuntu-latest` — never locally, never via local Docker — with a `cmp`
byte-identical check against every pre-existing baseline before
committing only the genuinely new files, per this project's established
CI-baseline discipline since feature 001's original incident.

No CSP changes anticipated — both new JS modules are vanilla same-origin
`<script type="module">` files, identical in kind to every existing
`src/scripts/*.js` module; the project-wide CSP (`script-src 'self'`) has
never needed loosening for a same-origin script and does not need it here.
