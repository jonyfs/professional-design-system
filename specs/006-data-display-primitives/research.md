# Phase 0 Research: Data Display Primitives

## R1. Alert/Banner dismiss mechanism

**Question**: Should the dismissible Alert/Banner variant reuse Toast's
dismiss wiring (`src/scripts/toast.js`) or introduce a new mechanism?

**Decision**: A new, smaller shared script, `src/scripts/alert.js`, not a
reuse of `toast.js`. `toast.js`'s `initToastDismissal()` hardcodes a
`[role="status"]` ancestor selector — Alert/Banner deliberately has no
`role="status"`/`aria-live` (FR-011: it is static page content present at
load, not a transient announcement, so it must not carry live-region
semantics at all, not even `role="alert"`'s implicit `aria-live="assertive"`).
Reusing `toast.js` unmodified would silently fail to find an ancestor to
remove; forking its selector to match Alert/Banner's own markup is simpler
and more honest than parameterizing one shared function for two
semantically different components.

**Rationale**: The actual removal logic (`button.closest(...).remove()`)
is trivially small — duplicating ~4 lines in a differently-scoped file is
clearer than a shared abstraction that has to know about two different
ancestor-selector conventions. Consistent with this project's existing
practice of `overlay.js`/`toast.js` being separate files despite both
being "dismiss a UI element" logic — separation follows semantic
differences (focus-trap vs. non-modal vs. static), not code-reuse
opportunism.

**Alternatives considered**: Parameterizing `toast.js` to accept a
selector — rejected as unnecessary indirection for ~4 lines of logic, and
it would blur the semantic distinction (Toast is transient + announced;
Alert/Banner is static + never announced) that this project's contracts
consistently make explicit per-component rather than papering over with a
shared utility.

## R2. AAA contrast — verified, not assumed (per feature 005's lesson)

**Question**: Which specific token values pass a real axe-core AAA scan
for each component's new text usage?

**Decision**: `text-neutral-600` (7.56:1) as the safe floor for any new
body-text usage, never `text-neutral-500` (4.83:1, AA-only) — feature 005
found this the hard way for Breadcrumbs/Tabs, and this feature applies
that lesson proactively rather than repeating the mistake:

- **Avatar initials fallback**: `bg-neutral-100` background with
  `text-neutral-700` initials (9.37:1 — comfortably AAA, chosen over
  `text-neutral-600` for a stronger fallback treatment since initials are
  often only 1-2 characters and benefit from extra weight/contrast to
  stay legible at small avatar sizes).
- **Card body text**: `text-neutral-600` (7.56:1), consistent with every
  other component's established body-copy token (Tabs' panel content,
  Accordion's content, Modal's body copy all already use this exact
  token).
- **Alert/Banner message text**: `text-neutral-900` for the primary
  message (matching Toast's own message treatment, `text-neutral-900`
  font-medium — Toast and Alert/Banner share the same "icon + message +
  optional close button" layout family) — verified via axe-core during
  implementation, not assumed correct because Toast already uses it in a
  visually similar layout.

**Verified, not assumed**: all three will be run through a real
`@axe-core/playwright` scan during implementation (per every prior
feature's discipline) — this section states the planned tokens, not a
final guarantee; any scan failure gets corrected the same way feature
005's was, before merge.

## R3. Card visual treatment — no pre-existing ratified pattern

**Question**: Does the constitution's existing Data Display & Listings
catalog entry cover Card, or is this a new pattern to propose?

**Decision**: New pattern to propose (like Accordion/Tabs/Dropdown Menu in
feature 005) — the constitution's existing entries (Tables, Badges,
Lists) don't cover a generic content-container component. Proposed:
`rounded-lg border border-neutral-200 bg-white shadow-sm` at rest,
`hover:shadow-md transition-shadow duration-150` for the optional
hover-elevation variant (reusing the exact `rounded-lg`/border token
combination the constitution's ratified Modals pattern already uses for
its panel, and the exact `hover:shadow-md` transition already shipped in
`.btn-primary` since feature 001 — no new visual vocabulary invented).

**Rationale**: Reusing already-ratified, already-AAA-verified tokens
(`border-neutral-200`, `rounded-lg`) rather than inventing new ones keeps
this feature from needing any new Base Semantic Palette entries — same
verification discipline as feature 005's research.md R3.

## R4. Avatar sizing — Tailwind arbitrary sizes vs. a fixed scale

**Decision**: Two fixed sizes only (FR-003's "at least two"), reusing the
constitution's existing ratified Lists avatar size (`h-10 w-10`, already
shipped) as the "large" size, and adding `h-8 w-8` as the "small" size for
dense list contexts (comments, compact member lists) — both from
Tailwind's standard spacing scale, no arbitrary values. `rounded-full` is
already a ratified token (v1.3.0).

**Alternatives considered**: An arbitrary/configurable size prop — out of
scope; this feature ships a fixed, ratifiable two-size scale like every
other sized primitive in this project (Badge has one size, Toggle has one
size), not an open-ended sizing API.

## R5. Testing strategy: consistent with every prior feature

**Decision**: Same Playwright visual regression + axe-core pattern.
Linux baselines generated via `update-snapshots.yml`'s `workflow_dispatch`
only — never locally, never via local Docker. New component pages MUST be
added to `vite.config.ts`'s `rollupOptions.input` as part of the
implementation task itself (not a follow-up fix) — feature 005's real,
code-review-caught bug (pages 404'd in a production build despite passing
tests against the dev server) is now a known failure mode this feature
must not repeat.

## R6. No CSP or new-JS-dependency concerns

**Decision**: `alert.js` is same-origin `<script type="module">`, already
covered by the existing project-wide CSP (`script-src 'self'`) with no
changes needed, consistent with every prior feature that added JS
(003, 005).
