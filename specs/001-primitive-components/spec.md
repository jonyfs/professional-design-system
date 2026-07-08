# Feature Specification: Design System Primitive Components

**Feature Branch**: `001-primitive-components`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "Implement the design system's primitive components — Button, Text Input, Badge, and Checkbox — in HTML using Tailwind CSS, built exclusively on the semantic design tokens already ratified in the project constitution (v1.3.0)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Drop-in Accessible Button (Priority: P1)

A frontend developer building a screen needs a call-to-action or secondary action
control that is already compliant with the design system's accessibility and
token rules, without hand-writing Tailwind classes or guessing at states.

**Why this priority**: Buttons are the single most-used interactive element in
any product surface. Shipping a compliant Button first delivers the largest
immediate reduction in inconsistent, inaccessible, or hardcoded-class markup
across the product.

**Independent Test**: Can be fully tested by dropping the Button markup into a
blank page and verifying, without any other component present, that it renders
correctly and every required state (default, hover, active, focus-visible,
disabled) is visually distinct and keyboard-operable.

**Acceptance Scenarios**:

1. **Given** a developer copies the primary Button markup into a page, **When**
   they tab to it with the keyboard, **Then** a visible focus ring appears using
   the brand-token outline (no browser default outline, no missing outline).
2. **Given** the Button is marked `disabled`, **When** a user attempts to click
   or activate it, **Then** it visually communicates the disabled state
   (`opacity-50`, `cursor-not-allowed`) and does not trigger its action.

---

### User Story 2 - Drop-in Accessible Text Input (Priority: P2)

A frontend developer building a form needs a text input control with label,
placeholder, focus, and error states that already match the design
system's token and accessibility rules.

**Why this priority**: Forms are the second most common surface after buttons,
and inconsistent input styling/validation feedback is a common source of user
confusion. This story is independently valuable once Button already exists.

**Independent Test**: Can be fully tested by dropping the Text Input markup into
a blank page (no Button or other component required) and verifying default,
focus, and error states render and behave correctly in isolation.

**Acceptance Scenarios**:

1. **Given** a Text Input in its default state, **When** the user clicks or tabs
   into it, **Then** the focus ring uses the brand token
   (`focus:ring-brand`) and the border/ring updates accordingly.
2. **Given** a Text Input marked as invalid, **When** it is rendered, **Then** an
   inline error message appears directly below the input using the error token
   (`text-error`), and the input itself carries `aria-invalid="true"` plus an
   error-colored ring.

---

### User Story 3 - Drop-in Badge & Checkbox (Priority: P3)

A frontend developer needs status indicators (Badge) and a selection control
(Checkbox) that follow the same semantic-token and accessibility rules as the
other primitives, to finish covering the most common UI primitives needed for a
first product screen.

**Why this priority**: Lower usage frequency than Button/Input, but still
required to consider the "first slice" of the component library complete enough
to build a real screen end to end.

**Independent Test**: Can be fully tested by dropping Badge and Checkbox markup
into a blank page independently of Button/Input and verifying all four Badge
variants render with correct tokens, and the Checkbox exposes correct
`aria-checked` state and a visible focus ring.

**Acceptance Scenarios**:

1. **Given** the four Badge variants (success, error, warning, neutral),
   **When** rendered side by side, **Then** each uses its designated semantic
   token combination (e.g., success = `bg-success/5 text-success-strong
   ring-success/20`) and no other Badge uses a raw palette class.
2. **Given** a Checkbox is toggled via keyboard (Space key) while focused,
   **When** the state changes, **Then** the native checked state updates
   accordingly (correctly exposed to assistive technology without any
   redundant ARIA attribute) and the visual checked state uses the brand
   token (`text-brand`).

---

### Edge Cases

- What happens when Button or Badge label text is significantly longer than the
  component's typical width (e.g., a long status string)? Text MUST wrap or
  truncate without breaking the component's layout or overlapping neighboring
  elements.
- How does the Text Input behave when both a placeholder and an inline error are
  present simultaneously? The error message MUST remain visible and take
  precedence in communicating state to assistive technology.
- How does the Checkbox behave when disabled and checked at the same time? It
  MUST visually combine both states (`disabled:opacity-50` layered on the
  checked appearance) and remain non-interactive.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The design system MUST provide a Button component with visually
  distinct default, hover, active, focus-visible, and disabled states.
- **FR-002**: The design system MUST provide a Text Input component with
  visually distinct default, focus, error, and disabled states, including an
  error message slot positioned directly below the input.
- **FR-003**: The design system MUST provide a Badge component with exactly four
  semantic variants: success, error, warning, and neutral.
- **FR-004**: The design system MUST provide a Checkbox component with visually
  distinct unchecked, checked, focus-visible, and disabled states.
- **FR-005**: Every component MUST use only the semantic tokens defined in the
  project constitution's color table (`bg-brand`, `text-neutral-*`,
  `text-success`, `text-error`, `text-warning`, etc. — use the `-strong`
  variant, e.g. `text-error-strong`, for text rendered over a light tint
  background, per the constitution's AAA requirement) — no raw Tailwind
  palette classes (e.g., `bg-blue-600`) are permitted in shipped markup.
- **FR-006**: Every interactive component (Button, Text Input, Checkbox) MUST be
  fully operable using the keyboard alone (Tab to focus, Enter/Space to
  activate/toggle).
- **FR-007**: Every interactive component MUST expose its current state to
  assistive technology, either via an explicit ARIA attribute where no native
  equivalent exists (`aria-invalid` on the Text Input error state) or via
  correct native semantics where one does (the Checkbox's checked state via
  its native `checked` property/attribute; disabled state via the native
  `disabled` attribute on all interactive components). Redundant ARIA
  attributes duplicating already-correct native semantics MUST NOT be added.
- **FR-008**: Every text/background color combination in all four components
  MUST pass WCAG 2.2 AAA contrast.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can locate, copy, and correctly use any of the four
  primitive components (Button, Text Input, Badge, Checkbox) in a new screen in
  under 2 minutes without consulting anyone else.
- **SC-002**: 100% of interactive components (Button, Text Input, Checkbox)
  expose visually distinct hover/focus/active-or-checked/disabled states, as
  verified by manual or automated visual review.
- **SC-003**: 100% of text/background color combinations across the four
  components pass a WCAG 2.2 AAA contrast check.
- **SC-004**: Zero instances of raw/hardcoded Tailwind palette classes appear in
  the shipped markup of any of the four components, as verified by an automated
  class-name audit.

## Assumptions

- Components are delivered as static HTML + Tailwind CSS markup for this first
  slice; interactive state changes (e.g., checked/unchecked) rely on native HTML
  behavior and Tailwind pseudo-class variants rather than custom JavaScript,
  unless a future feature explicitly requires scripted behavior.
- Components target both desktop and mobile viewports using Tailwind's
  responsive utilities; no dedicated native-app variant is in scope for this
  feature.
- The color, typography, and spacing tokens ratified in the project constitution
  are the foundation for this feature's components. Three text-safe status
  tokens (`success-strong`, `error-strong`, `warning-strong`) were added to the
  constitution (now v1.3.1) during this feature's own `/speckit-analyze`
  remediation passes, to fix a pre-existing AAA-contrast gap in the ratified
  Badge/inline-error patterns — this is a correction of existing tokens'
  text-safe usage, not a new design decision introduced by this feature's
  requirements. No other new tokens are introduced.
- No specific browser support matrix was provided; the components target the
  current stable versions of evergreen browsers (Chrome, Firefox, Safari, Edge).
