import { Accordion } from "professional-design-system";

export function Default() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Accordion
        items={[
          {
            id: "shipping",
            trigger: "What are your shipping options?",
            content:
              "We offer standard (5-7 business days), express (2-3 business days), and overnight shipping within the continental US.",
          },
          {
            id: "returns",
            trigger: "What is your return policy?",
            content:
              "Items can be returned within 30 days of delivery for a full refund, provided they're unused and in original packaging.",
          },
          {
            id: "warranty",
            trigger: "Do products come with a warranty?",
            content:
              "All products include a 1-year limited manufacturer warranty covering defects in materials and workmanship.",
          },
        ]}
      />
    </div>
  );
}

export function ExpandedItem() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Accordion
        exclusive
        items={[
          {
            id: "billing",
            trigger: "How does billing work?",
            content:
              "You're billed monthly on the date you first subscribed. Upgrades and downgrades are prorated automatically.",
            defaultOpen: true,
          },
          {
            id: "cancel",
            trigger: "Can I cancel anytime?",
            content:
              "Yes — cancel from Account Settings at any time. You'll retain access until the end of your current billing period.",
          },
          {
            id: "invoices",
            trigger: "Where can I find past invoices?",
            content:
              "Past invoices are available under Billing → Invoice history, and can be downloaded as PDF.",
          },
        ]}
      />
    </div>
  );
}

export function HelpCenterSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Account & billing</span>
      <Accordion
        items={[
          {
            id: "password",
            trigger: "I forgot my password",
            content: "Use the \"Forgot password\" link on the sign-in page to reset it via email.",
            defaultOpen: true,
          },
          {
            id: "twofactor",
            trigger: "How do I enable two-factor authentication?",
            content: "Go to Account Settings → Security and toggle on two-factor authentication.",
          },
        ]}
      />
    </div>
  );
}
