import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  GuildAttendanceEvent,
  GuildAttendanceEventInput,
  GuildAttendanceEventListResponse,
  GuildAttendanceStatus
} from "../types/attendance.types";

export function getGuildAttendanceEvents():
  Promise<GuildAttendanceEventListResponse> {
  return apiRequest<GuildAttendanceEventListResponse>(
    "/guild/attendance/events"
  );
}

export function createGuildAttendanceEvent(
  input: GuildAttendanceEventInput
): Promise<GuildAttendanceEvent> {
  return apiRequest<GuildAttendanceEvent>(
    "/guild/attendance/events",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function updateGuildAttendanceEvent(
  eventId: string,
  input: GuildAttendanceEventInput
): Promise<GuildAttendanceEvent> {
  return apiRequest<GuildAttendanceEvent>(
    `/guild/attendance/events/${eventId}`,
    {
      method: "PUT",
      body: JSON.stringify(input)
    }
  );
}

export function deleteGuildAttendanceEvent(
  eventId: string
): Promise<void> {
  return apiRequest<void>(
    `/guild/attendance/events/${eventId}`,
    {
      method: "DELETE"
    }
  );
}

export function setGuildAttendanceRecord(
  eventId: string,
  memberId: string,
  status: GuildAttendanceStatus
): Promise<GuildAttendanceEvent> {
  return apiRequest<GuildAttendanceEvent>(
    `/guild/attendance/events/${eventId}/records/${memberId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        status
      })
    }
  );
}

export function clearGuildAttendanceRecord(
  eventId: string,
  memberId: string
): Promise<GuildAttendanceEvent> {
  return apiRequest<GuildAttendanceEvent>(
    `/guild/attendance/events/${eventId}/records/${memberId}`,
    {
      method: "DELETE"
    }
  );
}
