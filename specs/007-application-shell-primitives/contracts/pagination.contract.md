# Component Contract: Pagination

## Markup contract

```html
<nav aria-label="Pagination" data-testid="pagination" class="pagination-nav">
  <button type="button" data-testid="pagination-prev" class="pagination-control" disabled>
    <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true">
      <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clip-rule="evenodd" />
    </svg>
    Previous
  </button>

  <div class="flex items-center gap-1">
    <a href="#" data-testid="pagination-page-1" aria-current="page" class="pagination-link">1</a>
    <a href="#" data-testid="pagination-page-2" class="pagination-link">2</a>
    <a href="#" data-testid="pagination-page-3" class="pagination-link">3</a>
    <span class="pagination-ellipsis" aria-hidden="true">…</span>
    <a href="#" data-testid="pagination-page-10" class="pagination-link">10</a>
  </div>

  <a href="#" data-testid="pagination-next" class="pagination-control">
    Next
    <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true">
      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clip-rule="evenodd" />
    </svg>
  </a>
</nav>
```

Last-page variant (Next disabled, Previous enabled) is a separate demo
instance on the gallery page — same principle as every other component's
"here is state A, here is state B" static demonstration.

## Behavior wiring

None — zero JavaScript.

## Required attributes (Principle II gate, FR-001/FR-002/FR-003)

| Behavior | Mechanism |
|---|---|
| Current page marked and visually distinct | `aria-current="page"` + `.pagination-link[aria-current="page"]` |
| Previous/Next genuinely disabled at boundaries | Native `disabled` attribute on a `<button>` — not a styled `<a>` (Tailwind's `disabled:` variant cannot target an anchor regardless of utility applied) |
| Landmark distinct from other navigation | `<nav aria-label="Pagination">` |
| Truncation conveys omitted pages without misleading assistive tech | `aria-hidden="true"` on the ellipsis `<span>` — it is decorative punctuation, not information; the surrounding page numbers already convey the range |

## Required states (Principle V gate)

| Element | State | Required utility |
|---|---|---|
| `.pagination-link` | resting | `text-neutral-600` |
| `.pagination-link` | hover | `hover:bg-neutral-50 hover:text-neutral-900` |
| `.pagination-link` | active | `active:bg-neutral-100` |
| `.pagination-link[aria-current="page"]` | current page | `bg-brand-dark text-white` |
| `.pagination-link`/`.pagination-control` | focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand` |
| `.pagination-control` | disabled | `disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent` |

`active:` is declared on every interactive class per Principle V's
unconditional mandate — a first draft omitted it entirely across all
three of this feature's components, which `/speckit-analyze` caught as a
CRITICAL gap before implementation.

## Edge cases

- **Single total page (spec.md Edge Case)**: out of scope for a dedicated
  demo variant in this slice — the component's own markup already
  degrades correctly (both Previous and Next would be `disabled`, one
  page link present, marked current) without any special-case markup,
  verified by inspection of the contract's own composition rather than a
  separate required demo.
- **Truncation near the range boundaries (spec.md Edge Case)**: the
  gallery demonstrates the ellipsis appearing only on the side(s) where
  pages are actually omitted (e.g. no leading ellipsis when the current
  page is within the first few pages) — consumer-composed per
  data-model.md, not a JS computation.

## Token allowlist used

`text-neutral-600` (resting link and ellipsis — corrected from an
earlier draft's `text-neutral-500`/`aria-hidden` exemption for the
ellipsis, which `/speckit-analyze` caught: `aria-hidden` only hides
content from assistive technology, not from sighted low-vision users who
still read the glyph visually, so AAA contrast still applies), 
`text-neutral-900` (hover), `bg-brand-dark
text-white` (current page — reusing Button primary's already-AAA-verified
pair, 7.90:1, NOT the ratified Sidebar pattern's literal `bg-brand
text-white`, which research.md R3 found fails AAA). No
raw palette classes (FR-008).

## Acceptance mapping

- FR-001, FR-002, FR-003, FR-004, FR-008, FR-009, FR-010, FR-012 → this contract
- SC-001, SC-002, SC-003, SC-004 → verified by `tests/e2e/pagination.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
