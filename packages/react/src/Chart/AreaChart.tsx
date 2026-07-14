import { useId } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
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

export interface AreaChartProps extends ChartBaseProps {
  xAxisKey: string;
  /** Stacked variant for showing how multiple series contribute to a total (FR-003) */
  stacked?: boolean;
}

// contracts/core-charts.contract.md — Area Chart (FR-003).
export function AreaChart({
  data,
  series,
  xAxisKey,
  ariaLabel,
  stacked = false,
  showTooltip = true,
  showLegend = true,
}: AreaChartProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { hiddenKeys, toggleKey, visibleSeries } = useSeriesVisibility(series);

  if (data.length === 0) return <ChartEmptyState />;

  return (
    <figure className="w-full">
      <ChartFrame ariaLabel={ariaLabel} tableId={tableId}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-neutral-200))" />
            <XAxis dataKey={xAxisKey} stroke="rgb(var(--color-neutral-600))" />
            <YAxis stroke="rgb(var(--color-neutral-600))" />
            {showTooltip && <Tooltip content={<ChartTooltip />} />}
            {series.map((s, i) =>
              hiddenKeys.has(s.key) ? null : (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={colorForSlot(i)}
                  fill={colorForSlot(i)}
                  fillOpacity={0.2}
                  stackId={stacked ? "stack" : undefined}
                  connectNulls={false}
                  isAnimationActive={!prefersReducedMotion}
                />
              ),
            )}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </ChartFrame>
      {showLegend && (
        <ChartLegend series={series} colorForSlot={colorForSlot} hiddenKeys={hiddenKeys} onToggle={toggleKey} />
      )}
      <ChartDataTable id={tableId} data={data} series={visibleSeries} categoryKey={xAxisKey} />
    </figure>
  );
}
