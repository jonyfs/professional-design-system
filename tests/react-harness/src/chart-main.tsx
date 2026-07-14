import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialChart,
} from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";
import { THEMES } from "../../../shared/design-tokens";

const revenueData = [
  { month: "Jan", revenue: 4200, costs: 3100 },
  { month: "Feb", revenue: 4800, costs: 3200 },
  { month: "Mar", revenue: null, costs: 3400 },
  { month: "Apr", revenue: 5600, costs: 3600 },
  { month: "May", revenue: 6100, costs: 3900 },
  { month: "Jun", revenue: 7200, costs: 4100 },
];

const categorySeries = [
  { key: "revenue", label: "Revenue" },
  { key: "costs", label: "Costs" },
];

const marketShareData = [
  { channel: "Direct", share: 42 },
  { channel: "Referral", share: 28 },
  { channel: "Social", share: 18 },
  { channel: "Email", share: 12 },
  { channel: "Other", share: 0 },
];

const skillData = [
  { attribute: "Speed", teamA: 80, teamB: 65 },
  { attribute: "Reliability", teamA: 70, teamB: 90 },
  { attribute: "Coverage", teamA: 90, teamB: 60 },
  { attribute: "Cost", teamA: 60, teamB: 75 },
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

function ChartDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Chart</h1>
      <ThemeSelector />

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Line</h2>
      <div className="mt-4" data-testid="chart-line">
        <LineChart data={revenueData} series={categorySeries} xAxisKey="month" ariaLabel="Monthly revenue vs costs, line chart" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Bar</h2>
      <div className="mt-4" data-testid="chart-bar">
        <BarChart data={revenueData} series={categorySeries} xAxisKey="month" ariaLabel="Monthly revenue vs costs, bar chart" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Area (stacked)</h2>
      <div className="mt-4" data-testid="chart-area">
        <AreaChart data={revenueData} series={categorySeries} xAxisKey="month" stacked ariaLabel="Monthly revenue vs costs, stacked area chart" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Pie / Donut</h2>
      <div className="mt-4" data-testid="chart-pie">
        <PieChart data={marketShareData} categoryKey="channel" valueKey="share" donut ariaLabel="Market share by channel, donut chart" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Radar</h2>
      <div className="mt-4" data-testid="chart-radar">
        <RadarChart
          data={skillData}
          series={[
            { key: "teamA", label: "Team A" },
            { key: "teamB", label: "Team B" },
          ]}
          attributeKey="attribute"
          ariaLabel="Team comparison across four attributes, radar chart"
        />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Radial</h2>
      <div className="mt-4" data-testid="chart-radial">
        <RadialChart value={72} min={0} max={100} label="Uptime SLA" ariaLabel="Uptime SLA, 72 out of 100, radial gauge chart" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Empty state</h2>
      <div className="mt-4" data-testid="chart-empty">
        <LineChart data={[]} series={categorySeries} xAxisKey="month" ariaLabel="Empty line chart" />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChartDemo />
  </StrictMode>,
);
