# Contract: Flagship App Showcase

## Page composition (`showcase/src/App.tsx`)

```tsx
import {
  Sidebar, Navbar, Avatar, AvatarGroup, Breadcrumbs, Tabs,
  CommandPalette, DropdownMenu, ActionIcon, Button,
  Card, Badge, RollingNumber,
  DataTable, Pagination,
  Chart,
  Toast, NotificationCenter, Modal,
  DarkModeToggle,
} from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import { organizations, teamMembers, tableRows, chartSeries, notifications, metrics } from "./data/sample-data";

export function App() {
  // Real component state (open/closed, active tab, table page, toast
  // queue) — the same state shape each component's own dedicated demo
  // already exercises, not a new pattern invented for this page.
  // ...
  return (
    <div className="min-h-dvh flex">
      <Sidebar items={/* real nav items */} />
      <div className="flex-1 flex flex-col">
        <Navbar>
          <Breadcrumbs items={[{ label: "Dashboard" }]} />
          <DarkModeToggle />
          <DropdownMenu trigger={<Avatar initials="JS" />} items={/* user menu */} />
        </Navbar>
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metrics.map((m) => <Card key={m.label}><RollingNumber value={m.value} /><Badge>{m.trend}</Badge></Card>)}
          </div>
          <Chart type="line" data={chartSeries} />
          <Tabs>
            <Tabs.Tab label="Customers">
              <DataTable rows={tableRows} />
              <Pagination />
            </Tabs.Tab>
          </Tabs>
        </main>
      </div>
      <NotificationCenter items={notifications} />
      <CommandPalette /* Cmd+K */ />
    </div>
  );
}
```

## `showcase/vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES_BASE || "/",
});
```

## `deploy-pages.yml` addition (build job, after the main site's build)

```yaml
- name: Build showcase app (Pages subpath base)
  working-directory: showcase
  run: npm ci && npm run build
  env:
    GITHUB_PAGES_BASE: /${{ github.event.repository.name }}/showcase/

- name: Copy showcase build into the main site's dist/
  run: cp -r showcase/dist dist/showcase
```

## `index.html` addition (homepage link, FR-006)

```html
<a href="/showcase/index.html" class="...">See it as a real app →</a>
```

Root-absolute so `scripts/rewrite-base-path.mjs` (feature 039) rewrites
it to the correct Pages subpath automatically — no new rewrite logic
needed.

## Acceptance mapping

- FR-001/FR-002/SC-001 → the component list in `App.tsx` above (18
  distinct components, research.md R2)
- FR-003 → every element is the real imported component, not a static
  approximation
- FR-006/SC-003 → the homepage link + a corresponding back-link in
  `showcase/src/App.tsx`'s own header
- FR-007 → zero changes to `index.html`'s existing catalog markup
  beyond the one new link
- FR-009 → `sample-data.ts`, data-model.md
