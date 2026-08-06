import { apiRequest } from "../../../shared/api/httpClient";
import type {
  ProfessionDetail,
  ProfessionOverview
} from "../types/professionDetail.types";

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