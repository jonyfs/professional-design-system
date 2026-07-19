import { useId } from "react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useChartColors } from "../hooks/useChartColors";
import { useSeriesVisibility } from "../hooks/useSeriesVisibility";
import { ChartDataTable } from "./ChartDataTable";
import { ChartEmptyState } from "./ChartEmptyState";
import { ChartFrame } from "./ChartFrame";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";
import type { ChartDatum } from "./types";

export interface PieChartProps {
  data: ChartDatum[];
  categoryKey: string;
  valueKey: string;
  ariaLabel: string;
  /** Donut variant — sets an inner radius (FR-004) */
  donut?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

// contracts/core-charts.contract.md — Pie/Donut Chart (FR-004). Unlike
// Line/Bar/Area, a Pie chart has no multi-series concept — each *data row*
// is one slice, so the shared ChartLegend's "series" list is synthesized
// one entry per row (categoryKey as both key and label) rather than reused
// from a caller-supplied series prop.
export function PieChart({
  data,
  categoryKey,
  valueKey,
  ariaLabel,
  donut = false,
  showTooltip = true,
  showLegend = true,
}: PieChartProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();
  const sliceSeries = data.map((row) => {
    const label = String(row[categoryKey] ?? "");
    return { key: label, label };
  });
  const { hiddenKeys, toggleKey } = useSeriesVisibility(sliceSeries);

  if (data.length === 0) return <ChartEmptyState />;

  const indexedVisibleRows = data
    .map((row, originalIndex) => ({ row, originalIndex }))
    .filter(({ row }) => !hiddenKeys.has(String(row[categoryKey] ?? "")));
  const visibleData = indexedVisibleRows.map(({ row }) => row);

  return (
    <figure className="w-full">
      <ChartFrame ariaLabel={ariaLabel} tableId={tableId}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            {showTooltip && <Tooltip content={<ChartTooltip />} />}
            {/* Feature 047 — isAnimationActive was previously
                `!prefersReducedMotion` (mirroring every other chart type's
                convention), on the assumption an in-progress entrance sweep
                just needs a moment to settle to a full circle. Found while
                actually composing this component into a real screen: with
                animation active, Recharts' Pie mounts zero <Cell>/sector
                elements — not "mid-sweep," but permanently empty — verified
                by waiting 10+ seconds and inspecting the DOM directly, in
                both a fresh usage and this project's own pre-existing chart
                test harness (tests/react-harness), in both dev and
                production builds. Since the existing E2E suite always
                emulates reduced-motion (tests/e2e/*.spec.ts convention), it
                never exercised the animated path and never caught this —
                every real visitor with a default (non-reduced-motion) OS
                setting has been seeing a blank Pie/Donut chart. Disabled
                unconditionally rather than re-gating on
                prefers-reduced-motion until the underlying Recharts
                animation issue is root-caused. */}
            <Pie
              data={visibleData}
              dataKey={valueKey}
              nameKey={categoryKey}
              innerRadius={donut ? "55%" : 0}
              outerRadius="80%"
              isAnimationActive={false}
            >
              {indexedVisibleRows.map(({ row, originalIndex }) => (
                <Cell key={String(row[categoryKey])} fill={colorForSlot(originalIndex)} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </ChartFrame>
      {showLegend && (
        <ChartLegend series={sliceSeries} colorForSlot={colorForSlot} hiddenKeys={hiddenKeys} onToggle={toggleKey} />
      )}
      <ChartDataTable
        id={tableId}
        data={visibleData}
        series={[{ key: valueKey, label: valueKey }]}
        categoryKey={categoryKey}
        categoryLabel={categoryKey}
      />
    </figure>
  );
}
