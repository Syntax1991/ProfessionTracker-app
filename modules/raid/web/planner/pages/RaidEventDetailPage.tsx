import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../../../guild/web/roster/hooks/useRoster";
import { useTeams } from "../../../../guild/web/teams/hooks/useTeams";
import { GuildVerificationGate } from "../../../../guild/web/verification/components/GuildVerificationGate";
import { useBossRosters } from "../../boss-rosters/hooks/useBossRosters";
import type { RaidBoss } from "../../boss-rosters/types/bossRoster.types";
import { MySignupCard } from "../../signups/components/MySignupCard";
import { SignupOfficerGrid } from "../../signups/components/SignupOfficerGrid";
import { useSignups } from "../../signups/hooks/useSignups";
import { RaidBossManagementSection } from "../components/RaidBossManagementSection";
import { RaidEventManagePanel } from "../components/RaidEventManagePanel";
import { useRaidEvents } from "../hooks/useRaidEvents";
import type { RaidEventInput } from "../types/raidEvent.types";

function formatEventSummary(
  event: {
    raidInstance: string;
    difficulty: string;
    scheduledAt: string;
    teamName: string | null;
  }
): string {
  const parts = [
    event.raidInstance,
    event.difficulty,
    new Date(
      event.scheduledAt
    ).toLocaleString(),
    event.teamName ?? "No team"
  ];

  return parts.join(" · ");
}

export function RaidEventDetailPage() {
  const { eventId } =
    useParams<{
      eventId: string;
    }>();

  const navigate = useNavigate();

  const [isEditing, setIsEditing] =
    useState(false);

  const [
    selectedBossId,
    setSelectedBossId
  ] = useState<string | null>(
    null
  );

  const {
    events,
    isLoading: isLoadingEvents,
    updateEvent,
    deleteEvent
  } = useRaidEvents();

  const { teams } = useTeams();

  const { members: rosterMembers } =
    useRoster();

  const {
    bosses,
    isLoading: isLoadingBosses,
    error: bossError,
    addBoss,
    removeBoss,
    setEntry,
    clearEntry
  } = useBossRosters(
    eventId ?? null
  );

  const {
    entries,
    isLoading: isLoadingEntries,
    isSubmitting,
    error: signupError,
    setMemberStatus,
    setOwnStatus,
    clearMemberStatus
  } = useSignups(eventId ?? null);

  const event =
    events.find(
      (candidate) =>
        candidate.id === eventId
    ) ?? null;

  const handleUpdate = async (
    input: RaidEventInput
  ) => {
    if (!event) {
      return;
    }

    await updateEvent(
      event.id,
      input
    );

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!event) {
      return;
    }

    const confirmed = window.confirm(
      `${event.title} delete?`
    );

    if (!confirmed) {
      return;
    }

    await deleteEvent(event.id);
    navigate("/raid/planner");
  };

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

  if (isLoadingEvents) {
    return <LoadingPanel />;
  }

  if (!event) {
    return (
      <>
        <PageHeader
          description="This scheduled raid no longer exists."
          eyebrow="RAID"
          title="Raid not found"
        />

        <Link
          className="button button-secondary"
          to="/raid/planner"
        >
          Back to Raid Planner
        </Link>
      </>
    );
  }

  return (
    <>
      <PageHeader
        actions={
          <Link
            className="button button-secondary"
            to="/raid/planner"
          >
            Back to Raid Planner
          </Link>
        }
        description={formatEventSummary(
          event
        )}
        eyebrow="RAID"
        title={event.title}
      />

      {(bossError ||
        signupError) && (
        <StatusMessage type="error">
          {`${bossError ?? signupError}`}
        </StatusMessage>
      )}

      <MySignupCard
        entries={entries}
        isSubmitting={
          isSubmitting
        }
        onSetOwnStatus={(
          status
        ) => {
          void setOwnStatus(
            status
          );
        }}
      />

      <GuildVerificationGate>
        <RaidEventManagePanel
          event={event}
          isEditing={isEditing}
          onCancelEdit={() =>
            setIsEditing(false)
          }
          onDelete={() => {
            void handleDelete();
          }}
          onStartEdit={() =>
            setIsEditing(true)
          }
          onSubmit={
            handleUpdate
          }
          teams={teams}
        />

        <RaidBossManagementSection
          bosses={bosses}
          isLoadingBosses={
            isLoadingBosses
          }
          onAddBoss={addBoss}
          onClearStatus={(
            bossId,
            memberId
          ) => {
            void clearEntry(
              bossId,
              memberId
            );
          }}
          onDeleteBoss={(
            boss
          ) => {
            void handleDeleteBoss(
              boss
            );
          }}
          onSelectBoss={
            setSelectedBossId
          }
          onSetStatus={(
            bossId,
            memberId,
            status
          ) => {
            void setEntry(
              bossId,
              memberId,
              status
            );
          }}
          rosterMembers={
            rosterMembers
          }
          selectedBossId={
            selectedBossId
          }
        />

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                OFFICER OVERVIEW
              </p>

              <h2>
                {
                  entries.filter(
                    (entry) =>
                      entry.status !==
                      null
                  ).length
                }{" "}
                of {entries.length}{" "}
                signed up
              </h2>
            </div>
          </div>

          {isLoadingEntries ? (
            <LoadingPanel />
          ) : (
            <SignupOfficerGrid
              entries={entries}
              onClear={(
                memberId
              ) => {
                void clearMemberStatus(
                  memberId
                );
              }}
              onSetStatus={(
                memberId,
                status
              ) => {
                void setMemberStatus(
                  memberId,
                  status
                );
              }}
            />
          )}
        </section>
      </GuildVerificationGate>
    </>
  );
}
