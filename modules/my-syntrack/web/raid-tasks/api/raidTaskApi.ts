import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  PersonalRaidTaskInput,
  RaidTaskOverview
} from "../types/raidTask.types";

export function getRaidTaskOverview():
  Promise<RaidTaskOverview> {
  return apiRequest<RaidTaskOverview>(
    "/raid-tasks"
  );
}

export function createRaidTask(
  characterId: string,
  input: PersonalRaidTaskInput
): Promise<RaidTaskOverview> {
  return apiRequest<RaidTaskOverview>(
    `/raid-tasks/characters/${characterId}`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function setRaidTaskCompletion(
  taskId: string,
  completed: boolean
): Promise<RaidTaskOverview> {
  return apiRequest<RaidTaskOverview>(
    `/raid-tasks/${taskId}/completion`,
    {
      method: "PATCH",
      body: JSON.stringify({
        completed
      })
    }
  );
}

export function deleteRaidTask(
  taskId: string
): Promise<RaidTaskOverview> {
  return apiRequest<RaidTaskOverview>(
    `/raid-tasks/${taskId}`,
    {
      method: "DELETE"
    }
  );
}
