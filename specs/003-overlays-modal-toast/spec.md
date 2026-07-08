# Feature Specification: Overlays — Modal, Slide-over, Toast

**Feature Branch**: `003-overlays-modal-toast`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: "Implement the design system's third slice of primitives — Modal, Slide-over, and Toast — in HTML using Tailwind CSS, built exclusively on the semantic design tokens already ratified in the project constitution (v1.3.4). These complete the Overlays, Modals & Feedback section of the Component Catalog. Unlike every component shipped so far (Button, Text Input, Badge, Checkbox, Radio, Select, Toggle), which used only native HTML behavior and Tailwind pseudo-classes with zero JavaScript, this feature's Modal and Slide-over MUST implement focus trapping (keyboard focus stays within the open overlay) and return focus to the triggering element on close, per the constitution's Principle II — this is the first feature where the 'no custom JavaScript' assumption from features 001/002 may need to be revisited, since focus trapping cannot be done with pure CSS. Toast is a transient, dismissible notification with an aria-live region for screen-reader announcement. All three must pass WCAG 2.2 AAA contrast and zero raw Tailwind palette classes, same discipline as features 001 and 002."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Focus-Trapped Modal Dialog (Priority: P1)

A frontend developer building a confirmation flow (e.g. "delete this item?")
needs a modal dialog that already matches the design system's token and
accessibility rules, safely traps keyboard focus while open, and reliably
returns focus to whatever the user was doing when they opened it.

**Why this priority**: Modal is the single most common overlay pattern in
any product surface (confirmations, forms-in-a-dialog, detail views), and is
the overlay the constitution's Principle II calls out by name for focus
management — the highest-risk, highest-value piece to get right first.

**Independent Test**: Can be fully tested by dropping the Modal markup and
its trigger button into a blank page and verifying, without any other
component present, that opening it traps Tab/Shift+Tab within the dialog,
Escape closes it, clicking the backdrop closes it, and focus returns to the
trigger button afterward.

**Acceptance Scenarios**:

1. **Given** the Modal is open, **When** the user presses Tab repeatedly,
   **Then** focus cycles only among the Modal's own focusable elements and
   never reaches content behind it.
2. **Given** the Modal is open, **When** the user presses Escape, **Then**
   the Modal closes and focus returns to the element that triggered it.
3. **Given** the Modal is open, **When** the user clicks the backdrop
   (outside the dialog panel), **Then** the Modal closes and focus returns
   to the trigger.

---

### User Story 2 - Dismissible Toast Notification (Priority: P2)

A frontend developer needs a transient, non-blocking notification (e.g.
"Changes saved") that announces itself to screen readers without stealing
keyboard focus from whatever the user is doing, and that the user can
dismiss manually.

