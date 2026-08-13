import {
  apiRequest,
  getApiUrl
} from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  BattleNetCharacterPreviewResult,
  BattleNetImportResult,
  BattleNetStatus
} from "../types/battlenet.types";

export function getBattleNetStatus():
  Promise<BattleNetStatus> {
  return apiRequest<BattleNetStatus>(
    "/integrations/battlenet/status"
  );
}

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

export function disconnectBattleNet():
  Promise<void> {
  return apiRequest<void>(
    "/integrations/battlenet/disconnect",
    {
      method: "POST"
    }
  );
}

export function getBattleNetConnectUrl():
  string {
  return getApiUrl(
    "/integrations/battlenet/connect"
  );
}