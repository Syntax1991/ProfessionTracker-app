import {
  useRef,
  type CSSProperties,
  type MouseEvent,
  type RefObject
} from "react";
import { Tooltip } from "../../../../../apps/web/src/shared/components/Tooltip";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import { resolveClassColor } from "../../../../guild/web/roster/utils/classColors";
import { getSpellById } from "../../../shared/catalog/raidCooldownSpellCatalog";
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
  isInLineup: boolean;
  isTooltipSuppressed: boolean;
  onRemove: () => void;
  onReposition: (
    seconds: number
  ) => void;
  onDragPreview: (
    seconds: number | null
  ) => void;
};

function AssignmentMarker({
  assignment,
  member,
  fightDurationSeconds,
  trackRef,
  isInLineup,
  isTooltipSuppressed,
  onRemove,
  onReposition,
  onDragPreview
}: AssignmentMarkerProps) {
  const { onMouseDown, isDragging, previewSeconds } =
    useMarkerDrag({
      trackRef,
      fightDurationSeconds,
      onDrop: onReposition,
      onClick: onRemove,
      onDragPreview
    });

  const originalSeconds =
    assignment.timestampSeconds ?? 0;

  const displaySeconds =
    previewSeconds ?? originalSeconds;

  const markerClassName = [
    "cooldown-timeline-marker",
    assignment.abilityIcon
      ? "cooldown-timeline-marker-icon"
      : "",
    isDragging ? "is-dragging" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const category = assignment.spellId
    ? getSpellById(assignment.spellId)
        ?.category
    : null;

  const tooltipContent = (
    <>
      <span className="tooltip-title">
        {assignment.abilityIcon && (
          <img
            alt=""
            src={
              assignment.abilityIcon
            }
          />
        )}
        {assignment.abilityName}
      </span>

      <span className="tooltip-meta">
        {member?.name ?? "Unknown"}
        {member?.className
          ? ` — ${member.className}`
          : ""}
      </span>

      <span className="tooltip-time">
        {formatSeconds(
          originalSeconds
        )}
      </span>

      {category && (
        <span className="tooltip-meta">
          {category}
        </span>
      )}

      {!isInLineup && (
        <span className="tooltip-warning">
          Not in current setup
        </span>
      )}
    </>
  );

  return (
    <>
      {isDragging && (
        <span
          className="cooldown-timeline-marker cooldown-timeline-marker-ghost"
          style={
            {
              left: `${percentOf(originalSeconds, fightDurationSeconds)}%`
            } as CSSProperties
          }
        />
      )}

      <Tooltip
        anchorClassName={
          markerClassName
        }
        anchorStyle={
          {
            left: `${percentOf(displaySeconds, fightDurationSeconds)}%`,
            "--marker-color":
              resolveClassColor(
                member?.className ??
                  ""
              )
          } as CSSProperties
        }
        content={tooltipContent}
        disabled={
          isTooltipSuppressed
        }
      >
        <button
          aria-label={`${member?.name ?? "Unknown"} — ${assignment.abilityName} at ${formatSeconds(displaySeconds)} — click to remove, drag to move`}
          className="cooldown-timeline-marker-button"
          onMouseDown={onMouseDown}
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
      </Tooltip>
    </>
  );
}

type RaiderCooldownRowProps = {
  member: GuildMember;
  fightDurationSeconds: number;
  assignments: RaidCooldownAssignment[];
  isInLineup: boolean;
  isTooltipSuppressed: boolean;
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
  onDragPreview: (
    seconds: number | null
  ) => void;
};

export function RaiderCooldownRow({
  member,
  fightDurationSeconds,
  assignments,
  isInLineup,
  isTooltipSuppressed,
  onTrackClick,
  onRemoveAssignment,
  onRepositionAssignment,
  onDragPreview
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
              isInLineup={
                isInLineup
              }
              isTooltipSuppressed={
                isTooltipSuppressed
              }
              key={assignment.id}
              member={member}
              onDragPreview={
                onDragPreview
              }
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
