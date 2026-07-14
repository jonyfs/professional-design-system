import { useId } from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { useChartColors } from "../hooks/useChartColors";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ChartDataTable } from "./ChartDataTable";
import { ChartEmptyState } from "./ChartEmptyState";

export interface RadialChartProps {
  value: number;
  min: number;
  max: number;
  label: string;
  ariaLabel: string;
}

// contracts/extended-charts.contract.md — Radial "gauge-style" Chart
// (FR-006, research.md R6). Single value against a range — no multi-series
// shape, no legend (nothing to toggle). The value's position relative to
// [min, max] is unambiguous via a centered numeric label, not color alone
// (spec.md US2 AC2, FR-016).
export function RadialChart({ value, min, max, label, ariaLabel }: RadialChartProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (max <= min) return <ChartEmptyState message="Invalid range" />;

  const data = [{ name: label, value }];

  return (
    <figure role="img" aria-label={ariaLabel} aria-describedby={tableId} className="relative w-full">
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[min, max]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: "rgb(var(--color-neutral-100))" }}
              dataKey="value"
              cornerRadius={8}
              fill={colorForSlot(0)}
              isAnimationActive={!prefersReducedMotion}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-neutral-900">
          {value} / {max}
        </span>
        <span className="text-xs text-neutral-600">{label}</span>
      </div>
      <ChartDataTable
        id={tableId}
        data={[{ metric: label, value }]}
        series={[{ key: "value", label: "Value" }]}
        categoryKey="metric"
        categoryLabel="Metric"
      />
    </figure>
  );
}
