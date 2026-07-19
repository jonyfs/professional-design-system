import type { ReactNode } from "react";

export interface TimelineEvent {
  /** Initials shown in the decorative avatar fallback (e.g. "JD"). */
  initials: string;
  /** Actor name, rendered bold at the start of the event line. */
  actor: string;
  /** Remaining event description following the actor name. */
  description: ReactNode;
  /** Machine-readable ISO 8601 timestamp for the <time datetime>. */
  datetime: string;
  /** Human-readable label shown inside the <time> element. */
  dateLabel: string;
}

export interface TimelineProps {
  events: TimelineEvent[];
  "data-testid"?: string;
}

// Direct port of src/components/timeline/timeline.html — a real
// semantic <ol> of dated events with <time datetime>. The .timeline /
// .timeline-item / .timeline-content classes carry the vertical
// connector; the CSS suppresses the connector on a single-item list
// (::before is scoped to :not(:last-child)), so a one-event timeline
// renders without a dangling line — no JS branch needed here.
// The avatar is decorative (the actor name is already in the text),
// so it is a plain aria-hidden span with the same avatar-fallback
// classes as the demo markup, reused verbatim.
export function Timeline({ events, "data-testid": testId }: TimelineProps) {
  return (
    <ol className="timeline" data-testid={testId}>
      {events.map((event, i) => (
        <li key={i} className="timeline-item">
          <span className="avatar-fallback avatar-sm" aria-hidden="true">
            {event.initials}
          </span>
          <div className="timeline-content">
            <p className="text-sm text-neutral-900">
              <span className="font-medium">{event.actor}</span> {event.description}
            </p>
            <time className="text-xs text-neutral-600" dateTime={event.datetime}>
              {event.dateLabel}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
