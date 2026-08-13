import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../roster/hooks/useRoster";
import { GuildVerificationGate } from "../../verification/components/GuildVerificationGate";
import { AttendanceEventForm } from "../components/AttendanceEventForm";
import { AttendanceEventList } from "../components/AttendanceEventList";
import { AttendanceRecordGrid } from "../components/AttendanceRecordGrid";
import { AttendanceSummary } from "../components/AttendanceSummary";
import { useAttendance } from "../hooks/useAttendance";
import type {
  GuildAttendanceEvent,
  GuildAttendanceEventInput,
  GuildAttendanceStatus
} from "../types/attendance.types";

export function AttendancePage() {
  const [
    editingEvent,
    setEditingEvent
  ] =
    useState<GuildAttendanceEvent | null>(
      null
    );

  const [
    selectedEventId,
    setSelectedEventId
  ] = useState<string | null>(
    null
  );

  const {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    setRecord,
    clearRecord
  } = useAttendance();

  const {
    members: rosterMembers
  } = useRoster();

  const selectedEvent =
    events.find(
      (event) =>
        event.id ===
        selectedEventId
    ) ?? null;

  const handleSubmit = async (
    input: GuildAttendanceEventInput
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
    event: GuildAttendanceEvent
  ) => {
    const confirmed = window.confirm(
      `${event.title} delete?`
    );

    if (!confirmed) {
      return;
    }

    await deleteEvent(event.id);

    if (
      editingEvent?.id === event.id
    ) {
      setEditingEvent(null);
    }

    if (
      selectedEventId === event.id
    ) {
      setSelectedEventId(null);
    }
  };

  return (
    <>
      <PageHeader
        description="Track raid events and per-member attendance."
        eyebrow="GUILD"
        title="Attendance"
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
                    : "NEW EVENT"}
                </p>

                <h2>
                  {editingEvent
                    ? editingEvent.title
                    : "Add Event"}
                </h2>
              </div>
            </div>

            <AttendanceEventForm
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
            />

            <div className="panel-header attendance-events-heading">
              <div>
                <p className="eyebrow">
                  EVENTS
                </p>

                <h2>
                  {events.length}{" "}
                  Recorded
                </h2>
              </div>
            </div>

            {isLoading ? (
              <LoadingPanel />
            ) : (
              <AttendanceEventList
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
                onSelect={
                  setSelectedEventId
                }
                selectedEventId={
                  selectedEventId
                }
              />
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  ATTENDANCE
                </p>

                <h2>
                  {selectedEvent
                    ? selectedEvent.title
                    : "Select an event"}
                </h2>
              </div>
            </div>

            {!selectedEvent ? (
              <p className="muted-text">
                Select an event on the left to record attendance.
              </p>
            ) : (
              <AttendanceRecordGrid
                event={
                  selectedEvent
                }
                onClearStatus={(
                  memberId
                ) => {
                  void clearRecord(
                    selectedEvent.id,
                    memberId
                  );
                }}
                onSetStatus={(
                  memberId,
                  status: GuildAttendanceStatus
                ) => {
                  void setRecord(
                    selectedEvent.id,
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

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                SUMMARY
              </p>

              <h2>
                Attendance by member
              </h2>
            </div>
          </div>

          <AttendanceSummary
            events={events}
          />
        </section>
      </GuildVerificationGate>
    </>
  );
}
