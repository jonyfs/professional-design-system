# Contract: Component Showcase Card

## Markup shape

```html
<a href="/src/components/<slug>/<slug>.html" class="showcase-card showcase-card-<tier>">
  <span class="showcase-card-eyebrow font-mono">Category Name</span>
  <div class="showcase-card-preview" inert aria-hidden="true">
    <!-- real excerpt of that component's own static demo markup -->
  </div>
  <span class="showcase-card-name">Component Name</span>
</a>
```

- `inert` on `.showcase-card-preview`: removes the real (possibly
  interactive) component markup from the accessibility tree and tab
  order (research.md R6). `aria-hidden="true"` is redundant-but-
  explicit belt-and-suspenders for browsers without full `inert`
  support parity in assistive tech.
- The outer `<a>` is the ONLY focusable element in the card. Its
  accessible name comes from its visible text content (the eyebrow +
  name spans are NOT `aria-hidden`), never from an `aria-label`
  duplicating visible text.
- `showcase-card-<tier>` (`showcase-card-large` / `-wide` / `-standard`,
  research.md R5) controls `grid-column`/`grid-row` span only — no
  other visual difference in card chrome between tiers.

## States (per `/ui-ux-pro-max` `state-clarity`/`elevation-consistent`)

| State | Treatment |
|---|---|
| Rest | Existing Card-equivalent border + `neutral-50` surface |
| Hover | `translate-y(-4px)` + shadow deepens one step (compositor-only, 150-200ms ease-out) |
| Focus-visible | This catalog's existing 2px `outline-brand` + offset convention — unchanged, never a novel focus style |
| Active | `scale(0.98)` — matches this catalog's existing Button press convention |

## Overlay/triggered component preview rule (research.md R7)

Components normally shown via a trigger (Modal, Toast, Slide-over,
Command Palette, Dropdown Menu, Tooltip, Popover-based) render their
already-open-state markup fragment (excerpted from their own static
demo page) inside the same `inert` wrapper — never a live
`showModal()`/Popover-API invocation, never an auto-dismiss timer.

## Verification gate

1. `npm run audit:tokens` — 0 new/raw Tailwind classes.
2. `npm run audit:contrast` — 0 new findings across all 49 themes.
3. Every one of the 114 cards is reachable and activatable via
   keyboard alone (Tab + Enter), landing on the correct page.
4. Zero elements inside `.showcase-card-preview` are in the tab order
   or accessibility tree (axe-core: 0 violations, specifically no
   nested-interactive-content warnings).
5. No horizontal overflow at 320/768/1024/1440.
6. Full Playwright suite (all specs, all 6 projects) — zero
   regressions.
