import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  RaidEvent,
  RaidEventInput,
  RaidEventListResponse
} from "../types/raidEvent.types";

export function getRaidEvents():
  Promise<RaidEventListResponse> {
  return apiRequest<RaidEventListResponse>(
    "/raid/planner"
  );
}

export function createRaidEvent(
  input: RaidEventInput
): Promise<RaidEvent> {
  return apiRequest<RaidEvent>(
    "/raid/planner",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function updateRaidEvent(
  eventId: string,
  input: RaidEventInput
): Promise<RaidEvent> {
  return apiRequest<RaidEvent>(
    `/raid/planner/${eventId}`,
    {
      method: "PUT",
      body: JSON.stringify(input)
    }
  );
}

export function deleteRaidEvent(
  eventId: string
): Promise<void> {
  return apiRequest<void>(
    `/raid/planner/${eventId}`,
    {
      method: "DELETE"
    }
  );
}
