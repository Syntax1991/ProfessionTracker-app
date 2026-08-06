import {
  apiRequest,
  getApiUrl
} from "../../../shared/api/httpClient";
import type {
  BattleNetImportResult,
  BattleNetStatus
} from "../types/battlenet.types";

export function getBattleNetStatus():
  Promise<BattleNetStatus> {
  return apiRequest<BattleNetStatus>(
    "/integrations/battlenet/status"
  );
}

export function importBattleNetCharacters():
  Promise<BattleNetImportResult> {
  return apiRequest<BattleNetImportResult>(
    "/integrations/battlenet/import",
    {
      method: "POST"
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