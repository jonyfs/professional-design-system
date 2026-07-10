<!-- SPECKIT START -->
Active feature: `010-fix-popover-positioning`. For technologies,
project structure, shell commands, and other implementation context,
read `specs/010-fix-popover-positioning/plan.md` (and its `research.md`,
`contracts/`, `quickstart.md` siblings). Features 001-009 are all
complete and shipped. Feature 010 is a correctness bug fix (not a new
component): Dropdown Menu's panel (005 + its 009 React port) and
Combobox's listbox (008) don't visually anchor to their trigger/input,
because Popover-API top-layer promotion resets `position: absolute`'s
containing block to the viewport. Fixed with the CSS Anchor Positioning
API (`anchor-name`/`position-anchor`/`anchor()`), confirmed natively
supported in all three target browser engines via direct testing.
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
