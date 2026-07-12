<!--
SYNC IMPACT REPORT (v1.12.0 — see below for the v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.11.0 → 1.12.0
Modified principles: None
Added sections:
  - Component Catalog → Application & Navigation → Stepper/Steps
  - Component Catalog → Forms, Validation & Inputs → Slider (Range),
    File Input/Upload
  - Component Catalog → Data Display & Listings → AspectRatio,
    Indicator, DataList, Timeline, Stat/Metric Card
  - Component Catalog → Overlays, Modals & Feedback → Spinner/Loader
  - Component Catalog → Advanced Forms & Interaction → PinInput/OTP
  - Component Catalog → Known Catalog Gaps → extended (not replaced)
    with TreeView, Rating, Menubar, ColorPicker/ColorInput, HoverCard
    (feature 015's research phase, a 10-major-design-system comparison)
Corrected sections: None — no prior entry needed correction.
Rationale: feature 015 (Feedback & Data Display Primitives) shipped ten
components closing genuine gaps found via a 10-major-design-system
comparison (shadcn/ui, Radix UI, MUI, Ant Design, Chakra UI, Mantine,
Carbon, Polaris, Primer, Fluent 2) — each reuses an already-ratified
mechanism (Progress's fill/track pairing for Slider, Pagination's
active-item pairing for Stepper, Avatar's sizing for Spinner/Timeline,
Badge's `-strong` tokens for Indicator, TextInput's focus ring for
PinInput) rather than inventing a new one. This is a MINOR bump (new
catalog guidance, ten new components, zero new design tokens), matching
the precedent of v1.11.0's own feature-014 addition.
Two real defects were found and fixed during this feature, both now
documented directly in the affected catalog entries above: (1)
Indicator's initial draft assumed Badge's severity tokens transferred
directly to a solid-fill badge, but the base status colors fail even AA
4.5:1 with white text (2.54:1–4.83:1) — fixed with the `-strong`
variants as solid fills instead (7.68:1–10.31:1, all AAA). (2) File
Input's helper text used `text-neutral-500` (4.83:1, clears AA but fails
this catalog's AAA 7:1 floor) — `neutral-500` is ratified only for
icon-fill/non-text use in this catalog, never body text; fixed with
`text-neutral-600`. A third, non-visual defect was also caught and fixed
during implementation: File Input's native `<input>` had to be
reordered to be first in the DOM (not last) for its mandated
focus-visible rule to be matchable at all by the `~` sibling combinator,
and its icon/text content wrapped in one `.file-drop-zone-content` div
so the focus-visible/disabled rules produce one cohesive visual change
instead of one per child element.
Templates requiring updates: ✅ none — no principle or template-level
change, only Component Catalog content.
-->

<!--
SYNC IMPACT REPORT (v1.11.0 — see below for the v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.10.0 → 1.11.0
Modified principles: None
Added sections:
  - Component Catalog → Forms, Validation & Inputs → Textarea, Button
    Group / Segmented Control
  - Component Catalog → Data Display & Listings → Divider/Separator,
    Kbd, Skeleton, Empty State
  - Component Catalog → Overlays, Modals & Feedback → Tooltip, Progress
  - Component Catalog → Navigation & Disclosure → Popover, Context Menu
  - Component Catalog → NEW "Known Catalog Gaps" subsection (Date
    Picker/Calendar, interactive Data Table, Carousel, Chart, Scroll
    Area, Resizable panels — deliberately deferred, not silently dropped)
  - Design Foundations → Typography & Text Scale → `font-mono` token
    (this catalog's first ratified monospace stack)
Corrected sections:
  - Component Catalog → Navigation & Disclosure → Command Palette: noted
    its ⌘K/Ctrl+K markup now uses the shared `.kbd` class instead of
    duplicating the same utility string inline (feature 014).
Rationale: feature 014 (Micro-Interaction & Utility Primitives) shipped
ten components closing genuine gaps found via a shadcn/ui + Radix UI
Primitives comparison — each extends an already-ratified mechanism
(Accordion's native exclusivity for Button Group, Dropdown Menu's
Popover-API/Anchor-Positioning wiring for Popover/Context Menu, Avatar/
Card's sizing for Skeleton) rather than inventing a new one. This is a
MINOR bump (new catalog guidance + one new token), matching the
precedent of v1.9.0's own Lists addition.
Two genuine, previously-undiscovered bugs were found and fixed during
this feature, both now documented directly in the affected catalog
entries above so future components don't repeat them: (1) this
project's CSP (`style-src 'self'`, no `unsafe-inline`) silently blocks
inline `style="..."` HTML attributes — affected both Tooltip's
`anchor-name`/`position-anchor` and Progress's fill width, caught only
by inspecting computed style values and browser console output, since
no test asserting ARIA attributes or opacity alone would have surfaced
it; fixed via pre-declared numbered CSS classes (Tooltip, preserves
zero-JS) and direct CSSOM property assignment via a small script
(Progress, since percentage is a continuous value space unlike
Tooltip's small set of anchor pairings). (2) `scripts/audit-tokens.mjs`
had a real bug of its own: its code comment claimed to support
directional radius utilities like `rounded-t-lg`, but the allowlist
check never actually stripped the directional infix before validating —
found while building Button Group's `first:rounded-l-md`/
`last:rounded-r-md` segment corners, now fixed to correctly parse
side/corner infixes before checking the base radius allowlist.
Templates requiring updates: ✅ none — no principle or template-level
change, only Component Catalog and Design Foundations content.
-->

<!--
SYNC IMPACT REPORT (v1.10.0 — see below for the v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.9.0 → 1.10.0
Modified principles: None
Added sections: Component Catalog → Data Display & Listings → Tables —
  documents the shipped `.data-table`/`.data-table-header-cell`/
  `.data-table-cell`/`.data-table-row-zebra` primitive (feature 012),
  including the py-3/py-4 header/body padding split, the Tailwind
  corePlugins naming-collision lesson applied proactively, and the
  scrollable-region-focusable accessibility fix and its tradeoff.
Corrected sections:
  - Component Catalog → Data Display & Listings → Lists: removed the
    now-resolved KNOWN GAP note about Table (feature 011), replaced
    with a one-line pointer to the Tables entry above.
Rationale: feature 012 closed the "documented but never built" gap
Lists itself had before feature 011 — the Tables catalog entry
described a pattern but no `src/components/table/` component had ever
shipped. Unlike Lists, the documented contrast values were empirically
verified to already be correct (no token correction needed) — this
amendment documents that verification rather than a fix. This is a
MINOR bump (new catalog guidance for a genuinely shipped component),
matching the precedent of v1.9.0's own Lists addition.
Templates requiring updates: ✅ none — no principle or template-level
change, only Component Catalog content.
-->

<!--
SYNC IMPACT REPORT (v1.9.0 — see below for the v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.8.0 → 1.9.0
Modified principles: None
Added sections: Component Catalog → Data Display & Listings → Lists —
  documents the shipped `.list`/`.list-row`/`.list-row-interactive`/
  `.list-row-title`/`.list-row-metadata` primitive (feature 011).
Corrected sections:
  - Component Catalog → Data Display & Listings → Lists: replaced
    `text-xs text-neutral-500` (4.83:1, fails AAA) with `text-xs
    text-neutral-600` (7.56:1, AAA) for metadata text, and replaced the
    "KNOWN GAP: never implemented" note with documentation of the
    actually-shipped component and its exact class names.
Rationale: feature 011 closed the catalog gap flagged during feature
006 — Lists was documented as a pattern but never built as a real
component, and its metadata token was wrong (never empirically
verified, the same class of gap Breadcrumbs had before feature 005).
This is a MINOR bump (new catalog guidance for a genuinely new shipped
component, not just a wording fix), matching the precedent of v1.3.0's
own new-token additions.
New KNOWN GAP recorded: Table has the identical "documented but never
built" defect Lists had — flagged for whichever future feature ships
it, per this constitution's own established practice of recording
follow-up gaps rather than silently deferring them (e.g. the Lists gap
itself was recorded this way in feature 006, and is now the model for
recording Table's).
Templates requiring updates: ✅ none — no principle or template-level
change, only Component Catalog content.
-->

<!--
SYNC IMPACT REPORT (v1.8.0 — see below for the v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.7.0 → 1.8.0
Modified principles: None
Added sections: None (no new catalog entry — a correctness fix to two
  already-ratified entries).
Corrected sections:
  - Component Catalog → Navigation & Disclosure → Dropdown Menu: added
    that the panel is anchored to its trigger via CSS Anchor Positioning
    (`anchor-name`/`position-anchor`/`anchor()`), not `position: absolute`
    alone.
  - Component Catalog → Advanced Forms & Interaction → Combobox: the
    prior text asserted "`position: absolute` override" was sufficient
    to anchor the listbox under the input — this was WRONG. Once an
    element is shown via the Popover API, the browser promotes it to the
    top layer, which resets its `position: absolute` containing block to
    the viewport's initial containing block, not the nearest positioned
    ancestor — `position: absolute` alone never actually anchored either
    Dropdown Menu's panel or Combobox's listbox to their trigger/input,
    confirmed via direct Playwright bounding-box measurement (feature
    010). Corrected to describe the CSS Anchor Positioning fix.
Rationale: feature 010 (a bug-fix feature, not a new component) found
this real, previously-undiscovered layout bug while building feature
009's React Dropdown Menu port — existing visual-regression screenshots
crop tightly to the popover element itself, which looks fine in
isolation regardless of where on the page it actually renders, so no
prior test caught it since Dropdown Menu (v1.4.0/feature 005) or
Combobox (v1.7.0/feature 008) shipped. Verified via direct
`CSS.supports()` testing against this project's own Playwright browser
engines (Chromium, Firefox, WebKit) that CSS Anchor Positioning is
natively supported in all three before adopting it as the fix — the
same "verify, don't assume" discipline applied to the Popover API itself
in v1.4.0. This is a MINOR bump per this project's versioning policy
(correcting a wrong technical claim in an already-ratified pattern,
matching the precedent of v1.6.0/v1.7.0's own AAA-contrast corrections)
— no principle text changed.
Templates requiring updates: None — this is a catalog-prose correction,
  not a new pattern requiring template updates.

SYNC IMPACT REPORT (v1.7.0 — see below for the v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.6.0 → 1.7.0
Modified principles: None
Added sections:
  - Component Catalog → NEW "Advanced Forms & Interaction" section:
    Combobox and Command Palette, reflecting feature
    008-advanced-forms-primitives's shipped patterns — this project's
    3rd and 4th JS modules (after overlay.js/toast.js in v1.0.0/003 and
    tabs.js/dropdown-menu.js in v1.4.0/005). Combobox is a from-scratch
    WAI-ARIA 1.2 combobox (native <datalist> verified insufficient — no
    ARIA combobox roles, no styling control, inconsistent cross-browser
    filtering, no disabled-option/no-results support) using the Popover
    API for its listbox panel, the same mechanism Dropdown Menu already
    established. Command Palette reuses Modal's <dialog>/showModal()
    chrome verbatim plus this project's first document-level global
    keyboard shortcut (Cmd/Ctrl+K).
Corrected sections: None this bump.
Refactored (non-visible, behavior-preserving): src/scripts/overlay.js's
  backdrop-click-close + WebKit-safe close-time refocus logic extracted
  into an exported wireDialogClose(dialog) helper, since Command
  Palette's dialog has no data-dialog-trigger button for
  initDialogTriggers()'s existing per-trigger loop to discover (it opens
  via a global shortcut instead). Verified behavior-preserving for
  Modal/Slide-over by running the full pre-existing suite before and
  after: 1731/1752 passed, 21 skipped, unchanged skip count, both
  modal.spec.ts and slide-over.spec.ts fully green.
Known gaps documented (carried over, unchanged, not addressed this bump):
  - Component Catalog → Data Display & Listings → Lists: still not
    implemented as its own component; the `text-xs text-neutral-500`
    metadata pattern remains an uncorrected latent AAA gap (see v1.5.0's
    report for detail).
Rationale: feature 008 (Combobox, Command Palette) was implemented
against these patterns as proposed Phase 1 design docs
(specs/008-advanced-forms-primitives/data-model.md, contracts/*.md,
research.md), per the same "propose in Phase 1, ratify what shipped"
sequence used for v1.4.0/v1.5.0/v1.6.0. Two `/speckit-analyze` passes
caught and fixed real gaps before and during implementation: a CRITICAL
Combobox gating-condition bug that would have made the "No results"
state unreachable (an earlier draft gated the popover's open call on
"query non-empty AND at least one match," directly contradicting
FR-004); a HIGH missing `aria-expanded` sync requirement; a CRITICAL
cross-artifact inconsistency where research.md/a contract claimed
overlay.js's close/backdrop logic was reused "verbatim" for Command
Palette when the actual per-trigger-loop implementation structurally
could not reach a trigger-less dialog, corrected via the
wireDialogClose(dialog) extraction described above; and a real
`popovertarget` HTML-spec misuse (inert on `type="text"` inputs) caught
before shipping. A code-reviewer agent pass found 0 CRITICAL/HIGH issues
(verdict APPROVE) and two optional, non-blocking notes (documented in
tasks.md T019, not carried into this amendment). A real functional bug
was also found and fixed during implementation via a standalone debug
script: the Command Palette's search input was missing its `id`
attribute, silently breaking `document.getElementById()` and disabling
the entire shortcut feature until fixed. This is a MINOR bump: one new
catalog section plus a behavior-preserving internal refactor, no
principle text changed.
Templates requiring updates (this MINOR bump):
  ✅ specs/008-advanced-forms-primitives/data-model.md (already documents
     these corrections as findings; this amendment folds them back into
     the ratified source of truth)
  ✅ specs/008-advanced-forms-primitives/contracts/*.md (already reflect
     the final, corrected, shipped state)
  ⚠ Lists' `metadata` token remains a known, documented, NOT-yet-corrected
     gap — unchanged from v1.5.0, still tracked, not silently dropped

SYNC IMPACT REPORT (v1.6.0 — see below for the v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.5.0 → 1.6.0
Modified principles: None
Added sections:
  - Component Catalog → Application & Navigation → Pagination (NEW entry),
    reflecting feature 007-application-shell-primitives's shipped pattern.
    Zero JavaScript; current page via `aria-current="page"` on
    `bg-brand-dark text-white`; Previous/Next are genuinely-disabled
    native `<button disabled>` at boundaries and real `<a href>` when
    enabled (a dead `<button>` masquerading as an enabled control was a
    real HIGH code-review finding, corrected pre-ratification); ellipsis
    `text-neutral-600` (not `-500` — `aria-hidden` exempts assistive
    technology, not sighted low-vision users who still read the glyph).
Corrected sections:
  - Component Catalog → Application & Navigation → Sidebar: active-item
    background corrected from `bg-brand text-white` (4.83:1, fails AAA)
    to `bg-brand-dark text-white` (7.90:1) — this ratified-since-v1.0.0
    pattern had never actually been implemented/tested until feature 007,
    which computed the WCAG relative-luminance formula directly and found
    the same class of gap Button primary already avoided. Dark-theme
    resting item text corrected from `text-neutral-400` (6.99:1, fails
    AAA by a hair) to `text-neutral-300` (12.04:1), same root cause.
  - Component Catalog → Application & Navigation → Navbar/Header: documents
    the mobile menu now ships as a native `<details>`/`<summary>` element
    (zero JavaScript, reusing Accordion's disclosure mechanism rather than
    the Popover API — no light-dismiss/floating-positioning need exists
    for a menu that pushes content down) and a `supports-[backdrop-filter]`
    fallback for the sticky header's translucency.
Known gaps documented (carried over, unchanged, not addressed this bump):
  - Component Catalog → Data Display & Listings → Lists: still not
    implemented as its own component; the `text-xs text-neutral-500`
    metadata pattern remains an uncorrected latent AAA gap (see v1.5.0's
    report for detail).
Rationale: feature 007 (Pagination, Sidebar, Navbar) was implemented
against these patterns as proposed Phase 1 design docs
(specs/007-application-shell-primitives/data-model.md, contracts/*.md,
research.md), per the same "propose in Phase 1, ratify what shipped"
sequence used for v1.4.0 and v1.5.0. Phase 0 research computed the WCAG
relative-luminance formula directly (not assumed) and found TWO real,
previously-undiscovered AAA contrast failures in this constitution's own
ratified-but-never-verified Sidebar pattern — the same "ratified but
never empirically verified" class of bug Breadcrumbs had before v1.4.0
and Lists still has, undiscovered until a feature actually implements
the pattern. A `/speckit-analyze` pass also caught a CRITICAL
Principle V gap (missing `active:` states across every interactive
element in a first draft) and an unsound AAA exemption reasoning for
Pagination's ellipsis, both corrected before implementation. A
code-reviewer agent pass caught one real HIGH-severity bug (a dead,
non-functional `<button>` posing as an enabled Pagination control) and
one LOW vestigial-class note (Navbar's mobile `<details>` carrying an
unused `group` class copied from Accordion), both fixed. This is a MINOR
bump: one new catalog entry, two corrected token pairings, no principle
text changed.
Templates requiring updates (this MINOR bump):
  ✅ specs/007-application-shell-primitives/data-model.md (already
     documents these corrections as findings; this amendment folds them
     back into the ratified source of truth)
  ✅ specs/007-application-shell-primitives/contracts/*.md (already
     reflect the final, corrected, shipped state)
  ⚠ Lists' `metadata` token remains a known, documented, NOT-yet-corrected
     gap — unchanged from v1.5.0, still tracked, not silently dropped

SYNC IMPACT REPORT (v1.5.0 — see below for the v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.4.0 → 1.5.0
Modified principles: None
Added sections:
  - Base Semantic Palette: one new token, `status.info-strong` (#1E40AF,
    8.72:1 against white) — `status.info` existed since v1.0.0 but had no
    text-safe `-strong` companion, unlike success/warning/error.
  - Component Catalog → Data Display & Listings → Avatar, Card, Alert/Banner
    (NEW entries), reflecting feature 006-data-display-primitives's shipped
    patterns. Avatar's fallback reuses the existing ratified Lists avatar
    size for its "large" variant. Card has no native-element precedent (a
    proposed pattern, like Accordion/Tabs/Dropdown Menu in v1.4.0) reusing
    the Modals panel's `rounded-lg`/`border-neutral-200` pair and
    `.btn-primary`'s `hover:shadow-md` transition. Alert/Banner reuses
    Badge's exact severity formula for success/error/warning and extends
    it to `info` via the new `info-strong` token; explicitly carries no
    `role="status"`/`aria-live`/`role="alert"`, unlike Toast, since it is
    static page content, not a transient announcement.
Corrected sections: None this bump (see the "KNOWN GAP" note added under
  Lists below, which documents rather than fixes a discovered issue).
Known gaps documented (not corrected — out of scope for this feature):
  - Component Catalog → Data Display & Listings → Lists: the ratified
    `metadata` pattern (`text-xs text-neutral-500`) failed a real
    axe-core AAA scan (4.83:1) the first time it was actually used
    (feature 006's Card composed demo) — Lists itself has never shipped
    as its own component, so this entry is left uncorrected here and
    flagged as a required fix for whichever future feature ships Lists,
    the same "ratified but never empirically verified" pattern Breadcrumbs
    had before v1.4.0/feature 005.
Rationale: feature 006 (Avatar, Card, Alert/Banner) was implemented
against these patterns as proposed Phase 1 design docs
(specs/006-data-display-primitives/data-model.md, contracts/*.md), per
the same "propose in Phase 1, ratify what shipped" sequence used for
v1.4.0's Navigation & Disclosure section. Two `/speckit-analyze` passes
plus a code-reviewer agent pass caught and fixed real gaps before and
during implementation: an unverified "11.58:1" Avatar-contrast figure
that was actually 9.37:1 (still AAA-compliant, but the wrong number would
have been ratified verbatim if uncaught); a missing check-contrast.mjs
coverage entry for the new neutral-700/neutral-100 pairing; Alert's
`info` severity initially bypassing the already-ratified `status.info`
token in favor of an ad-hoc `brand-light`/`brand-dark` treatment,
corrected to extend the token properly instead. This is a MINOR bump: one
new token plus new catalog guidance, no principle text changed.
Templates requiring updates (this MINOR bump):
  ✅ specs/006-data-display-primitives/data-model.md (already documents
     these corrections as findings; this amendment folds them back into
     the ratified source of truth)
  ✅ specs/006-data-display-primitives/contracts/*.md (already reflect the
     final, corrected, shipped state)
  ⚠ Lists' `metadata` token is a known, documented, NOT-yet-corrected gap
     — tracked above, not silently deferred

SYNC IMPACT REPORT (v1.4.0 — see below for the v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.3.4 → 1.4.0
Modified principles: None
Added sections:
  - Component Catalog → Navigation & Disclosure (NEW section): Accordion/
    Disclosure, Tabs, and Dropdown Menu, reflecting feature
    005-navigation-disclosure-primitives's shipped patterns. Accordion
    uses native <details>/<summary> (zero JS, including the exclusive
    single-open-at-a-time variant via the native shared `name`
    attribute). Tabs is this project's second component (after
    Modal/Slide-over/Toast) requiring custom JavaScript, since no native
    element covers the WAI-ARIA Tabs pattern's roving-tabindex/arrow-key
    keyboard model. Dropdown Menu uses the native Popover API
    (`popover="auto"`) for open/close/light-dismiss/top-layer — the same
    relationship `<dialog>` has to Modal/Slide-over — with a small JS
    module for arrow-key roving focus, `aria-expanded` syncing, and
    Tab-closes-the-menu (WAI-ARIA APG Menu Button convention).
Corrected sections (existing content fixed, not newly added):
  - Component Catalog → Application & Navigation → Breadcrumbs: resting/
    active link color corrected from the originally speculative
    `text-neutral-500` (never empirically verified since no feature had
    implemented Breadcrumbs until now) to `text-neutral-600`, plus
    documents the `active:text-neutral-700` state and notes that
    `disabled:` is a technical impossibility for `<a>` elements (Tailwind's
    `disabled:` variant targets the `:disabled` CSS pseudo-class, which
    never matches an anchor), not a state Principle V exempts Breadcrumbs
    from needing.
Rationale: feature 005 (Breadcrumbs, Accordion/Disclosure, Tabs, Dropdown
Menu) was implemented against these patterns as *proposed* Phase 1 design
docs (specs/005-navigation-disclosure-primitives/data-model.md,
contracts/*.md) since — unlike Modal/Slide-over/Toast in feature 003,
which had a pre-existing ratified Overlays/Modals/Feedback catalog entry
to build against — Accordion/Tabs/Dropdown Menu had no prior catalog
section at all, and Breadcrumbs' existing entry (speculatively ratified in
v1.2.1) had never actually been implemented or tested. Two full
`/speckit-analyze` passes plus a code-reviewer agent pass caught and fixed
real gaps before and during implementation (Principle V state-completeness
hedges, a real WCAG AAA contrast failure in the Breadcrumbs/Tabs resting
color, a Dropdown Menu focus-visible outline that would have silently
dropped the mandated outline for a background highlight alone) — this
amendment ratifies what actually shipped and was verified, per the
"propose in Phase 1, ratify what shipped" sequence already used for
genuinely new patterns in prior features (e.g. v1.3.0's `-strong` status
tokens). This is a MINOR bump: new catalog guidance added (Navigation &
Disclosure), plus a correction to already-ratified content (Breadcrumbs) —
no principle text changed.
Templates requiring updates (this MINOR bump):
  ✅ specs/005-navigation-disclosure-primitives/data-model.md (already
     documents these corrections as findings; this amendment folds them
     back into the ratified source of truth)
  ✅ specs/005-navigation-disclosure-primitives/contracts/*.md (already
     reflect the final, corrected, shipped state)
  ⚠ No other spec/plan/tasks documents reference the stale
     `text-neutral-500` Breadcrumbs value that need correcting

SYNC IMPACT REPORT (v1.3.4 — see below for the v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.3.3 → 1.3.4
Modified principles: None
Added sections:
  - Alignment Grid & Spacing → Border radius: adds `rounded-full` (9999px)
    as a ratified token for pills/circles (toggle tracks/dots, avatars),
    alongside the existing sm/md/lg scale.
  - tailwind.config.ts: `borderRadius.full = "9999px"`, so
    `scripts/audit-tokens.mjs`'s dynamically-derived allowlist accepts it.
Rationale: a third `/speckit-analyze` pass on feature
002-form-primitives-round-2 (with tasks.md now present) found that
contracts/toggle.contract.md's `rounded-full` track/dot styling had no
ratified radius token backing it — the constitution's border-radius scale
and tailwind.config.ts's borderRadius block only defined sm/md/lg. This
would have failed scripts/audit-tokens.mjs (Principle IV) the moment the
contract was implemented, contradicting plan.md's G3 "PASS" claim and
tasks.md's T012 "expected: 0" note — caught before any component code was
written. `rounded-full` is a categorically different, well-understood
Tailwind keyword (fully rounded, not a step on the 4/8/12px scale) already
implied by the existing "avatars" prose in the Data Display section, so
ratifying it formally is a natural completion of the existing scale, not a
new design direction. This is a PATCH bump: one new token value, no
principle changed, no existing token altered.
Templates requiring updates (this PATCH):
  ✅ tailwind.config.ts — borderRadius.full added
  ⚠ specs/002-form-primitives-round-2/plan.md — G3 row should note this
    amendment once applied
  ⚠ specs/002-form-primitives-round-2/tasks.md — T012 note should
    reference the resolved gap

SYNC IMPACT REPORT (v1.3.3 — see below for the v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.3.2 → 1.3.3
Modified principles: None
Added sections: None (no new tokens)
Corrected sections:
  - Component Catalog → Forms, Validation & Inputs → Checkboxes/radios:
    updated from stale `rounded` (raw, non-ratified radius) to
    `rounded-sm` (the actual ratified token feature 001's Checkbox
    ships), added the full focus-visible/disabled state set and the
    peer/peer-disabled label-dimming pattern that shipped but was never
    reflected back into the catalog, and documented Radio's native-shape/
    shared-`name` grouping for feature 002.
  - Component Catalog → Forms, Validation & Inputs → Toggles/switches:
    added the `ring-1 ring-inset ring-neutral-500` boundary and
    disabled-dimming pattern from feature 002's Toggle contract, with the
    contrast rationale (1.24:1 fill alone vs. 4.83:1 with the ring).
Rationale: `/speckit-analyze` on feature 002-form-primitives-round-2
found the ratified catalog entries for Checkboxes/radios and Toggles/
switches had drifted from what actually shipped (feature 001's Checkbox)
or was about to ship (feature 002's Toggle) — the catalog is meant to be
the single source of truth, and letting contracts silently diverge from
it defeats that purpose even when, as here, no principle is violated
(WCAG 1.4.11 is AA, not part of Principle II's AAA mandate). This is a
PATCH bump: documentation-only corrections to already-ratified tokens,
no principle or token change.
Templates requiring updates: None (governance/catalog text only).

SYNC IMPACT REPORT (v1.3.2 — see below for the v1.3.1/v1.3.0 reports this extends)
Version change: 1.3.1 → 1.3.2
Modified principles: None
Added sections:
  - Governance → Adopted External Skills: records `frontend-design`
    (Anthropic, official `claude-plugins-official` marketplace, Apache 2.0)
    as vetted under Principle VII and available for use.
Rationale: closes the TODO(SKILL_REFS) follow-up carried since v1.0.0 —
the original request referenced a `frontend-design` skill that did not
exist under that exact name at the time. It is now available (enabled in
this environment's `.claude/settings.json`), and was verified against all
four Principle VII criteria before being recorded as adopted: official
Anthropic publisher and marketplace (trustworthy, actively maintained),
plain-instruction skill content with no scripts or obfuscated behavior
(safe), directly serves this project's stated goal of avoiding templated
UI defaults (relevant), Apache License 2.0 (compatible). This is a PATCH
bump: documentation-only, no principle or token changed.
Templates requiring updates: None (governance note only).

SYNC IMPACT REPORT (v1.3.1 — see below for the v1.3.0 report this extends)
Version change: 1.3.0 → 1.3.1
Modified principles: None
Added sections: None (no new tokens)
Corrected sections:
  - Component Catalog → Data Display & Listings → Badges: background color
    switched from raw Tailwind default-palette classes (`bg-green-50`,
    `bg-red-50`, `bg-amber-50` — never part of the ratified palette) to
    `bg-success/5`, `bg-error/5`, `bg-warning/5` (existing status tokens via
    Tailwind's opacity modifier).
Rationale: a second `/speckit-analyze` pass (post-v1.3.0, pre-implementation)
on feature 001-primitive-components found that the v1.3.0 fix corrected the
Badge's text/ring colors but missed that the background colors were also raw
palette classes never added to this constitution — a Principle IV violation.
Verified via the WCAG relative-luminance formula that `bg-success/5` /
`bg-error/5` / `bg-warning/5` (composited over white) still pass AAA with the
`-strong` text tokens on top (7.11–8.72:1, comfortable margin above 7:1).
This is a PATCH bump: no new token, no principle change, only a corrected
Tailwind class reference to already-ratified tokens.
Templates requiring updates (this PATCH):
  ✅ specs/001-primitive-components/contracts/badge.contract.md
  ✅ specs/001-primitive-components/spec.md (User Story 3 AC1 stale example)
  ✅ specs/001-primitive-components/data-model.md (Badge validation rules stale example)
  ✅ specs/001-primitive-components/plan.md (Constitution Check G3 note)

SYNC IMPACT REPORT (v1.3.0)
Version change: 1.2.1 → 1.3.0
Modified principles: None (no principle text changed)
Added sections:
  - Base Semantic Palette: three new tokens under `status` —
    `success-strong` (#065F46), `error-strong` (#991B1B),
    `warning-strong` (#78350F) — calibrated text-safe variants of the
    existing success/error/warning tokens.
Corrected sections (existing content fixed, not newly added):
  - Component Catalog → Data Display & Listings → Badges: text color
    switched from `text-success`/`text-error`/`text-warning` to the new
    `-strong` tokens; ring color switched from raw Tailwind palette
    classes (`ring-green-600/20`, `ring-red-600/10`, `ring-amber-600/10`)
    to the ratified `ring-success/20`, `ring-error/10`, `ring-warning/10`.
  - Component Catalog → Forms, Validation & Inputs → Inline errors:
    text color switched from `text-error` to `text-error-strong`.
Removed sections: None
Rationale for this amendment: `/speckit-analyze` on feature
001-primitive-components (2026-07-08) found that the ratified
success/error/warning tokens, as prescribed for text-over-tint use in the
Badge and inline-error patterns, fail the Principle II AAA contrast gate
(7:1) — measured via the WCAG relative-luminance formula at 2.42:1
(success on green-50), 3.44:1 (error on red-50), 2.07:1 (warning on
amber-50), and 3.76:1 (error text on white). The three new `-strong`
tokens pass AAA in every context measured (7.34–9.72:1 range). The
existing DEFAULT success/error/warning values are unchanged and remain
valid for non-text uses (icons, dots, rings via opacity modifier). The
Badge ring-color correction additionally resolves a pre-existing
Principle IV tension: the raw `ring-green-600/20`-style classes used a
different hue calibration than this project's own status tokens and were
never added to the ratified palette.
Templates requiring updates:
  ✅ .specify/templates/plan-template.md — no edit required
  ✅ .specify/templates/spec-template.md — no edit required
  ✅ .specify/templates/tasks-template.md — no edit required
  ✅ .specify/templates/checklist-template.md — no edit required
  ✅ .claude/skills/speckit-*/SKILL.md (11 files) — no edit required
  ✅ specs/001-primitive-components/contracts/badge.contract.md — updated
    to reference the new `-strong`/ring tokens
  ✅ specs/001-primitive-components/contracts/text-input.contract.md —
    updated to reference `text-error-strong`
  ✅ specs/001-primitive-components/contracts/button.contract.md — updated
    to `bg-brand-dark` (unrelated AAA fix, same remediation pass)
  ✅ specs/001-primitive-components/spec.md — FR-002 (added disabled state),
    FR-007/US3-AC2 (removed incorrect `aria-checked` requirement for the
    native Checkbox), version reference updated to v1.3.0
  ✅ specs/001-primitive-components/plan.md — Constitution Check gate table
    corrected (G1/G3 remediation noted, G4 re-scoped to FR-004)
Follow-up TODOs:
  - RESOLVED (carried from v1.2.0/v1.2.1): the `find-skills` gap is
    formally defined as Principle VII's behavior protocol.
  - TODO(SKILL_REFS): `frontend-design`, referenced in the original
    v1.0.0 request, remains unresolved — still not present under that
    exact name.
-->

# Professional Design System Constitution
<!-- HTML/CSS + Tailwind CSS component library, tokens, and AI governance rules -->

## Core Principles

### I. Cognitive Ergonomics & Visual Hierarchy
Every layout MUST be designed to reduce cognitive load and guide the user's eye
predictably:
- **Fitts's Law**: primary action elements (save, continue, confirm) MUST have a
  click target of at least 44x44px and be positioned in the natural reading flow.
- **Strict visual hierarchy**: typographic weight contrast (`font-bold` vs.
  `font-normal`) and semantic color usage MUST guide the user toward the primary
  action before secondary ones — never two actions of equal visual weight
  competing for the same attention.
- **Reduced mental load**: related information MUST be grouped into clear
  cards/sections, with enough white space (`gap-*`, `space-y-*`) to avoid visual
  fatigue.

**Rationale**: design system interfaces power products used repeatedly; small,
recurring cognitive friction compounds into abandonment and user error at scale.

### II. Absolute Semantic Accessibility (WCAG 2.2 AAA) (NON-NEGOTIABLE)
No component is considered complete without AAA-level accessibility:
- **Dynamic contrast**: every text-over-color-background combination MUST pass the
  AAA contrast test, using the correct tokens (`text-neutral-900` on light
  backgrounds, `text-white` on dark backgrounds — never arbitrary colors).
- **Mandatory state attributes**: `aria-expanded` on dropdowns/modals,
  `aria-checked` on custom inputs, `aria-invalid="true"` on fields with errors,
  `aria-live="polite"` on dynamic notifications/loaders.
- **Focus management**: modals and slide-overs MUST trap keyboard focus within the
  active element and return it to the original trigger on close. Visually hidden
  interactive elements MUST receive `aria-hidden="true"` or `tabindex="-1"`.

**Rationale**: accessibility is not an optional feature of a design system — it is
the contractual guarantee that every product built on top of it is usable by
anyone, including screen-reader and keyboard-only users.

### III. Tailwind-Only Architecture (Zero Parallel CSS)
The entire ecosystem MUST run exclusively on the Tailwind CSS utility API.
Parallel custom `.css` files (outside of Tailwind's theme configuration) are
FORBIDDEN. Any styling need that appears to require custom CSS MUST first be
resolved via `theme()`, `@layer`, or Tailwind configuration tokens before being
considered an exception — and exceptions require documented justification.

**Rationale**: a single source of truth for styling avoids two competing design
languages (utilities + loose CSS) and keeps bundle size and maintenance
predictable.

### IV. Design Token Discipline (Zero Hardcoding) (NON-NEGOTIABLE)
Raw Tailwind palette classes (`bg-blue-600`, `text-gray-800`, `rounded-xl`, etc.)
are FORBIDDEN in any final component. Every color, border radius, and typographic
scale MUST reference a semantic token defined in the "Design Foundations" section
below (`bg-brand`, `text-neutral-800`, `rounded-lg`). Any raw class usage MUST be
automatically intercepted and converted to the equivalent token before code
approval.

**Rationale**: semantic tokens are what makes the design system swappable
(rebrand, dark mode, white-label) without rewriting components; raw palette usage
scattered through the code silently breaks that guarantee.

### V. Interactive State Completeness (NON-NEGOTIABLE)
Every interactive `<button>` or `<a>` MUST explicitly declare the following
variants: `hover:`, `active:`, `focus-visible:outline focus-visible:outline-2
focus-visible:outline-offset-2 focus-visible:outline-brand`, and
`disabled:opacity-50 disabled:cursor-not-allowed`. Any interactive element that
does not declare this full set of states MUST be rejected before being merged
into the design system.

**Rationale**: incomplete states are the most common cause of interfaces that
"look done" in Figma but fail in real usage (the user cannot tell if a button is
disabled, focusable, or has already been clicked).

### VI. Project Language Policy (NON-NEGOTIABLE)
All project artifacts — source code, comments, variable/class/component names,
technical documentation (specs, plans, tasks, commit messages, PRs, this
constitution) — MUST be written in English. This applies uniformly across the
codebase and every file under `.specify/` and `.claude/skills/`.

All AI agent communication directed at the user (chat responses, summaries,
reports, explanations) MUST be written in Brazilian Portuguese (PT-BR),
regardless of the language of the underlying project artifacts being discussed.

**Rationale**: English-only project artifacts keep the codebase compatible with
tooling, Tailwind UI conventions, upstream libraries, and future international
contributors. PT-BR-only agent communication keeps the working relationship with
the local team clear and frictionless — the two requirements are independent and
both non-negotiable.

### VII. Autonomous Skill Acquisition Protocol (NON-NEGOTIABLE)
Whenever the AI agent faces a task that falls outside its current domain
knowledge — no locally installed skill or available skill in its catalog covers
the subject — the agent MUST behave as the `find-skills` capability: actively
search for external skills/plugins (marketplaces, skill repositories, GitHub)
that are safe, trustworthy, robust, and genuinely relevant to this project's
context (an HTML/CSS + Tailwind CSS design system).

Before adopting or installing any external skill, the agent MUST verify, at
minimum:
- **Source trustworthiness**: known publisher/maintainer, active maintenance,
  no signs of abandonment or malicious intent.
- **Safety**: no destructive, obfuscated, or unreviewable behavior; the skill's
  instructions and any scripts it runs MUST be readable and inspected before use.
- **Relevance**: the skill MUST directly serve this project's design system,
  accessibility, or Tailwind/HTML tooling needs — not be adopted speculatively.
- **License compatibility**: the skill's license MUST NOT impose obligations
  incompatible with this project.

Installing a new skill is a persistent change to the project's environment and
MUST be treated with the same care as adding a dependency: the agent MUST inform
the user which skill it intends to install and why, per Principle VI in PT-BR,
before or immediately after installation — silent, unannounced skill
installation is FORBIDDEN.

**Rationale**: a design system project accumulates edge-case needs (new a11y
audit tools, icon libraries, animation patterns) faster than any fixed skill set
can anticipate. Without this protocol the agent either stalls on unfamiliar
tasks or improvises unsafely; with it, the agent has a bounded, auditable way to
extend its own capability without compromising trust or project hygiene.

## Design Foundations: Tokens, Typography & Grid

### Base Semantic Palette
```json
{
  "brand": { "light": "#E6F0FF", "DEFAULT": "#0066FF", "dark": "#004BB3" },
  "neutral": {
    "50": "#F9FAFB", "100": "#F3F4F6", "200": "#E5E7EB", "300": "#D1D5DB",
    "400": "#9CA3AF", "500": "#6B7280", "600": "#4B5563", "700": "#374151",
    "800": "#1F2937", "900": "#111827"
  },
  "status": {
    "success": "#10B981", "warning": "#F59E0B", "error": "#EF4444", "info": "#3B82F6",
    "success-strong": "#065F46", "warning-strong": "#78350F", "error-strong": "#991B1B",
    "info-strong": "#1E40AF"
  }
}
```
This table is the single source of truth for color. Any new color token MUST be
added here before being used in components.

The `-strong` status variants exist specifically for text rendered directly on
a light tint background (e.g. Badge labels, inline error messages) — the base
success/warning/error values are calibrated for non-text uses (icons, dots,
rings) and do not pass WCAG 2.2 AAA contrast as text in that context. Any
component rendering status-colored text over a light background MUST use the
`-strong` variant; the base variant remains correct for rings, icon fills, and
other non-text decoration. `info-strong` (#1E40AF, 8.72:1 against white,
computed via the WCAG relative-luminance formula — the same method used for
every other `-strong` token) was added in feature 006 (Alert/Banner's `info`
severity) — `status.info` itself had existed since v1.0.0 but had no
text-safe `-strong` companion, unlike success/warning/error.

### Typography & Text Scale
- Family: `font-sans` (Inter, system-ui, sans-serif), with `antialiased` always
  active.
- `font-mono` (ui-monospace, SFMono-Regular, Menlo, monospace) — added in
  feature 014 for Kbd, this catalog's first ratified monospace stack. A
  standard, dependency-free system stack (no new font file/CDN link, unlike
  Inter's own pre-existing font-delivery gap tracked separately). Reserved
  for keyboard-shortcut display; not a general body-copy alternative.
- `text-xs` (12px, `font-normal`/`font-medium`) — captions, metadata, micro-text.
- `text-sm` (14px, `font-normal`/`font-semibold`) — default body copy, input
  labels, table items.
- `text-base` (16px, `font-normal`/`font-medium`) — long-form reading, articles,
  paragraphs.
- `text-lg` / `text-xl` (18px/20px, `font-semibold`) — subtitles, card headers.
- `text-2xl` to `text-4xl` (24px–36px, `font-bold`) — page titles, dashboards,
  highlighted statistics.

### Alignment Grid & Spacing
- Vertical/horizontal spacing follows Tailwind's 8px scale (`space-y-2` = 8px,
  `space-y-4` = 16px, `space-y-8` = 32px).
- Table and complex grid gaps use `gap-4` (16px) or `gap-6` (24px).
- A 4px exception is allowed ONLY for micro-adjustments (icon+text spacing,
  internal padding of small badges).
- Border radius: `rounded-sm` (4px, inputs/checkboxes/small tags), `rounded-md`
  (8px, buttons/dropdowns/secondary navigation), `rounded-lg` (12px, cards/
  modals/panels/primary containers), `rounded-full` (9999px, pills/circles —
  toggle tracks and dots, avatars; any fully-rounded element, not a step on
  the 4/8/12px scale above).

## Component Catalog & Tailwind UI Patterns

Any component copied from Tailwind UI MUST undergo immediate refactoring for zero
class waste and full compliance with the tokens above before entering the
catalog.

### Application & Navigation
- **Sidebar**: `bg-neutral-900`/`text-neutral-300` (dark — corrected from the
  originally speculative `text-neutral-400`; this pattern had never actually
  been implemented until feature 007, whose real axe-core/WCAG-formula
  measurement found 6.99:1, failing AAA by a hair, `text-neutral-300` clears
  it at 12.04:1) or `bg-white text-neutral-700` with `border-r
  border-neutral-200` (light). Active: `bg-brand-dark text-white` (also
  corrected — the originally speculative `bg-brand text-white` measured
  4.83:1, the same AAA gap Button primary already avoids; `bg-brand-dark`
  clears it at 7.90:1), `aria-current="page"`. Hover: `bg-neutral-100`/
  `bg-neutral-800` with `transition-colors duration-150`, `active:bg-
  neutral-200`/`active:bg-neutral-700` (press state, Principle V).
- **Navbar/Header**: `sticky top-0 z-40`, `backdrop-blur-md bg-white/80` with
  a `supports-[backdrop-filter]` fallback to an opaque background where the
  filter isn't supported, `border-b border-neutral-200`. Hamburger button
  restricted to `lg:hidden` with an expanded touch target; the mobile menu
  itself is a native `<details>`/`<summary>` element (zero JavaScript,
  reusing Accordion's disclosure mechanism — no light-dismiss/floating-
  positioning need exists for a menu that pushes content down, unlike
  Dropdown Menu's Popover-API requirement).
- **Pagination**: zero JavaScript. Current page `bg-brand-dark text-white`
  + `aria-current="page"` (the Sidebar active-item pairing, reused
  verbatim). Previous/Next are native `<button disabled>` at their
  respective boundaries (genuinely disabled, not just styled) and real
  `<a href>` elements when enabled — an enabled control MUST be a real,
  navigable anchor, never a `<button>` with no `href`/handler standing in
  for one (a dead button masquerading as enabled was a real code-review
  finding, corrected before ratification). Page links `text-neutral-600`,
  `hover:bg-neutral-100`, `active:bg-neutral-100`. Ellipsis `text-
  neutral-600 aria-hidden="true"` (not `-500` — `aria-hidden` exempts
  content from assistive technology, not from sighted low-vision users who
  still read the glyph visually, so the AAA floor still applies).
- **Stepper/Steps**: shipped in feature 015
  (`.stepper`/`.stepper-step`/`.stepper-step-completed`/
  `.stepper-step-current`/`.stepper-step-upcoming`/`.stepper-circle`,
  `src/components/stepper/stepper.html`) as **presentational-only in this
  feature** — no click-to-navigate interactivity beyond what a natural
  link/button per step would already provide (a documented, deliberate
  scope decision, not an oversight). Reuses Pagination's exact
  `bg-brand-dark text-white` current/completed-item pairing verbatim
  (7.90:1, re-verified rather than assumed identical just because both
  are "the current one in a sequence"). The connector line between
  circles is `background-color` on a `::after` pseudo-element
  (`bg-neutral-200` upcoming / `bg-brand-dark` completed) — purely
  decorative, matching this catalog's already-accepted
  low-contrast-decorative-border exception (Card/Divider/List's
  `border-neutral-200`), not a new WCAG 1.4.11 gap. `aria-current="step"`
  on the current step only (not `"page"` — a step is not a page).
- **Breadcrumbs**: `text-sm text-neutral-600` (corrected from the originally
  speculative `text-neutral-500` — feature 005 was the first to actually
  implement and test this pattern, and a real axe-core AAA scan measured
  4.83:1 against the required 7:1; `text-neutral-600` clears it at 7.56:1),
  `active:text-neutral-700`, dividers `text-neutral-300` or a minimum
  `h-5 w-5` Chevron icon. Current item: `text-neutral-900 font-medium` +
  `aria-current="page"` (rendered as non-interactive `<span>`, never a
  "disabled" `<a>` — Tailwind's `disabled:` variant cannot target an anchor
  element regardless of utility applied, a technical constraint rather
  than a state this component is exempt from providing).

### Forms, Validation & Inputs
- **Text inputs/selects/textareas**: `block w-full rounded-md border-0 py-1.5
  text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300
  placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-brand
  sm:text-sm sm:leading-6`.
- **Checkboxes/radios**: `h-4 w-4 rounded-sm border-neutral-300 text-brand
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed`;
  adjacent label uses `cursor-pointer` and, when the input may be disabled,
  `peer`/`peer-disabled:opacity-50` so the label dims with it. Radio uses
  the native circular shape of `type="radio"` (no `rounded-*` class needed
  or applied). Grouped radios share a `name` attribute for native mutual
  exclusivity.
- **Toggles/switches**: `transition-colors duration-200 ease-in-out` between
  `bg-neutral-200` and `bg-brand` on the track, plus a state-invariant
  `ring-1 ring-inset ring-neutral-500` boundary (the fill alone measures
  1.24:1 against a white page — below the 3:1 WCAG 1.4.11 non-text
  threshold; the ring clears 4.83:1); inner dot `h-5 w-5 transform
  rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
  dimming together with the track via `peer-disabled:opacity-50` on both.
- **Inline errors**: `text-xs text-error-strong mt-1 font-medium` directly
  below the input (AAA-safe text variant); the parent input additionally
  receives `ring-error focus:ring-error` (non-text use — base token is
  correct here).
- **Textarea**: shipped as a real component in feature 014
  (`src/components/textarea/textarea.html`), closing the gap this entry's
  own "Text inputs/selects/textareas" wording had implied without a
  standalone component ever existing — the same class of "documented but
  never shipped" gap Table had before feature 012. Reuses the Text
  inputs/selects pattern above verbatim; the only differences are
  `resize-y` (never bare `resize`, which permits horizontal resize and
  breaks responsive layouts) and a `rows="4"` default.
- **Button Group / Segmented Control**: shipped in feature 014
  (`.button-group`/`.button-group-segment`,
  `src/components/button-group/button-group.html`) as **zero
  JavaScript** — visually-hidden native `<input type="radio">` elements
  sharing one `name` attribute, each paired with a `<label>` styled as a
  connected segment (`first:rounded-l-md last:rounded-r-md` on the outer
  segments, `-ml-px` collapsing adjacent borders to a single 1px line).
  Native radio-group behavior (arrow keys move the checked segment,
  skipping disabled ones; Tab enters/exits the whole group as one stop)
  is free from the browser. This REUSES Accordion's native shared-`name`
  exclusivity mechanism (feature 009) rather than porting Tabs' custom
  roving-tabindex widget — the explicit precedent going forward: when a
  native form control already solves an exclusivity/selection problem,
  prefer it over a hand-rolled ARIA widget. Active segment
  `bg-brand-dark text-white` (7.90:1, the same Sidebar/Pagination
  active-item pairing, re-verified rather than assumed since contrast
  ratios are colors-only and don't change by context). Disabled segment
  `opacity-50 cursor-not-allowed` on the label, driven by
  `input:disabled +`.
- **Slider (Range)**: shipped in feature 015 (`.slider`,
  `src/components/slider/slider.html`) as native `<input type="range">`
  — **zero JavaScript**. Fill/thumb driven by Tailwind's `accent-*`
  utility (`accent-brand-dark` on `bg-neutral-200`), confirmed via
  `CSS.supports()` to be supported across Chromium/Firefox/WebKit,
  chosen over hand-rolled `::-webkit-slider-thumb`/`::-moz-range-thumb`
  vendor-prefixed pseudo-elements (each only supported in one engine
  family). Reuses Progress's exact fill/track pairing verbatim (6.38:1,
  confirmed identical colors before citing the number, not re-computed).
  Native keyboard support (arrow keys, Home/End, Page Up/Down) is free
  from the browser.
- **File Input/Upload**: shipped in feature 015 (`.file-drop-zone`/
  `.file-input-native`, `src/components/file-input/file-input.html`,
  `src/scripts/file-input.js`) as a native `<input type="file">`
  (opacity-0, `absolute inset-0`) layered under a styled drop-zone
  wrapper — click-to-browse works natively. The native input MUST be
  first in the DOM inside `.file-drop-zone` (a real bug found during
  implementation: the general-sibling combinator `~` only matches
  elements AFTER the reference element, so an input placed last made the
  mandated focus-visible rule permanently unmatchable); the icon/text
  MUST be wrapped in one `.file-drop-zone-content` sibling so the
  focus-visible/disabled rules produce one cohesive outline/opacity
  change instead of one per child. The selected filename is displayed via
  `src/scripts/file-input.js`'s `change`-event listener (the native input
  is visually transparent, so its own browser filename chrome is never
  seen) — the only genuinely new interactivity this component needs.
  Real drag-and-drop (`dragenter`/`dragover`/`drop` handling) is
  explicitly deferred as a documented future enhancement, not silently
  dropped — a materially larger JS surface than reading the `change`
  event's own `.files` list. **Contrast correction found during
  implementation**: the helper text originally used `text-neutral-500`
  (measures 4.83:1, clears AA but fails this catalog's AAA 7:1 floor) —
  `neutral-500` is ratified in this catalog ONLY for icon-fill/non-text
  use, never small body text; fixed with `text-neutral-600` (already
  used for every other small helper/caption text in this catalog).

### Data Display & Listings
- **Tables**: shipped as a real component in feature 012 (`.data-table`/
  `.data-table-header-cell`/`.data-table-cell`/`.data-table-row-zebra`,
  `src/components/table/table.html`), closing the "documented but never
  built" gap flagged by feature 011. Header `bg-neutral-50 text-left
  text-xs font-semibold text-neutral-600 uppercase tracking-wider
  px-6 py-3` (7.23:1 AAA against `bg-neutral-50`); cells `text-sm
  text-neutral-900 px-6 py-4 max-w-xs truncate` (16.98-17.74:1 AAA) —
  header uses `py-3`, body cells use `py-4` (a deliberate, denser header
  convention, not an inconsistency); both verified via the WCAG
  relative-luminance formula rather than assumed, unlike Lists' metadata
  token (which was actually wrong). Rows with optional zebra striping
  (`.data-table-row-zebra`'s `even:bg-neutral-50`) and `divide-y
  divide-neutral-200`. Class names are `.data-table*`, not `.table*`:
  Tailwind's own core `display` plugin defines `.table { display: table
  }`, `.table-cell { display: table-cell }`, and `.table-row { display:
  table-row }` as core utilities — the identical class of collision
  bug feature 011 found for Lists' `.list-item`, caught here before
  implementation by checking `corePlugins.js` first. The horizontally-
  scrollable wrapper (`overflow-x-auto`) requires `tabindex="0"`,
  `role="region"`, and a descriptive `aria-label` per axe-core's
  `scrollable-region-focusable` rule — a real violation found only at
  narrow (320px) viewports where the table genuinely overflows, not at
  wider ones; this is applied unconditionally since static markup can't
  detect actual overflow at runtime, a documented, accepted tradeoff.
- **Badges**: success `bg-success/5 text-success-strong ring-1 ring-inset
  ring-success/20`; error `bg-error/5 text-error-strong ring-1 ring-inset
  ring-error/10`; warning `bg-warning/5 text-warning-strong ring-1 ring-inset
  ring-warning/10`; neutral `bg-neutral-50 text-neutral-600 ring-1 ring-inset
  ring-neutral-500/10`. Background and ring both use the base status token via
  Tailwind's opacity modifier (`/5` background, `/20` or `/10` ring); text uses
  the AAA-safe `-strong` variant. All three are already-ratified tokens — no
  raw palette classes anywhere in the pattern.
- **Lists**: shipped as a real component in feature 011 (`.list`/
  `.list-row`/`.list-row-interactive`/`.list-row-title`/
  `.list-row-metadata`, `src/components/list/list.html`). Avatars reuse
  `.avatar-img`/`.avatar-fallback`/`avatar-lg` verbatim (no new avatar
  CSS); title `text-sm font-semibold text-neutral-900`; metadata `text-xs
  text-neutral-600` (corrected — see below); interactive row
  `hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline
  focus-visible:outline-2 focus-visible:-outline-offset-2
  focus-visible:outline-brand`, wrapped in a single `<a href
  tabindex="0">` (native link semantics; `tabindex="0"` is required
  because WebKit/Safari's default keyboard-access setting otherwise
  excludes `<a>` from the sequential Tab order — confirmed empirically,
  not assumed). Container `.list` uses `divide-y divide-neutral-200
  overflow-hidden rounded-md border border-neutral-200 bg-white` — the
  `overflow-hidden` is required so a hover/focus background on the
  first/last row clips to the container's rounded corners rather than
  squaring off past them. Class names are `.list-row*`, not
  `.list-item*`: Tailwind's own core `display` plugin defines a
  `.list-item { display: list-item }` utility, and since `@layer
  utilities` is later than `@layer components` in the cascade, a
  same-named component class would have its `display: flex` silently
  overridden — a real bug caught during feature 011's implementation,
  not a hypothetical.
  **CORRECTED GAP** (found by feature 006, fixed by feature 011): this
  entry previously specified `text-xs text-neutral-500` for metadata,
  and Lists had never been implemented as its own standalone component
  — when the ratified metadata pattern was actually used for the first
  time (Card's composed demo, feature 006), a real axe-core scan failed
  it at 4.83:1 (AAA requires 7:1). Feature 011 corrected the token to
  `text-neutral-600` (7.56:1, AAA-compliant, verified via the WCAG
  relative-luminance formula) at the source and shipped the component —
  the same class of "ratified but never empirically verified" gap
  Breadcrumbs had before feature 005. (Table had the identical
  "documented but never built" gap — resolved by feature 012, see the
  Tables entry above.)
- **Avatar**: `.avatar-img` — `rounded-full object-cover` (image variant).
  `.avatar-fallback` — `bg-neutral-100 text-neutral-700 font-medium
  rounded-full` (initials fallback; 9.37:1 AAA, computed via the WCAG
  relative-luminance formula). Two sizes: `h-8 w-8 text-xs` (small,
  dense-list contexts) and `h-10 w-10 text-sm` (large — the same size
  already ratified above for Lists' own avatars, reused verbatim, not
  reinvented).
- **Card**: `.card` — `rounded-lg border border-neutral-200 bg-white p-6
  shadow-sm` (the `rounded-lg`/`border-neutral-200` pair reused verbatim
  from the Modals panel pattern below). Optional `.card-elevated` —
  `transition-shadow duration-150 hover:shadow-md` (the exact transition
  already shipped in `.btn-primary` since feature 001).
- **Alert/Banner**: `.alert` — `flex items-start gap-3 rounded-md p-4`, no
  `role="status"`/`aria-live`/`role="alert"` (static page content,
  distinct from Toast below, which is a transient announcement). Four
  severities follow one formula, `bg-{status}/5 ring-1 ring-inset
  ring-{status}/20-or-10 text-{status}-strong`: success/error/warning
  reuse Badges' exact pattern above verbatim; info — `bg-info/5 ring-1
  ring-inset ring-info/20 text-info-strong` (the `info-strong` token added
  above). Message text `text-neutral-900` (matching Toast's message
  treatment below). Optional dismiss control reuses `close-icon-btn`
  verbatim (Overlays section below) — no new interactive class.
- **Divider/Separator**: shipped in feature 014
  (`src/components/divider/divider.html`). `.divider` — `border-t
  border-neutral-200`, reused verbatim for BOTH the semantic `<hr>`
  thematic-break case and the non-semantic horizontal `role="separator"`
  `<div>` case used inside flex/grid layouts (no second class needed for
  that variant — only orientation, not semantics, changes the box model).
  `.divider-vertical` — `h-full w-px self-stretch bg-neutral-200`, for
  vertical breaks inside toolbars; always non-semantic (`role="separator"
  aria-orientation="vertical"`), since no semantic HTML element for a
  vertical thematic break exists.
- **Kbd**: shipped in feature 014 (`.kbd`,
  `src/components/kbd/kbd.html`) for inline keyboard-shortcut display —
  `rounded-sm border-neutral-300 bg-neutral-50 font-mono text-xs
  text-neutral-700 shadow-sm` (9.86:1 AAA, computed via the WCAG
  relative-luminance formula). Real `<kbd>` element, no ARIA needed
  (native semantics already communicate "this represents keyboard
  input"). Requires `font-mono` (Design Foundations, above) — Command
  Palette's pre-existing inline ⌘K/Ctrl+K markup (feature 008) was
  updated to adopt this shared class rather than continuing to duplicate
  the same utility string.
- **Skeleton**: shipped in feature 014 (`.skeleton` +
  `.skeleton-text`/`.skeleton-avatar-sm`/`.skeleton-avatar-lg`/
  `.skeleton-card`, `src/components/skeleton/skeleton.html`) as a loading
  placeholder — `animate-pulse bg-neutral-200`, avatar presets reusing
  Avatar's exact `h-8 w-8`/`h-10 w-10` sizes and the card preset reusing
  Card's `rounded-lg` verbatim, so a skeleton-to-real-content swap never
  shifts layout. **This is the first `motion-reduce:` handling this
  codebase has ever ratified** — no prior mechanism existed (confirmed by
  grep, not assumed) since every previously-shipped animation was a
  one-shot state-change transition, not a continuous/looping one.
  `motion-reduce:animate-none` (Tailwind's built-in variant, not a raw
  media query) is the established pattern for any future continuous
  animation.
- **Empty State**: shipped in feature 014
  (`src/components/empty-state/empty-state.html`) as **this catalog's
  first purely compositional entry — no new CSS class**. Centered `flex
  flex-col items-center gap-3 py-12 text-center` wrapper; `aria-hidden`
  icon; a real `<h2>`/`<h3>` heading (never a styled `<div>` standing in
  for one); `text-neutral-600` description; optional `.btn-primary`
  action. Built entirely from already-ratified utilities/classes —
  confirmed empirically during implementation that no new class was
  needed, rather than assumed either way going in.
- **AspectRatio**: shipped in feature 015
  (`src/components/aspect-ratio/aspect-ratio.html`) as **this catalog's
  second purely compositional entry — no new CSS class**, matching
  Empty State's precedent. Plain `aspect-[16/9]`/`aspect-square`/
  `aspect-[4/3]` Tailwind utilities backed by the standard `aspect-ratio`
  CSS property (confirmed supported across the full target engine
  matrix). Constrains embedded media to a fixed ratio, preventing layout
  shift as the media loads; the contained element still needs its own
  real `alt`/accessible name — AspectRatio itself adds no new
  accessibility requirement.
- **Indicator**: shipped in feature 015 (`.indicator-wrapper`/
  `.indicator`/`.indicator-error`/`.indicator-success`/
  `.indicator-warning`/`.indicator-info`/`.indicator-neutral`/
  `.indicator-dot`, `src/components/indicator/indicator.html`) as a
  small overlay badge positioned via plain `relative`/`absolute`
  (confirmed empirically that CSS Anchor Positioning is unneeded — an
  Indicator overlays its own direct parent, never a separate top-layer
  element like Tooltip/Popover). Genuinely distinct from the standalone
  Badge component. **Real contrast defect caught before shipping, not
  assumed transferable from Badge**: Badge's own pattern is a 5%-opacity
  tint + `text-{status}-strong`, never `text-white` on the *base* status
  color — the base colors were never calibrated for solid-fill +
  white-text use. Computed directly: `text-white` on the base
  `bg-success`/`bg-warning`/`bg-error`/`bg-info`/`bg-neutral-500`
  measures 2.54:1 / 2.15:1 / 3.76:1 / 3.68:1 / 4.83:1 — all fail this
  catalog's AAA 7:1 floor, four of five fail even AA 4.5:1. Fixed with
  the `-strong` variants (already ratified for Badge/Alert text) as
  solid fills instead: 7.68:1 / 9.07:1 / 8.31:1 / 8.72:1 against white,
  and `neutral-700` (10.31:1) replacing `neutral-500` for the same
  reason — all clear AAA comfortably. The lesson generalizes: re-verify
  the actual computed ratio any time a new component reuses a
  "similar-sounding" existing token in a structurally different way
  (solid fill vs. tint), not just when the token name matches. The badge
  itself is `aria-hidden="true"`; the host's own accessible name (a
  visually-hidden sibling span) MUST include the count/status value for
  the count/status variant.
- **DataList**: shipped in feature 015
  (`src/components/data-list/data-list.html`) as **this catalog's third
  purely compositional entry — no new CSS class**. Real semantic
  `<dl>`/`<dt>`/`<dd>` key-value pairs styled with the same
  `text-sm font-medium text-neutral-900` (label) /
  `text-sm text-neutral-600` (value) pairing already used throughout
  Forms and Empty State — `<dt>`/`<dd>` natively associate each term with
  its description, no ARIA needed.
- **Timeline**: shipped in feature 015 (`.timeline`/`.timeline-item`/
  `.timeline-content`, `src/components/timeline/timeline.html`) as
  **zero JavaScript** — a real `<ol>` (chronological order is
  semantically meaningful) of dated events, each with a real
  `<time datetime="...">` timestamp. Reuses Avatar's
  `.avatar-fallback`/`.avatar-sm` classes verbatim for each event's
  actor. The connecting line (`::before` pseudo-element, `bg-neutral-200`)
  is the same accepted decorative-border exception as Stepper's connector
  and Card/Divider/List — not a new contrast gap.
- **Stat/Metric Card**: shipped in feature 015
  (`src/components/stat-card/stat-card.html`) as **pure composition of
  the existing `.card` class + typography tokens — no new CSS class**,
  confirmed empirically rather than assumed. Trend indicator reuses
  `text-success-strong`/`text-error-strong` verbatim (identical
  text-on-white usage context Badge already established, no new pairing
  to verify). Decorative trend arrows are `aria-hidden="true"`; the
  actual percentage/direction is conveyed in real text, never the glyph
  alone.

### Overlays, Modals & Feedback
- **Modals**: backdrop `fixed inset-0 bg-neutral-500/75 transition-opacity`;
  dialog box `relative transform overflow-hidden rounded-lg bg-white px-4 pb-4
  pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6`.
- **Slide-overs**: right-side entry animation with `transform transition
  ease-in-out duration-500`; `h-full` with `max-w-md`.
- **Toasts/banners**: `fixed top-4 right-4 z-50`, semantic icon on the left,
  explicit close button on the right (`text-neutral-400 hover:text-neutral-500`).
- **Tooltip**: shipped in feature 014
  (`.tooltip-wrapper`/`.tooltip`/`.tooltip-top`,
  `src/components/tooltip/tooltip.html`) as **zero JavaScript** —
  visibility is purely `:hover`/`:focus-within` driven (opacity
  transition, `delay-300` before appearing), positioned via CSS Anchor
  Positioning (`anchor-name`/`position-anchor`/`anchor()`, the same
  cross-engine-verified mechanism as Dropdown Menu) but deliberately
  WITHOUT the Popover API — a tooltip is non-interactive and must never
  contain focusable content (WAI-ARIA tooltip pattern), unlike
  Popover/Dropdown Menu/Combobox's click-triggered dismissible panels.
  **Ratified CSP constraint**: this project's `style-src 'self'` (no
  `unsafe-inline`) silently blocks inline `style="anchor-name:..."` HTML
  attributes — confirmed empirically (a real, previously-undiscovered
  bug: `anchor-name` computed to `none` and the tooltip rendered at the
  wrong position, uncaught by any test that only asserted opacity, not
  actual placement). Fixed via 4 pre-declared numbered
  `.tooltip-anchor-N`/`.tooltip-target-N` class pairs in the stylesheet
  (same-origin rules, unaffected by `style-src`) — any future component
  needing a per-instance CSS custom property MUST use this
  numbered-class technique or a JS-driven CSSOM assignment (see
  Progress, below), never an inline `style` attribute.
- **Progress**: shipped in feature 014
  (`.progress-track`/`.progress-fill`/`.progress-fill-indeterminate`,
  `src/components/progress/progress.html`). `role="progressbar"` with
  `aria-valuenow`/`aria-valuemin`/`aria-valuemax` (indeterminate variant
  omits `aria-valuenow`). Track `bg-neutral-200`, fill `bg-brand-dark`
  (6.38:1 against the track, clearing WCAG 1.4.11's 3:1 non-text floor
  with over double the required margin — computed via the WCAG
  relative-luminance formula, not assumed from Sidebar's unrelated
  text-contrast pairing). Indeterminate fill gated by
  `motion-reduce:animate-none`. Fill width is driven by a small script
  (`src/scripts/progress.js`, `element.style.width` set directly via the
  CSSOM from a `data-value` attribute) rather than a static inline
  `style="width:..."` — the same CSP constraint Tooltip hit (above), but
  fixed with a script instead of numbered classes since a percentage is
  a continuous 0–100 value space, not a small boundable set. Direct
  CSSOM property assignment (`el.style.foo = ...`) is NOT subject to the
  `style-src` check that blocks the inline HTML attribute — the same
  distinction Dropdown Menu's `trigger.style.anchorName = ...` already
  relied on, now made explicit for future components to reuse.
- **Spinner/Loader**: shipped in feature 015
  (`.spinner`/`.spinner-sm`/`.spinner-lg`,
  `src/components/spinner/spinner.html`) as **zero JavaScript** — an SVG
  with `animate-spin` (Tailwind's built-in utility) `text-brand-dark`,
  distinct from Progress's linear/determinate-capable bar. Sizes reuse
  Avatar's exact `h-8 w-8`/`h-10 w-10` scale for visual consistency.
  `role="status"` + `aria-label="Loading"` (no visible text label
  competing for space, but assistive technology still announces the
  loading state). Gated by `motion-reduce:animate-none`, reusing
  Skeleton's precedent (feature 014) for the same class of continuous/
  looping animation.

### Navigation & Disclosure
- **Accordion/Disclosure**: native `<details>`/`<summary>` — zero JavaScript,
  including the single-open-at-a-time ("exclusive") variant, via the native
  shared `name` attribute (HTML Living Standard's exclusive accordion group
  mechanism), not custom JS. Trigger `text-neutral-900`, `hover:text-neutral-700`,
  `active:text-neutral-600`, standard focus-visible ring. Chevron icon
  `text-neutral-400`, rotated via `group-open:rotate-180` (the `<details>`
  element carries `group`). Content `text-neutral-600`. Item divider
  `border-neutral-200`.
- **Tabs**: WAI-ARIA Tabs pattern (roving tabindex, Left/Right/Home/End
  arrow-key navigation) — this project's second component (after
  Modal/Slide-over/Toast) requiring custom JavaScript, since no native
  element covers this keyboard model. Unselected `text-neutral-600`,
  `hover:text-neutral-700 hover:border-neutral-300`, `active:text-neutral-800`,
  selected `border-brand text-neutral-900`, disabled
  `disabled:opacity-50 disabled:cursor-not-allowed` (the literal pattern
  every disabled declaration in this project uses — never a custom color
  substitute). Tab list `border-b border-neutral-200`, `overflow-x-auto`
  for narrow-viewport overflow (scrolls rather than wrapping or truncating,
  preserving the single-row tab metaphor).
- **Dropdown Menu**: native Popover API (`popover="auto"`) provides
  open/close/light-dismiss/top-layer for free — the same relationship
  `<dialog>` has to Modal/Slide-over. A small JS module handles what it
  doesn't: arrow-key roving focus among items, `aria-expanded` syncing on
  the trigger, and Tab-closes-the-menu (WAI-ARIA APG Menu Button
  convention). The panel is anchored under its trigger via **CSS Anchor
  Positioning** (`anchor-name`/`position-anchor`/`anchor()`), each
  instance assigned a unique anchor name at init time — `position:
  absolute` alone does **not** anchor a Popover-API-shown element to its
  DOM ancestor, since promoting an element to the top layer resets its
  containing block to the viewport (a real, previously-shipped bug found
  and corrected in feature 010; verified via `CSS.supports()` that all
  three target browser engines natively support Anchor Positioning
  before adopting it). Panel `bg-white shadow-lg ring-1 ring-neutral-300 rounded-md`.
  Item `text-neutral-900`, `hover:bg-neutral-50`, `active:bg-neutral-100`,
  focus-visible layers `bg-neutral-50` together with — never instead of —
  the standard focus-visible outline (the bg alone does not satisfy this
  principle's outline mandate), disabled `disabled:opacity-50
  disabled:cursor-not-allowed`.
- **Popover**: shipped in feature 014 (`.popover-panel`,
  `src/components/popover/popover.html`, `src/scripts/popover.js`) — a
  generic-content variant of Dropdown Menu's exact mechanism above
  (`popover="auto"` + Anchor Positioning, unique anchor-name per
  instance), but hosting arbitrary content instead of a fixed
  `role="menuitem"` list, so no roving-focus/item-list logic is carried
  over. Two things ARE carried over from Dropdown Menu's `toggle`
  listener: `aria-expanded` sync, and close-path `trigger.focus()`
  (any component hosting real interactive content must return focus
  somewhere sane on close). Adds `position-try-fallbacks: flip-block,
  flip-inline` on `.popover-panel` for viewport-edge repositioning —
  **new coverage Dropdown Menu itself never had** (Dropdown Menu's own
  contract explicitly documents viewport-edge positioning as out of
  scope); verified `position-try-fallbacks` support directly via
  `CSS.supports()` across all three target engines before adopting it,
  the same discipline as Anchor Positioning itself in feature 010. Also
  ships a `MutationObserver` closing the panel if its trigger is removed
  from the DOM while open (native `popover="auto"` panels do not
  auto-close on trigger removal, and an unhandled removed-trigger would
  leave an orphaned floating panel with no way to dismiss it).
- **Context Menu**: shipped in feature 014 (`src/scripts/context-menu.js`,
  `src/components/context-menu/context-menu.html`), reusing Dropdown
  Menu's `.dropdown-menu-panel`/`.dropdown-menu-item` classes verbatim
  but **forking** (not reusing verbatim) its JS: CSS Anchor Positioning
  can only anchor to a real DOM element, never a synthetic cursor
  coordinate, so on `contextmenu` (with `event.preventDefault()` to
  suppress the native browser menu) the panel's `style.left`/`style.top`
  are set imperatively from `event.clientX`/`event.clientY`, clamped
  against `window.innerWidth`/`innerHeight` minus the panel's own
  measured `offsetWidth`/`offsetHeight` so it never renders off-screen.
  Arrow-key roving focus and toggle-driven focus-init (first item on
  open)/focus-return (to the right-clicked target on close) ARE copied
  verbatim from Dropdown Menu, since neither depends on the positioning
  mechanism. **Precedent for future forks**: positioning logic forks
  when the anchor target genuinely differs (element vs. cursor point);
  interaction/focus logic doesn't need to, and shouldn't be
  re-derived, when the underlying widget semantics are identical.

### Advanced Forms & Interaction
- **Combobox**: a from-scratch WAI-ARIA 1.2 combobox — native
  `<input list>`/`<datalist>` was verified insufficient (no ARIA
  combobox/listbox/option roles, no styling control over the suggestion
  popup, inconsistent cross-browser substring-matching behavior, no
  disabled-option or "No results" support) rather than assumed adequate.
  `role="combobox"` on the input with `aria-controls`/
  `aria-activedescendant`/`aria-autocomplete="list"`; `role="listbox"`
  on the popup, hosted via the Popover API (`popover="auto"`, the same
  mechanism Dropdown Menu already established), anchored under the input
  via **CSS Anchor Positioning** (`anchor-name`/`position-anchor`/
  `anchor()`, the identical mechanism and fix as Dropdown Menu's panel —
  `position: absolute` alone does not anchor a Popover-API-shown element
  to its DOM ancestor; a real, previously-shipped bug found and corrected
  in feature 010). Options
  `text-neutral-900`, `hover:bg-neutral-50`, `active:bg-neutral-100`,
  keyboard-active `bg-neutral-100` (reusing Dropdown Menu's exact item
  states, not `bg-brand` — a transient keyboard-focus indicator, not a
  persistent "selected/current" state). Matched substrings render via
  `<mark>` with `font-semibold` on the *same* `text-neutral-900`, not a
  new background highlight color — sidesteps introducing any new,
  unverified contrast pairing entirely. Disabled options use
  `aria-disabled="true"` (never the `disabled` attribute — a `<li>` is
  not a form control) with `opacity-50` plus explicit
  `hover:bg-transparent active:bg-transparent` suppression so a disabled
  row never highlights. `:focus-visible` is intentionally absent from
  option rows: `aria-activedescendant` keeps real DOM focus on the input
  at all times, so the pseudo-class cannot structurally match a row that
  never receives focus — the input's own focus ring is the single focus
  indicator for the entire composite widget, not a gap in Principle V.
- **Command Palette**: reuses Modal's `<dialog>`/`showModal()` chrome
  verbatim (`rounded-lg`/`shadow-xl`/`sm:max-w-lg`) plus this project's
  first document-level global keyboard shortcut — a `keydown` listener
  checking `(event.metaKey || event.ctrlKey) && event.key.toLowerCase()
  === "k"`, guarded against firing while another `<dialog open>` already
  exists. Shares its filter/`aria-activedescendant`/match-highlighting
  model with Combobox (independently implemented per component, not
  imported — the two contexts' DOM/dialog-vs-popover mechanics differ
  enough that the ~45 lines of shared pure logic were judged not worth a
  third shared module, per code review). `overlay.js`'s backdrop-click-
  close and WebKit-safe close-time refocus logic is exposed as an
  exported `wireDialogClose(dialog)` helper (extracted from
  `initDialogTriggers()`'s per-trigger loop, which cannot discover a
  dialog with no `data-dialog-trigger` button) and called once for this
  dialog — Modal/Slide-over's own wiring is unchanged. **Updated in
  feature 014**: its inline ⌘K/Ctrl+K markup now uses the shared `.kbd`
  class (above) instead of duplicating the same utility string inline.
- **PinInput/OTP**: shipped in feature 015 (`.pin-input-box`,
  `src/components/pin-input/pin-input.html`, `src/scripts/pin-input.js`)
  as a segmented one-character-per-box numeric input, built from real,
  separate `<input>` elements (never a single input with visual tricks)
  so each box is genuinely focusable and screen-reader-navigable. Needed
  its own new small JS module — no existing script handled multi-box
  focus distribution — providing per-box numeric filtering with
  auto-advance, Backspace-retreat on an empty box, and paste-splitting
  across the remaining boxes starting from whichever box receives the
  paste (non-numeric content rejected, excess length truncated). Reuses
  TextInput's exact ring/focus treatment (`ring-neutral-300`,
  `focus:ring-brand`) rather than inventing a new focus idiom. Real
  `<fieldset>`/`<legend>` grouping with a per-box `aria-label` (e.g.
  "Digit 1"), since no single visible label covers all boxes.

### Known Catalog Gaps (deliberately deferred, not silently dropped)
- **Date Picker/Calendar, interactive/sortable Data Table, Carousel,
  Chart, Scroll Area, Resizable panels**: evaluated during feature 014's
  research phase (a shadcn/ui + Radix UI Primitives comparison surfaced
  these as genuine gaps against common component-library baselines) but
  deliberately deferred — unlike feature 014's ten shipped components,
  each of these requires a substantially new interaction pattern with no
  existing mechanism in this catalog to extend or reuse. Flagged here for
  whichever future feature takes them on, matching this constitution's
  established practice of recording deferred gaps explicitly (e.g. Table
  was recorded this way before feature 012 built it). **Still deferred as
  of feature 015** — none of these ten components address this list.
- **TreeView, Rating, Menubar, ColorPicker/ColorInput, HoverCard**:
  evaluated during feature 015's research phase (a 10-major-design-system
  comparison — shadcn/ui, Radix UI, MUI, Ant Design, Chakra UI, Mantine,
  Carbon, Polaris, Primer, Fluent 2 — surfaced these as the next tier of
  genuine gaps) but deliberately deferred for the same reason as the list
  above: each needs a substantially new interaction pattern (HoverCard is
  additionally judged redundant with this catalog's existing
  Tooltip+Popover combination, not merely deferred for complexity).
  Flagged here for whichever future feature takes them on, extending
  (not replacing) the list above.

## Governance

**Authority**: this constitution supersedes any individual style practice or
preference. No component is merged into the design system if it violates any of
the Core Principles (I–VII) above.

**Automated AI Validation**: the AI agent is strictly forbidden from approving or
generating HTML code that violates:
1. **Missing interactive states** (Principle V) — summary rejection.
2. **Hardcoded classes** (Principle IV) — automatic interception and conversion
   to the equivalent semantic token before approval.
3. **Non-English project artifacts** (Principle VI) — any code, comment, or
   documentation file written in a language other than English MUST be flagged
   and corrected before approval; this does not apply to the agent's own
   responses to the user, which MUST remain in PT-BR.
4. **Redundant or "dirty" code** — duplicated utility classes or poorly
   structured layouts MUST be cleaned up (prefer `space-y`/`gap` over manual
   repeated spacing on sibling elements) before approval.
5. **Unsafe or unannounced skill installation** (Principle VII) — any external
   skill adopted without passing the trustworthiness/safety/relevance/license
   checks, or installed without informing the user, MUST be rejected/reverted.

**Adopted External Skills** (Principle VII): skills vetted and available for
use in this project —
- `frontend-design` (Anthropic, `claude-plugins-official` marketplace,
  Apache License 2.0) — distinctive visual/UX design guidance (palette,
  typography, layout choices that avoid templated defaults). Resolves the
  TODO(SKILL_REFS) carried since v1.0.0. Verified 2026-07-08: official
  publisher and marketplace, plain-instruction content with no
  scripts/obfuscation, directly relevant to this project's anti-templated-UI
  goal, Apache 2.0 license compatible.

**Repository**: this project's canonical remote is
https://github.com/jonyfs/professional-design-system — constitution amendments,
component contributions, and issue tracking are expected to flow through this
repository once it is populated.

**Amendment Procedure**: changes to this constitution require (a) an explicit
proposal of the principle/section being changed, (b) justification recorded in
the Sync Impact Report at the top of this file, and (c) verification that
dependent templates (`plan-template.md`, `spec-template.md`, `tasks-template.md`,
`checklist-template.md`, and the commands under `.claude/skills/speckit-*/`)
remain consistent.

**Versioning Policy** (Semantic Versioning):
- **MAJOR**: removal or backward-incompatible redefinition of an existing
  principle/section.
- **MINOR**: addition of a new principle or material expansion of an existing
  section.
- **PATCH**: wording fixes, clarifications, non-semantic adjustments.

**Compliance Review**: every component or PR review touching HTML/Tailwind MUST
verify compliance with the Core Principles before approval, including the
English-only artifact requirement in Principle VI. Complexity that violates a
principle requires explicit justification documented in the corresponding
feature plan (`Complexity Tracking` in `plan-template.md`).

**Version**: 1.12.0 | **Ratified**: 2026-07-07 | **Last Amended**: 2026-07-12
