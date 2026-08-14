import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  RaidAttendanceRecordListResponse,
  RaidAttendanceStatus,
  RaidAttendanceSummaryResponse
} from "../types/attendance.types";

export function getAttendanceSummary():
  Promise<RaidAttendanceSummaryResponse> {
  return apiRequest<RaidAttendanceSummaryResponse>(
    "/raid/attendance/summary"
  );
}

export function getEventAttendance(
  eventId: string
): Promise<RaidAttendanceRecordListResponse> {
  return apiRequest<RaidAttendanceRecordListResponse>(
    `/raid/attendance/events/${eventId}`
  );
}

export function setAttendanceRecord(
  eventId: string,
  memberId: string,
  status: RaidAttendanceStatus
): Promise<RaidAttendanceRecordListResponse> {
  return apiRequest<RaidAttendanceRecordListResponse>(
    `/raid/attendance/events/${eventId}/members/${memberId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        status
      })
    }
  );
}

export function clearAttendanceRecord(
  eventId: string,
  memberId: string
): Promise<RaidAttendanceRecordListResponse> {
  return apiRequest<RaidAttendanceRecordListResponse>(
    `/raid/attendance/events/${eventId}/members/${memberId}`,
    {
      method: "DELETE"
    }
  );
}
