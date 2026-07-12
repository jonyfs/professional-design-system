<!-- SPECKIT START -->
Active feature: `014-micro-interaction-primitives`. For technologies,
project structure, shell commands, and other implementation context,
read `specs/014-micro-interaction-primitives/plan.md` (and its
`research.md`, `contracts/`, `quickstart.md` siblings). Features 001-013
are all complete and shipped. Feature 014 ships ten new static
components closing gaps found against shadcn/ui and Radix UI
Primitives: Textarea, Divider, Kbd, Skeleton (P1); Tooltip, Progress,
Button Group, Empty State (P2); Popover (P3); Context Menu (P4).
Tooltip ships with zero JavaScript (CSS Anchor Positioning without the
Popover API). Button Group ships as native radio inputs styled as
segments (zero JS, reusing Accordion's `name`-attribute exclusivity
mechanism) rather than Tabs' custom roving-tabindex widget. Popover
reuses Dropdown Menu's Popover-API/Anchor-Positioning mechanism with
generic content; Context Menu forks Dropdown Menu's JS for
cursor-position anchoring (CSS Anchor Positioning cannot anchor to a
synthetic point). Adds one new design token (`fontFamily.mono` for
Kbd) and this codebase's first `prefers-reduced-motion` handling
(`motion-reduce:animate-none` on Skeleton's pulse, via Tailwind's
built-in variant — no prior mechanism existed to reuse).
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
