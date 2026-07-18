import { useEffect, useRef, useState } from "react";

const DURATION_MS = 400;

export interface RollingNumberProps {
  value: number;
  "data-testid"?: string;
}

// Feature 034 (contracts/rolling-number.contract.md) — applies this
// catalog's established rAF-throttle pattern (Scroll Progress Bar/
// Affix, features 031/032) to a numeric tween. A new animation always
// cancels any in-flight one first (spec.md Edge Case: rapid successive
// value changes must not stack/queue).
export function RollingNumber({ value, "data-testid": testId }: RollingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationFrameId = useRef<number | null>(null);
  const currentValue = useRef(value);

  useEffect(() => {
    if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
    const start = currentValue.current;
    const startTime = performance.now();

    function step(now: number) {
      const progress = Math.min(1, (now - startTime) / DURATION_MS);
      const next = Math.round(start + (value - start) * progress);
      currentValue.current = next;
      setDisplayValue(next);
      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(step);
      } else {
        animationFrameId.current = null;
      }
    }
    animationFrameId.current = requestAnimationFrame(step);
    return () => {
      if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
    };
  }, [value]);

  return (
    <span data-testid={testId} aria-live="polite">
      {displayValue.toLocaleString()}
    </span>
  );
}
