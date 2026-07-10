<!-- SPECKIT START -->
Active feature: `009-react-port-nav-disclosure`. For technologies,
project structure, shell commands, and other implementation context,
read `specs/009-react-port-nav-disclosure/plan.md` (and its
`research.md`, `data-model.md`, `contracts/`, `quickstart.md` siblings).
Features 001-008 are all complete and shipped. Feature 009 ports feature
005's four static components (Breadcrumbs, Accordion, Tabs, Dropdown
Menu) to `packages/react/` — a pure platform port, no new visual/
interaction capability. Accordion keeps the native `<details name>`
exclusive-group mechanism verbatim in JSX (zero React state); Tabs and
Dropdown Menu are reimplemented as idiomatic React hooks. This is the
fourth and final feature in the "cotninue implementando 2 e 3" +
"4 features sequenciais" plan.
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
