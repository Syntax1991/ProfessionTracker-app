import {
  useRef,
  type CSSProperties,
  type MouseEvent,
  type RefObject
} from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import { resolveClassColor } from "../../../../guild/web/roster/utils/classColors";
import { useMarkerDrag } from "../hooks/useMarkerDrag";
import type { RaidCooldownAssignment } from "../types/cooldown.types";
import {
  formatSeconds,
  percentOf,
  secondsFromClickX
} from "../utils/timelineFormat";

type AssignmentMarkerProps = {
  assignment: RaidCooldownAssignment;
  member: GuildMember | undefined;
  fightDurationSeconds: number;
  trackRef: RefObject<HTMLDivElement | null>;
  onRemove: () => void;
  onReposition: (
    seconds: number
  ) => void;
};

function AssignmentMarker({
  assignment,
  member,
  fightDurationSeconds,
  trackRef,
  onRemove,
  onReposition
}: AssignmentMarkerProps) {
  const { onMouseDown, isDragging, previewSeconds } =
    useMarkerDrag({
      trackRef,
      fightDurationSeconds,
      onDrop: onReposition,
      onClick: onRemove
    });

  const displaySeconds =
    previewSeconds ??
    assignment.timestampSeconds ??
    0;

  const markerClassName = [
    "cooldown-timeline-marker",
    assignment.abilityIcon
      ? "cooldown-timeline-marker-icon"
      : "",
    isDragging ? "is-dragging" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={markerClassName}
      onMouseDown={onMouseDown}
      style={
        {
          left: `${percentOf(displaySeconds, fightDurationSeconds)}%`,
          "--marker-color":
            resolveClassColor(
              member?.className ?? ""
            )
        } as CSSProperties
      }
      title={`${member?.name ?? "Unknown"} — ${assignment.abilityName} at ${formatSeconds(displaySeconds)} — click to remove, drag to move`}
      type="button"
    >
      {isDragging && (
        <span className="cooldown-timeline-drag-label">
          {formatSeconds(
            displaySeconds
          )}
        </span>
      )}

      {assignment.abilityIcon ? (
        <img
          alt=""
          src={
            assignment.abilityIcon
          }
        />
      ) : (
        (member?.name ?? "?")
          .slice(0, 2)
          .toUpperCase()
      )}
    </button>
  );
}

type RaiderCooldownRowProps = {
  member: GuildMember;
  fightDurationSeconds: number;
  assignments: RaidCooldownAssignment[];
  isInLineup: boolean;
  onTrackClick: (
    seconds: number
  ) => void;
  onRemoveAssignment: (
    assignmentId: string
  ) => void;
  onRepositionAssignment: (
    assignment: RaidCooldownAssignment,
    seconds: number
  ) => void;
};

export function RaiderCooldownRow({
  member,
  fightDurationSeconds,
  assignments,
  isInLineup,
  onTrackClick,
  onRemoveAssignment,
  onRepositionAssignment
}: RaiderCooldownRowProps) {
  const trackRef =
    useRef<HTMLDivElement>(null);

  const handleClick = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (!trackRef.current) {
      return;
    }

    onTrackClick(
      secondsFromClickX(
        event.clientX,
        trackRef.current,
        fightDurationSeconds
      )
    );
  };

  return (
    <div
      className={
        isInLineup
          ? "cooldown-timeline-row"
          : "cooldown-timeline-row is-not-in-lineup"
      }
    >
      <div
        className="cooldown-timeline-row-label"
        style={
          {
            "--marker-color":
              resolveClassColor(
                member.className
              )
          } as CSSProperties
        }
      >
        {member.name}

        {!isInLineup && (
          <span
            className="cooldown-timeline-row-warning"
            title="This raider is not in the current Setup lineup for this boss — their assignment is preserved but can't be changed until they're re-added."
          >
            Not in current setup
          </span>
        )}
      </div>

      <div
        className="cooldown-timeline-row-track"
        onClick={handleClick}
        ref={trackRef}
        role="button"
        tabIndex={0}
      >
        {assignments
          .filter(
            (assignment) =>
              assignment.timestampSeconds !==
              null
          )
          .map((assignment) => (
            <AssignmentMarker
              assignment={
                assignment
              }
              fightDurationSeconds={
                fightDurationSeconds
              }
              key={assignment.id}
              member={member}
              onRemove={() =>
                onRemoveAssignment(
                  assignment.id
                )
              }
              onReposition={(
                seconds
              ) =>
                onRepositionAssignment(
                  assignment,
                  seconds
                )
              }
              trackRef={trackRef}
            />
          ))}
      </div>
    </div>
  );
}
