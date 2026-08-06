import { apiRequest } from "../../../shared/api/httpClient";
import type {
  CharacterSpecializationOverview,
  SpecializationProgressInput
} from "../types/specialization.types";

export function getCharacterSpecializations(
  characterId: string
): Promise<CharacterSpecializationOverview> {
  return apiRequest<CharacterSpecializationOverview>(
    `/characters/${characterId}/specializations`
  );
}

export function updateCharacterProfessionSpecializations(
  characterId: string,
  characterProfessionId: string,
  progress: SpecializationProgressInput[]
): Promise<CharacterSpecializationOverview> {
  return apiRequest<CharacterSpecializationOverview>(
    `/characters/${characterId}/professions/${characterProfessionId}/specializations`,
    {
      method: "PUT",
      body: JSON.stringify({
        progress
      })
    }
  );
}