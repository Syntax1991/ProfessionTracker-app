import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  GuildMember,
  GuildMemberInput,
  GuildMemberListResponse
} from "../types/roster.types";

export function getGuildRoster():
  Promise<GuildMemberListResponse> {
  return apiRequest<GuildMemberListResponse>(
    "/guild/roster"
  );
}

export function createGuildMember(
  input: GuildMemberInput
): Promise<GuildMember> {
  return apiRequest<GuildMember>(
    "/guild/roster",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function updateGuildMember(
  memberId: string,
  input: GuildMemberInput
): Promise<GuildMember> {
  return apiRequest<GuildMember>(
    `/guild/roster/${memberId}`,
    {
      method: "PUT",
      body: JSON.stringify(input)
    }
  );
}

export function deleteGuildMember(
  memberId: string
): Promise<void> {
  return apiRequest<void>(
    `/guild/roster/${memberId}`,
    {
      method: "DELETE"
    }
  );
}
