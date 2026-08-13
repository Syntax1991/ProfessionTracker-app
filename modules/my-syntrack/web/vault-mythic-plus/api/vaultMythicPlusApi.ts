import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  MythicPlusRunInput,
  VaultMythicPlusResponse
} from "../types/vaultMythicPlus.types";

export function getVaultMythicPlusOverview():
  Promise<VaultMythicPlusResponse> {
  return apiRequest<VaultMythicPlusResponse>(
    "/vault-mythic-plus"
  );
}

export function addMythicPlusRun(
  characterId: string,
  input: MythicPlusRunInput
): Promise<VaultMythicPlusResponse> {
  return apiRequest<VaultMythicPlusResponse>(
    `/vault-mythic-plus/${characterId}/runs`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function deleteMythicPlusRun(
  runId: string
): Promise<VaultMythicPlusResponse> {
  return apiRequest<VaultMythicPlusResponse>(
    `/vault-mythic-plus/runs/${runId}`,
    {
      method: "DELETE"
    }
  );
}
