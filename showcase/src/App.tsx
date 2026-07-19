import { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  Navbar,
  Avatar,
  Breadcrumbs,
  DropdownMenu,
  DarkModeToggle,
  ContextSwitcher,
  NotificationCenter,
  type SidebarItemData,
} from "@professional-design-system/react";
import { organizations, notifications } from "./data/sample-data";
import { DashboardScreen } from "./screens/DashboardScreen";
import { TeamScreen } from "./screens/TeamScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { AnalyticsScreen } from "./screens/AnalyticsScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";

// Feature 047 — Sidebar/DarkModeToggle both write to document.documentElement's
// data-theme (feature 042's own precedent), and Sidebar/Navbar's nav items are
// real <a href="#/..."> anchors (packages/react/src/Sidebar, src/Navbar) with
// no onClick-preventDefault hook available to intercept for a plain
// BrowserRouter. HashRouter is adopted specifically so those existing,
// unmodified components' real anchors "just work" as client-side navigation
// (a hash-only href change is a same-document navigation, never a full
// reload) — reusing Sidebar/Navbar exactly as shipped (spec.md FR-004)
// rather than modifying their prop APIs to add App-Router-aware handlers.
const NAV_ITEMS = [
  { id: "overview", label: "Overview", path: "/" },
  { id: "team", label: "Team", path: "/team" },
  { id: "settings", label: "Settings", path: "/settings" },
  { id: "analytics", label: "Analytics", path: "/analytics" },
  { id: "onboarding", label: "Onboarding", path: "/onboarding" },
];

const BREADCRUMB_LABEL: Record<string, string> = {
  "/": "Dashboard",
  "/team": "Team",
  "/settings": "Settings",
  "/analytics": "Analytics",
  "/onboarding": "Onboarding",
};

function ShowcaseLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // gallery-theme-selector.js targets #gallery-theme-select by id and
  // populates/wires it via plain DOM APIs (research.md/FR-004) — it
  // must run after this element exists in the DOM, so it's dynamically
  // imported on mount rather than statically imported (which would
  // execute before React's first render).
  useEffect(() => {
    import("../../src/scripts/gallery-theme-selector.js");

    // Unlike the homepage, this page also has DarkModeToggle writing to
    // the same data-theme attribute (a second, independent entry point
    // the homepage never has to reconcile with). gallery-theme-selector.js
    // only sets the <select>'s value once on init; without this observer
    // toggling DarkModeToggle would silently desync the dropdown from
    // the theme actually applied.
    const select = document.getElementById("gallery-theme-select") as HTMLSelectElement | null;
    if (!select) return;
    const observer = new MutationObserver(() => {
      select.value = document.documentElement.dataset.theme ?? "light";
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const sidebarItems: SidebarItemData[] = NAV_ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    href: `#${item.path}`,
    active: location.pathname === item.path,
  }));

  return (
    <div className="min-h-dvh flex bg-neutral-50 text-neutral-900" data-theme-scope="showcase">
      {/* Hidden below lg: Sidebar (contracts/sidebar.contract.md) is a
          fixed-width, always-visible static nav with no responsive
          collapse behavior of its own — Navbar's existing lg:hidden
          mobile disclosure menu already covers the same navigation on
          narrow viewports (FR-008/SC-005: no horizontal overflow). */}
      <div className="hidden lg:block">
        <Sidebar
          theme="light"
          items={sidebarItems}
          onItemClick={(id) => {
            const item = NAV_ITEMS.find((n) => n.id === id);
            if (item) navigate(item.path);
          }}
          data-testid="showcase-sidebar"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          brand={
            <ContextSwitcher
              options={organizations.map((org) => ({ label: org.name, avatarInitials: org.avatarInitials }))}
              initialSelected={0}
              data-testid="showcase-org-switcher"
            />
          }
          links={NAV_ITEMS.map((item) => ({ label: item.label, href: `#${item.path}` }))}
          data-testid="showcase-navbar"
        />

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-neutral-200 px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Not a plain "/index.html": scripts/rewrite-base-path.mjs
                (feature 039) only rewrites root-absolute links inside
                .html files, never JS bundle strings — a link hardcoded
                here would 404 under the Pages subpath
                (/professional-design-system/) in production. BASE_URL is
                already the correct subpath at build time (Vite's own
                `base` config), so deriving from it instead of the
                bundler's own rewrite step works in both environments. */}
            <a
              href={`${import.meta.env.BASE_URL.replace(/showcase\/?$/, "")}index.html`}
              className="text-sm font-medium text-brand-dark hover:underline"
            >
              ← Component catalog
            </a>
            <Breadcrumbs
              items={[{ label: "Home", href: "#/", testId: "showcase-breadcrumb-home" }]}
              currentLabel={BREADCRUMB_LABEL[location.pathname] ?? "Dashboard"}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label htmlFor="gallery-theme-select" className="sr-only">
                Preview theme
              </label>
              <select
                id="gallery-theme-select"
                data-testid="showcase-theme-select"
                className="form-select w-28 text-sm sm:w-40"
              />
            </div>
            <DarkModeToggle data-testid="showcase-dark-toggle" />
            <NotificationCenter
              items={notifications}
              triggerTestId="showcase-notifications-trigger"
              panelTestId="showcase-notifications-panel"
            />
            <DropdownMenu
              trigger={<Avatar initials="JI" alt="Jane Ito" data-testid="showcase-user-avatar" />}
              items={[
                { id: "profile", label: "Your profile", onSelect: () => navigate("/settings") },
                { id: "signout", label: "Sign out", onSelect: () => {} },
              ]}
              triggerTestId="showcase-user-menu-trigger"
              panelTestId="showcase-user-menu-panel"
            />
          </div>
        </div>

        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/team" element={<TeamScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/analytics" element={<AnalyticsScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
        </Routes>
      </div>
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <ShowcaseLayout />
    </HashRouter>
  );
}
