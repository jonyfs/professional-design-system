import { Breadcrumbs } from "@professional-design-system/react";

export function Default() {
  return (
    <Breadcrumbs
      items={[
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects" },
      ]}
      currentLabel="Design System Sync"
    />
  );
}

export function DeepPath() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Breadcrumbs
        items={[
          { href: "/", label: "Dashboard" },
          { href: "/billing", label: "Billing" },
          { href: "/billing/invoices", label: "Invoices" },
        ]}
        currentLabel="Invoice #4471"
      />
    </div>
  );
}
