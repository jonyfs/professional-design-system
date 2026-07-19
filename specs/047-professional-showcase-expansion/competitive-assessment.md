# Competitive & Quality Assessment

**Feature**: 047-professional-showcase-expansion (User Story 3 deliverable)
**Date**: 2026-07-19
**Method**: direct inspection of the current catalog state (component exports, constitution history, feature 044's audit findings, this feature's own showcase-composition work) — not assumed or reconstructed from memory.

## Summary

The catalog is broad and disciplined (137 exported React components, 100% passing token-discipline and contrast audits, 43-theme runtime restyle, WCAG 2.2 AAA enforced by CI) but has three concrete gaps that separate "broad component library" from "competitive, production-ready design system": (1) a small but real set of visually generic/template-looking components, (2) five still-missing interaction patterns common to peer systems, and (3) a demonstrated, recurring build-pipeline defect class that has silently shipped broken CSS in the npm package at least three times. None of these are new discoveries invalidating prior work — they sharpen and, in one case, extend what's already tracked.

## 1. Visual quality: 20 components flagged, none yet remediated

Feature 044's audit scored every catalog component against the constitution's 10 Required Qualities (`rules/web/design-quality.md`) and flagged 20 as under-scoring (< 4/10), three of which explicitly match a named banned pattern: **card** ("uniform radius/spacing/shadows everywhere"), **data-table** ("flat layouts with no layering"), **dashboard-example** ("dashboard-by-numbers... no point of view"). Full list and scores: `specs/044-component-catalog-modernization/audit-findings.md`.

**Still true after this feature**: none of these 20 have been visually remediated — feature 044 explicitly deferred the fix (correctly) because `card`/`data-table`'s underlying classes are shared across dozens of consumers, and a real fix has a snapshot-regeneration blast radius that wasn't safely completable alongside 043/045/046 in one session.

**This is the single highest-leverage next investment**: `card` and `data-table` are two of the most-reused primitives in the entire catalog (this feature's own 5 screens use Card in 4 of them, DataTable in 2) — their visual quality sets the ceiling for how "professional" *every* consuming screen can look, including this showcase.

## 2. Five interaction patterns still absent

Per the constitution's "Known Catalog Gaps" (as of feature 024, unchanged since): **Date Picker/Calendar, Carousel, Scroll Area, Resizable panels, HoverCard**. Chart and interactive Data Table — the two biggest historical gaps — have both since shipped (features 020/022/024), which is real progress; these five are what's left.

Of these, **Date Picker/Calendar** is the most consequential gap for a "competitive" judgment: it's the single most common non-trivial form control in real products (booking, scheduling, filtering by date range) and its absence is the most likely reason a prospective adopter building a real product would still need to reach for an external library on day one. Carousel, Scroll Area, Resizable panels, and HoverCard are comparatively niche (HoverCard is arguably redundant with the existing Tooltip+Popover combination, as the constitution already notes) and lower priority.

## 3. A recurring, previously-undetected build-pipeline defect class

Three independent, real defects were found in this session alone by the same mechanism (composing components into this feature's real screens, not isolated demos) — all in the **same underlying subsystem**, not three unrelated bugs:

1. **`packages/react/src/styles.css` hand-maintained subset drift** (feature 044, T012b): 11 of 27 newly-wrapped components shipped zero CSS in the npm package because the hand-maintained CSS subset was never updated to match the main site's `tailwind.css`.
2. **Template-literal class-name purge** (this feature): `Stepper`'s and `Tooltip`'s variant classes (`stepper-step-${status}`, `tooltip-anchor-${anchor}`, `tooltip-target-${anchor}`) were silently dropped from the compiled npm CSS because Tailwind's content scanner can't see a class name that only exists as a runtime-interpolated string — the *same root cause* already documented and fixed once before for `sidebar-${theme}`, but not generalized into a check that would catch the next occurrence. Tooltip's case is severe: CSS Anchor Positioning never worked for any Tooltip instance shipped via npm.
3. Both of the above were invisible to every existing automated gate (`audit:tokens`, `audit:contrast`, the full Playwright E2E suite) because those gates test the *main site's* build output, not the *published npm package's* compiled CSS — a structural blind spot, not a one-off oversight.

**Concrete recommendation**: add an automated check — even a simple one, e.g. grep every exported component's JSX for `className` string literals and template-literal patterns, cross-reference against `packages/react/dist/styles.css`'s actual selector list post-build — to CI. Without this, a fourth instance of the same defect class is a matter of when, not if, and it will keep being invisible until someone happens to compose the affected component into a real screen.

## 4. What's genuinely competitive already (not just gaps)

For balance, since an assessment that only lists gaps isn't actionable: the 43-theme runtime restyle architecture (RGB-tuple CSS custom properties, zero markup mutation), the WCAG 2.2 AAA-by-default posture enforced in CI (not just AA), and the Recharts chart-type breadth (11 native chart types, all theme-reactive with zero manual color config) are all differentiators most peer component libraries at this scale don't have as a baseline, not an opt-in.

## Cross-reference: does this repeat what's already tracked?

Per spec.md's Acceptance Scenario 2 — checking against feature 044's 20 flagged components and the constitution's deferred list: **items 1 and 2 above confirm and sharpen already-tracked findings** (the 20 flagged components are still exactly 20; the deferred interaction-pattern list is unchanged since feature 024). **Item 3 is new**: the "template-literal purge" root cause was previously documented once (for `sidebar-${theme}`) but never generalized into "this is a recurring defect class that needs a systemic check" — that framing, and the recommendation to automate detection, is this assessment's own addition.
