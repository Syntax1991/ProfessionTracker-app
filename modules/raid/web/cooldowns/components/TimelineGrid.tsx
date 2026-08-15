import type { CSSProperties } from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import type {
  RaidBossAbilityCast,
  RaidBossPhaseMarker,
  RaidCooldownAssignment
} from "../types/cooldown.types";
import {
  formatSeconds,
  groupCastsByAbility,
  isAssignedMemberInLineup,
  percentOf
} from "../utils/timelineFormat";
import { BossAbilityRow } from "./BossAbilityRow";
import { RaiderCooldownRow } from "./RaiderCooldownRow";

const tickCount = 10;

type TimelineGridProps = {
  fightDurationSeconds: number;
  phaseMarkers: RaidBossPhaseMarker[];
  bossAbilityCasts: RaidBossAbilityCast[];
  assignments: RaidCooldownAssignment[];
  rosterMembers: GuildMember[];
  lineupMemberIds: Set<string>;
  onRaiderTrackClick: (
    memberId: string,
    seconds: number
  ) => void;
  onRemoveAssignment: (
    assignmentId: string
  ) => void;
  onRepositionAssignment: (
    assignment: RaidCooldownAssignment,
    seconds: number
  ) => void;
  onRemovePhaseMarker: (
    markerId: string
  ) => void;
};

export function TimelineGrid({
  fightDurationSeconds,
  phaseMarkers,
  bossAbilityCasts,
  assignments,
  rosterMembers,
  lineupMemberIds,
  onRaiderTrackClick,
  onRemoveAssignment,
  onRepositionAssignment,
  onRemovePhaseMarker
}: TimelineGridProps) {
  const abilityRows = groupCastsByAbility(
    bossAbilityCasts
  );

  const memberById = new Map(
    rosterMembers.map((member) => [
      member.id,
      member
    ])
  );

  const assignedMemberIds = Array.from(
    new Set(
      assignments.map(
        (assignment) =>
          assignment.memberId
      )
    )
  );

  const visibleMemberIds = new Set([
    ...assignedMemberIds,
    ...lineupMemberIds
  ]);

  const orderedVisibleMemberIds =
    rosterMembers
      .map((member) => member.id)
      .filter((id) =>
        visibleMemberIds.has(id)
      );

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
    <div className="cooldown-timeline-grid">
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

      <div className="cooldown-timeline-rows">
        <div className="cooldown-timeline-phase-overlay">
          {phaseMarkers.map(
            (marker) => (
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
                  onClick={() =>
                    onRemovePhaseMarker(
                      marker.id
                    )
                  }
                  title="Click to remove"
                >
                  {marker.label}
                </span>
              </div>
            )
          )}
        </div>

        {abilityRows.map(
          (row) => (
            <BossAbilityRow
              abilityName={
                row.abilityName
              }
              casts={row.casts}
              fightDurationSeconds={
                fightDurationSeconds
              }
              key={row.abilityName}
            />
          )
        )}

        {orderedVisibleMemberIds.length >
          0 && (
          <div className="cooldown-timeline-section-label">
            RAIDERS
          </div>
        )}

        {orderedVisibleMemberIds.map(
          (memberId) => {
            const member =
              memberById.get(
                memberId
              );

            if (!member) {
              return null;
            }

            return (
              <RaiderCooldownRow
                assignments={assignments.filter(
                  (assignment) =>
                    assignment.memberId ===
                    memberId
                )}
                fightDurationSeconds={
                  fightDurationSeconds
                }
                isInLineup={isAssignedMemberInLineup(
                  memberId,
                  lineupMemberIds
                )}
                key={memberId}
                member={member}
                onRemoveAssignment={
                  onRemoveAssignment
                }
                onRepositionAssignment={
                  onRepositionAssignment
                }
                onTrackClick={(
                  seconds
                ) =>
                  onRaiderTrackClick(
                    memberId,
                    seconds
                  )
                }
              />
            );
          }
        )}
      </div>
    </div>
  );
}
