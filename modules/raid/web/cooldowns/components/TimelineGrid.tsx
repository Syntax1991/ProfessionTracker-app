import {
  useState,
  type CSSProperties
} from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import type { BossAbility } from "../../../shared/catalog/bossAbilityCatalog";
import type {
  RaidBossAbilityCast,
  RaidBossPhaseMarker,
  RaidCooldownAssignment
} from "../types/cooldown.types";
import {
  formatSeconds,
  percentOf
} from "../utils/timelineFormat";
import { BossAbilityRow } from "./BossAbilityRow";
import { RaiderCooldownRow } from "./RaiderCooldownRow";

const tickCount = 10;

type TimelineGridProps = {
  fightDurationSeconds: number;
  phaseMarkers: RaidBossPhaseMarker[];
  bossAbilities: BossAbility[];
  bossAbilityCasts: RaidBossAbilityCast[];
  assignments: RaidCooldownAssignment[];
  rosterMembers: GuildMember[];
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
  bossAbilities,
  bossAbilityCasts,
  assignments,
  rosterMembers,
  onRaiderTrackClick,
  onRemoveAssignment,
  onRepositionAssignment,
  onRemovePhaseMarker
}: TimelineGridProps) {
  const [
    manuallyAddedMemberIds,
    setManuallyAddedMemberIds
  ] = useState<string[]>([]);

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
    ...manuallyAddedMemberIds
  ]);

  const orderedVisibleMemberIds =
    rosterMembers
      .map((member) => member.id)
      .filter((id) =>
        visibleMemberIds.has(id)
      );

  const addableMembers =
    rosterMembers.filter(
      (member) =>
        !visibleMemberIds.has(
          member.id
        )
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

        {bossAbilities.map(
          (ability) => (
            <BossAbilityRow
              abilityName={
                ability.name
              }
              casts={bossAbilityCasts.filter(
                (cast) =>
                  cast.abilityName ===
                  ability.name
              )}
              fightDurationSeconds={
                fightDurationSeconds
              }
              key={ability.name}
            />
          )
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

      {addableMembers.length >
        0 && (
        <div className="cooldown-timeline-add-row">
          <select
            onChange={(event) => {
              const memberId =
                event.target.value;

              if (memberId) {
                setManuallyAddedMemberIds(
                  (previous) => [
                    ...previous,
                    memberId
                  ]
                );
              }

              event.target.value =
                "";
            }}
            value=""
          >
            <option value="">
              + Add raider…
            </option>

            {addableMembers.map(
              (member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.name}
                </option>
              )
            )}
          </select>
        </div>
      )}
    </div>
  );
}
