# Contract: AppShell

## `src/styles/tailwind.css` additions

```css
@layer components {
  .app-shell {
    @apply flex min-h-screen flex-col;
  }
  .app-shell-body {
    @apply flex flex-1 flex-col lg:flex-row;
  }
  .app-shell-main {
    @apply flex-1 overflow-y-auto p-6;
  }
}
```

`.app-shell-body`'s `flex-col lg:flex-row` is the entire mobile-
reflow mechanism (research.md R5's correction) — below the `lg:`
breakpoint (1024px, this project's config), sidebar and main stack
vertically; at `lg:`+ they sit side by side. No JS, no toggle, no
hidden/shown state.

## Static HTML usage

```html
<div class="app-shell">
  <!-- Real Navbar markup, reused verbatim (feature 007) -->
  <header data-testid="navbar" class="navbar"> ... </header>

  <div class="app-shell-body">
    <!-- Real Sidebar markup, reused verbatim (feature 007) -->
    <nav aria-label="Main" data-testid="sidebar" class="sidebar sidebar-light"> ... </nav>

    <main class="app-shell-main">
      <!-- Arbitrary page content -->
    </main>
  </div>
</div>
```

## React wrapper shape

```tsx
interface AppShellProps {
  header: React.ReactNode; // typically <Navbar ...>
  sidebar?: React.ReactNode; // typically <Sidebar ...>, optional
  children: React.ReactNode; // main content
}
export function AppShell({ header, sidebar, children }: AppShellProps) {
  return (
    <div className="app-shell">
      {header}
      <div className="app-shell-body">
        {sidebar}
        <main className="app-shell-main">{children}</main>
      </div>
    </div>
  );
}
```

AppShell does not import Navbar/Sidebar itself — it accepts them as
props/children, so it has zero hard dependency on their exact prop
shapes and never re-implements their markup (FR-004).

## Acceptance mapping

- FR-004, spec.md US4 Acceptance Scenarios 1-2 → the markup/props
  above
- spec.md Edge Case (AppShell without Sidebar) → `sidebar` prop is
  optional; when absent, `.app-shell-main` is the sole child of
  `.app-shell-body` and renders full-width with no special-casing
  needed (flexbox's own single-child behavior)
