# Professional Design System

Accessible HTML + Tailwind CSS primitive components (Button, Text Input, Badge,
Checkbox, Radio, Select, Toggle/Switch, Modal, Toast, Slide-over, Breadcrumbs,
Accordion, Tabs, Dropdown Menu, Avatar, Card, Alert/Banner, Pagination,
Sidebar, Navbar, Combobox, Command Palette), built exclusively on the
semantic design tokens ratified in
[`.specify/memory/constitution.md`](.specify/memory/constitution.md).
Modal/Slide-over/Dropdown Menu/Combobox/Command Palette use native
`<dialog>`/Popover API for focus-trapped or light-dismissable overlays;
Accordion uses native `<details>`/`<summary>`. Toast, Modal/Slide-over's
dismiss wiring, Tabs, Dropdown Menu's keyboard/focus wiring, Combobox's
filter/keyboard wiring, and Command Palette's global-shortcut/filter
wiring are this project's only JavaScript (`src/scripts/`), everything
else is pure HTML + Tailwind. A minimal project-wide
Content-Security-Policy is set via `<meta>` tag on every page.

The first 14 components (Button through Dropdown Menu — the original 10
plus Breadcrumbs, Accordion, Tabs, and Dropdown Menu, ported in feature
009) are also published as a React + TypeScript package at
[`packages/react/`](packages/react/) — see [React package](#react-package)
below. **Both are maintained in parallel**: the static HTML gallery
remains the ratified reference implementation, and the React package is
a port that must stay visually and behaviorally identical to it, verified
by pixel-parity Playwright tests seeded from the static gallery's own
approved baselines. Avatar, Card, and Alert/Banner (feature 006),
Pagination, Sidebar, and Navbar (feature 007), and Combobox and Command
Palette (feature 008) are static-only for now — a React port is a
separate future feature.

## Requirements

- Node.js 18+

## Setup

```bash
npm install
npx playwright install --with-deps   # one-time browser download for tests
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server and open the component gallery |
| `npm run build` | Production build (gallery + all component pages) to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run test:e2e` | Run the full Playwright suite (visual regression + accessibility) |
| `npm run audit:tokens` | Fail if any shipped markup uses a non-ratified Tailwind color/radius class (Principle IV) |
| `npm run audit:contrast` | Fail if any documented text/background pairing is below WCAG 2.2 AAA (Principle II) |
| `npm run typecheck` | Type-check the project's `.ts` config/test files |

## Visual regression baselines (cross-platform)

CI runs on `ubuntu-latest`. Playwright names snapshot files by OS
(`*-linux.png`, `*-darwin.png`, ...), so a baseline generated on macOS never
satisfies a Linux CI run, and vice versa — **always regenerate baselines
inside the official Playwright Docker image**, matching CI, not with a bare
`npx playwright test --update-snapshots` on your host OS:

```bash
docker run --rm -v "$(pwd)":/work -w /work \
  mcr.microsoft.com/playwright:v1.61.1-noble \
  bash -c "npm ci && npx playwright test --update-snapshots"
```

(Bump the image tag to match this repo's installed `@playwright/test`
version.) Commit both the `-darwin.png` and `-linux.png` sets that result —
local `npm run test:e2e` on a Mac still needs the `-darwin.png` files, CI
needs the `-linux.png` files. After running the container, reinstall
`node_modules` for your host OS (`rm -rf node_modules && npm install`) —
the bind mount leaves Linux-native binaries behind otherwise.

## Component gallery

Run `npm run dev` and open the printed local URL. The gallery links out to
each component's own standalone page (`src/components/<name>/<name>.html`) —
every component page is independently valid and copy-pasteable, per each
feature's "Independent Test" requirement.

## Project structure

```text
src/
├── styles/tailwind.css       # @tailwind directives + shared @layer components
├── scripts/
│   ├── overlay.js            # Modal/Slide-over: showModal()/backdrop-click/focus-return wiring
│   ├── toast.js               # Toast: dismiss-button wiring (no dialog/focus-trap semantics)
│   ├── tabs.js                 # Tabs: roving-tabindex/arrow-key wiring (WAI-ARIA Tabs pattern)
│   ├── dropdown-menu.js        # Dropdown Menu: arrow-key roving focus, aria-expanded sync,
│   │                            # Tab-closes-menu (Popover API handles open/close/light-dismiss)
│   ├── alert.js                 # Alert/Banner: dismiss-button wiring (no live-region semantics)
│   ├── combobox.js              # Combobox: filter-as-you-type, aria-activedescendant roving
│   │                            # "focus", Popover API listbox wiring (from-scratch WAI-ARIA 1.2)
│   └── command-palette.js       # Command Palette: global Cmd/Ctrl+K shortcut, filter/nav
│                                # (calls overlay.js's wireDialogClose() for its dialog chrome)
└── components/
    ├── button/button.html
    ├── text-input/text-input.html
    ├── badge/badge.html
    ├── checkbox/checkbox.html
    ├── radio/radio.html
    ├── select/select.html
    ├── toggle/toggle.html
    ├── modal/modal.html
    ├── toast/toast.html
    ├── slide-over/slide-over.html
    ├── breadcrumbs/breadcrumbs.html
    ├── accordion/accordion.html
    ├── tabs/tabs.html
    ├── dropdown-menu/dropdown-menu.html
    ├── avatar/avatar.html
    ├── card/card.html
    ├── alert/alert.html
    ├── pagination/pagination.html
    ├── sidebar/sidebar.html
    ├── navbar/navbar.html
    ├── combobox/combobox.html
    └── command-palette/command-palette.html
scripts/
├── audit-tokens.mjs           # Principle IV gate (color + border-radius; scans HTML + tailwind.css @apply blocks)
└── check-contrast.mjs         # Principle II/WCAG 1.4.11 gate (text + ring pairings; same dual-source scan)
tests/e2e/                     # Playwright specs, one per component (react-*.spec.ts for the React port)
packages/react/                # @professional-design-system/react — React + TypeScript port of 10 components
shared/design-tokens.ts        # Single source of truth for colors/radius/font, imported by every Tailwind config
tests/react-harness/           # Dev-only Vite app rendering the React package for Playwright (never published)
specs/001-primitive-components/    # spec/plan/tasks/contracts (Button, Text Input, Badge, Checkbox)
specs/002-form-primitives-round-2/ # spec/plan/tasks/contracts (Radio, Select, Toggle)
specs/003-overlays-modal-toast/    # spec/plan/tasks/contracts (Modal, Toast, Slide-over)
specs/004-react-component-library/ # spec/plan/tasks/contracts (React + TypeScript package migration)
specs/005-navigation-disclosure-primitives/ # spec/plan/tasks/contracts (Breadcrumbs, Accordion, Tabs, Dropdown Menu)
specs/006-data-display-primitives/ # spec/plan/tasks/contracts (Avatar, Card, Alert/Banner)
specs/007-application-shell-primitives/ # spec/plan/tasks/contracts (Pagination, Sidebar, Navbar)
specs/008-advanced-forms-primitives/ # spec/plan/tasks/contracts (Combobox, Command Palette)
specs/009-react-port-nav-disclosure/ # spec/plan/tasks/contracts (React port of Breadcrumbs, Accordion, Tabs, Dropdown Menu)
```

## React package

[`packages/react/`](packages/react/) publishes 14 of the components above
(Button, Text Input, Badge, Checkbox, Radio, Select, Toggle, Modal, Toast,
Slide-over, Breadcrumbs, Accordion, Tabs, Dropdown Menu) as
`@professional-design-system/react`, a React + TypeScript
package built
with `tsup` (ESM + CJS + `.d.ts`) and Tailwind CSS compiled to a
self-contained `dist/styles.css`. It exists so the design system can be
consumed by React tooling — including
[Claude Design](https://claude.ai/design), which ingests a compiled
`dist/`, extractable prop types, and self-contained CSS.

```bash
npm install @professional-design-system/react
```

```tsx
import { Button, Modal } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";

function Example() {
  return <Button variant="primary">Save</Button>;
}
```

Every component's props are typed and exported (`ButtonProps`,
`ModalProps`, etc.) — see `packages/react/src/index.ts` for the full
barrel export, or each component's own `.tsx` file for its prop
JSDoc. `Modal`/`SlideOver` accept a `triggerRef` prop (recommended when
the trigger is a `<Button>`) so focus reliably returns to the trigger on
close across browsers, including WebKit, which does not focus a
`<button>` on mouse click the way Chromium/Firefox do.

Build from source:

```bash
npm run build --workspace packages/react
npm run typecheck --workspace packages/react
```

`tests/react-harness/` is a dev-only Vite app (not published) used
exclusively to exercise the React components under Playwright; it has
no bearing on the published package's runtime behavior.

## Governance

Every component must comply with the project constitution's Core Principles
(accessibility, token discipline, interactive state completeness, Tailwind-only
styling). See each feature's `specs/*/contracts/*.md` for the exact markup
contract each component implements.
