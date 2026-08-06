import { LoadingPanel } from "../../../shared/components/LoadingPanel";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusMessage } from "../../../shared/components/StatusMessage";
import { ProfessionGrid } from "../components/ProfessionGrid";
import { useProfessions } from "../hooks/useProfessions";

export function ProfessionsPage() {
  const {
    professions,
    isLoading,
    error
  } = useProfessions();

  return (
    <>
      <PageHeader
        description="Erkenne sofort fehlende oder mehrfach belegte Berufe."
        eyebrow="CRAFTING COVERAGE"
        title="Berufe"
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
              MIDNIGHT
            </p>

            <h2>Berufsabdeckung</h2>
          </div>
        </div>

        {isLoading ? (
          <LoadingPanel />
        ) : (
          <ProfessionGrid
            professions={professions}
          />
        )}
      </section>
    </>
  );
}