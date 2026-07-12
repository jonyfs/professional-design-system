<!-- SPECKIT START -->
Active feature: `018-component-gap-inventory`. Features 001-016 are all
complete and shipped (constitution v1.13.0). Feature 017
(`curated-theme-presets`, spec.md only — 40+ pre-built palette themes
requested by the user) is PARKED at the spec stage, awaiting
`/speckit-plan`. Feature 018 (`component-gap-inventory`) is a
research-only deliverable (see `specs/018-component-gap-inventory/
research.md`): 105 genuine, non-duplicate UI component candidates
cross-referenced against PrimeReact (78 components) and Mantine (117
components, both fetched live) plus Ant Design/Radix Primitives, grouped
into 13 categories with a buildability signal per entry, explicitly
separated from page-level content-block patterns (pricing tables, hero
sections, etc. — excluded, matching this project's precedent that
compositions aren't cataloged as components) and from this catalog's
existing 47 shipped components + 7 already-recorded Known Catalog Gaps
(Date Picker/Calendar, interactive Data Table, Carousel, Chart, Scroll
Area, Resizable panels, HoverCard). Feature 018 ships NO code — it is
the roadmap input for future features to select curated slices from, the
same way 014→015→016 each built a slice of a larger research pass. No
plan/tasks/implementation cycle follows this feature by design.
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
