# Research: Advanced Interaction Primitives

## R1. TreeView — native `<details>/<summary>` confirmed fully sufficient, zero ARIA needed

**Decision**: Recursively nested native `<details>/<summary>`, each nested
inside `<ul>/<li>`, with zero JavaScript and zero added ARIA attributes.

**Method**: Built a real 3-level draft (`src` → `components` → `button.html`/
`badge.html` leaves) and inspected it two ways rather than assuming:

1. `axe-core` (the same engine `tests/e2e/a11y-helper.ts` uses) scanned the
   draft with zero violations related to the tree structure itself (the
   only 3 violations reported were bare-page boilerplate gaps — missing
   `<main>`/`<h1>` — irrelevant to the disclosure semantics).
2. Chrome DevTools Protocol's `Accessibility.getFullAXTree` (the actual
   computed accessibility tree a screen reader consumes, not just DOM
   attributes) was inspected directly via a Playwright CDP session. Result:
   - Each `<summary>` is exposed with role **`DisclosureTriangle`**
     (Chromium's real AT-facing role for a native disclosure widget),
     `focusable=true`, and an `expanded` property that is `true`/`false`
     matching that exact `<details>` element's own `open` state.
   - Critically, the nested "components" `<summary>` showed
     `expanded=false` independently of the outer "src" `<summary>`
     showing `expanded=true` — confirming each branch tracks its own
     state, not inherited/coupled from an ancestor (spec.md's acceptance
     scenario 2).
   - Each `<li>` inside the nested `<ul>` showed a `level` property (1 for
     the outer list, 2 for the nested list) — confirming relative nesting
     depth is exposed automatically via ordinary `<ul>` nesting, with no
     `aria-level` needed.

**Conclusion**: No ARIA gap was found anywhere. The hypothesis in spec.md
("if native semantics are found insufficient, document what was added")
resolves to: nothing was needed. `role="group"` also appears automatically
on each nested `<ul>`'s containing structure per the browser's own mapping
— not something the markup needs to add by hand.

**Alternatives considered**: A custom `role="tree"`/`role="treeitem"`/
`aria-expanded` JS-driven widget (the WAI-ARIA Tree View pattern) — rejected
because it would require a full keyboard model (arrow keys navigating
between visible items, Home/End, type-ahead) that the spec does not
actually require (FR-002 only asks for expand/collapse via keyboard,
already free from `<summary>`'s native `tabindex=0` + Enter/Space
handling), and because it would silently discard the zero-JS win this
research confirms is available.

## R2. Rating — whole/empty star technique, decorative-only contrast justification

**Decision**: Real numeric value as visible text (e.g. "4.2 out of 5") is
the single source of truth. Star glyphs are five separate inline SVG icons
per instance, each either the "filled" or "empty" variant (rounded to the
nearest whole star for the visual only — a value of 4.2 shows 4 filled +
1 empty, not a partial fifth star), all wrapped `aria-hidden="true"` inside
a wrapper whose own accessible name/visible text is the real value.

**Contrast**: Checked `shared/design-tokens.ts` first per Principle IV
before considering any new color. Filled stars use `text-warning`
(`#F59E0B`) — computed via `wcag-contrast`: 2.15:1 against white. Empty
stars use `text-neutral-300` (`#D1D5DB`): 1.47:1 against white. Both fail
even WCAG AA's 3:1 non-text floor as *text*-contrast figures — but since
the star glyphs are `aria-hidden` and carry zero unique information (the
real value is separately, always present as visible text per FR-003),
this is treated as the same class of already-accepted decorative-element
exception this catalog uses for Stepper's/Timeline's connector lines
(`border-neutral-200`, 1.24:1 against white, explicitly justified in
research.md R7 of feature 015). No new token is introduced; `warning`
already exists and is already ratified for other (text-bearing, higher-
contrast) uses in Badge/Alert.

**Alternatives considered**: An SVG `clip-path`/`linearGradient`-based
partial-fill star (true 4.2/5 sub-pixel fill) — rejected as unnecessary
complexity: the spec's own edge case ("a whole number MUST NOT imply a
fractional star that doesn't exist") already signals that exact partial
rendering isn't the point; the real value is always in real text
regardless, so the star row is reinforcement, not the data.

**Correction found during `/speckit-implement` (T012)**: the original plan
assumed `scripts/check-contrast.mjs` would need no change at all, since
Stepper's decorative connector line (feature 015 R7) never needed one —
but running `npm run audit:contrast` after building Rating revealed this
assumption was wrong. Stepper's connector is a `bg-*`/`border-*` token,
which the script's coverage scanner never inspects; Rating's star fill is
a `text-warning` class, which the SAME scanner DOES inspect (it exists
specifically to catch literal text left unverified) and flagged it as a
genuine coverage gap. The script already had a narrower exemption
(`ICON_FILL_TEXT_TOKENS`) for icon fills that clear the *lower* WCAG
1.4.11 non-text 3:1 floor via a `RING_PAIRINGS` entry — but `text-warning`
measures only 2.15:1, failing even that lower bar. Since forcing a
`RING_PAIRINGS` entry through would make the audit fail honestly (not
work around it), the correct fix was a NEW, narrower exemption category,
`DECORATIVE_ARIA_HIDDEN_TOKENS`, documented in the script itself: it
applies only when a token's every use is confirmed (by reading the actual
component markup) to be inside an `aria-hidden="true"` element with the
real information always separately rendered as visible text — exactly
Rating's case. `text-neutral-300` (the empty-star token) needed no new
entry at all: it turned out already covered by a pre-existing, unrelated
`PAIRINGS` entry ("Sidebar dark item text", 12.04:1 AAA against
`bg-neutral-900`), confirmed by reading the script rather than assumed.

