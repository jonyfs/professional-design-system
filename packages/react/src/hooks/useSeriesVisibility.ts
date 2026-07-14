import { useState } from "react";
import type { ChartSeries } from "../Chart/types";

// Shared legend-toggle state (FR-015) — extracted so all 6 chart types
// manage "hide/show a data series" identically instead of each
// reimplementing the same Set-toggle logic.
export function useSeriesVisibility(series: ChartSeries[]) {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  const toggleKey = (key: string) =>
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const visibleSeries = series.filter((s) => !hiddenKeys.has(s.key));

  return { hiddenKeys, toggleKey, visibleSeries };
}
