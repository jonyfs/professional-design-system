import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sidebar,
  Navbar,
  Avatar,
  AvatarGroup,
  Breadcrumbs,
  Tabs,
  CommandPalette,
  DropdownMenu,
  ActionIcon,
  Button,
  Card,
  Badge,
  RollingNumber,
  DataTable,
  Pagination,
  LineChart,
  Toast,
  NotificationCenter,
  Modal,
  DarkModeToggle,
  ContextSwitcher,
  type SidebarItemData,
} from "@professional-design-system/react";
import {
  organizations,
  teamMembers,
  tableRows,
  chartSeries,
  notifications,
  metrics,
  type Metric,
} from "./data/sample-data";

// Feature 042 — the numeric formats in sample-data.ts ("$58,240", "2.1%")
// don't fit RollingNumber's plain-`value: number` prop (packages/react/src/
// RollingNumber/RollingNumber.tsx): it Math.rounds and toLocaleStrings the
// value itself, so a pre-formatted string can't pass through unchanged.
// This splits the fictional string into an optional prefix/suffix the
// component renders as static text around the animated numeric core.
function parseMetric(raw: string): { prefix: string; value: number; suffix: string } {
  const match = raw.match(/^([^0-9]*)([0-9.,]+)(.*)$/);
  if (!match) return { prefix: "", value: 0, suffix: raw };
  const [, prefix, numeric, suffix] = match;
  return { prefix, value: Number(numeric.replace(/,/g, "")), suffix };
}

const BADGE_VARIANT: Record<Metric["trend"], "success" | "error" | "neutral"> = {
  up: "success",
  down: "error",
  flat: "neutral",
};

const CUSTOMERS_PAGE_SIZE = 5;
const TEAM_PAGE_SIZE = 2;

