interface TooltipPayloadEntry {
  color?: string;
  name?: string;
  value?: string | number;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string | number;
}

// Shared, chart-type-independent tooltip (FR-014, contracts/
// shared-chart-chrome.contract.md) — every chart composes this identically
// via Recharts' custom `content` renderer (research.md R7) rather than each
// chart type styling Recharts' default tooltip independently.
export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 shadow-md">
      {label !== undefined && <p className="mb-1 text-xs font-semibold text-neutral-900">{label}</p>}
      <ul className="space-y-0.5">
        {payload.map((entry, index) => (
          <li key={index} className="flex items-center gap-2 text-xs text-neutral-600">
            {/* Inline style, not className: entry.color is a runtime
                useChartColors() value Tailwind's static class scanner can't
                express — same documented Principle III exception as the
                chart SVG props themselves (plan.md Constitution Check). */}
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="font-medium text-neutral-900">{entry.name}:</span>
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
