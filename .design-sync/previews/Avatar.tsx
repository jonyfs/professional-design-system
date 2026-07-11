import { Avatar } from "@professional-design-system/react";

// Flat-color placeholder photo as a data: URI — mirrors the static
// reference (src/components/avatar/avatar.html), which uses the same
// technique so the image variant renders without any network dependency.
const PHOTO =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2280%22%20height%3D%2280%22%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%236366F1%22/%3E%3C/svg%3E";

export function ImageAndFallback() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar src={PHOTO} alt="Jane Cooper" size="lg" />
      <Avatar alt="Alex Morgan" initials="AM" size="lg" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar src={PHOTO} alt="Sam Rivera" size="sm" />
      <Avatar src={PHOTO} alt="Sam Rivera" size="lg" />
      <Avatar alt="Priya Singh" initials="PS" size="sm" />
      <Avatar alt="Priya Singh" initials="PS" size="lg" />
    </div>
  );
}

export function TeamList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar src={PHOTO} alt="Jane Cooper" size="sm" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Jane Cooper</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Product design</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar alt="Alex Morgan" initials="AM" size="sm" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Alex Morgan</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Engineering</div>
        </div>
      </div>
    </div>
  );
}
