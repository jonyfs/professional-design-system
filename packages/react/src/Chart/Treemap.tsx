import { useId } from "react";
import { ResponsiveContainer, Tooltip, Treemap as RechartsTreemap } from "recharts";
import { useChartColors } from "../hooks/useChartColors";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ChartDataTable } from "./ChartDataTable";
import { ChartEmptyState } from "./ChartEmptyState";
import { ChartFrame } from "./ChartFrame";
import { ChartTooltip } from "./ChartTooltip";
import type { TreemapNode as TreemapNodeType } from "./types";

export interface TreemapProps {
  data: TreemapNodeType[];
  ariaLabel: string;
  showTooltip?: boolean;
}

// contracts/treemap-sankey.contract.md — Treemap (FR-004). No legend
// (research.md R2 — a "toggle a node" concept doesn't map onto a
// hierarchy the way it does onto a handful of chart series). A single
// top-level node still fills the available area (spec.md Edge Cases) —
// Recharts' own layout algorithm already handles a length-1 array
// correctly, no special-case code needed.
export function Treemap({ data, ariaLabel, showTooltip = true }: TreemapProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (data.length === 0) return <ChartEmptyState />;

  // Flattened for the accessible data table (research.md R2) — nesting
  // depth isn't represented in the flat table, a documented, accepted
  // simplification (contracts/treemap-sankey.contract.md).
  const flattenedRows: { name: string; value: number }[] = [];
  function flatten(nodes: TreemapNodeType[]) {
    for (const node of nodes) {
      if (node.value !== undefined) flattenedRows.push({ name: node.name, value: node.value });
      if (node.children) flatten(node.children);
    }
  }
  flatten(data);

  return (
    <figure className="w-full">
      <ChartFrame ariaLabel={ariaLabel} tableId={tableId}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsTreemap
            // Recharts' TreemapDataType requires an index signature
            // TreemapNode deliberately doesn't have (a public API
            // shouldn't expose an open-ended bag of extra fields) — cast
            // at this one call site rather than loosening the public type.
            data={data as unknown as Record<string, unknown>[]}
            dataKey="value"
            nameKey="name"
            stroke="rgb(var(--color-neutral-50))"
            isAnimationActive={!prefersReducedMotion}
            content={(props) => {
              const { x, y, width, height, name, index } = props as {
                x: number;
                y: number;
                width: number;
                height: number;
                name: string;
                index: number;
              };
              return (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={colorForSlot(index)}
                    stroke="rgb(var(--color-neutral-50))"
                  />
                  {width > 40 && height > 20 && (
                    <text
                      x={x + 6}
                      y={y + 18}
                      fontSize={12}
                      fill="rgb(var(--color-neutral-50))"
                    >
                      {name}
                    </text>
                  )}
                </g>
              );
            }}
          >
            {showTooltip && <Tooltip content={<ChartTooltip />} />}
          </RechartsTreemap>
        </ResponsiveContainer>
      </ChartFrame>
      <ChartDataTable
        id={tableId}
        data={flattenedRows}
        series={[{ key: "value", label: "Value" }]}
        categoryKey="name"
        categoryLabel="Node"
      />
    </figure>
  );
}
