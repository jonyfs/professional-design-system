import { useId } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartColors } from "../hooks/useChartColors";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useSeriesVisibility } from "../hooks/useSeriesVisibility";
import { ChartDataTable } from "./ChartDataTable";
import { ChartEmptyState } from "./ChartEmptyState";
import { ChartFrame } from "./ChartFrame";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";
import type { ChartBaseProps } from "./types";

export interface BarChartProps extends ChartBaseProps {
  xAxisKey: string;
}

// contracts/core-charts.contract.md — Bar Chart (FR-002), multi-series.
export function BarChart({
  data,
  series,
  xAxisKey,
  ariaLabel,
  showTooltip = true,
  showLegend = true,
}: BarChartProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { hiddenKeys, toggleKey, visibleSeries } = useSeriesVisibility(series);

  if (data.length === 0) return <ChartEmptyState />;

  return (
    <figure className="w-full">
      <ChartFrame ariaLabel={ariaLabel} tableId={tableId}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-neutral-200))" />
            <XAxis dataKey={xAxisKey} stroke="rgb(var(--color-neutral-600))" />
            <YAxis stroke="rgb(var(--color-neutral-600))" />
            {showTooltip && <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgb(var(--color-neutral-100))" }} />}
            {series.map((s, i) =>
              hiddenKeys.has(s.key) ? null : (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  fill={colorForSlot(i)}
                  isAnimationActive={!prefersReducedMotion}
                />
              ),
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartFrame>
      {showLegend && (
        <ChartLegend series={series} colorForSlot={colorForSlot} hiddenKeys={hiddenKeys} onToggle={toggleKey} />
      )}
      <ChartDataTable id={tableId} data={data} series={visibleSeries} categoryKey={xAxisKey} />
    </figure>
  );
}
