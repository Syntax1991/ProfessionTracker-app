import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type { DashboardSummary } from "../types/dashboard.types";

export function getDashboardSummary():
  Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>(
    "/dashboard"
  );
}