# Feature Specification: Consent & System Messaging Primitives

**Feature Branch**: `030-consent-system-messaging`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "implemente as primitivas de Consent &
System Messaging identificadas no inventário da feature 018 (Session
Timeout Modal, Offline/Connectivity Banner, 2FA/Verification reminder
banner, Maintenance/Announcement Bar, Dark Mode Toggle) — uma
categoria 0% implementada que reutiliza fortemente os componentes já
existentes (Modal, Alert, Toggle)."

**Source (verified, not assumed)**: `specs/018-component-gap-inventory/
research.md`'s "Consent & System Messaging (5)" category — 0/5 shipped
before this feature. Each candidate cross-referenced against a real
source library/pattern with a buildability signal.

**Scope decision, verified directly against real source, not
assumed**: reading `shared/design-tokens.ts`'s `THEMES` array directly
shows this catalog has no theme literally named `"dark"` — the theme
system is a 48-entry curated palette selector (feature 017), not a
binary light/dark switch. Item 105 ("Dark Mode Toggle") ties into that
architecture per the inventory's own note, so this feature pairs the
toggle with **"dim"** (`id: "dim"`, `moodFamily: "Dark Moody/
Professional"`) as the designated dark counterpart to `"light"` —
`dim` is DaisyUI's own general-purpose dark theme (this catalog's
`dim`/`night`/`darkly`/etc. entries are direct DaisyUI ports, feature
017 research.md), making it the most defensible "the" dark theme for
a binary toggle rather than an arbitrary pick among 47 non-light
options. Documented here rather than left implicit.

