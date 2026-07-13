import type { ReactNode } from "react";

export interface TableRowData {
  cells: ReactNode[];
}

export interface TableProps {
  columns: string[];
  rows: TableRowData[];
  zebra?: boolean;
  ariaLabel: string;
  "data-testid"?: string;
}

// Direct port of table.html (feature 012) — real semantic
// <table>/<thead>/<tbody>/<th scope="col">/<td>, not a <div> grid.
// .data-table-wrapper carries tabindex="0"/role="region"/aria-label per
// axe-core's scrollable-region-focusable rule (feature 012's fix,
// ported verbatim, not re-derived) — ariaLabel is required, not
// optional, since a generic hardcoded string would be a weaker,
// non-contextual label than each real table instance needs.
export function Table({ columns, rows, zebra, ariaLabel, "data-testid": testId }: TableProps) {
  return (
    <div className="data-table-wrapper" tabIndex={0} role="region" aria-label={ariaLabel}>
      <table className="data-table" data-testid={testId}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} scope="col" className="data-table-header-cell">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 bg-neutral-50">
          {rows.map((row, i) => (
            <tr key={i} className={zebra ? "data-table-row-zebra" : undefined}>
              {row.cells.map((cell, j) => (
                <td key={j} className="data-table-cell">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
