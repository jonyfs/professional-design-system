import { Fragment } from "react";

export interface HighlightProps {
  /** The full text to render. */
  text: string;
  /** Substring to highlight, matched case-insensitively. */
  query: string;
  "data-testid"?: string;
}

interface Segment {
  value: string;
  match: boolean;
}

// Pure, per-surface string logic (spec.md/plan.md: no shared module for
// this batch's data-display components). Splits `text` into matched and
// unmatched segments on case-insensitive occurrences of `query`.
function splitSegments(text: string, query: string): Segment[] {
  if (!query) return [{ value: text, match: false }];

  const segments: Segment[] = [];
  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  let cursor = 0;

  let index = haystack.indexOf(needle, cursor);
  while (index !== -1) {
    if (index > cursor) {
      segments.push({ value: text.slice(cursor, index), match: false });
    }
    segments.push({ value: text.slice(index, index + needle.length), match: true });
    cursor = index + needle.length;
    index = haystack.indexOf(needle, cursor);
  }
  if (cursor < text.length) {
    segments.push({ value: text.slice(cursor), match: false });
  }
  return segments;
}

// Data-display micro-component (feature 023 US3). Wraps matches in <mark>,
// reusing Combobox's existing .highlight mark treatment — no new color.
export function Highlight({ text, query, "data-testid": testId }: HighlightProps) {
  const segments = splitSegments(text, query);
  return (
    <span data-testid={testId} className="highlight">
      {segments.map((segment, index) =>
        segment.match ? (
          <mark key={index}>{segment.value}</mark>
        ) : (
          <Fragment key={index}>{segment.value}</Fragment>
        ),
      )}
    </span>
  );
}
