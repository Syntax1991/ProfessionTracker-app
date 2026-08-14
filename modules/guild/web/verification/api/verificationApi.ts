import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  GuildVerificationCandidate,
  GuildVerificationStatus
} from "../types/verification.types";

export function getGuildVerificationStatus():
  Promise<GuildVerificationStatus> {
  return apiRequest<GuildVerificationStatus>(
    "/guild/verification/status"
  );
}

export function getGuildVerificationCandidates():
  Promise<{
    items: GuildVerificationCandidate[];
  }> {
  return apiRequest<{
    items: GuildVerificationCandidate[];
  }>(
    "/guild/verification/candidates"
  );
}

export function verifyGuild(input: {
  characterName: string;
  characterRealmSlug: string;
}): Promise<GuildVerificationStatus> {
  return apiRequest<GuildVerificationStatus>(
    "/guild/verification/verify",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function lookupGuild(input: {
  realmName: string;
  guildName: string;
}): Promise<GuildVerificationCandidate> {
  return apiRequest<GuildVerificationCandidate>(
    "/guild/verification/lookup",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

