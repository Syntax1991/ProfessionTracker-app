import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  AddonImportPreview,
  AddonImportResult
} from "../types/addon.types";

const textRequest = {
  "Content-Type": "text/plain"
};

export function previewAddonSavedVariables(
  source: string
): Promise<AddonImportPreview> {
  return apiRequest<AddonImportPreview>(
    "/integrations/addon/preview",
    {
      method: "POST",
      headers: textRequest,
      body: source
    }
  );
}

export function importAddonSavedVariables(
  source: string
): Promise<AddonImportResult> {
  return apiRequest<AddonImportResult>(
    "/integrations/addon/import",
    {
      method: "POST",
      headers: textRequest,
      body: source
    }
  );
}