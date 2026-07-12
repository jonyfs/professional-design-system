# Feature Specification: Feedback & Data Display Primitives

**Feature Branch**: `015-feedback-data-display-primitives`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "Ship the next reasonable batch of components identified as genuine gaps against a 10-major-design-system comparison (shadcn/ui, Radix UI, Material UI, Ant Design, Chakra UI, Mantine, Carbon, Polaris, Primer, Fluent 2): Spinner, Slider, Stepper, Timeline, Stat/Metric Card, DataList, AspectRatio, Indicator, File Input, PinInput"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Foundational feedback & layout primitives: Spinner, AspectRatio, Indicator, DataList (Priority: P1) 🎯 MVP

A product team needs a loading spinner distinct from the linear Progress bar, a way to embed media without layout shift, a small notification-count badge overlaid on an icon, and a way to display key-value details — today none of these exist, forcing hand-rolled, inconsistent one-off markup.

**Why this priority**: These four are the simplest, lowest-risk additions — each is either a small, self-contained visual primitive with no interactive state to get wrong (Spinner, AspectRatio, Indicator) or a straightforward compositional/semantic pattern (DataList). They deliver immediate value and de-risk the rest of the batch.

**Independent Test**: Can be fully tested by dropping each component onto a page in isolation and confirming it renders correctly, passes contrast/keyboard checks, and requires no JavaScript to function.

**Acceptance Scenarios**:

1. **Given** an action is loading, **When** the spinner is shown, **Then** it visually rotates and assistive technology announces a loading state without a competing visible label.
2. **Given** an embedded image or video, **When** it's wrapped in the aspect-ratio container, **Then** it renders at the declared ratio with zero layout shift as it loads.
3. **Given** an icon with unread notifications, **When** the indicator is applied, **Then** a small badge appears overlaid on the icon showing the count or status, visually distinct from a standalone Badge used inline in text.
4. **Given** a set of key-value details about an entity, **When** they're rendered as a data list, **Then** each label and its value are programmatically associated and visually distinguishable from each other.

---

### User Story 2 - Form & progress primitives: Slider, Stepper, File Input (Priority: P2)

A user drags a handle to pick a numeric value in a range; a user sees which step of a multi-step process they're on; a user selects a file to upload.

**Why this priority**: These build on native form-control semantics (range input, native file input) the same way Button Group did in feature 014, and Stepper is presentational-only in this slice — real value, but sequenced after the simpler primitives above.

**Independent Test**: Can be fully tested by interacting with each component's native control (dragging/keying the slider, selecting a file) and confirming the correct visual and accessible behavior, independent of any other component in this feature.

**Acceptance Scenarios**:

1. **Given** a range of values, **When** a user drags the slider's handle or uses arrow keys while it's focused, **Then** the value updates and both the visual fill and the accessible value are kept in sync.
2. **Given** a multi-step process, **When** the stepper is shown, **Then** the current step is visually and programmatically distinguishable from completed and upcoming steps.
3. **Given** a file upload requirement, **When** a user selects a file via the styled input, **Then** the selected filename is visible and the control remains fully keyboard-operable.

---

### User Story 3 - Timeline (Priority: P3)

A user reviews a chronological sequence of events (e.g. an order's status history or an account's audit log).

