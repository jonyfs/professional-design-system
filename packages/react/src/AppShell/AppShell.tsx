export interface AppShellProps {
  /** Typically <Navbar ...> — AppShell does not import Navbar itself. */
  header: React.ReactNode;
  /** Typically <Sidebar ...>, optional — omit for a header+content-only page. */
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  "data-testid"?: string;
}

// Composes a page-level layout shell (feature 028 US4) from caller-
// supplied header/sidebar regions — AppShell accepts them as props
// rather than importing Navbar/Sidebar directly, so it has zero hard
// dependency on their exact prop shapes and never re-implements their
// markup or behavior. .app-shell-body's flex-col lg:flex-row is the
// entire mobile-reflow mechanism (research.md R5): Sidebar has no
// existing collapse mechanism to reuse, so below 1024px the sidebar
// region stacks above main content via CSS alone, not a toggled drawer.
export function AppShell({ header, sidebar, children, "data-testid": testId }: AppShellProps) {
  return (
    <div data-testid={testId} className="app-shell">
      {header}
      <div className="app-shell-body">
        {sidebar}
        <main className="app-shell-main">{children}</main>
      </div>
    </div>
  );
}
