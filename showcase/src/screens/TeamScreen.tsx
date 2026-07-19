import { useRef, useState } from "react";
import {
  Card,
  AvatarGroup,
  Badge,
  DataTable,
  Modal,
  Button,
  Tooltip,
  ContextMenu,
  TextInput,
  Select,
} from "@professional-design-system/react";
import { teamRecords } from "../data/sample-data";

const ROLE_VARIANT: Record<string, "success" | "neutral" | "warning"> = {
  Admin: "success",
  Member: "neutral",
  Viewer: "warning",
};

// Feature 047 — Team/member management screen. Distinct realistic purpose
// from Dashboard's "Team" tab (which stays untouched, spec.md's own
// no-regression constraint): this is a dedicated admin surface for
// managing the roster itself (invite, edit role, remove), not a read-only
// summary panel.
export function TeamScreen() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const inviteTriggerRef = useRef<HTMLButtonElement>(null);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const visibleRecords = teamRecords.filter((r) => !removedIds.includes(r.id));
  const roleCounts = visibleRecords.reduce<Record<string, number>>((acc, r) => {
    acc[r.role] = (acc[r.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="flex-1 space-y-8 overflow-y-auto p-6">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <AvatarGroup
            members={visibleRecords.map((r) => ({ alt: r.name, initials: r.initials }))}
            limit={4}
            aria-label="Workspace members"
            data-testid="team-screen-avatar-group"
          />
          <div className="flex items-center gap-2">
            {Object.entries(roleCounts).map(([role, count]) => (
              <Badge key={role} variant={ROLE_VARIANT[role]}>
                {count} {role}
                {count === 1 ? "" : "s"}
              </Badge>
            ))}
          </div>
        </div>
        <Tooltip label="Sends a workspace invite email with a magic link" anchor={3}>
          <Button ref={inviteTriggerRef} variant="primary" onClick={() => setInviteOpen(true)}>
            Invite member
          </Button>
        </Tooltip>
      </section>

      <Card elevated className="p-5">
        <ContextMenu
          menuLabel="Row actions"
          items={[
            { id: "edit", label: "Edit role", onSelect: () => {} },
            { id: "resend", label: "Resend invite", onSelect: () => {} },
            {
              id: "remove",
              label: "Remove member",
              onSelect: () => {
                const last = visibleRecords[visibleRecords.length - 1];
                if (last) setRemovedIds((ids) => [...ids, last.id]);
              },
            },
          ]}
          targetTestId="team-screen-table-context-target"
          panelTestId="team-screen-context-panel"
        >
          <div className="overflow-x-auto">
            <DataTable
              columns={[
                { id: "name", label: "Name", sortable: true, filterable: true },
                { id: "email", label: "Email", sortable: true, filterable: true },
                { id: "role", label: "Role", sortable: true, filterable: true },
                { id: "status", label: "Status", sortable: true, filterable: true },
                { id: "joinedDate", label: "Joined", sortable: true, filterable: false },
              ]}
              rows={visibleRecords.map((r) => ({
                id: r.id,
                name: r.name,
                email: r.email,
                role: r.role,
                status: r.status === "active" ? "Active" : "Invited",
                joinedDate: r.joinedDate,
              }))}
              ariaLabel="Workspace members"
              pageSize={4}
            />
          </div>
        </ContextMenu>
      </Card>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a member"
        triggerRef={inviteTriggerRef}
        closeButtonTestId="team-screen-invite-modal-close"
      >
        <div className="space-y-4">
          <TextInput label="Email address" type="email" placeholder="teammate@company.com" />
          <Select
            label="Role"
            options={[
              { value: "member", label: "Member" },
              { value: "viewer", label: "Viewer" },
              { value: "admin", label: "Admin" },
            ]}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setInviteOpen(false)}
              data-testid="team-screen-send-invite"
            >
              Send invite
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
