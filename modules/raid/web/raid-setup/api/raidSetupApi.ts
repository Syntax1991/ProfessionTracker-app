import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type { RaidSetup } from "../types/raidSetup.types";

export function getSetupForEvent(
  eventId: string
): Promise<RaidSetup> {
  return apiRequest<RaidSetup>(
    `/raid/setups/events/${eventId}`
  );
}

export function addSetupMembers(
  setupId: string,
  memberIds: string[]
): Promise<RaidSetup> {
  return apiRequest<RaidSetup>(
    `/raid/setups/${setupId}/members`,
    {
      method: "POST",
      body: JSON.stringify({ memberIds })
    }
  );
}

export function removeSetupMember(
  setupId: string,
  memberId: string
): Promise<RaidSetup> {
  return apiRequest<RaidSetup>(
    `/raid/setups/${setupId}/members/${memberId}`,
    {
      method: "DELETE"
    }
  );
}

export function updateSetupRosterFromTeam(
  setupId: string
): Promise<RaidSetup> {
  return apiRequest<RaidSetup>(
    `/raid/setups/${setupId}/update-roster`,
    {
      method: "POST"
    }
  );
}
