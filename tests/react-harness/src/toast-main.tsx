import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Toast, type ToastProps } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

interface ToastItem {
  id: string;
  variant: ToastProps["variant"];
  message: string;
}

const INITIAL_TOASTS: ToastItem[] = [
  { id: "success", variant: "success", message: "Changes saved successfully." },
  { id: "error", variant: "error", message: "Failed to save changes." },
  { id: "info", variant: "info", message: "A new version is available." },
];

function ToastDemo() {
  const [toasts, setToasts] = useState(INITIAL_TOASTS);

  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Toast</h1>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        Transient, non-modal notifications. This demo renders all three variants
        statically, stacked as they would appear in a live page.
      </p>

      <div data-testid="toast-stack" className="toast-stack w-full sm:max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            data-testid={`toast-${toast.id}`}
            variant={toast.variant}
            message={toast.message}
            onDismiss={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastDemo />
  </StrictMode>,
);
