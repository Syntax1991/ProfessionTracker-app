import {
  Link,
  useParams
} from "react-router-dom";
import { LoadingPanel } from "../../../shared/components/LoadingPanel";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusMessage } from "../../../shared/components/StatusMessage";
import { ProfessionCharacterCard } from "../components/ProfessionCharacterCard";
import { useProfessionDetail } from "../hooks/useProfessionDetail";

function getCategoryLabel(
  category: string
): string {
  return category === "GATHERING"
    ? "Sammelberuf"
    : "Herstellungsberuf";
}

export function ProfessionDetailPage() {
  const {
    professionId
  } = useParams<{
    professionId: string;
  }>();

  const {
    detail,
    isLoading,
    error
  } =
    useProfessionDetail(
      professionId
    );

  if (!professionId) {
    return (
      <>
        <PageHeader
          eyebrow="BERUFSDETAIL"
          title="Beruf"
        />

        <StatusMessage type="error">
          Die Berufs-ID fehlt.
        </StatusMessage>
      </>
    );
  }

  if (
    isLoading ||
    !detail
  ) {
    return (
      <>
        <PageHeader
          eyebrow="BERUFSDETAIL"
          title="Beruf wird geladen"
        />

        {error ? (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        ) : (
          <LoadingPanel />
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        actions={
          <Link
            className="button button-secondary"
            to="/professions"
          >
            Zurück zu Berufen
          </Link>
        }
        description={
          `${getCategoryLabel(detail.profession.category)} · Charaktere, Spezialisierungen und herstellbare Slots`
        }
        eyebrow="BERUFSDETAIL"
        title={
          detail.profession.name
        }
      />

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      <section className="profession-detail-summary-grid">
        <article className="panel profession-detail-summary-card">
          <span>Charaktere</span>

          <strong>
            {
              detail.summary
                .characterCount
            }
          </strong>

          <small>
            mit diesem Beruf
          </small>
        </article>

        <article className="panel profession-detail-summary-card">
          <span>Erfasst</span>

          <strong>
            {
              detail.summary
                .trackedCharacterCount
            }
          </strong>

          <small>
            mit Spezialisierungsdaten
          </small>
        </article>

        <article className="panel profession-detail-summary-card">
          <span>Spezialisierungen</span>

          <strong>
            {
              detail.summary
                .specializationCount
            }
          </strong>

          <small>
            aktive Pfade
          </small>
        </article>

        <article className="panel profession-detail-summary-card">
          <span>Slots</span>

          <strong>
            {
              detail.summary
                .slotCount
            }
          </strong>

          <small>
            erfasste Slotabdeckungen
          </small>
        </article>
      </section>

      <section className="profession-detail-character-section">
        <div className="profession-detail-section-heading">
          <div>
            <p className="eyebrow">
              CRAFTER
            </p>

            <h2>
              Zugewiesene Charaktere
            </h2>
          </div>

          <p>
            {
              detail.summary
                .missingCharacterCount
            }
            {" Charaktere besitzen noch keine vollständigen Slotdaten."}
          </p>
        </div>

        {detail.characters.length ===
        0 ? (
          <section className="panel">
            <div className="empty-state">
              Diesem Beruf ist noch kein
              Charakter zugewiesen.
            </div>
          </section>
        ) : (
          <div className="profession-character-list">
            {detail.characters.map(
              (coverage) => (
                <ProfessionCharacterCard
                  coverage={coverage}
                  key={
                    coverage
                      .characterProfessionId
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </>
  );
}