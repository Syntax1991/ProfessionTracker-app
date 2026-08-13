import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  GearReadinessOverview,
  GearSlotInput,
  GearSlotKey
} from "../types/gearReadiness.types";

export function getGearReadinessOverview():
  Promise<GearReadinessOverview> {
  return apiRequest<GearReadinessOverview>(
    "/gear-readiness"
  );
}

export function updateGearSlot(
  characterId: string,
  slotKey: GearSlotKey,
  input: GearSlotInput
): Promise<GearReadinessOverview> {
  return apiRequest<GearReadinessOverview>(
    `/gear-readiness/${characterId}/slots/${slotKey}`,
    {
      method: "PUT",
      body: JSON.stringify(input)
    }
  );
}

export function clearGearSlot(
  characterId: string,
  slotKey: GearSlotKey
): Promise<GearReadinessOverview> {
  return apiRequest<GearReadinessOverview>(
    `/gear-readiness/${characterId}/slots/${slotKey}`,
    {
      method: "DELETE"
    }
  );
}
