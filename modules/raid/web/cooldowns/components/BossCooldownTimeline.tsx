import {
  useState,
  type FormEvent
} from "react";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import { getAbilitiesForBoss } from "../../../shared/catalog/bossAbilityCatalog";
import { useBossAbilityCasts } from "../hooks/useBossAbilityCasts";
import { usePhaseMarkers } from "../hooks/usePhaseMarkers";
import type {
  RaidCooldownAssignment,
  RaidCooldownAssignmentInput
} from "../types/cooldown.types";
import {
  formatSeconds,
  parseTimeInput
} from "../utils/timelineFormat";
import { CooldownAssignmentForm } from "./CooldownAssignmentForm";
import { PhaseMarkerForm } from "./PhaseMarkerForm";
import { TimelineGrid } from "./TimelineGrid";

type BossCooldownTimelineProps = {
  bossId: string;
  bossName: string;
  fightDurationSeconds: number | null;
  wclSyncedAt: string | null;
  assignments: RaidCooldownAssignment[];
  rosterMembers: GuildMember[];
  onUpdateDuration: (
    seconds: number | null
  ) => Promise<void>;
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

export function BossCooldownTimeline({
  bossId,
  bossName,
  fightDurationSeconds,
  wclSyncedAt,
  assignments,
  rosterMembers,
  onUpdateDuration,
  onSyncWarcraftLogs,
  onAddAssignment,
  onRemoveAssignment,
  onRepositionAssignment
}: BossCooldownTimelineProps) {
  const phaseMarkers =
    usePhaseMarkers(bossId);

  const abilityCasts =
    useBossAbilityCasts(bossId);

  const [durationInput, setDurationInput] =
    useState(
      fightDurationSeconds !== null
        ? formatSeconds(
            fightDurationSeconds
          )
        : ""
    );

  const [
    pendingAssignmentClick,
    setPendingAssignmentClick
  ] = useState<{
    memberId: string;
    seconds: number;
  } | null>(null);

  const [isSyncing, setIsSyncing] =
    useState(false);

  const [syncError, setSyncError] =
    useState<string | null>(null);

  const abilitySuggestions =
    Array.from(
      new Set(
        assignments.map(
          (assignment) =>
            assignment.abilityName
        )
      )
    ).sort();

  const bossAbilities =
    getAbilitiesForBoss(bossName);

  const handleDurationSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await onUpdateDuration(
      parseTimeInput(durationInput)
    );
  };

  const handleSync = async () => {
    setSyncError(null);
    setIsSyncing(true);

    try {
      await onSyncWarcraftLogs();
      await abilityCasts.reload();
    }
    catch (error) {
      setSyncError(
        error instanceof Error
          ? error.message
          : "Sync fehlgeschlagen."
      );
    }
    finally {
      setIsSyncing(false);
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            TIMELINE
          </p>

          <h2>{bossName}</h2>

          <p className="muted-text">
            {wclSyncedAt
              ? `Synced from Warcraft Logs — ${new Date(wclSyncedAt).toLocaleString()}`
              : "Not synced from Warcraft Logs yet."}
          </p>
        </div>

        <div className="cooldown-duration-form">
          <button
            className="button button-primary"
            disabled={isSyncing}
            onClick={() =>
              void handleSync()
            }
            type="button"
          >
            {isSyncing
              ? "Syncing…"
              : "Sync from Warcraft Logs"}
          </button>

          <form
            className="cooldown-duration-form"
            onSubmit={
              handleDurationSubmit
            }
          >
            <input
              onChange={(event) =>
                setDurationInput(
                  event.target
                    .value
                )
              }
              placeholder="mm:ss"
              value={durationInput}
            />

            <button
              className="button button-secondary"
              type="submit"
            >
              Set duration
            </button>
          </form>
        </div>
      </div>

      {syncError && (
        <StatusMessage type="error">
          {syncError}
        </StatusMessage>
      )}

      {fightDurationSeconds ===
      null ? (
        <p className="muted-text">
          Set a fight duration above,
          or sync from Warcraft Logs,
          to start showing cooldowns
          on the timeline.
        </p>
      ) : (
        <>
          <PhaseMarkerForm
            onSubmit={
              phaseMarkers.addMarker
            }
          />

          <p className="muted-text">
            Boss ability rows are
            synced from Warcraft Logs.
            Click a raider's row to
            assign their cooldown —
            drag a placed cooldown to
            move it.
          </p>

          <TimelineGrid
            assignments={
              assignments
            }
            bossAbilities={
              bossAbilities
            }
            bossAbilityCasts={
              abilityCasts.casts
            }
            fightDurationSeconds={
              fightDurationSeconds
            }
            onRaiderTrackClick={(
              memberId,
              seconds
            ) =>
              setPendingAssignmentClick(
                { memberId, seconds }
              )
            }
            onRemoveAssignment={
              onRemoveAssignment
            }
            onRemovePhaseMarker={(
              markerId
            ) => {
              void phaseMarkers.removeMarker(
                markerId
              );
            }}
            onRepositionAssignment={
              onRepositionAssignment
            }
            phaseMarkers={
              phaseMarkers.markers
            }
            rosterMembers={
              rosterMembers
            }
          />

          {pendingAssignmentClick !==
            null && (
            <>
              <CooldownAssignmentForm
                abilitySuggestions={
                  abilitySuggestions
                }
                datalistId={`cooldown-timeline-abilities-${bossId}`}
                initialMemberId={
                  pendingAssignmentClick.memberId
                }
                initialTimestampSeconds={
                  pendingAssignmentClick.seconds
                }
                onSubmit={async (
                  input
                ) => {
                  await onAddAssignment(
                    bossId,
                    input
                  );

                  setPendingAssignmentClick(
                    null
                  );
                }}
                rosterMembers={
                  rosterMembers
                }
              />

              <button
                className="text-button"
                onClick={() =>
                  setPendingAssignmentClick(
                    null
                  )
                }
                type="button"
              >
                Cancel
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
}
