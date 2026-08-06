import { LoadingPanel } from "../../../shared/components/LoadingPanel";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusMessage } from "../../../shared/components/StatusMessage";
import { ProfessionOverviewCard } from "../../profession-details/components/ProfessionOverviewCard";
import { useProfessionOverview } from "../../profession-details/hooks/useProfessionOverview";

export function ProfessionsPage() {
  const {
    items,
    isLoading,
    error
  } = useProfessionOverview();

  return (
    <>
      <PageHeader
        description="Öffne einen Beruf und prüfe, welche Charaktere welche Spezialisierungen und Slots abdecken."
        eyebrow="CRAFTING COVERAGE"
        title="Berufe"
      />

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      {isLoading ? (
        <LoadingPanel />
      ) : (
        <section className="panel profession-overview-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                MIDNIGHT
              </p>

              <h2>
                Berufsabdeckung
              </h2>
            </div>

            <span className="profession-overview-total">
              {items.length}
              {" Berufe"}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="empty-state">
              Noch keine Berufe vorhanden.
            </div>
          ) : (
            <div className="profession-overview-grid">
              {items.map(
                (profession) => (
                  <ProfessionOverviewCard
                    key={profession.id}
                    profession={
                      profession
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}