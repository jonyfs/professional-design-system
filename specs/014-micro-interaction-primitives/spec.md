# Feature Specification: Micro-Interaction & Utility Primitives

**Feature Branch**: `014-micro-interaction-primitives`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "Ship the largest reasonable batch of components identified as genuine gaps against shadcn/ui and Radix UI Primitives: Tooltip, Textarea, Popover, Progress bar, Divider/Separator, Button Group, Skeleton loader, Context Menu, Empty state, Kbd"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Foundational static primitives: Textarea, Divider, Kbd, Skeleton (Priority: P1) 🎯 MVP

A product team building a real page with this design system needs a multi-line text field, a visual section break, a way to display a keyboard shortcut, and a loading placeholder — today none of these exist as shipped components, forcing hand-rolled, inconsistent one-off markup every time they're needed.

**Why this priority**: These four are the simplest, lowest-risk additions — each is either a documented-but-never-built gap (Textarea) or a near-zero-JavaScript static primitive with no open/close state to get wrong. They deliver immediate, low-risk value and de-risk the rest of the feature.

**Independent Test**: Can be fully tested by dropping each component onto a page in isolation and confirming it renders correctly, passes contrast/keyboard checks, and requires no JavaScript to function.

**Acceptance Scenarios**:

1. **Given** a form needing multi-line input, **When** a user types beyond the visible area, **Then** the field grows vertically (never horizontally) and remains keyboard-navigable and screen-reader labeled exactly like the existing single-line text input.
2. **Given** a page needing a visual section break, **When** the divider is placed inside a vertical layout, **Then** it renders as a full-width horizontal rule; **When** placed inside a horizontal layout (e.g. a toolbar), **Then** a vertical variant is available that doesn't force a line break.
3. **Given** a keyboard shortcut needs to be displayed to a user, **When** the Kbd element is rendered inline with other text, **Then** it visually reads as a physical key without disrupting the surrounding text's line height.
4. **Given** content that hasn't finished loading, **When** a skeleton placeholder is shown in its place, **Then** it visually matches the size/shape of the real content it stands in for (so no layout shift occurs once real content arrives) and animates gently to signal "loading" rather than "broken."

---

### User Story 2 - Interactive feedback primitives: Tooltip, Progress, Button Group, Empty State (Priority: P2)

A user hovers over an icon-only control and needs to know what it does; a user watches a long-running action's completion percentage; a user picks between mutually exclusive view modes presented as a single connected control; a user encounters a screen with no data yet and needs to understand what to do next.

**Why this priority**: These add real interactive/visual feedback value but build directly on already-proven mechanisms (existing button styles, existing contrast-verification discipline) rather than introducing new state machines, so they're next in risk order after the P1 batch.

**Independent Test**: Can be fully tested by triggering each component's state independently (hovering/focusing a tooltip trigger, setting a progress value, selecting a button-group segment, rendering an empty-state composition) and confirming the correct visual and accessible behavior.

**Acceptance Scenarios**:

1. **Given** an icon-only control with no visible label, **When** a sighted mouse user hovers it, **Then** a short text label appears near it after a brief delay; **When** a keyboard user tabs to the same control, **Then** the identical label appears without requiring a mouse.
2. **Given** a task that is 60% complete, **When** the progress indicator is rendered, **Then** its fill visually represents 60% of the track and assistive technology announces the current, minimum, and maximum values.
3. **Given** 3 mutually exclusive view options, **When** they're rendered as a button group, **Then** they visually read as one connected control (not 3 separate buttons) and the currently active option is visually and programmatically distinguishable from the inactive ones.
4. **Given** a list or table with zero items, **When** the empty state is shown, **Then** the user sees a clear explanation of why there's nothing there and, where applicable, a single clear next action.

---

### User Story 3 - Popover (Priority: P3)

A user clicks a control that needs to reveal a small panel of free-form content (not a fixed menu of actions, and not a single-purpose search field) — for example, a "share" button that reveals a link-copy field and permission toggles.

