import type { ChartDatum, ChartSeries } from "./types";

export interface ChartDataTableProps {
  id: string;
  data: ChartDatum[];
  series: ChartSeries[];
  categoryKey: string;
  categoryLabel?: string;
}

// The non-visual data equivalent every chart in this feature renders
// alongside its SVG (FR-009, research.md R4) — a real <table> reusing
// feature 012's ratified .data-table classes, visually hidden but fully
// navigable by assistive tech. sr-only, not display:none/hidden, so
// screen readers still traverse it.
export function ChartDataTable({ id, data, series, categoryKey, categoryLabel }: ChartDataTableProps) {
  return (
    <table id={id} className="sr-only">
      <thead>
        <tr>
          <th className="data-table-header-cell" scope="col">
            {categoryLabel ?? categoryKey}
          </th>
          {series.map((s) => (
            <th key={s.key} className="data-table-header-cell" scope="col">
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td className="data-table-cell">{String(row[categoryKey] ?? "")}</td>
            {series.map((s) => (
              <td key={s.key} className="data-table-cell">
                {row[s.key] === null || row[s.key] === undefined ? "—" : String(row[s.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
