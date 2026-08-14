import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../../../guild/web/roster/hooks/useRoster";
import { GuildVerificationGate } from "../../../../guild/web/verification/components/GuildVerificationGate";
import { useRaidEvents } from "../../planner/hooks/useRaidEvents";
import { BossForm } from "../components/BossForm";
import { BossList } from "../components/BossList";
import { BossRosterGrid } from "../components/BossRosterGrid";
import { useBossRosters } from "../hooks/useBossRosters";
import type {
  RaidBoss,
  RaidBossRosterStatus
} from "../types/bossRoster.types";

export function BossRostersPage() {
  const [
    selectedEventId,
    setSelectedEventId
  ] = useState<string | null>(
    null
  );

  const [
    selectedBossId,
    setSelectedBossId
  ] = useState<string | null>(
    null
  );

  const {
    events,
    isLoading: isLoadingEvents
  } = useRaidEvents();

  const { members: rosterMembers } =
    useRoster();

  const {
    bosses,
    isLoading: isLoadingBosses,
    error,
    addBoss,
    removeBoss,
    setEntry,
    clearEntry
  } = useBossRosters(
    selectedEventId
  );

  const selectedBoss =
    bosses.find(
      (boss) =>
        boss.id === selectedBossId
    ) ?? null;

  const handleDeleteBoss = async (
    boss: RaidBoss
  ) => {
    const confirmed = window.confirm(
      `${boss.name} delete?`
    );

    if (!confirmed) {
      return;
    }

    await removeBoss(boss.id);

    if (
      selectedBossId === boss.id
    ) {
      setSelectedBossId(null);
    }
  };

  return (
    <>
      <PageHeader
        description="Plan which guild members are bringing to each boss in a scheduled raid."
        eyebrow="RAID"
        title="Boss Rosters"
      />

      <GuildVerificationGate>
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                RAID
              </p>

              <h2>
                Select a scheduled
                raid
              </h2>
            </div>
          </div>

          {isLoadingEvents ? (
            <LoadingPanel />
          ) : events.length ===
            0 ? (
            <p className="muted-text">
              No raids scheduled yet.
              Schedule one on the Raid
              Planner page first.
            </p>
          ) : (
            <select
              onChange={(
                event
              ) => {
                setSelectedEventId(
                  event.target
                    .value || null
                );

                setSelectedBossId(
                  null
                );
              }}
              value={
                selectedEventId ??
                ""
              }
            >
              <option value="">
                Select a raid…
              </option>

              {events.map(
                (event) => (
                  <option
                    key={event.id}
                    value={event.id}
                  >
                    {event.title} (
                    {new Date(
                      event.scheduledAt
                    ).toLocaleDateString()}
                    )
                  </option>
                )
              )}
            </select>
          )}
        </section>

        {selectedEventId && (
          <div className="guild-roster-layout">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">
                    BOSSES
                  </p>

                  <h2>
                    {bosses.length}{" "}
                    Bosses
                  </h2>
                </div>
              </div>

              <BossForm
                onSubmit={
                  addBoss
                }
              />

              {isLoadingBosses ? (
                <LoadingPanel />
              ) : (
                <BossList
                  bosses={bosses}
                  onDelete={(
                    boss
                  ) => {
                    void handleDeleteBoss(
                      boss
                    );
                  }}
                  onSelect={
                    setSelectedBossId
                  }
                  selectedBossId={
                    selectedBossId
                  }
                />
              )}
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">
                    ROSTER
                  </p>

                  <h2>
                    {selectedBoss
                      ? selectedBoss.name
                      : "Select a boss"}
                  </h2>
                </div>
              </div>

              {!selectedBoss ? (
                <p className="muted-text">
                  Select a boss on the
                  left to plan its
                  roster.
                </p>
              ) : (
                <BossRosterGrid
                  boss={
                    selectedBoss
                  }
                  onClearStatus={(
                    memberId
                  ) => {
                    void clearEntry(
                      selectedBoss.id,
                      memberId
                    );
                  }}
                  onSetStatus={(
                    memberId,
                    status: RaidBossRosterStatus
                  ) => {
                    void setEntry(
                      selectedBoss.id,
                      memberId,
                      status
                    );
                  }}
                  rosterMembers={
                    rosterMembers
                  }
                />
              )}
            </section>
          </div>
        )}
      </GuildVerificationGate>
    </>
  );
}
