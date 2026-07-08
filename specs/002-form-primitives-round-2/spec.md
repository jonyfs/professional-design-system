# Feature Specification: Form Primitives — Round 2

**Feature Branch**: `002-form-primitives-round-2`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: "Implement the design system's second slice of form primitives — Radio Button, Select (dropdown), and Toggle/Switch — in HTML using Tailwind CSS, built exclusively on the semantic design tokens already ratified in the project constitution (v1.3.2). These complete the Forms, Validation & Inputs section of the Component Catalog alongside the existing Text Input and Checkbox from feature 001."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Drop-in Accessible Radio Group (Priority: P1)

A frontend developer building a form needs a set of mutually-exclusive
options (e.g. shipping method, plan tier) that already matches the design
system's token and accessibility rules, and that behaves correctly as a
single logical group.

**Why this priority**: Radio groups are the most common companion to
Checkbox for single-select choices and share nearly identical visual/
interaction language with it (already shipped in feature 001), making this
the fastest, lowest-risk value to ship first.

**Independent Test**: Can be fully tested by dropping a 3-option radio group
markup into a blank page and verifying, without any other component present,
that exactly one option is selectable at a time, every required state
(default, checked, focus-visible, disabled) is visually distinct, and
keyboard arrow-key navigation moves selection within the group.

**Acceptance Scenarios**:

1. **Given** a radio group of three options sharing the same `name`
   attribute, **When** a user selects one option, **Then** any previously
   selected option in the same group is automatically deselected.
2. **Given** a radio option is focused, **When** the user presses an arrow
   key, **Then** focus and selection move to the adjacent option within the
   same group (native `<input type="radio">` behavior).
3. **Given** a radio option is marked `disabled`, **When** a user attempts
   to select it via click or keyboard, **Then** it does not become selected
   and visually communicates the disabled state.

---

### User Story 2 - Drop-in Accessible Select (Priority: P2)

A frontend developer building a form needs a dropdown selection control with
label, placeholder, focus, and inline-error states that already match the
design system's token and accessibility rules, visually consistent with the
existing Text Input.

**Why this priority**: Select is the third most common form control after
Button and Text Input (already shipped), and reuses Text Input's exact
visual language, minimizing new design surface.

**Independent Test**: Can be fully tested by dropping the Select markup into
a blank page (no other component required) and verifying default, focus,
and error states render and behave correctly in isolation, with all options
reachable and selectable via keyboard alone.

**Acceptance Scenarios**:

1. **Given** a Select in its default state, **When** the user clicks or tabs
   into it, **Then** the focus ring uses the brand token (`focus:ring-brand`)
   consistent with Text Input's focus treatment.
2. **Given** a Select marked as invalid, **When** it is rendered, **Then** an
   inline error message appears directly below it using the error token
   (`text-error-strong`), and the select itself carries `aria-invalid="true"`
   plus an error-colored ring.
3. **Given** a Select is focused, **When** the user presses the Down/Up
   arrow keys, **Then** the native browser option list opens/navigates
   without any custom script.

---

### User Story 3 - Drop-in Accessible Toggle/Switch (Priority: P3)

A frontend developer needs a boolean on/off control for settings and
preference screens that follows the same semantic-token and accessibility
rules as the other primitives, visually distinct from Checkbox for contexts
where an immediate-effect toggle (rather than a form-submission checkbox)
is the correct affordance.

**Why this priority**: Lower usage frequency than Radio/Select, but a
standard, expected control for any "first slice" of a form/settings-capable
product surface — completes the Forms section of the Component Catalog.

**Independent Test**: Can be fully tested by dropping the Toggle markup into
a blank page independently of other components and verifying the on/off
states, focus-visible ring, and disabled state all render and behave
correctly, and that Space/click toggles the state when focused.

**Acceptance Scenarios**:

1. **Given** a Toggle in the off state, **When** the user clicks it or
   presses Space while it is focused, **Then** it switches to the on state,
   the track color changes from `bg-neutral-200` to `bg-brand`, and the
   inner dot slides to the opposite side.
2. **Given** a Toggle is marked `disabled`, **When** a user attempts to
   toggle it, **Then** it does not change state and visually communicates
   the disabled state.

