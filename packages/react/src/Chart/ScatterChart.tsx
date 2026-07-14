import { useId } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart as RechartsScatterChart,
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
import type { ChartDatum, ScatterSeriesConfig } from "./types";

export interface ScatterChartProps {
  series: ScatterSeriesConfig[];
  xAxisLabel: string;
  yAxisLabel: string;
  ariaLabel: string;
  showTooltip?: boolean;
  showLegend?: boolean;
}

// contracts/composed-scatter.contract.md — Scatter Chart (FR-002).
// Unlike every other chart type in this catalog, each series owns its
// own (x, y) point array (research.md R1) — there is no shared `data`
// prop keyed by a category column.
export function ScatterChart({
  series,
  xAxisLabel,
  yAxisLabel,
  ariaLabel,
  showTooltip = true,
  showLegend = true,
}: ScatterChartProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { hiddenKeys, toggleKey } = useSeriesVisibility(series);

  const hasAnyPoints = series.some((s) => s.data.length > 0);
  if (!hasAnyPoints) return <ChartEmptyState />;

  // useSeriesVisibility's visibleSeries return type is ChartSeries[] (it
  // doesn't preserve the caller's narrower series type), so filter the
  // original, fully-typed `series` array directly instead of using it.
  const flattenedRows: ChartDatum[] = series
    .filter((s) => !hiddenKeys.has(s.key))
    .flatMap((s) => s.data.map((point) => ({ seriesLabel: s.label, x: point.x, y: point.y })));

  return (
    <figure className="w-full">
      <ChartFrame ariaLabel={ariaLabel} tableId={tableId}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-neutral-200))" />
            <XAxis type="number" dataKey="x" name={xAxisLabel} stroke="rgb(var(--color-neutral-600))" />
            <YAxis type="number" dataKey="y" name={yAxisLabel} stroke="rgb(var(--color-neutral-600))" />
            {showTooltip && <Tooltip content={<ChartTooltip />} cursor={{ strokeDasharray: "3 3" }} />}
            {series.map((s, i) =>
              hiddenKeys.has(s.key) ? null : (
                <Scatter
                  key={s.key}
                  name={s.label}
                  data={s.data}
                  fill={colorForSlot(i)}
                  isAnimationActive={!prefersReducedMotion}
                />
              ),
            )}
          </RechartsScatterChart>
        </ResponsiveContainer>
      </ChartFrame>
      {showLegend && (
        <ChartLegend series={series} colorForSlot={colorForSlot} hiddenKeys={hiddenKeys} onToggle={toggleKey} />
      )}
      <ChartDataTable
        id={tableId}
        data={flattenedRows}
        series={[
          { key: "x", label: xAxisLabel },
          { key: "y", label: yAxisLabel },
        ]}
        categoryKey="seriesLabel"
        categoryLabel="Series"
      />
    </figure>
  );
}
