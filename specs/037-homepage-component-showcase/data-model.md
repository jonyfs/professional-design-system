# Phase 1 Data Model: Homepage Component Showcase

No new persisted entity or component. This is a presentational
restructuring of `index.html`'s existing 114 entries.

## Component Showcase Card (conceptual, not a new type)

| Field | Source | Notes |
|---|---|---|
| `name` | Existing card `<h2>` text | Unchanged |
| `category` | Existing `<section id="...">` grouping (research.md R1) | Unchanged — same 10 categories |
| `href` | Existing `demo-link` `href` | Unchanged — same 114 destination pages |
| `preview` | **New** | A real, `inert`-wrapped fragment of the component's own markup/classes, sourced directly from that component's existing static demo page (`src/components/<slug>/<slug>.html`) — not new markup invented per card (research.md R6) |
| `bentoTier` | **New** | `large` \| `wide` \| `standard` (research.md R5), assigned per component from its real rendered footprint |

## Relationships

- 1:1 with the existing 114 static demo pages already shipped (every
  card's `preview` is a real excerpt of that same page's own markup;
  every card's `href` still points to that same page).
- Grouped under the same 10 `<section>` categories feature 026 already
  established — no new taxonomy.
