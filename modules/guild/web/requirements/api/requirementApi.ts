import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  GuildRequirement,
  GuildRequirementInput,
  GuildRequirementListResponse
} from "../types/requirement.types";

export function getGuildRequirements():
  Promise<GuildRequirementListResponse> {
  return apiRequest<GuildRequirementListResponse>(
    "/guild/requirements"
  );
}

export function createGuildRequirement(
  input: GuildRequirementInput
): Promise<GuildRequirement> {
  return apiRequest<GuildRequirement>(
    "/guild/requirements",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function updateGuildRequirement(
  requirementId: string,
  input: GuildRequirementInput
): Promise<GuildRequirement> {
  return apiRequest<GuildRequirement>(
    `/guild/requirements/${requirementId}`,
    {
      method: "PUT",
      body: JSON.stringify(input)
    }
  );
}

export function deleteGuildRequirement(
  requirementId: string
): Promise<void> {
  return apiRequest<void>(
    `/guild/requirements/${requirementId}`,
    {
      method: "DELETE"
    }
  );
}
