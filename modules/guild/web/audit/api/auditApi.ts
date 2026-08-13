import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type { GuildAuditRefreshResult } from "../types/audit.types";

export function refreshGuildAudit():
  Promise<GuildAuditRefreshResult> {
  return apiRequest<GuildAuditRefreshResult>(
    "/guild/audit/refresh",
    {
      method: "POST"
    }
  );
}
