<!-- SPECKIT START -->
Active feature: `012-table-primitive`. For technologies, project
structure, shell commands, and other implementation context, read
`specs/012-table-primitive/plan.md` (and its `research.md`,
`contracts/`, `quickstart.md` siblings). Features 001-011 are all
complete and shipped. Feature 012 ships Table as a real static
component (`.data-table`/`.data-table-header-cell`/`.data-table-cell`),
closing the "documented but never built" catalog gap discovered during
feature 011's planning. Unlike Lists, the documented pattern's contrast
was already AAA-correct — verified, not corrected. Named `.data-table*`,
not `.table*`: Tailwind's own core `display` plugin defines `.table`/
`.table-cell`/`.table-row` utilities that would collide, the same class
of bug feature 011 found for `.list-item`. React port deferred to
feature 013.
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
