import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  GuildAuditRefreshResult,
  GuildMemberGearSlotListResponse
} from "../types/audit.types";

export function refreshGuildAudit():
  Promise<GuildAuditRefreshResult> {
  return apiRequest<GuildAuditRefreshResult>(
    "/guild/audit/refresh",
    {
      method: "POST"
    }
  );
}

export function getGuildGearSlots():
  Promise<GuildMemberGearSlotListResponse> {
  return apiRequest<GuildMemberGearSlotListResponse>(
    "/guild/audit/gear-slots"
  );
}
