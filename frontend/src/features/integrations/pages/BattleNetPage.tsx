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
  getBattleNetCharacters,
  getBattleNetConnectUrl,
  getBattleNetStatus,
  importBattleNetCharacters
} from "../api/battlenetApi";
import { BattleNetCharacterSelector } from "../components/BattleNetCharacterSelector";
import { BattleNetImportResultCard } from "../components/BattleNetImportResult";
import { BattleNetStatusCard } from "../components/BattleNetStatusCard";
import type {
  BattleNetCharacterPreviewResult,
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

  const [
    characterPreview,
    setCharacterPreview
  ] =
    useState<BattleNetCharacterPreviewResult | null>(
      null
    );

  const [importResult, setImportResult] =
    useState<BattleNetImportResult | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isLoadingCharacters,
    setIsLoadingCharacters
  ] = useState(false);

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
            : "Battle.net status could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadCharacters =
    useCallback(async () => {
      setError(null);
      setIsLoadingCharacters(true);

      try {
        setCharacterPreview(
          await getBattleNetCharacters()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Battle.net characters could not be loaded."
        );
      }
      finally {
        setIsLoadingCharacters(false);
      }
    }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const handleImport = async (
    characterKeys: string[]
  ) => {
    setError(null);
    setImportResult(null);
    setIsImporting(true);

    try {
      const result =
        await importBattleNetCharacters(
          characterKeys
        );

      setImportResult(result);

      await Promise.all([
        loadStatus(),
        loadCharacters()
      ]);
    }
    catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "Character import failed."
      );
    }
    finally {
      setIsImporting(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmed = window.confirm(
      "Disconnect Battle.net?"
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDisconnecting(true);

    try {
      await disconnectBattleNet();

      setCharacterPreview(null);
      setImportResult(null);

      await loadStatus();
    }
    catch (disconnectError) {
      setError(
        disconnectError instanceof Error
          ? disconnectError.message
          : "The connection could not be disconnected."
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
        description="Load your Battle.net characters, filter them and sync only the crafters you need."
        eyebrow="INTEGRATION"
        title="Battle.net"
      />

      {callbackError && (
        <StatusMessage type="error">
          {callbackError}
        </StatusMessage>
      )}

      {wasConnected &&
        !callbackError && (
        <StatusMessage type="info">
          Battle.net was connected successfully. Load your character list and select the crafters you need.
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
          isLoadingCharacters={
            isLoadingCharacters
          }
          onDisconnect={() => {
            void handleDisconnect();
          }}
          onLoadCharacters={() => {
            void loadCharacters();
          }}
          status={status}
        />
      )}

      {characterPreview && (
        <BattleNetCharacterSelector
          characters={
            characterPreview.items
          }
          defaultMinimumLevel={
            characterPreview
              .defaultMinimumLevel
          }
          isImporting={
            isImporting
          }
          onImport={
            handleImport
          }
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