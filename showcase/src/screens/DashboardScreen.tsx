import { useMemo, useRef, useState } from "react";
import {
  Tabs,
  CommandPalette,
  Button,
  Card,
  Badge,
  RollingNumber,
  DataTable,
  Pagination,
  LineChart,
  Toast,
  Modal,
  AvatarGroup,
  Avatar,
} from "professional-design-system";
import { teamMembers, tableRows, chartSeries, metrics, type Metric } from "../data/sample-data";

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

// Feature 047 — unchanged from the original single-screen App.tsx (feature
// 042) other than the import paths: this content now mounts at the
// router's root route instead of being the entire app. Left verbatim so
// the 4 defects that build originally found and fixed (dark-theme
// contrast, DarkModeToggle/select desync, CommandPalette execute-order,
// Chart resize false-positive) can't be reintroduced by this refactor.
export function DashboardScreen() {
  const [teamPage, setTeamPage] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const modalTriggerRef = useRef<HTMLButtonElement>(null);

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
    <>
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
          <Button ref={modalTriggerRef} variant="primary" onClick={() => setModalOpen(true)}>
            View account details
          </Button>
          <Button variant="secondary" onClick={() => setToastVisible(true)}>
            Send weekly report
          </Button>
        </section>
      </main>

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
    </>
  );
}
