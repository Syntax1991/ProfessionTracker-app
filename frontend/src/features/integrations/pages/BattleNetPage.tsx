import {
  useEffect,
  useState
} from "react";
import { LoadingPanel } from "../../../shared/components/LoadingPanel";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusMessage } from "../../../shared/components/StatusMessage";
import { getBattleNetStatus } from "../api/battlenetApi";
import type { BattleNetStatus } from "../types/battlenet.types";

export function BattleNetPage() {
  const [status, setStatus] =
    useState<BattleNetStatus | null>(
      null
    );

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        setStatus(
          await getBattleNetStatus()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Battle.net-Status konnte nicht geladen werden."
        );
      }
    }

    void loadStatus();
  }, []);

  return (
    <>
      <PageHeader
        description="OAuth und Charakterimport werden im nächsten Schritt angebunden."
        eyebrow="INTEGRATION"
        title="Battle.net"
      />

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      {!status ? (
        <LoadingPanel />
      ) : (
        <section className="panel integration-panel">
          <div className="integration-status-row">
            <div>
              <p className="eyebrow">
                API CLIENT
              </p>

              <h2>
                {status.configured
                  ? "Zugangsdaten erkannt"
                  : "Noch nicht konfiguriert"}
              </h2>
            </div>

            <span
              className={
                status.configured
                  ? "integration-badge configured"
                  : "integration-badge pending"
              }
            >
              {status.configured
                ? "Bereit"
                : "Ausstehend"}
            </span>
          </div>

          <dl className="integration-details">
            <div>
              <dt>Region</dt>
              <dd>
                {status.region.toUpperCase()}
              </dd>
            </div>

            <div>
              <dt>Redirect URI</dt>
              <dd>{status.redirectUri}</dd>
            </div>

            <div>
              <dt>
                Konfigurationsdatei
              </dt>
              <dd>backend/.env</dd>
            </div>
          </dl>

          <div className="instruction-box">
            <strong>
              Nächster Schritt
            </strong>

            <p>
              Client-ID und Client-Secret
              lokal in die Backend-.env
              eintragen. Das Secret wird
              niemals an das Frontend
              ausgeliefert.
            </p>
          </div>
        </section>
      )}
    </>
  );
}