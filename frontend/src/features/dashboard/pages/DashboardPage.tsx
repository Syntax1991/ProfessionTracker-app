import { Link } from "react-router-dom";
import { LoadingPanel } from "../../../shared/components/LoadingPanel";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusMessage } from "../../../shared/components/StatusMessage";
import { CoverageTable } from "../components/CoverageTable";
import { DashboardStats } from "../components/DashboardStats";
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
          <Link
            className="button button-primary"
            to="/characters"
          >
            Add Character
          </Link>
        }
        description="Plan your crafter roster and identify missing profession coverage."
        eyebrow="CRAFTING COMMAND CENTER"
        title="Overview"
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

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  COVERAGE MATRIX
                </p>

                <h2>
                  Profession Coverage
                </h2>
              </div>

              <Link
                className="button button-secondary"
                to="/professions"
              >
                Open Details
              </Link>
            </div>

            <CoverageTable
              coverage={
                summary.professionCoverage
              }
            />
          </section>
        </>
      )}
    </>
  );
}