This feature ships all **5** items from the category (unlike feature
029's Feedback batch, nothing here duplicates an existing component).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Session timeout warning before forced logout (Priority: P1)

A user has been idle in an authenticated app and is about to be
logged out for security — they need a clear warning with a visible
countdown and a one-click way to stay signed in, rather than silently
losing unsaved work.

**Why this priority**: The most novel item in this batch (a live
countdown display — this catalog's first use of interval-driven time
updates) and the highest-stakes failure mode (silent, unexplained
logout) if done wrong.

**Independent Test**: Trigger the timeout warning — confirm the modal
shows a live, updating countdown and that "Stay signed in" dismisses
it without navigating away.

**Acceptance Scenarios**:

1. **Given** a session is about to expire, **When** the warning
   appears, **Then** it renders as a Modal (this catalog's existing
   focus-trapped `<dialog>` pattern) showing a live countdown and two
   actions: stay signed in, log out now.
2. **Given** the warning is visible, **When** the user selects "Stay
   signed in", **Then** the modal closes and the countdown stops,
   with focus returned to the triggering context per this catalog's
   existing Modal focus-return convention.

---

### User Story 2 - System-status banners (Priority: P2)

A user needs to be informed of conditions affecting the whole app —
lost network connectivity, an unverified security factor, or planned
maintenance — via a full-width or persistent notice distinct from a
transient Toast, using this catalog's existing Alert visual language
rather than a bespoke new banner system.

**Why this priority**: Three related items (Offline/Connectivity
Banner, 2FA/Verification reminder, Maintenance/Announcement Bar) that
are each primarily content/layout variants of the same existing
primitive (Alert) — grouped together as one story since they share an
implementation approach, moderate value.

**Independent Test**: Simulate going offline — confirm the banner
appears without user action and disappears automatically when
connectivity returns. Separately, confirm the 2FA reminder and
Maintenance bar render as full-width, persistent (non-dismissible)
notices reusing Alert's severity-color tokens.

**Acceptance Scenarios**:

1. **Given** the browser goes offline, **When** connectivity is lost,
   **Then** an Offline Banner appears automatically (driven by the
   native online/offline events), and disappears automatically when
   connectivity returns — no manual dismiss control, since the
   condition it reports is not user-dismissible.
2. **Given** a user has not completed 2FA setup, **When** they view
   the reminder banner, **Then** it shows a persistent notice with an
   action to complete setup, using Alert's existing warning/info
   token conventions.
3. **Given** planned maintenance is scheduled, **When** the
   Maintenance/Announcement Bar renders, **Then** it appears as a
   full-width, persistent (non-dismissible) top-of-page notice,
   distinct from Toast's transient, corner-positioned messages.

---

### User Story 3 - Quick light/dark switch (Priority: P3)

A user wants a fast, familiar binary light/dark switch — distinct
from this catalog's existing 48-theme picker dropdown, which is
better suited to deliberate theme browsing than a quick toggle — using
the existing Toggle control wired to theme activation.

**Why this priority**: Narrowest scope — a Toggle wrapper around
already-shipped theme-persistence logic, no new visual mechanism.

**Independent Test**: Activate the toggle — confirm the page's
`data-theme` switches between `light` and `dim`, and the choice
persists across a reload (reusing the existing theme-switcher
persistence mechanism verbatim).

**Acceptance Scenarios**:

1. **Given** the light theme is active, **When** the toggle is
   switched on, **Then** the `dim` theme applies and persists via
   this catalog's existing `localStorage`-based theme persistence.
2. **Given** the toggle reflects the currently active theme, **When**
   any *other* theme (one of the other 46) is active via the existing
   theme selector, **Then** the toggle shows an "off" (light-leaning)
   state rather than a false-positive "on", since it only tracks the
   light/dim binary it controls.

---

### Edge Cases

- What happens if the session-timeout countdown reaches zero before
  the user responds? The demo MUST show a clear "logged out" outcome
  state (not silently do nothing) — this is a presentation-layer demo
  of the pattern, not a real authentication integration.
- What happens if the Offline Banner's condition and the 2FA/
  Maintenance banners are simultaneously true? Each renders
  independently; this feature does not introduce a banner-stacking
  priority system beyond normal document order.
- What happens when the Dark Mode Toggle is toggled while a
  non-light/non-dim theme (e.g. `synthwave`) is active? Per Acceptance
  Scenario 2, the toggle does not attempt to "remember" the prior
  theme — switching it off always returns to `light`, on always
  applies `dim`, a predictable binary rather than a per-theme memory
  feature.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Session Timeout Modal reusing this
  catalog's existing Modal `<dialog>` mechanism, showing a live
  countdown and two explicit actions (stay signed in / log out now).
- **FR-002**: System MUST provide an Offline/Connectivity Banner that
  appears and disappears automatically based on the native
  online/offline browser events, with no manual dismiss control.
- **FR-003**: System MUST provide a 2FA/Verification reminder banner
  and a Maintenance/Announcement Bar, both reusing Alert's existing
  severity-color classes verbatim in a full-width, persistent
  (non-dismissible) layout.
- **FR-004**: System MUST provide a Dark Mode Toggle reusing this
  catalog's existing Toggle control and theme-persistence mechanism
  (`localStorage`-backed, per feature 017), bound specifically to the
  `light`/`dim` theme pair (documented scope decision above).
- **FR-005**: Every new primitive MUST ship on both this catalog's
  existing surfaces (static HTML and React), per the dual-surface
  convention.
- **FR-006**: None of the 5 primitives MUST introduce a new design
  token — reuse this catalog's existing brand/semantic/neutral set
  and the 2 already-shipped themes (`light`, `dim`).
- **FR-007**: Every new primitive MUST meet this catalog's existing
  WCAG AAA contrast bar and never convey state (countdown urgency,
  connectivity, toggle state) by color alone.

### Key Entities

- **Session Timeout State**: a remaining-seconds countdown value and
  an expired/active status — demo-driven (a manually triggered
  countdown for illustration), not a real idle-detection or session
  API integration.
- **Connectivity State**: online/offline, sourced directly from
  `navigator.onLine` and the `online`/`offline` window events — no
  new polling or backend check introduced.
- **System Banner Content**: severity (info/warning), message text,
  and an optional action — for the 2FA reminder and Maintenance Bar,
  reusing Alert's existing `Key Entities` shape from its own contract.
- **Dark Mode Toggle State**: derived, not stored separately — reads
  the current `data-theme` to decide checked/unchecked (`dim` = on,
  everything else = off), writes via the existing `selectTheme()`
  function — no new persistence key.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 5 primitives ship, closing feature 018's inventory's
  Consent & System Messaging category from 0% to 5/5 — the only
  category besides Layout & Structure (feature 028) to reach 100%.
- **SC-002**: Zero new design tokens or themes introduced — 100%
  verified via this catalog's existing token audit.
- **SC-003**: The Offline Banner and Dark Mode Toggle each reflect
  real browser/document state (connectivity, active theme) with zero
  drift from a manual page reload — verified by Playwright toggling
  the underlying condition directly, not merely simulating a click.
- **SC-004**: Session countdown, connectivity, and toggle state are
  each exposed as accessible text/attributes, verified to never rely
  on color alone (axe-core + manual contrast-independent check).

## Assumptions

- **Session Timeout Modal is a pattern demo, not a real session
  integration**: the countdown is manually triggerable on the demo
  page (mirroring how this catalog's existing Modal demo is manually
  triggered rather than tied to real deletion logic) — no idle-
  detection (mousemove/keydown debouncing) or real auth/session API
  is introduced.
- **Dark Mode Toggle's dark-theme pairing (`dim`)** is a deliberate,
  documented choice (see Scope decision above), not an arbitrary
  default — a future feature could make this configurable without
  breaking this feature's contract.
- **React port for every primitive**: all 5 ship a React component
  wrapper too, per this catalog's existing dual-surface convention.
- **No de-duplication conflict**: none of the 5 items appear in
  feature 018's own "Flagged for de-duplication review" list —
  confirmed distinct from every existing shipped component.