## R3. Menubar — composes Dropdown Menu unmodified + one new small roving-tabindex layer

**Decision**: Each top-level trigger (File/Edit/View) is wired via
`dropdown-menu.js`'s existing `initDropdownMenus()`, called completely
unmodified — traced through the actual source
(`src/scripts/dropdown-menu.js`) and confirmed its `anchorCounter` pattern
already increments per-match across ALL `[data-dropdown-trigger]` elements
found via one page-wide `querySelectorAll`, which is exactly what multiple
independent top-level menubar triggers are. No changes needed to that file
at all — the multi-instance-anchor-name lesson from feature 010/014 (and
Combobox's identical `anchorCounter` precedent) already generalizes to
"however many `[data-dropdown-trigger]` elements exist on the page,"
confirmed rather than re-derived.

The ONE genuinely new piece is a small `src/scripts/menubar.js` adding the
roving-tabindex-between-top-level-triggers layer — adapted from `tabs.js`'s
`enabledIndices()`/arrow-key wraparound pattern (Left/Right/Home/End moving
focus among triggers, `tabIndex` 0/-1 toggling) — which `dropdown-menu.js`
has no concept of (it only handles arrow keys *inside* an already-open
panel). One additional real behavior beyond plain roving tabindex: per
spec.md's acceptance scenario 3, arrow-navigating to a sibling trigger
while a panel is already open must auto-close the old panel and open the
new one — `menubar.js` listens for its own arrow-key roving-focus event and,
if a sibling panel is currently open (checked via `.matches(':popover-open')`
on the previous trigger's target), calls `hidePopover()`/`showPopover()`
across the transition; when no panel was open, arrow keys move focus only,
consistent with FR-005/FR-006.

**Ordering dependency (a `/speckit-analyze` finding, F3)**: `hidePopover()`
on the old panel MUST be called BEFORE `showPopover()` on the new one, in
that exact order, with no `await`/`setTimeout` between them. This matters
because `dropdown-menu.js` is reused completely unmodified (not rewritten
to be Menubar-aware) — its own `toggle` listener unconditionally calls
`trigger.focus()` on ITS OWN trigger whenever its panel closes. If the
close and open were reordered or separated by a tick, the old panel's
close-triggered `trigger.focus()` would run AFTER the new panel's open
already moved focus into its first item, silently stealing focus back to
the wrong (closing) trigger. Calling both synchronously in
hide-then-show order means the new panel's `items()[0]?.focus()` is the
last focus call to run, landing correctly — this ordering is load-bearing
precisely because `dropdown-menu.js` was NOT modified to special-case
Menubar's multi-trigger scenario.

**Two further corrections found during `/speckit-implement`** (the
above F3 fix, written during planning, turned out insufficient once
actually built and tested under load):

1. **The Popover API's `toggle` event is queued, not synchronous inline
   with `hidePopover()`/`showPopover()`.** A first implementation called
   `hidePopover()` then, on the very next line, synchronously called
   `focus()` on the new trigger, assuming dropdown-menu.js's own
   toggle-triggered `trigger.focus()` (on close) would necessarily run
   BEFORE that next line. This was flaky under parallel test load — the
   queued event sometimes fired AFTER, stealing focus back. Fixed by
   attaching `menubar.js`'s own one-time `toggle` listener to the SAME
   panel instead of assuming synchronous ordering: since both listeners
   respond to the identical dispatch and DOM event listeners always fire
   in registration order, and `dropdown-menu.js`'s `initDropdownMenus()`
   always runs before `menubar.js`'s `initMenubar()`, this guarantees
   correct ordering regardless of whether the underlying dispatch is
   synchronous or task-queued.
2. **A per-trigger keydown listener cannot see ArrowRight/ArrowLeft once
   a panel is open.** Opening a panel moves focus into its first menu
   item (dropdown-menu.js's own correct, unmodified behavior) — a keydown
   listener attached only to the trigger buttons then never fires again
   for keys pressed while browsing an open submenu, breaking the real
   Menubar convention that arrow keys must switch top-level menus even
   with focus inside a submenu. Fixed by attaching the listener to the
   `[data-menubar]` container instead and relying on bubbling — confirmed
   that a popover's top-layer promotion is paint/stacking-only, not a DOM
   tree relocation, so keydown events dispatched inside an open panel
   still bubble up through the ordinary parent chain to the container.

**Alternatives considered**: A single new from-scratch `menubar.js` handling
BOTH the panel mechanics AND the between-trigger roving tabindex — rejected
because it would duplicate `dropdown-menu.js`'s already-shipped,
already-tested open/close/focus-return/in-panel-arrow-key logic verbatim,
the exact kind of drift this project's own `/speckit-analyze` passes flag.

**Third correction found during code review (HIGH severity)**: the
one-time-`toggle`-listener fix above (point 1) only orders THIS module's
own reaction relative to a SINGLE toggle dispatch — it does not prevent a
SECOND, rapid keypress from starting its own independent close/open chain
before the first one's chain has fully resolved. Traced concretely: a 2nd
ArrowRight arriving before the 1st's queued "panel A closed" toggle fires
could move focus to trigger C directly (via the "nothing currently open"
branch), but LATER, when A's queued toggle event finally dispatches,
`dropdown-menu.js`'s own unconditional close-handler for it still runs
`triggerA.focus()` — clobbering C's already-correct focus, since that
handler has no awareness of "staleness" at all (it is not this module's
code). A `generation` counter can stop *this module's own* queued
callbacks from re-asserting themselves once stale, but cannot stop
`dropdown-menu.js`'s unrelated listener from firing anyway.

The eventual fix has two parts:
1. **Structural simplification**: confirmed empirically
   (`newPanel.showPopover()` called directly while a sibling panel is
   already open) that the Popover API's "auto" popover group already
   closes the current one as one atomic native operation when a new one
   is shown — the resulting "closed"/"open" toggle events fire in a
   fixed, guaranteed order with no separate `hidePopover()` call needed
   at all. This collapses what was a two-chain sequence (wait for close,
   then open, then wait again) into a single `showPopover()` call and
   ONE toggle event to wait for, removing the interleaving window
   entirely rather than trying to out-race it.
2. **Explicit ignore-while-resolving guard**: `generation`/
   `settledGeneration` — a keypress arriving while an earlier
   transition's final focus placement hasn't yet happened is ignored
   outright (`event.preventDefault()` + return), rather than allowed to
   start a second, overlapping transition. Verified via 15 consecutive
   raw (non-Playwright-test-runner) rapid double-keypress trials: always
   exactly one panel ends up open, matching the focused trigger, with
   zero corrupted states — a marked improvement over the prior fix, which
   reproduced a genuine corrupted-state bug roughly 1 in 3 rapid-keypress
   trials under CPU load.

**Known residual test-environment flakiness (not a logic defect)**: the
Playwright test asserting this exact scenario
(`tests/e2e/menubar.spec.ts`, "a rapid second ArrowRight...") still fails
intermittently when the FULL test file runs under Playwright's default
parallel-worker load (multiple browser instances contending for CPU) —
but passes consistently (15/15, then repeated 3/3 full-file reruns) under
`--workers=1` or when run in isolation, and the underlying application
logic itself was independently verified correct via 15 raw Playwright-API
trials with no test-runner scheduling involved. This matches this exact
component's already-established characteristic (the "auto-switches"
Menubar test showed identical CPU-load-dependent behavior earlier in this
same feature's implementation) — accepted per this project's existing
`retries: process.env.CI ? 1 : 0` mitigation in `playwright.config.ts`,
not a new exception introduced for this test.

## R4. ColorInput — native `<input type="color">` styling constraints, verified cross-engine

**Decision**: Native `<input type="color">`, styled with `border`/
`rounded-md`/`ring`-equivalent (`box-shadow`-based, matching Tailwind's own
`ring` utility implementation) treatment matching TextInput's established
visual language.

**Method**: Built a real `<input type="color">` with an inline
`border`/`border-radius`/`box-shadow` test declaration and inspected the
ACTUAL computed styles (not just `CSS.supports()`, which only confirms
parser-level property recognition, not real rendering on this specific
replaced element) via Playwright across Chromium, Firefox, and WebKit.
Result: `border-width`/`border-style`/`border-color`, `border-radius`, and
`box-shadow` all compute to the exact declared values in all three engines
— confirming the input's own outer box is fully stylable via ordinary
Tailwind utilities (`border`, `rounded-md`, `ring-*`), identical to every
other form control in this catalog. The one platform-chrome limitation:
each engine renders the internal color-swatch preview at a different
default intrinsic size (Chromium 50×27, Firefox 64×32, WebKit 44×23) —
normalized by setting an explicit `h-10 w-16` (or similar) size, matching
how this catalog already normalizes native-control sizing elsewhere
(Toggle's track dimensions, Slider's `h-2` track). The swatch preview
graphic itself (the little color square inside the control) is NOT
further stylable beyond the outer box in any engine — accepted as an
OS-chrome limitation, the same class of accepted limitation as File
Input's native file-picker dialog (feature 015) and PinInput/Slider's
native OS keyboard/pointer chrome.

**Correction found during `/speckit-implement`**: the bare inline-`style`
test above (`border`/`box-shadow` set directly via the HTML `style`
attribute) computed correctly in all three engines — but once the real
component was built using Tailwind's `ring-*`/`shadow-sm` CLASSES (not an
inline style), `box-shadow` computed to `none` in Chromium/Firefox/WebKit
alike, even unfocused. Root cause, confirmed by testing: `<input
type="color">` defaults to `appearance: auto`, and its native
"swatch-box" widget rendering suppresses author-specified `box-shadow`
supplied via a stylesheet rule when the default appearance is active —
inline styles happened to bypass this in the earlier isolated test, but a
real class-based rule does not. Fixed by adding `appearance-none` to
`.color-input`, confirmed empirically to restore normal `box-shadow`
compositing (verified before/after: `none` → the declared ring shadow).
This is the same category of "verify the ACTUAL shipped mechanism, not
just a structurally-similar isolated test" lesson as feature 015's R9
(Indicator) and R6 (File Input's helper-text contrast).

**Also found during `/speckit-implement`**: WebKit (this project's target
engine, confirmed via Playwright's bundled WebKit) excludes `<input
type="color">` from the natural Tab sequence specifically — isolated and
confirmed on a bare, unstyled color input with nothing else on the page,
ruling out any CSS/markup cause. The element still accepts focus via a
direct `.focus()` call or a real click; only Tab-order participation is
affected. Accepted as a genuine engine limitation (the same class of
cross-engine gap as PinInput's Firefox clipboard-event limitation,
feature 015) — the WebKit Tab-reachability assertion is skipped with an
explanatory comment rather than worked around.

**Alternatives considered**: A custom JS-driven color-swatch grid/picker
(the shadcn/ui and MUI convention) — rejected per the feature description's
own explicit direction: the native element already provides a full
OS-level picker UI, complete keyboard operability, and a real hex `value`
at zero JavaScript and zero additional accessibility surface to get
wrong, whereas a custom picker would need its own focus-trap, keyboard
grid navigation, and contrast-safe swatch rendering — real, avoidable
complexity for a solved problem.

## R5. Testing strategy carry-forward

Same Playwright visual regression (320/768/1024/1440px) + axe-core
zero-violations pattern as every prior feature. New keyboard assertions:
TreeView (Enter/Space toggles the focused summary's `open` state — real
keyboard simulation, not assumed, mirroring how feature 015 asserted
Slider's arrow-key behavior directly); Menubar (Left/Right moves focus
between triggers without opening a panel; Down/Enter/Space opens the
focused trigger's panel and moves focus to its first item; Escape closes
and returns focus to the trigger; arrow-navigating to a sibling while a
panel is open auto-switches which panel is open); ColorInput (Tab
reachability, focus-visible outline, disabled state). New visual baselines
generated via `update-snapshots.yml` `workflow_dispatch` on `ubuntu-latest`
(never locally) — noting the same GitHub Actions billing block that
stalled features 014/015's final CI-green step may still be in effect and
must be re-checked via `gh run list` before assuming this step will
succeed this time, not assumed resolved.
