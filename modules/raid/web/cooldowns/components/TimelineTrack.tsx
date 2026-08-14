import {
  useRef,
  type CSSProperties,
  type MouseEvent
} from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import { resolveClassColor } from "../../../../guild/web/roster/utils/classColors";
import type {
  RaidBossPhaseMarker,
  RaidCooldownAssignment
} from "../types/cooldown.types";
import { formatSeconds } from "../utils/timelineFormat";

type TimelineTrackProps = {
  fightDurationSeconds: number;
  phaseMarkers: RaidBossPhaseMarker[];
  assignments: RaidCooldownAssignment[];
  memberById: Map<string, GuildMember>;
  onTrackClick: (
    seconds: number
  ) => void;
  onRemoveAssignment: (
    assignmentId: string
  ) => void;
  onRemovePhaseMarker: (
    markerId: string
  ) => void;
};

function percentOf(
  seconds: number,
  fightDurationSeconds: number
): number {
  return Math.min(
    100,
    Math.max(
      0,
      (seconds /
        fightDurationSeconds) *
        100
    )
  );
}

const tickCount = 10;

export function TimelineTrack({
  fightDurationSeconds,
  phaseMarkers,
  assignments,
  memberById,
  onTrackClick,
  onRemoveAssignment,
  onRemovePhaseMarker
}: TimelineTrackProps) {
  const trackRef =
    useRef<HTMLDivElement>(null);

  const handleTrackClick = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    const rect =
      trackRef.current?.getBoundingClientRect();

    if (!rect || rect.width === 0) {
      return;
    }

    const ratio = Math.min(
      1,
      Math.max(
        0,
        (event.clientX - rect.left) /
          rect.width
      )
    );

    onTrackClick(
      Math.round(
        ratio * fightDurationSeconds
      )
    );
  };

  const ticks = Array.from(
    { length: tickCount + 1 },
    (_, index) =>
      Math.round(
        (fightDurationSeconds /
          tickCount) *
          index
      )
  );

  return (
    <div className="cooldown-timeline-wrap">
      <div className="cooldown-timeline-ticks">
        {ticks.map((seconds) => (
          <span
            key={seconds}
            style={
              {
                left: `${percentOf(seconds, fightDurationSeconds)}%`
              } as CSSProperties
            }
          >
            {formatSeconds(seconds)}
          </span>
        ))}
      </div>

      <div
        className="cooldown-timeline-track"
        onClick={handleTrackClick}
        ref={trackRef}
        role="button"
        tabIndex={0}
      >
        {phaseMarkers.map((marker) => (
          <div
            className="cooldown-timeline-phase"
            key={marker.id}
            style={
              {
                left: `${percentOf(marker.startSeconds, fightDurationSeconds)}%`
              } as CSSProperties
            }
          >
            <span
              onClick={(event) => {
                event.stopPropagation();
                onRemovePhaseMarker(
                  marker.id
                );
              }}
              title="Click to remove"
            >
              {marker.label}
            </span>
          </div>
        ))}

        {assignments
          .filter(
            (assignment) =>
              assignment.timestampSeconds !==
              null
          )
          .map((assignment) => {
            const member =
              memberById.get(
                assignment.memberId
              );

            return (
              <button
                className="cooldown-timeline-marker"
                key={assignment.id}
                onClick={(
                  event
                ) => {
                  event.stopPropagation();
                  onRemoveAssignment(
                    assignment.id
                  );
                }}
                style={
                  {
                    left: `${percentOf(assignment.timestampSeconds ?? 0, fightDurationSeconds)}%`,
                    "--marker-color":
                      resolveClassColor(
                        member?.className ??
                          ""
                      )
                  } as CSSProperties
                }
                title={`${member?.name ?? "Unknown"} — ${assignment.abilityName} at ${formatSeconds(assignment.timestampSeconds ?? 0)}`}
                type="button"
              >
                {(
                  member?.name ??
                  "?"
                )
                  .slice(0, 2)
                  .toUpperCase()}
              </button>
            );
          })}
      </div>
    </div>
  );
}
