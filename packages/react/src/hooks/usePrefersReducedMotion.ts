import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function readPreference(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

// First reduced-motion hook in this catalog (research.md R5) — gates
// Recharts' isAnimationActive prop (FR-013) rather than relying on a CSS
// override, since Recharts drives animation via internal JS state, not
// CSS transitions a media query could intercept.
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(readPreference);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const handleChange = () => setPrefersReducedMotion(mediaQueryList.matches);
    handleChange();
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
