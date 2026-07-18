# Research: Consent & System Messaging Primitives

## R1: Session Timeout Modal reuses Modal verbatim, adds only a countdown

**Decision**: Reuse the existing `<dialog class="modal-dialog">` /
`.modal-panel` mechanism (`src/scripts/overlay.js`'s
`initDialogTriggers()`/`wireDialogClose()` for static HTML, `Modal.tsx`
+ `useDialogTrigger` for React) unchanged. The only new logic is a
`setInterval`-driven countdown display — this catalog's first use of
interval-driven time updates (no prior component needed one; Progress/
RingProgress are driven by a caller-supplied value, not a ticking
clock).

**Rationale**: Session Timeout Modal is explicitly not a new dialog
mechanism per the inventory ("reuses Modal + the Countdown Timer
pattern") — introducing a second dialog implementation would violate
this catalog's established single-mechanism-per-behavior discipline
(the same reasoning that kept Slide-over on Modal's exact `<dialog>`
approach in feature 003).

**Alternatives considered**: A dedicated non-Modal countdown overlay —
rejected, no behavioral reason exists for a session-timeout warning to
need anything Modal doesn't already provide (focus trap, Escape,
backdrop dismiss are all appropriate here too).

## R2: Standalone "Countdown Timer" (inventory item 92) is NOT shipped by this feature

**Decision**: The countdown display inside Session Timeout Modal is
inline to that component, not extracted as a separately exported
"Countdown Timer" primitive.

**Rationale**: Item 92 ("Countdown Timer") belongs to the inventory's
"Data-adjacent widgets" category, not "Consent & System Messaging" —
shipping it as a standalone, independently reusable component is out
of this feature's scope (it would double-count against a different
category's own future feature). This feature ships only the minimal
countdown logic Session Timeout Modal itself needs.

## R3: Offline Banner uses the native `online`/`offline` window events, no polling

**Decision**: `window.addEventListener("online"/"offline", ...)` plus
an initial `navigator.onLine` check for correct state on page load —
this catalog's first use of either. No polling, no manual connectivity
check against a server endpoint.

**Rationale**: Every evergreen target browser (Chromium/Firefox/
WebKit) supports these events natively; introducing a server-polling
fallback would be unjustified complexity for a presentation-layer
demo, and this catalog has no existing network-request utility to
build on regardless.

**Alternatives considered**: A `fetch()`-based "ping" polling loop —
rejected as unnecessary scope for demonstrating the pattern, and it
would be the first component in this catalog to make its own network
requests purely for its own internal state, a meaningfully larger
scope decision than a Consent & System Messaging primitive warrants.

## R4: 2FA reminder + Maintenance Bar are layout/content variants of Alert, not new CSS

**Decision**: Both reuse `.alert`/`.alert-warning`/`.alert-info`
verbatim (`src/styles/tailwind.css` lines 283-297) with zero new
classes. Maintenance/Announcement Bar additionally removes the
existing demo's `max-w-md` wrapper constraint to render full-width
(`.alert` itself has no width constraint — confirmed by reading the
class definition directly, `flex items-start gap-3 rounded-md p-4`)
and omits the dismiss button entirely (no `data-alert`/close-icon-btn
wiring), matching the inventory's "persistent, non-dismissible" note.

**Rationale**: Verified directly against `src/components/alert/
alert.html` and its CSS — Alert already has everything both variants
need; this is layout composition, not a new primitive.

## R5: Dark Mode Toggle's dark-theme pairing

See spec.md's "Scope decision" section — `dim` is the designated dark
counterpart to `light`, verified directly against `shared/design-
tokens.ts`'s `THEMES` array (no theme literally named `"dark"` exists;
`dim` is DaisyUI's own general-purpose dark theme, one of 8 sharing
the "Dark Moody/Professional" `moodFamily`, and the most defensible
non-arbitrary choice).

**Toggle wiring**: reuses `src/scripts/theme-switcher.js`'s
`selectTheme(themeId, knownThemeIds)`/`applyTheme(themeId)` and
`resolveInitialTheme()` verbatim — no new persistence key, no new
localStorage schema. The toggle's checked state is *derived* on load
by reading `document.documentElement.dataset.theme === "dim"`, not
tracked as independent state — this avoids a second source of truth
that could drift from the actual active theme (e.g. if the user
separately picks `dim` via the existing 48-theme `<select>`, this
toggle must reflect that as "on" without needing its own event
listener on that unrelated control).

**Cross-component sync**: since both the gallery theme `<select>`
(`gallery-theme-selector.js`) and this toggle can each change
`data-theme`, the toggle's own script listens for the theme
`<select>`'s change event where present on the same page (demo pages
only — a real consuming app would only ever have one theme control
visible at a time in practice, but this catalog's demo page shows
both for illustration) to stay in sync without polling.

## Summary

All 5 primitives reuse an already-shipped mechanism (Modal, Alert,
Toggle, `theme-switcher.js`) with 3 small, genuinely new additions:
`setInterval`-driven countdown display, `online`/`offline` event
listener, and a derived (not separately persisted) toggle-state read.
Zero new design tokens, zero new dependencies.
