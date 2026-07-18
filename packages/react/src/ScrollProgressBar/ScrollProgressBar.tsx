import { useEffect, useState } from "react";

function computeScrollPercent(): number {
  if (typeof document === "undefined") return 0;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) return 0;
  return Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100));
}

export interface ScrollProgressBarProps {
  "data-testid"?: string;
}

// Feature 031 (contracts/scroll-feedback.contract.md) — reuses
// Progress's exact .progress-track/.progress-fill classes, driven by
// scroll position instead of a caller-supplied value.
export function ScrollProgressBar({ "data-testid": testId }: ScrollProgressBarProps) {
  const [percent, setPercent] = useState(computeScrollPercent);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setPercent(computeScrollPercent());
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div data-testid={testId} className="progress-track fixed top-0 left-0 right-0 z-50 h-1 w-full">
      <div className="progress-fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
