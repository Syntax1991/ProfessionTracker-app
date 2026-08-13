import { apiRequest } from "../../../../apps/web/src/shared/api/httpClient";
import type { ProfessionListResponse } from "../types/profession.types";

export function getProfessions():
  Promise<ProfessionListResponse> {
  return apiRequest<ProfessionListResponse>(
    "/professions"
  );
}