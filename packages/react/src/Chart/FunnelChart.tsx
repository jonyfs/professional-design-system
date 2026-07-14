import { useId } from "react";
import { Cell, Funnel, FunnelChart as RechartsFunnelChart, LabelList, ResponsiveContainer, Tooltip } from "recharts";
import { useChartColors } from "../hooks/useChartColors";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useSeriesVisibility } from "../hooks/useSeriesVisibility";
import { ChartDataTable } from "./ChartDataTable";
import { ChartEmptyState } from "./ChartEmptyState";
import { ChartFrame } from "./ChartFrame";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";
import type { FunnelStageDatum } from "./types";

export interface FunnelChartProps {
  data: FunnelStageDatum[];
  ariaLabel: string;
  showTooltip?: boolean;
  showLegend?: boolean;
}

// contracts/funnel.contract.md — Funnel Chart (FR-003). Same prop
// shape as PieChart (research.md R1): a Funnel has no multi-series
// concept, each data row is one stage. Non-monotonic stage values
// render at their actual proportional size — no reordering, no
// validation (spec.md Edge Cases).
export function FunnelChart({ data, ariaLabel, showTooltip = true, showLegend = true }: FunnelChartProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();
  const prefersReducedMotion = usePrefersReducedMotion();
  const stageSeries = data.map((row) => ({ key: row.name, label: row.name }));
  const { hiddenKeys, toggleKey } = useSeriesVisibility(stageSeries);

  if (data.length === 0) return <ChartEmptyState />;

  const indexedVisibleRows = data
    .map((row, originalIndex) => ({ row, originalIndex }))
    .filter(({ row }) => !hiddenKeys.has(row.name));
  const visibleData = indexedVisibleRows.map(({ row }) => row);

  return (
    <figure className="w-full">
      <ChartFrame ariaLabel={ariaLabel} tableId={tableId}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsFunnelChart>
            {showTooltip && <Tooltip content={<ChartTooltip />} />}
            <Funnel data={visibleData} dataKey="value" nameKey="name" isAnimationActive={!prefersReducedMotion}>
              <LabelList dataKey="name" position="right" fill="rgb(var(--color-neutral-900))" stroke="none" />
              {indexedVisibleRows.map(({ row, originalIndex }) => (
                <Cell key={row.name} fill={colorForSlot(originalIndex)} />
              ))}
            </Funnel>
          </RechartsFunnelChart>
        </ResponsiveContainer>
      </ChartFrame>
      {showLegend && (
        <ChartLegend series={stageSeries} colorForSlot={colorForSlot} hiddenKeys={hiddenKeys} onToggle={toggleKey} />
      )}
      <ChartDataTable
        id={tableId}
        data={visibleData}
        series={[{ key: "value", label: "Value" }]}
        categoryKey="name"
        categoryLabel="Stage"
      />
    </figure>
  );
}
