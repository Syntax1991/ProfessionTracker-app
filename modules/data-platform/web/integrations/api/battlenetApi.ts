import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  BattleNetCharacterPreviewResult,
  BattleNetImportResult
} from "../types/battlenet.types";

export function getBattleNetCharacters():
  Promise<BattleNetCharacterPreviewResult> {
  return apiRequest<BattleNetCharacterPreviewResult>(
    "/integrations/battlenet/characters"
  );
}

export function importBattleNetCharacters(
  characterKeys: string[]
): Promise<BattleNetImportResult> {
  return apiRequest<BattleNetImportResult>(
    "/integrations/battlenet/import",
    {
      method: "POST",
      body: JSON.stringify({
        characterKeys
      })
    }
  );
}
