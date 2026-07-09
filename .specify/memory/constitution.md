<!--
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
    "success-strong": "#065F46", "warning-strong": "#78350F", "error-strong": "#991B1B"
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
other non-text decoration.

### Typography & Text Scale
- Family: `font-sans` (Inter, system-ui, sans-serif), with `antialiased` always
  active.
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
- **Sidebar**: `bg-neutral-900`/`text-neutral-400` (dark) or `bg-white` with
  `border-r border-neutral-200` (light). Active: `bg-brand text-white`. Hover:
  `bg-neutral-100`/`bg-neutral-800` with `transition-colors duration-150`.
- **Navbar/Header**: `sticky top-0 z-40`, `backdrop-blur-md bg-white/80`,
  `border-b border-neutral-200`. Hamburger button restricted to `lg:hidden` with
  an expanded touch target.
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

### Data Display & Listings
- **Tables**: header `bg-neutral-50 text-left text-xs font-semibold
  text-neutral-600 uppercase tracking-wider`; rows with optional zebra striping
  (`even:bg-neutral-50`) and `divide-y divide-neutral-200`; cells `px-6 py-4`.
- **Badges**: success `bg-success/5 text-success-strong ring-1 ring-inset
  ring-success/20`; error `bg-error/5 text-error-strong ring-1 ring-inset
  ring-error/10`; warning `bg-warning/5 text-warning-strong ring-1 ring-inset
  ring-warning/10`; neutral `bg-neutral-50 text-neutral-600 ring-1 ring-inset
  ring-neutral-500/10`. Background and ring both use the base status token via
  Tailwind's opacity modifier (`/5` background, `/20` or `/10` ring); text uses
  the AAA-safe `-strong` variant. All three are already-ratified tokens — no
  raw palette classes anywhere in the pattern.
- **Lists**: avatars `rounded-full h-10 w-10`; title `text-sm font-semibold
  text-neutral-900`; metadata `text-xs text-neutral-500`; interactive item
  `hover:bg-neutral-50`.

### Overlays, Modals & Feedback
- **Modals**: backdrop `fixed inset-0 bg-neutral-500/75 transition-opacity`;
  dialog box `relative transform overflow-hidden rounded-lg bg-white px-4 pb-4
  pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6`.
- **Slide-overs**: right-side entry animation with `transform transition
  ease-in-out duration-500`; `h-full` with `max-w-md`.
- **Toasts/banners**: `fixed top-4 right-4 z-50`, semantic icon on the left,
  explicit close button on the right (`text-neutral-400 hover:text-neutral-500`).

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
  convention). Panel `bg-white shadow-lg ring-1 ring-neutral-300 rounded-md`.
  Item `text-neutral-900`, `hover:bg-neutral-50`, `active:bg-neutral-100`,
  focus-visible layers `bg-neutral-50` together with — never instead of —
  the standard focus-visible outline (the bg alone does not satisfy this
  principle's outline mandate), disabled `disabled:opacity-50
  disabled:cursor-not-allowed`.

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

**Version**: 1.4.0 | **Ratified**: 2026-07-07 | **Last Amended**: 2026-07-09
