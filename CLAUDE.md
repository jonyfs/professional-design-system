<!-- SPECKIT START -->
Active feature: `004-react-component-library`. For technologies, project
structure, shell commands, and other implementation context, read
`specs/004-react-component-library/plan.md` (and its `research.md`,
`data-model.md`, `contracts/`, `quickstart.md` siblings). Features
`001-primitive-components`, `002-form-primitives-round-2`, and
`003-overlays-modal-toast` are complete and shipped as a static HTML +
Tailwind gallery — see their own `plan.md` files for that context.
Feature 004 adds a React + TypeScript package (`packages/react/`) for
Claude Design compatibility WITHOUT deprecating the static gallery; see
its research.md for the build-tool/testing-strategy decisions.
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
