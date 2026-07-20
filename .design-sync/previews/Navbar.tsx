import { Navbar } from "@jonyfs/react";

const links = [
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources" },
  { label: "Company", href: "#company" },
];

export function Default() {
  return (
    <div style={{ maxWidth: 960 }}>
      <Navbar brand="Northwind" links={links} />
    </div>
  );
}

export function WithIconBrand() {
  return (
    <div style={{ maxWidth: 960 }}>
      <Navbar
        brand={
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              aria-hidden="true"
              style={{ width: 24, height: 24, borderRadius: 6, background: "#4f46e5", display: "inline-block" }}
            />
            Northwind
          </span>
        }
        links={links}
      />
    </div>
  );
}

export function InContext() {
  return (
    <div style={{ maxWidth: 960 }}>
      <Navbar brand="Northwind" links={links} />
      <div style={{ padding: "48px 24px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: "#111827" }}>
          Ship faster with Northwind
        </h1>
        <p style={{ marginTop: 12, fontSize: 16, color: "#6b7280" }}>
          The platform teams use to plan, build, and release with confidence.
        </p>
      </div>
    </div>
  );
}
