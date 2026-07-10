# Phase 0 Research: React Port — Navigation & Disclosure Primitives

## R1: Accordion's exclusive-group mechanism in React

**Decision**: Keep the native `<details name="...">` mechanism verbatim
in JSX — **zero React state** for exclusivity. When `exclusive` is
`true`, every item in the group receives the same `name` value, generated
once per `Accordion` instance via `useId()` (not a hardcoded string) so
multiple `Accordion` instances on the same page never accidentally share
one native exclusive group. When `exclusive` is `false` (default), no
`name` attribute is set at all (each `<details>` toggles independently,
identical to the static reference's non-exclusive variant).

**Rationale**: Verified rather than assumed — React 18's JSX passes
`name` through to a `<details>` host element as a plain DOM attribute
with no warning (React's attribute allowlist recognizes `name` generically
across elements, it is not restricted to `<form>`/`<input>`). The native
shared-`name`-attribute exclusive-group mechanism this project's static
reference already relies on (feature 005, confirmed cross-browser in
Chromium/Firefox/WebKit via that feature's own Playwright suite) works
identically inside React-rendered markup, since it's a browser-native
behavior operating on the rendered DOM, not something React's virtual DOM
mediates. This means Accordion needs **no `useState`, no click handlers,
no controlled-open logic at all** — the entire component is a thin JSX
translation of the static markup, preserving the "zero JavaScript" nature
of the original in spirit (React itself is the only "JS," there is no
component-authored interaction logic).

**Alternatives considered**: Reimplementing exclusivity via `useState`
tracking which item is open, closing others on toggle (rejected — strictly
more code for identical behavior, and would diverge from the static
reference's actual mechanism rather than port it, violating FR-008's
"no new behavior" constraint by introducing a different implementation
strategy for the same visible behavior).

## R2: Tabs' roving-tabindex pattern as React state

**Decision**: `useState<number>` for `selectedIndex`. Each tab button's
`tabIndex` is computed as `index === selectedIndex ? 0 : -1` (roving
tabindex, FR-004). A `ref` array (one ref per tab button, via a small
`useRef<(HTMLButtonElement | null)[]>([])` populated during render) lets
the keyboard handler call `.focus()` on the newly-selected tab after an
arrow-key/Home/End press, since changing `tabIndex` alone does not move
focus — a real behavior difference from the vanilla DOM version's
`element.focus()` calls that must be reproduced explicitly, not assumed
to happen automatically as a side effect of a state update.

**Rationale**: This is the direct hook-based translation of
`tabs.js`'s existing algorithm (compute next enabled index skipping
disabled tabs, wrapping at both ends for Left/Right, jumping to the first/
last enabled index for Home/End) — verified against the existing
`src/scripts/tabs.js` and `contracts/tabs.contract.md` from feature 005
to confirm the keyboard model being ported is exactly the ratified one,
not a reinvention.

**Alternatives considered**: A "controlled" `Tabs` accepting
`selectedIndex`/`onSelectedIndexChange` props (rejected as out of scope —
FR-008 bars new capability beyond the static reference, which has no
external-state-lifting requirement; an uncontrolled `defaultSelectedIndex`
prop is the closest equivalent already implied by Accordion's own
`defaultOpen` pattern in this same feature).

## R3: Dropdown Menu — Popover API via imperative refs, not JSX attributes

**Decision**: Use a `ref` to the panel `<div>` and call the real
`showPopover()`/`hidePopover()` DOM methods imperatively (inside a
`useEffect` reacting to an `isOpen` state boolean), rather than trying to
drive the native `popover`/`popovertarget` HTML attributes declaratively
through JSX props.

**Rationale**: Checked rather than assumed — `packages/react/package.json`
pins React `^18.0.0`/`^18.3.0` as peer/dependency; React 19 added
first-class typed JSX support for `popover`/`popoverTarget`/
`popoverTargetAction`, but this project's React 18 target has no such
typed support, and even where the plain lowercase `popover` string
attribute *would* pass through untyped, there is no reliable declarative
way in React 18 to invoke `showPopover()`/`hidePopover()` from a state
change without also reaching for the imperative DOM API — so there is no
actual "declarative-native" alternative being given up. Using the real
browser Popover API imperatively still gets everything it provides for
free (top-layer rendering avoiding clipping/z-index issues, native
Escape-to-close, native light-dismiss-on-outside-interaction) exactly
like the static reference and Combobox/Command Palette (features 005/008)
already rely on — this is still "the real Popover API," just invoked from
a `useEffect` instead of a static HTML attribute, which is the idiomatic
React pattern for imperative browser APIs tied to component state (the
same pattern this package already uses for `<dialog>`/`showModal()` in
`Modal`/`SlideOver`, feature 004).

A custom hook, `useDropdownMenu`, encapsulates: `isOpen` state,
`activeIndex` state (which item currently has roving focus), an effect
that calls `showPopover()`/focuses the first enabled item when `isOpen`
becomes `true` and `hidePopover()` when it becomes `false`, a `keydown`
handler on the panel (ArrowUp/ArrowDown moving `activeIndex` among
enabled items with wraparound, Tab closing the menu per the WAI-ARIA APG
Menu Button convention already ratified in feature 005), and an explicit
`triggerRef.current?.focus()` call on every closing path — mirroring
`dropdown-menu.js`'s own explicit-refocus discipline (itself informed by
feature 004's own finding that WebKit doesn't reliably restore focus
natively, so this project never relies on an unverified native guarantee
for focus-return).

