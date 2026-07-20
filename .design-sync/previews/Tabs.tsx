import { Tabs } from "professional-design-system";

export function Default() {
  return (
    <Tabs
      tabs={[
        {
          id: "overview",
          label: "Overview",
          content: (
            <p style={{ fontSize: 14, color: "#4b5563" }}>
              A summary of account activity, usage, and recent changes appears here.
            </p>
          ),
        },
        {
          id: "activity",
          label: "Activity",
          content: (
            <p style={{ fontSize: 14, color: "#4b5563" }}>
              Sign-ins, permission changes, and API calls from the last 30 days.
            </p>
          ),
        },
        {
          id: "settings",
          label: "Settings",
          content: (
            <p style={{ fontSize: 14, color: "#4b5563" }}>
              Manage notification preferences, connected apps, and account visibility.
            </p>
          ),
        },
      ]}
    />
  );
}

export function SecondTabSelected() {
  return (
    <Tabs
      defaultSelectedId="activity"
      tabs={[
        {
          id: "overview",
          label: "Overview",
          content: <p style={{ fontSize: 14, color: "#4b5563" }}>Project overview and health.</p>,
        },
        {
          id: "activity",
          label: "Activity",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 14, color: "#4b5563" }}>Recent activity:</p>
              <p style={{ fontSize: 13, color: "#6b7280" }}>• Jane Cooper merged PR #482</p>
              <p style={{ fontSize: 13, color: "#6b7280" }}>• Deploy to production succeeded</p>
              <p style={{ fontSize: 13, color: "#6b7280" }}>• 3 new comments on issue #91</p>
            </div>
          ),
        },
        {
          id: "settings",
          label: "Settings",
          content: <p style={{ fontSize: 14, color: "#4b5563" }}>Project configuration.</p>,
        },
      ]}
    />
  );
}

export function WithDisabledTab() {
  return (
    <Tabs
      tabs={[
        {
          id: "details",
          label: "Details",
          content: <p style={{ fontSize: 14, color: "#4b5563" }}>Plan details and current usage.</p>,
        },
        {
          id: "invoices",
          label: "Invoices",
          content: <p style={{ fontSize: 14, color: "#4b5563" }}>Download past invoices as PDF.</p>,
        },
        {
          id: "usage",
          label: "Usage (upgrade required)",
          content: <p style={{ fontSize: 14, color: "#4b5563" }}>Not available on your plan.</p>,
          disabled: true,
        },
      ]}
    />
  );
}
