import { useEffect, useState } from "react";

export interface OfflineBannerProps {
  "data-testid"?: string;
}

// Feature 030 (contracts/system-banners.contract.md) — this catalog's
// first use of the native online/offline events. Renders nothing while
// online; no manual dismiss control, since connectivity isn't a
// user-controllable condition.
export function OfflineBanner({ "data-testid": testId }: OfflineBannerProps) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div data-testid={testId} role="status" className="alert alert-warning">
      <p className="flex-1 text-sm font-medium text-neutral-900">
        You're offline. Some features may be unavailable.
      </p>
    </div>
  );
}
