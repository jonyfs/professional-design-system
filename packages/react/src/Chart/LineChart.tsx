import { useId } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
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

export interface LineChartProps extends ChartBaseProps {
  xAxisKey: string;
}

// contracts/core-charts.contract.md — Line Chart (FR-001).
export function LineChart({
  data,
  series,
  xAxisKey,
  ariaLabel,
  showTooltip = true,
  showLegend = true,
}: LineChartProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { hiddenKeys, toggleKey, visibleSeries } = useSeriesVisibility(series);

  if (data.length === 0) return <ChartEmptyState />;

  return (
    <figure className="w-full">
      <ChartFrame ariaLabel={ariaLabel} tableId={tableId}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-neutral-200))" />
            <XAxis dataKey={xAxisKey} stroke="rgb(var(--color-neutral-600))" />
            <YAxis stroke="rgb(var(--color-neutral-600))" />
            {showTooltip && <Tooltip content={<ChartTooltip />} />}
            {series.map((s, i) =>
              hiddenKeys.has(s.key) ? null : (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={colorForSlot(i)}
                  connectNulls={false}
                  isAnimationActive={!prefersReducedMotion}
                />
              ),
            )}
          </RechartsLineChart>
        </ResponsiveContainer>
      </ChartFrame>
      {showLegend && (
        <ChartLegend series={series} colorForSlot={colorForSlot} hiddenKeys={hiddenKeys} onToggle={toggleKey} />
      )}
      <ChartDataTable id={tableId} data={data} series={visibleSeries} categoryKey={xAxisKey} />
    </figure>
  );
}
