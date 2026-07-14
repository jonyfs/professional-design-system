import { useId } from "react";
import { ResponsiveContainer, Sankey as RechartsSankey, Tooltip } from "recharts";
import { useChartColors } from "../hooks/useChartColors";
import { ChartDataTable } from "./ChartDataTable";
import { ChartEmptyState } from "./ChartEmptyState";
import { ChartFrame } from "./ChartFrame";
import { ChartTooltip } from "./ChartTooltip";
import type { SankeyLink, SankeyNode } from "./types";

export interface SankeyProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  ariaLabel: string;
  showTooltip?: boolean;
}

// contracts/treemap-sankey.contract.md — Sankey Diagram (FR-005). No
// legend (research.md R2 — same reasoning as Treemap: no meaningful
// "toggle a node" interaction for a flow graph). A link referencing an
// out-of-range source/target index is passed through to Recharts as-is
// — a caller data error, not validated by this component (spec.md Edge
// Cases). No `isAnimationActive` prop exists on Recharts' Sankey in
// this version — FR-011's reduced-motion gating is a no-op here since
// there is nothing to gate, unlike every other chart type in this
// feature.
export function Sankey({ nodes, links, ariaLabel, showTooltip = true }: SankeyProps) {
  const tableId = useId();
  const { colorForSlot } = useChartColors();

  if (nodes.length === 0 || links.length === 0) return <ChartEmptyState />;

  const flattenedRows = links.map((link) => ({
    name: `${nodes[link.source]?.name ?? "?"} → ${nodes[link.target]?.name ?? "?"}`,
    value: link.value,
  }));

  return (
    <figure className="w-full">
      <ChartFrame ariaLabel={ariaLabel} tableId={tableId}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsSankey
            data={{ nodes, links }}
            nodePadding={20}
            node={(props) => {
              const { x, y, width, height, index, payload } = props as {
                x: number;
                y: number;
                width: number;
                height: number;
                index: number;
                payload: { name: string };
              };
              return (
                <g>
                  <rect x={x} y={y} width={width} height={height} fill={colorForSlot(index)} />
                  <text
                    x={x + width + 6}
                    y={y + height / 2}
                    dy="0.35em"
                    fontSize={12}
                    fill="rgb(var(--color-neutral-900))"
                  >
                    {payload.name}
                  </text>
                </g>
              );
            }}
            link={(props) => {
              const { sourceX, sourceY, sourceControlX, targetControlX, targetX, targetY, linkWidth, index } =
                props as {
                  sourceX: number;
                  sourceY: number;
                  sourceControlX: number;
                  targetControlX: number;
                  targetX: number;
                  targetY: number;
                  linkWidth: number;
                  index: number;
                };
              return (
                <path
                  d={`M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
                  fill="none"
                  stroke={colorForSlot(index)}
                  strokeOpacity={0.3}
                  strokeWidth={linkWidth}
                />
              );
            }}
          >
            {showTooltip && <Tooltip content={<ChartTooltip />} />}
          </RechartsSankey>
        </ResponsiveContainer>
      </ChartFrame>
      <ChartDataTable
        id={tableId}
        data={flattenedRows}
        series={[{ key: "value", label: "Value" }]}
        categoryKey="name"
        categoryLabel="Flow"
      />
    </figure>
  );
}
