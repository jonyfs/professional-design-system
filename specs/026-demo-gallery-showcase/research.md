# Research: Demo Gallery Visual Showcase

## R1: Category mapping method

**Decision**: Map each of the 78 shipped components to whichever
Component Catalog section it already appears under in
`.specify/memory/constitution.md` (Application & Navigation; Forms,
Validation & Inputs; Data Display & Listings; Overlays, Modals &
Feedback; Navigation & Disclosure; Advanced Forms & Interaction) —
rather than inventing a new taxonomy. Two additions beyond the
constitution's 6: a **Composed Examples** category for the 3
page-level composition demos (`composed-example`, `dashboard-example`,
`settings-example` — these were never meant to be discovered alongside
atomic components) and a standalone **Theming** entry for
`theme-gallery.html` (the constitution's own Theming & Multi-Palette
Architecture section, not part of the atomic Component Catalog).

**Rationale**: The constitution is already the authoritative,
consistently-applied categorization for this catalog — reusing it
guarantees the gallery's grouping never drifts from how this project
already thinks about its own components, and required zero new
judgment calls about where an ambiguous component belongs (the
constitution already made that call when the component shipped).

**Alternatives considered**: A fresh, gallery-specific taxonomy
(e.g. grouped by "how novel the interaction is" or "how often it's
used"). Rejected — would create a second, competing categorization
this project would need to keep in sync with the constitution's own
forever after.

## R2: Flagship component selection (FR-004)

**Decision**: Data Table, Chart, Command Palette, and the curated
theme system are this batch's flagship treatment — each gets a larger
card (spanning 2 grid columns at wide viewports), a one-line "why this
matters" note, and placement at the top of its category rather than
alphabetical/insertion order.

**Rationale**: These four represent the largest, most differentiated
engineering investment in this catalog (DataTable: full CRUD + bulk
actions from scratch; Chart: 11 Recharts types with live re-theming;
Command Palette: from-scratch WAI-ARIA + global shortcut; curated
theming: 40+ themes with live cross-page persistence) — exactly the
"standout capabilities" spec.md US1 asks the opening section to
communicate, made concrete in the grid itself rather than only
mentioned in prose.

**Alternatives considered**: Flagging every component that "took real
effort." Rejected — diluting the signal defeats the purpose; spec.md
FR-004 explicitly asks for components that are visually distinguished
FROM routine primitives, which only works if most stay routine.

## R3: Opening/hero section content (FR-001)

**Decision**: A new section above the categorized grid stating: total
component count, dual-surface shipping (static HTML + React, identical
behavior), WCAG AAA accessibility as a structural commitment (not a
checkbox), and the curated theming system (40+ themes, live
re-coloring) — each as a short, concrete stat/claim, not marketing
copy.

**Rationale**: Directly satisfies spec.md SC-001 ("identify at least
2-3 differentiating strengths" from the opening section alone) with
verifiable, specific claims rather than vague superlatives — consistent
with this catalog's own established voice (every existing constitution
entry favors concrete facts over adjectives).

## R4: Quick-jump navigation mechanism (FR-003)

**Decision**: Native same-page anchor links (`<a href="#category-id">`)
in a small sticky or top-of-page nav strip — zero JavaScript, matching
this catalog's own zero-JS-where-possible convention (the majority of
its components are already zero-JS).

**Rationale**: The simplest mechanism that satisfies "navigate to a
category within 1 interaction" (spec.md SC-003) — no new JS module, no
new dependency, works identically whether or not the user has
JavaScript enabled at all (a stronger guarantee than a JS-driven
smooth-scroll-with-highlight approach would give).

**Alternatives considered**: A JS-driven scrollspy nav highlighting the
current section. Rejected for this batch — real added value, but
adds interaction-state complexity (Principle V's full state set) for a
navigation aid that native anchors already satisfy; can be a future
enhancement, not required to meet this feature's own success criteria.

## R5: Individual demo-page polish (FR-006) — scripted, not bespoke

**Decision**: Apply a single, consistent structural wrapper (a
slightly more considered header treatment + section spacing rhythm)
to all 77 pages via a script
(`scripts/apply-demo-page-polish.mjs`), mirroring feature 025's
`apply-theme-rollout.mjs` pattern exactly — mechanical, idempotent,
verified by a completeness check, not 77 individually hand-crafted
redesigns.

**Rationale**: 77 bespoke redesigns is a different scale of effort
than this feature can responsibly deliver in one pass, and spec.md's
own User Story 3 is explicitly lower priority (P2) than the gallery
index redesign (P1) — a uniform, real improvement to every page beats
a bespoke deep redesign of a handful and no change to the rest.

**Alternatives considered**: Hand-crafting a subset (e.g. the 4
flagship components' own demo pages) more deeply, leaving the rest
untouched. Considered for a future batch, but rejected for this pass
since spec.md FR-006 asks for improvement across "any individual
component demo page," not a curated subset — the uniform approach
covers 100% of pages, matching that requirement's actual scope.

## Summary

- Categories reuse the constitution's own existing Component Catalog
  structure, plus Composed Examples and Theming.
- 4 flagship components get visually distinct treatment: Data Table,
  Chart, Command Palette, curated theming.
- Opening section makes concrete, verifiable claims, not marketing
  copy.
- Quick-jump nav is native anchor links, zero JavaScript.
- Individual demo pages get one uniform, scripted polish pass, not 77
  bespoke redesigns.
