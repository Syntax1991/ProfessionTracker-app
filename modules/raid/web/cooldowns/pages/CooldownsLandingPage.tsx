import {
  useCallback,
  useEffect,
  useState
} from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { Tabs } from "../../../../../apps/web/src/shared/components/Tabs";
import { useRoster } from "../../../../guild/web/roster/hooks/useRoster";
import { getBossesForSetup } from "../../boss-rosters/api/bossRosterApi";
import type { RaidBoss } from "../../boss-rosters/types/bossRoster.types";
import { RaidEventList } from "../../planner/components/RaidEventList";
import { useRaidEvents } from "../../planner/hooks/useRaidEvents";
import type { RaidEvent } from "../../planner/types/raidEvent.types";
import { useRaidSetup } from "../../raid-setup/hooks/useRaidSetup";
import { syncBossWarcraftLogs } from "../api/cooldownApi";
import { BossCooldownView } from "../components/BossCooldownView";
import { useCooldownAssignments } from "../hooks/useCooldownAssignments";

export function CooldownsLandingPage() {
  const {
    events,
    isLoading: isLoadingEvents
  } = useRaidEvents();

  const {
    members: rosterMembers
  } = useRoster();

  const [
    selectedEvent,
    setSelectedEvent
  ] = useState<RaidEvent | null>(
    null
  );

  const {
    setup,
    error: setupError
  } = useRaidSetup(
    selectedEvent?.id ?? null
  );

  const [bosses, setBosses] =
    useState<RaidBoss[]>([]);

  const [
    selectedBossId,
    setSelectedBossId
  ] = useState<string | null>(null);

  const {
    assignments,
    error: cooldownError,
    addAssignment,
    editAssignment,
    removeAssignment
  } = useCooldownAssignments(
    selectedEvent?.id ?? null
  );

  const loadBosses = useCallback(
    async () => {
      if (!setup) {
        setBosses([]);
        return;
      }

      const response =
        await getBossesForSetup(
          setup.id
        );

      setBosses(response.items);

      setSelectedBossId(
        (current) =>
          current ??
          response.items[0]?.id ??
          null
      );
    },
    [setup]
  );

  useEffect(() => {
    void loadBosses();
  }, [loadBosses]);

  const selectedBoss = bosses.find(
    (boss) =>
      boss.id === selectedBossId
  );

  const lineupMemberIds = new Set(
    (
      selectedBoss?.rosterEntries ??
      []
    )
      .filter(
        (entry) =>
          entry.status !== "BENCH"
      )
      .map(
        (entry) => entry.memberId
      )
  );

  const handleSelectEvent = (
    event: RaidEvent
  ) => {
    setSelectedEvent(event);
    setSelectedBossId(null);
  };

  return (
    <div>
      <PageHeader
        description="Plan raid cooldowns and healing/defensive assignments per boss."
        eyebrow="RAID"
        title="Cooldowns"
      />

      {(cooldownError ||
        setupError) && (
        <StatusMessage type="error">
          {`${cooldownError ?? setupError}`}
        </StatusMessage>
      )}

      {isLoadingEvents ? (
        <LoadingPanel />
      ) : !selectedEvent ? (
        <RaidEventList
          events={events}
          onSelect={
            handleSelectEvent
          }
        />
      ) : (
        <>
          <button
            className="button button-secondary"
            onClick={() => {
              setSelectedEvent(null);
              setBosses([]);
              setSelectedBossId(
                null
              );
            }}
            type="button"
          >
            ← Back to events
          </button>

          {bosses.length > 0 && (
            <Tabs
              activeTab={
                selectedBossId ??
                bosses[0].id
              }
              ariaLabel="Bosses"
              onChange={
                setSelectedBossId
              }
              tabs={bosses.map(
                (boss) => ({
                  id: boss.id,
                  label: boss.name
                })
              )}
            />
          )}

          {selectedBoss && (
            <BossCooldownView
              abilitySuggestions={Array.from(
                new Set(
                  assignments.map(
                    (a) =>
                      a.abilityName
                  )
                )
              )}
              assignments={assignments.filter(
                (assignment) =>
                  assignment.bossId ===
                  selectedBoss.id
              )}
              bossId={selectedBoss.id}
              bossName={
                selectedBoss.name
              }
              fightDurationSeconds={
                selectedBoss.fightDurationSeconds
              }
              lineupMemberIds={
                lineupMemberIds
              }
              onAddAssignment={
                addAssignment
              }
              onRemoveAssignment={(
                assignmentId
              ) => {
                void removeAssignment(
                  assignmentId
                );
              }}
              onRepositionAssignment={(
                assignment,
                seconds
              ) => {
                void editAssignment(
                  assignment.id,
                  {
                    memberId:
                      assignment.memberId,
                    abilityName:
                      assignment.abilityName,
                    spellId:
                      assignment.spellId,
                    abilityIcon:
                      assignment.abilityIcon,
                    phaseLabel:
                      assignment.phaseLabel,
                    timestampSeconds:
                      seconds,
                    sortOrder:
                      assignment.sortOrder
                  }
                );
              }}
              onSyncWarcraftLogs={async () => {
                await syncBossWarcraftLogs(
                  selectedBoss.id
                );

                await loadBosses();
              }}
              rosterMembers={
                rosterMembers
              }
              wclSyncedAt={
                selectedBoss.wclSyncedAt
              }
            />
          )}
        </>
      )}
    </div>
  );
}
