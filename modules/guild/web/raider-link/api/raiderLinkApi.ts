import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type { GuildMember } from "../../roster/types/roster.types";
import type { RaiderLinkResolution } from "../types/raiderLink.types";

export function resolveRaiderLink():
  Promise<RaiderLinkResolution> {
  return apiRequest<RaiderLinkResolution>(
    "/guild/raider-link/resolve",
    {
      method: "POST"
    }
  );
}

export function claimRaiderLink(
  memberId: string
): Promise<GuildMember> {
  return apiRequest<GuildMember>(
    "/guild/raider-link/claim",
    {
      method: "POST",
      body: JSON.stringify({
        memberId
      })
    }
  );
}

export function getLinkedRaiderMember():
  Promise<{
    member: GuildMember | null;
  }> {
  return apiRequest(
    "/guild/raider-link/me"
  );
}
