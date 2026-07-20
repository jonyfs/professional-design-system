import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Avatar } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

const IMG =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2280%22%20height%3D%2280%22%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%239CA3AF%22/%3E%3C/svg%3E";

function AvatarDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Avatar</h1>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <Avatar src={IMG} alt="Jane Cooper" size="lg" data-testid="avatar-image-lg" />
        <Avatar initials="AM" alt="Alex Morgan" size="lg" data-testid="avatar-fallback-lg" />
        <Avatar src={IMG} alt="Sam Rivera" size="sm" data-testid="avatar-image-sm" />
        <Avatar initials="PS" alt="Priya Singh" size="sm" data-testid="avatar-fallback-sm" />
        <Avatar initials="M" alt="Madonna" size="lg" data-testid="avatar-fallback-single" />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AvatarDemo />
  </StrictMode>,
);
