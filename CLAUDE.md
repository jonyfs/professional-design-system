<!-- SPECKIT START -->
Active feature: `011-lists-primitive`. For technologies, project
structure, shell commands, and other implementation context, read
`specs/011-lists-primitive/plan.md` (and its `research.md`,
`contracts/`, `quickstart.md` siblings). Features 001-010 are all
complete and shipped. Feature 011 ships Lists as a real static component
(`.list`/`.list-item`), closing a catalog gap flagged in feature 006:
the constitution documented a Lists pattern that was never built, whose
metadata text token (`text-neutral-500`, 4.83:1) failed WCAG AAA —
corrected at the source to `text-neutral-600` (7.56:1 AAA). Reuses the
ratified Avatar component verbatim. Note: Table has the identical
"documented but never built" gap and is being resolved separately in
the upcoming React-port batch feature.
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
