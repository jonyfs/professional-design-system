import { Alert } from "professional-design-system";

export function Default() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Alert variant="info" message="A new version of the design system is available." />
    </div>
  );
}

export function AllVariants() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <Alert variant="success" message="Your changes have been saved successfully." />
      <Alert variant="error" message="Payment failed — please update your billing details." />
      <Alert variant="warning" message="Your trial ends in 3 days. Upgrade to keep access." />
      <Alert variant="info" message="Scheduled maintenance begins Saturday at 2:00 AM UTC." />
    </div>
  );
}

export function Dismissible() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <Alert
        variant="success"
        message="Invoice #1042 was paid in full."
        onDismiss={() => {}}
        data-testid="invoice-alert"
      />
      <Alert
        variant="warning"
        message="Two team members are still awaiting onboarding approval."
        onDismiss={() => {}}
        data-testid="onboarding-alert"
      />
    </div>
  );
}
