import { useEffect, useState } from "react";

const DARK_THEME_ID = "dim";
const LIGHT_THEME_ID = "light";
const STORAGE_KEY = "pds-theme"; // same key as the static site's theme-switcher.js — one persistence source of truth

function applyTheme(themeId: string) {
  document.documentElement.dataset.theme = themeId;
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    // Persistence failure (quota, blocked storage) must not block the
    // theme from applying — same defensive pattern as theme-switcher.js.
  }
}

export interface DarkModeToggleProps {
  "data-testid"?: string;
}

// Feature 030 (contracts/dark-mode-toggle.contract.md) — a self-contained
// minimal port, NOT an import of the static site's theme-switcher.js (a
// different package/bundle). Ports only the light/dim pair this
// component needs (spec.md's documented scope decision), not the full
// 48-theme THEMES array. Read side mirrors useChartColors.ts's own
// read-only MutationObserver precedent — the only prior example in this
// package of a component reacting to global theme state.
export function DarkModeToggle({ "data-testid": testId }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.dataset.theme === DARK_THEME_ID,
  );

  useEffect(() => {
    const sync = () => setIsDark(document.documentElement.dataset.theme === DARK_THEME_ID);
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <span className="relative inline-flex h-6 w-11 items-center">
        <input
          data-testid={testId}
          type="checkbox"
          checked={isDark}
          onChange={(e) => applyTheme(e.target.checked ? DARK_THEME_ID : LIGHT_THEME_ID)}
          className="peer sr-only"
        />
        <span className="toggle-track"></span>
        <span className="toggle-dot"></span>
      </span>
      <span className="text-sm text-neutral-900">Dark mode</span>
    </label>
  );
}
