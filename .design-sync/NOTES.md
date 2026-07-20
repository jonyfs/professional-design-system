# design-sync notes for professional-design-system

## Fixes applied (2026-07-13 re-sync — 24 → 61 components)

- **Real, currently-shipping bug found and fixed: Chart colors were
  always solid black.** `packages/react/src/hooks/useChartColors.ts`
  reads `--color-*` CSS custom properties at runtime via
  `getComputedStyle(document.documentElement)` (so charts re-theme
  automatically when `data-theme` changes) — but
  `packages/react/src/styles.css` never actually defined those custom
  properties anywhere. Every Chart component (Line/Bar/Area/Pie/Radar/
  Radial) has been rendering every series in solid black for ANY real
  consumer of the npm package, not just this sync — confirmed by
  authoring a PieChart preview with real data and seeing every slice
  render black with zero color. Root cause: `src/styles/themes.css`
  (the static site's theme layer, feature 017) has always carried the
  default/light theme's full `:root` token block "so an unthemed
  page... still renders correctly," but this block was never ported
  into the React package's own separately-compiled stylesheet. Fixed
  by adding the identical default-theme `:root` block (21 `--color-*`
  custom properties, verbatim values) to `packages/react/src/styles.css`
  — the package still ships no theme-switching capability of its own,
  this is strictly the baseline that makes Chart's existing runtime
  color-reading actually work out of the box. Verify: any real project
  using `professional-design-system`'s Chart components should
  re-check their rendered charts after upgrading past this fix — they
  were silently monochrome before.
- **Preview-only quirk, not a product bug: PieChart's entrance
  animation.** `PieChart.tsx`'s own source comment already documents
  this: `isAnimationActive` sweeps the pie in from 0° over ~1s, and "a
  screenshot/assertion taken before that entrance animation settles
  sees a partial arc... tests should emulate reduced-motion for
  deterministic renders." The design-sync capture harness has no
  `page.emulateMedia()` equivalent, so `.design-sync/previews/
  PieChart.tsx` patches `window.matchMedia` for
  `prefers-reduced-motion` queries directly in the preview file (a
  `Proxy` wrapping the real `MediaQueryList`, not a plain object
  spread — spreading drops `addEventListener`/`removeEventListener`,
  which crashes `usePrefersReducedMotion`'s `useEffect` and blanks the
  whole render with no error surfaced). This is scoped to the preview
  file only; the real component and its tests are unaffected.
- **PieChart and Collapse authored + graded good** (T004-equivalent
  for this sync): both were flagged `bad` on first capture (PieChart
  `RENDER_BLANK`, Collapse `RENDER_THIN`) since they had no authored
  preview and their floor-card defaults didn't produce meaningful
  content. Ported real usage from `tests/react-harness/src/
  chart-main.tsx` (PieChart's donut/pie examples) and `collapse-main.tsx`
  (Collapse's two-independent-panels example).
- **29 of the 37 new components from features 019-023 shipped as
  floor cards** (user's explicit choice — "floor cards for now" over
  authoring previews for all or a curated subset): DataTable + its 4
  sub-components, MultiSelect, 5 of 6 Chart types (all but PieChart),
  all 11 localized-identifier inputs, ActionIcon, CopyButton,
  SplitButton, AvatarGroup, Highlight, Code, ColorSwatch, NavLink,
  Anchor, Spoiler. None are broken — the render check passed clean for
  all of them (`fallbackCard: true` is the deliberate, honest baseline,
  never a failure). Authorable incrementally on any future re-sync with
  zero rework of what's already there.
- **No anchor available for this re-sync** — the prior sync's
  `_ds_sync.json` only covered the original 24 components (dated
  2026-07-11, before features 019-023 shipped ~37 more). Ran
  `resync.mjs` without `--remote` (full-verification path, explicitly
  supported by the driver) rather than hand-transcribing the fetched
  anchor into a local cache file — an earlier attempt to do that by
  retyping the `DesignSync(get_file)` result into a heredoc was
  correctly flagged by the session's safety classifier as an
  unverifiable basis for a shared-resource-modifying command. The
  full-verification path produces the identical correct result for a
  sync this size (61 components) — no material downside for this repo.

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

- **The chart-color `:root` block added to `packages/react/src/
  styles.css` this run is a real product fix, not sync scaffolding**
  (same category as the Sidebar safelist fix above) — don't remove it
  on a future re-sync. It's intentionally the DEFAULT theme only (no
  cross-theme switching added to the package); if this design system
  ever gives the React package its own theme-switcher, this block
  should be reconciled with that work rather than duplicated.
- **29 components still on the floor card** (see "Fixes applied (2026-07-13)"
  above for the full list) — the user explicitly chose this scope over
  authoring previews now. Authoring any of them on a later re-sync is
  zero-rework: write `.design-sync/previews/<Name>.tsx`, rebuild,
  recapture, grade. Good starting candidates by real-world prominence:
  DataTable, MultiSelect, and the 5 remaining Chart types (Line/Bar/
  Area/Radar/Radial) — same data/composition patterns already used for
  PieChart's own preview (`tests/react-harness/src/chart-main.tsx` has
  real usage for all of them).
- **`conventions.md` says "24 components"** — now stale (61 shipped)
  but not factually wrong (every class/component name it references
  still verifies against the current build, checked this run). Per the
  base skill's "never rewrite once authored" rule, this was reported
  rather than silently edited — a future sync (or the user) should
  decide whether to refresh the count and add a short mention of the
  37 new components (DataTable, Chart, the 023 batch, localized inputs)
  to the "Composition patterns worth knowing" section.
- **No verification anchor exists yet going into the NEXT re-sync
  either** — this run's `_ds_sync.json` (61 components, all real
  hashes) is now the live anchor on the project, so the next sync CAN
  use `--remote` normally. Fetch it via `DesignSync(get_file, path:
  "_ds_sync.json")` and write it to `.design-sync/.cache/remote-sync.json`
  using the Write tool with the tool's own returned content (not a
  hand-retyped heredoc) to avoid the transcription-risk block this run
  hit.
