import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type { WeeklyChecklistResponse } from "../types/weeklyChecklist.types";

export function getWeeklyChecklist():
  Promise<WeeklyChecklistResponse> {
  return apiRequest<WeeklyChecklistResponse>(
    "/weekly-checklist"
  );
}

export function updateWeeklyTask(
  characterId: string,
  taskKey: string,
  completed: boolean
): Promise<WeeklyChecklistResponse> {
  return apiRequest<WeeklyChecklistResponse>(
    `/weekly-checklist/${characterId}/tasks/${taskKey}`,
    {
      method: "PUT",
      body: JSON.stringify({
        completed
      })
    }
  );
}

export function updateAllWeeklyTasks(
  characterId: string,
  completed: boolean
): Promise<WeeklyChecklistResponse> {
  return apiRequest<WeeklyChecklistResponse>(
    `/weekly-checklist/${characterId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        completed
      })
    }
  );
}
