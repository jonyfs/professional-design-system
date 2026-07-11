<!-- SPECKIT START -->
Active feature: `013-react-port-batch-2`. For technologies, project
structure, shell commands, and other implementation context, read
`specs/013-react-port-batch-2/plan.md` (and its `research.md`,
`contracts/`, `quickstart.md` siblings). Features 001-012 are all
complete and shipped. Feature 013 ports the ten remaining static
components (Pagination, Sidebar, Navbar, Avatar, Card, List, Table,
Alert, Combobox, Command Palette) to `packages/react/`, mirroring
feature 009's porting methodology. Combobox/Command Palette get new
hooks (`useCombobox`, `useCommandPalette`); Command Palette reuses the
existing `useDialogTrigger` hook verbatim rather than re-deriving
dialog-close logic. Pure packaging port — no new visual/interaction
capability beyond each static reference.
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
