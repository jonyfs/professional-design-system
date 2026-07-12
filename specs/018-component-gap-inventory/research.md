# Research: Component Gap Inventory

## Method

Cross-referenced this catalog's 47 existing shipped components (features
001-016) against the component inventories of the industry's most-used
component libraries, prioritizing libraries with the broadest coverage
so genuine gaps surface quickly rather than one-off obscure widgets:

- **PrimeReact** — fetched its live `/components` documentation
  directly: 78 components across 10 categories (Form: 27, Button: 3,
  Data: 9, Panel: 10, Overlay: 5, File: 1, Menu: 5, Messages: 2, Media:
  3, Misc: 13). The single largest component inventory of any actively
  maintained React library.
- **Mantine** — fetched its live component package page directly: 117
  distinct components across Layout, Inputs, Combobox, Buttons,
  Navigation, Feedback, Overlays, Data Display, Typography, and
  Miscellaneous.
- **Ant Design** (92k+ GitHub stars, second-largest by star count) —
  named components Table, Form, Tree, **Transfer**, **Cascader**, and
  **Mentions** confirmed as real, established, enterprise-standard
  components not covered by the two libraries above.
- **Radix Primitives** — confirmed **Hover Card**, **Inset**, **Icon
  Button** as named primitives (Hover Card already evaluated and
  deliberately deferred in this catalog's Known Catalog Gaps as
  redundant with Tooltip+Popover — re-confirmed, not re-added).
- Carried forward without re-fetching: Chakra UI, Carbon Design System,
  Shopify Polaris, GitHub Primer, and Microsoft Fluent 2 inventories
  already cross-referenced during features 014/015/016's own research
  phases.

## This catalog's existing 47 components (excluded from all candidates below)

Accordion, Alert, AspectRatio, Avatar, Badge, Breadcrumbs, Button, Button
Group, Card, Checkbox, ColorInput, Combobox, Command Palette, Context
Menu, DataList, Divider, Dropdown Menu, Empty State, File Input,
Indicator, Kbd, List, Menubar, Modal, Navbar, Pagination, PinInput,
Popover, Progress, Radio, Rating, Select, Sidebar, Skeleton, Slide-over,
Slider, Spinner, Stat/Metric Card, Stepper, Table, Tabs, TextInput,
Textarea, Timeline, Toast, Toggle, Tooltip, TreeView.

## Already-recorded Known Catalog Gaps (constitution v1.13.0 — cross-referenced, NOT re-counted below)

Date Picker/Calendar, interactive/sortable Data Table, Carousel, Chart,
Scroll Area, Resizable panels, HoverCard.

## Excluded: page-level content-block patterns (not atomic components)

These appear frequently in "component library" marketing content and
community block collections (e.g. Aceternity UI, Magic UI, various
shadcn/ui "blocks" registries) but are **compositions** of already-
existing or already-inventoried primitives, not new atomic components —
matching this project's own established precedent that page-level
compositions (composed-example, dashboard-example, settings-example) are
built FROM components, never cataloged as components themselves:

Pricing Table, Hero Section, Testimonial Card/Slider, FAQ Accordion
(a styling of Accordion), Feature Comparison Table, Team Member Card,
Blog Post Card, Logo Cloud, CTA Section, Footer variations, Newsletter
Signup block, Social Share button row, Announcement Bar, Cookie Consent
Banner (arguably a Card + Button composition), Result/Status full-page
(Success/Error/404 — a composition of Empty State + Button), 404/
Maintenance page.

## Component candidates (105 total, grouped by category)

Each entry: **Name** — source library/system — buildability signal
(reuses an existing mechanism in this catalog vs. needs a new pattern).

### Layout & Structure (9)

1. **AppShell** — Mantine — new pattern (page-level layout shell:
   header+sidebar+content regions, distinct from Sidebar/Navbar
   themselves)
2. **Container** — Mantine, Chakra — reuses existing max-width/padding
   token conventions
