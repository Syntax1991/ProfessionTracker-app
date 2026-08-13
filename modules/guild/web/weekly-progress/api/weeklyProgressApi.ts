import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type { GuildWeeklyProgressSummary } from "../types/weeklyProgress.types";

export function getGuildWeeklyProgress():
  Promise<GuildWeeklyProgressSummary> {
  return apiRequest<GuildWeeklyProgressSummary>(
    "/guild/weekly-progress"
  );
}