**Alternatives considered**: Wrapping the existing vanilla
`dropdown-menu.js` module and calling its exported functions from a
`useEffect` (rejected — explicitly out of scope per the user's own
framing: "reimplement... natively in React, not by wrapping the existing
vanilla JS," and also technically awkward, since the vanilla module
queries the DOM by `data-dropdown-trigger`/`popovertarget` attributes
rather than accepting React refs, so it would need its own adaptation
layer anyway with none of the benefits of idiomatic React state).

## R4: CSS duplication — confirmed, not assumed

**Decision**: Port the `.breadcrumb-*`/`.accordion-*`/`.tab-*`/
`.dropdown-menu-*` `@apply` rules verbatim into
`packages/react/src/styles.css`'s existing `@layer components` block.

**Rationale**: Verified by reading the file directly rather than assumed
from feature 004's pattern by name only — `packages/react/src/styles.css`
carries an explicit code comment from feature 004's own research.md
explaining that the package's Tailwind build and the static site's are
"two independent Tailwind builds [that] can't `@import` one another's
`@layer`," so this package intentionally duplicates every component
class rather than sharing a single source file. This is the same
established pattern already used for all 10 previously-ported
components (Button through Slide-over) — the four new classes join that
same duplicated block, each still traceable to its `*.contract.md` per
that file's own header comment, and both `audit-tokens.mjs`/
`check-contrast.mjs` already scan this file (feature 004's `.tsx`/CSS
scanning extension), so no further script changes are needed to catch a
token-discipline drift here.

**Alternatives considered**: Introducing a build-time `@import` or a
shared CSS source between the two Tailwind configs (rejected — exactly
the coupling feature 004's own research.md already rejected, and
revisiting that decision is out of scope for a components-only port).

## Testing Strategy

Same `react-*.spec.ts` pixel-parity pattern established in feature 004:
visual regression at 320/768/1024/1440px comparing each React component's
rendered output against its static HTML reference's own already-approved
baseline images (not new baselines — true parity means byte-for-byte or
pixel-tolerance-matching the existing ones), an axe-core scan per
component, and a full port of every keyboard-interaction acceptance
scenario from feature 005's static Playwright specs
(`breadcrumbs.spec.ts`, `accordion.spec.ts`, `tabs.spec.ts`,
`dropdown-menu.spec.ts`) into this feature's `react-*.spec.ts` files, per
SC-004's 100%-parity requirement. New visual regression baselines (where
a true pixel-for-pixel match to the static reference isn't achievable due
to React's own rendering specifics) MUST be generated via
`update-snapshots.yml`'s `workflow_dispatch` job on `ubuntu-latest` —
never locally, never via local Docker — per this project's established
CI-baseline discipline.

No CSP changes anticipated — the React harness already runs under the
same project-wide CSP as every other feature; Popover API/`<dialog>`
usage via refs is same-origin script, identical in kind to every existing
`packages/react/src/*/*.tsx` component.

No new design tokens — every color/spacing utility already exists in
`shared/design-tokens.ts` from features 001-005.