---

### Edge Cases

- What happens when a radio group's options have long labels that wrap
  across multiple lines? Each option's label MUST wrap without breaking
  alignment between the radio input and the start of its label text.
- How does the Select behave when no option is selected and the field is
  also marked invalid? The placeholder/first-option text MUST remain
  visible and the error message MUST still render below it.
- How does the Toggle behave when disabled and already in the "on" state?
  It MUST visually combine both states (`disabled:opacity-50` layered on
  the "on" track color) and remain non-interactive.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The design system MUST provide a Radio component supporting
  grouped, mutually-exclusive selection via a shared `name` attribute, with
  visually distinct default, checked, focus-visible, and disabled states.
- **FR-002**: The design system MUST provide a Select component with
  visually distinct default, focus, error, and disabled states, including
  an error message slot positioned directly below it, matching Text Input's
  visual treatment.
- **FR-003**: The design system MUST provide a Toggle/Switch component with
  visually distinct off, on, focus-visible, and disabled states.
- **FR-004**: Every component MUST use only the semantic tokens defined in
  the project constitution's color table — no raw Tailwind palette classes
  are permitted in shipped markup.
- **FR-005**: Every interactive component (Radio, Select, Toggle) MUST be
  fully operable using the keyboard alone (Tab to focus, native
  arrow-key/Space/click activation appropriate to each control).
- **FR-006**: Every interactive component MUST expose its current state to
  assistive technology via correct native semantics (Radio's native
  `checked`/grouping behavior, Select's native option list, Toggle's native
  `checked` state) or an explicit ARIA attribute only where no native
  equivalent exists (`aria-invalid` on the Select error state). Redundant
  ARIA attributes duplicating already-correct native semantics MUST NOT be
  added.
- **FR-007**: Every text/background color combination in all three
  components MUST pass WCAG 2.2 AAA contrast.

### Key Entities

- **Radio Group**: a named set of mutually-exclusive options; each option
  has a `checked`/`unchecked` state, shares a `name` with its siblings, and
  MAY be individually `disabled`.
- **Select**: a single-choice dropdown; has a `state` (`default`, `focus`,
  `error`, `disabled`) and an optional `errorMessage`.
- **Toggle**: a single boolean control; has a `state` (`off`, `on`,
  `focus-visible`, `disabled`), with `disabled` combinable with either
  `off` or `on`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can locate, copy, and correctly use any of the
  three primitives (Radio, Select, Toggle) in a new screen in under 2
  minutes without consulting anyone else.
- **SC-002**: 100% of interactive components expose visually distinct
  hover/focus/active-or-checked/disabled states, as verified by manual or
  automated visual review.
- **SC-003**: 100% of text/background color combinations across the three
  components pass a WCAG 2.2 AAA contrast check.
- **SC-004**: Zero instances of raw/hardcoded Tailwind palette classes
  appear in the shipped markup of any of the three components, as verified
  by an automated class-name audit.

## Assumptions

- Components are delivered as static HTML + Tailwind CSS markup for this
  slice; interactive behavior (grouping, toggling, option selection) relies
  on native HTML behavior and Tailwind pseudo-class variants rather than
  custom JavaScript, unless a future feature explicitly requires scripted
  behavior — consistent with feature 001's precedent.
- Components target both desktop and mobile viewports using Tailwind's
  responsive utilities; no dedicated native-app variant is in scope.
- The color, typography, and spacing tokens ratified in the project
  constitution (v1.3.3) are final for this feature; no new design tokens
  are anticipated, but any AAA-contrast gap discovered during
  `/speckit-analyze` will be remediated the same way feature 001's was
  (constitution amendment before implementation), not worked around in
  component markup.
- No specific browser support matrix was provided; the components target
  the current stable versions of evergreen browsers (Chrome, Firefox,
  Safari, Edge).
- Toggle/Switch's underlying element is a native `<input type="checkbox">`
  visually restyled as a track-and-dot switch (the standard accessible
  pattern for this control) rather than a custom `role="switch"` widget,
  to stay consistent with feature 001's "native semantics first" precedent.
