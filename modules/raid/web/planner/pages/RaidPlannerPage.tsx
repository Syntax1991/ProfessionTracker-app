import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    createEvent
  } = useRaidEvents();

  const { teams } = useTeams();

  const handleSubmit = async (
    input: RaidEventInput
  ) => {
    await createEvent(input);
    setPrefillDate(null);
  };

  const handleCreateOnDate = (
    date: Date
  ) => {
    setPrefillDate(date);
  };

  const handleSelectEvent = (
    event: RaidEvent
  ) => {
    navigate(
      `/raid/planner/${event.id}`
    );
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
                  NEW RAID
                </p>

                <h2>
                  Schedule Raid
                </h2>
              </div>
            </div>

            <RaidEventForm
              event={null}
              key={
                prefillDate?.toISOString() ??
                "new-event"
              }
              onCancel={() =>
                setPrefillDate(null)
              }
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
                onSelectEvent={
                  handleSelectEvent
                }
              />
            ) : (
              <RaidEventList
                events={events}
                onSelect={
                  handleSelectEvent
                }
              />
            )}
          </section>
        </div>
      </GuildVerificationGate>
    </>
  );
}
