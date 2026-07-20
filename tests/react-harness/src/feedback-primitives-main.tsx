import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  RingProgress,
  SemiCircleProgress,
  NotificationCenter,
  PasswordStrengthMeter,
} from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

function PasswordStrengthDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="mt-3 max-w-md">
      <label htmlFor="password-strength-demo" className="text-sm font-medium text-neutral-900">
        Password
      </label>
      <input
        id="password-strength-demo"
        data-testid="password-strength-input"
        type="password"
        autoComplete="new-password"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="mt-1 block w-full rounded-md border-0 bg-neutral-50 py-1.5 text-neutral-900 shadow-sm
                   ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-600
                   focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
      />
      <div className="mt-2">
        <PasswordStrengthMeter value={value} data-testid="password-strength-demo-meter" />
      </div>
    </div>
  );
}

function FeedbackPrimitivesDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Feedback Primitives</h1>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">RingProgress</h2>
      <div className="mt-3 flex flex-wrap gap-8">
        <RingProgress value={0} label="Storage used: 0%" data-testid="ring-progress-0" />
        <RingProgress value={60} label="Storage used: 60%" data-testid="ring-progress-60" />
        <RingProgress
          value={100}
          label="Storage used: 100%"
          color="success"
          data-testid="ring-progress-100"
        />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">SemiCircleProgress</h2>
      <div className="mt-3 flex flex-wrap gap-8">
        <SemiCircleProgress value={30} label="CPU usage: 30%" data-testid="semi-circle-progress-30" />
        <SemiCircleProgress
          value={75}
          label="CPU usage: 75%"
          color="warning"
          data-testid="semi-circle-progress-75"
        />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Notification Center</h2>
      <div className="mt-3 flex flex-wrap gap-8">
        <NotificationCenter
          triggerTestId="notification-trigger"
          panelTestId="notification-panel"
          items={[
            { message: "New comment on your post", timestamp: "2 minutes ago", read: false },
            { message: "Your export is ready to download", timestamp: "1 hour ago", read: false },
            { message: "Weekly report ready", timestamp: "1 day ago", read: true },
          ]}
        />
        <NotificationCenter
          triggerTestId="notification-trigger-empty"
          panelTestId="notification-panel-empty"
          items={[]}
        />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Password Strength Meter</h2>
      <PasswordStrengthDemo />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FeedbackPrimitivesDemo />
  </StrictMode>,
);
