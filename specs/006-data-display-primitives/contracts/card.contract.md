# Component Contract: Card

## Markup contract

```html
<div data-testid="card-default" class="card max-w-sm">
  <h3 class="text-lg font-semibold text-neutral-900">Team standup notes</h3>
  <p class="mt-2 text-sm text-neutral-600">
    Weekly summary of blockers, wins, and next steps from the engineering team.
  </p>
  <a href="#" class="demo-link mt-4 inline-block">Read more →</a>
</div>

<div data-testid="card-elevated" class="card card-elevated max-w-sm">
  <h3 class="text-lg font-semibold text-neutral-900">Hover to elevate</h3>
  <p class="mt-2 text-sm text-neutral-600">
    This card's shadow deepens on hover, signaling that it is interactive.
  </p>
</div>

<div data-testid="card-composed" class="card max-w-sm">
  <div class="flex items-center gap-3">
    <img
      src="data:image/svg+xml,...(same-origin placeholder, see implementation)"
      alt="Jane Cooper"
      class="avatar-img avatar-lg"
    />
    <div>
      <p class="text-sm font-semibold text-neutral-900">Jane Cooper</p>
      <p class="text-xs text-neutral-600">Product Designer</p>
    </div>
    <span class="ml-auto inline-flex items-center rounded-md bg-success/5 px-2 py-1 text-xs font-medium text-success-strong ring-1 ring-inset ring-success/20">
      Active
    </span>
  </div>
</div>
```

## Behavior wiring

None — zero JavaScript. `.card-elevated`'s hover state is pure CSS
(`transition-shadow`).

## Required attributes (Principle I/II gate, FR-004/FR-005)

| Behavior | Mechanism |
|---|---|
| Visually-distinct container | `border border-neutral-200` + `shadow-sm` together (not just one), separating the card from both a white and a tinted page background |
| Hover elevation, no layout shift | `hover:shadow-md` only — no dimension, padding, or margin change on hover |

## Edge cases

- **Uneven card heights in a row (spec.md Edge Case)**: this feature ships
  variable-height cards as the default and documented behavior — a
  consumer arranging cards in a CSS Grid can opt into equal-height rows
  via `grid` + `items-stretch` (ordinary Tailwind/CSS grid behavior, not a
  Card-specific feature), so no minimum-height utility is imposed by
  `.card` itself, keeping it composable for both equal- and variable-height
  layouts.

## Token allowlist used

`border-neutral-200`, `rounded-lg` (both reused verbatim from the
constitution's ratified Modals panel pattern), `text-neutral-900` (heading),
`text-neutral-600` (body copy, matching every other component's body-copy
token in this project). No raw palette classes (FR-009).

**Real AAA finding**: the composed demo's metadata line originally
followed the constitution's own ratified Lists pattern verbatim
(`text-xs text-neutral-500` for "metadata") — a real axe-core scan failed
it at 4.83:1. Corrected to `text-neutral-600` (7.56:1) here. The
constitution's Lists entry itself has never been implemented as a
standalone shippable component (unlike Breadcrumbs, which feature 005
implemented and corrected), so this latent gap in the ratified catalog
remains for whichever future feature actually ships Lists to find and fix
— noted here rather than silently worked around, since this is the exact
"ratified but never empirically verified" pattern feature 005 already
taught this project to watch for.

## Acceptance mapping

- FR-004, FR-005, FR-009, FR-010, FR-014 → this contract
- SC-002, SC-003, SC-005 → verified by `tests/e2e/card.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
