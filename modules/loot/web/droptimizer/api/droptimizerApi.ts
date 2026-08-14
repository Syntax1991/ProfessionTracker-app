import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type { MyDroptimizerReport } from "../types/droptimizer.types";

export function getMyDroptimizerReport(): Promise<MyDroptimizerReport | null> {
  return apiRequest<MyDroptimizerReport | null>(
    "/loot/droptimizer/me"
  );
}

export function setMyDroptimizerReport(
  reportUrl: string
): Promise<MyDroptimizerReport> {
  return apiRequest<MyDroptimizerReport>(
    "/loot/droptimizer/me",
    {
      method: "PUT",
      body: JSON.stringify({
        reportUrl
      })
    }
  );
}

export function clearMyDroptimizerReport(): Promise<void> {
  return apiRequest<void>(
    "/loot/droptimizer/me",
    {
      method: "DELETE"
    }
  );
}
