# Feature Specification: Feedback Primitives

**Feature Branch**: `029-feedback-primitives`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "implemente as primitivas de Feedback
identificadas no inventário da feature 018 (Notification/stack de
notificações, RingProgress, SemiCircleProgress, Notification Center/
Inbox Panel, Password Strength Meter) — uma categoria 0% implementada
que reutiliza fortemente os componentes já existentes (Toast,
Progress, Indicator, Dropdown Menu)."

**Source (verified, not assumed)**: `specs/018-component-gap-inventory/
research.md`'s "Feedback (5)" category — 0/5 shipped before this
feature. Each candidate cross-referenced against a real source library
with a buildability signal.

**De-duplication finding (verified directly against real source, not
assumed)**: reading `src/styles/tailwind.css` and `src/scripts/
toast.js` directly reveals this catalog's existing Toast component
already ships a `.toast-stack` class (`fixed top-4 right-4 z-50 flex
flex-col gap-3`) — a real, working stacking/dismissible-message-queue
mechanism. The inventory's "Notification" candidate (item 47:
"stackable, dismissible... a notification CENTER/list, not one
message") is therefore substantially already covered by Toast's
existing capability, not a genuine gap. This feature does NOT
re-implement Notification as a separate component — it is excluded
per this catalog's own established de-duplication convention (the
same review step already applied to NativeSelect/SegmentedControl/
CloseButton/Burger/Drawer in feature 018's own inventory notes). The
inventory's distinct item 50 ("Notification Center / Inbox Panel" — a
bell icon + dropdown panel of PAST notifications, persistent history,
not ephemeral toasts) is a genuinely different, unaddressed pattern
and IS in scope.

This feature therefore ships **4** of the category's 5 items:
RingProgress, SemiCircleProgress, Notification Center, and Password
Strength Meter.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - At-a-glance circular progress (Priority: P1)

A developer needs to show progress or a proportion (e.g. storage
used, task completion) in a compact circular form — common in
dashboards and settings pages — where this catalog's existing linear
Progress bar doesn't fit the available space or visual language.

**Why this priority**: The most broadly reusable and lowest-scope item
in this batch — a single new visual pattern (SVG stroke-dashoffset)
reused twice (RingProgress full circle, SemiCircleProgress half —
literally a visual variant of the same mechanism, per the inventory's
own note).

**Independent Test**: Render RingProgress and SemiCircleProgress at
several progress values (0%, 50%, 100%) — confirm the filled arc
proportion matches the value and the accessible value is exposed to
assistive tech.

**Acceptance Scenarios**:

1. **Given** a progress value between 0 and 100, **When** RingProgress
   renders, **Then** the filled arc's proportion visually matches the
   value and an accessible text equivalent (e.g. "60%") is exposed,
   not conveyed by the arc's shape alone.
2. **Given** the same progress value, **When** SemiCircleProgress
   renders, **Then** it shows the identical value as a half-circle
   gauge, reusing RingProgress's underlying mechanism.

---

### User Story 2 - Persistent notification history (Priority: P2)

A user wants to review notifications they may have missed or
dismissed too quickly — a bell icon showing an unread count that
opens a panel listing recent notifications, distinct from this
catalog's existing ephemeral Toast messages which disappear and leave
no trace.

**Why this priority**: Genuinely new to this catalog (not covered by
Toast), but composes entirely from already-shipped pieces (Indicator
for the unread badge, Dropdown Menu for the panel mechanics) —
moderate value, secondary to the more universal progress primitives.

**Independent Test**: Open the notification bell with a nonzero
unread count — confirm the panel lists past notifications and the
badge count is accurate.

**Acceptance Scenarios**:

1. **Given** unread notifications exist, **When** a user views the
   bell icon, **Then** an Indicator badge shows the unread count.
2. **Given** the bell is activated, **When** the panel opens, **Then**
   it lists notifications (read and unread visually distinguished)
   using Dropdown Menu's existing panel/keyboard mechanics.

---

### User Story 3 - Password strength feedback while typing (Priority: P3)

A user creating a password wants immediate visual feedback on its
strength (weak/fair/strong) as they type, reusing this catalog's
existing Progress bar visual language rather than a bespoke new
indicator.

**Why this priority**: Narrowest scope of the batch — a single
computed-value display reusing Progress's existing fill/track
mechanism, valuable specifically for auth/account-creation flows.

**Independent Test**: Type passwords of increasing complexity — confirm
the strength indicator's fill and accessible label update accordingly.

**Acceptance Scenarios**:

