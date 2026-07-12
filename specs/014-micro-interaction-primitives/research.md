# Phase 0 Research: Micro-Interaction & Utility Primitives

## R1. Progress bar fill/track contrast (WCAG 1.4.11 non-text, ≥3:1)

**Decision**: `bg-brand-dark` (#004BB3) fill against `bg-neutral-200` (#E5E7EB) track.

**Rationale**: Computed via the same relative-luminance formula used for every
prior contrast decision in this project (not assumed from Sidebar's unrelated
text-contrast measurement, which was a different color pairing against a
different background):

```
brand-dark (#004BB3) vs neutral-200 (#E5E7EB): 6.38:1
```

6.38:1 clears the WCAG 1.4.11 non-text 3:1 floor with over double the required
margin.

**Alternatives considered**: `bg-brand` (DEFAULT, #0066FF) against the same
track — not computed, since `bg-brand-dark` is this project's established
"active/filled" token (reused verbatim from Sidebar/Pagination's active-item
precedent) and already clears the bar; introducing a second, unverified fill
color for no reason would violate the "reuse before inventing" discipline.

## R2. Button Group active-segment contrast — and the keyboard-model decision

**Decision**: Button Group active-segment text reuses the exact `bg-brand-dark
text-white` pairing already ratified for Sidebar's active item. Contrast
ratios are a pure function of the two colors involved, independent of which
component uses them — re-verified directly rather than assumed:

```
brand-dark (#004BB3) vs white (#FFFFFF): 7.90:1
```

Identical to Sidebar's own prior 7.90:1 finding (same two colors), confirming
the pairing transfers with no new risk.

**Bigger decision surfaced by this research**: Button Group's keyboard model.
The spec's plan input asked whether to follow Tabs' custom roving-tabindex
arrow-key pattern. Investigated this project's existing zero-JS precedent for
"a set of mutually-exclusive options" first, per the native-elements-over-
custom-ARIA-widgets principle already established for Accordion's exclusive
group (a shared `name` attribute drives native single-open-at-a-time
behavior, no JavaScript). The same technique applies directly here: Button
Group ships as **visually-hidden native `<input type="radio">` elements
sharing one `name` attribute, each paired with a `<label>` styled as a button
segment** (the well-known "radio buttons styled as a segmented control"
technique) — not a hand-rolled `role="tablist"`/roving-tabindex widget like
Tabs needed. Native radio-group keyboard behavior (arrow keys move selection
within the group; Tab enters/exits the whole group as a single stop) comes
free from the browser, with zero JavaScript, and reuses a mechanism this
project has already adopted (Accordion's exclusive `name` grouping) rather
than porting Tabs' bespoke arrow-key handler to a component that doesn't need
it. `aria-pressed`/`aria-current` are unnecessary here since native
`role="radio"`'s own `aria-checked` (set automatically by `:checked`) already
communicates the active segment to assistive technology.

**Alternatives considered**: Tabs' roving-tabindex pattern (rejected — that
pattern exists specifically because no native element models a `tablist`;
a segmented control has a native equivalent, radio buttons, and using a
heavier custom widget where a native one suffices would contradict this
project's own established preference, re-litigating a decision this project
already made for Accordion).

## R3. Kbd typography — no monospace token exists yet

**Decision**: `shared/design-tokens.ts`'s `fontFamily` object was directly
inspected (not assumed) and contains only a `sans` key
(`["Inter", "system-ui", "sans-serif"]`) — no explicit, ratified monospace
stack exists anywhere in this codebase (a `/speckit-analyze` pass correctly
noted that `tailwind.config.ts`'s `theme.extend.fontFamily` is a *merge*,
so Tailwind's own built-in default `mono` stack technically already renders
via `font-mono` today — the gap this decision closes is Principle IV's
token-discipline requirement that every value be an explicit, ratified,
documented token, not "does `font-mono` render at all"). A minimal `mono`
key is added, following the exact structure of the existing `sans` key:
`["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]` — a standard,
dependency-free system monospace stack (no new font file/CDN link needed,
avoiding repeating the pre-existing Inter-font gap this project already
has, see `.design-sync/NOTES.md`).

**Rationale**: Kbd elements read as "physical keys" most convincingly in a
monospace face; using the default `sans` stack here was evaluated and
rejected as visually indistinguishable from surrounding body text once
border/background styling is applied, undermining the component's purpose.

## R4. Tooltip mechanism — CSS Anchor Positioning without the Popover API

**Decision**: Confirmed CSS Anchor Positioning (`anchor-name`/
`position-anchor`/`anchor()`) is a general-purpose CSS positioning feature,
not coupled to the Popover API — it applies to any positioned element
(`position: fixed` or `absolute`), popover or not. Feature 010's own
empirical `CSS.supports()` verification already confirmed all three target
engines (Chromium, Firefox, WebKit) support `anchor-name`, `position-anchor`,
and `anchor()` unconditionally — that finding is reused directly rather than
re-run, since it tested the CSS feature itself, not any particular
popover-specific usage of it. Tooltip therefore uses `position: fixed` +
`anchor-name`/`anchor()` for placement, with visibility driven purely by
`:hover`/`:focus-visible` on the trigger (opacity/visibility transition with
a short `transition-delay` before appearing) — **no `popover` attribute, no
JavaScript at all**. This deliberately avoids Popover API's top-layer
promotion and its click-triggered/light-dismiss semantics, which are wrong
for a passive, non-interactive hover label (a real tooltip must never be
"dismissed" by an outside click the way a Popover-hosted panel is, and must
never contain focusable content per WAI-ARIA's tooltip pattern).

**Alternatives considered**: Popover API with `popover="hint"` (a proposed,
not-yet-broadly-shipped popover state intended for exactly this case) —
rejected for this project's cross-browser bar (Chromium/Firefox/WebKit, all
of which must support the mechanism today, not a future proposal). Plain
`position: absolute` relative to a `position: relative` wrapper (Dropdown
Menu/Combobox's pre-feature-010 approach) — rejected as the same
already-diagnosed bug class (breaks once any ancestor has its own stacking/
transform context, which `position: fixed` + anchor positioning avoids
identically to how it fixed Dropdown Menu/Combobox).

## R5. Context Menu's cursor-anchoring divergence from Dropdown Menu

**Decision**: Confirmed via the CSS Anchor Positioning specification itself
(an architectural fact, not a browser-dependent behavior to test) that
`anchor-name` can only be assigned to a real DOM element/box — there is no
mechanism to anchor to an arbitrary synthetic point such as a cursor
coordinate. Context Menu's JS module therefore **forks from** (does not
literally reuse) Dropdown Menu's: on `contextmenu`, it calls
`event.preventDefault()`, then sets the panel's `style.left`/`style.top`
directly from `event.clientX`/`event.clientY`, clamped against
`window.innerWidth`/`innerHeight` minus the panel's own measured
`offsetWidth`/`offsetHeight` (so the menu flips inward rather than
overflowing near any viewport edge). Arrow-key roving focus among items and
Escape/outside-click dismissal are copied from Dropdown Menu's existing
module verbatim (those parts have no dependency on the anchoring mechanism).
The Popover API (`popover="auto"`) is still used for top-layer rendering and
native light-dismiss/Escape — only the *positioning* diverges from Dropdown
Menu, not the show/hide/dismiss machinery.

**Alternatives considered**: A synthetic zero-size anchor element positioned
at the cursor via `style.left`/`style.top`, then using normal
`anchor-name`/`position-anchor` against that synthetic element — rejected as
strictly more code and complexity than directly positioning the panel itself
for no behavioral benefit (the synthetic-anchor indirection would need the
exact same clamping logic anyway).

## R6. Empty State — no new CSS class needed

**Decision**: Built a draft composition using only already-shipped utilities
and classes (`flex flex-col items-center text-center gap-3 py-12`, existing
typography classes for heading/description, the existing `Button`/`.btn-*`
classes for the optional action) — confirmed empirically sufficient with no
layout gap. **No new `.empty-state` class ships.** This is documented in the
constitution purely as a compositional pattern (an HTML/class recipe), the
same treatment already given to nothing else in the catalog to date but
directly matching this project's "curate before inventing" philosophy
(Card+Badge's `ProjectCard` composition example set this precedent, though
that one was documentation-only for a design-sync preview, not a catalog
entry — this is the first time a *catalog* entry itself is composition-only).

**Alternatives considered**: A dedicated `.empty-state` wrapper class for
centering/max-width — rejected once the draft composition confirmed existing
utilities cover it without duplication; adding a class here would be
inventing an abstraction with zero unique behavior, contradicting Constitution
guidance against class waste.

## R7. Reduced-motion handling for Skeleton's pulse — no existing mechanism to reuse

**Decision**: Grepped the entire codebase (static components, React port,
tests) for any existing `prefers-reduced-motion`/`motion-reduce:`/
`motion-safe:` usage — **found none**. The spec's original assumption that
this project has an existing reduced-motion mechanism to reuse was wrong;
Skeleton's `animate-pulse` is the first genuinely continuous, ambient
looping animation this design system has ever shipped (existing
`transition-colors`/`transition-shadow` micro-interactions are one-shot
state-change transitions, not the kind of sustained motion
`prefers-reduced-motion` targets). This feature therefore **establishes**
the first reduced-motion handling in this codebase, via Tailwind's built-in
`motion-reduce:` variant (ships in Tailwind core, zero config needed):
`animate-pulse motion-reduce:animate-none`, leaving a static (non-pulsing)
placeholder visible for reduced-motion users rather than removing the
element or its color entirely.

**Alternatives considered**: A custom `@media (prefers-color-scheme...)`-
style raw media query in `@layer components` — rejected in favor of
Tailwind's built-in variant, consistent with this project's "Tailwind-only
styling" principle (no hand-written raw CSS media queries where a utility
variant already covers it).

## R8. Popover's viewport-edge repositioning — a genuine gap `/speckit-analyze` caught

**Decision**: `/speckit-analyze` found that the original plan/contract claim
— "Popover reuses Dropdown Menu's Popover-API + Anchor Positioning mechanism
verbatim... repositioned automatically to remain fully visible" — was
contradicted by Dropdown Menu's own ratified contract
(`specs/005-navigation-disclosure-primitives/contracts/dropdown-menu.contract.md`'s
Edge Cases section), which explicitly documents viewport-edge repositioning
as **out of scope** for that component ("always opens downward-right...
Not attempted via CSS Anchor Positioning"). Dropdown Menu's mechanism
genuinely does not solve this, so Popover cannot inherit a solution that
was never built.

Verified empirically (not assumed) via a direct `CSS.supports()` check
across all three target browser engines, run the same way feature 010's
original Anchor Positioning check was run:

```
chromium: {"positionTryFallbacks":true,"positionTry":true,"anchorName":true}
firefox:  {"positionTryFallbacks":true,"positionTry":true,"anchorName":true}
webkit:   {"positionTryFallbacks":true,"positionTry":true,"anchorName":true}
```

All three engines support `position-try-fallbacks` (paired with the same
`anchor-name`/`position-anchor` setup already in use). Popover's contract
adds `position-try-fallbacks: flip-block, flip-inline;` to `.popover-panel`
— a pure-CSS, zero-JavaScript fallback that automatically flips the panel
to the opposite side of its anchor when the default position would overflow
the viewport. This is strictly better than Dropdown Menu's own
(intentionally out-of-scope) behavior, not a regression risk, since Popover
never inherited a real mechanism to begin with — it's new coverage, not a
"port" of something proven.

**Alternatives considered**: A JS-based clamp identical to Context Menu's
(R5) — rejected as unnecessary extra script for a component whose trigger
position (unlike Context Menu's cursor position) is a real DOM element that
CSS Anchor Positioning already tracks; `position-try-fallbacks` solves this
declaratively for exactly this case. Leaving the gap undocumented and
hoping it doesn't come up — rejected outright, since `/speckit-analyze`
correctly flagged it as a concrete, unaddressed FR-009/SC-002 gap, not a
hypothetical one.

## R9. Testing strategy carry-forward

Same Playwright visual regression (320/768/1024/1440px) + axe-core pattern as
every prior feature. New keyboard-navigation assertions:
- **Tooltip**: Tab reaches the trigger, tooltip becomes visible on
  `:focus-visible`, disappears on blur.
- **Popover**: Escape and outside-click both close it (Popover API's native
  light-dismiss, asserted rather than assumed).
- **Context Menu**: arrow keys rove focus between items (mirrors Dropdown
  Menu's existing test pattern); a menu triggered near a viewport edge is
  asserted to remain fully within the viewport's bounding box.
- **Button Group**: native radio-group keyboard behavior — arrow keys move
  the active segment, Tab enters/exits the whole group as one stop (no
  custom JS to test, but the *behavior* still needs a real assertion, not an
  assumption that native semantics "just work").

New visual baselines generated via `update-snapshots.yml` `workflow_dispatch`
on `ubuntu-latest` only, per this project's established rule (never locally
or via Docker, since even two Linux environments can render fonts/
antialiasing differently from the exact CI runner image).

No CSP changes anticipated. New script surface is minimal: Context Menu's
cursor-positioning module (a genuine fork of Dropdown Menu's), and Popover's
module (a content-agnostic extraction of Dropdown Menu's open/close/
`aria-expanded`/Anchor-Positioning wiring, not a verbatim reuse of the
existing file — same underlying mechanism, no fixed item list). Tooltip
ships with zero JavaScript per R4.

## R10. Popover's orphaned-panel edge case

**Decision**: spec.md's Edge Cases section requires that "if a Popover's
trigger is removed from the page while the popover is open... the popover
must close rather than becoming an orphaned floating panel." A
`/speckit-analyze` pass found this had no downstream task or contract
coverage. Native `popover="auto"` panels are independent top-layer
elements — removing the trigger element from the DOM does not automatically
hide or close the panel. `popover.js` (T052) adds a
`MutationObserver` watching the trigger's parent for the trigger's removal
(the same observation technique, applied to a different target, as
watching for ancestor visibility changes) and calls `panel.hidePopover()`
when the trigger is no longer present.

**Alternatives considered**: Relying on the panel's own light-dismiss (an
outside click) to eventually close it — rejected, since a trigger removed
programmatically (e.g. a row deleted from a list) may happen with no
subsequent user interaction at all, leaving the panel visibly open
indefinitely with no way to dismiss it via keyboard either, since its own
trigger (a natural Tab-focus target) no longer exists.

## R11. Kbd contrast — computed, not assumed

**Decision**: `text-neutral-700` (#374151) on `bg-neutral-50` (#F9FAFB)
computed via the same relative-luminance formula used for every prior
contrast decision: **9.86:1**, clearing the WCAG AAA 7:1 normal-text floor
with comfortable margin. Added as a `PAIRINGS` entry ("Kbd text") in
`scripts/check-contrast.mjs` alongside this feature's other new entries
(R1's Progress `RING_PAIRINGS` entry, and Tooltip's `white`/`neutral-900`
pairing) — a `/speckit-analyze` pass flagged that this specific number had
never been written down/cited anywhere despite the script entry already
existing, the same "verify, don't just assume it's fine" discipline this
project applies everywhere else.

## R12. Inline `style="..."` HTML attributes are silently blocked by this project's CSP — found during implementation, not planning

**Decision**: Every component page in this catalog ships an identical CSP
meta tag: `style-src 'self'` (no `unsafe-inline`, no nonce/hash). Confirmed
empirically (Chromium, real console output, not assumed) that this blocks
inline `style="..."` HTML attributes outright — both when authored directly
in markup (Tooltip's original `anchor-name`/`position-anchor` pairing) and
identically for a plain `style="width: 60%"` (Progress's fill). The
violation is **silent** in the sense that it doesn't throw a JS exception
or fail any test that only checks visibility/`opacity` — it just means the
CSS property never actually applies, so Tooltip rendered with `anchor-name:
none` (positioned via the `position: fixed` fallback, landing at an
arbitrary/wrong location) and Progress's fill never actually reached 60%
width. Neither bug was caught by the original test-first specs (T026,
T032), since those asserted ARIA attributes and opacity, not actual
position or width — caught only by directly inspecting a computed style
value and the browser console for CSP violation messages during
implementation.

Two different fixes were needed depending on whether the value space is
small/fixed or continuous:
- **Tooltip** (anchor-name/position-anchor — a small, boundable set of
  per-instance pairings): pre-declared numbered CSS classes
  (`.tooltip-anchor-1`/`.tooltip-target-1` through `-4`) in
  `src/styles/tailwind.css` — a same-origin stylesheet rule, unaffected by
  `style-src`. Preserves Tooltip's zero-JavaScript design (R4) exactly;
  each demo instance picks one of the four pre-declared numbered pairs
  instead of inventing its own inline pairing.
- **Progress** (fill width — inherently continuous, 0-100%, not boundable
  into a handful of pre-declared classes): a genuinely new, minimal JS
  module (`src/scripts/progress.js`) that sets `element.style.width`
  directly via the CSSOM (`el.style.width = ...`), reading the target
  percentage from a `data-value` attribute. Direct CSSOM property
  assignment is **not** subject to the `style-src-attr` check browsers
  apply to the parsed `style` HTML attribute — confirmed empirically (the
  same distinction `dropdown-menu.js`'s existing `trigger.style.anchorName
  = ...` already relied on, though that precedent was never explicitly
  connected to this specific CSP mechanism before now). This is a small,
  deliberate deviation from an implicit "static-only" assumption for
  Progress — not a contradiction of any explicit spec/plan requirement,
  since Progress was never scoped as zero-JS the way Tooltip explicitly
  was (R4).

Both `tooltip.spec.ts` and `progress.spec.ts` gained a dedicated regression
test (using the existing `expectNoConsoleErrors` helper from
`tests/e2e/a11y-helper.ts`) asserting zero CSP violations alongside the
actual computed property value, so a future regression back to inline
`style="..."` would fail loudly instead of silently rendering wrong.

**Alternatives considered**: Adding `'unsafe-inline'` to this project's CSP
— rejected outright; weakening the security posture project-wide to work
around two components is exactly backwards, and every other component in
this catalog already ships correctly under the strict policy. A CSP nonce
per page — rejected as unnecessary infrastructure for a static-HTML-only
site with no server-side templating to inject a per-request nonce from.
