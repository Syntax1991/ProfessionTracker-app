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
