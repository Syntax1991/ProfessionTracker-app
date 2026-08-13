import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  GuildRosterImportPreview,
  GuildRosterImportResult
} from "../types/rosterImport.types";

const textRequest = {
  "Content-Type": "text/plain"
};

export function previewGuildRosterImport(
  source: string
): Promise<GuildRosterImportPreview> {
  return apiRequest<GuildRosterImportPreview>(
    "/guild/roster-import/preview",
    {
      method: "POST",
      headers: textRequest,
      body: source
    }
  );
}

export function importGuildRoster(
  source: string
): Promise<GuildRosterImportResult> {
  return apiRequest<GuildRosterImportResult>(
    "/guild/roster-import/import",
    {
      method: "POST",
      headers: textRequest,
      body: source
    }
  );
}
