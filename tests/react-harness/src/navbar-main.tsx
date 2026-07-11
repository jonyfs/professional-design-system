import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Navbar } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

const links = [
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
  { label: "About", href: "#" },
];

function NavbarDemo() {
  return (
    <div className="font-sans antialiased">
      <Navbar data-testid="navbar" brand="Acme" links={links} />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Navbar / Header</h1>
        <div className="mt-8 h-[1400px] rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-600">
          Scroll this page — the header above stays pinned to the top of the viewport.
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NavbarDemo />
  </StrictMode>,
);
