import { useEffect, useState } from "react";

const THRESHOLD = 400;

export interface BackToTopProps {
  "data-testid"?: string;
}

// Feature 031 (contracts/scroll-feedback.contract.md) — ships only the
// minimal scroll-threshold visibility logic this component needs, NOT
// a standalone "Affix" primitive (a different inventory category,
// research.md R2).
export function BackToTop({ "data-testid": testId }: BackToTopProps) {
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && window.scrollY > THRESHOLD,
  );

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      data-testid={testId}
      aria-label="Back to top"
      className="btn-primary fixed bottom-6 right-6 z-50 rounded-full p-3"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.53.22l6 6a.75.75 0 01-1.06 1.06L10.75 5.56V16.5a.75.75 0 01-1.5 0V5.56L4.53 10.28a.75.75 0 01-1.06-1.06l6-6A.75.75 0 0110 3z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
