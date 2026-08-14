import {
  useCallback,
  useState
} from "react";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import {
  getBattleNetCharacters,
  importBattleNetCharacters
} from "../api/battlenetApi";
import { BattleNetCharacterSelector } from "./BattleNetCharacterSelector";
import { BattleNetImportResultCard } from "./BattleNetImportResult";
import type {
  BattleNetCharacterPreviewResult,
  BattleNetImportResult
} from "../types/battlenet.types";

export function BattleNetSyncTab() {
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

  const [
    isLoadingCharacters,
    setIsLoadingCharacters
  ] = useState(false);

  const [isImporting, setIsImporting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

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

      await loadCharacters();
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

  return (
    <>
      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      {!characterPreview && (
        <section className="panel integration-panel">
          <div className="integration-actions">
            <button
              className="button button-primary"
              disabled={
                isLoadingCharacters
              }
              onClick={() => {
                void loadCharacters();
              }}
              type="button"
            >
              {isLoadingCharacters
                ? "Loading characters…"
                : "Load my characters"}
            </button>
          </div>
        </section>
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
