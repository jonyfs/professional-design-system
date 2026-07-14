import type { ChartSeries } from "./types";

export interface ChartLegendProps {
  series: ChartSeries[];
  colorForSlot: (slot: number) => string;
  hiddenKeys: ReadonlySet<string>;
  onToggle: (key: string) => void;
}

// Shared, chart-type-independent legend (FR-015, contracts/
// shared-chart-chrome.contract.md) — real <button> elements per
// Constitution Principle V, not Recharts' default (non-interactive-by-
// default) legend. Rendered by the owning chart, not via Recharts' own
// <Legend content> prop, so this component fully owns toggle state and
// keyboard/focus behavior identically across all 6 chart types.
export function ChartLegend({ series, colorForSlot, hiddenKeys, onToggle }: ChartLegendProps) {
  return (
    <ul className="mt-2 flex flex-wrap justify-center gap-4">
      {series.map((s, i) => {
        const hidden = hiddenKeys.has(s.key);
        return (
          <li key={s.key}>
            <button
              type="button"
              onClick={() => onToggle(s.key)}
              aria-pressed={!hidden}
              className="flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium
                text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Inline style: runtime useChartColors() value — see
                  ChartTooltip.tsx's identical Principle III note. */}
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${hidden ? "opacity-30" : ""}`}
                style={{ backgroundColor: colorForSlot(i) }}
                aria-hidden="true"
              />
              <span className={hidden ? "text-neutral-400 line-through" : ""}>{s.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
