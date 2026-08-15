import { useState } from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import type {
  RaidCooldownAssignment,
  RaidCooldownAssignmentInput
} from "../types/cooldown.types";
import { BossCooldownTimeline } from "./BossCooldownTimeline";
import { CooldownBossPanel } from "./CooldownBossPanel";

type BossCooldownViewProps = {
  bossId: string;
  bossName: string;
  fightDurationSeconds: number | null;
  wclSyncedAt: string | null;
  assignments: RaidCooldownAssignment[];
  rosterMembers: GuildMember[];
  lineupMemberIds: Set<string>;
  abilitySuggestions: string[];
  onSyncWarcraftLogs: () => Promise<void>;
  onAddAssignment: (
    bossId: string,
    input: RaidCooldownAssignmentInput
  ) => Promise<void>;
  onRemoveAssignment: (
    assignmentId: string
  ) => void;
  onRepositionAssignment: (
    assignment: RaidCooldownAssignment,
    seconds: number
  ) => void;
};

export function BossCooldownView({
  bossId,
  bossName,
  fightDurationSeconds,
  wclSyncedAt,
  assignments,
  rosterMembers,
  lineupMemberIds,
  abilitySuggestions,
  onSyncWarcraftLogs,
  onAddAssignment,
  onRemoveAssignment,
  onRepositionAssignment
}: BossCooldownViewProps) {
  const [view, setView] = useState<
    "timeline" | "list"
  >("timeline");

  return (
    <div>
      <div className="cooldown-view-toggle">
        <button
          className={
            view === "timeline"
              ? "button button-secondary active"
              : "button button-secondary"
          }
          onClick={() =>
            setView("timeline")
          }
          type="button"
        >
          Timeline
        </button>

        <button
          className={
            view === "list"
              ? "button button-secondary active"
              : "button button-secondary"
          }
          onClick={() =>
            setView("list")
          }
          type="button"
        >
          List
        </button>
      </div>

      {view === "timeline" ? (
        <BossCooldownTimeline
          assignments={assignments}
          bossId={bossId}
          bossName={bossName}
          fightDurationSeconds={
            fightDurationSeconds
          }
          lineupMemberIds={
            lineupMemberIds
          }
          onAddAssignment={
            onAddAssignment
          }
          onRemoveAssignment={
            onRemoveAssignment
          }
          onRepositionAssignment={
            onRepositionAssignment
          }
          onSyncWarcraftLogs={
            onSyncWarcraftLogs
          }
          rosterMembers={
            rosterMembers
          }
          wclSyncedAt={wclSyncedAt}
        />
      ) : (
        <CooldownBossPanel
          abilitySuggestions={
            abilitySuggestions
          }
          assignments={assignments}
          bossId={bossId}
          bossName={bossName}
          onAdd={onAddAssignment}
          onRemove={
            onRemoveAssignment
          }
          rosterMembers={
            rosterMembers
          }
        />
      )}
    </div>
  );
}
