import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useTeams } from "../../../../guild/web/teams/hooks/useTeams";
import { GuildVerificationGate } from "../../../../guild/web/verification/components/GuildVerificationGate";
import { RaidCalendarView } from "../components/RaidCalendarView";
import { RaidEventForm } from "../components/RaidEventForm";
import { RaidEventList } from "../components/RaidEventList";
import { useRaidEvents } from "../hooks/useRaidEvents";
import type {
  RaidEvent,
  RaidEventInput
} from "../types/raidEvent.types";
import {
  addMonths,
  formatMonthLabel
} from "../utils/calendarMonth";

type ViewMode = "calendar" | "list";

export function RaidPlannerPage() {
  const [
    editingEvent,
    setEditingEvent
  ] = useState<RaidEvent | null>(
    null
  );

  const [
    prefillDate,
    setPrefillDate
  ] = useState<Date | null>(null);

  const [viewMode, setViewMode] =
    useState<ViewMode>("calendar");

  const [monthDate, setMonthDate] =
    useState(
      () =>
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        )
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
    setPrefillDate(null);
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

  const handleCreateOnDate = (
    date: Date
  ) => {
    setEditingEvent(null);
    setPrefillDate(date);
  };

  const handleEditEvent = (
    event: RaidEvent
  ) => {
    setPrefillDate(null);
    setEditingEvent(event);
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
                prefillDate?.toISOString() ??
                "new-event"
              }
              onCancel={() => {
                setEditingEvent(
                  null
                );

                setPrefillDate(
                  null
                );
              }}
              onSubmit={
                handleSubmit
              }
              prefillDate={
                prefillDate
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

              <div className="raid-calendar-view-toggle">
                <button
                  className={
                    viewMode ===
                    "calendar"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setViewMode(
                      "calendar"
                    )
                  }
                  type="button"
                >
                  Calendar
                </button>

                <button
                  className={
                    viewMode ===
                    "list"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setViewMode(
                      "list"
                    )
                  }
                  type="button"
                >
                  List
                </button>
              </div>
            </div>

            {viewMode ===
              "calendar" && (
              <div className="raid-calendar-toolbar">
                <div className="raid-calendar-nav">
                  <button
                    aria-label="Previous month"
                    className="raid-calendar-nav-button"
                    onClick={() =>
                      setMonthDate(
                        (
                          previous
                        ) =>
                          addMonths(
                            previous,
                            -1
                          )
                      )
                    }
                    type="button"
                  >
                    ‹
                  </button>

                  <span className="raid-calendar-nav-label">
                    {formatMonthLabel(
                      monthDate
                    )}
                  </span>

                  <button
                    aria-label="Next month"
                    className="raid-calendar-nav-button"
                    onClick={() =>
                      setMonthDate(
                        (
                          previous
                        ) =>
                          addMonths(
                            previous,
                            1
                          )
                      )
                    }
                    type="button"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}

            {isLoading ? (
              <LoadingPanel />
            ) : viewMode ===
              "calendar" ? (
              <RaidCalendarView
                events={events}
                monthDate={
                  monthDate
                }
                onCreateOnDate={
                  handleCreateOnDate
                }
                onEditEvent={
                  handleEditEvent
                }
              />
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
                  handleEditEvent
                }
              />
            )}
          </section>
        </div>
      </GuildVerificationGate>
    </>
  );
}
