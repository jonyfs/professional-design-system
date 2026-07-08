# Professional Design System

Accessible HTML + Tailwind CSS primitive components (Button, Text Input, Badge,
Checkbox), built exclusively on the semantic design tokens ratified in
[`.specify/memory/constitution.md`](.specify/memory/constitution.md) (v1.3.1).

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

## Component gallery

Run `npm run dev` and open the printed local URL. The gallery links out to
each component's own standalone page (`src/components/<name>/<name>.html`) —
every component page is independently valid and copy-pasteable, per each
feature's "Independent Test" requirement.

## Project structure

```text
src/
├── styles/tailwind.css       # @tailwind directives only — no custom CSS
└── components/
    ├── button/button.html
    ├── text-input/text-input.html
    ├── badge/badge.html
    └── checkbox/checkbox.html
scripts/
├── audit-tokens.mjs           # Principle IV gate
└── check-contrast.mjs         # Principle II gate
tests/e2e/                     # Playwright specs, one per component
specs/001-primitive-components/  # spec/plan/tasks/contracts for this feature
```

## Governance

Every component must comply with the project constitution's Core Principles
(accessibility, token discipline, interactive state completeness, Tailwind-only
styling). See `specs/001-primitive-components/contracts/*.md` for the exact
markup contract each component implements.
