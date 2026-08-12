import type { BattleNetStatus } from "../types/battlenet.types";

type BattleNetStatusCardProps = {
  status: BattleNetStatus;
  connectUrl: string;
  isLoadingCharacters: boolean;
  isDisconnecting: boolean;
  onLoadCharacters: () => void;
  onDisconnect: () => void;
};

function formatExpiry(
  expiresAt: string | null
): string {
  if (!expiresAt) {
    return "Not connected";
  }

  return new Date(
    expiresAt
  ).toLocaleString("en-GB");
}

export function BattleNetStatusCard({
  status,
  connectUrl,
  isLoadingCharacters,
  isDisconnecting,
  onLoadCharacters,
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
              ? "Account connected"
              : status.configured
                ? "Sign-in required"
                : "API not configured"}
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
            : "Not connected"}
        </span>
      </div>

      <dl className="integration-details">
        <div>
          <dt>BattleTag</dt>
          <dd>
            {status.battleTag ??
              "Not available yet"}
          </dd>
        </div>

        <div>
          <dt>Region / Language</dt>
          <dd>
            {status.region.toUpperCase()}
            {" · "}
            {status.locale}
          </dd>
        </div>

        <div>
          <dt>Token expires</dt>
          <dd>
            {formatExpiry(
              status.expiresAt
            )}
          </dd>
        </div>

        <div>
          <dt>Imported characters</dt>
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
            Connect with Battle.net
          </a>
        )}

        {status.connected && (
          <>
            <button
              className="button button-primary"
              disabled={
                isLoadingCharacters
              }
              onClick={
                onLoadCharacters
              }
              type="button"
            >
              {isLoadingCharacters
                ? "Loading characters…"
                : "Select characters"}
            </button>

            <button
              className="button button-secondary"
              disabled={
                isDisconnecting
              }
              onClick={
                onDisconnect
              }
              type="button"
            >
              {isDisconnecting
                ? "Disconnecting…"
                : "Disconnect"}
            </button>
          </>
        )}
      </div>

      {!status.configured && (
        <div className="instruction-box">
          <strong>
            Credentials missing
          </strong>

          <p>
            Add the Client ID and
            Client Secret to
            backend/.env and
            restart the backend.
          </p>
        </div>
      )}
    </section>
  );
}