# Data Model: Layout & Structure Primitives

## Layout Primitive (8 instances: Stack, Group, Center, Container, Paper, Grid, SimpleGrid, Flex)

- **name**: the primitive's identifier (e.g. `Stack`)
- **baseClass**: the root `@apply` class name (research.md R1 table)
- **sizeProp** (Stack/Group/Flex only): `xs`/`sm`/`md`/`lg`, mapping to
  this catalog's existing spacing scale — no new values
- **columnsProp** (Grid/SimpleGrid only): `2`/`3`/`4`, driving the
  responsive column-count rule (research.md R3)
- **children**: any valid markup — these primitives never inspect,
  clone, or restyle their children (spec.md Edge Cases)
- **surfaces**: exactly 2 — `src/components/<name>/<name>.html` (static)
  and `packages/react/src/<Name>/<Name>.tsx` (React), per this
  catalog's dual-surface convention

## AppShell (1 instance — composition, not a token-mapped primitive)

- **regions**: `header` (renders the existing Navbar), `sidebar`
  (optional — renders the existing Sidebar), `main` (required content
  slot)
- **mobileBehavior**: below 768px, `sidebar` (if present) stacks
  above `main` as a full-width block — a pure CSS reflow, not a
  toggleable drawer (research.md R5's correction)
- **composesFrom**: `Navbar` (feature 007), `Sidebar` (feature 007) —
  AppShell owns no independent responsive/interactive logic of its
  own beyond the CSS Grid/Flex arrangement of these 3 regions
- **surfaces**: `src/components/app-shell/app-shell.html` (static,
  embedding real Navbar/Sidebar markup) and `packages/react/src/
  AppShell/AppShell.tsx` (React, composing the real `Navbar`/`Sidebar`
  React components as children/props, not reimplementing their JSX)

## Relationship

```
AppShell
├── header region  → <Navbar> (existing, reused verbatim)
├── sidebar region  → <Sidebar> (existing, reused verbatim; optional)
└── main region     → arbitrary content, commonly wrapped in Container/Stack
```

No new entity introduces a new design token, a new `localStorage` key,
or any persisted state — every Layout Primitive and AppShell are
purely presentational compositions of already-ratified tokens and
already-shipped components.
