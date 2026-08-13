import {
  apiRequest
} from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  ProfessionCharacterListResponse
} from "../types/professionModule.types";

export function getProfessionCharacters():
  Promise<ProfessionCharacterListResponse> {
  return apiRequest<ProfessionCharacterListResponse>(
    "/characters"
  );
}