**Why this priority**: Timeline composes existing primitives (Avatar, List's row conventions) into a new layout pattern — real value, sequenced after the simpler/foundational work above since it's the most compositionally involved item that isn't also introducing new interaction.

**Independent Test**: Can be fully tested by rendering a sequence of events in isolation and confirming the chronological order, visual connectors, and per-event content are all correctly associated and readable by assistive technology.

**Acceptance Scenarios**:

1. **Given** a sequence of dated events, **When** the timeline is rendered, **Then** events appear in chronological order with a clear visual connection between consecutive entries and each entry's timestamp, actor, and description are all present and readable.

---

### User Story 4 - Stat/Metric Card and PinInput (Priority: P4)

A user views a dashboard's key metrics at a glance; a user enters a one-time verification code sent to their email or phone.

**Why this priority**: Stat/Metric Card is a simple composition (lowest remaining risk); PinInput is the only component in this batch needing new interaction script (paste-splitting and auto-advance between boxes), making it the highest-risk item — sequenced last once every simpler pattern in this batch is already proven.

**Independent Test**: Can be fully tested by rendering a metric card with sample data and by typing/pasting a code into the PinInput boxes and confirming focus advances correctly and the full code is assembled, independent of any other component.

**Acceptance Scenarios**:

1. **Given** a dashboard needing to highlight a key number, **When** the stat card is rendered, **Then** the metric, its label, and its optional trend indicator are all clearly legible at a glance.
2. **Given** a verification code entry, **When** a user types a digit into a box, **Then** focus automatically advances to the next box; **When** a user pastes a full code, **Then** it's distributed across all boxes correctly; **When** a user presses Backspace on an empty box, **Then** focus returns to the previous box.

---

### Edge Cases

- What happens when a Slider's track is too narrow to show a visible handle at very small viewport widths? The handle and track must remain operable and visually present at all four standard breakpoints.
- What happens when an Indicator's count exceeds a reasonable display width (e.g. 1000+ unread items)? The indicator must show a truncated form (e.g. "99+") rather than overflowing its container or wrapping.
- What happens when a Timeline has only one event, or a very long description on one event? Layout must remain coherent in both cases.
- What happens when a PinInput box receives a paste containing non-numeric characters or more characters than there are boxes? Non-matching characters must be rejected and excess characters truncated, never silently corrupting adjacent boxes.
- What happens when a Stepper's current step is the first or last in the sequence? The "previous steps" or "upcoming steps" visual treatment must degrade gracefully with zero completed or zero upcoming steps.
- What happens when a File Input has no file selected yet vs. after a file is chosen? Both states must be clearly, visually distinguishable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Spinner distinct from Progress, indicating an in-progress action with no determinate percentage, announced to assistive technology without requiring a visible text label.
- **FR-002**: System MUST provide an AspectRatio container that constrains embedded media to a declared ratio and prevents layout shift as content loads.
- **FR-003**: System MUST provide an Indicator that overlays a small count or status badge on another element, visually and semantically distinct from the existing standalone Badge component.
- **FR-004**: System MUST provide a DataList for displaying key-value pairs with each label programmatically associated with its value.
- **FR-005**: System MUST provide a Slider allowing selection of a numeric value within a range via drag or keyboard, with the current value exposed to assistive technology.
- **FR-006**: System MUST provide a Stepper visually and programmatically distinguishing the current step from completed and upcoming steps in a multi-step sequence.
- **FR-007**: System MUST provide a File Input allowing file selection, visually matching this design system's existing form-input language, remaining fully keyboard-operable.
- **FR-008**: System MUST provide a Timeline displaying a chronological sequence of events with each entry's timestamp, actor/icon, and description all present and associated.
- **FR-009**: System MUST provide a Stat/Metric Card composition displaying a prominent number, a label, and an optional trend indicator.
- **FR-010**: System MUST provide a PinInput allowing entry of a fixed-length numeric code across separate, individually focusable boxes, with automatic focus advancement on entry, correct distribution of pasted content, and Backspace-driven focus retreat on an empty box.
- **FR-011**: All ten components MUST meet this design system's existing accessibility bar (zero automated accessibility-scan violations, full keyboard operability, WCAG AAA text contrast / WCAG AA non-text contrast for every color pairing they introduce).
- **FR-012**: All ten components MUST be visually verified at this design system's four standard breakpoints and MUST NOT introduce any new client-side dependency beyond what this design system already uses.

### Key Entities

- **Spinner**: a non-interactive, continuously-animating loading indicator with no value/state beyond "currently loading."
- **AspectRatio**: a layout wrapper constraining embedded media to a fixed width/height ratio, with no value/state of its own.
- **Indicator**: a count or status value overlaid on a host element, distinct from the host element's own content.
- **DataList**: an ordered collection of label/value pairs describing a single subject (e.g. a record's status, creation date, owner, plan).
- **Slider**: a numeric value bounded by a minimum and maximum, adjustable via drag or keyboard, exposed to assistive technology as a range value.
- **Stepper**: an ordered sequence of steps, each with a status (completed, current, upcoming).
- **File Input**: a user-selected file (or absence of one), exposed via a native file-selection control and, once chosen, a displayed filename.
- **Timeline**: an ordered sequence of timestamped events, each with an actor/icon, a timestamp, and a description.
- **Stat/Metric Card**: a single named metric with a current value and an optional trend (direction and magnitude relative to a prior period).
- **PinInput**: a fixed-length sequence of single-character numeric boxes that together represent one verification code.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All ten components pass automated accessibility scans with zero violations across every interactive and static state.
- **SC-002**: All ten components are fully operable using only a keyboard, with no functionality reachable exclusively via mouse or touch.
- **SC-003**: A team composing a real page (e.g. a verification screen using PinInput + a form using Slider + File Input together) can do so using only already-shipped components, with zero one-off custom markup needed for anything covered by this feature.
- **SC-004**: Every new color/contrast pairing introduced by this feature is independently, empirically verified against the applicable WCAG threshold rather than assumed from a superficially similar existing pairing.
- **SC-005**: Adding any of these ten components to an existing page introduces zero visual regressions to any previously shipped component.

## Assumptions

- This feature ships as static HTML + Tailwind components only, in this repository's existing `src/components/<name>/` convention; a React port is explicitly deferred to a future feature, mirroring how features 011/012/014 (static) preceded their respective React port batches.
- TreeView, Rating, Menubar, ColorPicker/ColorInput, HoverCard, Date Picker/Calendar, an interactive/sortable Data Table, Carousel, Chart, Scroll Area, and Resizable panels are explicitly out of scope for this feature and are recorded as known follow-up gaps (extending, not replacing, the Known Catalog Gaps list feature 014 established) rather than silently dropped.
- File Input's drag-and-drop behavior is scoped to a static visual drop-zone treatment in this feature; whether genuine drag-and-drop JavaScript behavior is added is a judgment call to be made and explicitly documented during implementation, not assumed either way going in.
- PinInput's paste-splitting/auto-advance logic is the only genuinely new interaction script in this batch; its implementation should follow this project's existing JS module conventions (e.g. Combobox's filtering logic) rather than introducing a new idiom.
- Stepper is presentational-only in this feature (no click-to-navigate-between-steps interactivity beyond what a natural link/button per step would already provide); adding step-navigation behavior is a possible future enhancement, not part of this slice.
