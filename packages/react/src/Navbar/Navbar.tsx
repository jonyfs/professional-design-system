import type { ReactNode } from "react";

export interface NavbarLinkData {
  label: string;
  href: string;
}

export interface NavbarProps {
  brand: ReactNode;
  links: NavbarLinkData[];
  "data-testid"?: string;
}

// Direct port of navbar.html (feature 007) — sticky header, zero JS. The
// mobile menu is a native <details>/<summary> disclosure (research.md
// R1): the browser owns open/close state, no useState needed, mirroring
// Accordion's identical "native element over React state" precedent
// (feature 009).
export function Navbar({ brand, links, "data-testid": testId }: NavbarProps) {
  return (
    <header data-testid={testId} className="navbar">
      <div className="navbar-inner">
        <span className="text-lg font-bold text-neutral-900">{brand}</span>

        <nav
          aria-label="Main navigation"
          data-testid={testId && `${testId}-full-nav`}
          className="hidden lg:flex lg:items-center lg:gap-6"
        >
          {links.map((link) => (
            <a key={link.href + link.label} href={link.href} className="navbar-link">
              {link.label}
            </a>
          ))}
        </nav>

        <details className="lg:hidden" data-testid={testId && `${testId}-mobile-menu`}>
          <summary className="navbar-menu-trigger" aria-label="Menu">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z"
                clipRule="evenodd"
              />
            </svg>
          </summary>
          <div className="navbar-mobile-panel" data-testid={testId && `${testId}-mobile-panel`}>
            {links.map((link) => (
              <a key={link.href + link.label} href={link.href} className="navbar-link">
                {link.label}
              </a>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
