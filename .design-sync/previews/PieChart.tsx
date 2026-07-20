import { PieChart } from "@jonyfs/react";

// PieChart's entrance animation sweeps the pie in over ~1s
// (isAnimationActive, gated by usePrefersReducedMotion — see
// packages/react/src/Chart/PieChart.tsx's own comment: "a
// screenshot/assertion taken before that entrance animation settles sees
// a partial arc, not a bug in the angle math itself. Tests should
// emulate reduced-motion for deterministic renders"). This preview
// capture harness has no page.emulateMedia() equivalent, so the same
// emulation this repo's own Playwright specs use is applied directly
// here, before render — environment setup, not a reimplementation of
// the component.
if (typeof window !== "undefined" && window.matchMedia) {
  const originalMatchMedia = window.matchMedia.bind(window);
  window.matchMedia = (query: string) => {
    const result = originalMatchMedia(query);
    if (query.includes("prefers-reduced-motion")) {
      // Override just the `matches` getter on the real MediaQueryList
      // instance instead of spreading it — spreading drops its
      // prototype methods (addEventListener/removeEventListener), which
      // breaks any hook that subscribes to changes.
      return new Proxy(result, {
        get(target, prop) {
          if (prop === "matches") return true;
          const value = Reflect.get(target, prop);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    }
    return result;
  };
}

const marketShareData = [
  { channel: "Direct", share: 42 },
  { channel: "Referral", share: 28 },
  { channel: "Social", share: 18 },
  { channel: "Email", share: 12 },
];

export function Donut() {
  return (
    <div style={{ width: 360, height: 320 }}>
      <PieChart
        data={marketShareData}
        categoryKey="channel"
        valueKey="share"
        donut
        ariaLabel="Market share by channel, donut chart"
      />
    </div>
  );
}

export function Pie() {
  return (
    <div style={{ width: 360, height: 320 }}>
      <PieChart
        data={marketShareData}
        categoryKey="channel"
        valueKey="share"
        ariaLabel="Market share by channel, pie chart"
      />
    </div>
  );
}
