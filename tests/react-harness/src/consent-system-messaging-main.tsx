import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  SessionTimeoutModal,
  OfflineBanner,
  SystemBanner,
  DarkModeToggle,
} from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

function SessionTimeoutDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" data-testid="session-timeout-trigger" className="btn-secondary" onClick={() => setOpen(true)}>
        Simulate session timeout warning
      </button>
      <SessionTimeoutModal
        open={open}
        onClose={() => setOpen(false)}
        onLogout={() => setOpen(false)}
        startSeconds={30}
      />
    </>
  );
}

function ConsentSystemMessagingDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Consent & System Messaging</h1>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Session Timeout Modal</h2>
      <div className="mt-3">
        <SessionTimeoutDemo />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Offline Banner</h2>
      <div className="mt-3 max-w-md" data-testid="offline-banner-wrapper">
        <OfflineBanner data-testid="offline-banner" />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">2FA Reminder Banner</h2>
      <div className="mt-3 max-w-md">
        <SystemBanner
          data-testid="two-factor-reminder-banner"
          severity="warning"
          message="Add two-factor authentication to secure your account."
          action={{ label: "Complete setup" }}
        />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Maintenance / Announcement Bar</h2>
      <div className="mt-3">
        <SystemBanner
          data-testid="maintenance-banner"
          severity="info"
          message="Scheduled maintenance Sunday 02:00-04:00 UTC. Some features may be briefly unavailable."
          fullWidth
        />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Dark Mode Toggle</h2>
      <div className="mt-3">
        <DarkModeToggle data-testid="dark-mode-toggle" />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConsentSystemMessagingDemo />
  </StrictMode>,
);
