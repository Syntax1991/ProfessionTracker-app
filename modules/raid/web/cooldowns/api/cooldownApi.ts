import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  RaidCooldownAssignment,
  RaidCooldownAssignmentInput,
  RaidCooldownAssignmentListResponse
} from "../types/cooldown.types";

export function getCooldownAssignmentsForEvent(
  eventId: string
): Promise<RaidCooldownAssignmentListResponse> {
  return apiRequest<RaidCooldownAssignmentListResponse>(
    `/raid/cooldowns/events/${eventId}`
  );
}

export function createCooldownAssignment(
  bossId: string,
  input: RaidCooldownAssignmentInput
): Promise<RaidCooldownAssignment> {
  return apiRequest<RaidCooldownAssignment>(
    `/raid/cooldowns/bosses/${bossId}`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function updateCooldownAssignment(
  assignmentId: string,
  input: RaidCooldownAssignmentInput
): Promise<RaidCooldownAssignment> {
  return apiRequest<RaidCooldownAssignment>(
    `/raid/cooldowns/${assignmentId}`,
    {
      method: "PUT",
      body: JSON.stringify(input)
    }
  );
}

export function deleteCooldownAssignment(
  assignmentId: string
): Promise<void> {
  return apiRequest<void>(
    `/raid/cooldowns/${assignmentId}`,
    {
      method: "DELETE"
    }
  );
}
