# Research: Sitewide Theme Selector & Persistence

## R1: Confirming the exact rollout unit (verified against live source)

**Decision**: Every page needs exactly 3 additions, all copied verbatim
from `index.html`'s own already-shipped markup/scripts:

1. In `<head>`, immediately after the `<link rel="stylesheet"
   href="/src/styles/tailwind.css" />` line:
   ```html
   <script type="module" src="/src/scripts/theme-switcher.js"></script>
   ```
2. Somewhere sensible in the page body (a header/intro area, matching
   `index.html`'s placement of its own selector) — the exact `<select>`
   + `<label>` block:
   ```html
   <div class="mt-4 max-w-xs">
     <label for="gallery-theme-select" class="text-sm font-medium text-neutral-900">
       Preview theme
     </label>
     <select id="gallery-theme-select" data-testid="gallery-theme-select" class="form-select">
       <!-- <optgroup>/<option>s populated by gallery-theme-selector.js -->
     </select>
   </div>
   ```
3. Before `</body>`:
   ```html
   <script type="module" src="/src/scripts/gallery-theme-selector.js"></script>
   ```

**Rationale**: `gallery-theme-selector.js`'s `initGalleryThemeSelector()`
looks up the control by a fixed, generic id
(`document.getElementById("gallery-theme-select")`) — not
gallery-specific despite the file/variable naming — so the identical
markup and script work unmodified on every page. Verified directly
against the script's source, not assumed.

**Alternatives considered**: Giving each page a unique select id.
Rejected — unnecessary, the existing script already works generically,
and a shared id keeps every page's markup byte-for-byte identical
(simpler to verify/template, no per-page variation to get wrong).

## R2: Per-page insertion point for the selector markup

**Decision**: Insert the selector block immediately after each page's
`<h1>` (and its following descriptive `<p>`, where one exists) — the
same position `index.html` uses relative to its own header content.

**Rationale**: Every existing static page already follows this same
`<h1>` + optional `<p>` intro pattern (confirmed across the sample
already read this session: `button.html`, `avatar.html`, `sidebar.html`,
`kbd.html`, etc.) — inserting at the same relative position keeps the
rollout uniform and matches this catalog's own "every page looks like
it belongs to the same system" standard, rather than each page getting
a differently-placed control.

**Alternatives considered**: A shared, injected header/footer via a
build-time include mechanism. Rejected — this static site has no
templating/include system (every page is deliberately self-contained,
independently viewable, and copy-pasteable per `index.html`'s own
stated purpose: "open it directly to copy its markup") — introducing
one now would be a materially larger architectural change than this
feature's actual scope.

## R3: Verification strategy for 77 files

**Decision**: A single Playwright spec asserts two things across a
representative, cross-category sample of pages (not literally all 77,
to keep the suite fast — pattern already established by this
project's own audit scripts, which sample representatively rather than
exhaustively where appropriate): (a) theme persists across a
multi-page navigation sequence, and (b) every page in the sample has
both the activation script's effect (a `data-theme` attribute present
on `<html>` before first meaningful paint) and the selector control
present and functional.

**Rationale**: A full 77-page exhaustive Playwright suite would be
slow and low-signal past a representative sample, given every page
receives byte-for-byte identical markup/script — the risk isn't
per-page logic bugs (there is no per-page logic), it's a page that
was missed or malformed during the mechanical rollout, which a
lightweight, scriptable "does every file contain both required
snippets" check (not a browser test) catches more directly and
completely than a slow, exhaustive Playwright pass.

**Alternatives considered**: Testing all 77 pages via Playwright.
Rejected as disproportionate given the uniform, mechanical nature of
the change — a static content-presence check plus a representative
behavioral sample gives equivalent real confidence for far less
runtime cost.

## Summary

- 3 identical additions per page, copied verbatim from `index.html`'s
  own already-shipped, already-verified markup and scripts.
- No script/markup changes — `gallery-theme-selector.js`'s generic id
  lookup already works page-agnostically.
- Verification: a content-presence check across all 77 files + a
  Playwright behavioral spec against a representative sample.
