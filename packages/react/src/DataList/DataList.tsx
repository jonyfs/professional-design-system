import type { ReactNode } from "react";

export interface DataListItem {
  term: string;
  definition: ReactNode;
}

export interface DataListProps {
  items: DataListItem[];
  "data-testid"?: string;
}

// Direct port of src/components/data-list/data-list.html — real
// semantic <dl>/<dt>/<dd> term/definition pairs, not a <div> grid.
// Each item is wrapped in a <div> so the responsive two-column grid
// keeps each term stacked above its definition. The utility classes
// are reused verbatim from the demo markup, not reinvented.
export function DataList({ items, "data-testid": testId }: DataListProps) {
  return (
    <dl
      data-testid={testId}
      className="mt-8 grid max-w-md grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2"
    >
      {items.map((item) => (
        <div key={item.term}>
          <dt className="text-sm font-medium text-neutral-900">{item.term}</dt>
          <dd className="mt-1 text-sm text-neutral-600">{item.definition}</dd>
        </div>
      ))}
    </dl>
  );
}
