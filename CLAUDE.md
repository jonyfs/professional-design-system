<!-- SPECKIT START -->
Active feature: `017-curated-theme-presets`. Features 001-016 are all
complete and shipped (constitution v1.13.0). Feature 018
(`component-gap-inventory`) is a research-only deliverable, no code.
Feature 017 (this one) is now past planning: `specs/017-curated-theme-
presets/{plan.md,research.md,data-model.md,contracts/,quickstart.md}`
are all written. Confirmed empirically (research.md R1) that migrating
`shared/design-tokens.ts`'s 21 color values to CSS custom properties,
referenced via Tailwind's RGB-tuple opacity-compatible pattern
(`rgb(var(--x) / <alpha-value>)`), toggled via `data-theme` on
`<html>`, restyles every existing component with ZERO markup/component-
file changes — verified via a real 2-theme proof-of-concept including
opacity-modifier utilities (`bg-success/5`). 42 curated theme names are
grounded in two live-fetched real collections (DaisyUI's 35 built-in
themes, Bootswatch's 27) plus well-known standalone GitHub color
schemes (Nord, Dracula, Catppuccin, Gruvbox, Tokyo Night, Rose Pine,
Everforest) — explicitly NOT algorithmically hue-rotated, matching the
original request's "not AI-generated" bar. The 40+ themes × WCAG AAA/AA
bottleneck is resolved by parametrizing the EXISTING `scripts/check-
contrast.mjs` PAIRINGS/RING_PAIRINGS structure to run once per theme,
not hand-verifying 42 times. Implementation is explicitly batched
(plan.md Scale/Scope): P1 ships the architecture + the current palette
re-expressed as the "light" default (a pure refactor, zero visual
change) + 4-5 first new themes; P2-P4 ship the remaining ~37 in batches
of ~10-12. `/speckit-tasks` has not yet been run for this feature.
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