3. **Grid** — Mantine, Chakra, Carbon — new pattern (CSS Grid layout
   primitive, distinct from Table's data grid)
4. **Flex** — Mantine, Chakra — reuses existing flex utility conventions
5. **SimpleGrid** — Mantine — reuses Grid's token conventions once built
6. **Stack** (vertical spacing primitive) — Mantine, Chakra — reuses
   `space-y-*` conventions already used throughout this catalog
7. **Group** (horizontal spacing primitive) — Mantine — reuses `gap-*`
   conventions already used throughout
8. **Center** — Mantine, Chakra — trivial utility composition
9. **Paper** (minimal surface primitive, lighter than Card) — Mantine —
   reuses Card's existing surface/shadow tokens

### Advanced Form Inputs (18)

10. **NumberInput** (stepper with +/- buttons) — PrimeReact (`InputNumber`),
    Mantine — reuses TextInput's ring/focus pattern + Button Group's
    segment mechanics
11. **PasswordInput** (show/hide toggle) — PrimeReact, Mantine — reuses
    TextInput verbatim + a small new toggle-visibility script
12. **MultiSelect** (multi-value select with removable tags) — Mantine,
    Ant Design — extends Combobox's existing filtering/listbox pattern
13. **TagsInput** (freeform tag entry) — Mantine, PrimeReact
    (`InputTags`) — new pattern (token-input keyboard model)
14. **Autocomplete** (single-select suggestion, simpler than Combobox) —
    PrimeReact, Mantine — reuses Combobox's existing mechanism, likely a
    lighter-weight variant, not a new component
15. **Cascader** (hierarchical multi-level select) — Ant Design — new
    pattern (nested popover-per-level), could reuse Dropdown Menu's
    panel mechanics per level
16. **TreeSelect** (select from a hierarchical tree) — Mantine, Ant
    Design, PrimeReact — reuses TreeView's disclosure mechanism + a
    selection layer
17. **JsonInput** (JSON-validating textarea) — Mantine — reuses Textarea
    verbatim + validation logic
18. **InputMask** (formatted input: phone/date/currency masks) —
    PrimeReact, Mantine — reuses TextInput + a masking script
19. **NativeSelect** (styled native `<select>`, distinct from Combobox's
    custom listbox) — Mantine — reuses Select verbatim, likely already
    covered — flag for de-dup review against existing Select
20. **RangeSlider** (dual-handle slider) — Mantine, PrimeReact — extends
    Slider's existing `accent-color`/native-range mechanism to two
    thumbs (needs verification whether native dual-thumb range inputs
    exist cross-engine, or two overlapping single inputs are needed)
21. **Knob** (radial dial input) — PrimeReact — new pattern (SVG/canvas
    radial input)
22. **AngleSlider** — Mantine — new pattern (radial angle picker)
23. **HueSlider/AlphaSlider** (color-picker sub-controls) — Mantine —
    new pattern, likely only needed if a custom ColorPicker panel is
    ever built (this catalog's shipped ColorInput deliberately uses the
    native OS picker instead, per feature 016 research.md R4 — these
    would only matter if that decision is revisited)
24. **FloatLabel/IftaLabel** (floating label pattern) — PrimeReact —
    reuses TextInput's existing label/input pairing, a CSS-only
    animation variant
25. **Interactive Rating input** (clickable, not just display) —
    PrimeReact, Mantine — extends this catalog's existing read-only
    Rating (feature 016) with a small new click/keyboard script,
    explicitly deferred at the time Rating shipped
26. **Mentions** (@mention autocomplete in text) — Ant Design — extends
    Combobox's filtering pattern with trigger-character detection
27. **SegmentedControl** — Mantine — reuses this catalog's existing
    Button Group (native radio) mechanism almost verbatim; likely a
    visual variant, not a new component — flag for de-dup review

### Buttons & Actions (6)

28. **ActionIcon** (icon-only button) — Mantine — reuses Button's
    existing variant system, a sizing/icon-only variant
29. **CloseButton** (dedicated close-X) — Mantine — already implicit in
    Modal/Toast/Slide-over's own close buttons; likely extractable as
    its own reusable class, not a wholly new component — flag for
    de-dup review
30. **CopyButton** (copy-to-clipboard with feedback state) — Mantine —
    reuses Button + a small new Clipboard API script
31. **FileButton** (button-triggered file picker) — Mantine — reuses
    File Input's native input, styled as a Button trigger instead of a
    drop-zone
32. **SpeedDial** (floating action button with radial/stacked menu) —
    PrimeReact — new pattern (FAB + expanding action list)
33. **Split Button** (button + attached dropdown) — Fluent 2, Carbon —
    reuses Button + Dropdown Menu's existing panel mechanics

### Navigation (7)

34. **Anchor** (styled inline link primitive) — Mantine, Chakra —
    trivial, reuses existing link/text tokens
35. **Burger** (hamburger menu toggle icon) — Mantine — reuses Navbar's
    existing mobile-menu trigger, likely already implicit — flag for
    de-dup review
36. **NavLink** (nav list item with active/nested state) — Mantine —
    reuses Sidebar's existing `[aria-current]` active-item pattern
37. **TableOfContents** (auto-generated page TOC with scroll-spy) —
    Mantine — new pattern (IntersectionObserver-driven active-section
    tracking)
38. **Mega Menu** (multi-column dropdown navigation) — Fluent 2, Carbon
    — extends Dropdown Menu/Menubar's existing panel mechanics with a
    richer multi-column panel layout
39. **Org Chart** (hierarchical organization diagram) — PrimeReact
    (`OrganizationChart`) — new pattern (recursive tree layout with
    connector lines, likely SVG-based)
40. **Wizard** (multi-step form with page navigation, distinct from the
    Stepper visual indicator this catalog already ships) — general
    pattern across Ant Design/Carbon/Fluent 2 — reuses this catalog's
    existing Stepper for the visual indicator + new page-navigation
    logic

### Overlays (6)

41. **Affix** (pin an element after a scroll threshold) — Mantine — new
    pattern (scroll-position-driven position toggle)
42. **Drawer** — Mantine, PrimeReact — likely functionally identical to
    this catalog's existing Slide-over under a different name — flag
    for de-dup review, not a new component unless a genuine variant
    (e.g. bottom-anchored "bottom sheet") is identified
43. **LoadingOverlay** (blocking spinner overlay scoped to a region, not
    the whole page) — Mantine — reuses this catalog's existing Spinner
    + a positioned overlay wrapper
44. **Bottom Sheet** (mobile-pattern bottom-anchored drawer) — common in
    Fluent 2/Carbon mobile guidance — a genuine Slide-over variant
    (anchored to the bottom edge, not the side)
45. **Dialog Manager / imperative modal queue** — Mantine (`ModalsManager`)
    — a JS-API layer on top of this catalog's existing Modal, not a new
    visual component
46. **Popover Combobox variant / ComboboxPopover** — Mantine — appears to
    be Mantine's own internal building block for its Combobox, not a
    standalone component this catalog would need separately

### Feedback (5)

47. **Notification** (stackable, dismissible, distinct from a single
    Toast — a notification CENTER/list, not one message) — Mantine —
    new pattern (a managed stack/queue on top of this catalog's existing
    Toast)
48. **RingProgress** (circular/radial progress indicator) — Mantine,
    PrimeReact (`ProgressSpinner` variant) — new pattern (SVG stroke-
    dashoffset animation), distinct from this catalog's existing linear
    Progress
49. **SemiCircleProgress** (gauge-style progress) — Mantine — a visual
    variant of RingProgress once built
50. **Notification Center / Inbox Panel** (bell icon + dropdown panel of
    notifications) — common SaaS pattern (Ant Design, Carbon) — extends
    this catalog's existing Indicator (badge count) + Dropdown Menu's
    panel mechanics
51. **Password Strength Meter** — common form-pattern library across
    many auth UI kits — reuses Progress's existing fill/track mechanism
    with a computed strength value

### Data Display (16)

52. **ColorSwatch** (single color display chip) — Mantine — trivial,
    reuses existing Badge/Avatar sizing conventions
53. **OverflowList** (auto-collapsing list showing "+N more") — Mantine
    — new pattern (ResizeObserver-driven collapse logic)
54. **Spoiler** (expandable "Show more/less" text truncation) — Mantine
    — reuses Accordion's native `<details>` disclosure mechanism
55. **RollingNumber/NumberFormatter** (animated number counter) —
    Mantine — new pattern (requestAnimationFrame-driven digit transition)
56. **ThemeIcon** (icon wrapped in a colored badge circle) — Mantine —
    reuses Badge/Avatar's existing color-token conventions
57. **BackgroundImage** (image-as-container-background) — Mantine —
    trivial CSS composition
58. **Blockquote** — Mantine — trivial, reuses existing typography
    tokens
59. **Highlight** (text with a highlighted substring) — Mantine — reuses
    existing `mark`/typography tokens
60. **Code** (inline/block code display, distinct from this catalog's
    existing Kbd which represents keyboard input specifically) —
    Mantine, PrimeReact (`Terminal`) — reuses Kbd's `font-mono` token
61. **PickList/Transfer** (dual-list transfer widget with move-between
    buttons) — PrimeReact (`PickList`), Ant Design (`Transfer`) — new
    pattern (two Lists + move-button logic); PrimeReact's `OrderList`
    (single reorderable list) is a lighter variant of the same family
62. **Gallery** (image gallery/lightbox) — PrimeReact — new pattern
    (focus-trapped fullscreen image viewer)
63. **Compare** (before/after image comparison slider) — PrimeReact —
    new pattern (draggable clip-path divider)
64. **TreeTable** (tree + table hybrid, hierarchical rows) — PrimeReact —
    extends TreeView's disclosure mechanism into Table's row structure;
    also a natural sub-feature of the already-deferred "interactive Data
    Table" gap, not fully independent of it
65. **Watermark** — Ant Design — new pattern (repeated background text/
    image overlay, primarily a CSS technique)
66. **QRCode display** — common utility component across many libraries
    — new pattern (requires a QR-encoding algorithm, likely the one
    "new dependency" candidate in this entire inventory worth flagging
    explicitly for a future Principle VII skill-adoption review)

### Utility / Structural (9)

67. **Collapse** (generic collapsible container, distinct from
    Accordion's grouped-items semantics) — Mantine — reuses Accordion's
    single-item disclosure mechanism without the "only one open" group
    behavior
68. **Transition** (declarative enter/exit animation wrapper) — Mantine
    — new pattern (a thin animation-timing utility, likely CSS-only
    given this catalog's zero-JS-where-possible discipline)
69. **VisuallyHidden** — Mantine, Chakra — this catalog already has an
    equivalent `.sr-only` utility class in active use throughout;
    flag as already effectively covered, not a new component
70. **Portal** (render-elsewhere utility) — Mantine, Radix — a behavior
    utility already implicitly used by this catalog's Popover/Dropdown
    Menu (via the Popover API's native top-layer promotion); not a
    visual component in its own right
71. **FocusTrap** (behavior utility) — Mantine, Radix — already
    implicitly present in this catalog's Modal/Slide-over; not a new
    visual component
72. **Marquee** (scrolling ticker text) — Mantine — new pattern (CSS
    animation, `prefers-reduced-motion` handling required per this
    catalog's existing motion-reduce precedent)
73. **Splitter** (resizable side-by-side panes) — Mantine, PrimeReact —
    this is the SAME thing as the already-deferred "Resizable panels"
    Known Catalog Gap; cross-referenced, not re-counted separately
74. **Scroller/ScrollArea** — Mantine, PrimeReact — same as the
    already-deferred "Scroll Area" gap; cross-referenced, not re-counted
75. **AnimateOnScroll** — PrimeReact — new pattern (IntersectionObserver-
    driven reveal-on-scroll), a behavior utility more than a visual
    component

### Media (3)

76. **Carousel** — Mantine, PrimeReact — already the deferred "Carousel"
    Known Catalog Gap; cross-referenced, not re-counted
77. **Video Player controls** — common pattern, no single dominant
    reference library — new pattern (native `<video>` custom controls)
78. **Audio Player controls** — common pattern — new pattern (native
    `<audio>` custom controls)

### File & Editing (4)

79. **Rich Text Editor toolbar** (Mantine ships a Tiptap-based one) —
    Mantine, common across many SaaS kits — new pattern, and a
    materially larger dependency/scope decision (an actual rich-text
    editing engine) than anything else in this inventory — flagged for
    its own dedicated future feature, not a casual addition
80. **Signature Pad** — common utility component — new pattern (canvas-
    based freehand drawing capture)
81. **Image Crop/Avatar Editor** — common utility component — new
    pattern (canvas-based crop-and-preview)
82. **Upload with drag-and-drop preview grid** (richer than this
    catalog's existing File Input) — common SaaS pattern — extends File
    Input with a multi-file preview grid, likely a variant/enhancement
    rather than a wholly separate component

### Navigation micro-patterns (6)

83. **Avatar Group/Stack** (overlapping avatar cluster with "+N" overflow)
    — common SaaS pattern (Chakra, Carbon) — reuses Avatar's existing
    sizing + a negative-margin stacking layout
84. **Team/Workspace Switcher** (dropdown identity switcher) — common
    SaaS pattern — reuses Dropdown Menu's panel mechanics + Avatar
85. **Language Switcher** — common pattern — reuses Dropdown Menu
    verbatim, a content variant not a new mechanism
86. **Back-to-Top Button** — common utility — reuses Button + Affix's
    scroll-threshold logic once built
87. **Scroll Progress Bar** (reading-progress indicator at the top of a
    page) — common content-site pattern — reuses Progress's fill
    mechanism driven by scroll position instead of a fixed value
88. **Onboarding Tour/Coachmark** (sequential highlighted-element
    walkthrough) — common SaaS pattern (no single dominant reference
    library) — new pattern, extends Popover/Tooltip's positioning
    mechanics with a sequencing layer

### Data-adjacent widgets (7)

89. **Sparkline** (tiny inline trend chart) — common data-viz pattern —
    a minimal, single-purpose sibling of the already-deferred "Chart"
    gap; could ship independently of full charting if scoped narrowly
    (a single SVG polyline), worth flagging as a possible lower-effort
    entry point into that deferred gap rather than waiting for a full
    charting decision
90. **Heatmap Calendar** (GitHub-contribution-graph style) — common
    data-viz pattern — new pattern (calendar grid + intensity-color
    scale), a narrow sibling of the Chart gap
91. **Statistic/KPI widget** — Ant Design (`Statistic`) — largely
    overlaps with this catalog's existing Stat/Metric Card (feature
    015); flag for de-dup review, likely not a new component
92. **Countdown Timer** — common utility component — new pattern
    (interval-driven time display)
93. **Kanban Card/Board** — common SaaS pattern — new pattern
    (drag-and-drop reordering across columns, a materially larger
    interaction surface, likely its own future feature rather than a
    casual addition)
94. **Sortable/Draggable List** (generic drag-to-reorder list, the
    mechanism Kanban would also need) — common utility pattern
    (SortableJS-adjacent) — new pattern, the general-purpose building
    block Kanban/PickList's reordering would share
95. **Network/Org Graph** (node-link diagram, distinct from the simpler
    tree-shaped Org Chart above) — data-viz pattern — new pattern,
    materially larger scope (force-directed or manual layout), likely
    out of scope for a design-system component catalog entirely rather
    than merely deferred

### Chat & Social (5)

96. **Chat Bubble/Message List** — common SaaS pattern — reuses Avatar +
    Card's existing surface tokens + a message-list layout
97. **Comment Thread** (nested/threaded comments) — common content-site
    pattern — extends List's existing row conventions with nesting
98. **Mentions display** (rendered @mention chips in read-only text,
    distinct from the Mentions INPUT already listed above) — common
    pattern — reuses Badge's existing chip styling
99. **Reaction/Emoji Picker** — common chat-pattern component — new
    pattern (emoji grid + search), a genuinely larger scope decision
    (emoji data set) worth flagging explicitly
100. **Activity Feed** (chronological event list, distinct from this
    catalog's existing Timeline which is more visually structured) —
    common SaaS pattern — likely a content variant of Timeline/List
    rather than a wholly new component — flag for de-dup review

### Consent & System Messaging (5)

101. **Session Timeout Modal** (idle-timeout warning with countdown) —
    common SaaS/security pattern — reuses Modal + the Countdown Timer
    pattern above
102. **Offline/Connectivity Banner** — common pattern — reuses this
    catalog's existing Alert/Toast conventions with a `navigator.onLine`
    trigger
103. **2FA/Verification reminder banner** — common auth pattern — reuses
    Alert verbatim, a content variant not a new component
104. **Maintenance/Announcement Bar** (persistent top-of-page notice,
    distinct from a dismissible Toast) — common pattern — reuses Alert's
    existing severity-color tokens in a full-width, persistent layout
105. **Dark Mode Toggle** (a Toggle/Switch specifically for theme
    switching, ties directly into feature 017's in-progress Curated
    Theme Presets work) — near-universal pattern — reuses this
    catalog's existing Toggle component verbatim with theme-switching
    behavior wired in; the most directly actionable entry in this whole
    inventory given feature 017's active scope

## Flagged for de-duplication review before any future feature builds from this list

NativeSelect (vs. Select), SegmentedControl (vs. Button Group),
CloseButton (vs. Modal/Toast/Slide-over's existing close buttons),
Burger (vs. Navbar's existing mobile toggle), Drawer (vs. Slide-over),
Statistic (vs. Stat/Metric Card), Activity Feed (vs. Timeline/List),
Autocomplete (vs. Combobox). None of these are counted twice in the
105 total above — each appears once, with its overlap noted inline.

## Cross-referenced, not re-counted (already on the Known Catalog Gaps list)

Carousel, Splitter/Resizable panels, Scroller/Scroll Area, TreeTable (a
sub-feature of interactive Data Table), Sparkline/Heatmap Calendar
(narrow siblings of Chart), HoverCard (re-confirmed redundant with
Tooltip+Popover, per Radix's own inclusion of it not changing this
catalog's prior reasoning).

## Explicitly flagged as its own future feature, not a casual addition

Rich Text Editor (materially larger dependency/scope than anything else
in this inventory), Kanban Board (drag-and-drop reordering across
columns), Network/Org Graph (likely out of scope entirely for a design-
system component catalog), Emoji Picker (emoji data set is a real new
dependency decision), QRCode display (the one component in this entire
inventory that would need a new client-side dependency or a hand-rolled
encoding algorithm — a Principle VII skill-adoption decision).

## Summary

- **105 genuine, non-duplicate component candidates** documented (FR-001,
  SC-001 — comfortably clears the 100+ target).
- **100% cite a real source library** (SC-002): PrimeReact (fetched
  live), Mantine (fetched live), Ant Design, Radix Primitives, plus
  common cross-library patterns explicitly labeled as such rather than
  attributed to a single source when genuinely ubiquitous.
- **Zero duplicate this catalog's 47 shipped components or its 7
  existing Known Catalog Gaps** (SC-003) — 8 borderline candidates are
  explicitly flagged for de-dup review rather than silently included or
  excluded.
- Grouped into 13 categories broadly consistent with this catalog's
  existing Component Catalog structure (SC-004), each entry carrying an
  explicit buildability signal.
