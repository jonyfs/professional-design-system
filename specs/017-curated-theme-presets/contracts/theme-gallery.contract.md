# Contract: Theme Gallery

## Markup contract

```html
<div class="theme-gallery" data-testid="theme-gallery">
  <section aria-labelledby="mood-light-professional">
    <h2 id="mood-light-professional" class="text-lg font-semibold text-neutral-900">Light Professional</h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <button
        type="button"
        class="theme-card"
        data-testid="theme-card-corporate"
        data-theme-id="corporate"
        aria-pressed="false"
      >
        <span class="theme-card-swatches" aria-hidden="true">
          <span class="theme-card-swatch"></span>
          <!-- swatch background color is set via CSSOM
               (element.style.backgroundColor = "...") by
               theme-switcher.js after this markup renders, NEVER an
               inline style="..." HTML attribute (this project's CSP,
               feature 014 R12) — this element intentionally carries NO
               style attribute at all in the shipped markup; CSSOM
               assignment populates the `style` PROPERTY at runtime,
               which is not the same as authoring a `style="..."`
               attribute in HTML and is unaffected by `style-src 'self'` -->
        </span>
        <span class="theme-card-name">Corporate</span>
      </button>
      <!-- ... one .theme-card per theme in this mood family ... -->
    </div>
  </section>
  <!-- ... one <section> per mood family (7 total) ... -->
</div>

<div class="mt-8 rounded-lg border border-neutral-200 p-6" data-testid="theme-preview-region">
  <!-- Representative component sample: Button, Badge, Card, Alert,
       TextInput — the SAME components every theme-switch restyles live,
       matching research.md R4's decision. -->
</div>
```

```css
.theme-card {
  @apply flex flex-col items-center gap-2 rounded-md border border-neutral-200
    p-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
    focus-visible:outline-brand;
}
.theme-card[aria-pressed="true"] {
  @apply border-brand-dark ring-2 ring-brand-dark;
}
.theme-card-swatches {
  @apply flex gap-1;
}
.theme-card-swatch {
  @apply h-6 w-6 rounded-full;
}
```

Selecting a `.theme-card` calls `selectTheme(cardId, knownThemeIds)`
(from `theme-switcher.js`) and sets `aria-pressed="true"` on the
selected card / `"false"` on all others — a real toggle-button group
pattern (`role` implicit via native `<button>` + `aria-pressed`, matching
WAI-ARIA's toggle button convention, not a new ARIA idiom for this
catalog).

**Swatch colors are set via CSSOM (`element.style.backgroundColor =
...`), never an inline `style="..."` HTML attribute** — this project's
CSP (`style-src 'self'`) silently blocks the latter (the hard lesson from
feature 014's R12, reused here since each theme card's swatch colors are
inherently per-instance dynamic values, the same class of problem
Progress's fill-width and Tooltip's anchor-name solved).

## Required attributes

- `aria-pressed` on every `.theme-card`, toggled correctly on selection
- Each mood-family `<section>` has a real `<h2>` (not a styled `<div>`)
  labeled via `aria-labelledby`, matching this catalog's established
  heading-hierarchy discipline

## Token allowlist used

`border-neutral-200`, `text-neutral-700`, `bg-neutral-50`,
`border-brand-dark`, `ring-brand-dark`, `outline-brand` — all
already-ratified, reused verbatim. No new tokens (theme colors
themselves are the existing 21 tokens, now multi-valued per research.md
R1 — not new tokens in the Principle IV sense).

## Acceptance mapping

- FR-001, FR-003, FR-004, SC-001, SC-004, SC-005 →
  `tests/e2e/theme-gallery.spec.ts`, `tests/e2e/theme-restyle.spec.ts`
