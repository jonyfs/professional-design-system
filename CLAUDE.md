<!-- SPECKIT START -->
Active feature: `003-overlays-modal-toast`. For technologies, project
structure, shell commands, and other implementation context, read
`specs/003-overlays-modal-toast/plan.md` (and its `research.md`,
`data-model.md`, `contracts/`, `quickstart.md` siblings). Features
`001-primitive-components` and `002-form-primitives-round-2` are complete
and shipped — see their own `plan.md` files for that context. Feature 003
is the first to introduce vanilla JS (`src/scripts/overlay.js`,
`src/scripts/toast.js`) — see its research.md for why.
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
