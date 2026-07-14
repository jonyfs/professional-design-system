export interface AvatarGroupMember {
  /** Image source; when omitted, `initials` is rendered in a fallback chip. */
  src?: string;
  /** Accessible name / alt text for the member (required). */
  alt: string;
  /** Initials shown when no `src` is provided. */
  initials?: string;
}

export interface AvatarGroupProps {
  members: AvatarGroupMember[];
  /** Maximum slots shown before the last collapses into a "+N" chip. */
  limit?: number;
  /** Accessible name for the group as a whole. */
  "aria-label"?: string;
  "data-testid"?: string;
}

// Data-display micro-component (feature 023 US3). Reuses the existing
// Avatar tokens (.avatar-img / .avatar-fallback / .avatar-lg) verbatim
// with .avatar-group's negative-margin overlap. When members exceed the
// limit, the LAST visible slot becomes a "+N" chip (not a 15th element),
// per contracts/data-display.contract.md. When members.length <= limit,
// no overflow indicator renders at all (spec.md Edge Cases).
export function AvatarGroup({
  members,
  limit = 4,
  "aria-label": ariaLabel,
  "data-testid": testId,
}: AvatarGroupProps) {
  const overflowing = members.length > limit;
  const visibleMembers = overflowing ? members.slice(0, limit - 1) : members;
  const overflowCount = members.length - (limit - 1);

  return (
    <div data-testid={testId} className="avatar-group" role="group" aria-label={ariaLabel}>
      {visibleMembers.map((member, index) =>
        member.src ? (
          <img
            key={member.alt + index}
            src={member.src}
            alt={member.alt}
            className="avatar-img avatar-lg"
          />
        ) : (
          <span
            key={member.alt + index}
            className="avatar-fallback avatar-lg"
            aria-label={member.alt}
          >
            {member.initials}
          </span>
        ),
      )}
      {overflowing && (
        <span
          data-testid={testId ? `${testId}-chip` : undefined}
          className="avatar-fallback avatar-lg"
          aria-label={`${overflowCount} more`}
        >
          +{overflowCount}
        </span>
      )}
    </div>
  );
}
