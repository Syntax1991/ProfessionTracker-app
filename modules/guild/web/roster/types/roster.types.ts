export type GuildMember = {
  id: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  rank: string;
  rankIndex: number;
  note: string | null;
  officerNote: string | null;
  source: string;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GuildMemberInput = {
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  rank: string;
  rankIndex: number;
  note: string | null;
  officerNote: string | null;
};

export type GuildMemberListResponse = {
  items: GuildMember[];
  total: number;
};
