export interface ChartSeries {
  key: string;
  label: string;
}

export type ChartDatum = Record<string, string | number | null>;

export interface ChartBaseProps {
  data: ChartDatum[];
  series: ChartSeries[];
  ariaLabel: string;
  showTooltip?: boolean;
  showLegend?: boolean;
}

// Batch 2 (feature 024) — additional types for the 3 chart types whose
// data shape doesn't fit ChartBaseProps (research.md R1).

export interface ComposedSeriesConfig extends ChartSeries {
  type: "bar" | "line" | "area";
  /** Opts this series onto the secondary (right) Y-axis — omit for the
   * shared/default axis (research.md R3). */
  yAxisId?: "left" | "right";
}

export interface ScatterPoint {
  x: number;
  y: number;
}

export interface ScatterSeriesConfig extends ChartSeries {
  data: ScatterPoint[];
}

export type FunnelStageDatum = Record<string, string | number> & {
  name: string;
  value: number;
};

export interface TreemapNode {
  name: string;
  /** Present on leaf nodes; parents derive their size from children. */
  value?: number;
  children?: TreemapNode[];
}

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  /** Index into the sibling `nodes` array. */
  source: number;
  /** Index into the sibling `nodes` array. */
  target: number;
  value: number;
}
