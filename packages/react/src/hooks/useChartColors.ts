import { useEffect, useState } from "react";
import { CHART_COLOR_TOKENS } from "../Chart/chartColorPalette";

function readPalette(): string[] {
  // SSR/no-DOM guard — mirrors this catalog's other browser-only hooks.
  if (typeof document === "undefined") return CHART_COLOR_TOKENS.map(() => "rgb(0 0 0)");
  const rootStyle = getComputedStyle(document.documentElement);
  return CHART_COLOR_TOKENS.map((token) => `rgb(${rootStyle.getPropertyValue(token).trim()})`);
}

// Reads the live --color-* custom-property values (research.md R2) rather
// than a static JS color map, so a theme-preset change (feature 017's
// data-theme attribute swap) re-colors every chart automatically — the
// MutationObserver below is what notices that swap and triggers a re-read.
export function useChartColors() {
  const [palette, setPalette] = useState<string[]>(readPalette);

  useEffect(() => {
    const root = document.documentElement;
    const refresh = () => setPalette(readPalette());
    refresh();

    const observer = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.attributeName === "data-theme")) refresh();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const colorForSlot = (slot: number): string => palette[slot % palette.length];

  return { palette, colorForSlot };
}
