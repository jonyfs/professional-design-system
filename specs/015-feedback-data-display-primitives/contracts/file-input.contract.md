# Component Contract: File Input

## Markup contract

```html
<label for="file-upload" class="text-sm font-medium text-neutral-900">Attachment</label>
<div class="file-drop-zone mt-2">
  <input
    id="file-upload"
    type="file"
    accept=".png,.jpg,.jpeg,.pdf"
    class="file-input-native"
    data-file-input
  />
  <div class="file-drop-zone-content">
    <svg aria-hidden="true" class="h-8 w-8 text-neutral-400">...</svg>
    <p class="text-sm text-neutral-600">
      <span class="font-medium text-brand-dark">Click to upload</span> or drag and drop
    </p>
    <p class="text-xs text-neutral-600">PNG, JPG, or PDF up to 10MB</p>
  </div>
</div>
<p class="mt-2 text-sm text-neutral-600" data-testid="file-input-filename" data-file-input-filename="file-upload" hidden></p>
```

The native `<input>` is placed **first** inside `.file-drop-zone`, not
last — a `/speckit-analyze` finding caught the original draft placing it
last, which made the `~` general-sibling-combinator focus-visible rule
below permanently unmatchable (`~` only selects siblings that come AFTER
the reference element). Input-first also matches this project's existing
sibling-selector convention (Toggle/Checkbox/Button Group's `peer`/`input +`
patterns all place the input before what it drives).

```css
.file-drop-zone {
  @apply relative flex flex-col items-center gap-1 rounded-md border-2
    border-dashed border-neutral-300 p-6 text-center;
}
.file-input-native {
  @apply absolute inset-0 h-full w-full cursor-pointer opacity-0
    disabled:cursor-not-allowed;
}
.file-input-native:focus-visible ~ .file-drop-zone-content {
  @apply outline outline-2 outline-offset-2 outline-brand;
}
.file-input-native:disabled ~ .file-drop-zone-content {
  @apply opacity-50;
}
```

**I1 fix (round-3 `/speckit-analyze` finding)**: the icon and both `<p>`
elements are wrapped in a single `.file-drop-zone-content` div specifically
so the focus-visible/disabled rules produce ONE cohesive outline/opacity
change around the whole drop-zone body, not three fragmented boxes (one
per icon/paragraph) as `~ *` would produce if each were a direct sibling.
The selector targets `.file-drop-zone-content` explicitly rather than `~ *`
so this stays correct even if a future edit adds another direct sibling
(e.g. an error-message element) that shouldn't also get outlined.

```js
// src/scripts/file-input.js — the second (small) new JS module in this
// feature, alongside pin-input.js. A `/speckit-analyze` finding caught
// that spec.md's US2-AC3 ("the selected filename is visible") has no
// CSS-only solution: the native input is visually transparent
// (opacity-0), so its own browser-native filename chrome is never seen,
// and `input.files[0].name` cannot be projected into a separate sibling
// element without script. This is the ONE piece of real interactivity
// File Input needs — it does not affect the drag-and-drop deferral
// decision (R6), which is about intercepting DROPPED files, a
// materially larger surface than reading the `change` event's own
// `.files` list a user already produced via native click-to-browse.
export function initFileInputs() {
  document.querySelectorAll("[data-file-input]").forEach((input) => {
    const filenameEl = document.querySelector(
      `[data-file-input-filename="${CSS.escape(input.id)}"]`,
    );
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file && filenameEl) {
        filenameEl.textContent = file.name;
        filenameEl.hidden = false;
      } else if (filenameEl) {
        filenameEl.hidden = true;
      }
    });
  });
}
```

**Drag-and-drop scope decision (research.md R6)**: this ships a real,
native `<input type="file">` (click-to-browse works natively) wrapped in a
visually drop-zone-styled container. Genuinely intercepting a DROPPED file
(`dragenter`/`dragover`/`drop` handling + a visual "drag active" state) is
explicitly deferred — a documented future enhancement, not silently
dropped — since it's a meaningfully larger JS surface than reading the
`change` event above, and FR-007's actual requirement (file selection,
full keyboard operability) is already satisfied by the native input's
click-to-browse path alone.

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| focus-visible | `outline outline-2 outline-offset-2 outline-brand` on `.file-drop-zone-content` (via `.file-input-native:focus-visible ~ .file-drop-zone-content` — input MUST come first in the DOM for `~` to match, and the icon/text MUST be wrapped in `.file-drop-zone-content` for one cohesive outline instead of one per child) |
| disabled | `disabled:cursor-not-allowed` on the input itself; `opacity-50` on `.file-drop-zone-content` via `.file-input-native:disabled ~ .file-drop-zone-content` |

## Required attributes

- Real `<label for="...">` referencing the native input's `id`
- `accept` attribute scoping acceptable file types
- The native `<input>` remains in the DOM and focusable (opacity-0, not
  `display:none`/`visibility:hidden`, which would remove it from the Tab
  order)

## Token allowlist used

`border-neutral-300`, `text-neutral-400`, `text-neutral-600`,
`text-brand-dark` — all already-ratified. No new tokens.

**Implementation correction (found during `/speckit-implement`, not caught
by any prior analyze round)**: the original draft used `text-neutral-500`
for the helper text ("PNG, JPG, or PDF up to 10MB"), copied from this
component's disabled-state icon color. `neutral-500` is ratified in this
catalog ONLY for icon-fill (non-text) use (see `scripts/check-contrast.mjs`'s
`ICON_FILL_TEXT_TOKENS` precedent) — as small body text it measures 4.83:1,
which clears AA but fails this project's AAA 7:1 bar. Fixed by using
`text-neutral-600` (the token this catalog already uses for every other
small helper/caption text) instead.

## Acceptance mapping

- FR-007, SC-001, SC-002 → `tests/e2e/file-input.spec.ts` (focusability,
  `accept`/`type` attributes, focus-visible outline actually firing, and
  the filename appearing after a real file selection are all asserted
  directly; native OS file-picker invocation itself is out of Playwright's
  test scope, per R8)
