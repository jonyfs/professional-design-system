import { List } from "@professional-design-system/react";

const teamMembers = [
  {
    id: "1",
    avatar: { src: "https://i.pravatar.cc/80?img=12", alt: "Elena Vasquez" },
    title: "Elena Vasquez",
    metadata: "Design Lead · elena.vasquez@acme.co",
  },
  {
    id: "2",
    avatar: { alt: "Marcus Chen", initials: "MC" },
    title: "Marcus Chen",
    metadata: "Senior Engineer · marcus.chen@acme.co",
  },
  {
    id: "3",
    avatar: { src: "https://i.pravatar.cc/80?img=45", alt: "Priya Nair" },
    title: "Priya Nair",
    metadata: "Product Manager · priya.nair@acme.co",
  },
  {
    id: "4",
    avatar: { alt: "Sofia Torres", initials: "ST" },
    title: "Sofia Torres",
    metadata: "Engineer · sofia.torres@acme.co",
  },
];

export function Default() {
  return (
    <div style={{ maxWidth: 420 }}>
      <List items={teamMembers} data-testid="team-list" />
    </div>
  );
}

const notifications = [
  {
    id: "n1",
    avatar: { src: "https://i.pravatar.cc/80?img=32", alt: "Daniel Ortiz" },
    title: "Daniel Ortiz commented on your PR",
    metadata: "2 hours ago",
    href: "#pr-482",
  },
  {
    id: "n2",
    avatar: { alt: "Ana Reyes", initials: "AR" },
    title: "Ana Reyes assigned you a review",
    metadata: "5 hours ago",
    href: "#review-118",
  },
  {
    id: "n3",
    avatar: { src: "https://i.pravatar.cc/80?img=68", alt: "Liam Foster" },
    title: "Liam Foster mentioned you in #design-system",
    metadata: "Yesterday",
    href: "#thread-92",
  },
];

export function InteractiveWithTrailing() {
  return (
    <div style={{ maxWidth: 420 }}>
      <List items={notifications} interactive data-testid="notifications-list" />
    </div>
  );
}

const orderStatuses = [
  {
    id: "o1",
    avatar: { alt: "Order #2841", initials: "#2" },
    title: "Order #2841 — Wireless Keyboard",
    metadata: "Shipped · Jul 8, 2026",
    trailing: (
      <span style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>Delivered</span>
    ),
  },
  {
    id: "o2",
    avatar: { alt: "Order #2839", initials: "#2" },
    title: "Order #2839 — Studio Monitor Stand",
    metadata: "Processing · Jul 9, 2026",
    trailing: (
      <span style={{ fontSize: 13, fontWeight: 600, color: "#d97706" }}>In transit</span>
    ),
  },
  {
    id: "o3",
    avatar: { alt: "Order #2830", initials: "#2" },
    title: "Order #2830 — Desk Lamp",
    metadata: "Delivered · Jul 3, 2026",
    trailing: <span style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>Delivered</span>,
  },
];

export function WithTrailingContent() {
  return (
    <div style={{ maxWidth: 460 }}>
      <List items={orderStatuses} data-testid="orders-list" />
    </div>
  );
}