**Why this priority**: Popover is click-triggered, interactive, and requires the same floating-panel positioning machinery already proven for Dropdown Menu and Combobox — real value, but sequenced after the simpler/no-new-mechanism work above.

**Independent Test**: Can be fully tested by clicking the popover's trigger and confirming a correctly positioned, keyboard-dismissable panel appears with the expected content, independent of any other component.

**Acceptance Scenarios**:

1. **Given** a popover trigger button, **When** a user clicks it, **Then** a panel of custom content appears anchored near the trigger, and clicking outside the panel or pressing Escape closes it.
2. **Given** an open popover near the edge of the viewport, **When** it's rendered, **Then** it stays fully visible on-screen rather than being clipped or overflowing.

---

### User Story 4 - Context Menu (Priority: P4)

A user right-clicks an item (e.g. a file row, a table row) and expects a menu of actions relevant to that specific item to appear at their cursor.

**Why this priority**: Context Menu reuses most of Dropdown Menu's mechanism but requires a genuine, documented divergence (cursor-position anchoring instead of element anchoring), making it the highest-risk/most-novel item in this batch — sequenced last.

**Independent Test**: Can be fully tested by right-clicking a designated element and confirming a correctly positioned action menu appears at the cursor, is fully keyboard-navigable once open, and never renders partially off-screen.

**Acceptance Scenarios**:

1. **Given** an element with a context menu attached, **When** a user right-clicks it, **Then** the browser's native context menu is suppressed and this component's menu appears at the cursor position instead.
2. **Given** a right-click near the edge of the viewport, **When** the menu would otherwise render off-screen, **Then** its position is adjusted so it remains fully visible.
3. **Given** an open context menu, **When** a user presses arrow keys, **Then** focus moves between menu items the same way it does in the existing Dropdown Menu component.

---

### Edge Cases

- What happens when a Tooltip's trigger is disabled? The label must still be reachable/visible for sighted-hover users hovering the disabled control's wrapper, since a disabled native element does not reliably fire hover/focus events across browsers.
- What happens when a Progress bar has no known end (an indeterminate/in-progress state with no percentage)? The component must support an indeterminate visual state distinct from a stalled 0%.
- What happens when a Button Group's active segment changes via keyboard navigation rather than a click? The active-state indicator and any `aria-pressed`/`aria-current` attribute must update identically regardless of input method.
- What happens when a Context Menu is triggered so close to the viewport's edge that even a repositioned menu can't fully fit? The menu must still render fully on-screen by flipping to the opposite side of the cursor, never truncating itself.
- What happens when a Popover's trigger is removed from the page while the popover is open (e.g. the row it belongs to is deleted)? The popover must close rather than becoming an orphaned floating panel.
- What happens when Skeleton placeholders are shown to a user with reduced-motion preferences enabled? The pulsing animation must be muted or removed per this system's existing reduced-motion handling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a multi-line text input (Textarea) that visually and behaviorally matches the existing single-line text input's label, error, and disabled treatment, differing only in supporting multiple lines and vertical-only resizing.
- **FR-002**: System MUST provide a Divider/Separator: a semantic thematic-break variant (horizontal only — no semantic HTML element for a vertical thematic break exists) and a non-semantic visual-separator variant for use inside flex/grid layouts, available in both horizontal and vertical orientations.
- **FR-003**: System MUST provide a Kbd element for displaying keyboard shortcuts inline with surrounding text.
- **FR-004**: System MUST provide a Skeleton loading placeholder in at least three shape presets (text line, circular avatar-sized, and card-block-sized) that match the dimensions of the real content they stand in for.
- **FR-005**: System MUST provide a Tooltip that appears on both mouse hover and keyboard focus of its trigger, and disappears when the trigger is no longer hovered or focused.
- **FR-006**: System MUST provide a Progress indicator that visually represents a completion percentage and exposes that percentage to assistive technology.
- **FR-007**: System MUST provide a Button Group / Segmented Control that visually unifies 2 or more related, mutually exclusive options into a single connected control with a clearly distinguishable active option.
- **FR-008**: System MUST provide an Empty State composition pattern communicating an explanation and, where applicable, a single clear next action, for surfaces with no data to display.
- **FR-009**: System MUST provide a Popover that reveals arbitrary content next to a trigger on click, dismissible via an outside click or the Escape key, and repositioned automatically to remain fully visible within the viewport.
- **FR-010**: System MUST provide a Context Menu that replaces the browser's native right-click menu on designated elements, appears at the cursor's position, remains fully keyboard-navigable once open, and repositions itself to stay fully on-screen when triggered near a viewport edge.
- **FR-011**: All ten components MUST meet this design system's existing accessibility bar (zero automated accessibility-scan violations, full keyboard operability, WCAG AAA text contrast / WCAG AA non-text contrast for every color pairing they introduce).
- **FR-012**: All ten components MUST be visually verified at this design system's four standard breakpoints and MUST NOT introduce any new client-side dependency beyond what this design system already uses.

