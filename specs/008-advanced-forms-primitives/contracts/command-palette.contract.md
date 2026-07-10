# Component Contract: Command Palette

## Markup contract

```html
<dialog id="command-palette" data-testid="command-palette" class="command-palette-dialog">
  <input
    type="text"
    role="combobox"
    aria-expanded="true"
    aria-controls="command-palette-list"
    aria-activedescendant=""
    aria-autocomplete="list"
    autocomplete="off"
    autofocus
    data-testid="command-palette-input"
    class="command-palette-input"
    placeholder="Type a command or search…"
  />
  <ul id="command-palette-list" role="listbox" data-testid="command-palette-list" class="command-palette-list">
    <li id="command-palette-action-0" role="option" data-testid="command-palette-action-0" class="command-palette-action">New Project</li>
    <li id="command-palette-action-1" role="option" data-testid="command-palette-action-1" class="command-palette-action">Open Settings</li>
    <li id="command-palette-action-2" role="option" aria-disabled="true" data-testid="command-palette-action-2" class="command-palette-action">Invite Teammate (requires admin)</li>
    <li id="command-palette-action-3" role="option" data-testid="command-palette-action-3" class="command-palette-action">Sign Out</li>
  </ul>
</dialog>

<p aria-live="polite" data-testid="command-palette-confirmation" class="sr-only"></p>
```

The launcher itself is not a dedicated `<button>` in this static
reference (the global shortcut is the primary entry point, per FR-006) —
the gallery page includes one visible hint element
(`data-testid="command-palette-hint"`, e.g. "Press ⌘K") purely for
discoverability, not as a required trigger element.

## Behavior wiring (`src/scripts/command-palette.js`)

| Interaction | Behavior |
|---|---|
| `Cmd+K` / `Ctrl+K` anywhere on the page (document-level listener) | `event.preventDefault()`; no-ops if another `<dialog open>` already exists (research.md R3); otherwise sets `dialog._lastTrigger = document.activeElement` and calls `dialog.showModal()` |
| Input | Filtering/highlighting logic matching the same algorithm as Combobox's (case-insensitive substring match, `<mark>` wrapping, re-render, `.command-palette-empty` on zero matches) — independently implemented in `command-palette.js`, not imported from `combobox.js` (data-model.md's "Shared behavior notes": deliberately not extracted into a third shared module) |
| ArrowDown/ArrowUp | Same algorithm as Combobox's — moves `activeIndex` among non-disabled filtered actions, updates `aria-activedescendant` + `aria-selected`, independently implemented |
| Enter | If an action is active and not disabled: writes a visible confirmation into `command-palette-confirmation` (e.g. "Executed: New Project"), then `dialog.close()` |
| Escape | Native `<dialog>` behavior — closes without executing anything |
| Click on the dialog backdrop | `dialog.close()` — via `overlay.js`'s exported `wireDialogClose(dialog)` helper (research.md R3), called once on this dialog from `command-palette.js` itself, since this dialog has no `data-dialog-trigger` button for `initDialogTriggers()`'s own loop to discover |
| `close` event (any path — Escape, backdrop click, Enter-execute) | `dialog._lastTrigger?.focus()` — the same WebKit-safeguard refocus logic `wireDialogClose(dialog)` provides to Modal/Slide-over, called via the shared helper rather than duplicated (research.md R3, `/speckit-analyze` finding I1) |

## Required attributes (Principle II gate, FR-006/FR-007/FR-008/FR-009)

| Behavior | Mechanism |
|---|---|
| Global open shortcut | `document`-level `keydown` listener checking `metaKey`/`ctrlKey` + `k` |
| Focus-trapped while open | Native `<dialog>` + `showModal()` (identical to Modal, feature 003) |
| Search input focused on open | `autofocus` attribute + `showModal()`'s native initial-focus behavior |
| Combobox semantics on the search input | `role="combobox"` + `aria-controls`/`aria-activedescendant`/`aria-autocomplete`, identical in kind to Combobox's contract |
| Focus returns to pre-open state on close (incl. WebKit) | `overlay.js`'s exported `wireDialogClose(dialog)` helper's `close` listener (`dialog._lastTrigger?.focus()`), called once for this dialog from `command-palette.js` |

## Required states (Principle V gate)

| Element | State | Required utility |
|---|---|---|
| `.command-palette-action` | hover | `hover:bg-neutral-50` |
| `.command-palette-action` | active (press) | `active:bg-neutral-100` |
| `.command-palette-action[aria-selected="true"]` | keyboard-active | `bg-neutral-100` |
| `.command-palette-action[aria-disabled="true"]` | disabled | `cursor-not-allowed opacity-50 hover:bg-transparent active:bg-transparent` — hover/active suppressed, same fix as Combobox's contract |
| `.command-palette-input` | focus-visible | `focus:ring-0` (dialog's own backdrop/ring already frames it — an inner ring would double up visually, matching Modal's existing input treatment inside dialogs) — the single focus indicator for the whole widget, same rationale as Combobox's input (research.md R6) |

**`focus-visible` is intentionally absent from `.command-palette-action`**,
for the identical reason as Combobox's option rows (research.md R6):
`aria-activedescendant` never moves real focus onto an action row.

## Edge cases

- **Shortcut pressed while another text input has focus** (spec.md Edge
  Case): the shortcut still fires (document-level listener, `keydown`
  bubbles from any focused element to `document` unless a more specific
  handler calls `stopPropagation()`, verified none does — research.md R3).
- **Shortcut pressed while the palette is already open** (spec.md Edge
  Case): no-op — the handler checks `dialog.open` before calling
  `showModal()` again (also naturally guarded by the "another `<dialog
  open>`" check, since the palette's own dialog counts).
- **Disabled action**: `aria-disabled="true"`, dimmed, skipped during
  arrow-key traversal, click/Enter no-op — identical treatment to
  Combobox's disabled option.

## Token allowlist used

Identical set to Combobox's contract, plus `rounded-lg`/`shadow-xl`/
`sm:max-w-lg` reused verbatim from Modal's ratified dialog treatment
(feature 003). No raw palette classes (FR-010).

## Acceptance mapping

- FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012 → this contract
- SC-002, SC-003, SC-004 → verified by `tests/e2e/command-palette.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
