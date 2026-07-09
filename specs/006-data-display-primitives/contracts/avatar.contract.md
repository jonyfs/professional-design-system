# Component Contract: Avatar

## Markup contract

```html
<!-- Image variant -->
<img
  src="data:image/svg+xml,...(same-origin placeholder, see implementation)"
  alt="Jane Cooper"
  data-testid="avatar-image-lg"
  class="avatar-img avatar-lg"
/>

<!-- Initials fallback variant (no image available) -->
<span data-testid="avatar-fallback-lg" class="avatar-fallback avatar-lg" aria-label="Alex Morgan">
  AM
</span>

<!-- Small size, both variants -->
<img
  src="data:image/svg+xml,...(same-origin placeholder, see implementation)"
  alt="Sam Rivera"
  data-testid="avatar-image-sm"
  class="avatar-img avatar-sm"
/>
<span data-testid="avatar-fallback-sm" class="avatar-fallback avatar-sm" aria-label="Priya Singh">
  PS
</span>

<!-- Single-word name -> single initial (Edge Case) -->
<span data-testid="avatar-fallback-single" class="avatar-fallback avatar-lg" aria-label="Madonna">
  M
</span>
```

**Image source note**: found during implementation, not planning — an
external image URL (the original draft used a third-party placeholder
service) would be silently blocked by the project-wide CSP's
`default-src 'self'` (no `img-src` directive means images inherit
`default-src`, which does not include arbitrary external origins or even
`data:` by default). Fixed by (a) using a same-origin `data:image/svg+xml`
placeholder instead of an external URL, avoiding both a network dependency
in visual-regression tests and a CSP violation, and (b) adding
`img-src 'self' data:;` to this page's CSP `<meta>` tag — a narrow,
justified addition (same-origin images plus inline data URIs), not a
blanket loosening.

## Behavior wiring

None — zero JavaScript. The image and fallback are two separate,
independently-composable markup blocks (data-model.md); a real consuming
application would choose which to render (or swap via `onerror`) at its
own framework layer, out of scope for this static reference.

## Required attributes (Principle II gate, FR-001/FR-002)

| Behavior | Mechanism |
|---|---|
| Image has an accessible name | `alt` attribute, required whenever `src` is present |
| Fallback has an accessible name | `aria-label` on the `<span>` (the initials text itself is also visually readable, but `aria-label` guarantees the full name is announced, not just the abbreviated initials) |
| Perfect circle at every size | `rounded-full` on both `.avatar-img` and `.avatar-fallback` |
| Non-square source images don't distort | `object-cover` on `.avatar-img` |

## Edge cases

- **Single-word name → one initial, 3+ word name → capped at two initials
  (spec.md Edge Case)**: this is consumer-composed markup (data-model.md),
  not a JS utility — the gallery demo shows both cases explicitly
  (`data-testid="avatar-fallback-single"` for one initial,
  `data-testid="avatar-fallback-lg"` for two) to document the expected
  convention, without this feature owning a name-parsing algorithm.
- **Missing `alt` text**: not silently allowed — every image-variant
  example in this contract and the gallery demo includes one; the
  accessibility scan (`tests/e2e/avatar.spec.ts`) fails loudly on any
  unlabeled `<img>`, same enforcement as every other component's
  `expectNoA11yViolations` check.

## Token allowlist used

`bg-neutral-100`/`text-neutral-700` (fallback background/initials —
9.37:1, deliberately more contrast-safe than the `text-neutral-600` floor
used elsewhere in this feature, per research.md R2/data-model.md). No raw
palette classes (FR-009).

## Acceptance mapping

- FR-001, FR-002, FR-003, FR-009, FR-010, FR-014 → this contract
- SC-002, SC-003 → verified by `tests/e2e/avatar.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