### Key Entities

- **Tooltip**: a short, non-interactive text label associated with exactly one trigger element; has a visible/hidden state driven by hover or focus of its trigger, never by click.
- **Popover**: a panel of arbitrary content associated with exactly one trigger button; has an open/closed state driven by click, dismissible via outside interaction or Escape.
- **Context Menu**: a list of action items associated with exactly one designated element (the same 1:1 trigger-to-menu relationship Dropdown Menu already uses — a single shared menu serving multiple distinct elements, e.g. every row in a list, is out of scope for this feature); has an open/closed state driven by a right-click (or equivalent long-press) at a specific cursor position, dismissible via outside interaction, Escape, item selection, or Tab.
- **Progress**: a completion value between a minimum and maximum bound (or an indeterminate state with no known bound), rendered as a visual fill proportion.
- **Button Group**: an ordered set of 2+ mutually-related options, at most one of which is "active" at a time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All ten components pass automated accessibility scans with zero violations across both interactive and static states.
- **SC-002**: All ten components are fully operable using only a keyboard, with no functionality reachable exclusively via mouse.
- **SC-003**: A team composing a real page (e.g. a settings screen using Textarea + Divider + Button Group + Tooltip together) can do so using only already-shipped components, with zero one-off custom markup needed for anything covered by this feature.
- **SC-004**: Every new color/contrast pairing introduced by this feature is independently, empirically verified against the applicable WCAG threshold (AAA for text, AA/1.4.11 for non-text) rather than assumed from a superficially similar existing pairing.
- **SC-005**: Adding any of these ten components to an existing page introduces zero visual regressions to any previously shipped component.

## Assumptions

- This feature ships as static HTML + Tailwind components only, in this repository's existing `src/components/<name>/` convention; a React port is explicitly deferred to a future feature, mirroring how features 011/012 (static) preceded feature 013 (React port).
- Date Picker/Calendar, an interactive/sortable Data Table, Carousel, Chart, Scroll Area, and Resizable panels are explicitly out of scope for this feature — each requires a substantially new interaction pattern with no existing mechanism to reuse, and are recorded as a known follow-up gap rather than silently dropped, matching this project's established practice of recording deferred gaps (e.g. Table was recorded this way before feature 012 built it).
- Tooltip, Popover, and Context Menu are distinct components with different trigger semantics (hover/focus, click, right-click respectively) rather than one configurable component, since conflating them would blur genuinely different accessibility contracts (a tooltip must never contain interactive content; a popover and context menu must).
- Empty State may end up documented purely as a compositional guideline (reusing already-shipped Card/Button/typography classes) rather than shipping any new CSS class, if implementation confirms no new class is actually needed — this will be confirmed, not assumed, during implementation.
- Kbd's exact visual treatment (border/background/shadow) follows the same token-reuse discipline as every other component in this catalog; if this design system's existing token set has no monospace font option, the minimal token addition needed is treated as part of this feature's scope, not a separate feature.
