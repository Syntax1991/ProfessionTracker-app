import { LoadingPanel } from "../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../apps/web/src/shared/components/StatusMessage";
import { ProfessionOverviewCard } from "../details/components/ProfessionOverviewCard";
import { useProfessionOverview } from "../details/hooks/useProfessionOverview";

export function ProfessionsPage() {
  const {
    items,
    isLoading,
    error
  } = useProfessionOverview();

  return (
    <>
      <PageHeader
        description="Open a profession to review its crafters, recipes and slot coverage."
        eyebrow="CRAFTING COVERAGE"
        title="Professions"
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
                Profession Coverage
              </h2>
            </div>

            <span className="profession-overview-total">
              {items.length}
              {" Professions"}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="empty-state">
              No professions yet.
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