import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ComposedChart,
  FunnelChart,
  Sankey,
  ScatterChart,
  Treemap,
} from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";
import { THEMES } from "../../../shared/design-tokens";

const revenueData = [
  { month: "Jan", revenue: 4200, orders: 120 },
  { month: "Feb", revenue: 4800, orders: 135 },
  { month: "Mar", revenue: 5100, orders: 128 },
  { month: "Apr", revenue: 5600, orders: 150 },
  { month: "May", revenue: 6100, orders: 162 },
  { month: "Jun", revenue: 7200, orders: 178 },
];

const composedSeries = [
  { key: "revenue", label: "Revenue", type: "bar" as const },
  { key: "orders", label: "Orders", type: "line" as const, yAxisId: "right" as const },
];

const scatterSeries = [
  {
    key: "teamA",
    label: "Team A",
    data: [
      { x: 10, y: 30 },
      { x: 20, y: 45 },
      { x: 30, y: 40 },
      { x: 40, y: 60 },
    ],
  },
  {
    key: "teamB",
    label: "Team B",
    data: [
      { x: 15, y: 20 },
      { x: 25, y: 35 },
      { x: 35, y: 50 },
      { x: 45, y: 48 },
    ],
  },
];

const funnelData = [
  { name: "Visitors", value: 4000 },
  { name: "Signups", value: 2200 },
  { name: "Trials", value: 1200 },
  { name: "Purchases", value: 400 },
];

const treemapData = [
  {
    name: "Engineering",
    children: [
      { name: "Frontend", value: 400 },
      { name: "Backend", value: 350 },
      { name: "Platform", value: 200 },
    ],
  },
  {
    name: "Design",
    children: [
      { name: "Product", value: 150 },
      { name: "Brand", value: 90 },
    ],
  },
];

const sankeyNodes = [
  { name: "Direct" },
  { name: "Referral" },
  { name: "Social" },
  { name: "Signups" },
  { name: "Purchases" },
];

const sankeyLinks = [
  { source: 0, target: 3, value: 800 },
  { source: 1, target: 3, value: 500 },
  { source: 2, target: 3, value: 300 },
  { source: 3, target: 4, value: 400 },
];

function ThemeSelector() {
  const [theme, setTheme] = useState("light");
  return (
    <label className="mb-8 flex items-center gap-2 text-sm font-medium text-neutral-900">
      Theme
      <select
        className="form-select w-auto"
        value={theme}
        onChange={(event) => {
          const next = event.target.value;
          setTheme(next);
          document.documentElement.dataset.theme = next;
        }}
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.displayName}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChartBatch2Demo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Chart — Batch 2</h1>
      <ThemeSelector />

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Composed (bar + line, secondary axis)</h2>
      <div className="mt-4" data-testid="chart-composed">
        <ComposedChart
          data={revenueData}
          series={composedSeries}
          xAxisKey="month"
          ariaLabel="Monthly revenue (bar) and order count (line, secondary axis), composed chart"
        />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Scatter</h2>
      <div className="mt-4" data-testid="chart-scatter">
        <ScatterChart
          series={scatterSeries}
          xAxisLabel="Effort"
          yAxisLabel="Impact"
          ariaLabel="Team A and Team B effort vs impact, scatter chart"
        />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Funnel</h2>
      <div className="mt-4" data-testid="chart-funnel">
        <FunnelChart data={funnelData} ariaLabel="Visitor-to-purchase conversion funnel" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Treemap</h2>
      <div className="mt-4" data-testid="chart-treemap">
        <Treemap data={treemapData} ariaLabel="Headcount by department and team, treemap" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Sankey</h2>
      <div className="mt-4" data-testid="chart-sankey">
        <Sankey nodes={sankeyNodes} links={sankeyLinks} ariaLabel="Traffic source to purchase flow, sankey diagram" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Empty states</h2>
      <div className="mt-4" data-testid="chart-composed-empty">
        <ComposedChart data={[]} series={composedSeries} xAxisKey="month" ariaLabel="Empty composed chart" />
      </div>
      <div className="mt-4" data-testid="chart-treemap-empty">
        <Treemap data={[]} ariaLabel="Empty treemap" />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChartBatch2Demo />
  </StrictMode>,
);
