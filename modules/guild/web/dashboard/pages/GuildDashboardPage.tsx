import {
  useEffect,
  useState
} from "react";
import { Link } from "react-router-dom";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { getGuildOfficerNoteCount } from "../../officer-notes/api/officerNoteApi";
import { useRequirements } from "../../requirements/hooks/useRequirements";
import { useRoster } from "../../roster/hooks/useRoster";
import { useTeams } from "../../teams/hooks/useTeams";
import { GuildVerificationStatusCard } from "../../verification/components/GuildVerificationStatusCard";
import { useGuildVerification } from "../../verification/hooks/useGuildVerification";
import { useWeeklyProgress } from "../../weekly-progress/hooks/useWeeklyProgress";

type DashboardCardProps = {
  label: string;
  value: string | number;
  detail: string;
  to: string;
};

function DashboardCard({
  label,
  value,
  detail,
  to
}: DashboardCardProps) {
  return (
    <Link
      className="guild-dashboard-card"
      to={to}
    >
      <span className="guild-dashboard-card-label">
        {label}
      </span>

      <div className="guild-dashboard-card-value">
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>

      <span className="guild-dashboard-card-action">
        Open →
      </span>
    </Link>
  );
}

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
    isLoadingWeekly ||
    verification.isLoadingStatus;

  return (
    <div className="guild-page">
      <PageHeader
        description="Roster health, preparation and guild operations at a glance."
        eyebrow="GUILD"
        title="Dashboard"
      />

      {isLoading ? (
        <LoadingPanel />
      ) : (
        <>
          {verification.status
            ?.verified ? (
            <GuildVerificationStatusCard
              status={
                verification.status
              }
            />
          ) : (
            <section className="guild-access-card">
              <div>
                <span className="eyebrow">
                  GUILD ACCESS
                </span>

                <strong>
                  Leadership verification required
                </strong>

                <p>
                  Verify the guild through
                  Battle.net before using
                  officer management tools.
                </p>
              </div>

              <Link
                className="button button-primary"
                to="/guild/roster"
              >
                Verify Guild
              </Link>
            </section>
          )}

          <div className="guild-section-toolbar">
            <div>
              <span className="eyebrow">
                OVERVIEW
              </span>

              <h2>
                Guild Operations
              </h2>
            </div>
          </div>

          <div className="guild-dashboard-grid">
            <DashboardCard
              detail="guild members"
              label="Roster"
              to="/guild/roster"
              value={members.length}
            />

            <DashboardCard
              detail="members tracked"
              label="Weekly Progress"
              to="/guild/weekly-progress"
              value={`${trackedCount}/${members.length}`}
            />

            <DashboardCard
              detail="defined rules"
              label="Requirements"
              to="/guild/requirements"
              value={requirements.length}
            />

            <DashboardCard
              detail="persistent teams"
              label="Teams"
              to="/guild/teams"
              value={teams.length}
            />

            <DashboardCard
              detail="officer notes"
              label="Officer Notes"
              to="/guild/officer-notes"
              value={
                officerNoteCount ??
                "—"
              }
            />
          </div>
        </>
      )}
    </div>
  );
}