**Why this priority**: Toast is simpler than Modal/Slide-over (no focus
trap needed, since it's explicitly non-blocking) and delivers standalone
value for any "save"/"error" feedback flow — a natural second slice once
the higher-risk focus-trap mechanism is proven on Modal.

**Independent Test**: Can be fully tested by dropping the Toast markup into
a blank page and verifying, without any other component present, that it
is announced via `aria-live`, does not steal focus from the page, and can
be dismissed via its close button.

**Acceptance Scenarios**:

1. **Given** a Toast appears on screen, **When** it renders, **Then** it is
   exposed via `aria-live="polite"` so screen readers announce it without
   interrupting the user's current task.
2. **Given** a Toast is visible, **When** the user activates its close
   button, **Then** it is removed from the accessibility tree and no longer
   visible.
3. **Given** a Toast is visible, **When** the user is mid-keystroke
   elsewhere on the page, **Then** the Toast's appearance does not move
   keyboard focus away from the active element.

---

### User Story 3 - Focus-Trapped Slide-over Panel (Priority: P3)

A frontend developer building a "view details" or "edit settings" flow
needs a side panel that slides in from the edge of the screen, sharing the
same focus-trap and Escape/backdrop-dismiss behavior as Modal, for
content too long or contextual for a centered dialog.

**Why this priority**: Lower usage frequency than Modal/Toast, but a
standard, expected pattern for any "first slice" of overlay primitives —
completes the Overlays section of the Component Catalog. Reuses the same
focus-trap mechanism proven on Modal (User Story 1), minimizing new risk.

**Independent Test**: Can be fully tested by dropping the Slide-over markup
and its trigger into a blank page independently of other components and
verifying the same focus-trap, Escape-to-close, and backdrop-dismiss
behavior as Modal, with a slide-in-from-edge animation instead of a
centered appearance.

**Acceptance Scenarios**:

1. **Given** the Slide-over is closed, **When** the user activates its
   trigger, **Then** it slides in from the screen edge and traps focus
   exactly as Modal does.
2. **Given** the Slide-over is open, **When** the user presses Escape or
   clicks the backdrop, **Then** it closes and focus returns to the
   trigger, exactly as Modal does.

---

### Edge Cases

- What happens when a Modal or Slide-over is opened while it contains no
  focusable elements at all (e.g. a pure informational message with no
  buttons)? Focus MUST move to the dialog container itself (a
  programmatically-focusable, non-interactive element) rather than being
  lost to the document body.
- How does the system handle multiple Toasts appearing in quick succession?
  Each MUST be independently dismissible and MUST NOT visually overlap or
  obscure another; they stack without overlapping.
- What happens if the user tries to Tab out of a Slide-over via
  Shift+Tab from its first focusable element? Focus MUST wrap to the
  Slide-over's last focusable element, not escape to the page behind it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The design system MUST provide a Modal component that traps
  keyboard focus within itself while open and returns focus to the
  triggering element when closed.
- **FR-002**: The design system MUST provide a Toast component that
  announces itself via `aria-live` without moving keyboard focus, and that
  the user can dismiss manually.
- **FR-003**: The design system MUST provide a Slide-over component with
  the same focus-trap and dismissal behavior as Modal, sliding in from a
  screen edge instead of appearing centered.
- **FR-004**: Every component MUST use only the semantic tokens defined in
  the project constitution's color table — no raw Tailwind palette classes
  are permitted in shipped markup.
- **FR-005**: Modal and Slide-over MUST be dismissible via Escape key,
  backdrop click, and an explicit close control; Toast MUST be dismissible
  via an explicit close control.
- **FR-006**: Every text/background color combination in all three
  components MUST pass WCAG 2.2 AAA contrast.
- **FR-007**: Modal and Slide-over's backdrop MUST prevent interaction with
  page content behind the overlay while open (both for pointer and
  keyboard/assistive-technology users).

### Key Entities

- **Modal**: a centered dialog overlay; has a `state` (`closed`, `open`),
  traps focus while open, and returns focus to its trigger on close.
- **Slide-over**: an edge-anchored dialog overlay; same `state` and
  focus-trap/return model as Modal, plus a `side` (e.g. `right`) determining
  slide-in direction.
- **Toast**: a transient, non-modal notification; has a `state` (`visible`,
  `dismissed`) and does not participate in focus trapping.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can locate, copy, and correctly use any of the
  three primitives (Modal, Toast, Slide-over) in a new screen in under 2
  minutes without consulting anyone else.
- **SC-002**: 100% of Modal/Slide-over instances trap focus correctly (no
  Tab/Shift+Tab escape to background content) as verified by automated
  keyboard-navigation testing.
- **SC-003**: 100% of text/background color combinations across the three
  components pass a WCAG 2.2 AAA contrast check.
- **SC-004**: Zero instances of raw/hardcoded Tailwind palette classes
  appear in the shipped markup of any of the three components, as verified
  by an automated class-name audit.

## Assumptions

- Unlike features 001 and 002, this feature is expected to require minimal
  vanilla JavaScript for focus trapping and Escape/backdrop dismissal on
  Modal and Slide-over — native HTML/CSS alone cannot express this
  behavior. The exact mechanism (native `<dialog>` element vs. a hand-rolled
  focus-trap script) is a Phase 0 research decision for `/speckit-plan`,
  not assumed here; any resulting new dependency will be documented and
  justified the same way this project has documented every other technical
  decision.
- Toast requires no focus trapping (it is explicitly non-modal per FR-002),
  so it may still be achievable with the project's existing zero-JS
  precedent for dismissal, though its appearance/removal from the DOM may
  still need a small script — also a Phase 0 research question, not
  assumed.
- Components target both desktop and mobile viewports using Tailwind's
  responsive utilities; no dedicated native-app variant is in scope.
- The color, typography, and spacing tokens ratified in the project
  constitution (v1.3.4) are final for this feature; any ratified-token gap
  discovered during `/speckit-analyze` (color, radius, or otherwise) will
  be remediated via constitution amendment before implementation, not
  worked around in component markup — consistent with features 001/002's
  precedent.
- No specific browser support matrix was provided; the components target
  the current stable versions of evergreen browsers (Chrome, Firefox,
  Safari, Edge).
