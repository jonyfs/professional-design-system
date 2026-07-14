import { useId } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Line,
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
import type { ChartDatum, ComposedSeriesConfig } from "./types";

export interface ComposedChartProps {
  data: ChartDatum[];
  series: ComposedSeriesConfig[];
  xAxisKey: string;
  ariaLabel: string;
  showTooltip?: boolean;
  showLegend?: boolean;
}

// contracts/composed-scatter.contract.md — Composed Chart (FR-001).
// Combines bar/line/area series sharing one category axis, with an
// opt-in secondary Y-axis (research.md R3) for series with disparate
// value ranges — only rendered when at least one series requests it.
export function ComposedChart({
  data,
  series,
  xAxisKey,
  ariaLabel,
  showTooltip = true,
  showLegend = true,
}: ComposedChartProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { hiddenKeys, toggleKey, visibleSeries } = useSeriesVisibility(series);
  const hasSecondaryAxis = series.some((s) => s.yAxisId === "right");

  if (data.length === 0) return <ChartEmptyState />;

  return (
    <figure className="w-full">
      <ChartFrame ariaLabel={ariaLabel} tableId={tableId}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-neutral-200))" />
            <XAxis dataKey={xAxisKey} stroke="rgb(var(--color-neutral-600))" />
            <YAxis yAxisId="left" stroke="rgb(var(--color-neutral-600))" />
            {hasSecondaryAxis && (
              <YAxis yAxisId="right" orientation="right" stroke="rgb(var(--color-neutral-600))" />
            )}
            {showTooltip && <Tooltip content={<ChartTooltip />} />}
            {series.map((s, i) => {
              if (hiddenKeys.has(s.key)) return null;
              const yAxisId = s.yAxisId ?? "left";
              const color = colorForSlot(i);
              if (s.type === "bar") {
                return (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    yAxisId={yAxisId}
                    fill={color}
                    isAnimationActive={!prefersReducedMotion}
                  />
                );
              }
              if (s.type === "line") {
                return (
                  <Line
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    yAxisId={yAxisId}
                    stroke={color}
                    isAnimationActive={!prefersReducedMotion}
                  />
                );
              }
              return (
                <Area
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  yAxisId={yAxisId}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                  isAnimationActive={!prefersReducedMotion}
                />
              );
            })}
          </RechartsComposedChart>
        </ResponsiveContainer>
      </ChartFrame>
      {showLegend && (
        <ChartLegend series={series} colorForSlot={colorForSlot} hiddenKeys={hiddenKeys} onToggle={toggleKey} />
      )}
      <ChartDataTable id={tableId} data={data} series={visibleSeries} categoryKey={xAxisKey} />
    </figure>
  );
}
