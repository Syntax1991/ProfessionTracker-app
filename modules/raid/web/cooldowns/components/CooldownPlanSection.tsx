import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import type { RaidBoss } from "../../boss-rosters/types/bossRoster.types";
import type { RaidCooldownAssignment, RaidCooldownAssignmentInput } from "../types/cooldown.types";
import { CooldownBossPanel } from "./CooldownBossPanel";

type CooldownPlanSectionProps = {
  bosses: RaidBoss[];
  assignments: RaidCooldownAssignment[];
  rosterMembers: GuildMember[];
  onAdd: (
    bossId: string,
    input: RaidCooldownAssignmentInput
  ) => Promise<void>;
  onRemove: (
    assignmentId: string
  ) => void;
};

export function CooldownPlanSection({
  bosses,
  assignments,
  rosterMembers,
  onAdd,
  onRemove
}: CooldownPlanSectionProps) {
  const abilitySuggestions = Array.from(
    new Set(
      assignments.map(
        (assignment) =>
          assignment.abilityName
      )
    )
  ).sort();

  if (bosses.length === 0) {
    return null;
  }

  return (
    <>
      {bosses.map((boss) => (
        <CooldownBossPanel
          abilitySuggestions={
            abilitySuggestions
          }
          assignments={assignments.filter(
            (assignment) =>
              assignment.bossId ===
              boss.id
          )}
          bossId={boss.id}
          bossName={boss.name}
          key={boss.id}
          onAdd={onAdd}
          onRemove={onRemove}
          rosterMembers={
            rosterMembers
          }
        />
      ))}
    </>
  );
}
