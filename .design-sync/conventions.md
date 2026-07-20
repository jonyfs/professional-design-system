# Professional Design System — conventions

This is the real `@jonyfs/react` package (24 components), governed by a
ratified constitution (`.specify/memory/constitution.md`) with seven non-negotiable principles:
ergonomics, WCAG AAA contrast, Tailwind-only styling, design tokens as the single source of
truth, explicit component states, i18n readiness, and native-elements-over-ARIA. Every component
in this bundle was built against that constitution — designs composed from these parts inherit
those guarantees for free.

## Where the truth lives

- **Design tokens**: `shared/design-tokens.ts` — colors, spacing, radii, font stacks. Every
  Tailwind class in every component traces back to a token here; there are no hardcoded hex
  values or magic numbers in component source.
- **Component source**: `packages/react/src/<Name>/<Name>.tsx`, one directory per component.
  Most wrap a `use<Name>` hook (`packages/react/src/hooks/`) that holds the interaction state;
  the component itself is a thin JSX shell.
- **Styling**: `packages/react/src/styles.css`, `@layer components` blocks compiled by Tailwind.
  Class names are stable, hand-named (`.card`, `.sidebar-item`, `.dropdown-menu-panel`), not
  auto-generated utility soup — safe to reference in prompts and documentation.

## Styling idiom

- **Semantic class names over utility stacking.** Components expose named classes
  (`.badge`, `.alert`, `.avatar-fallback`) built from `@apply` over Tailwind utilities, not
  inline utility chains. When composing new UI, prefer wrapping these components rather than
  reimplementing their look with raw utilities.
- **Native HTML elements first.** Disclosure and overlay components (`Accordion`, `DropdownMenu`,
  `Combobox`, `CommandPalette`) are built on the native `<details>`/Popover API/`<dialog>` rather
  than hand-rolled ARIA widgets — browser-native focus management, `Escape`-to-close, and
  light-dismiss come for free and don't need to be re-derived in a design.
- **Controlled where it matters, uncontrolled where it doesn't.** Form-like components
  (`TextInput`, `Checkbox`, `Radio`, `Toggle`, `Select`) accept both `value`/`checked` and
  `defaultValue`/`defaultChecked` — use whichever matches the surrounding composition. Overlay
  components with real consumer-visible lifecycle (`Modal`, `SlideOver`) are always externally
  controlled via an `open` boolean + `onClose` callback; components with no meaningful external
  lifecycle (`CommandPalette`, `DropdownMenu`, `Combobox`) manage their own open state internally
  and expose no `open` prop at all — don't invent one.
- **`{...rest}` forwarding.** Fourteen components (`Button`, `TextInput`, `Checkbox`, `Radio`,
  `Toggle`, `Select`, `Card`, `Badge`, `Accordion`, `Breadcrumbs`, `Tabs`, `Toast`, `Modal`,
  `SlideOver`) spread any unrecognized props onto their native underlying element — `onClick`,
  `disabled`, `placeholder`, `name`, etc. all just work even though they're not always spelled
  out in every example.

## Composition patterns worth knowing

- `List` and `Table` both compose `Avatar` internally at a fixed size — pass avatar data as a
  nested object (`{ src?, alt, initials? }`), not flat `avatarSrc`/`avatarInitials` props.
- `Card` + `Badge` is the idiomatic way to build a status-tagged content card (see the
  `ProjectCard` example under Card's usage guide) — don't reinvent badge styling inside a Card.
- `Sidebar`/`Navbar` are layout-level components meant to hold real navigation data
  (5+ realistic items/links), not 1-2 placeholder entries — they're designed to anchor a full
  app shell, and look sparse with too little content.

## Build snippet

```jsx
import { Card, Badge, Avatar } from '@jonyfs/react';

function ProjectCard({ project }) {
  return (
    <Card elevated>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Avatar initials={project.ownerInitials} size="sm" />
        <Badge variant={project.status === 'on-track' ? 'success' : 'warning'}>
          {project.status}
        </Badge>
      </div>
      <h3>{project.name}</h3>
    </Card>
  );
}
```

## A note on fonts

This bundle ships the real Inter variable font (`fonts/inter.woff2`) so designs render in the
system's intended typeface. The live production package does not yet ship this font itself
(a separate, pre-existing gap) — designs built here render more faithfully to the *intended*
brand typography than the current shipped site does.
