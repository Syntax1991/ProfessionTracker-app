import {
  useEffect,
  useState
} from "react";
import { Link } from "react-router-dom";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { getGuildOfficerNoteCount } from "../../officer-notes/api/officerNoteApi";
import { useAttendance } from "../../attendance/hooks/useAttendance";
import { useRequirements } from "../../requirements/hooks/useRequirements";
import { useRoster } from "../../roster/hooks/useRoster";
import { useTeams } from "../../teams/hooks/useTeams";
import { useGuildVerification } from "../../verification/hooks/useGuildVerification";
import { useWeeklyProgress } from "../../weekly-progress/hooks/useWeeklyProgress";

export function GuildDashboardPage() {
  const verification =
    useGuildVerification();

  const {
    members,
    isLoading: isLoadingRoster
  } = useRoster();

  const {
    teams,
    isLoading: isLoadingTeams
  } = useTeams();

  const {
    requirements,
    isLoading: isLoadingRequirements
  } = useRequirements();

  const {
    events,
    isLoading: isLoadingAttendance
  } = useAttendance();

  const {
    summary: weeklySummary,
    isLoading: isLoadingWeekly
  } = useWeeklyProgress();

  const [
    officerNoteCount,
    setOfficerNoteCount
  ] = useState<number | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    getGuildOfficerNoteCount()
      .then((result) => {
        if (!cancelled) {
          setOfficerNoteCount(
            result.total
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOfficerNoteCount(
            null
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const trackedCount =
    weeklySummary?.items.filter(
      (item) => item.tracked
    ).length ?? 0;

  const isLoading =
    isLoadingRoster ||
    isLoadingTeams ||
    isLoadingRequirements ||
    isLoadingAttendance ||
    isLoadingWeekly ||
    verification.isLoadingStatus;

  return (
    <>
      <PageHeader
        description="An overview of your guild's roster, teams and progress."
        eyebrow="GUILD"
        title="Dashboard"
      />

      {isLoading ? (
        <LoadingPanel />
      ) : (
        <>
          {verification.status
            ?.verified ? (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">
                    VERIFIED GUILD
                  </p>

                  <h2>
                    {
                      verification
                        .status
                        .guildName
                    }
                  </h2>

                  <span>
                    {
                      verification
                        .status
                        .realmName
                    }
                  </span>
                </div>

                <span className="integration-badge configured">
                  {verification
                    .status
                    .isGuildMaster
                    ? "Guild Master"
                    : `Rank ${verification.status.verifiedRank}`}
                </span>
              </div>
            </section>
          ) : (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">
                    NOT VERIFIED
                  </p>

                  <h2>
                    Verify your guild leadership
                  </h2>
                </div>
              </div>

              <p className="muted-text">
                <Link to="/guild/roster">
                  Verify via Battle.net
                </Link>{" "}
                to unlock roster, team and attendance management.
              </p>
            </section>
          )}

          <div className="guild-dashboard-grid">
            <Link
              className="panel guild-dashboard-card"
              to="/guild/roster"
            >
              <span className="eyebrow">
                ROSTER
              </span>

              <strong>
                {members.length}
              </strong>

              <span>
                guild members
              </span>
            </Link>

            <Link
              className="panel guild-dashboard-card"
              to="/guild/teams"
            >
              <span className="eyebrow">
                TEAMS
              </span>

              <strong>
                {teams.length}
              </strong>

              <span>
                persistent teams
              </span>
            </Link>

            <Link
              className="panel guild-dashboard-card"
              to="/guild/attendance"
            >
              <span className="eyebrow">
                ATTENDANCE
              </span>

              <strong>
                {events.length}
              </strong>

              <span>
                recorded raid events
              </span>
            </Link>

            <Link
              className="panel guild-dashboard-card"
              to="/guild/weekly-progress"
            >
              <span className="eyebrow">
                WEEKLY PROGRESS
              </span>

              <strong>
                {trackedCount}/
                {members.length}
              </strong>

              <span>
                members tracked in My SynTrack
              </span>
            </Link>

            <Link
              className="panel guild-dashboard-card"
              to="/guild/requirements"
            >
              <span className="eyebrow">
                REQUIREMENTS
              </span>

              <strong>
                {requirements.length}
              </strong>

              <span>
                defined requirements
              </span>
            </Link>

            <Link
              className="panel guild-dashboard-card"
              to="/guild/officer-notes"
            >
              <span className="eyebrow">
                OFFICER NOTES
              </span>

              <strong>
                {officerNoteCount ??
                  "—"}
              </strong>

              <span>
                notes recorded
              </span>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
