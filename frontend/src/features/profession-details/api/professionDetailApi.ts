import {
  apiRequest
} from "../../../shared/api/httpClient";
import type {
  ProfessionDetail,
  ProfessionOverview
} from "../types/professionDetail.types";
import type {
  ProfessionRecipeCatalog
} from "../types/professionRecipe.types";

export function getProfessionOverview():
  Promise<ProfessionOverview> {
  return apiRequest<ProfessionOverview>(
    "/profession-details"
  );
}

export function getProfessionDetail(
  professionId: string
): Promise<ProfessionDetail> {
  return apiRequest<ProfessionDetail>(
    `/profession-details/${professionId}`
  );
}

export function getProfessionRecipes(
  professionId: string
): Promise<ProfessionRecipeCatalog> {
  return apiRequest<ProfessionRecipeCatalog>(
    `/profession-details/${professionId}/recipes`
  );
}