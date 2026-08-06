import type { BattleNetStatus } from "../types/battlenet.types";

type BattleNetStatusCardProps = {
  status: BattleNetStatus;
  connectUrl: string;
  isImporting: boolean;
  isDisconnecting: boolean;
  onImport: () => void;
  onDisconnect: () => void;
};

function formatExpiry(
  expiresAt: string | null
): string {
  if (!expiresAt) {
    return "Nicht verbunden";
  }

  return new Date(
    expiresAt
  ).toLocaleString("de-DE");
}

export function BattleNetStatusCard({
  status,
  connectUrl,
  isImporting,
  isDisconnecting,
  onImport,
  onDisconnect
}: BattleNetStatusCardProps) {
  return (
    <section className="panel integration-panel">
      <div className="integration-status-row">
        <div>
          <p className="eyebrow">
            BATTLE.NET API
          </p>

          <h2>
            {status.connected
              ? "Konto verbunden"
              : status.configured
                ? "Anmeldung erforderlich"
                : "API nicht konfiguriert"}
          </h2>
        </div>

        <span
          className={
            status.connected
              ? "integration-badge configured"
              : "integration-badge pending"
          }
        >
          {status.connected
            ? "Verbunden"
            : "Nicht verbunden"}
        </span>
      </div>

      <dl className="integration-details">
        <div>
          <dt>BattleTag</dt>
          <dd>
            {status.battleTag ??
              "Noch nicht verfügbar"}
          </dd>
        </div>

        <div>
          <dt>Region / Sprache</dt>
          <dd>
            {status.region.toUpperCase()}
            {" · "}
            {status.locale}
          </dd>
        </div>

        <div>
          <dt>Token gültig bis</dt>
          <dd>
            {formatExpiry(
              status.expiresAt
            )}
          </dd>
        </div>

        <div>
          <dt>Importierte Charaktere</dt>
          <dd>
            {
              status.importedCharacterCount
            }
          </dd>
        </div>

        <div>
          <dt>Redirect URI</dt>
          <dd>
            {status.redirectUri}
          </dd>
        </div>
      </dl>

      <div className="integration-actions">
        {!status.connected && (
          <a
            className="button button-primary"
            href={connectUrl}
          >
            Mit Battle.net verbinden
          </a>
        )}

        {status.connected && (
          <>
            <button
              className="button button-primary"
              disabled={isImporting}
              onClick={onImport}
              type="button"
            >
              {isImporting
                ? "Charaktere werden importiert…"
                : "Charaktere synchronisieren"}
            </button>

            <button
              className="button button-secondary"
              disabled={isDisconnecting}
              onClick={onDisconnect}
              type="button"
            >
              {isDisconnecting
                ? "Verbindung wird getrennt…"
                : "Verbindung trennen"}
            </button>
          </>
        )}
      </div>

      {!status.configured && (
        <div className="instruction-box">
          <strong>
            Zugangsdaten fehlen
          </strong>

          <p>
            Trage Client-ID und
            Client-Secret in
            backend/.env ein und
            starte das Backend neu.
          </p>
        </div>
      )}
    </section>
  );
}