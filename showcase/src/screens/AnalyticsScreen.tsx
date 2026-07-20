import { useState } from "react";
import {
  Card,
  BarChart,
  PieChart,
  AreaChart,
  Progress,
  RingProgress,
  SemiCircleProgress,
  Skeleton,
  EmptyState,
  Button,
} from "@jonyfs/react";
import { analyticsSeries, acquisitionChannels } from "../data/sample-data";

// Feature 047 — Analytics/reporting screen. Exercises chart types beyond
// Dashboard's single LineChart, plus loading/empty states real reporting
// UIs need (skeleton while data streams in, empty state for an
// unconfigured report) — neither of which the original Dashboard screen
// demonstrates.
export function AnalyticsScreen() {
  const [showEmptyReport, setShowEmptyReport] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(true);

  return (
    <main className="flex-1 space-y-8 overflow-y-auto p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card elevated className="flex flex-col items-center gap-2 p-5">
          <RingProgress value={72} label="Monthly goal progress" color="success" />
          <p className="text-sm font-medium text-neutral-600">Monthly goal</p>
        </Card>
        <Card elevated className="flex flex-col items-center gap-2 p-5">
          <SemiCircleProgress value={45} label="Support SLA compliance" color="brand" />
          <p className="text-sm font-medium text-neutral-600">SLA compliance</p>
        </Card>
        <Card elevated className="space-y-2 p-5">
          <p className="text-sm font-medium text-neutral-600">Storage used</p>
          <Progress label="Workspace storage used" value={63} />
          <p className="text-xs text-neutral-500">63% of 100 GB</p>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card elevated className="p-5">
          <h2 className="mb-4 text-lg font-semibold">Monthly visits</h2>
          {/* Bar chart only ("visits", thousands) — deliberately not
              combined with "signups" (tens): mixing two series with a
              ~50x magnitude difference on one shared axis makes the
              smaller series invisible and the larger one look flatter
              than it is. Signups gets its own, correctly-scaled
              AreaChart below instead. */}
          <BarChart
            data={analyticsSeries}
            series={[{ key: "visits", label: "Visits" }]}
            xAxisKey="label"
            ariaLabel="Monthly visits"
            showTooltip
            showLegend
          />
        </Card>
        <Card elevated className="p-5">
          <h2 className="mb-4 text-lg font-semibold">Acquisition channels</h2>
          <PieChart
            data={acquisitionChannels}
            categoryKey="channel"
            valueKey="share"
            ariaLabel="Acquisition channel share"
            donut
            showTooltip
            showLegend
          />
        </Card>
      </section>

      <Card elevated className="p-5">
        <h2 className="mb-4 text-lg font-semibold">Signup trend</h2>
        <AreaChart
          data={analyticsSeries}
          series={[{ key: "signups", label: "Signups" }]}
          xAxisKey="label"
          ariaLabel="Signup trend over time"
          showTooltip
        />
      </Card>

      <Card elevated className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Custom report</h2>
          <Button variant="secondary" onClick={() => setShowEmptyReport((v) => !v)}>
            {showEmptyReport ? "Load sample report" : "Clear report"}
          </Button>
        </div>
        {showEmptyReport ? (
          <EmptyState
            heading="No custom report configured"
            description="Build a custom report to see it here."
            action={<Button variant="primary">Create report</Button>}
          />
        ) : loadingDemo ? (
          <div className="space-y-2">
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="card" />
            <Button variant="secondary" onClick={() => setLoadingDemo(false)} className="mt-2">
              Finish loading
            </Button>
          </div>
        ) : (
          <p className="text-sm text-neutral-600">Report loaded — 1,204 rows across 6 months.</p>
        )}
      </Card>
    </main>
  );
}
