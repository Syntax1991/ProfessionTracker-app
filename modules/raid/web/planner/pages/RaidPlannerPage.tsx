import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useTeams } from "../../../../guild/web/teams/hooks/useTeams";
import { GuildVerificationGate } from "../../../../guild/web/verification/components/GuildVerificationGate";
import { RaidEventForm } from "../components/RaidEventForm";
import { RaidEventList } from "../components/RaidEventList";
import { useRaidEvents } from "../hooks/useRaidEvents";
import type {
  RaidEvent,
  RaidEventInput
} from "../types/raidEvent.types";

export function RaidPlannerPage() {
  const [
    editingEvent,
    setEditingEvent
  ] = useState<RaidEvent | null>(
    null
  );

  const {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent
  } = useRaidEvents();

  const { teams } = useTeams();

  const handleSubmit = async (
    input: RaidEventInput
  ) => {
    if (editingEvent) {
      await updateEvent(
        editingEvent.id,
        input
      );

      setEditingEvent(null);
      return;
    }

    await createEvent(input);
  };

  const handleDelete = async (
    event: RaidEvent
  ) => {
    const confirmed = window.confirm(
      `${event.title} delete?`
    );

    if (!confirmed) {
      return;
    }

    await deleteEvent(event.id);

    if (
      editingEvent?.id ===
      event.id
    ) {
      setEditingEvent(null);
    }
  };

  return (
    <>
      <PageHeader
        description="Schedule raid nights and link them to a guild team."
        eyebrow="RAID"
        title="Raid Planner"
      />

      <GuildVerificationGate>
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        <div className="guild-roster-layout">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  {editingEvent
                    ? "EDIT"
                    : "NEW RAID"}
                </p>

                <h2>
                  {editingEvent
                    ? editingEvent.title
                    : "Schedule Raid"}
                </h2>
              </div>
            </div>

            <RaidEventForm
              event={
                editingEvent
              }
              key={
                editingEvent?.id ??
                "new-event"
              }
              onCancel={() =>
                setEditingEvent(
                  null
                )
              }
              onSubmit={
                handleSubmit
              }
              teams={teams}
            />
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  OVERVIEW
                </p>

                <h2>
                  {events.length}{" "}
                  Scheduled Raids
                </h2>
              </div>
            </div>

            {isLoading ? (
              <LoadingPanel />
            ) : (
              <RaidEventList
                events={events}
                onDelete={(
                  event
                ) => {
                  void handleDelete(
                    event
                  );
                }}
                onEdit={
                  setEditingEvent
                }
              />
            )}
          </section>
        </div>
      </GuildVerificationGate>
    </>
  );
}
