# Research: React Port — Batch 2

## R1: Navbar mobile menu — native `<details>`, no React state

**Decision**: Port Navbar's native `<details>`/`<summary>`-based mobile
disclosure directly as JSX, with no `useState`. Sidebar has NO
comparable mobile-disclosure pattern to port — this applies to Navbar
only.

**Rationale**: Read `src/components/navbar/navbar.html` directly:
zero `<script>` tags, a `<details data-testid="navbar-mobile-menu">`
wrapping the mobile nav panel. React can render `<details>`/`<summary>`
directly; the browser owns open/close state natively — mirrors
Accordion's identical precedent from feature 009.

Also read `src/components/sidebar/sidebar.html` directly (an earlier
draft of this research incorrectly claimed Sidebar has the same
pattern — caught by /speckit-analyze before implementation): it is two
always-visible `<nav>` blocks (light/dark theme demos), with no
`<details>`, no responsive collapse, and no mobile-specific markup at
all. Sidebar's React port is a direct, unconditional item-list render —
porting a nonexistent mobile-menu capability for it would violate
FR-008 (no new capability beyond the static reference).

## R2: Command Palette reuses `useDialogTrigger` verbatim

**Decision**: `useCommandPalette` composes the existing `useDialogTrigger`
hook (`packages/react/src/hooks/useDialogTrigger.ts`, feature 004's
Modal port) for its `<dialog>` chrome, rather than reimplementing
backdrop-click-close and WebKit-safe focus-return from scratch.

**Rationale**: Read `useDialogTrigger.ts` directly. Its signature
(`open: boolean, onClose: () => void, triggerRef?: RefObject<...>`)
is a drop-in React equivalent of the static reference's
`wireDialogClose(dialog)` (`src/scripts/overlay.js`) — same backdrop-
click-close, same WebKit focus-return safeguard. Command Palette's
static reference (`src/scripts/command-palette.js`) opens via a global
keydown listener rather than a click on a `[data-dialog-trigger]`
button, so there is no natural element to pass as `triggerRef` — it
falls back to `document.activeElement` at open time, which is exactly
what the static reference itself does (`dialog._lastTrigger =
document.activeElement` in its global keydown handler). No new
dialog-close logic needs inventing; this is a direct, verified reuse.

## R3: `useCombobox` mirrors `useDropdownMenu`'s architecture

**Decision**: `useCombobox` is a from-scratch hook (not a reuse of
`useDropdownMenu`, since Combobox's real DOM focus never leaves the
input — it's `aria-activedescendant`-driven, not roving `focus()` calls
like Dropdown Menu's menu items), but follows the identical
authoring pattern: Popover API for the listbox's open/close/light-
dismiss/top-layer, a `useId()`-derived unique `anchor-name` (feature
010's per-instance-uniqueness fix), and `setProperty()` for
`anchor-name`/`position-anchor` (untyped in this package's pinned
TypeScript DOM lib, same as `useDropdownMenu`).

**Rationale**: Read `src/scripts/combobox.js` directly. Its logic —
filter-on-input, `aria-activedescendant` roving "focus" (real focus
stays on the `<input>`), Enter-to-commit, Escape-to-close, blur-to-close
— is genuine state machine logic (filtered list, active index) that
must be reimplemented as React state (`useState<string>` for query,
`useState<number>` for activeIndex), not a direct DOM-manipulation
port like Dropdown Menu's simpler roving-focus-between-buttons case.

## R4: Command Palette's global keydown listener does not conflict

**Decision**: `useCommandPalette`'s `document`-level keydown listener
checks `(event.metaKey || event.ctrlKey) && event.key.toLowerCase() ===
"k"` — identical to the static reference — which cannot fire from
plain typing inside `Combobox`'s or any other component's input, since
those never hold Cmd/Ctrl while typing a regular character.

**Rationale**: Verified by reading `command-palette.js`'s exact
condition and confirming no other ported component (Dropdown Menu,
Tabs, Accordion, Combobox) binds a competing `document`-level listener
for the same key combination — each of those scopes its own keydown
handling to its own DOM subtree (a specific `<input>` or panel's
`onKeyDown`), never to `document`. No conflict exists structurally, not
just by absence of a test failure.

## R3a: Option/action ids must also be `useId()`-scoped

**Decision**: Combobox's listbox option ids and Command Palette's
action ids are prefixed with a `useId()`-derived instance identifier
(e.g. `${comboboxId}-option-${index}`), not the static reference's bare
`combobox-option-${index}`/`command-palette-action-${index}`.

**Rationale**: /speckit-analyze caught this before implementation: FR-007
already mandates `useId()` for per-instance identifiers to avoid
multi-instance collisions (the exact rationale already applied to
`anchor-name` in R3), but an initial draft of this research carried the
static reference's hardcoded, non-namespaced option/action ids over
verbatim. Two `Combobox` instances on one page would then render
duplicate `id="combobox-option-0"` — invalid HTML, and
`aria-activedescendant`/`getElementById`-based lookups could resolve to
the wrong instance's option. Namespacing with the same `useId()` value
already used for `anchor-name` closes this gap with no new mechanism.

## R5: No new design tokens

**Decision**: Confirmed — every one of the ten components' React ports
reuses its static reference's already-ratified Tailwind classes
verbatim (via `className` on native elements), with zero new tokens
added to `shared/design-tokens.ts` or the constitution's Base Semantic
Palette.

## R6: Alert's dismiss as React state, not DOM removal

**Decision**: `Alert` accepts an optional `onDismiss: () => void` prop;
when the dismiss button is clicked, the component calls `onDismiss()` —
it does NOT call `.remove()` on its own DOM node (which would fight
React's virtual DOM reconciliation). The consuming app is responsible
for actually removing the Alert from what it renders (e.g. filtering it
out of a list in its own state), exactly like `Toast`'s already-shipped
React port handles its own dismiss-and-removal split (feature 004).

**Rationale**: Matches the established, already-ratified pattern for
Toast (the closest existing precedent for "a dismissible, removable
static-content component") rather than inventing a new one for Alert.
