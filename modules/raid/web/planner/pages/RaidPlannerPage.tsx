import {
  useCallback,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useTeams } from "../../../../guild/web/teams/hooks/useTeams";
import { GuildVerificationGate } from "../../../../guild/web/verification/components/GuildVerificationGate";
import { RaidCalendarView } from "../components/RaidCalendarView";
import { RaidEventList } from "../components/RaidEventList";
import { RaidEventModal } from "../components/RaidEventModal";
import { useRaidEvents } from "../hooks/useRaidEvents";
import type {
  RaidEvent,
  RaidEventInput
} from "../types/raidEvent.types";
import {
  addMonths,
  formatMonthLabel
} from "../utils/calendarMonth";
import "../styles/raid-planner.css";

type ViewMode =
  | "calendar"
  | "list";

export function RaidPlannerPage() {
  const navigate = useNavigate();

  const [
    isCreateModalOpen,
    setIsCreateModalOpen
  ] = useState(false);

  const [
    prefillDate,
    setPrefillDate
  ] = useState<Date | null>(null);

  const [
    viewMode,
    setViewMode
  ] = useState<ViewMode>(
    "calendar"
  );

  const [
    monthDate,
    setMonthDate
  ] = useState(
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

  const closeCreateModal =
    useCallback(() => {
      setIsCreateModalOpen(false);
      setPrefillDate(null);
    }, []);

  const openCreateModal = (
    date: Date | null = null
  ) => {
    setPrefillDate(date);
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (
    input: RaidEventInput
  ) => {
    await createEvent(input);
    closeCreateModal();
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
        description="Plan raid nights, signups, rosters and encounter preparation from one event workflow."
        eyebrow="RAID"
        title="Raid Planner"
      />

      <GuildVerificationGate>
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        <section className="panel raid-planner-panel">
          <div className="panel-header raid-planner-header">
            <div>
              <p className="eyebrow">
                EVENTS
              </p>

              <h2>
                {events.length} Scheduled{" "}
                {events.length === 1
                  ? "Raid"
                  : "Raids"}
              </h2>
            </div>

            <div className="raid-planner-actions">
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

              <button
                className="button button-primary raid-schedule-button"
                onClick={() =>
                  openCreateModal()
                }
                type="button"
              >
                + Schedule Raid
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
                      (previous) =>
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
                      (previous) =>
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

              <span className="raid-calendar-hint">
                Select a day to schedule
                a raid.
              </span>
            </div>
          )}

          {isLoading ? (
            <LoadingPanel />
          ) : viewMode ===
            "calendar" ? (
            <RaidCalendarView
              events={events}
              monthDate={monthDate}
              onCreateOnDate={
                openCreateModal
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

        <RaidEventModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSubmit={handleSubmit}
          prefillDate={prefillDate}
          teams={teams}
        />
      </GuildVerificationGate>
    </>
  );
}