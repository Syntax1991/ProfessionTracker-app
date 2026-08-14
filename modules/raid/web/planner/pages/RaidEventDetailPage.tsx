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
import { useEventAttendance } from "../../attendance/hooks/useEventAttendance";
import { useBossRosters } from "../../boss-rosters/hooks/useBossRosters";
import type { RaidBoss } from "../../boss-rosters/types/bossRoster.types";
import { MySignupCard } from "../../signups/components/MySignupCard";
import { useSignups } from "../../signups/hooks/useSignups";
import { BossRosterSection } from "../components/BossRosterSection";
import { RaidAttendanceSection } from "../components/RaidAttendanceSection";
import { RaidEventActionsBar } from "../components/RaidEventActionsBar";
import { SignupOfficerSection } from "../components/SignupOfficerSection";
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

  const {
    records: attendanceRecords,
    error: attendanceError,
    setStatus: setAttendanceStatus,
    clearStatus:
      clearAttendanceStatus
  } = useEventAttendance(
    eventId ?? null
  );

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
        signupError ||
        attendanceError) && (
        <StatusMessage type="error">
          {`${bossError ?? signupError ?? attendanceError}`}
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
        <RaidEventActionsBar
          event={event}
          isEditing={isEditing}
          onDelete={() => {
            void handleDelete();
          }}
          onSubmit={
            handleUpdate
          }
          onToggleEdit={() =>
            setIsEditing(
              (current) =>
                !current
            )
          }
          teams={teams}
        />

        <BossRosterSection
          bosses={bosses}
          isLoading={
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
          signupEntries={
            entries
          }
        />

        <SignupOfficerSection
          entries={entries}
          isLoading={
            isLoadingEntries
          }
          onClear={(memberId) => {
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

        <RaidAttendanceSection
          onClearStatus={(
            memberId
          ) => {
            void clearAttendanceStatus(
              memberId
            );
          }}
          onSetStatus={(
            memberId,
            status
          ) => {
            void setAttendanceStatus(
              memberId,
              status
            );
          }}
          records={
            attendanceRecords
          }
          rosterMembers={
            rosterMembers
          }
        />
      </GuildVerificationGate>
    </>
  );
}
