import { Link } from "react-router-dom";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { CharacterOverview } from "../components/CharacterOverview";
import { DashboardPriorities } from "../components/DashboardPriorities";
import { DashboardStats } from "../components/DashboardStats";
import { UpcomingWorkspaces } from "../components/UpcomingWorkspaces";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardPage() {
  const {
    summary,
    isLoading,
    error
  } = useDashboard();

  return (
    <>
      <PageHeader
        actions={
          <>
            <Link
              className="button button-secondary"
              to="/battlenet"
            >
              Sync data
            </Link>

            <Link
              className="button button-primary"
              to="/characters"
            >
              Manage characters
            </Link>
          </>
        }
        description="Your personal home for characters, readiness and the work that matters before reset."
        eyebrow="PERSONAL COMMAND CENTER"
        title="My SynTrack"
      />

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      {isLoading || !summary ? (
        <LoadingPanel />
      ) : (
        <>
          <DashboardStats
            summary={summary}
          />

          <div className="my-dashboard-grid">
            <CharacterOverview
              characters={summary.characters}
              minimumCraftingLevel={
                summary.minimumCraftingLevel
              }
            />

            <DashboardPriorities
              summary={summary}
            />
          </div>

          <UpcomingWorkspaces />
        </>
      )}
    </>
  );
}
