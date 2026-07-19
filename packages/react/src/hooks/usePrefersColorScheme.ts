import { useEffect, useState } from "react";

const QUERY = "(prefers-color-scheme: dark)";

function readPreference(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

// Feature 045 — mirrors usePrefersReducedMotion's exact shape for the
// same category of browser API (a matchMedia-based OS preference).
// Consumers seed an initial theme choice from this only when no manual
// choice is already stored — a stored choice always wins (see
// src/scripts/theme-switcher.js's resolveInitialTheme).
export function usePrefersColorScheme(): boolean {
  const [prefersDark, setPrefersDark] = useState<boolean>(readPreference);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const handleChange = () => setPrefersDark(mediaQueryList.matches);
    handleChange();
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  return prefersDark;
}