1. **Given** a user types a weak password, **When** the meter
   evaluates it, **Then** it shows a low-fill state with an accessible
   "Weak" label, not conveyed by color alone.
2. **Given** a user types a strong password, **When** the meter
   evaluates it, **Then** it shows a high-fill state with an
   accessible "Strong" label.

---

### Edge Cases

- What happens when RingProgress/SemiCircleProgress receives a value
  outside 0-100? It MUST clamp to the valid range, never render an
  arc beyond a full circle/half-circle.
- What happens when the Notification Center has zero notifications?
  It MUST show an explicit empty state, not a blank panel.
- What happens when the Password Strength Meter receives an empty
  string? It MUST show a neutral/empty state, not a false "Weak"
  reading before the user has typed anything.
- What happens to the excluded "Notification" candidate if a future
  need for a full imperative queue-management API (add/remove/limit
  concurrent toasts programmatically) arises? That would be a JS-API
  layer on top of the existing Toast/toast-stack visual mechanism, not
  a new visual component — explicitly out of scope here, consistent
  with how feature 018's own inventory treats similar API-layer-only
  gaps (e.g. "Dialog Manager").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide RingProgress and SemiCircleProgress,
  both SVG-based circular progress indicators sharing one underlying
  mechanism, using this catalog's existing color tokens (brand/
  semantic) for the filled arc.
- **FR-002**: System MUST provide a Notification Center composing this
  catalog's existing Indicator (unread badge) and Dropdown Menu
  (panel mechanics) — no new interaction pattern beyond composing
  these two.
- **FR-003**: System MUST provide a Password Strength Meter reusing
  this catalog's existing Progress fill/track visual mechanism, with
  a computed strength value exposed as accessible text, never by
  color alone.
- **FR-004**: System MUST NOT re-implement a standalone "Notification"
  component — this catalog's existing Toast + `.toast-stack` already
  covers stackable, dismissible message display (documented
  de-duplication finding above).
- **FR-005**: Every new primitive MUST ship on both this catalog's
  existing surfaces (static HTML and React), per the dual-surface
  convention.
- **FR-006**: None of the 4 primitives MUST introduce a new color
  token — reuse this catalog's existing brand/semantic/neutral set.
- **FR-007**: Every new primitive MUST meet this catalog's existing
  WCAG AAA contrast bar and never convey state (progress value,
  strength level, read/unread) by color alone.

### Key Entities

- **Circular Progress Primitive**: RingProgress (full) / SemiCircleProgress
  (half) — a value (0-100), a size, and an accessible text equivalent.
- **Notification Center Entry**: a single past notification — message
  text, a read/unread state, a timestamp. Not persisted across page
  reloads by this feature (no new storage mechanism) — the demo
  illustrates the composition with representative static/sample data.
- **Password Strength Result**: a computed level (e.g. weak/fair/
  strong) and a numeric score driving the Progress-reused fill
  percentage — the scoring heuristic itself is an implementation
  detail decided during planning, not fixed here.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 4 primitives ship, closing 4 of the 5 Feedback
  category items from feature 018's inventory (the 5th, Notification,
  is explicitly de-duplicated against existing Toast capability, not
  silently dropped).
- **SC-002**: Zero new design tokens introduced across all 4
  primitives — 100% verified via this catalog's existing token audit.
- **SC-003**: RingProgress/SemiCircleProgress/Password Strength Meter
  each expose their value/level as accessible text, verified to never
  rely on color alone (axe-core + manual contrast-independent check).
- **SC-004**: Notification Center composes with zero duplicated
  logic — Indicator and Dropdown Menu's existing behavior is reused
  verbatim, not reimplemented.

## Assumptions

- **Password strength scoring heuristic**: a reasonable, industry-
  standard heuristic (length + character-class diversity) is used —
  this is a presentation-layer demo of the meter component, not a
  production-grade password-policy engine; the exact scoring
  thresholds are a planning-phase decision.
- **Notification Center sample data**: the demo page uses
  representative static sample notifications — no new backend,
  API, or persistence layer is introduced by this feature.
- **React port for every primitive**: all 4 ship a React component
  wrapper too, per this catalog's existing dual-surface convention.
- **No de-duplication conflict for the 4 in-scope items**: RingProgress,
  SemiCircleProgress, Notification Center, and Password Strength Meter
  do not appear in feature 018's own "Flagged for de-duplication
  review" list — confirmed distinct from every existing shipped
  component (Notification itself is the one exclusion, addressed
  above).
