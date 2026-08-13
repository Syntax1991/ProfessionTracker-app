export type GuildTeamMemberSummary = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  rank: string;
};

export type GuildTeamMembership = {
  id: string;
  role: string;
  joinedAt: string;
  member: GuildTeamMemberSummary;
};

export type GuildTeam = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  members: GuildTeamMembership[];
};

export type GuildTeamInput = {
  name: string;
  description: string | null;
  color: string | null;
  sortOrder: number;
};

export type GuildTeamMemberInput = {
  memberId: string;
  role: string;
};

export type GuildTeamListResponse = {
  items: GuildTeam[];
  total: number;
};
