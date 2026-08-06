import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  useSearchParams
} from "react-router-dom";
import { LoadingPanel } from "../../../shared/components/LoadingPanel";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusMessage } from "../../../shared/components/StatusMessage";
import {
  disconnectBattleNet,
  getBattleNetConnectUrl,
  getBattleNetStatus,
  importBattleNetCharacters
} from "../api/battlenetApi";
import { BattleNetImportResultCard } from "../components/BattleNetImportResult";
import { BattleNetStatusCard } from "../components/BattleNetStatusCard";
import type {
  BattleNetImportResult,
  BattleNetStatus
} from "../types/battlenet.types";

export function BattleNetPage() {
  const [searchParams] =
    useSearchParams();

  const [status, setStatus] =
    useState<BattleNetStatus | null>(
      null
    );

  const [importResult, setImportResult] =
    useState<BattleNetImportResult | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [isImporting, setIsImporting] =
    useState(false);

  const [
    isDisconnecting,
    setIsDisconnecting
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadStatus = useCallback(
    async () => {
      setError(null);

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
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const handleImport = async () => {
    setError(null);
    setImportResult(null);
    setIsImporting(true);

    try {
      const result =
        await importBattleNetCharacters();

      setImportResult(result);
      await loadStatus();
    }
    catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "Charakterimport fehlgeschlagen."
      );
    }
    finally {
      setIsImporting(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmed = window.confirm(
      "Battle.net-Verbindung wirklich trennen?"
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDisconnecting(true);

    try {
      await disconnectBattleNet();
      setImportResult(null);
      await loadStatus();
    }
    catch (disconnectError) {
      setError(
        disconnectError instanceof Error
          ? disconnectError.message
          : "Verbindung konnte nicht getrennt werden."
      );
    }
    finally {
      setIsDisconnecting(false);
    }
  };

  const callbackError =
    searchParams.get("error");

  const wasConnected =
    searchParams.get("connected") ===
    "1";

  return (
    <>
      <PageHeader
        description="Verbinde dein Battle.net-Konto und synchronisiere deine World-of-Warcraft-Charaktere."
        eyebrow="INTEGRATION"
        title="Battle.net"
      />

      {callbackError && (
        <StatusMessage type="error">
          {callbackError}
        </StatusMessage>
      )}

      {wasConnected && !callbackError && (
        <StatusMessage type="info">
          Battle.net wurde erfolgreich verbunden. Du kannst deine Charaktere jetzt synchronisieren.
        </StatusMessage>
      )}

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      {isLoading || !status ? (
        <LoadingPanel />
      ) : (
        <BattleNetStatusCard
          connectUrl={
            getBattleNetConnectUrl()
          }
          isDisconnecting={
            isDisconnecting
          }
          isImporting={isImporting}
          onDisconnect={() => {
            void handleDisconnect();
          }}
          onImport={() => {
            void handleImport();
          }}
          status={status}
        />
      )}

      {importResult && (
        <BattleNetImportResultCard
          result={importResult}
        />
      )}
    </>
  );
}