export function App() {
  const [activeSidebarId, setActiveSidebarId] = useState("overview");
  const [teamPage, setTeamPage] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const modalTriggerRef = useRef<HTMLButtonElement>(null);

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

  const sidebarItems: SidebarItemData[] = [
    { id: "overview", label: "Overview", href: "#overview", active: activeSidebarId === "overview" },
    { id: "customers", label: "Customers", href: "#customers", active: activeSidebarId === "customers" },
    { id: "team", label: "Team", href: "#team", active: activeSidebarId === "team" },
    { id: "reports", label: "Reports", href: "#reports", active: activeSidebarId === "reports" },
  ];

  const teamPages = Math.ceil(teamMembers.length / TEAM_PAGE_SIZE);
  const visibleTeamMembers = teamMembers.slice(
    (teamPage - 1) * TEAM_PAGE_SIZE,
    teamPage * TEAM_PAGE_SIZE,
  );

  const chartData = useMemo(
    () => chartSeries.map((point) => ({ month: point.label, signups: point.value })),
    [],
  );

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
          onItemClick={setActiveSidebarId}
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
          links={[
            { label: "Overview", href: "#overview" },
            { label: "Customers", href: "#customers" },
            { label: "Team", href: "#team" },
            { label: "Reports", href: "#reports" },
          ]}
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
              items={[{ label: "Home", href: "#overview", testId: "showcase-breadcrumb-home" }]}
              currentLabel="Dashboard"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ActionIcon
              variant="secondary"
              ariaLabel="Export customers as CSV"
              icon={
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M10 2a.75.75 0 0 1 .75.75v8.69l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V2.75A.75.75 0 0 1 10 2Z" />
                  <path d="M3.5 12.75a.75.75 0 0 1 .75.75v2a1 1 0 0 0 1 1h9.5a1 1 0 0 0 1-1v-2a.75.75 0 0 1 1.5 0v2A2.5 2.5 0 0 1 14.75 18h-9.5A2.5 2.5 0 0 1 2.75 15.5v-2a.75.75 0 0 1 .75-.75Z" />
                </svg>
              }
              onClick={() => setToastVisible(true)}
            />
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
                { id: "profile", label: "Your profile", onSelect: () => setModalOpen(true) },
                { id: "signout", label: "Sign out", onSelect: () => setToastVisible(true) },
              ]}
              triggerTestId="showcase-user-menu-trigger"
              panelTestId="showcase-user-menu-panel"
            />
          </div>
        </div>

        <main className="flex-1 space-y-8 overflow-y-auto p-6">
          <section id="overview" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {metrics.map((metric) => {
              const { prefix, value, suffix } = parseMetric(metric.value);
              return (
                <Card key={metric.label} elevated className="space-y-2 p-5">
                  <p className="text-sm font-medium text-neutral-600">{metric.label}</p>
                  <p className="text-2xl font-semibold tabular-nums">
                    {prefix}
                    {suffix === "%" ? value : <RollingNumber value={value} />}
                    {suffix}
                  </p>
                  <Badge variant={BADGE_VARIANT[metric.trend]}>{metric.trend}</Badge>
                </Card>
              );
            })}
          </section>

          <section aria-labelledby="signups-heading">
            <Card elevated className="p-5">
              <h2 id="signups-heading" className="mb-4 text-lg font-semibold">
                Monthly signups
              </h2>
              <LineChart
                data={chartData}
                series={[{ key: "signups", label: "Signups" }]}
                xAxisKey="month"
                ariaLabel="Monthly signups trend"
                showTooltip
                showLegend
              />
            </Card>
          </section>

          <section id="customers">
            <Tabs
              tabs={[
                {
                  id: "customers",
                  label: "Customers",
                  content: (
                    <div className="overflow-x-auto">
                      <DataTable
                        columns={[
                          { id: "name", label: "Company", sortable: true, filterable: true },
                          { id: "status", label: "Status", sortable: true, filterable: true },
                          { id: "value", label: "Value", sortable: true, filterable: false },
                          { id: "updatedAt", label: "Updated", sortable: true, filterable: false },
                        ]}
                        rows={tableRows.map((row) => ({ ...row }))}
                        ariaLabel="Customer accounts"
                        pageSize={CUSTOMERS_PAGE_SIZE}
                      />
                    </div>
                  ),
                },
                {
                  id: "team",
                  label: "Team",
                  content: (
                    <div id="team" className="space-y-4">
                      <AvatarGroup
                        members={teamMembers.map((member) => ({ alt: member.name, initials: member.initials }))}
                        limit={3}
                        aria-label="Workspace team members"
                        data-testid="showcase-team-avatar-group"
                      />
                      <ul className="space-y-2">
                        {visibleTeamMembers.map((member) => (
                          <li key={member.id} className="flex items-center gap-3">
                            <Avatar initials={member.initials} alt={member.name} size="sm" />
                            <span className="font-medium">{member.name}</span>
                            <span className="text-sm text-neutral-600">{member.role}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-end">
                        <Pagination
                          currentPage={teamPage}
                          totalPages={teamPages}
                          onPageChange={setTeamPage}
                          data-testid="showcase-team-pagination"
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
              defaultSelectedId="customers"
            />
          </section>

          <section id="reports" className="flex items-center gap-3">
            <Button
              ref={modalTriggerRef}
              variant="primary"
              onClick={() => setModalOpen(true)}
            >
              View account details
            </Button>
            <Button variant="secondary" onClick={() => setToastVisible(true)}>
              Send weekly report
            </Button>
          </section>
        </main>
      </div>

      <CommandPalette
        actions={[
          {
            id: "goto-customers",
            label: "Go to customers",
            onExecute: () => document.getElementById("customers")?.scrollIntoView({ behavior: "smooth" }),
          },
          {
            id: "goto-team",
            label: "Go to team",
            onExecute: () => {
              // useCommandPalette's execute() calls onExecute() BEFORE
              // setOpen(false) (packages/react/src/hooks/useCommandPalette.ts),
              // and the palette's own dialog is still the native modal
              // top layer at that point — everything outside it is inert,
              // so a synchronous click on the Team tab has no effect.
              // Deferring to the next tick runs this after the dialog has
              // actually closed.
              setTimeout(() => {
                // Tabs (packages/react/src/Tabs) only renders the active
                // panel's content, so #team stays zero-sized until its
                // own tab is actually selected — scrollIntoView alone
                // can't reveal it.
                const teamTab = [...document.querySelectorAll<HTMLButtonElement>("[role='tab']")].find(
                  (tab) => tab.textContent === "Team",
                );
                teamTab?.click();
                // click() triggers React's setSelectedId, but that state
                // update hasn't flushed to the DOM yet in this same tick —
                // calling scrollIntoView synchronously here measures the
                // still-zero-sized #team from before the tab switch.
                // requestAnimationFrame runs after the browser's next
                // paint, guaranteeing the re-rendered (now-visible) panel
                // is what gets measured.
                requestAnimationFrame(() => {
                  document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
                });
              }, 0);
            },
          },
          { id: "send-report", label: "Send weekly report", onExecute: () => setToastVisible(true) },
        ]}
        data-testid="showcase-command-palette"
      />

      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            variant="success"
            message="Report sent to the team"
            onDismiss={() => setToastVisible(false)}
          />
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Northwind Traders — account details"
        triggerRef={modalTriggerRef}
        closeButtonTestId="showcase-modal-close"
      >
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-600">Status</dt>
            <dd className="font-medium">Active</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-600">Lifetime value</dt>
            <dd className="font-medium">$12,400</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-600">Last updated</dt>
            <dd className="font-medium">2026-07-16</dd>
          </div>
        </dl>
      </Modal>
    </div>
  );
}
