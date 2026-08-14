import { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../../../guild/web/roster/hooks/useRoster";
import { getRaidSeasonForScheduledAt } from "../../../shared/catalog/raidCatalog";
import {
  AttendanceSeasonFilter,
  type AttendanceSeasonFilterValue
} from "../components/AttendanceSeasonFilter";
import { AttendanceRosterTable } from "../components/AttendanceRosterTable";
import { useAttendanceSummary } from "../hooks/useAttendanceSummary";

export function AttendancePage() {
  const [season, setSeason] =
    useState<AttendanceSeasonFilterValue>(
      () =>
        getRaidSeasonForScheduledAt(
          new Date().toISOString()
        ).season
    );

  const {
    events,
    isLoading,
    error
  } = useAttendanceSummary();

  const {
    members: rosterMembers
  } = useRoster();

  const filteredEvents =
    season === "all"
      ? events
      : events.filter(
          (event) =>
            getRaidSeasonForScheduledAt(
              event.scheduledAt
            ).season === season
        );

  return (
    <div className="guild-page">
      <PageHeader
        description="Season attendance overview across all raid events."
        eyebrow="RAID"
        title="Attendance"
      />

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              ATTENDANCE
            </p>

            <h2>
              {
                filteredEvents.length
              }{" "}
              Raid{" "}
              {filteredEvents.length ===
              1
                ? "Night"
                : "Nights"}
            </h2>
          </div>

          <AttendanceSeasonFilter
            onChange={setSeason}
            value={season}
          />
        </div>

        {isLoading ? (
          <LoadingPanel />
        ) : filteredEvents.length ===
          0 ? (
          <p className="muted-text">
            No raid events in this
            season yet. Schedule one
            in{" "}
            <Link to="/raid/planner">
              Raid Planner
            </Link>
            , then record attendance
            from that event's page.
          </p>
        ) : (
          <AttendanceRosterTable
            events={filteredEvents}
            rosterMembers={
              rosterMembers
            }
          />
        )}
      </section>
    </div>
  );
}
