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
            Charakter hinzufügen
          </Link>
        }
        description="Plane deine Crafter-Flotte und erkenne fehlende Berufsabdeckungen."
        eyebrow="CRAFTING COMMAND CENTER"
        title="Übersicht"
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
                  Berufsabdeckung
                </h2>
              </div>

              <Link
                className="button button-secondary"
                to="/professions"
              >
                Details öffnen
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