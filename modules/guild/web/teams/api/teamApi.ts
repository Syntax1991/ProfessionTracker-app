import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  GuildTeam,
  GuildTeamInput,
  GuildTeamListResponse,
  GuildTeamMemberInput
} from "../types/team.types";

export function getGuildTeams():
  Promise<GuildTeamListResponse> {
  return apiRequest<GuildTeamListResponse>(
    "/guild/teams"
  );
}

export function createGuildTeam(
  input: GuildTeamInput
): Promise<GuildTeam> {
  return apiRequest<GuildTeam>(
    "/guild/teams",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function updateGuildTeam(
  teamId: string,
  input: GuildTeamInput
): Promise<GuildTeam> {
  return apiRequest<GuildTeam>(
    `/guild/teams/${teamId}`,
    {
      method: "PUT",
      body: JSON.stringify(input)
    }
  );
}

export function deleteGuildTeam(
  teamId: string
): Promise<void> {
  return apiRequest<void>(
    `/guild/teams/${teamId}`,
    {
      method: "DELETE"
    }
  );
}

export function addGuildTeamMember(
  teamId: string,
  input: GuildTeamMemberInput
): Promise<GuildTeam> {
  return apiRequest<GuildTeam>(
    `/guild/teams/${teamId}/members`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function removeGuildTeamMember(
  teamId: string,
  memberId: string
): Promise<GuildTeam> {
  return apiRequest<GuildTeam>(
    `/guild/teams/${teamId}/members/${memberId}`,
    {
      method: "DELETE"
    }
  );
}
