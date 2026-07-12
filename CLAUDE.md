<!-- SPECKIT START -->
Active feature: `016-advanced-interaction-primitives`. For technologies,
project structure, shell commands, and other implementation context,
read `specs/016-advanced-interaction-primitives/plan.md` (and its
`research.md`, `contracts/`, `quickstart.md` siblings). Features 001-015
are all complete and shipped. Feature 016 ships four new static
components closing the next tier of gaps from the "Known Catalog Gaps"
list ratified in constitution v1.12.0: TreeView, Rating (read-only
display), Menubar, and ColorPicker/ColorInput. Each reuses an
already-ratified mechanism, confirmed empirically rather than assumed:
TreeView is recursively nested native `<details>/<summary>` (verified via
Chromium's real accessibility tree — `<summary>` gets role
`DisclosureTriangle` with correct independent `expanded` state per
instance and correct `level` via `<ul>/<li>` nesting — zero ARIA needed);
Rating's star glyphs reuse the already-ratified `text-warning`/
`text-neutral-300` tokens as a decorative-only pairing (real value always
conveyed via visible text, matching Stepper/Timeline's accepted
decorative-border exception); Menubar composes Dropdown Menu's existing
`initDropdownMenus()` completely unmodified (its `anchorCounter` pattern
already handles multiple independent trigger+panel instances) plus one
new small module (`src/scripts/menubar.js`) adding only the
roving-tabindex-between-top-level-triggers layer adapted from Tabs;
ColorInput is a native `<input type="color">` (border/ring styling
confirmed to apply consistently across all three engines via direct
Playwright inspection), explicitly rejecting a custom JS color-swatch
picker as unnecessary complexity for what the native element already
solves. Date Picker/Calendar, interactive/sortable Data Table, Carousel,
Chart, Scroll Area, Resizable panels, and HoverCard remain on the Known
Catalog Gaps list, deliberately deferred.
<!-- SPECKIT END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
