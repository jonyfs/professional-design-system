# design-sync notes for professional-design-system

## Fixes applied

- **`dtsPropsFor` overrides for 14 components** (Button, Badge, Checkbox,
  Radio, Select, Toggle, TextInput, Card, Accordion, Breadcrumbs, Tabs,
  Toast, Modal, SlideOver): the converter's `KEEP_PROP` filter drops
  native HTML attributes (`onClick`, `onChange`, `disabled`, `value`,
  `placeholder`, `checked`, etc.) when they're inherited from a
  different package (`react`'s own `*HTMLAttributes` interfaces),
  treating them as noise. In this design system that's wrong: every
  affected component deliberately spreads `{...rest}` onto its
  underlying native element as real, intentional API (verified
  directly against each component's source in `packages/react/src/`,
  not assumed) — e.g. `TextInput`'s `placeholder`/`type`/`disabled`,
  `Checkbox`/`Radio`/`Toggle`'s `checked`/`onChange`, `Button`'s
  `onClick`. Without the override, the emitted `<Name>.d.ts` (the
  actual contract the Claude Design agent codes against) would be
  missing this surface entirely, and every design built with e.g.
  `TextInput` would silently be unable to set a placeholder or read
  input changes. Fixed by hand-writing each affected component's full
  `dtsPropsFor` body (a curated, realistic subset of native attrs, not
  an exhaustive 50+-prop enumeration — matches this project's own
  "curate before inventing" composition philosophy).

- **Inter font**: the design system's own `shared/design-tokens.ts`
  names "Inter" as the primary font-family, but the repo never shipped
  an actual font file or CDN link for it anywhere — it has always
  silently fallen back to `system-ui`/`sans-serif` in real usage. The
  user explicitly asked to fetch the real Inter font for this sync
  (rather than accept the substitute) — downloaded the variable-font
  woff2 from Google Fonts (weights 100–900, single file) into
  `packages/react/src/fonts/inter.woff2` + a hand-written
  `inter.css` `@font-face` rule, wired via `cfg.extraFonts`. This is a
  sync-only fix — the actual shipped static site / React package still
  has no font file and still falls back to system fonts in production;
  that's a separate, pre-existing product gap, not something this sync
  changes.

- **Sidebar theme classes purged from production CSS — fixed at the
  source, not just for this sync.** Preview authoring for `Sidebar`
  (dark theme rendering identical to light) surfaced a real,
  currently-shipping bug: `Sidebar.tsx` builds its theme classnames via
  template literals (`` `sidebar-${theme}` ``, `` `sidebar-item-${theme}` ``),
  so Tailwind's static content scanner never sees `sidebar-light`/
  `sidebar-dark`/`sidebar-item-light`/`sidebar-item-dark` as literal
  tokens and purges all four from `packages/react/dist/styles.css` —
  confirmed by grepping the compiled output before and after. Every
  production consumer passing `theme="dark"` (or explicit
  `theme="light"`) got an unstyled sidebar. Fixed by adding all four
  classes to `packages/react/tailwind.config.ts`'s `safelist` array
  (same pattern already used there for `toast-stack`, with the same
  root cause: template-literal/dynamic classnames the scanner can't
  see statically). Rebuilt `packages/react/dist`, confirmed the fix,
  and this also breaks the existing Playwright visual baselines for
  `sidebar.spec.ts`/`react-sidebar.spec.ts` (both themes render
  differently now, correctly) — baselines need regenerating via the
  `update-snapshots.yml` GH Actions workflow per this project's
  established convention (never locally/Docker).

- **`cfg.overrides` added for 5 components with `GRID_OVERFLOW` /
  breakpoint capture issues**, all in `.design-sync/config.json`:
  - `Modal`, `SlideOver`: `{"cardMode": "single", "primaryStory": "Default"}`
    — both render a fixed/portal native `<dialog>` that a shared grid
    cell can't contain; single-card mode exempts them from the grid
    layout check. Grades carried across the config change (render
    hash unaffected — the fix is presentation-only for the component
    picker card, not the review/grading capture, which stays a plain
    stacked sheet regardless of `cardMode`).
  - `Navbar`: `{"cardMode": "column", "viewport": "1200x700"}` — its
    desktop nav is `hidden lg:flex` (Tailwind `lg` = 1024px), but
    `package-capture.mjs`'s default viewport is 900×700, so the nav
    links were invisible in every cell (only brand + mobile hamburger
    rendered) regardless of preview content. Raising the viewport
    above the `lg` breakpoint fixed it.
  - `Pagination`: `{"cardMode": "column"}` — stories rendered wider
    than their grid cells and got cropped.

## Preview authoring notes

- **Combobox** can only ever be captured in its closed state. Its listbox
  opens imperatively via the Popover API (`showPopover()`/`hidePopover()`
  in `useCombobox.ts`), triggered only by the input's `onChange` handler
  when the query is non-empty — there is no prop to force an initial
  open/query state, and `package-capture.mjs` mounts previews statically
  with no simulated typing/clicking. The authored `Default` cell (a
  labeled, correctly styled closed search input) is therefore the most
  complete representation achievable through this pipeline, not an
  under-authored preview. If a future sync wants to show the open
  listbox (options, disabled-option styling), it would need either a
  capture-side interaction step (type a character before screenshotting)
  or a dev-only `defaultOpen`/`defaultQuery` prop added to the real
  component — out of scope for this sync.

- **Internal-only "open" state: two components, two different outcomes.**
  Several overlay/disclosure components have no externally-controllable
  open prop — the state is `useState` internal to their hook, reachable
  only via a real user interaction. Tried the same fix (dispatch a real
  synthetic DOM event in a mount `useEffect`, exercising the component's
  actual public interaction contract rather than its internals) on both:
  - **CommandPalette**: worked cleanly. Dispatching a real `KeyboardEvent`
    (`metaKey`/`ctrlKey` + `"k"`) on `document` in a mount effect makes
    its own listener call `showModal()` — the captured screenshot shows
    the full dialog (backdrop, input, action list, disabled item styling)
    correctly, no clipping, because it's a centered full-viewport overlay.
  - **DropdownMenu**: same technique (synthetic `.click()` on the trigger,
    via its `triggerTestId` prop) does force the popover open — but the
    panel is anchor-positioned relative to the trigger and gets clipped by
    the narrow review-sheet column, rendering *worse* than the closed
    state (a cropped panel reads as a bug, not a demonstration). Reverted
    to the closed trigger for all 3 cells. Root cause: the popover has
    real screen real estate in the actual Claude Design canvas but not in
    this pipeline's fixed-width grading sheet.
  - Takeaway for future components with the same shape (internal-only open
    state via a native invoker/Popover pattern): the synthetic-event
    technique is worth trying, but verify the resulting screenshot isn't
    clipped before keeping it — a well-documented closed state beats a
    broken-looking open one.

## Re-sync risks

- The `dtsPropsFor` overrides above are **hand-maintained, not
  auto-derived** — if any of these 14 components' real prop surface
  changes (a new native attribute forwarded, a prop renamed, `{...rest}`
  removed), the override will silently drift from the real `.d.ts` and
  a future re-sync won't catch it automatically. Re-check these against
  each component's actual `packages/react/src/<Name>/<Name>.tsx` source
  whenever this design system's components change meaningfully.
- If this design system ever fixes the real Inter-font gap (ships an
  actual font file/CDN link in production), the sync's `extraFonts`
  entry becomes redundant with the real one — check for duplication
  next time.
- The converter grouped all 24 components under a single "general"
  group (no `docsDir`/doc files exist in this repo to drive
  categorization). A future re-sync could add `cfg.docsMap` entries or
  a lightweight per-component `category` frontmatter stub to get
  proper grouping (Forms, Overlays, Navigation, Data Display, etc.) in
  the Claude Design pane — not done this run, purely cosmetic.
- The `cfg.overrides` entries for Modal/SlideOver/Navbar/Pagination
  (see "Fixes applied" above) are pipeline-specific accommodations for
  this converter's grid-cell capture layout, not properties of the
  components themselves — they don't need to change unless the
  component's own layout changes (e.g. Navbar's `lg:` breakpoint moves).
- The Sidebar safelist fix is a real product fix, not a sync
  artifact — don't remove those 4 safelist entries on a future re-sync
  just because they look like "sync scaffolding"; they belong in
  `packages/react/tailwind.config.ts` permanently.
