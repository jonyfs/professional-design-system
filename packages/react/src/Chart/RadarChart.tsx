import { useId } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
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

export interface RadarChartProps extends ChartBaseProps {
  attributeKey: string;
}

// contracts/extended-charts.contract.md — Radar Chart (FR-005).
export function RadarChart({
  data,
  series,
  attributeKey,
  ariaLabel,
  showTooltip = true,
  showLegend = true,
}: RadarChartProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { hiddenKeys, toggleKey, visibleSeries } = useSeriesVisibility(series);

  if (data.length === 0) return <ChartEmptyState />;

  return (
    <figure className="w-full">
      <ChartFrame ariaLabel={ariaLabel} tableId={tableId}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data}>
            <PolarGrid stroke="rgb(var(--color-neutral-200))" />
            <PolarAngleAxis dataKey={attributeKey} stroke="rgb(var(--color-neutral-600))" />
            <PolarRadiusAxis stroke="rgb(var(--color-neutral-600))" />
            {showTooltip && <Tooltip content={<ChartTooltip />} />}
            {series.map((s, i) =>
              hiddenKeys.has(s.key) ? null : (
                <Radar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  stroke={colorForSlot(i)}
                  fill={colorForSlot(i)}
                  fillOpacity={0.2}
                  isAnimationActive={!prefersReducedMotion}
                />
              ),
            )}
          </RechartsRadarChart>
        </ResponsiveContainer>
      </ChartFrame>
      {showLegend && (
        <ChartLegend series={series} colorForSlot={colorForSlot} hiddenKeys={hiddenKeys} onToggle={toggleKey} />
      )}
      <ChartDataTable id={tableId} data={data} series={visibleSeries} categoryKey={attributeKey} />
    </figure>
  );
}
