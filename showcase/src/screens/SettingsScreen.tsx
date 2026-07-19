import { useState } from "react";
import {
  Card,
  Tabs,
  TextInput,
  Textarea,
  ColorInput,
  FileInput,
  Toggle,
  Radio,
  Checkbox,
  Accordion,
  Divider,
  Button,
} from "@professional-design-system/react";

// Feature 047 — Settings/preferences screen: the "account configuration"
// surface every real SaaS product has, distinct from Dashboard/Team.
export function SettingsScreen() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [plan, setPlan] = useState("pro");
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <main className="flex-1 space-y-8 overflow-y-auto p-6">
      <Card elevated className="p-5">
        <Tabs
          tabs={[
            {
              id: "profile",
              label: "Profile",
              content: (
                <div className="max-w-lg space-y-4">
                  <TextInput label="Display name" defaultValue="Jane Ito" />
                  <Textarea label="Bio" defaultValue="Product lead at Acme Inc." />
                  <FileInput label="Profile photo" accept="image/*" />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-900">Accent color</label>
                    <ColorInput defaultValue="#0066ff" />
                  </div>
                </div>
              ),
            },
            {
              id: "notifications",
              label: "Notifications",
              content: (
                <div className="max-w-lg space-y-4">
                  {/* Toggle's root is `inline-flex` by design (a self-contained
                      label+control unit meant to sit inline with other content) —
                      `flex flex-col` here forces vertical stacking for this list,
                      rather than relying on `space-y-*`'s margin-only spacing,
                      which doesn't force inline-flex siblings onto separate lines. */}
                  <div className="flex flex-col gap-3">
                    <Toggle
                      label="Email notifications"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <Toggle
                      label="Weekly digest"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                    />
                  </div>
                  <Divider />
                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium text-neutral-900">Plan</legend>
                    <Radio
                      name="plan"
                      label="Starter"
                      checked={plan === "starter"}
                      onChange={() => setPlan("starter")}
                    />
                    <Radio name="plan" label="Pro" checked={plan === "pro"} onChange={() => setPlan("pro")} />
                    <Radio
                      name="plan"
                      label="Enterprise"
                      checked={plan === "enterprise"}
                      onChange={() => setPlan("enterprise")}
                    />
                  </fieldset>
                </div>
              ),
            },
            {
              id: "security",
              label: "Security",
              content: (
                <div className="max-w-lg space-y-4">
                  <Checkbox
                    label="Require two-factor authentication"
                    checked={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.checked)}
                  />
                  <Divider />
                  <Accordion
                    exclusive
                    items={[
                      {
                        id: "sessions",
                        trigger: "Active sessions",
                        content: (
                          <p className="text-sm text-neutral-600">
                            2 devices are currently signed in to this workspace.
                          </p>
                        ),
                      },
                      {
                        id: "api-keys",
                        trigger: "API keys",
                        content: (
                          <p className="text-sm text-neutral-600">
                            No API keys have been generated for this workspace yet.
                          </p>
                        ),
                      },
                      {
                        id: "danger-zone",
                        trigger: "Danger zone",
                        content: (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-neutral-600">Permanently delete this workspace.</p>
                            <Button variant="secondary">Delete workspace</Button>
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
          defaultSelectedId="profile"
        />
      </Card>
    </main>
  );
}
