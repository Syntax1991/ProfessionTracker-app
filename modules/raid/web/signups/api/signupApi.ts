import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  RaidSignupEntry,
  RaidSignupListResponse,
  RaidSignupStatus
} from "../types/signup.types";

export function getSignupsForEvent(
  eventId: string
): Promise<RaidSignupListResponse> {
  return apiRequest<RaidSignupListResponse>(
    `/raid/signups/events/${eventId}`
  );
}

export function setSignup(
  eventId: string,
  memberId: string,
  status: RaidSignupStatus
): Promise<RaidSignupEntry> {
  return apiRequest<RaidSignupEntry>(
    `/raid/signups/events/${eventId}/members/${memberId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        status
      })
    }
  );
}

export function setOwnSignup(
  eventId: string,
  status: RaidSignupStatus
): Promise<RaidSignupEntry> {
  return apiRequest<RaidSignupEntry>(
    `/raid/signups/events/${eventId}/me`,
    {
      method: "PUT",
      body: JSON.stringify({
        status
      })
    }
  );
}

export function clearSignup(
  eventId: string,
  memberId: string
): Promise<void> {
  return apiRequest<void>(
    `/raid/signups/events/${eventId}/members/${memberId}`,
    {
      method: "DELETE"
    }
  );
}
