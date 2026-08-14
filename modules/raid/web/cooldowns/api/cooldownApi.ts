import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  RaidBossAbilityCastListResponse,
  RaidBossPhaseMarker,
  RaidBossPhaseMarkerInput,
  RaidBossPhaseMarkerListResponse,
  RaidBossWarcraftLogsSyncResult,
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

export function updateBossFightDuration(
  bossId: string,
  fightDurationSeconds: number | null
): Promise<unknown> {
  return apiRequest(
    `/raid/cooldowns/bosses/${bossId}/duration`,
    {
      method: "PUT",
      body: JSON.stringify({
        fightDurationSeconds
      })
    }
  );
}

export function getPhaseMarkersForBoss(
  bossId: string
): Promise<RaidBossPhaseMarkerListResponse> {
  return apiRequest<RaidBossPhaseMarkerListResponse>(
    `/raid/cooldowns/bosses/${bossId}/phase-markers`
  );
}

export function createPhaseMarker(
  bossId: string,
  input: RaidBossPhaseMarkerInput
): Promise<RaidBossPhaseMarker> {
  return apiRequest<RaidBossPhaseMarker>(
    `/raid/cooldowns/bosses/${bossId}/phase-markers`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function deletePhaseMarker(
  markerId: string
): Promise<void> {
  return apiRequest<void>(
    `/raid/cooldowns/phase-markers/${markerId}`,
    {
      method: "DELETE"
    }
  );
}

export function getAbilityCastsForBoss(
  bossId: string
): Promise<RaidBossAbilityCastListResponse> {
  return apiRequest<RaidBossAbilityCastListResponse>(
    `/raid/cooldowns/bosses/${bossId}/ability-casts`
  );
}

export function syncBossWarcraftLogs(
  bossId: string
): Promise<RaidBossWarcraftLogsSyncResult> {
  return apiRequest<RaidBossWarcraftLogsSyncResult>(
    `/raid/cooldowns/bosses/${bossId}/sync-wcl`,
    {
      method: "POST"
    }
  );
}
