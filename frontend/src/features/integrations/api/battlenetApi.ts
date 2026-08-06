import { apiRequest } from "../../../shared/api/httpClient";
import type { BattleNetStatus } from "../types/battlenet.types";

export function getBattleNetStatus():
  Promise<BattleNetStatus> {
  return apiRequest<BattleNetStatus>(
    "/integrations/battlenet/status"
  );
}