import { useEffect, useState } from "react";
import { Modal } from "../Modal/Modal";

export interface SessionTimeoutModalProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  startSeconds?: number;
}

// Feature 030 (contracts/session-timeout-modal.contract.md) — composes
// the existing Modal component rather than a second <dialog> mechanism.
// This catalog's first interval-driven countdown; ships only what
// Session Timeout Modal itself needs, not a standalone reusable
// "Countdown Timer" primitive (a different inventory category).
export function SessionTimeoutModal({
  open,
  onClose,
  onLogout,
  startSeconds = 30,
}: SessionTimeoutModalProps) {
  const [remaining, setRemaining] = useState(startSeconds);

  useEffect(() => {
    if (!open) return;
    setRemaining(startSeconds);
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [open, startSeconds]);

  return (
    <Modal open={open} onClose={onClose} title="Session about to expire">
      <p className="mt-2 text-sm text-neutral-600">
        {remaining > 0 ? (
          <span data-testid="session-timeout-countdown" aria-live="polite">
            You'll be signed out in {remaining}s
          </span>
        ) : (
          <span data-testid="session-timeout-expired" aria-live="polite">
            You have been signed out.
          </span>
        )}
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" data-testid="session-timeout-logout" className="btn-secondary" onClick={onLogout}>
          Log out now
        </button>
        <button type="button" data-testid="session-timeout-stay" className="btn-primary" onClick={onClose}>
          Stay signed in
        </button>
      </div>
    </Modal>
  );
}
