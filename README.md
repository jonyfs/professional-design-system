# Professional Design System

Accessible HTML + Tailwind CSS primitive components (Button, Text Input, Badge,
Checkbox, Radio, Select, Toggle/Switch, Modal, Toast, Slide-over), built
exclusively on the semantic design tokens ratified in
[`.specify/memory/constitution.md`](.specify/memory/constitution.md) (v1.3.4).
Modal/Slide-over use native `<dialog>` for focus-trapped overlays; Toast
and Modal/Slide-over's dismiss wiring are this project's only JavaScript
(`src/scripts/`), everything else is pure HTML + Tailwind. A minimal
project-wide Content-Security-Policy is set via `<meta>` tag on every page.

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
│   └── toast.js               # Toast: dismiss-button wiring (no dialog/focus-trap semantics)
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
    └── slide-over/slide-over.html
scripts/
├── audit-tokens.mjs           # Principle IV gate (color + border-radius; scans HTML + tailwind.css @apply blocks)
└── check-contrast.mjs         # Principle II/WCAG 1.4.11 gate (text + ring pairings; same dual-source scan)
tests/e2e/                     # Playwright specs, one per component
specs/001-primitive-components/    # spec/plan/tasks/contracts (Button, Text Input, Badge, Checkbox)
specs/002-form-primitives-round-2/ # spec/plan/tasks/contracts (Radio, Select, Toggle)
specs/003-overlays-modal-toast/    # spec/plan/tasks/contracts (Modal, Toast, Slide-over)
```

## Governance

Every component must comply with the project constitution's Core Principles
(accessibility, token discipline, interactive state completeness, Tailwind-only
styling). See each feature's `specs/*/contracts/*.md` for the exact markup
contract each component implements.
