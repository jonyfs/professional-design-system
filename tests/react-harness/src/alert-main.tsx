import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Alert } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

interface AlertData {
  id: string;
  variant: "success" | "error" | "warning" | "info";
  message: string;
}

const initialAlerts: AlertData[] = [
  { id: "1", variant: "info", message: "First dismissible notice." },
  { id: "2", variant: "success", message: "Second dismissible notice — dismissing one must not affect the other." },
];

function AlertDemo() {
  const [alerts, setAlerts] = useState(initialAlerts);
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Alert / Banner</h1>
      <div className="mt-8 max-w-md space-y-4" data-testid="alert-stack">
        <Alert data-testid="alert-non-dismissible" variant="warning" message="Non-dismissible notice." />
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            data-testid={`alert-dismissible-${alert.id}`}
            variant={alert.variant}
            message={alert.message}
            onDismiss={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
          />
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertDemo />
  </StrictMode>,
);
